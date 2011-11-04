(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var root = this;
  var url = 'http://localhost:3000/interactions';

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  jQuery.noConflict();
  jQuery(document).ready( function($) {
    var config = _tourconfig || null;

    if (is_valid(config)) {
      var session_id = guid();
      var variant = ( Math.floor(Math.random()*2) == 0 ? 'A' : 'B' );

      var interactions = config.interactions;
      var source = config.source;
      for (var i = 0; i < interactions.length; i++) {
        var interaction = interactions[i];
        var payload = {
          source: source,
          name: interaction.name,
          'final': ( i == interactions.length - 1 ),
          session_id: session_id,
          variant: variant
        };

        var phone_home = function(payload) {
          return function() {
            $.post(url, { interaction: payload }, null, 'json');
          };
        }(payload);

        var $input = $(interaction.selector);
        if ($input.length > 0) {
          switch(interaction.type) {
            case 'text':      handle_text($input, phone_home);      break;
            case 'clickable': handle_clickable($input, phone_home); break;
          }
        }
      }
    }

    function is_valid(config) {
      if (config == null) return false;
      if (config.interactions == null) return false;
      if (config.source == null) return false;
      return true;
    }

    function handle_text($input, phone_home) {
      $input.blur( function() {
        if ($input.val() != '') {
          phone_home();
        }
      });
    }

    function handle_clickable($input, phone_home) {
      $input.click( phone_home );
    }

  });

})(this);