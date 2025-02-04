const userName = "Rob-"+Math.floor(Math.random()* 100000);
const password = "x";
document.querySelector('#user-name').innerHTML = userName;

const socket = io.connect('https://localhost:8181/', {
  auth: {
    userName,
    password
  }
});

const localVideoEl = document.querySelector('#local-video');
const remoteVideoEl = document.querySelector('#remote-video');

let localStream;  //local video stream
let remoteStream; //remote video stream
let peerConnection; //the peer connection that the 2 clients use to talk
let didIOffer = false;

let peerConfiguration = {
  iceServers:[
    {
      urls:[
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302'
      ]
    }
  ]
}

//when a client initiates a call
const call = async e => {
  //12.
  await fetchUserMedia();

  //13. peer connection is set with our STUN servers sent over
  await createPeerConnection();

  //create offer time `createOffer()`
  try{
    console.log('creating an offer');
    const offer = await peerConnection.createOffer();
    console.log(offer);   //sdp
    peerConnection.setLocalDescription(offer);

    didIOffer = true; 

    socket.emit('newOffer', offer); //send offer to signallingServer

  }catch(err){
    console.log(err)
  }
}

const answerOffer = async (offerObj) => {
  //12.
  await fetchUserMedia();
  //peer connection is set with our STUN servers sent over

  //13 + 14
  //pass `offerObj` to createPeerConnection(offerObj)
  await createPeerConnection(offerObj);

  //15.
  const answer = await peerConnection.createAnswer({});

  //16.
  await peerConnection.setLocalDescription(answer); //this is CLIENT2, and CLIENT2 uses the answer as the localDescription

  console.log(offerObj);
  console.log(answer);  //returns type 'answer' (RTCSessionDescription)
  console.log(peerConnection.signalingState); //should be have-local-pranswer because CLIENT2 has set its local desc to it's answer (but it won't be)
  
  //19.
  //add answer to offerObj so the server knows which offer this is related to
  offerObj.answer = answer;
  //emit the answer to the signaling server, so it can emit to CLIENT1
  //expect a response from the server with the already existing ICE candidates
  const offererIceCandidates = await socket.emitWithAck('newAnswer',offerObj);
  offererIceCandidates.forEach(candidate => {
    peerConnection.addIceCandidate(candidate);
    console.log('===== added ice candidate ====')
  })
}

const addAnswer = async(offerObj)=>{
    //addAnswer is called in socketListeners when an answerResponse is emitted.
    //at this point, the offer and answer have been exchanged!
    //now CLIENT1 needs to set the remote
    await peerConnection.setRemoteDescription(offerObj.answer)
    // console.log(peerConnection.signalingState)
}

const fetchUserMedia = () => {
  return new Promise(async (resolve, reject) => {
    try{
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        // audio: true
      });
      localVideoEl.srcObject = stream;
      localStream = stream;
      resolve();
    }
    catch(err){
      console.log(err);
      reject();
    }
  });
}

const createPeerConnection = (offerObj) => {
  return new Promise(async (resolve, reject) => {
    //RTCPeerConnection is the thing that creates the connection
    //we can pass a config object, and that config object can contain stun servers
    //which will fetch us ICE candidates
    peerConnection = new RTCPeerConnection(peerConfiguration);

    //14. add tracks from localStream 
    localStream.getTracks().forEach(track=>{
      peerConnection.addTrack(track, localStream);
    })

    addEventListener('signalingstatechange', (event)=> {
      console.log(event);
      console.log(peerConnection.signalingState);
    });

    // 18. Handle ICE candidates
    peerConnection.addEventListener('icecandidate', e => {
      console.log('ICE candidate found...');
      console.log(e); //ip addresses (ice candidates)

      if(e.candidate){
        socket.emit('sendIceCandidateToSignalingServer', {
          iceCandidate: e.candidate,
          iceUserName: userName,
          didIOffer,
        });
      }
    });

    //17.
    if(offerObj){
      //this wont be set when createPeerConnection() called from 'call()',
      //it will be set when createPeerConnection(offerObj) called from `answerOffer()`
      console.log(peerConnection.signalingState); //should be stable because no setDesc has been run yet
      await peerConnection.setRemoteDescription(offerObj.offer);
      console.log(peerConnection.signalingState); //should be have-remote-offer, because client2 has setRemoteDesc on the offer    
    }
    
    resolve();
 
  })

}

document.querySelector('#call').addEventListener('click', call);