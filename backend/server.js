/* 
*  메인 코드들입니다. 서버구동과, route가 이루어집니다
*/

const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');
const dbconfig      = require('./database/dbconfig')
const cookieParser  = require('cookie-parser');
const app = express();

/* 기본 세팅 */


//static 파일 제공
app.use(express.static('./static'));
//app.use(express.static('./public'));



//cross 도메인 요청을 처리하기 위한것
app.use(function(req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//json을 사용하기 위한것
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


//url로만 접근시
app.get('/hello', (req, res) => res.send('Hello'));

app.set('view engine', 'ejs');



//쿠키
app.use(cookieParser());

//세션
//세션...
let session = require('express-session');
let FileStore = require('session-file-store')(session);

app.use(session({
  secret : "pickpick1@31@3",
  resave : false,
  saveUninitialized : true,
  store : new FileStore(),
  cookie: {
    maxAge : 1000 * 60 * 60
  }
}));


/* 기본 세팅 끝 */


//라우팅 정의
let test = require('./routes/test.js');

//main
let main = require('./routes/main.js');

//upload
let upload = require('./routes/upload.js');

//coordi_func
let coordi_func = require('./routes/coordi/coordi_func');

//user
let signup = require('./routes/user/signup.js');
let login = require('./routes/user/login');
let withdrawal = require('./routes/user/withdrawal.js')
//profile
let profile = require('./routes/user/profile.js');

//코디 게시판
let coordi_list = require('./routes/coordi/coordi_list.js')

//이상형 월드컵
let worldcup = require('./routes/worldcup/worldcup.js');

//추천기능
let recommend = require('./routes/recommend/recommend');

//라우팅
app.use('/test', test);
app.use('/upload', upload);
app.use('/signup', signup);
app.use('/login', login);
app.use('/main', main);
app.use('/coordi_func', coordi_func);
app.use('/coordi_list', coordi_list);
app.use('/profile', profile);
app.use('/withdrawal', withdrawal);
app.use('/worldcup', worldcup);
app.use('/recommend', recommend);



//서버 실행
app.listen(3000, () => console.log('listening on port 3000!'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
