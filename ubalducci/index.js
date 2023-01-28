const { Socket } = require('dgram');
const ws=require('ws');
const server=new ws.Server({
    port:5000
});
