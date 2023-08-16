const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const database = require('../../models');

const GameMasterModel = database.gameMaster;

const GameMasterService = {};

GameMasterService.isExisted = async function(username){
    return await GameMasterModel.findAll({where : { username: `${username}` }}).then(data=>{
        return (data.length != 0) ? true : false
    }).catch(err=>{
        throw err
    })
}

GameMasterService.getGameMasterInformation = async function(username) {
    
    const result = await GameMasterModel.findOne({
        where: {
            username : username
        }
    }).then(data=>{
        return (data.length != 0) ? data : false
    })
    .catch(err=>{
        return false;
    })
}

GameMasterService.generateToken = function(username){
    return jwt.sign({username: username, role:"MASTER"}, process.env.JWT_KEY)
}

GameMasterService.login = async function(username, password) {
    return await GameMasterModel.findOne({where : { username: `${username}` }}).then( async function(data) {
        if(data.length == 0){return false}

        const isPasswordMatch = await bcrypt.compare(password, data.password);
        if (!isPasswordMatch) {return false}

        return true;

    }).catch(err=>{
        return false
    })
}

module.exports = GameMasterService;