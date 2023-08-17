const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'
const ws = new WebSocket(`${protocol}://${location.host}/realtime`);

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

    case "VOTE_LIST":
      console.log('call VOTE_LIST');
      getListCandidateForVotrOfCurrentGame();
      localStorage.setItem('list_voted', false);
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
            $(".viewer_vote").css("display", 'flex')
            if(data.game_data.curent_candidate.id_candidate.toString() !=  localStorage.getItem('id_candidate')){
              localStorage.setItem('id_candidate', data.game_data.curent_candidate.id_candidate)
              localStorage.setItem('voted', false);
            }

          }else{
            $("#have_current_candidate").css("display", 'none')
            $("#not_have_current_candidate").css("display", 'flex')
            $('#candidate_infor > h3').text("Không có phần thi nào đang diễn ra")
            $(".vote").css("display", 'none')
            $(".viewer_vote").css("display", 'none')
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

function getListCandidateForVotrOfCurrentGame(){
  $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "GET",
      url: "viewer/game/info/list",
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        if(data.game_data?.listCandidateTypeList.length != 0){
          $('.content_vote_list').css('display', 'flex')
          $('.content').css('display', 'none')
          $('.body_list_vote_candidate').empty()
          let listVoteCandidate = data.game_data?.listCandidateTypeList;
          listVoteCandidate.forEach(candidate => {
            $('.body_list_vote_candidate').append(`
              <div class="item_list_vote_candidate">
                <div class="infor_component_list_vote_candidate">    
                    <img src="/template/image/${candidate.avatar}" alt="" class="avatar_list_vote_candidate">
                    <div class="infor_list_vote_candidate">
                        <h3 class="fullname_list_vote_candidate">${candidate.fullname}</h3>
                        <p class="title_list_vote_candidate">${candidate.title}</p>
                    </div>
                </div>
                <input type="checkbox" value=${candidate.id_candidate} class="checkbox_list_vote_candidate">
              </div>
            `)
          });

          var limit = data.game_data.max_vote;
          $('.checkbox_list_vote_candidate').on('change', function(evt) {
            if($('.checkbox_list_vote_candidate:checked').length > limit){
              alert(`Vượt quá số lượng bình chọn quy định\nVui lòng chỉ chọn ${limit} thí sinh`)
              this.checked = false;
            }
          });
        } else{
          $('.content_vote_list').css('display', 'none')
          $('.content').css('display', 'flex')
        } 
      },
      error: function(data){
           $('.content_vote_list').css('display', 'none')
          $('.content').css('display', 'flex')
      }
    }).done(function(){
      
    })
    
}


function voteList(){
  if(localStorage.getItem('list_voted') == 'true'){
    $('#vote_list').attr('disabled', true)
    $('#vote_list').css('opacity', 0.6)
    $('#vote_list').text('CẢM ƠN BẠN ĐÃ BÌNH CHỌN')
  }
  $('#vote_list').on('click', function () {
    let arrayIDCandidate = [];
    if(localStorage.getItem('list_voted') == 'false' || localStorage.getItem('list_voted') == null ){
      if(confirm("Xác nhận bình chọn cho phần thi này")){
        $('.checkbox_list_vote_candidate:checked').each(function(){
          arrayIDCandidate.push(this.value);
          this.checked = false;
        });
        const formSetVoteCandidate = new FormData();
        formSetVoteCandidate.append('list_candidate', arrayIDCandidate)
        $.ajax({
          type: "POST",
          url: "viewer/game/vote/list",
          data: formSetVoteCandidate,
          enctype:"multipart/form-data",
          cache: false,
          contentType: false,
          processData: false,
          encode: true,
          success: function (data) {
            alert(data.message)
            localStorage.setItem('list_voted',true)
            
            $('#vote_list').attr('disabled', true)
            $('#vote_list').css('opacity', 0.6)
            $('#vote_list').text('CẢM ƠN BẠN ĐÃ BÌNH CHỌN')

            const CLIENT_DATA = {
              chanel: "VIEWER",
              token: null,
              data: {
                function: "VOTE_LIST"
              },
            }
            ws.send(JSON.stringify(CLIENT_DATA))
            
            getInformationCurrentGame()
            location.reload()
          },
          error: function(data){
            alert(data.responseJSON.message);
            location.reload()
          }
        })
      }
    }else{
      $('#vote_list').attr('disabled', true)
      $('#vote_list').css('opacity', 0.6)
      $('#vote_list').text('CẢM ƠN BẠN ĐÃ BÌNH CHỌN')

    }

   })
}

openConnectionToServer();
getMessageFromServer();
getInformationCurrentGame();
voteForCandidate();
getListCandidateForVotrOfCurrentGame();
voteList();