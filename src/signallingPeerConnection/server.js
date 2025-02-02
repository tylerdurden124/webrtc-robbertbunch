// server.js
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const socketio = require('socket.io');
app.use(express.static(__dirname));

//we need a key and cert to run https
//we generated them with `mkcert create-ca`
//we generated them with `mkcert create-cert`
const key = fs.readFileSync('cert.key');
const cert = fs.readFileSync('cert.crt');

//changed setup so we can use https
//passed the key and cert to createServer on https
const expressServer = https.createServer({key, cert}, app);

//create our socket server. it will listen to our express port 8181
const io = socketio(expressServer);

expressServer.listen(8181);

//offers will contain objects 
//{
  //offererUserName
  //offer
  //offererIceCandidates

  //answererUserName
  //answer
  //answererIceCandidates
//}

const offers = [
];

const connectedSockets = [
  //{username, socketId}
];


io.on('connection', (socket)=>{
  console.log('someone has connected');

  const userName = socket.handshake.auth.userName;
  const password = socket.handshake.auth.password;

  if(password !== 'x'){
    socket.disconnect(true);
    return;
  }

  connectedSockets.push({
    socketId: socket.id,
    userName
  });

  //a new client has joined. If there are any offers available, emit them out
  if(offers.length){
    socket.emit('availableOffers', offers);
  }

  socket.on('newOffer', newOffer=> {
    offers.push({
      offererUserName: userName, 
      offer: newOffer, 
      offererIceCandidates:[],
      answererUserName:null,
      answer:null,
      answererIceCandidates:[]
    });
    console.log(newOffer.sdp);  

    //send out to all connected sockets EXCEPT the caller
    socket.broadcast.emit('newOfferAwaiting', offers.slice(-1));
  });

  socket.on('newAnswer', offerObj=> {
    console.log(offerObj);
    //emit this answer (offerObj)
    //NOTE: the answer is what the other side needs...

    //find the socket by userName -> to get socketId
    const socketToAnswer = connectedSockets.find(s => s.userName === offerObj.offererUserName);

    if(!socketToAnswer){
      return;
    }

    //we found the matching socket, get socketId -> so we can emit to it!
    const socketIdToAnswer = socketToAnswer.socketId;
  });

  socket.on('sendIceCandidateToSignalingServer', iceCandidateObject => {
    const {didIOffer, iceUserName, iceCandidate} = iceCandidateObject;
    console.log(`iceCandidate: `, iceCandidate);
    if(didIOffer){
      const offerInOffers = offers.find(offer=> offer.offererUserName === iceUserName)
      if(offerInOffers){
        offerInOffers.offererIceCandidates.push(iceCandidate)
        //come back to this...
        //if the answerer is already here (connected), emit the iceCandidate to that user
      }
    }

    console.log(offers);
  });

});