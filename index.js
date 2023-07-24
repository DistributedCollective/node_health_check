
/**
 * Sovryn node health check
*/
const express= require('express');
const app = express();
const http = require('http').createServer(app);
const Web3 = require('web3');
const serverPort = 3001;
let web3;
let web3S;
let web3Iov;
// wait for rsk node to start
setTimeout(startListening, 20000);



function sendAsyncRequest(web3, method, params) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: "2.0",
                id: 777,
                method: method,
                params: params
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

async function getBlockNumber(web3) {
    try {
        const result = (await sendAsyncRequest(web3, "eth_blockNumber", [])).result;
        return parseInt(result, 16);
    } catch (error) {
        throw error;
    }
}






function startListening(){
   web3 = new Web3("http://127.0.0.1:8545");
   web3S = new Web3("ws://127.0.0.1:8545/websocket");
   web3Iov = new Web3('https://public-node.testnet.rsk.co');

   http.listen(serverPort, () => {
       console.log('listening on *:'+serverPort);
   });
}
app.get('/', async (req, res)=> {
    const b = await web3.eth.getBlockNumber();
    const s = await web3S.eth.getBlockNumber();
    const i = await web3Iov.eth.getBlockNumber();
    const x = await getBlockNumber(web3);

    const result = new Date(Date.now())+ " processed blocks: rpc "+b+", wss: "+s+"  iov: "+i;
    console.log(result);

    if(Math.abs(b - s) <= 3 && Math.abs(b-i)<=3) return res.status(200).send(result);

    return res.status(503).send("not in sync - " + result);
});
