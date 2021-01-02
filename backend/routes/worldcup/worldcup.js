const express = require('express');
let router = express.Router();
const mysqlPromise = require('mysql2/promise');
const mysql = require('mysql2');
const dbconfig = require('../../database/dbconfig.js');





//SELECT * FROM pickup.coordinate where situation1 = ? or situation2 = ? ORDER BY RAND() LIMIT ?
router.post('/', async function(req, res) {
    params = [
        situation1 = req.body.situation,
        situation2 = req.body.situation,
        gender = req.body.gender,
        num = parseInt(req.body.num)
    ];

    let connection = await mysqlPromise.createConnection(dbconfig);

    const [rows, field] = await connection.execute('SELECT coordi_id, user_id, file FROM pickup.coordinate where (situation1 = ? or situation2 = ?) AND gender = ? ORDER BY RAND() LIMIT ?', params);

    if(rows.length < 1) {
        res.send('0');
        return ;
    } else {
        res.send(rows);
        return ;
    }
});

//SELECT * FROM pickup.coordinate where situation1 = ? or situation2 = ? ORDER BY RAND() LIMIT ?
router.post('/season', async function(req, res) {
  params = [
      season1 = req.body.season,
      season2 = req.body.season,
      gender = req.body.gender,
      num = parseInt(req.body.num)
  ];

  let connection = await mysqlPromise.createConnection(dbconfig);

  const [rows, field] = await connection.execute('SELECT coordi_id, user_id, file FROM pickup.coordinate where (season1 = ? or season2 = ?) AND gender = ? ORDER BY RAND() LIMIT ?', params);

  if(rows.length < 1) {
      res.send('0');
      return ;
  } else {
      res.send(rows);
      return ;
  }
});

router.post('/score', function(req, res) {
    
    let connection = mysql.createConnection(dbconfig);

    connection.query('UPDATE coordinate SET score = score + 1, week_score = week_score + 1, month_score = month_score + 1 WHERE coordi_id = ?', [ req.body.coordi_id ], function(err, results, field) {
        if(err) {
            console.log("error occured", err);
            res.send({
              "code" : 400,
              "failed" : "error ocurred"
            })
          }
          if(results.length) {
            res.send('0');
          } else {
            res.send('1');
          }          
    })

    return ;
});

module.exports = router;
