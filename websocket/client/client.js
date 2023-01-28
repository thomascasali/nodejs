const WebSocket = require("ws"); // per includere un modulo usiamo
const prompt = require('prompt-sync')({sigint: true}); //attende input utente

const ServerAddress="ws://127.0.0.1:5000";

const socket = new WebSocket(ServerAddress);

socket.on("message", function (msg) {
   console.log("hai ricevuto dal server:" + msg); 
   const txt = prompt('Inserisci il testo da inviare al server: ');
   socket.send(txt);
});

socket.on("open", function() {
   const txt = prompt('Inserisci il testo da inviare al server: ');
   socket.send(txt);
}) b