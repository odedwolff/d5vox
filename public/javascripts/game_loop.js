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
			applyWordsFamiliarity();
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

//scale: closer to 1 inidicates better familiarity, closer to 0 worse 
function wordFamiliarity(nmGuesses, nmSuccess){
	//success factor- rate of good guesses to overall gusses
	var succFactor;
	if(nmGuesses==0){
		succFactor=0;
	}else{
		succFactor = nmSuccess / nmGuesses;
	}
	//0=>0, then asimpthotically getting at 1 
	const expFactor =  1-(1/(nmGuesses+1));
	return expFactor * succFactor;
}

function applyWordsFamiliarity(){
	var word; 
	var familiarity;
	for(i in wordsInfo){
		word=wordsInfo[i];
		
		if(word.stat){
			familiarity=wordFamiliarity(word.stat.attemptsCount, word.stat.correctCount);
			word.familiarity=familiarity;
		}else{
			familiarity=wordFamiliarity(0, 0);
			word.familiarity=familiarity;
		}
	}
}



