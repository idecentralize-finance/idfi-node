require('dotenv').config()
const url = require('url')
const path = require('path')
const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server)
const crypto = require('crypto')
const ethers = require('ethers')


const midNode = function (node) {
  console.log('\x1b[32m' +process.env.npm_package_name + ' V'+ process.env.npm_package_version+ "\x1b[0m")

  //const app = new express();

let fakeBlockCount = 2




  const midPort = process.env.PORT
  const midHost = process.env.HOST
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json())

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/ping', function (req, res) {
    console.log('PING');
    const rAddress = req.socket.remoteAddress;
    console.log("\x1b[32m%s\x1b[0m", 'ip address :', rAddress);


    res.jsonp(node);
    return;
  })


  app.post('/', (request, response) => {
    //code to perform particular action.
    //To access POST variable use req.body()methods.
    console.log('POSTED :', request.body);
    let res


    ///////////////////////////////////////////////////////// CHAIN_ID
    if (request.body.method == 'eth_chainId') {

      res = {
        jsonrpc: '2.0',
        result: numberToHex(72),
        id: request.body.id,

        chainName: 'idecentralize',
        nativeCurrency: {
          name: 'idfi coin',
          symbol: 'IDFI', // 2-6 characters long
          decimals: 18,
        },
        rpcUrls: ['http://127.0.0.1:9998'], // array
        blockExplorerUrls: null,    //array
        //iconUrls : ['https://idecentralize.finance/logo.png']             // Currently ignored.

      }


      response.jsonp(res);

      console.log(res)

    }

    ///////////////////////////////////////////////////////// NET_VERSION
    if (request.body.method == 'net_version') {

      res = {
        jsonrpc: '2.0',
        result: '72',
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)

    }

    ///////////////////////////////////////////////////////// eth_blocknumber
    if (request.body.method == 'eth_blockNumber') {

      res = {
        jsonrpc: '2.0',
        result: numberToHex(fakeBlockCount),
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)
      fakeBlockCount += 1
    }



    /**
    *  
    *  eth_getBlockByNumber
    *  return the info of a block by number
    * 
    *  */

    if (request.body.method == 'eth_getBlockByNumber') {

      res = {
        jsonrpc: '2.0',
        result: {
          "difficulty": "0x41d67cf5a",
          "extraData": "0x476574682f76312e302e302f6c696e75782f676f312e342e32",
          "gasLimit": "0x1388",
          "gasUsed": "0x0",
          "hash": "0x3d4051de1b8650b98ffdbe4144b68e32a903b98ea5cb16cd843cbda9098af201",
          "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          "miner": "0xE02c4dE60234DA63e759eeE3F1AF219075e55E3E",
          "mixHash": "0xbd63c2291cb8f0b51902d579ca37519daa774b7da7938dd4281ebb294cebd2cc",
          "nonce": "0xc157fbcb50494d18",
          "number": "0x48",
          "parentHash": "0xc7553e669b7cf2fdc8c1608764d18eca3d672966280cfcfe33d5debf46aad92b",
          "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
          "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
          "size": "0x219",
          "stateRoot": "0xf94f7ffbff156315f5b0c2a8398f644bf7e5b0db441a85f3b0631ed119b66fe1",
          "timestamp": "0x55ba43aa",
          "totalDifficulty": "0x12751e31509",
          "transactions": [],
          "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
          "uncles": []                                                                                      // other block mined at almost same time of the accepted block
        },
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)

    }




    /**
     *  eth_getBalance
     *  Return the balance in hexadecimals
     * 
     *  */
    if (request.body.method == 'eth_getBalance') {

      res = {
        jsonrpc: '2.0',
        result: "0x56BC75E2D63100000",
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)

    }

    /**
     *  eth_gasPrice
     *  Return the the gas price which we return as 0x0  right now
     * 
     *  */
    if (request.body.method == 'eth_gasPrice') {

      res = {
        jsonrpc: '2.0',
        result: numberToHex(1),
        id: request.body.id,
      }



      response.jsonp(res);

      console.log(res)

    }

    /**
     *  eth_getCode
     *  Return the code if an address is a contract otherwise return 0x0
     * 
     *  */
    if (request.body.method == 'eth_getCode') {

      res = {
        jsonrpc: '2.0',
        result: numberToHex(0),        // will see later what we could do with this.
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)

    }

    /**
     *  eth_getTransactionCount
     *  Return the code if an address is a contract otherwise return 0x0
     * 
     *  */
    if (request.body.method == 'eth_getTransactionCount') {

      res = {
        jsonrpc: '2.0',
        result: numberToHex(21001),        // will see later what we could do with this.
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)

    }

    /**
     *  eth_getTransactionCount
     *  Return the code if an address is a contract otherwise return 0x0
     * 
     *  */
    if (request.body.method == 'eth_estimateGas') {

      res = {
        jsonrpc: '2.0',
        result: numberToHex(21000),        // will see later what we could do with this.
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)

    }

    /**
  *  eth_sendRawTransaction
  *  Return the the hash of the raw transaction
  * 
  *  */



    if (request.body.method == 'eth_sendRawTransaction') {


      console.log(ethers.utils.parseTransaction(request.body.params[0]))

      res = {
        jsonrpc: '2.0',
        result: calculateHash(request.body.params[0]),        // will see later what we could do with this.
        id: request.body.id,
      }


      response.jsonp(res);

      console.log(res)

    }


    /**
            *  eth_sendRawTransaction
            *  Return the the hash of the raw transaction
            * 
            *  */



    if (request.body.method == 'eth_getTransactionReceipt') {


      res = {
        jsonrpc: '2.0',
        result: {
           blockHash : "0x007d34f6341baced87221ee5ae454bf69f6786016095291a6c596576a7c9fa6d",
           blockNumber : "0x04",
           contractAddress : null,
           cumulativeGasUsed: "0x04",
           from : "0xE02c4dE60234DA63e759eeE3F1AF219075e55E3E",
           gasUsed : "",
           logs : "",
           logsBloom : "",
           to : "0xE02c4dE60234DA63e759eeE3F1AF219075e55E3E",
           transactionHash : "0x4dc9963d9f0eed90fc749f49517bcca9d4b5982c2a4345dc252dd5ae031a46c5",
           transactionIndex : null,
           postTransactionState : "",
           status : "0x1"                                                                         // succeed or failed  0 or 1

        },        // will see later what we could do with this.
        id: request.body.id,
      }

      response.jsonp(res);

      console.log(res)

    }





    if (request.body.method == 'eth_getBlockByHash') {


      res = {
        jsonrpc: '2.0',
        result: {
           hash : "0x007d34f6341baced87221ee5ae454bf69f6786016095291a6c596576a7c9fa6d",
           number : "0x04",
           nonce : "0x04",
           contractAddress : null,
           cumulativeGasUsed: "0x04",
           miner: "0xE02c4dE60234DA63e759eeE3F1AF219075e55E3E",
           gasUsed : "",
           logs : "",
           logsBloom : "",
           difficulty : "0x02",
           transactions : ["0x4dc9963d9f0eed90fc749f49517bcca9d4b5982c2a4345dc252dd5ae031a46c5"],
           timestamp : Date.now(),
           postTransactionState : "",

        },        // will see later what we could do with this.
        id: request.body.id,
      }

      response.jsonp(res);

      console.log(res)

    }





  });

  startLocalDaemon()
  app.listen(midPort, midHost, () => {
    console.log("\x1b[32m%s\x1b[0m", `listening ${midHost} on port : `, midPort);
  })
}





const keepDaemonAlive = (socket) => {
  const response = new Date();
  console.log('Keep Alive')
  socket.emit("heartbeat", response);
};




const startLocalDaemon = () => {
  let interval
  console.log('Opening WebSocket')
  io.on('connection', (socket) => {
    console.log('Client connected');
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => keepDaemonAlive(socket), 1000);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });


  });


  io.on('newListener', (socket) => {
    console.log('Client connected');
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => keepDaemonAlive(socket), 1000);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });


  });

}



const calculateHash = (input) => {
  return '0x' + crypto.createHash('sha256').update(input).digest('hex');
}


const numberToHex = (number) => {
  return ethers.utils.hexValue(number)
}


module.exports = {
  midNode,
  startLocalDaemon
};