console.log("welcome to the jungle");



function setPanelUserLoggedIn(userName){
	document.getElementById("lablUser").innerHTML  = userName;
	document.getElementById("divLoggedIn").style.display="";
	document.getElementById("divLoggedOut").style.display="none";
}

function setPanelUserLoggedOut(){
	document.getElementById("divLoggedIn").style.display="none";
	document.getElementById("divLoggedOut").style.display="";
}

function initDoc(){
	console.log("initDoc()");
	updateLoginStatus();
}

function updateLoginStatus(){
	console.log("cookies=" + document.cookie);
	const sessionCookie=getCookie('sessionId');
	if(sessionCookie){
		const loggedUserName=getCookie('loggedUserName');
		setPanelUserLoggedIn(loggedUserName);
	}else{
		setPanelUserLoggedOut();
	}
}


function sendLogOut(){
	const url= '/users/logout';
	fetch(url, {method: 'POST'}).
	then(
		(res)=>{console.log("resulst from logout" + res);
		updateLoginStatus();		
		}
	)
}



function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


