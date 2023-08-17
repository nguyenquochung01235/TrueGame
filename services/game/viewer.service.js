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
                active: 1,
                type: 'SINGLE'
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

ViewerService.voteForListCurrentCandidateByViewer = async function(list_candidate){
    try {
        const list_data = list_candidate.split(',')
        if(list_data == [] ||list_data == null ) return false;
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
        
        if(gameData == null) return false;
        if(list_data.length > gameData.max_vote){
            return false
        }
        
        list_data.forEach(id_candidate => {
            CandidateModel.increment('ratting', {
                by: 1,
                where: {
                    id_candidate: id_candidate,
                    type: 'LIST'
                }
            })
        });
        
        return true;
    } catch (error) {
        return false
    }

}


module.exports = ViewerService;