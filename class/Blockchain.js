const ethers = require('ethers')
const Block = require('./Block.js').Block
const ReceiptTrie = require('./ReceiptTrie.js')
const Transaction =require('./Transaction.js').Transaction



class Blockchain {

   constructor() {

     this.chain = [this.createGenesisBlock()];
     this.difficulty = 2;
     this.pendingTransactions = [];
     this.transactionReceipt = new ReceiptTrie();
     this.transactions = new ReceiptTrie();
     this.miningReward = new ethers.BigNumber.from(ethers.utils.parseEther("50"));
   }

      /**
      * @returns {Block}
      */
      createGenesisBlock() {
        return new Block(new ethers.BigNumber.from(1),Date.now(), [], '0');
      }


  /**
     *
     * @returns {Block[]}
     */
   getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   *
   * @param {string} miningRewardAddress
   */
  minePendingTransactions(miningRewardAddress) {
    // create the transaction for the miner
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward,"blockreward");

   // this.pendingTransactions.push(rewardTx);
    this.pendingTransactions.push(rewardTx.hash);
    this.transactions.add(rewardTx)



    const block = new Block(new ethers.BigNumber.from(this.chain.length+1), Date.now(), "0x", this.pendingTransactions, this.transactionReceipt.root  ,this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    console.log('Block Hash',block.hash)
    console.log('Block successfully mined!');
    this.chain.push(block);
    console.log("tx ??",this.chain[this.chain.length-1].transactions)


    // create the transaction receipt root
        let index = new ethers.BigNumber.from(0)

        this.pendingTransactions.forEach(hash => {
         console.log('TX HASH => ',hash)
         const transaction = this.transactions.get(hash)
          const receipt = {
           blockHash : block.hash,
           blockNumber : block.number,
           contractAddress : null,
           cumulativeGasUsed: "0x04",
           from : transaction.from,
           gasUsed : "",
           logs : "",
           logsBloom : "",
           to : transaction.to,
           transactionHash : transaction.hash,
           transactionIndex : null,
           postTransactionState : "",
           status : "0x1"
          }

 
          this.transactionReceipt.add(receipt);
          
          index = index.add(new ethers.BigNumber.from(1))
        });

    // remove transaction mined from pending

    this.pendingTransactions = [];
  }

  /**
   *
   * @param {Transaction} transaction
   */
  addTransaction(transaction) {
    if (!transaction.from || !transaction.to) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transactiion
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }
    
    // if (transaction.amount <= 0) {
    //   throw new Error('Transaction amount should be higher than 0');
    // }
    
    // Making sure that the amount sent is not greater than existing balance
    if (  ethers.utils.formatEther(this.getBalanceOfAddress(transaction.from))  <    ethers.utils.formatEther(transaction.value)   ) {
      
      throw new Error('Not enough balance');
    }
    
    
    this.pendingTransactions.push(transaction.hash);
    this.transactions.add(transaction)
    console.log('transaction added: ', transaction);
  }

  /**
   *
   * @param {string} address
   * @returns {number} The balance of the wallet
   */
  getBalanceOfAddress(address) {
    address = ethers.utils.getAddress(address)
    let balance = ethers.BigNumber.from(0);
    // console.log('The address',address)


    for (const block of this.chain) {
      for (const hash of block.transactions) {
        console.log('balance > Block > hash',hash)

        if(hash === '0'){
          
        }else{
          const tx = this.transactions.get(hash)
          if (tx.from === address) {
           // console.log('removed',trans.value)
            balance = balance.sub(tx.value);
          }
  
          if (tx.to === address) {
            //console.log('added',trans.value)
            balance = balance.add(tx.value);
          }

        }
      }
    }

    console.log('BALANCE : ', balance)
    return balance;
  }

  /**
   *
   * @param  {string} address
   * @return {Transaction[]}
   */
  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === address || tx.to === address) {
          txs.push(tx);
        }
      }
    }

   console.log('get transactions for wallet count: %s', txs.length);
    return txs;
  }

    /**
   *
   * @param  {string} hash
   * @return {Block}
   */
     getBlockByHash(hash) {
      
  
      for (const block of this.chain) {
          if (block.hash === hash) {
            return block;
          }
      }
  
     console.log('get block by hash: %s', hash);
    }

  /**
   *
   * @returns {boolean}
   */
  isChainValid() {

    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }

}

module.exports = {
  Blockchain
};