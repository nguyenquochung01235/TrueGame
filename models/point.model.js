const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const PointModel = sequelize.define("point",{
        id_point:{
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        id_candidate:{
            type: Sequelize.BIGINT

        },
        id_examiner:{
            type: Sequelize.BIGINT

        },
        id_game:{
            type: Sequelize.BIGINT

        },
        point:{
            type: Sequelize.INTEGER
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

    return PointModel;
}

