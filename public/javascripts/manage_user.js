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
	console.log("cookies=" + document.cookie);
	const sessionCookie=getCookie('sessionId');
	if(sessionCookie){
		const loggedUserName=getCookie('loggedUserName');
		setPanelUserLoggedIn(loggedUserName);
	}else{
		setPanelUserLoggedOut();
	}
}



//reads cookie and sends it expicetly...not necessery i guess 

function sendLogOutOld(){
	const sessionId = getCookie('sessionId');
	if(!sessionId){
		console.log('no session id cookie set');
		return; 
	}
	console.log("session id=" + sessionId);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/users/logout');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			var data = JSON.parse(xhr.responseText);
			//console.log("resonpnse data success code:" + data{});
			const success = data["success"];
			if(success){
				setCook
			}
		}
	};
	xhr.send(JSON.stringify({
		session_id: sessionId
	}));
	
}

function sendLogOut(){
	const url= '/users/logout';
	fetch(url, {method: 'POST'}).
	then(
		(res)=>{console.log("resulst from logout" + res);}
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


