
$(document).ready(function(){

  console.info(getUrlParameter('key'));

  $("#btn_setpasswd").bind("click", function() {

    var np = $("#n_pwd").val();
    var rnp = $("#rn_pwd").val();
    var key = getUrlParameter('key')

    console.info('new passwd:' + $("#n_pwd").val());
    console.info('re-new passed:' + $("#rn_pwd").val());
    $.ajax({
      url: '/fgt/resetpasswd',
      method: 'POST',
      type: 'POST',
      dataType: 'json',
      data: {
        'np':$('#n_pwd').val(),
        'rnp':$('#rn_pwd').val()
      },

      beforeSend: function (request) {

        if (np=='' || rnp=='') {
          console.log('shit1');
          $('#status').html('Empty Input').show();
          request.abort();
          return ;
        }

        if (np!=rnp) {
          console.log('shit2');
          request.abort();
          $('#status').html('New Password, Re-New Password are not same').show();
          return ;
        }

        if (passwordChecker(np)) {
          // pass check
        } else {
          console.log('shit3');
          request.abort();
          $('#status').html('There is be more then 8 characters').show();
          return ;
        }

        if (passwordChecker(rnp)) {
          // pass check
        } else {
          console.log('shit4');
          request.abort();
          $('#status').html('There is be more then 8 characters').show();
          return ;
        }

        request.setRequestHeader("x-access-token", key);
        $('#btn_setpasswd').attr('disabled', true);
      }
    }).done(function(result){

      var showmessage = (result) ? 'Password Update Success' : 'Password Update Fail';

      $('#status').html(showmessage+', Redirecting...').show()
        .fadeOut(2000, function(){
          $(this).html('');
          $("#btn_setpasswd").attr('disabled', false);
        });

      setTimeout(function () {
        window.location.href = '/web/welcome';
      }, 2000);

    });
  });
});
