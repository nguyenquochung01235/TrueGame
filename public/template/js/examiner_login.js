
$("#login_form").on('submit',function (event) {
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
        window.location.href = '../examiner'
    }
  )
  .fail((error)=>{
    alert('Username or password is wrong !!');
    location.reload();
  })
  event.preventDefault();
});