angular.module('myApp').controller('rankingController', ['$scope','$http', 
  function ($scope, $http) {
      $scope.allGames = {};
      $scope.index = 1;
      var freeGameEntry,paidGameEntry,hotGameEntry;
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
      $scope.uploadRanking = function (){
        
        function postInfo(gameData, i , type , postName) {
          if(i>=freeGameEntry.length){
            return;
          }
          var body_free={
                uploadDate: new Date().toLocaleString(),
                rank: i+1+"",
                name: gameData[i]["im:name"].label,
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
  }
]);