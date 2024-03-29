(function(root) {
  var $;

  var Tourbot = function(jQuery, base_url) {
    $ = jQuery;

    this.tourbot_tab = null;
    this.tourbot_message = null;
    this.tourbot_message_content = null;
    this.tourbot_offscreen_message = null;
    this.tourbot_offscreen_message_content = null;
    this.config = _tourconfig || null;
    this.current_step = -1;
    this.interactions = null;
    this.base_url = base_url;
    this.browser_hacker = new root.tourbot.BrowserHacker(jQuery);

    if (this.is_valid()) {
      this.initialize();
    }
  };

  var tourbot = root.tourbot || {};
  root.tourbot = tourbot;
  tourbot.Tourbot = Tourbot;

  Tourbot.prototype.fake_path = function() {
    return typeof(__tourbot_fake_path) == 'undefined' ? null : __tourbot_fake_path;
  };

  Tourbot.prototype.css_url = function() {
    return this.base_url + '/assets/tourbot.css';
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
    var path = this.fake_path() || root.location.pathname;
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

  Tourbot.prototype.create_guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
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
      session_id = $.cookies.get('_toursession') || this.create_guid();
      variant = $.cookies.get('_tourvariant') || this.create_variant();
      tour_open = $.cookies.get('_touropen') || false;
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
      this.add_markup(session_id, variant);
      this.browser_hacker.apply_hacks();

      var self = this;
      this.tourbot_tab.click(function() {
        $.post(post_url, { interaction: { source: source, page: page_number, name: '0', 'final': false, session_id: session_id, variant: variant } }, null, 'json');
        self.current_step = 0;
        self.step_current();
        if (! is_final_page) {
          $.cookies.set('_touropen', true);
        }
      });

      if (tour_open) {
        this.tourbot_tab.click();
      }
    }

    $.post(post_url, { interaction: { source: source, page: page_number, name: '-1', 'final': false, session_id: session_id, variant: variant } }, null, 'json');

    this.define_trig();
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
        this.handle_step(interaction, phone_home);
      }
//      else {
//        alert("cannot find: " + interaction.inbound);
//      }
    }
  };

  Tourbot.prototype.define_trig = function() {
    $.fn.trig = function(callback) {
      var $field = this;
      if ($field.is('input[type="text"]') || $field.is('textarea') || $field.is('select')) {
        $field.change(callback);
      }
      else {
        $field.click(callback);
      }
    };
  };

  Tourbot.prototype.handle_step = function(interaction, phone_home) {
    var $inbound = $(interaction.inbound);
    var $outbound = interaction.outbound ? $(interaction.outbound) : $inbound;
    this.handle_inbound($inbound, $outbound, interaction, phone_home);
    this.handle_outbound($outbound, interaction);
  };

  Tourbot.prototype.handle_inbound = function(inbound, outbound, interaction, phone_home) {
    var self = this;
    var step_in = function() { self.step_in(interaction); };

    inbound.focus(step_in).trig(phone_home);
    if (inbound != outbound) {
      outbound.focus(step_in);
    }
  };

  Tourbot.prototype.handle_outbound = function(outbound, interaction) {
    var self = this;
    var step_out = function() { self.step_out(interaction); };

    outbound.trig(step_out);
  };

  Tourbot.prototype.add_markup = function(session_id, variant) {
    $('head').append('<link rel="stylesheet" type="text/css" href="' + this.css_url() + '"/>');

    this.tourbot_tab = $('<div id="tourbot-tab" class="tourbot"></div>');
    this.tourbot_tab.append('<div class="session-id" style="position: absolute; top: -1000px;">' + session_id + '</div>');
    this.tourbot_tab.append('<div class="variant" style="position: absolute; top: -1000px;">' + variant + '</div>');
    this.tourbot_tab.hover(function() { $(this).toggleClass('hover'); });

    this.tourbot_message = $('<div id="tourbot-message" class="tourbot tourbot-message" style="display:none;"></div>');
    this.tourbot_message.append('<span class="left">&nbsp;</span><span class="center"><div class="content"/></span><span class="right">&nbsp;</span>');
    this.tourbot_message_content = this.tourbot_message.find('.content');

    this.tourbot_offscreen_message = this.tourbot_message.clone().attr('id', 'tourbot-message-offscreen').attr('style', '');
    this.tourbot_offscreen_message_content = this.tourbot_offscreen_message.find('.content');

    $('body').append(this.tourbot_tab).append(this.tourbot_message).append(this.tourbot_offscreen_message);
  };

  Tourbot.prototype.step_in = function(interaction) {
    if (this.current_step >= 0) {
      //console.log("step in: " + interaction.inbound + " - " + this.current_step);
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
    var self = this;
    if (this.current_step >= 0) {
      this.tourbot_message.attr('tourbot-step', this.current_step);

      var interaction = this.interactions[this.current_step];
      var inbound = $(interaction.inbound);
      var outbound = interaction.outbound ? $(interaction.outbound) : inbound;
      if (! inbound.is(':focus') && ! outbound.is(':focus')) {
        inbound.focus();
      }
      var offset = interaction.offset || { x: 0, y: 0 };
      var left = inbound.offset().left + inbound.outerWidth() + offset.x + 10;
      var top = inbound.offset().top + offset.y - 18;
      var content = this.tourbot_message_content;



      if (this.tourbot_tab.is(':visible')) {
        this.tourbot_tab.fadeOut(200, function() {
          content.html(interaction.message);
          self.tourbot_message.css('left', left).css('top', top).fadeIn(200);
        });
      }
      else {
        this.tourbot_offscreen_message_content.html(interaction.message);
        var newWidth = this.tourbot_offscreen_message_content.width() + 1;

        content.fadeTo(200, 0, function() {
          content.html(interaction.message);
          content.fadeTo(200, 1);
        });

        content.animate({ width: newWidth }, { duration: 400, queue: false });
        this.tourbot_message.animate({ left: left, top: top }, { duration: 400, queue: false });
      }
    }
    else {
      this.tourbot_message.removeAttr('tourbot-step');
      this.tourbot_message.fadeOut(200, function() {
        setTimeout(function() {
          self.tourbot_tab.fadeIn(200);
        }, 2000);
      });
    }
  };

})(window);