


exports.generateSessionIdCookie = function(uniqueKern){
	return uniqueKern + '_' + Math.random();
}