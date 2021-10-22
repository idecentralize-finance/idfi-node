import ethers from 'ethers'


export const idfiHDW = async (seed) =>{
    return new Promise(resolve => {

        const ethNode = ethers.utils.HDNode.fromSeed(seed)
        let derived =  ethNode.derivePath("m/44'/2205'/0'/0/0")

       // console.log(derived)
        
        const idfiDerived = {
            privateKey: derived.privateKey,
            publicKey: derived.publicKey,
            parentFingerprint: derived.parentFingerprint,
            fingerprint: derived.fingerprint,
            address: formatToIDFI(derived.address),
            chainCode: derived.chainCode,
            index: derived.index,
            depth: derived.depth,
            mnemonic: null,
            path: null
        }

        resolve(idfiDerived)
    })
}



const formatToIDFI = (address) => {
   let idfiAddress = '1df1'+ address.substr(2,address.length)
    return idfiAddress
}