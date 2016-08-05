
var token = $.cookie('zmgrToken');

$(document).ready(function(){
  $('#btn_fgtpass').bind('click', function(){
    console.info('name:'+$("#username").val());

    $.ajax({
      url: '/api/forgetPasswd',
      method: 'POST',
      type: 'POST',
      dataType: 'json',
      data: {
        'fgtpass_name':$('#username').val()
      },

      beforeSend: function (request) {
        request.setRequestHeader("x-access-token", token);
      }
    }).done(function(result){
      $('#btn_fgtpass').attr('disabled', true);
      $('#status').html('Recovery mail is Sending to your email...').show()
        .fadeOut(2000, function(){
          $(this).html('');
        });
      if (result) {
        console.log('mail send');
      } else {
        console.log('no match');
      }
    });
  });
});
