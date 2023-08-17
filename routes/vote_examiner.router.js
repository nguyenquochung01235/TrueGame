const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken')
const examiner_auth = require('../middleware/examiner_auth');
const multer = require('multer');
const upload = multer()
const ExaminerService = require('../services/game/examiner.service');
const PointLadderService = require("../services/game/point_ladder.service");


router.get('/',(req, res, next)=>{
    res.render('game/vote_game/examiner/examiner', {title: "EXAMINER | VOTE GAME"});
});

router.get('/login', async (req, res, next)=>{
    res.render('game/vote_game/examiner/examiner_login', {title: "LOGIN | VOTE GAME"});
});

router.post('/login/auth', async (req, res, next)=>{
    if(await ExaminerService.login(req.body.username, req.body.password)){
        res.status(200).send(({
            success: true,
            message: "Login success",
            token: ExaminerService.generateToken(req.body.username)
        }))
    }else{
        res.status(400).send(({
            success: false,
            message: "Login False",
        }))
    }
})

router.get('/info', examiner_auth, async (req,res,next)=>{
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    const examiner = await ExaminerService.getExaminerInformationByUsername(data.username);
    if(examiner != false){
        res.status(200).send(({
            success: true,
            message: "Examiner information",
            examiner: examiner
        }))
    
    }else{
        res.status(400).send(({
            success: true,
            message: "Get examiner information false",
            examiner: null
        }))
    }
});

router.get('/game/info' ,examiner_auth,async (req, res, next)=>{
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    const result = await ExaminerService.getInformationOfCurrentGame(data.username)
    if(result != false){
        res.status(200).send(({
            success: true,
            message: "Game information",
            game_data: result
        }))
    
    }else{
        res.status(400).send(({
            success: true,
            message: "Get game information false",
            game_data: null
        }))
    }
});

router.post('/game/point',upload.none() ,examiner_auth, async (req, res, next)=>{
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    const result = await ExaminerService.setPoint(req.body.id_candidate,data.username,req.body.point)
    if(result != false){
        res.status(200).send(({
            success: true,
            message: "Chấm điểm thành công",
            game_data: result
        }))
    
    }else{
        res.status(400).send(({
            success: true,
            message: "Chấm điểm không thành công",
            game_data: null
        }))
    }
})

router.get('/game/point/ladder',upload.none() ,examiner_auth, async (req, res, next)=>{
    const total_max_point = await PointLadderService.getMaxPointOfCurrentGame()
    const point_lader = await PointLadderService.getListPointLadder()
    if(total_max_point != false && point_lader != false){
        res.status(200).send(({
            success: true,
            message: "Get point ladder success",
            game_data: {
                total_max_point,
                point_lader: point_lader
            }
        }))
    
    }else{
        res.status(400).send(({
            success: true,
            message: "Get point ladder success false",
            game_data: null
        }))
    }
})




module.exports = router;