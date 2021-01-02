//require
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
var bodyParser = require('body-parser');

//mysql을 사용을 위한 선언 및 정의
const mysql = require('mysql2');
const dbconfig = require('../../database/dbconfig');



//id 중복체크
router.post('/signUpDupl', function(req, res, next) {
    let email = req.body.email;
    console.log(email);

    let connection = mysql.createConnection(dbconfig);
    connection.query('SELECT * FROM users WHERE email=?', email, function(err, results, fields) {
      if(err) {
        console.log("error occured", err);
        res.send({
          "code" : 400,
          "failed" : "error ocurred"
        })
      }
      if(results.length) {
        res.send(false);    //email 존재
      } else {
        res.send(true);     //존재 안할때
      }     
    });

    connection.end();
});


//닉네임 중복체크
router.post('/signUpDuplNick', function(req, res, next) {
    let nickname = req.body.nickname;
    console.log(nickname);

    let connection = mysql.createConnection(dbconfig);
    connection.query('SELECT * FROM users WHERE nick_name=?', nickname, function(err, results, fields) {
      if(err) {
        console.log("error occured", err);
        res.send({
          "code" : 400,
          "failed" : "error ocurred"
        })
      }
      if(results.length) {
        res.send(false);  //닉네임 존재
      } else {
        res.send(true);
      }          
    });   
    connection.end();

});



//회원가입..
router.post('/', function(req, res) {

  console.log(req.body);
  let password = req.body.opassword;

  //정규식 체크..
  let check = check_mail(req.body.email);
  if(!check) {
    console.log('err');
    res.send('<script type="text/javascript">alert("오류발생"); history.go(-1)</script>');
    return ;
  }

  //암호화
  let cipher = crypto.createCipher('aes192', 'key');
  cipher.update(password, 'utf8', 'base64');
  let chipheredOutput = cipher.final('base64');
  password = chipheredOutput;

  let params = [
    email = req.body.email,
    password = password,
    nickname = req.body.nickname,
  ];

  let connection = mysql.createConnection(dbconfig);

  connection.query('INSERT INTO pickup.users(email , password, nick_name) VALUES (?,?,?)', params, function(err, results, fields) {
    console.log(err);
    if(results != undefined) {
      res.send('<script type="text/javascript">alert("회원가입 성공, 로그인 해주세요"); history.go(-2)</script>');
    } else {
      res.send('<script type="text/javascript">alert("오류발생"); history.go(-1)</script>');
    }
  })

  connection.end();

});


function check_mail(email) {
  let exp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  return exp.test(email);
}

/*
router.post('/', function(req, res, next) {
    
    let params = [
        email = req.body.email,
        password = req.body.password,
        nick_name = req.body.nick_name,
    ];
    //비밀번호 암호화

    let cipher = crypto.createCipher('aes192', 'key');
    cipher.update(password, 'utf8', 'base64');
    let chipheredOutput = cipher.final('base64');
    password = chipheredOutput;

    pool.getConnection(function(err, connection) {
        let query = pool.query('INSERT INTO pickup.users(email , password, nick_name) VALUES (?,?,?)', params, function(err, result) {
            if(err) {
                console.log(err);
                res.send('err');
            } else {
                console.log('results');
                res.send("sucess");
            }
        })
    });

})
*/
module.exports = router;
