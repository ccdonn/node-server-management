
var nav_binding = function(e, token){
  console.info(token);
  if (token) {

    function e(e) {
      e.preventDefault();
      var n = this.parentNode;
      n.classList.contains("selected") ? c(n) : t(n)
    };

    function t(e) {
      e.classList.add("selected"), document.addEventListener("click", function t(n) {
        n.preventDefault(), e.contains(n.target) || (document.removeEventListener("click", t), c(e))
      })
    };

    function c(e) {
      e.classList.remove("selected")
    }[].slice.call(document.querySelectorAll(".category-item .item-title")).forEach(function(t) {
      t.addEventListener("click", e, !1)
    }), $(document).click(function(e) {
      var t = e.target;
      $(t).is(".item-title") || $(t).parents().is(".item-title") || $(".category-item").removeClass("selected")
    }), $(function() {
      $("img").lazyload({
        effect: "fadeIn"
      })
    });

    $('#nav-ContentProviderManagement').bind('click', function(){
      window.location.href='/web/feed/ContentProviderManagement';
    });

    $('#nav-FeedCategoryManagement').bind('click', function(){
      window.location.href='/web/feed/FeedCategoryManagement';
    });

    $('#nav-FeedManagement').bind('click', function(){
      window.location.href='/web/feed/FeedManagement';
    });

    $('#nav-ChangePasswd').bind('click', function(){
      window.location.href='/web/profile/ChangePasswd';
    });

  } else {
    $('.category-section').empty();
  }

};
