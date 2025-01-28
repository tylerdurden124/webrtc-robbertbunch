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

  connectSockets.push({
    socketId: socket.id,
    userName
  });

  socket.on('newOffer', newOffer=> {
    offers.push({
      offererUserName: userName, 
      offer: newOffer, 
      offererIceCandidates:[],
      answererUserName:null,
      answer:null,
      answererIceCandidates:[]
    });

    //send out to all connected sockets EXCEPT the caller
    socket.broadcast.emit('newOfferAwaiting', offers.slice(-1));
  });

});