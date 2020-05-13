"use strict";

import $ from 'jQuery';

var jonpontetSlidingDeck = {
    savedScrollTop: 0,
    init: function() {
      var self = this;
        $(window).on("scroll", function() {
            let $nextSection,
                $currentSection,
                popOff = false,
                scrollDir = self.getScrollDir();
            if (scrollDir === 'down') {
                $nextSection = $("section.current").next("section:not(.stacked)");
                if ($nextSection.length) {
                    if (self.isTopOfViewport($nextSection)) {
                        $nextSection.addClass("stacked").addClass("current").siblings().removeClass("current");
                        self.reOrgStack();
                    }
                }
            } else if (scrollDir === 'up') {
                if ($("section.stacked").length > 1) {
                    $currentSection = $("section.current");
                    if ($currentSection.next("section:not(.stacked)").length) {
                        $nextSection = $currentSection.next("section:not(.stacked)");
                        if (self.isBottomOfViewport($nextSection)) {
                            popOff = true;
                        }
                    } else {
                        popOff = true;
                    }
                    if (popOff) {
                        $currentSection.removeClass("stacked").removeClass("current").attr("style", "").prev("section.stacked").addClass("current");
                        popOff = false;
                    }
                }
            }
        });
    },
    reOrgStack: function() {
        var stackedLength = $("section.stacked").length;
        $("section.stacked:not(.current)").each(function() {
            $(this).css("z-index", "-" + (stackedLength - $(this).index()));
        });
    },
    getScrollDir: function() {
        let result,
            scrollTop = $(window).scrollTop();
        if (scrollTop > this.savedScrollTop) {
            result = "down";
        } else if (scrollTop === this.savedScrollTop) {
            result = "";
        } else {
            result = "up";
        }
        this.savedScrollTop = scrollTop;
        return result;
    },
    isTopOfViewport: function($el) {
        let result = false;
        if ($el.offset().top <= $(window).scrollTop()) {
            result = true;
        }
        return result;
    },
    isBottomOfViewport: function($el) {
        let result = false;
        if ($el.offset().top >= ($(window).scrollTop() + $(window).height())) {
            result = true;
        }
        return result;
    }
};
jonpontetSlidingDeck.init();