const WebSocket =  require('ws');
const PORT=5000;
const serverAddress="ws://127.0.0.1:5000";

//crea il client e lo collega al server
const ws = new WebSocket(serverAddress);

ws.on('open',function(){
    let msg='hello server';
    console.log("inviato dal client al server: " + msg);
    ws.send(msg);
});

ws.on('message', function(msg){
    console.log("Messaggio ricevuto dal  server: " + msg);
})