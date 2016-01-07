var express = require('express');
var router = express.Router();
var User = require('../../lib/user.js');
/* GET home page. */
router.get('/register', function(req, res, next) {
    res.locals.removeMessage();
    res.render('login/register', { title: 'register',type: ''  });
});

router.post('/register', function(req, res, next) {
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;
    User.getByName(userName, function(err, data){
        if(err) return next(err);
        if(data.id){
            res.error("userName is alreadly token");
            ////重定向为登陆表单
            res.redirect("back");
        }else{
           data = new User({
              name: userName,
              pass:userPassword
           });
           data.save(function(err){
               if(err) return next(err);
               ////req.session.uid = data.id;
               ////注册成功后跳转登陆页面
               res.redirect("/login");
           })
        }
    });
});
module.exports = router;
