//= require jquery-1.7.1
//= require jquery.cookies.2.2.0
//= require tb-tourbot
//= require tb-browser-hacker
//= require tb-browser-detect

(function(root) {

  var load_tourbot = function() {
    var detect = root.tourbot.BrowserDetect;

    var PIE = base_url() + '/assets/PIE-1.0beta5.js';
    var pie = function() { return detect.browser != 'Explorer' || typeof window['PIE'] != 'undefined'; };
    wait_for(pie, PIE, ready_to_go);
  };

  var tb_jquery = root.jQuery;
  root.jQuery = null;
  root.$ = null;
  load_tourbot();

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
    // super hack to save Array.push()
    Array.prototype.tb_push = Array.prototype.push;
    tb_jquery(document).ready( function() {
      Array.prototype.push = Array.prototype.tb_push;
      new root.tourbot.Tourbot(tb_jquery, base_url());
    });
  }

  function base_url() {
    var loc = root.location;
    if (loc.hostname == 'localhost' || loc.hostname == '127.0.0.1' || loc.port == 3000) {
      return loc.protocol + '//' + loc.host;
    }
    else {
      return 'http://tourbot.herokuapp.com';
    }
  }
})(window);