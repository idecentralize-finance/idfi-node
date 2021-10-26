const crypto = require('crypto')
const ethers = require('ethers')

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
    this.value = amount;
    this.timestamp = Date.now();
    this.data = data;
    this.hash = this.calculateHash();
   
  }

  /**
   * Creates a SHA256 hash of the transaction
   *
   * @returns {string}
   */
   calculateHash() {
   
    const hash = crypto.createHash('sha256')
    hash.update(this.from + this.to + this.value + this.timestamp + this.data)
    //hash.digest('hex')

    
   return '0x'+hash.digest('hex')
  }

  /**
   *
   * @param {object} wallet
   * @param {object} transaction
   */
  async signTransaction(wallet) {
   
    console.log(wallet)

    if (wallet.address !== this.from) {
      console.log('real sender:',wallet.address )
      console.log('pretended sender : ', this.from)

      throw new Error('You cannot sign transactions for other wallets!');
    }

      
     console.log(this.hash) 
    this.signature = await wallet.signTransaction(this.hash)
    console.log('SIGNATURE : ',this.signature)
  }



  /**
   *
   * @returns {boolean}
   */
  async isValid() {
    return new Promise(async  resolve => { 
    if (this.from === null) return resolve(true);

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }
    const parsedTx = ethers.utils.parseTransaction(this.signature)

    const publicKey = parsedTx.from

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