const express = require('express');
const ejs = require('ejs');
var bodyParser = require('body-parser');
var session = require('express-session');
const e = require('express');
const app = express();
const port = 3001;
const dbconfig = require('./config/dbconfig.json')



const mysql = require('mysql2')
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false,
    timezone: '+09:00'
})


app.set('view engine', 'ejs');
app.set('views', './view');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(session({ secret: 'juner', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));

app.use(function (req, res, next) {

    res.locals.username = "";
    res.locals.name = "";
    if (req.session.member) {
        res.locals.username = req.session.member.username
        res.locals.name = req.session.member.name
    }
    next()
})

//라우팅
app.get('/', (req, res) => {
    console.log(req.session.member);
    res.render('index')  // ./views/index.ejs
})

app.get('/profile', (req, res) => {
    res.render('profile')
})
app.get('/map', (req, res) => {
    res.render('map')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.post('/contactProc', (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const memo = req.body.memo;

    var sql = `insert into contact(name,phone,email,memo,regdate)
    values(?,?,?,?, now())`

    var values = [name, phone, email, memo];
    pool.getConnection((err, conn) => {
        if (err) {
            conn.release()
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database');
        conn.query(sql, values, function (err, result) {
            if (err) throw err;
            console.log('자료 1개 저장')
            res.send("<script> alert('문의사항이 등록되었습니다.'); location.href='/'</script>");
        })
    })



})


app.get('/contactDelete', (req, res) => {
    var idx = req.query.idx
    var sql = `delete from contact where idx='${idx}'`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.send("<script> alert('삭제되었습니다.'); location.href='/contactList'</script>");
    })
})

app.get('/contactlist', (req, res) => {

    var sql = `select * from contact order by idx desc`
    pool.getConnection((err, conn) => {
        if (err) {
            conn.release()
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database');

        conn.query(sql, function (err, results, fields) {
            if (err) throw err;
            res.render('contactList.ejs', { lists: results })
        })
    })

})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/loginProc', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    var sql = `select * from member where user_id=? and pw=?`
    var values = [username, password];

    pool.getConnection((err,conn)=>{
        if (err) {
            conn.release()
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database');

        conn.query(sql, values, function (err, result) {
            if (err) throw err;
    
            if (result.length == 0) {
                res.send("<script> alert('존재하지 않는 아이디 입니다.'); location.href='/login'</script>");
            } else {
                console.log(result[0]);
    
                req.session.member = result[0];
                res.send("<script> alert('로그인 되었습니다.'); location.href='/'</script>");
                //res.send(result);
            }
        })
    })
   
})

app.get('/logout', (req, res) => {


    req.session.member = null;
    res.send("<script> alert('로그아웃 되었습니다.'); location.href='/'</script>");
    //res.send(result);
}
)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

