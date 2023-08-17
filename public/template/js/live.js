const ws = new WebSocket(`ws://${location.host}/realtime`);


function openConnectionToServer() {
  ws.onopen = function (){
    const CLIENT_DATA = {
      chanel: "LIVE",
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
    case "VOTE":
      console.log('call vote game');
      updateNumberOfVoteDashBoard();
      break;
    case "VOTE_LIST":
      console.log('call VOTE_LIST game');
      updateListVoteDashBoard();
      break;
    case "SET_POINT":
      console.log('call point game');
      getInformationCurrentGame();
      break;
    case "GET_INFO_GAME":
      console.log('call start game');
      if(data?.reload){
        // caches.delete()
        location.reload()
      }else{
        getInformationCurrentGame();
      }
      break;
  
    case "NUMBER_VIEWER":
      var number_viewer = JSON.parse(data?.viewer) || 0;
      $("#number_viewer").text(number_viewer)
      break;
  
    default:
      break;
  }
 })
}

function getInformationCurrentGame(){
    $.ajax({
        type: "GET",
        url: "vote-game/info",
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
            if(data.data == null){
                $(".no_container").css("display", 'flex')
                $(".container").css("display", 'none')
            }else{
                let gameData = data.data
                $("#title_current_game").text(' ')
                // $("#title_current_game").text(gameData.game.name_game)
                $("body").css('background-image',"url('/template/image/background.png')")
                
                let curent_candidate = gameData.curent_candidate
                if(curent_candidate?.fullname == null){
                  $(".no_current_candidate").css("display",'block')
                  $(".current_candidate").css("display",'none')
                }else{
                  $(".no_current_candidate").css("display",'none')
                  $(".current_candidate").css("display",'block')
                  $("#avatar_candidate").attr("src", `/template/image/${curent_candidate.avatar}`)
                  $("#candidate_title").text(curent_candidate.title)
                  $("#candidate_fullname").text(curent_candidate.fullname)
                  $("#candidate_point").text("Tổng Điểm: " + curent_candidate.point)
                  $("#candidate_vote").text("Tổng Bình Chọn: "+curent_candidate.ratting)
                }

                $("#number_examiner").text(gameData.examiner.total_examiner)
                $("#number_candidate").text(gameData.candidate.total_candidate)
               

                let listExaminer = gameData.point_current_candidate;
                if(listExaminer.length == 0){
                  $('.footer').css('opacity', '0');
                }else{
                  $('.footer').css('display', 'block')
                  $('.footer').css('opacity', '1');
                }
                $('.list_examiner').empty()
                listExaminer.forEach(examiner => {
                    $('.list_examiner').append(`
                    <div class="examiner">
                        <div class="examiner_header">
                            <img src="/template/image/${examiner.examiner.avatar}" alt="" class="examiner_avatar">
                            <p class="examiner_point">${examiner.point}</p>
                        </div>
                        <div class="examiner_bottom">
                            <h4 class="examiner_fullname">${examiner.examiner.fullname}</h4>
                            <p class="examiner_title">${examiner.examiner.title}</p>
                        </div>
                    </div>
                    `)
                });
            }

        },
        error: function(data){
            alert("Có lỗi trong quá trình tải dữ liệu");
        }
      }).done(function(){
        $('.loading').css('animation', 'fade-out 1s')
        window.setTimeout(
          function removethis()
          {
            $('.loading').css('display','none')
          }, 1000); 
      })
}

function updateNumberOfVoteDashBoard(){
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "GET",
      url: "vote-game/setting/viewer/vote",
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        if(data == null) return;
        $('#number_vote').text(data.data.total_ratting)
        $('#candidate_vote').text(data.data.current_ratting)
  
      },
      error: function(data){

      }
    })
}

function updateListVoteDashBoard(){
  $.ajax({
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
    },
    type: "GET",
    url: "vote-game/setting/viewer/vote/list",
    enctype:"multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    encode: true,
    success: function (data) {
      if(data == null){
        $(".list_vote").css("display", "none")
        return;
      }
      var listVoteData = data.data?.listCandidateTypeList;
      $('.footer').css('display', 'none');
      $('.body_list_vote_component').empty();
      listVoteData.forEach(candidate => {
        $('.body_list_vote_component').append(`
        <div class="list_vote_candidate">
            <div class="list_vote_candidate_header">
                <img src="/template/image/${candidate.avatar}" alt="" class="examiner_avatar">
                <p class="list_vote_ratting">${candidate.ratting}</p>
            </div>
            <div class="list_vote_candidate_body">
                <h4 class="list_vote_candidate_fullname">${candidate.fullname}</h4>
                <p class="list_vote_candidate_title">${candidate.title}</p>
            </div>
        </div>
        `)
      });

    },
    error: function(data){
      $(".list_vote").css("display", "none")
    }
  })
}

openConnectionToServer();
updateNumberOfVoteDashBoard();
updateListVoteDashBoard();
getInformationCurrentGame();
getMessageFromServer();
