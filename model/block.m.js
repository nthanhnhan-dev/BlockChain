const db = require("../config/db");
const table_name_block = 'BLOCK';
const table_name_transaction = 'TRANSACTIONS'
const table_name_accounts = 'ACCOUNTS'

module.exports = {
    getBlockChain: async () => {
        const blockchain = await db.load(`SELECT * FROM ${table_name_block},${table_name_transaction} WHERE ${table_name_block}.ID_TRANSACTION = ${table_name_transaction}.ID_TRANSACTION`);
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
}