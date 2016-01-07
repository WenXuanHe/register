var User = require("./user");
////添加中间件，通过判断session中的uid值来判断是否登陆，根据两种不同来加载不同的菜单
module.exports = function(req, res, next){
	var uid = req.session.uid;
	if(uid){
		User.get(uid, function(err, data){
			if (err) return next(err);
			req.user = res.locals.user = data;
			next();
		});
	}else{
		req.user = res.locals.user = false;
		return next();
	}
}