// |=======================================================================
// |  Class cX.Library
// |  -------------------
// |
// |  Description:
// |   Common JavaScript functions for cXense products
// |
// |
// |  Copyright 2010-2012 cXense AS
// |======================================================================

try {

var cX = cX || {};
cX.callQueue = cX.callQueue || [];
cX.eventReceiverBaseUrl = cX.eventReceiverBaseUrl || ('http' + (location.protocol == 'https:' ? 's://s' : '://') + 'comcluster.cxense.com/Repo/rep.html');
cX.eventReceiverBaseUrlGif = cX.eventReceiverBaseUrlGif || ('http' + (location.protocol == 'https:' ? 's://s' : '://') + 'comcluster.cxense.com/Repo/rep.gif');
cX.p1BaseUrl = cX.p1BaseUrl || (location.protocol == 'https:' ? 'https://scdn.cxense.com/sp1.html' : 'http://cdn.cxense.com/p1.html');
cX.backends = {
    production: {
        baseAdDeliveryUrl: 'http://adserver.cxad.cxense.com/adserver/search',
        secureBaseAdDeliveryUrl: 'https://s-adserver.cxad.cxense.com/adserver/search'
    },
    sandbox: {
        baseAdDeliveryUrl: 'http://adserver.sandbox.cxad.cxense.com/adserver/search',
        secureBaseAdDeliveryUrl: 'https://s-adserver.sandbox.cxad.cxense.com/adserver/search'
    }
};

if (!cX.Library) {

    cX.Library = function(accountId, siteId) {
        this.m_accountId = accountId;
        this.m_siteId = siteId;
        this.m_siteHostnames = new Object();
        this.add_siteHostname(location.hostname);
        this.m_prevLocationHash = location.hash;
        this.m_widgetSpecs = {};
        this.m_rnd = Math.round(Math.random() * 2147483647).toString(36) + Math.round(Math.random() * 2147483647).toString(36);
        this.m_customParameters = [];
        this.m_scriptStartTime = new Date().getTime();
        this.m_activityState = {
            prevActivityTime: this.m_scriptStartTime,
            exitLink: '',
            activeTime: 0,
            prevScreenX: 0,
            prevScreenY: 0,
            maxViewLeft: 0,
            maxViewTop: 0,
            prevScrollLeft: 0,
            prevScrollTop: 0,
            prevWindowWidth: 0,
            prevWindowHeight: 0
        };

        try {
            // Copy out previous visit state before it gets overwritten
            if (window.localStorage && window.localStorage.getItem) {
                this.m_atfr = window.localStorage.getItem('_cX_atfr');
                window.localStorage.removeItem('_cX_atfr');
            }
        } catch (e) {}

        try {
            // Parse the URL and forward matching parameters as custom parameters
            var allArgs = this.combineArgs(this.parseUrlArgs(), this.parseHashArgs()); // HashArgs overrides URL args
            var customParametersFromUrl = {};
            for (var arg in allArgs) {
                if (allArgs.hasOwnProperty(arg) && arg.indexOf('cx_') === 0) {
                    customParametersFromUrl[arg.substr(3)] = allArgs[arg];
                }
            }
            this.setCustomParameters(customParametersFromUrl);
        } catch (e) {}
    };

    cX.Library.prototype = {

        // Properties
        m_accountId: null,
        m_siteId: null,
        m_goalId: null,
        m_pageName: null,
        m_siteHostnames: null,
        m_prevLocationHash: null,
        m_pageViewReported: false,
        m_rnd: null,
        m_widgetSpecs: null,
        m_activityState: null,
        m_atfr: null,

        setSiteId: function(siteId) {
            this.m_siteId = siteId;
        },

        setAccountId: function(accountId) {
            this.m_accountId = accountId;
        },

        setCustomParameters: function(parameters, prefix) {
            if (typeof prefix === 'undefined') {
                prefix = '';
            }
            var key, value;
            for (key in parameters) {
                if (parameters.hasOwnProperty(key)) {
                    value = parameters[key];
                    // Use a maximum length of 20 the key and 20 for the value.
                    // The actual maximum length could be lower on the server
                    // side. See official API documentation for more details.
                    key = prefix + ('' + key).substring(0, 20);
                    if (typeof value === 'object' && typeof value.length === 'number') {
                        value = value.slice(0, 10);
                        for (var i = 0; i < value.length; i++) {
                            value[i] = ('' + value[i]).substring(0, 20);
                        }
                        value = value.sort().join(',');
                    } else {
                        value = ('' + value).substring(0, 20);
                    }
                    this.m_customParameters.push('cp_' + encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            }
        },

        setRetargetingParameters: function(parameters) {
            this.setCustomParameters(parameters, 't_');
        },

        setUserProfileParameters: function(parameters) {
            this.setCustomParameters(parameters, 'u_');
        },

        add_siteHostname: function(hostname) {
            try {
                this.m_siteHostnames[hostname] = true;
            }
            catch (e) { }
        },

        isSiteHost: function(hostname) {
            var retVal = false;
            if (this.m_siteHostnames[hostname])
                retVal = true;
            return retVal;
        },

        set_pageName: function(pageName) {
            try {
                this.m_pageName = pageName;
            }
            catch (e) { }
        },

        isInternalRequest: function() {
            try {
                return (null != navigator.userAgent.match(/cXense/i));
            }
            catch (e) {
                return false;
            }
        },

        isSafari: function() {
            try {
                return (navigator.userAgent.indexOf('Safari') > -1);
            }
            catch (e) {
                return false;
            }
        },

        isIE6Or7: function() {
            try {
                return navigator.appName === 'Microsoft Internet Explorer' && (navigator.userAgent.indexOf('MSIE 6.') > -1 || navigator.userAgent.indexOf('MSIE 7.') > -1);
            }
            catch (e) {
                return false;
            }
        },

        sendPageViewEvent: function() {

            // Don't skew the statistics.
            if (this.isInternalRequest()) {
                return;
            }

            // Don't send event on programmatic refresh
            try {
                if (document.location && document.referrer && (document.location != '') && (document.location == document.referrer)) {
                    return;
                }
            } catch (e) { }

            // Make sure we are not re-reporting the previous page view report.
            var pageView = this.m_accountId + '_' + this.m_siteId + '_' + window.location.href;
            if (this.m_previousPageViewReport !== pageView) {
                this.m_previousPageViewReport = pageView;

                if (document.images) {
                    var isNewUser = !(this.get_cookie('cX_P'));
                    var sessionCookie = this.get_sessionCookie();
                    var persistentCookie = this.get_persistentCookie();

                    var repSrc = cX.eventReceiverBaseUrl + '?ver=1&typ=pgv&rnd=' + this.m_rnd;
                    if (location.hostname.indexOf('.cxense.com') > -1 || location.hostname.indexOf('.cxpublic.com') > -1) {
                        var repSrc = cX.p1BaseUrl + '#ver=1&typ=pgv&rnd=' + this.m_rnd;
                    }
                    try { repSrc += '&acc=' + encodeURIComponent(this.m_accountId); } catch (e) { }
                    try { repSrc += '&sid=' + encodeURIComponent(this.m_siteId); } catch (e) { }
                    try { repSrc += '&loc=' + encodeURIComponent(location.href); } catch (e) { }
                    try { repSrc += '&ref=' + (document.referrer ? encodeURIComponent(document.referrer) : ''); } catch (e) { }
                    try { repSrc += '&gol=' + (this.m_goalId ? encodeURIComponent(this.m_goalId) : ''); } catch (e) { }
                    try { repSrc += '&pgn=' + (this.m_pageName ? encodeURIComponent(this.m_pageName) : ''); } catch (e) { }
                    try { repSrc += '&ltm=' + this.m_scriptStartTime; } catch (e) { }
                    try { repSrc += '&new=' + (isNewUser ? '1' : '0'); } catch (e) { }
                    try { repSrc += '&tzo=' + encodeURIComponent('' + new Date().getTimezoneOffset()); } catch (e) { }
                    try { repSrc += '&res=' + encodeURIComponent('' + window.screen.width + 'x' + window.screen.height); } catch (e) { }
                    try { repSrc += '&dpr=' + encodeURIComponent(typeof devicePixelRatio === 'undefined' ? '' : '' + devicePixelRatio); } catch (e) { }
                    try { repSrc += '&col=' + encodeURIComponent('' + window.screen.colorDepth); } catch (e) { }
                    try { repSrc += '&jav=' + (navigator.javaEnabled() ? '1' : '0'); } catch (e) { }
                    try { repSrc += '&bln=' + (navigator.browserLanguage ? encodeURIComponent(navigator.browserLanguage) : (navigator.language ? encodeURIComponent(navigator.language) : 'OO1OO')); } catch (e) { }
                    try { repSrc += '&cks=' + encodeURIComponent(sessionCookie); } catch (e) { }
                    try { repSrc += '&ckp=' + encodeURIComponent(persistentCookie); } catch (e) { }
                    try { repSrc += '&chs=' + encodeURIComponent(document.charset || ''); } catch (e) { }
                    try { var windowSize = this.getWindowSize();
                        repSrc += '&wsz=' + encodeURIComponent(windowSize.width + 'x' + windowSize.height); } catch (e) { }
                    if (this.m_customParameters.length > 0) {
                        repSrc += '&' + this.m_customParameters.join('&');
                    }
                    try { if (this.m_atfr) { repSrc += this.m_atfr; } this.m_atfr = null; } catch (e) { } // Only report once

                    // Flash detection
                    var flashVersion = '';
                    try {
                        var hasFlash = false;

                        var flashMimeTypeStr = 'application/x-shockwave-flash';
                        if (navigator.mimeTypes && navigator.mimeTypes[flashMimeTypeStr]) {
                            hasFlash = true;

                            try {
                                var flashMimeType = navigator.mimeTypes[flashMimeTypeStr];
                                if (flashMimeType.enabledPlugin && flashMimeType.enabledPlugin.description)
                                    flashVersion = flashMimeType.enabledPlugin.description;
                            }
                            catch (e) { flashVersion = ''; }
                        }
                        else if (navigator.plugins) {
                            try {
                                for (var i = 0; i < navigator.plugins.length; i++) {
                                    if (navigator.plugins[i].indexOf('Shockwave Flash') === 0) {
                                        hasFlash = true;
                                        break;
                                    }
                                }
                            } catch (e) { }
                        }
                        if (!hasFlash) {
                            try {
                                var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                                try { flashVersion = axo.GetVariable('$version'); }
                                catch (e) { flashVersion = ''; }
                                hasFlash = true;
                            } catch (e) { }
                        }

                        try { repSrc += '&fls=' + encodeURIComponent(hasFlash ? '1' : '0'); } catch (e) { }
                        try { repSrc += '&flv=' + encodeURIComponent(flashVersion); } catch (e) { }
                    } catch (e) { }

                    var iframeId = 'cx_rep_iframe_' + Math.random();
                    var repIFrame = document.createElement('iframe');
                    repIFrame.id = iframeId;
                    repIFrame.name = iframeId;
                    repIFrame.width = '1';
                    repIFrame.height = '1';
                    repIFrame.scrolling = 'no';
                    repIFrame.frameBorder = '0';

                    if (location.hostname.indexOf('.cxense.com') > -1 || location.hostname.indexOf('.cxpublic.com') > -1) {
                        repIFrame.src = repSrc;
                        repIFrame.style.display = 'none';

                        var cxRootEl = document.getElementById('cX-root');
                        if (cxRootEl) {
                            cxRootEl.appendChild(repIFrame);
                        } else {
                            document.body.appendChild(repIFrame);
                        }
                    } else {
                        if (!this.isSafari()) {
                            repIFrame.src = repSrc;
                        }

                        var repForm = document.createElement('form');
                        repForm.method = 'post';
                        repForm.target = iframeId;
                        repForm.action = repSrc;

                        var repDiv = document.createElement('div');
                        repDiv.style.display = 'none';
                        repDiv.appendChild(repIFrame);
                        repDiv.appendChild(repForm);

                        var cxRootEl = document.getElementById('cX-root');
                        if (cxRootEl) {
                            cxRootEl.appendChild(repDiv);
                        } else {
                            document.body.appendChild(repDiv);
                        }

                        if (this.isSafari()) {
                            repForm.submit();
                        }
                    }
                }
            }
        },

        onP1: function(scriptToken) {
            var repSrc = cX.eventReceiverBaseUrlGif + '?' + this.getHashFragment();
            repSrc += '&cst=' + encodeURIComponent(scriptToken);
            if (window.localStorage && typeof window.localStorage.getItem === 'function' && typeof window.localStorage.setItem === 'function') {
                var localStorageToken = window.localStorage.getItem('cX_lst');
                if (localStorageToken) {
                    repSrc += '&lst=' + encodeURIComponent(localStorageToken);
                } else {
                    window.localStorage.setItem('cX_lst', scriptToken);
                }
            }
            new Image().src = repSrc;
        },

        get_sessionCookie: function() {
            // Set cookies if not set
            var sessionCookie = this.get_cookie('cX_S');
            if (!sessionCookie) {
                sessionCookie = new Date().getTime() + new String(Math.round(Math.random() * 2147483647));
                this.set_cookie('cX_S', sessionCookie, '/');
            }
            return sessionCookie;
        },


        get_persistentCookie: function() {
            var persistentCookie = this.get_cookie('cX_P');
            if (!persistentCookie) {
                persistentCookie = new Date().getTime() + new String(Math.round(Math.random() * 2147483647));
                this.set_cookie('cX_P', persistentCookie, 365, '/');
            }
            return persistentCookie;
        },


        set_cookie: function(name, value, expires, path, domain, secure) {
            var today = new Date();
            today.setTime(today.getTime());

            if (expires) {
                expires = expires * 1000 * 60 * 60 * 24;
            }
            var expires_date = new Date(today.getTime() + (expires));

            document.cookie = name + '=' + escape(value) +
            ((expires) ? ';expires=' + expires_date.toGMTString() : '') +
            ((path) ? ';path=' + path : '') +
            ((domain) ? ';domain=' + domain : '') +
            ((secure) ? ';secure' : '');
        },


        get_cookie: function(check_name) {
            var a_all_cookies = document.cookie.split(';');
            var a_temp_cookie = '';
            var cookie_name = '';
            var cookie_value = '';
            var b_cookie_found = false;

            for (var i = 0; i < a_all_cookies.length; i++) {
                a_temp_cookie = a_all_cookies[i].split('=');

                cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

                if (cookie_name == check_name) {
                    b_cookie_found = true;
                    if (a_temp_cookie.length > 1) {
                        cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                    }
                    return cookie_value;
                    break;
                }

                a_temp_cookie = null;
                cookie_name = '';
            }

            if (!b_cookie_found) {
                return null;
            }
        },


        renderTemplate: function(templateElementId, targetElementId, data, context) {

            // Phase 1: Combine main template and nested templates
            var templateElement = document.getElementById(templateElementId);
            var templateHtml = ' ' + templateElement.innerHTML + ' ';
            var depth = 0;
            while (templateHtml.indexOf('<!--<') > -1) {
                var htmlReplaceFunc = function(str, p1, p2, offset, s) {
                    return document.getElementById(p1).innerHTML;
                }
                templateHtml = templateHtml.replace(/<!--<\s*"([^"]*)"\s*>-->/g, htmlReplaceFunc);
                depth++;
                if (depth > 40) { // Sanity check, break out of infinite template reference loops
                    break;
                }
            }

            // Phase 2: Invert the HTML with JavaScript to become a JavaScript function that writes HTML,
            // extracts values from local references, stores values to global variables and insert references
            // to the global variables.
            var code = '\nvar html = \'\';\n';
            code += 'var varPrefix = \'cXTmplMgck\' + Math.round(Math.random() * 2147483647).toString(36) + (new Date().getTime()).toString(36);\n';
            code += 'var varIndex = 0;\n';
            var parts = templateHtml.split('%-->');
            for (var i = 0; i < parts.length; i++) {
                var pair = parts[i].split('<!--%');
                var textPart = pair[0];
                if (cX.library.trim(textPart).length > 0) {
                    textPart = textPart.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/'/g, '\\\'');
                    if (textPart.indexOf('{{') > -1) {

                        // To avoid XSS, do not insert values before HTML is parsed, but rather extract values
                        // and store to global variables that can be references and replaced later.
                        code += 'var localText = \'' + textPart + '\';\n';
                        code += 'var replaceFunc = function (str, p1, p2, offset, s) {\n';
                        code += '    var varName = varPrefix + varIndex;\n';
                        code += '    varIndex++;\n';
                        code += '    window[varName] = eval(p1);\n';
                        code += '    return \'{{window[\\\'\' + varName + \'\\\']}}\';\n';
                        code += '}\n';
                        code += 'localText = localText.replace(/{{([^}]*)}}/g, replaceFunc);\n';
                        code += 'html += localText;\n';

                    } else {
                        code += 'html += \'' + textPart + '\';\n';
                    }
                }

                var codePart = '';
                if (pair.length > 1) {
                    codePart = cX.library.trim(pair[1]);
                }
                code += codePart + '\n';
            }
            code += 'return html;\n';
            var renderFunc = new Function('data', 'context', code);

            // Phase 3: Run the function to create the final HTML with only global variable references

            /**********************************************************************************
             * TIP: This is a good place to set a breakpoint when debugging inline JavaScript
             * template code. Set the breakpoint on the line below, and "step into" when the
             * debugger breaks here:
             **********************************************************************************/
            var renderedHtml = renderFunc(data, context); // <-- Set breakpoint here

            // Phase 4: Browser parses HTML and creates DOM elements
            var targetElement = document.getElementById(targetElementId);
            targetElement.innerHTML = renderedHtml;

            // Phase 5: Finish up DOM elements by replacing references to global variables with values and
            // moving attributes in the tmp: namespace out to the global namespace.

            // Process a node
            function processNode(node, searchResult, ad) {
                // Process attributes
                if (node.attributes && node.attributes.length && node.attributes.length > 0) {
                    var tmpAttrs = [];
                    for (var i = 0; i < node.attributes.length; i++) {
                        var attribute = node.attributes[i];
                        // IE8 (and lower) iterates over all supported attributes.
                        // We only want to look at attributes that are specified on this element.
                        if (typeof attribute.specified === 'undefined' || attribute.specified) {
                            processText(attribute);
                            if (attribute.nodeName.indexOf('tmp:') == 0) {
                                tmpAttrs[tmpAttrs.length] = attribute;
                            }
                        }
                    }
                    for (var j = 0; j < tmpAttrs.length; j++) {
                        var tmpAttribute = tmpAttrs[j];
                        var newName = tmpAttribute.nodeName.replace(/^tmp:/, '');
                        if (newName === 'style') {
                            node.style.cssText = tmpAttribute.nodeValue;
                        } else if (newName === 'class') {
                            node.className = tmpAttribute.nodeValue;
                        } else {
                            node[newName] = tmpAttribute.nodeValue;
                        }
                        // Remove old, if possible (not really necessary)
                        try { if (node.removeAttribute) { node.removeAttribute(tmpAttribute.nodeName); } } catch (e) { }
                    }
                }
                // Process text nodes
                if (node.nodeName.toLowerCase() == '#text') {
                    processText(node);
                }
                // Process child elements
                if (node.childNodes && node.childNodes.length && node.childNodes.length > 0) {
                    for (var k = 0; k < node.childNodes.length; k++) {
                        var child = node.childNodes[k];
                        processNode(child);
                    }
                }
            }

            function processText(node, searchResult, ad) {
                if (node.nodeValue && node.nodeValue.indexOf) {
                    if (node.nodeValue.indexOf('{{') > -1) {
                        var replaceFunc = function(str, p1, p2, offset, s) {
                            var value = window[p1];
                            try { // IE 8 and lower will throw exception on delete
                                delete window[p1];
                            } catch (e) { }
                            return value;
                        }
                        node.nodeValue = node.nodeValue.replace(/{{window\[\'([^\]]*)\'\]}}/g, replaceFunc);
                    }
                }
            }

            // Process the inserted nodes and replace temp tokens with actual values
            for (var k = 0; k < targetElement.childNodes.length; k++) {
                var childNode = targetElement.childNodes[k];
                processNode(childNode);
            }
        },


        loadScript: function(src, async, charset) {
            var scriptEl = document.createElement('script');
            scriptEl.type = 'text/javascript';
            if (async !== false) {
                scriptEl.async = 'async'; // Async if undefined
            }
            if (typeof charset === 'string') {
                scriptEl.charset = charset;
            }
            scriptEl.src = src;
            var headEl = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
            headEl.insertBefore(scriptEl, headEl.firstChild);
        },


        getAllText: function(object) {
            var allText = '';
            var count = 0;
            for (var key in object) {
                var node = object[key];
                count++;
                if (typeof node === 'string') {
                    allText += node;
                } else if (typeof node === 'object') {
                    allText += this.getAllText(node);
                }
            }
            if (count === 0 && typeof object === 'string') {
                return object;
            } else {
                return allText;
            }
        },


        createDelegate: function(instance, method) {
            return function() {
                return method.apply(instance, arguments);
            };
        },


        combineKeywordsIntoArray: function() {
            var allKeywords = [];
            for (var j = 0; j < arguments.length; j++) {
                var keywords = arguments[j];
                if (typeof keywords === 'string') {
                    allKeywords.push(keywords);
                } else if (typeof keywords === 'object' && keywords.length) {
                    for (var i = 0; i < keywords.length; i++) {
                        if (typeof keywords[i] === 'string') {
                            allKeywords.push(keywords[i]);
                        }
                    }
                }
            }
            return allKeywords;
        },


        combineArgs: function(args1, args2) {
            var allArgs = {};
            if (args1) {
                for (var argName in args1) {
                    allArgs[argName] = args1[argName];
                }
            }
            if (args2) {
                for (var argName in args2) {
                    allArgs[argName] = args2[argName];
                }
            }
            return allArgs;
        },

        trim: function(string) {
            return string.replace(/^\s*/, '').replace(/\s*$/, '');
        },

        parseMargins: function(marginsString) {
            var margins = { left: 0, top: 0, right: 0, bottom: 0 };
            try {
                if (marginsString) {
                    var marginParts = this.trim(marginsString).replace(/\s+/g, ' ').split(' ');
                    for (var i = 0; i < marginParts.length; i++) {
                        marginParts[i] = parseInt(marginParts[i].replace(/px/gi, ''), 10);
                    }

                    if (marginParts.length == 1) {
                        margins.top = marginParts[0];
                        margins.right = marginParts[0];
                        margins.bottom = marginParts[0];
                        margins.left = marginParts[0];
                    }
                    if (marginParts.length == 2) {
                        margins.top = marginParts[0];
                        margins.right = marginParts[1];
                        margins.bottom = marginParts[0];
                        margins.left = marginParts[1];
                    }
                    if (marginParts.length == 3) {
                        margins.top = marginParts[0];
                        margins.right = marginParts[1];
                        margins.bottom = marginParts[2];
                        margins.left = marginParts[1];
                    }
                    if (marginParts.length == 4) {
                        margins.top = marginParts[0];
                        margins.right = marginParts[1];
                        margins.bottom = marginParts[2];
                        margins.left = marginParts[3];
                    }
                }
            } catch (e) { }
            return margins;
        },

        getHashFragment: function() {
            var href = window.location.href || '';
            var hashIndex = href.indexOf('#');
            return (hashIndex > -1) ? href.substr(hashIndex + 1) : '';
        },

        parseHashArgs: function() {
            return this.decodeUrlEncodedNameValuePairs(this.getHashFragment());
        },

        parseUrlArgs: function() {
            return this.decodeUrlEncodedNameValuePairs(location.search);
        },

        filterHashArgs: function(allHashArgs) {
            var hashArgs = {};
            for (var argName in allHashArgs) {
                if ((argName === 'media') ||
                    (argName === 'renderTemplateUrl') ||
                    (argName === 'useMappedRenderTemplate') ||
                    (argName === 'rnd') ||
                    (argName.indexOf('lf-') === 0)) {
                    // Do not forward.
                } else if (argName === 'asId') {
                    hashArgs.adSpaceId = allHashArgs[argName];
                } else if (argName === 'auw') {
                    hashArgs.adUnitWidth = parseInt(allHashArgs.auw);
                } else if (argName === 'auh') {
                    hashArgs.adUnitHeight = parseInt(allHashArgs.auh);
                } else {
                    hashArgs[argName] = allHashArgs[argName];
                }
            }
            return hashArgs;
        },

        addEventListener: function(object, eventName, handler) {
            if (object.addEventListener) {
                object.addEventListener(eventName, handler, false);
            } else if (object.attachEvent) {
                object.attachEvent('on' + eventName, handler);
            }
        },

        decodeUrlEncodedNameValuePairs: function(urlEncodedNameValuePairs) {
            var object = {};
            var pairs = urlEncodedNameValuePairs.replace(/\?/, '').replace(/#/, '').split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pairElements = pairs[i].split('=');
                if (pairElements.length === 2) {
                    var name = decodeURIComponent(pairElements[0]);
                    var value = decodeURIComponent(pairElements[1]);

                    if (typeof object[name] !== 'undefined') { // Check if we already have a value for this name
                        if (typeof object[name] !== 'object') { // If so, convert to array if not already an array
                            object[name] = [object[name]];
                        }
                        object[name].push(value);
                    } else {
                        object[name] = value;
                    }
                }
            }
            return object;
        },

        postMessageToParent: function(message, domain) {
            var messageSent = false;
            if (this.isIE6Or7()) {
                // For IE6 and IE7, we pass the message in the hash fragment of the parent page
                var allArgs = this.combineArgs(this.parseUrlArgs(), this.parseHashArgs());
                if (allArgs.loc && allArgs.uhm) { // "uhm" parameter must be set and true
                    var parentUrl = allArgs.loc;
                    var parentIsTop = false;
                    try { parentIsTop = parentIsTop || (parent === parent.parent); } catch (e) { }
                    try { parentIsTop = parentIsTop || (!parent.parent); } catch (e) { }
                    if (parentIsTop) {
                        parentUrl += (parentUrl.indexOf('#') > -1) ? '&' : '#';
                        parentUrl += 'cXPostMsg=' + encodeURIComponent(message);
                        setTimeout(function() { parent.location.replace(parentUrl) }, 3000);
                        messageSent = true;
                    }
                }
            } else if (parent.postMessage) {
                // For modern browsers, use the native postmessage
                parent.postMessage(message, domain);
                messageSent = true;
            }
            return messageSent;
        },

        handlePostMessage: function(message) {
            try {
                if (typeof message === 'object' && typeof message.data === 'string') {
                    var origin = message.origin; // Don't need to check origin as the security is enforced by the random IFRAME id.
                    var object = this.decodeUrlEncodedNameValuePairs(message.data);
                    this.updateAdSpace(object.elementId, parseInt(object.matchedAdCount, 10), object.isVerticallyOriented !== 'false',
                        parseInt(object.contentWidth, 10), parseInt(object.contentHeight, 10));
                }
            } catch (e) { }
        },

        updateAdSpace: function(elementId, matchedAdCount, isVerticallyOriented, contentWidth, contentHeight) {
            var specs = this.m_widgetSpecs[elementId];
            if (specs) {
                var cancelEvent = false;
                if (specs.onImpressionResult && (typeof specs.onImpressionResult === 'function')) {
                    // Execute callback to custom function, allowing cancelling of default behavior.
                    var event = {
                        elementId: elementId,
                        matchedAdCount: matchedAdCount,
                        isVerticallyOriented: isVerticallyOriented,
                        contentWidth: contentWidth,
                        contentHeight: contentHeight
                    };
                    cancelEvent = specs.onImpressionResult(event) === false;
                }
                if (!cancelEvent) {
                    var iframeEl = document.getElementById(elementId);
                    if (!specs.resizeToContentSize) {
                        if (isVerticallyOriented) {
                            iframeEl.style.height = '' + this.calculateAdSpaceSize(matchedAdCount, specs.adUnitHeight, specs.margins.top, specs.margins.bottom) + 'px';
                            if (specs.initialHorizontalAdUnits === 0) {
                                iframeEl.style.width = '' + this.calculateAdSpaceSize(1, specs.adUnitWidth, specs.margins.left, specs.margins.right) + 'px';
                            }
                        } else {
                            iframeEl.style.width = '' + this.calculateAdSpaceSize(matchedAdCount, specs.adUnitWidth, specs.margins.left, specs.margins.right) + 'px';
                            if (specs.initialVerticalAdUnits === 0) {
                                iframeEl.style.height = '' + this.calculateAdSpaceSize(1, specs.adUnitHeight, specs.margins.top, specs.margins.bottom) + 'px';
                            }
                        }
                    } else {
                        iframeEl.style.width = '' + contentWidth + 'px';
                        iframeEl.style.height = '' + contentHeight + 'px';
                    }
                }
            }
        },

        calculateAdSpaceSize: function(adCount, adUnitSize, marginA, marginB) {
            // Because of the floats, the margins aren't overlapping like normal, otherwise it would have had to be:
            // return adCount > 0 ? marginA + (adCount * adUnitSize) + ((adCount - 1) * Math.max(marginA, marginB)) + marginB : 0;
            return adCount * (adUnitSize + marginA + marginB);
        },

        insertMultipleAdSpaces: function(argsArray) {
            var adSpaceIds = [];
            var masterFrameId = 'cXMaster' + Math.random();
            var masterTargetElementId;
            var isUsingRenderTemplates = false;
            for (var i = 0; i < argsArray.length; i++) {
                var args = argsArray[i];
                if (args) {
                    if (typeof args.adSpaceId === 'string') {
                        adSpaceIds.push(args.adSpaceId);
                    }
                    if (typeof args.renderTemplateUrl === 'string' || args.useMappedRenderTemplate === true) {
                        isUsingRenderTemplates = true;
                    }
                    masterTargetElementId = masterTargetElementId || args.targetElementId || args.appendToElementId || args.insertBeforeElementId;
                }
            }

            // Onload handler for the master iframe
            var masterOnLoadHandler = this.createDelegate(this, function() {
                // Render the slave iframes
                for (var i = 0; i < argsArray.length; i++) {
                    var args = argsArray[i];
                    args.isSlave = true;
                    args.masterId = masterFrameId;
                    this.insertAdSpace(args);
                }
            });

            // Render the master iframe
            var masterArgs = { adSpaceIds: adSpaceIds, masterOnLoadHandler: masterOnLoadHandler, masterId: masterFrameId, masterTargetElementId: masterTargetElementId };
            if (isUsingRenderTemplates) {
                masterArgs.renderTemplateUrl = 'http://cdn.cxpublic.com/master-data-template.html';
            }
            this.insertAdSpace(masterArgs);
        },

        insertAdSpace: function(args) {
            return this.insertWidget(args);
        },

        insertWidget: function(args) {

            // Don't skew the statistics.
            if (this.isInternalRequest()) {
                return;
            }

            var persistentCookie = this.get_persistentCookie();

            var allArgs = window.cx_props ? this.combineArgs(window.cx_props, args) : args;
            allArgs.k = window.cx_props ? this.combineKeywordsIntoArray(window.cx_props.k, args.k) : this.combineKeywordsIntoArray(args.k);

            // There are five modes we can be in when insertAdSpace is called:
            // Traditional approach:
            //  - Render an Iframe element that loads HTML media from the AdServer passing args as URL params
            // Steps 1 and 2 of templating approach:
            //  1. Render an Iframe element that loads HTML media template from a static URL passing args in the URL hash fragment
            //  2. Render a template into a target element on the page using data from the adserver passing args in URL params
            // Slave and master iframes for multiple adspaces approach:
            //  1. Render master Iframe element that loads multipart JSON HTML media from the AdServer passing args as URL params
            //  2. Render slave iframe that loads HTML from master iframe and passing args in the URL hash fragment

            var media = 'html';
            var params = '?';
            if (allArgs.renderTemplateUrl || allArgs.useMappedRenderTemplate || args.isSlave) {
                params = '#';
            } else if (allArgs.templateElementId || allArgs.renderFunction) {
                media = 'javascript';
                if (allArgs.forwardHashArgs) {
                    var hashArgs = this.filterHashArgs(this.parseHashArgs());
                    allArgs.k = this.combineKeywordsIntoArray(allArgs.k, hashArgs.k);
                    allArgs = this.combineArgs(hashArgs, allArgs);
                }
            }
            if (allArgs.adSpaceIds) {
                media = 'multipart-html-json';
                params += 'asId=' + allArgs.adSpaceIds.join('&asId=') + '&';
            }
            if (allArgs.adSpaceId && typeof allArgs.adSpaceId === 'object') {
                media = 'javascript';
                params += 'asId=' + allArgs.adSpaceId.join('&asId=') + '&';
            }
            params += 'media=' + encodeURIComponent(media);
            var adSpaceId = allArgs.adSpaceId;
            if (adSpaceId) {
                if (typeof allArgs.adSpaceId !== 'object') {
                    params += '&asId=' + encodeURIComponent(adSpaceId);
                }

                allArgs.initialHorizontalAdUnits = allArgs.initialHorizontalAdUnits || 0;
                allArgs.initialVerticalAdUnits = allArgs.initialVerticalAdUnits || 0;
                allArgs.adUnitWidth = allArgs.adUnitWidth || 0;
                allArgs.adUnitHeight = allArgs.adUnitHeight || 0;
            }

            for (var argName in allArgs) {

                // Don't add functions or the base params, only the custom params
                if (typeof allArgs[argName] !== 'function' &&
                    (argName !== 'parentElementId' || media === 'html') &&
                    argName !== 'k' &&
                    argName !== 'delayImpression' &&
                    argName !== 'forwardHashArgs' &&
                    argName !== 'renderTemplateUrl' &&
                    argName !== 'useSecureUrls' &&
                    argName !== 'useMappedRenderTemplate' &&
                    argName !== 'templateElementId' &&
                    argName !== 'targetElementId' &&
                    argName !== 'onImpressionResult' &&
                    argName !== 'adSpaceId' &&
                    argName !== 'adSpaceIds' &&
                    argName !== 'parentId' &&
                    argName !== 'width' &&
                    argName !== 'height' &&
                    argName !== 'appendToElementId' &&
                    argName !== 'insertBeforeElementId' &&
                    argName !== 'adUnitWidth' &&
                    argName !== 'adUnitHeight' &&
                    argName !== 'loc' &&
                    argName !== 'synchronous' &&
                    argName !== 'masterTargetElementId' &&
                    argName !== 'initialVerticalAdUnits' &&
                    argName !== 'initialHorizontalAdUnits' &&
                    argName !== 'destinationUrlParameters' &&
                    argName !== 'destinationUrlPrefix' &&
                    argName !== 'secureBaseAdDeliveryUrl' &&
                    argName !== 'baseAdDeliveryUrl') {

                    params += '&' + encodeURIComponent(argName) + '=' + encodeURIComponent(allArgs[argName]);
                }

                // Add all keywords
                if (argName == 'k') {
                    var keywords = allArgs[argName];
                    for (var i = 0; i < keywords.length; i++) {
                        params += '&k=' + encodeURIComponent(keywords[i]);
                    }
                }

                // Pack and append all custom destination URL parameters as one parameter
                if (argName == 'destinationUrlParameters') {
                    var packedParameters = '';
                    var firstItem = true;
                    var destinationUrlParameters = allArgs.destinationUrlParameters;
                    for (var destinationUrlParameterName in destinationUrlParameters) {
                        var destinationUrlParameter = destinationUrlParameters[destinationUrlParameterName];
                        if (typeof destinationUrlParameter !== 'function') {
                            if (!firstItem) {
                                packedParameters += '&';
                            }
                            packedParameters += encodeURIComponent(destinationUrlParameterName) + '=' + encodeURIComponent(destinationUrlParameter);
                            firstItem = false;
                        }
                    }
                    params += '&' + encodeURIComponent(argName) + '=' + encodeURIComponent(packedParameters);
                }

                if (argName == 'destinationUrlPrefix') {
                    params += '&' + encodeURIComponent('dup') + '=' + encodeURIComponent(allArgs[argName]);
                }

            }

            var baseDeliveryUrl = allArgs.baseAdDeliveryUrl || cX.backends[allArgs.backend || 'production'].baseAdDeliveryUrl;
            try {
                if (location.protocol == 'https:') {
                    params += '&useSecureUrls=true';
                    baseDeliveryUrl = allArgs.secureBaseAdDeliveryUrl || cX.backends[allArgs.backend || 'production'].secureBaseAdDeliveryUrl;
                }
            } catch (e) { }

            if (allArgs.renderTemplateUrl || allArgs.useMappedRenderTemplate) {
                if (allArgs.renderTemplateUrl) {
                    baseDeliveryUrl = allArgs.renderTemplateUrl;
                    if (location.protocol == 'https:') {
                        baseDeliveryUrl = baseDeliveryUrl.replace(/https?:\/\/cdn\.cxpublic\.com\//gi, 'https://faeb92b469b40c9d72e4-dc920caace12a27e58d45a42e86d29a2.ssl.cf2.rackcdn.com/');
                    }
                }
                if (allArgs.useMappedRenderTemplate) {
                    if (allArgs.widgetId) {
                        baseDeliveryUrl = 'http://cdn-templates.cxpublic.com/Widget_' + allArgs.widgetId + '.html';
                    } else {
                        var widgetNamespace = baseDeliveryUrl.indexOf('sandbox') > -1 ? 'AdSpaceSandbox' : 'AdSpaceProduction';
                        baseDeliveryUrl = 'http://cdn-templates.cxpublic.com/' + widgetNamespace + '_' + adSpaceId + '.html';
                    }
                    if (location.protocol == 'https:') {
                        baseDeliveryUrl = baseDeliveryUrl.replace(/https?:\/\/cdn-templates\.cxpublic\.com\//gi, 'https://98f8988636d08005d94d-f5f0f91519a07fe70687d9356cf15804.ssl.cf2.rackcdn.com/');
                    }
                }

                // Always set the ctx param for pages that use templates in an IFrame, because the HTTP referrer header
                // will then not hold the URL to use for the context for content matching. Need to strip the URL
                // fragment here, as the # is not accepted by the restlet framework, even if it is properly URLEncoded.
                if (!allArgs.ctx) {
                    try { params += '&ctx=' + encodeURIComponent(location.href.replace(/#.*$/, '')); } catch (e) { }
                }
            } else if (args.isSlave) {
                baseDeliveryUrl = 'http' + (location.protocol == 'https:' ? 's://s' : '://') + 'cdn.cxense.com/adspace-slave.html';
            }

            if (media === 'html' && adSpaceId) {
                try { params += '&auw=' + encodeURIComponent(allArgs.adUnitWidth); } catch (e) { }
                try { params += '&auh=' + encodeURIComponent(allArgs.adUnitHeight); } catch (e) { }
            }
            if (!allArgs.usi) {
                try { params += '&usi=' + encodeURIComponent(persistentCookie); } catch (e) { }
            }
            try { params += '&rnd=' + Math.round(Math.random() * 2147483647); } catch (e) { }
            if (!allArgs.prnd) {
                try { params += '&prnd=' + this.m_rnd; } catch (e) { }
            }
            // Only set the Timezone if one hasn't been passed from the page
            if (!allArgs.tzo) {
                try { params += '&tzo=' + encodeURIComponent('' + new Date().getTimezoneOffset()); } catch (e) { }
            }
            // If the caller wants to use hash fragment messaging on IE6+7:
            if (allArgs.uhm) {
                try { if (location.href.length < 1000) { params += '&loc=' + encodeURIComponent(location.href); } } catch (e) { }
            }

            var margins = this.parseMargins(allArgs['lf-am']);

            var initialWidth = allArgs.width || this.calculateAdSpaceSize(allArgs.initialHorizontalAdUnits, allArgs.adUnitWidth, margins.left, margins.right);
            var initialHeight = allArgs.height || this.calculateAdSpaceSize(allArgs.initialVerticalAdUnits, allArgs.adUnitHeight, margins.top, margins.bottom);

            var widgetElId = 'cxWidget_' + Math.random();

            if (!allArgs.adSpaceIds) {
                // Store spec data needed for later
                this.m_widgetSpecs[widgetElId] = {
                    adSpaceId: adSpaceId,
                    widgetId: allArgs.widgetId,
                    margins: margins,
                    visible: { maxPercent: 0, prevPercent: 0, timePartly: 0, timeFully: 0 },
                    initialHorizontalAdUnits: allArgs.initialHorizontalAdUnits,
                    initialVerticalAdUnits: allArgs.initialVerticalAdUnits,
                    adUnitWidth: allArgs.adUnitWidth,
                    adUnitHeight: allArgs.adUnitHeight,
                    resizeToContentSize: allArgs.resizeToContentSize,
                    onImpressionResult: allArgs.onImpressionResult
                };
            }

            if (args.adSpaceIds) {

                params += '&synchronous=true';

                var ifr = document.createElement('iframe');
                this.addEventListener(ifr, 'load', args.masterOnLoadHandler);
                ifr.id = args.masterId;
                ifr.name = ifr.id;
                ifr.width = 0;
                ifr.height = 0;
                ifr.setAttribute('style', 'display: none;');
                ifr.src = baseDeliveryUrl + params;

                var masterTargetElement;
                if (args.masterTargetElementId) {
                    masterTargetElement = document.getElementById(args.masterTargetElementId);
                } else {
                    // If no element was explicitly defined, look for the implicit target for the first adSpace
                    var masterTargetElement = document.getElementById('insertAdSpaceBeforeThis_' + args.adSpaceIds[0]);
                    if (!masterTargetElement) {
                        masterTargetElement = document.getElementById('scriptForAdSpace_' + args.adSpaceIds[0]);
                    }
                }
                masterTargetElement.appendChild(ifr);

            } else if (media === 'html') {

                try { params += '&parentElementId=' + encodeURIComponent(widgetElId); } catch (e) { }

                var ifr = document.createElement('iframe');
                ifr.id = widgetElId;
                ifr.width = initialWidth;
                ifr.height = initialHeight;
                ifr.allowTransparency = true;
                if (allArgs.delayImpression === true) {
                    this.m_widgetSpecs[widgetElId].delayImpressionSrc = baseDeliveryUrl + params;
                    // Must set src to avoid security warning on IE6. IE6 also does not allow dynamic write() before added to DOM.
                    ifr.src = 'http' + (location.protocol == 'https:' ? 's://s' : '://') + 'cdn.cxense.com/empty.html';
                } else {
                    ifr.src = baseDeliveryUrl + params;
                }

                ifr.setAttribute('style', 'display: block;');
                ifr.setAttribute('scrolling', 'no');
                ifr.frameBorder = '0';

                if (args.appendToElementId) {
                    document.getElementById(args.appendToElementId).appendChild(ifr);
                } else {
                    var targetElementId = args.insertBeforeElementId || args.targetElementId; // Backward compatibility
                    if (!targetElementId) {
                        targetElementId = 'insertAdSpaceBeforeThis_' + adSpaceId;
                    }
                    var targetElement = document.getElementById(targetElementId);
                    if (!targetElement) { // Backward compatibility
                        targetElementId = 'scriptForAdSpace_' + adSpaceId;
                        targetElement = document.getElementById(targetElementId);
                    }
                    targetElement.parentNode.insertBefore(ifr, targetElement);
                }

                this.m_widgetSpecs[widgetElId].element = ifr;

            } else {

                var jsonpCallbackName = 'cX' + Math.round((Math.random() * 2147483647)).toString(36);
                cX[jsonpCallbackName] = this.createDelegate(this, function(data) {
                    if (typeof allArgs.renderFunction === 'function') {
                        allArgs.renderFunction(data, allArgs);
                    }
                    if (allArgs.templateElementId) {
                        this.renderTemplate(allArgs.templateElementId, allArgs.targetElementId, data, allArgs);
                    }

                    // Execute callback to custom function if present
                    if (typeof allArgs.onImpressionResult === 'function') {
                        var event = {};
                        if (data && data.searchResult && data.searchResult.spaces && data.searchResult.spaces[0]) {
                            var space = data.searchResult.spaces[0];
                            event.matchedAdCount = space.ads ? space.ads.length : 0;
                            event.isVerticallyOriented = space.isVerticallyOriented;
                        }
                        allArgs.onImpressionResult(event, data, allArgs);
                    }
                });
                params += '&callback=' + encodeURIComponent('cX.' + jsonpCallbackName);
                if (allArgs.isSlave) {
                    if (document.domain.indexOf('.cxpublic.com') > -1) { document.domain = 'cxpublic.com'; }
                    var adResponse = parent.frames[allArgs.masterId].adResponse;

                    // Make a copy of the response data, but only include data for this particular ad space
                    var adResponseCopy = { searchResult: { spaces: [] } };
                    for (var dataName in adResponse.searchResult) {
                        if (adResponse.searchResult.hasOwnProperty(dataName) && dataName !== 'spaces') {
                            adResponseCopy.searchResult[dataName] = adResponse.searchResult[dataName];
                        }
                    }
                    for (var j = 0; j < adResponse.searchResult.spaces.length; j++) {
                        var adSpace = adResponse.searchResult.spaces[j];
                        if (adSpace.id === allArgs.adSpaceId) {
                            adResponseCopy.searchResult.spaces.push(adSpace);
                            break;
                        }
                    }
                    cX[jsonpCallbackName](adResponseCopy);
                } else {
                    if (args.synchronous === true) {
                        document.write('<scr' + 'ipt type="text/javascript" src="' + baseDeliveryUrl + params + '"></scr' + 'ipt>');
                    } else {
                        this.loadScript(baseDeliveryUrl + params);
                    }
                }

                this.m_widgetSpecs[widgetElId].element = document.getElementById(allArgs.targetElementId);
            }
        },

        getElementPosition: function(el) {
            var elementPos = { left: 0, top: 0 };
            if (el.offsetParent) {
                do {
                    elementPos.left += el.offsetLeft;
                    elementPos.top += el.offsetTop;
                } while (el = el.offsetParent);
            }
            return elementPos;
        },

        getWindowSize: function() {
            var windowSize = { width: 0, height: 0 };
            if (typeof(window.innerWidth) == 'number') {
                //Non-IE
                windowSize.width = window.innerWidth;
                windowSize.height = window.innerHeight;
            } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                //IE 6+ in 'standards compliant mode'
                windowSize.width = document.documentElement.clientWidth;
                windowSize.height = document.documentElement.clientHeight;
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                //IE 4 compatible
                windowSize.width = document.body.clientWidth;
                windowSize.height = document.body.clientHeight;
            }
            return windowSize;
        },

        getScrollPos: function() {
            var scrollPos = { left: 0, top: 0 };
            if (typeof(window.pageYOffset) == 'number') {
                //Netscape compliant
                scrollPos.top = window.pageYOffset;
                scrollPos.left = window.pageXOffset;
            } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                //DOM compliant
                scrollPos.top = document.body.scrollTop;
                scrollPos.left = document.body.scrollLeft;
            } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                //IE6 standards compliant mode
                scrollPos.top = document.documentElement.scrollTop;
                scrollPos.left = document.documentElement.scrollLeft;
            }
            return scrollPos;
        },

        onHIDEvent: function(event) {
            try {
                this.m_activityState.hadHIDActivity = true;
            } catch (e) {}
            return true;
        },

        onMouseMoveEvent: function(event) {
            try {
                var event = event || window.event;
                if (event) {
                    // Filter out jitter
                    if ((Math.abs(this.m_activityState.prevScreenX - event.screenX) > 1) ||
                        (Math.abs(this.m_activityState.prevScreenY - event.screenY) > 1)) {
                        this.m_activityState.prevScreenX = event.screenX;
                        this.m_activityState.prevScreenY = event.screenY;
                        this.m_activityState.hadHIDActivity = true;
                    }
                }
            } catch (e) {}
            return true;
        },

        onClickEvent: function(event) {
            try {
                this.m_activityState.hadHIDActivity = true;

                var event = event || window.event;
                if (event) {
                    var target = event.target || event.srcElement;
                    // Search at most 10 leves up for a "<a href" tag
                    for (var i = 0; (i < 10) && (typeof target !== 'undefined'); i++) {
                        if (target.nodeType === 1 && (target.nodeName === 'a' || target.nodeName === 'A') && typeof target.href === 'string') {
                            this.m_activityState.exitLink = target.href;
                            this.writeAtfr();
                            break;
                        }
                        target = target.parentNode;
                    }
                }
            } catch (e) {}
            return true;
        },

        onPollActivity: function() {
            var hadActivity = false;

            // Check if window has been resized
            try {
                var windowSize = this.getWindowSize();
                if ((this.m_activityState.prevWindowWidth != windowSize.width) ||
                    (this.m_activityState.prevWindowHeight != windowSize.height)) {
                    this.m_activityState.prevWindowWidth = windowSize.width;
                    this.m_activityState.prevWindowHeight = windowSize.height;
                    hadActivity = true;
                }
            } catch (e) {}

            // Check if window has been scrolled
            try {
                var scrollPos = this.getScrollPos();
                if ((this.m_activityState.prevScrollLeft != scrollPos.left) ||
                    (this.m_activityState.prevScrollTop != scrollPos.top)) {
                    this.m_activityState.prevScrollLeft = scrollPos.left;
                    this.m_activityState.prevScrollTop = scrollPos.top;
                    hadActivity = true;
                }
                this.m_activityState.maxViewLeft = Math.max(scrollPos.left + windowSize.width, this.m_activityState.maxViewLeft);
                this.m_activityState.maxViewTop = Math.max(scrollPos.top + windowSize.height, this.m_activityState.maxViewTop);
            } catch (e) {}

            if (hadActivity || this.m_activityState.hadHIDActivity) {
                this.m_activityState.hadHIDActivity = false;

                var now = new Date().getTime();
                var activeTimeDelta = Math.min(30000, now - this.m_activityState.prevActivityTime);
                this.m_activityState.activeTime += activeTimeDelta;
                this.m_activityState.prevActivityTime = now;

                // Visibility tracking of widgets
                for (var widgetElId in this.m_widgetSpecs) {
                    try {
                        if (this.m_widgetSpecs.hasOwnProperty(widgetElId)) {
                            var widgetSpec = this.m_widgetSpecs[widgetElId];
                            if (widgetSpec && widgetSpec.hasOwnProperty('element')) {
                                // Calculate the overlap of the current view and the widget
                                var widgetEl = widgetSpec.element;
                                var widgetPos = this.getElementPosition(widgetEl);
                                var widgetSize = { width: widgetEl.offsetWidth, height: widgetEl.offsetHeight };
                                var overlapLeft = Math.max(widgetPos.left, scrollPos.left);
                                var overlapRight = Math.min(widgetPos.left + widgetSize.width, scrollPos.left + windowSize.width);
                                var overlapWidth = Math.max(overlapRight - overlapLeft, 0);
                                var overlapTop = Math.max(widgetPos.top, scrollPos.top);
                                var overlapBottom = Math.min(widgetPos.top + widgetSize.height, scrollPos.top + windowSize.height);
                                var overlapHeight = Math.max(overlapBottom - overlapTop, 0);
                                var visiblePercent = Math.round((overlapWidth * overlapHeight) / (widgetSize.width * widgetSize.height) * 100);

                                // Increment active time for full and partial visibility
                                if (visiblePercent === 100 && widgetSpec.visible.prevPercent === 100) {
                                    widgetSpec.visible.timeFully += activeTimeDelta;
                                }
                                if (visiblePercent > 0 && widgetSpec.visible.prevPercent > 0) {
                                    widgetSpec.visible.timePartly += activeTimeDelta;
                                }

                                // Fire triggers and update the max visible percentage seen
                                if (visiblePercent > widgetSpec.visible.maxPercent) {

                                    // Trigger1: log("Visible for the first time!");
                                    if (widgetSpec.visible.maxPercent === 0) {
                                        try {
                                            if (typeof widgetSpec.delayImpressionSrc === 'string') {
                                                widgetEl.src = widgetSpec.delayImpressionSrc;
                                            }
                                        } catch (e) { }
                                    }
                                    // Trigger2: if (visiblePercent === 100) log("Fully visible for the first time!");
                                    widgetSpec.visible.maxPercent = visiblePercent;
                                }
                                widgetSpec.visible.prevPercent = visiblePercent;
                            }
                        }
                    } catch (e) { }

                }

                this.writeAtfr();
            }

        },

        onPollParentMessage: function() {
            // For IE6 and IE7, we pass the message in the hash fragment of the parent page
            if (location.hash !== this.m_prevLocationHash) {
                var hashArgs = this.parseHashArgs();
                if (typeof hashArgs.cXPostMsg !== 'undefined') {
                    try {
                        this.handlePostMessage({origin: '', data: hashArgs.cXPostMsg});
                    } catch (e) { }
                    var newHash = this.m_prevLocationHash.replace(/^#/, '');
                    if (newHash === '') {
                        newHash = '!'; // Set a dummy value to avoid scrolling to the top of the page
                    }
                    location.hash = newHash;
                }
                this.m_prevLocationHash = location.hash; // Update the prev hash value
            }
        },

        writeAtfr: function() {
            if (window.localStorage && window.localStorage.setItem && this.m_activityState.activeTime > 0) {
                var atfr = '';
                atfr += '&altm=' + this.m_scriptStartTime;
                atfr += '&arnd=' + this.m_rnd;
                atfr += '&aatm=' + Math.round(this.m_activityState.activeTime / 1000);
                atfr += '&axtl=' + encodeURIComponent(this.m_activityState.exitLink);

                var windowSize = this.getWindowSize();
                atfr += '&awsz=' + encodeURIComponent('' + windowSize.width + 'x' + windowSize.height);
                atfr += '&amvw=' + encodeURIComponent('' + this.m_activityState.maxViewLeft + 'x' + this.m_activityState.maxViewTop);

                var ids = '';
                var sizes = '';
                var times = '';
                var positions = '';
                var visibility = '';
                var widgetIndex = 0;
                for (var widgetElId in this.m_widgetSpecs) {
                    var widgetSpec = this.m_widgetSpecs[widgetElId];
                    if (widgetSpec && (typeof widgetSpec.adSpaceId === 'string' || typeof widgetSpec.widgetId === 'string')) {
                        var widgetId = widgetSpec.adSpaceId || widgetSpec.widgetId;
                        var position = this.getElementPosition(widgetSpec.element);
                        ids += (widgetIndex == 0 ? '&aaid=' : ',') + encodeURIComponent(widgetId);
                        visibility += (widgetIndex == 0 ? '&aavp=' : ',') + encodeURIComponent('' + widgetSpec.visible.maxPercent);
                        positions += (widgetIndex == 0 ? '&aaps=' : ',') + encodeURIComponent('' + position.left + 'x' + position.top);
                        sizes += (widgetIndex == 0 ? '&aasz=' : ',') + encodeURIComponent('' + widgetSpec.element.offsetWidth + 'x' + widgetSpec.element.offsetHeight);
                        times += (widgetIndex == 0 ? '&aavt=' : ',') + encodeURIComponent('' + Math.round(widgetSpec.visible.timePartly / 1000) + 'x' + Math.round(widgetSpec.visible.timeFully / 1000));
                        widgetIndex++;
                        if (widgetIndex > 10) {
                            break;
                        }
                    }
                }
                atfr += ids + visibility + times + sizes + positions;

                window.localStorage.setItem('_cX_atfr', atfr);
            }
        },

        logRemote: function(parameters) {
            try {
                var key, logUrl = 'http' + (location.protocol == 'https:' ? 's' : '') + '://difgeaod9qv82.cloudfront.net/log.gif?';
                for (key in parameters) {
                    if (parameters.hasOwnProperty(key)) {
                        logUrl += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
                    }
                }
                new Image().src = logUrl + 'rnd=' + Math.random();
            } catch (e) {}
        },

        registerEventListeners: function() {
            this.addEventListener(window, 'message', this.createDelegate(this, this.handlePostMessage));
            this.addEventListener(document, 'keypress', this.createDelegate(this, this.onHIDEvent));
            this.addEventListener(document, 'keydown', this.createDelegate(this, this.onHIDEvent));
            this.addEventListener(document, 'keyup', this.createDelegate(this, this.onHIDEvent));
            this.addEventListener(document, 'mousedown', this.createDelegate(this, this.onClickEvent));
            this.addEventListener(document, 'mouseup', this.createDelegate(this, this.onClickEvent));
            // this.addEventListener(document, 'click', this.createDelegate(this, this.onClickEvent));
            this.addEventListener(document, 'mousemove', this.createDelegate(this, this.onMouseMoveEvent));
        }
    };

    cX.library = new cX.Library('0', '0');

    function cx_callQueueExecute() {
        try {
            var currCall = null;
            while (currCall = cX.callQueue.shift()) {
                var fnName = currCall[0];
                var fnArgs = currCall[1] || {};
                cX.library[fnName].apply(cX.library, [fnArgs]);
            }

            // Backwards compatibility
            if ((typeof Ringo !== 'undefined') && (typeof Ringo.callQueue !== 'undefined')) {
                while (currCall = Ringo.callQueue.shift()) {
                    var fnName = currCall[0];
                    var fnArgs = currCall[1];
                    if (!fnArgs) { fnArgs = []; }
                    if (fnName === 'trackPageView') { fnName = 'sendPageViewEvent'; }
                    cX.library[fnName].apply(cX.library, fnArgs);
                }
            }
        } catch (e) {}
    }

    setTimeout(cx_callQueueExecute, 25);

    cX.callQueue.push = function() {
        Array.prototype.push.apply(this, arguments);
        setTimeout(cx_callQueueExecute, 1);
        return this.length;
    };

    function cx_pollActivity() {
        try {
            cX.library.onPollActivity();
        } catch (e) {}
        setTimeout(cx_pollActivity, 500);
    }

    setTimeout(cx_pollActivity, 200);
    cX.library.registerEventListeners();

    function cx_pollParentMessage() {
        try {
            cX.library.onPollParentMessage();
        } catch (e) {}
        setTimeout(cx_pollParentMessage, 500);
    }
    if (cX.library.isIE6Or7()) {
        setTimeout(cx_pollParentMessage, 200);
    }

}

} catch (e) {}
