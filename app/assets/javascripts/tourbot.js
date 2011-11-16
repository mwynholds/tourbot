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

  jQuery.noConflict();
  jQuery(document).ready( function($) {

    var Tourbot = function() {
      this.tourbot = null;
      this.config = _tourconfig || null;
      this.current_step = -1;
      this.initial_position = {};
      this.session_id = null;
      this.variant = null;
      this.interactions = null;

      if (this.is_valid()) {
        this.initialize();
      }
    };

    Tourbot.prototype.is_valid = function() {
      if (this.config == null) return false;
      if (this.config.interactions == null) return false;
      if (this.config.source == null) return false;
      return true;
    };

    Tourbot.prototype.initialize = function() {
      var session_id = this.create_guid();
      var variant = ( Math.floor(Math.random()*2) == 0 ? 'A' : 'B' );
      this.interactions = this.config.interactions;
      var source = this.config.source;

      variant = 'A';
      if (variant == 'A') {
        this.add_markup();
        this.save_initial_position();
        var self = this;
        this.tourbot.click(function() {
          $.post(post_url, { interaction: { source: source, name: '0', 'final': false, session_id: session_id, variant: variant } }, null, 'json');
          self.current_step = 0;
          self.step_current();
        });
      }

      $.post(post_url, { interaction: { source: source, name: '-1', 'final': false, session_id: session_id, variant: variant } }, null, 'json');

      for (var i = 0; i < this.interactions.length; i++) {
        var interaction = this.interactions[i];
        var payload = {
          source: source,
          name: interaction.name,
          'final': ( i == this.interactions.length - 1 ),
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
            case 'text':      this.handle_text(interaction, phone_home);      break;
            case 'clickable': this.handle_clickable(interaction, phone_home); break;
          }
        }
      }
    };

    Tourbot.prototype.create_guid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    };

    Tourbot.prototype.handle_text = function(interaction, phone_home) {
      var $inbound = $(interaction.inbound);
      var $outbound = interaction.outbound ? $(interaction.outbound) : $inbound;
      var self = this;
      var step_in_f = function() {
        self.step_in(interaction);
      };

      $inbound.blur(phone_home).focus(step_in_f);
      $outbound.blur( function() {
        self.step_out(interaction);
      });
      $outbound.focus(step_in_f);
    };

    Tourbot.prototype.handle_clickable = function(interaction, phone_home) {
      var $inbound = $(interaction.inbound);
      var $outbound = interaction.outbound ? $(interaction.outbound) : $inbound;
      var self = this;
      var step_in_f = function() {
        self.step_in(interaction);
      };

      $inbound.click(phone_home).focus(step_in_f);
      $outbound.click( function() {
        self.step_out(interaction);
      });
      $outbound.focus(step_in_f);
    };

    Tourbot.prototype.add_markup = function() {
      $('head').append('<link rel="stylesheet" type="text/css" href="' + css_url + '"/>');
      $('body').append('<div id="tourbot" class="closed"><h2>Guided Tour</h2></div>');
      this.tourbot = $('#tourbot');
    };

    Tourbot.prototype.step_in = function(interaction) {
      if (this.current_step >= 0) {
        var new_step = this.interactions.indexOf(interaction);
        if (new_step != this.current_step) {
          this.current_step = new_step;
          this.step_current();
        }
      }
    };

    Tourbot.prototype.step_out = function(interaction) {
      if (this.current_step >= 0) {
        this.current_step = this.interactions.indexOf(interaction);
        this.current_step ++;
        if (this.current_step >= this.interactions.length) {
          this.current_step = -1;
        }
        this.step_current();
      }
    };

    Tourbot.prototype.step_current = function() {
      if (this.current_step >= 0) {
        var interaction = this.interactions[this.current_step];
        var target = $(interaction.inbound);
        target.focus();
        var offset = interaction.offset || { x: 0, y: 0 };

        this.tourbot.removeClass('closed').addClass('open');
        this.tourbot.find('h2').html(interaction.message);
        this.tourbot.css('left', (target.offset().left + target.outerWidth() + offset.x + 10) + 'px');
        this.tourbot.css('top', (target.offset().top + offset.y - 12) + 'px');
      }
      else {
        this.tourbot.removeClass('open').addClass('closed');
        this.tourbot.find('h2').html('Guided Tour');
        this.tourbot.css('left', '-30px');
        this.tourbot.css('top', '300px');
      }
    };

    Tourbot.prototype.save_initial_position = function() {
      this.initial_position = {
        'top' : this.tourbot.css('top'),
        'left' : this.tourbot.css('left'),
        'width' : this.tourbot.css('width')
      };
    };

    new Tourbot();
  });

})(this);