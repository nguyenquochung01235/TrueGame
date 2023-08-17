const { Op } = require('sequelize');
const database = require('../../models');
const sequelize = require('sequelize')

const GameModel = database.game;
const PointLadderModel = database.point_ladder;

const PointLadderService = {};

PointLadderService.getMaxPointOfCurrentGame = async function() {
    try{
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
    
    return await PointLadderModel.findOne({
        where:{
            id_game: gameData.id_game
        },
        attributes: [[sequelize.fn('sum', sequelize.col('max_point')), 'total_max_point']],
    })

    }catch(error){
        return false
    }
}

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

PointLadderService.createPointLadder = async function(arrPointLadder){
    try {
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
    
        if(gameData == null) return false;
        arrPointLadder.forEach((point_ladder) => {
              PointLadderModel.create({
                title: point_ladder.title,
                max_point: point_ladder.max_point,
                id_game: gameData.id_game
            })
        });
       return true;
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