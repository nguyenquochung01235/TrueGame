const { Op } = require('sequelize');
const database = require('../../models');
const path = require('path');
const sharp = require('sharp');
const sequelize = require('sequelize')

const GameModel = database.game;
const CandidateModel  = database.candidate;

const ViewerService = {};

ViewerService.getGameInformation = async function(){
    const gameData = await GameModel.findOne({
        where : {
            active: {
                [Op.or]: [0,1]
            }
        },
    })
    

    const curentCandidate = await CandidateModel.findOne({
        where:{
            id_game: (gameData?.id_game || 0),
            active: 1,
            type: "SINGLE"
        },
        
        attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting'],
    })


    const gameInformation = {
        game: gameData,
        curent_candidate: curentCandidate
    }
    return gameInformation;
}

ViewerService.voteForCurrentCandidateByViewer = async function(){
    try {
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
        
        if(gameData == null) return false;
        
        const curentCandidate = await CandidateModel.findOne({
            where:{
                id_game: (gameData?.id_game || 0),
                active: 1
            },
        })
    
        if(curentCandidate == false) return false;

        curentCandidate.set({
            ratting: curentCandidate.ratting + 1
        })
        curentCandidate.save();
        return true;
    } catch (error) {
        return false
    }

}



module.exports = ViewerService;