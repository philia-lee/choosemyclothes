const express = require('express');
let router = express.Router();

dbconfig = require('../../database/dbconfig.js');

let mysql = require('mysql2');
let mysqlPromise = require('mysql2/promise');

//상황별 추천
//SELECT * FROM coordinate where situation1 = ? or situation2 = ? order by score desc limit 0, 10
router.post('/situation', async function(req, res) {
    let situation = req.body.situation;
    let gender = req.body.gender;
    let num = parseInt(req.body.num);

    let val;
    if(num == 1){
        val = 0;
    } else {
        val = ( num - 1 ) * 10;
    }

    let params = [
        situation,
        situation,
        gender,
        val
    ]

    const connection = await mysqlPromise.createConnection(dbconfig);

    const [rows, field] = await connection.execute('SELECT * FROM coordinate where (situation1 = ? or situation2 = ?) and gender = ? order by score desc limit ?, 10', params);
    const [rows2, field2] = await connection.execute('SELECT * FROM coordinate where (situation1 = ? or situation2 = ?) and gender = ? order by week_score desc limit ?, 10', params);
    const [rows3, field3] = await connection.execute('SELECT * FROM coordinate where(situation1 = ? or situation2 = ?) and gender = ? order by month_score desc limit ?, 10', params);

    connection.end();

    if (rows.length < 1){
        res.send('0');
    } else {
        res.send({day : rows, week : rows2, month : rows3 });
    }

    return ;    
});



//계절별 추천
//SELECT * FROM coordinate where season1 = ? or season2 = ? order by score desc limit 0, 10
router.post('/season', async function(req, res) {
    let season = req.body.season;
    let gender = req.body.gender;
    let num = parseInt(req.body.num);

    let val;
    if(num == 1){
        val = 0;
    } else {
        val = ( num - 1 ) * 10;
    }

    let params = [
        season,
        season,
        gender,
        val
    ];

    const connection = await mysqlPromise.createConnection(dbconfig);

    const [rows, field] = await connection.execute('SELECT * FROM coordinate where (season1 = ? or season2 = ?) and gender = ? order by score desc limit ?, 10', params);
    const [rows2, field2] = await connection.execute('SELECT * FROM coordinate where (season1 = ? or season2 = ?) and gender = ? order by week_score desc limit ?, 10', params);
    const [rows3, field3] = await connection.execute('SELECT * FROM coordinate where (season1 = ? or season2 = ?) and gender = ? order by month_score desc limit ?, 10', params);

    connection.end();

    if (rows.length < 1){
        res.send('0');
    } else {
        res.send({day : rows, week : rows2, month : rows3 });
    }

    return ;

});

//아이템 별 추천
//SELECT * FROM coordinate where (item1 = ? AND color1 = ?) or ( item2 = ? AND color2 = ?) or ( item3 = ? AND color3 = ?)  order by score desc limit ?, 20
router.post('/item', async function(req, res) {
    let item = req.body.item;
    let color = req.body.color;
    let gender = req.body.gender;

    let num = parseInt(req.body.num);

    let val;
    if(num == 1){
        val = 0;
    } else {
        val = ( num - 1 ) * 10;
    }

    let params = [
        item, color, 
        item, color,
        item, color,
        gender,
        val
    ];

    const connection = await mysqlPromise.createConnection(dbconfig);

    const [rows, field] = await connection.execute('SELECT * FROM coordinate where ((item1 = ? AND color1 = ?) or ( item2 = ? AND color2 = ?) or ( item3 = ? AND color3 = ?)) and gender = ?  order by score desc limit ?, 10', params);
    const [rows2, field2] = await connection.execute('SELECT * FROM coordinate where ((item1 = ? AND color1 = ?) or ( item2 = ? AND color2 = ?) or ( item3 = ? AND color3 = ?)) and gender = ?  order by week_score desc limit ?, 10', params);
    const [rows3, field3] = await connection.execute('SELECT * FROM coordinate where ((item1 = ? AND color1 = ?) or ( item2 = ? AND color2 = ?) or ( item3 = ? AND color3 = ?)) and gender = ?  order by month_score desc limit ?, 10', params);

    connection.end();

    if (rows.length < 1){
        res.send('0');
    } else {
        res.send({day : rows, week : rows2, month : rows3 });
    }

    return ;
});

module.exports = router;