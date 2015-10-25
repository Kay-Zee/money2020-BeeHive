/*
 *
 * Example file
 *
 */

(function() {
  'use strict';

  var $document = $(document);

  $document.ready(function() {
    $document.on('click', 'button', function() {
      var $button = $(this);

          if ($button.text() == 'Take the job') {
            $button.text('Complete the job')
          } else if ($button.text() == 'Complete the job') {
            $button.text('Job completed')
          } 

    });
  });
})();
