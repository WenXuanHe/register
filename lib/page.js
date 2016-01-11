var info = require("./info");
var url = require('url');
module.exports = function(count){
	return function(req, res, next){
		var userName = req.user.name;
		if(userName ==undefined){
			req.page = res.locals.page = false;
			next();
		}else{
			info.getLength(userName, function(err, len){
				if(err) next(err);
				var pageCount = count || 10;
				var currentPage = Math.max(
					parseInt(req.param('page') || '1', 10), 1
				);
				req.page = res.locals.page = {
					number:currentPage,
					perpage:pageCount,
					from:(currentPage-1) * pageCount,
					to:(currentPage - 1) * pageCount + pageCount -1,
					total:len,
					count:Math.ceil(len/pageCount)
				};
				
				res.locals.pathname = url.parse(req.url).pathname;
				next();
			});
		}
	}
}