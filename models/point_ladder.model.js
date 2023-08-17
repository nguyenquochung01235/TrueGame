const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const PointLadderModel = sequelize.define("point_ladder",{
        id_point_ladder:{
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        title:{
            type: Sequelize.STRING

        },
        max_point:{
            type: Sequelize.DOUBLE

        },
        id_game:{
            type: Sequelize.BIGINT

        },
       
    }, {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,

    })

    return PointLadderModel;
}

