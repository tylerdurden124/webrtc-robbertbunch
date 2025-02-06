//all our express stuff happens (routes)
const app = require("./server").app;
const jwt = require('jsonwebtoken');
const linkSecret = 'dfvcv4asodihs97s9fsd';

app.get('/', (req, res)=> {
  res.json('this is the default route');
})

app.get('/test', (req, res)=>{
  res.json('this is a test route');
});

//this route is for us to test..
//we will just add a link which takes us to react site (already with the right info for CLIENT1 to make an offer)
//in production -> a receptionist / calender/scheduling app would send this out
app.get('/user-link', (req, res)=>{

  //data for the end-user's appointment
  const appData = {
    professionalsFullName: 'Robert Bunch, M.D', //name of person user wants to speak to
    apptDate: Date.now()
  };

  //TODO: encode data in token
  const token = jwt.sign(appData, linkSecret);

  //sent to wherever react is running..
  res.send('https://localhost:3000/join-video?token='+token);
});

app.get('/validate-link', (req, res)=>{
  const token = req.query.token;
  const decodedData = jwt.verify(token, linkSecret);
  res.json(decodedData);
});