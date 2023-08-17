const { Op } = require('sequelize');
const database = require('../../models');
const GameService = require('./game.service');
const { uuid } = require('uuidv4');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs')

const CandidateModel = database.candidate;
const CandidateService = {};

CandidateService.getCandidateInformation = async function(id_candidate){
   try {
    const candidate = await CandidateModel.findOne({
        where:{
            id_candidate: id_candidate
        },
        attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active'],
    })
    return candidate;
   } catch (error) {
    console.log(error)
    return false;
   }
}

CandidateService.countNumberCandidateOfCurrentGame = async function(){
    const game = await GameService.getCurrentGame();

    const candidateData = await CandidateModel.findAll({
        where:{
            id_game: game.id_game,
            type: 'SINGLE'
        },
        attributes: ['id_candidate'],
    })
    return candidateData?.length || 0;
}

CandidateService.createCandidate = async function(fullname, title, avatar, type){
    try {
        let fileName = uuid();
        const game = await GameService.getCurrentGame();
        if( game == null){
            return false;
        }
        if(avatar != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            await sharp(avatar).toFile(`${path.resolve(imagePath)}/${fileName}.png`);
        }else{
            fileName = 'default-150x150'
        }
        if(!(type.toString() == 'SINGLE' || type.toString() == 'LIST')){
            return false; 
        }

        var isListVoting = await CandidateModel.findOne({
            where:{
                id_game: game.id_game,
                type: "LIST",
                active: 1
            }
        })

        if(isListVoting != null){
            return false;
        }

        await CandidateModel.create({
            fullname: fullname,
            title: title,
            avatar: `${fileName}.png`,
            ratting: 0,
            id_game: game.id_game,
            active: 0,
            type: type
        })
        return true;
    } catch (error) {
        console.log(error)
        return false
    }
}

CandidateService.updateCandidate = async function(id_candidate,fullname, title, avatar){
    try {
        let fileName = uuid();
        let newAvatar;
        const game = await GameService.getCurrentGame();
        const candidate = await CandidateModel.findOne({
            where: {
                id_candidate: id_candidate
            }
        })
        if( game == null){
            return false;
        }
        if(candidate == null){
            return false;
        }
        newAvatar = candidate.avatar
        console.log("avatar: " + avatar)
        if( avatar != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            try{
                fs.unlinkSync(`${imagePath}/${candidate.avatar}`)
            }catch{}
            await sharp(avatar).toFile(`${path.resolve(imagePath)}/${fileName}.png`);
            newAvatar = `${fileName}.png`;
        }

        candidate.set({
            fullname: fullname,
            title: title,
            avatar: newAvatar,
        })
        await candidate.save();
        return true;
    } catch (error) {
        console.log(error)
        return false
    }
}

CandidateService.deleteCandidate = async function(id_candidate) {
    try {
        const candidate = await CandidateModel.findOne({
            where: {
                id_candidate: id_candidate
            }
        })
        if(candidate.avatar != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            try{
                fs.unlinkSync(`${imagePath}/${candidate.avatar}`)
            }catch{}
        }
        
        await CandidateModel.destroy({
            where:{
                id_candidate: id_candidate
            }
        })
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

CandidateService.startCandidate = async function(id_candidate) {
    try {
        const game = await GameService.getCurrentGame();
        if( game == null || game.active != 1){
            return false;
        }

        const haveCandidateDoing = await CandidateModel.findOne({
            where: {
                id_game: game.id_game,
                active: 1,
                type: 'SINGLE'
            }
        })

        if (haveCandidateDoing != null) {
            return false;
        }

        const candidate = await CandidateModel.findOne({
            where: {
                id_candidate: id_candidate,
                id_game: game.id_game
            }
        })
        if(candidate == null){
            return false;
        }

        candidate.set({
            active: 1
        })

        await candidate.save();
        return true;
    } catch (error) {
        return false
    }



}

CandidateService.finishCandidate = async function(id_candidate) {
    try {
        const game = await GameService.getCurrentGame();
        if( game == null){
            return false;
        }

        const candidate = await CandidateModel.findOne({
            where: {
                id_candidate: id_candidate,
                id_game: game.id_game,
                active: 1,
                type: 'SINGLE'

            }
        })
        if(candidate == null){
            return false;
        }

        candidate.set({
            active: 2
        })

        await candidate.save();
        return true;
    } catch (error) {
        return false
    }



}

CandidateService.getListCandidateTypeListForVote = async function(){
    try {
        const game = await GameService.getCurrentGame();
        if( game == null || game.active != 1){
            return false;
        }
        const listCandidateTypeList = await CandidateModel.findAll({
            where:{
                id_game: game.id_game,
                type: 'LIST',
                active: 1,
            },
            attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting'],
        })
        return {
            listCandidateTypeList: listCandidateTypeList,
            max_vote: game.max_vote
        }
       } catch (error) {
        return false;
       }
}

CandidateService.startListCandidate = async function() {
    try {
        const game = await GameService.getCurrentGame();
        if( game == null || game.active != 1){
            return false;
        }

        const haveCandidateDoing = await CandidateModel.findOne({
            where: {
                id_game: game.id_game,
                active: 1,
                type: 'SINGLE'
            }
        })

        if (haveCandidateDoing != null) {
            return false;
        }

        await CandidateModel.update(
            {active: 1},
            {
            where: {
                type: "LIST",
                id_game: game.id_game
            }
        })

        return true;
    } catch (error) {
        return false
    }



}

CandidateService.stopListCandidate = async function() {
    try {
        const game = await GameService.getCurrentGame();
        if( game == null || game.active != 1){
            return false;
        }

        const haveCandidateDoing = await CandidateModel.findOne({
            where: {
                id_game: game.id_game,
                active: 1,
                type: 'SINGLE'
            }
        })

        if (haveCandidateDoing != null) {
            return false;
        }

        await CandidateModel.update(
            {active: 2},
            {
            where: {
                type: "LIST",
                id_game: game.id_game
            }
        })

        return true;
    } catch (error) {
        return false
    }



}

CandidateService.getListCandidateTypeListOrderByRattingDESC = async function(){
    try {
        const game = await GameService.getCurrentGame();
        if( game == null || game.active != 1){
            return false;
        }
        const listCandidateTypeList = await CandidateModel.findAll({
            where:{
                id_game: game.id_game,
                type: 'LIST',
                active: {
                    [Op.or]: [1,2]
                },
            },
            attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting'],
            order: [
                ['ratting', 'DESC'],
            ],
        })
        return {listCandidateTypeList: listCandidateTypeList}
       } catch (error) {
        return false;
       }
}

module.exports = CandidateService;