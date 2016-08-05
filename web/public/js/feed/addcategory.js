var token = $.cookie('zmgrToken');

$(document).ready(function(){
  btnSave_binding();
});

var btnSave_binding = function() {

  $('#btn-newcategory').bind('click', function() {

    var loc = $('.country-edit-block select option:selected').val();
    var dis_en = $('.display-edit-block').find('.display-en input').val();
    var dis_ja = $('.display-edit-block').find('.display-ja input').val();
    var dis_zhtw = $('.display-edit-block').find('.display-zh-TW input').val();
    var sea_en = $('.search-edit-block').find('.search-en input').val();
    var sea_ja = $('.search-edit-block').find('.search-ja input').val();
    var sea_zhtw = $('.search-edit-block').find('.search-zh-TW input').val();

    if (loc && dis_en && dis_ja && dis_zhtw && sea_en && sea_ja && sea_zhtw) {
    } else {
      $('#result-block').text('Data should be filled-up.');
      return ;
    }

    var senddata = {
      loc: loc,
      displayValue: {
        en: dis_en,
        ja: dis_ja,
        'zh-TW': dis_zhtw
      },
      searchValue: {
        en: sea_en,
        ja: sea_ja,
        'zh-TW': sea_zhtw
      }
    };

    console.info(senddata);

    $.ajax({
      url: '/api/feed/category',
      data: JSON.stringify(senddata),
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      beforeSend: function(request) {
        request.setRequestHeader("x-access-token", token);
      }
    }).done(function(result){
      console.info(result);
      if (result.status=='success') {
        $('#result-block').text('Insertion Success');
      } else {
        $('#result-block').text('Insertion Fail');
      }
    }).fail(function(result){
      $('#result-block').text('Insertion Fail');
    });
  });

};
