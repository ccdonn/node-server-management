/* feed.js */

var token = $.cookie('zmgrToken');

$(document).ready(function(){

  nav_binding(event, token);
  functionSection_binding();
  onoffcheckbox_binding();
  paging_binding('/web/feed/FeedManagement', $.url('?opt'));

  $(function(){$("img.lazy").lazyload();});

});

var paging_binding = function(url, opt) {
  var page = $('#pagevar-block').attr('page');
  var pagesize = $('#pagevar-block').attr('pagesize');
  var startNum = $('#pagevar-block').attr('startNum');
  var endNum = $('#pagevar-block').attr('endNum');
  var hit = $('#pagevar-block').attr('hit');

  if (parseInt(startNum)==1) {
    // do nothing
  } else {
    $('#prepge').bind('click', function(){
      if (opt) {
        window.location.href = url+'?p='+(parseInt(page)-1)+'&ps='+pagesize+"&opt="+opt;
      } else {
        window.location.href = url+'?p='+(parseInt(page)-1)+'&ps='+pagesize;
      }
    });
  }

  if (parseInt(hit)>parseInt(endNum)) {
    $('#nxtpge').bind('click', function(){
      if (opt) {
        window.location.href = url+'?p='+(parseInt(page)+1)+'&ps='+pagesize+"&opt="+opt;
      } else {
        window.location.href = url+'?p='+(parseInt(page)+1)+'&ps='+pagesize;
      }
    });
  } else {
    // do nothing
  }
};



var onoffcheckbox_binding = function() {
  $(".onoffswitch-checkbox").bind("click", function() {
    if ($(this).is(":checked")) {
      $.ajax({
        method: 'PUT',
        url: '/api/feed/announce?id='+$(this).attr("fid"),
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
        url: '/api/feed/announce?id='+$(this).attr("fid"),
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

};

var functionSection_binding = function() {
  $('.filter-all-block').bind('click', function(){
    window.location.replace('/web/feed/FeedManagement?p=1&ps='+$('#pagesize-block').text());
  });

  $('.filter-show-block').bind('click', function(){
    window.location.replace('/web/feed/FeedManagement?p=1&ps='+$('#pagesize-block').text()+'&opt=1');
  });

  $('.filter-hide-block').bind('click', function(){
    window.location.replace('/web/feed/FeedManagement?p=1&ps='+$('#pagesize-block').text()+'&opt=0');
  });

  $('.filter-expire-block').bind('click', function(){
    window.location.replace('/web/feed/FeedManagement?p=1&ps='+$('#pagesize-block').text()+'&opt=-1');
  });

};
