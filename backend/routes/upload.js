const express = require('express');
const router = express.Router();

const sharp =require('sharp');


//mysql을 사용을 위한 선언 및 정의
const mysql = require('mysql2/promise');
const mysql2 = require('mysql2');

const dbconfig =require('../database/dbconfig');
let pool = mysql.createPool(dbconfig);

//connection을 만듭니다......
let connection = mysql2.createConnection(dbconfig);


//업로드를 위한 선언 및 정의
let multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/coordi/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.slice(0, 20)) 
    }
})


let upload = multer({ storage : storage})

const resize = async (req, res) => {
    
    //이미지 리사이즈
    let size = require('image-size');
    let dimensions = size('./static/coordi/' + req.file.filename);
    console.log(dimensions.width);
    console.log(dimensions.height);

    if(dimensions.width > 1080) {
        //그냥 1080 넘은거
        sharp('./static/coordi/' + req.file.filename).resize({width:1080}).toFile('./static/coordi/resize' + req.file.filename);
        return 'resize' + req.file.filename;
    } else {
        //그외에는 그냥 저장
        return req.file.filename;
    }
    
}

router.post('/', upload.single('file') ,async function(req, res, next) {
 
    console.log(req.body);

    let file = await resize(req);

    console.log(file);

    //파라미터 정리..
    let params_coordi = [
    user_id = parseInt(req.session.user_id),
    file = file,
    situation1 = req.body.situation1,
    situation2 = req.body.situation2,
    color1 = req.body.color1,
    color2 = req.body.color2,
    color3 = req.body.color3,
    season1 = req.body.season1,
    season2 = req.body.season2,
    item1 = req.body.item1,
    item2 = req.body.item2,
    item3 = req.body.item3,
    gender = req.body.gender,
    memo = req.body.memo,
    ]      

    connection.query('INSERT INTO coordinate(user_id, file, score, report, week_score, situation1, situation2, color1, color2, color3, season1, season2, item1, item2, item3, gender, memo) VALUES (?, ?, 0, 0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', params_coordi, 
        function(err, results, fields) {
            if(err) {
                console.log(err)
                res.send('0')
            }
            else {
                res.send('1');
            }
     });

     return ;

})


module.exports = router;
