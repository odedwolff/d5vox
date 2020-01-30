var dbAccess=require('../db_abst/db_access');
var User=require('../models/user');


exports.practiceLoopGet = function(req, res, next) {     
  //res.render('user_login', {title:"Enter User Details"} );
  res.render('practice_loop', {} );
};




exports.loadWordsAndStats=function(req, res, next){
	var sessionId=req.cookies['sessionId'];
	console.log('sessionId from cookie= '+ sessionId);
	User.find({active_session_id:sessionId})
	.then(function(foundUsers){
			var userName=foundUsers[0]['user_name'];
			console.log('retreived user name=' + userName);
			dbAccess.loadAllWordsAndTheirAvlStat("JP", userName, null, 
				(results)=>{
					res.json({results:results});
				}
			);
	});
	
	//res.json({hello:'world'});
}