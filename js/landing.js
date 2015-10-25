
function Login(){
  $.post("/owners/login", { email: "kan@axiomzen.co", password: "password" })
    .done(function(res) {
      console.log(res);
      window.location="/list";
    });
}

function Logout(){
  $.post("/logout", {})
    .done(function(res)   {window.location="/"});
}

(function() {
  'use strict';

  var $document = $(document);

  $document.ready(function() {
    $document.on('click', 'button', function() {
      var $button = $(this),
          $count = $('#count');

      $.post('/count/increment', function(res) {
        if (res.newCount >= 4) {
          $count.text(42);
          $button.remove();

          var img = $('<img>', {
            src: 'img/goat.jpg'
          });

          $('body').append(img);
        } else {
          $count.text(res.newCount);
        }

      });
    });
  });
})();
