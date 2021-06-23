const connection = require('../mysqlConnection');//db接続読み取り
const moment = require('moment');//日付取得用パッケージ読み込み

//top
exports.top = (req, res)=>{
  let uid = req.session.user_id? req.session.user_id: 0;

    connection.query('SELECT * FROM user',(error,users)=>{
      if(uid === 0){
        var shop = 'SELECT account_img FROM shop'
      }else{
        var shop = 'SELECT account_img FROM shop WHERE user_id = '+uid+'';
      }
      
       connection.query(shop,(error,shops)=>{
        if(error){
          console.log('ERROR.SELECT_DB: ', error);
          throw error;
      }
      // res.renderで指定ファイルの画面表示させる
      res.render('top.ejs',{sitems:shops});
      console.log(shops)
      console.log(shops[0].account_img)
       })
    })
  }

//login 
  //get
exports.login = function(req, res, next) {
    if (req.session.user_id) {
      res.redirect('/');
    } else {
      res.render('login.ejs', {
        title: 'ログイン'
      });
    }
  }

  //post
exports.login_post = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var query = 'SELECT user_id FROM user WHERE email = "' + email + '" AND password = "' + password + '" LIMIT 1';
    connection.query(query, function(err, rows) {
      if(err){
        console.log('ERROR.SELECT_DB: ', err);
        throw err;
    }
      var userId = rows.length? rows[0].user_id: false;
      if (userId) {
        req.session.user_id = userId;
        res.redirect('/');
      } else {
        res.render('login.ejs', {
          title: 'ログイン',
          noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
        });
      }
    });
  }


//logout
exports.logout =  function(req, res, next) {
    req.session.destroy();
    res.redirect('/login');
  }


//register
  //get
exports.register =(req, res, next)=>{
    res.render('register.ejs', {
        title:'新規会員登録'
    });
 }

   //post
exports.register_post =  function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    var emailExistsQuery = 'SELECT * FROM user WHERE email = "' + email + '" LIMIT 1'; // 追加
    var registerQuery = 'INSERT INTO user (name, email, password, created_at) VALUES ("' + name + '", ' + '"' + email + '", ' + '"' + password + '", ' + '"' + createdAt + '")'; // 変更
    connection.query(emailExistsQuery, function(err, email) {
      if(err){
        console.log('ERROR.SELECT_DB: ', err);
        throw err;
    }
      var emailExists = email.length;
      if (emailExists) {
        res.render('register.ejs', {
          title: '新規会員登録',
          emailExists: '既に登録されているメールアドレスです'
        });
      } else {
        connection.query(registerQuery, function(err, rows) {//userテーブルの記述
          var userId = rows.insertId;
          console.log(userId)
          console.log(name)//userテーブルにinsertした名前をshopテーブルのアカウント名にもインサート出来るようにする。
          connection.query('INSERT INTO shop(user_id, account_name, created_at) VALUES(?,?,?)',[userId, name,createdAt],(error,results)=>{
            if(error){
              console.log('ERROR.SELECT_DB: ', error);
              throw error;
          }
           connection.query('INSERT INTO map(created_at, user_id) VALUES(?,?)',[createdAt, userId],(error,results)=>{
            if(error){
              console.log('ERROR.SELECT_DB: ', error);
              throw error;
          }
          res.redirect('/login');
           })
          });
        });
      }
    });
  }

