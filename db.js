var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;
if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname+ '/data/dev-todo-api.sqlite'
});
}


var db = {

};

db.rankInfo_free = sequelize.import(__dirname + '/models/rankInfo_free.js');
db.rankInfo_paid = sequelize.import(__dirname + '/models/rankInfo_paid.js');
db.rankInfo_hot = sequelize.import(__dirname + '/models/rankInfo_hot.js');
// db.user = sequelize.import(__dirname + '/models/user.js');

// db.token = sequelize.import(__dirname + '/models/token.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.tripInfo.belongsTo(db.user);
// db.user.hasMany(db.tripInfo);

module.exports = db;