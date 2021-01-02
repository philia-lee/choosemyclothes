//require
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

//mysql을 사용을 위한 선언 및 정의
const mysql = require('mysql2');
const dbconfig = require('../../database/dbconfig');


router.post('/', async function(req, res) {
    /*
    let password = req.body.password;

    //암호화
    let cipher = crypto.createCipher('aes192', 'key');
    cipher.update(password, 'utf8', 'base64');
    let chipheredOutput = cipher.final('base64');
    password = chipheredOutput;
    */
    params = [ parseInt(req.body.user_id)];
    
    let connection = mysql.createConnection(dbconfig);

    connection.query('DELETE FROM users WHERE user_id = ?', params, function(err, results, fields) {
      console.log(results);
      if(results != undefined) {
        res.send(results);
      } else {
        res.send('err');
      }
    })
});


module.exports = router;