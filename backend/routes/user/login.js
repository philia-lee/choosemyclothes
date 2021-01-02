//require
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
var bodyParser = require('body-parser');

//mysql을 사용을 위한 선언 및 정의
const mysql = require('mysql2/promise');
const dbconfig = require('../../database/dbconfig');



router.post('/', async function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    console.log('login');

    //암호화
    let cipher = crypto.createCipher('aes192', 'key');
    cipher.update(password, 'utf8', 'base64');
    let chipheredOutput = cipher.final('base64');
    password = chipheredOutput;

    params = [email, password];

    const connection = await mysql.createConnection(dbconfig);
    
    const [rows, field] = await connection.execute('SELECT * FROM users WHERE email=? and password = ?', params);

    await connection.end();
    
    console.log(rows);

    if(rows.length < 1) {
        res.send('0');
        return 0;
    } else {
        console.log('session 생성');
        req.session.user_id = rows[0].user_id;
        req.session.nick_name = rows[0].nick_name;
        req.session.email = rows[0].email;
        req.session.logined = true;

        req.session.save(function() {
            res.send('1');
        })
    }
 
    
router.post('/check', function(req, res) {
    if(req.session.logined === true) {
        let param = {
            nick_name : req.session.nick_name,
            logined : req.session.logined,
            user_id : req.session.user_id,
            email : req.session.email
        }
        res.send(param);
    } else {
        res.send('0');
    }

})

router.post('/logout', function(req, res) {
    req.session.destroy(
        function (err) {
            if (err) {
                console.log('logout err');
                return;
            }
            console.log('logout');
        });
        res.clearCookie('connect.sid');
        res.send('logout!');
})
    
    /* 쿠키
    if(rows[0].password === password) {
        res.cookie('user_id', rows[0].user_id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
        res.cookie('nick_name', rows[0].nick_name, { expires: new Date(Date.now() + 3600000), httpOnly: true, encode : 'utf-8' })
        res.send('succes');                                                         
    } else {
        res.send('0')
    } 
    */

    //세션

    
    
    return ;
    
});


module.exports = router;