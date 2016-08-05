var token = $.cookie('zmgrToken');

$(document).ready(function(){

  nav_binding(event, token);

  controlLink_binding();
  btnSandbox_binding();
  btnSearch_binding();
  checkbox_onoff();
  paging_binding('/web/feed/ContentProviderManagement');
});

var btnSearch_binding = function() {
  $('#btn-search').bind('click', function(){
    var loc = $('.filter-country-subsection select').val();
    var lang = $('.filter-lang-subsection select').val();
    var keyword = $('.filter-keyword-subsection input').val();
    // var keyword = $('.filter-keyword-subsection input').val();
    window.location.replace('/web/feed/ContentProviderManagement?p=1&ps='+$('#pagesize-block').text()+'&qloc='+loc+'&qlang='+lang+'&qk='+keyword);
  });
};

var checkbox_onoff = function() {

  $('.onoffswitch-checkbox').bind('click', function(){

    var senddata;
    if ($(this).is(':checked')) {
      senddata = {
        id: $(this).parent().parent().parent().attr('id'),
        status: 1
      };
    } else {
      senddata = {
        id: $(this).parent().parent().parent().attr('id'),
        status: 0
      };
    }

    $.ajax({
      method: 'PATCH',
      url: '/api/feed/provider',
      data: JSON.stringify(senddata),
      contentType: 'application/json',
      dataType: 'json',
      beforeSend: function(request) {
        request.setRequestHeader("x-access-token", token);
      }
    }).then(function(result){
      console.info(result);
    });

  });
};


var controlLink_binding = function() {
  $('a.editLink').bind('click', function(){
    var id = $(this).parent().parent().attr('id');
    $('#'+id).find('.url-block').hide();
    $('#'+id).find('.name-block').hide();
    $('#'+id).find('.loc-block').hide();
    $('#'+id).find('.lang-block').hide();
    $('#'+id).find('.ttl-block').hide();
    $('#'+id).find('.autoAnnounce-block').hide();
    $('#'+id).find('.control-block').hide();

    /* Value */
    console.info($('#'+id).find('.loc-block').text());
    console.info($('#'+id).find('.autoAnnounce-block').text());
    $('#'+id).find('.url-edit-block input').val($('#'+id).find('.url-block').text());
    $('#'+id).find('.name-edit-block input').val($('#'+id).find('.name-block').text());
    $('#'+id).find('.loc-edit-block select').val($('#'+id).find('.loc-block').text());
    $('#'+id).find('.lang-edit-block select').val($('#'+id).find('.lang-block').text());
    $('#'+id).find('.ttl-edit-block input').val($('#'+id).find('.ttl-block').text());
    $('#'+id).find('.autoAnnounce-edit-block select').val($('#'+id).find('.autoAnnounce-block').text());

    $('#'+id).find('.url-edit-block').css('display', 'inline-block');
    $('#'+id).find('.name-edit-block').css('display', 'inline-block');
    $('#'+id).find('.loc-edit-block').css('display', 'inline-block');
    $('#'+id).find('.lang-edit-block').css('display', 'inline-block');
    $('#'+id).find('.ttl-edit-block').css('display', 'inline-block');
    $('#'+id).find('.autoAnnounce-edit-block').css('display', 'inline-block');
    $('#'+id).find('.control-edit-block').css('display', 'inline-block');
  });

  $('a.saveLink').bind('click', function(){

    var id = $(this).parent().parent().attr('id');
    // console.info(id);
    // console.info($('#'+id).find('.url-edit-block input').val());
    // console.info($('#'+id).find('.name-edit-block input').val());
    // console.info($('#'+id).find('.loc-edit-block select option:selected').val());
    // console.info($('#'+id).find('.lang-edit-block select option:selected').val());
    // console.info($('#'+id).find('.ttl-edit-block input').val());
    // console.info($('#'+id).find('.autoAnnounce-edit-block select option:selected').val());

    // if update, ajax first ?
    var senddata = {
      id: id,
      url: $('#'+id).find('.url-edit-block input').val(),
      name: $('#'+id).find('.name-edit-block input').val(),
      lang: $('#'+id).find('.lang-edit-block select option:selected').val(),
      loc: $('#'+id).find('.loc-edit-block select option:selected').val(),
      duration: $('#'+id).find('.ttl-edit-block input').val(),
      autoAnnounce: $('#'+id).find('.autoAnnounce-edit-block select option:selected').val()
    };

    console.info(token);

    $.ajax({
      url: '/api/feed/provider',
      data: JSON.stringify(senddata),
      method: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      beforeSend: function(request){
        request.setRequestHeader("x-access-token", token);
      }
    }).then(function(result){
      console.info(result);
    });

    $('#'+id).find('.url-block').css('display', 'inline-block');
    $('#'+id).find('.name-block').css('display', 'inline-block');
    $('#'+id).find('.loc-block').css('display', 'inline-block');
    $('#'+id).find('.lang-block').css('display', 'inline-block');
    $('#'+id).find('.ttl-block').css('display', 'inline-block');
    $('#'+id).find('.autoAnnounce-block').css('display', 'inline-block');
    $('#'+id).find('.control-block').css('display', 'inline-block');

    /* Value */
    $('#'+id).find('.url-block').text($('#'+id).find('.url-edit-block input').val());
    $('#'+id).find('.name-block').text($('#'+id).find('.name-edit-block input').val());
    $('#'+id).find('.loc-block').text($('#'+id).find('.loc-edit-block select').val());
    $('#'+id).find('.lang-block').text($('#'+id).find('.lang-edit-block select').val());
    $('#'+id).find('.ttl-block').text($('#'+id).find('.ttl-edit-block input').val());
    $('#'+id).find('.autoAnnounce-block').text($('#'+id).find('.autoAnnounce-edit-block select').val());

    $('#'+id).find('.url-edit-block').hide();
    $('#'+id).find('.name-edit-block').hide();
    $('#'+id).find('.loc-edit-block').hide();
    $('#'+id).find('.lang-edit-block').hide();
    $('#'+id).find('.ttl-edit-block').hide();
    $('#'+id).find('.autoAnnounce-edit-block').hide();
    $('#'+id).find('.control-edit-block').hide();
  });

  $('a.cancelLink').bind('click', function(){
    var id = $(this).parent().parent().attr('id');
    $('#'+id).find('.url-block').css('display', 'inline-block');
    $('#'+id).find('.name-block').css('display', 'inline-block');
    $('#'+id).find('.loc-block').css('display', 'inline-block');
    $('#'+id).find('.lang-block').css('display', 'inline-block');
    $('#'+id).find('.ttl-block').css('display', 'inline-block');
    $('#'+id).find('.autoAnnounce-block').css('display', 'inline-block');
    $('#'+id).find('.control-block').css('display', 'inline-block');

    $('#'+id).find('.url-edit-block').hide();
    $('#'+id).find('.name-edit-block').hide();
    $('#'+id).find('.loc-edit-block').hide();
    $('#'+id).find('.lang-edit-block').hide();
    $('#'+id).find('.ttl-edit-block').hide();
    $('#'+id).find('.autoAnnounce-edit-block').hide();
    $('#'+id).find('.control-edit-block').hide();
  });

  $('a.removeLink').bind('click', function(){
    if (confirm('Are you sure to remove this provider?')) {
      var id = $(this).parent().parent().attr('id');
      var senddata = {
        id: id,
        status: -1
      };

      $.ajax({
        method: 'PATCH',
        url: '/api/feed/provider',
        data: JSON.stringify(senddata),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(request) {
          request.setRequestHeader("x-access-token", token);
        }
      }).then(function(result){
        $('#'+id).fadeOut('slow');
      });

    } else {
      // Do nothing
    }
  });

};

var btnSandbox_binding = function() {
  console.info('sandbox');
  $('#btn-sandbox').bind('click', function(){
    console.info('btn-sandbox click');
    $.colorbox({iframe:true, width:"80%", height:"80%", href:"./addprovidersand"});
  });
};
