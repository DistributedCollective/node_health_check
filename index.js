const express = require('express');
const app = express();
const http = require('http').createServer(app);
const Web3 = require('web3');
const serverPort = 3001;

const web3 = new Web3("http://127.0.0.1:4444");
const web3S = new Web3("ws://127.0.0.1:4445/websocket");
const web3Iov = new Web3('https://public-node.rsk.co');

http.listen(serverPort, () => {
  console.log('listening on *:' + serverPort);
});

async function getBlockNumber(web3) {
  const result = await web3.eth.call({
    method: 'eth_blockNumber',
    params: [],
    id: 777
  });
  return parseInt(result, 16);
}

app.get('/', async (req, res) => {
  const b = await getBlockNumber(web3);
  const s = await getBlockNumber(web3S);
  const i = await getBlockNumber(web3Iov);

  const result = new Date(Date.now()) + " processed blocks: rpc " + b + ", wss: " + s + "  iov: " + i;
  console.log(result);

  if (Math.abs(b - s) <= 3 && Math.abs(b - i) <= 3) {
    return res.status(200).send(result);
  } else {
    return res.status(503).send("not in sync - " + result);
  }
});
