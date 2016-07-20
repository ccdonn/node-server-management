var token = $.cookie('zmgrToken');
$(document).ready(function(){

  // console.info(token);

  $('#name').bind('keypress', function(event){
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#send").click();
    }
  });

  $('#pass').bind('keypress', function(event){
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#send").click();
    }
  });


  if (token) {
    $("#status").html("Already Logged in, Redirecting page...");
    $("#send").attr("disabled", true);
    $("#name").attr("disabled", true);
    $("#pass").attr("disabled", true);

    setTimeout(function () {
        window.location.href = '/web/welcome';
    }, 2000);

  } else {
    $("#status").html("No Auth/Not Login");
    $('#fgtpass').html('<a href="./forgetPass">Forget Password</a>');

    $("#send").bind("click", function(){
      var n = $("#name").val();
      var p = $("#pass").val();
      // console.info("name:"+n);
      // console.info("pass:"+p);

      $.ajax({
        url: 'http://localhost:3002/api/auth',
        method: 'POST',
        type: 'POST',
        data: {
          name: n,
          pass: p
        }
      }).done(function(data) {

        // console.info(data);
        // console.info(data.status);

        if (data && data.token) {

          // console.info(data.token);
          // console.info(new Date(data.expire*1000));

          if ($.cookie("zmgrToken", data.token, {expires:new Date(data.expire*1000), path:'/'})) {
            $('#loginResult').html('Login Success, Redirecting page...');
            $('#fgtpass').html('');
            setTimeout(function () {
              window.location.href = '/web/welcome';
            }, 2000);
          } else {
            console.error('Cookie Save fail');
            $('#loginResult').html('Cookie Save Fail');
          }

        } else {
          console.error('login fail');
          $('#loginResult').html('Login Fail');
        }
      });
    });
  }
});
