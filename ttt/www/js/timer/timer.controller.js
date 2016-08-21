angular.module('starter')


.controller('mainCtrl', function($scope, $ionicModal, $timeout) {
  // Timer
  var mytimeout = null; // the current timeoutID
  // actual timer method, counts down every second, stops on zero
  $scope.onTimeout = function() {
    if ($scope.timer === 0) {
      $scope.$broadcast('timer-stopped', 0);
      $timeout.cancel(mytimeout);
      return;
    }
    $scope.timer--;
    mytimeout = $timeout($scope.onTimeout, 1000);
  };
  // functions to control the timer
  // starts the timer
  $scope.startTimer = function() {
    mytimeout = $timeout($scope.onTimeout, 1000);
    $scope.started = true;
  };

  // stops and resets the current timer
  $scope.stopTimer = function(closingModal) {
    if (closingModal != true) {
      $scope.$broadcast('timer-stopped', $scope.timer);
    }
    $scope.timer = $scope.timeForTimer;
    $scope.started = false;
    $scope.paused = false;
    $timeout.cancel(mytimeout);
  };
  // pauses the timer
  $scope.pauseTimer = function() {
    $scope.$broadcast('timer-stopped', $scope.timer);
    $scope.started = false;
    $scope.paused = true;
    $timeout.cancel(mytimeout);
  };

  // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
  $scope.$on('timer-stopped', function(event, remaining) {
    if (remaining === 0) {
      $scope.done = true;
    }
  });
  // UI
  // When you press a timer button this function is called
  $scope.selectTimer = function(val) {
    $scope.timeForTimer = val;
    $scope.timer = val
    $scope.started = false;
    $scope.paused = false;
    $scope.done = false;
  };

  // This function helps to display the time in a correct way in the center of the timer
  $scope.humanizeDurationTimer = function(input, units) {
    // units is a string with possible values of y, M, w, d, h, m, s, ms
    if (input == 0) {
      return 0;
    } else {
      var duration = moment().startOf('day').add(input, units);
      var format = "";
      if (duration.hour() > 0) {
        format += "H[h] ";
      }
      if (duration.minute() > 0) {
        format += "m[m] ";
      }
      if (duration.second() > 0) {
        format += "s[s] ";
      }
      return duration.format(format);
    }
  };
  // function for the modal
  $ionicModal.fromTemplateUrl('templates/timer.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
});

/* angular-svg-round-progressbar@0.3.8 2015-10-21 */
"use strict";
! function() {
  for (var a = 0, b = ["webkit", "moz"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
  window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
    var c = (new Date).getTime(),
      d = Math.max(0, 16 - (c - a)),
      e = window.setTimeout(function() {
        b(c + d)
      }, d);
    return a = c + d, e
  }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
    window.clearTimeout(a)
  })
}(), angular.module("angular-svg-round-progress", []), angular.module("angular-svg-round-progress").constant("roundProgressConfig", {
  max: 50,
  semi: !1,
  rounded: !1,
  responsive: !1,
  clockwise: !0,
  radius: 100,
  color: "#45ccce",
  bgcolor: "#eaeaea",
  stroke: 15,
  duration: 800,
  animation: "easeOutCubic",
  offset: 0
}), angular.module("angular-svg-round-progress").service("roundProgressService", [function() {
  var a = {},
    b = angular.isNumber,
    c = document.head.querySelector("base");
  a.resolveColor = c && c.href ? function(a) {
    var b = a.indexOf("#");
    return b > -1 && a.indexOf("url") > -1 ? a.slice(0, b) + window.location.href + a.slice(b) : a
  } : function(a) {
    return a
  }, a.isSupported = !(!document.createElementNS || !document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect);
  var d = function(a, b, c, d) {
    var e = (d - 90) * Math.PI / 180;
    return {
      x: a + c * Math.cos(e),
      y: b + c * Math.sin(e)
    }
  };
  return a.toNumber = function(a) {
    return b(a) ? a : parseFloat((a + "").replace(",", "."))
  }, a.getOffset = function(b, c) {
    var d = +c.offset || 0;
    if ("inherit" === c.offset)
      for (var e, f = b; !f.hasClass("round-progress-wrapper");) a.isDirective(f) && (e = f.scope().$parent.getOptions(), d += (+e.offset || 0) + (+e.stroke || 0)), f = f.parent();
    return d
  }, a.updateState = function(a, b, c, e, f, g) {
    if (!f) return e;
    var h = a > 0 ? Math.min(a, b) : 0,
      i = g ? 180 : 359.9999,
      j = 0 === b ? 0 : h / b * i,
      k = f / 2,
      l = d(k, k, c, j),
      m = d(k, k, c, 0),
      n = 180 >= j ? "0" : "1",
      o = ["M", l.x, l.y, "A", c, c, 0, n, 0, m.x, m.y].join(" ");
    return e.attr("d", o)
  }, a.isDirective = function(a) {
    return a && a.length ? "undefined" != typeof a.attr("round-progress") || "round-progress" === a[0].nodeName.toLowerCase() : !1
  }, a.animations = {
    linearEase: function(a, b, c, d) {
      return c * a / d + b
    },
    easeInQuad: function(a, b, c, d) {
      return c * (a /= d) * a + b
    },
    easeOutQuad: function(a, b, c, d) {
      return -c * (a /= d) * (a - 2) + b
    },
    easeInOutQuad: function(a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
    },
    easeInCubic: function(a, b, c, d) {
      return c * (a /= d) * a * a + b
    },
    easeOutCubic: function(a, b, c, d) {
      return c * ((a = a / d - 1) * a * a + 1) + b
    },
    easeInOutCubic: function(a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a * a + b : c / 2 * ((a -= 2) * a * a + 2) + b
    },
    easeInQuart: function(a, b, c, d) {
      return c * (a /= d) * a * a * a + b
    },
    easeOutQuart: function(a, b, c, d) {
      return -c * ((a = a / d - 1) * a * a * a - 1) + b
    },
    easeInOutQuart: function(a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a * a * a + b : -c / 2 * ((a -= 2) * a * a * a - 2) + b
    },
    easeInQuint: function(a, b, c, d) {
      return c * (a /= d) * a * a * a * a + b
    },
    easeOutQuint: function(a, b, c, d) {
      return c * ((a = a / d - 1) * a * a * a * a + 1) + b
    },
    easeInOutQuint: function(a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
    },
    easeInSine: function(a, b, c, d) {
      return -c * Math.cos(a / d * (Math.PI / 2)) + c + b
    },
    easeOutSine: function(a, b, c, d) {
      return c * Math.sin(a / d * (Math.PI / 2)) + b
    },
    easeInOutSine: function(a, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b
    },
    easeInExpo: function(a, b, c, d) {
      return 0 == a ? b : c * Math.pow(2, 10 * (a / d - 1)) + b
    },
    easeOutExpo: function(a, b, c, d) {
      return a == d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b
    },
    easeInOutExpo: function(a, b, c, d) {
      return 0 == a ? b : a == d ? b + c : (a /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (a - 1)) + b : c / 2 * (-Math.pow(2, -10 * --a) + 2) + b
    },
    easeInCirc: function(a, b, c, d) {
      return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b
    },
    easeOutCirc: function(a, b, c, d) {
      return c * Math.sqrt(1 - (a = a / d - 1) * a) + b
    },
    easeInOutCirc: function(a, b, c, d) {
      return (a /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b : c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
    },
    easeInElastic: function(a, b, c, d) {
      var e = 1.70158,
        f = 0,
        g = c;
      return 0 == a ? b : 1 == (a /= d) ? b + c : (f || (f = .3 * d), g < Math.abs(c) ? (g = c, e = f / 4) : e = f / (2 * Math.PI) * Math.asin(c / g), -(g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * (2 * Math.PI) / f)) + b)
    },
    easeOutElastic: function(a, b, c, d) {
      var e = 1.70158,
        f = 0,
        g = c;
      return 0 == a ? b : 1 == (a /= d) ? b + c : (f || (f = .3 * d), g < Math.abs(c) ? (g = c, e = f / 4) : e = f / (2 * Math.PI) * Math.asin(c / g), g * Math.pow(2, -10 * a) * Math.sin((a * d - e) * (2 * Math.PI) / f) + c + b)
    },
    easeInOutElastic: function(a, b, c, d) {
      var e = 1.70158,
        f = 0,
        g = c;
      return 0 == a ? b : 2 == (a /= d / 2) ? b + c : (f || (f = d * (.3 * 1.5)), g < Math.abs(c) ? (g = c, e = f / 4) : e = f / (2 * Math.PI) * Math.asin(c / g), 1 > a ? -.5 * (g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * (2 * Math.PI) / f)) + b : g * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - e) * (2 * Math.PI) / f) * .5 + c + b)
    },
    easeInBack: function(a, b, c, d, e) {
      return void 0 == e && (e = 1.70158), c * (a /= d) * a * ((e + 1) * a - e) + b
    },
    easeOutBack: function(a, b, c, d, e) {
      return void 0 == e && (e = 1.70158), c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b
    },
    easeInOutBack: function(a, b, c, d, e) {
      return void 0 == e && (e = 1.70158), (a /= d / 2) < 1 ? c / 2 * (a * a * (((e *= 1.525) + 1) * a - e)) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b
    },
    easeInBounce: function(b, c, d, e) {
      return d - a.animations.easeOutBounce(e - b, 0, d, e) + c
    },
    easeOutBounce: function(a, b, c, d) {
      return (a /= d) < 1 / 2.75 ? c * (7.5625 * a * a) + b : 2 / 2.75 > a ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : 2.5 / 2.75 > a ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
    },
    easeInOutBounce: function(b, c, d, e) {
      return e / 2 > b ? .5 * a.animations.easeInBounce(2 * b, 0, d, e) + c : .5 * a.animations.easeOutBounce(2 * b - e, 0, d, e) + .5 * d + c
    }
  }, a
}]), angular.module("angular-svg-round-progress").directive("roundProgress", ["$window", "roundProgressService", "roundProgressConfig", function(a, b, c) {
  var d = {
    restrict: "EA",
    replace: !0,
    transclude: !0,
    scope: {
      current: "=",
      max: "=",
      semi: "=",
      rounded: "=",
      clockwise: "=",
      responsive: "=",
      radius: "@",
      color: "@",
      bgcolor: "@",
      stroke: "@",
      duration: "@",
      animation: "@",
      offset: "@"
    }
  };
  return b.isSupported ? angular.extend(d, {
    link: function(e, f) {
      var g, h, i = !f.hasClass("round-progress-wrapper"),
        j = i ? f : f.find("svg").eq(0),
        k = j.find("path").eq(0),
        l = j.find("circle").eq(0),
        m = angular.copy(c);
      e.getOptions = function() {
        return m
      };
      var n = function() {
          var a = m.semi,
            c = m.responsive,
            d = +m.radius || 0,
            e = +m.stroke,
            g = 2 * d,
            h = d - e / 2 - b.getOffset(f, m);
          j.css({
            top: 0,
            left: 0,
            position: c ? "absolute" : "static",
            width: c ? "100%" : g + "px",
            height: c ? "100%" : (a ? d : g) + "px",
            overflow: "hidden"
          }), i || (j[0].setAttribute("viewBox", "0 0 " + g + " " + (a ? d : g)), f.css({
            width: c ? "100%" : "auto",
            position: "relative",
            "padding-bottom": c ? a ? "50%" : "100%" : 0
          })), f.css({
            width: c ? "100%" : "auto",
            position: "relative",
            "padding-bottom": c ? a ? "50%" : "100%" : 0
          }), k.css({
            stroke: b.resolveColor(m.color),
            "stroke-width": e,
            "stroke-linecap": m.rounded ? "round" : "butt"
          }), a ? k.attr("transform", m.clockwise ? "translate(0," + g + ") rotate(-90)" : "translate(" + g + ", " + g + ") rotate(90) scale(-1, 1)") : k.attr("transform", m.clockwise ? "" : "scale(-1, 1) translate(" + -g + " 0)"), l.attr({
            cx: d,
            cy: d,
            r: h >= 0 ? h : 0
          }).css({
            stroke: b.resolveColor(m.bgcolor),
            "stroke-width": e
          })
        },
        o = function(c, d, e) {
          var h = b.toNumber(m.max || 0),
            i = c > 0 ? a.Math.min(c, h) : 0,
            j = d === i || 0 > d ? 0 : d || 0,
            l = i - j,
            n = b.animations[m.animation],
            o = new a.Date,
            p = +m.duration || 0,
            q = e || c > h && d > h || 0 > c && 0 > d || 25 > p,
            r = m.radius,
            s = r - m.stroke / 2 - b.getOffset(f, m),
            t = 2 * r,
            u = m.semi;
          q ? b.updateState(i, h, s, k, t, u) : (a.cancelAnimationFrame(g), function v() {
            var c = a.Math.min(new Date - o, p);
            b.updateState(n(c, j, l, p), h, s, k, t, u), p > c && (g = a.requestAnimationFrame(v))
          }())
        },
        p = Object.keys(d.scope).filter(function(a) {
          return "current" !== a
        });
      e.$watchGroup(p, function(a) {
        for (var b = 0; b < a.length; b++) "undefined" != typeof a[b] && (m[p[b]] = a[b]);
        n(), e.$broadcast("$parentOffsetChanged"), "inherit" !== m.offset || h ? "inherit" !== m.offset && h && h() : h = e.$on("$parentOffsetChanged", function() {
          o(e.current, e.current, !0), n()
        })
      }), e.$watchGroup(["current", "max", "animation", "duration", "radius", "stroke", "semi", "offset"], function(a, c) {
        o(b.toNumber(a[0]), b.toNumber(c[0]))
      })
    },
    template: function(a) {
      for (var c = a.parent(), d = "round-progress", e = ['<svg class="' + d + '" xmlns="http://www.w3.org/2000/svg">', '<circle fill="none"/>', '<path fill="none"/>', "<g ng-transclude></g>", "</svg>"]; c.length && !b.isDirective(c);) c = c.parent();
      return c && c.length || (e.unshift('<div class="round-progress-wrapper">'), e.push("</div>")), e.join("\n")
    }
  }) : angular.extend(d, {
    template: '<div class="round-progress" ng-transclude></div>'
  })
}]);
