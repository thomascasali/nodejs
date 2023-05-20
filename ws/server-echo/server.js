const WebSocket =  require('ws');
const PORT=5000;
const wsServer = new WebSocket.Server({
    port: PORT
})
var webSockets = {} // userID: webSocket

wsServer.on('connection',function(sck,req){
    //some feedback to the concole
    var IPClient=req.socket.address().address; //completo
    IPClient=req.socket.remoteAddress.split(':')[3];
    
    //stampo tutto il contenuto dell'oggetto sck
    console.log(JSON.stringify(sck, null, 4));

    console.log('il client ' + IPClient + ' si è connesso sulla porta '+ req.socket.address().port + ' e attende dati sulla porta '+req.socket.remotePort);
    console.log('il server comunica con il client ' + IPClient + ' attraverso la porta ' + req.socket.localPort );
    //headers della richiesta
    //console.log(req.headers);
        
    //facciamo fare qualcosa quando arriva un messaggio
    sck.on('message', function(msg){
        console.log('messaggio ricevuto da '+ IPClient +': '+msg);
        
        //rispondi al client che ha inviato il messaggio
        //socket.send('' + msg);
        
        //broadcast the message to all the client
        wsServer.clients.forEach(function(client){
            client.send(msg);
        })
    })
})

console.log( (new Date()) + ' Server is lintening on port ' + PORT);