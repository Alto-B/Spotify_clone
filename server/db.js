const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/comp3005_final.db', sqlite3.OPEN_READWRITE ,(err) => {
    if (err) return console.error(err.message);
});

// https://www.youtube.com/watch?v=ZRYn6tgnEgM&t=4s for querys and stuff

async function query(sql, params){

    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err){
                console.error(err.message);
                reject(err); 
            }
            resolve(rows);
        });
    });

}

async function getAllQuery(table){

    var sql = `select * from ${table}`;
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err){
                console.error(err.message);
                reject(err); 
            }
            resolve(rows);
        });
    });

}



module.exports = {
    query,
    getAllQuery
}