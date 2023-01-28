const WebSocket = require('ws');

const wsServer = new WebSocket.Server({
    port: 5000,
});
console.log("Il Server è attivo e aspetta pacchetti sulla porta " + wsServer.options.port);

var operation = "";

wsServer.on("connection" , (socket,req) => {
    var IPClient=req.socket.address().address; //indirizzo completo
    IPClient=req.socket.remoteAddress.split(':')[3];
    if (IPClient==undefined) IPClient="localhost";
    console.log("un client si è appena connesso, dall'IP: " + IPClient + " sulla porta " + req.socket.address().port + " e attende dati sulla porta "+req.socket.remotePort);
    socket.send("Benvenuto, sei il " + wsServer.clients.size + "° client a connettersi");
    //invia a tutti i client l'elenco dei client connessi
    let elencoClient=[];
    wsServer.clients.forEach((c)=>{elencoClient.push(c._socket._peername);});
    console.log(elencoClient);
    wsServer.clients.forEach((c)=>{c.send(JSON.stringify(elencoClient));});
    //fine invio

    socket.on("message" , (msg) => {
        msg=msg.toString();
        console.log(msg);
        let obj = JSON.parse(msg);
        if (obj.tipo=='operazione') {
            let update = "";
            console.log("ho ricevuto il nuovo comando: " + obj.comando);
            operation= obj.comando;
            msgToSend="Da adesso il server eseguirà l'operazione: " + operation;
            //informo tutti i client connessi che è stata modificata l'operazione svolta dal server
            wsServer.clients.forEach((c)=>{c.send(msgToSend);});
        } 
        if (obj.tipo=='dato') {
            console.log("ho ricevuto il valore: " + obj.valore);
            msgToSend=EseguiOperazione(obj.valore);
            console.log("Invio il messaggio " + msgToSend + " a " + wsServer.clients.size + " client");
            //informo tutti i client connessi sul risultato dell'operazione svolta dal server
            wsServer.clients.forEach((c)=>{c.send(msgToSend);});
        }
    });
});

function EseguiOperazione(stringa) {
    var task = operation;
    let numero = parseInt(stringa);
    switch (task) {
        case "moltiplica":
            return numero * numero;
        case "raddoppia":
            return numero * 2;
        case "fattoriale":
            return factorial(numero*1);
        default:
            break;
    }
}

function factorial(n) {
    return n ? n * factorial(n - 1) : 1;
}

