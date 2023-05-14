const db = require("../config/db");
const table_name = "ACCOUNTS";
const cointransaction_table = "TRANSACTIONS_COIN"

module.exports = {
    getUserByName: async (name) => {
        const user = await db.load(`select * from ${table_name} where USERNAME='${name}'`);
        return user;
    },
    checkExist: async (username, mail, account_no) => {
        const exist = await db.load(`SELECT EXISTS( 
        select 1 from ${table_name} where USERNAME = '${username}' or EMAIL = '${mail}' or ACCOUNT_NO='${account_no}') as exist;`);
        return exist;
    },
    addUser: (user) => {
        return db.add(table_name, user);
    },
    getAllUser: async () => {
        const alluser = await db.load(`select * from ${table_name}`);
        return alluser;
    },
    getAllUserExceptOwner: async (user) => {
        const alluser = await db.load(`select * from ${table_name} where USERNAME <>'${user}'`);
        return alluser;
    },
    getUserBalance: async (username) => {
        const balance = await db.load(`select BALANCE from ${table_name} where USERNAME='${username}'`)
        return balance
    },
    updateBalance: async (balance, account_no) => {
        const result = db.load(`UPDATE ${table_name} set BALANCE=${balance} where ACCOUNT_NO='${account_no}'`)
        return result;
    },

    getReward: async (username) => {
        const reward_DB = db.load(`SELECT REWARDS FROM ${table_name} where USERNAME='${username}'`)

        return reward_DB
    },
    updateReward: async (username, reward) => {

        const result = db.load(`UPDATE ${table_name} set REWARDS=${reward} where USERNAME='${username}'`)
        return result;
    },
    addCoinTransaction: async (cointransaction) => {
        return db.add(cointransaction_table, cointransaction);

    },
    getCoinTransactionByUsername: async (username) => {

        const result = await db.load(`SELECT ${cointransaction_table}.*,Sender.OWNER as Sender,Receiver.OWNER as Receiver
        FROM ${cointransaction_table},${table_name} as Sender,${table_name} as Receiver WHERE  ${cointransaction_table}.FROM = Sender.ACCOUNT_NO 
        AND ${cointransaction_table}.TO = Receiver.ACCOUNT_NO
        AND Sender.USERNAME = '${username}'
       ORDER BY ${cointransaction_table}.ID_TRANSACTION_COIN ASC`);
        return result

    },
}