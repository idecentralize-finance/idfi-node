
const bip39 = require('bip39')
const HDkey = require('hdkey')


const mnemGen = async () =>{
  return new Promise(resolve => {
   // const mnemonic =  "drive captain sustain winner neutral anchor congress skirt buzz usage orient wood"
    const mnemonic =  bip39.generateMnemonic(); //generates string
   resolve(mnemonic)
  })
}



const seedGen = async (mnemonic) =>{
    return new Promise(resolve => {
     // const mnemonic =  "drive captain sustain winner neutral anchor congress skirt buzz usage orient wood"
  
      //const mnemonic =  bip39.generateMnemonic(); //generates string
      const seed =  bip39.mnemonicToSeed(mnemonic); //creates seed buffer
     resolve(seed)
    })
  }








const rootGen = async (seed) =>{
    return new Promise(resolve => {
        
      const root = HDkey.fromMasterSeed(Buffer.from(seed))
  
     resolve(root)
    })
  }

  module.exports = {
    seedGen,
    mnemGen,
    rootGen
  };