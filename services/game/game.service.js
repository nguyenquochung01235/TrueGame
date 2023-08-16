const { Op } = require('sequelize');
const database = require('../../models');
const path = require('path');
const sharp = require('sharp');
const sequelize = require('sequelize')

const GameModel = database.game;
const ExaminerModel = database.examiner;
const CandidateModel  = database.candidate;
const PointModel  = database.point;

const GameService = {};

GameService.getCurrentGame = async function (){
   const result = await GameModel.findOne({
        where : {
            active: {
                [Op.or]: [0,1]
            }
        }
    })
    return result;
}

GameService.createNewGame = async function (name_game, background){
   try {
    if( await this.getCurrentGame() != null){
        return false;
    }
    if(background != null){
        const imagePath = path.join(__dirname, '../../public/template/image');
        await sharp(background).toFile(`${path.resolve(imagePath)}/background.png`);
    }
    const result = await GameModel.create({
        name_game: name_game,
        background: '/template/image/background.png',
        link_examiner: '/vote-game/view/examiner',
        link_viewer: '/vote-game/view/viewer',
        active: 0,
    })
    return result;
   } catch (error) {
    console.log(error)
    return false
   }
 }

 GameService.updateGame = async function (name_game, background){
    try{
        const game = await this.getCurrentGame();
        if( game == null){
            return false;
        }
        if(background != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            await sharp(background).toFile(`${path.resolve(imagePath)}/background.png`);
        }
        game.set({
            name_game: name_game,
        })
        await game.save();
        return true;
    }catch(err){
        return false;
    }
 }

GameService.setStatusGame = async function (status){
    try{
        const game = await this.getCurrentGame();
        if( game == null){
            return false;
        }
        
        // start game
        if(status == 1 && game.active == 0){
            game.set({
                active: status,
            })
            await game.save();
        } 
        //stop game
        if(status == 2 && game.active == 1){

            const candidate = await CandidateModel.findOne({
                where: {
                    id_game: game.id_game,
                    active: 1
                }
            })

            if(candidate != null){
                return false
            }

            game.set({
                active: status,
            })
            await game.save();
            
        } 
        return true;
    }catch(err){
        return false;
    }
 }

GameService.getGameInformation = async function(){
    try {
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
        const examinerData = await ExaminerModel.findAll({
            where:{
                id_game: gameData.id_game
            },
            attributes: ['id_examiner', 'username', 'fullname', 'title', 'avatar'],
        })
        
        const candidateDataTypeList = await CandidateModel.findAll({
            where:{
                id_game: gameData.id_game,
                type: 'LIST'
            },
            attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting',]
        })

        const candidateData = await CandidateModel.findAll({
            where:{
                id_game: gameData.id_game,
                type: 'SINGLE'
            },
            include:[{
                model: database.point,
                attributes: ['point']
            },],
            attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting','type',
                [sequelize.fn('sum', sequelize.col('point')), 'total_point'],
            ],
            group: ['id_candidate']
        })
    
        const curentCandidate = await CandidateModel.findAll({
            where:{
                id_game: gameData.id_game,
                active: 1,
                type: "SINGLE"
            },
            include:[{
                model: database.point,
                attributes: ['id_point','point']
            },],
            attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting'],
        })
    
        const listPointOfCurrentCandidate = await PointModel.findAll({
            where:{
                id_candidate: curentCandidate[0]?.id_candidate || 0,
            },
            include:[{
                model: database.examiner,
                attributes: ['id_examiner','fullname', 'title','avatar']
            }]
        })
    
        const gameInformation = {
            game: gameData?.dataValues,
            examiner: {
                total: examinerData?.length || 0,
                data:  examinerData|| [],
            },
            candidate:{
                total: candidateData?.length || 0,
                data:  candidateData
            },
            candidateList: candidateDataTypeList,
            curent_candidate: {
                id_candidate: curentCandidate[0]?.id_candidate,
                fullname: curentCandidate[0]?.fullname,
                avatar: curentCandidate[0]?.avatar,
                title: curentCandidate[0]?.title,
                ratting: curentCandidate[0]?.ratting,
                point: curentCandidate[0]?.points.reduce((total, points) => total + points.point, 0),
            },
            point_current_candidate: listPointOfCurrentCandidate
            
        }
        return gameInformation;
    } catch (error) {
        return false;
    }
}


GameService.getNumberOfVote = async function(){
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
        attributes: ['id_candidate','ratting']
    })

    if(curentCandidate == false) return false;

    const rattingData = await CandidateModel.findOne({
        where:{
            id_game: gameData.id_game
        },
       
        attributes: [
            [sequelize.fn('sum', sequelize.col('ratting')), 'total_ratting'],
        ],
    })
    

    const rattings = {
        current_ratting: curentCandidate?.ratting || 0,
        total_ratting: rattingData?.dataValues?.total_ratting || 0
    }

    return rattings
   } catch (error) {
    console.log(error)
    return false;
   }
}


GameService.getGameInformationForLive = async function(){
    try {
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
        const totleExaminer = await ExaminerModel.findOne({
            where:{
                id_game: gameData.id_game
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id_examiner')), 'total_examiner'],
            ],
        })
        
        const totalCandidate = await CandidateModel.findOne({
            where:{
                id_game: gameData.id_game
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id_candidate')), 'total_candidate'],
            ],
        })
    
        const curentCandidate = await CandidateModel.findAll({
            where:{
                id_game: gameData.id_game,
                active: 1,
                type: 'SINGLE'
            },
            include:[{
                model: database.point,
                attributes: ['id_point','point']
            },],
            attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting'],
        })
    
        const listPointOfCurrentCandidate = await PointModel.findAll({
            where:{
                id_candidate: curentCandidate[0]?.id_candidate || 0,
            },
            include:[{
                model: database.examiner,
                attributes: ['id_examiner','fullname', 'title','avatar']
            }]
        })
    
        const gameInformation = {
            game: gameData?.dataValues,
            examiner: totleExaminer,
            candidate: totalCandidate,
            curent_candidate: {
                id_candidate: curentCandidate[0]?.id_candidate,
                fullname: curentCandidate[0]?.fullname,
                avatar: curentCandidate[0]?.avatar,
                title: curentCandidate[0]?.title,
                ratting: curentCandidate[0]?.ratting,
                point: curentCandidate[0]?.points.reduce((total, points) => total + points.point, 0),
            },
            point_current_candidate: listPointOfCurrentCandidate
    
        }
        return gameInformation;
    } catch (error) {
        return false;
    }
}

module.exports = GameService;