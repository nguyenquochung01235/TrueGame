
module.exports = (sequelize, Sequelize) => {
    const GameModel = sequelize.define("game",{
        id_game:{
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        name_game:{
            type: Sequelize.STRING
        },
        background:{
            type: Sequelize.STRING
        },
        link_examiner:{
            type: Sequelize.STRING

        },
        link_viewer:{
            type: Sequelize.STRING

        },
        active:{
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

    return GameModel;
}

