const { Op } = require('sequelize');
const database = require('../../models');
const GameService = require('./game.service');
const bcrypt = require('bcryptjs')
const { uuid } = require('uuidv4');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs')
const jwt = require('jsonwebtoken');


const ExaminerModel = database.examiner;
const CandidateModel = database.candidate;
const PointModel = database.point;
const ExaminerService = {};

ExaminerService.generateToken = function(username){
    return jwt.sign({username: username, role:"EXAMINER"}, process.env.JWT_KEY)
}

ExaminerService.login = async function(username, password) {
    return await ExaminerModel.findOne({where : { username: `${username}` }}).then( async function(data) {
        if(data.length == 0){return false}

        const isPasswordMatch = await bcrypt.compare(password, data.password);
        if (!isPasswordMatch) {return false}

        return true;

    }).catch(err=>{
        return false
    })
}

ExaminerService.isExisted = async function(username){
    return await ExaminerModel.findAll({where : { username: `${username}` }}).then(data=>{
        return (data.length != 0) ? true : false
    }).catch(err=>{
        throw err
    })
}

ExaminerService.getExaminerInformation = async function(id_examiner){
    try {
     const examiner = await ExaminerModel.findOne({
         where:{
            id_examiner: id_examiner
         },
         attributes: ['id_examiner', 'username', 'fullname', 'title', 'avatar'],
     })
     return examiner;
    } catch (error) {
     console.log(error)
     return false;
    }
}

ExaminerService.getExaminerInformationByUsername = async function(username){
    try {
     const examiner = await ExaminerModel.findOne({
         where:{
            username: username
         },
         attributes: ['id_examiner', 'username', 'fullname', 'title', 'avatar'],
     })
     return examiner;
    } catch (error) {
     console.log(error)
     return false;
    }
}

ExaminerService.getInformationOfCurrentGame = async function(username){
    try {
        const gameData = await GameService.getCurrentGame();
    if(gameData == null){
        return false
    }

    const examiner = await this.getExaminerInformationByUsername(username);
    if(examiner == null){
        return false
    }
    const currentCandidate = await CandidateModel.findOne({
        where: {
            id_game: gameData.id_game,
            active: 1
        },
        include:[{
            model: database.point,
            required: false,
            where: {
                id_examiner: examiner.id_examiner
            }
        }]
    })

    const gameInformation = {
        game: gameData,
        candidate: currentCandidate
    }
    return gameInformation;
    } catch (error) {
        return false;
    }
}

ExaminerService.setPoint = async function(id_candidate,examiner_username,point){
    try {
        const gameData = await GameService.getCurrentGame();
        if(gameData == null){
            return false
        }

        const examiner = await this.getExaminerInformationByUsername(examiner_username);
        if(examiner == null){
            return false
        }
        if(point >10){
            return false;
        }
        await PointModel.create({
            id_candidate: id_candidate,
            id_examiner: examiner.id_examiner,
            id_game: gameData.id_game,
            point: point
        })
        return true
    } catch (error) {
        return false
    }
}

ExaminerService.createExaminer = async function(username, password, fullname, title, avatar){
    try{
        let fileName = uuid();
        const game = await GameService.getCurrentGame();

        if( game == null){
            return false;
        }

        const isUsernameExisted = await ExaminerModel.findOne({
            where:{
                username: username,
            }
        })

        if( isUsernameExisted != null){
            if(isUsernameExisted.id_game == game.id_game){
                return false
            }else{
                await isUsernameExisted.destroy();
            }
        }

        if(avatar != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            await sharp(avatar).toFile(`${path.resolve(imagePath)}/${fileName}.png`);
        }else{
            fileName = 'default-150x150'
        }

        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(password, salt)
        await ExaminerModel.create({
            username:username,
            password:password,
            fullname: fullname,
            title: title,
            avatar: `${fileName}.png`,
            id_game: game.id_game,
        })
    }catch(err){
        console.log(err)
        return false
    }
}

ExaminerService.countNumberExaminerOfCurrentGame = async function(){
    const game = await GameService.getCurrentGame();
    const examinerData = await ExaminerModel.findAll({
        where:{
            id_game: game.id_game
        },
        attributes: ['id_examiner'],
    })
    return examinerData?.length || 0;
}

ExaminerService.updateExaminer = async function(id_examiner,fullname, title, password,avatar){
    try {
        let fileName = uuid();
        let newAvatar;
        let newPassword;
        const game = await GameService.getCurrentGame();
        const examiner = await ExaminerModel.findOne({
            where: {
                id_examiner: id_examiner
            }
        })
        if( game == null){
            return false;
        }
        if(examiner == null){
            return false;
        }
        newAvatar = examiner.avatar
        console.log("avatar: " + avatar)
        if( avatar != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            try{
                fs.unlinkSync(`${imagePath}/${examiner.avatar}`)
            }catch{}
            await sharp(avatar).toFile(`${path.resolve(imagePath)}/${fileName}.png`);
            newAvatar = `${fileName}.png`;
        }
        newPassword = examiner.password
        console.log('password '+password)
        if(password != null){
            const salt = bcrypt.genSaltSync();
            newPassword = bcrypt.hashSync(password, salt)
        }
        examiner.set({
            fullname: fullname,
            title: title,
            avatar: newAvatar,
            password: newPassword
        })
        await examiner.save();
        return true;
    } catch (error) {
        console.log(error)
        return false
    }
}

ExaminerService.deleteExaminer = async function(id_examiner) {
    try {
        const examiner = await ExaminerModel.findOne({
            where: {
                id_examiner: id_examiner
            }
        })
        if(examiner.avatar != null){
            const imagePath = path.join(__dirname, '../../public/template/image');
            try{
                fs.unlinkSync(`${imagePath}/${candidate.avatar}`)
            }catch{}
        }
        
        await ExaminerModel.destroy({
            where:{
                id_examiner: id_examiner
            }
        })
        return true;
    } catch (error) {
        return false;
    }
}


module.exports = ExaminerService;