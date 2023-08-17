const { Op } = require('sequelize');
const database = require('../../models');
const sequelize = require('sequelize')

const GameModel = database.game;
const PointLadderModel = database.point_ladder;

const PointLadderService = {};

PointLadderService.getListPointLadder = async function(){
    try{
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
    
    return await PointLadderModel.findAll({
        where:{
            id_game: gameData.id_game
        }
    })

    }catch(error){
        return []
    }
}

PointLadderService.createPointLadder = async function(point_ladder_title, point_ladder_max_point){
    try {
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
    
        if(gameData == null) return false;
    
        await PointLadderModel.create({
            title: point_ladder_title,
            max_point: point_ladder_max_point,
            id_game: gameData.id_game
        })
    } catch (error) {
        console.log(error)
    }
}

PointLadderService.deletePointLadder = async function(){
    try {
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
    
        if(gameData == null) return false;
    
        await PointLadderModel.destroy({
            where: {
              id_game: gameData.id_game
            },
          });
    } catch (error) {
        console.log(error)
    }
}


module.exports = PointLadderService;