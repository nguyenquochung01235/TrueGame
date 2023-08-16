const jwt = require('jsonwebtoken');
const GameMasterService = require("../services/logins/game_master.service")

const admin_auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        if (! await GameMasterService.isExisted(data.username)) {
            res.status(403).send(({
                success: false,
                message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
                link:"/vote-game/setting/login"
            }))
        }else{
            next()
        } 
    } catch (error) {
        res.status(403).send(({
            success: false,
            message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
            link:"/vote-game/setting/login"
        }))
    }
}

module.exports = admin_auth