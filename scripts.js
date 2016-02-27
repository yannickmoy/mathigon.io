'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    function uid() {
        var n = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

        return Math.random().toString(36).substr(2, n);
    }

    // Checks if x is strictly equal to any one of the following arguments
    function isOneOf(x) {
        for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            values[_key - 1] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;

                if (x === v) return true;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return false;
    }

    // Merges multiple objects into a single one
    function extend(first) {
        for (var _len2 = arguments.length, others = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            others[_key2 - 1] = arguments[_key2];
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = others[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var obj = _step2.value;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) first[key] = obj[key];
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return first;
    }

    // -----------------------------------------------------------------------------
    // Promises

    function defer() {
        var resolve = undefined,
            reject = undefined;

        var promise = new Promise(function (_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });

        // This prevents exceptions when promises without .catch are rejected:
        promise.catch(function (error) {
            return error;
        });

        return { promise: promise, resolve: resolve, reject: reject };
    }

    // -----------------------------------------------------------------------------
    // Function Wrappers

    // Wrapper for functions to cache their result based on arguments
    function cache(fn) {
        var cached = new Map();
        return function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            var argString = args.join('--');
            if (!cached.has(argString)) cached.set(argString, fn.apply(undefined, args));
            return cached.get(argString);
        };
    }

    // Wrapper that prevents a function `fn` from being triggered more than every `t` ms.
    function throttle(fn, t) {
        var delay = false;
        var repeat = false;
        return function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            if (delay) {
                repeat = true;
            } else {
                fn.apply(null, args);
                delay = true;
                setTimeout(function () {
                    if (repeat) fn.apply(undefined, args);
                    delay = false;
                    repeat = false;
                }, t);
            }
        };
    }

    // Removes all occurrences of x from the array a
    function without(array, x) {
        return this.filter(function (a) {
            return a !== x;
        });
    }

    function process(events, options) {
        if (options.lowercase) events = events.toLowerCase();
        return events.split(options.split).map(function (e) {
            return e.trim();
        });
    }

    var Evented = function () {
        function Evented() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref$split = _ref.split;
            var split = _ref$split === undefined ? ' ' : _ref$split;
            var _ref$lowecase = _ref.lowecase;
            var lowecase = _ref$lowecase === undefined ? false : _ref$lowecase;

            _classCallCheck(this, Evented);

            this._options = { split: split, lowecase: lowecase };
            this._events = {};
        }

        // -------------------------------------------------------------------------
        // Events

        // TODO implement priority


        _createClass(Evented, [{
            key: 'on',
            value: function on(events, fn) {
                var priority = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = process(events, this._options)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var e = _step3.value;

                        if (!(e in this._events)) this._events[e] = [];
                        this._events[e].push(fn);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }, {
            key: 'one',
            value: function one(events, fn) {
                var _this = this;
                function callback() {
                    _this.off(events, callback);
                    fn.apply(undefined, arguments);
                }
                this.on(events, callback);
            }
        }, {
            key: 'off',
            value: function off(events, fn) {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = process(events, this._options)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var e = _step4.value;

                        if (e in this._events) this._events[e] = this._events[e].filter(function (x) {
                            return x !== fn;
                        });
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }
        }, {
            key: 'trigger',
            value: function trigger(events) {
                for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                    args[_key5 - 1] = arguments[_key5];
                }

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = process(events, this._options)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var e = _step5.value;

                        if (e in this._events) this._events[e].forEach(function (fn) {
                            fn.apply(this, args);
                        });
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        }]);

        return Evented;
    }();

    // =============================================================================
    // Core.js | Strings
    // (c) 2015 Mathigon
    // =============================================================================

    // -----------------------------------------------------------------------------
    // String Utilities

    function words(str) {
        return str.trim().split(/\s+/);
    }

    function toCamelCase(str) {
        return str.toLowerCase().replace(/^-/, '').replace(/-(.)/g, function (match, g) {
            return g.toUpperCase();
        });
    }

    function isString(x) {
        return x instanceof String || typeof x === 'string';
    }

    // -----------------------------------------------------------------------------
    // Simple Animations

    function animate(callback, duration) {
        var startTime = Date.now();
        var time = 0;
        var running = true;

        var deferred = defer();
        var then = deferred.promise.then.bind(deferred.promise);

        function getFrame() {
            if (running && (!duration || time <= duration)) window.requestAnimationFrame(getFrame);

            time = Date.now() - startTime;
            callback(duration ? Math.min(1, time / duration) : time);
            if (duration && time >= duration) deferred.resolve();
        }

        getFrame();

        return {
            cancel: function cancel() {
                running = false;deferred.reject();
            },
            then: then };
    }

    // -----------------------------------------------------------------------------
    // Easing

    function easeIn(type) {
        var t = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var s = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        switch (type) {

            case 'quad':
                return t * t;
            case 'cubic':
                return t * t * t;
            case 'quart':
                return t * t * t * t;
            case 'quint':
                return t * t * t * t * t;
            case 'circ':
                return 1 - Math.sqrt(1 - t * t);
            case 'sine':
                return 1 - Math.cos(t * Math.PI / 2);
            case 'exp':
                return t <= 0 ? 0 : Math.pow(2, 10 * (t - 1));

            case 'back':
                if (s == null) s = 1.70158;
                return t * t * ((s + 1) * t - s);

            case 'elastic':
                if (s == null) s = 0.3;
                return -Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1) * 2 / s - 0.5) * Math.PI);

            case 'swing':
                return 0.5 - Math.cos(t * Math.PI) / 2;

            case 'spring':
                return 1 - Math.cos(t * 4.5 * Math.PI) * Math.exp(-p * 6);

            case 'bounce':
                if (t < 1 / 11) return 1 / 64 - 7.5625 * (0.5 / 11 - t) * (0.5 / 11 - t); // 121/16 = 7.5625
                if (t < 3 / 11) return 1 / 16 - 7.5625 * (2 / 11 - t) * (2 / 11 - t);
                if (t < 7 / 11) return 1 / 4 - 7.5625 * (5 / 11 - t) * (5 / 11 - t);
                return 1 - 7.5625 * (1 - t) * (1 - t);

            default:
                return t;
        }
    }

    function ease(type) {
        var t = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var s = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];


        if (t === 0) return 0;
        if (t === 1) return 1;
        type = type.split('-');

        if (type[1] === 'in') return easeIn(type[0], t, s);
        if (type[1] === 'out') return 1 - easeIn(type[0], 1 - t, s);
        if (t <= 0.5) return easeIn(type[0], 2 * t, s) / 2;
        return 1 - easeIn(type[0], 2 * (1 - t), s) / 2;
    }

    // -----------------------------------------------------------------------------
    // Element CSS Animations

    function getTransitions(element) {
        var s = window.getComputedStyle(element._el);
        if (s.getPropertyValue('transition') === 'all 0s ease 0s') return [];

        var delay = s.getPropertyValue('transition-delay').split(',');
        var duration = s.getPropertyValue('transition-duration').split(',');
        var property = s.getPropertyValue('transition-property').split(',');
        var timing = s.getPropertyValue('transition-timing-function').match(/[^\(\),]+(\([^\(\)]*\))?[^\(\),]*/g) || [];

        var result = [];
        for (var i = 0; i < property.length; ++i) {
            result.push({
                css: property[i].trim(),
                delay: cssTimeToNumber(delay[i]),
                duration: cssTimeToNumber(duration[i]),
                timing: timing[i]
            });
        }

        return result;
    }

    function setTransitions(element, transitions) {
        var styles = transitions.map(function (t) {
            return [t.css, (t.duration || 1000) + 'ms', t.timing || 'linear', (t.delay || 0) + 'ms'].join(' ');
        });

        element.css('transition', styles.join(', '));
    }

    function transitionElement(element, properties) {
        if (!Array.isArray(properties)) properties = [properties];

        var deferred = defer();
        var then = deferred.promise.then.bind(deferred.promise);

        var cancelled = false;
        if (element._data._animation) element._data._animation.cancel();

        // Set start property values of elements
        var s = window.getComputedStyle(element._el);
        properties.forEach(function (p) {
            if (p.from != null) {
                element.css(p.css, p.from);
            } else if (p.css === 'height') {
                element.css('height', parseFloat(s.getPropertyValue('height')));
            } else if (p.css === 'width') {
                element.css('width', parseFloat(s.getPropertyValue('width')));
            }
        });

        // Set transition values of elements
        var oldTransition = s.getPropertyValue('transition').replace('all 0s ease 0s', '');
        setTransitions(element, extend(getTransitions(element), properties));
        redraw();

        // Set end property values of elements
        properties.forEach(function (p) {
            element.css(p.css, p.to);
        });

        // Remove new transition values
        element.transitionEnd(function () {
            if (cancelled) return;
            element.css('transition', oldTransition);
            redraw();
            deferred.resolve();
        });

        function cancel() {
            cancelled = true;
            element.css('transition', oldTransition);

            // Freeze property values at current position  TODO check this!
            var s = window.getComputedStyle(element._el);
            properties.forEach(function (p) {
                element.css(p.css, s.getPropertyValue(p.css));
            });

            redraw();
            deferred.reject();
        }

        return element._data._animation = { cancel: cancel, then: then };
    }

    // -----------------------------------------------------------------------------
    // Element CSS Animations Effects

    function _enter(element) {
        var time = arguments.length <= 1 || arguments[1] === undefined ? 400 : arguments[1];
        var effect = arguments.length <= 2 || arguments[2] === undefined ? 'fade' : arguments[2];
        var delay = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        element.show();
        var animation = undefined;

        if (effect === 'fade') {
            animation = transitionElement(element, {
                css: 'opacity',
                from: 0,
                to: 1,
                duration: time
            });
        } else if (effect === 'pop') {
            var transform = element.transform.replace(/scale\([0-9\.]*\)/, '');
            var from = transform + ' scale(0.5)';
            var to = transform + ' scale(1)';

            animation = transitionElement(element, [{ css: prefix('transform'), from: from, to: to, delay: delay,
                duration: time, timing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }, { css: 'opacity', from: 0, to: 1, delay: delay, duration: time }]);
        } else if (effect === 'draw') {
            var l = element.strokeLength;
            element.css({ 'opacity': 1, 'stroke-dasharray': l + ' ' + l });
            animation = transitionElement(element, {
                css: 'stroke-dashoffset',
                from: l, to: 0,
                delay: delay,
                duration: time
            });
            animation.then(function () {
                element.css('stroke-dasharray', '');
            });
        }

        return animation;
    }

    function _exit(element) {
        var time = arguments.length <= 1 || arguments[1] === undefined ? 400 : arguments[1];
        var effect = arguments.length <= 2 || arguments[2] === undefined ? 'fade' : arguments[2];
        var delay = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        if (element.css('display') == 'none') return;
        var animation = undefined;

        if (effect === 'fade') {
            animation = transitionElement(element, {
                css: 'opacity',
                from: 1, to: 0,
                delay: delay,
                duration: time
            });
        } else if (effect === 'pop') {
            var transform = element.transform.replace(/scale\([0-9\.]*\)/, '');
            var from = transform + ' scale(1)';
            var to = transform + ' scale(0.5)';

            animation = transitionElement(element, [{ css: prefix('transform'), from: from, to: to, delay: delay,
                duration: time, timing: 'cubic-bezier(0.68, -0.275, 0.825, 0.115)' }, { css: 'opacity', from: 1, to: 0, delay: delay, duration: time }]);
        } else if (effect === 'draw') {
            var l = element.getStrokeLength();
            element.css('stroke-dasharray', l + ' ' + l);
            animation = transitionElement(element, {
                css: 'stroke-dashoffset',
                from: 0, to: l,
                delay: delay,
                duration: time
            });
        }

        animation.then(function () {
            element.hide();
        });
        return animation;
    }

    // these animations are defined in effects.css
    // pulse-down, pulse-up, flash, bounce-up, bounce-right
    function _effect(element, name) {
        element.animationEnd(function () {
            element.removeClass('effects-' + name);
        });
        element.addClass('effects-' + name);
    }

    function pointerPosition(e) {
        return {
            x: e.touches ? e.touches[0].clientX : e.clientX,
            y: e.touches ? e.touches[0].clientY : e.clientY
        };
    }

    // -----------------------------------------------------------------------------
    // Click Events

    function makeClickEvent($el) {
        if ($el._events._click) return;
        $el._events._click = true;

        var waitForEvent = false;
        var startX = undefined,
            startY = undefined;
        var preventMouse = false;

        $el._el.addEventListener('mousedown', function (e) {
            if (preventMouse) return;
            waitForEvent = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        $el._el.addEventListener('mouseup', function (e) {
            if (preventMouse) {
                preventMouse = false;
                return;
            }
            if (waitForEvent) {
                var endX = e.clientX;
                var endY = e.clientY;
                if (Math.abs(endX - startX) < 2 && Math.abs(endY - startY) < 2) {
                    $el.trigger('fastClick', e);
                }
            }
            waitForEvent = false;
        });

        $el._el.addEventListener('touchstart', function (e) {
            preventMouse = true;
            if (e.touches.length === 1) {
                waitForEvent = true;
                startX = e.changedTouches[0].clientX;
                startY = e.changedTouches[0].clientY;
            }
        });

        $el._el.addEventListener('touchend', function (e) {
            if (waitForEvent && e.changedTouches.length === 1) {
                var endX = e.changedTouches[0].clientX;
                var endY = e.changedTouches[0].clientY;
                if (Math.abs(endX - startX) < 5 && Math.abs(endY - startY) < 5) {
                    $el.trigger('fastClick', e);
                }
            }
            waitForEvent = false;
        });

        $el._el.addEventListener('touchcancel', function () {
            waitForEvent = false;
        });
    }

    function makeClickOutsideEvent($el) {
        if ($el._events._clickOutside) return;
        $el._events._clickOutside = true;

        $body.on('click', function (e) {
            if ($(e.target).hasParent($el)) return;
            $el.trigger('clickOutside');
        });
    }

    // -----------------------------------------------------------------------------
    // Pointer Events
    // TODO Make pointer more efficient more efficient using *enter and *leave

    function checkInside(element, event) {
        var c = pointerPosition(event);
        return element._el === document.elementFromPoint(c.x, c.y);
    }

    function makePointerPositionEvents(element) {
        if (element._data._pointerEvents) return;
        element._data._pointerEvents = true;

        var parent = element.parent;
        var isInside = null;
        parent.on('pointerEnd', function (e) {
            isInside = null;
        });

        parent.on('pointerMove', function (e) {
            var wasInside = isInside;
            isInside = checkInside(element, e);
            if (wasInside != null && isInside && !wasInside) element.trigger('pointerEnter', e);
            if (!isInside && wasInside) element.trigger('pointerLeave', e);
            if (isInside) element.trigger('pointerOver', e);
        });
    }

    // -----------------------------------------------------------------------------
    // Scroll Events

    function simpleAnimate(callback) {
        var running = true;

        function getFrame() {
            if (running) window.requestAnimationFrame(getFrame);
            callback();
        }

        getFrame();
        return { stop: function stop() {
                running = false;
            } };
    }

    function makeScrollEvents(element) {
        if (element._data._scrollEvents) return;
        element._data._scrollEvents = true;

        var scrollTimeout = null;
        var scrolling = false;
        var scrollAnimation = undefined;
        var scrollTop = undefined;

        function onScroll() {
            var newScrollTop = element.scrollTop;

            if (Math.abs(newScrollTop - scrollTop) > 1) {
                if (scrollTimeout) window.clearTimeout(scrollTimeout);
                scrollTimeout = null;
                element.trigger('scroll', { top: newScrollTop });
                scrollTop = newScrollTop;
            } else if (!scrollTimeout) {
                scrollTimeout = window.setTimeout(end, 100);
            }
        }

        function start(e) {
            if (scrolling || e.deltaY === 0) return;
            scrolling = true;
            scrollTop = element.scrollTop;
            scrollAnimation = simpleAnimate(onScroll);
            element.trigger('scrollstart');
        }

        function end() {
            if (!scrolling) return;
            scrolling = false;
            scrollAnimation.stop();
            element.trigger('scrollend');
        }

        function touchStart() {
            window.addEventListener('touchmove', start);
            window.addEventListener('touchend', touchEnd);
        }

        function touchEnd() {
            window.removeEventListener('touchmove', start);
            window.removeEventListener('touchend', touchEnd);
        }

        if (!element._isWindow) element.fixOverflowScroll();

        var target = element._isWindow ? window : element._el;
        target.addEventListener('wheel', start);

        element._el.addEventListener('touchstart', touchStart);
    }

    // -----------------------------------------------------------------------------
    // Event Bindings

    var customEvents = {
        pointerStart: 'mousedown touchstart',
        pointerMove: 'mousemove touchmove',
        pointerEnd: 'mouseup touchend mousecancel touchcancel',

        change: 'propertychange keyup input paste',

        scrollwheel: 'DOMMouseScroll mousewheel',

        fastClick: makeClickEvent, // no capture!
        clickOutside: makeClickOutsideEvent, // no capture!

        pointerEnter: makePointerPositionEvents, // no capture!
        pointerLeave: makePointerPositionEvents, // no capture!
        pointerOver: makePointerPositionEvents, // no capture!

        scrollStart: makeScrollEvents, // no capture!
        scroll: makeScrollEvents, // no capture!
        scrollEnd: makeScrollEvents // no capture!
    };

    function createEvent($el, event, fn, useCapture) {
        var custom = customEvents[event];

        if (isString(custom)) {
            $el.on(custom, fn, useCapture);
        } else if (custom) {
            custom($el);
        } else {
            $el._el.addEventListener(event, fn, !!useCapture);
        }

        if (event in $el._events) {
            if ($el._events[event].indexOf(fn) < 0) $el._events[event].push(fn);
        } else {
            $el._events[event] = [fn];
        }
    }

    function removeEvent($el, event, fn, useCapture) {
        var custom = customEvents[event];

        if (isString(custom)) {
            $el.off(custom, fn, useCapture);
            return;
        } else if (!custom) {
            $el._el.removeEventListener(event, fn, !!useCapture);
        }

        if (event in $el._events) $el._events[event] = without($el._events[event], fn);
    }

    function parse(string) {
        // TODO use expressions
        // jshint evil: true

        var fn = string.replace(/"/g, '\"');
        fn = fn.replace(/\$\{([^\}]+)\}/g, function (x, y) {
            return '" + (' + y + ') + "';
        });

        try {
            return new Function('_vars', 'try {\n            with(_vars) { return "' + fn + '" }\n        } catch(e) {\n            if (!(e instanceof ReferenceError)) console.warn(e);\n            return "";\n        }');
        } catch (e) {
            console.warn('WHILE PARSING: ', string, '\n', e);
            return function () {
                return '';
            };
        }
    }

    function makeTemplate(model, property, fromObj) {
        var toObj = arguments.length <= 3 || arguments[3] === undefined ? fromObj : arguments[3];

        if (fromObj[property].indexOf('${') < 0) return;
        var fn = parse(fromObj[property]);
        model.change(function () {
            toObj[property] = fn(model);
        });
        toObj[property] = fn(model);
    }

    function bind(_el, model) {
        var noIterate = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        var attrs = _el.attributes;
        if (attrs) {
            for (var i = 0; i < attrs.length; ++i) {
                // NOTE: We have to convert x-path attributes, because SVG errors are thrown on load
                var to = attrs[i].name.match(/^x-/) ? document.createAttribute(attrs[i].name.replace(/^x-/, '')) : attrs[i];
                makeTemplate(model, 'value', attrs[i], to);
                if (to != attrs[i]) _el.setAttributeNode(to);
            }
        }

        if (_el.children && _el.children.length) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = _el.childNodes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var c = _step6.value;

                    if (c instanceof Text) {
                        makeTemplate(model, 'textContent', c);
                    } else if (!noIterate && !c.isCustomElement) {
                        bind(c, model);
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        } else if (_el.innerHTML && _el.innerHTML.trim()) {
            makeTemplate(model, 'innerHTML', _el);
        }
    }

    function cssN(element, property) {
        return parseFloat(element.css(property));
    }

    var p$1 = window.Element.prototype;
    var elementMatches = p$1.matches || p$1.webkitMatchesSelector || p$1.mozMatchesSelector || p$1.msMatchesSelector;

    var Element = function () {
        function Element(el) {
            _classCallCheck(this, Element);

            this._el = el;
            this._isWindow = isOneOf(el, window, document.body, document.documentElement);
            this._data = el ? el._m_data || (el._m_data = {}) : {};
            this._events = el ? el._m_events || (el._m_events = {}) : {};
        }

        // -------------------------------------------------------------------------
        // Basic Functionality

        _createClass(Element, [{
            key: 'addClass',
            value: function addClass(className) {
                var classes = words(className);
                if (this._el.classList) {
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = classes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var c = _step7.value;
                            this._el.classList.add(c);
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }
                } else {
                    this._el.className += ' ' + className;
                }
            }
        }, {
            key: 'removeClass',
            value: function removeClass(className) {
                var classes = words(className);
                if (this._el.classList) {
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = classes[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var c = _step8.value;
                            this._el.classList.remove(c);
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }
                } else {
                    var regex = new RegExp('(^|\\s)' + classes.join('|') + '(\\s|$)', 'gi');
                    this._el.className = this._el.className.toString().replace(regex, ' ');
                }
            }
        }, {
            key: 'hasClass',
            value: function hasClass(className) {
                return (' ' + this._el.className + ' ').indexOf(' ' + className.trim() + ' ') >= 0;
            }
        }, {
            key: 'toggleClass',
            value: function toggleClass(className) {
                var classes = words(className);
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = classes[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var c = _step9.value;

                        if (this._el.classList) {
                            this._el.classList.toggle(c);
                        } else {
                            this[this.hasClass(c) ? 'removeClass' : 'addClass'](c);
                        }
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }
            }
        }, {
            key: 'setClass',
            value: function setClass(className) {
                var condition = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                if (condition) {
                    this.addClass(className);
                } else {
                    this.removeClass(className);
                }
            }
        }, {
            key: 'attr',
            value: function attr(_attr, value) {
                if (value === undefined) {
                    return this._el.getAttribute(_attr);
                } else if (value === null) {
                    this._el.removeAttribute(_attr);
                } else {
                    this._el.setAttribute(_attr, value);
                }
            }
        }, {
            key: 'hasAttribute',
            value: function hasAttribute(attr) {
                return this._el.hasAttribute(attr);
            }
        }, {
            key: 'blur',
            value: function blur() {
                this._el.blur();
            }
        }, {
            key: 'focus',
            value: function focus() {
                this._el.focus();
            }
        }, {
            key: 'change',
            value: function change(callback) {
                var _this2 = this;

                this.on('change', function () {
                    callback(_this2.value);
                });
            }

            // -------------------------------------------------------------------------
            // Dimensions

        }, {
            key: 'offset',
            value: function offset(parent) {
                // Get offset from immediate parent
                if (parent._el === this._el.offsetParent) {
                    var top = this.offsetTop + parent._el.clientTop;
                    var left = this.offsetLeft + parent._el.clientLeft;
                    var bottom = top + this.height;
                    var right = left + this.width;
                    return { top: top, left: left, bottom: bottom, right: right };

                    // Get offset based on any other element
                } else {
                        var parentBox = parent._el.getBoundingClientRect();
                        var box = this._el.getBoundingClientRect();
                        return { top: box.top - parentBox.top, left: box.left - parentBox.left,
                            bottom: box.bottom - parentBox.top, right: box.right - parentBox.left };
                    }
            }

            // -------------------------------------------------------------------------
            // Scrolling

        }, {
            key: 'fixOverflowScroll',
            value: function fixOverflowScroll() {
                var _this = this;

                if (this._isWindow || this._data._fixOverflowScroll) return;
                this._data._fixOverflowScroll = true;

                this._el.addEventListener('touchstart', function () {
                    // This ensures that overflow bounces happen within container
                    var top = _this.scrollTop;
                    var bottom = _this.scrollHeight - _this.height;

                    if (top <= 0) _this.scrollTop = 1;
                    if (top >= bottom) _this.scrollTop = bottom - 1;
                });
            }
        }, {
            key: 'scrollTo',
            value: function scrollTo(pos) {
                var time = arguments.length <= 1 || arguments[1] === undefined ? 1000 : arguments[1];
                var easing = arguments.length <= 2 || arguments[2] === undefined ? 'cubic' : arguments[2];

                var _this = this;
                var id = uid();
                if (pos < 0) pos = 0;

                var startPosition = this.scrollTop;
                var distance = pos - startPosition;

                function callback(t) {
                    var y = startPosition + distance * ease(easing, t);
                    _this.scrollTop = y;
                    _this.trigger('scroll', { top: y, id: id });
                }

                this.trigger('scrollStart');
                var animation = animate(callback, time);

                // Cancel animation if something else triggers scroll event
                // this.one('scroll', function(x) {  if (x.id !== id) animation.cancel(); });
                // this.one('touchStart', function() { animation.cancel(); });
            }
        }, {
            key: 'scrollBy',
            value: function scrollBy(distance) {
                var time = arguments.length <= 1 || arguments[1] === undefined ? 1000 : arguments[1];
                var easing = arguments.length <= 2 || arguments[2] === undefined ? 'cubic' : arguments[2];

                this.scrollTo(this.scrollTop + distance, time, easing);
            }

            // -------------------------------------------------------------------------
            // Styles

        }, {
            key: 'css',
            value: function css(props) {
                var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                if (value == null) {
                    if (typeof props === 'string') {
                        return window.getComputedStyle(this._el, null).getPropertyValue(props);
                    } else {
                        for (var _p in props) {
                            this._el.style[toCamelCase(_p)] = props[_p];
                        }
                    }
                } else {
                    this._el.style[toCamelCase(props)] = value;
                }
            }
        }, {
            key: 'transition',
            value: function transition(property) {
                var duration = arguments.length <= 1 || arguments[1] === undefined ? '1s' : arguments[1];
                var curve = arguments.length <= 2 || arguments[2] === undefined ? 'ease-in-out' : arguments[2];

                if (arguments.length === 0) return this._el.style[Browser.prefix('transition')];
                if (typeof duration !== 'string') duration = duration + 'ms';
                this._el.style[Browser.prefix('transition')] = property + ' ' + duration + ' ' + curve;
            }
        }, {
            key: 'translate',
            value: function translate(x, y) {
                x = Math.round(+x || 0);
                y = Math.round(+y || 0);
                this._el.style[Browser.prefix('transform')] = 'translate(' + x + 'px,' + y + 'px)';
            }
        }, {
            key: 'translateX',
            value: function translateX(x) {
                x = Math.round(+x || 0);
                this._el.style[Browser.prefix('transform')] = 'translate(' + x + 'px,0)';
            }
        }, {
            key: 'translateY',
            value: function translateY(y) {
                y = Math.round(+y || 0);
                this._el.style[Browser.prefix('transform')] = 'translate(0px,' + y + 'px)';
            }
        }, {
            key: 'hide',
            value: function hide() {
                this.css('display', 'none');
                this.css('visibility', 'hidden');
            }
        }, {
            key: 'show',
            value: function show() {
                this.css('display', 'block');
                this.css('visibility', 'visible');
            }
        }, {
            key: 'transitionEnd',
            value: function transitionEnd(fn) {
                this.one('webkitTransitionEnd transitionend', fn);
            }
        }, {
            key: 'animationEnd',
            value: function animationEnd(fn) {
                this.one('webkitAnimationEnd animationend', fn);
            }

            // -------------------------------------------------------------------------
            // DOM Manipulation

            // Removes an element from the DOM for more performant node manipulation.
            // The element is placed back into the DOM at the place it was taken from.

        }, {
            key: 'manipulate',
            value: function manipulate(fn) {
                var next = this._el.nextSibling;
                var parent = this._el.parentNode;
                var frag = document.createDocumentFragment();
                frag.appendChild(this._el);
                var returned = fn.call(this) || this._el;
                if (next) {
                    parent.insertBefore(returned, next);
                } else {
                    parent.appendChild(returned);
                }
            }
        }, {
            key: 'is',
            value: function is(selector) {
                if (elementMatches) return elementMatches.call(this._el, selector);
                return [].indexOf.call(document.querySelectorAll(selector), this._el) > -1;
            }
        }, {
            key: 'index',
            value: function index() {
                var i = 0;
                var child = this._el;
                while ((child = child.previousSibling) !== null) {
                    ++i;
                }return i;
            }
        }, {
            key: 'prepend',
            value: function prepend(newChild) {
                var children = this._el.childNodes;

                if (typeof newChild === 'string') {
                    var newChildren = $$N(newChild);
                    for (var j = newChildren.length - 1; j >= 0; --j) {
                        this._el.insertBefore(newChildren[j], this._el.childNodes[0]);
                    }
                } else {
                    if (children.length) {
                        this._el.insertBefore(newChild._el, children[0]);
                    } else {
                        this._el.appendChild(newChild._el);
                    }
                }
            }
        }, {
            key: 'append',
            value: function append(newChild) {
                if (typeof newChild === 'string') {
                    var newChildren = $$N(newChild);
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = newChildren[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var c = _step10.value;
                            this._el.appendChild(c._el);
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
                            }
                        }
                    }
                } else {
                    this._el.appendChild(newChild._el);
                }
            }
        }, {
            key: 'insertBefore',
            value: function insertBefore(newChild) {
                var parent = this.parent;

                if (typeof newChild === 'string') {
                    var newChildren = $$N(newChild);
                    for (var j = newChildren.length - 1; j >= 0; --j) {
                        parent._el.insertBefore(newChildren[j]._el, this._el);
                    }
                } else {
                    parent._el.insertBefore(newChild._el, this._el);
                }
            }
        }, {
            key: 'insertAfter',
            value: function insertAfter(newChild) {
                var parent = this.parent;

                if (typeof newChild === 'string') {
                    var newChildren = $$N(newChild);
                    var _iteratorNormalCompletion11 = true;
                    var _didIteratorError11 = false;
                    var _iteratorError11 = undefined;

                    try {
                        for (var _iterator11 = newChildren[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                            var c = _step11.value;
                            parent._el.insertAfter(this._el, c._el);
                        }
                    } catch (err) {
                        _didIteratorError11 = true;
                        _iteratorError11 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                _iterator11.return();
                            }
                        } finally {
                            if (_didIteratorError11) {
                                throw _iteratorError11;
                            }
                        }
                    }
                } else {
                    var next = this._el.nextSibling;
                    if (next) {
                        parent._el.insertBefore(newChild._el, next);
                    } else {
                        parent._el.appendChild(newChild._el);
                    }
                }
            }
        }, {
            key: 'wrap',
            value: function wrap(wrapper) {
                if (typeof wrapper === 'string') wrapper = $N$1(wrapper);
                this.insertBefore(wrapper);
                this.detach();
                wrapper.append(this);
                return wrapper;
            }
        }, {
            key: 'moveTo',
            value: function moveTo(newParent) {
                var before = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                this.detach();
                if (before) {
                    newParent.prepend(this);
                } else {
                    newParent.append(this);
                }
            }
        }, {
            key: 'find',
            value: function find(selector) {
                return $(selector, this);
            }
        }, {
            key: 'findAll',
            value: function findAll(selector) {
                return $$(selector, this);
            }
        }, {
            key: 'parents',
            value: function parents(selector) {
                var result = [];
                var parent = this.parent;
                while (parent) {
                    if (!selector || parent.is(selector)) result.push(parent);
                    parent = parent.parent;
                }
                return result;
            }
        }, {
            key: 'hasParent',
            value: function hasParent($p) {
                var parent = this._el.parentNode;
                while (parent) {
                    if (parent === $p._el) return true;
                    parent = parent.parentNode;
                }
                return false;
            }
        }, {
            key: 'children',
            value: function children(selector) {
                var childNodes = this._el.children;

                if (!childNodes) {
                    var nodes = this._el.childNodes;
                    return Array.from(nodes).filter(function (n) {
                        return !n.data || n.data.trim();
                    }).map(function (n) {
                        return $(n);
                    });
                } else if (typeof selector === 'number') {
                    return $(childNodes[selector]);
                } else if (selector == null) {
                    return Array.from(childNodes, function (n) {
                        return $(n);
                    });
                } else {
                    return Array.from(childNodes, function (n) {
                        return $(n);
                    }).filter(function ($n) {
                        return $n.is(selector);
                    });
                }
            }
        }, {
            key: 'detach',
            value: function detach() {
                if (this._el && this._el.parentNode) this._el.parentNode.removeChild(this._el);
            }
        }, {
            key: 'remove',
            value: function remove() {
                this.detach();
                this._el = null;
            }
        }, {
            key: 'clear',
            value: function clear() {
                while (this._el.firstChild) {
                    this._el.removeChild(this._el.firstChild);
                }
            }
        }, {
            key: 'replace',
            value: function replace(newEl) {
                this.insertAfter(newEl);
                this.remove();
            }
        }, {
            key: 'applyTemplate',
            value: function applyTemplate($template) {
                if (!$template) throw new Error('Template not found');
                this.clear();
                var clone = document.importNode($template._el.content, true);
                this._el.appendChild(clone);
            }

            // -------------------------------------------------------------------------
            // Events

        }, {
            key: 'on',
            value: function on(type) {
                var fn = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                if (fn != null) {
                    var _iteratorNormalCompletion12 = true;
                    var _didIteratorError12 = false;
                    var _iteratorError12 = undefined;

                    try {
                        for (var _iterator12 = words(type)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                            var e = _step12.value;
                            createEvent(this, e, fn, useCapture);
                        }
                    } catch (err) {
                        _didIteratorError12 = true;
                        _iteratorError12 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                _iterator12.return();
                            }
                        } finally {
                            if (_didIteratorError12) {
                                throw _iteratorError12;
                            }
                        }
                    }
                } else {
                    for (var e in type) {
                        createEvent(this, e, type[e]);
                    }
                }
            }
        }, {
            key: 'one',
            value: function one(events, fn) {
                var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                var _this = this;
                function callback() {
                    _this.off(events, callback, useCapture);
                    fn(events, fn, useCapture);
                }
                this.on(events, callback, useCapture);
            }
        }, {
            key: 'off',
            value: function off(type, fn) {
                var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
                var _iteratorNormalCompletion13 = true;
                var _didIteratorError13 = false;
                var _iteratorError13 = undefined;

                try {
                    for (var _iterator13 = words(type)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                        var e = _step13.value;
                        removeEvent(this, e, fn, useCapture);
                    }
                } catch (err) {
                    _didIteratorError13 = true;
                    _iteratorError13 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion13 && _iterator13.return) {
                            _iterator13.return();
                        }
                    } finally {
                        if (_didIteratorError13) {
                            throw _iteratorError13;
                        }
                    }
                }
            }
        }, {
            key: 'trigger',
            value: function trigger(events) {
                var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                var _iteratorNormalCompletion14 = true;
                var _didIteratorError14 = false;
                var _iteratorError14 = undefined;

                try {
                    for (var _iterator14 = words(events)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                        var e = _step14.value;

                        if (!this._events[e]) return;
                        var _iteratorNormalCompletion15 = true;
                        var _didIteratorError15 = false;
                        var _iteratorError15 = undefined;

                        try {
                            for (var _iterator15 = this._events[e][Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                                var fn = _step15.value;
                                fn.call(this, args);
                            }
                        } catch (err) {
                            _didIteratorError15 = true;
                            _iteratorError15 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion15 && _iterator15.return) {
                                    _iterator15.return();
                                }
                            } finally {
                                if (_didIteratorError15) {
                                    throw _iteratorError15;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError14 = true;
                    _iteratorError14 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
                            _iterator14.return();
                        }
                    } finally {
                        if (_didIteratorError14) {
                            throw _iteratorError14;
                        }
                    }
                }
            }
        }, {
            key: 'onKeyDown',
            value: function onKeyDown(keys, fn) {
                keys = words(keys).map(function (k) {
                    return Browser.keyCodes[k] || k;
                });
                this._el.addEventListener('keydown', function (e) {
                    if (keys.indexOf(e.keyCode) >= 0) fn(e);
                });
            }

            // let evt = document.createEvent('Event');
            // evt.initEvent(eventName, true, true);
            // evt.detail = eventData;
            // this.$el.dispatchEvent(evt);

            // -------------------------------------------------------------------------
            // Bindings

        }, {
            key: 'toggleClick',
            value: function toggleClick(observable, property, callback) {
                observable.watch(property, callback);
                this.on('click', function () {
                    observable[property] = !observable[property];
                });
            }
        }, {
            key: 'model',
            value: function model(state) {
                var noIterate = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                bind(this._el, state, noIterate);
            }

            // -------------------------------------------------------------------------
            // Animations

        }, {
            key: 'animate',
            value: function animate(properties) {
                return transitionElement(this, properties);
            }
        }, {
            key: 'enter',
            value: function enter(time, type, delay) {
                return _enter(this, time, type, delay);
            }
        }, {
            key: 'exit',
            value: function exit(time, type, delay) {
                return _exit(this, time, type, delay);
            }
        }, {
            key: 'effect',
            value: function effect(type) {
                _effect(this, type);
            }
        }, {
            key: 'fadeIn',
            value: function fadeIn(time) {
                return _enter(this, time, 'fade');
            }
        }, {
            key: 'fadeOut',
            value: function fadeOut(time) {
                return _exit(this, time, 'fade');
            }
        }, {
            key: 'slideUp',
            value: function slideUp(t) {
                return this.animate({ css: 'height', to: 0, duration: t });
            }
        }, {
            key: 'slideDown',
            value: function slideDown(t) {
                var _this3 = this;

                var h = this.children(0).outerHeight; // TODO make more generic
                var a = this.animate({ css: 'height', to: h + 'px', duration: t });
                a.then(function () {
                    _this3.css('height', 'auto');
                });
                return a;
            }
        }, {
            key: 'sticky',
            value: function sticky(bounds) {
                // TODO sticky bottom
                // TODO remove body scroll events on destroy

                var _this = this;
                var isSticky = undefined;
                var offset = this.positionTop;

                var $placeholder = $N$1('div', { style: 'height: ' + this.height + 'px; display: none;' });
                this.insertAfter($placeholder);

                function position(_ref2) {
                    var top = _ref2.top;

                    var shouldStick = offset - top < bounds.top;

                    if (shouldStick && !isSticky) {
                        isSticky = true;
                        _this.addClass('sticky-top');
                        $placeholder.show();
                    } else if (!shouldStick && isSticky) {
                        isSticky = false;
                        _this.removeClass('sticky-top');
                        $placeholder.hide();
                    }
                }

                $body.on('scroll', position);

                Browser.resize(function () {
                    // TODO what if already sticky?
                    // offset = this.positionTop;
                    position({ top: $body.scrollTop });
                });
            }

            // -------------------------------------------------------------------------
            // SVG Methods

            // TODO caching for this._data._points

        }, {
            key: 'addPoint',
            value: function addPoint(p) {
                var d = this.attr('d') + ' L ' + p.x + ',' + p.y;
                this.attr('d', d);
            }

            // -------------------------------------------------------------------------
            // Cursor and Selections

        }, {
            key: 'id',
            get: function get() {
                return this._el.id;
            }
        }, {
            key: 'value',
            get: function get() {
                return this._el.value;
            },
            set: function set(v) {
                this._el.value = v;
            }
        }, {
            key: 'html',
            get: function get() {
                return this._el.innerHTML;
            },
            set: function set(h) {
                this._el.innerHTML = h;
            }
        }, {
            key: 'text',
            get: function get() {
                return this._el.textContent;
            },
            set: function set(t) {
                this._el.textContent = t;
            }
        }, {
            key: 'action',
            get: function get() {
                return this._el.action;
            }
        }, {
            key: 'formData',
            get: function get() {
                var data = {};
                var els = this._el.elements; // TODO array from
                for (var i = 0; i < els.length; ++i) {
                    data[els[i].name || els[i].id] = els[i].value;
                }
                return data;
            }
        }, {
            key: 'bounds',
            get: function get() {
                return this._el.getBoundingClientRect();
            }
        }, {
            key: 'offsetTop',
            get: function get() {
                return this._el.offsetTop;
            }
        }, {
            key: 'offsetLeft',
            get: function get() {
                return this._el.offsetLeft;
            }

            // Includes border and padding

        }, {
            key: 'width',
            get: function get() {
                if (this._isWindow) return window.innerWidth;
                // TODO see https://www.chromestatus.com/features/5724912467574784
                if (this._el instanceof SVGElement) return this.bounds.width;
                return this._el.offsetWidth;
            }
        }, {
            key: 'height',
            get: function get() {
                if (this._isWindow) return window.innerHeight;
                // TODO see https://www.chromestatus.com/features/5724912467574784
                if (this._el instanceof SVGElement) return this.bounds.height;
                return this._el.offsetHeight;
            }

            // Doesn't include border and padding

        }, {
            key: 'innerWidth',
            get: function get() {
                if (this._isWindow) return window.innerWidth;
                return this._el.clientWidth - cssN(this, 'padding-left') - cssN(this, 'padding-right');
            }
        }, {
            key: 'innerHeight',
            get: function get() {
                if (this._isWindow) return window.innerHeight;
                return this._el.clientHeight - cssN(this, 'padding-bottom') - cssN(this, 'padding-top');
            }

            // Includes Margins

        }, {
            key: 'outerWidth',
            get: function get() {
                if (this._isWindow) return window.outerWidth;
                return this._el.offsetWidth + cssN(this, 'margin-right') + cssN(this, 'margin-left');
            }
        }, {
            key: 'outerHeight',
            get: function get() {
                if (this._isWindow) return window.outerHeight;
                return this._el.offsetHeight + cssN(this, 'margin-top') + cssN(this, 'margin-bottom');
            }
        }, {
            key: 'positionTop',
            get: function get() {
                var element = this;
                var offset = 0;

                do {
                    offset += element.offsetTop;
                } while (element = element.offsetParent);

                return offset;
            }
        }, {
            key: 'positionLeft',
            get: function get() {
                var element = this;
                var offset = 0;

                do {
                    offset += element.offsetLeft;
                } while (element = element.offsetParent);

                return offset;
            }
        }, {
            key: 'scrollWidth',
            get: function get() {
                return this._isWindow ? $body._el.scrollWidth : this._el.scrollWidth;
            }
        }, {
            key: 'scrollHeight',
            get: function get() {
                return this._isWindow ? $body._el.scrollHeight : this._el.scrollHeight;
            }
        }, {
            key: 'scrollTop',
            get: function get() {
                return this._isWindow ? window.pageYOffset : this._el.scrollTop;
            },
            set: function set(y) {
                if (this._isWindow) {
                    document.body.scrollTop = document.documentElement.scrollTop = y;
                } else {
                    this._el.scrollTop = y;
                }
                this.trigger('scroll', { top: y, left: this.scrollLeft });
            }
        }, {
            key: 'scrollLeft',
            get: function get() {
                return this._isWindow ? window.pageXOffset : this._el.scrollLeft;
            },
            set: function set(x) {
                if (this._isWindow) {
                    document.body.scrollLeft = document.documentElement.scrollLeft = x;
                } else {
                    this._el.scrollLeft = x;
                }
                this.trigger('scroll', { top: this.scrollTop, left: x });
            }
        }, {
            key: 'strokeLength',
            get: function get() {
                if ('getTotalLength' in this._el) {
                    return this._el.getTotalLength();
                } else {
                    var dim = this.bounds;
                    return 2 * dim.height + 2 * dim.width;
                }
            }
        }, {
            key: 'transform',
            get: function get() {
                // window.getComputedStyle(this._el).getPropertyValue(Browser.prefix('transform'));
                return this._el.style[Browser.prefix('transform')].replace('none', '');
            },
            set: function set(transform) {
                this._el.style[Browser.prefix('transform')] = transform;
            }
        }, {
            key: 'transformMatrix',
            get: function get() {
                var transform = window.getComputedStyle(this._el).getPropertyValue(Browser.prefix('transform'));
                if (!transform || transform === 'none') return null;

                var coords = transform.match(/matrix\(([0-9\,\.\s]*)\)/);
                if (!coords[1]) return null;

                var matrix = coords[1].split(',');
                return [[+matrix[0], +matrix[1]], [+matrix[2], +matrix[3]]];
            }
        }, {
            key: 'scale',
            get: function get() {
                var matrix = this.transformMatrix;
                return matrix ? [matrix[0][0], matrix[1][1]] : [1, 1];
            }
        }, {
            key: 'next',
            get: function get() {
                var next = this._el.nextSibling;
                return next ? $(next) : null;
            }
        }, {
            key: 'prev',
            get: function get() {
                var prev = this._el.previousSibling;
                return prev ? $(prev) : null;
            }
        }, {
            key: 'parent',
            get: function get() {
                var parent = this._el.parentNode;
                return parent ? $(parent) : null;
            }
        }, {
            key: 'offsetParent',
            get: function get() {
                var parent = this._el.offsetParent;
                return parent ? $(parent) : null;
            }
        }, {
            key: 'siblings',
            get: function get() {
                var siblings = [];
                var el = this._el.parentNode.firstChild;
                do {
                    siblings.push($(el));
                } while (el = el.nextSibling);
                return siblings;
            }
        }, {
            key: 'childNodes',
            get: function get() {
                var childNodes = this._el.childNodes;
                return Array.from(childNodes, function (n) {
                    return $(n);
                });
            }
        }, {
            key: 'points',
            get: function get() {
                var points = this._el.attr('d').replace('M', '').split('L');
                return points.map(function (x) {
                    var p = x.split(',');
                    return { x: p[0], y: p[1] };
                });
            },
            set: function set(p) {
                var d = p.length ? 'M' + p.map(function (x) {
                    return x.x + ',' + x.y;
                }).join('L') : '';
                this.attr('d', d);
            }
        }, {
            key: 'cursor',
            get: function get() {
                if (!window.getSelection) return 0;

                var sel = window.getSelection();

                if (sel.rangeCount > 0) {
                    var range = sel.getRangeAt(0);
                    var preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(this._el);
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    return preCaretRange.toString().length;
                }
            },
            set: function set(offset) {
                var parents = [this._el];
                var node = this._el.childNodes[0];

                while (node) {
                    // Elements like <span> have further children
                    if (node.childNodes.length) {
                        parents.push(node);
                        node = node.childNodes[0];

                        // Text Node
                    } else if (offset > node.length) {
                            offset -= node.length;
                            node = node.nextSibling || parents.pop().nextSibling;

                            // Final Text Node
                        } else {
                                var range = document.createRange();
                                range.setStart(node, offset);
                                range.collapse(true);
                                var sel = window.getSelection();
                                sel.removeAllRanges();
                                sel.addRange(range);
                                return;
                            }
                }
            }
        }]);

        return Element;
    }();

    // -----------------------------------------------------------------------------
    // Element Selectors

    var svgTags = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'g', 'defs', 'marker', 'line', 'text', 'pattern', 'mask', 'svg'];

    var _doc = { _el: document };

    function $(selector) {
        var context = arguments.length <= 1 || arguments[1] === undefined ? _doc : arguments[1];

        if (typeof selector === 'string') selector = context._el.querySelector(selector);

        if (selector instanceof Node || selector === window) return selector._el || new Element(selector);

        return null;
    }

    function $T(selector) {
        var context = arguments.length <= 1 || arguments[1] === undefined ? _doc : arguments[1];

        var els = context._el.getElementsByTagName(selector);
        return els.length ? new Element(els[0]) : null;
    }

    function $$(selector) {
        var context = arguments.length <= 1 || arguments[1] === undefined ? _doc : arguments[1];

        var els = context._el.querySelectorAll(selector);
        return Array.from(els, function (el) {
            return new Element(el);
        });
    }

    // -----------------------------------------------------------------------------
    // Element Constructors

    function $N$1(tag) {
        var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var parent = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        var t = svgTags.indexOf(tag) < 0 ? document.createElement(tag) : document.createElementNS('http://www.w3.org/2000/svg', tag);

        for (var a in attributes) {
            if (a === 'id') {
                t.id = attributes.id;
            } else if (a === 'html') {
                t.innerHTML = attributes.html;
            } else {
                t.setAttribute(a, attributes[a]);
            }
        }

        var $el = new Element(t);
        if (parent) parent.append($el);
        return $el;
    }

    function $$N(html) {
        var tempDiv = $N$1('div', { html: html });
        return tempDiv.children();
    }

    // -----------------------------------------------------------------------------
    // Special Elements

    var $body = new Element(document.body);
    var $html = $T('html');
    var $window = new Element(window);
    var $doc = new Element(window.document.documentElement);

    // ---------------------------------------------------------------------------------------------
    // Utilities

    var browserEvents = new Evented();
    var ua = window.navigator.userAgent;
    var mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

    function redraw() {
        document.body.offsetHeight; /* jshint ignore:line */
    }

    // ---------------------------------------------------------------------------------------------
    // Resize Events

    var width = window.innerWidth;
    var height = window.innerHeight;

    window.onresize = throttle(function () {
        var newWidth = window.innerWidth;
        var height = window.innerHeight;
        if (width === newWidth && width < 800 && height < 800) return;
        width = newWidth;
        browserEvents.trigger('resize', { width: width, height: height });
        // $body.trigger('scroll', { top: $body.scrollTop });
    }, 100);

    function resize() {
        var fn = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        if (fn) {
            browserEvents.on('resize', fn);
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
            browserEvents.trigger('resize', { width: width, height: height });
        }
    }

    setTimeout(resize);

    // ---------------------------------------------------------------------------------------------
    // Load Events

    var loadQueue = [];
    var loaded = false;

    function afterLoad() {
        loaded = true;
        var _iteratorNormalCompletion16 = true;
        var _didIteratorError16 = false;
        var _iteratorError16 = undefined;

        try {
            for (var _iterator16 = loadQueue[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                var fn = _step16.value;
                fn();
            }
        } catch (err) {
            _didIteratorError16 = true;
            _iteratorError16 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion16 && _iterator16.return) {
                    _iterator16.return();
                }
            } finally {
                if (_didIteratorError16) {
                    throw _iteratorError16;
                }
            }
        }
    }

    window.onload = function () {
        if (!loaded) afterLoad();
        resize();
    };

    document.addEventListener('DOMContentLoaded', function () {
        resize();
        if (!loaded) afterLoad();
    });

    function ready(fn) {
        if (loaded) {
            fn();
        } else {
            loadQueue.push(fn);
        }
    }

    // ---------------------------------------------------------------------------------------------
    // CSS

    function cssTimeToNumber(cssTime) {
        var regex = /^([\-\+]?[0-9]+(\.[0-9]+)?)(m?s)$/;
        var matches = regex.exec(cssTime.trim());
        if (matches === null) return null;
        return +matches[1] * (matches[3] === 's' ? 1000 : 1);
    }

    function addCSS(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function addCSSRule(selector, rules) {
        var css = document.styleSheets[document.styleSheets.length - 1];
        var index = css.cssRules.length - 1;
        if (css.insertRule) {
            css.insertRule(selector + '{' + rules + '}', index);
        } else {
            css.addRule(selector, rules, index);
        }
    }

    var prefixes = ['webkit', 'Moz', 'ms', 'O'];
    var style = document.createElement('div').style;

    var prefix = cache(function (name, dashes) {
        var rule = toCamelCase(name);
        if (style[rule] != null) return dashes ? name : rule;

        rule = rule.toTitleCase();
        for (var i = 0; i < prefixes.length; ++i) {
            if (style[prefixes[i] + rule] != null) return dashes ? '-' + prefixes[i].toLowerCase() + '-' + name : prefixes[i] + rule;
        }
    });

    // ---------------------------------------------------------------------------------------------
    // Cookies TODO

    function getCookies() {
        // FIXME
        var pairs = document.cookie.split(';');
        var result = {};
        for (var i = 0, n = pairs.length; i < n; ++i) {
            var pair = pairs[i].split('=');
            pair[0] = pair[0].replace(/^\s+|\s+$/, '');
            result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return result;
    }

    function getCookie(name) {
        var v = document.cookie.match(new RegExp('(^|;) ?' + name + '=([^;]*)(;|$)'));
        return v ? v[2] : null;
    }

    function setCookie(name, value) {
        var maxAge = arguments.length <= 2 || arguments[2] === undefined ? 60 * 60 * 24 * 365 : arguments[2];

        document.cookie = name + '=' + value + ';path=/;max-age=' + maxAge;
    }

    function deleteCookie(name) {
        setCookie(name, '', -1);
    }

    // ---------------------------------------------------------------------------------------------
    // Storage

    var STORAGE_KEY = '_M';

    function setStorage(key, value) {
        var keys = (key || '').split('.');
        var storage = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
        var path = storage;

        for (var i = 0; i < keys.length - 1; ++i) {
            if (path[keys[i]] == null) path[keys[i]] = {};
            path = path[keys[i]];
        }

        path[keys[keys.length - 1]] = value;
        window.localStorage.setItem('M', JSON.stringify(storage));
    }

    function getStorage(key) {
        var keys = (key || '').split('.');
        var storage = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
        var path = storage;

        for (var i = 0; i < keys.length - 1; ++i) {
            if (path[keys[i]] == null) return null;
            path = path[keys[i]];
        }

        return key ? path[keys[keys.length - 1]] : path;
    }

    function deleteStorage(key) {
        if (key) {
            setStorage(key, null);
        } else {
            window.localStorage.setItem(STORAGE_KEY, '');
        }
    }

    // -----------------------------------------------------------------------------
    // Keyboard Events

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pause: 19,
        capslock: 20,
        escape: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        'delete': 46
    };

    function activeInput() {
        var active = document.activeElement;
        return active === document.body ? undefined : active;
    }

    // Executes fn if any one of [keys] is pressed
    function onKey(keys, fn) {
        keys = words(keys).map(function (k) {
            return keyCodes[k] || k;
        });
        document.addEventListener('keydown', function (e) {
            if (activeInput()) return;
            if (keys.indexOf(e.keyCode) >= 0) fn(e);
        });
    }

    // Executes fn1 if key1 is pressed, and fn2 if key2 is aready pressed
    function onMultiKey(key1, key2, fn1, fn2) {
        var key2down = false;

        key1 = keyCodes[key1] || key1;
        key2 = keyCodes[key2] || key2;

        document.addEventListener('keydown', function (e) {
            if (activeInput()) return;
            var k = e.keyCode;

            if (k === key2) {
                key2down = true;
            } else if (key2down && k === key1) {
                fn2(e);
            } else if (k === key1) {
                fn1(e);
            }
        });

        document.addEventListener('keyup', function (e) {
            var k = e.keyCode;
            if (k === key2) key2down = false;
        });
    }

    // -----------------------------------------------------------------------------
    // Visibility API

    var isOldWebkit = !('hidden' in document) && 'webkitHidden' in document;
    var visibilityProperty = isOldWebkit ? 'webkitHidden' : 'hidden';
    var visibilityEvent = isOldWebkit ? 'webkitvisibilitychange' : 'visibilitychange';

    document.addEventListener(visibilityEvent, function () {
        browserEvents.trigger(document[visibilityProperty] ? 'focus' : 'blur');
    });

    // ---------------------------------------------------------------------------------------------

    var Browser = {
        isMobile: mobileRegex.test(navigator.userAgent.toLowerCase()),
        isRetina: (window.devicePixelRatio || 1) > 1,
        isTouch: 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch,
        isChrome: window.chrome,
        isIE: ua.indexOf('MSIE') >= 0 || ua.indexOf('Trident') >= 0,

        redraw: redraw, ready: ready, resize: resize, cssTimeToNumber: cssTimeToNumber, addCSS: addCSS, addCSSRule: addCSSRule, prefix: prefix,

        on: browserEvents.on.bind(browserEvents),
        off: browserEvents.off.bind(browserEvents),
        trigger: browserEvents.trigger.bind(browserEvents),

        get width() {
            return width;
        },
        get height() {
            return height;
        },

        get cookies() {
            return getCookies();
        },
        getCookie: getCookie, setCookie: setCookie, deleteCookie: deleteCookie,
        setStorage: setStorage, getStorage: getStorage, deleteStorage: deleteStorage,

        get activeInput() {
            return activeInput();
        },
        keyCodes: keyCodes, onKey: onKey, onMultiKey: onMultiKey
    };

    Browser.ready(function () {

        var $content = $('#body');
        var $sidebar = $('.sidebar');
        var $sidebarWrap = $('.sidebar-wrap');
        var $sidebarTopicWrap = undefined;
        var $sidebarActive = undefined;
        var $sidebarActiveBox = undefined;

        var positions = [];
        var bodyTop = undefined;

        Browser.resize(function () {
            bodyTop = $content.offsetTop - 50;
            positions = [];
        });

        $('#api').findAll('h1, h3').forEach(function ($el) {
            var $sidebarEl = undefined;
            var $topicWrap = undefined;
            var top = undefined;

            if ($el.is('h1')) {
                $sidebarEl = $N$1('div', { class: 'sidebar-h2', html: $el.text }, $sidebarWrap);
                $sidebarTopicWrap = $topicWrap = $N$1('div', { style: 'display: none' }, $sidebarWrap);
            } else {
                $sidebarEl = $N$1('div', { class: 'sidebar-h3', html: $el.text }, $sidebarTopicWrap);
                $topicWrap = $sidebarTopicWrap;
            }

            Browser.resize(function () {
                top = $el.offsetTop;
                positions.push([top, $sidebarEl, $topicWrap]);
            });

            $sidebarEl.on('click', function () {
                $body.scrollTo(top - 75, 1000);
            });
        });

        function getActive(s) {
            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
                for (var _iterator17 = positions[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                    var _p2 = _step17.value;
                    if (_p2[0] > s) return _p2;
                }
            } catch (err) {
                _didIteratorError17 = true;
                _iteratorError17 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion17 && _iterator17.return) {
                        _iterator17.return();
                    }
                } finally {
                    if (_didIteratorError17) {
                        throw _iteratorError17;
                    }
                }
            }
        }

        $body.on('scroll', function (_ref3) {
            var top = _ref3.top;

            console.log('scroll', top, bodyTop);
            $sidebar.setClass('fixed', top > bodyTop);
            var active = getActive(top);

            if (active[1] !== $sidebarActive) {
                if ($sidebarActive) $sidebarActive.removeClass('active');
                $sidebarActive = active[1];
                $sidebarActive.addClass('active');
            }

            if (active[2] !== $sidebarActiveBox) {
                if ($sidebarActiveBox) $sidebarActiveBox.hide();
                $sidebarActiveBox = active[2];
                if ($sidebarActiveBox) $sidebarActiveBox.show();
            }
        });

        Browser.resize();
    });
})();
