const express = require('express');

const router = express.Router();
const multer = require('multer');
const upload = multer()
const ViewerService = require('../services/game/viewer.service');
const CandidateService = require('../services/game/candidate.service');


router.get('/',(req, res, next)=>{
    res.render('game/vote_game/viewer/viewer', {title: "VIEWER | VOTE GAME"});
});


router.get('/game/info',async (req, res, next)=>{
    const result = await ViewerService.getGameInformation()
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

router.post('/game/vote',upload.none(), async (req, res, next)=>{
    
    const result = await ViewerService.voteForCurrentCandidateByViewer()
    if(result != false){
        res.status(200).send(({
            success: true,
            message: "Bình chọn thành công",
        }))
    
    }else{
        res.status(400).send(({
            success: true,
            message: "Bình chọn không thành công",
        }))
    }
})


router.get('/game/info/list',async (req, res, next)=>{
    const result = await CandidateService.getListCandidateTypeListForVote()
    if(result != false){
        res.status(200).send(({
            success: true,
            message: "Vote list candidate",
            game_data: result
        }))
    }else{
        res.status(400).send(({
            success: true,
            message: "Get vote list candidate false",
            game_data: null
        }))
    }
});

router.post('/game/vote/list',upload.none(), async (req, res, next)=>{
    const result = await ViewerService.voteForListCurrentCandidateByViewer(req.body?.list_candidate)
    if(result != false){
        res.status(200).send(({
            success: true,
            message: "Bình chọn thành công",
        }))
    
    }else{
        res.status(400).send(({
            success: true,
            message: "Bình chọn không thành công",
        }))
    }
})


module.exports = router;