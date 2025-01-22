const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
console.log("supportedConstraints: ", supportedConstraints);

const changeVideoSize = () => {
  if(!stream){
    alert('stream still loading');
    return;
  }

  stream.getTracks().forEach(track=>{
    const capabilities = track.getCapabilities()
    console.log(capabilities);
  })  
}