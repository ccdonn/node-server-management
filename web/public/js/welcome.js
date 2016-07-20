var token = $.cookie('zmgrToken');
$(document).ready(function(){

  $("#header").html(loginJudge(token))

  if (token) {
    $('#lead').html('<a href="/web/index"> Index Page </a>');
  } else {
    $('#lead').html('<a href="/web/login"> Login Page </a>');
  }
});
