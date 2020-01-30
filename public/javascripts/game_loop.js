function loadWords(){
	var xhr = new XMLHttpRequest();
	//xhr.open('PUT', 'myservice/user/1234');
	xhr.open('POST', '/play/loadWordsAndStats');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			var userInfo = JSON.parse(xhr.responseText);
			console.log(userInfo);
		}else{
			console.log("reply status:" + xhr.status);
		}
	};
	xhr.send(JSON.stringify({
		sessionId:_sessionId
	}));
}

function enableGameLoop(flag){
	if(flag){
		document.getElementById('divReady').display='block';
	}else{
		document.getElementById('divReady').display='none';
	}
}