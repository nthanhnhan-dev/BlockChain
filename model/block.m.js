const db = require("../config/db");
const table_name_block = 'BLOCK';
const table_name_transaction = 'TRANSACTIONS'
const table_name_accounts = 'ACCOUNTS'

module.exports = {
    getBlockChain: async () => {
        const blockchain = await db.load(`SELECT * FROM ${table_name_block}`);
        return blockchain;
    },
    getBlockChainWithTransactions: async () => {
        const blockchain = await db.load(`SELECT ${table_name_block}.*,${table_name_transaction}.*,Sender.OWNER as Sender,Receiver.OWNER as Receiver
        FROM ${table_name_block},${table_name_transaction},${table_name_accounts} as Sender,${table_name_accounts} as Receiver 
        WHERE ${table_name_block}.ID_TRANSACTION = ${table_name_transaction}.ID_TRANSACTION
            AND ${table_name_transaction}.FROM=Sender.ACCOUNT_NO
            AND ${table_name_transaction}.TO=Receiver.ACCOUNT_NO`);
        return blockchain;
    },
    getGenesisBlock: async () => {
        const genesisblock = await db.load(`SELECT * FROM ${table_name_block} where ${table_name_block}.ID_BLOCK=1`)
        return genesisblock;
    },
    addBlock: async (block) => {
        return db.add(table_name_block, block);
    },
    checkExistGenesisBlock: async () => {
        const exist = await db.load(` 
        select count(*) as exist from ${table_name_block}  `);
        return exist;
    },
    getPreHash: async () => {
        const prehash = await db.load(`SELECT HASH FROM ${table_name_block} ORDER BY ${table_name_block}.ID_BLOCK DESC LIMIT 1;`)
        return prehash;
    },
    checkExistTransationInBlock: async (id_transaction) => {
        const exist = await db.load(` 
        select count(*) as exist from ${table_name_block} where ${table_name_block}.ID_TRANSACTION=${id_transaction}`);
        return exist;
    }
}