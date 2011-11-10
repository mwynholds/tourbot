var _tourconfig = {
  source: 'tourbot',
  interactions:
          [
            { name: '1', selector: '#first-name', type: 'text', message: 'Tell me your name' },
            { name: '2', selector: 'input.gender', offset: { x: 100, y: 0 }, type: 'clickable', message: 'Tell me whether you\'re a boy or girl' },
            { name: '3', selector: 'fieldset.submit input', type: 'clickable', message: 'Now click this button!' }
          ]
};

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var root = this;
  //var base_url = 'http://localhost:3000';
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
          step();
        });
      }

      $.post(post_url, { interaction: { source: source, name: '0', 'final': false, session_id: session_id, variant: variant } }, null, 'json');

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
        step();
      });
    }

    function handle_clickable($input, phone_home) {
      $input.click( function() {
        phone_home();
        step();
      } );
    }

    function add_markup() {
      $('head').append('<link rel="stylesheet" type="text/css" href="' + css_url + '"/>');
      $('body').append('<div id="tourbot" class="closed"><h2>Help</h2></div>');
    }

    function find_container(target) {
      return target;
    }

    function step() {
      var tourbot = $('#tourbot');

      current_step ++;
      if (current_step < interactions.length) {
        var interaction = interactions[current_step];
        var target = $(interaction.selector);
        var container = find_container(target);
        target.focus();
        var offset = interaction.offset || { x: 0, y: 0 };
        tourbot.removeClass('closed').addClass('open');
        tourbot.find('h2').html(interaction.message);
        tourbot.css('left', (container.offset().left + container.outerWidth() + offset.x + 5) + 'px');
        tourbot.css('top', (container.offset().top + offset.y - 12) + 'px');
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