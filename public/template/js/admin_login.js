localStorage.clear()

$(document).ready(function () {
    $("#login_form").submit(function (event) {
      var formData = {
        username: $("#username").val(),
        password: $("#password").val(),
      };
  
      $.ajax({
        type: "POST",
        url: "login/auth",
        data: formData,
        dataType: "json",
        encode: true,
      })
      .done(
        (data)=>{
            localStorage.setItem('token', 'Bearer '+ data.token)
            window.location.href = '../setting'
        }
      )
      .fail((error)=>{
        alert('Username or password is wrong !!');
        location.reload();
      })
      event.preventDefault();
    });
  });
