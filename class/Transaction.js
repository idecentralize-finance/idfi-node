const crypto = require('crypto')

class Transaction {
    /**
     * @param {string} from
     * @param {string} to
     * @param {number} amount
     * @param {string} data
     */

   constructor(from, to, amount, data) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.timestamp = Date.now();
    this.customData = data;
    this.txHash 
  }

  /**
   * Creates a SHA256 hash of the transaction
   *
   * @returns {string}
   */
  async calculateHash() {
    return  crypto.createHash('sha256').update(this.from + this.to + this.amount + this.timestamp + this.customData).digest('hex');
  }

  /**
   *
   * @param {object} wallet
   * @param {object} transaction
   */
  async signTransaction(wallet) {
   
    //console.log(wallet)
    if (wallet.address !== this.from) {
      console.log('real sender:',wallet.address )
      console.log('pretended sender : ', this.from)

      throw new Error('You cannot sign transactions for other wallets!');
    }

    this.txHash = this.calculateHash();
     
    this.signature = await wallet.signTransaction(this.txHash)
    console.log('SIGNATURE : ',this.signature)
  }



  /**
   *
   * @returns {boolean}
   */
  async isValid(wallet) {
    return new Promise(async  resolve => { 
    if (this.from === null) return resolve(true);

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }
 
    const publicKey = await wallet.checkTransaction(this.txHash,this.signature).from

    if(publicKey !== this.from){
      throw new Error('Invalid Signature');
    }else if(publicKey === this.from){
      resolve(true)
    }
  })
      
  }



}

module.exports = {
  Transaction
};