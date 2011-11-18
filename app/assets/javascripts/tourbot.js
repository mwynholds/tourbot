(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var root = this;

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
      this.base_url = this.base_url();
      this.is_test = this.base_url != 'http://tourbot.herokuapp.com';

      if (this.is_valid()) {
        this.initialize();
      }
    };

    Tourbot.prototype.base_url = function() {
      var loc = root.location;
      if (loc.hostname == 'localhost' || loc.hostname == '127.0.0.1') {
        return loc.protocol + '//' + loc.host;
      }
      else {
        return 'http://tourbot.herokuapp.com';
      }
    };

    Tourbot.prototype.css_url = function() {
      return this.base_url + ( this.is_test ? '/assets/tourbot.css' : '/assets/application.css' );
    };

    Tourbot.prototype.post_url = function() {
      return this.base_url + '/interactions';
    };

    Tourbot.prototype.is_valid = function() {
      if (this.config == null) return false;
      if (this.config.source == null) return false;
      if (this.config.pages == null) return false;

      var page = this.get_page_number();
      return ( page != null );
    };

    Tourbot.prototype.get_page_number = function() {
      var path = root.location.pathname;
      for (var i = 0; i < this.config.pages.length; i++) {
        var page = this.config.pages[i];
        if (page.path == path) {
          return i;
        }
      }

      return null;
    };

    Tourbot.prototype.create_variant = function() {
      var query = root.location.search;
      if (query.length > 0) {
        query = query.substr(1);
        var terms = query.split("&");
        for (var i = 0; i < terms.length; i++) {
          var nv = terms[i].split("=");
          if (nv[0] == 'variant') {
            return nv[1];
          }
        }
      }

      return ( Math.floor(Math.random()*2) == 0 ? 'A' : 'B' );
    };

    Tourbot.prototype.initialize = function() {
      var page_number = this.get_page_number();
      var is_final_page = ( page_number == this.config.pages.length - 1);
      var session_id, variant, tour_open;
      if (page_number == 0) {
        session_id = this.create_guid();
        variant = this.create_variant();
        if (! is_final_page) {
          $.cookies.set('_toursession', session_id);
          $.cookies.set('_tourvariant', variant);
        }
      }
      else {
        session_id = $.cookies.get('_toursession');
        variant = $.cookies.get('_tourvariant');
        tour_open = $.cookies.get('_touropen');
        if (is_final_page) {
          $.cookies.del('_toursession');
          $.cookies.del('_tourvariant');
          $.cookies.del('_touropen');
        }
      }

      var source = this.config.source;
      var page = this.config.pages[page_number];
      var post_url = this.post_url();
      this.interactions = page.steps;

      if (variant == 'A') {
        this.add_markup();
        this.tourbot = $('#tourbot');

        this.save_initial_position();
        var self = this;
        this.tourbot.click(function() {
          $.post(post_url, { interaction: { source: source, page: page_number, name: '0', 'final': false, session_id: session_id, variant: variant } }, null, 'json');
          self.current_step = 0;
          self.step_current();
          if (! is_final_page) {
            $.cookies.set('_touropen', true);
          }
        });

        if (tour_open) {
          this.tourbot.click();
        }
      }

      $.post(post_url, { interaction: { source: source, page: page_number, name: '-1', 'final': false, session_id: session_id, variant: variant } }, null, 'json');

      for (var i = 0; i < this.interactions.length; i++) {
        var interaction = this.interactions[i];
        var payload = {
          source: source,
          page: page_number,
          name: interaction.name,
          'final': ( i == this.interactions.length - 1 ) && ( is_final_page ),
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

    Tourbot.prototype.to_json = function() {
      var source = this.config.toSource();
      return source.substring(1, source.length - 1);
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
      $('head').append('<link rel="stylesheet" type="text/css" href="' + this.css_url() + '"/>');
      $('body').append('<div id="tourbot" class="closed"><h2>Guided Tour</h2></div>');
      if (this.is_test) {
        $('#tourbot').append('<div class="config" style="position: absolute; top: -1000px;">' + this.to_json() + '</div>');
      }
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

        // this allows for good animation on the first click -mike
        this.tourbot.css('left', this.tourbot.css('left'));
        this.tourbot.css('top', this.tourbot.css('top'));

        this.tourbot.removeClass('closed').addClass('open');
        this.tourbot.attr('tourbot-step', this.current_step);
        this.tourbot.find('h2').html(interaction.message);
        this.tourbot.css('left', (target.offset().left + target.outerWidth() + offset.x + 10) + 'px');
        this.tourbot.css('top', (target.offset().top + offset.y - 12) + 'px');
      }
      else {
        this.tourbot.removeClass('open').addClass('closed');
        this.tourbot.removeAttr('tourbot-step');
        this.tourbot.find('h2').html('Guided Tour');
        this.restore_initial_position();
      }
    };

    Tourbot.prototype.save_initial_position = function() {
      this.initial_position = {
        'top' : this.tourbot.css('top'),
        'left' : this.tourbot.css('left')
      };
    };

    Tourbot.prototype.restore_initial_position = function() {
      for (var prop in this.initial_position) {
        this.tourbot.css(prop, this.initial_position[prop]);
      }
    };

    new Tourbot();
  });

})(this);