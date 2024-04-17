const mysql = require('mysql2');
// Node.js 코드
require('dotenv').config();

// 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // 데이터베이스 호스트
    user: process.env.DB_USER,        // 데이터베이스 사용자 이름
    password: process.env.DB_PASSWORD,// 데이터베이스 패스워드
    database: process.env.DB_NAME     // 데이터베이스 이름
});

// 데이터베이스 연결
db.connect(err => {
    if (err) {
        console.error('데이터베이스 연결 실패: ' + err.stack);
        return;
    }
    console.log('데이터베이스 연결 성공. ID: ' + db.threadId);
});

module.exports = db;