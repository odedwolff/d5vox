var gameState = { 
	 srcLanguageCode:"JP",
	 trgLangCode:"IT",
	 wordsInfo:null,
	 currentWordIdx:-1
}
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
			gameState.wordsInfo = propsToArray(userInfo);
			enableGameLoop(true);
			//applyWordsFamiliarity();
			applyDefaultStats();
			//select first word, following words will be select by user's button press 
			selectNextWord();
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



//for words that don't have a stats entry, create a default one, whereas attempts and succes both > 0.
function applyDefaultStats(){
	for (i in gameState.wordsInfo){
		if(!gameState.wordsInfo[i].stat){
			gameState.wordsInfo[i].stat = {
				attemptsCount:settings.defaultStat.nmAttempts,
				correctCount:settings.defaultStat.nmSuccuss,
				//inidicates the entry was not loaded from datasbase, and will need 
				//to have an entry inserted 
				statneedsDataseInsert:true
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
	for(i in gameState.wordsInfo){
		score = (gameState.wordsInfo[i].word.weight  * Math.random() ) / 
		wordFamiliarity(gameState.wordsInfo[i].stat.attemptsCount, gameState.wordsInfo[i].stat.correctCount);
		if(score > topScore){
			topScore = score;
			topScoreIdx = i; 
		}
	}
	gameState.currentWordIdx = topScoreIdx; 
	showAnswer(false);
	updateUICurrentQ();
	return{topScore:topScore, topScoreIdx:topScoreIdx}
}

function testNextWord(){
	
	var nextWordInfo = selectNextWord();
	
	console.log("returned next word: score=" + nextWordInfo.topScore + ": index=" + nextWordInfo.topScoreIdx);
	
}

function updateUICurrentQ(){
	var crurentWordStat = gameState.wordsInfo[gameState.currentWordIdx];
	document.getElementById("lblCurrentQuestion").innerHTML=crurentWordStat.word.word;
	document.getElementById("lblCurrentAnswer").innerHTML= 
		crurentWordStat.word.transTextByLang[gameState.trgLangCode];
}



function showAnswerClick(){
	showAnswer(true);
	enableCorrectButtons(true);
}


function showAnswer(flag){
	var elm=document.getElementById("lblCurrentAnswer");
	if(flag){
		elm.style.visibility='visible';
	}else{
		elm.style.visibility='hidden';
	}
}


function right(){
	answer({correct:true})
}
function wrong(){
	answer({correct:false})
}

function answer(params){
	enableCorrectButtons(false);
	setTimeout(()=>{selectNextWord()},700);
	var crurentWordStat = gameState.wordsInfo[gameState.currentWordIdx];
	crurentWordStat.stat.attemptsCount+=1;
	if(params.correct){
		crurentWordStat.stat.correctCount+=1;
	}
	
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/play/updateStat');	
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function(wordInfoIdx) {
		if(xhr.status==200){
			//mark the stats as saved in database(even it already was)
			//this will indicate in the future it shouldn't be insteretd, only updated 
			gameState.wordsInfo[wordInfoIdx].stat.statneedsDataseInsert=false;
		}
		else{
			console.log("error at updating stats, http status " + xhr.status);
		}
	}.bind(null, gameState.currentWordIdx);
	
	
	xhr.send(JSON.stringify({
		wordId:crurentWordStat.word._id,
		nmAttempts:crurentWordStat.stat.attemptsCount,
		nmSuccess:crurentWordStat.stat.correctCount,
		needsInsert:crurentWordStat.stat.statneedsDataseInsert? true : false
	}));
}



function enableCorrectButtons(flag){
	document.getElementById('btnRight').disabled=!flag;
	document.getElementById('btnWrong').disabled=!flag;
}







