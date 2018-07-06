//console.log(sessionStorage.getItem("Bearer"));
//console.log(sessionStorage.getItem("user"));

function organizeDropdown(arr){
	return arr.sort(function(a,b){
		if(a.name < b.name){
			return -1
		}
		if(a.name > b.name){
			return 1
		}
		return 0
	});
}

function createDataString(data){
	let newString;
	const newdata = organizeDropdown(data.data);
	for (let i = 0;i < newdata.length;i++){
		//console.log(data.data[i].name);
		newString += `<option value="${newdata[i].name}">${newdata[i].name}</option>`;
	}
	return newString;
}

function checkDropdowns(){

	//add get requests to api
	$(".jsHeroSelect1").change(function(){
		let selectedVal = $(this).find(':selected').val();
		console.log(selectedVal);
	});
	$(".jsHeroSelect2").change(function(){
		let selectedVal = $(this).find(':selected').val();
		console.log(selectedVal);
	});
	$(".jsHeroSelect3").change(function(){
		let selectedVal = $(this).find(':selected').val();
		console.log(selectedVal);
	});
}

function populateHeroData(data){
	//console.log(data);
	//console.log(data.data[0]);
	options = createDataString(data);
	$(".jsHeroSelect1").append(options);
	$(".jsHeroSelect2").append(options);
	$(".jsHeroSelect3").append(options);
}

function getHeroes(){
	//html href
	//console.log("get")
	const settings = {
		method: "GET",
		headers:{ 
			"Authorization": 'Bearer ' + sessionStorage.getItem("Bearer")
		},
		url: "/protected/heroes",
		success: populateHeroData,
		error: function(err){
			console.log(err);
		}
	};
	$.ajax(settings);	
}

function populateMastermindData(data){
	//console.log(data.data[0]);
	options = createDataString(data);
	$(".jsMastermindSelect").append(options);
}

function getMasterminds(){
	//html href
	//console.log("get")
	const settings = {
		method: "GET",
		headers:{ 
			"Authorization": 'Bearer ' + sessionStorage.getItem("Bearer")
		},
		url: "/protected/masterminds",
		success: populateMastermindData,
		error: function(err){
			console.log(err);
		}
	};
	$.ajax(settings);	
}

function populateSchemeData(data){
	//console.log(data.data[0]);
	options = createDataString(data);
	$(".jsSchemeSelect").append(options);
}

function getSchemes(){
	//html href
	//console.log("get")
	const settings = {
		method: "GET",
		headers:{ 
			"Authorization": 'Bearer ' + sessionStorage.getItem("Bearer")
		},
		url: "/protected/scheme",
		success: populateSchemeData,
		error: function(err){
			console.log(err);
		}
	};
	$.ajax(settings);	
}

function populateHenchmenData(data){
	//console.log(data.data[0]);
	options = createDataString(data);
	$(".jsHenchmenSelect").append(options);
}

function getHenchmen(){
	//html href
	//console.log("get")
	const settings = {
		method: "GET",
		headers:{ 
			"Authorization": 'Bearer ' + sessionStorage.getItem("Bearer")
		},
		url: "/protected/henchmen",
		success: populateHenchmenData,
		error: function(err){
			console.log(err);
		}
	};
	$.ajax(settings);	
}

function populateVillainData(data){
	//console.log(data.data[0]);
	console.log(choice);
	options = createDataString(data);
	$(".jsVillainSelect").append(options);
}

function getVillains(){
	//html href
	//console.log("get")
	let choice = "test";
	const settings = {
		method: "GET",
		headers:{ 
			"Authorization": 'Bearer ' + sessionStorage.getItem("Bearer")
		},
		url: "/protected/villains",
		success: populateVillainData,
		error: function(err){
			console.log(err);
		}
	};
	$.ajax(settings);	
}

function getAuthSuccess(data){
	//console.log(data);
	$(".jsUserName").text(sessionStorage.getItem("user") + " Logged In");
	console.log(sessionStorage.getItem("user"));
}

function getAuthError(err){
	console.log(err);
	//alert("Please login");
	window.location.href = "/index.html";
}

function getAuth(){
	//html href	
	console.log("Attempt to get menu");
	
	const settings = {
		method: "GET",
		headers:{ 
			"Authorization": 'Bearer ' + sessionStorage.getItem("Bearer")
		},
		url: "/protected",
		success: getAuthSuccess,
		error: getAuthError
	};
	$.ajax(settings);
	
}

function addedScore(data){
	//console.log(data);

	$(".jsMessage").text("Score Added!");
	$(".jsWinSelect").val("y");
	$(".jsTurnInput").val("");
	$(".jsEscapedVillains").val("");	
	$(".jsSchemesInput").val("");
	$(".jsBystanderInput").val("");
	$(".jsVictoryPointInput").val("");
	$(".jsMastermindSelect").val("none");
	$(".jsHeroSelect1").val("none");
	$(".jsHeroSelect2").val("none");
	$(".jsHeroSelect3").val("none");
	$(".jsHenchmenSelect").val("none");
	$(".jsVillainSelect").val("none");

}

function addScoreError(err){
	//console.log(err);
	$(".jsMessage").text("An error occured");
}

function addScore(){
	$(".jsScoreEntry").submit(function(event){
		event.preventDefault();
		let scoreData = {
			username:sessionStorage.getItem("user"),
			score:{win: $(".jsWinSelect").val(),
			numTurns: $(".jsTurnInput").val(),
			numVillains: $(".jsEscapedVillains").val(),
			numSchemes: $(".jsSchemesInput").val(),
			numBystanders: $(".jsBystanderInput").val(),
			victoryPoints: $(".jsVictoryPointInput").val(),
			mastermind: $(".jsMastermindSelect").val(),
			scheme: $(".jsSchemeSelect").val(),
			hero1: $(".jsHeroSelect1").val(),
			hero2: $(".jsHeroSelect2").val(),
			hero3: $(".jsHeroSelect3").val(),
			henchmen: $(".jsHenchmenSelect").val(),
			villain: $(".jsVillainSelect").val()
			}

		};

		const settings = {
		method: "PUT",
		headers:{ 
			"Authorization": 'Bearer ' + sessionStorage.getItem("Bearer")
		},
		url: "/api/users/addscore",
		data: JSON.stringify(scoreData),
		success: addedScore,
		error: addScoreError,
		dataType: 'json',
		contentType: 'application/json'
	};
		$.ajax(settings);
	});
}

function checkBoxListener(){
	//will have to make calls again to db then repopulate dropdowns with correct data
	//can reuse functions if modify slightly
	//add checks for checkboxes in the functions?
	//before string is created check checkboxes then filter out data
	$(".jsBaseCheck").change(function(){
		if($(".jsBaseCheck").is(":checked")){
			console.log("base checked");
		}
		else{
			console.log("base unchecked");
		}
	});

	$(".jsDarkCityCheck").change(function(){
		if($(".jsDarkCityCheck").is(":checked")){
			console.log("dark city checked");
		}
		else{
			console.log("dark city unchecked");
		}
	});
}

function initializeMenu(){
	//possibly have optional paramters so that can select for expansions
	//https://developer.marvel.com/
	//https://comicvine.gamespot.com/api/
	getMasterminds();
	getHeroes();
	getAuth();
	getSchemes();
	getHenchmen();
	getVillains();
	addScore();
	checkDropdowns();
	checkBoxListener();
}

$(initializeMenu);
//getMenu();