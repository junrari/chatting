const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const static = require('serve-static');
var session = require('express-session');
const dbconfig = require('./config/dbconfig.json')
const ejs = require('ejs');


// db connection pool
const pool = mysql.createPool({
    connectionLimit:10,
    host:dbconfig.host,
    user:dbconfig.user,
    password:dbconfig.password,
    database:dbconfig.database,
    debug:false,
    timezone:'+09:00'
})


const app = express();
app.set('view engine','ejs');
app.set('views','./view');
app.use(express.urlencoded({extented:true}));
app.use(express.json())
app.use(express.static('public'));
//app.use('/public', static(path.join(__dirname, 'public')))
app.use(session({ secret: 'juner', cookie: { maxAge: 60000 },resave:true,saveUninitialized:true}));

app.use(function (req, res, next) {

    res.locals.username = "";
    res.locals.fullname = "";
    if(req.session.member){
        res.locals.username = req.session.member.username
        res.locals.fullname = req.session.member.fullname
    }
    next()
  })

/////////////////////////////////////


app.get('/', (req,res) =>{
    console.log(req.session.member);
    res.render('login')  // ./views/index.ejs
})
  // REST endpoint to check for duplicate IDs
  app.post('/checkDuplicateId', (req, res) => {
    const userId = req.body.username;
    let resData = 'error'
    console.log('userId=',userId)
    pool.getConnection((err,conn) => {
        
        
        
        
        if (err) {
          conn.release()
          console.error('Error connecting to MySQL:', err);
          res.json(resData);
          return;
        }
        console.log('Connected to MySQL database');
      
           //  db에 데이터를 요청한다.
            const exec = conn.query(
                'SELECT `username` from user where `username`=?;',[userId], (err, results) => {
              if (err) {
                conn.release()
                console.error('Mysql query error. aborted', err);
                res.json(resData);
                
                return;
              }
              console.log(results,userId,'리설트')
              // Check for duplicate ID
              if(results!=0){
                resData ='true';
                console.log('resData:',resData)
                console.log('중복되는 아이디 존재')
                
              }
             
          
              // No duplicate ID found
              else{
               console.log('중복된 아이디 없음')
              }
             conn.release();
              return res.json(resData)
              // Close the database connection (this could be done in a separate route for cleanup)
            })
          
      });
      
   
  });
  app.get('/join', (req,res)=>{
    res.render('join');
  })

  app.post('/joinuser', (req, res) => {
    const paramfullName = req.body.fullname;
    const paramusername = req.body.username;
    const paramEmail = req.body.email;
    const paramPassword = req.body.password;
    let resData = 'error'
    pool.getConnection((err,conn) => {
        
        
        
        
        if (err) {
          conn.release()
          console.error('Error connecting to MySQL:', err);
          res.json(resData);
          return;
        }
        console.log('Connected to MySQL database');
        console.log(paramfullName, paramusername, paramEmail, paramPassword);
           //  db에 데이터를 요청한다.
            const exec = conn.query(
                'insert into user (fullname, username, email, password) values (?,?,?,SHA2(?,256));',
                [paramfullName,paramusername,paramEmail,paramPassword], (err, results) => {
              if (err) {
                conn.release()
                console.error('Mysql query error. aborted', err);
                res.json(resData);
                
                return;
              }
              // Check for duplicate ID
              if(results!=0){
                console.dir(results);
                console.log('Inserted 성공');
                res.send("<script> location.href='/'</script>");
                
                
              }
             
          
              // No duplicate ID found
              else{
                console.log('Inserted 실패');
              }
             
             
             conn.release();
              
              // Close the database connection (this could be done in a separate route for cleanup)
            })
          
      });
     
   
  });
  app.get('/login', (req,res) =>{
    res.render('login')
})

  app.post('/loginProc', (req,res)=>{
    console.log('loginuser 호출됨');

    const paramusername = req.body.username;
    const paramPassword = req.body.password;
    console.log('username:%s, password:%s', paramusername,paramPassword);

    pool.getConnection((err,conn)=> {
        
        
        if(err) {
            conn.release()
            console.log('Mysql getConnention error. aborted');
 
            return;
        }

        // db에 데이터를 요청한다
  
        const exec = conn.query(
            'select username, password from user where `username`=? and `password`=SHA2(?,256);',
            [paramusername,paramPassword],
            (err,rows) =>{
                if (err){
                    conn.release();
                    console.log('Mysql query error. aborted');
                    return;
                }

                if(rows[0]) {
                    req.session.member =rows[0];
                    res.send("<script> location.href='/index'</script>")
                   console.log(rows[0]);
                }

                else{
                    //query는 성공, 그러나 데이터가 없는 경우
                    
                    res.send("<script> alert('존재하지 않는 아이디 입니다.'); location.href='/login'</script>");
                    console.log('데이터가없음');
                }
                conn.release();
                return
            }
            );
            
app.get('/logout', (req,res) =>{
   

             req.session.member =null;
             res.send("<script> alert('로그아웃 되었습니다.'); location.href='/'</script>");
            //res.send(result);
        }
    )
    })    
})

 
 
///////////////////////////////////
// building id가 주어진 경우를 처리


app.listen(3000, ()=>{
    console.log('Server started at 3000');
}) 