const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

router.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`환영합니다, ${req.session.username}! <a href="/logout">로그아웃</a>`);
    } else {
        res.render('login');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {
            const [results] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
            if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/');
            } else {
                res.send('잘못된 사용자 이름 또는 비밀번호입니다!');
            }
        } catch (err) {
            console.error('Login Error:', err);
            res.status(500).send('서버 에러: 로그인 처리 중 문제가 발생했습니다.');
        }
    } else {
        res.send('사용자 이름과 비밀번호를 입력하세요.');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    let { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.promise().query('INSERT INTO users(username, email, password) VALUES (?,?,?)', [username, email, hash]);
        res.redirect('/login');
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).send('회원가입 처리 중 오류가 발생했습니다.');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.error('Logout Error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;