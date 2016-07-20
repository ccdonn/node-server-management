var token = $.cookie('zmgrToken');
$(document).ready(function(){

  $("#header").html(loginJudge(token));
  $("#naviMenu").html(naviMenu);
});
