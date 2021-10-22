const ethers =require('ethers')


const ethHDW = async (seed) =>{
    return new Promise(resolve => {

        const ethNode = ethers.utils.HDNode.fromSeed(seed)
        const derived =  ethNode.derivePath("m/44'/60'/0'/0/0")

        resolve(derived)
    })
}

module.exports = {
   ethHDW
  };