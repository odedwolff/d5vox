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
			var srcLangCode=req.body.srcLangCode;
			dbAccess.loadAllWordsAndTheirAvlStat(/*"JP"*/srcLangCode, userName, null, 
				(results)=>{
					res.json({results:results});
				}
			);
	});
	
	//res.json({hello:'world'});
}


exports.updateStat=function(req, res, next){
	var userName;
	//console.log("updateStat()");
	console.log("updateStat, req=" + JSON.stringify(req.body));
	var sessionId=req.cookies['sessionId'];
	console.log('sessionId from cookie= '+ sessionId);
	User.find({active_session_id:sessionId})
	.then((foundUsers)=>{
		userName=foundUsers[0]['user_name'];
		console.log('retreived user name=' + userName);
	})
	.then(
		()=>{
			var userStatParams = {
				userName:userName, 
				wordId:req.body.wordId, 
				langCode:req.body.langCode, 
				nmAttempts:req.body.nmAttempts, 
				nmSuccess:req.body.nmSuccess
			}
			if(req.body.needsInsert){
				dbAccess.insertUserStat(userStatParams, 
				(err, newInstance)=>{
						res.json({insrtedInstance:JSON.stringify(newInstance)});
					}
				);
			}else{
				dbAccess.updateUserStat(userStatParams, 
				(err, opInfo)=>
					{
						console.log("user stat update callback, opInfo:" + JSON.stringify(opInfo));
						if(!err){
							res.json({msg:"doc updated", opInfo:JSON.stringify(opInfo)});
						}
					}
				);
			}
		}
	)
	//res.json({});
}



exports.settingGet = function(req, res, next) {     
  //res.render('user_login', {title:"Enter User Details"} );
  res.render('settings', {} );
};


exports.postLoadAllLang = function(req,res){
	console.log("postLoadAllLang()");
	
	dbAccess.loadAllLanguage().
	then(
		function(dat){
			res.json({loadedLang:JSON.stringify(dat)});
		}
	).catch(
		function(err){
			console.log("error at laoding languages" + err);
		}
	);
}



























