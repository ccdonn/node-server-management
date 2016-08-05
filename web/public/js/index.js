var token = $.cookie('zmgrToken');

$(document).ready(function(){

  console.info('init');

  nav_binding(event, token);
});
