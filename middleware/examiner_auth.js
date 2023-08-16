const jwt = require('jsonwebtoken');
const ExaminerService = require("../services/game/examiner.service")

const examiner_auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        if (! await ExaminerService.isExisted(data.username)) {
            res.status(403).send(({
                success: false,
                message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
                link:"/vote-game/examiner/login"
            }))
        }else{
            next()
        } 
    } catch (error) {
        res.status(403).send(({
            success: false,
            message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
            link:"/vote-game/examiner/login"
        }))
    }

}
module.exports = examiner_auth