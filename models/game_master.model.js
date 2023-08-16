const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
    const GameMasterModel = sequelize.define("game_master",{
        id_game_master:{
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        username:{
            type: Sequelize.STRING
        },
        password:{
            type: Sequelize.STRING
        },
        token:{
            type: Sequelize.STRING

        },
        expired:{
            type: Sequelize.DATE
        },
        created_at:{
            type: Sequelize.DATE
        },
        updated_at:{
            type: Sequelize.DATE
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,

    })
    return GameMasterModel;
}

