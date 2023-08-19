const { Op } = require('sequelize');
const database = require('../../models');
const path = require('path');
const sharp = require('sharp');
const sequelize = require('sequelize')
const excel = require('node-excel-export');

const PointLadderService = require("./point_ladder.service");

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

GameService.createNewGame = async function (name_game, background,max_vote, arr_point_ladder){
   try {
    if( await this.getCurrentGame() != null){
        return false;
    }
    if(max_vote < 1){
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
        max_vote: max_vote
    })

    const arrPointLadder = JSON.parse(arr_point_ladder)
        
    if(arrPointLadder.length == 0 || arrPointLadder == null){
        return false;
    }
   
    
    await PointLadderService.createPointLadder(arrPointLadder);

    return result;
   } catch (error) {
    console.log(error)
    return false
   }
 }

 GameService.updateGame = async function (name_game, background,max_vote, arr_point_ladder){
    try{
        const game = await this.getCurrentGame();
        if( game == null){
            return false;
        }
        if(max_vote < 1){
            return false;
        }
        if(background != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            await sharp(background).toFile(`${path.resolve(imagePath)}/background.png`);
        }
        game.set({
            name_game: name_game,
            max_vote: max_vote,
        })
        await game.save();

        const arrPointLadder = JSON.parse(arr_point_ladder)
        
        if(arrPointLadder.length == 0 || arrPointLadder == null){
            return false;
        }

        await PointLadderService.deletePointLadder();
        
        await PointLadderService.createPointLadder(arrPointLadder);

        return true;
    }catch(err){
        console.log(err)
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
            attributes: ['id_examiner', 'username', 'fullname', 'title', 'avatar', 'hidden'],
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
            group: [
                'candidate.id_candidate',
            ]
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

        const listPointLadder = await PointLadderService.getListPointLadder();
    
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
            point_current_candidate: listPointOfCurrentCandidate,
            point_ladder: listPointLadder,
        }
        return gameInformation;
    } catch (error) {
        console.log(error)
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
                attributes: ['id_point','point'],
                include: [{
                    model: database.examiner,
                    attributes: ['id_examiner','hidden'],
                    where:{
                        hidden: 0
                    }
                },]
            }],
            attributes: ['id_candidate', 'fullname', 'title', 'avatar', 'active', 'ratting'],
        })
    
        const listPointOfCurrentCandidate = await PointModel.findAll({
            where:{
                id_candidate: curentCandidate[0]?.id_candidate || 0,
            },
            include:[{
                model: database.examiner,
                attributes: ['id_examiner','fullname', 'title','avatar','hidden']
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
        console.log(error)
        return false;
    }
}



GameService.getGameInformationForExportExcel = async function(){
    try {
        const gameData = await GameModel.findOne({
            where : {
                active: {
                    [Op.or]: [0,1]
                }
            },
        })
        
        const ss1_candidate_type_single = await CandidateModel.findAll({
            where:{
                id_game: gameData.id_game,
                type: 'SINGLE'
            },
            include:[{
                model: database.point,
                attributes: ['point','id_candidate']
            },],
            attributes: ['id_candidate', 'fullname', 'title', 'ratting',
                [sequelize.fn('sum', sequelize.col('point')), 'total_point'],
            ],
            group: ['id_candidate'],
            order: [
                ['total_point', 'DESC'],
            ],
        })

        const ss2_candidate_type_list = await CandidateModel.findAll({
            where:{
                id_game: gameData.id_game,
                type: 'LIST'
            },
            attributes: ['id_candidate', 'fullname', 'title', 'ratting'],
            order: [
                ['ratting', 'DESC'],
            ],
        })

        const ss3_examiner_point = await PointModel.findAll({
            where:{
                id_game: gameData.id_game,
            },
            attributes: ['id_point','id_candidate','id_examiner','point',],
            include:[{
                model: database.examiner,
                attributes: ['fullname', 'title']
            },
            {
                model: database.candidate,
                attributes: ['fullname', 'title']
            }],
            order: [
                ['id_candidate', 'ASC'],
            ],
        })
        

        const styles = {
            headerLight: {
              fill: {
                fgColor: {
                  rgb: 'FFFFFFFF'
                }
              },
              font: {
                color: {
                  rgb: 'FF000000'
                },
                sz: 14,
                bold: true,
              },
              border:{
                top	    :{ style: 'thin', color: 'FF000000' },
                bottom	:{ style: 'thin', color: 'FF000000' },
                left	:{ style: 'thin', color: 'FF000000' },
                right	:{ style: 'thin', color: 'FF000000' },
              }
            },
            cellLight: {
              fill: {
                fgColor: {
                  rgb: 'FFFFFFFF'
                }
              },
              font: {
                color: {
                  rgb: 'FF000000'
                },
                sz: 13,
              },
              border:{
                top	    :{ style: 'thin', color: 'FF000000' },
                bottom	:{ style: 'thin', color: 'FF000000' },
                left	:{ style: 'thin', color: 'FF000000' },
                right	:{ style: 'thin', color: 'FF000000' },
              }
            }
          };


        const ss1_specification = {
            id_candidate: { 
                displayName: 'ID', 
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 30 // <- width in pixels
            },
            fullname: { 
                displayName: 'Tên',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels
            },
            title: { 
                displayName: 'Tiết mục',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels 
            },
            ratting: { 
                displayName: 'Bình chọn', 
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 80 // <- width in pixels
            },
            total_point: { 
                displayName: 'Tổng điểm',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 80 // <- width in pixels 
            },
        }
        const ss1_dataset = []
        ss1_candidate_type_single.forEach(candidate => {
            let candidate_element = {
                id_candidate: candidate.id_candidate,
                fullname: candidate.fullname,
                title: candidate.title,
                ratting: candidate.ratting,
                total_point: candidate.dataValues.total_point
            }
            ss1_dataset.push(candidate_element);
        });


        const ss2_specification = {
            id_candidate: { 
                displayName: 'ID', 
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 30 // <- width in pixels
            },
            fullname: { 
                displayName: 'Tên',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels
            },
            title: { 
                displayName: 'Tiết mục',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels 
            },
            ratting: { 
                displayName: 'Bình chọn', 
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 80 // <- width in pixels
            },
        }
        const ss2_dataset = []
        ss2_candidate_type_list.forEach(candidate => {
            let candidate_element = {
                id_candidate: candidate.id_candidate,
                fullname: candidate.fullname,
                title: candidate.title,
                ratting: candidate.ratting,
            }
            ss2_dataset.push(candidate_element);
        });
        
        const ss3_specification = {
            id_point: { 
                displayName: 'ID Điểm', 
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 60 // <- width in pixels
            },
            id_candidate: { 
                displayName: 'ID Thí Sinh', 
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 80 // <- width in pixels
            },
            fullname_candidate: { 
                displayName: 'Tên Thí Sinh',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels
            },
            title_candidate: { 
                displayName: 'Tên Tiết Mục',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels 
            },
            fullname_examiner: { 
                displayName: 'Tên Giám Khảo',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels
            },
            title_examiner: { 
                displayName: 'Chức Danh',
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 220 // <- width in pixels 
            },
            point: { 
                displayName: 'Điểm', 
                headerStyle: styles.headerLight,
                cellStyle: styles.cellLight, // <- Cell style
                width: 80 // <- width in pixels
            },
        }
        const ss3_dataset = []
        ss3_examiner_point.forEach(point => {
            let point_element = {
                id_point: point.id_point,
                id_candidate: point.id_candidate,
                fullname_candidate: point.candidate.fullname,
                title_candidate: point.candidate.title,
                id_examiner: point.id_examiner,
                fullname_examiner: point.examiner.fullname,
                title_examiner: point.examiner.title,
                point: point.point
            }
            ss3_dataset.push(point_element);
        });
        
        const report = excel.buildExport(
            [
                {
                name: 'Candidate Type Single', // <- Specify sheet name (optional)
                merges: [],
                specification: ss1_specification, // <- Report specification
                data: ss1_dataset // <-- Report data
                },
                {
                name: 'Candidate Type List', // <- Specify sheet name (optional)
                merges: [],
                specification: ss2_specification, // <- Report specification
                data: ss2_dataset // <-- Report data    
                },
                {
                name: 'Point List', // <- Specify sheet name (optional)
                merges: [],
                specification: ss3_specification, // <- Report specification
                data: ss3_dataset // <-- Report data
                },
            ]
        );
    
        return report;
    } catch (error) {
        console.log(error)
        return false;
    }
}






module.exports = GameService;