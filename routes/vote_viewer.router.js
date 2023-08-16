const express = require('express');

const router = express.Router();
const multer = require('multer');
const upload = multer()
const ViewerService = require('../services/game/viewer.service');


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


module.exports = router;