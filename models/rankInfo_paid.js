module.exports = function (sequelize, DataTypes) {
	return sequelize.define('rankInfo_paid', {
		uploadDate: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		rank: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		gameId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		imgUrl: {
			type: DataTypes.STRING,
			allowNull: false,
	
		},
		link: {
			type: DataTypes.STRING,
			allowNull: false,
	
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
	
		},
		price: {
			type: DataTypes.STRING,
			allowNull: false,
	
		},
		company: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		releaseDate: {
			type: DataTypes.STRING,
			allowNull: false,
		}
		// jsonFile: {
		// 	type: DataTypes.STRING,
		// 	allowNull: false,
		// }
	});
};
