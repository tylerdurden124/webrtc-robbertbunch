const userName = "Rob-"+Math.floor(Math.random()* 100000);
const password = "x";
document.querySelector('#user-name').innerHTML = userName;

const socket = io.connect('https://localhost:8181/');

const localVideoEl = document.querySelector('#local-video');
const remoteVideoEl = document.querySelector('#remote-video');

let localStream;  //local video stream
let remoteStream; //remote video stream
let peerConnection; //the peer connection that the 2 clients use to talk

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

const createPeerConnection = async ()=>{
  try{
    //RTCPeerConnection is the thing that creates the connection
    //we can pass a config object, and that config object can contain stun servers
    //which will fetch us ICE candidates
    peerConnection = new RTCPeerConnection(peerConfiguration);

    //add tracks from localStream 
    localStream.getTracks().forEach(track=>{
      peerConnection.addTrack(track, localStream);
    })

    // Handle ICE candidates
    peerConnection.addEventListener('icecandidate', e => {
      console.log('ICE candidate found...');
      console.log(e); //ip addresses (ice candidates)
    });

    return peerConnection;
  }
  catch(err){
    console.error('Error creating peer connection:', error);
    throw error; // This will cause the promise to reject
  }

}

//when a client initiates a call
const call = async e => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video:true,
    // audio: true
  });
  localVideoEl.srcObject = stream;
  localStream = stream;

  //peer connection is set with our STUN servers sent over
  await createPeerConnection();

  //create offer time `createOffer()`
  try{
    console.log('creating an offer');
    const offer = await peerConnection.createOffer();
    console.log(offer);   //sdp
    peerConnection.setLocalDescription(offer);

    socket.emit('newOffer', offer); //send offer to signallingServer
  }catch(err){
    console.log(err)
  }
}

document.querySelector('#call').addEventListener('click', call)