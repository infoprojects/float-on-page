"use strict"

$ = @jQuery

$.fn.addFloatGhost = ->
  original = $ @
  $ """<div class="fop-ghost"></div>"""
    .insertAfter original
    .hide()
    .css
      "width": original.get(0).offsetWidth
      "height": original.get(0).offsetHeight
  return original

$.fn.floatOnPage = (config) ->
  $(@).each ->
    eltConfig = $(@).data("float-config") or config
    stopAt = eltConfig.stopAt;
    floatElt = $ @
    originTop = floatElt.position().top
    originLeft = floatElt.position().left

    floatElt
      .append "#{stopAt}"
      .addFloatGhost()
      .addClass "fop-ready"
      .addClass "fop-top-#{originTop}"
      .addClass "fop-left-#{originLeft}"

    $(window).on "resize", () ->
      clearTimeout resizeTimer
      resizeTimer = setTimeout(( ->
        floatElt
          .removeClass "fop-afloat fop-pinned"
          .css
            "left": 0
            "top": 0
            "position": "static"
        originTop = floatElt.position().top
        originLeft = floatElt.position().left
        $(window).trigger "scroll"
        return
      ), 250)
      return

    $(window).on "scroll", ->
      collisionPoint = $(stopAt).position().top
      eltHeight = floatElt.get(0).offsetHeight
      eltWidth = floatElt.get(0).offsetWidth
      docTop = $(document).scrollTop()

      shouldFloat = docTop >= originTop
      eltTop = if shouldFloat then docTop + originTop else originTop
      willCollide = docTop + eltHeight >= collisionPoint
      floating = floatElt.hasClass "fop-afloat"
      pinnedToPage = floatElt.hasClass "fop-pinned"

      if shouldFloat and !willCollide
        floatElt
          .removeClass "fop-pinned"
          .addClass "fop-afloat"
          .css
            "left": originLeft
            "top": 0
            "position": "fixed"
            "width": eltWidth
          .next(".fop-ghost").show()
      else if shouldFloat
        floatElt
          .addClass "fop-pinned"
          .css
            "left": originLeft
            "top": collisionPoint - eltHeight
            "position": "absolute"
            "width": eltWidth
          .next(".fop-ghost").show()
      else if !shouldFloat and floating
        floatElt
          .removeClass "fop-afloat fop-pinned"
          .css
            "left": 0
            "top": 0
            "position": "static"
          .next(".fop-ghost").hide()
      return
    return
  return @
