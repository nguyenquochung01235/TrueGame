const DATABASE_CONFIG = require("../configs/database/database.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    DATABASE_CONFIG.DATABASE,
    DATABASE_CONFIG.USERNAME,
    DATABASE_CONFIG.PASSWORD, {
    host: DATABASE_CONFIG.HOST,
    dialect: DATABASE_CONFIG.DIALECT,
    operatorsAliases: false,
    pool: {
      max: DATABASE_CONFIG.POOL.MAX,
      min: DATABASE_CONFIG.POOL.MIN,
      acquire: DATABASE_CONFIG.POOL.ACQUIRE,
      idle: DATABASE_CONFIG.POOL
    }
  });

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;
// define model and table
database.gameMaster = require("./game_master.model.js")(sequelize, Sequelize);
database.game = require("./game.model.js")(sequelize, Sequelize);
database.candidate = require("./candidate.model.js")(sequelize, Sequelize);
database.examiner = require("./examiner.model.js")(sequelize, Sequelize);
database.point = require("./point.model.js")(sequelize, Sequelize);
database.point_ladder = require("./point_ladder.model.js")(sequelize, Sequelize);

// define relationship
database.game.hasMany(database.candidate, {foreignKey: 'id_game'});
database.candidate.belongsTo(database.game, {foreignKey: 'id_game'});
database.candidate.hasMany(database.point, {foreignKey: 'id_candidate'});
database.examiner.hasMany(database.point, {foreignKey: 'id_examiner'});
database.point.belongsTo(database.candidate, {foreignKey: 'id_candidate'});
database.point.belongsTo(database.examiner, {foreignKey: 'id_examiner'});
database.game.hasMany(database.point_ladder, {foreignKey: 'id_game'});
database.point_ladder.belongsTo(database.game, {foreignKey: 'id_game'});

module.exports = database;