var token = $.cookie('zmgrToken');

$(document).ready(function(){

  nav_binding(event, token);

  console.info(token);

  $("#btn-chpasswd").bind("click", function() {

    var cp = $("#c-pwd").val();
    var np = $("#n-pwd").val();
    var rnp = $("#rn-pwd").val();

    $.ajax({
      url: '/api/user/passwd',
      method: 'POST',
      type: 'POST',
      dataType: 'json',
      data: {
        'cp': cp,
        'np': np,
        'rnp': rnp
      },

      beforeSend: function (request) {

        if (cp=='' || np=='' || rnp=='') {
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
          $('#status').html('Password should be more than 8 characters').show();
          return ;
        }

        if (passwordChecker(rnp)) {
          // pass check
        } else {
          console.log('shit4');
          request.abort();
          $('#status').html('Password should be more than 8 characters').show();
          return ;
        }

        request.setRequestHeader("x-access-token", token);
        $('#btn-chpasswd').attr('disabled', true);
      }
    }).done(function(result){

      var showmessage = (result) ? 'Password Update Success' : 'Password Update Fail';

      $('#status').html(showmessage).show()
        .fadeOut(5000, function(){
          $(this).html('');
          $("#btn-chpasswd").attr('disabled', false);
        });

    });
  });
});
