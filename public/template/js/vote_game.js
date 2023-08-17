// request permission
const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'
const ws = new WebSocket(`${protocol}://${location.host}/realtime`);


function getGameMasterInformation() {
  $.ajax({
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
    },
    type: "GET",
    url: "setting/game-master",
    contentType: false,
    processData: false,
    encode: true,
    success: function (data) {
      console.log(data);
    },
    error: function(data){
      alert(data.responseJSON.message);
      window.location.href = data.responseJSON.link
    }
  }).done(
      openConnectionToServer()
  )
}

function getImagebackGround(event) { 
  let reviewUploadField = document.getElementById('upload_label');
  let url;
    const fileBackground = event.target.files[0];
    url = window.URL.createObjectURL(fileBackground);
    reviewUploadField.style.backgroundImage = `url('${url}')`;
}

function setBackgroundGameView() {
  $("#input_background").on("change",getImagebackGround )
}

function addMorePointLadder(){
  $("#add_more_point_ladder_button").on('click', function(){
    var point_ladder_row = $(`<div class="form-group row" style="margin-left: 0;">
                  <input type="text" required class="col form-control point_ladder_title"
                  placeholder="Nhập tiêu chí">
                  <input type="number" step="0.5" min="0" required class="col-3 form-control point_ladder_max_point"
                  placeholder="Nhập điểm"
                  style="margin-left: 10px;"
                  >
                  <button type="button" class="btn btn-danger remove_point_ladder_button" style="margin-left: 10px;">X</button>
              </div>`);
    if($("#form_point_ladder").length == 1){
      $("#form_point_ladder").append(point_ladder_row);
    }else{
      // $("#form_update_game > .card-body").append(point_ladder_row).insertBefore("#add_more_point_ladder_button");
      (point_ladder_row).insertBefore("#add_more_point_ladder_button");
    }
    
  });
}

function removePointLadder(){
  $(document).on('click', ".remove_point_ladder_button", function() {
      $(this.parentElement).remove()
});

}


function createNewGame(){
  $("#form_create_game").on("submit",function (event) {
    event.preventDefault();
    const formDataCreateNewGame = new FormData();
    formDataCreateNewGame.append("name_game", $("#name_game").val());
    formDataCreateNewGame.append("background", $("#input_background")[0].files[0]);
    formDataCreateNewGame.append("max_vote", $("#max_vote").val());
    let arrayPointLadderTitle = []
    let arrayPointLadderMaxPoint = []

    $('.point_ladder_title').each(function(){
      arrayPointLadderTitle.push(this.value);
    });

    $('.point_ladder_max_point').each(function(){
      arrayPointLadderMaxPoint.push(this.value);
    });

    if(arrayPointLadderTitle.length != arrayPointLadderMaxPoint.length){
          alert("Lỗi tiêu chí");
          location.reload();
    }

    let arrayObjectPointLadder = [];

    arrayPointLadderTitle.forEach((point_title, index)=>{
      arrayObjectPointLadder.push({
        title: point_title,
        max_point: arrayPointLadderMaxPoint[index]
      });
    })
    
    formDataCreateNewGame.append("point_ladder", JSON.stringify(arrayObjectPointLadder));

    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/game/create",
      data: formDataCreateNewGame,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        window.location.href = data.link
      
      },
      error: function(data){
        alert(data.responseJSON.message);
        window.location.href = data.responseJSON.link
      }
    }).done(
      ()=>{
        const MASTER_DATA = {
          chanel: "MASTER",
          token: localStorage.getItem('token'),
          data: {
            function: "GET_INFO_GAME"
          },
        }
        ws.send(JSON.stringify(MASTER_DATA));
      }
    )
  });
}

function togleUpdateGameScreen() {
  $('#update_game_infor_btn').on('click', function(){
    $('#popup_update_game').css('display', 'flex')
  });
  
  $('#update_game_infor_close_btn').on('click', function(){
    $('#popup_update_game').css('display', 'none')
  });
}

function updateGame() {
  $("#form_update_game").on("submit",function (event) {
    event.preventDefault();
    const formDataUpdateGame = new FormData();
    formDataUpdateGame.append("name_game", $("#name_game").val());
    formDataUpdateGame.append("background", $("#input_background")[0].files[0]);
    formDataUpdateGame.append("max_vote", $("#max_vote").val());

    let arrayPointLadderTitle = []
    let arrayPointLadderMaxPoint = []

    $('.point_ladder_title').each(function(){
      arrayPointLadderTitle.push(this.value);
    });

    $('.point_ladder_max_point').each(function(){
      arrayPointLadderMaxPoint.push(this.value);
    });

    if(arrayPointLadderTitle.length != arrayPointLadderMaxPoint.length){
          alert("Lỗi tiêu chí");
          location.reload();
    }

    let arrayObjectPointLadder = [];

    arrayPointLadderTitle.forEach((point_title, index)=>{
      arrayObjectPointLadder.push({
        title: point_title,
        max_point: arrayPointLadderMaxPoint[index]
      });
    })
    
    formDataUpdateGame.append("point_ladder", JSON.stringify(arrayObjectPointLadder));
  
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/game/update",
      data: formDataUpdateGame,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        // caches.delete()
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        window.location.href = data.responseJSON.link
      }
    }).done(
      ()=>{
        const MASTER_DATA = {
          chanel: "MASTER",
          token: localStorage.getItem('token'),
          data: {
            function: "GET_INFO_GAME",
            reload: true
          },
        }
        ws.send(JSON.stringify(MASTER_DATA));
      }
    )
  });
}

function changeStatusGame() {
  $("#game_start_btn").on("click",function (event) {
    event.preventDefault();
    const changeGameStatusFormData = new FormData();
    changeGameStatusFormData.append("status", 1);
    if(confirm("Bạn có muốn bắt đầu cuộc thi này không ?")){
      $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "POST",
        url: "setting/game/status",
        data: changeGameStatusFormData,
        enctype:"multipart/form-data",
        cache: false,
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          window.location.href = data.link
          const MASTER_DATA = {
            chanel: "MASTER",
            token: localStorage.getItem('token'),
            data: {
              function: "GET_INFO_GAME"
            },
          }
          ws.send(JSON.stringify(MASTER_DATA));
        },
        error: function(data){
          alert(data.responseJSON.message);
          // window.location.href = data.responseJSON.link
        }
      })
    }
    
  });
  $("#game_stop_btn").on("click",function (event) {
    event.preventDefault();
    const changeGameStatusFormData = new FormData();
    changeGameStatusFormData.append("status", 2);
    if(confirm("Bạn có muốn kêt thúc cuộc thi này không ?")){
      $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "POST",
        url: "setting/game/status",
        data: changeGameStatusFormData,
        enctype:"multipart/form-data",
        cache: false,
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          const MASTER_DATA = {
            chanel: "MASTER",
            token: localStorage.getItem('token'),
            data: {
              function: "GET_INFO_GAME"
            },
          }
          ws.send(JSON.stringify(MASTER_DATA));
          window.location.href = data.link
        },
        error: function(data){
          alert(data.responseJSON.message+"\nKết thúc không thành công. Đang tồn tại thí sinh đang thực hiện phần thi");
        }
      })
    }
  });
}

function togleAddNewCandidateScreen() {
  $('#add_new_candidate_btn').on('click', function(){
    $('#popup_add_new_candidate').css('display', 'flex')
  });
  
  $('#add_new_candidate_close_btn').on('click', function(){
    $('#popup_add_new_candidate').css('display', 'none')
  });
}

function getAvatarCandidate(event) { 
    let url;
    const avatarCandidate = event.target.files[0];
    url = window.URL.createObjectURL(avatarCandidate);
    $("#review_avatar").attr("src",`${url}`)
}

function setAvatarCandidate() {
  $("#avatar").on("change",getAvatarCandidate)
}

function addNewCandidate() {
  $("#form_add_new_candidate").on("submit",function (event) {
    event.preventDefault();
    const formDataAddNewCandidate = new FormData();
    formDataAddNewCandidate.append("fullname", $("#fullname").val());
    formDataAddNewCandidate.append("title", $("#title").val());
    formDataAddNewCandidate.append("avatar", $("#avatar")[0].files[0]);
    if($("#type").is(':checked')){
      formDataAddNewCandidate.append("type", 'LIST');
    }else{
      formDataAddNewCandidate.append("type", 'SINGLE');
    }

  
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/candidate/create",
      data: formDataAddNewCandidate,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        window.location.href = data.responseJSON.link
      }
    })
  });
}

function getDataCandidate(id_cadidate){
  const dataCandidate = $.ajax({
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
    },
    type: "GET",
    url: `setting/candidate/${id_cadidate}`,
    enctype:"multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    encode: true,
    success: function (data) {
      return data
    },
    error: function(data){
      alert(data.responseJSON.message);
      return false;
    }
  })
  return dataCandidate;
}

function togleUpdateCandidateScreen(){
  $(".update-candidate").on("click",  function(event) {
      event.preventDefault();
      const candidate= getDataCandidate(this.getAttribute('data-user'));
      candidate.done( function(candidateData){
         $('#popup_update_candidate').css('display', 'flex');
         $('#review_avatar_update').attr('src', `/template/image/${candidateData.data.avatar}`)
         $('#form_update_candidate > .card-body > .form-group > #id_candidate').attr('value', candidateData.data.id_candidate)
         $('#form_update_candidate > .card-body > .form-group > #fullname').attr('value', candidateData.data.fullname)
         $('#form_update_candidate > .card-body > .form-group > #title').attr('value', candidateData.data.title)
      })
  })

  $('#update_candidate_close_btn').on('click', function(){
    $('#popup_update_candidate').css('display', 'none');
  })
}

function getAvatarCandidateUpdate(event) { 
  let url;
  const avatarCandidate = event.target.files[0];
  url = window.URL.createObjectURL(avatarCandidate);
  $("#review_avatar_update").attr("src",`${url}`)
}

function setAvatarCandidateUpdate() {
$("#avatar_update").on("change",getAvatarCandidateUpdate)
}

function updateCandidate(){
  $("#form_update_candidate").on("submit",function (event) {
    event.preventDefault();
    const formUpdateCandidate = new FormData();
    formUpdateCandidate.append("id_candidate", $("#form_update_candidate > .card-body > .form-group > #id_candidate").val());
    formUpdateCandidate.append("fullname", $("#form_update_candidate > .card-body > .form-group > #fullname").val());
    formUpdateCandidate.append("title", $("#form_update_candidate > .card-body > .form-group > #title").val());
    formUpdateCandidate.append("avatar", $("#avatar_update")[0].files[0]);
    
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/candidate/update",
      data: formUpdateCandidate,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        alert(data.message)
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        window.location.href = data.responseJSON.link
      }
    })
  });
}

function deleteCandidate(){
  $(".delete-candidate").on("click", function(event) {
      event.preventDefault();
      if(confirm("Bạn có muốn xoá thí sinh này không ?")){
      const formDeleteCandidate = new FormData();
      formDeleteCandidate.append("id_candidate", this.getAttribute('data-user'));
      $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
        },
        type: "POST",
        url: "setting/candidate/delete",
        data: formDeleteCandidate,
        enctype:"multipart/form-data",
        cache: false,
        contentType: false,
        processData: false,
        encode: true,
        success: function (data) {
          window.location.href = data.link
        },
        error: function(data){
          alert(data.responseJSON.message);
          window.location.href = data.responseJSON.link
        }
      })
    }
  })
}

function startCandidate(){
  $(".start-candidate").on("click", function(event) {
    event.preventDefault();
    if(confirm("Bạn có muốn bắt đầu phần thi cho thí sinh này không ?")){
    const formStartCandidate = new FormData();
    formStartCandidate.append("id_candidate", this.getAttribute('data-user'));
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/candidate/start",
      data: formStartCandidate,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        const MASTER_DATA = {
          chanel: "MASTER",
          token: localStorage.getItem('token'),
          data: {
            function: "GET_INFO_GAME"
          },
        }
        ws.send(JSON.stringify(MASTER_DATA));
        alert(data.message)
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        // window.location.href = data.responseJSON.link
      }
    })
  }
})
}

function finishCandidate(){
  $(".finish-candidate").on("click", function(event) {
    event.preventDefault();
    if(confirm("Bạn có muốn kết thúc phần thi cho thí sinh này không ?")){
    const formFinishCandidate = new FormData();
    formFinishCandidate.append("id_candidate", this.getAttribute('data-user'));
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/candidate/finish",
      data: formFinishCandidate,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        const MASTER_DATA = {
          chanel: "MASTER",
          token: localStorage.getItem('token'),
          data: {
            function: "GET_INFO_GAME"
          },
        }
        ws.send(JSON.stringify(MASTER_DATA));
        alert(data.message)
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        // window.location.href = data.responseJSON.link
      }
    })
  }
})
}

function togleAddNewExaminerScreen() {
  $('#add_new_examiner_btn').on('click', function(){
    $('#popup_add_new_examiner').css('display', 'flex')
  });
  
  $('#add_new_examiner_close_btn').on('click', function(){
    $('#popup_add_new_examiner').css('display', 'none')
  });
}

function getAvatarExaminer(event) { 
  let url;
  const avatarExaminer = event.target.files[0];
  url = window.URL.createObjectURL(avatarExaminer);
  $("#review_avatar_examiner").attr("src",`${url}`)
}

function setAvatarExaminer() {
$("#examiner_avatar").on("change",getAvatarExaminer)
}

function addNewExaminer() {
$("#form_add_new_examiner").on("submit",function (event) {
  event.preventDefault();
  const formDataAddNewExaminer = new FormData();
  formDataAddNewExaminer.append("fullname", $("#form_add_new_examiner > .card-body > .form-group > #fullname").val());
  formDataAddNewExaminer.append("title", $("#form_add_new_examiner > .card-body > .form-group > #title").val());
  formDataAddNewExaminer.append("username", $("#form_add_new_examiner > .card-body > .form-group > #username").val());
  formDataAddNewExaminer.append("password", $("#form_add_new_examiner > .card-body > .form-group > #password").val());
  formDataAddNewExaminer.append("avatar", $("#examiner_avatar")[0].files[0]);

  $.ajax({
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
    },
    type: "POST",
    url: "setting/examiner/create",
    data: formDataAddNewExaminer,
    enctype:"multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    encode: true,
    success: function (data) {
      alert(data.message);

      window.location.href = data.link
    },
    error: function(data){
      alert(data.responseJSON.message);
      window.location.href = data.responseJSON.link
    }
  })
});
}

function getDataExaminer(id_examiner){
  const dataExaminer = $.ajax({
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
    },
    type: "GET",
    url: `setting/examiner/${id_examiner}`,
    enctype:"multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    encode: true,
    success: function (data) {
      return data
    },
    error: function(data){
      alert(data.responseJSON.message);
      return false;
    }
  })
  return dataExaminer;
}

function togleUpdateExaminerScreen(){
  $(".update-examiner").on("click",  function(event) {
      event.preventDefault();
      const examiner= getDataExaminer(this.getAttribute('data-user'));
      examiner.done( function(examinerData){
         $('#popup_update_examiner').css('display', 'flex');
         $('#review_update_avatar_examiner').attr('src', `/template/image/${examinerData.data.avatar}`)
         $('#form_update_examiner > .card-body > .form-group > #id_examiner').attr('value', examinerData.data.id_examiner)
         $('#form_update_examiner > .card-body > .form-group > #username').attr('value', examinerData.data.username)
         $('#form_update_examiner > .card-body > .form-group > #fullname').attr('value', examinerData.data.fullname)
         $('#form_update_examiner > .card-body > .form-group > #title').attr('value', examinerData.data.title)
      })
  })

  $('#update_examiner_close_btn').on('click', function(){
    $('#popup_update_examiner').css('display', 'none');
  })
}

function getAvatarExaminerUpdate(event) { 
  let url;
  const avatarExaminer = event.target.files[0];
  url = window.URL.createObjectURL(avatarExaminer);
  $("#review_update_avatar_examiner").attr("src",`${url}`)
}

function setAvatarCandidateUpdate() {
$("#update_examiner_avatar").on("change",getAvatarExaminerUpdate)
}

function updateExaminer(){
  $("#form_update_examiner").on("submit",function (event) {
    event.preventDefault();
    const formUpdateExaminer = new FormData();
    formUpdateExaminer.append("id_examiner", $("#form_update_examiner > .card-body > .form-group > #id_examiner").val());
    formUpdateExaminer.append("fullname", $("#form_update_examiner > .card-body > .form-group > #fullname").val());
    formUpdateExaminer.append("title", $("#form_update_examiner > .card-body > .form-group > #title").val());
    formUpdateExaminer.append("avatar", $("#update_examiner_avatar")[0].files[0]);
    formUpdateExaminer.append("re_password", $("#form_update_examiner > .card-body > .form-group > #re_password").val());
    
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/examiner/update",
      data: formUpdateExaminer,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        alert(data.message)
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        window.location.href = data.responseJSON.link
      }
    })
  });
}

function deleteExaminer(){
  $(".delete-examiner").on("click", function(event) {
    event.preventDefault();
    if(confirm("Bạn có muốn xoá giám khảo này không ?")){
    const formDeleteExaminer = new FormData();
    formDeleteExaminer.append("id_examiner", this.getAttribute('data-user'));
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/examiner/delete",
      data: formDeleteExaminer,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        window.location.href = data.responseJSON.link
      }
    })
  }
})
}

function openConnectionToServer(){
  
  ws.onopen = function(){
    const MASTER_DATA = {
      chanel: "MASTER",
      token: localStorage.getItem('token'),
      data: null,
    }
    ws.send(JSON.stringify(MASTER_DATA));
  }

  ws.onerror = function(){
    alert("Connect realtime server have some problem. Please try again");
  }

}

function updateCurrentExaminerPointDashBoard(){
  $.ajax({
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
    },
    type: "GET",
    url: "setting/info",
    enctype:"multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    encode: true,
    success: function (data) {
      if(data == null) return;

      if(data.data.point_current_candidate != null){
        const point_current_candidate =  data.data.point_current_candidate
        $('.examiner_body_card_list').empty()
        point_current_candidate.forEach(point => {
          $('.examiner_body_card_list').append(`
            <div class="info-box mb-3">
                <span class="info-box-icon bg-warning elevation-1"><img
                    src="/template/image/${point.examiner.avatar}" alt=""
                        srcset=""></span>

                <div class="info-box-content">
                    <span class="info-box-text">${point.examiner.fullname}</span>
                    <span class="info-box-text">${point.examiner.title}</span>
                </div>
                <span class="info-box-icon bg-primary elevation-1">
                    <p>${point.point}</p>
                </span>

                <!-- /.info-box-content -->
            </div>
          `)
        });
        $('#examiner_total_point_dashboard').text(`Tổng Điểm: ${data.data.curent_candidate.point}`)
        $('#candidate_total_point_dashboard').text(`${data.data.curent_candidate.point}`)
      }

    },
    error: function(data){
      alert(data.responseJSON.message);
      location.reload()
    }
  })
}

function updateNumberOfVoteDashBoard(){
  $.ajax({
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
    },
    type: "GET",
    url: "setting/viewer/vote",
    enctype:"multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    encode: true,
    success: function (data) {
      if(data == null) return;
      $('#number_ratting').text(data.data.total_ratting)
      $('#current_number_vote').text(data.data.current_ratting)

    },
    error: function(data){
      // location.reload()
    }
  })
}

function startListCandidate(){
  $("#start_vote_list").on("click", function(event) {
    event.preventDefault();
    if(confirm("Bạn có muốn bắt đầu bình chọn cho danh sách thí sinh này không ?")){
    const formStartListCandidate = new FormData();
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/candidate/list/start",
      data: formStartListCandidate,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        const MASTER_DATA = {
          chanel: "MASTER",
          token: localStorage.getItem('token'),
          data: {
            function: "VOTE_LIST",
          },
        }
        ws.send(JSON.stringify(MASTER_DATA));
        alert(data.message)
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        // window.location.href = data.responseJSON.link
      }
    })
  }
})
}

function finishListCandidate(){
  $("#stop_vote_list").on("click", function(event) {
    event.preventDefault();
    if(confirm("Bạn có muốn kết thúc bình chọn cho danh sách thí sinh này không ?")){
    const formFinishListCandidate = new FormData();
    $.ajax({
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization",localStorage.getItem('token'));
      },
      type: "POST",
      url: "setting/candidate/list/finish",
      data: formFinishListCandidate,
      enctype:"multipart/form-data",
      cache: false,
      contentType: false,
      processData: false,
      encode: true,
      success: function (data) {
        const MASTER_DATA = {
          chanel: "MASTER",
          token: localStorage.getItem('token'),
          data: {
            function: "VOTE_LIST"
          },
        }
        ws.send(JSON.stringify(MASTER_DATA));
        alert(data.message)
        window.location.href = data.link
      },
      error: function(data){
        alert(data.responseJSON.message);
        // window.location.href = data.responseJSON.link
      }
    })
  }
})
}

function getMessageFromServer(){
  ws.addEventListener('message', event => {

   const data = JSON.parse(event.data) || null
   switch (data.function) {
     case "SET_POINT":
       updateCurrentExaminerPointDashBoard()
       break;
   
     case "VOTE":
       updateNumberOfVoteDashBoard()
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

getMessageFromServer()

// WEB FUNCTION
getGameMasterInformation();
updateNumberOfVoteDashBoard();

setBackgroundGameView();
addMorePointLadder();
removePointLadder();
createNewGame();
togleUpdateGameScreen();
updateGame();
changeStatusGame();
togleAddNewCandidateScreen();
setAvatarCandidate();
addNewCandidate();
togleUpdateCandidateScreen();
setAvatarCandidateUpdate();
updateCandidate();
deleteCandidate();
togleAddNewExaminerScreen();
setAvatarExaminer();
addNewExaminer();
togleUpdateExaminerScreen();
setAvatarCandidateUpdate();
updateExaminer();
deleteExaminer();
startCandidate();
finishCandidate();
startListCandidate();
finishListCandidate();
