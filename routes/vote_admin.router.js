const express = require('express');

const router = express.Router();

const GameMasterService = require("../services/logins/game_master.service");
const GameService = require("../services/game/game.service");
const admin_auth = require('../middleware/admin_auth');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const CandidateService = require('../services/game/candidate.service');
const ExaminerService = require('../services/game/examiner.service');
const upload = multer();


router.get('/',(req, res, next)=>{
    res.render('game/vote_game/live/live', {title: "SETTING | VOTE GAME"});
});

router.get('/info', async (req, res, next)=>{
    try {
        const isGameExist = await GameService.getCurrentGame();
        if(isGameExist == null){
            res.status(200).send(({
                success: true,
                message: "Get game info successful",
                data: null
            }))
        }else{
            const gameDataForLive = await GameService.getGameInformationForLive();
            res.status(200).send(({
                success: true,
                message: "Get game info successful",
                data: gameDataForLive
            }))
        }
    } catch (error) {
        res.status(400).send(({
            success: false,
            message: "Không tìm thấy dữ liệu",
            data: null
        }))
    }

});

router.get('/setting', async (req, res)=>{
    const isGameExist = await GameService.getCurrentGame();
    if(isGameExist == null){
        res.render('game/vote_game/game_control_panel', {title: "SETTING | VOTE GAME", isGameExist: isGameExist != null ? true : false});
    }else{
        const gameData = await GameService.getGameInformation()
        res.render('game/vote_game/game_control_panel', {title: "SETTING | VOTE GAME", isGameExist: isGameExist != null ? true : false, gameData});
    }
});

router.get('/setting/info', admin_auth ,async (req, res)=>{
    try {
        const isGameExist = await GameService.getCurrentGame();
        if(isGameExist == null){
            res.status(200).send(({
                success: true,
                message: "Get game info successful",
                data: null
            }))
        }else{
            const gameData = await GameService.getGameInformation()
            res.status(200).send(({
                success: true,
                message: "Get game info successful",
                data: gameData
            }))
        }
    } catch (error) {
        res.status(400).send(({
            success: false,
            message: "Không tìm thấy dữ liệu",
            data: null
        }))
    }
});

router.get('/setting/login', async (req, res, next)=>{
    res.render('game/vote_game/setting_login', {title: "LOGIN | VOTE GAME"});
});

router.post('/setting/login/auth', async (req, res, next)=>{
    if(await GameMasterService.login(req.body.username, req.body.password)){
        res.status(200).send(({
            success: true,
            message: "Login success",
            token: GameMasterService.generateToken(req.body.username)
        }))
    }else{
        res.status(400).send(({
            success: false,
            message: "Login False",
        }))
    }
})

router.get('/setting/game-master',admin_auth ,async (req,res,next)=>{
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    const gameMasterData = GameMasterService.getGameMasterInformation(data.username);
    if(gameMasterData != false){
        res.status(200).send(({
            success: true,
            message: "Get game master information",
            data: gameMasterData.username
        }))
    }else{
        res.status(400).send(({
            success: false,
            message: "Not found game master",
            link: "/vote-game/setting/login"
        }))
    }
})

router.get('/setting/game',admin_auth,async (req, res, next)=>{

    if( await GameService.getCurrentGame() != null){
        res.status(200).send(({
            success: true,
            message: "Game is existing",
            is_game_exist: true
        }))
       }else{
        res.status(400).send(({
            success: true,
            message: "Game is not existing",
            is_game_exist: false
        }))
       }
})

router.get('/setting/game/information',admin_auth,async (req, res, next)=>{
    if( await GameService.getCurrentGame() != null){
        res.status(200).send(({
            success: true,
            message: "Game is existing",
            is_game_exist: true
        }))
       }else{
        res.status(400).send(({
            success: true,
            message: "Game is not existing",
            is_game_exist: false
        }))
       }
})

router.post('/setting/game/create',upload.single('background'), admin_auth ,async (req, res, next)=>{
   const gameData = await GameService.createNewGame(
    req.body.name_game,
    req?.file?.buffer || null, 
    req.body.max_vote,
    req.body.point_ladder_title,
    req.body.point_ladder_max_point
    )

   if(gameData != false){
    res.status(201).send(({
        success: true,
        message: "Tạo game thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Bạn đã có 1 game ở trạng thái sắp diễn ra hoặc đang diễn ra tồn tại",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/game/update',upload.single('background'), admin_auth ,async (req, res, next)=>{
   const gameData = await GameService.updateGame(
    req.body.name_game,
    req?.file?.buffer || null,
    req.body.max_vote, 
    req.body.point_ladder_title,
    req.body.point_ladder_max_point)

   if(gameData != false){
    res.status(201).send(({
        success: true,
        message: "Cập game thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Cập nhật không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/game/status',upload.none(), admin_auth ,async (req, res, next)=>{
    const MIN_LIMIT_CANDIDATE = 1;
    const MIN_LIMIT_EXAMINER = 1;
   
    const numberCandidate = await CandidateService.countNumberCandidateOfCurrentGame();
    const numberExaminer = await ExaminerService.countNumberExaminerOfCurrentGame();
    
    if(numberCandidate < MIN_LIMIT_CANDIDATE){
        res.status(400).send(({
            success: false,
            message: "Vui lòng thêm thí sinh để bắt đầu cuộc thi",
            link:"/vote-game/setting"
        }))
        return false;
    }
    if(numberExaminer < MIN_LIMIT_EXAMINER){
        res.status(400).send(({
            success: false,
            message: "Vui lòng thêm giám khảo để bắt đầu cuộc thi",
            link:"/vote-game/setting"
        }))
        return false;
    }

    const gameData = await GameService.setStatusGame(req.body.status);

   if(gameData != false){
    res.status(201).send(({
        success: true,
        message: "Cập trạng thái cuộc thi thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Cập nhật không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.get('/setting/candidate/:id_candidate', admin_auth ,async (req, res, next)=>{
   const candidateData = await CandidateService.getCandidateInformation(req.params.id_candidate)

   if(candidateData != false){
    res.status(200).send(({
        success: true,
        message: "Lấy thông tin thí sinh thành công",
        link:"/vote-game/setting",
        data: candidateData
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Lấy thông tin thí sinh không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/candidate/create',upload.single('avatar'), admin_auth ,async (req, res, next)=>{
   
   const candidateData = await CandidateService.createCandidate(
        req.body.fullname,
        req.body.title,
        req?.file?.buffer || null,
        req.body.type)

   if(candidateData != false){
    res.status(201).send(({
        success: true,
        message: "Tạo thí sinh thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Tạo thí sinh không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/candidate/update',upload.single('avatar'), admin_auth ,async (req, res, next)=>{
   
   const resultUpdate = await CandidateService.updateCandidate(
        req.body.id_candidate,
        req.body.fullname,
        req.body.title,
        req?.file?.buffer || null)

   if(resultUpdate != false){
    res.status(201).send(({
        success: true,
        message: "Cập nhật thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Cập nhật không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/candidate/delete',upload.none(), admin_auth ,async (req, res, next)=>{
   
   const result = await CandidateService.deleteCandidate(req.body.id_candidate)

   if(result != false){
    res.status(201).send(({
        success: true,
        message: "Xoá thí sinh thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Xoá thí sinh không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/candidate/start',upload.none(), admin_auth ,async (req, res, next)=>{
   
   const result = await CandidateService.startCandidate(req.body.id_candidate)

   if(result != false){
    res.status(201).send(({
        success: true,
        message: "Bắt đầu thi thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Bắt đầu thi không thành công\nĐang tồn tại thí sinh đang thi hoặc cuộc thi chưa bắt đầu",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/candidate/finish',upload.none(), admin_auth ,async (req, res, next)=>{
   
    const result = await CandidateService.finishCandidate(req.body.id_candidate)
 
    if(result != false){
     res.status(201).send(({
         success: true,
         message: "Kết thúc thi thành công",
         link:"/vote-game/setting"
     }))
    }else{
     res.status(400).send(({
         success: false,
         message: "Kết thúc thi không thành công",
         link:"/vote-game/setting"
     }))
    }
 });

router.post('/setting/candidate/list/start',upload.none(), admin_auth ,async (req, res, next)=>{
   
    const result = await CandidateService.startListCandidate()
 
    if(result != false){
     res.status(201).send(({
         success: true,
         message: "Bắt bình chọn thành công",
         link:"/vote-game/setting"
     }))
    }else{
     res.status(400).send(({
         success: false,
         message: "Bắt bình chọn không thành công\nĐang tồn tại thí sinh đang thi hoặc cuộc thi chưa bắt đầu",
         link:"/vote-game/setting"
     }))
    }
 });
 
router.post('/setting/candidate/list/finish',upload.none(), admin_auth ,async (req, res, next)=>{
    
     const result = await CandidateService.stopListCandidate()
  
     if(result != false){
      res.status(201).send(({
          success: true,
          message: "Kết thúc bình chọn thành công",
          link:"/vote-game/setting"
      }))
     }else{
      res.status(400).send(({
          success: false,
          message: "Kết thúc bình chọn không thành công",
          link:"/vote-game/setting"
      }))
     }
  }); 

router.get('/setting/examiner/:id_examiner', admin_auth ,async (req, res, next)=>{
    const examinerData = await ExaminerService.getExaminerInformation(req.params.id_examiner)
 
    if(examinerData != false){
     res.status(200).send(({
         success: true,
         message: "Lấy thông tin giám khảo thành công",
         link:"/vote-game/setting",
         data: examinerData
     }))
    }else{
     res.status(400).send(({
         success: false,
         message: "Lấy thông tin giám không thành công",
         link:"/vote-game/setting"
     }))
    }
 });

router.post('/setting/examiner/create',upload.single('avatar'), admin_auth ,async (req, res, next)=>{
   const examinerData = await ExaminerService.createExaminer(
        req.body.username,
        req.body.password,
        req.body.fullname,
        req.body.title,
        req?.file?.buffer || null)

   if(examinerData != false){
    res.status(201).send(({
        success: true,
        message: "Tạo giám khảo thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Tạo giám khảo không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/examiner/update',upload.single('avatar'), admin_auth ,async (req, res, next)=>{
   
   const resultUpdate = await ExaminerService.updateExaminer(
        req.body.id_examiner,
        req.body.fullname,
        req.body.title,
        req.body.re_password || null,
        req?.file?.buffer || null)

   if(resultUpdate != false){
    res.status(201).send(({
        success: true,
        message: "Cập nhật thành công",
        link:"/vote-game/setting"
    }))
   }else{
    res.status(400).send(({
        success: false,
        message: "Cập nhật không thành công",
        link:"/vote-game/setting"
    }))
   }
});

router.post('/setting/examiner/delete',upload.none(), admin_auth ,async (req, res, next)=>{
   
    const result = await ExaminerService.deleteExaminer(req.body.id_examiner)
 
    if(result != false){
     res.status(201).send(({
         success: true,
         message: "Xoá giám khảo thành công",
         link:"/vote-game/setting"
     }))
    }else{
     res.status(400).send(({
         success: false,
         message: "Xoá giám khảo không thành công",
         link:"/vote-game/setting"
     }))
    }
 });

router.get('/setting/viewer/vote',upload.none() ,async (req, res, next)=>{
   
    const result = await GameService.getNumberOfVote()
 
    if(result != false){
     res.status(201).send(({
         success: true,
         message: "Get vote successfull",
         link:"/vote-game/setting",
         data: result
     }))
    }else{
     res.status(400).send(({
         success: false,
         message: "Get vote fail",
         link:"/vote-game/setting",
         data: null
     }))
    }
});

router.get('/setting/viewer/vote/list',upload.none() ,async (req, res, next)=>{
   
    const result = await CandidateService.getListCandidateTypeListOrderByRattingDESC()
 
    if(result != false){
     res.status(201).send(({
         success: true,
         message: "Get vote list successfull",
         link:"/vote-game/setting",
         data: result
     }))
    }else{
     res.status(400).send(({
         success: false,
         message: "Get vote list fail",
         link:"/vote-game/setting",
         data: null
     }))
    }
});
module.exports = router;