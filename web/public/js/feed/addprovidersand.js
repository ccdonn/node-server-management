var token = $.cookie('zmgrToken');

$(document).ready(function(){
  // header_binding();
  btnSave_search();
  btnConvert_binding();
});

var btnConvert_binding = function() {
  $('#btn_RssToJson').bind('click', function(){
    var err = false;
    var $xml;

    try {
      if ($('#inputrss').val()) {
      } else {
        err = true;
        throw err;
      }
      $xml = $($.parseXML($('#inputrss').val()));
      $('#outputjson').empty();
      $xml.find("item").each(function() {
        var $this = $(this),
          item = {
            title: $this.find('title').text(),
            link: $this.find('link').text(),
            description: $this.find('description').text(),
            pubDate: $this.find('pubDate').text(),
            author: $this.find('author').text(),
            image: $this.find('enclosure').attr('url')
          }
          //Do something with item here...
          if(item){
            err = ((!err&&item.title)?false:true)
            err = ((!err&&item.link)?false:true)
          } else {
            err = true;
            throw err;
          }

          if (!err) {
            $('#outputjson').append(JSON.stringify(item, null, 2)+',\n');

            // $('#sampleItem-Title').text(item.title);
            // $('#sampleItem-Link').text(item.link);
            // $('#sampleItem-Description').text(item.description);
            // $('#sampleItem-PublishDate').text(item.pubDate);
            // $('#sampleItem-Auth').text(item.author);
            // $('#sampleItem-Image').text(item.image);

          } else {
            throw err;
          }
      });


    } catch(e) {
      console.info('catch err');
      $('#outputjson').empty().append('Wrong Input');
      $('.sampleItem').empty().append('Wrong Input');
      $('.newprovider-form').hide();
      err = true;
    }

    if (err) {
      $('#outputjson').empty().append('Wrong Input');
      $('.sampleItem').empty().append('Wrong Input');
      $('.newprovider-form').hide();
    } else {
      $('.newprovider-form').show();
    }
  });
};

var btnSave_search = function() {
  $('#btn-newprovider').bind('click', function(){

    var url = $('.newprovider-form #url-edit-block input').val();
    var name = $('.newprovider-form #name-edit-block input').val();
    var lang = $('.newprovider-form #lang-edit-block select option:selected').val();
    var loc = $('.newprovider-form #country-edit-block select option:selected').val();
    var duration = ($('.newprovider-form #ttl-edit-block input').val())?$('.newprovider-form #ttl-edit-block input').val():0;
    if (url && name && lang && loc) {
    } else {
      $('#result-block').text('Data should be filled-up.');
      return ;
    }

    var senddata = {
      url: url,
      name: name,
      lang: lang,
      loc: loc,
      duration: duration
    };

    $.ajax({
      url: '/api/feed/provider',
      data: JSON.stringify(senddata),
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      beforeSend: function(request) {
        request.setRequestHeader("x-access-token", token);
      }
    }).done(function(result){
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
