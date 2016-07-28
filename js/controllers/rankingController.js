angular.module('myApp').controller('rankingController', ['$scope','$http', 
  function ($scope, $http) {
      $scope.allGames = {};
      $scope.index = 1;
      var freeGameEntry,paidGameEntry,hotGameEntry;

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

      /*从数据库中得取离当前时间 period 天数的数据*/

      $scope.getDataFromDB = function (period){
          var d = new Date();
          d.setDate(d.getDate() - period);
          var curr_date = d.getDate();
          var curr_month = d.getMonth();
          var curr_year = d.getFullYear();
          var newDate = curr_month+"-"+curr_date+"-"+curr_year+"";
        
          $http.get("/getDataInfo/"+newDate).success(function(data, status) {
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