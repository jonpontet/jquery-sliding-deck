"use strict";

var slidingDeck = {
    savedScrollTop: 0,
    init: function () {
        var self = this;
        $(window).on("scroll", function () {
            self.main(self.getScrollDir());
        });
        this.main(false);
        $('.next-slide').on('click', function(e){
            e.preventDefault();
            self.scrollToNextSection(); 
        });
    },
    main: function (scrollDir) {
        let $nextSection,
            $currentSection,
            popOff = false,
            self = this;
        if (scrollDir === 'down') {
            $nextSection = $("section.current").next("section:not(.stacked)");
            if ($nextSection.length) {
                if (self.isTopOfViewport($nextSection)) {
                    $nextSection.addClass("stacked").addClass("current").siblings().removeClass("current");
                    // current-menu-item
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
        } else {
            if ($(window).scrollTop()) {
                this.scrollToNearestSection();
            } else {
                $('section:first').addClass("stacked").addClass("current");
            }
        }
    },
    scrollToNextSection: function() {
        if ($("section.current").next('section').length) {
            let scroll = $("section.current").next().offset().top;
            $(window).scrollTop(scroll);
        }
    },
    scrollToNearestSection: function () {
        var scrollTop = $(window).scrollTop(),
            prevOffset = "",
            prevDiff = "";
        if (!scrollTop > 0) {
            return;
        }
        $("section").each(function () {
            let diff = Math.abs(scrollTop - $(this).offset().top);
            if (prevDiff === "") {
                prevDiff = diff;
            } else {
                if (diff < prevDiff) {
                    prevOffset = $(this).offset().top;
                    prevDiff = diff;
                } else {
                    $(window).scrollTop(prevOffset);
                    console.log(prevOffset);
                    return false;
                }
            }

        });
    },
    reOrgStack: function () {
        var stackedLength = $("section.stacked").length;
        $("section.stacked:not(.current)").each(function () {
            $(this).css("z-index", "-" + stackedLength);
        });
    },
    getScrollDir: function () {
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
    isTopOfViewport: function ($el) {
        let result = false;
        if ($el.offset().top <= $(window).scrollTop()) {
            result = true;
        }
        return result;
    },
    isBottomOfViewport: function ($el) {
        let result = false;
        if ($el.offset().top >= ($(window).scrollTop() + $(window).height())) {
            result = true;
        }
        return result;
    }
};
slidingDeck.init();
