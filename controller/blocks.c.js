
const hash = require('crypto-js/sha256');
const he = require('he');
const blockM = require('../model/block.m')
const moneyM = require("../model/convertmoney.m")

class Block {
    constructor(preHash, data) {
        this.preHash = preHash;
        this.data = data;
        this.timeStamp = new Date();
        this.hash = this.calculateHash();
        this.mineVar = 0;
    }

    printObjectstring() {
        return (this.preHash + '\n' + this.data.from + '\n' + this.data.to + '\n' + this.data.category + '\n' + this.data.amount + '\n' + this.timeStamp + '\n' + this.hash).toString();
    }

    calculateHash() {
        return hash(this.preHash + JSON.stringify(this.data) + this.timeStamp + this.mineVar).toString();
    }

    mine(difficulty) {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.mineVar++
            this.hash = this.calculateHash()
        }
    }

}


class BlockChain {
    constructor(hardlevel) {
        const genesisBlock = new Block('00000', { isGenesis: true })
        this.chain = [genesisBlock];
        this.difficulty = hardlevel
    }

    getlastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newdata) {
        const lastblock = this.getlastBlock();
        const newblock = new Block(lastblock.hash, newdata);


        newblock.mine(this.difficulty)

        this.chain.push(newblock);
    }

    checkintegrityData() {
        for (let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const preBlock = this.chain[i - 1];

            if (curBlock.preHash != preBlock.hash) {
                return false;
            }

            if (curBlock.hash != curBlock.calculateHash()) {
                return false;
            }
        }
        return true;
    }

    minePendingTransactions() {

    }
}

exports.getAllBlockChain = async (req, res, next) => {
    const exists = await blockM.checkExistGenesisBlock()
    var blockchain = 0;
    var arr_blockchain = [];
    var arr_transactions = [];
    if (exists[0].exist === 0) {
        blockchain = new BlockChain(3);
        const blockchain_DB = {
            ID_TRANSACTION: null,
            ID_BLOCK: 0,
            PREHASH: blockchain.chain[0].preHash,
            HASH: blockchain.chain[0].hash,
            TIMESTAMP: blockchain.chain[0].timeStamp

        }
        await blockM.addBlock(blockchain_DB);
        arr_blockchain = await blockM.getBlockChain();
        res.render("blockchain/blockchain", {
            data: arr_blockchain
        })
    }
    else {

        arr_transactions = await moneyM.getAllTransactions();
        const genesis_block = await blockM.getGenesisBlock()
        arr_blockchain.push(genesis_block)
        arr_blockchain.push(await blockM.getBlockChainWithTransactions())

        console.log(arr_blockchain)
        if (arr_blockchain.length === 0) {

            res.render("blockchain/blockchain", {
                data: genesis_block
            })
        }
        else {
            res.render("blockchain/blockchain", {
                data: arr_blockchain
            })
        }
    }






}



exports.createBlockChain = async (req, res, next) => {
    const blockchain = new BlockChain(3)
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "300000",
        amount: "no limit",
        count: 1
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "20000000",
        amount: "no limit",
        count: 2
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount: "no limit",
        count: 3
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount: "no limit",
        count: 3
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount: "no limit",
        count: 3
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount: "no limit",
        count: 3
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount: "no limit",
        count: 3
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount: "no limit",
        count: 3
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount: "no limit",
        count: 3
    })
    console.log(blockchain.chain)
    //console.log(blockchain.chain[1].printObjectstring())
    //blockchain.chain=blockchain.chain.map(member=>JSON.stringify(member))
    res.render('./blockchain/blockchain', {
        data: blockchain.chain,
        n: blockchain.chain.length,
        account: req.session.user,
    })

}