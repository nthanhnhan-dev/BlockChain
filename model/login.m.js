const db = require("../config/db");
const table_name = "ACCOUNTS";

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
    }
}