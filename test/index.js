import { assert, expect } from 'chai'
import RPC from '../modules/idfi-rpc.js'

describe('ERC20', () => {
    it('Responds with correct symbol', () => {
        const rpc = new RPC(1, "0.0.0.0", 9998, 'idecentralize');
        console.log(rpc)
        expect(rpc.chain.difficulty).to.equal(2)
                       
    })
})