
const ws = new WebSocket(`ws://${location.host}/realtime`);



function openConnectionToServer() {
  
  ws.onopen = function (){
    const CLIENT_DATA = {
      chanel: "VIEWER",
      token: null,
      data: null,
    }
    ws.send(JSON.stringify(CLIENT_DATA))
  }
}

function getMessageFromServer(){
 ws.addEventListener('message', event => {
  console.log(event.data);
  const data = JSON.parse(event.data) || null
  console.log(data.function);
  switch (data.function) {
    case "GET_INFO_GAME":
      console.log('call start game');
      getInformationCurrentGame();
      localStorage.setItem('voted', false);
      break;
  
    default:
      break;
  }
 })
}


function getInformationCurrentGame(){
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "GET",
        url: "viewer/game/info",
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          if(data.game_data.game !=null){
            $('#exam_title > h3').text(data.game_data.game.name_game)
          }else{
            $('#exam_title > h3').text('Chưa Có Cuộc Thi Nào Đang Diễn Ra')
          }

          if(data.game_data.curent_candidate != null){
            $("#have_current_candidate").css("display", 'flex')
            $("#not_have_current_candidate").css("display", 'none')
            $(".vote").css("display", 'block')
            $('#candidate_avatar > img').attr("src", `/template/image/${data.game_data.curent_candidate.avatar}`)
            $('#candidate_infor > h3').text(data.game_data.curent_candidate.fullname)
            $('#candidate_infor > p').text(data.game_data.curent_candidate.title)
            $('#candidate_infor').attr('data-candidate',data.game_data.curent_candidate.id_candidate)

            if(data.game_data.curent_candidate.id_candidate.toString() !=  localStorage.getItem('id_candidate')){
              localStorage.setItem('id_candidate', data.game_data.curent_candidate.id_candidate)
              localStorage.setItem('voted', false);
            }

          }else{
            $("#have_current_candidate").css("display", 'none')
            $("#not_have_current_candidate").css("display", 'flex')
            $('#candidate_infor > h3').text("Không có phần thi nào đang diễn ra")
            $(".vote").css("display", 'none')
          }
        },
        error: function(data){
          alert(data.responseJSON.message);
          location.reload()
        }
      }).done(function(){
        $('.loading').css('animation', 'fade-out 1s')
        window.setTimeout(
          function removethis()
          {
            $('.loading').css('display','none')
          }, 1000); 
        if(localStorage.getItem('voted') == 'true'){
          $(".vote").css("display", 'none')
          $(".vote-disable").css("display", 'block')
        }else{
          $(".vote").css("display", 'block')
          $(".vote-disable").css("display", 'none')
        }
      })
      
}

function voteForCandidate(){
    $("#vote_btn").on('click', function(event){
    if(localStorage.getItem('voted') == 'false'){
      if(confirm("Xác nhận bình chọn cho phần thi này")){
        const formSetVoteCandidate = new FormData();
        
        $.ajax({
          // beforeSend: function (xhr) {
          //     xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
          // },
          type: "POST",
          url: "viewer/game/vote",
          data: formSetVoteCandidate,
          enctype:"multipart/form-data",
          cache: false,
          contentType: false,
          processData: false,
          encode: true,
          success: function (data) {
            alert(data.message)
            const CLIENT_DATA = {
              chanel: "VIEWER",
              token: null,
              data: {
                function: "VOTE"
              },
            }
            ws.send(JSON.stringify(CLIENT_DATA))
            localStorage.setItem('voted', true);
            $(".vote").css("display", 'none')
            $(".vote-disable").css("display", 'block')
            
            // getInformationCurrentGame()
            // location.reload()
          },
          error: function(data){
            alert(data.responseJSON.message);
            location.reload()
          }
        })
      }
    }

     
    })
  
 
}


openConnectionToServer();
getMessageFromServer();
getInformationCurrentGame();
voteForCandidate();