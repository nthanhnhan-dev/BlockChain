const db = require("../config/db");
const transactions = "TRANSACTIONS";
const accounts = "ACCOUNTS"
module.exports = {
    getAllTransactions: async () => {
        const result = await db.load(`select * from  ${transactions} `)
        return result
    },
    getTransactionByUsername: async (username) => {
        const result = await db.load(`select T.ID_TRANSACTION,T.FROM,T.TO,T.AMOUNT from ${transactions} T,${accounts} A where T.FROM=A.ACCOUNT_NO and USERNAME='${username}'`);
        return result;

    },
    getIDByUsername: async (username) => {
        const id = await db.load(`select ID_USER from ${accounts} where USERNAME='${username}'`)
        return id;
    },
    getUserById: async (id) => {
        const user = await db.load(`select ACCOUNT_N0 from ${accounts} where ID_USER =${id} limit 1`)
        return user
    },
    addTransaction: async (transaction) => {
        return db.add(transactions, transaction);

    },
    getUserNameByOwner: async (owner) => {
        const username = await db.load(`select USERNAME from ${accounts} where OWNER='${owner}'`);
        return username;
    },
    getAccountNoByUsername: async (username) => {
        const user = await db.load(`select ACCOUNT_NO from ${accounts} where USERNAME= '${username}'`)
        return user;
    },

}

