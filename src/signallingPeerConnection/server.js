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

  socket.on('newAnswer', (offerObj, ackFunction) => {
    console.log(offerObj);
    //emit this answer (offerObj)
    //NOTE: the answer is what the other side needs...

    //find the socket by userName -> to get socketId
    const socketToAnswer = connectedSockets.find(s => s.userName === offerObj.offererUserName);

    if(!socketToAnswer){
      console.log('no matching socket');
      return;
    }

    //we found the matching socket, get socketId -> so we can emit to it!
    const socketIdToAnswer = socketToAnswer.socketId;

    //we find the offer to update (from server 'offers') so we can emit it
    const offerToUpdate = offers.find(o => o.offererUserName === offerObj.offerUserName);
    if(!offerToUpdate){
      console.log('no offerToUpdate');
      return;
    }

    //send back to the answerer all the ice candidates we have already collected
    ackFunction(offerToUpdate.offererIceCandidates);

    //update property values
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answerUserName = userName;
    
    //socket has a .to() which allows emiting to a "room"
    //every socket has its own room 
    socket.to(socketIdToAnswer).emit('answerResponse', offerToUpdate);

  });

  socket.on('sendIceCandidateToSignalingServer', iceCandidateObject => {
    const {didIOffer, iceUserName, iceCandidate} = iceCandidateObject;
    console.log(`iceCandidate: `, iceCandidate);
    
    //client1 - offerer
    if(didIOffer){
      const offerInOffers = offers.find(offer=> offer.offererUserName === iceUserName);
      if(offerInOffers){
        offerInOffers.offererIceCandidates.push(iceCandidate)
        //if the answerer is already here (connected), emit the iceCandidate to that user
        //1. when the answerer answers, all existing ice candidates are sent
        //2. any candidates that come in after the offer has been answered, will be passed through
        if(offerInOffers.answererUserName){
          //pass it through to the other socket
          const socketToSendTo = connectedSockets.find(s => s.userName === offerInOffers.answererUserName);
          if(socketToSendTo){
            socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
          }else{
            console.log('ice candidate received but could not find answerer');
          }
        }
      }
    }else{
      //client2 -answerer
      //this ICE is coming from answerer, send to the offerer
      //pass it through to the other socket
      const offerInOffers = offers.find(offer=> offer.answererUserName === iceUserName);
      const socketToSendTo = connectedSockets.find(s => s.userName === offerInOffers.offererUserName);
      if(socketToSendTo){
        socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
      }else{
        console.log('ice candidate received but could not find answerer');
      }
    }

    console.log(offers);
  });

});