var wordsInfo;


function loadWords(){
	var xhr = new XMLHttpRequest();
	//xhr.open('PUT', 'myservice/user/1234');
	xhr.open('POST', '/play/loadWordsAndStats');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			var userInfo = JSON.parse(xhr.responseText);
			console.log(userInfo);
			wordsInfo = propsToArray(userInfo);
			enableGameLoop(true);
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
		document.getElementById('divReady').style.display='block';
	}else{
		document.getElementById('divReady').style.display='none';
	}
}


function propsToArray(resultsContainer){
	var arr = [];
	var obj = resultsContainer.results;
	for (const value of Object.values(obj)) { 
		arr.push(value);
	}
	return arr; 
}