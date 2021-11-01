import crypto from 'crypto'

class Block {

 /**
     * @param {number} blockNum
     * @param {number} timestamp
     * @param {string} transactionRoot
     * @param {Transaction[]} transactions
     * @param {string} parentHash
     * @param {string} parentHash
     * @param {number} number
     * 
     */
  constructor(blockNum, timestamp, transactionRoot, transactions, receiptRoot, parentHash = '') {
    this.number = blockNum._hex;
    this.parentHash = parentHash;
    this.nonce = 0;
    this.sha3Uncles;                                                // wont be used,
    this.timestamp = timestamp;                                     // the time the block was created
    this.transactionRoot = transactionRoot;                         // transactions merkle 
    this.transactions = transactions;
    this.logsBloom = "0x0";
    this.receiptRoot = receiptRoot;                                 // receipt merkle 
    this.size;
    this.gasUsed;
    this.difficulty;
    this.miner;
    this.hash = this.calculateHash();
  }

  /**
   *
   * @returns {string}
   */
  calculateHash() {
    return '0x'+crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
  }

  /**
   *
   * @param {number} difficulty
   */
  mineBlock(difficulty) {
    while (this.hash.substring(2, difficulty+2) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
      //console.log(this.hash)
    }

    //console.log(`Block mined: ${this.hash}`);
  }

  /**
   *
   * @returns {boolean}
   */
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}

export default Block
