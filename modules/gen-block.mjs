
import Block from '../class/Block.js'
import Transaction from '../class/Transaction.js'
import Blockchain from '../class/Blockchain.js'

export const GenBlock = async (wallet) =>{

    console.log("\x1b[32m%s\x1b[0m",'----------------GENESIS BLOCK---------------------');
  
  // classes files
 
   // create genesis block
   let genesisBlock = new Block()
   let blockchain = new Blockchain(genesisBlock)

   // create a transaction
   let transaction = new Transaction('COINBASE',wallet.address,100,'Hello Satoshi!')
   
   let block = blockchain.getNextBlock([transaction])
   blockchain.addBlock(block)
   
   console.log(blockchain);
   console.log(blockchain.blocks[1]);
   
   
  
  }