let express = require('express');
let router = express.Router();

let mysql = require('mysql2/promise');

const dbconfig = require('../database/dbconfig.js');

//쿼리에서 coordi 최신꺼 4개를 JSON으로 전송
//이상형 월드컵 상황 4개를 JSON으로 전송

//SELECT coordi_id,file from coordinate order by coordi_id desc limit 4

//SELECT DISTINCT situation1 FROM coordinate order by coordi_id desc limit 4

// 최신코디 4개를 가져옵니다...
router.post('/', async function(req, res) {
   
    let connection = await mysql.createConnection(dbconfig);

    const [rows, field] = await connection.execute('SELECT coordi_id, file, situation1, situation2 from coordinate order by coordi_id desc limit 4');

    res.send(rows);

    connection.end();

});


module.exports = router;