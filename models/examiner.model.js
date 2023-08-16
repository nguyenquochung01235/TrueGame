const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
    const ExaminerModel = sequelize.define("examiner",{
        id_examiner:{
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        username:{
            type: Sequelize.STRING
        },
        password:{
            type: Sequelize.STRING
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
        id_game:{
            type: Sequelize.BIGINT
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
    
    return ExaminerModel;
}

