const WebSocket =  require('ws');
const PORT=5000;
const wsServer = new WebSocket.Server({
    port: PORT
})
var webSockets = {} // userID: webSocket

wsServer.on('connection',function(socket,req){
    //some feedback to the concole
    console.log('A client just connected');
    //console.log(req.url);

    //headers della richiesta
    //console.log(req.headers);
        
    //facciamo fare qualcosa quando arriva un messaggio
    socket.on('message', function(msg){
        console.log('Received from client: '+msg);
        
        //rispondi al client che ha inviato il messaggio
        //socket.send('' + msg);
        
        //broadcast the message to all the client
        wsServer.clients.forEach(function(client){
            client.send(msg);
        })
    })
})

console.log( (new Date()) + ' Server is lintening on port ' + PORT);