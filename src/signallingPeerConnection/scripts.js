const localVideoEl = document.querySelector('#local-video');
const remoteVideoEl = document.querySelector('#remote-video');

let localStream;  //local video stream
let remoteStream; //remote video stream
let peerConnection; //the peer connection that the 2 clients use to talk

//when a client initiates a call
const call = async e => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video:true,
    // audio: true
  });
  localVideoEl.srcObject = stream;
}


document.querySelector('#call').addEventListener('click', call)