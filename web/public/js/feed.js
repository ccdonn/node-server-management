/* feed.js */

var token = $.cookie('zmgrToken');

$(document).ready(function(){
  $('.filter-all-block').bind('click', function(){
    window.location.replace('http://localhost:3005/web/feed?p=1&ps='+$('#pagesize-block').text());
  });

  $('.filter-show-block').bind('click', function(){
    window.location.replace('http://localhost:3005/web/feed?p=1&ps='+$('#pagesize-block').text()+'&opt=1');
  });

  $('.filter-hide-block').bind('click', function(){
    window.location.replace('http://localhost:3005/web/feed?p=1&ps='+$('#pagesize-block').text()+'&opt=0');
  });

  $('.filter-expire-block').bind('click', function(){
    window.location.replace('http://localhost:3005/web/feed?p=1&ps='+$('#pagesize-block').text()+'&opt=-1');
  });

  $(".onoffswitch-checkbox").bind("click", function() {
//        console.info("#");
    if ($(this).is(":checked")) {
      $.ajax({
        method: 'PUT',
        url: 'http://localhost:3002/api/feed/announce?id='+$(this).attr("fid"),
        data: JSON.stringify({'s':1}),
        contentType: "application/json",
        processData: false,
        dataType: "json",

        beforeSend: function(request) {
          $(this).attr("disabled", true);
          request.setRequestHeader("x-access-token", token);
        }
      }).always(function(){
        $(this).removeAttr("disabled");
      });
      $("#"+$(this).attr("fid")).removeClass("feedbody_un");
    } else {
      $.ajax({
        method: 'PUT',
        type: 'PUT',
        url: 'http://localhost:3002/api/feed/announce?id='+$(this).attr("fid"),
        data: JSON.stringify({'s':0}),
        contentType: "application/json",
        processData: false,
        dataType: "json",

        beforeSend: function(request) {
          $(this).attr("disabled", true);
          request.setRequestHeader("x-access-token", token);
        }
      }).always(function(){
        $(this).removeAttr("disabled");
      });
      $("#"+$(this).attr("fid")).addClass("feedbody_un");
    }
  });

  $(function(){$("img.lazy").lazyload();});

});
