$(document).ready(function(){
  controlLink_binding();
  btnSandbox_binding();
});

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

    // if update, ajax first ?

    var id = $(this).parent().parent().attr('id');
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
};

var btnSandbox_binding = function() {
  console.info('sandbox');
  $('#btn-sandbox').bind('click', function(){
    console.info('btn-sandbox click');
    $.colorbox({iframe:true, width:"80%", height:"80%", href:"./addprovidersand"});
  });
};
