(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var root = this;
  var base_url, css_url;
  if (root.location.href.indexOf('http://localhost:3000') == 0) {
    base_url = 'http://localhost:3000';
    css_url = base_url + '/assets/tourbot.css';
  }
  else {
    base_url = 'http://tourbot.herokuapp.com';
    css_url = base_url + '/assets/application.css';
  }

  var post_url = base_url + '/interactions';

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  jQuery.noConflict();
  jQuery(document).ready( function($) {
    var config = _tourconfig || null;
    var current_step = -1;

    if (is_valid(config)) {
      var session_id = guid();
      var variant = ( Math.floor(Math.random()*2) == 0 ? 'A' : 'B' );
      var interactions = config.interactions;
      var source = config.source;

      variant = 'A';
      if (variant == 'A') {
        add_markup();
        $('#tourbot').click(function() {
          $.post(post_url, { interaction: { source: source, name: '0', 'final': false, session_id: session_id, variant: variant } }, null, 'json');
          current_step = 0;
          step_current();
        });
      }

      $.post(post_url, { interaction: { source: source, name: '-1', 'final': false, session_id: session_id, variant: variant } }, null, 'json');

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
            $.post(post_url, { interaction: payload }, null, 'json');
          };
        }(payload);

        var $input = $(interaction.inbound);
        if ($input.length > 0) {
          var type = interaction.type;
          switch(type) {
            case 'text':      handle_text(interaction, phone_home);      break;
            case 'clickable': handle_clickable(interaction, phone_home); break;
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

    function handle_text(interaction, phone_home) {
      var $inbound = $(interaction.inbound);
      var $outbound = interaction.outbound ? $(interaction.outbound) : $inbound;
      var step_in_f = function() {
        step_in(interaction);
      };

      $inbound.blur(phone_home).focus(step_in_f);
      $outbound.blur( function() {
        step_out(interaction);
      });
      $outbound.focus(step_in_f);
    }

    function handle_clickable(interaction, phone_home) {
      var $inbound = $(interaction.inbound);
      var $outbound = interaction.outbound ? $(interaction.outbound) : $inbound;
      var step_in_f = function() {
        step_in(interaction);
      };

      $inbound.click(phone_home).focus(step_in_f);
      $outbound.click( function() {
        step_out(interaction);
      });
      $outbound.focus(step_in_f);
    }

    function add_markup() {
      $('head').append('<link rel="stylesheet" type="text/css" href="' + css_url + '"/>');
      $('body').append('<div id="tourbot" class="closed"><h2>Help</h2></div>');
    }

    function step_in(interaction) {
      if (current_step >= 0) {
        var new_step = interactions.indexOf(interaction);
        if (new_step != current_step) {
          current_step = new_step;
          step_current();
        }
      }
    }

    function step_out(interaction) {
      if (current_step >= 0) {
        current_step = interactions.indexOf(interaction);
        current_step ++;
        if (current_step >= interactions.length) {
          current_step = -1;
        }
        step_current();
      }
    }

    function step_current() {
      var tourbot = $('#tourbot');

      if (current_step >= 0) {
        var interaction = interactions[current_step];
        var target = $(interaction.inbound);
        target.focus();
        var offset = interaction.offset || { x: 0, y: 0 };
        tourbot.removeClass('closed').addClass('open');
        tourbot.find('h2').html(interaction.message);
        tourbot.css('left', (target.offset().left + target.outerWidth() + offset.x + 5) + 'px');
        tourbot.css('top', (target.offset().top + offset.y - 12) + 'px');
      }
      else {
        tourbot.removeClass('open').addClass('closed');
        tourbot.find('h2').html('Help');
        tourbot.css('left', '-30px');
        tourbot.css('top', '300px');
      }
    }

  });

})(this);