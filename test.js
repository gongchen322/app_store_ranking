
/*从数据库里取得 period 天数的数据， 并return这个数据，数据类型为array*/

function getPeriodDataSet(period){
	var dataSet = [];
	function getData(period, i){
		if(i >= period){
			return dataSet;
		}
		var d = new Date();
	    d.setDate(d.getDate() - period);
	    var curr_date = d.getDate();
	    var curr_month = d.getMonth();
	    var curr_year = d.getFullYear();
	    var newDate = curr_month+"-"+curr_date+"-"+curr_year+"";
	    
	    $http.get("/getDataInfo/"+newDate).success(function(data, status) {
	     	// console.log("Successful download "+ data); 
	     	dataSet.push(data);
	     	getData(period,i+1);  
	    }).error(function(data, status) {
	        alert("Data download failed!")
	    });
	}
	return getData(period, 0);
}

/*从dataset里取得 period 天数里一直在排行榜上的游戏，return数据为array，array unit包涵所有游戏信息*/

function stayWithinTimePeriod(dataSet, period){
	var hashMap = parseDataArrayIntoObject(dataSet);
	var result = [];
	for( key in Object.keys(hashMap)){
		if(hashMap.key.count === period){
			result.push(hashMap.key.content);
		}
	}
	return result;
}

/*将dataset数组转化为记录出现次数与包涵游戏数据的object类型，并return这个Object*/

function parseDataArrayIntoObject(array){
	var result = {};
	for(var i=0;i<array.length;i++){
		for(var j=0;j<array[i].length;j++){
			var tem = result[array[i][j].gameId].count;
			if(tem == undefined){
				result[array[i][j].gameId].count = 1;
				result[array[i][j].gameId].content = array[i][j];
			}else{
				result[array[i][j].gameId].count = tem+1;
			}
		}
	}
	return result;
}