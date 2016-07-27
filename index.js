var myApp = angular.module('myApp', ['ui.router','ngAnimate', 'ui.bootstrap']);

myApp
.constant('_', window._)
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        // HOME  
        .state('home', {
            url: '/home',
            templateUrl: 'js/view/ranking_chart.html',
            controller: 'rankingController'
        });
    
});

