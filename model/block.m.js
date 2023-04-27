const db = require("../config/db");
const table_name_block = 'BLOCK';

module.exports = {
    getBlockChain: async () => {
        const blockchain = await db.load(`SELECT * FROM ${table_name_block}`);
        return blockchain;
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