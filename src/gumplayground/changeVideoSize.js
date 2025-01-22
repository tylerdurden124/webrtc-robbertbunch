const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
console.log("supportedConstraints: ", supportedConstraints);

const changeVideoSize = () => {
  if(!stream){
    alert('stream still loading');
    return;
  }

  stream.getVideoTracks().forEach(track => {
    //here track is a video track
    //we can get its capabilities from .getCapabilities()
    //or we can apply new constraints with applyConstraints()
    const capabilities = track.getCapabilities();
    console.log('capabilities: ', capabilities);

    const height = document.querySelector('#vid-height').value;
    const width = document.querySelector('#vid-width').value;
    
    const vConstraints = {
      height: {exact: height < capabilities.height.max ? height: capabilities.height.max}, 
      width: {exact: width < capabilities.width.max ? width: capabilities.width.max}, 
      // frameRate: 5,
      // aspectRatio: 10 
    }

    track.applyConstraints(vConstraints);
  })

  // stream.getTracks().forEach(track=>{
  //   const capabilities = track.getCapabilities()
  //   console.log(capabilities);
  // })  
}