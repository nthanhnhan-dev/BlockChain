
const hash = require('crypto-js/sha256');
const he = require('he');
const blockM = require('../model/block.m')
const moneyM = require("../model/convertmoney.m");
const userM = require("../model/login.m")

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
        const arr_transactions = await moneyM.getAllTransactions();
        const genesis_block = await blockM.getGenesisBlock()
        const all_block = await blockM.getBlockChainWithTransactions()
        var arr_blockchain = []
        arr_blockchain.push(genesis_block[0])
        for (var i = 0; i < all_block.length; i++) {
            arr_blockchain.push(all_block[i])
        }


        res.render("blockchain/blockchain", {
            data: arr_blockchain,
            account: req.session.user,
        })

    }

}



exports.createBlockChain = async (req, res, next) => {
    var transactions = await moneyM.getAllTransactions();
    var transactions_to_block;
    var preHash;
    var hash_minevar;
    var check = 0;
    var mineVar = 0;
    var block = []
    for (var i = 0; i < transactions.length; i++) {
        var exists = await blockM.checkExistTransationInBlock(transactions[i].ID_TRANSACTION);
        if (exists[0].exist === 0) {
            preHash = await blockM.getPreHash()
            hash_minevar = hash(preHash[0].HASH + JSON.stringify(transactions[i].MESSAGE) + new Date() + mineVar).toString();
            while (!hash_minevar.startsWith('0000')) {
                mineVar++;
                hash_minevar = hash(preHash[0].HASH + JSON.stringify(transactions[i].MESSAGE) + new Date() + mineVar).toString();
            }

            transactions_to_block = {
                ID_TRANSACTION: transactions[i].ID_TRANSACTION,
                PREHASH: preHash[0].HASH,
                HASH: hash_minevar,
                TIMESTAMP: new Date()

            }
            //transactions_to_blockchain.push(transactions_to_block);
            await blockM.addBlock(transactions_to_block)
            const reward = await userM.getReward(req.session.user)
            await userM.updateReward(req.session.user, reward[0].REWARDS + 100)
            check++;
        }
        else {


            continue
        }

    }
    if (check != 0) {
        res.redirect("/blockchain")

    }
    else {
        const transaction_BD = await moneyM.getAllTransactions();

        res.render("convertmoney/pending", {
            transaction: transaction_BD,

            account: req.session.user,
            announce: "NOTTHING NEW TO MINING"
        })

    }

}
