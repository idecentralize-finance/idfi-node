
import IDServer from "@idecentralize/simple-server"
import ethers  from 'ethers'
import Blockchain from '../class/Blockchain.js'
import Transaction from '../class/Transaction.js'
import Node from '../class/Node.js'


class RPC {
  /**
  * @param {Node}  // the config for this node
  * 
  */

  constructor(id, ip, port, name){
      this.endpoint;
      this.ws;
      this.chain = new Blockchain();  
      this.receiptTrie = []
      //this.init(id, ip, port,  name)
  }   

  /**
  * @note start the node
  * @returns {string}
  */

   async init(id, ip, port, name) {

    const server = new IDServer(port,ip,name)
    server.app.post('/', (request, response) => {
     // console.log('Post Request :', request.body.method);
      console.log('Post Request :', request.body.method);
    
      switch(request.body.method){
        case "eth_chainId" :
          this.chainId(response,request);
          break;
        case "net_version" :
          this.netVersion(response,request);
          break;
        case "eth_blockNumber" : 
          this.blockNumber(response,request);
          break;
        case "eth_getBlockByNumber" :
          this.blockByNumber(response,request);
          break;
        case "eth_getBalance" :
          this.getBalance(response,request);
          break;
        case "eth_gasPrice" : 
          this.gasPrice(response,request);
          break;
        case "eth_getCode" :
          this.getCode(response,request);
          break;
        case "eth_getTransactionCount" :
          this.getTransactionCount(response,request);
          break;
        case "eth_estimateGas" :
          this.estimateGas(response,request);
          break;
        case "eth_sendRawTransaction" : 
          this.sendTransaction(response,request);
          break;
        case "eth_getBlockByHash" : 
          this.getBlockByHash(response, request);
          break;
        case "eth_getTransactionReceipt" :
          this.getTransactionReceipt(response, request)
          break;
        
      }

    });

    server.init()
  }

  /**
  * @note Chain ID Request 
  * @returns {object}
  */
  chainId(response, request){
    let data = {
      jsonrpc: '2.0',
      result: numberToHex(72),                                  
      id: request.body.id,                                      
      chainName: 'idecentralize',
      nativeCurrency: {
        name: 'decentralize coin',
        symbol: '??', 
        decimals: numberToHex(18),
      },
      rpcUrls: ['http://127.0.0.1:9998'], // array should return a array of all live node
      blockExplorerUrls: null,            //array
      //iconUrls : ['https://idecentralize.finance/logo.png']   // Currently ignored by metamask
    }
    // should also respond to socket
    response.jsonp(data);
    return;

  }



  /**
  * @note Net Version
  * @returns {object}
  */
   netVersion(response, request){
    let data  = {
      jsonrpc: '2.0',
      result: numberToHex(72),
      id: request.body.id,
    }
    response.jsonp(data);
    return;

  }



  /**
  * @note Chain height
  * @returns {json}
  */
  blockNumber(response, request){
    console.log(this.chain.chain.length)
    let data  = {
      jsonrpc: '2.0',
      result: numberToHex(this.chain.chain.length),
      id: request.body.id,
    }
    response.jsonp(data);
    return;

  }

  /**
  * @note BlockByNumber
  * 
  * Need rework to return with or without transactions with param[1] true or false
  * 
  * @returns {json} 
  */
   blockByNumber(response, request){
     console.log('BlockNumber ',parseInt(request.body.params[0]) )
    let data  = {
      jsonrpc: '2.0',
      result: this.chain.chain[parseInt(request.body.params[0])-1],
      id: request.body.id,
    }
    console.log(data)
    response.jsonp(data);
    return;

  }



  /**
  * @note getBalance
  * guess what this goes
  * 
  * @returns {json} 
  */
   getBalance(response, request){
    let data  = {
      jsonrpc: '2.0',
      result: this.chain.getBalanceOfAddress(request.body.params[0])._hex,
      id: request.body.id,
    }
    console.log(data)
    response.jsonp(data);
    return;
   
  }


    /**
  * @note gasPrice
  * gas price is set to one unit
  * 
  * @returns {json} 
  */

     gasPrice(response, request){
       console.log('gasPrice')
      let data  = {
        jsonrpc: '2.0',
        result: numberToHex(1),
        id: request.body.id,
      }
      response.jsonp(data);
      return;
  
    }


  /**
  * @note getCode
  * we just return 0 for now
  * 
  * @returns {json} 
  */
         getCode(response, request){
          let data  = {
            jsonrpc: '2.0',
            result: numberToHex(0),
            id: request.body.id,
          }
          response.jsonp(data);
          return;
      
        }
    

  /**
  * @note getTransactionCount or nonce of the account
  * params[1] is a block number
  * 
  * @returns {json} 
  */
   getTransactionCount(response, request){
    let data  = {
      jsonrpc: '2.0',
      result: numberToHex(this.chain.getAllTransactionsForWallet(request.body.params[0])),
      id: request.body.id,
    }
    response.jsonp(data);
    return;

  }



  /**
  * @note estimateGas
  * 21000 is the minimum amount just like eth
  * 
  * @returns {json} 
  */
   estimateGas(response, request){
    let data  = {
      jsonrpc: '2.0',
      result: numberToHex(21000),
      id: request.body.id,
    }
    response.jsonp(data);
    return;

  }



  /**
  * @note sendTransaction
  * This will return the hash
  * 
  * @returns {json} 
  */
   async sendTransaction(response, request){

    //const tx = new Transaction(request.body.params[0].from, request.body.params[0].to, 1, "0x000");
    let parsedTx =  ethers.utils.parseTransaction(request.body.params[0])
    console.log(parsedTx)
    console.log('sig',request.body.params[0])


    const tx = new Transaction(parsedTx.from, parsedTx.to, parsedTx.value, parsedTx.data);
    tx.signature = request.body.params[0]

    this.chain.addTransaction(tx)

    this.chain.minePendingTransactions(parsedTx.from)

    // const sig = concatSig(request.body.params[0].v, request.body.params[0].r, request.body.params[0].s);
    // console.log('RPC SIG',sig)
    // const publicKey = util.ecrecover(util.sha3('test'), sig.v, sig.r, sig.s);
    // const address = util.pubToAddress(publicKey).toString('hex');   

    let data  = {
      jsonrpc: '2.0',
      result: await tx.calculateHash(),
      id: request.body.id,
    }
    response.jsonp(data);
    return;

  }



   /**
  * @note getBlockByHash
  *
  * 
  * @returns {json} 
  */
    getBlockByHash(response, request){
      let data  = {
        jsonrpc: '2.0',
        result: this.chain.getBlockByHash(request.body.params[0]),
        id: request.body.id,
      }
      console.log(data)
      response.jsonp(data);
      return;
  
    }
  

  /**
  * @note getTransactionReceipt
  *
  * 
  * @returns {json} 
  */
        getTransactionReceipt(response, request){
          console.log(request.body.params)
          let data  = {
            jsonrpc: '2.0',
            result: this.chain.transactionReceipt.get(request.body.params[0]),
            id: request.body.id,
          }
          console.log('Receipt',data)
          response.jsonp(data);
          return;
      
        }
      

}



// should be moved to utility

const numberToHex = (number) => {
  return ethers.utils.hexValue(number)
}


export default  RPC
