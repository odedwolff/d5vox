var dbAccess=require('../db_abst/db_access');
var User=require('../models/user');


exports.practiceLoopGet = function(req, res, next) {     
  //res.render('user_login', {title:"Enter User Details"} );
  res.render('practice_loop', {} );
};




exports.loadWordsAndStats=function(req, res, next){
	var sessionId=req.cookies['sessionId'];
	User.find({active_session_id:sessionId})
	.then(function(foundUser){
			var userName=foundUser.user_name;
			dbAccess.loadAllWordsAndTheirAvlStat("JP", userName, null, 
				(results)=>{
					res.json({results:results});
				}
			);
	});
	
	//res.json({hello:'world'});
}