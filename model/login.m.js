const db = require("../config/db");
const table_name = "ACCOUNTS";

module.exports = {
    getUserByName: async (name) => {
        const user = await db.load(`select * from ${table_name} where Username='${name}'`);
        return user;
    },
    checkExist: async (username, mail, account_no) => {
        const exist = await db.load(`SELECT EXISTS( 
        select 1 from ${table_name} where Username = '${username}' or Email = '${mail}' or Account_no='${account_no}') as exist;`);
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
        const alluser = await db.load(`select * from ${table_name} where Username <>'${user}'`);
        return alluser;
    }
}