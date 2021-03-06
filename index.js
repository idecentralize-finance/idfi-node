import dotenv from 'dotenv'
dotenv.config()
import config from './config.js'
import  readline from 'readline'
import  fs from 'fs'
//import nst ecies = require("eth-ecies");
import  {seedGen, mnemGen } from './modules/BTC/bip39-seed.js'
import  btcHDW from './modules/BTC/btc.js'
import  ethHDW  from './modules/ETH/eth.js'
import  {loadKey, saveKey}  from './modules/keystore.js'
import  ethers from "ethers"
import  Transaction from './class/Transaction.js'
import  RPC from'./modules/idfi-rpc.js'


// if we have a wallet
if (fs.existsSync(process.env.KEYSTORE_PATH + '.keystore')) {
  //file exists
  const data = fs.readFileSync(process.env.KEYSTORE_PATH + '.keystore')
  // get the keystore
  let keystore = JSON.parse(data);

  //prompt for password
  var pw = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // hide the password
  pw.stdoutMuted = true;
  pw.question('Enter your password : ', async (password) => {
    pw.close();
    // blank line
    console.log("\x1b[32m%s\x1b[0m", " ")
    // decrypt wallet file.
    let xkey = await loadKey(keystore, password)
    //console.log('XKEY:',xkey.toString('hex'))
    run(xkey)
  });
  pw._writeToOutput = function _writeToOutput(stringToWrite) {
    if (pw.stdoutMuted)
      //Hidding Password with colors
      pw.output.write(['\x1B[', 92, 'm', '*', '\x1B'].join(''));
    else
      pw.output.write(stringToWrite);
  };
}
// if we dont have a wallet
else {  // file dont exist
  console.log("\x1b[32m%s\x1b[0m", "⚠️ NO KEYSTORE FOUND!")
  var nx = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  nx.question('Type "\x1b[32mr\x1b[0m" to restore a wallet or "\x1b[32mn\x1b[0m" to create a new one \x1b[32m >', async (action) => {
    // nx.close();
    // blank line
    console.log("\x1b[32m%s\x1b[0m", " ")

    if (action === 'r') {

      nx.question('\x1b[0m Type your 12 word mnemonic \x1b[32m >', async (rmnemonic) => {
        const seed = await seedGen(rmnemonic)
        const seed2 = ethers.utils.mnemonicToSeed(rmnemonic)

        console.log("BIP39 : ",seed.toString('hex'))
        console.log("ETHERS : ",seed2)

        nx.question('\x1b[0mType a password for your wallet \x1b[32m >', async (password) => {
          nx.stdoutMuted = true;
          nx.question('\x1b[0m Confirm password \x1b[32m >', async (cpassword) => {
            nx.close();
            if (password === cpassword) {
              saveKey(seed, password)
              run(seed)
            } else {
              console.log("\x1b[32m%s\x1b[0m", "Password don't match")
              process.exit(1)
            }

          })
        })
      })

      nx.input.on("keypress", function (c, k) {
        var len = nx.line.length;
        readline.moveCursor(nx.output, -len, 0);
        readline.clearLine(nx.output, 1);
        for (var i = 0; i < len; i++) {
          nx.output.write("*");
        }
      });
    }
    else if (action === 'n') {
      const mnemonic = await mnemGen()
      console.log("\x1b[32m%s\x1b[0m", "⚠️ THIS IS YOUR MNEMONIC.  IF YOU LOOSE IT YOU LOOSE YOUR FUNDS ⚠️")
      console.log("\x1b[32m%s\x1b[0m", "***************************** MNEMONIC *****************************")
      console.log("\x1b[32m%s\x1b[0m", " ")
      console.log(mnemonic.toString('hex'))
      console.log("\x1b[32m%s\x1b[0m", " ")
      console.log("\x1b[32m%s\x1b[0m", "********************************************************************")
      console.log("\x1b[32m%s\x1b[0m", "⚠️ THIS IS YOUR MNEMONIC.  IF YOU LOOSE IT YOU LOOSE YOUR FUNDS ⚠️")


      nx.question('\x1b[0m Make sure you save this mnemonic and press enter \x1b[32m >', async (x) => {


        nx.question('\x1b[0m Please type your mnemonic phrase \x1b[32m >', async (cmnemonic) => {


          if (cmnemonic === mnemonic.toString('hex')) {
            console.log("\x1b[32m%s\x1b[0m", "MNEMONIC CONFIRMED. SAVING WALLET ...")
            const seed = await seedGen(mnemonic)
            // console.log("\x1b[32m%s\x1b[0m","SEED : ", seed)

            nx.question('\x1b[0m Type a password for your wallet \x1b[32m >', async (password) => {
              nx.stdoutMuted = true;
              nx.question('\x1b[0m Confirm password \x1b[32m >', async (cpassword) => {
                nx.close();
                if (password === cpassword) {
                  saveKey(seed, password)
                  run(seed)
                }
                else {
                  console.log("\x1b[32m%s\x1b[0m", "Password don't match")
                  process.exit(1)
                }

              })

            })



          } else {
            console.log("\x1b[32m%s\x1b[0m", "Mnemonic don't match")
            process.exit(1)
          }


        })
      })

      nx.input.on("keypress", function (c, k) {
        // get the number of characters entered so far:
        var len = nx.line.length;
        // move cursor back to the beginning of the input:
        readline.moveCursor(nx.output, -len, 0);
        // clear everything to the right of the cursor:
        readline.clearLine(nx.output, 1);
        // replace the original input with asterisks:
        for (var i = 0; i < len; i++) {
          nx.output.write("*");
        }
      });

    }
    else {
      console.log("\x1b[32m%s\x1b[0m", "Invalid option")
      process.exit(1)
    }


    // run(xkey)

  });
}


// function encrypt(publicKey, data) {
//   let userPublicKey = new Buffer.from(publicKey, 'hex');
//   let bufferData = new Buffer.from(data);
//   let encryptedData = ecies.encrypt(userPublicKey, bufferData);
//   return encryptedData.toString('base64')
// }


// function decrypt(privateKey, encryptedData) {
//   let userPrivateKey = new Buffer.from(privateKey, 'hex');
//   let bufferEncryptedData = new Buffer.from(encryptedData, 'base64');
//   let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);
//   return decryptedData.toString('utf8');
// }

// const signMessage = async (wallet, message) =>{
//   let signMsg = await wallet.signMessage(message)
//   return signMsg
// }


/// start the node
const startRPC = async () => {
  
 
  const rpc = new RPC(1, "0.0.0.0", config.node.port, config.node.name);
  
  return rpc
}








async function run(seed) {

  const rpc = await startRPC()

  // Generate BTC HD Wallet from seed.
  let btcAddress = await btcHDW(seed)
  console.log("\x1b[32m%s\x1b[0m", "₿ ADDRESS : ", btcAddress)

  // Generate ETH HD Wallet from seed.
  const ethNode = await ethHDW(seed)
  console.log("\x1b[32m%s\x1b[0m", "⧫ ADDRESS : ", ethNode.address)
  const wallet = new ethers.Wallet(ethNode.privateKey)
  //const keys = wallet._signingKey()
  //console.log('WALLET :',wallet)
  //const pubKey = keys.publicKey.substr(4,keys.publicKey.length)
  //const prvKey = keys.privateKey.substr(2,keys.privateKey.length)
  
  // const msg = "This is my message to you"
  // console.log('PUBLIC KEY :',pubKey,pubKey.length)
  // //console.log('PRIVATE KEY', prvKey,prvKey.length)

  // const encryptedData = encrypt(pubKey,msg)
  // //console.log('ENCRYPTED :',encryptedData)
  // const decryptedData = decrypt(prvKey,encryptedData)
  // //console.log('DECRYPTED',decryptedData)
  
  // //signature of encrypted message
  // const signature = await signMessage(wallet,encryptedData)
  // console.log('Signature :',signature)
 
  // // verify the signature 
  // const recoveredAddress = ethers.utils.verifyMessage(encryptedData, signature)
  // console.log('Recovered :',recoveredAddress)

  // //recover the uncompressed public key from signature
  // const recoveredPBK = ethers.utils.recoverPublicKey(ethers.utils.arrayify(ethers.utils.hashMessage(encryptedData)), signature);
  // console.log('Recovered PBK',recoveredPBK)
  
  // console.log('Compressed PBK :',ethers.utils.computePublicKey(keys.publicKey,true))
  let amount = new ethers.BigNumber.from(0)
  const tx1 = new Transaction(wallet.address, wallet.address, amount, "0x0000");
  //console.log('tx added', tx1)

  //await tx1.signTransaction(wallet)
  //rpc.chain.addTransaction(tx1)



  rpc.chain.minePendingTransactions(wallet.address)

  rpc.chain.getBalanceOfAddress(wallet.address)

 // console.log(rpc.chain)
  // console.log('unCompressed PBK :',ethers.utils.computePublicKey(keys.privateKey))

 // const tx = new Transaction(wallet.address, wallet.address, 1, null);
 // await tx.signTransaction(wallet)

  // const chain = new Blockchain()
 
  // chain.minePendingTransactions(wallet.address)

 // rpc.chain.addTransaction(wallet,tx)

 // rpc.chain.minePendingTransactions(wallet.address)

  // console.log(chain)
  // chain.getBalanceOfAddress(wallet.address)

 // await startNode()

}





















