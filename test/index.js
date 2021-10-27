import  {expect}  from 'chai'
import RPC from '../modules/idfi-rpc.js'

describe('Chain Difficulty', () => {
    it('Responds with correct difficulty', () => {
        const rpc = new RPC(1, "0.0.0.0", 9998, 'idecentralize');
        expect(rpc.chain.difficulty).to.equal(2)
                       
    })
})