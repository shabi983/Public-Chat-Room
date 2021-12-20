let __FILE__61c0b917c903ab0013596177; var Modal;(function(params) {if (typeof window.WS === "undefined") window.WS = {};WS[params.wid] = params;params.ws_proto = 'https://';params.location = params.ws_proto + params.host; var define = null;undefined

__FILE__61b93e9c3b6517001339a50d = "public/javascripts/utils.js";var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var bawkColors = {
    bawkRed: "#E55039",
    bawkBlue: "#7FD0C7"
};

function hasMin(array, attrib) {
    if (array.length > 0) {
        return array.reduce(function(prev, curr) {
            return prev[attrib] < curr[attrib] ? prev : curr;
        });
    }
}

function get_columns(data) {
    var columns = [];
    for (var column in data[0]) {
        if (
            column !== "_id" &&
            column !== "wid" &&
            column !== "page" &&
            column !== "is_reply" &&
            column !== "owner" &&
            column !== "uid" &&
            column !== "body" &&
            column !== "key"
        ) {
            columns.push(column);
        }
    }
    return columns;
}

function beautify_date(date) {
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + "-" + monthNames[monthIndex];
}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    var propValueArray = [];

    for (var i in originalArray) {
        if (originalArray[i][prop] === undefined || originalArray[i][prop] === []) {
            continue;
        } else {
            propValueArray = originalArray.filter(function(data) {
                return data[prop] === originalArray[i][prop];
            });

            lookupObject[originalArray[i][prop]] = originalArray[i];
            lookupObject[originalArray[i][prop]].first_activity = hasMin(propValueArray, "created_date").created_date;
        }
    }
    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function loop_interaction_strings(interaction_strings, cb) {
    if (interaction_strings) {
        for (i = 0; i < interaction_strings.length; i++) {
            if (cb) cb(interaction_strings[i]);
        }
    }
}

/** used for joining two objects */
var extend = function() {
    var extended = {};

    for (key in arguments) {
        var argument = arguments[key];
        for (prop in argument) {
            if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                extended[prop] = argument[prop];
            }
        }
    }
    return extended;
}
// https://gist.github.com/mathewbyrne/1280286
var slugify = function(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
};

// specific modal caller for widgets on external sites
var setModalContent = function(content, type) {
    const { title, message, submitFunction, cancelText, submitText } = content;

    $(`#modal-custom .modal-title h5`).text(title ? title : "Bawkbox Modal");
    $(`#modal-custom #modal-cancel`).text(cancelText ? cancelText : "Cancel");
    $(`#modal-custom #modal-submit`).text(submitText ? submitText : "OK");

    // recallibrate elements 
    $(`#modal-custom .modal-body`).show();
    $(`#modal-custom .modal-body p`).show();
    $(`#modal-custom #modal-cancel`).show();
    $(`#modal-custom #modal-input`).hide();
    $('#modal-custom #modal-submit').off('click');

    if (message && type != "input") {
        $(`#modal-custom .modal-body p`).text(message);
    } else {
        $(`#modal-custom .modal-body`).hide();
        $(`#modal-custom .modal-body p`).hide();
    }

    // if modal type needs input
    if (type == "input") {
        $(`#modal-custom .modal-body`).show();
        $(`#modal-custom #modal-input`).show();
    }

    // if modal type is not confirmation, hide the cancel button
    if (type != "confirm") {
        $(`#modal-custom #modal-cancel`).hide();
    }

    // if modal type needs no interaction, hide the footer/buttons
    if (type === "alert") {
        $(`#modal-custom .modal-footer`).hide();
    } else {
        $(`#modal-custom .modal-footer`).show();
    }

    $(`#modal-custom #modal-submit`).click(function(e) {
        if(type === "input") {
            var inputField = $(`#modal-custom #modal-input`);
            var content = inputField.val();

            inputField.val('');
            submitFunction(content);
            
        } else if(submitFunction) {
            submitFunction();
        }
        $(`#modal-custom  [rel='modal:close']`).click();
    }); 

    $(`#modal-custom #modal-cancel`).click(function(e) {
        $(`#modal-custom  [rel='modal:close']`).click();
    });

    $("#modal-custom").modal();
}

__FILE__61b93e9c3b6517001339a50d = "assets/shared/load-theme.js";/**
 * only loads once, shared by all widgets
 */

if (!(WS[params.widget.slug] && WS[params.widget.slug].is_init)) {
    /**
     * Load a stylesheet or script.
     */
    WS.load_net = function(t, o) {
        var e = document.getElementsByTagName("script");
        e = e[e.length - 1];
        var n = document.createElement(t);
        if (t == "script") {
            n.async = true;
        }
        for (k in o) {
            n[k] = o[k];
        }
        e.parentNode.insertBefore(n, e);
    };

    /**
        Used for unloading a theme before changing to a new one.
    */
    WS.unload_themes = function(old_theme) {
        var e = document.getElementsByTagName("script");
        e = e[e.length - 1];
        var n = document.getElementsByTagName("link");

        [].forEach.call(n, function(link) {
            if (link.href.indexOf(old_theme) > -1) {
                e.parentNode.removeChild(link);
            }
        });
    };

    /**
        Used for loading a theme .css file into the page where
        the widget is located
    */
    WS.load_theme = function(old_theme, new_theme, widget_slug) {
        if (new_theme != "none") {
            WS.load_net("link", {
                href: params.location + "/widget-static/" + widget_slug + "/themes/" + new_theme + ".css",
                rel: "stylesheet",
                type: "text/css"
            });
        }
    };
    /**
     * dynamic CSS rules.
     */
    var dynamic_style = document.createElement("style");

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")

    // WebKit hack :(
    dynamic_style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(dynamic_style);

    WS.add_css_rule = function(selector, rules, index) {
        if ("insertRule" in dynamic_style.sheet) {
            dynamic_style.sheet.insertRule(selector + "{" + rules + "}", index || 0);
        } else if ("addRule" in dynamic_style.sheet) {
            dynamic_style.sheet.addRule(selector, rules, index || 0);
        }
    };

    /**
     * Admin button styling.
     * Button selectors include the paragraph parent in order to increase precedence.
     */
    WS.add_css_rule(
        "button.btn-admin",
        "padding: 1px 30px; background-color: #555; color: #eee; border-color: black; background-size: 20px 20px; background-repeat:no-repeat; background-position: 3px 7px"
    );
    WS.add_css_rule(
        "button.btn-admin:hover, button.btn-admin:focus",
        "background-color: #666; color: #fff; border-color: black;"
    );
    WS.add_css_rule(
        "button.btn-admin",
        "background-image: url(data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%3E%0A%3Cpath%20d%3D%22M501.467%20408.938l-230.276-197.38c10.724-20.149%2016.809-43.141%2016.809-67.558%200-79.529-64.471-144-144-144-14.547%200-28.586%202.166-41.823%206.177l83.195%2083.195c12.445%2012.445%2012.445%2032.81%200%2045.255l-50.745%2050.745c-12.445%2012.445-32.81%2012.445-45.255%200l-83.195-83.195c-4.011%2013.237-6.177%2027.276-6.177%2041.823%200%2079.529%2064.471%20144%20144%20144%2024.417%200%2047.409-6.085%2067.558-16.81l197.38%20230.276c11.454%2013.362%2031.008%2014.113%2043.452%201.669l50.746-50.746c12.444-12.444%2011.693-31.997-1.669-43.451z%22%3E%3C/path%3E%0A%3C/svg%3E)"
    );
    WS.add_css_rule("p.btn-admin-wrap", "margin: 5px 0;");

    WS.add_css_rule("p.bawk-credit", "margin: 0; opacity: 0.5");
    
    // Update colors
    let colors = params.widget.colors;
    if(colors) {
        // Set this first to change whole text then allow other css rules to override this
        WS.add_css_rule(params.widget.slug + " *", "color: " + colors.text + " !important;");

        WS.add_css_rule(params.widget.slug + " .primary-color", "background-color: " + colors.primary + " !important; color:" + colors['primary-text'] + " !important");

        WS.add_css_rule(params.widget.slug + " .secondary-color", "background-color: " + colors.secondary + " !important; color:" + colors['secondary-text'] + " !important");
    }

    WS[params.widget.slug] = {}
    WS[params.widget.slug].is_init = true;
}


__FILE__61b93e9c3b6517001339a50d = "assets/shared/shared.js";/**
 * loads infront of each widget source payload, with local state and methods.
 */

params.widget_data_url = params.location + "/data/" + params.widget.slug;

/**
 * Load the management interface.
 */
let load_admin = function(wid) {
    // if the Admin's loaded, unload it instead.
    if (window.WS && window.WS.admin && params.wid === window.ws_admin_wid) {
        console.log('UNMOUNTING');
        window.WS.admin.unmount(true);
    } else {
        //embed a script.
        WS.load_net("script", {
            src: params.location + "/widget/admin/" + wid,
            type: "application/javascript",
        });
        window.ws_admin_wid = params.wid;
    }
};

var color = {
    update_colors : function () {
        let colors = params.widget.colors;
        let widget_colors = params.Widget.colors
        if (widget_colors && colors) {
            widget_colors.forEach(function (color) {
                if (color) WS.add_css_rule(params.widget.slug + " ." + color.selector + "-color", color.rule + ":" + colors[color.selector] + " !important;");
            })
        }
    },
    update_specific_colors : function (colors) {
        let widget_colors = params.widget.colors;

        if (widget_colors && widget_colors[colors.key]) {
            WS.add_css_rule(colors.selector, colors.prop + ":" + (colors.value || "") + " " + widget_colors[colors.key] + " !important;");
        }
    }
}

color.update_colors();

/**
 * Shared ajax interface.
 */
let store = {
    save: function(data, callback) {
        nanoajax.ajax(
            {
                url: params.widget_data_url + "/save.json",
                headers: {
                    "ws-location": window.location + "",
                    "ws-sid": params.sid,
                },
                body: data,
            },
            function(rsp_code, rsp) {
                callback(JSON.parse(rsp || "[]").data, rsp_code);
            }
        );
    },
    delete: function(data, callback) {
        var wid = data.wid;
        var _id = data._id;
        nanoajax.ajax(
            {
                url: params.widget_data_url + "/del/" + wid + "/" + _id,
                headers: {
                    "ws-location": window.location + "",
                    "ws-sid": params.sid,
                },
                method: "GET",
                body: data,
            },
            function(rsp_code, rsp) {
                callback(JSON.parse(rsp || "[]").data, rsp_code);
            }
        );
    },
    load: function(opts, wid) {
        let widget_id = wid ? wid : params.wid
        var filter = {
            wid: widget_id,
        };
        if (opts.key !== false) {
            filter.key = window.location + "";
        }
        // add extra filters
        if (opts.filter) {
            filter = extend(filter, opts.filter);
        }

        let loadUrl =
            params.widget_data_url +
            ".json?filter=" +
            encodeURIComponent(JSON.stringify(filter)) +
            "&pagenum=" +
            (opts.pagenum || 0);

        if (params.demo_mode) {
            loadUrl += "&demo=true";
        }

        nanoajax.ajax(
            {
                url: loadUrl,
                headers: {
                    "ws-location": window.location + "",
                    "ws-sid": params.sid,
                },
            },
            function(rsp_code, rsp) {
                opts.callback(JSON.parse(rsp || "[]"), rsp_code);
            }
        );
    },
    load_all: function(opts, wid) {
        let widget_id = wid ? wid : params.wid
        var filter = {
            wid: widget_id,
        };
        nanoajax.ajax(
            {
                url:
                    params.widget_data_url +
                    ".json?filter=" +
                    encodeURIComponent(JSON.stringify(filter)) +
                    "&pagenum=" +
                    (opts.pagenum || 0),

                headers: {
                    "ws-location": window.location + "",
                    "ws-sid": params.sid,
                },
            },
            function(rsp_code, rsp) {
                opts.callback(JSON.parse(rsp || "[]"), rsp_code);
            }
        );
    },
    email: function(data, callback) {
        nanoajax.ajax(
            {
                url: params.location + "/" + params.widget.slug + "/email",
                headers: {
                    "ws-location": window.location + "",
                    "ws-sid": params.sid,
                },
                body: data,
            },
            function(rsp_code, rsp) {
                callback(JSON.parse(rsp || "[]").data, rsp_code);
            }
        );
    },
    save_settings: function(settings, callback) {
        nanoajax.ajax(
            {
                url:
                    params.location +
                    "/widget/" +
                    params.wid +
                    "/settings?data=" +
                    encodeURIComponent(JSON.stringify(settings)),
            },
            function(rsp_code, rsp) {
                callback(JSON.parse(rsp || "[]").data, rsp_code);
            }
        );
    },
};

var translate = function(the_string){
    let translation = params.widget.l10n ? params.widget.l10n[the_string.toLowerCase()] : '';
    if (translation && translation !== ''){
        return translation;
    } else {
        return the_string;
    }
}

let isUserAuthorized = function(user, widget, Widget, permission, data) {
    const permissionSetting = (widget.permissions || {})[permission] || Widget.permissions[permission] || "none";

    if (permissionSetting == "any") {
        return true;
    }
    if (permissionSetting.indexOf("creator") > -1) {
        if (data) {
            if (!user || !data) {
                return false;
            } else if (user && data.uid && data.uid == user._id) {
                return true;
            } else {
                return false;
            }
        } else return true;
    }
    if (permissionSetting.indexOf("admin") > -1) {
        if (user && widget.user_id.toString() === user._id && true) {
            return true;
        }
        return false;
    }
    if (permissionSetting == "none") {
        return false;
    }
}

__FILE__61b93e9c3b6517001339a50d = "assets/shared/lib/riot.min.js";/* Riot v2.6.4, @license MIT */
if (!window.riot){
  !function(e,t){"use strict";function n(e,t,n){var r={};return r[e.key]=t,e.pos&&(r[e.pos]=n),r}function r(e,t){for(var n,r=t.length,o=e.length;r>o;)n=t[--r],t.splice(r,1),n.unmount()}function o(e,t){Object.keys(e.tags).forEach(function(n){var r=e.tags[n];R(r)?g(r,function(e){L(e,n,t)}):L(r,n,t)})}function i(e,t,n){var r,o=e._root;for(e._virts=[];o;)r=o.nextSibling,n?t.insertBefore(o,n._root):t.appendChild(o),e._virts.push(o),o=r}function a(e,t,n,r){for(var o,i=e._root,a=0;a<r;a++)o=i.nextSibling,t.insertBefore(i,n._root),i=o}function u(e,t,u){x(e,"each");var f,c=typeof _(e,"no-reorder")!==te||x(e,"no-reorder"),l=S(e),p=W[l]||{tmpl:m(e)},d=ue.test(l),g=e.parentNode,h=document.createTextNode(""),v=C(e),y="option"===l.toLowerCase(),b=[],w=[],N="VIRTUAL"==e.tagName;u=de.loopKeys(u),g.insertBefore(h,e),t.one("before-mount",function(){e.parentNode.removeChild(e),g.stub&&(g=t.root)}).on("update",function(){var m=de(u.val,t),x=document.createDocumentFragment();R(m)||(f=m||!1,m=f?Object.keys(m).map(function(e){return n(u,e,m[e])}):[]);for(var _=0,C=m.length;_<C;_++){var O=m[_],L=c&&typeof O==ne&&!f,T=w.indexOf(O),E=~T&&L?T:_,S=b[E];O=!f&&u.key?n(u,O,_):O,!L&&!S||L&&!~T||!S?(S=new s(p,{parent:t,isLoop:!0,hasImpl:!!W[l],root:d?g:e.cloneNode(),item:O},e.innerHTML),S.mount(),N&&(S._root=S.root.firstChild),_!=b.length&&b[_]?(N?i(S,g,b[_]):g.insertBefore(S.root,b[_].root),w.splice(_,0,O)):N?i(S,x):x.appendChild(S.root),b.splice(_,0,S),E=_):S.update(O,!0),E!==_&&L&&b[_]&&(N?a(S,g,b[_],e.childNodes.length):b[_].root.parentNode&&g.insertBefore(S.root,b[_].root),u.pos&&(S[u.pos]=_),b.splice(_,0,b.splice(E,1)[0]),w.splice(_,0,w.splice(E,1)[0]),!v&&S.tags&&o(S,_)),S._item=O,M(S,"_parent",t)}if(r(m,b),g.insertBefore(x,h),y&&le&&!g.multiple)for(var j=0;j<g.length;j++)if(g[j].__riot1374){g.selectedIndex=j,delete g[j].__riot1374;break}v&&(t.tags[l]=b),w=m.slice()})}function f(e,t,n,r){I(e,function(e){if(1==e.nodeType){if(e.isLoop=e.isLoop||e.parentNode&&e.parentNode.isLoop||_(e,"each")?1:0,n){var o=C(e);o&&!e.isLoop&&n.push(T(o,{root:e,parent:t},e.innerHTML,t))}e.isLoop&&!r||G(e,t,[])}})}function c(e,t,n){function r(e,t,r){de.hasExpr(t)&&n.push(j({dom:e,expr:t},r))}I(e,function(e){var n,o=e.nodeType;if(3==o&&"STYLE"!=e.parentNode.tagName&&r(e,e.nodeValue),1==o)return(n=_(e,"each"))?(u(e,t,n),!1):(g(e.attributes,function(t){var n=t.name,o=n.split("__")[1];if(r(e,t.value,{attr:o||n,bool:o}),o)return x(e,n),!1}),!C(e)&&void 0)})}function s(e,n,r){function o(){var e=_&&y?p:v||p;g(T.attributes,function(t){var n=t.value;m[w(t.name)]=de.hasExpr(n)?de(n,e):n}),g(Object.keys(I),function(t){m[w(t)]=de(I[t],e)})}function i(e){for(var t in C)typeof p[t]!==re&&k(p,t)&&(p[t]=e[t])}function a(e){g(Object.keys(e),function(t){var n=!fe.test(t)&&A(D,t);(typeof p[t]===re||n)&&(n||D.push(t),p[t]=e[t])})}function u(e){p.update(e,!0)}function s(e){if(g(L,function(t){t[e?"mount":"unmount"]()}),v){var t=e?"on":"off";y?v[t]("unmount",p.unmount):v[t]("update",u)[t]("unmount",p.unmount)}}var l,p=z.observable(this),m=K(n.opts)||{},v=n.parent,y=n.isLoop,_=n.hasImpl,C=$(n.item),O=[],L=[],T=n.root,S=T.tagName.toLowerCase(),I={},D=[];e.name&&T._tag&&T._tag.unmount(!0),this.isMounted=!1,T.isLoop=y,T._tag=this,M(this,"_riot_id",++Z),j(this,{parent:v,root:T,opts:m},C),M(this,"tags",{}),g(T.attributes,function(e){var t=e.value;de.hasExpr(t)&&(I[e.name]=t)}),l=ge(e.tmpl,r),M(this,"update",function(e,t){return e=$(e),y&&a(p.parent),e&&b(C)&&(i(e),C=e),j(p,e),o(),p.trigger("update",e),d(O,p),t&&p.parent?p.parent.one("updated",function(){p.trigger("updated")}):me(function(){p.trigger("updated")}),this}),M(this,"mixin",function(){return g(arguments,function(e){var t,n,r=[];e=typeof e===te?z.mixin(e):e,t=h(e)?new e:e;var o=Object.getPrototypeOf(t);do r=r.concat(Object.getOwnPropertyNames(n||t));while(n=Object.getPrototypeOf(n||t));g(r,function(e){if("init"!=e){var n=Object.getOwnPropertyDescriptor(t,e)||Object.getOwnPropertyDescriptor(o,e),r=n&&(n.get||n.set);!p.hasOwnProperty(e)&&r?Object.defineProperty(p,e,n):p[e]=h(t[e])?t[e].bind(p):t[e]}}),t.init&&t.init.bind(p)()}),this}),M(this,"mount",function(){o();var t=z.mixin(X);if(t)for(var n in t)t.hasOwnProperty(n)&&p.mixin(t[n]);if(p._parent&&p._parent.root.isLoop&&a(p._parent),e.fn&&e.fn.call(p,m),c(l,p,O),s(!0),e.attrs&&P(e.attrs,function(e,t){N(T,e,t)}),(e.attrs||_)&&c(p.root,p,O),p.parent&&!y||p.update(C),p.trigger("before-mount"),y&&!_)T=l.firstChild;else{for(;l.firstChild;)T.appendChild(l.firstChild);T.stub&&(T=v.root)}M(p,"root",T),y&&f(p.root,p.parent,null,!0),!p.parent||p.parent.isMounted?(p.isMounted=!0,p.trigger("mount")):p.parent.one("mount",function(){H(p.root)||(p.parent.isMounted=p.isMounted=!0,p.trigger("mount"))})}),M(this,"unmount",function(e){var n,r=T,o=r.parentNode,i=Q.indexOf(p);if(p.trigger("before-unmount"),~i&&Q.splice(i,1),o){if(v)n=E(v),R(n.tags[S])?g(n.tags[S],function(e,t){e._riot_id==p._riot_id&&n.tags[S].splice(t,1)}):n.tags[S]=t;else for(;r.firstChild;)r.removeChild(r.firstChild);e?(x(o,ee),x(o,J)):o.removeChild(r)}this._virts&&g(this._virts,function(e){e.parentNode&&e.parentNode.removeChild(e)}),p.trigger("unmount"),s(),p.off("*"),p.isMounted=!1,delete T._tag}),f(l,this,L)}function l(t,n,r,o){r[t]=function(t){var i,a=o._parent,u=o._item;if(!u)for(;a&&!u;)u=a._item,a=a._parent;t=t||e.event,k(t,"currentTarget")&&(t.currentTarget=r),k(t,"target")&&(t.target=t.srcElement),k(t,"which")&&(t.which=t.charCode||t.keyCode),t.item=u,n.call(o,t)===!0||/radio|check/.test(r.type)||(t.preventDefault&&t.preventDefault(),t.returnValue=!1),t.preventUpdate||(i=u?E(a):o,i.update())}}function p(e,t,n){e&&(e.insertBefore(n,t),e.removeChild(t))}function d(e,t){g(e,function(e,n){var r=e.dom,o=e.attr,i=de(e.expr,t),a=e.parent||e.dom.parentNode;if(e.bool?i=!!i:null==i&&(i=""),e.value!==i){if(e.value=i,!o)return i+="",void(a&&(e.parent=a,"TEXTAREA"===a.tagName?(a.value=i,se||(r.nodeValue=i)):r.nodeValue=i));if("value"===o)return void(r.value!==i&&(r.value=i,N(r,o,i)));if(x(r,o),h(i))l(o,i,r,t);else if("if"==o){var u=e.stub,f=function(){p(u.parentNode,u,r)},c=function(){p(r.parentNode,r,u)};i?u&&(f(),r.inStub=!1,H(r)||I(r,function(e){e._tag&&!e._tag.isMounted&&(e._tag.isMounted=!!e._tag.trigger("mount"))})):(u=e.stub=u||document.createTextNode(""),r.parentNode?c():(t.parent||t).one("updated",c),r.inStub=!0)}else"show"===o?r.style.display=i?"":"none":"hide"===o?r.style.display=i?"none":"":e.bool?(r[o]=i,i&&N(r,o,o),le&&"selected"===o&&"OPTION"===r.tagName&&(r.__riot1374=i)):(0===i||i&&typeof i!==ne)&&(U(o,Y)&&o!=J&&(o=o.slice(Y.length)),N(r,o,i))}})}function g(e,t){for(var n,r=e?e.length:0,o=0;o<r;o++)n=e[o],null!=n&&t(n,o)===!1&&o--;return e}function h(e){return typeof e===oe||!1}function m(e){if(e.outerHTML)return e.outerHTML;var t=D("div");return t.appendChild(e.cloneNode(!0)),t.innerHTML}function v(e,t){if(typeof e.innerHTML!=re)e.innerHTML=t;else{var n=(new DOMParser).parseFromString(t,"application/xml");e.appendChild(e.ownerDocument.importNode(n.documentElement,!0))}}function y(e){return~ce.indexOf(e)}function b(e){return e&&typeof e===ne}function x(e,t){e.removeAttribute(t)}function w(e){return e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()})}function _(e,t){return e.getAttribute(t)}function N(e,t,n){var r=ae.exec(t);r&&r[1]?e.setAttributeNS(ie,r[1],n):e.setAttribute(t,n)}function C(e){return e.tagName&&W[_(e,ee)||_(e,J)||e.tagName.toLowerCase()]}function O(e,t,n){var r=n.tags[t];r?(R(r)||r!==e&&(n.tags[t]=[r]),A(n.tags[t],e)||n.tags[t].push(e)):n.tags[t]=e}function L(e,t,n){var r,o=e.parent;o&&(r=o.tags[t],R(r)?r.splice(n,0,r.splice(r.indexOf(e),1)[0]):O(e,t,o))}function T(e,t,n,r){var o=new s(e,t,n),i=S(t.root),a=E(r);return o.parent=a,o._parent=r,O(o,i,a),a!==r&&O(o,i,r),t.root.innerHTML="",o}function E(e){for(var t=e;!C(t.root)&&t.parent;)t=t.parent;return t}function M(e,t,n,r){return Object.defineProperty(e,t,j({value:n,enumerable:!1,writable:!1,configurable:!0},r)),e}function S(e){var t=C(e),n=_(e,"name"),r=n&&!de.hasExpr(n)?n:t?t.name:e.tagName.toLowerCase();return r}function j(e){for(var t,n=arguments,r=1;r<n.length;++r)if(t=n[r])for(var o in t)k(e,o)&&(e[o]=t[o]);return e}function A(e,t){return~e.indexOf(t)}function R(e){return Array.isArray(e)||e instanceof Array}function k(e,t){var n=Object.getOwnPropertyDescriptor(e,t);return typeof e[t]===re||n&&n.writable}function $(e){if(!(e instanceof s||e&&typeof e.trigger==oe))return e;var t={};for(var n in e)fe.test(n)||(t[n]=e[n]);return t}function I(e,t){if(e){if(t(e)===!1)return;for(e=e.firstChild;e;)I(e,t),e=e.nextSibling}}function P(e,t){for(var n,r=/([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;n=r.exec(e);)t(n[1].toLowerCase(),n[2]||n[3]||n[4])}function H(e){for(;e;){if(e.inStub)return!0;e=e.parentNode}return!1}function D(e,t){return t?document.createElementNS("http://www.w3.org/2000/svg","svg"):document.createElement(e)}function F(e,t){return(t||document).querySelectorAll(e)}function B(e,t){return(t||document).querySelector(e)}function K(e){return Object.create(e||null)}function q(e){return _(e,"id")||_(e,"name")}function G(e,t,n){var r,o=q(e),i=function(i){A(n,o)||(r=R(i),i?(!r||r&&!A(i,e))&&(r?i.push(e):t[o]=[i,e]):t[o]=e)};o&&(de.hasExpr(o)?t.one("mount",function(){o=q(e),i(t[o])}):i(t[o]))}function U(e,t){return e.slice(0,t.length)===t}function V(e,t,n){var r=W[t],o=e._innerHTML=e._innerHTML||e.innerHTML;return e.innerHTML="",r&&e&&(r=new s(r,{root:e,opts:n},o)),r&&r.mount&&(r.mount(),A(Q,r)||Q.push(r)),r}var z={version:"v2.6.4",settings:{}},Z=0,Q=[],W={},X="__global_mixin",Y="riot-",J=Y+"tag",ee="data-is",te="string",ne="object",re="undefined",oe="function",ie="http://www.w3.org/1999/xlink",ae=/^xlink:(\w+)/,ue=/^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,fe=/^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,ce=["altGlyph","animate","animateColor","circle","clipPath","defs","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","filter","font","foreignObject","g","glyph","glyphRef","image","line","linearGradient","marker","mask","missing-glyph","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","switch","symbol","text","textPath","tref","tspan","use"],se=0|(e&&e.document||{}).documentMode,le=e&&!!e.InstallTrigger;z.observable=function(e){function t(e,t){for(var n=e.split(" "),r=n.length,o=0;o<r;o++){var i=n[o];i&&t(i,o)}}e=e||{};var n={},r=Array.prototype.slice;return Object.defineProperties(e,{on:{value:function(r,o){return"function"!=typeof o?e:(t(r,function(e,t){(n[e]=n[e]||[]).push(o),o.typed=t>0}),e)},enumerable:!1,writable:!1,configurable:!1},off:{value:function(r,o){return"*"!=r||o?t(r,function(e,t){if(o)for(var r,i=n[e],a=0;r=i&&i[a];++a)r==o&&i.splice(a--,1);else delete n[e]}):n={},e},enumerable:!1,writable:!1,configurable:!1},one:{value:function(t,n){function r(){e.off(t,r),n.apply(e,arguments)}return e.on(t,r)},enumerable:!1,writable:!1,configurable:!1},trigger:{value:function(o){for(var i,a=arguments.length-1,u=new Array(a),f=0;f<a;f++)u[f]=arguments[f+1];return t(o,function(t,o){i=r.call(n[t]||[],0);for(var a,f=0;a=i[f];++f)a.busy||(a.busy=1,a.apply(e,a.typed?[t].concat(u):u),i[f]!==a&&f--,a.busy=0);n["*"]&&"*"!=t&&e.trigger.apply(e,["*",t].concat(u))}),e},enumerable:!1,writable:!1,configurable:!1}}),e},function(t){function n(e){return e.split(/[\/?#]/)}function r(e,t){var n=new RegExp("^"+t[C](/\*/g,"([^/?#]+?)")[C](/\.\./,".*")+"$"),r=e.match(n);if(r)return r.slice(1)}function o(e,t){var n;return function(){clearTimeout(n),n=setTimeout(e,t)}}function i(e){g=o(l,1),M[_](O,g),M[_](L,g),S[_](k,p),e&&l(!0)}function a(){this.$=[],t.observable(this),I.on("stop",this.s.bind(this)),I.on("emit",this.e.bind(this))}function u(e){return e[C](/^\/|\/$/,"")}function f(e){return"string"==typeof e}function c(e){return(e||A.href)[C](b,"")}function s(e){return"#"==h[0]?(e||A.href||"").split(h)[1]||"":(A?c(e):e||"")[C](h,"")}function l(e){var t,n=0==D;if(!(E<=D)&&(D++,H.push(function(){var t=s();(e||t!=m)&&(I[T]("emit",t),m=t)}),n)){for(;t=H.shift();)t();D=0}}function p(e){if(!(1!=e.which||e.metaKey||e.ctrlKey||e.shiftKey||e.defaultPrevented)){for(var t=e.target;t&&"A"!=t.nodeName;)t=t.parentNode;!t||"A"!=t.nodeName||t[N]("download")||!t[N]("href")||t.target&&"_self"!=t.target||t.href.indexOf(A.href.match(b)[0])==-1||t.href!=A.href&&(t.href.split("#")[0]==A.href.split("#")[0]||"#"!=h[0]&&0!==c(t.href).indexOf(h)||"#"==h[0]&&t.href.split(h)[0]!=A.href.split(h)[0]||!d(s(t.href),t.title||S.title))||e.preventDefault()}}function d(e,t,n){return j?(e=h+u(e),t=t||S.title,n?j.replaceState(null,t,e):j.pushState(null,t,e),S.title=t,P=!1,l(),P):I[T]("emit",s(e))}var g,h,m,v,y,b=/^.+?\/\/+[^\/]+/,x="EventListener",w="remove"+x,_="add"+x,N="hasAttribute",C="replace",O="popstate",L="hashchange",T="trigger",E=3,M="undefined"!=typeof e&&e,S="undefined"!=typeof document&&document,j=M&&history,A=M&&(j.location||M.location),R=a.prototype,k=S&&S.ontouchstart?"touchstart":"click",$=!1,I=t.observable(),P=!1,H=[],D=0;R.m=function(e,t,n){!f(e)||t&&!f(t)?t?this.r(e,t):this.r("@",e):d(e,t,n||!1)},R.s=function(){this.off("*"),this.$=[]},R.e=function(e){this.$.concat("@").some(function(t){var n=("@"==t?v:y)(u(e),u(t));if("undefined"!=typeof n)return this[T].apply(null,[t].concat(n)),P=!0},this)},R.r=function(e,t){"@"!=e&&(e="/"+u(e),this.$.push(e)),this.on(e,t)};var F=new a,B=F.m.bind(F);B.create=function(){var e=new a,t=e.m.bind(e);return t.stop=e.s.bind(e),t},B.base=function(e){h=e||"#",m=s()},B.exec=function(){l(!0)},B.parser=function(e,t){e||t||(v=n,y=r),e&&(v=e),t&&(y=t)},B.query=function(){var e={},t=A.href||m;return t[C](/[?&](.+?)=([^&]*)/g,function(t,n,r){e[n]=r}),e},B.stop=function(){$&&(M&&(M[w](O,g),M[w](L,g),S[w](k,p)),I[T]("stop"),$=!1)},B.start=function(e){$||(M&&("complete"==document.readyState?i(e):M[_]("load",function(){setTimeout(function(){i(e)},1)})),$=!0)},B.base(),B.parser(),t.route=B}(z);var pe=function(e){function t(e){return e}function n(e,t){return t||(t=b),new RegExp(e.source.replace(/{/g,t[2]).replace(/}/g,t[3]),e.global?c:"")}function r(e){if(e===m)return v;var t=e.split(" ");if(2!==t.length||d.test(e))throw new Error('Unsupported brackets "'+e+'"');return t=t.concat(e.replace(g,"\\").split(" ")),t[4]=n(t[1].length>1?/{[\S\s]*?}/:v[4],t),t[5]=n(e.length>3?/\\({|})/g:v[5],t),t[6]=n(v[6],t),t[7]=RegExp("\\\\("+t[3]+")|([[({])|("+t[3]+")|"+p,c),t[8]=e,t}function o(e){return e instanceof RegExp?u(e):b[e]}function i(e){(e||(e=m))!==b[8]&&(b=r(e),u=e===m?t:n,b[9]=u(v[9])),y=e}function a(e){var t;e=e||{},t=e.brackets,Object.defineProperty(e,"brackets",{set:i,get:function(){return y},enumerable:!0}),f=e,i(t)}var u,f,c="g",s=/\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,l=/"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,p=l.source+"|"+/(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source+"|"+/\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,d=RegExp("[\\x00-\\x1F<>a-zA-Z0-9'\",;\\\\]"),g=/(?=[[\]()*+?.^$|])/g,h={"(":RegExp("([()])|"+p,c),"[":RegExp("([[\\]])|"+p,c),"{":RegExp("([{}])|"+p,c)},m="{ }",v=["{","}","{","}",/{[^}]*}/,/\\([{}])/g,/\\({)|{/g,RegExp("\\\\(})|([[({])|(})|"+p,c),m,/^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,/(^|[^\\]){=[\S\s]*?}/],y=e,b=[];return o.split=function(e,t,n){function r(e){t||a?c.push(e&&e.replace(n[5],"$1")):c.push(e)}function o(e,t,n){var r,o=h[t];for(o.lastIndex=n,n=1;(r=o.exec(e))&&(!r[1]||(r[1]===t?++n:--n)););return n?e.length:o.lastIndex}n||(n=b);var i,a,u,f,c=[],s=n[6];for(a=u=s.lastIndex=0;i=s.exec(e);){if(f=i.index,a){if(i[2]){s.lastIndex=o(e,i[2],s.lastIndex);continue}if(!i[3])continue}i[1]||(r(e.slice(u,f)),u=s.lastIndex,s=n[6+(a^=1)],s.lastIndex=u)}return e&&u<e.length&&r(e.slice(u)),c},o.hasExpr=function(e){return b[4].test(e)},o.loopKeys=function(e){var t=e.match(b[9]);return t?{key:t[1],pos:t[2],val:b[0]+t[3].trim()+b[1]}:{val:e.trim()}},o.array=function(e){return e?r(e):b},Object.defineProperty(o,"settings",{set:a,get:function(){return f}}),o.settings="undefined"!=typeof z&&z.settings||{},o.set=i,o.R_STRINGS=l,o.R_MLCOMMS=s,o.S_QBLOCKS=p,o}(),de=function(){function t(e,t){return e?(u[e]||(u[e]=r(e))).call(t,n):e}function n(e,n){t.errorHandler&&(e.riotData={tagName:n&&n.root&&n.root.tagName,_riot_id:n&&n._riot_id},t.errorHandler(e))}function r(e){var t=o(e);return"try{return "!==t.slice(0,11)&&(t="return "+t),new Function("E",t+";")}function o(e){var t,n=[],r=pe.split(e.replace(l,'"'),1);if(r.length>2||r[0]){var o,a,u=[];for(o=a=0;o<r.length;++o)t=r[o],t&&(t=1&o?i(t,1,n):'"'+t.replace(/\\/g,"\\\\").replace(/\r\n?|\n/g,"\\n").replace(/"/g,'\\"')+'"')&&(u[a++]=t);t=a<2?u[0]:"["+u.join(",")+'].join("")'}else t=i(r[1],0,n);return n[0]&&(t=t.replace(p,function(e,t){return n[t].replace(/\r/g,"\\r").replace(/\n/g,"\\n")})),t}function i(e,t,n){function r(t,n){var r,o=1,i=d[t];for(i.lastIndex=n.lastIndex;r=i.exec(e);)if(r[0]===t)++o;else if(!--o)break;n.lastIndex=o?e.length:i.lastIndex}if(e=e.replace(s,function(e,t){return e.length>2&&!t?f+(n.push(e)-1)+"~":e}).replace(/\s+/g," ").trim().replace(/\ ?([[\({},?\.:])\ ?/g,"$1")){for(var o,i=[],u=0;e&&(o=e.match(c))&&!o.index;){var l,p,g=/,|([[{(])|$/g;for(e=RegExp.rightContext,l=o[2]?n[o[2]].slice(1,-1).trim().replace(/\s+/g," "):o[1];p=(o=g.exec(e))[1];)r(p,g);p=e.slice(0,o.index),e=RegExp.rightContext,i[u++]=a(p,1,l)}e=u?u>1?"["+i.join(",")+'].join(" ").trim()':i[0]:a(e,t)}return e}function a(e,t,n){var r;return e=e.replace(h,function(e,t,n,o,i){return n&&(o=r?0:o+e.length,"this"!==n&&"global"!==n&&"window"!==n?(e=t+'("'+n+g+n,o&&(r="."===(i=i[o])||"("===i||"["===i)):o&&(r=!m.test(i.slice(o)))),e}),r&&(e="try{return "+e+"}catch(e){E(e,this)}"),n?e=(r?"function(){"+e+"}.call(this)":"("+e+")")+'?"'+n+'":""':t&&(e="function(v){"+(r?e.replace("return ","v="):"v=("+e+")")+';return v||v===0?v:""}.call(this)'),e}var u={};t.haveRaw=pe.hasRaw,t.hasExpr=pe.hasExpr,t.loopKeys=pe.loopKeys,t.clearCache=function(){u={}},t.errorHandler=null;var f=String.fromCharCode(8279),c=/^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,s=RegExp(pe.S_QBLOCKS,"g"),l=/\u2057/g,p=/\u2057(\d+)~/g,d={"(":/[()]/g,"[":/[[\]]/g,"{":/[{}]/g},g='"in this?this:'+("object"!=typeof e?"global":"window")+").",h=/[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,m=/^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;return t.version=pe.version="v2.4.2",t}(),ge=function e(){function e(e,r){var o=e&&e.match(/^\s*<([-\w]+)/),i=o&&o[1].toLowerCase(),a=D("div",y(i));return e=n(e,r),f.test(i)?a=t(a,e,i):v(a,e),a.stub=!0,a}function t(e,t,n){var r="o"===n[0],o=r?"select>":"table>";if(e.innerHTML="<"+o+t.trim()+"</"+o,o=e.firstChild,r)o.selectedIndex=-1;else{var i=u[n];i&&1===o.childElementCount&&(o=B(i,o))}return o}function n(e,t){if(!r.test(e))return e;var n={};return t=t&&t.replace(i,function(e,t,r){return n[t]=n[t]||r,""}).trim(),e.replace(a,function(e,t,r){return n[t]||r||""}).replace(o,function(e,n){return t||n||""})}var r=/<yield\b/i,o=/<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/gi,i=/<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/gi,a=/<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/gi,u={tr:"tbody",th:"tr",td:"tr",col:"colgroup"},f=se&&se<10?ue:/^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;return e}(),he=function(t){if(!e)return{add:function(){},inject:function(){}};var n=function(){var e=D("style");N(e,"type","text/css");var t=B("style[type=riot]");return t?(t.id&&(e.id=t.id),t.parentNode.replaceChild(e,t)):document.getElementsByTagName("head")[0].appendChild(e),e}(),r=n.styleSheet,o="";return Object.defineProperty(t,"styleNode",{value:n,writable:!0}),{add:function(e){o+=e},inject:function(){o&&(r?r.cssText+=o:n.innerHTML+=o,o="")}}}(z),me=function(e){var t=e.requestAnimationFrame||e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame;if(!t||/iP(ad|hone|od).*OS 6/.test(e.navigator.userAgent)){var n=0;t=function(e){var t=Date.now(),r=Math.max(16-(t-n),0);setTimeout(function(){e(n=t+r)},r)}}return t}(e||{});z.util={brackets:pe,tmpl:de},z.mixin=function(){var e={},t=e[X]={},n=0;return function(r,o,i){if(b(r))return void z.mixin("__unnamed_"+n++,r,!0);var a=i?t:e;if(!o){if(typeof a[r]===re)throw new Error("Unregistered mixin: "+r);return a[r]}h(o)?(j(o.prototype,a[r]||{}),a[r]=o):a[r]=j(a[r]||{},o)}}(),z.tag=function(e,t,n,r,o){return h(r)&&(o=r,/^[\w\-]+\s?=/.test(n)?(r=n,n=""):r=""),n&&(h(n)?o=n:he.add(n)),e=e.toLowerCase(),W[e]={name:e,tmpl:t,attrs:r,fn:o},e},z.tag2=function(e,t,n,r,o){return n&&he.add(n),W[e]={name:e,tmpl:t,attrs:r,fn:o},e},z.mount=function(e,t,n){function r(e){var t="";return g(e,function(e){/[^-\w]/.test(e)||(e=e.trim().toLowerCase(),t+=",["+ee+'="'+e+'"],['+J+'="'+e+'"]')}),t}function o(){var e=Object.keys(W);return e+r(e)}function i(e){if(e.tagName){var r=_(e,ee)||_(e,J);t&&r!==t&&(r=t,N(e,ee,t),N(e,J,t));var o=V(e,r||e.tagName.toLowerCase(),n);o&&f.push(o)}else e.length&&g(e,i)}var a,u,f=[];if(he.inject(),b(t)&&(n=t,t=0),typeof e===te?("*"===e?e=u=o():e+=r(e.split(/, */)),a=e?F(e):[]):a=e,"*"===t){if(t=u||o(),a.tagName)a=F(t,a);else{var c=[];g(a,function(e){c.push(F(t,e))}),a=c}t=0}return i(a),f},z.update=function(){return g(Q,function(e){e.update()})},z.vdom=Q,z.Tag=s,typeof exports===ne?module.exports=z:typeof define===oe&&typeof define.amd!==re?define(function(){return z}):e.riot=z}("undefined"!=typeof window?window:void 0);
}


__FILE__61b93e9c3b6517001339a50d = "assets/shared/lib/nanoajax.js";// Best place to find information on XHR features is:
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

var reqfields = ["responseType", "withCredentials", "timeout", "onprogress"];

// Simple and small ajax function
// Takes a parameters object and a callback function
// Parameters:
//  - url: string, required
//  - headers: object of `{header_name: header_value, ...}`
//  - body:
//      + string (sets content type to 'application/x-www-form-urlencoded' if not set in headers)
//      + FormData (doesn't set content type so that browser will set as appropriate)
//  - method: 'GET', 'POST', etc. Defaults to 'GET' or 'POST' based on body
//  - cors: If your using cross-origin, you will need this true for IE8-9
//
// The following parameters are passed onto the xhr object.
// IMPORTANT NOTE: The caller is responsible for compatibility checking.
//  - responseType: string, various compatability, see xhr docs for enum options
//  - withCredentials: boolean, IE10+, CORS only
//  - timeout: long, ms timeout, IE8+
//  - onprogress: callback, IE10+
//
// Callback function prototype:
//  - statusCode from request
//    + Possibly null or 0 (i.e. falsy) if an error occurs
//  - response
//    + if responseType set and supported by browser, this is an object of some type (see docs)
//    + otherwise if request completed, this is the string text of the response
//    + if request is aborted, this is "Abort"
//    + if request times out, this is "Timeout"
//    + if request errors before completing (probably a CORS issue), this is "Error"
//  - request object
//
// Returns the request object. So you can call .abort() or other methods
//
// DEPRECATIONS:
//  - Passing a string instead of the params object has been removed!
//
var nanoajax = {};

nanoajax.ajax = function(params, callback) {
    // Any variable used more than once is var'd here because
    // minification will munge the variables whereas it can't munge
    // the object access.
    var headers = params.headers || {},
        body = params.body,
        method = params.method || (body ? "POST" : "GET"),
        called = false;

    var req = getRequest(params.cors);

    function cb(statusCode, responseText) {
        return function() {
            if (!called) {
                callback(
                    req.status === undefined ? statusCode : req.status,
                    req.status === 0 ? "Error" : req.response || req.responseText || responseText,
                    req
                );
                called = true;
            }
        };
    }

    req.open(method, params.url, true);

    var success = (req.onload = cb(200));
    req.onreadystatechange = function() {
        if (req.readyState === 4) success();
    };
    req.onerror = cb(null, "Error");
    req.ontimeout = cb(null, "Timeout");
    req.onabort = cb(null, "Abort");

    if (body) {
        setDefault(headers, "X-Requested-With", "XMLHttpRequest");

        if (!(body instanceof String) && (!window.FormData || !(body instanceof window.FormData))) {
            // assume a pojo means to send a JSON post.
            setDefault(headers, "Content-Type", "application/json;charset=UTF-8");
            body = JSON.stringify(body);
        } else if (!window.FormData || !(body instanceof window.FormData)) {
            setDefault(headers, "Content-Type", "application/x-www-form-urlencoded");
        }
    }

    for (var i = 0, len = reqfields.length, field; i < len; i++) {
        field = reqfields[i];
        if (params[field] !== undefined) req[field] = params[field];
    }

    for (var field in headers) req.setRequestHeader(field, headers[field]);

    req.send(body);

    return req;
};

function getRequest(cors) {
    // XDomainRequest is only way to do CORS in IE 8 and 9
    // But XDomainRequest isn't standards-compatible
    // Notably, it doesn't allow cookies to be sent or set by servers
    // IE 10+ is standards-compatible in its XMLHttpRequest
    // but IE 10 can still have an XDomainRequest object, so we don't want to use it
    if (cors && window.XDomainRequest && !/MSIE 1/.test(navigator.userAgent)) return new XDomainRequest();
    if (window.XMLHttpRequest) return new XMLHttpRequest();
}

function setDefault(obj, key, value) {
    obj[key] = obj[key] || value;
}


__FILE__61b93e9c3b6517001339a50d = "assets/shared/lib/ondomready.js";

/*! 
 * onDomReady.js 1.2 (c) 2012 Tubal Martin - MIT license
 */
!function (definition) {
    window.onDomReady = definition();
}(function() {
    
    'use strict';

    var win = window,
        doc = win.document,
        docElem = doc.documentElement,

        FALSE = false,
        COMPLETE = "complete",
        READYSTATE = "readyState",
        ATTACHEVENT = "attachEvent",
        ADDEVENTLISTENER = "addEventListener",
        DOMCONTENTLOADED = "DOMContentLoaded",
        ONREADYSTATECHANGE = "onreadystatechange",

        // W3C Event model
        w3c = ADDEVENTLISTENER in doc,
        top = FALSE,

        // isReady: Is the DOM ready to be used? Set to true once it occurs.
        isReady = FALSE,

        // Callbacks pending execution until DOM is ready
        callbacks = [];
    
    // Handle when the DOM is ready
    function ready( fn ) {
        if ( !isReady ) {
            
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !doc.body ) {
                return defer( ready );
            }
            
            // Remember that the DOM is ready
            isReady = true;

            // Execute all callbacks
            while ( fn = callbacks.shift() ) {
                defer( fn );
            }
        }    
    }

    // The document ready event handler
    function DOMContentLoadedHandler() {
        if ( w3c ) {
            doc.removeEventListener( DOMCONTENTLOADED, DOMContentLoadedHandler, FALSE );
            ready();
        } else if ( doc[READYSTATE] === COMPLETE ) {
            // we're here because readyState === "complete" in oldIE
            // which is good enough for us to call the dom ready!
            doc.detachEvent( ONREADYSTATECHANGE, DOMContentLoadedHandler );
            ready();
        }
    }
    
    // Defers a function, scheduling it to run after the current call stack has cleared.
    function defer( fn, wait ) {
        // Allow 0 to be passed
        setTimeout( fn, +wait >= 0 ? wait : 1 );
    }
    
    // Attach the listeners:

    // Catch cases where onDomReady is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( doc[READYSTATE] === COMPLETE ) {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        defer( ready );

    // Standards-based browsers support DOMContentLoaded    
    } else if ( w3c ) {
        // Use the handy event callback
        doc[ADDEVENTLISTENER]( DOMCONTENTLOADED, DOMContentLoadedHandler, FALSE );

        // A fallback to window.onload, that will always work
        win[ADDEVENTLISTENER]( "load", ready, FALSE );

    // If IE event model is used
    } else {            
        // ensure firing before onload,
        // maybe late but safe also for iframes
        doc[ATTACHEVENT]( ONREADYSTATECHANGE, DOMContentLoadedHandler );

        // A fallback to window.onload, that will always work
        win[ATTACHEVENT]( "onload", ready );

        // If IE and not a frame
        // continually check to see if the document is ready
        try {
            top = win.frameElement == null && docElem;
        } catch(e) {}

        if ( top && top.doScroll ) {
            (function doScrollCheck() {
                if ( !isReady ) {
                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        top.doScroll("left");
                    } catch(e) {
                        return defer( doScrollCheck, 50 );
                    }

                    // and execute any waiting functions
                    ready();
                }
            })();
        } 
    } 
    
    function onDomReady( fn ) { 
        // If DOM is ready, execute the function (async), otherwise wait
        isReady ? defer( fn ) : callbacks.push( fn );
    }
    
    // Add version
    onDomReady.version = "1.2";
    
    return onDomReady;
});


__FILE__61b93e9c3b6517001339a50d = "assets/shared/lib/serialize-form.js";var serialize_formdata = function(el){
  var inputs = el.querySelectorAll('input,select,textarea');
  // console.log('inputs', inputs, el);
  var data = {};
  for(var i=0; i< inputs.length; i++){
    switch(inputs[i].type){
        case 'file':
                    var file = inputs[i].files[0];
                    if(file){
                      var oReader = new FileReader();
                      (function(i){
                        oReader.onload = function(e){
                          data[inputs[i].name] = e.target.result;
                          alert(JSON.stringify(data));
                          document.querySelector('p').innerHTML = JSON.stringify(data);
                          console.dir(data);
                    };
                    oReader.readAsDataURL(file);
                    })(i)
                    }

                    break;
        case 'checkbox':
                    data[inputs[i].name] = inputs[i].checked;
                    break;
        case 'radio':
                    if (inputs[i].checked) {
                      data[inputs[i].name] = inputs[i].value;
                    }
                    break;
        default:
                    data[inputs[i].name] = inputs[i].value;

    }
  }
  return data;
}


__FILE__61b93e9c3b6517001339a50d = "assets/shared/lib/socket.io.js";/*!
 * Socket.IO v2.1.1
 * (c) 2014-2018 Guillermo Rauch
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.io=e():t.io=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t,e){"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{};var n,r=i(t),s=r.source,p=r.id,h=r.path,f=u[p]&&h in u[p].nsps,l=e.forceNew||e["force new connection"]||!1===e.multiplex||f;return l?(c("ignoring socket cache for %s",s),n=a(s,e)):(u[p]||(c("new io instance for %s",s),u[p]=a(s,e)),n=u[p]),r.query&&!e.query&&(e.query=r.query),n.socket(r.path,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(1),s=n(7),a=n(12),c=n(3)("socket.io-client");t.exports=e=r;var u=e.managers={};e.protocol=s.protocol,e.connect=r,e.Manager=n(12),e.Socket=n(37)},function(t,e,n){(function(e){"use strict";function r(t,n){var r=t;n=n||e.location,null==t&&(t=n.protocol+"//"+n.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?n.protocol+t:n.host+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t="undefined"!=typeof n?n.protocol+"//"+t:"https://"+t),i("parse %s",t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var s=r.host.indexOf(":")!==-1,a=s?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+a+":"+r.port,r.href=r.protocol+"://"+a+(n&&n.port===r.port?"":":"+r.port),r}var o=n(2),i=n(3)("socket.io-client:url");t.exports=r}).call(e,function(){return this}())},function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=n.exec(t||""),a={},c=14;c--;)a[r[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},function(t,e,n){(function(r){function o(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function i(t){var n=this.useColors;if(t[0]=(n?"%c":"")+this.namespace+(n?" %c":" ")+t[0]+(n?"%c ":" ")+"+"+e.humanize(this.diff),n){var r="color: "+this.color;t.splice(1,0,r,"color: inherit");var o=0,i=0;t[0].replace(/%[a-zA-Z%]/g,function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,r)}}function s(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function a(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(n){}}function c(){var t;try{t=e.storage.debug}catch(n){}return!t&&"undefined"!=typeof r&&"env"in r&&(t=r.env.DEBUG),t}function u(){try{return window.localStorage}catch(t){}}e=t.exports=n(5),e.log=s,e.formatArgs=i,e.save=a,e.load=c,e.useColors=o,e.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:u(),e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},e.enable(c())}).call(e,n(4))},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(t){if(p===setTimeout)return setTimeout(t,0);if((p===n||!p)&&setTimeout)return p=setTimeout,setTimeout(t,0);try{return p(t,0)}catch(e){try{return p.call(null,t,0)}catch(e){return p.call(this,t,0)}}}function i(t){if(h===clearTimeout)return clearTimeout(t);if((h===r||!h)&&clearTimeout)return h=clearTimeout,clearTimeout(t);try{return h(t)}catch(e){try{return h.call(null,t)}catch(e){return h.call(this,t)}}}function s(){y&&l&&(y=!1,l.length?d=l.concat(d):m=-1,d.length&&a())}function a(){if(!y){var t=o(s);y=!0;for(var e=d.length;e;){for(l=d,d=[];++m<e;)l&&l[m].run();m=-1,e=d.length}l=null,y=!1,i(t)}}function c(t,e){this.fun=t,this.array=e}function u(){}var p,h,f=t.exports={};!function(){try{p="function"==typeof setTimeout?setTimeout:n}catch(t){p=n}try{h="function"==typeof clearTimeout?clearTimeout:r}catch(t){h=r}}();var l,d=[],y=!1,m=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];d.push(new c(t,e)),1!==d.length||y||o(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=u,f.addListener=u,f.once=u,f.off=u,f.removeListener=u,f.removeAllListeners=u,f.emit=u,f.prependListener=u,f.prependOnceListener=u,f.listeners=function(t){return[]},f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e,n){function r(t){var n,r=0;for(n in t)r=(r<<5)-r+t.charCodeAt(n),r|=0;return e.colors[Math.abs(r)%e.colors.length]}function o(t){function n(){if(n.enabled){var t=n,r=+new Date,i=r-(o||r);t.diff=i,t.prev=o,t.curr=r,o=r;for(var s=new Array(arguments.length),a=0;a<s.length;a++)s[a]=arguments[a];s[0]=e.coerce(s[0]),"string"!=typeof s[0]&&s.unshift("%O");var c=0;s[0]=s[0].replace(/%([a-zA-Z%])/g,function(n,r){if("%%"===n)return n;c++;var o=e.formatters[r];if("function"==typeof o){var i=s[c];n=o.call(t,i),s.splice(c,1),c--}return n}),e.formatArgs.call(t,s);var u=n.log||e.log||console.log.bind(console);u.apply(t,s)}}var o;return n.namespace=t,n.enabled=e.enabled(t),n.useColors=e.useColors(),n.color=r(t),n.destroy=i,"function"==typeof e.init&&e.init(n),e.instances.push(n),n}function i(){var t=e.instances.indexOf(this);return t!==-1&&(e.instances.splice(t,1),!0)}function s(t){e.save(t),e.names=[],e.skips=[];var n,r=("string"==typeof t?t:"").split(/[\s,]+/),o=r.length;for(n=0;n<o;n++)r[n]&&(t=r[n].replace(/\*/g,".*?"),"-"===t[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")));for(n=0;n<e.instances.length;n++){var i=e.instances[n];i.enabled=e.enabled(i.namespace)}}function a(){e.enable("")}function c(t){if("*"===t[t.length-1])return!0;var n,r;for(n=0,r=e.skips.length;n<r;n++)if(e.skips[n].test(t))return!1;for(n=0,r=e.names.length;n<r;n++)if(e.names[n].test(t))return!0;return!1}function u(t){return t instanceof Error?t.stack||t.message:t}e=t.exports=o.debug=o["default"]=o,e.coerce=u,e.disable=a,e.enable=s,e.enabled=c,e.humanize=n(6),e.instances=[],e.names=[],e.skips=[],e.formatters={}},function(t,e){function n(t){if(t=String(t),!(t.length>100)){var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(e){var n=parseFloat(e[1]),r=(e[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return n*p;case"days":case"day":case"d":return n*u;case"hours":case"hour":case"hrs":case"hr":case"h":return n*c;case"minutes":case"minute":case"mins":case"min":case"m":return n*a;case"seconds":case"second":case"secs":case"sec":case"s":return n*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}}}function r(t){return t>=u?Math.round(t/u)+"d":t>=c?Math.round(t/c)+"h":t>=a?Math.round(t/a)+"m":t>=s?Math.round(t/s)+"s":t+"ms"}function o(t){return i(t,u,"day")||i(t,c,"hour")||i(t,a,"minute")||i(t,s,"second")||t+" ms"}function i(t,e,n){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}var s=1e3,a=60*s,c=60*a,u=24*c,p=365.25*u;t.exports=function(t,e){e=e||{};var i=typeof t;if("string"===i&&t.length>0)return n(t);if("number"===i&&isNaN(t)===!1)return e["long"]?o(t):r(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e,n){function r(){}function o(t){var n=""+t.type;if(e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(n+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(n+=t.nsp+","),null!=t.id&&(n+=t.id),null!=t.data){var r=i(t.data);if(r===!1)return g;n+=r}return f("encoded %j as %s",t,n),n}function i(t){try{return JSON.stringify(t)}catch(e){return!1}}function s(t,e){function n(t){var n=d.deconstructPacket(t),r=o(n.packet),i=n.buffers;i.unshift(r),e(i)}d.removeBlobs(t,n)}function a(){this.reconstructor=null}function c(t){var n=0,r={type:Number(t.charAt(0))};if(null==e.types[r.type])return h("unknown packet type "+r.type);if(e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type){for(var o="";"-"!==t.charAt(++n)&&(o+=t.charAt(n),n!=t.length););if(o!=Number(o)||"-"!==t.charAt(n))throw new Error("Illegal attachments");r.attachments=Number(o)}if("/"===t.charAt(n+1))for(r.nsp="";++n;){var i=t.charAt(n);if(","===i)break;if(r.nsp+=i,n===t.length)break}else r.nsp="/";var s=t.charAt(n+1);if(""!==s&&Number(s)==s){for(r.id="";++n;){var i=t.charAt(n);if(null==i||Number(i)!=i){--n;break}if(r.id+=t.charAt(n),n===t.length)break}r.id=Number(r.id)}if(t.charAt(++n)){var a=u(t.substr(n)),c=a!==!1&&(r.type===e.ERROR||y(a));if(!c)return h("invalid payload");r.data=a}return f("decoded %s as %j",t,r),r}function u(t){try{return JSON.parse(t)}catch(e){return!1}}function p(t){this.reconPack=t,this.buffers=[]}function h(t){return{type:e.ERROR,data:"parser error: "+t}}var f=n(3)("socket.io-parser"),l=n(8),d=n(9),y=n(10),m=n(11);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=r,e.Decoder=a;var g=e.ERROR+'"encode error"';r.prototype.encode=function(t,n){if(f("encoding packet %j",t),e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)s(t,n);else{var r=o(t);n([r])}},l(a.prototype),a.prototype.add=function(t){var n;if("string"==typeof t)n=c(t),e.BINARY_EVENT===n.type||e.BINARY_ACK===n.type?(this.reconstructor=new p(n),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",n)):this.emit("decoded",n);else{if(!m(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");n=this.reconstructor.takeBinaryData(t),n&&(this.reconstructor=null,this.emit("decoded",n))}},a.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},p.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=d.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},p.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},function(t,e,n){function r(t){if(t)return o(t)}function o(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n){n=n.slice(0);for(var r=0,o=n.length;r<o;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,n){(function(t){function r(t,e){if(!t)return t;if(s(t)){var n={_placeholder:!0,num:e.length};return e.push(t),n}if(i(t)){for(var o=new Array(t.length),a=0;a<t.length;a++)o[a]=r(t[a],e);return o}if("object"==typeof t&&!(t instanceof Date)){var o={};for(var c in t)o[c]=r(t[c],e);return o}return t}function o(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(i(t))for(var n=0;n<t.length;n++)t[n]=o(t[n],e);else if("object"==typeof t)for(var r in t)t[r]=o(t[r],e);return t}var i=n(10),s=n(11),a=Object.prototype.toString,c="function"==typeof t.Blob||"[object BlobConstructor]"===a.call(t.Blob),u="function"==typeof t.File||"[object FileConstructor]"===a.call(t.File);e.deconstructPacket=function(t){var e=[],n=t.data,o=t;return o.data=r(n,e),o.attachments=e.length,{packet:o,buffers:e}},e.reconstructPacket=function(t,e){return t.data=o(t.data,e),t.attachments=void 0,t},e.removeBlobs=function(t,e){function n(t,a,p){if(!t)return t;if(c&&t instanceof Blob||u&&t instanceof File){r++;var h=new FileReader;h.onload=function(){p?p[a]=this.result:o=this.result,--r||e(o)},h.readAsArrayBuffer(t)}else if(i(t))for(var f=0;f<t.length;f++)n(t[f],f,t);else if("object"==typeof t&&!s(t))for(var l in t)n(t[l],l,t)}var r=0,o=t;n(o),r||e(o)}}).call(e,function(){return this}())},function(t,e){var n={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},function(t,e){(function(e){function n(t){return r&&e.Buffer.isBuffer(t)||o&&(t instanceof e.ArrayBuffer||i(t))}t.exports=n;var r="function"==typeof e.Buffer&&"function"==typeof e.Buffer.isBuffer,o="function"==typeof e.ArrayBuffer,i=function(){return o&&"function"==typeof e.ArrayBuffer.isView?e.ArrayBuffer.isView:function(t){return t.buffer instanceof e.ArrayBuffer}}()}).call(e,function(){return this}())},function(t,e,n){"use strict";function r(t,e){if(!(this instanceof r))return new r(t,e);t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new l({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var n=e.parser||c;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(13),s=n(37),a=n(8),c=n(7),u=n(39),p=n(40),h=n(3)("socket.io-client:manager"),f=n(36),l=n(41),d=Object.prototype.hasOwnProperty;t.exports=r,r.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)d.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},r.prototype.updateSocketIds=function(){for(var t in this.nsps)d.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},r.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},a(r.prototype),r.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},r.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},r.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},r.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},r.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},r.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},r.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},r.prototype.open=r.prototype.connect=function(t,e){if(h("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;h("opening %s",this.uri),this.engine=i(this.uri,this.opts);var n=this.engine,r=this;this.readyState="opening",this.skipReconnect=!1;var o=u(n,"open",function(){r.onopen(),t&&t()}),s=u(n,"error",function(e){if(h("connect_error"),r.cleanup(),r.readyState="closed",r.emitAll("connect_error",e),t){var n=new Error("Connection error");n.data=e,t(n)}else r.maybeReconnectOnOpen()});if(!1!==this._timeout){var a=this._timeout;h("connect attempt will timeout after %d",a);var c=setTimeout(function(){h("connect attempt timed out after %d",a),o.destroy(),n.close(),n.emit("error","timeout"),r.emitAll("connect_timeout",a)},a);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(s),this},r.prototype.onopen=function(){h("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(u(t,"data",p(this,"ondata"))),this.subs.push(u(t,"ping",p(this,"onping"))),this.subs.push(u(t,"pong",p(this,"onpong"))),this.subs.push(u(t,"error",p(this,"onerror"))),this.subs.push(u(t,"close",p(this,"onclose"))),this.subs.push(u(this.decoder,"decoded",p(this,"ondecoded")))},r.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},r.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},r.prototype.ondata=function(t){this.decoder.add(t)},r.prototype.ondecoded=function(t){this.emit("packet",t)},r.prototype.onerror=function(t){h("error",t),this.emitAll("error",t)},r.prototype.socket=function(t,e){function n(){~f(o.connecting,r)||o.connecting.push(r)}var r=this.nsps[t];if(!r){r=new s(this,t,e),this.nsps[t]=r;var o=this;r.on("connecting",n),r.on("connect",function(){r.id=o.generateId(t)}),this.autoConnect&&n()}return r},r.prototype.destroy=function(t){var e=f(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},r.prototype.packet=function(t){h("writing packet %j",t);var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(n){for(var r=0;r<n.length;r++)e.engine.write(n[r],t.options);e.encoding=!1,e.processPacketQueue()}))},r.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},r.prototype.cleanup=function(){h("cleanup");for(var t=this.subs.length,e=0;e<t;e++){var n=this.subs.shift();n.destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},r.prototype.close=r.prototype.disconnect=function(){h("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},r.prototype.onclose=function(t){h("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},r.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)h("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();h("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout(function(){t.skipReconnect||(h("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(h("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(h("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(n)}})}},r.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},function(t,e,n){t.exports=n(14),t.exports.parser=n(21)},function(t,e,n){(function(e){function r(t,n){if(!(this instanceof r))return new r(t,n);n=n||{},t&&"object"==typeof t&&(n=t,t=null),t?(t=p(t),n.hostname=t.host,n.secure="https"===t.protocol||"wss"===t.protocol,n.port=t.port,t.query&&(n.query=t.query)):n.host&&(n.hostname=p(n.host).host),this.secure=null!=n.secure?n.secure:e.location&&"https:"===location.protocol,n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.agent=n.agent||!1,this.hostname=n.hostname||(e.location?location.hostname:"localhost"),this.port=n.port||(e.location&&location.port?location.port:this.secure?443:80),this.query=n.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==n.upgrade,this.path=(n.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!n.forceJSONP,this.jsonp=!1!==n.jsonp,this.forceBase64=!!n.forceBase64,this.enablesXDR=!!n.enablesXDR,this.timestampParam=n.timestampParam||"t",this.timestampRequests=n.timestampRequests,this.transports=n.transports||["polling","websocket"],this.transportOptions=n.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=n.policyPort||843,this.rememberUpgrade=n.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=n.onlyBinaryUpgrades,this.perMessageDeflate=!1!==n.perMessageDeflate&&(n.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=n.pfx||null,this.key=n.key||null,this.passphrase=n.passphrase||null,this.cert=n.cert||null,this.ca=n.ca||null,this.ciphers=n.ciphers||null,this.rejectUnauthorized=void 0===n.rejectUnauthorized||n.rejectUnauthorized,this.forceNode=!!n.forceNode;var o="object"==typeof e&&e;o.global===o&&(n.extraHeaders&&Object.keys(n.extraHeaders).length>0&&(this.extraHeaders=n.extraHeaders),n.localAddress&&(this.localAddress=n.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open()}function o(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var i=n(15),s=n(8),a=n(3)("engine.io-client:socket"),c=n(36),u=n(21),p=n(2),h=n(30);t.exports=r,r.priorWebsocketSuccess=!1,s(r.prototype),r.protocol=u.protocol,r.Socket=r,r.Transport=n(20),r.transports=n(15),r.parser=n(21),r.prototype.createTransport=function(t){a('creating transport "%s"',t);var e=o(this.query);e.EIO=u.protocol,e.transport=t;var n=this.transportOptions[t]||{};this.id&&(e.sid=this.id);var r=new i[t]({query:e,socket:this,agent:n.agent||this.agent,hostname:n.hostname||this.hostname,port:n.port||this.port,secure:n.secure||this.secure,path:n.path||this.path,forceJSONP:n.forceJSONP||this.forceJSONP,jsonp:n.jsonp||this.jsonp,forceBase64:n.forceBase64||this.forceBase64,enablesXDR:n.enablesXDR||this.enablesXDR,timestampRequests:n.timestampRequests||this.timestampRequests,timestampParam:n.timestampParam||this.timestampParam,policyPort:n.policyPort||this.policyPort,pfx:n.pfx||this.pfx,key:n.key||this.key,passphrase:n.passphrase||this.passphrase,cert:n.cert||this.cert,ca:n.ca||this.ca,ciphers:n.ciphers||this.ciphers,rejectUnauthorized:n.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:n.perMessageDeflate||this.perMessageDeflate,extraHeaders:n.extraHeaders||this.extraHeaders,forceNode:n.forceNode||this.forceNode,localAddress:n.localAddress||this.localAddress,requestTimeout:n.requestTimeout||this.requestTimeout,protocols:n.protocols||void 0});return r},r.prototype.open=function(){var t;if(this.rememberUpgrade&&r.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(n){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},r.prototype.setTransport=function(t){a("setting transport %s",t.name);var e=this;this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},r.prototype.probe=function(t){function e(){if(f.onlyBinaryUpgrades){var e=!this.supportsBinary&&f.transport.supportsBinary;h=h||e}h||(a('probe transport "%s" opened',t),p.send([{type:"ping",data:"probe"}]),p.once("packet",function(e){if(!h)if("pong"===e.type&&"probe"===e.data){if(a('probe transport "%s" pong',t),f.upgrading=!0,f.emit("upgrading",p),!p)return;r.priorWebsocketSuccess="websocket"===p.name,a('pausing current transport "%s"',f.transport.name),f.transport.pause(function(){h||"closed"!==f.readyState&&(a("changing transport and sending upgrade packet"),u(),f.setTransport(p),p.send([{type:"upgrade"}]),f.emit("upgrade",p),p=null,f.upgrading=!1,f.flush())})}else{a('probe transport "%s" failed',t);var n=new Error("probe error");n.transport=p.name,f.emit("upgradeError",n)}}))}function n(){h||(h=!0,u(),p.close(),p=null)}function o(e){var r=new Error("probe error: "+e);r.transport=p.name,n(),a('probe transport "%s" failed because of error: %s',t,e),f.emit("upgradeError",r)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){p&&t.name!==p.name&&(a('"%s" works - aborting "%s"',t.name,p.name),n())}function u(){p.removeListener("open",e),p.removeListener("error",o),p.removeListener("close",i),f.removeListener("close",s),f.removeListener("upgrading",c)}a('probing transport "%s"',t);var p=this.createTransport(t,{probe:1}),h=!1,f=this;r.priorWebsocketSuccess=!1,p.once("open",e),p.once("error",o),p.once("close",i),this.once("close",s),this.once("upgrading",c),p.open()},r.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",r.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes");for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])}},r.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},r.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},r.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},r.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},r.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},r.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},r.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},r.prototype.write=r.prototype.send=function(t,e,n){return this.sendPacket("message",t,e,n),this},r.prototype.sendPacket=function(t,e,n,r){if("function"==typeof e&&(r=e,e=void 0),"function"==typeof n&&(r=n,n=null),"closing"!==this.readyState&&"closed"!==this.readyState){n=n||{},n.compress=!1!==n.compress;var o={type:t,data:e,options:n};this.emit("packetCreate",o),this.writeBuffer.push(o),r&&this.once("flush",r),this.flush()}},r.prototype.close=function(){function t(){r.onClose("forced close"),a("socket closing - telling transport to close"),r.transport.close()}function e(){r.removeListener("upgrade",e),r.removeListener("upgradeError",e),t()}function n(){r.once("upgrade",e),r.once("upgradeError",e)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var r=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?n():t()}):this.upgrading?n():t()}return this},r.prototype.onError=function(t){a("socket error %j",t),r.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},r.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){a('socket close with reason: "%s"',t);var n=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),n.writeBuffer=[],n.prevBufferLen=0}},r.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;n<r;n++)~c(this.transports,t[n])&&e.push(t[n]);return e}}).call(e,function(){return this}())},function(t,e,n){(function(t){function r(e){var n,r=!1,a=!1,c=!1!==e.jsonp;if(t.location){var u="https:"===location.protocol,p=location.port;
p||(p=u?443:80),r=e.hostname!==location.hostname||p!==e.port,a=e.secure!==u}if(e.xdomain=r,e.xscheme=a,n=new o(e),"open"in n&&!e.forceJSONP)return new i(e);if(!c)throw new Error("JSONP disabled");return new s(e)}var o=n(16),i=n(18),s=n(33),a=n(34);e.polling=r,e.websocket=a}).call(e,function(){return this}())},function(t,e,n){(function(e){var r=n(17);t.exports=function(t){var n=t.xdomain,o=t.xscheme,i=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!n||r))return new XMLHttpRequest}catch(s){}try{if("undefined"!=typeof XDomainRequest&&!o&&i)return new XDomainRequest}catch(s){}if(!n)try{return new(e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(s){}}}).call(e,function(){return this}())},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(n){t.exports=!1}},function(t,e,n){(function(e){function r(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,e.location){var n="https:"===location.protocol,r=location.port;r||(r=n?443:80),this.xd=t.hostname!==e.location.hostname||r!==t.port,this.xs=t.secure!==n}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=n(16),c=n(19),u=n(8),p=n(31),h=n(3)("engine.io-client:polling-xhr");t.exports=o,t.exports.Request=i,p(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this;r.on("success",e),r.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=r},o.prototype.doPoll=function(){h("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},u(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var n=this.xhr=new a(t),r=this;try{h("xhr open %s: %s",this.method,this.uri),n.open(this.method,this.uri,this.async);try{if(this.extraHeaders){n.setDisableHeaderCheck&&n.setDisableHeaderCheck(!0);for(var o in this.extraHeaders)this.extraHeaders.hasOwnProperty(o)&&n.setRequestHeader(o,this.extraHeaders[o])}}catch(s){}if("POST"===this.method)try{this.isBinary?n.setRequestHeader("Content-type","application/octet-stream"):n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(s){}try{n.setRequestHeader("Accept","*/*")}catch(s){}"withCredentials"in n&&(n.withCredentials=!0),this.requestTimeout&&(n.timeout=this.requestTimeout),this.hasXDR()?(n.onload=function(){r.onLoad()},n.onerror=function(){r.onError(n.responseText)}):n.onreadystatechange=function(){if(2===n.readyState)try{var t=n.getResponseHeader("Content-Type");r.supportsBinary&&"application/octet-stream"===t&&(n.responseType="arraybuffer")}catch(e){}4===n.readyState&&(200===n.status||1223===n.status?r.onLoad():setTimeout(function(){r.onError(n.status)},0))},h("xhr data %s",this.data),n.send(this.data)}catch(s){return void setTimeout(function(){r.onError(s)},0)}e.document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=r:this.xhr.onreadystatechange=r,t)try{this.xhr.abort()}catch(n){}e.document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(n){}t="application/octet-stream"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText}catch(n){this.onError(n)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof e.XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},i.requestsCount=0,i.requests={},e.document&&(e.attachEvent?e.attachEvent("onunload",s):e.addEventListener&&e.addEventListener("beforeunload",s,!1))}).call(e,function(){return this}())},function(t,e,n){function r(t){var e=t&&t.forceBase64;p&&!e||(this.supportsBinary=!1),o.call(this,t)}var o=n(20),i=n(30),s=n(21),a=n(31),c=n(32),u=n(3)("engine.io-client:polling");t.exports=r;var p=function(){var t=n(16),e=new t({xdomain:!1});return null!=e.responseType}();a(r,o),r.prototype.name="polling",r.prototype.doOpen=function(){this.poll()},r.prototype.pause=function(t){function e(){u("paused"),n.readyState="paused",t()}var n=this;if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(u("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){u("pre-pause polling complete"),--r||e()})),this.writable||(u("we are currently writing - waiting to pause"),r++,this.once("drain",function(){u("pre-pause writing complete"),--r||e()}))}else e()},r.prototype.poll=function(){u("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},r.prototype.onData=function(t){var e=this;u("polling got data %s",t);var n=function(t,n,r){return"opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,n),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState?this.poll():u('ignoring poll - transport state "%s"',this.readyState))},r.prototype.doClose=function(){function t(){u("writing close packet"),e.write([{type:"close"}])}var e=this;"open"===this.readyState?(u("transport open - closing"),t()):(u("transport not open - deferring close"),this.once("open",t))},r.prototype.write=function(t){var e=this;this.writable=!1;var n=function(){e.writable=!0,e.emit("drain")};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,n)})},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(n=":"+this.port),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t}},function(t,e,n){function r(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var o=n(21),i=n(8);t.exports=r,i(r.prototype),r.prototype.onError=function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this},r.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},r.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},r.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},r.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},r.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},r.prototype.onPacket=function(t){this.emit("packet",t)},r.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},function(t,e,n){(function(t){function r(t,n){var r="b"+e.packets[t.type]+t.data.data;return n(r)}function o(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return r(s.buffer)}function i(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=new FileReader;return o.onload=function(){t.data=o.result,e.encodePacket(t,n,!0,r)},o.readAsArrayBuffer(t.data)}function s(t,n,r){if(!n)return e.encodeBase64Packet(t,r);if(g)return i(t,n,r);var o=new Uint8Array(1);o[0]=v[t.type];var s=new k([o.buffer,t.data]);return r(s)}function a(t){try{t=d.decode(t,{strict:!1})}catch(e){return!1}return t}function c(t,e,n){for(var r=new Array(t.length),o=l(t.length,n),i=function(t,n,o){e(n,function(e,n){r[t]=n,o(e,r)})},s=0;s<t.length;s++)i(s,t[s],o)}var u,p=n(22),h=n(23),f=n(24),l=n(25),d=n(26);t&&t.ArrayBuffer&&(u=n(28));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),m="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),g=y||m;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=p(v),w={type:"error",data:"parser error"},k=n(29);e.encodePacket=function(e,n,i,a){"function"==typeof n&&(a=n,n=!1),"function"==typeof i&&(a=i,i=null);var c=void 0===e.data?void 0:e.data.buffer||e.data;if(t.ArrayBuffer&&c instanceof ArrayBuffer)return o(e,n,a);if(k&&c instanceof t.Blob)return s(e,n,a);if(c&&c.base64)return r(e,a);var u=v[e.type];return void 0!==e.data&&(u+=i?d.encode(String(e.data),{strict:!1}):String(e.data)),a(""+u)},e.encodeBase64Packet=function(n,r){var o="b"+e.packets[n.type];if(k&&n.data instanceof t.Blob){var i=new FileReader;return i.onload=function(){var t=i.result.split(",")[1];r(o+t)},i.readAsDataURL(n.data)}var s;try{s=String.fromCharCode.apply(null,new Uint8Array(n.data))}catch(a){for(var c=new Uint8Array(n.data),u=new Array(c.length),p=0;p<c.length;p++)u[p]=c[p];s=String.fromCharCode.apply(null,u)}return o+=t.btoa(s),r(o)},e.decodePacket=function(t,n,r){if(void 0===t)return w;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),n);if(r&&(t=a(t),t===!1))return w;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:w}var i=new Uint8Array(t),o=i[0],s=f(t,1);return k&&"blob"===n&&(s=new k([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var n=b[t.charAt(0)];if(!u)return{type:n,data:{base64:!0,data:t.substr(1)}};var r=u.decode(t.substr(1));return"blob"===e&&k&&(r=new k([r])),{type:n,data:r}},e.encodePayload=function(t,n,r){function o(t){return t.length+":"+t}function i(t,r){e.encodePacket(t,!!s&&n,!1,function(t){r(null,o(t))})}"function"==typeof n&&(r=n,n=null);var s=h(t);return n&&s?k&&!g?e.encodePayloadAsBlob(t,r):e.encodePayloadAsArrayBuffer(t,r):t.length?void c(t,i,function(t,e){return r(e.join(""))}):r("0:")},e.decodePayload=function(t,n,r){if("string"!=typeof t)return e.decodePayloadAsBinary(t,n,r);"function"==typeof n&&(r=n,n=null);var o;if(""===t)return r(w,0,1);for(var i,s,a="",c=0,u=t.length;c<u;c++){var p=t.charAt(c);if(":"===p){if(""===a||a!=(i=Number(a)))return r(w,0,1);if(s=t.substr(c+1,i),a!=s.length)return r(w,0,1);if(s.length){if(o=e.decodePacket(s,n,!1),w.type===o.type&&w.data===o.data)return r(w,0,1);var h=r(o,c+i,u);if(!1===h)return}c+=i,a=""}else a+=p}return""!==a?r(w,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){return n(null,t)})}return t.length?void c(t,r,function(t,e){var r=e.reduce(function(t,e){var n;return n="string"==typeof e?e.length:e.byteLength,t+n.toString().length+n+2},0),o=new Uint8Array(r),i=0;return e.forEach(function(t){var e="string"==typeof t,n=t;if(e){for(var r=new Uint8Array(t.length),s=0;s<t.length;s++)r[s]=t.charCodeAt(s);n=r.buffer}e?o[i++]=0:o[i++]=1;for(var a=n.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var r=new Uint8Array(n),s=0;s<r.length;s++)o[i++]=r[s]}),n(o.buffer)}):n(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o);t=r.buffer,e[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,k){var c=new k([e.buffer,a.buffer,t]);n(null,c)}})}c(t,r,function(t,e){return n(new k(e))})},e.decodePayloadAsBinary=function(t,n,r){"function"==typeof n&&(r=n,n=null);for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",u=1;255!==s[u];u++){if(c.length>310)return r(w,0,1);c+=s[u]}o=f(o,2+c.length),c=parseInt(c);var p=f(o,0,c);if(a)try{p=String.fromCharCode.apply(null,new Uint8Array(p))}catch(h){var l=new Uint8Array(p);p="";for(var u=0;u<l.length;u++)p+=String.fromCharCode(l[u])}i.push(p),o=f(o,c)}var d=i.length;i.forEach(function(t,o){r(e.decodePacket(t,n,!0),o,d)})}}).call(e,function(){return this}())},function(t,e){t.exports=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty;for(var r in t)n.call(t,r)&&e.push(r);return e}},function(t,e,n){(function(e){function r(t){if(!t||"object"!=typeof t)return!1;if(o(t)){for(var n=0,i=t.length;n<i;n++)if(r(t[n]))return!0;return!1}if("function"==typeof e.Buffer&&e.Buffer.isBuffer&&e.Buffer.isBuffer(t)||"function"==typeof e.ArrayBuffer&&t instanceof ArrayBuffer||s&&t instanceof Blob||a&&t instanceof File)return!0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return r(t.toJSON(),!0);for(var c in t)if(Object.prototype.hasOwnProperty.call(t,c)&&r(t[c]))return!0;return!1}var o=n(10),i=Object.prototype.toString,s="function"==typeof e.Blob||"[object BlobConstructor]"===i.call(e.Blob),a="function"==typeof e.File||"[object FileConstructor]"===i.call(e.File);t.exports=r}).call(e,function(){return this}())},function(t,e){t.exports=function(t,e,n){var r=t.byteLength;if(e=e||0,n=n||r,t.slice)return t.slice(e,n);if(e<0&&(e+=r),n<0&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(n-e),s=e,a=0;s<n;s++,a++)i[a]=o[s];return i.buffer}},function(t,e){function n(t,e,n){function o(t,r){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=n):0!==o.count||i||e(null,r)}var i=!1;return n=n||r,o.count=t,0===t?e():o}function r(){}t.exports=n},function(t,e,n){var r;(function(t,o){!function(i){function s(t){for(var e,n,r=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e);return r}function a(t){for(var e,n=t.length,r=-1,o="";++r<n;)e=t[r],e>65535&&(e-=65536,o+=w(e>>>10&1023|55296),e=56320|1023&e),o+=w(e);return o}function c(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function u(t,e){return w(t>>e&63|128)}function p(t,e){if(0==(4294967168&t))return w(t);var n="";return 0==(4294965248&t)?n=w(t>>6&31|192):0==(4294901760&t)?(c(t,e)||(t=65533),n=w(t>>12&15|224),n+=u(t,6)):0==(4292870144&t)&&(n=w(t>>18&7|240),n+=u(t,12),n+=u(t,6)),n+=w(63&t|128)}function h(t,e){e=e||{};for(var n,r=!1!==e.strict,o=s(t),i=o.length,a=-1,c="";++a<i;)n=o[a],c+=p(n,r);return c}function f(){if(b>=v)throw Error("Invalid byte index");var t=255&g[b];if(b++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function l(t){var e,n,r,o,i;if(b>v)throw Error("Invalid byte index");if(b==v)return!1;if(e=255&g[b],b++,0==(128&e))return e;if(192==(224&e)){if(n=f(),i=(31&e)<<6|n,i>=128)return i;throw Error("Invalid continuation byte")}if(224==(240&e)){if(n=f(),r=f(),i=(15&e)<<12|n<<6|r,i>=2048)return c(i,t)?i:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(n=f(),r=f(),o=f(),i=(7&e)<<18|n<<12|r<<6|o,i>=65536&&i<=1114111))return i;throw Error("Invalid UTF-8 detected")}function d(t,e){e=e||{};var n=!1!==e.strict;g=s(t),v=g.length,b=0;for(var r,o=[];(r=l(n))!==!1;)o.push(r);return a(o)}var y="object"==typeof e&&e,m=("object"==typeof t&&t&&t.exports==y&&t,"object"==typeof o&&o);m.global!==m&&m.window!==m||(i=m);var g,v,b,w=String.fromCharCode,k={version:"2.1.2",encode:h,decode:d};r=function(){return k}.call(e,n,e,t),!(void 0!==r&&(t.exports=r))}(this)}).call(e,n(27)(t),function(){return this}())},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){!function(){"use strict";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=new Uint8Array(256),r=0;r<t.length;r++)n[t.charCodeAt(r)]=r;e.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i="";for(n=0;n<o;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,r,o,i,s,a=.75*t.length,c=t.length,u=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var p=new ArrayBuffer(a),h=new Uint8Array(p);for(e=0;e<c;e+=4)r=n[t.charCodeAt(e)],o=n[t.charCodeAt(e+1)],i=n[t.charCodeAt(e+2)],s=n[t.charCodeAt(e+3)],h[u++]=r<<2|o>>4,h[u++]=(15&o)<<4|i>>2,h[u++]=(3&i)<<6|63&s;return p}}()},function(t,e){(function(e){function n(t){for(var e=0;e<t.length;e++){var n=t[e];if(n.buffer instanceof ArrayBuffer){var r=n.buffer;if(n.byteLength!==r.byteLength){var o=new Uint8Array(n.byteLength);o.set(new Uint8Array(r,n.byteOffset,n.byteLength)),r=o.buffer}t[e]=r}}}function r(t,e){e=e||{};var r=new i;n(t);for(var o=0;o<t.length;o++)r.append(t[o]);return e.type?r.getBlob(e.type):r.getBlob()}function o(t,e){return n(t),new Blob(t,e||{})}var i=e.BlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(e){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(e){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;t.exports=function(){return s?a?e.Blob:o:c?r:void 0}()}).call(e,function(){return this}())},function(t,e){e.encode=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},e.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;r<o;r++){var i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e){t.exports=function(t,e){var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},function(t,e){"use strict";function n(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function r(t){var e=0;for(p=0;p<t.length;p++)e=e*a+c[t.charAt(p)];return e}function o(){var t=n(+new Date);return t!==i?(u=0,i=t):t+"."+n(u++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},u=0,p=0;p<a;p++)c[s[p]]=p;o.encode=n,o.decode=r,t.exports=o},function(t,e,n){(function(e){function r(){}function o(t){i.call(this,t),this.query=this.query||{},a||(e.___eio||(e.___eio=[]),a=e.___eio),this.index=a.length;var n=this;a.push(function(t){n.onData(t)}),this.query.j=this.index,e.document&&e.addEventListener&&e.addEventListener("beforeunload",function(){n.script&&(n.script.onerror=r)},!1)}var i=n(19),s=n(31);t.exports=o;var a,c=/\n/g,u=/\\n/g;s(o,i),o.prototype.supportsBinary=!1,o.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i.prototype.doClose.call(this)},o.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n?n.parentNode.insertBefore(e,n):(document.head||document.body).appendChild(e),this.script=e;var r="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);r&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},o.prototype.doWrite=function(t,e){function n(){r(),e()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(e)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),p=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=p,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),r(),t=t.replace(u,"\\\n"),this.area.value=t.replace(c,"\\n");try{this.form.submit()}catch(h){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&n()}:this.iframe.onload=n}}).call(e,function(){return this}())},function(t,e,n){(function(e){function r(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=h&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(l=o),i.call(this,t)}var o,i=n(20),s=n(21),a=n(30),c=n(31),u=n(32),p=n(3)("engine.io-client:websocket"),h=e.WebSocket||e.MozWebSocket;if("undefined"==typeof window)try{o=n(35)}catch(f){}var l=h;l||"undefined"!=typeof window||(l=o),t.exports=r,c(r,i),r.prototype.name="websocket",r.prototype.supportsBinary=!0,r.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,n={agent:this.agent,perMessageDeflate:this.perMessageDeflate};n.pfx=this.pfx,n.key=this.key,n.passphrase=this.passphrase,n.cert=this.cert,n.ca=this.ca,n.ciphers=this.ciphers,n.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(n.headers=this.extraHeaders),this.localAddress&&(n.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket?e?new l(t,e):new l(t):new l(t,e,n)}catch(r){return this.emit("error",r)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},r.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},r.prototype.write=function(t){function n(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain")},0)}var r=this;this.writable=!1;for(var o=t.length,i=0,a=o;i<a;i++)!function(t){s.encodePacket(t,r.supportsBinary,function(i){if(!r.usingBrowserWebSocket){var s={};if(t.options&&(s.compress=t.options.compress),r.perMessageDeflate){var a="string"==typeof i?e.Buffer.byteLength(i):i.length;a<r.perMessageDeflate.threshold&&(s.compress=!1)}}try{r.usingBrowserWebSocket?r.ws.send(i):r.ws.send(i,s)}catch(c){p("websocket closed before onclose event")}--o||n()})}(t[i])},r.prototype.onClose=function(){i.prototype.onClose.call(this)},r.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=u()),this.supportsBinary||(t.b64=1),t=a.encode(t),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t},r.prototype.check=function(){return!(!l||"__initialize"in l&&this.name===r.prototype.name)}}).call(e,function(){return this}())},function(t,e){},function(t,e){var n=[].indexOf;t.exports=function(t,e){if(n)return t.indexOf(e);for(var r=0;r<t.length;++r)if(t[r]===e)return r;return-1}},function(t,e,n){"use strict";function r(t,e,n){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},n&&n.query&&(this.query=n.query),this.io.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(7),s=n(8),a=n(38),c=n(39),u=n(40),p=n(3)("socket.io-client:socket"),h=n(30),f=n(23);t.exports=e=r;var l={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},d=s.prototype.emit;s(r.prototype),r.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[c(t,"open",u(this,"onopen")),c(t,"packet",u(this,"onpacket")),c(t,"close",u(this,"onclose"))]}},r.prototype.open=r.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},r.prototype.send=function(){var t=a(arguments);return t.unshift("message"),this.emit.apply(this,t),this},r.prototype.emit=function(t){if(l.hasOwnProperty(t))return d.apply(this,arguments),this;var e=a(arguments),n={type:(void 0!==this.flags.binary?this.flags.binary:f(e))?i.BINARY_EVENT:i.EVENT,data:e};return n.options={},n.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(p("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),n.id=this.ids++),this.connected?this.packet(n):this.sendBuffer.push(n),this.flags={},this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},r.prototype.onopen=function(){if(p("transport is open - connecting"),"/"!==this.nsp)if(this.query){var t="object"===o(this.query)?h.encode(this.query):this.query;p("sending connect packet with query %s",t),this.packet({type:i.CONNECT,query:t})}else this.packet({type:i.CONNECT})},r.prototype.onclose=function(t){p("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},r.prototype.onpacket=function(t){var e=t.nsp===this.nsp,n=t.type===i.ERROR&&"/"===t.nsp;if(e||n)switch(t.type){case i.CONNECT:this.onconnect();break;case i.EVENT:this.onevent(t);break;case i.BINARY_EVENT:this.onevent(t);break;case i.ACK:this.onack(t);break;case i.BINARY_ACK:this.onack(t);break;case i.DISCONNECT:this.ondisconnect();break;case i.ERROR:this.emit("error",t.data)}},r.prototype.onevent=function(t){var e=t.data||[];p("emitting event %j",e),null!=t.id&&(p("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?d.apply(this,e):this.receiveBuffer.push(e)},r.prototype.ack=function(t){var e=this,n=!1;return function(){if(!n){n=!0;var r=a(arguments);p("sending ack %j",r),e.packet({type:f(r)?i.BINARY_ACK:i.ACK,id:t,data:r})}}},r.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(p("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):p("bad ack %s",t.id)},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},r.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)d.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},r.prototype.ondisconnect=function(){p("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},r.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},r.prototype.close=r.prototype.disconnect=function(){return this.connected&&(p("performing disconnect (%s)",this.nsp),this.packet({type:i.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},r.prototype.compress=function(t){return this.flags.compress=t,this},r.prototype.binary=function(t){return this.flags.binary=t,this}},function(t,e){function n(t,e){var n=[];e=e||0;for(var r=e||0;r<t.length;r++)n[r-e]=t[r];return n}t.exports=n},function(t,e){"use strict";function n(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}t.exports=n},function(t,e){var n=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var r=n.call(arguments,2);return function(){return e.apply(t,r.concat(n.call(arguments)))}}},function(t,e){function n(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=n,n.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},n.prototype.reset=function(){this.attempts=0},n.prototype.setMin=function(t){this.ms=t},n.prototype.setMax=function(t){this.max=t},n.prototype.setJitter=function(t){this.jitter=t}}])});
//# sourceMappingURL=socket.io.js.map


__FILE__61b93e9c3b6517001339a50d = "assets/shared/lib/modal.js";Modal = (function (e) {
    function t(i) {
        if (n[i]) return n[i].exports;
        var o = (n[i] = { i: i, l: !1, exports: {} });
        return e[i].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
    }
    var n = {};
    return (
        (t.m = e),
        (t.c = n),
        (t.d = function (e, n, i) {
            t.o(e, n) || Object.defineProperty(e, n, { configurable: !1, enumerable: !0, get: i });
        }),
        (t.n = function (e) {
            var n =
                e && e.__esModule
                    ? function () {
                          return e.default;
                      }
                    : function () {
                          return e;
                      };
            return t.d(n, "a", n), n;
        }),
        (t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }),
        (t.p = ""),
        t((t.s = 0))
    );
})([
    function (e, t, n) {
        e.exports = n(1).default;
    },
    function (e, t, n) {
        "use strict";
        function i(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }
        function o(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || ("object" != typeof t && "function" != typeof t) ? e : t;
        }
        function s(e, t) {
            if ("function" != typeof t && null !== t)
                throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            (e.prototype = Object.create(t && t.prototype, {
                constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 }
            })),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
        }
        function r(e) {
            for (var t in e)
                Array.isArray(e[t])
                    ? e[t].forEach(function (e) {
                          r(e);
                      })
                    : null !== e[t] && "object" === f(e[t]) && Object.freeze(e[t]);
            return Object.freeze(e);
        }
        function a() {
            return ((65536 * (1 + Math.random())) | 0).toString(16) + ((65536 * (1 + Math.random())) | 0).toString(16);
        }
        function l(e, t, n) {
            var i = e.data || {};
            if (void 0 === n) {
                if (e.data && e.data[t]) return e.data[t];
                var o = e.getAttribute("data-" + t);
                return void 0 !== o ? o : null;
            }
            return (i[t] = n), (e.data = i), e;
        }
        function d(e, t) {
            return e.nodeName
                ? e
                : ((e = e.replace(/(\t|\n$)/g, "")),
                  (m.innerHTML = ""),
                  (m.innerHTML = e),
                  !0 === t ? m.childNodes : m.childNodes[0]);
        }
        function c(e) {
            for (var t = [e]; e.parentNode; ) (e = e.parentNode), t.push(e);
            return t;
        }
        Object.defineProperty(t, "__esModule", { value: !0 });
        var h = (function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        (i.enumerable = i.enumerable || !1),
                            (i.configurable = !0),
                            "value" in i && (i.writable = !0),
                            Object.defineProperty(e, i.key, i);
                    }
                }
                return function (t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t;
                };
            })(),
            u =
                Object.assign ||
                function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
                    }
                    return e;
                },
            f =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                    ? function (e) {
                          return typeof e;
                      }
                    : function (e) {
                          return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype
                              ? "symbol"
                              : typeof e;
                      },
            p = n(2),
            v = (function (e) {
                return e && e.__esModule ? e : { default: e };
            })(p),
            m = document.createElement("div"),
            _ = (function () {
                var e = void 0,
                    t = void 0,
                    n = void 0,
                    i = document.createElement("div");
                return (
                    u(i.style, { visibility: "hidden", width: "100px" }),
                    document.body.appendChild(i),
                    (n = i.offsetWidth),
                    (i.style.overflow = "scroll"),
                    (e = document.createElement("div")),
                    (e.style.width = "100%"),
                    i.appendChild(e),
                    (t = n - e.offsetWidth),
                    document.body.removeChild(i),
                    t
                );
            })(),
            y = Object.freeze({
                el: null,
                animate: !0,
                animateClass: "fade",
                animateInClass: "show",
                appendTo: "body",
                backdrop: !0,
                keyboard: !0,
                title: !1,
                header: !0,
                content: !1,
                footer: !0,
                buttons: null,
                headerClose: !0,
                construct: !1,
                transition: 300,
                backdropTransition: 150
            }),
            b = r({
                dialog: [
                    { text: "Cancel", value: !1, attr: { class: "btn btn-default", "data-dismiss": "modal" } },
                    { text: "OK", value: !0, attr: { class: "btn btn-primary", "data-dismiss": "modal" } }
                ],
                alert: [{ text: "OK", attr: { class: "btn btn-primary", "data-dismiss": "modal" } }],
                confirm: [
                    { text: "Cancel", value: !1, attr: { class: "btn btn-default", "data-dismiss": "modal" } },
                    { text: "OK", value: !0, attr: { class: "btn btn-primary", "data-dismiss": "modal" } }
                ]
            }),
            g = {
                container: '<div class="modal"></div>',
                dialog: '<div class="modal-dialog"></div>',
                content: '<div class="modal-content"></div>',
                header: '<div class="modal-header"></div>',
                headerClose:
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>',
                body: '<div class="modal-body"></div>',
                footer: '<div class="modal-footer"></div>',
                backdrop: '<div class="modal-backdrop"></div>'
            },
            k = (function (e) {
                function t() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    i(this, t);
                    var n = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    if (
                        ((n.id = a()),
                        (n.el = null),
                        (n._html = {}),
                        (n._events = {}),
                        (n._visible = !1),
                        (n._options = u({}, t.options, e)),
                        (n._templates = u({}, t.templates, e.templates || {})),
                        (n._html.appendTo = document.querySelector(n._options.appendTo)),
                        null === n._options.buttons && (n._options.buttons = t.buttons.dialog),
                        n._options.el)
                    ) {
                        var s = n._options.el;
                        if ("string" == typeof n._options.el && !(s = document.querySelector(n._options.el)))
                            throw new Error("Selector: DOM Element " + n._options.el + " not found.");
                        l(s, "modal", n), (n.el = s);
                    } else n._options.construct = !0;
                    return n._options.construct ? n._render() : n._mapDom(), n;
                }
                return (
                    s(t, e),
                    h(t, null, [
                        {
                            key: "alert",
                            value: function (e) {
                                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                                return new t(
                                    u(
                                        {},
                                        y,
                                        {
                                            title: e,
                                            content: !1,
                                            construct: !0,
                                            headerClose: !1,
                                            buttons: t.buttons.alert
                                        },
                                        n
                                    )
                                );
                            }
                        },
                        {
                            key: "confirm",
                            value: function (e) {
                                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                                return new t(
                                    u(
                                        {},
                                        y,
                                        {
                                            title: e,
                                            content: !1,
                                            construct: !0,
                                            headerClose: !1,
                                            buttons: t.buttons.confirm
                                        },
                                        n
                                    )
                                );
                            }
                        },
                        {
                            key: "templates",
                            set: function (e) {
                                this._baseTemplates = e;
                            },
                            get: function () {
                                return u({}, g, t._baseTemplates || {});
                            }
                        },
                        {
                            key: "buttons",
                            set: function (e) {
                                this._baseButtons = e;
                            },
                            get: function () {
                                return u({}, b, t._baseButtons || {});
                            }
                        },
                        {
                            key: "options",
                            set: function (e) {
                                this._baseOptions = e;
                            },
                            get: function () {
                                return u({}, y, t._baseOptions || {});
                            }
                        },
                        {
                            key: "version",
                            get: function () {
                                return "0.8.0";
                            }
                        }
                    ]),
                    h(t, [
                        {
                            key: "_render",
                            value: function () {
                                var e = this._html,
                                    t = this._options,
                                    n = this._templates,
                                    i = !!t.animate && t.animateClass;
                                return (
                                    (e.container = d(n.container)),
                                    (e.dialog = d(n.dialog)),
                                    (e.content = d(n.content)),
                                    (e.header = d(n.header)),
                                    (e.headerClose = d(n.headerClose)),
                                    (e.body = d(n.body)),
                                    (e.footer = d(n.footer)),
                                    i && e.container.classList.add(i),
                                    this._setHeader(),
                                    this._setContent(),
                                    this._setFooter(),
                                    (this.el = e.container),
                                    e.dialog.appendChild(e.content),
                                    e.container.appendChild(e.dialog),
                                    this
                                );
                            }
                        },
                        {
                            key: "_mapDom",
                            value: function () {
                                var e = this._html,
                                    t = this._options;
                                return (
                                    this.el.classList.contains(t.animateClass) && (t.animate = !0),
                                    (e.container = this.el),
                                    (e.dialog = this.el.querySelector(".modal-dialog")),
                                    (e.content = this.el.querySelector(".modal-content")),
                                    (e.header = this.el.querySelector(".modal-header")),
                                    (e.headerClose = this.el.querySelector(".modal-header .close")),
                                    (e.body = this.el.querySelector(".modal-body")),
                                    (e.footer = this.el.querySelector(".modal-footer")),
                                    this._setHeader(),
                                    this._setContent(),
                                    this._setFooter(),
                                    this
                                );
                            }
                        },
                        {
                            key: "_setHeader",
                            value: function () {
                                var e = this._html,
                                    t = this._options;
                                t.header &&
                                    e.header &&
                                    (t.title.nodeName
                                        ? (e.header.innerHTML = t.title.outerHTML)
                                        : "string" == typeof t.title &&
                                          (e.header.innerHTML = '<h4 class="modal-title">' + t.title + "</h4>"),
                                    null === this.el &&
                                        e.headerClose &&
                                        t.headerClose &&
                                        e.header.appendChild(e.headerClose),
                                    t.construct && e.content.appendChild(e.header));
                            }
                        },
                        {
                            key: "_setContent",
                            value: function () {
                                var e = this._html,
                                    t = this._options;
                                t.content &&
                                    e.body &&
                                    ("string" == typeof t.content
                                        ? (e.body.innerHTML = t.content)
                                        : (e.body.innerHTML = t.content.outerHTML),
                                    t.construct && e.content.appendChild(e.body));
                            }
                        },
                        {
                            key: "_setFooter",
                            value: function () {
                                var e = this._html,
                                    t = this._options;
                                t.footer &&
                                    e.footer &&
                                    (t.footer.nodeName
                                        ? (e.footer.innerHTML = t.footer.outerHTML)
                                        : "string" == typeof t.footer
                                        ? (e.footer.innerHTML = t.footer)
                                        : e.footer.children.length ||
                                          t.buttons.forEach(function (t) {
                                              var n = document.createElement("button");
                                              l(n, "button", t),
                                                  (n.innerHTML = t.text),
                                                  n.setAttribute("type", "button");
                                              for (var i in t.attr) n.setAttribute(i, t.attr[i]);
                                              e.footer.appendChild(n);
                                          }),
                                    t.construct && e.content.appendChild(e.footer));
                            }
                        },
                        {
                            key: "_setEvents",
                            value: function () {
                                var e = (this._options, this._html);
                                (this._events.keydownHandler = this._handleKeydownEvent.bind(this)),
                                    document.body.addEventListener("keydown", this._events.keydownHandler),
                                    (this._events.clickHandler = this._handleClickEvent.bind(this)),
                                    e.container.addEventListener("click", this._events.clickHandler),
                                    (this._events.resizeHandler = this._handleResizeEvent.bind(this)),
                                    window.addEventListener("resize", this._events.resizeHandler);
                            }
                        },
                        {
                            key: "_handleClickEvent",
                            value: function (e) {
                                var t = this;
                                c(e.target).every(function (n) {
                                    return !(
                                        "HTML" === n.tagName ||
                                        (!0 !== t._options.backdrop && n.classList.contains("modal")) ||
                                        n.classList.contains("modal-content") ||
                                        ("modal" === n.getAttribute("data-dismiss")
                                            ? (t.emit("dismiss", t, e, l(e.target, "button")), t.hide(), 1)
                                            : n.classList.contains("modal") &&
                                              (t.emit("dismiss", t, e, null), t.hide(), 1))
                                    );
                                });
                            }
                        },
                        {
                            key: "_handleKeydownEvent",
                            value: function (e) {
                                27 === e.which &&
                                    this._options.keyboard &&
                                    (this.emit("dismiss", this, e, null), this.hide());
                            }
                        },
                        {
                            key: "_handleResizeEvent",
                            value: function (e) {
                                this._resize();
                            }
                        },
                        {
                            key: "show",
                            value: function () {
                                var e = this,
                                    t = this._options,
                                    n = this._html;
                                return (
                                    this.emit("show", this),
                                    this._checkScrollbar(),
                                    this._setScrollbar(),
                                    document.body.classList.add("modal-open"),
                                    t.construct && n.appendTo.appendChild(n.container),
                                    (n.container.style.display = "block"),
                                    (n.container.scrollTop = 0),
                                    !1 !== t.backdrop
                                        ? (this.once("showBackdrop", function () {
                                              e._setEvents(),
                                                  t.animate && n.container.offsetWidth,
                                                  n.container.classList.add(t.animateInClass),
                                                  setTimeout(function () {
                                                      (e._visible = !0), e.emit("shown", e);
                                                  }, t.transition);
                                          }),
                                          this._backdrop())
                                        : (this._setEvents(),
                                          t.animate && n.container.offsetWidth,
                                          n.container.classList.add(t.animateInClass),
                                          setTimeout(function () {
                                              (e._visible = !0), e.emit("shown", e);
                                          }, t.transition)),
                                    this._resize(),
                                    this
                                );
                            }
                        },
                        {
                            key: "toggle",
                            value: function () {
                                this._visible ? this.hide() : this.show();
                            }
                        },
                        {
                            key: "_resize",
                            value: function () {
                                var e = this._html.container.scrollHeight > document.documentElement.clientHeight;
                                (this._html.container.style.paddingLeft =
                                    !this.bodyIsOverflowing && e ? _ + "px" : ""),
                                    (this._html.container.style.paddingRight =
                                        this.bodyIsOverflowing && !e ? _ + "px" : "");
                            }
                        },
                        {
                            key: "_backdrop",
                            value: function () {
                                var e = this,
                                    t = this._html,
                                    n = this._templates,
                                    i = this._options,
                                    o = !!i.animate && i.animateClass;
                                (t.backdrop = d(n.backdrop)),
                                    o && t.backdrop.classList.add(o),
                                    t.container.appendChild(t.backdrop),
                                    o && t.backdrop.offsetWidth,
                                    t.backdrop.classList.add(i.animateInClass),
                                    setTimeout(function () {
                                        e.emit("showBackdrop", e);
                                    }, this._options.backdropTransition);
                            }
                        },
                        {
                            key: "hide",
                            value: function () {
                                var e = this,
                                    t = this._html,
                                    n = this._options,
                                    i = t.container.classList;
                                if ((this.emit("hide", this), i.remove(n.animateInClass), n.backdrop)) {
                                    t.backdrop.classList.remove(n.animateInClass);
                                }
                                return (
                                    this._removeEvents(),
                                    setTimeout(function () {
                                        document.body.classList.remove("modal-open"),
                                            (document.body.style.paddingRight = e.originalBodyPad);
                                    }, n.backdropTransition),
                                    setTimeout(function () {
                                        n.backdrop && t.backdrop.parentNode.removeChild(t.backdrop),
                                            (t.container.style.display = "none"),
                                            n.construct && t.container.parentNode.removeChild(t.container),
                                            (e._visible = !1),
                                            e.emit("hidden", e);
                                    }, n.transition),
                                    this
                                );
                            }
                        },
                        {
                            key: "_removeEvents",
                            value: function () {
                                this._events.keydownHandler &&
                                    document.body.removeEventListener("keydown", this._events.keydownHandler),
                                    this._html.container.removeEventListener("click", this._events.clickHandler),
                                    window.removeEventListener("resize", this._events.resizeHandler);
                            }
                        },
                        {
                            key: "_checkScrollbar",
                            value: function () {
                                this.bodyIsOverflowing = document.body.clientWidth < window.innerWidth;
                            }
                        },
                        {
                            key: "_setScrollbar",
                            value: function () {
                                if (
                                    ((this.originalBodyPad = document.body.style.paddingRight || ""),
                                    this.bodyIsOverflowing)
                                ) {
                                    var e = parseInt(this.originalBodyPad || 0, 10);
                                    document.body.style.paddingRight = e + _ + "px";
                                }
                            }
                        }
                    ]),
                    t
                );
            })(v.default);
        t.default = k;
    },
    function (e, t) {
        function n() {
            (this._events = this._events || {}), (this._maxListeners = this._maxListeners || void 0);
        }
        function i(e) {
            return "function" == typeof e;
        }
        function o(e) {
            return "number" == typeof e;
        }
        function s(e) {
            return "object" == typeof e && null !== e;
        }
        function r(e) {
            return void 0 === e;
        }
        (e.exports = n),
            (n.EventEmitter = n),
            (n.prototype._events = void 0),
            (n.prototype._maxListeners = void 0),
            (n.defaultMaxListeners = 10),
            (n.prototype.setMaxListeners = function (e) {
                if (!o(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
                return (this._maxListeners = e), this;
            }),
            (n.prototype.emit = function (e) {
                var t, n, o, a, l, d;
                if (
                    (this._events || (this._events = {}),
                    "error" === e && (!this._events.error || (s(this._events.error) && !this._events.error.length)))
                ) {
                    if ((t = arguments[1]) instanceof Error) throw t;
                    var c = new Error('Uncaught, unspecified "error" event. (' + t + ")");
                    throw ((c.context = t), c);
                }
                if (((n = this._events[e]), r(n))) return !1;
                if (i(n))
                    switch (arguments.length) {
                        case 1:
                            n.call(this);
                            break;
                        case 2:
                            n.call(this, arguments[1]);
                            break;
                        case 3:
                            n.call(this, arguments[1], arguments[2]);
                            break;
                        default:
                            (a = Array.prototype.slice.call(arguments, 1)), n.apply(this, a);
                    }
                else if (s(n))
                    for (a = Array.prototype.slice.call(arguments, 1), d = n.slice(), o = d.length, l = 0; l < o; l++)
                        d[l].apply(this, a);
                return !0;
            }),
            (n.prototype.addListener = function (e, t) {
                var o;
                if (!i(t)) throw TypeError("listener must be a function");
                return (
                    this._events || (this._events = {}),
                    this._events.newListener && this.emit("newListener", e, i(t.listener) ? t.listener : t),
                    this._events[e]
                        ? s(this._events[e])
                            ? this._events[e].push(t)
                            : (this._events[e] = [this._events[e], t])
                        : (this._events[e] = t),
                    s(this._events[e]) &&
                        !this._events[e].warned &&
                        (o = r(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners) &&
                        o > 0 &&
                        this._events[e].length > o &&
                        ((this._events[e].warned = !0),
                        console.error(
                            "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                            this._events[e].length
                        ),
                        "function" == typeof console.trace && console.trace()),
                    this
                );
            }),
            (n.prototype.on = n.prototype.addListener),
            (n.prototype.once = function (e, t) {
                function n() {
                    this.removeListener(e, n), o || ((o = !0), t.apply(this, arguments));
                }
                if (!i(t)) throw TypeError("listener must be a function");
                var o = !1;
                return (n.listener = t), this.on(e, n), this;
            }),
            (n.prototype.removeListener = function (e, t) {
                var n, o, r, a;
                if (!i(t)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[e]) return this;
                if (((n = this._events[e]), (r = n.length), (o = -1), n === t || (i(n.listener) && n.listener === t)))
                    delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
                else if (s(n)) {
                    for (a = r; a-- > 0; )
                        if (n[a] === t || (n[a].listener && n[a].listener === t)) {
                            o = a;
                            break;
                        }
                    if (o < 0) return this;
                    1 === n.length ? ((n.length = 0), delete this._events[e]) : n.splice(o, 1),
                        this._events.removeListener && this.emit("removeListener", e, t);
                }
                return this;
            }),
            (n.prototype.removeAllListeners = function (e) {
                var t, n;
                if (!this._events) return this;
                if (!this._events.removeListener)
                    return (
                        0 === arguments.length ? (this._events = {}) : this._events[e] && delete this._events[e], this
                    );
                if (0 === arguments.length) {
                    for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                    return this.removeAllListeners("removeListener"), (this._events = {}), this;
                }
                if (((n = this._events[e]), i(n))) this.removeListener(e, n);
                else if (n) for (; n.length; ) this.removeListener(e, n[n.length - 1]);
                return delete this._events[e], this;
            }),
            (n.prototype.listeners = function (e) {
                return this._events && this._events[e]
                    ? i(this._events[e])
                        ? [this._events[e]]
                        : this._events[e].slice()
                    : [];
            }),
            (n.prototype.listenerCount = function (e) {
                if (this._events) {
                    var t = this._events[e];
                    if (i(t)) return 1;
                    if (t) return t.length;
                }
                return 0;
            }),
            (n.listenerCount = function (e, t) {
                return e.listenerCount(t);
            });
    }
]);


__FILE__61b93e9c3b6517001339a50d = "assets/shared/helpers/riot-helper.js";onDomReady(function() {
    /*
     * Load default for all widgets and fix svg sizes
     */
    WS.load_net("link", {
        href: params.location + "/widget-static/" + params.widget.slug + "/themes/default.css",
        rel: "stylesheet",
        type: "text/css",
    });
    WS.load_net("link", {
        href: params.location + "/widget-static/overrides.css",
        rel: "stylesheet",
        type: "text/css",
    });

    /** If there is no theme defined, use scratch by default
     */
    if (typeof params.widget.theme === "undefined" || params.widget.theme == "") {
        params.widget.theme = "scratch";
    }

    /**
     * Load theme.
     */
    if (params.widget.theme) {
        WS.load_theme(params.widget.theme, params.widget.theme, params.widget.slug);
    }

    var the_widget = document.getElementById("sil-widget-" + params.wid);

    if (the_widget.attributes.href) the_widget.attributes.href = "#"; // prevent linking out after loading. Remove in 2018.

    the_widget.innerHTML = "<admin></admin><" + params.widget.slug + "></" + params.widget.slug + ">";

    riot.mount(params.widget.slug, {
        params: params,
    })

    //Widget Post-Mounting Event
    var widgetMountedEvent = new Event("widget-mounted");

    window.document.dispatchEvent(widgetMountedEvent);
});


__FILE__61b93e9c3b6517001339a50d = "assets/Widgets/chatroom/chatroom.tag.js";riot.tag2('chatroom', '<div class="chatroom-modal chatbox"> <div class="chatbox-header chatbox-primary primary-color"> <p class="chatbox-header-title"> {opts.params.widget.website_name || translate(⁗Public chatroom!⁗)}</p> <div class="chatbox-header-settings"> <div if="{opts.params.is_admin}" data-toggle="tooltip" title="Only you see this button" class="btn-admin-wrap" id="{⁗admin-btn⁗ + opts.params.wid}"> <img onclick="{load_admin}" class="chatroom-engine" riot-src="{opts.params.location}/widget-static/svg/chatbox-icons/engine.svg" alt="chatbox engine"> </div> </div> </div> <div id="content"> <div id="create" if="{user_exists <= 0}"> <form onsubmit="{createUser}"> <div class="create-user-text">{translate(\'Create your User\')}</div> <input type="text" name="user_name" class="bawkbox-widgets-input" placeholder="username..." style="margin-bottom:2px"> <input if="{(!opts.params.widget.email_request && opts.params.widget.email_request != ⁗required⁗) &&                             (opts.params.widget.email_select == true || opts.params.widget.email_select == ⁗show⁗)}" class="bawkbox-widgets-input" name="email" placeholder="email... (optional, keep history of chats)" type="email"> <input if="{opts.params.widget.email_request == true || opts.params.widget.email_request == ⁗required⁗}" class="bawkbox-widgets-input" name="email" placeholder="email..." required type="email"> <div class="create-user-actions"> <button class="btn-bawkbox-widgets btn-widgets-primary" name="create_user">Proceed</button> <p style="font-style:italic; font-size: 12px; opacity: 0.5;"> Note: This chat box uses sessions to identify user. Changing browsers or clearing cache will need you to create a new user </p> </div> </form> </div> <div class="chatbox-content" id="messages_list" name="messages_list" if="{user_exists > 0}"> <virtual each="{messages.data}"> <p class="receiver secondary-color" if="{user_name != current_user && message != ⁗⁗}"> <span class="receiver-tag {admin: is_admin}"> {user_name}{is_admin ? \' (Admin)\' : \'\'}: </span> {message} </p> <p class="sender primary-color" if="{user_name == current_user && message != ⁗⁗}">You: {message}</p> </virtual> </div> <div id="feedback" name="feedback" if="{user_exists > 0}" style="margin-bottom:0"></div> <div id="options" class="chatbox-message-area" if="{user_exists > 0}"> <textarea name="message" cols="30" rows="10" class="chatbox-message-textarea" placeholder="{translate(\'Type a message\')}"></textarea> <div class="chatbox-message-footer"> <a if="{!opts.params.link_removed}" class="chatbox-disclaimer" href="https://www.techy-trends.com" target="_blank"> <span class="chat-powered-by-text"> Get a {opts.params.Widget.title} widget. &copy;</span> <img riot-src="{opts.params.location}/widget-static/svg/components/widget-logo.svg" class="bawkbox-powered-by-logo"> </a> <div class="chatbox-message-footer-buttons"> <button onclick="{send}" name="send_btn" class="chatbox-message-footer-button chatbox-send primary-color">{translate(\'SEND\')}</button> </div> </div> </div> </div> <modal params="{opts.params}"></modal> </div>', '@import url(\'https://fonts.googleapis.com/css?family=Montserrat|Open+Sans\'); chatroom { margin-top: 2rem; margin-bottom: 2rem; display: inline-block; float: left; box-sizing: border-box; position: relative; font-family: \'Inter\', \'system-ui\', Ubuntu, sans-serif; } chatroom .chatbox .chatbox-message-area .chatbox-message-textarea,chatroom .sil-widget-chatroom .chatbox .chatbox-message-area .chatbox-message-textarea,[data-is="chatroom"] .sil-widget-chatroom .chatbox .chatbox-message-area .chatbox-message-textarea{ border: 1px solid #464646; } chatroom .create-user-text,[data-is="chatroom"] .create-user-text{ color: #343a40e3; font-weight: bold; font-size: 1.2rem; } chatroom .create-user-actions,[data-is="chatroom"] .create-user-actions{ display: flex; flex-wrap: wrap; } chatroom .create-user-actions button,[data-is="chatroom"] .create-user-actions button{ flex: 1 1 30%; align-self: flex-start; } chatroom .create-user-actions p,[data-is="chatroom"] .create-user-actions p{ flex: 1 1 100px; } chatroom #create,[data-is="chatroom"] #create{ padding: 1rem; } chatroom .bawk-credit,[data-is="chatroom"] .bawk-credit{ position: absolute; font-size: 10px; bottom: 5px; left: 10px; } chatroom .chat-powered-by-text,[data-is="chatroom"] .chat-powered-by-text{ position: relative; } chatroom .bawkbox-powered-by-logo,[data-is="chatroom"] .bawkbox-powered-by-logo{ max-width: 50px !important; top: -0.15rem; } chatroom .chatbox-disclaimer,[data-is="chatroom"] .chatbox-disclaimer{ top: 0.9rem !important; } chatroom .chatroom-engine,[data-is="chatroom"] .chatroom-engine{ margin-top: 0.3rem; } chatroom .chatbox-disclaimer,[data-is="chatroom"] .chatbox-disclaimer{ text-decoration: none; } chatroom .chatbox,[data-is="chatroom"] .chatbox{ } chatroom .chatbox-send,[data-is="chatroom"] .chatbox-send{ border: 0; } chatroom .receiver,[data-is="chatroom"] .receiver,chatroom .sender,[data-is="chatroom"] .sender{ padding: 0.5rem 0.7rem; font-size: 0.8rem; word-break: break-word; } chatroom .sender.sender,[data-is="chatroom"] .sender.sender{ border-radius: 10px 10px 0 10px; background-color: #F05139; color: white; } chatroom .receiver.receiver,[data-is="chatroom"] .receiver.receiver{ border-radius: 10px 10px 10px 0; background-color: #EFEFEF; } chatroom #bawk-create,[data-is="chatroom"] #bawk-create{ margin: 20px; height: 578px; }', '', function(opts) {
        WS.load_net("link", {
            href: opts.params.location + `/widget-static/chatroom/chatroom.css?v=${ opts.params.version }`,
            rel: "stylesheet",
            type: "text/css"
        });

        var controller = this;
        controller.open = false;
        controller.translate = translate;
        controller.colors = opts.params.widget.colors || null;
        controller.email_request = opts.params.widget.email_request;

        color.update_specific_colors({ key: "public-chatroom-background", selector: ".chatbox-content, .chatbox-message-textarea, .chatbox-message-footer, #create ", prop: "background-color" });

        controller.on("mount", function () {
            if (opts.params.user.email) {

                controller.current_user = opts.params.user.email.split("@")[0];
                controller.current_email = opts.params.user.email;
                controller.user_exists = 1;
            }
        });
        controller.on("update", function () {
            scroll_to_bottom();
        })
        this.createUser = function(e) {
            e.preventDefault();

            var chat = {};
            chat.wid = opts.params.wid;
            chat.sid = opts.params.sid;
            chat.user_name = controller.current_user || controller.user_name.value;

            if(chat.user_name.replace(/\s/g, '') === '')
                chat.user_name = 'Anonymous'

            if (controller.email_request == true || controller.email_request == "required") {
                if ((controller.email[1].value == "" || controller.email[1].value == null || !controller.email[1].checkValidity()) && controller.user_exists <= 0) {
                    window.WS.modal.setModalContent({
                        title: 'Please provide your email.',
                        content: 'Email cannot be empty.',
                        type: 'info'
                    });
                    return;
                }
            }

            chat.email = controller.email[0].value || controller.current_email || controller.email.value;
            chat.message = controller.message.value || "";
            chat.website = opts.params.widget.website_name;
            chat.page = window.location + "";
            controller.update({current_user: chat.user_name, current_email: chat.email, user_exists: 1});
            return;
        }.bind(this)

        this.send = function(e) {
            e.preventDefault();
            var chat = {};
            chat.wid = opts.params.wid;
            chat.sid = opts.params.sid;
            chat.user_name = controller.current_user || controller.user_name.value;

            if (controller.email_request == true || controller.email_request == "required") {
                if ((controller.email[1].value == "" || controller.email[1].value == null || !controller.email[1].checkValidity()) && controller.user_exists <= 0) {
                    window.WS.modal.setModalContent({
                        title: 'Please provide your email.',
                        content: 'Email cannot be empty.',
                        type: 'info'
                    });
                    return;
                }
            }

            if (!controller.message.value && controller.current_user) {
                window.WS.modal.setModalContent({
                    title: 'Please enter a message.',
                    content: 'Message cannot be empty.',
                    type: 'info'
                });
                return;
            }

            chat.email = controller.current_email || controller.email.value || controller.email[1].value;
            chat.is_admin = opts.params.is_admin
            chat.message = controller.message.value || "";
            chat.website = opts.params.widget.website_name;
            chat.page = window.location + "";
            store.save(chat, function (rsp) {

                socket.emit("chat", {
                    wid: opts.params.wid,
                    user: controller.current_user,
                    is_admin: opts.params.is_admin,

                    message: message.value,
                    page: window.location + ""
                });

                controller.update({
                    current_user: chat.user_name,
                    current_email: chat.email,
                    user_exists: 1
                });
                message.value = "";
            });
        }.bind(this)

        var load_messages = function () {

            store.load({
                callback: function (new_message) {
                    if (controller.messages)
                        new_message.data = controller.messages.data.concat(new_message.data);
                    controller.update({messages: new_message});
                    controller.messages.data.reverse();
                    controller.update();
                }
            });

            store.load_all({
                callback: function (new_message) {
                    if (controller.all_messages)
                        new_message.data = controller.all_messages.data.concat(new_message.data);
                    controller.update({all_messages: new_message});
                    if (!controller.user_exists || controller.user_exists <= 0) {
                        controller.user_exists = controller.all_messages.data.filter(function (user) {
                            if (user.sid === opts.params.sid && opts.params.sid != null) {
                                controller.current_user = user.user_name;
                                controller.current_email = user.email;
                                return user.sid === opts.params.sid;
                            }
                        }).length;

                        controller.update();
                    }
                }
            });
        }

        function scroll_to_bottom() {
            var div = document.getElementById("messages_list");
            if (div)
                div.scrollTop = div.scrollHeight;
            }
        load_messages();

        var socket = io(opts.params.location + "/chatroom"),
            message = controller.message,
            btn = controller.send_btn,
            output = controller.messages_list,
            feedback = controller.feedback;

        if (message) {
            message.addEventListener('keypress', function (event) {
                if (event.keyCode === 13) {
                    btn.click();
                } else {
                    socket.emit('typing', {
                        user: controller.current_user,
                        page: window.location + ""
                    });
                }
            });
        }

        socket.on("chat", function (data) {
            if ((data.wid == opts.params.wid) && (window.location == data.page)) {
                if (data.user == controller.current_user) {
                    output.innerHTML += "<p class='sender primary-color'>You: " + data.message + "</p>";
                } else {
                    output.innerHTML += `<p class='receiver secondary-color'>
                                            <span class='receiver-tag ${data.is_admin ? 'admin)' : ''}'>
                                                 ${data.user}${data.is_admin ? ' (Admin)' : ''}:
                                            </span>
                                            ${data.message}
                                        </p>`;
                }
                scroll_to_bottom();
            }
        });
        socket.on("typing", function (data) {
            if (window.location == data.page.href)
                feedback.innerHTML = "<p style='margin-bottom:0'><em>" + data.user + " is typing...</em></p>";
            }
        );

        controller.on("mount", function () {
            if (opts.params.is_admin) {
                var admin_btn = document.getElementById("admin-btn" + opts.params.wid);
                admin_btn.addEventListener('click', function () {
                    load_admin(opts.params.wid);
                });
            }
        });
});


__FILE__61b93e9c3b6517001339a50d = "assets/shared/views/disclaimer.tag.js";
riot.tag2('disclaimer', '<a if="{!opts.params.link_removed || !opts.params.widget_tier || opts.params.widget_tier == ⁗free⁗}" href="{opts.params.homepage}" class="{opts.class}" target="_blank"> Get a {opts.params.Widget.title} widget. &copy;  </a>', 'disclaimer { position: absolute; bottom: 1rem; right: 20px; color: #B4B4B4; font-size: 0.6rem; text-align: right; min-width: 216px; } disclaimer a { text-decoration: none; color: inherit; cursor: pointer; } disclaimer a:hover { color: #B4B4B4; }', '', function(opts) {
});



__FILE__61b93e9c3b6517001339a50d = "assets/shared/views/modal.tag.js";riot.tag2('modal', '<div id="{⁗modal-main-container⁗ + opts.params.wid}" class="modal-widget fade" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <div class="modal-title"> <h5>{modalTitle}</h5> <div if="{modalType == \'loading\'}" class="loader"></div> </div> </div> <form onsubmit="{handleSubmitTitle}"> <div if="{modalType == ⁗input⁗ || (modalContentText && modalContentText != ⁗⁗)}" class="modal-body"> <input if="{modalType == ⁗input⁗}" id="modal-input" class="bawkbox-widgets-input" type="text" name="blogTitle" required> <div class="content-container" if="{modalType !== ⁗input⁗}"> <p> {modalContentText} </p> </div> </div> <div if="{modalType != \'loading\'}" class="modal-footer"> <button if="{modalType == ⁗confirm⁗}" type="submit" class="btn btn-cancel" onclick="{handleCloseModal}"> Cancel </button> <button type="submit" class="btn btn-submit-title" onclick="{handleConfirmSubmit}"> {modalType === ⁗info⁗ ? \'OK\' : modalType === ⁗input⁗ ? \'Submit\' : \'Confirm\'} </button> </div> </form> <a if="{modalType != \'loading\'}" href="#close-modal" rel="modal:close" class="close-modal" onclick="{handleCloseModal}"> Close </a> </div> </div> </div>', 'modal .modal-title,[data-is="modal"] .modal-title{ display: flex; } modal .loader,[data-is="modal"] .loader{ border: 5px solid #f3f3f3; border-radius: 50%; border-top: 5px solid #3498db; width: 25px; height: 25px; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite; margin-left: 15px; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', '', function(opts) {
        var controller = this;
        controller.modalTitle = "";
        controller.modalType = "info";
        controller.modalContentText = "";
        controller.handleConfirmFunction = null;
        window.WS.modal = this;

        WS.load_net("link", {
            href: opts.params.location + `/widget-static/modal/modal.css?v=${ opts.params.version }`,
            rel: "stylesheet",
            type: "text/css"
        });

        controller.on("mount", function () {
            controller.modalContainer = new Modal({el: document.getElementById(`modal-main-container` + opts.params.wid)});
        });

        this.setModalContent = function(props) {

            controller.resetModalContent();
            if (props) {
              const { title, type, content, confirmFunction } = props
              controller.modalTitle = title ? title : 'Bawkbox Modal Title';
              controller.modalType = type ? type : 'info';
              controller.modalContentText = content;
              controller.handleConfirmFunction = confirmFunction ? confirmFunction  : () => {};
              controller.handleOpenModal();
              controller.update();
            }
        }.bind(this)

        this.handleConfirmSubmit = function() {
            controller.handleConfirmFunction();
            controller.modalContainer.hide();
            controller.clearInput();
        }.bind(this)

        this.clearInput = function() {

            if (controller.modalType == 'input') {
                document.getElementById('modal-input').value = '';
            }
        }.bind(this)

        this.handleOpenModal = function() {
            controller.modalContainer.show();
        }.bind(this)

        this.handleCloseModal = function() {
            controller.modalContainer.hide();
            controller.clearInput();
        }.bind(this)

        this.resetModalContent = function() {
            controller.modalTitle = '';
            controller.modalType = 'info';
            controller.modalContentText = '';
            controller.handleConfirmFunction = () => {};
        }.bind(this)

});})({"debug":"TTmQ0gAGfIVu53-cLK5irfSsb97bxTST/6017365db2bf79771471ade3","wid":"61c0b917c903ab0013596177","host":"bawkbox.com","user":{"_id":"6017365db2bf79771471ade3","name":"Shahzaib Aziz","email":"sulemanaziz405@gmail.com"},"homepage":"https://bawkbox.com/install/chatroom","sid":"TTmQ0gAGfIVu53-cLK5irfSsb97bxTST","is_admin":true,"link_removed":false,"widget":{"_id":"61c0b917c903ab0013596177","not_saved":true,"user_id":"6017365db2bf79771471ade3","slug":"chatroom","first_installed_date":"2021-12-20T17:10:55.018Z","pageviews":14,"name":"Public Room","theme":"scratch","permissions":{"write":"any"},"pagesize":1000,"bawkbox_branding":false,"website_name":"Tech Trends","email_select":"true","email_request":true,"l10n":{"public chatroom!":"Public Room","type a message":"Hi welcome to Tech Trends","create your user":"Support","send":"Send "}},"Widget":{"title":"Public Chatroom","plural_title":"Chatrooms","slug":"chatroom","riot":true,"admin":{},"libs":["nanoajax","ondomready","serialize-form","socket.io","modal"],"settings":[{"fieldname":"website_name","fieldlabel":"Website Name","fieldtype":"text"},{"fieldlabel":"Allow Optional Email Input","fieldname":"email_select","fieldtype":"checkbox","fieldvalue":true},{"fieldlabel":"Require Email Input","fieldname":"email_request","fieldtype":"checkbox","fieldvalue":true}],"translations":{"Public chatroom!":"","Type a message":"","Create your User":"","SEND":""},"colors":[{"selector":"public-chatroom-background","rule":"color"}],"permissions":{"write":"any","read":"any","del":"admin"},"header":"Let your community converse with BawkBox Chatroom","teaser":"The easiest way to add a chatroom to your website, and chat with your visitors.","features":[{"header":"Chat History","teaser":"Our chat history allows you to keep tabs on your users and save important conversations"},{"header":"Easy Installation","teaser":"Installing BawkBox Chatroom is quick and coding free."},{"header":"","teaser":""}],"tiers":{"free":{"header":"Free","benefits":["Unlimited Chat Users","Includes Email Notification","Data Export","Analytics","Unlimited Use of All widgets"],"price":"$0","button":"Get Started"},"pro":{"header":"Pro","benefits":["Includes Everything in Free","Email Support","Remove BawkBox Branding"],"price":"$5","button":"Start your free trial"},"enterprise":{"header":"Enterprise","benefits":["Includes Everything in Pro","25% Discount on All Customization Work","Priority Email support"],"price":"$15","button":"Start your free trial"}},"final-cta":"Add a chatroom to your site today!","url":"bawkbox.com/install/chatroom"},"widget_tier":"free","demo_mode":false,"field_settings":{"toggle_switch":{"yes_value":"true","no_value":""}},"version":"45d9c1b9"});