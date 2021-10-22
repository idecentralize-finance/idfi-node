const Block = require('./Block.js').Block

const Transaction =require('./Transaction.js').Transaction



class Blockchain {

   constructor() {

     this.chain = [this.createGenesisBlock()];
     this.difficulty = 2;
     this.pendingTransactions = [];
     this.miningReward = 50;
   }

      /**
      * @returns {Block}
      */
      createGenesisBlock() {
        return new Block(0,Date.now(), [], '0');
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
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    
    const block = new Block(this.chain.length, Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  /**
   *
   * @param {Transaction} transaction
   */
  addTransaction(wallet,transaction) {
    if (!transaction.from || !transaction.to) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transactiion
    if (!transaction.isValid(wallet)) {
      throw new Error('Cannot add invalid transaction to chain');
    }
    
    if (transaction.amount <= 0) {
      throw new Error('Transaction amount should be higher than 0');
    }
    
    // Making sure that the amount sent is not greater than existing balance
    if (this.getBalanceOfAddress(transaction.from) < transaction.amount) {
      
      throw new Error('Not enough balance');
    }

    this.pendingTransactions.push(transaction);
    console.log('transaction added: ', transaction);
  }

  /**
   *
   * @param {string} address
   * @returns {number} The balance of the wallet
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.from === address) {
          balance -= trans.amount;
        }

        if (trans.to === address) {
          balance += trans.amount;
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