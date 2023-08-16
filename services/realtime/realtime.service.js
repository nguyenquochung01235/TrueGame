require('dotenv').config();
const jwt = require('jsonwebtoken')
const WebSocket = require('ws');
const {uuid}  = require('uuidv4');
// const express = require("express");
// const app = express();
// const server = app.listen(3001, function () {
//     console.log("ws working on 3001")
// });

const WebSocketService = {}

WebSocketService.initialize = function(server){
    const wss = new WebSocket.Server({
        server:server,
        path: '/realtime'
    })

    const LiveListConnection = [];
    const ViewerListConnection = [];
    const ExaminerListConnection = [];
    const GameMasterListConnection = [];

    wss.on('connection', ws => {
        var viewer_uuid = uuid();
        console.log("New client connected !")
        ws.on('message', (data, isBinary) => {
            let clientData = isBinary ? data : data.toString()
            clientData = JSON.parse(clientData) || null;
            if(clientData == null) return;
            if(clientData.chanel == null) return;

            if(clientData.data == null){
                switch (clientData.chanel) {
                    
                    case "LIVE":
                        LiveListConnection.push({viewer_uuid,ws})
                        ws.send(JSON.stringify({
                            function: "NUMBER_VIEWER",
                            viewer: ViewerListConnection.length
                        }))
                        console.log("=================Live Connect==============")
                        break;

                    case "VIEWER":
                        ViewerListConnection.push({viewer_uuid,ws})
                        GameMasterListConnection.forEach(gameMaster => {
                            gameMaster.ws.send(JSON.stringify({
                                function: "NUMBER_VIEWER",
                                viewer: ViewerListConnection.length
                            }))
                        });
                        LiveListConnection.forEach(live => {
                            live.ws.send(JSON.stringify({
                                function: "NUMBER_VIEWER",
                                viewer: ViewerListConnection.length
                            }))
                        });
                        break;
                    
                    case "EXAMINER":
                        if(clientData.token == '' || clientData.token == undefined || clientData.token == null) break;
    
                        const examinerInformationObject = jwt.verify(clientData.token.replace('Bearer ', ''), process.env.JWT_KEY);
                        if(examinerInformationObject.username == undefined || examinerInformationObject.username == null) break;
    
                        const existDataExaminer =  ExaminerListConnection.find((examiner,index)=>{
                            if(examiner.username == examinerInformationObject.username){
                                ExaminerListConnection[index].ws = ws;
                                return examiner;
                            }
                            return null;
                        })
                        if(existDataExaminer == null){
                            username = examinerInformationObject.username;
                            ExaminerListConnection.push({username,ws})
                        }
                        break;
    
    
                    case "MASTER":
                        if(clientData.token == '' || clientData.token == undefined || clientData.token == null) break;
    
                        const gameMasterInformationObject = jwt.verify(clientData.token.replace('Bearer ', ''), process.env.JWT_KEY);
                        if(gameMasterInformationObject.username == undefined || gameMasterInformationObject.username == null) break;
    
                        const existDataGameMaster =  GameMasterListConnection.find((gameMaster,index)=>{
                            if(gameMaster.username == gameMasterInformationObject.username){
                                GameMasterListConnection[index].ws = ws 
                                return gameMaster;
                            }
                            return null;
                        })
                        if(existDataGameMaster == null){
                            username = gameMasterInformationObject.username;
                            GameMasterListConnection.push({username,ws})
                        }
                        ws.send(JSON.stringify({
                            function: "NUMBER_VIEWER",
                            viewer: ViewerListConnection.length
                        }))
                        break;
    
                    default:
                        break;
                }
            }else{
                switch (clientData.chanel) {
                    
                    case "VIEWER":

                        LiveListConnection.forEach(live => {
                            live.ws.send(JSON.stringify({
                                function: "VOTE"
                            }))
                        });
                        
                        GameMasterListConnection.forEach(gameMaster => {
                            gameMaster.ws.send(JSON.stringify({
                                function: "VOTE"
                            }))
                        });
                        break;
                    
                    case "EXAMINER":
                        switch (clientData.data.function) {
                            case "SET_POINT":

                                LiveListConnection.forEach(live => {
                                    live.ws.send(JSON.stringify({
                                        function: "SET_POINT"
                                    }))
                                });

                                GameMasterListConnection.forEach(gameMaster => {
                                    gameMaster.ws.send(JSON.stringify({
                                        function: "SET_POINT"
                                    }))
                                });
                                break;
                        
                            default:
                                break;
                        }
                        break;
    
                    case "MASTER":
                        switch (clientData.data.function) {
                            case "GET_INFO_GAME":

                                LiveListConnection.forEach(live => {
                                    live.ws.send(JSON.stringify({
                                        function: "GET_INFO_GAME",
                                        reload: clientData.data?.reload || false
                                    }))
                                });
                                
                                ExaminerListConnection.forEach(examiner => {
                                    examiner.ws.send(JSON.stringify({
                                        function: "GET_INFO_GAME"
                                    }))
                                });
                                ViewerListConnection.forEach(viewer => {
                                    viewer.ws.send(JSON.stringify({
                                        function: "GET_INFO_GAME"
                                    }))
                                });
                                break;

                            case "VOTE_LIST":
                                LiveListConnection.forEach(live => {
                                    live.ws.send(JSON.stringify({
                                        function: "VOTE_LIST",
                                    }))
                                });
                                
                                ViewerListConnection.forEach(viewer => {
                                    viewer.ws.send(JSON.stringify({
                                        function: "VOTE_LIST"
                                    }))
                                });
                                break;
                        
                            default:
                                break;
                        }
                        break;

                    default:
                        break;
                }
            }

        })


        ws.on('close', ()=>{
            for(var i=0; i<ViewerListConnection.length; i++) {
                if(ViewerListConnection[i].viewer_uuid == viewer_uuid) {
                    console.log('Client has disconnected !')
                    ViewerListConnection.splice(i, 1);
                }
            }
           
            for(var i=0; i<LiveListConnection.length; i++) {
                if(LiveListConnection[i].viewer_uuid == viewer_uuid) {
                    console.log('Client has disconnected !')
                    LiveListConnection.splice(i, 1);
                }
            }

            LiveListConnection.forEach(live => {
                live.ws.send(JSON.stringify({
                    function: "NUMBER_VIEWER",
                    viewer: ViewerListConnection.length
                }))
            });
            GameMasterListConnection.forEach(gameMaster => {
                gameMaster.ws.send(JSON.stringify({
                    function: "NUMBER_VIEWER",
                    viewer: ViewerListConnection.length
                }))
            });
        })

    })
}


WebSocketService.findObjectClientDataInListConnection = function () {
    
}




module.exports = WebSocketService;