/**
 * jQuery Sliding Deck (https://github.com/jonpontet/jquery-sliding-deck)
 * v0.2.0-beta.0
 */

/*global define, window, document, jQuery, exports, require */

(function (factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    // Browserify
    factory(require('jquery'), window, document);
  } else {
    // Browser globals
    factory(jQuery, window, document);
  }
}(function ($) {
  'use strict'

  class SlidingDeck {
    constructor(el, options) {
      let self = this;

      this.$el = $('body');
      this.options = $.extend({}, SlidingDeck.defaults, options);
      this.$cards = [];
      this.$cards = this.$el.find(this.options.cards);
      this.$ghostCard = $('<div class="' + this.options.classes.cardBase + ' ' +
        this.options.classes.cardGhost + '">');
      this.isScrollingDown = true;
      this.lastScrollTop = 0;
      this.hasInitialized = false;
      this.hasUninitialized = false;

      this.maybeInitialize();
      $(window).on('resize.maybeInitialize', function () {
        self.maybeInitialize();
      });
    }


    maybeInitialize() {
      if ($(window).width() >= this.options.minDeviceWidth) {
        this.unInitBasicView();
        if (!this.hasInitialized) {
          this.hasInitialized = true;
          this.hasUninitialized = false;
          this.init();
        } 
      } else {
      this.initBasicView();
       if (this.hasInitialized && !this.hasUninitialized) {
        this.hasUninitialized = true;
        this.hasInitialized = false;
        this.unInit();
       }
      }
    }

    init() {
      let self = this;
      $('body').addClass('jsd');

      // Define default height for all cards
      this.cardsHeight = $(window).height();
      if (this.options.height !== 'full') {
        if (this.options.height === 'auto') {
          this.cardsHeight = '';
        } else {
          this.cardsHeight = parseInt(this.options.height);
        }
      }

      // Init positioning of all cards
      this.$cards.each(function (i, card) {
        $(card)
          .addClass(self.options.classes.cardBase)
          .height(self.cardsHeight)
          .data('offsetTop', self.getCardTop(i))
          .css({
            'top': self.getCardTop(i) + 'px',
            'zIndex': self.options.zIndexBase * (i + 1)
          });

        // Add a ghost card that will sit behind the last card
        // so that cards remain correctly positioned when the last card is active
        if (self.$cards.length - 1 === i) {
          self.$ghostCard
            .height(self.cardsHeight)
            .css({
              'top': self.getCardTop(i) + 'px',
              'zIndex': self.options.zIndexBase * i
            })
            .insertAfter(card);
        }
      });

      $(window).off('resize.setMinHeight');

      this.positionCards();
      $(window).on('resize.positionCards scroll.positionCards', function () {
        self.setScrollDirection();
        self.positionCards();
      });
    }

    initBasicView() {
      var self = this;
      this.setMinHeight();
      $(window).on('resize.setMinHeight', function () {
        self.setMinHeight();
      });
    }

    unInitBasicView() {
      this.unSetMinHeight();
      $(window).off('resize.setMinHeight');
    }

    setMinHeight() {
      this.$cards.css('minHeight', $(window).height() + 'px');
    }

    unSetMinHeight() {
      this.$cards.css('minHeight', '');
    };

    unInit() {
      let self = this;
      $('body').removeClass('jsd');

      this.$cards.each(function (i, card) {
        $(card)
          .removeClass(self.options.classes.cardBase)
          .removeClass(self.options.classes.cardActive)
          .removeClass(self.options.classes.cardFixed)
          .removeClass(self.options.classes.cardPrevious)
          .removeClass(self.options.classes.cardNext)
          .height('auto')
          .removeData('offsetTop')
          .css({
            'top': 'auto',
            'zIndex': 'auto'
          });

        if (self.$ghostCard.length) {
          self.$ghostCard.remove();
        }
      });

      $(window).off('resize.positionCards scroll.positionCards');
    }

    getCardTop(i) {
      return this.cardsHeight * i;
    }

    setScrollDirection() {
      this.isScrollingDown = $(window).scrollTop() > this.lastScrollTop;
      this.lastScrollTop = $(window).scrollTop() <= 0 ? 0 : $(window).scrollTop();
    }

    positionCards() {
      let self = this;
      this.$cards.each(function (i, card) {
        let $card = $(card),
          offsetTop = $card.data('offsetTop'),
          jsdScrollTop = $(window).scrollTop(),
          isLastCard = (self.$cards.length - 1) === i;


        if (self.isScrollingDown) {

          if (jsdScrollTop >= offsetTop &&
            !$card.hasClass(self.options.classes.cardActive) &&
            !$card.hasClass(self.options.classes.cardPrevious)) {
            // Activate next card

            // Current active card becomes previous card
            if (i - 1 >= 0) {
              $(self.$cards[i - 1])
                .removeClass(self.options.classes.cardActive)
                .addClass(self.options.classes.cardPrevious);
            }

            // Make this card active
            $card
              .addClass([self.options.classes.cardFixed, self.options.classes.cardActive])
              .removeClass([self.options.classes.cardPrevious, self.options.classes.cardNext])
              .css('top', '')
              .css('zIndex', -1);

            // Show the ghost card if this is the last card
            if (isLastCard) {
              self.$ghostCard.show();
            }

            // Set the next card
            if (self.$cards.length > i + 1) {
              $(self.$cards[i + 1]).addClass(self.options.classes.cardNext);
            }
          }
        } else {
          // Scroll up

          if (jsdScrollTop < offsetTop &&
            $card.hasClass(self.options.classes.cardActive)) {
            // Deactivate the current active card

            // Remove current next card
            $(self.$cards)
              .filter('.' + self.options.classes.cardNext)
              .removeClass(self.options.classes.cardNext);

            // Make this card inactive and next
            $card
              .addClass(self.options.classes.cardNext)
              .removeClass([self.options.classes.cardFixed, self.options.classes.cardActive])
              .css('top', $card.data('offsetTop') + 'px')
              .css('zIndex', '');

            // Set next active card
            if (i - 1 >= 0) {
              $(self.$cards[i - 1])
                .removeClass(self.options.classes.cardPrevious)
                .addClass(self.options.classes.cardActive);
            }

            // Hide the ghost card
            if (isLastCard) {
              self.$ghostCard.hide();
            }
          }
        }
      });
    }
  }

  $.SlidingDeck = SlidingDeck;

  SlidingDeck.defaults = {
    cards: 'section',
    height: 'full',
    zIndexBase: 10,
    minDeviceWidth: 0,
    classes: {
      cardBase: 'jsd-card',
      cardActive: 'jsd-card--active',
      cardFixed: 'jsd-card--fixed',
      cardPrevious: 'jsd-card--previous',
      cardNext: 'jsd-card--next',
      cardGhost: 'jsd-card--ghost',
    }
  };

  $.fn.slidingDeck = function (options) {
    let dataKey = 'slidingDeck',
      instance = $(this).data(dataKey);
    // If instance already exists, destroy it
    if (instance && instance.dispose) {
      instance.dispose();
    }
    instance = new SlidingDeck(this, options);
    $(this).data(dataKey, instance);

    return this;
  };
}));