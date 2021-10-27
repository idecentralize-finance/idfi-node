import fs from 'fs'
import crypto from 'crypto'
import ethers from 'ethers'

const iv = crypto.randomBytes(16);

const saveKey = async (seed, password) => {
    return new Promise(resolve => {

        // encryption algorithm
        const algorithm = 'aes-256-cbc';
        let key = crypto.createHash('sha256').update(String(password)).digest('hex').substr(0, 32);
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(seed)
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        console.log("\x1b[32m%s\x1b[0m", "WALLET ENCRYPTION...")
        console.log("\x1b[32m%s\x1b[0m", "IV :", iv.toString('hex'))
        console.log("\x1b[32m%s\x1b[0m", "ENCRYPTED KEY :", encrypted.toString('hex'))
        // store wallet info

        let data = {
            iv: iv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        };
        fs.mkdir(process.env.KEYSTORE_PATH, function (e) {
            if (!e || (e && e.code === 'EEXIST')) {
                //do something with contents
                console.log("\x1b[32m%s\x1b[0m", "KEYSTORE EXIST")
                fs.writeFileSync(process.env.KEYSTORE_PATH + '.keystore', JSON.stringify(data), (err) => {
                    // throws an error, you could also catch it here
                    if (err) throw err;
                    // success case, the file was saved
                    console.log("\x1b[32m%s\x1b[0m", "KEYSTORE GENERATED :", data)
                });
            } else {
                console.log("\x1b[32m%s\x1b[0m", "! ERROR -- KEYSTORE FILEPATH -- ERROR!")
            }
        });
        resolve(data)
    });
}

const loadKey = async (data, password) => {

    return new Promise(resolve => {

        let iv = Buffer.from(data.iv, 'hex');
        let encryptedText = Buffer.from(data.encryptedData, 'hex');

        const algorithm = 'aes-256-cbc';
        let key = crypto.createHash('sha256').update(String(password)).digest('hex').substr(0, 32);
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

        // Updating encrypted text 
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        //console.log("\x1b[32m%s\x1b[0m", "DECRYPTED KEY :", decrypted.toString('hex'))
        let output = decrypted

        resolve(output)
    })

}

export {
    saveKey,
    loadKey
  };