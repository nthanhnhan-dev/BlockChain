const db = require("../config/db");
const transactions = "TRANSACTIONS";
const accounts = "ACCOUNTS"
module.exports = {
    getAllTransactions: async (id) => {
        const transactions = await db.any(`select *   from ${transactions} where  from = ${id}`)
        return transactions
    },
    getUserById: async (id) => {
        const user = await db.oneOrNone(`select Account_No from ${transactions},${accounts} where ID_User =${id} limit 1`)
        return user
    },
}