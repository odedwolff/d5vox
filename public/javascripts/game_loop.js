var wordsInfo;


const settings = {
	defaultStat : {
		nmAttempts:4,
		nmSuccuss:2
	}
}

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
			//applyWordsFamiliarity();
			applyDefaultStats();
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

/**
nmGuesses and nmSuccess are both assumed to be > 0 !!! 
**/

function wordFamiliarity(nmGuesses, nmSuccess){
	//success factor- rate of good guesses to overall gusses
	const succFactor = nmSuccess / nmGuesses;
	//0=>0, then asimpthotically getting at 1. this will mean that 12/12 will scor ebetter than 3/3, because the former 
	//inidcates better demonstrated knowledge of the word 
	const expFactor =  1-(1/(nmGuesses+1));
	return expFactor * succFactor ;
}



// function applyWordsFamiliarity(){
	// var word; 
	// var familiarity;
	// for(i in wordsInfo){
		// word=wordsInfo[i];
		
		// if(word.stat){
			// familiarity=wordFamiliarity(word.stat.attemptsCount, word.stat.correctCount);
			// word.familiarity=familiarity;
		// }else{
			// familiarity=wordFamiliarity(0, 0);
			// word.familiarity=familiarity;
		// }
	// }
// }


//for words that don't have a stats entyr, create a default one, whereas attempts and succes both > 0.
function applyDefaultStats(){
	for (i in wordsInfo){
		if(!wordsInfo[i].stat){
			wordsInfo[i].stat = {
				attemptsCount:settings.defaultStat.nmAttempts,
				correctCount:settings.defaultStat.nmSuccuss,
				//inidicates the entry was not loaded from datasbase, and will need 
				//to have an entry inserted 
				needsDataseInsert:true
				}
		}
	}
}




//for each word a score is clacualted based on it's familairy, weitght and an evenly distributed random value,
//proportional to all 3 of these parameters. the word with the highest score is then being slected  
function selectNextWord(){
	var topScore = 0; 
	var topScoreIdx;
	var score; 
	for(i in wordsInfo){
		score = (wordsInfo[i].word.weight  * Math.random() ) / 
		wordFamiliarity(wordsInfo[i].stat.attemptsCount, wordsInfo[i].stat.correctCount);
		if(score > topScore){
			topScore = score;
			topScoreIdx = i; 
		}
	}
	return{topScore:topScore, topScoreIdx:topScoreIdx}
}

function testNextWord(){
	var nextWordInfo = selectNextWord();
	console.log("returned next word: score=" + nextWordInfo.topScore + ": index=" + nextWordInfo.topScoreIdx);
	
}








