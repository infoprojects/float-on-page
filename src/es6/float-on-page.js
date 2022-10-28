(function ($) {
  "use strict";

  $.fn.addFloatGhost = function () {
    const original = $(this);

    $(`<div class="fop-ghost"></div>`)
      .insertAfter(original)
      .hide()
      .css({
        "width": original.get(0).offsetWidth,
        "height": original.get(0).offsetHeight
      });

    return original.addClass("fop-active");
  };

  $.fn.removeFloatGhost = function () {
    const original = $(this);

    original.next(".fop-ghost").remove();

    return original.removeClass("fop-active");
  };

  $.fn.floatOnPage = function (config) {
    $(this).each((_index, currentElement) => {
      const eltConfig = $(currentElement).data("float-config") || config;
      const stopAt = eltConfig.stopAt;
      const minSize = eltConfig.minSize || 0;

      const floatElt = $(currentElement);
      let originTop = floatElt.get(0).getBoundingClientRect().top + window.pageYOffset;
      let originLeft = floatElt.get(0).getBoundingClientRect().left + window.pageXOffset;
      const eltHeight = floatElt.outerHeight();
      const eltWidth = floatElt.outerWidth();

      const applyPageFloat = function () {
        const collisionPoint = $(stopAt).get(0).getBoundingClientRect().top + window.pageYOffset;
        const docTop = window.pageYOffset;

        const shouldFloat = docTop >= originTop;
        const eltTop = shouldFloat ? docTop + originTop : originTop;
        const willCollide = docTop + eltHeight >= collisionPoint;
        const floating = floatElt.hasClass("fop-afloat");
        const pinnedToPage = floatElt.hasClass("fop-pinned");

        if (shouldFloat && !willCollide) {
          floatElt
            .removeClass("fop-pinned")
            .addClass("fop-afloat")
            .css({
              "left": originLeft,
              "top": 0,
              "position": "fixed",
              "width": eltWidth
            })
            .next(".fop-ghost")
            .show();
        } else if (shouldFloat) {
          const leftFromParent = originLeft - floatElt.offsetParent().get(0).getBoundingClientRect().left + window.pageXOffset;

          floatElt
            .addClass("fop-pinned")
            .css({
              "left": leftFromParent,
              "position": "absolute",
              "top": collisionPoint - eltHeight - floatElt.offsetParent().get(0).getBoundingClientRect().top - window.pageYOffset,
              "width": eltWidth
            })
            .next(".fop-ghost")
            .show();
        } else if (!shouldFloat && floating) {
          resetPageFloat();
        }
      };

      const startPageFloat = () => {
        floatElt.addFloatGhost();
        originTop = floatElt.get(0).getBoundingClientRect().top + window.pageYOffset;
        originLeft = floatElt.get(0).getBoundingClientRect().left + window.pageXOffset;

        $(window).on("scroll", applyPageFloat);
        $(window).trigger("scroll");
      };

      const stopPageFloat = () => {
        $(window).off("scroll", applyPageFloat);
        floatElt.removeFloatGhost();
      };

      const resetPageFloat = () => {
        floatElt.removeClass("fop-afloat fop-pinned").css({
          "left": "auto",
          "position": "static",
          "top": "auto",
          "width": "auto"
        }).next(".fop-ghost").hide();

        originTop = floatElt.get(0).getBoundingClientRect().top + window.pageYOffset;
        originLeft = floatElt.get(0).getBoundingClientRect().left + window.pageXOffset;
      };

      $(window).on("resize", function () {
        var debounceResize;

        clearTimeout(debounceResize);

        debounceResize = setTimeout(() => {
          const wouldFloat = $(window).width() >= minSize;

          if (wouldFloat && !floatElt.hasClass("fop-active")) {
            return startPageFloat();
          } else if (!wouldFloat && floatElt.hasClass("fop-active")) {
            return stopPageFloat();
          } else {
            return resetPageFloat();
          }
        }, 320);
      });

      $(window).trigger("resize");
    });
  };
})(jQuery)
