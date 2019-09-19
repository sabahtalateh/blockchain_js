import sha256 from 'sha256';
import uuid from 'uuid';

export class Blockchain {
    constructor(nodeUrl, nodeAddress) {
        this.chain = [];
        this.pendingTransactions = [];
        this.nodeUrl = nodeUrl;
        this.networkNodes = [];
        this.nodeAddress = nodeAddress;

        this.createNewBlock(931, '0', '0');
    }

    createNewBlock(nonce, prevBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce,
            hash,
            prevBlockHash,
        };

        this.pendingTransactions = [];
        this.chain.push(newBlock);

        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    hashBlock(prevBlockHash, currentBlockData, nonce) {
        const string = prevBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        return sha256(string);
    }

    proofOfWork(prevBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        }

        return nonce;
    }

    // Returns block number in which new transaction may be found
    createTransaction(amount, sender, recipient) {
        const transaction = {
            amount,
            sender,
            recipient,
            transactionId: uuid().split('-').join('')
        };

        return transaction;
    }

    addTransactionToPending(transaction) {
        this.pendingTransactions.push(transaction);

        return this.getLastBlock()['index'] + 1;
    }

    chainIsValid(chain) {
        let genesisBlock = chain[0];
        let correctHash = genesisBlock['hash'] === '0';
        let correctPrevBlockHash = genesisBlock['prevBlockHash'] === '0';
        let correctNonce = genesisBlock['nonce'] === 931;
        let correctTransactions = genesisBlock['transactions'].length === 0;

        if (!correctHash || !correctPrevBlockHash || !correctNonce || !correctTransactions) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            let currentBlock = chain[i];
            let prevBlock = chain[i - 1];
            let correctPrevBlockHash = currentBlock['prevBlockHash'] === prevBlock['hash'];
            if (!correctPrevBlockHash) {
                return false;
            }
            let blockHash = this.hashBlock(
                prevBlock['hash'],
                {
                    transactions: currentBlock['transactions'],
                    index: currentBlock['index'],
                },
                currentBlock['nonce']
            );
            let correctBlockHash = blockHash.substring(0, 4) === '0000';
            if (!correctBlockHash) {
                return false;
            }
        }
        return true;
    }
}
