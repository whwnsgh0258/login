const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
const ejs = require('ejs');
const authRoutes = require('./routes/auth');
const db = require('./config/database');

require('dotenv').config();

//view 엔진 사용(ejs)
app.set('views', path.join(__dirname,   'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//세션 설정
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:3600000 //한시간
    }
}));

//정적 파일 사용
app.use(express.static(path.join(__dirname,'public')));

// 라우트 사용
app.use(authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log('서버가 http://localhost:3000 반 에서 실행 중 입니다!');
});