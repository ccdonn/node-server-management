var loginJudge = function(token) {
  if (token) {
    return 'Hi, <a href="/web/logout">logout</a> link';
  } else {
    return 'Not Login, illegal'
  }
};

var convertUTCtoLocal = function(odate) {
  var result = '';
  var ndate = new Date(odate);

  var month = parseInt(ndate.getMonth())+1;
  var date = parseInt(ndate.getDate());
  var hour = parseInt(ndate.getHours());
  var min = parseInt(ndate.getMinutes());
  var sec = parseInt(ndate.getSeconds());

  var result = ndate.getFullYear()
  +'-'+(month>9?month:'0'+month)
  +'-'+(date>9?date:'0'+date)
  +' '+(hour>9?hour:'0'+hour)
  +':'+(min>9?min:'0'+min)
  +':'+(sec>9?sec:'0'+sec);
  return result;
};


var newPasswordChecker = function(in1, in2) {
  if (in1==in2 && passwordChecker(in1) && passwordChecker(in2)) {
    return true;
  } else {
    return false;
  }
};

var passwordChecker = function(in1) {
  if (in1.length<8) {
    return false;
  }
  return true;
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
