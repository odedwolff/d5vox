function loadLanguages(){
	var xhr = new XMLHttpRequest();
	//xhr.open('PUT', 'myservice/user/1234');
	xhr.open('POST', '/play/loadLangs');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			var userInfo = JSON.parse(xhr.responseText);
			console.log(userInfo);
			populateLangs(userInfo);
		}else{
			console.log("reply status:" + xhr.status);
		}
	};
	
	//send empty?
	xhr.send(JSON.stringify({
		
	}));
}


function populateLangs(dat){
	var langCode, newItemHtml;
	var domCombo=document.getElementById('combLang');
	var langsInfoArr= JSON.parse(dat.loadedLang);
	for (i in langsInfoArr){
		langCode = langsInfoArr[i].code;
		//option(value='1') 'option1' 
		//newItemHtml = "option(value='" + langCode + "')'" + langCode ;
		newItemHtml = "<option value='" + langCode + "'>  " + langCode +  " </option>";
		domCombo.innerHTML = domCombo.innerHTML + newItemHtml;
	}
}


loadLanguages();

