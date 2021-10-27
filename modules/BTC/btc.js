import env from "dotenv"
//dotenv.config({ silent: true })
import HDkey from 'hdkey'
import createHash from 'create-hash'
import base58 from 'base58-encode'
import wif from 'wif'

 const btcHDW = async (seed) => {
  return new Promise(resolve => {
  
    const hdkey = HDkey.fromMasterSeed(Buffer.from(seed))
    // this will give us the first account
    // https://iancoleman.io/bip39/
    const nodeAcc = hdkey.derive("m/44'/0'/0'/0/0")
    const nodeAccPubKey = nodeAcc._publicKey

    var cwif = Buffer.allocUnsafe(33)
    cwif.writeUInt8(0x80, 0)
    nodeAcc._privateKey.copy(cwif, 1)
    var wsha1 = createHash('sha256').update(cwif).digest()
    var wsha2 = createHash('sha256').update(wsha1).digest()

    //checksum first 4 byte of second hash
    var rwif = Buffer.allocUnsafe(37)
    var wchecksum = wsha2.slice(0, 4)
    cwif.copy(rwif, 0)
    wchecksum.copy(rwif, 33)

    var privateKey = new Buffer.from(nodeAcc._privateKey, 'hex')
    var key = wif.encode(128, privateKey, true)
    // console.log("\x1b[32m%s\x1b[0m",'COMPRESSED WIF : ', key)
    //SHA256 of the public key
    const sha256 = createHash('sha256').update(nodeAccPubKey).digest()

    // PIPEDMD-160 of the SHA256 Hash
    const pipedMd = createHash('rmd160').update(sha256).digest()
    //console.log("\x1b[32m%s\x1b[0m",'BASE  : ', pipedMd.toString('hex'))

    // He we must add the network byte in front of that PIPEDMD result
    // 0x00 for mainnet and 0x6f for testnet

    var fingerprint = Buffer.allocUnsafe(21)
    fingerprint.writeUInt8(0x00, 0)
    pipedMd.copy(fingerprint, 1)

    //we hash it twice
    var sha1 = createHash('sha256').update(fingerprint).digest()
    var sha2 = createHash('sha256').update(sha1).digest()

    //checksum first 4 byte of second hash
    var checksum = sha2.slice(0, 4)
    
    var rawAddr = Buffer.allocUnsafe(25)
    //rawAddr.writeUInt8(0x00, 0)
    fingerprint.copy(rawAddr, 0)
    //console.log(step4.length) //21
    checksum.copy(rawAddr, 21)

    // Return the bitcoins address
  
    var address = base58(Buffer.from(rawAddr))

    resolve(address)


  })
}


export default  btcHDW
