//= require jquery-1.7.1
//= require jquery.cookies.2.2.0
//= require tb-tourbot
//= require tb-browser-hacker
//= require tb-browser-detect

(function(root) {

  var $ = root.jQuery;
  root.jQuery = null;
  root.$ = null;

  // super-hack for CDFF
  Array.prototype.tb_push = Array.prototype.push;
  $(document).ready( function() {
    Array.prototype.push = Array.prototype.tb_push;
    new root.tourbot.Tourbot($, base_url());
  });

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