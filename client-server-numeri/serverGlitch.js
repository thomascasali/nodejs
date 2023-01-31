const WebSocket = require('ws');

const wsServer = new WebSocket.Server({
    port: 8080,
});
console.log("Il Server è attivo e aspetta pacchetti sulla porta " + wsServer.options.port);

let operation = "";
let elencoClient = [];
let msgToSend="";
let obj,payload;

wsServer.on("connection" , (socket,req) => {
    console.log(req.headers['x-forwarded-for'].split(':')[0]);
    //var IPClient=req.socket.address().address; //indirizzo completo
    //IPClient=req.socket.remoteAddress.split(':')[3];
    let IPClient=req.headers['x-forwarded-for'].split(':')[0].replace(",","");
    let portClient=socket._socket.remotePort;
    elencoClient.push({ address: IPClient, port: portClient });
    //ogni volta che un client si disconnette devo eliminare l'stanza dal vettore
  
    if (IPClient==undefined) IPClient="localhost";
    console.log("un client si è appena connesso, dall'IP: " + IPClient + " sulla porta " + req.socket.address().port + " e attende dati sulla porta "+req.socket.remotePort);
    msgToSend="Benvenuto, sei il " + wsServer.clients.size + "° client a connettersi"
    payload='{"tipo":"messaggio","valore":"'+msgToSend+'"}';
    socket.send(payload);
    //invia a tutti i client l'elenco dei client connessi
    //let elencoClient=[];
    //wsServer.clients.forEach((c)=>{elencoClient.push(c._socket._peername);});
    console.log(elencoClient);
    wsServer.clients.forEach((c)=>{c.send(JSON.stringify(elencoClient));});
    //fine invio


    socket.on("message" , (msg) => {
        msg=msg.toString();
        console.log(msg);
        try{
          obj = JSON.parse(msg);          
        }
        catch{
          obj="{tipo:'ignora',valore:'ignora'}";
        }
        if (obj.tipo=='operazione') {
            let update = "";
            console.log("ho ricevuto il nuovo comando: " + obj.comando);
            operation= obj.comando;
            msgToSend="Da adesso il server eseguirà l'operazione: " + operation;
            //informo tutti i client connessi che è stata modificata l'operazione svolta dal server
            payload='{"tipo":"messaggio","valore":"'+msgToSend+'"}';
            wsServer.clients.forEach((c)=>{c.send(payload);});
        } 
        if (obj.tipo=='dato') {
            console.log("ho ricevuto il valore: " + obj.valore);
            msgToSend=EseguiOperazione(obj.valore);
            console.log("Invio il messaggio " + msgToSend + " a " + wsServer.clients.size + " client");
            //informo tutti i client connessi sul risultato dell'operazione svolta dal server
            payload='{"tipo":"risultato","valore":"'+msgToSend+'"}';
            wsServer.clients.forEach((c)=>{c.send(payload);});
        }
    });
  
    // Rimuove il client dall'elenco quando si disconnette
    socket.on("close", () => {
      for (var i = 0; i < elencoClient.length; i++) {
        if (elencoClient[i].port === portClient) {
          console.log("rimuovo il client connesso sulla porta " + portClient)
          elencoClient.splice(i, 1);
          break;
        }
      }
      console.log(elencoClient);
      wsServer.clients.forEach((c)=>{c.send(JSON.stringify(elencoClient));});
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

