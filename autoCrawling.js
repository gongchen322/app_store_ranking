var axios = require('axios');
var db = require('./db.js');

var autoCrawler ={};


autoCrawler.saveDataToDB = function() {
	console.log("run saveDataToDB");
	function getData(i){
		if(i >=3 ){
			return;
			console.log("All done!");
		}

		var urls=['https://itunes.apple.com/cn/rss/topfreeapplications/limit=150/genre=6014/json',"https://itunes.apple.com/cn/rss/toppaidapplications/limit=150/genre=6014/json","https://itunes.apple.com/cn/rss/topgrossingapplications/limit=150/genre=6014/json"];
		var tables = ['rankInfo_free','rankInfo_paid','rankInfo_hot'];
		var gameType = ['Free','Paid','Hot'];
		axios.get(urls[i]).then(function (response) {
			console.log(response);
  			console.log("save data for "+gameType[i]);
	    	saveData(response.data.feed.entry, tables[i], gameType[i]);
	    	getData(i+1);
	  	})
	  	.catch(function (error) {
	    	console.log(error);
	  	});	
	}

	function saveData(gameData, tableType, gameType){
		for(var i=0;i<gameData.length;i++){
			var d = new Date();
	        var body={
	            uploadDate: d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+"",
	            rank: i+1+"",
	            name: gameData[i]["im:name"].label,
	            gameId: gameData[i].id.attributes["im:id"],
	            imgUrl: gameData[i]["im:image"][2].label,
	            link: gameData[i].id.label,
	            type: gameType,
	            price: gameData[i]["im:price"].attributes.amount+"CNY",
	            company: gameData[i]["im:artist"].label,
	            releaseDate: gameData[i]["im:releaseDate"].label
	            // jsonFile: gameData[i]       
	        };
	        db[tableType].create(body).then(function (data) {
				
			},function (e) {
				
			});
		}
		console.log("saved data to "+tableType);
		
	}
	getData(0);


}
	

module.exports = autoCrawler;