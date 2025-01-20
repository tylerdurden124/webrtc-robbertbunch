let stream = null;

const constraints = {
  audio: true, //audio feedback (reverb) use HEADPHONES
  video: true
}

const getMicAndCamera = async (e) => {
  try{
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
  }
  catch(error){
    console.log('user denied access to contraints:', error);
  }
}

document.querySelector('#share').addEventListener('click', e => getMicAndCamera(e))