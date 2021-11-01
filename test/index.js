import  {expect}  from 'chai'
import RPC from '../modules/idfi-rpc.js'

describe('RPC start up', () => {

    it('Is initiating', () => {
        const rpc = new RPC(1, "0.0.0.0", 9998, 'idecentralize');
        console.log(rpc)
        // expect(rpc.chain.difficulty).to.equal(2)
                       
    })


    it('Responds with correct difficulty', () => {
        const rpc = new RPC(1, "0.0.0.0", 9998, 'idecentralize');
        expect(rpc.chain.difficulty).to.equal(2)
                       
    })
})