
module.exports = (sequelize, Sequelize) => {
    const CandidateModel = sequelize.define("candidate",{
        id_candidate:{
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        fullname:{
            type: Sequelize.STRING
        },
        title:{
            type: Sequelize.STRING
        },
        avatar:{
            type: Sequelize.STRING
        },
        ratting:{
            type: Sequelize.INTEGER
        },
        id_game:{
            type: Sequelize.BIGINT
        },
        active:{
            type: Sequelize.INTEGER
        },
        type:{
            type: Sequelize.STRING
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
    return CandidateModel;
}

