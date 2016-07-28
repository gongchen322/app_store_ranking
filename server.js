var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var autoCrawler = require('./autoCrawling.js');
var path = require('path');
var bcrypt = require('bcrypt');
var favicon = require('serve-favicon');
var schedule = require('node-schedule');


var app = express();
var PORT = process.env.PORT || 3000;



app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, '/assets', 'favicon.ico')));
app.use('/js',express.static(path.join(__dirname, '/js')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

//Get the TripInfo data
// app.get('/data', middleware.requireAuthentication, function (req,res) {
// 	var where = {
// 		userId: req.user.get('id')
// 	};


// 	db.tripInfo.findAll({where : where}).then (function (tripInfo) {
// 		res.json(tripInfo);
// 	}, function (e) {
// 		res.status(500).send();
// 	})

// })


//Add new TripInfo data
app.post('/rankInfo_free', function (req,res) {
	var body = _.pick(req.body, 'uploadDate', 'rank', 'name','gameId','imgUrl','link', 'type', 'price', 'company','releaseDate');

	db.rankInfo_free.create(body).then(function (data) {
			res.json(data.toJSON());
		},function (e) {
		res.status(400).json(e);
	});

});

app.post('/rankInfo_paid', function (req,res) {
	var body = _.pick(req.body, 'uploadDate', 'rank', 'name','gameId','imgUrl','link', 'type', 'price', 'company','releaseDate');

	db.rankInfo_paid.create(body).then(function (data) {
			res.json(data.toJSON());
		},function (e) {
		res.status(400).json(e);
	});

});

app.post('/rankInfo_hot', function (req,res) {
	var body = _.pick(req.body, 'uploadDate', 'rank', 'name','gameId','imgUrl','link', 'type', 'price', 'company','releaseDate');

	db.rankInfo_hot.create(body).then(function (data) {
			res.json(data.toJSON());
		},function (e) {
		res.status(400).json(e);
	});

});

app.get('/getDataInfo', function(req, res){
	var date = req.query.date;
	var dbTable = req.query.table;
	// var where = {
	// 	product_gender: gender
	// };

	db.sequelize.query("SELECT * from "+dbTable+" where uploadDate like '%"+date+"%'").spread(function(results, metadata){
    	console.log(results);
    	res.json(results);
	}, function (e) {
		res.status(500).send();
	});
});
// //Add users
// app.post('/users', function (req, res) {
// 	var body = _.pick(req.body, 'name','email', 'password');
// 	console.log(body);
// 	db.user.create(body).then(function (user) {
// 		res.json(user.toPublicJSON());
// 	}, function (e) {
// 		res.status(400).json(e);
// 	})
// });

// //POST /users/login

// app.post('/users/login', function (req, res) {
// 	var body = _.pick(req.body, 'email', 'password');
// 	var userInstance;

// 	db.user.authenticate(body).then(function (user) {
// 		var token = user.generateToken('authentication');
// 		userInstance = user;
// 		return db.token.create({
// 			token: token
// 		});
		
// 	}).then(function (tokenInstance) {
// 		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
// 	}).catch (function (e) {
// 		res.status(401).send();
// 	});

	
// });


// // DELETE /users/login
// app.delete('/users/login', middleware.requireAuthentication,function (req, res) {
	
// 	req.token.destroy().then(function () {
// 		res.status(204).send();
// 	}).catch(function () {
// 		res.status(500).send();
// 	});
// });

var task = schedule.scheduleJob({hour: 0, minute: 10, dayOfWeek: [0,1,2,3,4,5,6]}, function(){
  console.log('Time for new Data from App Store!');
  autoCrawler.saveDataToDB();
});

db.sequelize.sync().then(function () {
		app.listen(PORT, function () {
		console.log('Express listening on port '+ PORT + '!');
	});
});
