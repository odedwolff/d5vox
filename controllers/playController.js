var dbAccess=require('../db_abst/db_access');
var User=require('../models/user');
//require(json);


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


exports.updateStat=function(req, res, next){
	//console.log("updateStat()");
	console.log("updateStat, req=" + JSON.stringify(req.body));
	// var sessionId=req.cookies['sessionId'];
	// console.log('sessionId from cookie= '+ sessionId);
	// User.find({active_session_id:sessionId})
	// .then(){
	//	get params
		// var nmAttempts = 
	// }
	res.json({});
}


function enableButtons(flag){
	document.getElementById('btnRight').disabled=flag;
	document.getElementById('btnWrong').disabled=flag;
}
























