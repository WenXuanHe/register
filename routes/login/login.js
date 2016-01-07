var express = require('express');
var router = express.Router();
var user = require('../../lib/user.js');
/* GET home page. */
router.get('/login', function(req, res, next) {
    res.locals.removeMessage();
    res.render('login/login', { title: 'Express',type: ''});
});

router.get('/loginout', function(req, res, next) {
    ////退出登陆就是破坏session
    req.session.destroy(function(err){
        if(err) return next(err);
        res.redirect("/");
    });
});


router.post('/loginIn', function(req, res, next) {
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;
    user.authortich(userName, userPassword, function(err, data){
        if(err) return next(err);
        if(data.id){
            ////登陆成功，把id值存入session，以便从redis中取得整条数据
            req.session.uid = data.id;
            res.redirect("/");
        }else{
            res.error(data.message);
            res.redirect("/login");
        }
    });
});
module.exports = router;
