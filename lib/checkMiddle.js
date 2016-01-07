////校验中间件
exports.notSpace = function( name){
	return function(req, res, next){
		var myName = req.body[name];
		if(myName ==""){
			res.error(name + "不能为空");
			res.redirect("back");
		}else{
			next();
		}
	}
}