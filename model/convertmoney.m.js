const db = require("../config/db");
const transactions = "TRANSACTIONS";
const accounts = "ACCOUNTS"
//WHERE AND ${ transactions }.FROM = Sender.ACCOUNT_NO AND ${ transactions }.TO = Receiver.ACCOUNT_NO//
module.exports = {
    getAllTransactions: async () => {
        //const result = await db.load(`select * from   ${transactions},${transactions} where ${transactions}.FROM=${accounts}.ACCOUNT_NO `)
        const result = await db.load(`SELECT ${transactions}.*,Sender.OWNER as Sender,Receiver.OWNER as Receiver
        FROM ${transactions},${accounts} as Sender,${accounts} as Receiver WHERE  ${transactions}.FROM = Sender.ACCOUNT_NO AND ${transactions}.TO = Receiver.ACCOUNT_NO
       `);
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

