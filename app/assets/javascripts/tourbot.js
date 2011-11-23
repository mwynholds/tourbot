//= require tb-tourbot
//= require tb-browser-hacker
//= require tb-browser-detect

(function(root) {

  function base_url() {
    var loc = root.location;
    if (loc.hostname == 'localhost' || loc.hostname == '127.0.0.1') {
      return loc.protocol + '//' + loc.host;
    }
    else {
      return 'http://tourbot.herokuapp.com';
    }
  }

  var JQUERY = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  var COOKIES = base_url() + '/assets/jquery.cookies.2.2.0.js';

  var jq = function() { return typeof jQuery != 'undefined'; };
  var jqc = function() { return typeof jQuery.cookies != 'undefined'; };
  wait_for(jq, JQUERY, function() {
    wait_for(jqc, COOKIES, ready_to_go);
  });

  function wait_for(is_ready, url, callback) {
    if (! is_ready()) {
      var head = document.getElementsByTagName('head')[0] || document.documentElement;
      var script = document.createElement('script');

      script.src = url;
      script.type = 'text/javascript';
      script.async = true;

      head.insertBefore(script, head.firstChild);
    }

    var wait = function() {
      if (! is_ready()) {
        window.setTimeout(wait, 100);
      }
      else {
        callback();
      }
    };

    wait();
  }

  function ready_to_go() {

    jQuery.noConflict();
    jQuery(document).ready( function() {
      new root.tourbot.Tourbot(jQuery, base_url());
    });
  }
})(window);