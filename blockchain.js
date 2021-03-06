const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });
        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        };
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;
            
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
            
            if (lastHash !== actualLastHash) return false;
            
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            
            if (hash !== validatedHash) return false;
        }
        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error('new chain not longer than the older chain');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('new chain not longer than the older chain');
            return;
        }
        console.log('replacing chain with', chain);
        this.chain = chain;
    }
}

module.exports = Blockchain;