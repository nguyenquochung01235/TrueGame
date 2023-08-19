const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'
const ws = new WebSocket(`${protocol}://${location.host}/realtime`);

function openConnectionToServer() {
  
  ws.onopen = function (){
    const CLIENT_DATA = {
      chanel: "EXAMINER",
      token: localStorage.getItem('token'),
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
      break;
  
    default:
      break;
  }
 })
}

function togleCaculator(){
    $('#down_caculator_button').on('click', function (event) {
        $('.point_caculator').css('display','none')
        $('#up_caculator_button').css('display','block')
        $('#down_caculator_button').css('display','none')
    }) 
    $('#up_caculator_button').on('click', function (event) {
        $('.point_caculator').css('display','flex')
        $('#up_caculator_button').css('display','none')
        $('#down_caculator_button').css('display','block')
    }) 
}

function logut(){
  $("#logout").on('click', function() {
    localStorage.removeItem('token');
    window.location.href = "examiner/login"
  })
}

function getExaminerInformation(){
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "GET",
        url: "examiner/info",
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          $("#infor_examiner_fullname").text(data.examiner.fullname)
          $("#infor_examiner_title").text(data.examiner.title)
          $("#infor_examiner_avatar").attr("src", `/template/image/${data.examiner.avatar}`)

          getInformationCurrentGame();
          
        },
        error: function(data){
          alert(data.responseJSON.message);
          window.location.href = data.responseJSON.link
        }
      }).done(
        openConnectionToServer()
      )
}
function getPointLadderInformation(){
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "GET",
        url: "examiner/game/point/ladder",
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          $("#max_point").text(`Điểm Tối Đa: ${data.game_data.total_max_point.total_max_point}`)
          $('.form_body_point_ladder').empty();
          
          data.game_data.point_lader.forEach((point_ladder) => {
            $('.form_body_point_ladder').append(`
              <div class="point_ladder_component">
                <p>${point_ladder.title}<br><small>(Tối đa: ${point_ladder.max_point})</small></p>
                <input required class="input_point_ladder" type="number" step="0.1" min="0" max="${point_ladder.max_point}" placeholder="0">
              </div>
            `);
          });
        },
        error: function(data){
          alert(data.responseJSON.message);
          window.location.href = data.responseJSON.link
        }
      })
}

function getInformationCurrentGame(){
    $(".input_point_ladder").each(()=>{
        $(this).val(0)
    })
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "GET",
        url: "examiner/game/info",
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          $('#exam_title > h3').text(data.game_data.game.name_game)
          if(data.game_data.candidate != null){
            $("#have_current_candidate").css("display", 'flex')
            $("#not_have_current_candidate").css("display", 'none')
            $(".examiner_point").css("display", 'block')

            $('#candidate_avatar > img').attr("src", `/template/image/${data.game_data.candidate.avatar}`)
            $('#candidate_infor > h3').text(data.game_data.candidate.fullname)
            $('#candidate_infor > p').text(data.game_data.candidate.title)
            $('#candidate_infor').attr('data-candidate',data.game_data.candidate.id_candidate)
          
            if(data.game_data.candidate?.points[0]?.point){
              $(".point_caculator").css("display", 'none')
              $(".point_view").css("display", 'block')
              $(".point_view > h1").text("Điểm đã chấm: " + data.game_data.candidate.points[0]?.point)
              $('#down_caculator_button').css('display','none')
            }else{
              $(".point_caculator").css("display", 'none')
              $(".point_view").css("display", 'none')
              $('#down_caculator_button').css('display','none')
              $('#up_caculator_button').css('display','block')
            }
          }else{
            $("#have_current_candidate").css("display", 'none')
            $("#not_have_current_candidate").css("display", 'flex')
            $('#candidate_infor > h3').text("Không có phần thi nào đang diễn ra")
            $(".examiner_point").css("display", 'none')
          }
        },
        error: function(data){
          alert(data.responseJSON.message);
          window.location.href = 'examiner/login'
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

function setTotalPoint(){
  $(document).on('change', ".input_point_ladder", function() {
    let total_point = 0;
      $(".input_point_ladder").each(()=>{
        if($(this).val()*1> $(this).attr('max')*1){
          $(this).val($(this).attr('max')* 1 )
        }
        if($(this).val() * 1 < $(this).attr('min') * 1){
          $(this).val($(this).attr('min') * 1)
        }
      })

      $(".input_point_ladder").each((index,element)=>{
        total_point = total_point + (element.value * 1)
      })

      $("#total_point").text("Tổng Số Điểm: "+total_point.toFixed(1)*1)
  });
}

function setPointByExaminer(){

  $(".point_caculator").on('submit', function(event){
    event.preventDefault();
    if(confirm("Xác nhận chấm điểm cho phần thi này")){
      let total_point = 0;
      $(".input_point_ladder").each((index,element)=>{
        total_point = total_point + (element.value * 1)
      })

      const formSetPointCandidate = new FormData();
      formSetPointCandidate.append("id_candidate", $('#candidate_infor').attr('data-candidate'));
      formSetPointCandidate.append("point", total_point.toFixed(1)*1);
      $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "POST",
        url: "examiner/game/point",
        data: formSetPointCandidate,
        enctype:"multipart/form-data",
        cache: false,
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          alert(data.message)
          const CLIENT_DATA = {
            chanel: "EXAMINER",
            token: localStorage.getItem('token'),
            data: {
              function: "SET_POINT"
            },
          }
          ws.send(JSON.stringify(CLIENT_DATA))
          getInformationCurrentGame()
          // location.reload()
        },
        error: function(data){
          alert(data.responseJSON.message);
          location.reload()
        }
      })
    }
  })
}



logut();
togleCaculator();
getExaminerInformation();
getPointLadderInformation();
setTotalPoint();
setPointByExaminer();
getMessageFromServer();