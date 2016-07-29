angular.module('myApp').controller('rankingController', ['$scope','$http', 
  function ($scope, $http) {
      $scope.allGames = {};
      $scope.allGames_seven = {};
      $scope.index = 1;
      var freeGameEntry,paidGameEntry,hotGameEntry;
      var previousNdaysOfData;

      /*显示数据*/
      $scope.showRanking= function () {
         $http.get("https://itunes.apple.com/cn/rss/topfreeapplications/limit=150/genre=6014/json")
          .success(function(data, status) {
            console.log("Successful ranking data retrieval");
            $scope.allGames.freeGames = data.feed.entry;
            freeGameEntry = $scope.allGames.freeGames;
          }).error(function(data, status) {
             alert("Error on getting ranking data");
          });

          $http.get("https://itunes.apple.com/cn/rss/toppaidapplications/limit=150/genre=6014/json")
          .success(function(data, status) {
            console.log("Successful ranking data retrieval");
            $scope.allGames.paidGames = data.feed.entry;
            paidGameEntry = $scope.allGames.paidGames;
          }).error(function(data, status) {
             alert("Error on getting ranking data");
          });

          $http.get("https://itunes.apple.com/cn/rss/topgrossingapplications/limit=150/genre=6014/json")
          .success(function(data, status) {
            console.log("Successful ranking data retrieval");
            $scope.allGames.hotGames = data.feed.entry;
            hotGameEntry = $scope.allGames.hotGames;
          }).error(function(data, status) {
             alert("Error on getting ranking data");
          });
      }

      /*显示持续在榜单的数据*/
      $scope.show7DaysGames = function(days){
        getPeriodDataSet("rankInfo_paids", days);
        getPeriodDataSet("rankInfo_frees", days);
        getPeriodDataSet("rankInfo_hots", days);

        //  =stayWithinTimePeriod(sevenDaysData_free,days);
        //  =stayWithinTimePeriod(sevenDaysData_paid,days);
        //  =stayWithinTimePeriod(sevenDaysData_hot,days);
       
      }

      /*上传数据*/
      $scope.uploadRanking = function (){
        
        function postInfo(gameData, i , type , postName) {
          if(i>=freeGameEntry.length){
            return;
          }
          var d = new Date();
          var body_free={
                uploadDate: d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+"",
                rank: i+1+"",
                name: gameData[i]["im:name"].label,
                gameId: gameData[i].id.attributes["im:id"],
                imgUrl: gameData[i]["im:image"][2].label,
                link: gameData[i].id.label,
                type: type,
                price: gameData[i]["im:price"].attributes.amount+"CNY",
                company: gameData[i]["im:artist"].label,
                releaseDate: gameData[i]["im:releaseDate"].label
                // jsonFile: gameData[i]       
          };

          $http.post(postName, JSON.stringify(body_free)).success(function(data, status) {
            console.log("Successful upload"); 
            postInfo(gameData,i+1,type,postName);        
          }).error(function(data, status) {
             alert("Data upload failed!")
          });
        }

        postInfo(freeGameEntry, 0 , "free","/rankInfo_free");
        postInfo(paidGameEntry, 0 , "paid","/rankInfo_paid");
        postInfo(hotGameEntry, 0 , "hot","/rankInfo_hot");  
        
      }

      function getPeriodDataSet(tableName, period){
        
        var dataSet = [];
        function getData(period, i){
          
          if(i > period){
            console.log(dataSet);
            if(tableName === "rankInfo_frees"){
              $scope.allGames_seven.freeGames = stayWithinTimePeriod(dataSet,period);
            }
            else if(tableName === "rankInfo_paids"){
              $scope.allGames_seven.paidGames = stayWithinTimePeriod(dataSet,period);
            }
            else{
               $scope.allGames_seven.hotGames = stayWithinTimePeriod(dataSet,period);
            }
           
            // return dataSet;
            return;
          }
          var d = new Date();
            d.setDate(d.getDate() - i);
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            var curr_year = d.getFullYear();
            var newDate = curr_month+"-"+curr_date+"-"+curr_year+"";
            
            $http.get("/getDataInfo?date="+newDate+"&table="+tableName).success(function(data, status) {
              // console.log("Successful download "+ data);

              dataSet.push(data);
              
              getData(period,i+1);  
            }).error(function(data, status) {
                alert("Data download failed!")
            });
        }
        getData(period, 0);

        // return dataSet;
      }

      /*从dataset里取得 period 天数里一直在排行榜上的游戏，return数据为array，array unit包涵所有游戏信息*/

      function stayWithinTimePeriod(dataSet, period){
        
        var hashMap = parseDataArrayIntoObject(dataSet);

        var result = [];

        for( var key in Object.keys(hashMap)){
          console.log(hashMap[Object.keys(hashMap)[key]].count);
          if(hashMap[Object.keys(hashMap)[key]].count === period+1){
            result.push(hashMap[Object.keys(hashMap)[key]].content);
          }
        }
        // console.log("result is :"+result);
        return result;
      }

      /*将dataset数组转化为记录出现次数与包涵游戏数据的object类型，并return这个Object*/

      function parseDataArrayIntoObject(array){
        // console.log("array :"+array);
        var result = {};
        for(var i=0;i<array.length;i++){
          for(var j=0;j<array[i].length;j++){
            var tem = result[array[i][j].gameId];
            if(tem == undefined){
              result[array[i][j].gameId] = {};
              result[array[i][j].gameId].count = 1;
              result[array[i][j].gameId].content = array[i][j];
            }else{
              result[array[i][j].gameId].count = tem.count+1;
            }
          }
        }
        // console.log("result :"+Object.keys(result));
        return result;
      }

      /*从数据库中得取离当前时间 period 天数的数据*/

      $scope.getDataFromDB = function (tableName, period){
          var d = new Date();
          d.setDate(d.getDate() - period);
          var curr_date = d.getDate();
          var curr_month = d.getMonth();
          var curr_year = d.getFullYear();
          var newDate = curr_month+"-"+curr_date+"-"+curr_year+"";
        
          $http.get("/getDataInfo?date="+newDate+"&table="+tableName).success(function(data, status) {
            console.log("Successful download "+ data);    
          }).error(function(data, status) {
             alert("Data download failed!")
          });
      }

      /*比较两组数据，得出新进入排名的数据，并return所有符合条件数据的集合*/

      function getNewHotGames(previousData, currentData){
        var hashmap = {};
        var result = [];
        for(var i=0;i<previousData.length;i++){
          hashmap[previousData[i].gameId] = 1;
        }

        for(var i=0;i<previousData.length;i++){
          if(hashmap[currentData[i].gameId] === 1){
            result.push(currentData[i]);
          }
        }

        return result;
      }

 /*比较两组数据，得出跌出排名的数据，并return所有符合条件数据的集合*/

      function getOutDatedGames(previousData, currentData){
        var hashmap = {};
        var result = [];
        for(var i=0;i<currentData.length;i++){
          hashmap[currentData[i].gameId] = 1;
        }

        for(var i=0;i<previousData.length;i++){
          if(hashmap[previousData[i].gameId]!== 1){
            result.push(previousData[i]);
          }
        }

        return result;
      }
  }
]);