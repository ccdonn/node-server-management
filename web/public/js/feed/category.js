var token = $.cookie('zmgrToken');

$(document).ready(function(){
  binding();
  sort_col();
  btn_sortmode();
  btn_sortmode_ok();
  btn_sortmode_cancel();
  btn_search();
  checkbox_onoff();
});

var checkbox_onoff = function() {

  $('.onoffswitch-checkbox').bind('click', function(){

    var senddata;
    if ($(this).is(':checked')) {
      senddata = {
        id: $(this).parent().parent().parent().attr('id'),
        status: 1,
        token: token
      };
    } else {
      senddata = {
        id: $(this).parent().parent().parent().attr('id'),
        status: 0,
        token: token
      };
    }

    $.ajax({
      method: 'PATCH',
      url: 'http://localhost:3002/api/feed/category',
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

var btn_search = function() {
  $('#btn-search').bind('click', function(){
    var loc = $('.filter-country-subsection select').val();
    var mtype = $('.filter-mtype-subsection select').val();
    var keyword = $('.filter-keyword-subsection input').val();
    window.location.replace('http://localhost:3005/web/feed/FeedCategoryManagement?p=1&ps='+$('#pagesize-block').text()+'&qloc='+loc+'&qk='+keyword);
  });
};

var sort_col = function() {
  $('.sort-title-block').hide();
  $('.sort-block').hide();
};

var btn_sortmode_ok = function() {
    $('#btn-sortmode-ok').hide();
    $('#btn-sortmode-ok').bind('click', function(){

      var objs = $('.result-sortingmode-section').find('.cell').map(function(){
          var item = {
            id: $(this).find('.id-block').text(),
            sort: $(this).find('.sort-block').text()
          }
          return item;
      });
      // var sortList = objs.map(function(index){
      // //  console.info($(objs[index]).find('.id-block').text());
      //   var item = {
      //     id: $(objs[index]).find('.id-block').text(),
      //     sort: $(objs[index]).find('.sort-block').text()
      //   };
      //   return item;
      // });

      console.info(objs);

      $.ajax({
          url: 'http://localhost:3002/api/feed/category/resort',
          data: JSON.stringify(objs),
          method: 'PATCH',
          contentType: 'application/json',
          dataType: 'json',
          beforeSend: function(request) {
            request.setRequestHeader("x-access-token", token);
          }
      }).then(function(result){

      });

      $('#btn-sortmode-ok').hide();
      $('#btn-sortmode-cancel').hide();
      $('#btn-sortmode').prop('disabled', false);
      $('#btn-search').prop('disabled', false);
      $('.result-section').show();
      $('.result-sortingmode-section').empty();
      $('.filter-country-subsection select').attr('disabled', false);
      $('.filter-mtype-subsection select').attr('disabled', false);
      $('.filter-keyword-subsection input').attr('readonly', false);

    });
};

var btn_sortmode_cancel = function() {
    $('#btn-sortmode-cancel').hide();
    $('#btn-sortmode-cancel').bind('click', function(){
      $('#btn-sortmode-ok').hide();
      $('#btn-sortmode-cancel').hide();
      $('#btn-sortmode').prop('disabled', false);
      $('#btn-search').prop('disabled', false);
      $('.result-section').show();
      $('.result-sortingmode-section').empty();
      $('.filter-country-subsection select').attr('disabled', false);
      $('.filter-mtype-subsection select').attr('disabled', false);
      $('.filter-keyword-subsection input').attr('readonly', false);

    });
};

var buildSortingSection = function() {
  $('.result-sortingmode-section').empty();
  $('.result-section').children().clone(true, true).appendTo($('.result-sortingmode-section'));
  $('.result-sortingmode-section').find('.status-block').hide();
  $('.result-sortingmode-section').find('.status-title-block').hide();
  $('.result-sortingmode-section').find('.control-block').empty();
  $('.result-sortingmode-section').find('.sort-block').show();
  $('.result-sortingmode-section').find('.sort-title-block').show();
  $('#btn-sortmode-ok').show();
  $('#btn-sortmode-cancel').show();

  $( ".result-sortingmode-section .cell-subsection" ).sortable({
    handle: '.handle',
    stop: function ($item, container, _super, event) {
          $('.result-sortingmode-section .cell-subsection .cell').removeClass('dragged');
          $(".result-sortingmode-section").removeClass('dragging');
          $('.result-sortingmode-section .cell-subsection .cell .sort-block .onum').each(function (i) {
              var humanNum = i + 1;
              $(this).html(humanNum + '');
          });
      }
  });
};

var btn_sortmode = function() {
  $('#btn-sortmode').bind('click', function(){
    buildSortingSection();
    $('.result-section').hide();
    $('#btn-sortmode').prop('disabled', true);
    $('#btn-search').prop('disabled', true);
    $('.filter-country-subsection select').prop('disabled', true);
    $('.filter-mtype-subsection select').prop('disabled', true);
    $('.filter-keyword-subsection input').prop('readonly', true);

  });
};

var binding = function() {
  $('a.editLink').bind('click', function(){
    var id = $(this).parent().parent().attr('id');
    $('#'+id).find('.country-block').hide();
    $('#'+id).find('.mtype-block').hide();
    $('#'+id).find('.display-block').hide();
    $('#'+id).find('.search-block').hide();
    $('#'+id).find('.control-block').hide();

    /* Value */
    $('#'+id).find('.country-edit-block select').val($('#'+id).find('.country-block').text());
    $('#'+id).find('.mtype-edit-block select').val($('#'+id).find('.mtype-block').text());
    $('#'+id).find('.display-edit-block').find('.display-en input:text').val($('#'+id).find('.display-block').find('.display-en').text());
    $('#'+id).find('.display-edit-block').find('.display-ja input:text').val($('#'+id).find('.display-block').find('.display-ja').text());
    $('#'+id).find('.display-edit-block').find('.display-zh-TW input:text').val($('#'+id).find('.display-block').find('.display-zh-TW').text());
    $('#'+id).find('.search-edit-block').find('.search-en input:text').val($('#'+id).find('.search-block').find('.search-en').text());
    $('#'+id).find('.search-edit-block').find('.search-ja input:text').val($('#'+id).find('.search-block').find('.search-ja').text());
    $('#'+id).find('.search-edit-block').find('.search-zh-TW input:text').val($('#'+id).find('.search-block').find('.search-zh-TW').text());

    $('#'+id).find('.country-edit-block').css('display', 'inline-block');
    $('#'+id).find('.mtype-edit-block').css('display', 'inline-block');
    $('#'+id).find('.display-edit-block').css('display', 'inline-block');
    $('#'+id).find('.search-edit-block').css('display', 'inline-block');
    $('#'+id).find('.control-edit-block').css('display', 'inline-block');
  });

  $('a.saveLink').bind('click', function(){

    var id = $(this).parent().parent().attr('id');
    // console.info(id);
    // console.info($('#'+id).find('.mtype-edit-block select option:selected').val());
    // console.info($('#'+id).find('.country-edit-block select option:selected').val());
    // console.info($('#'+id).find('.display-edit-block').find('.display-en :input').val());

    // if update, ajax first ?
    var senddata = {
      id: id,
      status: 1,
      mType: $('#'+id).find('.mtype-edit-block select option:selected').val(),
      loc: $('#'+id).find('.country-edit-block select option:selected').val(),
      displayValue: {
        en: $('#'+id).find('.display-edit-block').find('.display-en :input').val(),
        ja: $('#'+id).find('.display-edit-block').find('.display-ja :input').val(),
        'zh-TW': $('#'+id).find('.display-edit-block').find('.display-zh-TW :input').val()
      },
      searchValue: {
        en: $('#'+id).find('.search-edit-block').find('.search-en :input').val(),
        ja: $('#'+id).find('.search-edit-block').find('.search-ja :input').val(),
        'zh-TW': $('#'+id).find('.search-edit-block').find('.search-zh-TW :input').val()
      }
    };
    $.ajax({
      url: 'http://localhost:3002/api/feed/category',
      data: JSON.stringify(senddata),
      method: 'PUT',
      contentType: 'application/json',
      beforeSend: function(request){
        request.setRequestHeader("x-access-token", token);
      }
    }).then(function(result){
      console.info(result);
    });

    $('#'+id).find('.country-block').css('display', 'inline-block');
    $('#'+id).find('.mtype-block').css('display', 'inline-block');
    $('#'+id).find('.display-block').css('display', 'inline-block');
    $('#'+id).find('.search-block').css('display', 'inline-block');
    $('#'+id).find('.control-block').css('display', 'inline-block');

    /* Value */
    // console.info($('#'+id).find('.mtype-edit-block select').val());
    $('#'+id).find('.country-block').text($('#'+id).find('.country-edit-block select').val());
    $('#'+id).find('.mtype-block').text($('#'+id).find('.mtype-edit-block select').val());
    $('#'+id).find('.display-block').find('.display-en').text($('#'+id).find('.display-edit-block').find('.display-en input:text').val());
    $('#'+id).find('.display-block').find('.display-ja').text($('#'+id).find('.display-edit-block').find('.display-ja  input:text').val());
    $('#'+id).find('.display-block').find('.display-zh-TW').text($('#'+id).find('.display-edit-block').find('.display-zh-TW  input:text').val());
    $('#'+id).find('.search-block').find('.search-en').text($('#'+id).find('.search-edit-block').find('.search-en  input:text').val());
    $('#'+id).find('.search-block').find('.search-ja').text($('#'+id).find('.search-edit-block').find('.search-ja  input:text').val());
    $('#'+id).find('.search-block').find('.search-zh-TW').text($('#'+id).find('.search-edit-block').find('.search-zh-TW  input:text').val());

    $('#'+id).find('.country-edit-block').hide();
    $('#'+id).find('.mtype-edit-block').hide();
    $('#'+id).find('.display-edit-block').hide();
    $('#'+id).find('.search-edit-block').hide();
    $('#'+id).find('.control-edit-block').hide();
  });

  $('a.cancelLink').bind('click', function(){
    var id = $(this).parent().parent().attr('id');
    $('#'+id).find('.country-block').css('display', 'inline-block');
    $('#'+id).find('.mtype-block').css('display', 'inline-block');
    $('#'+id).find('.display-block').css('display', 'inline-block');
    $('#'+id).find('.search-block').css('display', 'inline-block');
    $('#'+id).find('.control-block').css('display', 'inline-block');

    $('#'+id).find('.country-edit-block').hide();
    $('#'+id).find('.mtype-edit-block').hide();
    $('#'+id).find('.display-edit-block').hide();
    $('#'+id).find('.search-edit-block').hide();
    $('#'+id).find('.control-edit-block').hide();
  });

  $('a.removeLink').bind('click', function(){
    if (confirm('Are you sure to remove this category?')) {
      var id = $(this).parent().parent().attr('id');
      var senddata = {
        id: id,
        status: -1,
        token: token
      };

      $.ajax({
        method: 'PATCH',
        url: 'http://localhost:3002/api/feed/category',
        data: JSON.stringify(senddata),
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: function(request) {
          request.setRequestHeader("x-access-token", token);
        }
      }).then(function(result){
        console.info(result);
        console.info(id);
        $('#'+id).fadeOut('slow');
      });

    } else {
      // Do nothing
    }
  });
};
