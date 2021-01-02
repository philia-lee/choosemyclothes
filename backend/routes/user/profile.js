const express = require('express');
let router = express.Router();
const mysqlPromise = require('mysql2/promise');
const mysql = require('mysql2');
const dbconfig = require('../../database/dbconfig.js');
const crypto = require('crypto');

//사용자 프로필 보여주는것
router.post('/', function(req, res){
    
})

router.post('/view', async function(req, res){

    let logined;
    if(req.session.logined === true) {
        logined = true;
    } else {
        logined = false;
    }

    console.log(req.body.user_id);

    let user_id = req.body.user_id;
    let con = await mysqlPromise.createConnection(dbconfig);
    const [rows, field] = await con.execute('select u.email, u.nick_name, c.coordi_id, c.file from users u INNER JOIN coordinate c on u.user_id = c.user_id WHERE u.user_id = ? order by coordi_id desc ',[ user_id ]);

    const [rows2, filed] = await con.execute('select email, nick_name, profile from users where user_id = ?', [user_id]);

    con.end();

    if(rows2.length < 1){
        res.send('0');
        return ;
    } else {
        if(req.session.nick_name != undefined) {
            res.json({
                logined : true,
                nick_name : req.session.nick_name,
                rows : rows,
                user : rows2
            });
            return ;
        } else {
            res.json({
                logined : false,
                rows : rows,
                user : rows2

            });
            return ;
        }
    }

})

//
router.post('/modify_pw', function(req, res) {
    let nick_name = req.body.nick_name;
    let password = req.body.opassword;

    //암호화
    let cipher = crypto.createCipher('aes192', 'key');
    cipher.update(password, 'utf8', 'base64');
    let chipheredOutput = cipher.final('base64');
    password = chipheredOutput;

    let params = [
        password = password,
        user_id = req.session.user_id
    ]

    let con = mysql.createConnection(dbconfig);

    con.query('UPDATE users SET password = ? WHERE user_id = ?', params, function(err, results, field) {
        if(err) {
            console.log("error occured", err);
            res.send('<script type="text/javascript">alert("오류가 발생 했습니다. 다시 시도해 주세요."); history.go(-1)</script>');
          }
          if(results.length) {
            res.send('<script type="text/javascript">alert("오류가 발생 했습니다. 다시 시도해 주세요."); history.go(-1)</script>');
        } else {
            res.send('<script type="text/javascript">alert("정보 수정 완료"); history.go(-2)</script>')
        }            
          console.log(results);
    });

    con.end();
    
})

//닉네임 변경...
router.post('/modify_nick', function(req, res) {
    console.log('닉네임 변경');

    let user_id = req.session.user_id;
    let nickname = req.body.nickname;
    let email = req.session.email

    let params = [
        nickname,
        parseInt(user_id)
    ];

    let con = mysql.createConnection(dbconfig);

    con.query('UPDATE users SET nick_name = ? WHERE user_id = ?', params, function(err, results, field) {
        if(err) {
            console.log('err', err);
             res.send('<script type="text/javascript">alert("오류가 발생 했습니다. 다시 시도해 주세요."); history.go(-1)</script>');
        } else {

            req.session.user_id = user_id;
            req.session.nick_name = nickname;
            req.session.email = email;
            req.session.logined = true;

            req.session.save(function() {
                res.send('<script type="text/javascript">alert("정보 수정 완료"); history.go(-2)</script>')
            });

        }
    });
});


router.post('/pw_check', async function(req, res) {
    console.log (req.body.password)
    let id = parseInt(req.session.user_id)
    let password = req.body.password;
    let con = await mysqlPromise.createConnection(dbconfig);
    const [rows, field] = await con.execute('select password from users where user_id = ?', [ id ]);

    if(rows.length < 1) {
        return 0;
    }

     //암호화
     let cipher = crypto.createCipher('aes192', 'key');
     cipher.update(password, 'utf8', 'base64');
     let chipheredOutput = cipher.final('base64');
     password = chipheredOutput;

    if(rows[0].password != password) {
        res.send(false);
    } else {
        res.send(true);
    }
    con.end();

})

module.exports = router;