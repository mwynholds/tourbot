(function(root) {
  var $;

  var BrowserHacker = function(jQuery) {
    $ = jQuery;
    this.detect = root.tourbot.BrowserDetect;
  };

  var tourbot = root.tourbot || {};
  root.tourbot = tourbot;
  tourbot.BrowserHacker = BrowserHacker;

  BrowserHacker.prototype.apply_hacks = function() {
    this.apply_chrome_flash_hack();
  };

  BrowserHacker.prototype.apply_chrome_flash_hack = function() {
    if (! this.is_chrome()) {
      return;
    }

    $('object > embed').each( function() {
      var $embed = $(this);
      var $obj = $embed.parent();
      var $param = $obj.find('param[name="wmode"]');
      if ($param.length == 0) {
        $obj.prepend('<param name="wmode" value="opaque"/>');
      }
      else {
        $param.attr('value', 'opaque');
      }
      $embed.attr('wmode', 'opaque');

      // have to reload the flash player -mike
      $obj.parent().html( $obj.parent().html() );
    });
  };

  BrowserHacker.prototype.is_chrome = function() {
    return this.detect.browser == 'Chrome';
  };

})(window);