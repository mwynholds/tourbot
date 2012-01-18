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
    this.apply_indexOf_hack();
    this.apply_flash_hack();
  };

  BrowserHacker.prototype.apply_indexOf_hack = function() {
    if (! Array.indexOf) {
      Array.prototype.indexOf = function(obj) {
        for (var i=0; i<this.length; i++) {
          if (this[i] == obj) {
            return i;
          }
        }
        return -1;
      }
    }
  };

  BrowserHacker.prototype.apply_flash_hack = function() {
    if (this.is_chrome()) {
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
    }

    // this is a hack for CDFF -mike
    if (this.is_ie()) {
      $('object').each( function() {
        var $obj = $(this);
        var orig_html = $obj.parent().html();
        var html = orig_html.replace('<PARAM NAME="WMode" VALUE="Window">', '<PARAM NAME="WMode" VALUE="opaque">');
        html = html.replace('<embed ', '<embed wmode="opaque" ');
        if (html != orig_html)
          $obj.parent().html(html);
      })
    }
  };

  BrowserHacker.prototype.is_chrome = function() {
    return this.detect.browser == 'Chrome';
  };

  BrowserHacker.prototype.is_ie = function() {
    return this.detect.browser == 'Explorer';
  };

})(window);