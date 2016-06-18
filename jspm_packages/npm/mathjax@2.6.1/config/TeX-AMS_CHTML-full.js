/* */ 
(function(process) {
  MathJax.Ajax.Preloading("[MathJax]/jax/input/TeX/config.js", "[MathJax]/jax/output/CommonHTML/config.js", "[MathJax]/jax/output/PreviewHTML/config.js", "[MathJax]/extensions/tex2jax.js", "[MathJax]/extensions/MathEvents.js", "[MathJax]/extensions/MathZoom.js", "[MathJax]/extensions/MathMenu.js", "[MathJax]/jax/element/mml/jax.js", "[MathJax]/extensions/toMathML.js", "[MathJax]/extensions/TeX/noErrors.js", "[MathJax]/extensions/TeX/noUndefined.js", "[MathJax]/jax/input/TeX/jax.js", "[MathJax]/extensions/TeX/AMSmath.js", "[MathJax]/extensions/TeX/AMSsymbols.js", "[MathJax]/jax/output/CommonHTML/jax.js", "[MathJax]/jax/output/CommonHTML/autoload/mtable.js", "[MathJax]/jax/output/PreviewHTML/jax.js", "[MathJax]/extensions/fast-preview.js", "[MathJax]/extensions/AssistiveMML.js");
  MathJax.Hub.Config({"v1.0-compatible": false});
  MathJax.InputJax.TeX = MathJax.InputJax({
    id: "TeX",
    version: "2.6.1",
    directory: MathJax.InputJax.directory + "/TeX",
    extensionDir: MathJax.InputJax.extensionDir + "/TeX",
    config: {
      TagSide: "right",
      TagIndent: "0.8em",
      MultLineWidth: "85%",
      equationNumbers: {
        autoNumber: "none",
        formatNumber: function(a) {
          return a;
        },
        formatTag: function(a) {
          return "(" + a + ")";
        },
        formatID: function(a) {
          return "mjx-eqn-" + String(a).replace(/[:"'<>&]/g, "");
        },
        formatURL: function(a) {
          return "#" + escape(a);
        },
        useLabelIds: true
      }
    }
  });
  MathJax.InputJax.TeX.Register("math/tex");
  MathJax.InputJax.TeX.loadComplete("config.js");
  MathJax.OutputJax.CommonHTML = MathJax.OutputJax({
    id: "CommonHTML",
    version: "2.6.1",
    directory: MathJax.OutputJax.directory + "/CommonHTML",
    extensionDir: MathJax.OutputJax.extensionDir + "/CommonHTML",
    autoloadDir: MathJax.OutputJax.directory + "/CommonHTML/autoload",
    fontDir: MathJax.OutputJax.directory + "/CommonHTML/fonts",
    webfontDir: MathJax.OutputJax.fontDir + "/HTML-CSS",
    config: {
      matchFontHeight: true,
      scale: 100,
      minScaleAdjust: 50,
      mtextFontInherit: false,
      undefinedFamily: "STIXGeneral,'Cambria Math','Arial Unicode MS',serif",
      EqnChunk: (MathJax.Hub.Browser.isMobile ? 20 : 100),
      EqnChunkFactor: 1.5,
      EqnChunkDelay: 100,
      linebreaks: {
        automatic: false,
        width: "container"
      }
    }
  });
  if (!MathJax.Hub.config.delayJaxRegistration) {
    MathJax.OutputJax.CommonHTML.Register("jax/mml");
  }
  MathJax.OutputJax.CommonHTML.loadComplete("config.js");
  MathJax.OutputJax.PreviewHTML = MathJax.OutputJax({
    id: "PreviewHTML",
    version: "2.6.1",
    directory: MathJax.OutputJax.directory + "/PreviewHTML",
    extensionDir: MathJax.OutputJax.extensionDir + "/PreviewHTML",
    noFastPreview: true,
    config: {
      scale: 100,
      minScaleAdjust: 50,
      mtextFontInherit: false,
      linebreaks: {
        automatic: false,
        width: "container"
      }
    }
  });
  if (!MathJax.Hub.config.delayJaxRegistration) {
    MathJax.OutputJax.PreviewHTML.Register("jax/mml");
  }
  MathJax.OutputJax.PreviewHTML.loadComplete("config.js");
  MathJax.Extension.tex2jax = {
    version: "2.6.0",
    config: {
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
      balanceBraces: true,
      skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "annotation", "annotation-xml"],
      ignoreClass: "tex2jax_ignore",
      processClass: "tex2jax_process",
      processEscapes: false,
      processEnvironments: true,
      processRefs: true,
      preview: "TeX"
    },
    PreProcess: function(a) {
      if (!this.configured) {
        this.config = MathJax.Hub.CombineConfig("tex2jax", this.config);
        if (this.config.Augment) {
          MathJax.Hub.Insert(this, this.config.Augment);
        }
        if (typeof(this.config.previewTeX) !== "undefined" && !this.config.previewTeX) {
          this.config.preview = "none";
        }
        this.configured = true;
      }
      if (typeof(a) === "string") {
        a = document.getElementById(a);
      }
      if (!a) {
        a = document.body;
      }
      if (this.createPatterns()) {
        this.scanElement(a, a.nextSibling);
      }
    },
    createPatterns: function() {
      var d = [],
          e = [],
          c,
          a,
          b = this.config;
      this.match = {};
      for (c = 0, a = b.inlineMath.length; c < a; c++) {
        d.push(this.patternQuote(b.inlineMath[c][0]));
        this.match[b.inlineMath[c][0]] = {
          mode: "",
          end: b.inlineMath[c][1],
          pattern: this.endPattern(b.inlineMath[c][1])
        };
      }
      for (c = 0, a = b.displayMath.length; c < a; c++) {
        d.push(this.patternQuote(b.displayMath[c][0]));
        this.match[b.displayMath[c][0]] = {
          mode: "; mode=display",
          end: b.displayMath[c][1],
          pattern: this.endPattern(b.displayMath[c][1])
        };
      }
      if (d.length) {
        e.push(d.sort(this.sortLength).join("|"));
      }
      if (b.processEnvironments) {
        e.push("\\\\begin\\{([^}]*)\\}");
      }
      if (b.processEscapes) {
        e.push("\\\\*\\\\\\$");
      }
      if (b.processRefs) {
        e.push("\\\\(eq)?ref\\{[^}]*\\}");
      }
      this.start = new RegExp(e.join("|"), "g");
      this.skipTags = new RegExp("^(" + b.skipTags.join("|") + ")$", "i");
      var f = [];
      if (MathJax.Hub.config.preRemoveClass) {
        f.push(MathJax.Hub.config.preRemoveClass);
      }
      if (b.ignoreClass) {
        f.push(b.ignoreClass);
      }
      this.ignoreClass = (f.length ? new RegExp("(^| )(" + f.join("|") + ")( |$)") : /^$/);
      this.processClass = new RegExp("(^| )(" + b.processClass + ")( |$)");
      return (e.length > 0);
    },
    patternQuote: function(a) {
      return a.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, "\\$1");
    },
    endPattern: function(a) {
      return new RegExp(this.patternQuote(a) + "|\\\\.|[{}]", "g");
    },
    sortLength: function(d, c) {
      if (d.length !== c.length) {
        return c.length - d.length;
      }
      return (d == c ? 0 : (d < c ? -1 : 1));
    },
    scanElement: function(c, b, g) {
      var a,
          e,
          d,
          f;
      while (c && c != b) {
        if (c.nodeName.toLowerCase() === "#text") {
          if (!g) {
            c = this.scanText(c);
          }
        } else {
          a = (typeof(c.className) === "undefined" ? "" : c.className);
          e = (typeof(c.tagName) === "undefined" ? "" : c.tagName);
          if (typeof(a) !== "string") {
            a = String(a);
          }
          f = this.processClass.exec(a);
          if (c.firstChild && !a.match(/(^| )MathJax/) && (f || !this.skipTags.exec(e))) {
            d = (g || this.ignoreClass.exec(a)) && !f;
            this.scanElement(c.firstChild, b, d);
          }
        }
        if (c) {
          c = c.nextSibling;
        }
      }
    },
    scanText: function(b) {
      if (b.nodeValue.replace(/\s+/, "") == "") {
        return b;
      }
      var a,
          c;
      this.search = {start: true};
      this.pattern = this.start;
      while (b) {
        this.pattern.lastIndex = 0;
        while (b && b.nodeName.toLowerCase() === "#text" && (a = this.pattern.exec(b.nodeValue))) {
          if (this.search.start) {
            b = this.startMatch(a, b);
          } else {
            b = this.endMatch(a, b);
          }
        }
        if (this.search.matched) {
          b = this.encloseMath(b);
        }
        if (b) {
          do {
            c = b;
            b = b.nextSibling;
          } while (b && (b.nodeName.toLowerCase() === "br" || b.nodeName.toLowerCase() === "#comment"));
          if (!b || b.nodeName !== "#text") {
            return (this.search.close ? this.prevEndMatch() : c);
          }
        }
      }
      return b;
    },
    startMatch: function(a, b) {
      var f = this.match[a[0]];
      if (f != null) {
        this.search = {
          end: f.end,
          mode: f.mode,
          pcount: 0,
          open: b,
          olen: a[0].length,
          opos: this.pattern.lastIndex - a[0].length
        };
        this.switchPattern(f.pattern);
      } else {
        if (a[0].substr(0, 6) === "\\begin") {
          this.search = {
            end: "\\end{" + a[1] + "}",
            mode: "; mode=display",
            pcount: 0,
            open: b,
            olen: 0,
            opos: this.pattern.lastIndex - a[0].length,
            isBeginEnd: true
          };
          this.switchPattern(this.endPattern(this.search.end));
        } else {
          if (a[0].substr(0, 4) === "\\ref" || a[0].substr(0, 6) === "\\eqref") {
            this.search = {
              mode: "",
              end: "",
              open: b,
              pcount: 0,
              olen: 0,
              opos: this.pattern.lastIndex - a[0].length
            };
            return this.endMatch([""], b);
          } else {
            var d = a[0].substr(0, a[0].length - 1),
                g,
                c;
            if (d.length % 2 === 0) {
              c = [d.replace(/\\\\/g, "\\")];
              g = 1;
            } else {
              c = [d.substr(1).replace(/\\\\/g, "\\"), "$"];
              g = 0;
            }
            c = MathJax.HTML.Element("span", null, c);
            var e = MathJax.HTML.TextNode(b.nodeValue.substr(0, a.index));
            b.nodeValue = b.nodeValue.substr(a.index + a[0].length - g);
            b.parentNode.insertBefore(c, b);
            b.parentNode.insertBefore(e, c);
            this.pattern.lastIndex = g;
          }
        }
      }
      return b;
    },
    endMatch: function(a, c) {
      var b = this.search;
      if (a[0] == b.end) {
        if (!b.close || b.pcount === 0) {
          b.close = c;
          b.cpos = this.pattern.lastIndex;
          b.clen = (b.isBeginEnd ? 0 : a[0].length);
        }
        if (b.pcount === 0) {
          b.matched = true;
          c = this.encloseMath(c);
          this.switchPattern(this.start);
        }
      } else {
        if (a[0] === "{") {
          b.pcount++;
        } else {
          if (a[0] === "}" && b.pcount) {
            b.pcount--;
          }
        }
      }
      return c;
    },
    prevEndMatch: function() {
      this.search.matched = true;
      var a = this.encloseMath(this.search.close);
      this.switchPattern(this.start);
      return a;
    },
    switchPattern: function(a) {
      a.lastIndex = this.pattern.lastIndex;
      this.pattern = a;
      this.search.start = (a === this.start);
    },
    encloseMath: function(b) {
      var a = this.search,
          f = a.close,
          e,
          c;
      if (a.cpos === f.length) {
        f = f.nextSibling;
      } else {
        f = f.splitText(a.cpos);
      }
      if (!f) {
        e = f = MathJax.HTML.addText(a.close.parentNode, "");
      }
      a.close = f;
      c = (a.opos ? a.open.splitText(a.opos) : a.open);
      while (c.nextSibling && c.nextSibling !== f) {
        if (c.nextSibling.nodeValue !== null) {
          if (c.nextSibling.nodeName === "#comment") {
            c.nodeValue += c.nextSibling.nodeValue.replace(/^\[CDATA\[((.|\n|\r)*)\]\]$/, "$1");
          } else {
            c.nodeValue += c.nextSibling.nodeValue;
          }
        } else {
          if (this.msieNewlineBug) {
            c.nodeValue += (c.nextSibling.nodeName.toLowerCase() === "br" ? "\n" : " ");
          } else {
            c.nodeValue += " ";
          }
        }
        c.parentNode.removeChild(c.nextSibling);
      }
      var d = c.nodeValue.substr(a.olen, c.nodeValue.length - a.olen - a.clen);
      c.parentNode.removeChild(c);
      if (this.config.preview !== "none") {
        this.createPreview(a.mode, d);
      }
      c = this.createMathTag(a.mode, d);
      this.search = {};
      this.pattern.lastIndex = 0;
      if (e) {
        e.parentNode.removeChild(e);
      }
      return c;
    },
    insertNode: function(b) {
      var a = this.search;
      a.close.parentNode.insertBefore(b, a.close);
    },
    createPreview: function(c, a) {
      var b = this.config.preview;
      if (b === "none") {
        return;
      }
      if (b === "TeX") {
        b = [this.filterPreview(a)];
      }
      if (b) {
        b = MathJax.HTML.Element("span", {className: MathJax.Hub.config.preRemoveClass}, b);
        this.insertNode(b);
      }
    },
    createMathTag: function(c, b) {
      var a = document.createElement("script");
      a.type = "math/tex" + c;
      MathJax.HTML.setScript(a, b);
      this.insertNode(a);
      return a;
    },
    filterPreview: function(a) {
      return a;
    },
    msieNewlineBug: (MathJax.Hub.Browser.isMSIE && document.documentMode < 9)
  };
  MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.tex2jax]);
  MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js");
  (function(d, h, l, g, m, b, j) {
    var p = "2.6.0";
    var i = MathJax.Extension;
    var c = i.MathEvents = {version: p};
    var k = d.config.menuSettings;
    var o = {
      hover: 500,
      frame: {
        x: 3.5,
        y: 5,
        bwidth: 1,
        bcolor: "#A6D",
        hwidth: "15px",
        hcolor: "#83A"
      },
      button: {
        x: -6,
        y: -3,
        wx: -2
      },
      fadeinInc: 0.2,
      fadeoutInc: 0.05,
      fadeDelay: 50,
      fadeoutStart: 400,
      fadeoutDelay: 15 * 1000,
      styles: {
        ".MathJax_Hover_Frame": {
          "border-radius": ".25em",
          "-webkit-border-radius": ".25em",
          "-moz-border-radius": ".25em",
          "-khtml-border-radius": ".25em",
          "box-shadow": "0px 0px 15px #83A",
          "-webkit-box-shadow": "0px 0px 15px #83A",
          "-moz-box-shadow": "0px 0px 15px #83A",
          "-khtml-box-shadow": "0px 0px 15px #83A",
          border: "1px solid #A6D ! important",
          display: "inline-block",
          position: "absolute"
        },
        ".MathJax_Menu_Button .MathJax_Hover_Arrow": {
          position: "absolute",
          cursor: "pointer",
          display: "inline-block",
          border: "2px solid #AAA",
          "border-radius": "4px",
          "-webkit-border-radius": "4px",
          "-moz-border-radius": "4px",
          "-khtml-border-radius": "4px",
          "font-family": "'Courier New',Courier",
          "font-size": "9px",
          color: "#F0F0F0"
        },
        ".MathJax_Menu_Button .MathJax_Hover_Arrow span": {
          display: "block",
          "background-color": "#AAA",
          border: "1px solid",
          "border-radius": "3px",
          "line-height": 0,
          padding: "4px"
        },
        ".MathJax_Hover_Arrow:hover": {
          color: "white!important",
          border: "2px solid #CCC!important"
        },
        ".MathJax_Hover_Arrow:hover span": {"background-color": "#CCC!important"}
      }
    };
    var n = c.Event = {
      LEFTBUTTON: 0,
      RIGHTBUTTON: 2,
      MENUKEY: "altKey",
      KEY: {
        RETURN: 13,
        ESCAPE: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
      },
      Mousedown: function(q) {
        return n.Handler(q, "Mousedown", this);
      },
      Mouseup: function(q) {
        return n.Handler(q, "Mouseup", this);
      },
      Mousemove: function(q) {
        return n.Handler(q, "Mousemove", this);
      },
      Mouseover: function(q) {
        return n.Handler(q, "Mouseover", this);
      },
      Mouseout: function(q) {
        return n.Handler(q, "Mouseout", this);
      },
      Click: function(q) {
        return n.Handler(q, "Click", this);
      },
      DblClick: function(q) {
        return n.Handler(q, "DblClick", this);
      },
      Menu: function(q) {
        return n.Handler(q, "ContextMenu", this);
      },
      Handler: function(t, r, s) {
        if (l.loadingMathMenu) {
          return n.False(t);
        }
        var q = b[s.jaxID];
        if (!t) {
          t = window.event;
        }
        t.isContextMenu = (r === "ContextMenu");
        if (q[r]) {
          return q[r](t, s);
        }
        if (i.MathZoom) {
          return i.MathZoom.HandleEvent(t, r, s);
        }
      },
      False: function(q) {
        if (!q) {
          q = window.event;
        }
        if (q) {
          if (q.preventDefault) {
            q.preventDefault();
          } else {
            q.returnValue = false;
          }
          if (q.stopPropagation) {
            q.stopPropagation();
          }
          q.cancelBubble = true;
        }
        return false;
      },
      Keydown: function(r, q) {
        if (!r) {
          r = window.event;
        }
        if (r.keyCode === n.KEY.SPACE) {
          n.ContextMenu(r, this);
        }
      },
      ContextMenu: function(t, E, w) {
        var B = b[E.jaxID],
            v = B.getJaxFromMath(E);
        var F = (B.config.showMathMenu != null ? B : d).config.showMathMenu;
        if (!F || (k.context !== "MathJax" && !w)) {
          return;
        }
        if (c.msieEventBug) {
          t = window.event || t;
        }
        n.ClearSelection();
        f.ClearHoverTimer();
        if (v.hover) {
          if (v.hover.remove) {
            clearTimeout(v.hover.remove);
            delete v.hover.remove;
          }
          v.hover.nofade = true;
        }
        var u = MathJax.Menu;
        var G,
            D;
        if (u) {
          if (u.loadingDomain) {
            return n.False(t);
          }
          G = m.loadDomain("MathMenu");
          if (!G) {
            u.jax = v;
            var r = u.menu.Find("Show Math As").submenu;
            r.items[0].name = v.sourceMenuTitle;
            r.items[0].format = (v.sourceMenuFormat || "MathML");
            r.items[1].name = j[v.inputJax].sourceMenuTitle;
            r.items[5].disabled = !j[v.inputJax].annotationEncoding;
            var A = r.items[2];
            A.disabled = true;
            var q = A.submenu.items;
            annotationList = MathJax.Hub.Config.semanticsAnnotations;
            for (var z = 0,
                y = q.length; z < y; z++) {
              var s = q[z].name[1];
              if (v.root && v.root.getAnnotation(s) !== null) {
                A.disabled = false;
                q[z].hidden = false;
              } else {
                q[z].hidden = true;
              }
            }
            var x = u.menu.Find("Math Settings", "MathPlayer");
            x.hidden = !(v.outputJax === "NativeMML" && d.Browser.hasMathPlayer);
            return u.menu.Post(t);
          }
          u.loadingDomain = true;
          D = function() {
            delete u.loadingDomain;
          };
        } else {
          if (l.loadingMathMenu) {
            return n.False(t);
          }
          l.loadingMathMenu = true;
          G = l.Require("[MathJax]/extensions/MathMenu.js");
          D = function() {
            delete l.loadingMathMenu;
            if (!MathJax.Menu) {
              MathJax.Menu = {};
            }
          };
        }
        var C = {
          pageX: t.pageX,
          pageY: t.pageY,
          clientX: t.clientX,
          clientY: t.clientY
        };
        g.Queue(G, D, ["ContextMenu", n, C, E, w]);
        return n.False(t);
      },
      AltContextMenu: function(s, r) {
        var t = b[r.jaxID];
        var q = (t.config.showMathMenu != null ? t : d).config.showMathMenu;
        if (q) {
          q = (t.config.showMathMenuMSIE != null ? t : d).config.showMathMenuMSIE;
          if (k.context === "MathJax" && !k.mpContext && q) {
            if (!c.noContextMenuBug || s.button !== n.RIGHTBUTTON) {
              return;
            }
          } else {
            if (!s[n.MENUKEY] || s.button !== n.LEFTBUTTON) {
              return;
            }
          }
          return t.ContextMenu(s, r, true);
        }
      },
      ClearSelection: function() {
        if (c.safariContextMenuBug) {
          setTimeout("window.getSelection().empty()", 0);
        }
        if (document.selection) {
          setTimeout("document.selection.empty()", 0);
        }
      },
      getBBox: function(s) {
        s.appendChild(c.topImg);
        var r = c.topImg.offsetTop,
            t = s.offsetHeight - r,
            q = s.offsetWidth;
        s.removeChild(c.topImg);
        return {
          w: q,
          h: r,
          d: t
        };
      }
    };
    var f = c.Hover = {
      Mouseover: function(s, r) {
        if (k.discoverable || k.zoom === "Hover") {
          var u = s.fromElement || s.relatedTarget,
              t = s.toElement || s.target;
          if (u && t && (d.isMathJaxNode(u) !== d.isMathJaxNode(t) || d.getJaxFor(u) !== d.getJaxFor(t))) {
            var q = this.getJaxFromMath(r);
            if (q.hover) {
              f.ReHover(q);
            } else {
              f.HoverTimer(q, r);
            }
            return n.False(s);
          }
        }
      },
      Mouseout: function(s, r) {
        if (k.discoverable || k.zoom === "Hover") {
          var u = s.fromElement || s.relatedTarget,
              t = s.toElement || s.target;
          if (u && t && (d.isMathJaxNode(u) !== d.isMathJaxNode(t) || d.getJaxFor(u) !== d.getJaxFor(t))) {
            var q = this.getJaxFromMath(r);
            if (q.hover) {
              f.UnHover(q);
            } else {
              f.ClearHoverTimer();
            }
            return n.False(s);
          }
        }
      },
      Mousemove: function(s, r) {
        if (k.discoverable || k.zoom === "Hover") {
          var q = this.getJaxFromMath(r);
          if (q.hover) {
            return;
          }
          if (f.lastX == s.clientX && f.lastY == s.clientY) {
            return;
          }
          f.lastX = s.clientX;
          f.lastY = s.clientY;
          f.HoverTimer(q, r);
          return n.False(s);
        }
      },
      HoverTimer: function(q, r) {
        this.ClearHoverTimer();
        this.hoverTimer = setTimeout(g(["Hover", this, q, r]), o.hover);
      },
      ClearHoverTimer: function() {
        if (this.hoverTimer) {
          clearTimeout(this.hoverTimer);
          delete this.hoverTimer;
        }
      },
      Hover: function(q, u) {
        if (i.MathZoom && i.MathZoom.Hover({}, u)) {
          return;
        }
        var t = b[q.outputJax],
            v = t.getHoverSpan(q, u),
            y = t.getHoverBBox(q, v, u),
            w = (t.config.showMathMenu != null ? t : d).config.showMathMenu;
        var A = o.frame.x,
            z = o.frame.y,
            x = o.frame.bwidth;
        if (c.msieBorderWidthBug) {
          x = 0;
        }
        q.hover = {
          opacity: 0,
          id: q.inputID + "-Hover"
        };
        var r = h.Element("span", {
          id: q.hover.id,
          isMathJax: true,
          style: {
            display: "inline-block",
            width: 0,
            height: 0,
            position: "relative"
          }
        }, [["span", {
          className: "MathJax_Hover_Frame",
          isMathJax: true,
          style: {
            display: "inline-block",
            position: "absolute",
            top: this.Px(-y.h - z - x - (y.y || 0)),
            left: this.Px(-A - x + (y.x || 0)),
            width: this.Px(y.w + 2 * A),
            height: this.Px(y.h + y.d + 2 * z),
            opacity: 0,
            filter: "alpha(opacity=0)"
          }
        }]]);
        var s = h.Element("span", {
          isMathJax: true,
          id: q.hover.id + "Menu",
          className: "MathJax_Menu_Button",
          style: {
            display: "inline-block",
            "z-index": 1,
            width: 0,
            height: 0,
            position: "relative"
          }
        }, [["span", {
          className: "MathJax_Hover_Arrow",
          isMathJax: true,
          math: u,
          onclick: this.HoverMenu,
          jax: t.id,
          style: {
            left: this.Px(y.w + A + x + (y.x || 0) + o.button.x),
            top: this.Px(-y.h - z - x - (y.y || 0) - o.button.y),
            opacity: 0,
            filter: "alpha(opacity=0)"
          }
        }, [["span", {isMathJax: true}, "\u25BC"]]]]);
        if (y.width) {
          r.style.width = s.style.width = y.width;
          r.style.marginRight = s.style.marginRight = "-" + y.width;
          r.firstChild.style.width = y.width;
          s.firstChild.style.left = "";
          s.firstChild.style.right = this.Px(o.button.wx);
        }
        v.parentNode.insertBefore(r, v);
        if (w) {
          v.parentNode.insertBefore(s, v);
        }
        if (v.style) {
          v.style.position = "relative";
        }
        this.ReHover(q);
      },
      ReHover: function(q) {
        if (q.hover.remove) {
          clearTimeout(q.hover.remove);
        }
        q.hover.remove = setTimeout(g(["UnHover", this, q]), o.fadeoutDelay);
        this.HoverFadeTimer(q, o.fadeinInc);
      },
      UnHover: function(q) {
        if (!q.hover.nofade) {
          this.HoverFadeTimer(q, -o.fadeoutInc, o.fadeoutStart);
        }
      },
      HoverFade: function(q) {
        delete q.hover.timer;
        q.hover.opacity = Math.max(0, Math.min(1, q.hover.opacity + q.hover.inc));
        q.hover.opacity = Math.floor(1000 * q.hover.opacity) / 1000;
        var s = document.getElementById(q.hover.id),
            r = document.getElementById(q.hover.id + "Menu");
        s.firstChild.style.opacity = q.hover.opacity;
        s.firstChild.style.filter = "alpha(opacity=" + Math.floor(100 * q.hover.opacity) + ")";
        if (r) {
          r.firstChild.style.opacity = q.hover.opacity;
          r.firstChild.style.filter = s.style.filter;
        }
        if (q.hover.opacity === 1) {
          return;
        }
        if (q.hover.opacity > 0) {
          this.HoverFadeTimer(q, q.hover.inc);
          return;
        }
        s.parentNode.removeChild(s);
        if (r) {
          r.parentNode.removeChild(r);
        }
        if (q.hover.remove) {
          clearTimeout(q.hover.remove);
        }
        delete q.hover;
      },
      HoverFadeTimer: function(q, s, r) {
        q.hover.inc = s;
        if (!q.hover.timer) {
          q.hover.timer = setTimeout(g(["HoverFade", this, q]), (r || o.fadeDelay));
        }
      },
      HoverMenu: function(q) {
        if (!q) {
          q = window.event;
        }
        return b[this.jax].ContextMenu(q, this.math, true);
      },
      ClearHover: function(q) {
        if (q.hover.remove) {
          clearTimeout(q.hover.remove);
        }
        if (q.hover.timer) {
          clearTimeout(q.hover.timer);
        }
        f.ClearHoverTimer();
        delete q.hover;
      },
      Px: function(q) {
        if (Math.abs(q) < 0.006) {
          return "0px";
        }
        return q.toFixed(2).replace(/\.?0+$/, "") + "px";
      },
      getImages: function() {
        if (k.discoverable) {
          var q = new Image();
          q.src = o.button.src;
        }
      }
    };
    var a = c.Touch = {
      last: 0,
      delay: 500,
      start: function(r) {
        var q = new Date().getTime();
        var s = (q - a.last < a.delay && a.up);
        a.last = q;
        a.up = false;
        if (s) {
          a.timeout = setTimeout(a.menu, a.delay, r, this);
          r.preventDefault();
        }
      },
      end: function(r) {
        var q = new Date().getTime();
        a.up = (q - a.last < a.delay);
        if (a.timeout) {
          clearTimeout(a.timeout);
          delete a.timeout;
          a.last = 0;
          a.up = false;
          r.preventDefault();
          return n.Handler((r.touches[0] || r.touch), "DblClick", this);
        }
      },
      menu: function(r, q) {
        delete a.timeout;
        a.last = 0;
        a.up = false;
        return n.Handler((r.touches[0] || r.touch), "ContextMenu", q);
      }
    };
    d.Browser.Select({
      MSIE: function(q) {
        var s = (document.documentMode || 0);
        var r = q.versionAtLeast("8.0");
        c.msieBorderWidthBug = (document.compatMode === "BackCompat");
        c.msieEventBug = q.isIE9;
        c.msieAlignBug = (!r || s < 8);
        if (s < 9) {
          n.LEFTBUTTON = 1;
        }
      },
      Safari: function(q) {
        c.safariContextMenuBug = true;
      },
      Opera: function(q) {
        c.operaPositionBug = true;
      },
      Konqueror: function(q) {
        c.noContextMenuBug = true;
      }
    });
    c.topImg = (c.msieAlignBug ? h.Element("img", {
      style: {
        width: 0,
        height: 0,
        position: "relative"
      },
      src: "about:blank"
    }) : h.Element("span", {style: {
        width: 0,
        height: 0,
        display: "inline-block"
      }}));
    if (c.operaPositionBug) {
      c.topImg.style.border = "1px solid";
    }
    c.config = o = d.CombineConfig("MathEvents", o);
    var e = function() {
      var q = o.styles[".MathJax_Hover_Frame"];
      q.border = o.frame.bwidth + "px solid " + o.frame.bcolor + " ! important";
      q["box-shadow"] = q["-webkit-box-shadow"] = q["-moz-box-shadow"] = q["-khtml-box-shadow"] = "0px 0px " + o.frame.hwidth + " " + o.frame.hcolor;
    };
    g.Queue(d.Register.StartupHook("End Config", {}), [e], ["getImages", f], ["Styles", l, o.styles], ["Post", d.Startup.signal, "MathEvents Ready"], ["loadComplete", l, "[MathJax]/extensions/MathEvents.js"]);
  })(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.Localization, MathJax.OutputJax, MathJax.InputJax);
  (function(a, d, f, c, j) {
    var k = "2.6.0";
    var i = a.CombineConfig("MathZoom", {styles: {
        "#MathJax_Zoom": {
          position: "absolute",
          "background-color": "#F0F0F0",
          overflow: "auto",
          display: "block",
          "z-index": 301,
          padding: ".5em",
          border: "1px solid black",
          margin: 0,
          "font-weight": "normal",
          "font-style": "normal",
          "text-align": "left",
          "text-indent": 0,
          "text-transform": "none",
          "line-height": "normal",
          "letter-spacing": "normal",
          "word-spacing": "normal",
          "word-wrap": "normal",
          "white-space": "nowrap",
          "float": "none",
          "-webkit-box-sizing": "content-box",
          "-moz-box-sizing": "content-box",
          "box-sizing": "content-box",
          "box-shadow": "5px 5px 15px #AAAAAA",
          "-webkit-box-shadow": "5px 5px 15px #AAAAAA",
          "-moz-box-shadow": "5px 5px 15px #AAAAAA",
          "-khtml-box-shadow": "5px 5px 15px #AAAAAA",
          filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
        },
        "#MathJax_ZoomOverlay": {
          position: "absolute",
          left: 0,
          top: 0,
          "z-index": 300,
          display: "inline-block",
          width: "100%",
          height: "100%",
          border: 0,
          padding: 0,
          margin: 0,
          "background-color": "white",
          opacity: 0,
          filter: "alpha(opacity=0)"
        },
        "#MathJax_ZoomFrame": {
          position: "relative",
          display: "inline-block",
          height: 0,
          width: 0
        },
        "#MathJax_ZoomEventTrap": {
          position: "absolute",
          left: 0,
          top: 0,
          "z-index": 302,
          display: "inline-block",
          border: 0,
          padding: 0,
          margin: 0,
          "background-color": "white",
          opacity: 0,
          filter: "alpha(opacity=0)"
        }
      }});
    var e,
        b,
        g;
    MathJax.Hub.Register.StartupHook("MathEvents Ready", function() {
      g = MathJax.Extension.MathEvents.Event;
      e = MathJax.Extension.MathEvents.Event.False;
      b = MathJax.Extension.MathEvents.Hover;
    });
    var h = MathJax.Extension.MathZoom = {
      version: k,
      settings: a.config.menuSettings,
      scrollSize: 18,
      HandleEvent: function(n, l, m) {
        if (h.settings.CTRL && !n.ctrlKey) {
          return true;
        }
        if (h.settings.ALT && !n.altKey) {
          return true;
        }
        if (h.settings.CMD && !n.metaKey) {
          return true;
        }
        if (h.settings.Shift && !n.shiftKey) {
          return true;
        }
        if (!h[l]) {
          return true;
        }
        return h[l](n, m);
      },
      Click: function(m, l) {
        if (this.settings.zoom === "Click") {
          return this.Zoom(m, l);
        }
      },
      DblClick: function(m, l) {
        if (this.settings.zoom === "Double-Click" || this.settings.zoom === "DoubleClick") {
          return this.Zoom(m, l);
        }
      },
      Hover: function(m, l) {
        if (this.settings.zoom === "Hover") {
          this.Zoom(m, l);
          return true;
        }
        return false;
      },
      Zoom: function(o, u) {
        this.Remove();
        b.ClearHoverTimer();
        g.ClearSelection();
        var s = MathJax.OutputJax[u.jaxID];
        var p = s.getJaxFromMath(u);
        if (p.hover) {
          b.UnHover(p);
        }
        var q = this.findContainer(u);
        var l = Math.floor(0.85 * q.clientWidth),
            t = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        if (this.getOverflow(q) !== "visible") {
          t = Math.min(q.clientHeight, t);
        }
        t = Math.floor(0.85 * t);
        var n = d.Element("span", {id: "MathJax_ZoomFrame"}, [["span", {
          id: "MathJax_ZoomOverlay",
          onmousedown: this.Remove
        }], ["span", {
          id: "MathJax_Zoom",
          onclick: this.Remove,
          style: {
            visibility: "hidden",
            fontSize: this.settings.zscale
          }
        }, [["span", {style: {
            display: "inline-block",
            "white-space": "nowrap"
          }}]]]]);
        var z = n.lastChild,
            w = z.firstChild,
            r = n.firstChild;
        u.parentNode.insertBefore(n, u);
        u.parentNode.insertBefore(u, n);
        if (w.addEventListener) {
          w.addEventListener("mousedown", this.Remove, true);
        }
        var m = z.offsetWidth || z.clientWidth;
        l -= m;
        t -= m;
        z.style.maxWidth = l + "px";
        z.style.maxHeight = t + "px";
        if (this.msieTrapEventBug) {
          var y = d.Element("span", {
            id: "MathJax_ZoomEventTrap",
            onmousedown: this.Remove
          });
          n.insertBefore(y, z);
        }
        if (this.msieZIndexBug) {
          var v = d.addElement(document.body, "img", {
            src: "about:blank",
            id: "MathJax_ZoomTracker",
            width: 0,
            height: 0,
            style: {
              width: 0,
              height: 0,
              position: "relative"
            }
          });
          n.style.position = "relative";
          n.style.zIndex = i.styles["#MathJax_ZoomOverlay"]["z-index"];
          n = v;
        }
        var x = s.Zoom(p, w, u, l, t);
        if (this.msiePositionBug) {
          if (this.msieSizeBug) {
            z.style.height = x.zH + "px";
            z.style.width = x.zW + "px";
          }
          if (z.offsetHeight > t) {
            z.style.height = t + "px";
            z.style.width = (x.zW + this.scrollSize) + "px";
          }
          if (z.offsetWidth > l) {
            z.style.width = l + "px";
            z.style.height = (x.zH + this.scrollSize) + "px";
          }
        }
        if (this.operaPositionBug) {
          z.style.width = Math.min(l, x.zW) + "px";
        }
        if (z.offsetWidth > m && z.offsetWidth - m < l && z.offsetHeight - m < t) {
          z.style.overflow = "visible";
        }
        this.Position(z, x);
        if (this.msieTrapEventBug) {
          y.style.height = z.clientHeight + "px";
          y.style.width = z.clientWidth + "px";
          y.style.left = (parseFloat(z.style.left) + z.clientLeft) + "px";
          y.style.top = (parseFloat(z.style.top) + z.clientTop) + "px";
        }
        z.style.visibility = "";
        if (this.settings.zoom === "Hover") {
          r.onmouseover = this.Remove;
        }
        if (window.addEventListener) {
          addEventListener("resize", this.Resize, false);
        } else {
          if (window.attachEvent) {
            attachEvent("onresize", this.Resize);
          } else {
            this.onresize = window.onresize;
            window.onresize = this.Resize;
          }
        }
        a.signal.Post(["math zoomed", p]);
        return e(o);
      },
      Position: function(p, r) {
        p.style.display = "none";
        var q = this.Resize(),
            m = q.x,
            s = q.y,
            l = r.mW;
        p.style.display = "";
        var o = -l - Math.floor((p.offsetWidth - l) / 2),
            n = r.Y;
        p.style.left = Math.max(o, 10 - m) + "px";
        p.style.top = Math.max(n, 10 - s) + "px";
        if (!h.msiePositionBug) {
          h.SetWH();
        }
      },
      Resize: function(m) {
        if (h.onresize) {
          h.onresize(m);
        }
        var q = document.getElementById("MathJax_ZoomFrame"),
            l = document.getElementById("MathJax_ZoomOverlay");
        var o = h.getXY(q),
            n = h.findContainer(q);
        if (h.getOverflow(n) !== "visible") {
          l.scroll_parent = n;
          var p = h.getXY(n);
          o.x -= p.x;
          o.y -= p.y;
          p = h.getBorder(n);
          o.x -= p.x;
          o.y -= p.y;
        }
        l.style.left = (-o.x) + "px";
        l.style.top = (-o.y) + "px";
        if (h.msiePositionBug) {
          setTimeout(h.SetWH, 0);
        } else {
          h.SetWH();
        }
        return o;
      },
      SetWH: function() {
        var l = document.getElementById("MathJax_ZoomOverlay");
        if (!l) {
          return;
        }
        l.style.display = "none";
        var m = l.scroll_parent || document.documentElement || document.body;
        l.style.width = m.scrollWidth + "px";
        l.style.height = Math.max(m.clientHeight, m.scrollHeight) + "px";
        l.style.display = "";
      },
      findContainer: function(l) {
        l = l.parentNode;
        while (l.parentNode && l !== document.body && h.getOverflow(l) === "visible") {
          l = l.parentNode;
        }
        return l;
      },
      getOverflow: (window.getComputedStyle ? function(l) {
        return getComputedStyle(l).overflow;
      } : function(l) {
        return (l.currentStyle || {overflow: "visible"}).overflow;
      }),
      getBorder: function(o) {
        var m = {
          thin: 1,
          medium: 2,
          thick: 3
        };
        var n = (window.getComputedStyle ? getComputedStyle(o) : (o.currentStyle || {
          borderLeftWidth: 0,
          borderTopWidth: 0
        }));
        var l = n.borderLeftWidth,
            p = n.borderTopWidth;
        if (m[l]) {
          l = m[l];
        } else {
          l = parseInt(l);
        }
        if (m[p]) {
          p = m[p];
        } else {
          p = parseInt(p);
        }
        return {
          x: l,
          y: p
        };
      },
      getXY: function(o) {
        var l = 0,
            n = 0,
            m;
        m = o;
        while (m.offsetParent) {
          l += m.offsetLeft;
          m = m.offsetParent;
        }
        if (h.operaPositionBug) {
          o.style.border = "1px solid";
        }
        m = o;
        while (m.offsetParent) {
          n += m.offsetTop;
          m = m.offsetParent;
        }
        if (h.operaPositionBug) {
          o.style.border = "";
        }
        return {
          x: l,
          y: n
        };
      },
      Remove: function(n) {
        var p = document.getElementById("MathJax_ZoomFrame");
        if (p) {
          var o = MathJax.OutputJax[p.previousSibling.jaxID];
          var l = o.getJaxFromMath(p.previousSibling);
          a.signal.Post(["math unzoomed", l]);
          p.parentNode.removeChild(p);
          p = document.getElementById("MathJax_ZoomTracker");
          if (p) {
            p.parentNode.removeChild(p);
          }
          if (h.operaRefreshBug) {
            var m = d.addElement(document.body, "div", {
              style: {
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                opacity: 0
              },
              id: "MathJax_OperaDiv"
            });
            document.body.removeChild(m);
          }
          if (window.removeEventListener) {
            removeEventListener("resize", h.Resize, false);
          } else {
            if (window.detachEvent) {
              detachEvent("onresize", h.Resize);
            } else {
              window.onresize = h.onresize;
              delete h.onresize;
            }
          }
        }
        return e(n);
      }
    };
    a.Browser.Select({
      MSIE: function(l) {
        var n = (document.documentMode || 0);
        var m = (n >= 9);
        h.msiePositionBug = !m;
        h.msieSizeBug = l.versionAtLeast("7.0") && (!document.documentMode || n === 7 || n === 8);
        h.msieZIndexBug = (n <= 7);
        h.msieInlineBlockAlignBug = (n <= 7);
        h.msieTrapEventBug = !window.addEventListener;
        if (document.compatMode === "BackCompat") {
          h.scrollSize = 52;
        }
        if (m) {
          delete i.styles["#MathJax_Zoom"].filter;
        }
      },
      Opera: function(l) {
        h.operaPositionBug = true;
        h.operaRefreshBug = true;
      }
    });
    h.topImg = (h.msieInlineBlockAlignBug ? d.Element("img", {
      style: {
        width: 0,
        height: 0,
        position: "relative"
      },
      src: "about:blank"
    }) : d.Element("span", {style: {
        width: 0,
        height: 0,
        display: "inline-block"
      }}));
    if (h.operaPositionBug || h.msieTopBug) {
      h.topImg.style.border = "1px solid";
    }
    MathJax.Callback.Queue(["StartupHook", MathJax.Hub.Register, "Begin Styles", {}], ["Styles", f, i.styles], ["Post", a.Startup.signal, "MathZoom Ready"], ["loadComplete", f, "[MathJax]/extensions/MathZoom.js"]);
  })(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.OutputJax["HTML-CSS"], MathJax.OutputJax.NativeMML);
  (function(f, n, p, e, q) {
    var o = "2.6.1";
    var d = MathJax.Callback.Signal("menu");
    MathJax.Extension.MathMenu = {
      version: o,
      signal: d
    };
    var s = function(t) {
      return MathJax.Localization._.apply(MathJax.Localization, [["MathMenu", t]].concat([].slice.call(arguments, 1)));
    };
    var a = f.Browser.isPC,
        k = f.Browser.isMSIE,
        l = ((document.documentMode || 0) > 8);
    var i = (a ? null : "5px");
    var r = f.CombineConfig("MathMenu", {
      delay: 150,
      showRenderer: true,
      showMathPlayer: true,
      showFontMenu: false,
      showContext: false,
      showDiscoverable: false,
      showLocale: true,
      showLocaleURL: false,
      semanticsAnnotations: {
        TeX: ["TeX", "LaTeX", "application/x-tex"],
        StarMath: ["StarMath 5.0"],
        Maple: ["Maple"],
        ContentMathML: ["MathML-Content", "application/mathml-content+xml"],
        OpenMath: ["OpenMath"]
      },
      windowSettings: {
        status: "no",
        toolbar: "no",
        locationbar: "no",
        menubar: "no",
        directories: "no",
        personalbar: "no",
        resizable: "yes",
        scrollbars: "yes",
        width: 400,
        height: 300,
        left: Math.round((screen.width - 400) / 2),
        top: Math.round((screen.height - 300) / 3)
      },
      styles: {
        "#MathJax_About": {
          position: "fixed",
          left: "50%",
          width: "auto",
          "text-align": "center",
          border: "3px outset",
          padding: "1em 2em",
          "background-color": "#DDDDDD",
          color: "black",
          cursor: "default",
          "font-family": "message-box",
          "font-size": "120%",
          "font-style": "normal",
          "text-indent": 0,
          "text-transform": "none",
          "line-height": "normal",
          "letter-spacing": "normal",
          "word-spacing": "normal",
          "word-wrap": "normal",
          "white-space": "nowrap",
          "float": "none",
          "z-index": 201,
          "border-radius": "15px",
          "-webkit-border-radius": "15px",
          "-moz-border-radius": "15px",
          "-khtml-border-radius": "15px",
          "box-shadow": "0px 10px 20px #808080",
          "-webkit-box-shadow": "0px 10px 20px #808080",
          "-moz-box-shadow": "0px 10px 20px #808080",
          "-khtml-box-shadow": "0px 10px 20px #808080",
          filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
        },
        "#MathJax_About.MathJax_MousePost": {outline: "none"},
        ".MathJax_Menu": {
          position: "absolute",
          "background-color": "white",
          color: "black",
          width: "auto",
          padding: (a ? "2px" : "5px 0px"),
          border: "1px solid #CCCCCC",
          margin: 0,
          cursor: "default",
          font: "menu",
          "text-align": "left",
          "text-indent": 0,
          "text-transform": "none",
          "line-height": "normal",
          "letter-spacing": "normal",
          "word-spacing": "normal",
          "word-wrap": "normal",
          "white-space": "nowrap",
          "float": "none",
          "z-index": 201,
          "border-radius": i,
          "-webkit-border-radius": i,
          "-moz-border-radius": i,
          "-khtml-border-radius": i,
          "box-shadow": "0px 10px 20px #808080",
          "-webkit-box-shadow": "0px 10px 20px #808080",
          "-moz-box-shadow": "0px 10px 20px #808080",
          "-khtml-box-shadow": "0px 10px 20px #808080",
          filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
        },
        ".MathJax_MenuItem": {
          padding: (a ? "2px 2em" : "1px 2em"),
          background: "transparent"
        },
        ".MathJax_MenuArrow": {
          position: "absolute",
          right: ".5em",
          "padding-top": ".25em",
          color: "#666666",
          "font-family": (k ? "'Arial unicode MS'" : null),
          "font-size": ".75em"
        },
        ".MathJax_MenuActive .MathJax_MenuArrow": {color: "white"},
        ".MathJax_MenuArrow.RTL": {
          left: ".5em",
          right: "auto"
        },
        ".MathJax_MenuCheck": {
          position: "absolute",
          left: ".7em",
          "font-family": (k ? "'Arial unicode MS'" : null)
        },
        ".MathJax_MenuCheck.RTL": {
          right: ".7em",
          left: "auto"
        },
        ".MathJax_MenuRadioCheck": {
          position: "absolute",
          left: (a ? "1em" : ".7em")
        },
        ".MathJax_MenuRadioCheck.RTL": {
          right: (a ? "1em" : ".7em"),
          left: "auto"
        },
        ".MathJax_MenuLabel": {
          padding: (a ? "2px 2em 4px 1.33em" : "1px 2em 3px 1.33em"),
          "font-style": "italic"
        },
        ".MathJax_MenuRule": {
          "border-top": (a ? "1px solid #CCCCCC" : "1px solid #DDDDDD"),
          margin: (a ? "4px 1px 0px" : "4px 3px")
        },
        ".MathJax_MenuDisabled": {color: "GrayText"},
        ".MathJax_MenuActive": {
          "background-color": (a ? "Highlight" : "#606872"),
          color: (a ? "HighlightText" : "white")
        },
        ".MathJax_MenuDisabled:focus, .MathJax_MenuLabel:focus": {"background-color": "#E8E8E8"},
        ".MathJax_ContextMenu:focus": {outline: "none"},
        ".MathJax_ContextMenu .MathJax_MenuItem:focus": {outline: "none"},
        "#MathJax_AboutClose": {
          top: ".2em",
          right: ".2em"
        },
        ".MathJax_Menu .MathJax_MenuClose": {
          top: "-10px",
          left: "-10px"
        },
        ".MathJax_MenuClose": {
          position: "absolute",
          cursor: "pointer",
          display: "inline-block",
          border: "2px solid #AAA",
          "border-radius": "18px",
          "-webkit-border-radius": "18px",
          "-moz-border-radius": "18px",
          "-khtml-border-radius": "18px",
          "font-family": "'Courier New',Courier",
          "font-size": "24px",
          color: "#F0F0F0"
        },
        ".MathJax_MenuClose span": {
          display: "block",
          "background-color": "#AAA",
          border: "1.5px solid",
          "border-radius": "18px",
          "-webkit-border-radius": "18px",
          "-moz-border-radius": "18px",
          "-khtml-border-radius": "18px",
          "line-height": 0,
          padding: "8px 0 6px"
        },
        ".MathJax_MenuClose:hover": {
          color: "white!important",
          border: "2px solid #CCC!important"
        },
        ".MathJax_MenuClose:hover span": {"background-color": "#CCC!important"},
        ".MathJax_MenuClose:hover:focus": {outline: "none"}
      }
    });
    var m,
        j,
        b;
    f.Register.StartupHook("MathEvents Ready", function() {
      m = MathJax.Extension.MathEvents.Event.False;
      j = MathJax.Extension.MathEvents.Hover;
      b = MathJax.Extension.MathEvents.Event.KEY;
    });
    var h = MathJax.Object.Subclass({
      Keydown: function(t, u) {
        switch (t.keyCode) {
          case b.ESCAPE:
            this.Remove(t, u);
            break;
          case b.RIGHT:
            this.Right(t, u);
            break;
          case b.LEFT:
            this.Left(t, u);
            break;
          case b.UP:
            this.Up(t, u);
            break;
          case b.DOWN:
            this.Down(t, u);
            break;
          case b.RETURN:
          case b.SPACE:
            this.Space(t, u);
            break;
          default:
            return;
            break;
        }
        return m(t);
      },
      Escape: function(t, u) {},
      Right: function(t, u) {},
      Left: function(t, u) {},
      Up: function(t, u) {},
      Down: function(t, u) {},
      Space: function(t, u) {}
    }, {});
    var g = MathJax.Menu = h.Subclass({
      version: o,
      items: [],
      posted: false,
      title: null,
      margin: 5,
      Init: function(t) {
        this.items = [].slice.call(arguments, 0);
      },
      With: function(t) {
        if (t) {
          f.Insert(this, t);
        }
        return this;
      },
      Post: function(u, I, G) {
        if (!u) {
          u = window.event || {};
        }
        var t = document.getElementById("MathJax_MenuFrame");
        if (!t) {
          t = g.Background(this);
          delete c.lastItem;
          delete c.lastMenu;
          delete g.skipUp;
          d.Post(["post", g.jax]);
          g.isRTL = (MathJax.Localization.fontDirection() === "rtl");
        }
        var v = n.Element("div", {
          onmouseup: g.Mouseup,
          ondblclick: m,
          ondragstart: m,
          onselectstart: m,
          oncontextmenu: m,
          menuItem: this,
          className: "MathJax_Menu",
          onkeydown: g.Keydown,
          role: "menu"
        });
        if (u.type === "contextmenu" || u.type === "mouseover") {
          v.className += " MathJax_ContextMenu";
        }
        if (!G) {
          MathJax.Localization.setCSS(v);
        }
        for (var B = 0,
            z = this.items.length; B < z; B++) {
          this.items[B].Create(v);
        }
        if (g.isMobile) {
          n.addElement(v, "span", {
            className: "MathJax_MenuClose",
            menu: I,
            ontouchstart: g.Close,
            ontouchend: m,
            onmousedown: g.Close,
            onmouseup: m
          }, [["span", {}, "\u00D7"]]);
        }
        t.appendChild(v);
        this.posted = true;
        if (v.offsetWidth) {
          v.style.width = (v.offsetWidth + 2) + "px";
        }
        var H = u.pageX,
            F = u.pageY;
        if (!H && !F && "clientX" in u) {
          H = u.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          F = u.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        if (!I) {
          var w = g.CurrentNode() || u.target;
          if ((u.type === "keydown" || (!H && !F)) && w) {
            var C = window.pageXOffset || document.documentElement.scrollLeft;
            var A = window.pageYOffset || document.documentElement.scrollTop;
            var E = w.getBoundingClientRect();
            H = (E.right + E.left) / 2 + C;
            F = (E.bottom + E.top) / 2 + A;
          }
          if (H + v.offsetWidth > document.body.offsetWidth - this.margin) {
            H = document.body.offsetWidth - v.offsetWidth - this.margin;
          }
          if (g.isMobile) {
            H = Math.max(5, H - Math.floor(v.offsetWidth / 2));
            F -= 20;
          }
          g.skipUp = u.isContextMenu;
        } else {
          var D = "left",
              L = I.offsetWidth;
          H = (g.isMobile ? 30 : L - 2);
          F = 0;
          while (I && I !== t) {
            H += I.offsetLeft;
            F += I.offsetTop;
            I = I.parentNode;
          }
          if (!g.isMobile) {
            if ((g.isRTL && H - L - v.offsetWidth > this.margin) || (!g.isRTL && H + v.offsetWidth > document.body.offsetWidth - this.margin)) {
              D = "right";
              H = Math.max(this.margin, H - L - v.offsetWidth + 6);
            }
          }
          if (!a) {
            v.style["borderRadiusTop" + D] = 0;
            v.style["WebkitBorderRadiusTop" + D] = 0;
            v.style["MozBorderRadiusTop" + D] = 0;
            v.style["KhtmlBorderRadiusTop" + D] = 0;
          }
        }
        v.style.left = H + "px";
        v.style.top = F + "px";
        if (document.selection && document.selection.empty) {
          document.selection.empty();
        }
        var K = window.pageXOffset || document.documentElement.scrollLeft;
        var J = window.pageYOffset || document.documentElement.scrollTop;
        g.Focus(v);
        if (u.type === "keydown") {
          g.skipMouseoverFromKey = true;
          setTimeout(function() {
            delete g.skipMouseoverFromKey;
          }, r.delay);
        }
        window.scrollTo(K, J);
        return m(u);
      },
      Remove: function(t, u) {
        d.Post(["unpost", g.jax]);
        var v = document.getElementById("MathJax_MenuFrame");
        if (v) {
          v.parentNode.removeChild(v);
          if (this.msieFixedPositionBug) {
            detachEvent("onresize", g.Resize);
          }
        }
        if (g.jax.hover) {
          delete g.jax.hover.nofade;
          j.UnHover(g.jax);
        }
        g.Unfocus(u);
        if (t.type === "mousedown") {
          g.CurrentNode().blur();
        }
        return m(t);
      },
      Find: function(t) {
        return this.FindN(1, t, [].slice.call(arguments, 1));
      },
      FindId: function(t) {
        return this.FindN(0, t, [].slice.call(arguments, 1));
      },
      FindN: function(x, u, w) {
        for (var v = 0,
            t = this.items.length; v < t; v++) {
          if (this.items[v].name[x] === u) {
            if (w.length) {
              if (!this.items[v].submenu) {
                return null;
              }
              return this.items[v].submenu.FindN(x, w[0], w.slice(1));
            }
            return this.items[v];
          }
        }
        return null;
      },
      IndexOf: function(t) {
        return this.IndexOfN(1, t);
      },
      IndexOfId: function(t) {
        return this.IndexOfN(0, t);
      },
      IndexOfN: function(w, u) {
        for (var v = 0,
            t = this.items.length; v < t; v++) {
          if (this.items[v].name[w] === u) {
            return v;
          }
        }
        return null;
      },
      Right: function(t, u) {
        g.Right(t, u);
      },
      Left: function(t, u) {
        g.Left(t, u);
      },
      Up: function(u, v) {
        var t = v.lastChild;
        t.menuItem.Activate(u, t);
      },
      Down: function(u, v) {
        var t = v.firstChild;
        t.menuItem.Activate(u, t);
      },
      Space: function(t, u) {
        this.Remove(t, u);
      }
    }, {
      config: r,
      Remove: function(t) {
        return g.Event(t, this, "Remove");
      },
      Mouseover: function(t) {
        return g.Event(t, this, "Mouseover");
      },
      Mouseout: function(t) {
        return g.Event(t, this, "Mouseout");
      },
      Mousedown: function(t) {
        return g.Event(t, this, "Mousedown");
      },
      Mouseup: function(t) {
        return g.Event(t, this, "Mouseup");
      },
      Keydown: function(t) {
        return g.Event(t, this, "Keydown");
      },
      Touchstart: function(t) {
        return g.Event(t, this, "Touchstart");
      },
      Touchend: function(t) {
        return g.Event(t, this, "Touchend");
      },
      Close: function(t) {
        return g.Event(t, this.menu || this.parentNode, (this.menu ? "Touchend" : "Remove"));
      },
      Event: function(v, x, t, w) {
        if (g.skipMouseover && t === "Mouseover" && !w) {
          return m(v);
        }
        if (g.skipMouseoverFromKey && t === "Mouseover") {
          delete g.skipMouseoverFromKey;
          return m(v);
        }
        if (g.skipUp) {
          if (t.match(/Mouseup|Touchend/)) {
            delete g.skipUp;
            return m(v);
          }
          if (t === "Touchstart" || (t === "Mousedown" && !g.skipMousedown)) {
            delete g.skipUp;
          }
        }
        if (!v) {
          v = window.event;
        }
        var u = x.menuItem;
        if (u && u[t]) {
          return u[t](v, x);
        }
        return null;
      },
      BGSTYLE: {
        position: "absolute",
        left: 0,
        top: 0,
        "z-index": 200,
        width: "100%",
        height: "100%",
        border: 0,
        padding: 0,
        margin: 0
      },
      Background: function(u) {
        var v = n.addElement(document.body, "div", {
          style: this.BGSTYLE,
          id: "MathJax_MenuFrame"
        }, [["div", {
          style: this.BGSTYLE,
          menuItem: u,
          onmousedown: this.Remove
        }]]);
        var t = v.firstChild;
        if (g.msieBackgroundBug) {
          t.style.backgroundColor = "white";
          t.style.filter = "alpha(opacity=0)";
        }
        if (g.msieFixedPositionBug) {
          v.width = v.height = 0;
          this.Resize();
          attachEvent("onresize", this.Resize);
        } else {
          t.style.position = "fixed";
        }
        return v;
      },
      Resize: function() {
        setTimeout(g.SetWH, 0);
      },
      SetWH: function() {
        var t = document.getElementById("MathJax_MenuFrame");
        if (t) {
          t = t.firstChild;
          t.style.width = t.style.height = "1px";
          t.style.width = document.body.scrollWidth + "px";
          t.style.height = document.body.scrollHeight + "px";
        }
      },
      posted: false,
      active: null,
      GetNode: function(t) {
        var u = document.getElementById(t.inputID + "-Frame");
        return u.isMathJax ? u : u.firstChild;
      },
      CurrentNode: function() {
        return g.GetNode(g.jax);
      },
      AllNodes: function() {
        var u = MathJax.Hub.getAllJax();
        var v = [];
        for (var w = 0,
            t; t = u[w]; w++) {
          v.push(g.GetNode(t));
        }
        return v;
      },
      ActiveNode: function() {
        return g.active;
      },
      FocusNode: function(t) {
        g.active = t;
        t.focus();
      },
      Focus: function(t) {
        !g.posted ? g.Activate(t) : g.ActiveNode().tabIndex = -1;
        t.tabIndex = 0;
        g.FocusNode(t);
      },
      Activate: function(t, u) {
        g.UnsetTabIndex();
        g.posted = true;
      },
      Unfocus: function() {
        g.ActiveNode().tabIndex = -1;
        g.SetTabIndex();
        g.FocusNode(g.CurrentNode());
        g.posted = false;
      },
      MoveHorizontal: function(x, y, v) {
        if (!x.shiftKey) {
          return;
        }
        var u = g.AllNodes();
        var t = u.length;
        if (t === 0) {
          return;
        }
        var w = u[g.Mod(v(g.IndexOf(u, g.CurrentNode())), t)];
        if (w === g.CurrentNode()) {
          return;
        }
        g.menu.Remove(x, y);
        g.jax = MathJax.Hub.getJaxFor(w);
        g.FocusNode(w);
        g.menu.Post(null);
      },
      Right: function(t, u) {
        g.MoveHorizontal(t, u, function(v) {
          return v + 1;
        });
      },
      Left: function(t, u) {
        g.MoveHorizontal(t, u, function(v) {
          return v - 1;
        });
      },
      UnsetTabIndex: function() {
        var u = g.AllNodes();
        for (var v = 0,
            t; t = u[v]; v++) {
          if (t.tabIndex > 0) {
            t.oldTabIndex = t.tabIndex;
          }
          t.tabIndex = -1;
        }
      },
      SetTabIndex: function() {
        var u = g.AllNodes();
        for (var v = 0,
            t; t = u[v]; v++) {
          if (t.oldTabIndex !== undefined) {
            t.tabIndex = t.oldTabIndex;
            delete t.oldTabIndex;
          } else {
            t.tabIndex = f.getTabOrder(t);
          }
        }
      },
      Mod: function(t, u) {
        return ((t % u) + u) % u;
      },
      IndexOf: (Array.prototype.indexOf ? function(t, u, v) {
        return t.indexOf(u, v);
      } : function(t, w, x) {
        for (var v = (x || 0),
            u = t.length; v < u; v++) {
          if (w === t[v]) {
            return v;
          }
        }
        return -1;
      }),
      saveCookie: function() {
        n.Cookie.Set("menu", this.cookie);
      },
      getCookie: function() {
        this.cookie = n.Cookie.Get("menu");
      }
    });
    MathJax.Menu.NAV = h;
    var c = g.ITEM = h.Subclass({
      name: "",
      node: null,
      menu: null,
      Attributes: function(t) {
        return f.Insert({
          onmouseup: g.Mouseup,
          ondragstart: m,
          onselectstart: m,
          onselectend: m,
          ontouchstart: g.Touchstart,
          ontouchend: g.Touchend,
          className: "MathJax_MenuItem",
          role: this.role,
          menuItem: this
        }, t);
      },
      Create: function(v) {
        if (!this.hidden) {
          var u = this.Attributes();
          var t = this.Label(u, v);
          n.addElement(v, "div", u, t);
        }
      },
      Name: function() {
        return s(this.name[0], this.name[1]);
      },
      Mouseover: function(t, u) {
        if (u.parentNode === g.ActiveNode().parentNode) {
          this.Deactivate(g.ActiveNode());
        }
        this.Activate(t, u);
      },
      Mouseout: function(t, u) {
        this.Deactivate(u);
      },
      Mouseup: function(t, u) {
        return this.Remove(t, u);
      },
      DeactivateSubmenus: function(y) {
        var x = document.getElementById("MathJax_MenuFrame").childNodes,
            u = c.GetMenuNode(y).childNodes;
        for (var v = 0,
            t = u.length; v < t; v++) {
          var w = u[v].menuItem;
          if (w && w.submenu && w.submenu.posted && w !== y.menuItem) {
            w.Deactivate(u[v]);
          }
        }
        this.RemoveSubmenus(y, x);
      },
      RemoveSubmenus: function(v, u) {
        u = u || document.getElementById("MathJax_MenuFrame").childNodes;
        var t = u.length - 1;
        while (t >= 0 && c.GetMenuNode(v).menuItem !== u[t].menuItem) {
          u[t].menuItem.posted = false;
          u[t].parentNode.removeChild(u[t]);
          t--;
        }
      },
      Touchstart: function(t, u) {
        return this.TouchEvent(t, u, "Mousedown");
      },
      Touchend: function(t, u) {
        return this.TouchEvent(t, u, "Mouseup");
      },
      TouchEvent: function(u, v, t) {
        if (this !== c.lastItem) {
          if (c.lastMenu) {
            g.Event(u, c.lastMenu, "Mouseout");
          }
          g.Event(u, v, "Mouseover", true);
          c.lastItem = this;
          c.lastMenu = v;
        }
        if (this.nativeTouch) {
          return null;
        }
        g.Event(u, v, t);
        return false;
      },
      Remove: function(t, u) {
        u = u.parentNode.menuItem;
        return u.Remove(t, u);
      },
      With: function(t) {
        if (t) {
          f.Insert(this, t);
        }
        return this;
      },
      isRTL: function() {
        return g.isRTL;
      },
      rtlClass: function() {
        return (this.isRTL() ? " RTL" : "");
      }
    }, {GetMenuNode: function(t) {
        return t.parentNode;
      }});
    g.ENTRY = g.ITEM.Subclass({
      role: "menuitem",
      Attributes: function(t) {
        t = f.Insert({
          onmouseover: g.Mouseover,
          onmouseout: g.Mouseout,
          onmousedown: g.Mousedown,
          onkeydown: g.Keydown,
          "aria-disabled": !!this.disabled
        }, t);
        t = this.SUPER(arguments).Attributes.call(this, t);
        if (this.disabled) {
          t.className += " MathJax_MenuDisabled";
        }
        return t;
      },
      MoveVertical: function(t, D, v) {
        var w = c.GetMenuNode(D);
        var C = [];
        for (var y = 0,
            B = w.menuItem.items,
            x; x = B[y]; y++) {
          if (!x.hidden) {
            C.push(x);
          }
        }
        var A = g.IndexOf(C, this);
        if (A === -1) {
          return;
        }
        var z = C.length;
        var u = w.childNodes;
        do {
          A = g.Mod(v(A), z);
        } while (C[A].hidden || !u[A].role || u[A].role === "separator");
        this.Deactivate(D);
        C[A].Activate(t, u[A]);
      },
      Up: function(u, t) {
        this.MoveVertical(u, t, function(v) {
          return v - 1;
        });
      },
      Down: function(u, t) {
        this.MoveVertical(u, t, function(v) {
          return v + 1;
        });
      },
      Right: function(u, t) {
        this.MoveHorizontal(u, t, g.Right, !this.isRTL());
      },
      Left: function(u, t) {
        this.MoveHorizontal(u, t, g.Left, this.isRTL());
      },
      MoveHorizontal: function(z, y, t, A) {
        var w = c.GetMenuNode(y);
        if (w.menuItem === g.menu && z.shiftKey) {
          t(z, y);
        }
        if (A) {
          return;
        }
        if (w.menuItem !== g.menu) {
          this.Deactivate(y);
        }
        var u = w.previousSibling.childNodes;
        var x = u.length;
        while (x--) {
          var v = u[x];
          if (v.menuItem.submenu && v.menuItem.submenu === w.menuItem) {
            g.Focus(v);
            break;
          }
        }
        this.RemoveSubmenus(y);
      },
      Space: function(t, u) {
        this.Mouseup(t, u);
      },
      Activate: function(t, u) {
        this.Deactivate(u);
        if (!this.disabled) {
          u.className += " MathJax_MenuActive";
        }
        this.DeactivateSubmenus(u);
        g.Focus(u);
      },
      Deactivate: function(t) {
        t.className = t.className.replace(/ MathJax_MenuActive/, "");
      }
    });
    g.ITEM.COMMAND = g.ENTRY.Subclass({
      action: function() {},
      Init: function(t, v, u) {
        if (!(t instanceof Array)) {
          t = [t, t];
        }
        this.name = t;
        this.action = v;
        this.With(u);
      },
      Label: function(t, u) {
        return [this.Name()];
      },
      Mouseup: function(t, u) {
        if (!this.disabled) {
          this.Remove(t, u);
          d.Post(["command", this]);
          this.action.call(this, t);
        }
        return m(t);
      }
    });
    g.ITEM.SUBMENU = g.ENTRY.Subclass({
      submenu: null,
      marker: "\u25BA",
      markerRTL: "\u25C4",
      Attributes: function(t) {
        t = f.Insert({"aria-haspopup": "true"}, t);
        t = this.SUPER(arguments).Attributes.call(this, t);
        return t;
      },
      Init: function(t, v) {
        if (!(t instanceof Array)) {
          t = [t, t];
        }
        this.name = t;
        var u = 1;
        if (!(v instanceof g.ITEM)) {
          this.With(v), u++;
        }
        this.submenu = g.apply(g, [].slice.call(arguments, u));
      },
      Label: function(t, u) {
        this.submenu.posted = false;
        return [this.Name() + " ", ["span", {className: "MathJax_MenuArrow" + this.rtlClass()}, [this.isRTL() ? this.markerRTL : this.marker]]];
      },
      Timer: function(t, u) {
        this.ClearTimer();
        t = {
          type: t.type,
          clientX: t.clientX,
          clientY: t.clientY
        };
        this.timer = setTimeout(e(["Mouseup", this, t, u]), r.delay);
      },
      ClearTimer: function() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      },
      Touchend: function(u, w) {
        var v = this.submenu.posted;
        var t = this.SUPER(arguments).Touchend.apply(this, arguments);
        if (v) {
          this.Deactivate(w);
          delete c.lastItem;
          delete c.lastMenu;
        }
        return t;
      },
      Mouseout: function(t, u) {
        if (!this.submenu.posted) {
          this.Deactivate(u);
        }
        this.ClearTimer();
      },
      Mouseover: function(t, u) {
        this.Activate(t, u);
      },
      Mouseup: function(t, u) {
        if (!this.disabled) {
          if (!this.submenu.posted) {
            this.ClearTimer();
            this.submenu.Post(t, u, this.ltr);
            g.Focus(u);
          } else {
            this.DeactivateSubmenus(u);
          }
        }
        return m(t);
      },
      Activate: function(t, u) {
        if (!this.disabled) {
          this.Deactivate(u);
          u.className += " MathJax_MenuActive";
        }
        if (!this.submenu.posted) {
          this.DeactivateSubmenus(u);
          if (!g.isMobile) {
            this.Timer(t, u);
          }
        }
        g.Focus(u);
      },
      MoveVertical: function(v, u, t) {
        this.ClearTimer();
        this.SUPER(arguments).MoveVertical.apply(this, arguments);
      },
      MoveHorizontal: function(v, x, u, w) {
        if (!w) {
          this.SUPER(arguments).MoveHorizontal.apply(this, arguments);
          return;
        }
        if (this.disabled) {
          return;
        }
        if (!this.submenu.posted) {
          this.Activate(v, x);
          return;
        }
        var t = c.GetMenuNode(x).nextSibling.childNodes;
        if (t.length > 0) {
          this.submenu.items[0].Activate(v, t[0]);
        }
      }
    });
    g.ITEM.RADIO = g.ENTRY.Subclass({
      variable: null,
      marker: (a ? "\u25CF" : "\u2713"),
      role: "menuitemradio",
      Attributes: function(u) {
        var t = r.settings[this.variable] === this.value ? "true" : "false";
        u = f.Insert({"aria-checked": t}, u);
        u = this.SUPER(arguments).Attributes.call(this, u);
        return u;
      },
      Init: function(u, t, v) {
        if (!(u instanceof Array)) {
          u = [u, u];
        }
        this.name = u;
        this.variable = t;
        this.With(v);
        if (this.value == null) {
          this.value = this.name[0];
        }
      },
      Label: function(u, v) {
        var t = {className: "MathJax_MenuRadioCheck" + this.rtlClass()};
        if (r.settings[this.variable] !== this.value) {
          t = {style: {display: "none"}};
        }
        return [["span", t, [this.marker]], " " + this.Name()];
      },
      Mouseup: function(w, x) {
        if (!this.disabled) {
          var y = x.parentNode.childNodes;
          for (var u = 0,
              t = y.length; u < t; u++) {
            var v = y[u].menuItem;
            if (v && v.variable === this.variable) {
              y[u].firstChild.style.display = "none";
            }
          }
          x.firstChild.display = "";
          r.settings[this.variable] = this.value;
          g.cookie[this.variable] = r.settings[this.variable];
          g.saveCookie();
          d.Post(["radio button", this]);
        }
        this.Remove(w, x);
        if (this.action && !this.disabled) {
          this.action.call(g, this);
        }
        return m(w);
      }
    });
    g.ITEM.CHECKBOX = g.ENTRY.Subclass({
      variable: null,
      marker: "\u2713",
      role: "menuitemcheckbox",
      Attributes: function(u) {
        var t = r.settings[this.variable] ? "true" : "false";
        u = f.Insert({"aria-checked": t}, u);
        u = this.SUPER(arguments).Attributes.call(this, u);
        return u;
      },
      Init: function(u, t, v) {
        if (!(u instanceof Array)) {
          u = [u, u];
        }
        this.name = u;
        this.variable = t;
        this.With(v);
      },
      Label: function(u, v) {
        var t = {className: "MathJax_MenuCheck" + this.rtlClass()};
        if (!r.settings[this.variable]) {
          t = {style: {display: "none"}};
        }
        return [["span", t, [this.marker]], " " + this.Name()];
      },
      Mouseup: function(t, u) {
        if (!this.disabled) {
          u.firstChild.display = (r.settings[this.variable] ? "none" : "");
          r.settings[this.variable] = !r.settings[this.variable];
          g.cookie[this.variable] = r.settings[this.variable];
          g.saveCookie();
          d.Post(["checkbox", this]);
        }
        this.Remove(t, u);
        if (this.action && !this.disabled) {
          this.action.call(g, this);
        }
        return m(t);
      }
    });
    g.ITEM.LABEL = g.ENTRY.Subclass({
      role: "menuitem",
      Init: function(t, u) {
        if (!(t instanceof Array)) {
          t = [t, t];
        }
        this.name = t;
        this.With(u);
      },
      Label: function(t, u) {
        t.className += " MathJax_MenuLabel";
        return [this.Name()];
      },
      Activate: function(t, u) {
        this.Deactivate(u);
        g.Focus(u);
      },
      Mouseup: function(t, u) {}
    });
    g.ITEM.RULE = g.ITEM.Subclass({
      role: "separator",
      Attributes: function(t) {
        t = f.Insert({"aria-orientation": "vertical"}, t);
        t = this.SUPER(arguments).Attributes.call(this, t);
        return t;
      },
      Label: function(t, u) {
        t.className += " MathJax_MenuRule";
        return null;
      }
    });
    g.About = function(x) {
      var u = g.About.GetFont();
      var z = g.About.GetFormat();
      var t = ["MathJax.js v" + MathJax.fileversion, ["br"]];
      t.push(["div", {style: {
          "border-top": "groove 2px",
          margin: ".25em 0"
        }}]);
      g.About.GetJax(t, MathJax.InputJax, ["InputJax", "%1 Input Jax v%2"]);
      g.About.GetJax(t, MathJax.OutputJax, ["OutputJax", "%1 Output Jax v%2"]);
      g.About.GetJax(t, MathJax.ElementJax, ["ElementJax", "%1 Element Jax v%2"]);
      t.push(["div", {style: {
          "border-top": "groove 2px",
          margin: ".25em 0"
        }}]);
      g.About.GetJax(t, MathJax.Extension, ["Extension", "%1 Extension v%2"], true);
      t.push(["div", {style: {
          "border-top": "groove 2px",
          margin: ".25em 0"
        }}], ["center", {}, [f.Browser + " v" + f.Browser.version + (z ? " \u2014 " + s(z.replace(/ /g, ""), z) : "")]]);
      g.About.div = g.Background(g.About);
      var w = n.addElement(g.About.div, "div", {
        id: "MathJax_About",
        tabIndex: 0,
        onkeydown: g.About.Keydown
      }, [["b", {style: {fontSize: "120%"}}, ["MathJax"]], " v" + MathJax.version, ["br"], s(u.replace(/ /g, ""), "using " + u), ["br"], ["br"], ["span", {
        style: {
          display: "inline-block",
          "text-align": "left",
          "font-size": "80%",
          "max-height": "20em",
          overflow: "auto",
          "background-color": "#E4E4E4",
          padding: ".4em .6em",
          border: "1px inset"
        },
        tabIndex: 0
      }, t], ["br"], ["br"], ["a", {href: "http://www.mathjax.org/"}, ["www.mathjax.org"]], ["span", {
        className: "MathJax_MenuClose",
        id: "MathJax_AboutClose",
        onclick: g.About.Remove,
        onkeydown: g.About.Keydown,
        tabIndex: 0,
        role: "button",
        "aria-label": s("CloseAboutDialog", "Close about MathJax dialog")
      }, [["span", {}, "\u00D7"]]]]);
      if (x.type === "mouseup") {
        w.className += " MathJax_MousePost";
      }
      w.focus();
      MathJax.Localization.setCSS(w);
      var y = (document.documentElement || {});
      var v = window.innerHeight || y.clientHeight || y.scrollHeight || 0;
      if (g.prototype.msieAboutBug) {
        w.style.width = "20em";
        w.style.position = "absolute";
        w.style.left = Math.floor((document.documentElement.scrollWidth - w.offsetWidth) / 2) + "px";
        w.style.top = (Math.floor((v - w.offsetHeight) / 3) + document.body.scrollTop) + "px";
      } else {
        w.style.marginLeft = Math.floor(-w.offsetWidth / 2) + "px";
        w.style.top = Math.floor((v - w.offsetHeight) / 3) + "px";
      }
    };
    g.About.Remove = function(t) {
      if (g.About.div) {
        document.body.removeChild(g.About.div);
        delete g.About.div;
      }
    };
    g.About.Keydown = function(t) {
      if (t.keyCode === b.ESCAPE || (this.id === "MathJax_AboutClose" && (t.keyCode === b.SPACE || t.keyCode === b.RETURN))) {
        g.About.Remove(t);
        g.CurrentNode().focus();
        m(t);
      }
    }, g.About.GetJax = function(u, z, x, w) {
      var y = [];
      for (var A in z) {
        if (z.hasOwnProperty(A) && z[A]) {
          if ((w && z[A].version) || (z[A].isa && z[A].isa(z))) {
            y.push(s(x[0], x[1], (z[A].id || A), z[A].version));
          }
        }
      }
      y.sort();
      for (var v = 0,
          t = y.length; v < t; v++) {
        u.push(y[v], ["br"]);
      }
      return u;
    };
    g.About.GetFont = function() {
      var t = MathJax.Hub.outputJax["jax/mml"][0] || {};
      var u = {
        SVG: "web SVG",
        CommonHTML: "web TeX",
        "HTML-CSS": (t.imgFonts ? "image" : (t.webFonts ? "web" : "local") + " " + t.fontInUse)
      }[t.id] || "generic";
      return u + " fonts";
    };
    g.About.GetFormat = function() {
      var t = MathJax.Hub.outputJax["jax/mml"][0] || {};
      if (t.id !== "HTML-CSS" || !t.webFonts || t.imgFonts) {
        return;
      }
      return t.allowWebFonts.replace(/otf/, "woff or otf") + " fonts";
    };
    g.Help = function(t) {
      p.Require("[MathJax]/extensions/HelpDialog.js", function() {
        MathJax.Extension.Help.Dialog({type: t.type});
      });
    };
    g.ShowSource = function(x) {
      if (!x) {
        x = window.event;
      }
      var w = {
        screenX: x.screenX,
        screenY: x.screenY
      };
      if (!g.jax) {
        return;
      }
      if (this.format === "MathML") {
        var u = MathJax.ElementJax.mml;
        if (u && typeof(u.mbase.prototype.toMathML) !== "undefined") {
          try {
            g.ShowSource.Text(g.jax.root.toMathML("", g.jax), x);
          } catch (v) {
            if (!v.restart) {
              throw v;
            }
            e.After([this, g.ShowSource, w], v.restart);
          }
        } else {
          if (!p.loadingToMathML) {
            p.loadingToMathML = true;
            g.ShowSource.Window(x);
            e.Queue(p.Require("[MathJax]/extensions/toMathML.js"), function() {
              delete p.loadingToMathML;
              if (!u.mbase.prototype.toMathML) {
                u.mbase.prototype.toMathML = function() {};
              }
            }, [this, g.ShowSource, w]);
            return;
          }
        }
      } else {
        if (this.format === "Error") {
          g.ShowSource.Text(g.jax.errorText, x);
        } else {
          if (r.semanticsAnnotations[this.format]) {
            var t = g.jax.root.getAnnotation(this.format);
            if (t.data[0]) {
              g.ShowSource.Text(t.data[0].toString());
            }
          } else {
            if (g.jax.originalText == null) {
              alert(s("NoOriginalForm", "No original form available"));
              return;
            }
            g.ShowSource.Text(g.jax.originalText, x);
          }
        }
      }
    };
    g.ShowSource.Window = function(u) {
      if (!g.ShowSource.w) {
        var v = [],
            t = r.windowSettings;
        for (var w in t) {
          if (t.hasOwnProperty(w)) {
            v.push(w + "=" + t[w]);
          }
        }
        g.ShowSource.w = window.open("", "_blank", v.join(","));
      }
      return g.ShowSource.w;
    };
    g.ShowSource.Text = function(y, v) {
      var t = g.ShowSource.Window(v);
      delete g.ShowSource.w;
      y = y.replace(/^\s*/, "").replace(/\s*$/, "");
      y = y.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var x = s("EqSource", "MathJax Equation Source");
      if (g.isMobile) {
        t.document.open();
        t.document.write("<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0' /><title>" + x + "</title></head><body style='font-size:85%'>");
        t.document.write("<pre>" + y + "</pre>");
        t.document.write("<hr><input type='button' value='" + s("Close", "Close") + "' onclick='window.close()' />");
        t.document.write("</body></html>");
        t.document.close();
      } else {
        t.document.open();
        t.document.write("<html><head><title>" + x + "</title></head><body style='font-size:85%'>");
        t.document.write("<table><tr><td><pre>" + y + "</pre></td></tr></table>");
        t.document.write("</body></html>");
        t.document.close();
        var u = t.document.body.firstChild;
        setTimeout(function() {
          var A = (t.outerHeight - t.innerHeight) || 30,
              z = (t.outerWidth - t.innerWidth) || 30,
              w,
              D;
          z = Math.max(140, Math.min(Math.floor(0.5 * screen.width), u.offsetWidth + z + 25));
          A = Math.max(40, Math.min(Math.floor(0.5 * screen.height), u.offsetHeight + A + 25));
          if (g.prototype.msieHeightBug) {
            A += 35;
          }
          t.resizeTo(z, A);
          var C;
          try {
            C = v.screenX;
          } catch (B) {}
          if (v && C != null) {
            w = Math.max(0, Math.min(v.screenX - Math.floor(z / 2), screen.width - z - 20));
            D = Math.max(0, Math.min(v.screenY - Math.floor(A / 2), screen.height - A - 20));
            t.moveTo(w, D);
          }
        }, 50);
      }
    };
    g.Scale = function() {
      var y = ["CommonHTML", "HTML-CSS", "SVG", "NativeMML", "PreviewHTML"],
          t = y.length,
          x = 100,
          v,
          u;
      for (v = 0; v < t; v++) {
        u = q[y[v]];
        if (u) {
          x = u.config.scale;
          break;
        }
      }
      var w = prompt(s("ScaleMath", "Scale all mathematics (compared to surrounding text) by"), x + "%");
      if (w) {
        if (w.match(/^\s*\d+(\.\d*)?\s*%?\s*$/)) {
          w = parseFloat(w);
          if (w) {
            if (w !== x) {
              for (v = 0; v < t; v++) {
                u = q[y[v]];
                if (u) {
                  u.config.scale = w;
                }
              }
              g.cookie.scale = f.config.scale = w;
              g.saveCookie();
              f.Queue(["Rerender", f]);
            }
          } else {
            alert(s("NonZeroScale", "The scale should not be zero"));
          }
        } else {
          alert(s("PercentScale", "The scale should be a percentage (e.g., 120%%)"));
        }
      }
    };
    g.Zoom = function() {
      if (!MathJax.Extension.MathZoom) {
        p.Require("[MathJax]/extensions/MathZoom.js");
      }
    };
    g.Renderer = function() {
      var u = f.outputJax["jax/mml"];
      if (u[0] !== r.settings.renderer) {
        var x = f.Browser,
            w,
            t = g.Renderer.Messages,
            v;
        switch (r.settings.renderer) {
          case "NativeMML":
            if (!r.settings.warnedMML) {
              if (x.isChrome && x.version.substr(0, 3) !== "24.") {
                w = t.MML.WebKit;
              } else {
                if (x.isSafari && !x.versionAtLeast("5.0")) {
                  w = t.MML.WebKit;
                } else {
                  if (x.isMSIE) {
                    if (!x.hasMathPlayer) {
                      w = t.MML.MSIE;
                    }
                  } else {
                    if (x.isEdge) {
                      w = t.MML.WebKit;
                    } else {
                      w = t.MML[x];
                    }
                  }
                }
              }
              v = "warnedMML";
            }
            break;
          case "SVG":
            if (!r.settings.warnedSVG) {
              if (x.isMSIE && !l) {
                w = t.SVG.MSIE;
              }
            }
            break;
        }
        if (w) {
          w = s(w[0], w[1]);
          w += "\n\n";
          w += s("SwitchAnyway", "Switch the renderer anyway?\n\n(Press OK to switch, CANCEL to continue with the current renderer)");
          g.cookie.renderer = u[0].id;
          g.saveCookie();
          if (!confirm(w)) {
            g.cookie.renderer = r.settings.renderer = n.Cookie.Get("menu").renderer;
            g.saveCookie();
            return;
          }
          if (v) {
            g.cookie.warned = r.settings.warned = true;
          }
          g.cookie.renderer = r.settings.renderer;
          g.saveCookie();
        }
        f.Queue(["setRenderer", f, r.settings.renderer, "jax/mml"], ["Rerender", f]);
      }
    };
    g.Renderer.Messages = {
      MML: {
        WebKit: ["WebkitNativeMMLWarning", "Your browser doesn't seem to support MathML natively, so switching to MathML output may cause the mathematics on the page to become unreadable."],
        MSIE: ["MSIENativeMMLWarning", "Internet Explorer requires the MathPlayer plugin in order to process MathML output."],
        Opera: ["OperaNativeMMLWarning", "Opera's support for MathML is limited, so switching to MathML output may cause some expressions to render poorly."],
        Safari: ["SafariNativeMMLWarning", "Your browser's native MathML does not implement all the features used by MathJax, so some expressions may not render properly."],
        Firefox: ["FirefoxNativeMMLWarning", "Your browser's native MathML does not implement all the features used by MathJax, so some expressions may not render properly."]
      },
      SVG: {MSIE: ["MSIESVGWarning", "SVG is not implemented in Internet Explorer prior to IE9 or when it is emulating IE8 or below. Switching to SVG output will cause the mathematics to not display properly."]}
    };
    g.AssistiveMML = function(v, t) {
      var u = MathJax.Extension.AssistiveMML;
      if (!u) {
        if (!t) {
          p.Require("[MathJax]/extensions/AssistiveMML.js", ["AssistiveMML", g, v, true]);
        }
        return;
      }
      MathJax.Hub.Queue([(r.settings.assistiveMML ? "Add" : "Remove") + "AssistiveMathML", u]);
    };
    g.Font = function() {
      var t = q["HTML-CSS"];
      if (!t) {
        return;
      }
      document.location.reload();
    };
    g.Locale = function() {
      MathJax.Localization.setLocale(r.settings.locale);
      MathJax.Hub.Queue(["Reprocess", MathJax.Hub]);
    };
    g.LoadLocale = function() {
      var t = prompt(s("LoadURL", "Load translation data from this URL:"));
      if (t) {
        if (!t.match(/\.js$/)) {
          alert(s("BadURL", "The URL should be for a javascript file that defines MathJax translation data.  Javascript file names should end with '.js'"));
        }
        p.Require(t, function(u) {
          if (u != p.STATUS.OK) {
            alert(s("BadData", "Failed to load translation data from %1", t));
          }
        });
      }
    };
    g.MPEvents = function(v) {
      var u = r.settings.discoverable,
          t = g.MPEvents.Messages;
      if (!l) {
        if (r.settings.mpMouse && !confirm(s.apply(s, t.IE8warning))) {
          delete g.cookie.mpContext;
          delete r.settings.mpContext;
          delete g.cookie.mpMouse;
          delete r.settings.mpMouse;
          g.saveCookie();
          return;
        }
        r.settings.mpContext = r.settings.mpMouse;
        g.cookie.mpContext = g.cookie.mpMouse = r.settings.mpMouse;
        g.saveCookie();
        MathJax.Hub.Queue(["Rerender", MathJax.Hub]);
      } else {
        if (!u && v.name[1] === "Menu Events" && r.settings.mpContext) {
          alert(s.apply(s, t.IE9warning));
        }
      }
    };
    g.MPEvents.Messages = {
      IE8warning: ["IE8warning", "This will disable the MathJax menu and zoom features, but you can Alt-Click on an expression to obtain the MathJax menu instead.\n\nReally change the MathPlayer settings?"],
      IE9warning: ["IE9warning", "The MathJax contextual menu will be disabled, but you can Alt-Click on an expression to obtain the MathJax menu instead."]
    };
    f.Browser.Select({
      MSIE: function(t) {
        var u = (document.compatMode === "BackCompat");
        var v = t.versionAtLeast("8.0") && document.documentMode > 7;
        g.Augment({
          margin: 20,
          msieBackgroundBug: ((document.documentMode || 0) < 9),
          msieFixedPositionBug: (u || !v),
          msieAboutBug: u,
          msieHeightBug: ((document.documentMode || 0) < 9)
        });
        if (l) {
          delete r.styles["#MathJax_About"].filter;
          delete r.styles[".MathJax_Menu"].filter;
        }
      },
      Firefox: function(t) {
        g.skipMouseover = t.isMobile && t.versionAtLeast("6.0");
        g.skipMousedown = t.isMobile;
      }
    });
    g.isMobile = f.Browser.isMobile;
    g.noContextMenu = f.Browser.noContextMenu;
    g.CreateLocaleMenu = function() {
      if (!g.menu) {
        return;
      }
      var y = g.menu.Find("Language").submenu,
          v = y.items;
      var u = [],
          A = MathJax.Localization.strings;
      for (var z in A) {
        if (A.hasOwnProperty(z)) {
          u.push(z);
        }
      }
      u = u.sort();
      y.items = [];
      for (var w = 0,
          t = u.length; w < t; w++) {
        var x = A[u[w]].menuTitle;
        if (x) {
          x += " (" + u[w] + ")";
        } else {
          x = u[w];
        }
        y.items.push(c.RADIO([u[w], x], "locale", {action: g.Locale}));
      }
      y.items.push(v[v.length - 2], v[v.length - 1]);
    };
    g.CreateAnnotationMenu = function() {
      if (!g.menu) {
        return;
      }
      var v = g.menu.Find("Show Math As", "Annotation").submenu;
      var u = r.semanticsAnnotations;
      for (var t in u) {
        if (u.hasOwnProperty(t)) {
          v.items.push(c.COMMAND([t, t], g.ShowSource, {
            hidden: true,
            nativeTouch: true,
            format: t
          }));
        }
      }
    };
    f.Register.StartupHook("End Config", function() {
      r.settings = f.config.menuSettings;
      if (typeof(r.settings.showRenderer) !== "undefined") {
        r.showRenderer = r.settings.showRenderer;
      }
      if (typeof(r.settings.showFontMenu) !== "undefined") {
        r.showFontMenu = r.settings.showFontMenu;
      }
      if (typeof(r.settings.showContext) !== "undefined") {
        r.showContext = r.settings.showContext;
      }
      g.getCookie();
      g.menu = g(c.SUBMENU(["Show", "Show Math As"], c.COMMAND(["MathMLcode", "MathML Code"], g.ShowSource, {
        nativeTouch: true,
        format: "MathML"
      }), c.COMMAND(["Original", "Original Form"], g.ShowSource, {nativeTouch: true}), c.SUBMENU(["Annotation", "Annotation"], {disabled: true}), c.RULE(), c.CHECKBOX(["texHints", "Show TeX hints in MathML"], "texHints"), c.CHECKBOX(["semantics", "Add original form as annotation"], "semantics")), c.RULE(), c.SUBMENU(["Settings", "Math Settings"], c.SUBMENU(["ZoomTrigger", "Zoom Trigger"], c.RADIO(["Hover", "Hover"], "zoom", {action: g.Zoom}), c.RADIO(["Click", "Click"], "zoom", {action: g.Zoom}), c.RADIO(["DoubleClick", "Double-Click"], "zoom", {action: g.Zoom}), c.RADIO(["NoZoom", "No Zoom"], "zoom", {value: "None"}), c.RULE(), c.LABEL(["TriggerRequires", "Trigger Requires:"]), c.CHECKBOX((f.Browser.isMac ? ["Option", "Option"] : ["Alt", "Alt"]), "ALT"), c.CHECKBOX(["Command", "Command"], "CMD", {hidden: !f.Browser.isMac}), c.CHECKBOX(["Control", "Control"], "CTRL", {hidden: f.Browser.isMac}), c.CHECKBOX(["Shift", "Shift"], "Shift")), c.SUBMENU(["ZoomFactor", "Zoom Factor"], c.RADIO("125%", "zscale"), c.RADIO("133%", "zscale"), c.RADIO("150%", "zscale"), c.RADIO("175%", "zscale"), c.RADIO("200%", "zscale"), c.RADIO("250%", "zscale"), c.RADIO("300%", "zscale"), c.RADIO("400%", "zscale")), c.RULE(), c.SUBMENU(["Renderer", "Math Renderer"], {hidden: !r.showRenderer}, c.RADIO(["HTML-CSS", "HTML-CSS"], "renderer", {action: g.Renderer}), c.RADIO(["CommonHTML", "Common HTML"], "renderer", {
        action: g.Renderer,
        value: "CommonHTML"
      }), c.RADIO(["PreviewHTML", "Preview HTML"], "renderer", {
        action: g.Renderer,
        value: "PreviewHTML"
      }), c.RADIO(["MathML", "MathML"], "renderer", {
        action: g.Renderer,
        value: "NativeMML"
      }), c.RADIO(["SVG", "SVG"], "renderer", {action: g.Renderer}), c.RADIO(["PlainSource", "Plain Source"], "renderer", {
        action: g.Renderer,
        value: "PlainSource"
      }), c.RULE(), c.CHECKBOX(["FastPreview", "Fast Preview"], "FastPreview"), c.CHECKBOX(["AssistiveMML", "Assistive MathML"], "assistiveMML", {action: g.AssistiveMML}), c.CHECKBOX(["InTabOrder", "Include in Tab Order"], "inTabOrder")), c.SUBMENU("MathPlayer", {
        hidden: !f.Browser.isMSIE || !r.showMathPlayer,
        disabled: !f.Browser.hasMathPlayer
      }, c.LABEL(["MPHandles", "Let MathPlayer Handle:"]), c.CHECKBOX(["MenuEvents", "Menu Events"], "mpContext", {
        action: g.MPEvents,
        hidden: !l
      }), c.CHECKBOX(["MouseEvents", "Mouse Events"], "mpMouse", {
        action: g.MPEvents,
        hidden: !l
      }), c.CHECKBOX(["MenuAndMouse", "Mouse and Menu Events"], "mpMouse", {
        action: g.MPEvents,
        hidden: l
      })), c.SUBMENU(["FontPrefs", "Font Preference"], {hidden: !r.showFontMenu}, c.LABEL(["ForHTMLCSS", "For HTML-CSS:"]), c.RADIO(["Auto", "Auto"], "font", {action: g.Font}), c.RULE(), c.RADIO(["TeXLocal", "TeX (local)"], "font", {action: g.Font}), c.RADIO(["TeXWeb", "TeX (web)"], "font", {action: g.Font}), c.RADIO(["TeXImage", "TeX (image)"], "font", {action: g.Font}), c.RULE(), c.RADIO(["STIXLocal", "STIX (local)"], "font", {action: g.Font}), c.RADIO(["STIXWeb", "STIX (web)"], "font", {action: g.Font}), c.RULE(), c.RADIO(["AsanaMathWeb", "Asana Math (web)"], "font", {action: g.Font}), c.RADIO(["GyrePagellaWeb", "Gyre Pagella (web)"], "font", {action: g.Font}), c.RADIO(["GyreTermesWeb", "Gyre Termes (web)"], "font", {action: g.Font}), c.RADIO(["LatinModernWeb", "Latin Modern (web)"], "font", {action: g.Font}), c.RADIO(["NeoEulerWeb", "Neo Euler (web)"], "font", {action: g.Font})), c.SUBMENU(["ContextMenu", "Contextual Menu"], {hidden: !r.showContext}, c.RADIO(["MathJax", "MathJax"], "context"), c.RADIO(["Browser", "Browser"], "context")), c.COMMAND(["Scale", "Scale All Math ..."], g.Scale), c.RULE().With({
        hidden: !r.showDiscoverable,
        name: ["", "discover_rule"]
      }), c.CHECKBOX(["Discoverable", "Highlight on Hover"], "discoverable", {hidden: !r.showDiscoverable})), c.SUBMENU(["Locale", "Language"], {
        hidden: !r.showLocale,
        ltr: true
      }, c.RADIO("en", "locale", {action: g.Locale}), c.RULE().With({
        hidden: !r.showLocaleURL,
        name: ["", "localURL_rule"]
      }), c.COMMAND(["LoadLocale", "Load from URL ..."], g.LoadLocale, {hidden: !r.showLocaleURL})), c.RULE(), c.COMMAND(["About", "About MathJax"], g.About), c.COMMAND(["Help", "MathJax Help"], g.Help));
      if (g.isMobile) {
        (function() {
          var u = r.settings;
          var t = g.menu.Find("Math Settings", "Zoom Trigger").submenu;
          t.items[0].disabled = t.items[1].disabled = true;
          if (u.zoom === "Hover" || u.zoom == "Click") {
            u.zoom = "None";
          }
          t.items = t.items.slice(0, 4);
          if (navigator.appVersion.match(/[ (]Android[) ]/)) {
            g.ITEM.SUBMENU.Augment({marker: "\u00BB"});
          }
        })();
      }
      g.CreateLocaleMenu();
      g.CreateAnnotationMenu();
    });
    g.showRenderer = function(t) {
      g.cookie.showRenderer = r.showRenderer = t;
      g.saveCookie();
      g.menu.Find("Math Settings", "Math Renderer").hidden = !t;
    };
    g.showMathPlayer = function(t) {
      g.cookie.showMathPlayer = r.showMathPlayer = t;
      g.saveCookie();
      g.menu.Find("Math Settings", "MathPlayer").hidden = !t;
    };
    g.showFontMenu = function(t) {
      g.cookie.showFontMenu = r.showFontMenu = t;
      g.saveCookie();
      g.menu.Find("Math Settings", "Font Preference").hidden = !t;
    };
    g.showContext = function(t) {
      g.cookie.showContext = r.showContext = t;
      g.saveCookie();
      g.menu.Find("Math Settings", "Contextual Menu").hidden = !t;
    };
    g.showDiscoverable = function(t) {
      g.cookie.showDiscoverable = r.showDiscoverable = t;
      g.saveCookie();
      g.menu.Find("Math Settings", "Highlight on Hover").hidden = !t;
      g.menu.Find("Math Settings", "discover_rule").hidden = !t;
    };
    g.showLocale = function(t) {
      g.cookie.showLocale = r.showLocale = t;
      g.saveCookie();
      g.menu.Find("Language").hidden = !t;
    };
    MathJax.Hub.Register.StartupHook("HTML-CSS Jax Ready", function() {
      if (!MathJax.OutputJax["HTML-CSS"].config.imageFont) {
        g.menu.Find("Math Settings", "Font Preference", "TeX (image)").disabled = true;
      }
    });
    e.Queue(f.Register.StartupHook("End Config", {}), ["Styles", p, r.styles], ["Post", f.Startup.signal, "MathMenu Ready"], ["loadComplete", p, "[MathJax]/extensions/MathMenu.js"]);
  })(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.CallBack, MathJax.OutputJax);
  MathJax.ElementJax.mml = MathJax.ElementJax({mimeType: "jax/mml"}, {
    id: "mml",
    version: "2.6.0",
    directory: MathJax.ElementJax.directory + "/mml",
    extensionDir: MathJax.ElementJax.extensionDir + "/mml",
    optableDir: MathJax.ElementJax.directory + "/mml/optable"
  });
  MathJax.ElementJax.mml.Augment({Init: function() {
      if (arguments.length === 1 && arguments[0].type === "math") {
        this.root = arguments[0];
      } else {
        this.root = MathJax.ElementJax.mml.math.apply(this, arguments);
      }
      if (this.root.attr && this.root.attr.mode) {
        if (!this.root.display && this.root.attr.mode === "display") {
          this.root.display = "block";
          this.root.attrNames.push("display");
        }
        delete this.root.attr.mode;
        for (var b = 0,
            a = this.root.attrNames.length; b < a; b++) {
          if (this.root.attrNames[b] === "mode") {
            this.root.attrNames.splice(b, 1);
            break;
          }
        }
      }
    }}, {
    INHERIT: "_inherit_",
    AUTO: "_auto_",
    SIZE: {
      INFINITY: "infinity",
      SMALL: "small",
      NORMAL: "normal",
      BIG: "big"
    },
    COLOR: {TRANSPARENT: "transparent"},
    VARIANT: {
      NORMAL: "normal",
      BOLD: "bold",
      ITALIC: "italic",
      BOLDITALIC: "bold-italic",
      DOUBLESTRUCK: "double-struck",
      FRAKTUR: "fraktur",
      BOLDFRAKTUR: "bold-fraktur",
      SCRIPT: "script",
      BOLDSCRIPT: "bold-script",
      SANSSERIF: "sans-serif",
      BOLDSANSSERIF: "bold-sans-serif",
      SANSSERIFITALIC: "sans-serif-italic",
      SANSSERIFBOLDITALIC: "sans-serif-bold-italic",
      MONOSPACE: "monospace",
      INITIAL: "inital",
      TAILED: "tailed",
      LOOPED: "looped",
      STRETCHED: "stretched",
      CALIGRAPHIC: "-tex-caligraphic",
      OLDSTYLE: "-tex-oldstyle"
    },
    FORM: {
      PREFIX: "prefix",
      INFIX: "infix",
      POSTFIX: "postfix"
    },
    LINEBREAK: {
      AUTO: "auto",
      NEWLINE: "newline",
      NOBREAK: "nobreak",
      GOODBREAK: "goodbreak",
      BADBREAK: "badbreak"
    },
    LINEBREAKSTYLE: {
      BEFORE: "before",
      AFTER: "after",
      DUPLICATE: "duplicate",
      INFIXLINBREAKSTYLE: "infixlinebreakstyle"
    },
    INDENTALIGN: {
      LEFT: "left",
      CENTER: "center",
      RIGHT: "right",
      AUTO: "auto",
      ID: "id",
      INDENTALIGN: "indentalign"
    },
    INDENTSHIFT: {INDENTSHIFT: "indentshift"},
    LINETHICKNESS: {
      THIN: "thin",
      MEDIUM: "medium",
      THICK: "thick"
    },
    NOTATION: {
      LONGDIV: "longdiv",
      ACTUARIAL: "actuarial",
      RADICAL: "radical",
      BOX: "box",
      ROUNDEDBOX: "roundedbox",
      CIRCLE: "circle",
      LEFT: "left",
      RIGHT: "right",
      TOP: "top",
      BOTTOM: "bottom",
      UPDIAGONALSTRIKE: "updiagonalstrike",
      DOWNDIAGONALSTRIKE: "downdiagonalstrike",
      UPDIAGONALARROW: "updiagonalarrow",
      VERTICALSTRIKE: "verticalstrike",
      HORIZONTALSTRIKE: "horizontalstrike",
      PHASORANGLE: "phasorangle",
      MADRUWB: "madruwb"
    },
    ALIGN: {
      TOP: "top",
      BOTTOM: "bottom",
      CENTER: "center",
      BASELINE: "baseline",
      AXIS: "axis",
      LEFT: "left",
      RIGHT: "right"
    },
    LINES: {
      NONE: "none",
      SOLID: "solid",
      DASHED: "dashed"
    },
    SIDE: {
      LEFT: "left",
      RIGHT: "right",
      LEFTOVERLAP: "leftoverlap",
      RIGHTOVERLAP: "rightoverlap"
    },
    WIDTH: {
      AUTO: "auto",
      FIT: "fit"
    },
    ACTIONTYPE: {
      TOGGLE: "toggle",
      STATUSLINE: "statusline",
      TOOLTIP: "tooltip",
      INPUT: "input"
    },
    LENGTH: {
      VERYVERYTHINMATHSPACE: "veryverythinmathspace",
      VERYTHINMATHSPACE: "verythinmathspace",
      THINMATHSPACE: "thinmathspace",
      MEDIUMMATHSPACE: "mediummathspace",
      THICKMATHSPACE: "thickmathspace",
      VERYTHICKMATHSPACE: "verythickmathspace",
      VERYVERYTHICKMATHSPACE: "veryverythickmathspace",
      NEGATIVEVERYVERYTHINMATHSPACE: "negativeveryverythinmathspace",
      NEGATIVEVERYTHINMATHSPACE: "negativeverythinmathspace",
      NEGATIVETHINMATHSPACE: "negativethinmathspace",
      NEGATIVEMEDIUMMATHSPACE: "negativemediummathspace",
      NEGATIVETHICKMATHSPACE: "negativethickmathspace",
      NEGATIVEVERYTHICKMATHSPACE: "negativeverythickmathspace",
      NEGATIVEVERYVERYTHICKMATHSPACE: "negativeveryverythickmathspace"
    },
    OVERFLOW: {
      LINBREAK: "linebreak",
      SCROLL: "scroll",
      ELIDE: "elide",
      TRUNCATE: "truncate",
      SCALE: "scale"
    },
    UNIT: {
      EM: "em",
      EX: "ex",
      PX: "px",
      IN: "in",
      CM: "cm",
      MM: "mm",
      PT: "pt",
      PC: "pc"
    },
    TEXCLASS: {
      ORD: 0,
      OP: 1,
      BIN: 2,
      REL: 3,
      OPEN: 4,
      CLOSE: 5,
      PUNCT: 6,
      INNER: 7,
      VCENTER: 8,
      NONE: -1
    },
    TEXCLASSNAMES: ["ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER", "VCENTER"],
    skipAttributes: {
      texClass: true,
      useHeight: true,
      texprimestyle: true
    },
    copyAttributes: {
      displaystyle: 1,
      scriptlevel: 1,
      open: 1,
      close: 1,
      form: 1,
      actiontype: 1,
      fontfamily: true,
      fontsize: true,
      fontweight: true,
      fontstyle: true,
      color: true,
      background: true,
      id: true,
      "class": 1,
      href: true,
      style: true
    },
    copyAttributeNames: ["displaystyle", "scriptlevel", "open", "close", "form", "actiontype", "fontfamily", "fontsize", "fontweight", "fontstyle", "color", "background", "id", "class", "href", "style"],
    nocopyAttributes: {
      fontfamily: true,
      fontsize: true,
      fontweight: true,
      fontstyle: true,
      color: true,
      background: true,
      id: true,
      "class": true,
      href: true,
      style: true,
      xmlns: true
    },
    Error: function(d, e) {
      var c = this.merror(d),
          b = MathJax.Localization.fontDirection(),
          a = MathJax.Localization.fontFamily();
      if (e) {
        c = c.With(e);
      }
      if (b || a) {
        c = this.mstyle(c);
        if (b) {
          c.dir = b;
        }
        if (a) {
          c.style.fontFamily = "font-family: " + a;
        }
      }
      return c;
    }
  });
  (function(a) {
    a.mbase = MathJax.Object.Subclass({
      type: "base",
      isToken: false,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        dir: a.INHERIT
      },
      noInherit: {},
      noInheritAttribute: {texClass: true},
      getRemoved: {},
      linebreakContainer: false,
      Init: function() {
        this.data = [];
        if (this.inferRow && !(arguments.length === 1 && arguments[0].inferred)) {
          this.Append(a.mrow().With({
            inferred: true,
            notParent: true
          }));
        }
        this.Append.apply(this, arguments);
      },
      With: function(e) {
        for (var f in e) {
          if (e.hasOwnProperty(f)) {
            this[f] = e[f];
          }
        }
        return this;
      },
      Append: function() {
        if (this.inferRow && this.data.length) {
          this.data[0].Append.apply(this.data[0], arguments);
        } else {
          for (var f = 0,
              e = arguments.length; f < e; f++) {
            this.SetData(this.data.length, arguments[f]);
          }
        }
      },
      SetData: function(e, f) {
        if (f != null) {
          if (!(f instanceof a.mbase)) {
            f = (this.isToken || this.isChars ? a.chars(f) : a.mtext(f));
          }
          f.parent = this;
          f.setInherit(this.inheritFromMe ? this : this.inherit);
        }
        this.data[e] = f;
      },
      Parent: function() {
        var e = this.parent;
        while (e && e.notParent) {
          e = e.parent;
        }
        return e;
      },
      Get: function(f, k, l) {
        if (!l) {
          if (this[f] != null) {
            return this[f];
          }
          if (this.attr && this.attr[f] != null) {
            return this.attr[f];
          }
        }
        var g = this.Parent();
        if (g && g["adjustChild_" + f] != null) {
          return (g["adjustChild_" + f])(this.childPosition(), k);
        }
        var j = this.inherit;
        var e = j;
        while (j) {
          var i = j[f];
          if (i == null && j.attr) {
            i = j.attr[f];
          }
          if (j.removedStyles && j.getRemoved[f] && i == null) {
            i = j.removedStyles[j.getRemoved[f]];
          }
          if (i != null && j.noInheritAttribute && !j.noInheritAttribute[f]) {
            var h = j.noInherit[this.type];
            if (!(h && h[f])) {
              return i;
            }
          }
          e = j;
          j = j.inherit;
        }
        if (!k) {
          if (this.defaults[f] === a.AUTO) {
            return this.autoDefault(f);
          }
          if (this.defaults[f] !== a.INHERIT && this.defaults[f] != null) {
            return this.defaults[f];
          }
          if (e) {
            return e.defaults[f];
          }
        }
        return null;
      },
      hasValue: function(e) {
        return (this.Get(e, true) != null);
      },
      getValues: function() {
        var f = {};
        for (var g = 0,
            e = arguments.length; g < e; g++) {
          f[arguments[g]] = this.Get(arguments[g]);
        }
        return f;
      },
      adjustChild_scriptlevel: function(f, e) {
        return this.Get("scriptlevel", e);
      },
      adjustChild_displaystyle: function(f, e) {
        return this.Get("displaystyle", e);
      },
      adjustChild_texprimestyle: function(f, e) {
        return this.Get("texprimestyle", e);
      },
      childPosition: function() {
        var h = this,
            g = h.parent;
        while (g.notParent) {
          h = g;
          g = h.parent;
        }
        for (var f = 0,
            e = g.data.length; f < e; f++) {
          if (g.data[f] === h) {
            return f;
          }
        }
        return null;
      },
      setInherit: function(g) {
        if (g !== this.inherit && this.inherit == null) {
          this.inherit = g;
          for (var f = 0,
              e = this.data.length; f < e; f++) {
            if (this.data[f] && this.data[f].setInherit) {
              this.data[f].setInherit(g);
            }
          }
        }
      },
      setTeXclass: function(e) {
        this.getPrevClass(e);
        return (typeof(this.texClass) !== "undefined" ? this : e);
      },
      getPrevClass: function(e) {
        if (e) {
          this.prevClass = e.Get("texClass");
          this.prevLevel = e.Get("scriptlevel");
        }
      },
      updateTeXclass: function(e) {
        if (e) {
          this.prevClass = e.prevClass;
          delete e.prevClass;
          this.prevLevel = e.prevLevel;
          delete e.prevLevel;
          this.texClass = e.Get("texClass");
        }
      },
      texSpacing: function() {
        var f = (this.prevClass != null ? this.prevClass : a.TEXCLASS.NONE);
        var e = (this.Get("texClass") || a.TEXCLASS.ORD);
        if (f === a.TEXCLASS.NONE || e === a.TEXCLASS.NONE) {
          return "";
        }
        if (f === a.TEXCLASS.VCENTER) {
          f = a.TEXCLASS.ORD;
        }
        if (e === a.TEXCLASS.VCENTER) {
          e = a.TEXCLASS.ORD;
        }
        var g = this.TEXSPACE[f][e];
        if (this.prevLevel > 0 && this.Get("scriptlevel") > 0 && g >= 0) {
          return "";
        }
        return this.TEXSPACELENGTH[Math.abs(g)];
      },
      TEXSPACELENGTH: ["", a.LENGTH.THINMATHSPACE, a.LENGTH.MEDIUMMATHSPACE, a.LENGTH.THICKMATHSPACE],
      TEXSPACE: [[0, -1, 2, 3, 0, 0, 0, 1], [-1, -1, 0, 3, 0, 0, 0, 1], [2, 2, 0, 0, 2, 0, 0, 2], [3, 3, 0, 0, 3, 0, 0, 3], [0, 0, 0, 0, 0, 0, 0, 0], [0, -1, 2, 3, 0, 0, 0, 1], [1, 1, 0, 1, 1, 1, 1, 1], [1, -1, 2, 3, 1, 0, 1, 1]],
      autoDefault: function(e) {
        return "";
      },
      isSpacelike: function() {
        return false;
      },
      isEmbellished: function() {
        return false;
      },
      Core: function() {
        return this;
      },
      CoreMO: function() {
        return this;
      },
      childIndex: function(g) {
        if (g == null) {
          return;
        }
        for (var f = 0,
            e = this.data.length; f < e; f++) {
          if (g === this.data[f]) {
            return f;
          }
        }
      },
      CoreIndex: function() {
        return (this.inferRow ? this.data[0] || this : this).childIndex(this.Core());
      },
      hasNewline: function() {
        if (this.isEmbellished()) {
          return this.CoreMO().hasNewline();
        }
        if (this.isToken || this.linebreakContainer) {
          return false;
        }
        for (var f = 0,
            e = this.data.length; f < e; f++) {
          if (this.data[f] && this.data[f].hasNewline()) {
            return true;
          }
        }
        return false;
      },
      array: function() {
        if (this.inferred) {
          return this.data;
        } else {
          return [this];
        }
      },
      toString: function() {
        return this.type + "(" + this.data.join(",") + ")";
      },
      getAnnotation: function() {
        return null;
      }
    }, {
      childrenSpacelike: function() {
        for (var f = 0,
            e = this.data.length; f < e; f++) {
          if (!this.data[f].isSpacelike()) {
            return false;
          }
        }
        return true;
      },
      childEmbellished: function() {
        return (this.data[0] && this.data[0].isEmbellished());
      },
      childCore: function() {
        return (this.inferRow && this.data[0] ? this.data[0].Core() : this.data[0]);
      },
      childCoreMO: function() {
        return (this.data[0] ? this.data[0].CoreMO() : null);
      },
      setChildTeXclass: function(e) {
        if (this.data[0]) {
          e = this.data[0].setTeXclass(e);
          this.updateTeXclass(this.data[0]);
        }
        return e;
      },
      setBaseTeXclasses: function(g) {
        this.getPrevClass(g);
        this.texClass = null;
        if (this.data[0]) {
          if (this.isEmbellished() || this.data[0].isa(a.mi)) {
            g = this.data[0].setTeXclass(g);
            this.updateTeXclass(this.Core());
          } else {
            this.data[0].setTeXclass();
            g = this;
          }
        } else {
          g = this;
        }
        for (var f = 1,
            e = this.data.length; f < e; f++) {
          if (this.data[f]) {
            this.data[f].setTeXclass();
          }
        }
        return g;
      },
      setSeparateTeXclasses: function(g) {
        this.getPrevClass(g);
        for (var f = 0,
            e = this.data.length; f < e; f++) {
          if (this.data[f]) {
            this.data[f].setTeXclass();
          }
        }
        if (this.isEmbellished()) {
          this.updateTeXclass(this.Core());
        }
        return this;
      }
    });
    a.mi = a.mbase.Subclass({
      type: "mi",
      isToken: true,
      texClass: a.TEXCLASS.ORD,
      defaults: {
        mathvariant: a.AUTO,
        mathsize: a.INHERIT,
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        dir: a.INHERIT
      },
      autoDefault: function(f) {
        if (f === "mathvariant") {
          var e = (this.data[0] || "").toString();
          return (e.length === 1 || (e.length === 2 && e.charCodeAt(0) >= 55296 && e.charCodeAt(0) < 56320) ? a.VARIANT.ITALIC : a.VARIANT.NORMAL);
        }
        return "";
      },
      setTeXclass: function(f) {
        this.getPrevClass(f);
        var e = this.data.join("");
        if (e.length > 1 && e.match(/^[a-z][a-z0-9]*$/i) && this.texClass === a.TEXCLASS.ORD) {
          this.texClass = a.TEXCLASS.OP;
          this.autoOP = true;
        }
        return this;
      }
    });
    a.mn = a.mbase.Subclass({
      type: "mn",
      isToken: true,
      texClass: a.TEXCLASS.ORD,
      defaults: {
        mathvariant: a.INHERIT,
        mathsize: a.INHERIT,
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        dir: a.INHERIT
      }
    });
    a.mo = a.mbase.Subclass({
      type: "mo",
      isToken: true,
      defaults: {
        mathvariant: a.INHERIT,
        mathsize: a.INHERIT,
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        dir: a.INHERIT,
        form: a.AUTO,
        fence: a.AUTO,
        separator: a.AUTO,
        lspace: a.AUTO,
        rspace: a.AUTO,
        stretchy: a.AUTO,
        symmetric: a.AUTO,
        maxsize: a.AUTO,
        minsize: a.AUTO,
        largeop: a.AUTO,
        movablelimits: a.AUTO,
        accent: a.AUTO,
        linebreak: a.LINEBREAK.AUTO,
        lineleading: a.INHERIT,
        linebreakstyle: a.AUTO,
        linebreakmultchar: a.INHERIT,
        indentalign: a.INHERIT,
        indentshift: a.INHERIT,
        indenttarget: a.INHERIT,
        indentalignfirst: a.INHERIT,
        indentshiftfirst: a.INHERIT,
        indentalignlast: a.INHERIT,
        indentshiftlast: a.INHERIT,
        texClass: a.AUTO
      },
      defaultDef: {
        form: a.FORM.INFIX,
        fence: false,
        separator: false,
        lspace: a.LENGTH.THICKMATHSPACE,
        rspace: a.LENGTH.THICKMATHSPACE,
        stretchy: false,
        symmetric: false,
        maxsize: a.SIZE.INFINITY,
        minsize: "0em",
        largeop: false,
        movablelimits: false,
        accent: false,
        linebreak: a.LINEBREAK.AUTO,
        lineleading: "1ex",
        linebreakstyle: "before",
        indentalign: a.INDENTALIGN.AUTO,
        indentshift: "0",
        indenttarget: "",
        indentalignfirst: a.INDENTALIGN.INDENTALIGN,
        indentshiftfirst: a.INDENTSHIFT.INDENTSHIFT,
        indentalignlast: a.INDENTALIGN.INDENTALIGN,
        indentshiftlast: a.INDENTSHIFT.INDENTSHIFT,
        texClass: a.TEXCLASS.REL
      },
      SPACE_ATTR: {
        lspace: 1,
        rspace: 2,
        form: 4
      },
      useMMLspacing: 7,
      autoDefault: function(g, n) {
        var l = this.def;
        if (!l) {
          if (g === "form") {
            this.useMMLspacing &= ~this.SPACE_ATTR.form;
            return this.getForm();
          }
          var k = this.data.join("");
          var f = [this.Get("form"), a.FORM.INFIX, a.FORM.POSTFIX, a.FORM.PREFIX];
          for (var h = 0,
              e = f.length; h < e; h++) {
            var j = this.OPTABLE[f[h]][k];
            if (j) {
              l = this.makeDef(j);
              break;
            }
          }
          if (!l) {
            l = this.CheckRange(k);
          }
          if (!l && n) {
            l = {};
          } else {
            if (!l) {
              l = MathJax.Hub.Insert({}, this.defaultDef);
            }
            if (this.parent) {
              this.def = l;
            } else {
              l = MathJax.Hub.Insert({}, l);
            }
            l.form = f[0];
          }
        }
        this.useMMLspacing &= ~(this.SPACE_ATTR[g] || 0);
        if (l[g] != null) {
          return l[g];
        } else {
          if (!n) {
            return this.defaultDef[g];
          }
        }
        return "";
      },
      CheckRange: function(j) {
        var k = j.charCodeAt(0);
        if (k >= 55296 && k < 56320) {
          k = (((k - 55296) << 10) + (j.charCodeAt(1) - 56320)) + 65536;
        }
        for (var g = 0,
            e = this.RANGES.length; g < e && this.RANGES[g][0] <= k; g++) {
          if (k <= this.RANGES[g][1]) {
            if (this.RANGES[g][3]) {
              var f = a.optableDir + "/" + this.RANGES[g][3] + ".js";
              this.RANGES[g][3] = null;
              MathJax.Hub.RestartAfter(MathJax.Ajax.Require(f));
            }
            var h = a.TEXCLASSNAMES[this.RANGES[g][2]];
            h = this.OPTABLE.infix[j] = a.mo.OPTYPES[h === "BIN" ? "BIN3" : h];
            return this.makeDef(h);
          }
        }
        return null;
      },
      makeDef: function(f) {
        if (f[2] == null) {
          f[2] = this.defaultDef.texClass;
        }
        if (!f[3]) {
          f[3] = {};
        }
        var e = MathJax.Hub.Insert({}, f[3]);
        e.lspace = this.SPACE[f[0]];
        e.rspace = this.SPACE[f[1]];
        e.texClass = f[2];
        if (e.texClass === a.TEXCLASS.REL && (this.movablelimits || this.data.join("").match(/^[a-z]+$/i))) {
          e.texClass = a.TEXCLASS.OP;
        }
        return e;
      },
      getForm: function() {
        var e = this,
            g = this.parent,
            f = this.Parent();
        while (f && f.isEmbellished()) {
          e = g;
          g = f.parent;
          f = f.Parent();
        }
        if (g && g.type === "mrow" && g.NonSpaceLength() !== 1) {
          if (g.FirstNonSpace() === e) {
            return a.FORM.PREFIX;
          }
          if (g.LastNonSpace() === e) {
            return a.FORM.POSTFIX;
          }
        }
        return a.FORM.INFIX;
      },
      isEmbellished: function() {
        return true;
      },
      hasNewline: function() {
        return (this.Get("linebreak") === a.LINEBREAK.NEWLINE);
      },
      CoreParent: function() {
        var e = this;
        while (e && e.isEmbellished() && e.CoreMO() === this && !e.isa(a.math)) {
          e = e.Parent();
        }
        return e;
      },
      CoreText: function(e) {
        if (!e) {
          return "";
        }
        if (e.isEmbellished()) {
          return e.CoreMO().data.join("");
        }
        while ((((e.isa(a.mrow) || e.isa(a.TeXAtom) || e.isa(a.mstyle) || e.isa(a.mphantom)) && e.data.length === 1) || e.isa(a.munderover)) && e.data[0]) {
          e = e.data[0];
        }
        if (!e.isToken) {
          return "";
        } else {
          return e.data.join("");
        }
      },
      remapChars: {
        "*": "\u2217",
        '"': "\u2033",
        "\u00B0": "\u2218",
        "\u00B2": "2",
        "\u00B3": "3",
        "\u00B4": "\u2032",
        "\u00B9": "1"
      },
      remap: function(f, e) {
        f = f.replace(/-/g, "\u2212");
        if (e) {
          f = f.replace(/'/g, "\u2032").replace(/`/g, "\u2035");
          if (f.length === 1) {
            f = e[f] || f;
          }
        }
        return f;
      },
      setTeXclass: function(f) {
        var e = this.getValues("form", "lspace", "rspace", "fence");
        if (this.useMMLspacing) {
          this.texClass = a.TEXCLASS.NONE;
          return this;
        }
        if (e.fence && !this.texClass) {
          if (e.form === a.FORM.PREFIX) {
            this.texClass = a.TEXCLASS.OPEN;
          }
          if (e.form === a.FORM.POSTFIX) {
            this.texClass = a.TEXCLASS.CLOSE;
          }
        }
        this.texClass = this.Get("texClass");
        if (this.data.join("") === "\u2061") {
          if (f) {
            f.texClass = a.TEXCLASS.OP;
            f.fnOP = true;
          }
          this.texClass = this.prevClass = a.TEXCLASS.NONE;
          return f;
        }
        return this.adjustTeXclass(f);
      },
      adjustTeXclass: function(f) {
        if (this.texClass === a.TEXCLASS.NONE) {
          return f;
        }
        if (f) {
          if (f.autoOP && (this.texClass === a.TEXCLASS.BIN || this.texClass === a.TEXCLASS.REL)) {
            f.texClass = a.TEXCLASS.ORD;
          }
          this.prevClass = f.texClass || a.TEXCLASS.ORD;
          this.prevLevel = f.Get("scriptlevel");
        } else {
          this.prevClass = a.TEXCLASS.NONE;
        }
        if (this.texClass === a.TEXCLASS.BIN && (this.prevClass === a.TEXCLASS.NONE || this.prevClass === a.TEXCLASS.BIN || this.prevClass === a.TEXCLASS.OP || this.prevClass === a.TEXCLASS.REL || this.prevClass === a.TEXCLASS.OPEN || this.prevClass === a.TEXCLASS.PUNCT)) {
          this.texClass = a.TEXCLASS.ORD;
        } else {
          if (this.prevClass === a.TEXCLASS.BIN && (this.texClass === a.TEXCLASS.REL || this.texClass === a.TEXCLASS.CLOSE || this.texClass === a.TEXCLASS.PUNCT)) {
            f.texClass = this.prevClass = a.TEXCLASS.ORD;
          } else {
            if (this.texClass === a.TEXCLASS.BIN) {
              var g = this,
                  e = this.parent;
              while (e && e.parent && e.isEmbellished() && (e.data.length === 1 || (e.type !== "mrow" && e.Core() === g))) {
                g = e;
                e = e.parent;
              }
              if (e.data[e.data.length - 1] === g) {
                this.texClass = a.TEXCLASS.ORD;
              }
            }
          }
        }
        return this;
      }
    });
    a.mtext = a.mbase.Subclass({
      type: "mtext",
      isToken: true,
      isSpacelike: function() {
        return true;
      },
      texClass: a.TEXCLASS.ORD,
      defaults: {
        mathvariant: a.INHERIT,
        mathsize: a.INHERIT,
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        dir: a.INHERIT
      }
    });
    a.mspace = a.mbase.Subclass({
      type: "mspace",
      isToken: true,
      isSpacelike: function() {
        return true;
      },
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        width: "0em",
        height: "0ex",
        depth: "0ex",
        linebreak: a.LINEBREAK.AUTO
      },
      hasDimAttr: function() {
        return (this.hasValue("width") || this.hasValue("height") || this.hasValue("depth"));
      },
      hasNewline: function() {
        return (!this.hasDimAttr() && this.Get("linebreak") === a.LINEBREAK.NEWLINE);
      }
    });
    a.ms = a.mbase.Subclass({
      type: "ms",
      isToken: true,
      texClass: a.TEXCLASS.ORD,
      defaults: {
        mathvariant: a.INHERIT,
        mathsize: a.INHERIT,
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        dir: a.INHERIT,
        lquote: '"',
        rquote: '"'
      }
    });
    a.mglyph = a.mbase.Subclass({
      type: "mglyph",
      isToken: true,
      texClass: a.TEXCLASS.ORD,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        alt: "",
        src: "",
        width: a.AUTO,
        height: a.AUTO,
        valign: "0em"
      }
    });
    a.mrow = a.mbase.Subclass({
      type: "mrow",
      isSpacelike: a.mbase.childrenSpacelike,
      inferred: false,
      notParent: false,
      isEmbellished: function() {
        var f = false;
        for (var g = 0,
            e = this.data.length; g < e; g++) {
          if (this.data[g] == null) {
            continue;
          }
          if (this.data[g].isEmbellished()) {
            if (f) {
              return false;
            }
            f = true;
            this.core = g;
          } else {
            if (!this.data[g].isSpacelike()) {
              return false;
            }
          }
        }
        return f;
      },
      NonSpaceLength: function() {
        var g = 0;
        for (var f = 0,
            e = this.data.length; f < e; f++) {
          if (this.data[f] && !this.data[f].isSpacelike()) {
            g++;
          }
        }
        return g;
      },
      FirstNonSpace: function() {
        for (var f = 0,
            e = this.data.length; f < e; f++) {
          if (this.data[f] && !this.data[f].isSpacelike()) {
            return this.data[f];
          }
        }
        return null;
      },
      LastNonSpace: function() {
        for (var e = this.data.length - 1; e >= 0; e--) {
          if (this.data[0] && !this.data[e].isSpacelike()) {
            return this.data[e];
          }
        }
        return null;
      },
      Core: function() {
        if (!(this.isEmbellished()) || typeof(this.core) === "undefined") {
          return this;
        }
        return this.data[this.core];
      },
      CoreMO: function() {
        if (!(this.isEmbellished()) || typeof(this.core) === "undefined") {
          return this;
        }
        return this.data[this.core].CoreMO();
      },
      toString: function() {
        if (this.inferred) {
          return "[" + this.data.join(",") + "]";
        }
        return this.SUPER(arguments).toString.call(this);
      },
      setTeXclass: function(g) {
        var f,
            e = this.data.length;
        if ((this.open || this.close) && (!g || !g.fnOP)) {
          this.getPrevClass(g);
          g = null;
          for (f = 0; f < e; f++) {
            if (this.data[f]) {
              g = this.data[f].setTeXclass(g);
            }
          }
          if (!this.hasOwnProperty("texClass")) {
            this.texClass = a.TEXCLASS.INNER;
          }
          return this;
        } else {
          for (f = 0; f < e; f++) {
            if (this.data[f]) {
              g = this.data[f].setTeXclass(g);
            }
          }
          if (this.data[0]) {
            this.updateTeXclass(this.data[0]);
          }
          return g;
        }
      },
      getAnnotation: function(e) {
        if (this.data.length != 1) {
          return null;
        }
        return this.data[0].getAnnotation(e);
      }
    });
    a.mfrac = a.mbase.Subclass({
      type: "mfrac",
      num: 0,
      den: 1,
      linebreakContainer: true,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        linethickness: a.LINETHICKNESS.MEDIUM,
        numalign: a.ALIGN.CENTER,
        denomalign: a.ALIGN.CENTER,
        bevelled: false
      },
      adjustChild_displaystyle: function(e) {
        return false;
      },
      adjustChild_scriptlevel: function(f) {
        var e = this.Get("scriptlevel");
        if (!this.Get("displaystyle") || e > 0) {
          e++;
        }
        return e;
      },
      adjustChild_texprimestyle: function(e) {
        if (e == this.den) {
          return true;
        }
        return this.Get("texprimestyle");
      },
      setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.msqrt = a.mbase.Subclass({
      type: "msqrt",
      inferRow: true,
      linebreakContainer: true,
      texClass: a.TEXCLASS.ORD,
      setTeXclass: a.mbase.setSeparateTeXclasses,
      adjustChild_texprimestyle: function(e) {
        return true;
      }
    });
    a.mroot = a.mbase.Subclass({
      type: "mroot",
      linebreakContainer: true,
      texClass: a.TEXCLASS.ORD,
      adjustChild_displaystyle: function(e) {
        if (e === 1) {
          return false;
        }
        return this.Get("displaystyle");
      },
      adjustChild_scriptlevel: function(f) {
        var e = this.Get("scriptlevel");
        if (f === 1) {
          e += 2;
        }
        return e;
      },
      adjustChild_texprimestyle: function(e) {
        if (e === 0) {
          return true;
        }
        return this.Get("texprimestyle");
      },
      setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.mstyle = a.mbase.Subclass({
      type: "mstyle",
      isSpacelike: a.mbase.childrenSpacelike,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      inferRow: true,
      defaults: {
        scriptlevel: a.INHERIT,
        displaystyle: a.INHERIT,
        scriptsizemultiplier: Math.sqrt(1 / 2),
        scriptminsize: "8pt",
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        dir: a.INHERIT,
        infixlinebreakstyle: a.LINEBREAKSTYLE.BEFORE,
        decimalseparator: "."
      },
      adjustChild_scriptlevel: function(g) {
        var f = this.scriptlevel;
        if (f == null) {
          f = this.Get("scriptlevel");
        } else {
          if (String(f).match(/^ *[-+]/)) {
            var e = this.Get("scriptlevel", null, true);
            f = e + parseInt(f);
          }
        }
        return f;
      },
      inheritFromMe: true,
      noInherit: {
        mpadded: {
          width: true,
          height: true,
          depth: true,
          lspace: true,
          voffset: true
        },
        mtable: {
          width: true,
          height: true,
          depth: true,
          align: true
        }
      },
      getRemoved: {
        fontfamily: "fontFamily",
        fontweight: "fontWeight",
        fontstyle: "fontStyle",
        fontsize: "fontSize"
      },
      setTeXclass: a.mbase.setChildTeXclass
    });
    a.merror = a.mbase.Subclass({
      type: "merror",
      inferRow: true,
      linebreakContainer: true,
      texClass: a.TEXCLASS.ORD
    });
    a.mpadded = a.mbase.Subclass({
      type: "mpadded",
      inferRow: true,
      isSpacelike: a.mbase.childrenSpacelike,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        width: "",
        height: "",
        depth: "",
        lspace: 0,
        voffset: 0
      },
      setTeXclass: a.mbase.setChildTeXclass
    });
    a.mphantom = a.mbase.Subclass({
      type: "mphantom",
      texClass: a.TEXCLASS.ORD,
      inferRow: true,
      isSpacelike: a.mbase.childrenSpacelike,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      setTeXclass: a.mbase.setChildTeXclass
    });
    a.mfenced = a.mbase.Subclass({
      type: "mfenced",
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        open: "(",
        close: ")",
        separators: ","
      },
      addFakeNodes: function() {
        var f = this.getValues("open", "close", "separators");
        f.open = f.open.replace(/[ \t\n\r]/g, "");
        f.close = f.close.replace(/[ \t\n\r]/g, "");
        f.separators = f.separators.replace(/[ \t\n\r]/g, "");
        if (f.open !== "") {
          this.SetData("open", a.mo(f.open).With({
            fence: true,
            form: a.FORM.PREFIX,
            texClass: a.TEXCLASS.OPEN
          }));
          this.data.open.useMMLspacing = 0;
        }
        if (f.separators !== "") {
          while (f.separators.length < this.data.length) {
            f.separators += f.separators.charAt(f.separators.length - 1);
          }
          for (var g = 1,
              e = this.data.length; g < e; g++) {
            if (this.data[g]) {
              this.SetData("sep" + g, a.mo(f.separators.charAt(g - 1)).With({separator: true}));
              this.data["sep" + g].useMMLspacing = 0;
            }
          }
        }
        if (f.close !== "") {
          this.SetData("close", a.mo(f.close).With({
            fence: true,
            form: a.FORM.POSTFIX,
            texClass: a.TEXCLASS.CLOSE
          }));
          this.data.close.useMMLspacing = 0;
        }
      },
      texClass: a.TEXCLASS.OPEN,
      setTeXclass: function(g) {
        this.addFakeNodes();
        this.getPrevClass(g);
        if (this.data.open) {
          g = this.data.open.setTeXclass(g);
        }
        if (this.data[0]) {
          g = this.data[0].setTeXclass(g);
        }
        for (var f = 1,
            e = this.data.length; f < e; f++) {
          if (this.data["sep" + f]) {
            g = this.data["sep" + f].setTeXclass(g);
          }
          if (this.data[f]) {
            g = this.data[f].setTeXclass(g);
          }
        }
        if (this.data.close) {
          g = this.data.close.setTeXclass(g);
        }
        this.updateTeXclass(this.data.open);
        this.texClass = a.TEXCLASS.INNER;
        return g;
      }
    });
    a.menclose = a.mbase.Subclass({
      type: "menclose",
      inferRow: true,
      linebreakContainer: true,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        notation: a.NOTATION.LONGDIV,
        texClass: a.TEXCLASS.ORD
      },
      setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.msubsup = a.mbase.Subclass({
      type: "msubsup",
      base: 0,
      sub: 1,
      sup: 2,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        subscriptshift: "",
        superscriptshift: "",
        texClass: a.AUTO
      },
      autoDefault: function(e) {
        if (e === "texClass") {
          return (this.isEmbellished() ? this.CoreMO().Get(e) : a.TEXCLASS.ORD);
        }
        return 0;
      },
      adjustChild_displaystyle: function(e) {
        if (e > 0) {
          return false;
        }
        return this.Get("displaystyle");
      },
      adjustChild_scriptlevel: function(f) {
        var e = this.Get("scriptlevel");
        if (f > 0) {
          e++;
        }
        return e;
      },
      adjustChild_texprimestyle: function(e) {
        if (e === this.sub) {
          return true;
        }
        return this.Get("texprimestyle");
      },
      setTeXclass: a.mbase.setBaseTeXclasses
    });
    a.msub = a.msubsup.Subclass({type: "msub"});
    a.msup = a.msubsup.Subclass({
      type: "msup",
      sub: 2,
      sup: 1
    });
    a.mmultiscripts = a.msubsup.Subclass({
      type: "mmultiscripts",
      adjustChild_texprimestyle: function(e) {
        if (e % 2 === 1) {
          return true;
        }
        return this.Get("texprimestyle");
      }
    });
    a.mprescripts = a.mbase.Subclass({type: "mprescripts"});
    a.none = a.mbase.Subclass({type: "none"});
    a.munderover = a.mbase.Subclass({
      type: "munderover",
      base: 0,
      under: 1,
      over: 2,
      sub: 1,
      sup: 2,
      ACCENTS: ["", "accentunder", "accent"],
      linebreakContainer: true,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        accent: a.AUTO,
        accentunder: a.AUTO,
        align: a.ALIGN.CENTER,
        texClass: a.AUTO,
        subscriptshift: "",
        superscriptshift: ""
      },
      autoDefault: function(e) {
        if (e === "texClass") {
          return (this.isEmbellished() ? this.CoreMO().Get(e) : a.TEXCLASS.ORD);
        }
        if (e === "accent" && this.data[this.over]) {
          return this.data[this.over].CoreMO().Get("accent");
        }
        if (e === "accentunder" && this.data[this.under]) {
          return this.data[this.under].CoreMO().Get("accent");
        }
        return false;
      },
      adjustChild_displaystyle: function(e) {
        if (e > 0) {
          return false;
        }
        return this.Get("displaystyle");
      },
      adjustChild_scriptlevel: function(g) {
        var f = this.Get("scriptlevel");
        var e = (this.data[this.base] && !this.Get("displaystyle") && this.data[this.base].CoreMO().Get("movablelimits"));
        if (g == this.under && (e || !this.Get("accentunder"))) {
          f++;
        }
        if (g == this.over && (e || !this.Get("accent"))) {
          f++;
        }
        return f;
      },
      adjustChild_texprimestyle: function(e) {
        if (e === this.base && this.data[this.over]) {
          return true;
        }
        return this.Get("texprimestyle");
      },
      setTeXclass: a.mbase.setBaseTeXclasses
    });
    a.munder = a.munderover.Subclass({type: "munder"});
    a.mover = a.munderover.Subclass({
      type: "mover",
      over: 1,
      under: 2,
      sup: 1,
      sub: 2,
      ACCENTS: ["", "accent", "accentunder"]
    });
    a.mtable = a.mbase.Subclass({
      type: "mtable",
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        align: a.ALIGN.AXIS,
        rowalign: a.ALIGN.BASELINE,
        columnalign: a.ALIGN.CENTER,
        groupalign: "{left}",
        alignmentscope: true,
        columnwidth: a.WIDTH.AUTO,
        width: a.WIDTH.AUTO,
        rowspacing: "1ex",
        columnspacing: ".8em",
        rowlines: a.LINES.NONE,
        columnlines: a.LINES.NONE,
        frame: a.LINES.NONE,
        framespacing: "0.4em 0.5ex",
        equalrows: false,
        equalcolumns: false,
        displaystyle: false,
        side: a.SIDE.RIGHT,
        minlabelspacing: "0.8em",
        texClass: a.TEXCLASS.ORD,
        useHeight: 1
      },
      adjustChild_displaystyle: function() {
        return (this.displaystyle != null ? this.displaystyle : this.defaults.displaystyle);
      },
      inheritFromMe: true,
      noInherit: {
        mover: {align: true},
        munder: {align: true},
        munderover: {align: true},
        mtable: {
          align: true,
          rowalign: true,
          columnalign: true,
          groupalign: true,
          alignmentscope: true,
          columnwidth: true,
          width: true,
          rowspacing: true,
          columnspacing: true,
          rowlines: true,
          columnlines: true,
          frame: true,
          framespacing: true,
          equalrows: true,
          equalcolumns: true,
          displaystyle: true,
          side: true,
          minlabelspacing: true,
          texClass: true,
          useHeight: 1
        }
      },
      linebreakContainer: true,
      Append: function() {
        for (var f = 0,
            e = arguments.length; f < e; f++) {
          if (!((arguments[f] instanceof a.mtr) || (arguments[f] instanceof a.mlabeledtr))) {
            arguments[f] = a.mtr(arguments[f]);
          }
        }
        this.SUPER(arguments).Append.apply(this, arguments);
      },
      setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.mtr = a.mbase.Subclass({
      type: "mtr",
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        rowalign: a.INHERIT,
        columnalign: a.INHERIT,
        groupalign: a.INHERIT
      },
      inheritFromMe: true,
      noInherit: {
        mrow: {
          rowalign: true,
          columnalign: true,
          groupalign: true
        },
        mtable: {
          rowalign: true,
          columnalign: true,
          groupalign: true
        }
      },
      linebreakContainer: true,
      Append: function() {
        for (var f = 0,
            e = arguments.length; f < e; f++) {
          if (!(arguments[f] instanceof a.mtd)) {
            arguments[f] = a.mtd(arguments[f]);
          }
        }
        this.SUPER(arguments).Append.apply(this, arguments);
      },
      setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.mtd = a.mbase.Subclass({
      type: "mtd",
      inferRow: true,
      linebreakContainer: true,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        rowspan: 1,
        columnspan: 1,
        rowalign: a.INHERIT,
        columnalign: a.INHERIT,
        groupalign: a.INHERIT
      },
      setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.maligngroup = a.mbase.Subclass({
      type: "maligngroup",
      isSpacelike: function() {
        return true;
      },
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        groupalign: a.INHERIT
      },
      inheritFromMe: true,
      noInherit: {
        mrow: {groupalign: true},
        mtable: {groupalign: true}
      }
    });
    a.malignmark = a.mbase.Subclass({
      type: "malignmark",
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        edge: a.SIDE.LEFT
      },
      isSpacelike: function() {
        return true;
      }
    });
    a.mlabeledtr = a.mtr.Subclass({type: "mlabeledtr"});
    a.maction = a.mbase.Subclass({
      type: "maction",
      defaults: {
        mathbackground: a.INHERIT,
        mathcolor: a.INHERIT,
        actiontype: a.ACTIONTYPE.TOGGLE,
        selection: 1
      },
      selected: function() {
        return this.data[this.Get("selection") - 1] || a.NULL;
      },
      isEmbellished: function() {
        return this.selected().isEmbellished();
      },
      isSpacelike: function() {
        return this.selected().isSpacelike();
      },
      Core: function() {
        return this.selected().Core();
      },
      CoreMO: function() {
        return this.selected().CoreMO();
      },
      setTeXclass: function(f) {
        if (this.Get("actiontype") === a.ACTIONTYPE.TOOLTIP && this.data[1]) {
          this.data[1].setTeXclass();
        }
        var e = this.selected();
        f = e.setTeXclass(f);
        this.updateTeXclass(e);
        return f;
      }
    });
    a.semantics = a.mbase.Subclass({
      type: "semantics",
      notParent: true,
      isEmbellished: a.mbase.childEmbellished,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      defaults: {
        definitionURL: null,
        encoding: null
      },
      setTeXclass: a.mbase.setChildTeXclass,
      getAnnotation: function(g) {
        var l = MathJax.Hub.config.MathMenu.semanticsAnnotations[g];
        if (l) {
          for (var h = 0,
              e = this.data.length; h < e; h++) {
            var k = this.data[h].Get("encoding");
            if (k) {
              for (var f = 0,
                  o = l.length; f < o; f++) {
                if (l[f] === k) {
                  return this.data[h];
                }
              }
            }
          }
        }
        return null;
      }
    });
    a.annotation = a.mbase.Subclass({
      type: "annotation",
      isChars: true,
      linebreakContainer: true,
      defaults: {
        definitionURL: null,
        encoding: null,
        cd: "mathmlkeys",
        name: "",
        src: null
      }
    });
    a["annotation-xml"] = a.mbase.Subclass({
      type: "annotation-xml",
      linebreakContainer: true,
      defaults: {
        definitionURL: null,
        encoding: null,
        cd: "mathmlkeys",
        name: "",
        src: null
      }
    });
    a.math = a.mstyle.Subclass({
      type: "math",
      defaults: {
        mathvariant: a.VARIANT.NORMAL,
        mathsize: a.SIZE.NORMAL,
        mathcolor: "",
        mathbackground: a.COLOR.TRANSPARENT,
        dir: "ltr",
        scriptlevel: 0,
        displaystyle: a.AUTO,
        display: "inline",
        maxwidth: "",
        overflow: a.OVERFLOW.LINEBREAK,
        altimg: "",
        "altimg-width": "",
        "altimg-height": "",
        "altimg-valign": "",
        alttext: "",
        cdgroup: "",
        scriptsizemultiplier: Math.sqrt(1 / 2),
        scriptminsize: "8px",
        infixlinebreakstyle: a.LINEBREAKSTYLE.BEFORE,
        lineleading: "1ex",
        indentshift: "auto",
        indentalign: a.INDENTALIGN.AUTO,
        indentalignfirst: a.INDENTALIGN.INDENTALIGN,
        indentshiftfirst: a.INDENTSHIFT.INDENTSHIFT,
        indentalignlast: a.INDENTALIGN.INDENTALIGN,
        indentshiftlast: a.INDENTSHIFT.INDENTSHIFT,
        decimalseparator: ".",
        texprimestyle: false
      },
      autoDefault: function(e) {
        if (e === "displaystyle") {
          return this.Get("display") === "block";
        }
        return "";
      },
      linebreakContainer: true,
      setTeXclass: a.mbase.setChildTeXclass,
      getAnnotation: function(e) {
        if (this.data.length != 1) {
          return null;
        }
        return this.data[0].getAnnotation(e);
      }
    });
    a.chars = a.mbase.Subclass({
      type: "chars",
      Append: function() {
        this.data.push.apply(this.data, arguments);
      },
      value: function() {
        return this.data.join("");
      },
      toString: function() {
        return this.data.join("");
      }
    });
    a.entity = a.mbase.Subclass({
      type: "entity",
      Append: function() {
        this.data.push.apply(this.data, arguments);
      },
      value: function() {
        if (this.data[0].substr(0, 2) === "#x") {
          return parseInt(this.data[0].substr(2), 16);
        } else {
          if (this.data[0].substr(0, 1) === "#") {
            return parseInt(this.data[0].substr(1));
          } else {
            return 0;
          }
        }
      },
      toString: function() {
        var e = this.value();
        if (e <= 65535) {
          return String.fromCharCode(e);
        }
        e -= 65536;
        return String.fromCharCode((e >> 10) + 55296) + String.fromCharCode((e & 1023) + 56320);
      }
    });
    a.xml = a.mbase.Subclass({
      type: "xml",
      Init: function() {
        this.div = document.createElement("div");
        return this.SUPER(arguments).Init.apply(this, arguments);
      },
      Append: function() {
        for (var f = 0,
            e = arguments.length; f < e; f++) {
          var g = this.Import(arguments[f]);
          this.data.push(g);
          this.div.appendChild(g);
        }
      },
      Import: function(j) {
        if (document.importNode) {
          return document.importNode(j, true);
        }
        var f,
            g,
            e;
        if (j.nodeType === 1) {
          f = document.createElement(j.nodeName);
          for (g = 0, e = j.attributes.length; g < e; g++) {
            var h = j.attributes[g];
            if (h.specified && h.nodeValue != null && h.nodeValue != "") {
              f.setAttribute(h.nodeName, h.nodeValue);
            }
            if (h.nodeName === "style") {
              f.style.cssText = h.nodeValue;
            }
          }
          if (j.className) {
            f.className = j.className;
          }
        } else {
          if (j.nodeType === 3 || j.nodeType === 4) {
            f = document.createTextNode(j.nodeValue);
          } else {
            if (j.nodeType === 8) {
              f = document.createComment(j.nodeValue);
            } else {
              return document.createTextNode("");
            }
          }
        }
        for (g = 0, e = j.childNodes.length; g < e; g++) {
          f.appendChild(this.Import(j.childNodes[g]));
        }
        return f;
      },
      value: function() {
        return this.div;
      },
      toString: function() {
        return this.div.innerHTML;
      }
    });
    a.TeXAtom = a.mbase.Subclass({
      type: "texatom",
      inferRow: true,
      notParent: true,
      texClass: a.TEXCLASS.ORD,
      Core: a.mbase.childCore,
      CoreMO: a.mbase.childCoreMO,
      isEmbellished: a.mbase.childEmbellished,
      setTeXclass: function(e) {
        this.data[0].setTeXclass();
        return this.adjustTeXclass(e);
      },
      adjustTeXclass: a.mo.prototype.adjustTeXclass
    });
    a.NULL = a.mbase().With({type: "null"});
    var b = a.TEXCLASS;
    var d = {
      ORD: [0, 0, b.ORD],
      ORD11: [1, 1, b.ORD],
      ORD21: [2, 1, b.ORD],
      ORD02: [0, 2, b.ORD],
      ORD55: [5, 5, b.ORD],
      OP: [1, 2, b.OP, {
        largeop: true,
        movablelimits: true,
        symmetric: true
      }],
      OPFIXED: [1, 2, b.OP, {
        largeop: true,
        movablelimits: true
      }],
      INTEGRAL: [0, 1, b.OP, {
        largeop: true,
        symmetric: true
      }],
      INTEGRAL2: [1, 2, b.OP, {
        largeop: true,
        symmetric: true
      }],
      BIN3: [3, 3, b.BIN],
      BIN4: [4, 4, b.BIN],
      BIN01: [0, 1, b.BIN],
      BIN5: [5, 5, b.BIN],
      TALLBIN: [4, 4, b.BIN, {stretchy: true}],
      BINOP: [4, 4, b.BIN, {
        largeop: true,
        movablelimits: true
      }],
      REL: [5, 5, b.REL],
      REL1: [1, 1, b.REL, {stretchy: true}],
      REL4: [4, 4, b.REL],
      RELSTRETCH: [5, 5, b.REL, {stretchy: true}],
      RELACCENT: [5, 5, b.REL, {accent: true}],
      WIDEREL: [5, 5, b.REL, {
        accent: true,
        stretchy: true
      }],
      OPEN: [0, 0, b.OPEN, {
        fence: true,
        stretchy: true,
        symmetric: true
      }],
      CLOSE: [0, 0, b.CLOSE, {
        fence: true,
        stretchy: true,
        symmetric: true
      }],
      INNER: [0, 0, b.INNER],
      PUNCT: [0, 3, b.PUNCT],
      ACCENT: [0, 0, b.ORD, {accent: true}],
      WIDEACCENT: [0, 0, b.ORD, {
        accent: true,
        stretchy: true
      }]
    };
    a.mo.Augment({
      SPACE: ["0em", "0.1111em", "0.1667em", "0.2222em", "0.2667em", "0.3333em"],
      RANGES: [[32, 127, b.REL, "BasicLatin"], [160, 255, b.ORD, "Latin1Supplement"], [256, 383, b.ORD], [384, 591, b.ORD], [688, 767, b.ORD, "SpacingModLetters"], [768, 879, b.ORD, "CombDiacritMarks"], [880, 1023, b.ORD, "GreekAndCoptic"], [7680, 7935, b.ORD], [8192, 8303, b.PUNCT, "GeneralPunctuation"], [8304, 8351, b.ORD], [8352, 8399, b.ORD], [8400, 8447, b.ORD, "CombDiactForSymbols"], [8448, 8527, b.ORD, "LetterlikeSymbols"], [8528, 8591, b.ORD], [8592, 8703, b.REL, "Arrows"], [8704, 8959, b.BIN, "MathOperators"], [8960, 9215, b.ORD, "MiscTechnical"], [9312, 9471, b.ORD], [9472, 9631, b.ORD], [9632, 9727, b.ORD, "GeometricShapes"], [9984, 10175, b.ORD, "Dingbats"], [10176, 10223, b.ORD, "MiscMathSymbolsA"], [10224, 10239, b.REL, "SupplementalArrowsA"], [10496, 10623, b.REL, "SupplementalArrowsB"], [10624, 10751, b.ORD, "MiscMathSymbolsB"], [10752, 11007, b.BIN, "SuppMathOperators"], [11008, 11263, b.ORD, "MiscSymbolsAndArrows"], [119808, 120831, b.ORD]],
      OPTABLE: {
        prefix: {
          "\u2200": d.ORD21,
          "\u2202": d.ORD21,
          "\u2203": d.ORD21,
          "\u2207": d.ORD21,
          "\u220F": d.OP,
          "\u2210": d.OP,
          "\u2211": d.OP,
          "\u2212": d.BIN01,
          "\u2213": d.BIN01,
          "\u221A": [1, 1, b.ORD, {stretchy: true}],
          "\u2220": d.ORD,
          "\u222B": d.INTEGRAL,
          "\u222E": d.INTEGRAL,
          "\u22C0": d.OP,
          "\u22C1": d.OP,
          "\u22C2": d.OP,
          "\u22C3": d.OP,
          "\u2308": d.OPEN,
          "\u230A": d.OPEN,
          "\u27E8": d.OPEN,
          "\u27EE": d.OPEN,
          "\u2A00": d.OP,
          "\u2A01": d.OP,
          "\u2A02": d.OP,
          "\u2A04": d.OP,
          "\u2A06": d.OP,
          "\u00AC": d.ORD21,
          "\u00B1": d.BIN01,
          "(": d.OPEN,
          "+": d.BIN01,
          "-": d.BIN01,
          "[": d.OPEN,
          "{": d.OPEN,
          "|": d.OPEN
        },
        postfix: {
          "!": [1, 0, b.CLOSE],
          "&": d.ORD,
          "\u2032": d.ORD02,
          "\u203E": d.WIDEACCENT,
          "\u2309": d.CLOSE,
          "\u230B": d.CLOSE,
          "\u23DE": d.WIDEACCENT,
          "\u23DF": d.WIDEACCENT,
          "\u266D": d.ORD02,
          "\u266E": d.ORD02,
          "\u266F": d.ORD02,
          "\u27E9": d.CLOSE,
          "\u27EF": d.CLOSE,
          "\u02C6": d.WIDEACCENT,
          "\u02C7": d.WIDEACCENT,
          "\u02C9": d.WIDEACCENT,
          "\u02CA": d.ACCENT,
          "\u02CB": d.ACCENT,
          "\u02D8": d.ACCENT,
          "\u02D9": d.ACCENT,
          "\u02DC": d.WIDEACCENT,
          "\u0302": d.WIDEACCENT,
          "\u00A8": d.ACCENT,
          "\u00AF": d.WIDEACCENT,
          ")": d.CLOSE,
          "]": d.CLOSE,
          "^": d.WIDEACCENT,
          _: d.WIDEACCENT,
          "`": d.ACCENT,
          "|": d.CLOSE,
          "}": d.CLOSE,
          "~": d.WIDEACCENT
        },
        infix: {
          "": d.ORD,
          "%": [3, 3, b.ORD],
          "\u2022": d.BIN4,
          "\u2026": d.INNER,
          "\u2044": d.TALLBIN,
          "\u2061": d.ORD,
          "\u2062": d.ORD,
          "\u2063": [0, 0, b.ORD, {
            linebreakstyle: "after",
            separator: true
          }],
          "\u2064": d.ORD,
          "\u2190": d.WIDEREL,
          "\u2191": d.RELSTRETCH,
          "\u2192": d.WIDEREL,
          "\u2193": d.RELSTRETCH,
          "\u2194": d.WIDEREL,
          "\u2195": d.RELSTRETCH,
          "\u2196": d.RELSTRETCH,
          "\u2197": d.RELSTRETCH,
          "\u2198": d.RELSTRETCH,
          "\u2199": d.RELSTRETCH,
          "\u21A6": d.WIDEREL,
          "\u21A9": d.WIDEREL,
          "\u21AA": d.WIDEREL,
          "\u21BC": d.WIDEREL,
          "\u21BD": d.WIDEREL,
          "\u21C0": d.WIDEREL,
          "\u21C1": d.WIDEREL,
          "\u21CC": d.WIDEREL,
          "\u21D0": d.WIDEREL,
          "\u21D1": d.RELSTRETCH,
          "\u21D2": d.WIDEREL,
          "\u21D3": d.RELSTRETCH,
          "\u21D4": d.WIDEREL,
          "\u21D5": d.RELSTRETCH,
          "\u2208": d.REL,
          "\u2209": d.REL,
          "\u220B": d.REL,
          "\u2212": d.BIN4,
          "\u2213": d.BIN4,
          "\u2215": d.TALLBIN,
          "\u2216": d.BIN4,
          "\u2217": d.BIN4,
          "\u2218": d.BIN4,
          "\u2219": d.BIN4,
          "\u221D": d.REL,
          "\u2223": d.REL,
          "\u2225": d.REL,
          "\u2227": d.BIN4,
          "\u2228": d.BIN4,
          "\u2229": d.BIN4,
          "\u222A": d.BIN4,
          "\u223C": d.REL,
          "\u2240": d.BIN4,
          "\u2243": d.REL,
          "\u2245": d.REL,
          "\u2248": d.REL,
          "\u224D": d.REL,
          "\u2250": d.REL,
          "\u2260": d.REL,
          "\u2261": d.REL,
          "\u2264": d.REL,
          "\u2265": d.REL,
          "\u226A": d.REL,
          "\u226B": d.REL,
          "\u227A": d.REL,
          "\u227B": d.REL,
          "\u2282": d.REL,
          "\u2283": d.REL,
          "\u2286": d.REL,
          "\u2287": d.REL,
          "\u228E": d.BIN4,
          "\u2291": d.REL,
          "\u2292": d.REL,
          "\u2293": d.BIN4,
          "\u2294": d.BIN4,
          "\u2295": d.BIN4,
          "\u2296": d.BIN4,
          "\u2297": d.BIN4,
          "\u2298": d.BIN4,
          "\u2299": d.BIN4,
          "\u22A2": d.REL,
          "\u22A3": d.REL,
          "\u22A4": d.ORD55,
          "\u22A5": d.REL,
          "\u22A8": d.REL,
          "\u22C4": d.BIN4,
          "\u22C5": d.BIN4,
          "\u22C6": d.BIN4,
          "\u22C8": d.REL,
          "\u22EE": d.ORD55,
          "\u22EF": d.INNER,
          "\u22F1": [5, 5, b.INNER],
          "\u25B3": d.BIN4,
          "\u25B5": d.BIN4,
          "\u25B9": d.BIN4,
          "\u25BD": d.BIN4,
          "\u25BF": d.BIN4,
          "\u25C3": d.BIN4,
          "\u2758": d.REL,
          "\u27F5": d.WIDEREL,
          "\u27F6": d.WIDEREL,
          "\u27F7": d.WIDEREL,
          "\u27F8": d.WIDEREL,
          "\u27F9": d.WIDEREL,
          "\u27FA": d.WIDEREL,
          "\u27FC": d.WIDEREL,
          "\u2A2F": d.BIN4,
          "\u2A3F": d.BIN4,
          "\u2AAF": d.REL,
          "\u2AB0": d.REL,
          "\u00B1": d.BIN4,
          "\u00B7": d.BIN4,
          "\u00D7": d.BIN4,
          "\u00F7": d.BIN4,
          "*": d.BIN3,
          "+": d.BIN4,
          ",": [0, 3, b.PUNCT, {
            linebreakstyle: "after",
            separator: true
          }],
          "-": d.BIN4,
          ".": [3, 3, b.ORD],
          "/": d.ORD11,
          ":": [1, 2, b.REL],
          ";": [0, 3, b.PUNCT, {
            linebreakstyle: "after",
            separator: true
          }],
          "<": d.REL,
          "=": d.REL,
          ">": d.REL,
          "?": [1, 1, b.CLOSE],
          "\\": d.ORD,
          "^": d.ORD11,
          _: d.ORD11,
          "|": [2, 2, b.ORD, {
            fence: true,
            stretchy: true,
            symmetric: true
          }],
          "#": d.ORD,
          "$": d.ORD,
          "\u002E": [0, 3, b.PUNCT, {separator: true}],
          "\u02B9": d.ORD,
          "\u0300": d.ACCENT,
          "\u0301": d.ACCENT,
          "\u0303": d.WIDEACCENT,
          "\u0304": d.ACCENT,
          "\u0306": d.ACCENT,
          "\u0307": d.ACCENT,
          "\u0308": d.ACCENT,
          "\u030C": d.ACCENT,
          "\u0332": d.WIDEACCENT,
          "\u0338": d.REL4,
          "\u2015": [0, 0, b.ORD, {stretchy: true}],
          "\u2017": [0, 0, b.ORD, {stretchy: true}],
          "\u2020": d.BIN3,
          "\u2021": d.BIN3,
          "\u20D7": d.ACCENT,
          "\u2111": d.ORD,
          "\u2113": d.ORD,
          "\u2118": d.ORD,
          "\u211C": d.ORD,
          "\u2205": d.ORD,
          "\u221E": d.ORD,
          "\u2305": d.BIN3,
          "\u2306": d.BIN3,
          "\u2322": d.REL4,
          "\u2323": d.REL4,
          "\u2329": d.OPEN,
          "\u232A": d.CLOSE,
          "\u23AA": d.ORD,
          "\u23AF": [0, 0, b.ORD, {stretchy: true}],
          "\u23B0": d.OPEN,
          "\u23B1": d.CLOSE,
          "\u2500": d.ORD,
          "\u25EF": d.BIN3,
          "\u2660": d.ORD,
          "\u2661": d.ORD,
          "\u2662": d.ORD,
          "\u2663": d.ORD,
          "\u3008": d.OPEN,
          "\u3009": d.CLOSE,
          "\uFE37": d.WIDEACCENT,
          "\uFE38": d.WIDEACCENT
        }
      }
    }, {OPTYPES: d});
    var c = a.mo.prototype.OPTABLE;
    c.infix["^"] = d.WIDEREL;
    c.infix._ = d.WIDEREL;
    c.prefix["\u2223"] = d.OPEN;
    c.prefix["\u2225"] = d.OPEN;
    c.postfix["\u2223"] = d.CLOSE;
    c.postfix["\u2225"] = d.CLOSE;
  })(MathJax.ElementJax.mml);
  MathJax.ElementJax.mml.loadComplete("jax.js");
  MathJax.Hub.Register.LoadHook("[MathJax]/jax/element/mml/jax.js", function() {
    var c = "2.6.1";
    var a = MathJax.ElementJax.mml,
        b = MathJax.Hub.config.menuSettings;
    a.mbase.Augment({
      toMathML: function(l) {
        var h = (this.inferred && this.parent.inferRow);
        if (l == null) {
          l = "";
        }
        var f = this.type,
            e = this.toMathMLattributes();
        if (f === "mspace") {
          return l + "<" + f + e + " />";
        }
        var k = [],
            j = (this.isToken ? "" : l + (h ? "" : "  "));
        for (var g = 0,
            d = this.data.length; g < d; g++) {
          if (this.data[g]) {
            k.push(this.data[g].toMathML(j));
          } else {
            if (!this.isToken && !this.isChars) {
              k.push(j + "<mrow />");
            }
          }
        }
        if (this.isToken || this.isChars) {
          return l + "<" + f + e + ">" + k.join("") + "</" + f + ">";
        }
        if (h) {
          return k.join("\n");
        }
        if (k.length === 0 || (k.length === 1 && k[0] === "")) {
          return l + "<" + f + e + " />";
        }
        return l + "<" + f + e + ">\n" + k.join("\n") + "\n" + l + "</" + f + ">";
      },
      toMathMLattributes: function() {
        var j = (this.type === "mstyle" ? a.math.prototype.defaults : this.defaults);
        var h = (this.attrNames || a.copyAttributeNames),
            g = a.skipAttributes,
            l = a.copyAttributes;
        var e = [];
        if (this.type === "math" && (!this.attr || !this.attr.xmlns)) {
          e.push('xmlns="http://www.w3.org/1998/Math/MathML"');
        }
        if (!this.attrNames) {
          for (var k in j) {
            if (!g[k] && !l[k] && j.hasOwnProperty(k)) {
              if (this[k] != null && this[k] !== j[k]) {
                if (this.Get(k, null, 1) !== this[k]) {
                  e.push(k + '="' + this.toMathMLattribute(this[k]) + '"');
                }
              }
            }
          }
        }
        for (var f = 0,
            d = h.length; f < d; f++) {
          if (l[h[f]] === 1 && !j.hasOwnProperty(h[f])) {
            continue;
          }
          value = (this.attr || {})[h[f]];
          if (value == null) {
            value = this[h[f]];
          }
          if (value != null) {
            e.push(h[f] + '="' + this.toMathMLquote(value) + '"');
          }
        }
        this.toMathMLclass(e);
        if (e.length) {
          return " " + e.join(" ");
        } else {
          return "";
        }
      },
      toMathMLclass: function(d) {
        var f = [];
        if (this["class"]) {
          f.push(this["class"]);
        }
        if (this.isa(a.TeXAtom) && b.texHints) {
          var e = ["ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER", "VCENTER"][this.texClass];
          if (e) {
            f.push("MJX-TeXAtom-" + e);
            if (e === "OP" && !this.movablelimits) {
              f.push("MJX-fixedlimits");
            }
          }
        }
        if (this.mathvariant && this.toMathMLvariants[this.mathvariant]) {
          f.push("MJX" + this.mathvariant);
        }
        if (this.variantForm) {
          f.push("MJX-variant");
        }
        if (f.length) {
          d.unshift('class="' + f.join(" ") + '"');
        }
      },
      toMathMLattribute: function(d) {
        if (typeof(d) === "string" && d.replace(/ /g, "").match(/^(([-+])?(\d+(\.\d*)?|\.\d+))mu$/)) {
          return (RegExp.$2 || "") + ((1 / 18) * RegExp.$3).toFixed(3).replace(/\.?0+$/, "") + "em";
        } else {
          if (this.toMathMLvariants[d]) {
            return this.toMathMLvariants[d];
          }
        }
        return this.toMathMLquote(d);
      },
      toMathMLvariants: {
        "-tex-caligraphic": a.VARIANT.SCRIPT,
        "-tex-caligraphic-bold": a.VARIANT.BOLDSCRIPT,
        "-tex-oldstyle": a.VARIANT.NORMAL,
        "-tex-oldstyle-bold": a.VARIANT.BOLD,
        "-tex-mathit": a.VARIANT.ITALIC
      },
      toMathMLquote: function(f) {
        f = String(f).split("");
        for (var g = 0,
            d = f.length; g < d; g++) {
          var k = f[g].charCodeAt(0);
          if (k <= 55295 || 57344 <= k) {
            if (k > 126 || (k < 32 && k !== 10 && k !== 13 && k !== 9)) {
              f[g] = "&#x" + k.toString(16).toUpperCase() + ";";
            } else {
              var j = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;"
              }[f[g]];
              if (j) {
                f[g] = j;
              }
            }
          } else {
            if (g + 1 < d) {
              var h = f[g + 1].charCodeAt(0);
              var e = (((k - 55296) << 10) + (h - 56320) + 65536);
              f[g] = "&#x" + e.toString(16).toUpperCase() + ";";
              f[g + 1] = "";
              g++;
            } else {
              f[g] = "";
            }
          }
        }
        return f.join("");
      }
    });
    a.math.Augment({toMathML: function(d, e) {
        var g;
        if (d == null) {
          d = "";
        }
        if (e && e.originalText && b.semantics) {
          g = MathJax.InputJax[e.inputJax].annotationEncoding;
        }
        var n = (this.data[0] && this.data[0].data.length > 1);
        var p = this.type,
            k = this.toMathMLattributes();
        var j = [],
            o = d + (g ? "  " + (n ? "  " : "") : "") + "  ";
        for (var h = 0,
            f = this.data.length; h < f; h++) {
          if (this.data[h]) {
            j.push(this.data[h].toMathML(o));
          } else {
            j.push(o + "<mrow />");
          }
        }
        if (j.length === 0 || (j.length === 1 && j[0] === "")) {
          if (!g) {
            return "<" + p + k + " />";
          }
          j.push(o + "<mrow />");
        }
        if (g) {
          if (n) {
            j.unshift(d + "    <mrow>");
            j.push(d + "    </mrow>");
          }
          j.unshift(d + "  <semantics>");
          var l = e.originalText.replace(/[&<>]/g, function(i) {
            return {
              ">": "&gt;",
              "<": "&lt;",
              "&": "&amp;"
            }[i];
          });
          j.push(d + '    <annotation encoding="' + g + '">' + l + "</annotation>");
          j.push(d + "  </semantics>");
        }
        return d + "<" + p + k + ">\n" + j.join("\n") + "\n" + d + "</" + p + ">";
      }});
    a.msubsup.Augment({toMathML: function(j) {
        var f = this.type;
        if (this.data[this.sup] == null) {
          f = "msub";
        }
        if (this.data[this.sub] == null) {
          f = "msup";
        }
        var e = this.toMathMLattributes();
        delete this.data[0].inferred;
        var h = [];
        for (var g = 0,
            d = this.data.length; g < d; g++) {
          if (this.data[g]) {
            h.push(this.data[g].toMathML(j + "  "));
          }
        }
        return j + "<" + f + e + ">\n" + h.join("\n") + "\n" + j + "</" + f + ">";
      }});
    a.munderover.Augment({toMathML: function(k) {
        var f = this.type;
        var j = this.data[this.base];
        if (j && j.isa(a.TeXAtom) && j.movablelimits && !j.Get("displaystyle")) {
          type = "msubsup";
          if (this.data[this.under] == null) {
            f = "msup";
          }
          if (this.data[this.over] == null) {
            f = "msub";
          }
        } else {
          if (this.data[this.under] == null) {
            f = "mover";
          }
          if (this.data[this.over] == null) {
            f = "munder";
          }
        }
        var e = this.toMathMLattributes();
        delete this.data[0].inferred;
        var h = [];
        for (var g = 0,
            d = this.data.length; g < d; g++) {
          if (this.data[g]) {
            h.push(this.data[g].toMathML(k + "  "));
          }
        }
        return k + "<" + f + e + ">\n" + h.join("\n") + "\n" + k + "</" + f + ">";
      }});
    a.TeXAtom.Augment({toMathML: function(e) {
        var d = this.toMathMLattributes();
        if (!d && this.data[0].data.length === 1) {
          return e.substr(2) + this.data[0].toMathML(e);
        }
        return e + "<mrow" + d + ">\n" + this.data[0].toMathML(e + "  ") + "\n" + e + "</mrow>";
      }});
    a.chars.Augment({toMathML: function(d) {
        return (d || "") + this.toMathMLquote(this.toString());
      }});
    a.entity.Augment({toMathML: function(d) {
        return (d || "") + "&" + this.data[0] + ";<!-- " + this.toString() + " -->";
      }});
    a.xml.Augment({toMathML: function(d) {
        return (d || "") + this.toString();
      }});
    MathJax.Hub.Register.StartupHook("TeX mathchoice Ready", function() {
      a.TeXmathchoice.Augment({toMathML: function(d) {
          return this.Core().toMathML(d);
        }});
    });
    MathJax.Hub.Startup.signal.Post("toMathML Ready");
  });
  MathJax.Ajax.loadComplete("[MathJax]/extensions/toMathML.js");
  (function(b, e) {
    var d = "2.6.0";
    var a = b.CombineConfig("TeX.noErrors", {
      disabled: false,
      multiLine: true,
      inlineDelimiters: ["", ""],
      style: {
        "font-size": "90%",
        "text-align": "left",
        color: "black",
        padding: "1px 3px",
        border: "1px solid"
      }
    });
    var c = "\u00A0";
    MathJax.Extension["TeX/noErrors"] = {
      version: d,
      config: a
    };
    b.Register.StartupHook("TeX Jax Ready", function() {
      var f = MathJax.InputJax.TeX.formatError;
      MathJax.InputJax.TeX.Augment({formatError: function(j, i, k, g) {
          if (a.disabled) {
            return f.apply(this, arguments);
          }
          var h = j.message.replace(/\n.*/, "");
          b.signal.Post(["TeX Jax - parse error", h, i, k, g]);
          var m = a.inlineDelimiters;
          var l = (k || a.multiLine);
          if (!k) {
            i = m[0] + i + m[1];
          }
          if (l) {
            i = i.replace(/ /g, c);
          } else {
            i = i.replace(/\n/g, " ");
          }
          return MathJax.ElementJax.mml.merror(i).With({
            isError: true,
            multiLine: l
          });
        }});
    });
    b.Register.StartupHook("HTML-CSS Jax Config", function() {
      b.Config({"HTML-CSS": {styles: {".MathJax .noError": b.Insert({"vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "")}, a.style)}}});
    });
    b.Register.StartupHook("HTML-CSS Jax Ready", function() {
      var g = MathJax.ElementJax.mml;
      var h = MathJax.OutputJax["HTML-CSS"];
      var f = g.math.prototype.toHTML,
          i = g.merror.prototype.toHTML;
      g.math.Augment({toHTML: function(j, k) {
          var l = this.data[0];
          if (l && l.data[0] && l.data[0].isError) {
            j.style.fontSize = "";
            j = this.HTMLcreateSpan(j);
            j.bbox = l.data[0].toHTML(j).bbox;
          } else {
            j = f.apply(this, arguments);
          }
          return j;
        }});
      g.merror.Augment({toHTML: function(p) {
          if (!this.isError) {
            return i.apply(this, arguments);
          }
          p = this.HTMLcreateSpan(p);
          p.className = "noError";
          if (this.multiLine) {
            p.style.display = "inline-block";
          }
          var r = this.data[0].data[0].data.join("").split(/\n/);
          for (var o = 0,
              l = r.length; o < l; o++) {
            h.addText(p, r[o]);
            if (o !== l - 1) {
              h.addElement(p, "br", {isMathJax: true});
            }
          }
          var q = h.getHD(p.parentNode),
              k = h.getW(p.parentNode);
          if (l > 1) {
            var n = (q.h + q.d) / 2,
                j = h.TeX.x_height / 2;
            p.parentNode.style.verticalAlign = h.Em(q.d + (j - n));
            q.h = j + n;
            q.d = n - j;
          }
          p.bbox = {
            h: q.h,
            d: q.d,
            w: k,
            lw: 0,
            rw: k
          };
          return p;
        }});
    });
    b.Register.StartupHook("SVG Jax Config", function() {
      b.Config({SVG: {styles: {".MathJax_SVG .noError": b.Insert({"vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "")}, a.style)}}});
    });
    b.Register.StartupHook("SVG Jax Ready", function() {
      var g = MathJax.ElementJax.mml;
      var f = g.math.prototype.toSVG,
          h = g.merror.prototype.toSVG;
      g.math.Augment({toSVG: function(i, j) {
          var k = this.data[0];
          if (k && k.data[0] && k.data[0].isError) {
            i = k.data[0].toSVG(i);
          } else {
            i = f.apply(this, arguments);
          }
          return i;
        }});
      g.merror.Augment({toSVG: function(n) {
          if (!this.isError || this.Parent().type !== "math") {
            return h.apply(this, arguments);
          }
          n = e.addElement(n, "span", {
            className: "noError",
            isMathJax: true
          });
          if (this.multiLine) {
            n.style.display = "inline-block";
          }
          var o = this.data[0].data[0].data.join("").split(/\n/);
          for (var l = 0,
              j = o.length; l < j; l++) {
            e.addText(n, o[l]);
            if (l !== j - 1) {
              e.addElement(n, "br", {isMathJax: true});
            }
          }
          if (j > 1) {
            var k = n.offsetHeight / 2;
            n.style.verticalAlign = (-k + (k / j)) + "px";
          }
          return n;
        }});
    });
    b.Register.StartupHook("NativeMML Jax Ready", function() {
      var h = MathJax.ElementJax.mml;
      var g = MathJax.Extension["TeX/noErrors"].config;
      var f = h.math.prototype.toNativeMML,
          i = h.merror.prototype.toNativeMML;
      h.math.Augment({toNativeMML: function(j) {
          var k = this.data[0];
          if (k && k.data[0] && k.data[0].isError) {
            j = k.data[0].toNativeMML(j);
          } else {
            j = f.apply(this, arguments);
          }
          return j;
        }});
      h.merror.Augment({toNativeMML: function(n) {
          if (!this.isError) {
            return i.apply(this, arguments);
          }
          n = n.appendChild(document.createElement("span"));
          var o = this.data[0].data[0].data.join("").split(/\n/);
          for (var l = 0,
              k = o.length; l < k; l++) {
            n.appendChild(document.createTextNode(o[l]));
            if (l !== k - 1) {
              n.appendChild(document.createElement("br"));
            }
          }
          if (this.multiLine) {
            n.style.display = "inline-block";
            if (k > 1) {
              n.style.verticalAlign = "middle";
            }
          }
          for (var p in g.style) {
            if (g.style.hasOwnProperty(p)) {
              var j = p.replace(/-./g, function(m) {
                return m.charAt(1).toUpperCase();
              });
              n.style[j] = g.style[p];
            }
          }
          return n;
        }});
    });
    b.Register.StartupHook("PreviewHTML Jax Config", function() {
      b.Config({PreviewHTML: {styles: {".MathJax_PHTML .noError": b.Insert({"vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "")}, a.style)}}});
    });
    b.Register.StartupHook("PreviewHTML Jax Ready", function() {
      var f = MathJax.ElementJax.mml;
      var h = MathJax.HTML;
      var g = f.merror.prototype.toPreviewHTML;
      f.merror.Augment({toPreviewHTML: function(l) {
          if (!this.isError) {
            return g.apply(this, arguments);
          }
          l = this.PHTMLcreateSpan(l);
          l.className = "noError";
          if (this.multiLine) {
            l.style.display = "inline-block";
          }
          var n = this.data[0].data[0].data.join("").split(/\n/);
          for (var k = 0,
              j = n.length; k < j; k++) {
            h.addText(l, n[k]);
            if (k !== j - 1) {
              h.addElement(l, "br", {isMathJax: true});
            }
          }
          return l;
        }});
    });
    b.Register.StartupHook("CommonHTML Jax Config", function() {
      b.Config({CommonHTML: {styles: {".mjx-chtml .mjx-noError": b.Insert({
              "line-height": 1.2,
              "vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "")
            }, a.style)}}});
    });
    b.Register.StartupHook("CommonHTML Jax Ready", function() {
      var f = MathJax.ElementJax.mml;
      var g = MathJax.OutputJax.CommonHTML;
      var i = MathJax.HTML;
      var h = f.merror.prototype.toCommonHTML;
      f.merror.Augment({toCommonHTML: function(n) {
          if (!this.isError) {
            return h.apply(this, arguments);
          }
          n = g.addElement(n, "mjx-noError");
          var p = this.data[0].data[0].data.join("").split(/\n/);
          for (var k = 0,
              j = p.length; k < j; k++) {
            i.addText(n, p[k]);
            if (k !== j - 1) {
              g.addElement(n, "br", {isMathJax: true});
            }
          }
          var o = this.CHTML = g.BBOX.zero();
          o.w = (n.offsetWidth) / g.em;
          if (j > 1) {
            var l = 1.2 * j / 2;
            o.h = l + 0.25;
            o.d = l - 0.25;
            n.style.verticalAlign = g.Em(0.45 - l);
          } else {
            o.h = 1;
            o.d = 0.2 + 2 / g.em;
          }
          return n;
        }});
    });
    b.Startup.signal.Post("TeX noErrors Ready");
  })(MathJax.Hub, MathJax.HTML);
  MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noErrors.js");
  MathJax.Extension["TeX/noUndefined"] = {
    version: "2.6.0",
    config: MathJax.Hub.CombineConfig("TeX.noUndefined", {
      disabled: false,
      attributes: {mathcolor: "red"}
    })
  };
  MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
    var b = MathJax.Extension["TeX/noUndefined"].config;
    var a = MathJax.ElementJax.mml;
    var c = MathJax.InputJax.TeX.Parse.prototype.csUndefined;
    MathJax.InputJax.TeX.Parse.Augment({csUndefined: function(d) {
        if (b.disabled) {
          return c.apply(this, arguments);
        }
        MathJax.Hub.signal.Post(["TeX Jax - undefined control sequence", d]);
        this.Push(a.mtext(d).With(b.attributes));
      }});
    MathJax.Hub.Startup.signal.Post("TeX noUndefined Ready");
  });
  MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noUndefined.js");
  (function(d, c, i) {
    var h,
        g = "\u00A0";
    var j = function(l) {
      return MathJax.Localization._.apply(MathJax.Localization, [["TeX", l]].concat([].slice.call(arguments, 1)));
    };
    var e = MathJax.Object.Subclass({
      Init: function(m, l) {
        this.global = {isInner: l};
        this.data = [b.start(this.global)];
        if (m) {
          this.data[0].env = m;
        }
        this.env = this.data[0].env;
      },
      Push: function() {
        var n,
            l,
            o,
            p;
        for (n = 0, l = arguments.length; n < l; n++) {
          o = arguments[n];
          if (!o) {
            continue;
          }
          if (o instanceof h.mbase) {
            o = b.mml(o);
          }
          o.global = this.global;
          p = (this.data.length ? this.Top().checkItem(o) : true);
          if (p instanceof Array) {
            this.Pop();
            this.Push.apply(this, p);
          } else {
            if (p instanceof b) {
              this.Pop();
              this.Push(p);
            } else {
              if (p) {
                this.data.push(o);
                if (o.env) {
                  for (var q in this.env) {
                    if (this.env.hasOwnProperty(q)) {
                      o.env[q] = this.env[q];
                    }
                  }
                  this.env = o.env;
                } else {
                  o.env = this.env;
                }
              }
            }
          }
        }
      },
      Pop: function() {
        var l = this.data.pop();
        if (!l.isOpen) {
          delete l.env;
        }
        this.env = (this.data.length ? this.Top().env : {});
        return l;
      },
      Top: function(l) {
        if (l == null) {
          l = 1;
        }
        if (this.data.length < l) {
          return null;
        }
        return this.data[this.data.length - l];
      },
      Prev: function(l) {
        var m = this.Top();
        if (l) {
          return m.data[m.data.length - 1];
        } else {
          return m.Pop();
        }
      },
      toString: function() {
        return "stack[\n  " + this.data.join("\n  ") + "\n]";
      }
    });
    var b = e.Item = MathJax.Object.Subclass({
      type: "base",
      endError: ["ExtraOpenMissingClose", "Extra open brace or missing close brace"],
      closeError: ["ExtraCloseMissingOpen", "Extra close brace or missing open brace"],
      rightError: ["MissingLeftExtraRight", "Missing \\left or extra \\right"],
      Init: function() {
        if (this.isOpen) {
          this.env = {};
        }
        this.data = [];
        this.Push.apply(this, arguments);
      },
      Push: function() {
        this.data.push.apply(this.data, arguments);
      },
      Pop: function() {
        return this.data.pop();
      },
      mmlData: function(l, m) {
        if (l == null) {
          l = true;
        }
        if (this.data.length === 1 && !m) {
          return this.data[0];
        }
        return h.mrow.apply(h, this.data).With((l ? {inferred: true} : {}));
      },
      checkItem: function(l) {
        if (l.type === "over" && this.isOpen) {
          l.num = this.mmlData(false);
          this.data = [];
        }
        if (l.type === "cell" && this.isOpen) {
          if (l.linebreak) {
            return false;
          }
          d.Error(["Misplaced", "Misplaced %1", l.name]);
        }
        if (l.isClose && this[l.type + "Error"]) {
          d.Error(this[l.type + "Error"]);
        }
        if (!l.isNotStack) {
          return true;
        }
        this.Push(l.data[0]);
        return false;
      },
      With: function(l) {
        for (var m in l) {
          if (l.hasOwnProperty(m)) {
            this[m] = l[m];
          }
        }
        return this;
      },
      toString: function() {
        return this.type + "[" + this.data.join("; ") + "]";
      }
    });
    b.start = b.Subclass({
      type: "start",
      isOpen: true,
      Init: function(l) {
        this.SUPER(arguments).Init.call(this);
        this.global = l;
      },
      checkItem: function(l) {
        if (l.type === "stop") {
          return b.mml(this.mmlData());
        }
        return this.SUPER(arguments).checkItem.call(this, l);
      }
    });
    b.stop = b.Subclass({
      type: "stop",
      isClose: true
    });
    b.open = b.Subclass({
      type: "open",
      isOpen: true,
      stopError: ["ExtraOpenMissingClose", "Extra open brace or missing close brace"],
      checkItem: function(m) {
        if (m.type === "close") {
          var l = this.mmlData();
          return b.mml(h.TeXAtom(l));
        }
        return this.SUPER(arguments).checkItem.call(this, m);
      }
    });
    b.close = b.Subclass({
      type: "close",
      isClose: true
    });
    b.prime = b.Subclass({
      type: "prime",
      checkItem: function(l) {
        if (this.data[0].type !== "msubsup") {
          return [h.msup(this.data[0], this.data[1]), l];
        }
        this.data[0].SetData(this.data[0].sup, this.data[1]);
        return [this.data[0], l];
      }
    });
    b.subsup = b.Subclass({
      type: "subsup",
      stopError: ["MissingScript", "Missing superscript or subscript argument"],
      supError: ["MissingOpenForSup", "Missing open brace for superscript"],
      subError: ["MissingOpenForSub", "Missing open brace for subscript"],
      checkItem: function(l) {
        if (l.type === "open" || l.type === "left") {
          return true;
        }
        if (l.type === "mml") {
          if (this.primes) {
            if (this.position !== 2) {
              this.data[0].SetData(2, this.primes);
            } else {
              l.data[0] = h.mrow(this.primes.With({variantForm: true}), l.data[0]);
            }
          }
          this.data[0].SetData(this.position, l.data[0]);
          if (this.movesupsub != null) {
            this.data[0].movesupsub = this.movesupsub;
          }
          return b.mml(this.data[0]);
        }
        if (this.SUPER(arguments).checkItem.call(this, l)) {
          d.Error(this[["", "subError", "supError"][this.position]]);
        }
      },
      Pop: function() {}
    });
    b.over = b.Subclass({
      type: "over",
      isClose: true,
      name: "\\over",
      checkItem: function(n, l) {
        if (n.type === "over") {
          d.Error(["AmbiguousUseOf", "Ambiguous use of %1", n.name]);
        }
        if (n.isClose) {
          var m = h.mfrac(this.num, this.mmlData(false));
          if (this.thickness != null) {
            m.linethickness = this.thickness;
          }
          if (this.open || this.close) {
            m.texWithDelims = true;
            m = d.fixedFence(this.open, m, this.close);
          }
          return [b.mml(m), n];
        }
        return this.SUPER(arguments).checkItem.call(this, n);
      },
      toString: function() {
        return "over[" + this.num + " / " + this.data.join("; ") + "]";
      }
    });
    b.left = b.Subclass({
      type: "left",
      isOpen: true,
      delim: "(",
      stopError: ["ExtraLeftMissingRight", "Extra \\left or missing \\right"],
      checkItem: function(l) {
        if (l.type === "right") {
          return b.mml(d.fenced(this.delim, this.mmlData(), l.delim));
        }
        return this.SUPER(arguments).checkItem.call(this, l);
      }
    });
    b.right = b.Subclass({
      type: "right",
      isClose: true,
      delim: ")"
    });
    b.begin = b.Subclass({
      type: "begin",
      isOpen: true,
      checkItem: function(l) {
        if (l.type === "end") {
          if (l.name !== this.name) {
            d.Error(["EnvBadEnd", "\\begin{%1} ended with \\end{%2}", this.name, l.name]);
          }
          if (!this.end) {
            return b.mml(this.mmlData());
          }
          return this.parse[this.end].call(this.parse, this, this.data);
        }
        if (l.type === "stop") {
          d.Error(["EnvMissingEnd", "Missing \\end{%1}", this.name]);
        }
        return this.SUPER(arguments).checkItem.call(this, l);
      }
    });
    b.end = b.Subclass({
      type: "end",
      isClose: true
    });
    b.style = b.Subclass({
      type: "style",
      checkItem: function(m) {
        if (!m.isClose) {
          return this.SUPER(arguments).checkItem.call(this, m);
        }
        var l = h.mstyle.apply(h, this.data).With(this.styles);
        return [b.mml(l), m];
      }
    });
    b.position = b.Subclass({
      type: "position",
      checkItem: function(m) {
        if (m.isClose) {
          d.Error(["MissingBoxFor", "Missing box for %1", this.name]);
        }
        if (m.isNotStack) {
          var l = m.mmlData();
          switch (this.move) {
            case "vertical":
              l = h.mpadded(l).With({
                height: this.dh,
                depth: this.dd,
                voffset: this.dh
              });
              return [b.mml(l)];
            case "horizontal":
              return [b.mml(this.left), m, b.mml(this.right)];
          }
        }
        return this.SUPER(arguments).checkItem.call(this, m);
      }
    });
    b.array = b.Subclass({
      type: "array",
      isOpen: true,
      arraydef: {},
      Init: function() {
        this.table = [];
        this.row = [];
        this.env = {};
        this.frame = [];
        this.hfill = [];
        this.SUPER(arguments).Init.apply(this, arguments);
      },
      checkItem: function(m) {
        if (m.isClose && m.type !== "over") {
          if (m.isEntry) {
            this.EndEntry();
            this.clearEnv();
            return false;
          }
          if (m.isCR) {
            this.EndEntry();
            this.EndRow();
            this.clearEnv();
            return false;
          }
          this.EndTable();
          this.clearEnv();
          var n = this.arraydef.scriptlevel;
          delete this.arraydef.scriptlevel;
          var l = h.mtable.apply(h, this.table).With(this.arraydef);
          if (this.frame.length === 4) {
            l.frame = (this.frame.dashed ? "dashed" : "solid");
          } else {
            if (this.frame.length) {
              l.hasFrame = true;
              if (this.arraydef.rowlines) {
                this.arraydef.rowlines = this.arraydef.rowlines.replace(/none( none)+$/, "none");
              }
              l = h.menclose(l).With({
                notation: this.frame.join(" "),
                isFrame: true
              });
              if ((this.arraydef.columnlines || "none") != "none" || (this.arraydef.rowlines || "none") != "none") {
                l.padding = 0;
              }
            }
          }
          if (n) {
            l = h.mstyle(l).With({scriptlevel: n});
          }
          if (this.open || this.close) {
            l = d.fenced(this.open, l, this.close);
          }
          l = b.mml(l);
          if (this.requireClose) {
            if (m.type === "close") {
              return l;
            }
            d.Error(["MissingCloseBrace", "Missing close brace"]);
          }
          return [l, m];
        }
        return this.SUPER(arguments).checkItem.call(this, m);
      },
      EndEntry: function() {
        var l = h.mtd.apply(h, this.data);
        if (this.hfill.length) {
          if (this.hfill[0] === 0) {
            l.columnalign = "right";
          }
          if (this.hfill[this.hfill.length - 1] === this.data.length) {
            l.columnalign = (l.columnalign ? "center" : "left");
          }
        }
        this.row.push(l);
        this.data = [];
        this.hfill = [];
      },
      EndRow: function() {
        var l = h.mtr;
        if (this.isNumbered && this.row.length === 3) {
          this.row.unshift(this.row.pop());
          l = h.mlabeledtr;
        }
        this.table.push(l.apply(h, this.row));
        this.row = [];
      },
      EndTable: function() {
        if (this.data.length || this.row.length) {
          this.EndEntry();
          this.EndRow();
        }
        this.checkLines();
      },
      checkLines: function() {
        if (this.arraydef.rowlines) {
          var l = this.arraydef.rowlines.split(/ /);
          if (l.length === this.table.length) {
            this.frame.push("bottom");
            l.pop();
            this.arraydef.rowlines = l.join(" ");
          } else {
            if (l.length < this.table.length - 1) {
              this.arraydef.rowlines += " none";
            }
          }
        }
        if (this.rowspacing) {
          var m = this.arraydef.rowspacing.split(/ /);
          while (m.length < this.table.length) {
            m.push(this.rowspacing + "em");
          }
          this.arraydef.rowspacing = m.join(" ");
        }
      },
      clearEnv: function() {
        for (var l in this.env) {
          if (this.env.hasOwnProperty(l)) {
            delete this.env[l];
          }
        }
      }
    });
    b.cell = b.Subclass({
      type: "cell",
      isClose: true
    });
    b.mml = b.Subclass({
      type: "mml",
      isNotStack: true,
      Add: function() {
        this.data.push.apply(this.data, arguments);
        return this;
      }
    });
    b.fn = b.Subclass({
      type: "fn",
      checkItem: function(m) {
        if (this.data[0]) {
          if (m.isOpen) {
            return true;
          }
          if (m.type !== "fn") {
            if (m.type !== "mml" || !m.data[0]) {
              return [this.data[0], m];
            }
            if (m.data[0].isa(h.mspace)) {
              return [this.data[0], m];
            }
            var l = m.data[0];
            if (l.isEmbellished()) {
              l = l.CoreMO();
            }
            if ([0, 0, 1, 1, 0, 1, 1, 0, 0, 0][l.Get("texClass")]) {
              return [this.data[0], m];
            }
          }
          return [this.data[0], h.mo(h.entity("#x2061")).With({texClass: h.TEXCLASS.NONE}), m];
        }
        return this.SUPER(arguments).checkItem.apply(this, arguments);
      }
    });
    b.not = b.Subclass({
      type: "not",
      checkItem: function(m) {
        var l,
            n;
        if (m.type === "open" || m.type === "left") {
          return true;
        }
        if (m.type === "mml" && m.data[0].type.match(/^(mo|mi|mtext)$/)) {
          l = m.data[0], n = l.data.join("");
          if (n.length === 1 && !l.movesupsub) {
            n = b.not.remap[n.charCodeAt(0)];
            if (n) {
              l.SetData(0, h.chars(String.fromCharCode(n)));
            } else {
              l.Append(h.chars("\u0338"));
            }
            return m;
          }
        }
        l = h.mpadded(h.mtext("\u29F8")).With({width: 0});
        l = h.TeXAtom(l).With({texClass: h.TEXCLASS.REL});
        return [l, m];
      }
    });
    b.not.remap = {
      8592: 8602,
      8594: 8603,
      8596: 8622,
      8656: 8653,
      8658: 8655,
      8660: 8654,
      8712: 8713,
      8715: 8716,
      8739: 8740,
      8741: 8742,
      8764: 8769,
      126: 8769,
      8771: 8772,
      8773: 8775,
      8776: 8777,
      8781: 8813,
      61: 8800,
      8801: 8802,
      60: 8814,
      62: 8815,
      8804: 8816,
      8805: 8817,
      8818: 8820,
      8819: 8821,
      8822: 8824,
      8823: 8825,
      8826: 8832,
      8827: 8833,
      8834: 8836,
      8835: 8837,
      8838: 8840,
      8839: 8841,
      8866: 8876,
      8872: 8877,
      8873: 8878,
      8875: 8879,
      8828: 8928,
      8829: 8929,
      8849: 8930,
      8850: 8931,
      8882: 8938,
      8883: 8939,
      8884: 8940,
      8885: 8941,
      8707: 8708
    };
    b.dots = b.Subclass({
      type: "dots",
      checkItem: function(m) {
        if (m.type === "open" || m.type === "left") {
          return true;
        }
        var n = this.ldots;
        if (m.type === "mml" && m.data[0].isEmbellished()) {
          var l = m.data[0].CoreMO().Get("texClass");
          if (l === h.TEXCLASS.BIN || l === h.TEXCLASS.REL) {
            n = this.cdots;
          }
        }
        return [n, m];
      }
    });
    var f = {Add: function(l, o, n) {
        if (!o) {
          o = this;
        }
        for (var m in l) {
          if (l.hasOwnProperty(m)) {
            if (typeof l[m] === "object" && !(l[m] instanceof Array) && (typeof o[m] === "object" || typeof o[m] === "function")) {
              this.Add(l[m], o[m], l[m], n);
            } else {
              if (!o[m] || !o[m].isUser || !n) {
                o[m] = l[m];
              }
            }
          }
        }
        return o;
      }};
    var k = function() {
      h = MathJax.ElementJax.mml;
      c.Insert(f, {
        letter: /[a-z]/i,
        digit: /[0-9.]/,
        number: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,
        special: {
          "\\": "ControlSequence",
          "{": "Open",
          "}": "Close",
          "~": "Tilde",
          "^": "Superscript",
          _: "Subscript",
          " ": "Space",
          "\t": "Space",
          "\r": "Space",
          "\n": "Space",
          "'": "Prime",
          "%": "Comment",
          "&": "Entry",
          "#": "Hash",
          "\u00A0": "Space",
          "\u2019": "Prime"
        },
        remap: {
          "-": "2212",
          "*": "2217",
          "`": "2018"
        },
        mathchar0mi: {
          alpha: "03B1",
          beta: "03B2",
          gamma: "03B3",
          delta: "03B4",
          epsilon: "03F5",
          zeta: "03B6",
          eta: "03B7",
          theta: "03B8",
          iota: "03B9",
          kappa: "03BA",
          lambda: "03BB",
          mu: "03BC",
          nu: "03BD",
          xi: "03BE",
          omicron: "03BF",
          pi: "03C0",
          rho: "03C1",
          sigma: "03C3",
          tau: "03C4",
          upsilon: "03C5",
          phi: "03D5",
          chi: "03C7",
          psi: "03C8",
          omega: "03C9",
          varepsilon: "03B5",
          vartheta: "03D1",
          varpi: "03D6",
          varrho: "03F1",
          varsigma: "03C2",
          varphi: "03C6",
          S: ["00A7", {mathvariant: h.VARIANT.NORMAL}],
          aleph: ["2135", {mathvariant: h.VARIANT.NORMAL}],
          hbar: ["210F", {variantForm: true}],
          imath: "0131",
          jmath: "0237",
          ell: "2113",
          wp: ["2118", {mathvariant: h.VARIANT.NORMAL}],
          Re: ["211C", {mathvariant: h.VARIANT.NORMAL}],
          Im: ["2111", {mathvariant: h.VARIANT.NORMAL}],
          partial: ["2202", {mathvariant: h.VARIANT.NORMAL}],
          infty: ["221E", {mathvariant: h.VARIANT.NORMAL}],
          prime: ["2032", {
            mathvariant: h.VARIANT.NORMAL,
            variantForm: true
          }],
          emptyset: ["2205", {mathvariant: h.VARIANT.NORMAL}],
          nabla: ["2207", {mathvariant: h.VARIANT.NORMAL}],
          top: ["22A4", {mathvariant: h.VARIANT.NORMAL}],
          bot: ["22A5", {mathvariant: h.VARIANT.NORMAL}],
          angle: ["2220", {mathvariant: h.VARIANT.NORMAL}],
          triangle: ["25B3", {mathvariant: h.VARIANT.NORMAL}],
          backslash: ["2216", {
            mathvariant: h.VARIANT.NORMAL,
            variantForm: true
          }],
          forall: ["2200", {mathvariant: h.VARIANT.NORMAL}],
          exists: ["2203", {mathvariant: h.VARIANT.NORMAL}],
          neg: ["00AC", {mathvariant: h.VARIANT.NORMAL}],
          lnot: ["00AC", {mathvariant: h.VARIANT.NORMAL}],
          flat: ["266D", {mathvariant: h.VARIANT.NORMAL}],
          natural: ["266E", {mathvariant: h.VARIANT.NORMAL}],
          sharp: ["266F", {mathvariant: h.VARIANT.NORMAL}],
          clubsuit: ["2663", {mathvariant: h.VARIANT.NORMAL}],
          diamondsuit: ["2662", {mathvariant: h.VARIANT.NORMAL}],
          heartsuit: ["2661", {mathvariant: h.VARIANT.NORMAL}],
          spadesuit: ["2660", {mathvariant: h.VARIANT.NORMAL}]
        },
        mathchar0mo: {
          surd: "221A",
          coprod: ["2210", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          bigvee: ["22C1", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          bigwedge: ["22C0", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          biguplus: ["2A04", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          bigcap: ["22C2", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          bigcup: ["22C3", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          "int": ["222B", {texClass: h.TEXCLASS.OP}],
          intop: ["222B", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true,
            movablelimits: true
          }],
          iint: ["222C", {texClass: h.TEXCLASS.OP}],
          iiint: ["222D", {texClass: h.TEXCLASS.OP}],
          prod: ["220F", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          sum: ["2211", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          bigotimes: ["2A02", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          bigoplus: ["2A01", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          bigodot: ["2A00", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          oint: ["222E", {texClass: h.TEXCLASS.OP}],
          bigsqcup: ["2A06", {
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          }],
          smallint: ["222B", {largeop: false}],
          triangleleft: "25C3",
          triangleright: "25B9",
          bigtriangleup: "25B3",
          bigtriangledown: "25BD",
          wedge: "2227",
          land: "2227",
          vee: "2228",
          lor: "2228",
          cap: "2229",
          cup: "222A",
          ddagger: "2021",
          dagger: "2020",
          sqcap: "2293",
          sqcup: "2294",
          uplus: "228E",
          amalg: "2A3F",
          diamond: "22C4",
          bullet: "2219",
          wr: "2240",
          div: "00F7",
          odot: ["2299", {largeop: false}],
          oslash: ["2298", {largeop: false}],
          otimes: ["2297", {largeop: false}],
          ominus: ["2296", {largeop: false}],
          oplus: ["2295", {largeop: false}],
          mp: "2213",
          pm: "00B1",
          circ: "2218",
          bigcirc: "25EF",
          setminus: ["2216", {variantForm: true}],
          cdot: "22C5",
          ast: "2217",
          times: "00D7",
          star: "22C6",
          propto: "221D",
          sqsubseteq: "2291",
          sqsupseteq: "2292",
          parallel: "2225",
          mid: "2223",
          dashv: "22A3",
          vdash: "22A2",
          leq: "2264",
          le: "2264",
          geq: "2265",
          ge: "2265",
          lt: "003C",
          gt: "003E",
          succ: "227B",
          prec: "227A",
          approx: "2248",
          succeq: "2AB0",
          preceq: "2AAF",
          supset: "2283",
          subset: "2282",
          supseteq: "2287",
          subseteq: "2286",
          "in": "2208",
          ni: "220B",
          notin: "2209",
          owns: "220B",
          gg: "226B",
          ll: "226A",
          sim: "223C",
          simeq: "2243",
          perp: "22A5",
          equiv: "2261",
          asymp: "224D",
          smile: "2323",
          frown: "2322",
          ne: "2260",
          neq: "2260",
          cong: "2245",
          doteq: "2250",
          bowtie: "22C8",
          models: "22A8",
          notChar: "29F8",
          Leftrightarrow: "21D4",
          Leftarrow: "21D0",
          Rightarrow: "21D2",
          leftrightarrow: "2194",
          leftarrow: "2190",
          gets: "2190",
          rightarrow: "2192",
          to: "2192",
          mapsto: "21A6",
          leftharpoonup: "21BC",
          leftharpoondown: "21BD",
          rightharpoonup: "21C0",
          rightharpoondown: "21C1",
          nearrow: "2197",
          searrow: "2198",
          nwarrow: "2196",
          swarrow: "2199",
          rightleftharpoons: "21CC",
          hookrightarrow: "21AA",
          hookleftarrow: "21A9",
          longleftarrow: "27F5",
          Longleftarrow: "27F8",
          longrightarrow: "27F6",
          Longrightarrow: "27F9",
          Longleftrightarrow: "27FA",
          longleftrightarrow: "27F7",
          longmapsto: "27FC",
          ldots: "2026",
          cdots: "22EF",
          vdots: "22EE",
          ddots: "22F1",
          dotsc: "2026",
          dotsb: "22EF",
          dotsm: "22EF",
          dotsi: "22EF",
          dotso: "2026",
          ldotp: ["002E", {texClass: h.TEXCLASS.PUNCT}],
          cdotp: ["22C5", {texClass: h.TEXCLASS.PUNCT}],
          colon: ["003A", {texClass: h.TEXCLASS.PUNCT}]
        },
        mathchar7: {
          Gamma: "0393",
          Delta: "0394",
          Theta: "0398",
          Lambda: "039B",
          Xi: "039E",
          Pi: "03A0",
          Sigma: "03A3",
          Upsilon: "03A5",
          Phi: "03A6",
          Psi: "03A8",
          Omega: "03A9",
          _: "005F",
          "#": "0023",
          "$": "0024",
          "%": "0025",
          "&": "0026",
          And: "0026"
        },
        delimiter: {
          "(": "(",
          ")": ")",
          "[": "[",
          "]": "]",
          "<": "27E8",
          ">": "27E9",
          "\\lt": "27E8",
          "\\gt": "27E9",
          "/": "/",
          "|": ["|", {texClass: h.TEXCLASS.ORD}],
          ".": "",
          "\\\\": "\\",
          "\\lmoustache": "23B0",
          "\\rmoustache": "23B1",
          "\\lgroup": "27EE",
          "\\rgroup": "27EF",
          "\\arrowvert": "23D0",
          "\\Arrowvert": "2016",
          "\\bracevert": "23AA",
          "\\Vert": ["2225", {texClass: h.TEXCLASS.ORD}],
          "\\|": ["2225", {texClass: h.TEXCLASS.ORD}],
          "\\vert": ["|", {texClass: h.TEXCLASS.ORD}],
          "\\uparrow": "2191",
          "\\downarrow": "2193",
          "\\updownarrow": "2195",
          "\\Uparrow": "21D1",
          "\\Downarrow": "21D3",
          "\\Updownarrow": "21D5",
          "\\backslash": "\\",
          "\\rangle": "27E9",
          "\\langle": "27E8",
          "\\rbrace": "}",
          "\\lbrace": "{",
          "\\}": "}",
          "\\{": "{",
          "\\rceil": "2309",
          "\\lceil": "2308",
          "\\rfloor": "230B",
          "\\lfloor": "230A",
          "\\lbrack": "[",
          "\\rbrack": "]"
        },
        macros: {
          displaystyle: ["SetStyle", "D", true, 0],
          textstyle: ["SetStyle", "T", false, 0],
          scriptstyle: ["SetStyle", "S", false, 1],
          scriptscriptstyle: ["SetStyle", "SS", false, 2],
          rm: ["SetFont", h.VARIANT.NORMAL],
          mit: ["SetFont", h.VARIANT.ITALIC],
          oldstyle: ["SetFont", h.VARIANT.OLDSTYLE],
          cal: ["SetFont", h.VARIANT.CALIGRAPHIC],
          it: ["SetFont", "-tex-mathit"],
          bf: ["SetFont", h.VARIANT.BOLD],
          bbFont: ["SetFont", h.VARIANT.DOUBLESTRUCK],
          scr: ["SetFont", h.VARIANT.SCRIPT],
          frak: ["SetFont", h.VARIANT.FRAKTUR],
          sf: ["SetFont", h.VARIANT.SANSSERIF],
          tt: ["SetFont", h.VARIANT.MONOSPACE],
          tiny: ["SetSize", 0.5],
          Tiny: ["SetSize", 0.6],
          scriptsize: ["SetSize", 0.7],
          small: ["SetSize", 0.85],
          normalsize: ["SetSize", 1],
          large: ["SetSize", 1.2],
          Large: ["SetSize", 1.44],
          LARGE: ["SetSize", 1.73],
          huge: ["SetSize", 2.07],
          Huge: ["SetSize", 2.49],
          arcsin: ["NamedFn"],
          arccos: ["NamedFn"],
          arctan: ["NamedFn"],
          arg: ["NamedFn"],
          cos: ["NamedFn"],
          cosh: ["NamedFn"],
          cot: ["NamedFn"],
          coth: ["NamedFn"],
          csc: ["NamedFn"],
          deg: ["NamedFn"],
          det: "NamedOp",
          dim: ["NamedFn"],
          exp: ["NamedFn"],
          gcd: "NamedOp",
          hom: ["NamedFn"],
          inf: "NamedOp",
          ker: ["NamedFn"],
          lg: ["NamedFn"],
          lim: "NamedOp",
          liminf: ["NamedOp", "lim&thinsp;inf"],
          limsup: ["NamedOp", "lim&thinsp;sup"],
          ln: ["NamedFn"],
          log: ["NamedFn"],
          max: "NamedOp",
          min: "NamedOp",
          Pr: "NamedOp",
          sec: ["NamedFn"],
          sin: ["NamedFn"],
          sinh: ["NamedFn"],
          sup: "NamedOp",
          tan: ["NamedFn"],
          tanh: ["NamedFn"],
          limits: ["Limits", 1],
          nolimits: ["Limits", 0],
          overline: ["UnderOver", "00AF", null, 1],
          underline: ["UnderOver", "005F"],
          overbrace: ["UnderOver", "23DE", 1],
          underbrace: ["UnderOver", "23DF", 1],
          overparen: ["UnderOver", "23DC"],
          underparen: ["UnderOver", "23DD"],
          overrightarrow: ["UnderOver", "2192"],
          underrightarrow: ["UnderOver", "2192"],
          overleftarrow: ["UnderOver", "2190"],
          underleftarrow: ["UnderOver", "2190"],
          overleftrightarrow: ["UnderOver", "2194"],
          underleftrightarrow: ["UnderOver", "2194"],
          overset: "Overset",
          underset: "Underset",
          stackrel: ["Macro", "\\mathrel{\\mathop{#2}\\limits^{#1}}", 2],
          over: "Over",
          overwithdelims: "Over",
          atop: "Over",
          atopwithdelims: "Over",
          above: "Over",
          abovewithdelims: "Over",
          brace: ["Over", "{", "}"],
          brack: ["Over", "[", "]"],
          choose: ["Over", "(", ")"],
          frac: "Frac",
          sqrt: "Sqrt",
          root: "Root",
          uproot: ["MoveRoot", "upRoot"],
          leftroot: ["MoveRoot", "leftRoot"],
          left: "LeftRight",
          right: "LeftRight",
          middle: "Middle",
          llap: "Lap",
          rlap: "Lap",
          raise: "RaiseLower",
          lower: "RaiseLower",
          moveleft: "MoveLeftRight",
          moveright: "MoveLeftRight",
          ",": ["Spacer", h.LENGTH.THINMATHSPACE],
          ":": ["Spacer", h.LENGTH.MEDIUMMATHSPACE],
          ">": ["Spacer", h.LENGTH.MEDIUMMATHSPACE],
          ";": ["Spacer", h.LENGTH.THICKMATHSPACE],
          "!": ["Spacer", h.LENGTH.NEGATIVETHINMATHSPACE],
          enspace: ["Spacer", ".5em"],
          quad: ["Spacer", "1em"],
          qquad: ["Spacer", "2em"],
          thinspace: ["Spacer", h.LENGTH.THINMATHSPACE],
          negthinspace: ["Spacer", h.LENGTH.NEGATIVETHINMATHSPACE],
          hskip: "Hskip",
          hspace: "Hskip",
          kern: "Hskip",
          mskip: "Hskip",
          mspace: "Hskip",
          mkern: "Hskip",
          Rule: ["Rule"],
          Space: ["Rule", "blank"],
          big: ["MakeBig", h.TEXCLASS.ORD, 0.85],
          Big: ["MakeBig", h.TEXCLASS.ORD, 1.15],
          bigg: ["MakeBig", h.TEXCLASS.ORD, 1.45],
          Bigg: ["MakeBig", h.TEXCLASS.ORD, 1.75],
          bigl: ["MakeBig", h.TEXCLASS.OPEN, 0.85],
          Bigl: ["MakeBig", h.TEXCLASS.OPEN, 1.15],
          biggl: ["MakeBig", h.TEXCLASS.OPEN, 1.45],
          Biggl: ["MakeBig", h.TEXCLASS.OPEN, 1.75],
          bigr: ["MakeBig", h.TEXCLASS.CLOSE, 0.85],
          Bigr: ["MakeBig", h.TEXCLASS.CLOSE, 1.15],
          biggr: ["MakeBig", h.TEXCLASS.CLOSE, 1.45],
          Biggr: ["MakeBig", h.TEXCLASS.CLOSE, 1.75],
          bigm: ["MakeBig", h.TEXCLASS.REL, 0.85],
          Bigm: ["MakeBig", h.TEXCLASS.REL, 1.15],
          biggm: ["MakeBig", h.TEXCLASS.REL, 1.45],
          Biggm: ["MakeBig", h.TEXCLASS.REL, 1.75],
          mathord: ["TeXAtom", h.TEXCLASS.ORD],
          mathop: ["TeXAtom", h.TEXCLASS.OP],
          mathopen: ["TeXAtom", h.TEXCLASS.OPEN],
          mathclose: ["TeXAtom", h.TEXCLASS.CLOSE],
          mathbin: ["TeXAtom", h.TEXCLASS.BIN],
          mathrel: ["TeXAtom", h.TEXCLASS.REL],
          mathpunct: ["TeXAtom", h.TEXCLASS.PUNCT],
          mathinner: ["TeXAtom", h.TEXCLASS.INNER],
          vcenter: ["TeXAtom", h.TEXCLASS.VCENTER],
          mathchoice: ["Extension", "mathchoice"],
          buildrel: "BuildRel",
          hbox: ["HBox", 0],
          text: "HBox",
          mbox: ["HBox", 0],
          fbox: "FBox",
          strut: "Strut",
          mathstrut: ["Macro", "\\vphantom{(}"],
          phantom: "Phantom",
          vphantom: ["Phantom", 1, 0],
          hphantom: ["Phantom", 0, 1],
          smash: "Smash",
          acute: ["Accent", "00B4"],
          grave: ["Accent", "0060"],
          ddot: ["Accent", "00A8"],
          tilde: ["Accent", "007E"],
          bar: ["Accent", "00AF"],
          breve: ["Accent", "02D8"],
          check: ["Accent", "02C7"],
          hat: ["Accent", "005E"],
          vec: ["Accent", "2192"],
          dot: ["Accent", "02D9"],
          widetilde: ["Accent", "007E", 1],
          widehat: ["Accent", "005E", 1],
          matrix: "Matrix",
          array: "Matrix",
          pmatrix: ["Matrix", "(", ")"],
          cases: ["Matrix", "{", "", "left left", null, ".1em", null, true],
          eqalign: ["Matrix", null, null, "right left", h.LENGTH.THICKMATHSPACE, ".5em", "D"],
          displaylines: ["Matrix", null, null, "center", null, ".5em", "D"],
          cr: "Cr",
          "\\": "CrLaTeX",
          newline: "Cr",
          hline: ["HLine", "solid"],
          hdashline: ["HLine", "dashed"],
          eqalignno: ["Matrix", null, null, "right left", h.LENGTH.THICKMATHSPACE, ".5em", "D", null, "right"],
          leqalignno: ["Matrix", null, null, "right left", h.LENGTH.THICKMATHSPACE, ".5em", "D", null, "left"],
          hfill: "HFill",
          hfil: "HFill",
          hfilll: "HFill",
          bmod: ["Macro", '\\mmlToken{mo}[lspace="thickmathspace" rspace="thickmathspace"]{mod}'],
          pmod: ["Macro", "\\pod{\\mmlToken{mi}{mod}\\kern 6mu #1}", 1],
          mod: ["Macro", "\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,#1", 1],
          pod: ["Macro", "\\mathchoice{\\kern18mu}{\\kern8mu}{\\kern8mu}{\\kern8mu}(#1)", 1],
          iff: ["Macro", "\\;\\Longleftrightarrow\\;"],
          skew: ["Macro", "{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}", 3],
          mathcal: ["Macro", "{\\cal #1}", 1],
          mathscr: ["Macro", "{\\scr #1}", 1],
          mathrm: ["Macro", "{\\rm #1}", 1],
          mathbf: ["Macro", "{\\bf #1}", 1],
          mathbb: ["Macro", "{\\bbFont #1}", 1],
          Bbb: ["Macro", "{\\bbFont #1}", 1],
          mathit: ["Macro", "{\\it #1}", 1],
          mathfrak: ["Macro", "{\\frak #1}", 1],
          mathsf: ["Macro", "{\\sf #1}", 1],
          mathtt: ["Macro", "{\\tt #1}", 1],
          textrm: ["Macro", "\\mathord{\\rm\\text{#1}}", 1],
          textit: ["Macro", "\\mathord{\\it\\text{#1}}", 1],
          textbf: ["Macro", "\\mathord{\\bf\\text{#1}}", 1],
          textsf: ["Macro", "\\mathord{\\sf\\text{#1}}", 1],
          texttt: ["Macro", "\\mathord{\\tt\\text{#1}}", 1],
          pmb: ["Macro", "\\rlap{#1}\\kern1px{#1}", 1],
          TeX: ["Macro", "T\\kern-.14em\\lower.5ex{E}\\kern-.115em X"],
          LaTeX: ["Macro", "L\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX"],
          " ": ["Macro", "\\text{ }"],
          not: "Not",
          dots: "Dots",
          space: "Tilde",
          "\u00A0": "Tilde",
          begin: "BeginEnd",
          end: "BeginEnd",
          newcommand: ["Extension", "newcommand"],
          renewcommand: ["Extension", "newcommand"],
          newenvironment: ["Extension", "newcommand"],
          renewenvironment: ["Extension", "newcommand"],
          def: ["Extension", "newcommand"],
          let: ["Extension", "newcommand"],
          verb: ["Extension", "verb"],
          boldsymbol: ["Extension", "boldsymbol"],
          tag: ["Extension", "AMSmath"],
          notag: ["Extension", "AMSmath"],
          label: ["Extension", "AMSmath"],
          ref: ["Extension", "AMSmath"],
          eqref: ["Extension", "AMSmath"],
          nonumber: ["Macro", "\\notag"],
          unicode: ["Extension", "unicode"],
          color: "Color",
          href: ["Extension", "HTML"],
          "class": ["Extension", "HTML"],
          style: ["Extension", "HTML"],
          cssId: ["Extension", "HTML"],
          bbox: ["Extension", "bbox"],
          mmlToken: "MmlToken",
          require: "Require"
        },
        environment: {
          array: ["AlignedArray"],
          matrix: ["Array", null, null, null, "c"],
          pmatrix: ["Array", null, "(", ")", "c"],
          bmatrix: ["Array", null, "[", "]", "c"],
          Bmatrix: ["Array", null, "\\{", "\\}", "c"],
          vmatrix: ["Array", null, "\\vert", "\\vert", "c"],
          Vmatrix: ["Array", null, "\\Vert", "\\Vert", "c"],
          cases: ["Array", null, "\\{", ".", "ll", null, ".2em", "T"],
          equation: [null, "Equation"],
          "equation*": [null, "Equation"],
          eqnarray: ["ExtensionEnv", null, "AMSmath"],
          "eqnarray*": ["ExtensionEnv", null, "AMSmath"],
          align: ["ExtensionEnv", null, "AMSmath"],
          "align*": ["ExtensionEnv", null, "AMSmath"],
          aligned: ["ExtensionEnv", null, "AMSmath"],
          multline: ["ExtensionEnv", null, "AMSmath"],
          "multline*": ["ExtensionEnv", null, "AMSmath"],
          split: ["ExtensionEnv", null, "AMSmath"],
          gather: ["ExtensionEnv", null, "AMSmath"],
          "gather*": ["ExtensionEnv", null, "AMSmath"],
          gathered: ["ExtensionEnv", null, "AMSmath"],
          alignat: ["ExtensionEnv", null, "AMSmath"],
          "alignat*": ["ExtensionEnv", null, "AMSmath"],
          alignedat: ["ExtensionEnv", null, "AMSmath"]
        },
        p_height: 1.2 / 0.85
      });
      if (this.config.Macros) {
        var l = this.config.Macros;
        for (var m in l) {
          if (l.hasOwnProperty(m)) {
            if (typeof(l[m]) === "string") {
              f.macros[m] = ["Macro", l[m]];
            } else {
              f.macros[m] = ["Macro"].concat(l[m]);
            }
            f.macros[m].isUser = true;
          }
        }
      }
    };
    var a = MathJax.Object.Subclass({
      Init: function(m, n) {
        this.string = m;
        this.i = 0;
        this.macroCount = 0;
        var l;
        if (n) {
          l = {};
          for (var o in n) {
            if (n.hasOwnProperty(o)) {
              l[o] = n[o];
            }
          }
        }
        this.stack = d.Stack(l, !!n);
        this.Parse();
        this.Push(b.stop());
      },
      Parse: function() {
        var m,
            l;
        while (this.i < this.string.length) {
          m = this.string.charAt(this.i++);
          l = m.charCodeAt(0);
          if (l >= 55296 && l < 56320) {
            m += this.string.charAt(this.i++);
          }
          if (f.special[m]) {
            this[f.special[m]](m);
          } else {
            if (f.letter.test(m)) {
              this.Variable(m);
            } else {
              if (f.digit.test(m)) {
                this.Number(m);
              } else {
                this.Other(m);
              }
            }
          }
        }
      },
      Push: function() {
        this.stack.Push.apply(this.stack, arguments);
      },
      mml: function() {
        if (this.stack.Top().type !== "mml") {
          return null;
        }
        return this.stack.Top().data[0];
      },
      mmlToken: function(l) {
        return l;
      },
      ControlSequence: function(o) {
        var l = this.GetCS(),
            n = this.csFindMacro(l);
        if (n) {
          if (!(n instanceof Array)) {
            n = [n];
          }
          var m = n[0];
          if (!(m instanceof Function)) {
            m = this[m];
          }
          m.apply(this, [o + l].concat(n.slice(1)));
        } else {
          if (f.mathchar0mi[l]) {
            this.csMathchar0mi(l, f.mathchar0mi[l]);
          } else {
            if (f.mathchar0mo[l]) {
              this.csMathchar0mo(l, f.mathchar0mo[l]);
            } else {
              if (f.mathchar7[l]) {
                this.csMathchar7(l, f.mathchar7[l]);
              } else {
                if (f.delimiter["\\" + l] != null) {
                  this.csDelimiter(l, f.delimiter["\\" + l]);
                } else {
                  this.csUndefined(o + l);
                }
              }
            }
          }
        }
      },
      csFindMacro: function(l) {
        return f.macros[l];
      },
      csMathchar0mi: function(l, n) {
        var m = {mathvariant: h.VARIANT.ITALIC};
        if (n instanceof Array) {
          m = n[1];
          n = n[0];
        }
        this.Push(this.mmlToken(h.mi(h.entity("#x" + n)).With(m)));
      },
      csMathchar0mo: function(l, n) {
        var m = {stretchy: false};
        if (n instanceof Array) {
          m = n[1];
          m.stretchy = false;
          n = n[0];
        }
        this.Push(this.mmlToken(h.mo(h.entity("#x" + n)).With(m)));
      },
      csMathchar7: function(l, n) {
        var m = {mathvariant: h.VARIANT.NORMAL};
        if (n instanceof Array) {
          m = n[1];
          n = n[0];
        }
        if (this.stack.env.font) {
          m.mathvariant = this.stack.env.font;
        }
        this.Push(this.mmlToken(h.mi(h.entity("#x" + n)).With(m)));
      },
      csDelimiter: function(l, n) {
        var m = {};
        if (n instanceof Array) {
          m = n[1];
          n = n[0];
        }
        if (n.length === 4) {
          n = h.entity("#x" + n);
        } else {
          n = h.chars(n);
        }
        this.Push(this.mmlToken(h.mo(n).With({
          fence: false,
          stretchy: false
        }).With(m)));
      },
      csUndefined: function(l) {
        d.Error(["UndefinedControlSequence", "Undefined control sequence %1", l]);
      },
      Variable: function(m) {
        var l = {};
        if (this.stack.env.font) {
          l.mathvariant = this.stack.env.font;
        }
        this.Push(this.mmlToken(h.mi(h.chars(m)).With(l)));
      },
      Number: function(o) {
        var l,
            m = this.string.slice(this.i - 1).match(f.number);
        if (m) {
          l = h.mn(m[0].replace(/[{}]/g, ""));
          this.i += m[0].length - 1;
        } else {
          l = h.mo(h.chars(o));
        }
        if (this.stack.env.font) {
          l.mathvariant = this.stack.env.font;
        }
        this.Push(this.mmlToken(l));
      },
      Open: function(l) {
        this.Push(b.open());
      },
      Close: function(l) {
        this.Push(b.close());
      },
      Tilde: function(l) {
        this.Push(h.mtext(h.chars(g)));
      },
      Space: function(l) {},
      Superscript: function(q) {
        if (this.GetNext().match(/\d/)) {
          this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1);
        }
        var p,
            n,
            o = this.stack.Top();
        if (o.type === "prime") {
          n = o.data[0];
          p = o.data[1];
          this.stack.Pop();
        } else {
          n = this.stack.Prev();
          if (!n) {
            n = h.mi("");
          }
        }
        if (n.isEmbellishedWrapper) {
          n = n.data[0].data[0];
        }
        var m = n.movesupsub,
            l = n.sup;
        if ((n.type === "msubsup" && n.data[n.sup]) || (n.type === "munderover" && n.data[n.over] && !n.subsupOK)) {
          d.Error(["DoubleExponent", "Double exponent: use braces to clarify"]);
        }
        if (n.type !== "msubsup") {
          if (m) {
            if (n.type !== "munderover" || n.data[n.over]) {
              if (n.movablelimits && n.isa(h.mi)) {
                n = this.mi2mo(n);
              }
              n = h.munderover(n, null, null).With({movesupsub: true});
            }
            l = n.over;
          } else {
            n = h.msubsup(n, null, null);
            l = n.sup;
          }
        }
        this.Push(b.subsup(n).With({
          position: l,
          primes: p,
          movesupsub: m
        }));
      },
      Subscript: function(q) {
        if (this.GetNext().match(/\d/)) {
          this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1);
        }
        var p,
            n,
            o = this.stack.Top();
        if (o.type === "prime") {
          n = o.data[0];
          p = o.data[1];
          this.stack.Pop();
        } else {
          n = this.stack.Prev();
          if (!n) {
            n = h.mi("");
          }
        }
        if (n.isEmbellishedWrapper) {
          n = n.data[0].data[0];
        }
        var m = n.movesupsub,
            l = n.sub;
        if ((n.type === "msubsup" && n.data[n.sub]) || (n.type === "munderover" && n.data[n.under] && !n.subsupOK)) {
          d.Error(["DoubleSubscripts", "Double subscripts: use braces to clarify"]);
        }
        if (n.type !== "msubsup") {
          if (m) {
            if (n.type !== "munderover" || n.data[n.under]) {
              if (n.movablelimits && n.isa(h.mi)) {
                n = this.mi2mo(n);
              }
              n = h.munderover(n, null, null).With({movesupsub: true});
            }
            l = n.under;
          } else {
            n = h.msubsup(n, null, null);
            l = n.sub;
          }
        }
        this.Push(b.subsup(n).With({
          position: l,
          primes: p,
          movesupsub: m
        }));
      },
      PRIME: "\u2032",
      SMARTQUOTE: "\u2019",
      Prime: function(n) {
        var m = this.stack.Prev();
        if (!m) {
          m = h.mi();
        }
        if (m.type === "msubsup" && m.data[m.sup]) {
          d.Error(["DoubleExponentPrime", "Prime causes double exponent: use braces to clarify"]);
        }
        var l = "";
        this.i--;
        do {
          l += this.PRIME;
          this.i++, n = this.GetNext();
        } while (n === "'" || n === this.SMARTQUOTE);
        l = ["", "\u2032", "\u2033", "\u2034", "\u2057"][l.length] || l;
        this.Push(b.prime(m, this.mmlToken(h.mo(l))));
      },
      mi2mo: function(l) {
        var m = h.mo();
        m.Append.apply(m, l.data);
        var n;
        for (n in m.defaults) {
          if (m.defaults.hasOwnProperty(n) && l[n] != null) {
            m[n] = l[n];
          }
        }
        for (n in h.copyAttributes) {
          if (h.copyAttributes.hasOwnProperty(n) && l[n] != null) {
            m[n] = l[n];
          }
        }
        m.lspace = m.rspace = "0";
        m.useMMLspacing &= ~(m.SPACE_ATTR.lspace | m.SPACE_ATTR.rspace);
        return m;
      },
      Comment: function(l) {
        while (this.i < this.string.length && this.string.charAt(this.i) != "\n") {
          this.i++;
        }
      },
      Hash: function(l) {
        d.Error(["CantUseHash1", "You can't use 'macro parameter character #' in math mode"]);
      },
      Other: function(n) {
        var m,
            l;
        if (this.stack.env.font) {
          m = {mathvariant: this.stack.env.font};
        }
        if (f.remap[n]) {
          n = f.remap[n];
          if (n instanceof Array) {
            m = n[1];
            n = n[0];
          }
          l = h.mo(h.entity("#x" + n)).With(m);
        } else {
          l = h.mo(n).With(m);
        }
        if (l.autoDefault("stretchy", true)) {
          l.stretchy = false;
        }
        if (l.autoDefault("texClass", true) == "") {
          l = h.TeXAtom(l);
        }
        this.Push(this.mmlToken(l));
      },
      SetFont: function(m, l) {
        this.stack.env.font = l;
      },
      SetStyle: function(m, l, n, o) {
        this.stack.env.style = l;
        this.stack.env.level = o;
        this.Push(b.style().With({styles: {
            displaystyle: n,
            scriptlevel: o
          }}));
      },
      SetSize: function(l, m) {
        this.stack.env.size = m;
        this.Push(b.style().With({styles: {mathsize: m + "em"}}));
      },
      Color: function(n) {
        var m = this.GetArgument(n);
        var l = this.stack.env.color;
        this.stack.env.color = m;
        var o = this.ParseArg(n);
        if (l) {
          this.stack.env.color;
        } else {
          delete this.stack.env.color;
        }
        this.Push(h.mstyle(o).With({mathcolor: m}));
      },
      Spacer: function(l, m) {
        this.Push(h.mspace().With({
          width: m,
          mathsize: h.SIZE.NORMAL,
          scriptlevel: 0
        }));
      },
      LeftRight: function(l) {
        this.Push(b[l.substr(1)]().With({delim: this.GetDelimiter(l)}));
      },
      Middle: function(l) {
        var m = this.GetDelimiter(l);
        if (this.stack.Top().type !== "left") {
          d.Error(["MisplacedMiddle", "%1 must be within \\left and \\right", l]);
        }
        this.Push(h.mo(m).With({stretchy: true}));
      },
      NamedFn: function(m, n) {
        if (!n) {
          n = m.substr(1);
        }
        var l = h.mi(n).With({texClass: h.TEXCLASS.OP});
        this.Push(b.fn(this.mmlToken(l)));
      },
      NamedOp: function(m, n) {
        if (!n) {
          n = m.substr(1);
        }
        n = n.replace(/&thinsp;/, "\u2006");
        var l = h.mo(n).With({
          movablelimits: true,
          movesupsub: true,
          form: h.FORM.PREFIX,
          texClass: h.TEXCLASS.OP
        });
        l.useMMLspacing &= ~l.SPACE_ATTR.form;
        this.Push(this.mmlToken(l));
      },
      Limits: function(m, l) {
        var o = this.stack.Prev("nopop");
        if (!o || (o.Get("texClass") !== h.TEXCLASS.OP && o.movesupsub == null)) {
          d.Error(["MisplacedLimits", "%1 is allowed only on operators", m]);
        }
        var n = this.stack.Top();
        if (o.type === "munderover" && !l) {
          o = n.data[n.data.length - 1] = h.msubsup.apply(h.subsup, o.data);
        } else {
          if (o.type === "msubsup" && l) {
            o = n.data[n.data.length - 1] = h.munderover.apply(h.underover, o.data);
          }
        }
        o.movesupsub = (l ? true : false);
        o.Core().movablelimits = false;
        if (o.movablelimits) {
          o.movablelimits = false;
        }
      },
      Over: function(n, m, o) {
        var l = b.over().With({name: n});
        if (m || o) {
          l.open = m;
          l.close = o;
        } else {
          if (n.match(/withdelims$/)) {
            l.open = this.GetDelimiter(n);
            l.close = this.GetDelimiter(n);
          }
        }
        if (n.match(/^\\above/)) {
          l.thickness = this.GetDimen(n);
        } else {
          if (n.match(/^\\atop/) || m || o) {
            l.thickness = 0;
          }
        }
        this.Push(l);
      },
      Frac: function(m) {
        var l = this.ParseArg(m);
        var n = this.ParseArg(m);
        this.Push(h.mfrac(l, n));
      },
      Sqrt: function(o) {
        var p = this.GetBrackets(o),
            l = this.GetArgument(o);
        if (l === "\\frac") {
          l += "{" + this.GetArgument(l) + "}{" + this.GetArgument(l) + "}";
        }
        var m = d.Parse(l, this.stack.env).mml();
        if (!p) {
          m = h.msqrt.apply(h, m.array());
        } else {
          m = h.mroot(m, this.parseRoot(p));
        }
        this.Push(m);
      },
      Root: function(m) {
        var o = this.GetUpTo(m, "\\of");
        var l = this.ParseArg(m);
        this.Push(h.mroot(l, this.parseRoot(o)));
      },
      parseRoot: function(q) {
        var m = this.stack.env,
            l = m.inRoot;
        m.inRoot = true;
        var p = d.Parse(q, m);
        q = p.mml();
        var o = p.stack.global;
        if (o.leftRoot || o.upRoot) {
          q = h.mpadded(q);
          if (o.leftRoot) {
            q.width = o.leftRoot;
          }
          if (o.upRoot) {
            q.voffset = o.upRoot;
            q.height = o.upRoot;
          }
        }
        m.inRoot = l;
        return q;
      },
      MoveRoot: function(l, o) {
        if (!this.stack.env.inRoot) {
          d.Error(["MisplacedMoveRoot", "%1 can appear only within a root", l]);
        }
        if (this.stack.global[o]) {
          d.Error(["MultipleMoveRoot", "Multiple use of %1", l]);
        }
        var m = this.GetArgument(l);
        if (!m.match(/-?[0-9]+/)) {
          d.Error(["IntegerArg", "The argument to %1 must be an integer", l]);
        }
        m = (m / 15) + "em";
        if (m.substr(0, 1) !== "-") {
          m = "+" + m;
        }
        this.stack.global[o] = m;
      },
      Accent: function(n, l, q) {
        var p = this.ParseArg(n);
        var o = {accent: true};
        if (this.stack.env.font) {
          o.mathvariant = this.stack.env.font;
        }
        var m = this.mmlToken(h.mo(h.entity("#x" + l)).With(o));
        m.stretchy = (q ? true : false);
        this.Push(h.TeXAtom(h.munderover(p, null, m).With({accent: true})));
      },
      UnderOver: function(n, r, l, p) {
        var q = {
          o: "over",
          u: "under"
        }[n.charAt(1)];
        var o = this.ParseArg(n);
        if (o.Get("movablelimits")) {
          o.movablelimits = false;
        }
        if (o.isa(h.munderover) && o.isEmbellished()) {
          o.Core().With({
            lspace: 0,
            rspace: 0
          });
          o = h.mrow(h.mo().With({rspace: 0}), o);
        }
        var m = h.munderover(o, null, null);
        m.SetData(m[q], this.mmlToken(h.mo(h.entity("#x" + r)).With({
          stretchy: true,
          accent: !p
        })));
        if (l) {
          m = h.TeXAtom(m).With({
            texClass: h.TEXCLASS.OP,
            movesupsub: true
          });
        }
        this.Push(m.With({subsupOK: true}));
      },
      Overset: function(l) {
        var n = this.ParseArg(l),
            m = this.ParseArg(l);
        if (m.movablelimits) {
          m.movablelimits = false;
        }
        this.Push(h.mover(m, n));
      },
      Underset: function(l) {
        var n = this.ParseArg(l),
            m = this.ParseArg(l);
        if (m.movablelimits) {
          m.movablelimits = false;
        }
        this.Push(h.munder(m, n));
      },
      TeXAtom: function(o, q) {
        var p = {texClass: q},
            n;
        if (q == h.TEXCLASS.OP) {
          p.movesupsub = p.movablelimits = true;
          var l = this.GetArgument(o);
          var m = l.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
          if (m) {
            p.mathvariant = h.VARIANT.NORMAL;
            n = b.fn(this.mmlToken(h.mi(m[1]).With(p)));
          } else {
            n = b.fn(h.TeXAtom(d.Parse(l, this.stack.env).mml()).With(p));
          }
        } else {
          n = h.TeXAtom(this.ParseArg(o)).With(p);
        }
        this.Push(n);
      },
      MmlToken: function(n) {
        var o = this.GetArgument(n),
            l = this.GetBrackets(n, "").replace(/^\s+/, ""),
            r = this.GetArgument(n),
            q = {attrNames: []},
            m;
        if (!h[o] || !h[o].prototype.isToken) {
          d.Error(["NotMathMLToken", "%1 is not a token element", o]);
        }
        while (l !== "") {
          m = l.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
          if (!m) {
            d.Error(["InvalidMathMLAttr", "Invalid MathML attribute: %1", l]);
          }
          if (h[o].prototype.defaults[m[1]] == null && !this.MmlTokenAllow[m[1]]) {
            d.Error(["UnknownAttrForElement", "%1 is not a recognized attribute for %2", m[1], o]);
          }
          var p = this.MmlFilterAttribute(m[1], m[2].replace(/^(['"])(.*)\1$/, "$2"));
          if (p) {
            if (p.toLowerCase() === "true") {
              p = true;
            } else {
              if (p.toLowerCase() === "false") {
                p = false;
              }
            }
            q[m[1]] = p;
            q.attrNames.push(m[1]);
          }
          l = l.substr(m[0].length);
        }
        this.Push(this.mmlToken(h[o](r).With(q)));
      },
      MmlFilterAttribute: function(l, m) {
        return m;
      },
      MmlTokenAllow: {
        fontfamily: 1,
        fontsize: 1,
        fontweight: 1,
        fontstyle: 1,
        color: 1,
        background: 1,
        id: 1,
        "class": 1,
        href: 1,
        style: 1
      },
      Strut: function(l) {
        this.Push(h.mpadded(h.mrow()).With({
          height: "8.6pt",
          depth: "3pt",
          width: 0
        }));
      },
      Phantom: function(m, l, n) {
        var o = h.mphantom(this.ParseArg(m));
        if (l || n) {
          o = h.mpadded(o);
          if (n) {
            o.height = o.depth = 0;
          }
          if (l) {
            o.width = 0;
          }
        }
        this.Push(h.TeXAtom(o));
      },
      Smash: function(n) {
        var m = this.trimSpaces(this.GetBrackets(n, ""));
        var l = h.mpadded(this.ParseArg(n));
        switch (m) {
          case "b":
            l.depth = 0;
            break;
          case "t":
            l.height = 0;
            break;
          default:
            l.height = l.depth = 0;
        }
        this.Push(h.TeXAtom(l));
      },
      Lap: function(m) {
        var l = h.mpadded(this.ParseArg(m)).With({width: 0});
        if (m === "\\llap") {
          l.lspace = "-1width";
        }
        this.Push(h.TeXAtom(l));
      },
      RaiseLower: function(l) {
        var m = this.GetDimen(l);
        var n = b.position().With({
          name: l,
          move: "vertical"
        });
        if (m.charAt(0) === "-") {
          m = m.slice(1);
          l = {
            raise: "\\lower",
            lower: "\\raise"
          }[l.substr(1)];
        }
        if (l === "\\lower") {
          n.dh = "-" + m;
          n.dd = "+" + m;
        } else {
          n.dh = "+" + m;
          n.dd = "-" + m;
        }
        this.Push(n);
      },
      MoveLeftRight: function(l) {
        var o = this.GetDimen(l);
        var n = (o.charAt(0) === "-" ? o.slice(1) : "-" + o);
        if (l === "\\moveleft") {
          var m = o;
          o = n;
          n = m;
        }
        this.Push(b.position().With({
          name: l,
          move: "horizontal",
          left: h.mspace().With({
            width: o,
            mathsize: h.SIZE.NORMAL
          }),
          right: h.mspace().With({
            width: n,
            mathsize: h.SIZE.NORMAL
          })
        }));
      },
      Hskip: function(l) {
        this.Push(h.mspace().With({
          width: this.GetDimen(l),
          mathsize: h.SIZE.NORMAL
        }));
      },
      Rule: function(n, p) {
        var l = this.GetDimen(n),
            o = this.GetDimen(n),
            r = this.GetDimen(n);
        var m,
            q = {
              width: l,
              height: o,
              depth: r
            };
        if (p !== "blank") {
          if (parseFloat(l) && parseFloat(o) + parseFloat(r)) {
            q.mathbackground = (this.stack.env.color || "black");
          }
          m = h.mpadded(h.mrow()).With(q);
        } else {
          m = h.mspace().With(q);
        }
        this.Push(m);
      },
      MakeBig: function(l, o, m) {
        m *= f.p_height;
        m = String(m).replace(/(\.\d\d\d).+/, "$1") + "em";
        var n = this.GetDelimiter(l, true);
        this.Push(h.TeXAtom(h.mo(n).With({
          minsize: m,
          maxsize: m,
          fence: true,
          stretchy: true,
          symmetric: true
        })).With({texClass: o}));
      },
      BuildRel: function(l) {
        var m = this.ParseUpTo(l, "\\over");
        var n = this.ParseArg(l);
        this.Push(h.TeXAtom(h.munderover(n, null, m)).With({texClass: h.TEXCLASS.REL}));
      },
      HBox: function(l, m) {
        this.Push.apply(this, this.InternalMath(this.GetArgument(l), m));
      },
      FBox: function(l) {
        this.Push(h.menclose.apply(h, this.InternalMath(this.GetArgument(l))).With({notation: "box"}));
      },
      Not: function(l) {
        this.Push(b.not());
      },
      Dots: function(l) {
        this.Push(b.dots().With({
          ldots: this.mmlToken(h.mo(h.entity("#x2026")).With({stretchy: false})),
          cdots: this.mmlToken(h.mo(h.entity("#x22EF")).With({stretchy: false}))
        }));
      },
      Require: function(l) {
        var m = this.GetArgument(l).replace(/.*\//, "").replace(/[^a-z0-9_.-]/ig, "");
        this.Extension(null, m);
      },
      Extension: function(l, m, n) {
        if (l && !typeof(l) === "string") {
          l = l.name;
        }
        m = d.extensionDir + "/" + m;
        if (!m.match(/\.js$/)) {
          m += ".js";
        }
        if (!i.loaded[i.fileURL(m)]) {
          if (l != null) {
            delete f[n || "macros"][l.replace(/^\\/, "")];
          }
          c.RestartAfter(i.Require(m));
        }
      },
      Macro: function(n, q, p, r) {
        if (p) {
          var m = [];
          if (r != null) {
            var l = this.GetBrackets(n);
            m.push(l == null ? r : l);
          }
          for (var o = m.length; o < p; o++) {
            m.push(this.GetArgument(n));
          }
          q = this.SubstituteArgs(m, q);
        }
        this.string = this.AddArgs(q, this.string.slice(this.i));
        this.i = 0;
        if (++this.macroCount > d.config.MAXMACROS) {
          d.Error(["MaxMacroSub1", "MathJax maximum macro substitution count exceeded; is there a recursive macro call?"]);
        }
      },
      Matrix: function(m, o, u, q, t, n, l, v, s) {
        var r = this.GetNext();
        if (r === "") {
          d.Error(["MissingArgFor", "Missing argument for %1", m]);
        }
        if (r === "{") {
          this.i++;
        } else {
          this.string = r + "}" + this.string.slice(this.i + 1);
          this.i = 0;
        }
        var p = b.array().With({
          requireClose: true,
          arraydef: {
            rowspacing: (n || "4pt"),
            columnspacing: (t || "1em")
          }
        });
        if (v) {
          p.isCases = true;
        }
        if (s) {
          p.isNumbered = true;
          p.arraydef.side = s;
        }
        if (o || u) {
          p.open = o;
          p.close = u;
        }
        if (l === "D") {
          p.arraydef.displaystyle = true;
        }
        if (q != null) {
          p.arraydef.columnalign = q;
        }
        this.Push(p);
      },
      Entry: function(o) {
        this.Push(b.cell().With({
          isEntry: true,
          name: o
        }));
        if (this.stack.Top().isCases) {
          var n = this.string;
          var r = 0,
              p = this.i,
              l = n.length;
          while (p < l) {
            var s = n.charAt(p);
            if (s === "{") {
              r++;
              p++;
            } else {
              if (s === "}") {
                if (r === 0) {
                  l = 0;
                } else {
                  r--;
                  p++;
                }
              } else {
                if (s === "&" && r === 0) {
                  d.Error(["ExtraAlignTab", "Extra alignment tab in \\cases text"]);
                } else {
                  if (s === "\\") {
                    if (n.substr(p).match(/^((\\cr)[^a-zA-Z]|\\\\)/)) {
                      l = 0;
                    } else {
                      p += 2;
                    }
                  } else {
                    p++;
                  }
                }
              }
            }
          }
          var q = n.substr(this.i, p - this.i);
          if (!q.match(/^\s*\\text[^a-zA-Z]/)) {
            this.Push.apply(this, this.InternalMath(q, 0));
            this.i = p;
          }
        }
      },
      Cr: function(l) {
        this.Push(b.cell().With({
          isCR: true,
          name: l
        }));
      },
      CrLaTeX: function(l) {
        var p;
        if (this.string.charAt(this.i) === "[") {
          p = this.GetBrackets(l, "").replace(/ /g, "").replace(/,/, ".");
          if (p && !this.matchDimen(p)) {
            d.Error(["BracketMustBeDimension", "Bracket argument to %1 must be a dimension", l]);
          }
        }
        this.Push(b.cell().With({
          isCR: true,
          name: l,
          linebreak: true
        }));
        var o = this.stack.Top();
        if (o.isa(b.array)) {
          if (p && o.arraydef.rowspacing) {
            var m = o.arraydef.rowspacing.split(/ /);
            if (!o.rowspacing) {
              o.rowspacing = this.dimen2em(m[0]);
            }
            while (m.length < o.table.length) {
              m.push(this.Em(o.rowspacing));
            }
            m[o.table.length - 1] = this.Em(Math.max(0, o.rowspacing + this.dimen2em(p)));
            o.arraydef.rowspacing = m.join(" ");
          }
        } else {
          if (p) {
            this.Push(h.mspace().With({depth: p}));
          }
          this.Push(h.mspace().With({linebreak: h.LINEBREAK.NEWLINE}));
        }
      },
      emPerInch: 7.2,
      pxPerInch: 72,
      matchDimen: function(l) {
        return l.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(px|pt|em|ex|mu|pc|in|mm|cm)$/);
      },
      dimen2em: function(p) {
        var n = this.matchDimen(p);
        var l = parseFloat(n[1] || "1"),
            o = n[2];
        if (o === "em") {
          return l;
        }
        if (o === "ex") {
          return l * 0.43;
        }
        if (o === "pt") {
          return l / 10;
        }
        if (o === "pc") {
          return l * 1.2;
        }
        if (o === "px") {
          return l * this.emPerInch / this.pxPerInch;
        }
        if (o === "in") {
          return l * this.emPerInch;
        }
        if (o === "cm") {
          return l * this.emPerInch / 2.54;
        }
        if (o === "mm") {
          return l * this.emPerInch / 25.4;
        }
        if (o === "mu") {
          return l / 18;
        }
        return 0;
      },
      Em: function(l) {
        if (Math.abs(l) < 0.0006) {
          return "0em";
        }
        return l.toFixed(3).replace(/\.?0+$/, "") + "em";
      },
      HLine: function(m, n) {
        if (n == null) {
          n = "solid";
        }
        var o = this.stack.Top();
        if (!o.isa(b.array) || o.data.length) {
          d.Error(["Misplaced", "Misplaced %1", m]);
        }
        if (o.table.length == 0) {
          o.frame.push("top");
        } else {
          var l = (o.arraydef.rowlines ? o.arraydef.rowlines.split(/ /) : []);
          while (l.length < o.table.length) {
            l.push("none");
          }
          l[o.table.length - 1] = n;
          o.arraydef.rowlines = l.join(" ");
        }
      },
      HFill: function(l) {
        var m = this.stack.Top();
        if (m.isa(b.array)) {
          m.hfill.push(m.data.length);
        } else {
          d.Error(["UnsupportedHFill", "Unsupported use of %1", l]);
        }
      },
      BeginEnd: function(n) {
        var o = this.GetArgument(n),
            q = false;
        if (o.match(/^\\end\\/)) {
          q = true;
          o = o.substr(5);
        }
        if (o.match(/\\/i)) {
          d.Error(["InvalidEnv", "Invalid environment name '%1'", o]);
        }
        var p = this.envFindName(o);
        if (!p) {
          d.Error(["UnknownEnv", "Unknown environment '%1'", o]);
        }
        if (!(p instanceof Array)) {
          p = [p];
        }
        var l = (p[1] instanceof Array ? p[1][0] : p[1]);
        var m = b.begin().With({
          name: o,
          end: l,
          parse: this
        });
        if (n === "\\end") {
          if (!q && p[1] instanceof Array && this[p[1][1]]) {
            m = this[p[1][1]].apply(this, [m].concat(p.slice(2)));
          } else {
            m = b.end().With({name: o});
          }
        } else {
          if (++this.macroCount > d.config.MAXMACROS) {
            d.Error(["MaxMacroSub2", "MathJax maximum substitution count exceeded; is there a recursive latex environment?"]);
          }
          if (p[0] && this[p[0]]) {
            m = this[p[0]].apply(this, [m].concat(p.slice(2)));
          }
        }
        this.Push(m);
      },
      envFindName: function(l) {
        return f.environment[l];
      },
      Equation: function(l, m) {
        return m;
      },
      ExtensionEnv: function(m, l) {
        this.Extension(m.name, l, "environment");
      },
      Array: function(m, o, t, r, s, n, l, p) {
        if (!r) {
          r = this.GetArgument("\\begin{" + m.name + "}");
        }
        var u = ("c" + r).replace(/[^clr|:]/g, "").replace(/[^|:]([|:])+/g, "$1");
        r = r.replace(/[^clr]/g, "").split("").join(" ");
        r = r.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
        var q = b.array().With({arraydef: {
            columnalign: r,
            columnspacing: (s || "1em"),
            rowspacing: (n || "4pt")
          }});
        if (u.match(/[|:]/)) {
          if (u.charAt(0).match(/[|:]/)) {
            q.frame.push("left");
            q.frame.dashed = u.charAt(0) === ":";
          }
          if (u.charAt(u.length - 1).match(/[|:]/)) {
            q.frame.push("right");
          }
          u = u.substr(1, u.length - 2);
          q.arraydef.columnlines = u.split("").join(" ").replace(/[^|: ]/g, "none").replace(/\|/g, "solid").replace(/:/g, "dashed");
        }
        if (o) {
          q.open = this.convertDelimiter(o);
        }
        if (t) {
          q.close = this.convertDelimiter(t);
        }
        if (l === "D") {
          q.arraydef.displaystyle = true;
        } else {
          if (l) {
            q.arraydef.displaystyle = false;
          }
        }
        if (l === "S") {
          q.arraydef.scriptlevel = 1;
        }
        if (p) {
          q.arraydef.useHeight = false;
        }
        this.Push(m);
        return q;
      },
      AlignedArray: function(l) {
        var m = this.GetBrackets("\\begin{" + l.name + "}");
        return this.setArrayAlign(this.Array.apply(this, arguments), m);
      },
      setArrayAlign: function(m, l) {
        l = this.trimSpaces(l || "");
        if (l === "t") {
          m.arraydef.align = "baseline 1";
        } else {
          if (l === "b") {
            m.arraydef.align = "baseline -1";
          } else {
            if (l === "c") {
              m.arraydef.align = "center";
            } else {
              if (l) {
                m.arraydef.align = l;
              }
            }
          }
        }
        return m;
      },
      convertDelimiter: function(l) {
        if (l) {
          l = f.delimiter[l];
        }
        if (l == null) {
          return null;
        }
        if (l instanceof Array) {
          l = l[0];
        }
        if (l.length === 4) {
          l = String.fromCharCode(parseInt(l, 16));
        }
        return l;
      },
      trimSpaces: function(l) {
        if (typeof(l) != "string") {
          return l;
        }
        return l.replace(/^\s+|\s+$/g, "");
      },
      nextIsSpace: function() {
        return this.string.charAt(this.i).match(/\s/);
      },
      GetNext: function() {
        while (this.nextIsSpace()) {
          this.i++;
        }
        return this.string.charAt(this.i);
      },
      GetCS: function() {
        var l = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
        if (l) {
          this.i += l[1].length;
          return l[1];
        } else {
          this.i++;
          return " ";
        }
      },
      GetArgument: function(m, n) {
        switch (this.GetNext()) {
          case "":
            if (!n) {
              d.Error(["MissingArgFor", "Missing argument for %1", m]);
            }
            return null;
          case "}":
            if (!n) {
              d.Error(["ExtraCloseMissingOpen", "Extra close brace or missing open brace"]);
            }
            return null;
          case "\\":
            this.i++;
            return "\\" + this.GetCS();
          case "{":
            var l = ++this.i,
                o = 1;
            while (this.i < this.string.length) {
              switch (this.string.charAt(this.i++)) {
                case "\\":
                  this.i++;
                  break;
                case "{":
                  o++;
                  break;
                case "}":
                  if (--o == 0) {
                    return this.string.slice(l, this.i - 1);
                  }
                  break;
              }
            }
            d.Error(["MissingCloseBrace", "Missing close brace"]);
            break;
        }
        return this.string.charAt(this.i++);
      },
      GetBrackets: function(m, o) {
        if (this.GetNext() != "[") {
          return o;
        }
        var l = ++this.i,
            n = 0;
        while (this.i < this.string.length) {
          switch (this.string.charAt(this.i++)) {
            case "{":
              n++;
              break;
            case "\\":
              this.i++;
              break;
            case "}":
              if (n-- <= 0) {
                d.Error(["ExtraCloseLooking", "Extra close brace while looking for %1", "']'"]);
              }
              break;
            case "]":
              if (n == 0) {
                return this.string.slice(l, this.i - 1);
              }
              break;
          }
        }
        d.Error(["MissingCloseBracket", "Couldn't find closing ']' for argument to %1", m]);
      },
      GetDelimiter: function(l, m) {
        while (this.nextIsSpace()) {
          this.i++;
        }
        var n = this.string.charAt(this.i);
        this.i++;
        if (this.i <= this.string.length) {
          if (n == "\\") {
            n += this.GetCS(l);
          } else {
            if (n === "{" && m) {
              this.i--;
              n = this.GetArgument(l);
            }
          }
          if (f.delimiter[n] != null) {
            return this.convertDelimiter(n);
          }
        }
        d.Error(["MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", l]);
      },
      GetDimen: function(m) {
        var n;
        if (this.nextIsSpace()) {
          this.i++;
        }
        if (this.string.charAt(this.i) == "{") {
          n = this.GetArgument(m);
          if (n.match(/^\s*([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/)) {
            return n.replace(/ /g, "").replace(/,/, ".");
          }
        } else {
          n = this.string.slice(this.i);
          var l = n.match(/^\s*(([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);
          if (l) {
            this.i += l[0].length;
            return l[1].replace(/ /g, "").replace(/,/, ".");
          }
        }
        d.Error(["MissingDimOrUnits", "Missing dimension or its units for %1", m]);
      },
      GetUpTo: function(n, o) {
        while (this.nextIsSpace()) {
          this.i++;
        }
        var m = this.i,
            l,
            q,
            p = 0;
        while (this.i < this.string.length) {
          l = this.i;
          q = this.string.charAt(this.i++);
          switch (q) {
            case "\\":
              q += this.GetCS();
              break;
            case "{":
              p++;
              break;
            case "}":
              if (p == 0) {
                d.Error(["ExtraCloseLooking", "Extra close brace while looking for %1", o]);
              }
              p--;
              break;
          }
          if (p == 0 && q == o) {
            return this.string.slice(m, l);
          }
        }
        d.Error(["TokenNotFoundForCommand", "Couldn't find %1 for %2", o, n]);
      },
      ParseArg: function(l) {
        return d.Parse(this.GetArgument(l), this.stack.env).mml();
      },
      ParseUpTo: function(l, m) {
        return d.Parse(this.GetUpTo(l, m), this.stack.env).mml();
      },
      InternalMath: function(u, l) {
        var n = (this.stack.env.font ? {mathvariant: this.stack.env.font} : {});
        var m = [],
            q = 0,
            p = 0,
            t,
            r = "",
            o = 0;
        if (u.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
          while (q < u.length) {
            t = u.charAt(q++);
            if (t === "$") {
              if (r === "$" && o === 0) {
                m.push(h.TeXAtom(d.Parse(u.slice(p, q - 1), {}).mml()));
                r = "";
                p = q;
              } else {
                if (r === "") {
                  if (p < q - 1) {
                    m.push(this.InternalText(u.slice(p, q - 1), n));
                  }
                  r = "$";
                  p = q;
                }
              }
            } else {
              if (t === "{" && r !== "") {
                o++;
              } else {
                if (t === "}") {
                  if (r === "}" && o === 0) {
                    m.push(h.TeXAtom(d.Parse(u.slice(p, q), {}).mml().With(n)));
                    r = "";
                    p = q;
                  } else {
                    if (r !== "") {
                      if (o) {
                        o--;
                      }
                    }
                  }
                } else {
                  if (t === "\\") {
                    if (r === "" && u.substr(q).match(/^(eq)?ref\s*\{/)) {
                      var s = RegExp["$&"].length;
                      if (p < q - 1) {
                        m.push(this.InternalText(u.slice(p, q - 1), n));
                      }
                      r = "}";
                      p = q - 1;
                      q += s;
                    } else {
                      t = u.charAt(q++);
                      if (t === "(" && r === "") {
                        if (p < q - 2) {
                          m.push(this.InternalText(u.slice(p, q - 2), n));
                        }
                        r = ")";
                        p = q;
                      } else {
                        if (t === ")" && r === ")" && o === 0) {
                          m.push(h.TeXAtom(d.Parse(u.slice(p, q - 2), {}).mml()));
                          r = "";
                          p = q;
                        } else {
                          if (t.match(/[${}\\]/) && r === "") {
                            q--;
                            u = u.substr(0, q - 1) + u.substr(q);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (r !== "") {
            d.Error(["MathNotTerminated", "Math not terminated in text box"]);
          }
        }
        if (p < u.length) {
          m.push(this.InternalText(u.slice(p), n));
        }
        if (l != null) {
          m = [h.mstyle.apply(h, m).With({
            displaystyle: false,
            scriptlevel: l
          })];
        } else {
          if (m.length > 1) {
            m = [h.mrow.apply(h, m)];
          }
        }
        return m;
      },
      InternalText: function(m, l) {
        m = m.replace(/^\s+/, g).replace(/\s+$/, g);
        return h.mtext(h.chars(m)).With(l);
      },
      SubstituteArgs: function(m, l) {
        var p = "";
        var o = "";
        var q;
        var n = 0;
        while (n < l.length) {
          q = l.charAt(n++);
          if (q === "\\") {
            p += q + l.charAt(n++);
          } else {
            if (q === "#") {
              q = l.charAt(n++);
              if (q === "#") {
                p += q;
              } else {
                if (!q.match(/[1-9]/) || q > m.length) {
                  d.Error(["IllegalMacroParam", "Illegal macro parameter reference"]);
                }
                o = this.AddArgs(this.AddArgs(o, p), m[q - 1]);
                p = "";
              }
            } else {
              p += q;
            }
          }
        }
        return this.AddArgs(o, p);
      },
      AddArgs: function(m, l) {
        if (l.match(/^[a-z]/i) && m.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {
          m += " ";
        }
        if (m.length + l.length > d.config.MAXBUFFER) {
          d.Error(["MaxBufferSize", "MathJax internal buffer size exceeded; is there a recursive macro call?"]);
        }
        return m + l;
      }
    });
    d.Augment({
      Stack: e,
      Parse: a,
      Definitions: f,
      Startup: k,
      config: {
        MAXMACROS: 10000,
        MAXBUFFER: 5 * 1024
      },
      sourceMenuTitle: ["TeXCommands", "TeX Commands"],
      annotationEncoding: "application/x-tex",
      prefilterHooks: MathJax.Callback.Hooks(true),
      postfilterHooks: MathJax.Callback.Hooks(true),
      Config: function() {
        this.SUPER(arguments).Config.apply(this, arguments);
        if (this.config.equationNumbers.autoNumber !== "none") {
          if (!this.config.extensions) {
            this.config.extensions = [];
          }
          this.config.extensions.push("AMSmath.js");
        }
      },
      Translate: function(l) {
        var m,
            n = false,
            p = MathJax.HTML.getScript(l);
        var r = (l.type.replace(/\n/g, " ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null);
        var q = {
          math: p,
          display: r,
          script: l
        };
        var s = this.prefilterHooks.Execute(q);
        if (s) {
          return s;
        }
        p = q.math;
        try {
          m = d.Parse(p).mml();
        } catch (o) {
          if (!o.texError) {
            throw o;
          }
          m = this.formatError(o, p, r, l);
          n = true;
        }
        if (m.isa(h.mtable) && m.displaystyle === "inherit") {
          m.displaystyle = r;
        }
        if (m.inferred) {
          m = h.apply(MathJax.ElementJax, m.data);
        } else {
          m = h(m);
        }
        if (r) {
          m.root.display = "block";
        }
        if (n) {
          m.texError = true;
        }
        q.math = m;
        return this.postfilterHooks.Execute(q) || q.math;
      },
      prefilterMath: function(m, n, l) {
        return m;
      },
      postfilterMath: function(m, n, l) {
        this.combineRelations(m.root);
        return m;
      },
      formatError: function(o, n, p, l) {
        var m = o.message.replace(/\n.*/, "");
        c.signal.Post(["TeX Jax - parse error", m, n, p, l]);
        return h.Error(m);
      },
      Error: function(l) {
        if (l instanceof Array) {
          l = j.apply(j, l);
        }
        throw c.Insert(Error(l), {texError: true});
      },
      Macro: function(l, m, n) {
        f.macros[l] = ["Macro"].concat([].slice.call(arguments, 1));
        f.macros[l].isUser = true;
      },
      fenced: function(n, m, o) {
        var l = h.mrow().With({
          open: n,
          close: o,
          texClass: h.TEXCLASS.INNER
        });
        l.Append(h.mo(n).With({
          fence: true,
          stretchy: true,
          texClass: h.TEXCLASS.OPEN
        }));
        if (m.type === "mrow") {
          l.Append.apply(l, m.data);
        } else {
          l.Append(m);
        }
        l.Append(h.mo(o).With({
          fence: true,
          stretchy: true,
          texClass: h.TEXCLASS.CLOSE
        }));
        return l;
      },
      fixedFence: function(n, m, o) {
        var l = h.mrow().With({
          open: n,
          close: o,
          texClass: h.TEXCLASS.ORD
        });
        if (n) {
          l.Append(this.mathPalette(n, "l"));
        }
        if (m.type === "mrow") {
          l.Append.apply(l, m.data);
        } else {
          l.Append(m);
        }
        if (o) {
          l.Append(this.mathPalette(o, "r"));
        }
        return l;
      },
      mathPalette: function(o, m) {
        if (o === "{" || o === "}") {
          o = "\\" + o;
        }
        var n = "{\\bigg" + m + " " + o + "}",
            l = "{\\big" + m + " " + o + "}";
        return d.Parse("\\mathchoice" + n + l + l + l, {}).mml();
      },
      combineRelations: function(p) {
        var q,
            l,
            o,
            n;
        for (q = 0, l = p.data.length; q < l; q++) {
          if (p.data[q]) {
            if (p.isa(h.mrow)) {
              while (q + 1 < l && (o = p.data[q]) && (n = p.data[q + 1]) && o.isa(h.mo) && n.isa(h.mo) && o.Get("texClass") === h.TEXCLASS.REL && n.Get("texClass") === h.TEXCLASS.REL) {
                if (o.variantForm == n.variantForm && o.Get("mathvariant") == n.Get("mathvariant") && o.style == n.style && o["class"] == n["class"] && !o.id && !n.id) {
                  o.Append.apply(o, n.data);
                  p.data.splice(q + 1, 1);
                  l--;
                } else {
                  o.rspace = n.lspace = "0pt";
                  q++;
                }
              }
            }
            if (!p.data[q].isToken) {
              this.combineRelations(p.data[q]);
            }
          }
        }
      }
    });
    d.prefilterHooks.Add(function(l) {
      l.math = d.prefilterMath(l.math, l.display, l.script);
    });
    d.postfilterHooks.Add(function(l) {
      l.math = d.postfilterMath(l.math, l.display, l.script);
    });
    d.loadComplete("jax.js");
  })(MathJax.InputJax.TeX, MathJax.Hub, MathJax.Ajax);
  MathJax.Extension["TeX/AMSmath"] = {
    version: "2.6.1",
    number: 0,
    startNumber: 0,
    IDs: {},
    eqIDs: {},
    labels: {},
    eqlabels: {},
    refs: []
  };
  MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
    var b = MathJax.ElementJax.mml,
        g = MathJax.InputJax.TeX,
        f = MathJax.Extension["TeX/AMSmath"];
    var d = g.Definitions,
        e = g.Stack.Item,
        a = g.config.equationNumbers;
    var c = function(j) {
      var l = [];
      for (var k = 0,
          h = j.length; k < h; k++) {
        l[k] = g.Parse.prototype.Em(j[k]);
      }
      return l.join(" ");
    };
    d.Add({
      mathchar0mo: {iiiint: ["2A0C", {texClass: b.TEXCLASS.OP}]},
      macros: {
        mathring: ["Accent", "2DA"],
        nobreakspace: "Tilde",
        negmedspace: ["Spacer", b.LENGTH.NEGATIVEMEDIUMMATHSPACE],
        negthickspace: ["Spacer", b.LENGTH.NEGATIVETHICKMATHSPACE],
        idotsint: ["MultiIntegral", "\\int\\cdots\\int"],
        dddot: ["Accent", "20DB"],
        ddddot: ["Accent", "20DC"],
        sideset: ["Macro", "\\mathop{\\mathop{\\rlap{\\phantom{#3}}}\\nolimits#1\\!\\mathop{#3}\\nolimits#2}", 3],
        boxed: ["Macro", "\\fbox{$\\displaystyle{#1}$}", 1],
        tag: "HandleTag",
        notag: "HandleNoTag",
        label: "HandleLabel",
        ref: "HandleRef",
        eqref: ["HandleRef", true],
        substack: ["Macro", "\\begin{subarray}{c}#1\\end{subarray}", 1],
        injlim: ["NamedOp", "inj&thinsp;lim"],
        projlim: ["NamedOp", "proj&thinsp;lim"],
        varliminf: ["Macro", "\\mathop{\\underline{\\mmlToken{mi}{lim}}}"],
        varlimsup: ["Macro", "\\mathop{\\overline{\\mmlToken{mi}{lim}}}"],
        varinjlim: ["Macro", "\\mathop{\\underrightarrow{\\mmlToken{mi}{lim}}}"],
        varprojlim: ["Macro", "\\mathop{\\underleftarrow{\\mmlToken{mi}{lim}}}"],
        DeclareMathOperator: "HandleDeclareOp",
        operatorname: "HandleOperatorName",
        SkipLimits: "SkipLimits",
        genfrac: "Genfrac",
        frac: ["Genfrac", "", "", "", ""],
        tfrac: ["Genfrac", "", "", "", 1],
        dfrac: ["Genfrac", "", "", "", 0],
        binom: ["Genfrac", "(", ")", "0", ""],
        tbinom: ["Genfrac", "(", ")", "0", 1],
        dbinom: ["Genfrac", "(", ")", "0", 0],
        cfrac: "CFrac",
        shoveleft: ["HandleShove", b.ALIGN.LEFT],
        shoveright: ["HandleShove", b.ALIGN.RIGHT],
        xrightarrow: ["xArrow", 8594, 5, 6],
        xleftarrow: ["xArrow", 8592, 7, 3]
      },
      environment: {
        align: ["AMSarray", null, true, true, "rlrlrlrlrlrl", c([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0])],
        "align*": ["AMSarray", null, false, true, "rlrlrlrlrlrl", c([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0])],
        multline: ["Multline", null, true],
        "multline*": ["Multline", null, false],
        split: ["AMSarray", null, false, false, "rl", c([0])],
        gather: ["AMSarray", null, true, true, "c"],
        "gather*": ["AMSarray", null, false, true, "c"],
        alignat: ["AlignAt", null, true, true],
        "alignat*": ["AlignAt", null, false, true],
        alignedat: ["AlignAt", null, false, false],
        aligned: ["AlignedAMSArray", null, null, null, "rlrlrlrlrlrl", c([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0]), ".5em", "D"],
        gathered: ["AlignedAMSArray", null, null, null, "c", null, ".5em", "D"],
        subarray: ["Array", null, null, null, null, c([0]), "0.1em", "S", 1],
        smallmatrix: ["Array", null, null, null, "c", c([1 / 3]), ".2em", "S", 1],
        equation: ["EquationBegin", "Equation", true],
        "equation*": ["EquationBegin", "EquationStar", false],
        eqnarray: ["AMSarray", null, true, true, "rcl", "0 " + b.LENGTH.THICKMATHSPACE, ".5em"],
        "eqnarray*": ["AMSarray", null, false, true, "rcl", "0 " + b.LENGTH.THICKMATHSPACE, ".5em"]
      },
      delimiter: {
        "\\lvert": ["2223", {texClass: b.TEXCLASS.OPEN}],
        "\\rvert": ["2223", {texClass: b.TEXCLASS.CLOSE}],
        "\\lVert": ["2225", {texClass: b.TEXCLASS.OPEN}],
        "\\rVert": ["2225", {texClass: b.TEXCLASS.CLOSE}]
      }
    }, null, true);
    g.Parse.Augment({
      HandleTag: function(j) {
        var l = this.GetStar();
        var i = this.trimSpaces(this.GetArgument(j)),
            h = i;
        if (!l) {
          i = a.formatTag(i);
        }
        var k = this.stack.global;
        k.tagID = h;
        if (k.notags) {
          g.Error(["CommandNotAllowedInEnv", "%1 not allowed in %2 environment", j, k.notags]);
        }
        if (k.tag) {
          g.Error(["MultipleCommand", "Multiple %1", j]);
        }
        k.tag = b.mtd.apply(b, this.InternalMath(i)).With({id: a.formatID(h)});
      },
      HandleNoTag: function(h) {
        if (this.stack.global.tag) {
          delete this.stack.global.tag;
        }
        this.stack.global.notag = true;
      },
      HandleLabel: function(i) {
        var j = this.stack.global,
            h = this.GetArgument(i);
        if (h === "") {
          return;
        }
        if (!f.refUpdate) {
          if (j.label) {
            g.Error(["MultipleCommand", "Multiple %1", i]);
          }
          j.label = h;
          if (f.labels[h] || f.eqlabels[h]) {
            g.Error(["MultipleLabel", "Label '%1' multiply defined", h]);
          }
          f.eqlabels[h] = {
            tag: "???",
            id: ""
          };
        }
      },
      HandleRef: function(j, l) {
        var i = this.GetArgument(j);
        var k = f.labels[i] || f.eqlabels[i];
        if (!k) {
          k = {
            tag: "???",
            id: ""
          };
          f.badref = !f.refUpdate;
        }
        var h = k.tag;
        if (l) {
          h = a.formatTag(h);
        }
        this.Push(b.mrow.apply(b, this.InternalMath(h)).With({
          href: a.formatURL(k.id),
          "class": "MathJax_ref"
        }));
      },
      HandleDeclareOp: function(i) {
        var h = (this.GetStar() ? "" : "\\nolimits\\SkipLimits");
        var j = this.trimSpaces(this.GetArgument(i));
        if (j.charAt(0) == "\\") {
          j = j.substr(1);
        }
        var k = this.GetArgument(i);
        k = k.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}");
        g.Definitions.macros[j] = ["Macro", "\\mathop{\\rm " + k + "}" + h];
      },
      HandleOperatorName: function(i) {
        var h = (this.GetStar() ? "" : "\\nolimits\\SkipLimits");
        var j = this.trimSpaces(this.GetArgument(i));
        j = j.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}");
        this.string = "\\mathop{\\rm " + j + "}" + h + " " + this.string.slice(this.i);
        this.i = 0;
      },
      SkipLimits: function(h) {
        var k = this.GetNext(),
            j = this.i;
        if (k === "\\" && ++this.i && this.GetCS() !== "limits") {
          this.i = j;
        }
      },
      HandleShove: function(i, h) {
        var j = this.stack.Top();
        if (j.type !== "multline" || j.data.length) {
          g.Error(["CommandAtTheBeginingOfLine", "%1 must come at the beginning of the line", i]);
        }
        j.data.shove = h;
      },
      CFrac: function(k) {
        var h = this.trimSpaces(this.GetBrackets(k, "")),
            j = this.GetArgument(k),
            l = this.GetArgument(k);
        var i = b.mfrac(g.Parse("\\strut\\textstyle{" + j + "}", this.stack.env).mml(), g.Parse("\\strut\\textstyle{" + l + "}", this.stack.env).mml());
        h = ({
          l: b.ALIGN.LEFT,
          r: b.ALIGN.RIGHT,
          "": ""
        })[h];
        if (h == null) {
          g.Error(["IllegalAlign", "Illegal alignment specified in %1", k]);
        }
        if (h) {
          i.numalign = i.denomalign = h;
        }
        this.Push(i);
      },
      Genfrac: function(i, k, p, m, h) {
        if (k == null) {
          k = this.GetDelimiterArg(i);
        }
        if (p == null) {
          p = this.GetDelimiterArg(i);
        }
        if (m == null) {
          m = this.GetArgument(i);
        }
        if (h == null) {
          h = this.trimSpaces(this.GetArgument(i));
        }
        var l = this.ParseArg(i);
        var o = this.ParseArg(i);
        var j = b.mfrac(l, o);
        if (m !== "") {
          j.linethickness = m;
        }
        if (k || p) {
          j = g.fixedFence(k, j.With({texWithDelims: true}), p);
        }
        if (h !== "") {
          var n = (["D", "T", "S", "SS"])[h];
          if (n == null) {
            g.Error(["BadMathStyleFor", "Bad math style for %1", i]);
          }
          j = b.mstyle(j);
          if (n === "D") {
            j.displaystyle = true;
            j.scriptlevel = 0;
          } else {
            j.displaystyle = false;
            j.scriptlevel = h - 1;
          }
        }
        this.Push(j);
      },
      Multline: function(i, h) {
        this.Push(i);
        this.checkEqnEnv();
        return e.multline(h, this.stack).With({arraydef: {
            displaystyle: true,
            rowspacing: ".5em",
            width: g.config.MultLineWidth,
            columnwidth: "100%",
            side: g.config.TagSide,
            minlabelspacing: g.config.TagIndent
          }});
      },
      AMSarray: function(j, i, h, l, k) {
        this.Push(j);
        if (h) {
          this.checkEqnEnv();
        }
        l = l.replace(/[^clr]/g, "").split("").join(" ");
        l = l.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
        return e.AMSarray(j.name, i, h, this.stack).With({arraydef: {
            displaystyle: true,
            rowspacing: ".5em",
            columnalign: l,
            columnspacing: (k || "1em"),
            rowspacing: "3pt",
            side: g.config.TagSide,
            minlabelspacing: g.config.TagIndent
          }});
      },
      AlignedAMSArray: function(h) {
        var i = this.GetBrackets("\\begin{" + h.name + "}");
        return this.setArrayAlign(this.AMSarray.apply(this, arguments), i);
      },
      AlignAt: function(k, i, h) {
        var p,
            j,
            o = "",
            m = [];
        if (!h) {
          j = this.GetBrackets("\\begin{" + k.name + "}");
        }
        p = this.GetArgument("\\begin{" + k.name + "}");
        if (p.match(/[^0-9]/)) {
          g.Error(["PositiveIntegerArg", "Argument to %1 must me a positive integer", "\\begin{" + k.name + "}"]);
        }
        while (p > 0) {
          o += "rl";
          m.push("0em 0em");
          p--;
        }
        m = m.join(" ");
        if (h) {
          return this.AMSarray(k, i, h, o, m);
        }
        var l = this.AMSarray(k, i, h, o, m);
        return this.setArrayAlign(l, j);
      },
      EquationBegin: function(h, i) {
        this.checkEqnEnv();
        this.stack.global.forcetag = (i && a.autoNumber !== "none");
        return h;
      },
      EquationStar: function(h, i) {
        this.stack.global.tagged = true;
        return i;
      },
      checkEqnEnv: function() {
        if (this.stack.global.eqnenv) {
          g.Error(["ErroneousNestingEq", "Erroneous nesting of equation structures"]);
        }
        this.stack.global.eqnenv = true;
      },
      MultiIntegral: function(h, l) {
        var k = this.GetNext();
        if (k === "\\") {
          var j = this.i;
          k = this.GetArgument(h);
          this.i = j;
          if (k === "\\limits") {
            if (h === "\\idotsint") {
              l = "\\!\\!\\mathop{\\,\\," + l + "}";
            } else {
              l = "\\!\\!\\!\\mathop{\\,\\,\\," + l + "}";
            }
          }
        }
        this.string = l + " " + this.string.slice(this.i);
        this.i = 0;
      },
      xArrow: function(j, n, m, h) {
        var k = {
          width: "+" + (m + h) + "mu",
          lspace: m + "mu"
        };
        var o = this.GetBrackets(j),
            p = this.ParseArg(j);
        var q = b.mo(b.chars(String.fromCharCode(n))).With({
          stretchy: true,
          texClass: b.TEXCLASS.REL
        });
        var i = b.munderover(q);
        i.SetData(i.over, b.mpadded(p).With(k).With({voffset: ".15em"}));
        if (o) {
          o = g.Parse(o, this.stack.env).mml();
          i.SetData(i.under, b.mpadded(o).With(k).With({voffset: "-.24em"}));
        }
        this.Push(i.With({subsupOK: true}));
      },
      GetDelimiterArg: function(h) {
        var i = this.trimSpaces(this.GetArgument(h));
        if (i == "") {
          return null;
        }
        if (i in d.delimiter) {
          return i;
        }
        g.Error(["MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", h]);
      },
      GetStar: function() {
        var h = (this.GetNext() === "*");
        if (h) {
          this.i++;
        }
        return h;
      }
    });
    e.Augment({
      autoTag: function() {
        var i = this.global;
        if (!i.notag) {
          f.number++;
          i.tagID = a.formatNumber(f.number.toString());
          var h = g.Parse("\\text{" + a.formatTag(i.tagID) + "}", {}).mml();
          i.tag = b.mtd(h).With({id: a.formatID(i.tagID)});
        }
      },
      getTag: function() {
        var l = this.global,
            j = l.tag;
        l.tagged = true;
        if (l.label) {
          if (a.useLabelIds) {
            j.id = a.formatID(l.label);
          }
          f.eqlabels[l.label] = {
            tag: l.tagID,
            id: j.id
          };
        }
        if (document.getElementById(j.id) || f.IDs[j.id] || f.eqIDs[j.id]) {
          var k = 0,
              h;
          do {
            k++;
            h = j.id + "_" + k;
          } while (document.getElementById(h) || f.IDs[h] || f.eqIDs[h]);
          j.id = h;
          if (l.label) {
            f.eqlabels[l.label].id = h;
          }
        }
        f.eqIDs[j.id] = 1;
        this.clearTag();
        return j;
      },
      clearTag: function() {
        var h = this.global;
        delete h.tag;
        delete h.tagID;
        delete h.label;
      },
      fixInitialMO: function(k) {
        for (var j = 0,
            h = k.length; j < h; j++) {
          if (k[j] && (k[j].type !== "mspace" && (k[j].type !== "texatom" || (k[j].data[0] && k[j].data[0].data.length)))) {
            if (k[j].isEmbellished()) {
              k.unshift(b.mi());
            }
            break;
          }
        }
      }
    });
    e.multline = e.array.Subclass({
      type: "multline",
      Init: function(i, h) {
        this.SUPER(arguments).Init.apply(this);
        this.numbered = (i && a.autoNumber !== "none");
        this.save = {notag: h.global.notag};
        h.global.tagged = !i && !h.global.forcetag;
      },
      EndEntry: function() {
        if (this.table.length) {
          this.fixInitialMO(this.data);
        }
        var h = b.mtd.apply(b, this.data);
        if (this.data.shove) {
          h.columnalign = this.data.shove;
        }
        this.row.push(h);
        this.data = [];
      },
      EndRow: function() {
        if (this.row.length != 1) {
          g.Error(["MultlineRowsOneCol", "The rows within the %1 environment must have exactly one column", "multline"]);
        }
        this.table.push(this.row);
        this.row = [];
      },
      EndTable: function() {
        this.SUPER(arguments).EndTable.call(this);
        if (this.table.length) {
          var j = this.table.length - 1,
              l,
              k = -1;
          if (!this.table[0][0].columnalign) {
            this.table[0][0].columnalign = b.ALIGN.LEFT;
          }
          if (!this.table[j][0].columnalign) {
            this.table[j][0].columnalign = b.ALIGN.RIGHT;
          }
          if (!this.global.tag && this.numbered) {
            this.autoTag();
          }
          if (this.global.tag && !this.global.notags) {
            k = (this.arraydef.side === "left" ? 0 : this.table.length - 1);
            this.table[k] = [this.getTag()].concat(this.table[k]);
          }
          for (l = 0, j = this.table.length; l < j; l++) {
            var h = (l === k ? b.mlabeledtr : b.mtr);
            this.table[l] = h.apply(b, this.table[l]);
          }
        }
        this.global.notag = this.save.notag;
      }
    });
    e.AMSarray = e.array.Subclass({
      type: "AMSarray",
      Init: function(k, j, i, h) {
        this.SUPER(arguments).Init.apply(this);
        this.numbered = (j && a.autoNumber !== "none");
        this.save = {
          notags: h.global.notags,
          notag: h.global.notag
        };
        h.global.notags = (i ? null : k);
        h.global.tagged = !j && !h.global.forcetag;
      },
      EndEntry: function() {
        if (this.row.length) {
          this.fixInitialMO(this.data);
        }
        this.row.push(b.mtd.apply(b, this.data));
        this.data = [];
      },
      EndRow: function() {
        var h = b.mtr;
        if (!this.global.tag && this.numbered) {
          this.autoTag();
        }
        if (this.global.tag && !this.global.notags) {
          this.row = [this.getTag()].concat(this.row);
          h = b.mlabeledtr;
        } else {
          this.clearTag();
        }
        if (this.numbered) {
          delete this.global.notag;
        }
        this.table.push(h.apply(b, this.row));
        this.row = [];
      },
      EndTable: function() {
        this.SUPER(arguments).EndTable.call(this);
        this.global.notags = this.save.notags;
        this.global.notag = this.save.notag;
      }
    });
    e.start.Augment({
      oldCheckItem: e.start.prototype.checkItem,
      checkItem: function(j) {
        if (j.type === "stop") {
          var h = this.mmlData(),
              i = this.global;
          if (f.display && !i.tag && !i.tagged && !i.isInner && (a.autoNumber === "all" || i.forcetag)) {
            this.autoTag();
          }
          if (i.tag) {
            var l = [this.getTag(), b.mtd(h)];
            var k = {
              side: g.config.TagSide,
              minlabelspacing: g.config.TagIndent,
              displaystyle: "inherit"
            };
            h = b.mtable(b.mlabeledtr.apply(b, l)).With(k);
          }
          return e.mml(h);
        }
        return this.oldCheckItem.call(this, j);
      }
    });
    g.prefilterHooks.Add(function(h) {
      f.display = h.display;
      f.number = f.startNumber;
      f.eqlabels = f.eqIDs = {};
      f.badref = false;
      if (f.refUpdate) {
        f.number = h.script.MathJax.startNumber;
      }
    });
    g.postfilterHooks.Add(function(h) {
      h.script.MathJax.startNumber = f.startNumber;
      f.startNumber = f.number;
      MathJax.Hub.Insert(f.IDs, f.eqIDs);
      MathJax.Hub.Insert(f.labels, f.eqlabels);
      if (f.badref && !h.math.texError) {
        f.refs.push(h.script);
      }
    }, 100);
    MathJax.Hub.Register.MessageHook("Begin Math Input", function() {
      f.refs = [];
      f.refUpdate = false;
    });
    MathJax.Hub.Register.MessageHook("End Math Input", function(k) {
      if (f.refs.length) {
        f.refUpdate = true;
        for (var j = 0,
            h = f.refs.length; j < h; j++) {
          f.refs[j].MathJax.state = MathJax.ElementJax.STATE.UPDATE;
        }
        return MathJax.Hub.processInput({
          scripts: f.refs,
          start: new Date().getTime(),
          i: 0,
          j: 0,
          jax: {},
          jaxIDs: []
        });
      }
      return null;
    });
    g.resetEquationNumbers = function(i, h) {
      f.startNumber = (i || 0);
      if (!h) {
        f.labels = f.IDs = {};
      }
    };
    MathJax.Hub.Startup.signal.Post("TeX AMSmath Ready");
  });
  MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSmath.js");
  MathJax.Extension["TeX/AMSsymbols"] = {version: "2.6.0"};
  MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
    var a = MathJax.ElementJax.mml,
        b = MathJax.InputJax.TeX.Definitions;
    b.Add({
      mathchar0mi: {
        digamma: "03DD",
        varkappa: "03F0",
        varGamma: ["0393", {mathvariant: a.VARIANT.ITALIC}],
        varDelta: ["0394", {mathvariant: a.VARIANT.ITALIC}],
        varTheta: ["0398", {mathvariant: a.VARIANT.ITALIC}],
        varLambda: ["039B", {mathvariant: a.VARIANT.ITALIC}],
        varXi: ["039E", {mathvariant: a.VARIANT.ITALIC}],
        varPi: ["03A0", {mathvariant: a.VARIANT.ITALIC}],
        varSigma: ["03A3", {mathvariant: a.VARIANT.ITALIC}],
        varUpsilon: ["03A5", {mathvariant: a.VARIANT.ITALIC}],
        varPhi: ["03A6", {mathvariant: a.VARIANT.ITALIC}],
        varPsi: ["03A8", {mathvariant: a.VARIANT.ITALIC}],
        varOmega: ["03A9", {mathvariant: a.VARIANT.ITALIC}],
        beth: "2136",
        gimel: "2137",
        daleth: "2138",
        backprime: ["2035", {variantForm: true}],
        hslash: "210F",
        varnothing: ["2205", {variantForm: true}],
        blacktriangle: "25B4",
        triangledown: ["25BD", {variantForm: true}],
        blacktriangledown: "25BE",
        square: "25FB",
        Box: "25FB",
        blacksquare: "25FC",
        lozenge: "25CA",
        Diamond: "25CA",
        blacklozenge: "29EB",
        circledS: ["24C8", {mathvariant: a.VARIANT.NORMAL}],
        bigstar: "2605",
        sphericalangle: "2222",
        measuredangle: "2221",
        nexists: "2204",
        complement: "2201",
        mho: "2127",
        eth: ["00F0", {mathvariant: a.VARIANT.NORMAL}],
        Finv: "2132",
        diagup: "2571",
        Game: "2141",
        diagdown: "2572",
        Bbbk: ["006B", {mathvariant: a.VARIANT.DOUBLESTRUCK}],
        yen: "00A5",
        circledR: "00AE",
        checkmark: "2713",
        maltese: "2720"
      },
      mathchar0mo: {
        dotplus: "2214",
        ltimes: "22C9",
        smallsetminus: "2216",
        rtimes: "22CA",
        Cap: "22D2",
        doublecap: "22D2",
        leftthreetimes: "22CB",
        Cup: "22D3",
        doublecup: "22D3",
        rightthreetimes: "22CC",
        barwedge: "22BC",
        curlywedge: "22CF",
        veebar: "22BB",
        curlyvee: "22CE",
        doublebarwedge: "2A5E",
        boxminus: "229F",
        circleddash: "229D",
        boxtimes: "22A0",
        circledast: "229B",
        boxdot: "22A1",
        circledcirc: "229A",
        boxplus: "229E",
        centerdot: ["22C5", {variantForm: true}],
        divideontimes: "22C7",
        intercal: "22BA",
        leqq: "2266",
        geqq: "2267",
        leqslant: "2A7D",
        geqslant: "2A7E",
        eqslantless: "2A95",
        eqslantgtr: "2A96",
        lesssim: "2272",
        gtrsim: "2273",
        lessapprox: "2A85",
        gtrapprox: "2A86",
        approxeq: "224A",
        lessdot: "22D6",
        gtrdot: "22D7",
        lll: "22D8",
        llless: "22D8",
        ggg: "22D9",
        gggtr: "22D9",
        lessgtr: "2276",
        gtrless: "2277",
        lesseqgtr: "22DA",
        gtreqless: "22DB",
        lesseqqgtr: "2A8B",
        gtreqqless: "2A8C",
        doteqdot: "2251",
        Doteq: "2251",
        eqcirc: "2256",
        risingdotseq: "2253",
        circeq: "2257",
        fallingdotseq: "2252",
        triangleq: "225C",
        backsim: "223D",
        thicksim: ["223C", {variantForm: true}],
        backsimeq: "22CD",
        thickapprox: ["2248", {variantForm: true}],
        subseteqq: "2AC5",
        supseteqq: "2AC6",
        Subset: "22D0",
        Supset: "22D1",
        sqsubset: "228F",
        sqsupset: "2290",
        preccurlyeq: "227C",
        succcurlyeq: "227D",
        curlyeqprec: "22DE",
        curlyeqsucc: "22DF",
        precsim: "227E",
        succsim: "227F",
        precapprox: "2AB7",
        succapprox: "2AB8",
        vartriangleleft: "22B2",
        lhd: "22B2",
        vartriangleright: "22B3",
        rhd: "22B3",
        trianglelefteq: "22B4",
        unlhd: "22B4",
        trianglerighteq: "22B5",
        unrhd: "22B5",
        vDash: "22A8",
        Vdash: "22A9",
        Vvdash: "22AA",
        smallsmile: ["2323", {variantForm: true}],
        shortmid: ["2223", {variantForm: true}],
        smallfrown: ["2322", {variantForm: true}],
        shortparallel: ["2225", {variantForm: true}],
        bumpeq: "224F",
        between: "226C",
        Bumpeq: "224E",
        pitchfork: "22D4",
        varpropto: "221D",
        backepsilon: "220D",
        blacktriangleleft: "25C2",
        blacktriangleright: "25B8",
        therefore: "2234",
        because: "2235",
        eqsim: "2242",
        vartriangle: ["25B3", {variantForm: true}],
        Join: "22C8",
        nless: "226E",
        ngtr: "226F",
        nleq: "2270",
        ngeq: "2271",
        nleqslant: ["2A87", {variantForm: true}],
        ngeqslant: ["2A88", {variantForm: true}],
        nleqq: ["2270", {variantForm: true}],
        ngeqq: ["2271", {variantForm: true}],
        lneq: "2A87",
        gneq: "2A88",
        lneqq: "2268",
        gneqq: "2269",
        lvertneqq: ["2268", {variantForm: true}],
        gvertneqq: ["2269", {variantForm: true}],
        lnsim: "22E6",
        gnsim: "22E7",
        lnapprox: "2A89",
        gnapprox: "2A8A",
        nprec: "2280",
        nsucc: "2281",
        npreceq: ["22E0", {variantForm: true}],
        nsucceq: ["22E1", {variantForm: true}],
        precneqq: "2AB5",
        succneqq: "2AB6",
        precnsim: "22E8",
        succnsim: "22E9",
        precnapprox: "2AB9",
        succnapprox: "2ABA",
        nsim: "2241",
        ncong: "2246",
        nshortmid: ["2224", {variantForm: true}],
        nshortparallel: ["2226", {variantForm: true}],
        nmid: "2224",
        nparallel: "2226",
        nvdash: "22AC",
        nvDash: "22AD",
        nVdash: "22AE",
        nVDash: "22AF",
        ntriangleleft: "22EA",
        ntriangleright: "22EB",
        ntrianglelefteq: "22EC",
        ntrianglerighteq: "22ED",
        nsubseteq: "2288",
        nsupseteq: "2289",
        nsubseteqq: ["2288", {variantForm: true}],
        nsupseteqq: ["2289", {variantForm: true}],
        subsetneq: "228A",
        supsetneq: "228B",
        varsubsetneq: ["228A", {variantForm: true}],
        varsupsetneq: ["228B", {variantForm: true}],
        subsetneqq: "2ACB",
        supsetneqq: "2ACC",
        varsubsetneqq: ["2ACB", {variantForm: true}],
        varsupsetneqq: ["2ACC", {variantForm: true}],
        leftleftarrows: "21C7",
        rightrightarrows: "21C9",
        leftrightarrows: "21C6",
        rightleftarrows: "21C4",
        Lleftarrow: "21DA",
        Rrightarrow: "21DB",
        twoheadleftarrow: "219E",
        twoheadrightarrow: "21A0",
        leftarrowtail: "21A2",
        rightarrowtail: "21A3",
        looparrowleft: "21AB",
        looparrowright: "21AC",
        leftrightharpoons: "21CB",
        rightleftharpoons: ["21CC", {variantForm: true}],
        curvearrowleft: "21B6",
        curvearrowright: "21B7",
        circlearrowleft: "21BA",
        circlearrowright: "21BB",
        Lsh: "21B0",
        Rsh: "21B1",
        upuparrows: "21C8",
        downdownarrows: "21CA",
        upharpoonleft: "21BF",
        upharpoonright: "21BE",
        downharpoonleft: "21C3",
        restriction: "21BE",
        multimap: "22B8",
        downharpoonright: "21C2",
        leftrightsquigarrow: "21AD",
        rightsquigarrow: "21DD",
        leadsto: "21DD",
        dashrightarrow: "21E2",
        dashleftarrow: "21E0",
        nleftarrow: "219A",
        nrightarrow: "219B",
        nLeftarrow: "21CD",
        nRightarrow: "21CF",
        nleftrightarrow: "21AE",
        nLeftrightarrow: "21CE"
      },
      delimiter: {
        "\\ulcorner": "231C",
        "\\urcorner": "231D",
        "\\llcorner": "231E",
        "\\lrcorner": "231F"
      },
      macros: {
        implies: ["Macro", "\\;\\Longrightarrow\\;"],
        impliedby: ["Macro", "\\;\\Longleftarrow\\;"]
      }
    }, null, true);
    var c = a.mo.OPTYPES.REL;
    MathJax.Hub.Insert(a.mo.prototype, {OPTABLE: {infix: {
          "\u2322": c,
          "\u2323": c,
          "\u25B3": c,
          "\uE006": c,
          "\uE007": c,
          "\uE00C": c,
          "\uE00D": c,
          "\uE00E": c,
          "\uE00F": c,
          "\uE010": c,
          "\uE011": c,
          "\uE016": c,
          "\uE017": c,
          "\uE018": c,
          "\uE019": c,
          "\uE01A": c,
          "\uE01B": c,
          "\uE04B": c,
          "\uE04F": c
        }}});
    MathJax.Hub.Startup.signal.Post("TeX AMSsymbols Ready");
  });
  MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSsymbols.js");
  (function(i, c, f, g) {
    var h;
    var l,
        b,
        d;
    var e = 1,
        p = 0.1,
        j = 0.025,
        a = 0.025;
    var o = {
      ".mjx-chtml": {
        display: "inline-block",
        "line-height": 0,
        "text-indent": 0,
        "text-align": "left",
        "text-transform": "none",
        "font-style": "normal",
        "font-weight": "normal",
        "font-size": "100%",
        "font-size-adjust": "none",
        "letter-spacing": "normal",
        "word-wrap": "normal",
        "word-spacing": "normal",
        "white-space": "nowrap",
        "float": "none",
        direction: "ltr",
        "max-width": "none",
        "max-height": "none",
        "min-width": 0,
        "min-height": 0,
        border: 0,
        margin: 0,
        padding: "1px 0"
      },
      ".MJXc-display": {
        display: "block",
        "text-align": "center",
        margin: "1em 0",
        padding: 0
      },
      ".mjx-chtml[tabindex]:focus, body :focus .mjx-chtml[tabindex]": {display: "inline-table"},
      ".mjx-math": {
        display: "inline-block",
        "border-collapse": "separate",
        "border-spacing": 0
      },
      ".mjx-math *": {
        display: "inline-block",
        "text-align": "left"
      },
      ".mjx-numerator": {
        display: "block",
        "text-align": "center"
      },
      ".mjx-denominator": {
        display: "block",
        "text-align": "center"
      },
      ".MJXc-stacked": {
        height: 0,
        position: "relative"
      },
      ".MJXc-stacked > *": {position: "absolute"},
      ".MJXc-bevelled > *": {display: "inline-block"},
      ".mjx-stack": {display: "inline-block"},
      ".mjx-op": {display: "block"},
      ".mjx-under": {display: "table-cell"},
      ".mjx-over": {display: "block"},
      ".mjx-over > *": {
        "padding-left": "0px!important",
        "padding-right": "0px!important"
      },
      ".mjx-under > *": {
        "padding-left": "0px!important",
        "padding-right": "0px!important"
      },
      ".mjx-stack > .mjx-sup": {display: "block"},
      ".mjx-stack > .mjx-sub": {display: "block"},
      ".mjx-prestack > .mjx-presup": {display: "block"},
      ".mjx-prestack > .mjx-presub": {display: "block"},
      ".mjx-delim-h > .mjx-char": {display: "inline-block"},
      ".mjx-surd": {"vertical-align": "top"},
      ".mjx-mphantom *": {visibility: "hidden"},
      ".mjx-merror": {
        "background-color": "#FFFF88",
        color: "#CC0000",
        border: "1px solid #CC0000",
        padding: "2px 3px",
        "font-style": "normal",
        "font-size": "90%"
      },
      ".mjx-annotation-xml": {"line-height": "normal"},
      ".mjx-menclose > svg": {
        fill: "none",
        stroke: "currentColor"
      },
      ".mjx-mtr": {display: "table-row"},
      ".mjx-mlabeledtr": {display: "table-row"},
      ".mjx-mtd": {
        display: "table-cell",
        "text-align": "center"
      },
      ".mjx-label": {display: "block"},
      ".mjx-box": {display: "inline-block"},
      ".mjx-block": {display: "block"},
      ".mjx-span": {display: "span"},
      ".mjx-char": {
        display: "block",
        "white-space": "pre"
      },
      ".mjx-itable": {display: "inline-table"},
      ".mjx-row": {display: "table-row"},
      ".mjx-cell": {display: "table-cell"},
      ".mjx-table": {
        display: "table",
        width: "100%"
      },
      ".mjx-line": {
        display: "block",
        height: 0
      },
      ".mjx-strut": {
        width: 0,
        "padding-top": e + "em"
      },
      ".mjx-vsize": {width: 0},
      ".MJXc-space1": {"margin-left": ".167em"},
      ".MJXc-space2": {"margin-left": ".222em"},
      ".MJXc-space3": {"margin-left": ".278em"},
      ".mjx-chartest": {
        display: "block",
        visibility: "hidden",
        position: "absolute",
        top: 0,
        "line-height": "normal",
        "font-size": "500%"
      },
      ".mjx-chartest .mjx-char": {display: "inline"},
      ".mjx-chartest .mjx-box": {"padding-top": "1000px"},
      ".MJXc-processing": {
        visibility: "hidden",
        position: "fixed",
        width: 0,
        height: 0,
        overflow: "hidden"
      },
      ".MJXc-processed": {display: "none"},
      ".mjx-test": {
        display: "block",
        "font-style": "normal",
        "font-weight": "normal",
        "font-size": "100%",
        "font-size-adjust": "none",
        "text-indent": 0,
        "text-transform": "none",
        "letter-spacing": "normal",
        "word-spacing": "normal",
        overflow: "hidden",
        height: "1px"
      },
      ".mjx-ex-box-test": {
        position: "absolute",
        width: "1px",
        height: "60ex"
      },
      "#MathJax_CHTML_Tooltip": {
        "background-color": "InfoBackground",
        color: "InfoText",
        border: "1px solid black",
        "box-shadow": "2px 2px 5px #AAAAAA",
        "-webkit-box-shadow": "2px 2px 5px #AAAAAA",
        "-moz-box-shadow": "2px 2px 5px #AAAAAA",
        "-khtml-box-shadow": "2px 2px 5px #AAAAAA",
        padding: "3px 4px",
        "z-index": 401,
        position: "absolute",
        left: 0,
        top: 0,
        width: "auto",
        height: "auto",
        display: "none"
      }
    };
    var m = 1000000;
    var k = {},
        n = MathJax.Hub.config;
    g.Augment({
      settings: c.config.menuSettings,
      config: {styles: o},
      Config: function() {
        if (!this.require) {
          this.require = [];
        }
        this.SUPER(arguments).Config.call(this);
        var q = this.settings;
        if (q.scale) {
          this.config.scale = q.scale;
        }
        this.require.push(this.fontDir + "/TeX/fontdata.js");
        this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
        k = this.config.linebreaks;
      },
      Startup: function() {
        l = MathJax.Extension.MathEvents.Event;
        b = MathJax.Extension.MathEvents.Touch;
        d = MathJax.Extension.MathEvents.Hover;
        this.ContextMenu = l.ContextMenu;
        this.Mousedown = l.AltContextMenu;
        this.Mouseover = d.Mouseover;
        this.Mouseout = d.Mouseout;
        this.Mousemove = d.Mousemove;
        var q = g.addElement(document.body, "mjx-block", {style: {
            display: "block",
            width: "5in"
          }});
        this.pxPerInch = q.offsetWidth / 5;
        q.parentNode.removeChild(q);
        this.TestSpan = g.Element("mjx-test", {style: {left: "1em"}}, [["mjx-ex-box-test"]]);
        return i.Styles(this.config.styles, ["InitializeCHTML", this]);
      },
      InitializeCHTML: function() {
        this.getDefaultExEm();
        if (this.defaultEm) {
          return;
        }
        var q = MathJax.Callback();
        i.timer.start(i, function(r) {
          if (r.time(q)) {
            c.signal.Post(["CommonHTML Jax - no default em size"]);
            return;
          }
          g.getDefaultExEm();
          if (g.defaultEm) {
            q();
          } else {
            setTimeout(r, r.delay);
          }
        }, this.defaultEmDelay, this.defaultEmTimeout);
        return q;
      },
      defaultEmDelay: 100,
      defaultEmTimeout: 1000,
      getDefaultExEm: function() {
        document.body.appendChild(this.TestSpan);
        this.defaultEm = this.getFontSize(this.TestSpan);
        this.defaultEx = this.TestSpan.firstChild.offsetHeight / 60;
        this.defaultWidth = this.TestSpan.offsetWidth;
        document.body.removeChild(this.TestSpan);
      },
      getFontSize: (window.getComputedStyle ? function(r) {
        var q = window.getComputedStyle(r);
        return parseFloat(q.fontSize);
      } : function(q) {
        return q.style.pixelLeft;
      }),
      getMaxWidth: (window.getComputedStyle ? function(r) {
        var q = window.getComputedStyle(r);
        if (q.maxWidth !== "none") {
          return parseFloat(q.maxWidth);
        }
        return 0;
      } : function(r) {
        var q = r.currentStyle.maxWidth;
        if (q !== "none") {
          if (q.match(/\d*px/)) {
            return parseFloat(q);
          }
          var s = r.style.left;
          r.style.left = q;
          q = r.style.pixelLeft;
          r.style.left = s;
          return q;
        }
        return 0;
      }),
      loadFont: function(q) {
        c.RestartAfter(i.Require(this.fontDir + "/" + q));
      },
      fontLoaded: function(q) {
        if (!q.match(/-|fontdata/)) {
          q += "-Regular";
        }
        if (!q.match(/\.js$/)) {
          q += ".js";
        }
        MathJax.Callback.Queue(["Post", c.Startup.signal, ["CommonHTML - font data loaded", q]], ["loadComplete", i, this.fontDir + "/" + q]);
      },
      Element: function(q, s, r) {
        if (q.substr(0, 4) === "mjx-") {
          if (!s) {
            s = {};
          }
          if (s.isMathJax == null) {
            s.isMathJax = true;
          }
          if (s.className) {
            s.className = q + " " + s.className;
          } else {
            s.className = q;
          }
          q = "span";
        }
        return this.HTMLElement(q, s, r);
      },
      addElement: function(s, q, t, r) {
        return s.appendChild(this.Element(q, t, r));
      },
      HTMLElement: f.Element,
      ucMatch: f.ucMatch,
      setScript: f.setScript,
      getNodesByClass: (document.getElementsByClassName ? function(r, q) {
        return r.getElementsByClassName(q);
      } : function(w, v) {
        var s = [];
        var r = w.getElementsByTagName("span");
        var t = RegExp("\\b" + v + "\\b");
        for (var u = 0,
            q = r.length; u < q; u++) {
          if (t.test(r[u].className)) {
            s.push = r[u];
          }
        }
        return s;
      }),
      getNode: function(v, t) {
        var r = this.getNodesByClass(v, t);
        if (r.length === 1) {
          return r[0];
        }
        var u = r[0],
            w = this.getNodeDepth(v, u);
        for (var s = 1,
            q = r.length; s < q; s++) {
          var x = this.getNodeDepth(v, r[s]);
          if (x < w) {
            u = r[s];
            w = x;
          }
        }
        return u;
      },
      getNodeDepth: function(q, r) {
        var s = 0;
        while (r && r !== q) {
          r = r.parentNode;
          s++;
        }
        return s;
      },
      preTranslate: function(r) {
        var z = r.jax[this.id],
            A,
            x = z.length,
            E,
            y,
            w,
            s,
            D,
            u;
        var q = 100000,
            C = false,
            B = 0,
            F = k.automatic,
            t = k.width;
        if (F) {
          C = !!t.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/);
          if (C) {
            t = t.replace(/\s*container\s*/, "");
          } else {
            q = this.defaultWidth;
          }
          if (t === "") {
            t = "100%";
          }
        }
        for (A = 0; A < x; A++) {
          E = z[A];
          if (!E.parentNode) {
            continue;
          }
          y = E.previousSibling;
          if (y && y.className && String(y.className).substr(0, 9) === "mjx-chtml") {
            y.parentNode.removeChild(y);
          }
          s = E.MathJax.elementJax;
          if (!s) {
            continue;
          }
          s.CHTML = {display: (s.root.Get("display") === "block")};
          w = g.Element("mjx-chtml", {
            id: s.inputID + "-Frame",
            className: "MathJax_CHTML",
            isMathJax: true,
            jaxID: this.id,
            oncontextmenu: l.Menu,
            onmousedown: l.Mousedown,
            onmouseover: l.Mouseover,
            onmouseout: l.Mouseout,
            onmousemove: l.Mousemove,
            onclick: l.Click,
            ondblclick: l.DblClick,
            onkeydown: l.Keydown,
            tabIndex: c.getTabOrder(s)
          });
          if (s.CHTML.display) {
            var v = g.Element("mjx-chtml", {
              className: "MJXc-display",
              isMathJax: false
            });
            v.appendChild(w);
            w = v;
          }
          if (c.Browser.noContextMenu) {
            w.ontouchstart = b.start;
            w.ontouchend = b.end;
          }
          w.className += " MJXc-processing";
          E.parentNode.insertBefore(w, E);
          E.parentNode.insertBefore(this.TestSpan.cloneNode(true), E);
        }
        for (A = 0; A < x; A++) {
          E = z[A];
          if (!E.parentNode) {
            continue;
          }
          test = E.previousSibling;
          s = E.MathJax.elementJax;
          if (!s) {
            continue;
          }
          u = g.getFontSize(test);
          D = test.firstChild.offsetHeight / 60;
          if (D === 0 || D === "NaN") {
            D = this.defaultEx;
          }
          w = test;
          while (w) {
            B = w.offsetWidth;
            if (B) {
              break;
            }
            B = g.getMaxWidth(w);
            if (B) {
              break;
            }
            w = w.parentNode;
          }
          if (C) {
            q = B;
          }
          scale = (this.config.matchFontHeight ? D / this.TEX.x_height / u : 1);
          scale = Math.floor(Math.max(this.config.minScaleAdjust / 100, scale) * this.config.scale);
          s.CHTML.scale = scale / 100;
          s.CHTML.fontSize = scale + "%";
          s.CHTML.outerEm = u;
          s.CHTML.em = this.em = u * scale / 100;
          s.CHTML.ex = D;
          s.CHTML.cwidth = B / this.em;
          s.CHTML.lineWidth = (F ? this.length2em(t, q / this.em, 1) : q);
        }
        for (A = 0; A < x; A++) {
          E = z[A];
          if (!E.parentNode) {
            continue;
          }
          test = z[A].previousSibling;
          s = z[A].MathJax.elementJax;
          if (!s) {
            continue;
          }
          test.parentNode.removeChild(test);
        }
        r.CHTMLeqn = r.CHTMLlast = 0;
        r.CHTMLi = -1;
        r.CHTMLchunk = this.config.EqnChunk;
        r.CHTMLdelay = false;
      },
      Translate: function(r, v) {
        if (!r.parentNode) {
          return;
        }
        if (v.CHTMLdelay) {
          v.CHTMLdelay = false;
          c.RestartAfter(MathJax.Callback.Delay(this.config.EqnChunkDelay));
        }
        var q = r.MathJax.elementJax,
            u = q.root,
            t = document.getElementById(q.inputID + "-Frame");
        this.getMetrics(q);
        if (this.scale !== 1) {
          t.style.fontSize = q.CHTML.fontSize;
        }
        this.initCHTML(u, t);
        this.savePreview(r);
        this.CHTMLnode = t;
        try {
          u.setTeXclass();
          u.toCommonHTML(t);
        } catch (s) {
          while (t.firstChild) {
            t.removeChild(t.firstChild);
          }
          delete this.CHTMLnode;
          this.restorePreview(r);
          throw s;
        }
        delete this.CHTMLnode;
        this.restorePreview(r);
        if (q.CHTML.display) {
          t = t.parentNode;
        }
        t.className = t.className.replace(/ [^ ]+$/, "");
        t.className += " MJXc-processed";
        if (r.MathJax.preview) {
          q.CHTML.preview = r.MathJax.preview;
          delete r.MathJax.preview;
        }
        v.CHTMLeqn += (v.i - v.CHTMLi);
        v.CHTMLi = v.i;
        if (v.CHTMLeqn >= v.CHTMLlast + v.CHTMLchunk) {
          this.postTranslate(v);
          v.CHTMLchunk = Math.floor(v.CHTMLchunk * this.config.EqnChunkFactor);
          v.CHTMLdelay = true;
        }
      },
      initCHTML: function(r, q) {},
      savePreview: function(q) {
        var r = q.MathJax.preview;
        if (r && r.parentNode) {
          q.MathJax.tmpPreview = document.createElement("span");
          r.parentNode.replaceChild(q.MathJax.tmpPreview, r);
        }
      },
      restorePreview: function(q) {
        var r = q.MathJax.tmpPreview;
        if (r) {
          r.parentNode.replaceChild(q.MathJax.preview, r);
          delete q.MathJax.tmpPreview;
        }
      },
      getMetrics: function(q) {
        var r = q.CHTML;
        this.jax = q;
        this.em = r.em;
        this.outerEm = r.outerEm;
        this.scale = r.scale;
        this.cwidth = r.cwidth;
        this.linebreakWidth = r.lineWidth;
      },
      postTranslate: function(v) {
        var r = v.jax[this.id];
        for (var t = v.CHTMLlast,
            q = v.CHTMLeqn; t < q; t++) {
          var s = r[t];
          if (s && s.MathJax.elementJax) {
            s.previousSibling.className = s.previousSibling.className.replace(/ [^ ]+$/, "");
            var u = s.MathJax.elementJax.CHTML;
            if (u.preview) {
              u.preview.innerHTML = "";
              s.MathJax.preview = u.preview;
              delete u.preview;
            }
          }
        }
        v.CHTMLlast = v.CHTMLeqn;
      },
      getJaxFromMath: function(q) {
        if (q.parentNode.className.match(/MJXc-display/)) {
          q = q.parentNode;
        }
        do {
          q = q.nextSibling;
        } while (q && q.nodeName.toLowerCase() !== "script");
        return c.getJaxFor(q);
      },
      getHoverSpan: function(q, r) {
        return q.root.CHTMLnodeElement();
      },
      getHoverBBox: function(q, t, u) {
        var v = q.root.CHTML,
            s = q.CHTML.outerEm;
        var r = {
          w: v.w * s,
          h: v.h * s,
          d: v.d * s
        };
        if (v.width) {
          r.width = v.width;
        }
        return r;
      },
      Zoom: function(s, z, y, q, w) {
        this.getMetrics(s);
        var t = g.addElement(z, "mjx-chtml", {
          style: {"font-size": Math.floor(g.scale * 100) + "%"},
          isMathJax: false
        });
        g.CHTMLnode = t;
        this.idPostfix = "-zoom";
        s.root.toCommonHTML(t);
        this.idPostfix = "";
        var r = t.style,
            A = s.root.CHTML;
        if (A.t > A.h) {
          r.marginTop = g.Em(A.t - A.h);
        }
        if (A.b > A.d) {
          r.marginBottom = g.Em(A.b - A.d);
        }
        if (A.l < 0) {
          r.paddingLeft = g.Em(-A.l);
        }
        if (A.r > A.w) {
          r.marginRight = g.Em(A.r - A.w);
        }
        r.position = "absolute";
        var x = t.offsetWidth,
            v = t.offsetHeight,
            B = y.firstChild.offsetHeight,
            u = y.firstChild.offsetWidth;
        t.style.position = "";
        return {
          Y: -l.getBBox(z).h,
          mW: u,
          mH: B,
          zW: x,
          zH: v
        };
      },
      Remove: function(q) {
        var r = document.getElementById(q.inputID + "-Frame");
        if (r && q.CHTML.display) {
          r = r.parentNode;
        }
        if (r) {
          r.parentNode.removeChild(r);
        }
        delete q.CHTML;
      },
      ID: 0,
      idPostfix: "",
      GetID: function() {
        this.ID++;
        return this.ID;
      },
      MATHSPACE: {
        veryverythinmathspace: 1 / 18,
        verythinmathspace: 2 / 18,
        thinmathspace: 3 / 18,
        mediummathspace: 4 / 18,
        thickmathspace: 5 / 18,
        verythickmathspace: 6 / 18,
        veryverythickmathspace: 7 / 18,
        negativeveryverythinmathspace: -1 / 18,
        negativeverythinmathspace: -2 / 18,
        negativethinmathspace: -3 / 18,
        negativemediummathspace: -4 / 18,
        negativethickmathspace: -5 / 18,
        negativeverythickmathspace: -6 / 18,
        negativeveryverythickmathspace: -7 / 18,
        thin: 0.04,
        medium: 0.06,
        thick: 0.1,
        infinity: m
      },
      SPACECLASS: {
        thinmathspace: "MJXc-space1",
        mediummathspace: "MJXc-space2",
        thickmathspace: "MJXc-space3"
      },
      pxPerInch: 96,
      em: 16,
      maxStretchyParts: 1000,
      FONTDEF: {},
      TEXDEF: {
        x_height: 0.442,
        quad: 1,
        num1: 0.676508,
        num2: 0.393732,
        num3: 0.44373,
        denom1: 0.685951,
        denom2: 0.344841,
        sup1: 0.412892,
        sup2: 0.362892,
        sup3: 0.288888,
        sub1: 0.15,
        sub2: 0.247217,
        sup_drop: 0.386108,
        sub_drop: 0.05,
        delim1: 2.39,
        delim2: 1,
        axis_height: 0.25,
        rule_thickness: 0.06,
        big_op_spacing1: 0.111111,
        big_op_spacing2: 0.166666,
        big_op_spacing3: 0.2,
        big_op_spacing4: 0.45,
        big_op_spacing5: 0.1,
        surd_height: 0.075,
        scriptspace: 0.05,
        nulldelimiterspace: 0.12,
        delimiterfactor: 901,
        delimitershortfall: 0.3,
        min_rule_thickness: 1.25
      },
      unicodeChar: function(q) {
        if (q < 65535) {
          return String.fromCharCode(q);
        }
        q -= 65536;
        return String.fromCharCode((q >> 10) + 55296) + String.fromCharCode((q & 1023) + 56320);
      },
      getUnicode: function(q) {
        var r = q.text.charCodeAt(q.i);
        q.i++;
        if (r >= 55296 && r < 56319) {
          r = (((r - 55296) << 10) + (q.text.charCodeAt(q.i) - 56320)) + 65536;
          q.i++;
        }
        return r;
      },
      getCharList: function(u, t) {
        var s,
            y,
            x = [],
            q = u.cache,
            B = t;
        if (q[t]) {
          return q[t];
        }
        var r = this.FONTDATA.RANGES,
            A = this.FONTDATA.VARIANT;
        if (t >= r[0].low && t <= r[r.length - 1].high) {
          for (s = 0, y = r.length; s < y; s++) {
            if (r[s].name === "alpha" && u.noLowerCase) {
              continue;
            }
            var w = u["offset" + r[s].offset];
            if (w && t >= r[s].low && t <= r[s].high) {
              if (r[s].remap && r[s].remap[t]) {
                t = w + r[s].remap[t];
              } else {
                t = t - r[s].low + w;
                if (r[s].add) {
                  t += r[s].add;
                }
              }
              if (u["variant" + r[s].offset]) {
                u = A[u["variant" + r[s].offset]];
              }
              break;
            }
          }
        }
        if (u.remap && u.remap[t]) {
          t = u.remap[t];
          if (u.remap.variant) {
            u = A[u.remap.variant];
          }
        } else {
          if (this.FONTDATA.REMAP[t] && !u.noRemap) {
            t = this.FONTDATA.REMAP[t];
          }
        }
        if (t instanceof Array) {
          u = A[t[1]];
          t = t[0];
        }
        if (typeof(t) === "string") {
          var v = {
            text: t,
            i: 0,
            length: t.length
          };
          while (v.i < v.length) {
            t = this.getUnicode(v);
            var z = this.getCharList(u, t);
            if (z) {
              x.push.apply(x, z);
            }
          }
        } else {
          if (u.cache[t]) {
            x = u.cache[t];
          } else {
            u.cache[t] = x = [this.lookupChar(u, t)];
          }
        }
        q[B] = x;
        return x;
      },
      lookupChar: function(t, w) {
        var v = t;
        while (t) {
          for (var s = 0,
              q = t.fonts.length; s < q; s++) {
            var r = this.FONTDATA.FONTS[t.fonts[s]];
            if (typeof(r) === "string") {
              this.loadFont(r);
            }
            var u = r[w];
            if (u) {
              if (u.length === 5) {
                u[5] = {};
              }
              if (u.c == null) {
                u[0] /= 1000;
                u[1] /= 1000;
                u[2] /= 1000;
                u[3] /= 1000;
                u[4] /= 1000;
                u.c = this.unicodeChar(w);
              }
              if (u[5].space) {
                return {
                  type: "space",
                  w: u[2],
                  font: r
                };
              }
              return {
                type: "char",
                font: r,
                n: w
              };
            } else {
              if (r.Extra) {
                this.findBlock(r, w);
              }
            }
          }
          t = this.FONTDATA.VARIANT[t.chain];
        }
        return this.unknownChar(v, w);
      },
      findBlock: function(s, w) {
        var r = s.Extra,
            t = s.file,
            v;
        for (var u = 0,
            q = r.length; u < q; u++) {
          if (typeof(r[u]) === "number") {
            if (w === r[u]) {
              v = t;
              break;
            }
          } else {
            if (w < r[u][0]) {
              return;
            }
            if (w <= r[u][1]) {
              v = t;
              break;
            }
          }
        }
        if (v) {
          delete s.Extra;
          this.loadFont(t);
        }
      },
      unknownChar: function(q, t) {
        c.signal.Post(["CommonHTML Jax - unknown char", t, q]);
        var s = "";
        if (q.bold) {
          s += "B";
        }
        if (q.italic) {
          s += "I";
        }
        var r = this.FONTDATA.UNKNOWN[s || "R"];
        if (!r[t]) {
          this.getUnknownChar(r, t);
        }
        return {
          type: "unknown",
          n: t,
          font: r
        };
      },
      getUnknownChar: function(r, t) {
        var s = this.unicodeChar(t);
        var q = this.getHDW(s, r.className);
        r[t] = [0.8, 0.2, q.w, 0, q.w, {
          a: Math.max(0, (q.h - q.d) / 2),
          h: q.h,
          d: q.d
        }];
        r[t].c = s;
      },
      styledText: function(r, u) {
        c.signal.Post(["CommonHTML Jax - styled text", u, r]);
        var s = r.style;
        var v = "_" + (s["font-family"] || r.className || "");
        if (s["font-weight"]) {
          v += "_" + s["font-weight"];
        }
        if (s["font-style"]) {
          v += "_" + s["font-style"];
        }
        if (!this.STYLEDTEXT) {
          this.STYLEDTEXT = {};
        }
        if (!this.STYLEDTEXT[v]) {
          this.STYLEDTEXT[v] = {className: r.className || ""};
        }
        var t = this.STYLEDTEXT[v];
        if (!t["_" + u]) {
          var q = this.getHDW(u, r.className || "", s);
          t["_" + u] = [0.8, 0.2, q.w, 0, q.w, {
            a: Math.max(0, (q.h - q.d) / 2),
            h: q.h,
            d: q.d
          }];
          t["_" + u].c = u;
        }
        return {
          type: "unknown",
          n: "_" + u,
          font: t,
          style: s,
          rscale: r.rscale
        };
      },
      getHDW: function(z, s, D) {
        var r = g.addElement(g.CHTMLnode, "mjx-chartest", {className: s}, [["mjx-char", {style: D}, [z]]]);
        var q = g.addElement(g.CHTMLnode, "mjx-chartest", {className: s}, [["mjx-char", {style: D}, [z, ["mjx-box"]]]]);
        r.firstChild.style.fontSize = q.firstChild.style.fontSize = "";
        var t = 5 * g.em;
        var C = r.offsetHeight,
            A = q.offsetHeight,
            u = r.offsetWidth;
        g.CHTMLnode.removeChild(r);
        g.CHTMLnode.removeChild(q);
        if (A === 0) {
          t = 5 * g.defaultEm;
          var y = document.body.appendChild(document.createElement("div"));
          y.appendChild(r);
          y.appendChild(q);
          C = r.offsetHeight, A = q.offsetHeight, u = r.offsetWidth;
          document.body.removeChild(y);
        }
        var x = (A - 1000) / t,
            B = u / t,
            v = C / t - x;
        return {
          h: v,
          d: x,
          w: B
        };
      },
      addCharList: function(t, v, w) {
        var u = {
          text: "",
          className: null,
          a: 0
        };
        for (var r = 0,
            q = v.length; r < q; r++) {
          var s = v[r];
          if (this.charList[s.type]) {
            (this.charList[s.type])(s, t, w, u, q);
          }
        }
        if (u.text !== "") {
          if (t.childNodes.length) {
            this.charList.flushText(t, u);
          } else {
            f.addText(t, u.text);
            if (t.className) {
              t.className += " " + u.className;
            } else {
              t.className = u.className;
            }
          }
        }
        w.b = (u.flushed ? 0 : w.a);
      },
      charList: {
        "char": function(t, s, w, u, q) {
          var r = t.font;
          if (u.className && r.className !== u.className) {
            this.flushText(s, u);
          }
          if (!u.a) {
            u.a = r.centerline / 1000;
          }
          if (u.a > (w.a || 0)) {
            w.a = u.a;
          }
          var v = r[t.n];
          u.text += v.c;
          u.className = r.className;
          if (w.h < v[0] + j) {
            w.t = w.h = v[0] + j;
          }
          if (w.d < v[1] + a) {
            w.b = w.d = v[1] + a;
          }
          if (w.l > w.w + v[3]) {
            w.l = w.w + v[3];
          }
          if (w.r < w.w + v[4]) {
            w.r = w.w + v[4];
          }
          w.w += v[2] * (t.rscale || 1);
          if (q == 1 && r.skew && r.skew[t.n]) {
            w.skew = r.skew[t.n];
          }
          if (v[5].rfix) {
            this.flushText(s, u).style.marginRight = g.Em(v[5].rfix / 1000);
          }
        },
        space: function(r, q, t, s) {
          if (r.w) {
            if (s.text === "") {
              s.className = r.font.className;
            }
            this.flushText(q, s).style.marginRight = g.Em(r.w);
            t.w += r.w;
          }
        },
        unknown: function(r, q, u, s) {
          (this["char"])(r, q, u, s, 0);
          var t = r.font[r.n];
          if (t[5].a) {
            s.a = t[5].a;
            if (u.a == null || s.a > u.a) {
              u.a = s.a;
            }
          }
          q = this.flushText(q, s, r.style);
          q.style.width = g.Em(t[2]);
        },
        flushText: function(r, s, q) {
          r = g.addElement(r, "mjx-charbox", {
            className: s.className,
            style: q
          }, [s.text]);
          if (s.a) {
            r.style.paddingBottom = g.Em(s.a);
          }
          s.text = "";
          s.className = null;
          s.a = 0;
          s.flushed = true;
          return r;
        }
      },
      handleText: function(s, v, r, u) {
        if (s.childNodes.length === 0) {
          g.addElement(s, "mjx-char");
          u = g.BBOX.empty(u);
        }
        if (typeof(r) === "string") {
          r = this.FONTDATA.VARIANT[r];
        }
        if (!r) {
          r = this.FONTDATA.VARIANT[h.VARIANT.NORMAL];
        }
        var q = {
          text: v,
          i: 0,
          length: v.length
        },
            t = [];
        if (r.style && q.length) {
          t.push(this.styledText(r, v));
        } else {
          while (q.i < q.length) {
            var w = this.getUnicode(q);
            t.push.apply(t, this.getCharList(r, w));
          }
        }
        if (t.length) {
          this.addCharList(s.firstChild, t, u);
        }
        u.clean();
        if (u.d < 0) {
          u.D = u.d;
          u.d = 0;
        }
        if (u.h - u.a) {
          s.firstChild.style[u.h - u.a < 0 ? "marginTop" : "paddingTop"] = this.EmRounded(u.h - u.a);
        }
        if (u.d > -u.b) {
          s.firstChild.style.paddingBottom = this.EmRounded(u.d + u.b);
        }
        return u;
      },
      createDelimiter: function(v, q, s, y, t) {
        if (!q) {
          var z = this.BBOX.zero();
          z.w = z.r = this.TEX.nulldelimiterspace;
          g.addElement(v, "mjx-box", {style: {width: z.w}});
          return z;
        }
        if (!(s instanceof Array)) {
          s = [s, s];
        }
        var x = s[1];
        s = s[0];
        var r = {alias: q};
        while (r.alias) {
          q = r.alias;
          r = this.FONTDATA.DELIMITERS[q];
          if (!r) {
            r = {HW: [0, this.FONTDATA.VARIANT[h.VARIANT.NORMAL]]};
          }
        }
        if (r.load) {
          c.RestartAfter(i.Require(this.fontDir + "/TeX/fontdata-" + r.load + ".js"));
        }
        for (var w = 0,
            u = r.HW.length; w < u; w++) {
          if (r.HW[w][0] >= s - 0.01 || (w == u - 1 && !r.stretch)) {
            if (r.HW[w][3]) {
              q = r.HW[w][3];
            }
            z = this.createChar(v, [q, r.HW[w][1]], (r.HW[w][2] || 1), t);
            z.offset = 0.6 * z.w;
            if (y) {
              z.scale = y.scale;
              y.rscale = y.rscale;
            }
            return z;
          }
        }
        if (!r.stretch) {
          return z;
        }
        return this["extendDelimiter" + r.dir](v, x, r.stretch, y, t);
      },
      extendDelimiterV: function(C, v, N, u, A) {
        C = g.addElement(C, "mjx-delim-v");
        var L = g.Element("span");
        var z,
            y,
            M,
            t,
            F,
            r,
            D,
            w,
            E = 1,
            K;
        F = this.createChar(L, (N.top || N.ext), 1, A);
        z = L.removeChild(L.firstChild);
        r = this.createChar(L, (N.bot || N.ext), 1, A);
        y = L.removeChild(L.firstChild);
        D = w = g.BBOX.zero();
        var G = F.h + F.d + r.h + r.d - p;
        C.appendChild(z);
        if (N.mid) {
          D = this.createChar(L, N.mid, 1, A);
          M = L.removeChild(L.firstChild);
          G += D.h + D.d;
          E = 2;
        }
        if (N.min && v < G * N.min) {
          v = G * N.min;
        }
        if (v > G) {
          w = this.createChar(L, N.ext, 1, A);
          t = L.removeChild(L.firstChild);
          var J = w.h + w.d,
              s = J - p;
          var B = Math.min(Math.ceil((v - G) / (E * s)), this.maxStretchyParts);
          if (N.fullExtenders) {
            v = B * E * s + G;
          } else {
            s = (v - G) / (E * B);
          }
          K = w.d + w.a - J / 2;
          t.style.margin = t.style.padding = "";
          t.style.lineHeight = g.Em(s);
          t.style.marginBottom = g.Em(K - p / 2 / E);
          t.style.marginTop = g.Em(-K - p / 2 / E);
          var I = t.textContent,
              x = "\n" + I;
          while (--B > 0) {
            I += x;
          }
          t.textContent = I;
          C.appendChild(t);
          if (N.mid) {
            C.appendChild(M);
            C.appendChild(t.cloneNode(true));
          }
        } else {
          K = (v - G - p) / E;
          z.style.marginBottom = g.Em(K + parseFloat(z.style.marginBottom || "0"));
          if (N.mid) {
            C.appendChild(M);
          }
          y.style.marginTop = g.Em(K + parseFloat(y.style.marginTop || "0"));
        }
        C.appendChild(y);
        var q = g.BBOX({
          w: Math.max(F.w, w.w, r.w, D.w),
          l: Math.min(F.l, w.l, r.l, D.l),
          r: Math.max(F.r, w.r, r.r, D.r),
          h: v - r.d,
          d: r.d,
          t: v - r.d,
          b: r.d
        });
        q.offset = 0.5 * q.w;
        if (u) {
          q.scale = u.scale;
          q.rscale = u.rscale;
        }
        return q;
      },
      extendDelimiterH: function(D, q, N, t, B) {
        D = g.addElement(D, "mjx-delim-h");
        var L = g.Element("span");
        var r,
            K,
            M,
            s,
            I,
            A,
            u,
            E,
            x,
            F = 1;
        A = this.createChar(L, (N.left || N.rep), 1, B);
        r = L.removeChild(L.firstChild);
        u = this.createChar(L, (N.right || N.rep), 1, B);
        K = L.removeChild(L.firstChild);
        x = this.createChar(L, N.rep, 1, B);
        s = L.removeChild(L.firstChild);
        r.style.marginLeft = g.Em(-A.l);
        K.style.marginRight = g.Em(u.r - u.w);
        D.appendChild(r);
        var O = g.BBOX.zero();
        O.h = Math.max(A.h, u.h, x.h);
        O.d = Math.max(A.D || A.d, u.D || u.d, x.D || x.d);
        var v = (A.r - A.l) + (u.r - u.l) - p;
        if (N.mid) {
          E = this.createChar(L, N.mid, 1, B);
          M = L.removeChild(L.firstChild);
          M.style.marginleft = g.Em(-E.l);
          M.style.marginRight = g.Em(E.r - E.w);
          v += E.r - E.l + p;
          F = 2;
          if (E.h > O.h) {
            O.h = E.h;
          }
          if (E.d > O.d) {
            O.d = E.d;
          }
        }
        if (N.min && q < v * N.min) {
          q = v * N.min;
        }
        O.w = O.r = q;
        if (q > v) {
          var z = x.r - x.l,
              H = z - p;
          var C = Math.min(Math.ceil((q - v) / (F * H)), this.maxStretchyParts);
          if (N.fullExtenders) {
            q = C * F * H + v;
          } else {
            H = (q - v) / (F * C);
          }
          var J = (z - H + p / F) / 2;
          s.style.marginLeft = g.Em(-x.l - J);
          s.style.marginRight = g.Em(x.r - x.w + J);
          s.style.letterSpacing = g.Em(-(x.w - H));
          r.style.marginRight = g.Em(A.r - A.w);
          K.style.marginleft = g.Em(-u.l);
          var G = s.textContent,
              y = G;
          while (--C > 0) {
            G += y;
          }
          s.textContent = G;
          D.appendChild(s);
          if (N.mid) {
            D.appendChild(M);
            I = D.appendChild(s.cloneNode(true));
          }
        } else {
          J = (q - v - p / F) / 2;
          r.style.marginRight = g.Em(A.r - A.w + J);
          if (N.mid) {
            D.appendChild(M);
          }
          K.style.marginLeft = g.Em(-u.l + J);
        }
        D.appendChild(K);
        this.adjustHeights([r, s, M, I, K], [A, x, E, x, u], O);
        if (t) {
          O.scale = t.scale;
          O.rscale = t.rscale;
        }
        return O;
      },
      adjustHeights: function(r, u, v) {
        var s = v.h,
            w = v.d;
        if (v.d < 0) {
          w = -v.d;
          v.D = v.d;
          v.d = 0;
        }
        for (var t = 0,
            q = r.length; t < q; t++) {
          if (r[t]) {
            r[t].style.paddingTop = g.Em(s - u[t].a);
            r[t].style.paddingBottom = g.Em(w + u[t].a);
            r[t].style.marginTop = r[t].style.marginBottom = 0;
          }
        }
      },
      createChar: function(s, w, u, r) {
        var z = "",
            v = {
              fonts: [w[1]],
              noRemap: true,
              cache: {}
            };
        if (r && r === h.VARIANT.BOLD && this.FONTDATA.FONTS[w[1] + "-Bold"]) {
          v.fonts = [w[1] + "-Bold", w[1]];
        }
        if (typeof(w[1]) !== "string") {
          v = w[1];
        }
        if (w[0] instanceof Array) {
          for (var x = 0,
              t = w[0].length; x < t; x++) {
            z += String.fromCharCode(w[0][x]);
          }
        } else {
          z = String.fromCharCode(w[0]);
        }
        if (w[4]) {
          u *= w[4];
        }
        var y = this.handleText(s, z, v),
            q = s.firstChild.style;
        if (u !== 1) {
          q.fontSize = this.Percent(u);
        }
        if (w[2]) {
          q.paddingLeft = this.Em(w[2]);
          y.w += w[2];
          y.r += w[2];
        }
        if (w[3]) {
          q.verticalAlign = this.Em(w[3]);
          y.h += w[3];
          if (y.h < 0) {
            y.h = 0;
          }
        }
        if (w[5]) {
          q.marginTop = this.Em(w[5]);
          y.h += w[5];
          y.t += w[5];
        }
        if (w[6]) {
          q.marginBottom = this.Em(w[6]);
          y.d += w[6];
          y.b += w[6];
        }
        return y;
      },
      length2em: function(u, s, v) {
        if (typeof(u) !== "string") {
          u = u.toString();
        }
        if (u === "") {
          return "";
        }
        if (u === h.SIZE.NORMAL) {
          return 1;
        }
        if (u === h.SIZE.BIG) {
          return 2;
        }
        if (u === h.SIZE.SMALL) {
          return 0.71;
        }
        if (this.MATHSPACE[u]) {
          return this.MATHSPACE[u];
        }
        var r = u.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
        var q = parseFloat(r[1] || "1"),
            t = r[2];
        if (s == null) {
          s = 1;
        }
        if (!v) {
          v = 1;
        }
        v = 1 / this.em / v;
        if (t === "em") {
          return q;
        }
        if (t === "ex") {
          return q * this.TEX.x_height;
        }
        if (t === "%") {
          return q / 100 * s;
        }
        if (t === "px") {
          return q * v;
        }
        if (t === "pt") {
          return q / 10;
        }
        if (t === "pc") {
          return q * 1.2;
        }
        v *= this.pxPerInch;
        if (t === "in") {
          return q * v;
        }
        if (t === "cm") {
          return q * v / 2.54;
        }
        if (t === "mm") {
          return q * v / 25.4;
        }
        if (t === "mu") {
          return q / 18;
        }
        return q * s;
      },
      thickness2em: function(q, r) {
        var s = g.TEX.rule_thickness / (r || 1);
        if (q === h.LINETHICKNESS.MEDIUM) {
          return s;
        }
        if (q === h.LINETHICKNESS.THIN) {
          return 0.67 * s;
        }
        if (q === h.LINETHICKNESS.THICK) {
          return 1.67 * s;
        }
        return this.length2em(q, s, r);
      },
      Em: function(q) {
        if (Math.abs(q) < 0.001) {
          return "0";
        }
        return (q.toFixed(3).replace(/\.?0+$/, "")) + "em";
      },
      EmRounded: function(q) {
        q = (Math.round(q * g.em) + 0.05) / g.em;
        if (Math.abs(q) < 0.0006) {
          return "0em";
        }
        return q.toFixed(3).replace(/\.?0+$/, "") + "em";
      },
      unEm: function(q) {
        return parseFloat(q);
      },
      Px: function(q, r) {
        q *= this.em;
        if (r && q < r) {
          q = r;
        }
        if (Math.abs(q) < 0.1) {
          return "0";
        }
        return q.toFixed(1).replace(/\.0$/, "") + "px";
      },
      Percent: function(q) {
        return (100 * q).toFixed(1).replace(/\.?0+$/, "") + "%";
      },
      Transform: function(t, r, q) {
        var s = t.style;
        s.transform = s.WebkitTransform = s.MozTransform = s["-ms-transform"] = r;
        if (q) {
          s.transformOrigin = s.WebkitTransformOrigin = s.MozTransformOrigin = s["-ms-transform-origin"] = q;
        }
      },
      arrayEntry: function(q, r) {
        return q[Math.max(0, Math.min(r, q.length - 1))];
      },
      removeStyles: ["fontSize", "fontFamily", "fontWeight", "fontStyle", "fontVariant", "font"]
    });
    g.BBOX = MathJax.Object.Subclass({
      Init: function(q) {
        for (var r in q) {
          if (q.hasOwnProperty(r)) {
            this[r] = q[r];
          }
        }
      },
      clean: function() {
        if (this.h === -m) {
          this.h = 0;
        }
        if (this.d === -m) {
          this.d = 0;
        }
        if (this.l === m) {
          this.l = 0;
        }
        if (this.r === -m) {
          this.r = 0;
        }
        if (this.t === -m) {
          this.t = 0;
        }
        if (this.b === -m) {
          this.b = 0;
        }
        if (this.D && this.d > 0) {
          delete this.D;
        }
      },
      rescale: function(q) {
        this.w *= q;
        this.h *= q;
        this.d *= q;
        this.l *= q;
        this.r *= q;
        this.t *= q;
        this.b *= q;
        if (this.L) {
          this.L *= q;
        }
        if (this.R) {
          this.R *= q;
        }
        if (this.D) {
          this.D *= q;
        }
      },
      combine: function(r, q, s) {
        r.X = q;
        r.Y = s;
        scale = r.rscale;
        if (q + scale * r.r > this.r) {
          this.r = q + scale * r.r;
        }
        if (q + scale * r.l < this.l) {
          this.l = q + scale * r.l;
        }
        if (q + scale * (r.w + (r.L || 0) + (r.R || 0)) > this.w) {
          this.w = q + scale * (r.w + (r.L || 0) + (r.R || 0));
        }
        if (s + scale * r.h > this.h) {
          this.h = s + scale * r.h;
        }
        if (r.D && (this.D == null || scale * r.D - s > this.D) && scale * r.D > this.d) {
          this.D = scale * r.D - s;
        } else {
          if (r.D == null && this.D) {
            delete this.D;
          }
        }
        if (scale * r.d - s > this.d) {
          this.d = scale * r.d - s;
        }
        if (s + scale * r.t > this.t) {
          this.t = s + scale * r.t;
        }
        if (scale * r.b - s > this.b) {
          this.b = scale * r.b - s;
        }
      },
      append: function(r) {
        scale = r.rscale;
        var q = this.w;
        if (q + scale * r.r > this.r) {
          this.r = q + scale * r.r;
        }
        if (q + scale * r.l < this.l) {
          this.l = q + scale * r.l;
        }
        this.w += scale * (r.w + (r.L || 0) + (r.R || 0));
        if (scale * r.h > this.h) {
          this.h = scale * r.h;
        }
        if (r.D && (this.D == null || scale * r.D > this.D) && scale * r.D > this.d) {
          this.D = scale * r.D;
        } else {
          if (r.D == null && this.D) {
            delete this.D;
          }
        }
        if (scale * r.d > this.d) {
          this.d = scale * r.d;
        }
        if (scale * r.t > this.t) {
          this.t = scale * r.t;
        }
        if (scale * r.b > this.b) {
          this.b = scale * r.b;
        }
      },
      updateFrom: function(q) {
        this.h = q.h;
        this.d = q.d;
        this.w = q.w;
        this.r = q.r;
        this.l = q.l;
        this.t = q.t;
        this.b = q.b;
        if (q.D) {
          this.D = q.D;
        } else {
          delete this.D;
        }
      },
      adjust: function(r, q, t, s) {
        this[q] += g.length2em(r, 1, this.scale);
        if (s == null) {
          if (this[q] > this[t]) {
            this[t] = this[q];
          }
        } else {
          if (this[t] < s) {
            this[t] = s;
          }
        }
      }
    }, {
      zero: function() {
        return g.BBOX({
          h: 0,
          d: 0,
          w: 0,
          l: 0,
          r: 0,
          t: 0,
          b: 0,
          scale: 1,
          rscale: 1
        });
      },
      empty: function(q) {
        if (!q) {
          q = g.BBOX.zero();
        }
        q.h = q.d = q.r = q.t = q.b = -m;
        q.w = 0;
        q.l = m;
        return q;
      },
      styleAdjust: [["borderTopWidth", "h", "t"], ["borderRightWidth", "w", "r"], ["borderBottomWidth", "d", "b"], ["borderLeftWidth", "w", "l", 0], ["paddingTop", "h", "t"], ["paddingRight", "w", "r"], ["paddingBottom", "d", "b"], ["paddingLeft", "w", "l", 0]]
    });
    MathJax.Hub.Register.StartupHook("mml Jax Ready", function() {
      h = MathJax.ElementJax.mml;
      h.mbase.Augment({
        toCommonHTML: function(r, q) {
          return this.CHTMLdefaultNode(r, q);
        },
        CHTMLmultiline: function() {
          h.mbase.CHTMLautoloadFile("multiline");
        },
        CHTMLdefaultNode: function(t, r) {
          if (!r) {
            r = {};
          }
          t = this.CHTMLcreateNode(t);
          this.CHTML = g.BBOX.empty();
          this.CHTMLhandleStyle(t);
          this.CHTMLhandleScale(t);
          if (this.isToken) {
            this.CHTMLgetVariant();
          }
          var q = Math.max((r.minChildren || 0), this.data.length);
          for (var s = 0; s < q; s++) {
            this.CHTMLaddChild(t, s, r);
          }
          if (!r.noBBox) {
            this.CHTML.clean();
          }
          this.CHTMLhandleSpace(t);
          this.CHTMLhandleBBox(t);
          this.CHTMLhandleColor(t);
          return t;
        },
        CHTMLaddChild: function(v, r, q) {
          var x = this.data[r],
              u;
          if (x) {
            var s = q.childNodes;
            if (s) {
              if (s instanceof Array) {
                s = s[r] || "span";
              }
              v = g.addElement(v, s);
            }
            u = x.toCommonHTML(v, q.childOptions);
            if (s && x.CHTML.rscale !== 1) {
              v.style.fontSize = v.firstChild.style.fontSize;
              v.firstChild.style.fontSize = "";
            }
            if (!q.noBBox) {
              var w = this.CHTML,
                  t = x.CHTML;
              w.append(t);
              if (t.ic) {
                w.ic = t.ic;
              } else {
                delete w.ic;
              }
              if (t.skew) {
                w.skew = t.skew;
              }
              if (t.pwidth) {
                w.pwidth = t.pwidth;
              }
            }
          } else {
            if (q.forceChild) {
              u = g.addElement(v, "mjx-box");
            }
          }
          return u;
        },
        CHTMLchildNode: function(r, q) {
          r = r.childNodes[q];
          if (r.nodeName.toLowerCase() === "a") {
            r = r.firstChild;
          }
          return r;
        },
        CHTMLcoreNode: function(q) {
          return this.CHTMLchildNode(q, this.CoreIndex());
        },
        CHTMLstretchChildV: function(t, s, v) {
          var u = this.data[t];
          if (u) {
            var x = this.CHTML,
                r = u.CHTML;
            if (r.stretch || (r.stretch == null && u.CHTMLcanStretch("Vertical", s, v))) {
              var q = r.w;
              r = u.CHTMLstretchV(s, v);
              x.w += r.w - q;
              if (x.w > x.r) {
                x.r = x.w;
              }
              if (r.h > x.h) {
                x.h = r.h;
              }
              if (r.d > x.d) {
                x.d = r.d;
              }
              if (r.t > x.t) {
                x.t = r.t;
              }
              if (r.b > x.b) {
                x.b = r.b;
              }
            }
          }
        },
        CHTMLstretchChildH: function(t, q, u) {
          var v = this.data[t];
          if (v) {
            var x = this.CHTML,
                s = v.CHTML;
            if (s.stretch || (s.stretch == null && v.CHTMLcanStretch("Horizontal", q))) {
              var r = s.w;
              s = v.CHTMLstretchH(this.CHTMLchildNode(u, t), q);
              x.w += s.w - r;
              if (x.w > x.r) {
                x.r = x.w;
              }
              if (s.h > x.h) {
                x.h = s.h;
              }
              if (s.d > x.d) {
                x.d = s.d;
              }
              if (s.t > x.t) {
                x.t = s.t;
              }
              if (s.b > x.b) {
                x.b = s.b;
              }
            }
          }
        },
        CHTMLcanStretch: function(u, s, t) {
          var r = false;
          if (this.isEmbellished()) {
            var q = this.Core();
            if (q && q !== this) {
              r = q.CHTMLcanStretch(u, s, t);
            }
          }
          this.CHTML.stretch = r;
          return r;
        },
        CHTMLstretchV: function(q, r) {
          this.CHTML.updateFrom(this.Core().CHTMLstretchV(q, r));
          return this.CHTML;
        },
        CHTMLstretchH: function(r, q) {
          this.CHTML.updateFrom(this.CHTMLstretchCoreH(r, q));
          return this.CHTML;
        },
        CHTMLstretchCoreH: function(r, q) {
          return this.Core().CHTMLstretchH(this.CHTMLcoreNode(r), q);
        },
        CHTMLcreateNode: function(q) {
          if (!this.CHTML) {
            this.CHTML = {};
          }
          this.CHTML = g.BBOX.zero();
          if (this.href) {
            q = g.addElement(q, "a", {
              href: this.href,
              isMathJax: true
            });
          }
          if (!this.CHTMLnodeID) {
            this.CHTMLnodeID = g.GetID();
          }
          var r = (this.id || "MJXc-Node-" + this.CHTMLnodeID) + g.idPostfix;
          return this.CHTMLhandleAttributes(g.addElement(q, "mjx-" + this.type, {id: r}));
        },
        CHTMLnodeElement: function() {
          if (!this.CHTMLnodeID) {
            return null;
          }
          return document.getElementById((this.id || "MJXc-Node-" + this.CHTMLnodeID) + g.idPostfix);
        },
        CHTMLlength2em: function(r, q) {
          return g.length2em(r, q, this.CHTML.scale);
        },
        CHTMLhandleAttributes: function(t) {
          if (this["class"]) {
            if (t.className) {
              t.className += " " + this["class"];
            } else {
              t.className = this["class"];
            }
          }
          if (this.attrNames) {
            var x = this.attrNames,
                s = h.nocopyAttributes,
                w = c.config.ignoreMMLattributes;
            var u = (this.type === "mstyle" ? h.math.prototype.defaults : this.defaults);
            for (var r = 0,
                q = x.length; r < q; r++) {
              var v = x[r];
              if (w[v] == false || (!s[v] && !w[v] && u[v] == null && typeof(t[v]) === "undefined")) {
                t.setAttribute(v, this.attr[v]);
              }
            }
          }
          return t;
        },
        CHTMLhandleScale: function(s) {
          var u = 1,
              r = this.parent,
              t = (r ? r.CHTML.scale : 1);
          var q = this.getValues("scriptlevel", "fontsize");
          q.mathsize = this.Get("mathsize", null, !this.isToken);
          if (q.scriptlevel !== 0) {
            if (q.scriptlevel > 2) {
              q.scriptlevel = 2;
            }
            u = Math.pow(this.Get("scriptsizemultiplier"), q.scriptlevel);
            q.scriptminsize = g.length2em(this.Get("scriptminsize"), 0.8, 1);
            if (u < q.scriptminsize) {
              u = q.scriptminsize;
            }
          }
          if (this.removedStyles && this.removedStyles.fontSize && !q.fontsize) {
            q.fontsize = this.removedStyles.fontSize;
          }
          if (q.fontsize && !this.mathsize) {
            q.mathsize = q.fontsize;
          }
          if (q.mathsize !== 1) {
            u *= g.length2em(q.mathsize, 1, 1);
          }
          this.CHTML.scale = u;
          t = this.CHTML.rscale = u / t;
          if (Math.abs(t - 1) < 0.001) {
            t = 1;
          }
          if (s && t !== 1) {
            s.style.fontSize = g.Percent(t);
          }
          return u;
        },
        CHTMLhandleStyle: function(t) {
          if (!this.style) {
            return;
          }
          var s = t.style;
          s.cssText = this.style;
          this.removedStyles = {};
          for (var r = 0,
              q = g.removeStyles.length; r < q; r++) {
            var u = g.removeStyles[r];
            if (s[u]) {
              this.removedStyles[u] = s[u];
              s[u] = "";
            }
          }
        },
        CHTMLhandleBBox: function(u) {
          var r = this.CHTML,
              t = u.style;
          if (this.data.length === 1 && (this.data[0].CHTML || {}).pwidth) {
            r.pwidth = this.data[0].CHTML.pwidth;
            r.mwidth = this.data[0].CHTML.mwidth;
            t.width = "100%";
          } else {
            if (r.pwidth) {
              r.mwidth = g.Em(r.w);
              t.width = "100%";
            } else {
              if (r.w < 0) {
                t.width = "0px";
                t.marginRight = g.Em(r.w);
              }
            }
          }
          if (!this.style) {
            return;
          }
          for (var s = 0,
              q = g.BBOX.styleAdjust.length; s < q; s++) {
            var v = g.BBOX.styleAdjust[s];
            if (v && t[v[0]]) {
              r.adjust(t[v[0]], v[1], v[2], v[3]);
            }
          }
        },
        CHTMLhandleColor: function(q) {
          if (this.mathcolor) {
            q.style.color = this.mathcolor;
          } else {
            if (this.color) {
              q.style.color = this.color;
            }
          }
          if (this.mathbackground) {
            q.style.backgroundColor = this.mathbackground;
          } else {
            if (this.background) {
              q.style.backgroundColor = this.background;
            }
          }
        },
        CHTMLhandleSpace: function(q) {
          if (!this.useMMLspacing) {
            var r = this.texSpacing();
            if (r !== "") {
              this.CHTML.L = this.CHTMLlength2em(r);
              q.className += " " + g.SPACECLASS[r];
            }
          }
        },
        CHTMLhandleText: function(r, s, q) {
          if (r.firstChild && !this.CHTML) {
            this.CHTML = g.BBOX.empty();
          }
          this.CHTML = g.handleText(r, s, q, this.CHTML);
        },
        CHTMLgetVariant: function() {
          var q = this.getValues("mathvariant", "fontfamily", "fontweight", "fontstyle"),
              s;
          q.hasVariant = this.Get("mathvariant", true);
          if (this.removedStyles) {
            s = this.removedStyles;
            if (s.fontFamily) {
              q.family = s.fontFamily;
            }
            if (s.fontWeight) {
              q.weight = s.fontWeight;
            }
            if (s.fontStyle) {
              q.style = s.fontStyle;
            }
          }
          if (!q.hasVariant) {
            if (q.fontfamily) {
              q.family = q.fontfamily;
            }
            if (q.fontweight) {
              q.weight = q.fontweight;
            }
            if (q.fontstyle) {
              q.style = q.fontstyle;
            }
          }
          if (q.weight && q.weight.match(/^\d+$/)) {
            q.weight = (parseInt(q.weight) > 600 ? "bold" : "normal");
          }
          var r = q.mathvariant;
          if (this.variantForm) {
            r = "-TeX-variant";
          }
          if (q.family && !q.hasVariant) {
            if (!q.weight && q.mathvariant.match(/bold/)) {
              q.weight = "bold";
            }
            if (!q.style && q.mathvariant.match(/italic/)) {
              q.style = "italic";
            }
            this.CHTMLvariant = {
              fonts: [],
              noRemap: true,
              cache: {},
              style: {
                "font-family": q.family,
                "font-weight": q.weight || "normal",
                "font-style": q.style || "normal"
              }
            };
            return;
          }
          if (q.weight === "bold") {
            r = {
              normal: h.VARIANT.BOLD,
              italic: h.VARIANT.BOLDITALIC,
              fraktur: h.VARIANT.BOLDFRAKTUR,
              script: h.VARIANT.BOLDSCRIPT,
              "sans-serif": h.VARIANT.BOLDSANSSERIF,
              "sans-serif-italic": h.VARIANT.SANSSERIFBOLDITALIC
            }[r] || r;
          } else {
            if (q.weight === "normal") {
              r = {
                bold: h.VARIANT.normal,
                "bold-italic": h.VARIANT.ITALIC,
                "bold-fraktur": h.VARIANT.FRAKTUR,
                "bold-script": h.VARIANT.SCRIPT,
                "bold-sans-serif": h.VARIANT.SANSSERIF,
                "sans-serif-bold-italic": h.VARIANT.SANSSERIFITALIC
              }[r] || r;
            }
          }
          if (q.style === "italic") {
            r = {
              normal: h.VARIANT.ITALIC,
              bold: h.VARIANT.BOLDITALIC,
              "sans-serif": h.VARIANT.SANSSERIFITALIC,
              "bold-sans-serif": h.VARIANT.SANSSERIFBOLDITALIC
            }[r] || r;
          } else {
            if (q.style === "normal") {
              r = {
                italic: h.VARIANT.NORMAL,
                "bold-italic": h.VARIANT.BOLD,
                "sans-serif-italic": h.VARIANT.SANSSERIF,
                "sans-serif-bold-italic": h.VARIANT.BOLDSANSSERIF
              }[r] || r;
            }
          }
          this.CHTMLvariant = g.FONTDATA.VARIANT[r] || g.FONTDATA.VARIANT[h.VARIANT.NORMAL];
        },
        CHTMLbboxFor: function(q) {
          if (this.data[q] && this.data[q].CHTML) {
            return this.data[q].CHTML;
          }
          return g.BBOX.zero();
        },
        CHTMLdrawBBox: function(r, s) {
          if (!s) {
            s = this.CHTML;
          }
          var q = g.Element("mjx-box", {style: {
              opacity: 0.25,
              "margin-left": g.Em(-(s.w + (s.R || 0)))
            }}, [["mjx-box", {style: {
              height: g.Em(s.h),
              width: g.Em(s.w),
              "background-color": "red"
            }}], ["mjx-box", {style: {
              height: g.Em(s.d),
              width: g.Em(s.w),
              "margin-left": g.Em(-s.w),
              "vertical-align": g.Em(-s.d),
              "background-color": "green"
            }}]]);
          if (r.nextSibling) {
            r.parentNode.insertBefore(q, r.nextSibling);
          } else {
            r.parentNode.appendChild(q);
          }
        },
        CHTMLnotEmpty: function(q) {
          while (q && q.data.length < 2 && (q.type === "mrow" || q.type === "texatom")) {
            q = q.data[0];
          }
          return !!q;
        }
      }, {
        CHTMLautoload: function() {
          var q = g.autoloadDir + "/" + this.type + ".js";
          c.RestartAfter(i.Require(q));
        },
        CHTMLautoloadFile: function(q) {
          var r = g.autoloadDir + "/" + q + ".js";
          c.RestartAfter(i.Require(r));
        },
        CHTMLstretchV: function(q, r) {
          this.Core().CHTMLstretchV(q, r);
          this.toCommonHTML(this.CHTMLnodeElement(), true);
          return this.CHTML;
        },
        CHTMLstretchH: function(r, q) {
          this.CHTMLstretchCoreH(r, q);
          this.toCommonHTML(r, true);
          return this.CHTML;
        }
      });
      h.chars.Augment({toCommonHTML: function(r, q) {
          if (q == null) {
            q = {};
          }
          var s = this.toString();
          if (q.remap) {
            s = q.remap(s, q.remapchars);
          }
          this.CHTMLhandleText(r, s, q.variant || this.parent.CHTMLvariant);
        }});
      h.entity.Augment({toCommonHTML: function(r, q) {
          if (q == null) {
            q = {};
          }
          var s = this.toString();
          if (q.remapchars) {
            s = q.remap(s, q.remapchars);
          }
          this.CHTMLhandleText(r, s, q.variant || this.parent.CHTMLvariant);
        }});
      h.math.Augment({toCommonHTML: function(v) {
          v = this.CHTMLdefaultNode(v);
          if (this.CHTML.w < 0) {
            v.parentNode.style.width = "0px";
            v.parentNode.style.marginRight = g.Em(this.CHTML.w);
          }
          var t = this.Get("alttext");
          if (t && !v.getAttribute("aria-label")) {
            v.setAttribute("aria-label", t);
          }
          if (!v.getAttribute("role")) {
            v.setAttribute("role", "math");
          }
          if (this.CHTML.pwidth) {
            v.parentNode.style.width = this.CHTML.pwidth;
            v.parentNode.style.minWidth = this.CHTML.mwidth || g.Em(this.CHTML.w);
          } else {
            if (!this.isMultiline && this.Get("display") === "block") {
              var s = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
              if (s.indentalignfirst !== h.INDENTALIGN.INDENTALIGN) {
                s.indentalign = s.indentalignfirst;
              }
              if (s.indentalign === h.INDENTALIGN.AUTO) {
                s.indentalign = n.displayAlign;
              }
              if (s.indentshiftfirst !== h.INDENTSHIFT.INDENTSHIFT) {
                s.indentshift = s.indentshiftfirst;
              }
              if (s.indentshift === "auto") {
                s.indentshift = "0";
              }
              var r = this.CHTMLlength2em(s.indentshift, g.cwidth);
              if (n.displayIndent !== "0") {
                var q = this.CHTMLlength2em(n.displayIndent, g.cwidth);
                r += (s.indentalign === h.INDENTALIGN.RIGHT ? -q : q);
              }
              var u = v.parentNode.parentNode.style;
              u.textAlign = s.indentalign;
              if (r) {
                r *= g.em / g.outerEm;
                c.Insert(u, ({
                  left: {marginLeft: g.Em(r)},
                  right: {marginRight: g.Em(-r)},
                  center: {
                    marginLeft: g.Em(r),
                    marginRight: g.Em(-r)
                  }
                })[s.indentalign]);
              }
            }
          }
          return v;
        }});
      h.mi.Augment({toCommonHTML: function(q) {
          q = this.CHTMLdefaultNode(q);
          var s = this.CHTML,
              r = this.data.join("");
          if (s.skew != null && r.length !== 1) {
            delete s.skew;
          }
          if (s.r > s.w && r.length === 1 && !this.CHTMLvariant.noIC) {
            s.ic = s.r - s.w;
            s.w = s.r;
            q.lastChild.style.paddingRight = g.Em(s.ic);
          }
          return q;
        }});
      h.mn.Augment({toCommonHTML: function(q) {
          q = this.CHTMLdefaultNode(q);
          var s = this.CHTML,
              r = this.data.join("");
          if (s.skew != null && r.length !== 1) {
            delete s.skew;
          }
          if (s.r > s.w && r.length === 1 && !this.CHTMLvariant.noIC) {
            s.ic = s.r - s.w;
            s.w = s.r;
            q.lastChild.style.paddingRight = g.Em(s.ic);
          }
          return q;
        }});
      h.mo.Augment({
        toCommonHTML: function(t) {
          t = this.CHTMLcreateNode(t);
          this.CHTMLhandleStyle(t);
          this.CHTMLhandleScale(t);
          this.CHTMLgetVariant();
          g.BBOX.empty(this.CHTML);
          var r = this.getValues("displaystyle", "largeop");
          r.variant = this.CHTMLvariant;
          r.text = this.data.join("");
          if (r.text == "") {
            if (this.fence) {
              t.style.width = g.Em(g.TEX.nulldelimiterspace);
            }
          } else {
            this.CHTMLadjustAccent(r);
            this.CHTMLadjustVariant(r);
            for (var s = 0,
                q = this.data.length; s < q; s++) {
              this.CHTMLaddChild(t, s, {childOptions: {
                  variant: r.mathvariant,
                  remap: this.remap,
                  remapchars: r.remapchars
                }});
            }
            if (r.text.length !== 1) {
              delete this.CHTML.skew;
            } else {
              if (this.CHTML.w === 0 && this.CHTML.l < 0) {
                this.CHTMLfixCombiningChar(t);
              }
            }
            if (r.largeop) {
              this.CHTMLcenterOp(t);
            }
          }
          this.CHTML.clean();
          this.CHTMLhandleBBox(t);
          this.CHTMLhandleSpace(t);
          this.CHTMLhandleColor(t);
          return t;
        },
        CHTMLhandleSpace: function(t) {
          if (this.useMMLspacing) {
            var r = this.getValues("scriptlevel", "lspace", "rspace");
            r.lspace = Math.max(0, this.CHTMLlength2em(r.lspace));
            r.rspace = Math.max(0, this.CHTMLlength2em(r.rspace));
            if (r.scriptlevel > 0) {
              if (!this.hasValue("lspace")) {
                r.lspace = 0.15;
              }
              if (!this.hasValue("rspace")) {
                r.rspace = 0.15;
              }
            }
            var q = this,
                s = this.Parent();
            while (s && s.isEmbellished() && s.Core() === q) {
              q = s;
              s = s.Parent();
              t = q.CHTMLnodeElement();
            }
            if (r.lspace) {
              t.style.paddingLeft = g.Em(r.lspace);
            }
            if (r.rspace) {
              t.style.paddingRight = g.Em(r.rspace);
            }
            this.CHTML.L = r.lspace;
            this.CHTML.R = r.rspace;
          } else {
            this.SUPER(arguments).CHTMLhandleSpace.apply(this, arguments);
          }
        },
        CHTMLadjustAccent: function(s) {
          var r = this.CoreParent();
          s.parent = r;
          if (s.text.length === 1 && r && r.isa(h.munderover) && this.CoreText(r.data[r.base]).length === 1) {
            var t = r.data[r.over],
                q = r.data[r.under];
            if (t && this === t.CoreMO() && r.Get("accent")) {
              s.remapchars = g.FONTDATA.REMAPACCENT;
            } else {
              if (q && this === q.CoreMO() && r.Get("accentunder")) {
                s.remapchars = g.FONTDATA.REMAPACCENTUNDER;
              }
            }
          }
        },
        CHTMLadjustVariant: function(r) {
          var q = r.parent,
              s = (q && q.isa(h.msubsup) && this !== q.data[q.base]);
          if (r.largeop) {
            r.mathvariant = (r.displaystyle ? "-largeOp" : "-smallOp");
          }
          if (s) {
            r.remapchars = this.remapChars;
            if (r.text.match(/['`"\u00B4\u2032-\u2037\u2057]/)) {
              r.mathvariant = "-TeX-variant";
            }
          }
        },
        CHTMLfixCombiningChar: function(q) {
          q = q.firstChild;
          var r = g.Element("mjx-span", {style: {
              width: ".25em",
              "margin-left": "-.25em"
            }});
          q.insertBefore(r, q.firstChild);
        },
        CHTMLcenterOp: function(q) {
          var s = this.CHTML;
          var r = (s.h - s.d) / 2 - g.TEX.axis_height;
          if (Math.abs(r) > 0.001) {
            q.style.verticalAlign = g.Em(-r);
          }
          s.h -= r;
          s.d += r;
          if (s.r > s.w) {
            s.ic = s.r - s.w;
            s.w = s.r;
            q.style.paddingRight = g.Em(s.ic);
          }
        },
        CHTMLcanStretch: function(u, s, t) {
          if (!this.Get("stretchy")) {
            return false;
          }
          var v = this.data.join("");
          if (v.length !== 1) {
            return false;
          }
          var r = {text: v};
          this.CHTMLadjustAccent(r);
          if (r.remapchars) {
            v = r.remapchars[v] || v;
          }
          v = g.FONTDATA.DELIMITERS[v.charCodeAt(0)];
          var q = (v && v.dir === u.substr(0, 1));
          if (q) {
            q = (this.CHTML.h !== s || this.CHTML.d !== t || !!this.Get("minsize", true) || !!this.Get("maxsize", true));
            if (q) {
              this.CHTML.stretch = true;
            }
          }
          return q;
        },
        CHTMLstretchV: function(t, w) {
          var u = this.CHTMLnodeElement(),
              v = this.CHTML;
          var r = this.getValues("symmetric", "maxsize", "minsize");
          var s,
              q = g.TEX.axis_height;
          if (r.symmetric) {
            s = 2 * Math.max(t - q, w + q);
          } else {
            s = t + w;
          }
          r.maxsize = this.CHTMLlength2em(r.maxsize, v.h + v.d);
          r.minsize = this.CHTMLlength2em(r.minsize, v.h + v.d);
          s = Math.max(r.minsize, Math.min(r.maxsize, s));
          if (s !== v.sH) {
            if (s != r.minsize) {
              s = [Math.max(s * g.TEX.delimiterfactor / 1000, s - g.TEX.delimitershortfall), s];
            }
            while (u.firstChild) {
              u.removeChild(u.firstChild);
            }
            this.CHTML = v = g.createDelimiter(u, this.data.join("").charCodeAt(0), s, v);
            v.sH = (s instanceof Array ? s[1] : s);
            if (r.symmetric) {
              s = (v.h + v.d) / 2 + q;
            } else {
              s = (v.h + v.d) * t / (t + w);
            }
            s -= v.h;
            if (Math.abs(s) > 0.05) {
              u.style.verticalAlign = g.Em(s);
              v.h += s;
              v.d -= s;
              v.t += s;
              v.b -= s;
            }
          }
          return this.CHTML;
        },
        CHTMLstretchH: function(s, q) {
          var t = this.CHTML;
          var r = this.getValues("maxsize", "minsize", "mathvariant", "fontweight");
          if ((r.fontweight === "bold" || (this.removedStyles || {}).fontWeight === "bold" || parseInt(r.fontweight) >= 600) && !this.Get("mathvariant", true)) {
            r.mathvariant = h.VARIANT.BOLD;
          }
          r.maxsize = this.CHTMLlength2em(r.maxsize, t.w);
          r.minsize = this.CHTMLlength2em(r.minsize, t.w);
          q = Math.max(r.minsize, Math.min(r.maxsize, q));
          if (q !== t.sW) {
            while (s.firstChild) {
              s.removeChild(s.firstChild);
            }
            this.CHTML = t = g.createDelimiter(s, this.data.join("").charCodeAt(0), q, t, r.mathvariant);
            t.sW = q;
          }
          return this.CHTML;
        }
      });
      h.mtext.Augment({CHTMLgetVariant: function() {
          if (g.config.mtextFontInherit || this.Parent().type === "merror") {
            var s = (g.config.scale / 100) / g.scale;
            var r = {
              cache: {},
              fonts: [],
              className: "MJXc-font-inherit",
              rscale: s,
              style: {"font-size": g.Percent(s)}
            };
            var q = this.Get("mathvariant");
            if (q.match(/bold/)) {
              r.style["font-weight"] = "bold";
            }
            if (q.match(/italic|-tex-mathit/)) {
              r.style["font-style"] = "italic";
            }
            if (q === "monospace") {
              r.className += " MJXc-monospace-font";
            }
            if (q === "double-struck") {
              r.className += " MJXc-double-struck-font";
            }
            if (q.match(/fraktur/)) {
              r.className += " MJXc-fraktur-font";
            }
            if (q.match(/sans-serif/)) {
              r.className += " MJXc-sans-serif-font";
            }
            if (q.match(/script/)) {
              r.className += " MJXc-script-font";
            }
            this.CHTMLvariant = r;
          } else {
            this.SUPER(arguments).CHTMLgetVariant.call(this);
          }
        }});
      h.merror.Augment({toCommonHTML: function(q) {
          q = this.CHTMLdefaultNode(q);
          var r = this.CHTML;
          r.rescale(0.9);
          r.h += 3 / g.em;
          if (r.h > r.t) {
            r.t = r.h;
          }
          r.d += 3 / g.em;
          if (r.d > r.b) {
            r.b = r.d;
          }
          r.w += 8 / g.em;
          r.r = r.w;
          r.l = 0;
          return q;
        }});
      h.mspace.Augment({toCommonHTML: function(t) {
          t = this.CHTMLcreateNode(t);
          this.CHTMLhandleStyle(t);
          this.CHTMLhandleScale(t);
          var r = this.getValues("height", "depth", "width");
          var q = this.CHTMLlength2em(r.width),
              s = this.CHTMLlength2em(r.height),
              v = this.CHTMLlength2em(r.depth);
          var u = this.CHTML;
          u.w = u.r = q;
          u.h = u.t = s;
          u.d = u.b = v;
          u.l = 0;
          if (q < 0) {
            t.style.marginRight = g.Em(q);
            q = 0;
          }
          t.style.width = g.Em(q);
          t.style.height = g.Em(Math.max(0, s + v));
          if (v) {
            t.style.verticalAlign = g.Em(-v);
          }
          this.CHTMLhandleBBox(t);
          this.CHTMLhandleColor(t);
          return t;
        }});
      h.mpadded.Augment({
        toCommonHTML: function(s, q) {
          var r;
          if (q) {
            s = s.firstChild;
            r = s.firstChild;
          } else {
            s = this.CHTMLdefaultNode(s, {
              childNodes: "mjx-box",
              forceChild: true
            });
            r = s.firstChild;
            s = g.addElement(s, "mjx-block");
            s.appendChild(r);
            g.addElement(s, "mjx-strut");
          }
          var v = this.CHTMLbboxFor(0);
          var C = this.getValues("width", "height", "depth", "lspace", "voffset");
          var A = 0,
              z = 0,
              B = v.w,
              t = v.h,
              u = v.d;
          r.style.width = 0;
          r.style.margin = g.Em(-t) + " 0 " + g.Em(-u);
          if (C.width !== "") {
            B = this.CHTMLdimen(C.width, "w", B, 0);
          }
          if (C.height !== "") {
            t = this.CHTMLdimen(C.height, "h", t, 0);
          }
          if (C.depth !== "") {
            u = this.CHTMLdimen(C.depth, "d", u, 0);
          }
          if (C.voffset !== "") {
            z = this.CHTMLdimen(C.voffset);
            if (z) {
              r.style.position = "relative";
              r.style.top = g.Em(-z);
            }
          }
          if (C.lspace !== "") {
            A = this.CHTMLdimen(C.lspace);
            if (A) {
              r.style.position = "relative";
              r.style.left = g.Em(A);
            }
          }
          s.style.width = 0;
          s.style.marginTop = g.Em(t - e);
          s.style.padding = "0 " + g.Em(B) + " " + g.Em(u) + " 0";
          var D = g.BBOX({
            w: B,
            h: t,
            d: u,
            l: 0,
            r: B,
            t: t,
            b: u,
            scale: this.CHTML.scale,
            rscale: this.CHTML.rscale
          });
          D.combine(v, A, z);
          D.w = B;
          D.h = t;
          D.d = u;
          this.CHTML = D;
          return s.parentNode;
        },
        CHTMLstretchV: h.mbase.CHTMLstretchV,
        CHTMLstretchH: h.mbase.CHTMLstretchH,
        CHTMLdimen: function(u, w, v, q) {
          if (q == null) {
            q = -m;
          }
          u = String(u);
          var r = u.match(/width|height|depth/);
          var s = (r ? this.CHTML[r[0].charAt(0)] : (w ? this.CHTML[w] : 0));
          var t = (this.CHTMLlength2em(u, s) || 0);
          if (u.match(/^[-+]/) && v != null) {
            t += v;
          }
          if (q != null) {
            t = Math.max(q, t);
          }
          return t;
        }
      });
      h.munderover.Augment({
        toCommonHTML: function(u, q) {
          var C = this.getValues("displaystyle", "accent", "accentunder", "align");
          var s = this.data[this.base];
          if (!C.displaystyle && s != null && (s.movablelimits || s.CoreMO().Get("movablelimits"))) {
            return h.msubsup.prototype.toCommonHTML.call(this, u, q);
          }
          var z,
              x,
              r = [];
          if (q) {
            if (this.data[this.base]) {
              s = g.getNode(u, "mjx-op");
            }
            if (this.data[this.under]) {
              z = g.getNode(u, "mjx-under");
            }
            if (this.data[this.over]) {
              x = g.getNode(u, "mjx-over");
            }
            r[0] = s;
            r[1] = z || x;
            r[2] = x;
          } else {
            var w = ["mjx-op", "mjx-under", "mjx-over"];
            if (this.over === 1) {
              w[1] = w[2];
            }
            u = this.CHTMLdefaultNode(u, {
              childNodes: w,
              noBBox: true,
              forceChild: true,
              minChildren: 2
            });
            r[0] = s = u.removeChild(u.firstChild);
            r[1] = z = x = u.removeChild(u.firstChild);
            if (u.firstChild) {
              r[2] = x = u.removeChild(u.firstChild);
            }
          }
          var v = [],
              t = this.CHTMLgetBBoxes(v, r, C);
          var D = v[this.base],
              A = this.CHTML;
          A.w = t;
          A.h = D.h;
          A.d = D.d;
          var y = s,
              B = 0;
          if (D.ic) {
            B = 1.3 * D.ic + 0.05;
          }
          if (this.data[this.over]) {
            y = this.CHTMLaddOverscript(x, v, C, B, s, q);
          }
          if (this.data[this.under]) {
            this.CHTMLaddUnderscript(z, v, C, B, u, y, q);
          } else {
            if (!q) {
              u.appendChild(y);
            }
          }
          this.CHTMLplaceBoxes(s, z, x, C, v);
          return u;
        },
        CHTMLgetBBoxes: function(y, u, t) {
          var v,
              r = this.data.length,
              x,
              s = -m,
              q = s;
          for (v = 0; v < r; v++) {
            y[v] = this.CHTMLbboxFor(v);
            y[v].x = y[v].y = 0;
            if (this.data[v]) {
              y[v].stretch = this.data[v].CHTMLcanStretch("Horizontal");
            }
            x = (v === this.base ? 1 : y[v].rscale);
            if (v !== this.base) {
              delete y[v].L;
              delete y[v].R;
            }
            q = Math.max(q, x * (y[v].w + (y[v].L || 0) + (y[v].R || 0)));
            if (!y[v].stretch && q > s) {
              s = q;
            }
          }
          if (s === -m) {
            s = q;
          }
          for (v = 0; v < r; v++) {
            if (y[v].stretch) {
              x = (v === this.base ? 1 : y[v].rscale);
              y[v] = this.data[v].CHTMLstretchH(u[v].firstChild, s / x);
              y[v].x = y[v].y = 0;
              q = Math.max(q, x * (y[v].w + (y[v].L || 0) + (y[v].R || 0)));
            }
          }
          if (!y[this.base]) {
            y[this.base] = g.BBOX.empty();
          }
          return q;
        },
        CHTMLaddOverscript: function(z, x, D, C, r, q) {
          var B = this.CHTML;
          var w,
              v,
              u = g.TEX.big_op_spacing5,
              t;
          var y = x[this.over],
              E = x[this.base],
              s = y.rscale;
          if (!q) {
            var A = g.Element("mjx-stack");
            A.appendChild(z);
            A.appendChild(r);
          }
          if (y.D) {
            y.d = y.D;
          }
          if (y.d < 0) {
            z.firstChild.style.verticalAlign = "top";
            z.style.height = g.Em(y.h + y.d);
          }
          y.x = 0;
          if (D.accent) {
            if (y.w < 0.001) {
              y.x += (y.r - y.l) / 2;
            }
            t = g.TEX.rule_thickness;
            u = 0;
            if (E.skew) {
              y.x += s * E.skew;
              B.skew = s * E.skew;
              if (y.x + s * y.w > B.w) {
                B.skew += (B.w - (y.x + s * y.w)) / 2;
              }
            }
          } else {
            w = g.TEX.big_op_spacing1;
            v = g.TEX.big_op_spacing3;
            t = Math.max(w, v - Math.max(0, s * y.d));
          }
          y.x += C / 2;
          y.y = B.h + t + u + s * y.d;
          if (t) {
            z.style.paddingBottom = g.Em(t / s);
          }
          if (u) {
            z.style.paddingTop = g.Em(u / s);
          }
          return A;
        },
        CHTMLaddUnderscript: function(z, x, C, B, r, y, q) {
          var A = this.CHTML;
          var w,
              v,
              u = g.TEX.big_op_spacing5,
              t;
          var D = x[this.under],
              s = D.rscale;
          if (!q) {
            g.addElement(r, "mjx-itable", {}, [["mjx-row", {}, [["mjx-cell"]]], ["mjx-row"]]);
            r.firstChild.firstChild.firstChild.appendChild(y);
            r.firstChild.lastChild.appendChild(z);
          }
          if (D.D) {
            D.d = D.D;
          }
          if (D.d < 0) {
            z.firstChild.style.verticalAlign = "top";
            r.firstChild.style.marginBottom = g.Em(D.d);
          }
          if (C.accentunder) {
            t = 2 * g.TEX.rule_thickness;
            u = 0;
          } else {
            w = g.TEX.big_op_spacing2;
            v = g.TEX.big_op_spacing4;
            t = Math.max(w, v - s * D.h);
          }
          D.x = -B / 2;
          D.y = -(A.d + t + u + s * D.h);
          if (t) {
            z.style.paddingTop = g.Em(t / s);
          }
          if (u) {
            z.style.paddingBottom = g.Em(u / s);
          }
        },
        CHTMLplaceBoxes: function(q, z, y, C, x) {
          var r = this.CHTML.w,
              v,
              t = x.length,
              u;
          var B = g.BBOX.zero();
          B.scale = this.CHTML.scale;
          B.rscale = this.CHTML.rscale;
          x[this.base].x = x[this.base].y = 0;
          var D = m;
          for (v = 0; v < t; v++) {
            u = (v === this.base ? 1 : x[v].rscale);
            var A = u * (x[v].w + (x[v].L || 0) + (x[v].R || 0));
            x[v].x += {
              left: 0,
              center: (r - A) / 2,
              right: r - A
            }[C.align];
            if (x[v].x < D) {
              D = x[v].x;
            }
          }
          for (v = 0; v < t; v++) {
            if (this.data[v]) {
              u = (v === this.base ? 1 : x[v].rscale);
              if (x[v].x - D) {
                var s = (v === this.base ? q : v === this.over ? y : z);
                s.style.paddingLeft = g.Em((x[v].x - D) / u);
              }
              B.combine(x[v], x[v].x - D, x[v].y);
            }
          }
          this.CHTML = B;
        },
        CHTMLstretchV: h.mbase.CHTMLstretchV,
        CHTMLstretchH: h.mbase.CHTMLstretchH,
        CHTMLchildNode: function(s, r) {
          var q = ["mjx-op", "mjx-under", "mjx-over"];
          if (this.over === 1) {
            q[1] = q[2];
          }
          return g.getNode(s, q[r]);
        }
      });
      h.msubsup.Augment({
        toCommonHTML: function(R, X) {
          var A = this.getValues("displaystyle", "subscriptshift", "superscriptshift", "texprimestyle");
          var C,
              G,
              z;
          if (X) {
            if (this.data[this.base]) {
              C = g.getNode(R, "mjx-base");
            }
            if (this.data[this.sub]) {
              G = g.getNode(R, "mjx-sub");
            }
            if (this.data[this.sup]) {
              z = g.getNode(R, "mjx-sup");
            }
            D = g.getNode(R, "mjx-stack");
          } else {
            var J = ["mjx-base", "mjx-sub", "mjx-sup"];
            if (this.sup === 1) {
              J[1] = J[2];
            }
            R = this.CHTMLdefaultNode(R, {
              childNodes: J,
              noBBox: true,
              forceChild: true,
              minChildren: 3
            });
            C = R.childNodes[this.base];
            G = R.childNodes[this.sub];
            z = R.childNodes[this.sup];
            if (!this.CHTMLnotEmpty(this.data[this.sub])) {
              R.removeChild(G);
              G = null;
            }
            if (!this.CHTMLnotEmpty(this.data[this.sup])) {
              R.removeChild(z);
              z = null;
            }
            if (R.childNodes.length === 3) {
              var D = g.addElement(R, "mjx-stack");
              D.appendChild(z);
              D.appendChild(G);
            }
          }
          var E = [],
              F = g.BBOX.empty(this.CHTML);
          for (var U = 0,
              S = this.data.length; U < S; U++) {
            E[U] = this.CHTMLbboxFor(U);
          }
          var y = E[this.base] || g.BBOX.empty(),
              O = E[this.sub],
              V = E[this.sup];
          var B = (G ? O.rscale : 1),
              w = (z ? V.rscale : 1);
          F.combine(y, 0, 0);
          var W = g.TEX.x_height,
              M = g.TEX.scriptspace;
          var P = g.TEX.sup_drop * w,
              N = g.TEX.sub_drop * B;
          var K = y.h - P,
              I = y.d + N,
              Y = 0,
              Q;
          if (y.ic) {
            F.w -= y.ic;
            C.style.marginRight = g.Em(-y.ic);
            Y = 1.3 * y.ic + 0.05;
          }
          var T = this.data[this.base];
          if (T) {
            if ((T.type === "mrow" || T.type === "mstyle") && T.data.length === 1) {
              T = T.data[0];
            }
            if (T.type === "mi" || T.type === "mo") {
              if (T.data.join("").length === 1 && y.rscale === 1 && !y.sH && !T.Get("largeop")) {
                K = I = 0;
              }
            }
          }
          A.subscriptshift = (A.subscriptshift === "" ? 0 : this.CHTMLlength2em(A.subscriptshift));
          A.superscriptshift = (A.superscriptshift === "" ? 0 : this.CHTMLlength2em(A.superscriptshift));
          var H = F.w;
          if (G) {
            O.w += M;
          }
          if (z) {
            V.w += M;
          }
          if (!z) {
            if (G) {
              I = Math.max(I, g.TEX.sub1, B * O.h - (4 / 5) * W, A.subscriptshift);
              G.style.verticalAlign = g.Em(-I / B);
              G.style.paddingRight = g.Em(M / B);
              F.combine(O, H, -I);
            }
          } else {
            if (!G) {
              Q = g.TEX[(A.displaystyle ? "sup1" : (A.texprimestyle ? "sup3" : "sup2"))];
              K = Math.max(K, Q, w * V.d + (1 / 4) * W, A.superscriptshift);
              z.style.verticalAlign = g.Em(K / w);
              z.style.paddingLeft = g.Em(Y / w);
              z.style.paddingRight = g.Em(M / w);
              F.combine(V, H + Y, K);
            } else {
              I = Math.max(I, g.TEX.sub2);
              var L = g.TEX.rule_thickness;
              if ((K - w * V.d) - (B * O.h - I) < 3 * L) {
                I = 3 * L - K + w * V.d + B * O.h;
                P = (4 / 5) * W - (K - w * V.d);
                if (P > 0) {
                  K += P;
                  I -= P;
                }
              }
              K = Math.max(K, A.superscriptshift);
              I = Math.max(I, A.subscriptshift);
              G.style.paddingRight = g.Em(M / B);
              z.style.paddingBottom = g.Em(K / w + I / B - V.d - O.h / B * w);
              z.style.paddingLeft = g.Em(Y / w);
              z.style.paddingRight = g.Em(M / w);
              D.style.verticalAlign = g.Em(-I);
              F.combine(V, H + Y, K);
              F.combine(O, H, -I);
            }
          }
          F.clean();
          return R;
        },
        CHTMLstretchV: h.mbase.CHTMLstretchV,
        CHTMLstretchH: h.mbase.CHTMLstretchH,
        CHTMLchildNode: function(s, r) {
          var q = ["mjx-base", "mjx-sub", "mjx-sup"];
          if (this.over === 1) {
            q[1] = q[2];
          }
          return g.getNode(s, q[r]);
        }
      });
      h.mfrac.Augment({
        toCommonHTML: function(M) {
          M = this.CHTMLdefaultNode(M, {
            childNodes: ["mjx-numerator", "mjx-denominator"],
            forceChild: true,
            noBBox: true,
            minChildren: 2
          });
          var w = this.getValues("linethickness", "displaystyle", "numalign", "denomalign", "bevelled");
          var N = w.displaystyle;
          var C = M.firstChild,
              s = M.lastChild;
          var x = g.addElement(M, "mjx-box");
          x.appendChild(C);
          x.appendChild(s);
          M.appendChild(x);
          if (w.numalign !== "center") {
            C.style.textAlign = w.numalign;
          }
          if (w.denomalign !== "center") {
            s.style.textAlign = w.denomalign;
          }
          var O = this.CHTMLbboxFor(0),
              A = this.CHTMLbboxFor(1),
              B = g.BBOX.empty(this.CHTML),
              E = O.rscale,
              y = A.rscale;
          w.linethickness = Math.max(0, g.thickness2em(w.linethickness || "0", B.scale));
          var L = g.TEX.min_rule_thickness / g.em,
              S = g.TEX.axis_height;
          var I = w.linethickness,
              K,
              J,
              G,
              F;
          if (w.bevelled) {
            x.className += " MJXc-bevelled";
            var R = (N ? 0.4 : 0.15);
            var D = Math.max(E * (O.h + O.d), y * (A.h + A.d)) + 2 * R;
            var Q = g.Element("mjx-bevel");
            x.insertBefore(Q, s);
            var r = g.createDelimiter(Q, 47, D);
            G = E * (O.d - O.h) / 2 + S + R;
            F = y * (A.d - A.h) / 2 + S - R;
            if (G) {
              C.style.verticalAlign = g.Em(G / E);
            }
            if (F) {
              s.style.verticalAlign = g.Em(F / y);
            }
            Q.style.marginLeft = Q.style.marginRight = g.Em(-R / 2);
            B.combine(O, 0, G);
            B.combine(r, E * O.w - R / 2, 0);
            B.combine(A, E * O.w + r.w - R, F);
            B.clean();
          } else {
            x.className += " MJXc-stacked";
            if (N) {
              G = g.TEX.num1;
              F = g.TEX.denom1;
            } else {
              G = (I === 0 ? g.TEX.num3 : g.TEX.num2);
              F = g.TEX.denom2;
            }
            if (I === 0) {
              K = Math.max((N ? 7 : 3) * g.TEX.rule_thickness, 2 * L);
              J = (G - O.d * E) - (A.h * y - F);
              if (J < K) {
                G += (K - J) / 2;
                F += (K - J) / 2;
              }
            } else {
              K = Math.max((N ? 2 : 0) * L + I, I / 2 + 1.5 * L);
              I = Math.max(I, L);
              J = (G - O.d * E) - (S + I / 2);
              if (J < K) {
                G += (K - J);
              }
              J = (S - I / 2) - (A.h * y - F);
              if (J < K) {
                F += (K - J);
              }
              O.L = O.R = A.L = A.R = 0.1;
              var z = g.addElement(x, "mjx-line", {style: {
                  "border-bottom": g.Px(I * B.scale, 1) + " solid",
                  top: g.Em(-I / 2 - S)
                }});
            }
            B.combine(O, 0, G);
            B.combine(A, 0, -F);
            B.clean();
            x.style.width = g.Em(B.w);
            C.style.width = g.Em(B.w / E);
            s.style.width = g.Em(B.w / y);
            if (z) {
              z.style.width = x.style.width;
            }
            C.style.top = g.Em(-B.h / E);
            s.style.bottom = g.Em(-B.d / y);
            g.addElement(M, "mjx-vsize", {style: {
                height: g.Em(B.h + B.d),
                verticalAlign: g.Em(-B.d)
              }});
          }
          if (!this.texWithDelims && !this.useMMLspacing) {
            var P = g.TEX.nulldelimiterspace;
            x.style.padding = "0 " + g.Em(P);
            B.l += P;
            B.r += P;
            B.w += 2 * P;
          }
          return M;
        },
        CHTMLcanStretch: function(q) {
          return false;
        }
      });
      h.msqrt.Augment({
        toCommonHTML: function(v) {
          v = this.CHTMLdefaultNode(v, {
            childNodes: ["mjx-box", "mjx-root"],
            forceChild: true,
            noBBox: true
          });
          var u = v.firstChild || g.Element("mjx-box");
          var D = g.addElement(v, "mjx-box");
          D.appendChild(u);
          var E = this.CHTMLbboxFor(0),
              B = g.BBOX.empty(this.CHTML);
          var F = g.TEX.rule_thickness,
              w = g.TEX.surd_height,
              s = F,
              r,
              C;
          if (this.Get("displaystyle")) {
            s = g.TEX.x_height;
          }
          r = F + s / 4;
          C = E.h + E.d + r + F;
          var y = g.Element("mjx-surd");
          D.insertBefore(y, u);
          var z = g.createDelimiter(y, 8730, [C - 0.04, C]);
          if (z.h + z.d > C) {
            r = ((z.h + z.d) - (C - F)) / 2;
          }
          C = E.h + r + F;
          var A = this.CHTMLaddRoot(v, z, z.h + z.d - C);
          u.style.paddingTop = g.Em(r);
          u.style.borderTop = g.Px(w * E.scale, 1) + " solid";
          D.style.paddingTop = g.Em(2 * F - w);
          E.h += r + 2 * F;
          B.combine(z, A, C - z.h);
          B.combine(E, A + z.w, 0);
          B.clean();
          return v;
        },
        CHTMLaddRoot: function() {
          return 0;
        }
      });
      h.mroot.Augment({
        toCommonHTML: h.msqrt.prototype.toCommonHTML,
        CHTMLaddRoot: function(y, s, t) {
          if (!this.data[1]) {
            return;
          }
          var x = this.CHTML,
              z = this.data[1].CHTML,
              u = y.firstChild;
          var q = z.rscale;
          var r = this.CHTMLrootHeight(z, s, q) - t;
          var v = Math.min(z.w, z.r);
          var A = Math.max(v, s.offset / q);
          if (r) {
            u.style.verticalAlign = g.Em(r / q);
          }
          if (A > v) {
            u.firstChild.style.paddingLeft = g.Em(A - v);
          }
          A -= s.offset / q;
          u.style.width = g.Em(A);
          x.combine(z, 0, r);
          return A * q;
        },
        CHTMLrootHeight: function(s, q, r) {
          return 0.45 * (q.h + q.d - 0.9) + q.offset + Math.max(0, s.d - 0.075);
        }
      });
      h.mfenced.Augment({toCommonHTML: function(t) {
          t = this.CHTMLcreateNode(t);
          this.CHTMLhandleStyle(t);
          this.CHTMLhandleScale(t);
          this.CHTMLaddChild(t, "open", {});
          for (var s = 0,
              q = this.data.length; s < q; s++) {
            this.CHTMLaddChild(t, "sep" + s, {});
            this.CHTMLaddChild(t, s, {});
          }
          this.CHTMLaddChild(t, "close", {});
          var r = this.CHTML.h,
              u = this.CHTML.d;
          this.CHTMLstretchChildV("open", r, u);
          for (s = 0, q = this.data.length; s < q; s++) {
            this.CHTMLstretchChildV("sep" + s, r, u);
            this.CHTMLstretchChildV(s, r, u);
          }
          this.CHTMLstretchChildV("close", r, u);
          this.CHTMLhandleSpace(t);
          this.CHTMLhandleBBox(t);
          this.CHTMLhandleColor(t);
          return t;
        }});
      h.mrow.Augment({
        toCommonHTML: function(t) {
          t = this.CHTMLdefaultNode(t);
          var w = this.CHTML,
              s = w.h,
              u = w.d,
              v;
          for (var r = 0,
              q = this.data.length; r < q; r++) {
            this.CHTMLstretchChildV(r, s, u);
            if (this.data[r] && this.data[r].CHTML && this.data[r].CHTML.w < 0) {
              v = true;
            }
          }
          if (this.CHTMLlineBreaks()) {
            this.CHTMLmultiline(t);
          } else {
            if (v && w.w) {
              t.style.width = g.Em(Math.max(0, w.w));
            }
            if (w.w < 0) {
              t.style.marginRight = g.Em(w.w);
            }
          }
          return t;
        },
        CHTMLlineBreaks: function() {
          if (!this.parent.linebreakContainer) {
            return false;
          }
          return (k.automatic && this.CHTML.w > g.linebreakWidth) || this.hasNewline();
        },
        CHTMLstretchV: function(q, r) {
          this.CHTMLstretchChildV(this.CoreIndex(), q, r);
          return this.CHTML;
        },
        CHTMLstretchH: function(r, q) {
          this.CHTMLstretchChildH(this.CoreIndex(), q, r);
          return this.CHTML;
        }
      });
      h.mstyle.Augment({toCommonHTML: function(q) {
          q = this.CHTMLdefaultNode(q);
          if (this.scriptlevel && this.data[0]) {
            this.CHTML.rescale(this.data[0].CHTML.rscale);
          }
          return q;
        }});
      h.TeXAtom.Augment({
        toCommonHTML: function(u, s) {
          if (!s) {
            u = this.CHTMLdefaultNode(u);
          }
          if (this.texClass === h.TEXCLASS.VCENTER) {
            var q = g.TEX.axis_height,
                t = this.CHTML;
            var r = q - (t.h + t.d) / 2 + t.d;
            if (Math.abs(r) > 0.001) {
              u.style.verticalAlign = g.Em(r);
              t.h += r;
              t.t += r;
              t.d -= r;
              t.b -= r;
            }
          }
          return u;
        },
        CHTMLstretchV: function(q, r) {
          this.CHTML.updateFrom(this.Core().CHTMLstretchV(q, r));
          this.toCommonHTML(this.CHTMLnodeElement(), true);
          return this.CHTML;
        },
        CHTMLstretchH: function(r, q) {
          this.CHTML.updateFrom(this.CHTMLstretchCoreH(r, q));
          this.toCommonHTML(r, true);
          return this.CHTML;
        }
      });
      h.semantics.Augment({toCommonHTML: function(q) {
          q = this.CHTMLcreateNode(q);
          if (this.data[0]) {
            this.data[0].toCommonHTML(q);
            this.CHTML.updateFrom(this.data[0].CHTML);
          }
          return q;
        }});
      h.annotation.Augment({toCommonHTML: function(q) {
          return this.CHTMLcreateNode(q);
        }});
      h["annotation-xml"].Augment({toCommonHTML: h.mbase.CHTMLautoload});
      h.ms.Augment({toCommonHTML: h.mbase.CHTMLautoload});
      h.mglyph.Augment({toCommonHTML: h.mbase.CHTMLautoload});
      h.menclose.Augment({toCommonHTML: h.mbase.CHTMLautoload});
      h.maction.Augment({toCommonHTML: h.mbase.CHTMLautoload});
      h.mmultiscripts.Augment({toCommonHTML: h.mbase.CHTMLautoload});
      h.mtable.Augment({toCommonHTML: h.mbase.CHTMLautoload});
      MathJax.Hub.Register.StartupHook("onLoad", function() {
        setTimeout(MathJax.Callback(["loadComplete", g, "jax.js"]), 0);
      });
    });
    MathJax.Hub.Register.StartupHook("End Cookie", function() {
      if (c.config.menuSettings.zoom !== "None") {
        i.Require("[MathJax]/extensions/MathZoom.js");
      }
    });
  })(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.CommonHTML);
  MathJax.Hub.Register.StartupHook("CommonHTML Jax Ready", function() {
    var g = "2.6.0";
    var b = MathJax.ElementJax.mml,
        a = MathJax.Hub.config,
        e = MathJax.OutputJax.CommonHTML,
        d = MathJax.Hub.SplitList;
    var c = -1,
        f = 1000000;
    b.mtable.Augment({
      toCommonHTML: function(l) {
        var m = {
          rows: [],
          labels: [],
          labeled: false
        };
        l = this.CHTMLdefaultNode(l, {
          noBBox: true,
          childOptions: m
        });
        var k = e.Element("mjx-table");
        while (l.firstChild) {
          k.appendChild(l.firstChild);
        }
        l.appendChild(k);
        var h = this.getValues("columnalign", "rowalign", "columnspacing", "rowspacing", "columnwidth", "equalcolumns", "equalrows", "columnlines", "rowlines", "frame", "framespacing", "align", "width", "side", "minlabelspacing", "useHeight");
        var j = e.TEX.min_rule_thickness / e.em;
        m.t = e.Px(j * this.CHTML.scale, 1);
        this.CHTMLgetBoxSizes(h, m);
        this.CHTMLgetAttributes(h, m);
        if (h.equalrows) {
          m.HD = true;
          m.HH = Math.max.apply(Math, m.H);
          m.DD = Math.max.apply(Math, m.D);
        }
        this.CHTMLadjustCells(h, m);
        if (h.frame) {
          k.style.border = m.t + " " + h.frame;
        }
        this.CHTMLalignV(h, m, l);
        this.CHTMLcolumnWidths(h, m, l);
        this.CHTMLstretchCells(h, m);
        if (m.labeled) {
          this.CHTMLaddLabels(h, m, l, k);
        }
        var i = this.CHTML;
        i.w = i.r = m.R;
        i.h = i.t = m.T - m.B;
        i.d = i.b = m.B;
        if (!h.frame && !i.pwidth) {
          l.style.padding = "0 " + e.Em(1 / 6);
          i.L = i.R = 1 / 6;
        }
        this.CHTMLhandleSpace(l);
        this.CHTMLhandleBBox(l);
        this.CHTMLhandleColor(l);
        return l;
      },
      CHTMLgetBoxSizes: function(x, k) {
        var q = e.FONTDATA.lineH * x.useHeight,
            r = e.FONTDATA.lineD * x.useHeight;
        var w = [],
            h = [],
            l = [],
            v = -1;
        for (var p = 0,
            n = this.data.length; p < n; p++) {
          var z = this.data[p],
              y = (z.type === "mtr" ? 0 : c);
          w[p] = q;
          h[p] = r;
          for (var o = y,
              u = z.data.length + y; o < u; o++) {
            if (l[o] == null) {
              l[o] = -f;
              if (o > v) {
                v = o;
              }
            }
            var t = z.data[o - y].CHTML;
            if (t.h > w[p]) {
              w[p] = t.h;
            }
            if (t.d > h[p]) {
              h[p] = t.d;
            }
            if (t.w > l[o]) {
              l[o] = t.w;
            }
          }
        }
        k.H = w;
        k.D = h;
        k.W = l, k.J = v;
      },
      CHTMLgetAttributes: function(v, j) {
        var l = d(v.columnspacing),
            x = d(v.rowspacing),
            t = d(v.columnalign),
            r = d(v.rowalign),
            k = d(v.columnlines),
            w = d(v.rowlines),
            o = d(v.columnwidth),
            n = [],
            q,
            p,
            u = j.J,
            s = j.rows.length - 1;
        for (q = 0, p = l.length; q < p; q++) {
          l[q] = this.CHTMLlength2em(l[q]);
        }
        for (q = 0, p = x.length; q < p; q++) {
          x[q] = this.CHTMLlength2em(x[q]);
        }
        while (l.length < u) {
          l.push(l[l.length - 1]);
        }
        while (t.length <= u) {
          t.push(t[t.length - 1]);
        }
        while (k.length < u) {
          k.push(k[k.length - 1]);
        }
        while (o.length <= u) {
          o.push(o[o.length - 1]);
        }
        while (x.length < s) {
          x.push(x[x.length - 1]);
        }
        while (r.length <= s) {
          r.push(r[r.length - 1]);
        }
        while (w.length < s) {
          w.push(w[w.length - 1]);
        }
        t[c] = (v.side.substr(0, 1) === "l" ? "left" : "right");
        for (q = 0; q <= s; q++) {
          var y = this.data[q];
          n[q] = [];
          if (y.rowalign) {
            r[q] = y.rowalign;
          }
          if (y.columnalign) {
            n[q] = d(y.columnalign);
            while (n[q].length <= u) {
              n[q].push(n[q][n[q].length - 1]);
            }
          }
        }
        var h = d(v.framespacing);
        if (h.length != 2) {
          h = d(this.defaults.framespacing);
        }
        h[0] = Math.max(0, this.CHTMLlength2em(h[0]));
        h[1] = Math.max(0, this.CHTMLlength2em(h[1]));
        if (v.columnlines.replace(/none/g, "").replace(/ /g, "") !== "" || v.rowlines.replace(/none/g, "").replace(/ /g, "") !== "") {
          v.fspace = true;
        }
        if (v.frame === b.LINES.NONE) {
          delete v.frame;
        } else {
          v.fspace = true;
        }
        if (v.frame) {
          h[0] = Math.max(0, h[0]);
          h[1] = Math.max(0, h[1]);
        }
        if (v.fspace) {
          l[u] = h[0];
          x[s] = h[1];
        } else {
          l[u] = x[s] = 0;
        }
        k[u] = w[s] = b.LINES.NONE;
        j.CSPACE = l;
        j.RSPACE = x;
        j.CALIGN = t;
        j.RALIGN = r;
        j.CLINES = k;
        j.RLINES = w;
        j.CWIDTH = o;
        j.RCALIGN = n;
        j.FSPACE = h;
      },
      CHTMLadjustCells: function(h, p) {
        var J = p.rows,
            N = p.CSPACE,
            l = p.CLINES,
            u = p.RSPACE,
            A = p.RLINES,
            K = p.CALIGN,
            o = p.RALIGN,
            C = p.RCALIGN;
        N[p.J] *= 2;
        u[J.length - 1] *= 2;
        var v = e.FONTDATA.lineH * h.useHeight,
            y = e.FONTDATA.lineD * h.useHeight;
        var n = "0",
            D,
            q,
            x,
            F,
            k,
            H;
        if (h.fspace) {
          n = e.Em(p.FSPACE[1]);
        }
        for (var I = 0,
            E = J.length; I < E; I++) {
          var t = J[I],
              r = this.data[I];
          D = u[I] / 2;
          F = null;
          x = "0";
          if (A[I] !== b.LINES.NONE) {
            F = p.t + " " + A[I];
            D -= 1 / e.em / 2;
          }
          D = e.Em(Math.max(0, D));
          if (h.fspace) {
            x = e.Em(p.FSPACE[0]);
          }
          for (var G = 0,
              w = t.length; G < w; G++) {
            var z = (r.type === "mtr" ? 0 : c);
            cell = t[G].style;
            k = r.data[G - z].CHTML;
            q = N[G] / 2;
            if (l[G] !== b.LINES.NONE) {
              cell.borderRight = p.t + " " + l[G];
              q -= 1 / e.em / 2;
            }
            q = e.Em(Math.max(0, q));
            cell.padding = n + " " + q + " " + D + " " + x;
            if (F) {
              cell.borderBottom = F;
            }
            x = q;
            H = (r.data[G - z].rowalign || this.data[I].rowalign || o[I]);
            H = ({
              top: "top",
              bottom: "bottom",
              center: "middle"
            })[H];
            if (H) {
              cell.verticalAlign = H;
            }
            H = (r.data[G - z].columnalign || C[I][G] || K[G]);
            if (H !== b.ALIGN.CENTER) {
              cell.textAlign = H;
            }
            if (p.HD && G === 0) {
              e.addElement(t[G].parentNode, "mjx-mtd", {style: {padding: n + " 0 " + D}}, [["mjx-box", {style: {
                  height: e.Em(p.HH + p.DD),
                  "vertical-align": e.Em(-p.DD)
                }}]]);
            }
            cell = t[G].firstChild.style;
            if (k.h < v) {
              cell.marginTop = e.Em(v - k.h);
            }
            if (k.d < y) {
              cell.marginBottom = e.Em(y - k.d);
            }
          }
          n = D;
        }
        N[p.J] /= 2;
        u[J.length - 1] /= 2;
      },
      CHTMLalignV: function(w, k, o) {
        var m,
            t = k.rows.length,
            v = k.H,
            j = k.D,
            x = k.RSPACE;
        if (typeof(w.align) !== "string") {
          w.align = String(w.align);
        }
        if (w.align.match(/(top|bottom|center|baseline|axis)( +(-?\d+))?/)) {
          m = parseInt(RegExp.$3 || "0");
          w.align = RegExp.$1;
          if (m < 0) {
            m += k.rows.length + 1;
          }
          if (m > t || m <= 0) {
            m = null;
          }
        } else {
          w.align = this.defaults.align;
        }
        var p = 0,
            l = 0,
            u = e.TEX.axis_height;
        if (w.fspace) {
          p += k.FSPACE[1];
        }
        if (w.frame) {
          p += 2 / e.em;
          l += 1 / e.em;
        }
        var r = k.HH,
            s = k.DD;
        for (var q = 0; q < t; q++) {
          if (!k.HD) {
            r = v[q];
            s = j[q];
          }
          p += r + s + x[q];
          if (m) {
            if (q === m - 1) {
              l += ({
                top: r + s,
                bottom: 0,
                center: (r + s) / 2,
                baseline: s,
                axis: u + s
              })[w.align] + x[q];
            }
            if (q >= m) {
              l += r + s + x[q];
            }
          }
        }
        if (!m) {
          l = ({
            top: p,
            bottom: 0,
            center: p / 2,
            baseline: p / 2,
            axis: p / 2 - u
          })[w.align];
        }
        if (l) {
          o.style.verticalAlign = e.Em(-l);
        }
        k.T = p;
        k.B = l;
      },
      CHTMLcolumnWidths: function(l, r, A) {
        var I = r.CWIDTH,
            K = r.CSPACE,
            u = r.J,
            F;
        var G = 0,
            n = false,
            y = l.width.match(/%$/);
        var H,
            B,
            v;
        if (l.width !== "auto" && !y) {
          G = Math.max(0, this.CHTMLlength2em(l.width, r.R));
          n = true;
        }
        if (l.equalcolumns) {
          if (y) {
            var z = e.Percent(1 / (u + 1));
            for (F = 0; F <= u; F++) {
              I[F] = z;
            }
          } else {
            v = Math.max.apply(Math, r.W);
            if (l.width !== "auto") {
              var q = (l.fspace ? r.FSPACE[0] + (l.frame ? 2 / e.em : 0) : 0);
              for (F = 0; F <= u; F++) {
                q += K[F];
              }
              v = Math.max((G - q) / (u + 1), v);
            }
            v = e.Em(v);
            for (F = 0; F <= u; F++) {
              I[F] = v;
            }
          }
          n = true;
        }
        var E = 0;
        if (l.fspace) {
          E = r.FSPACE[0];
        }
        var s = [],
            D = [],
            h = [],
            o = [];
        var t = r.rows[0];
        for (F = 0; F <= u; F++) {
          o[F] = r.W[F];
          if (I[F] === "auto") {
            s.push(F);
          } else {
            if (I[F] === "fit") {
              D.push(F);
            } else {
              if (I[F].match(/%$/)) {
                h.push(F);
              } else {
                o[F] = this.CHTMLlength2em(I[F], o[F]);
              }
            }
          }
          E += o[F] + K[F];
          if (t[F]) {
            t[F].style.width = e.Em(o[F]);
          }
        }
        if (l.frame) {
          E += 2 / e.em;
        }
        var C = (D.length > 0);
        if (n) {
          if (y) {
            for (F = 0; F <= u; F++) {
              cell = t[F].style;
              if (I[F] === "auto" && !C) {
                cell.width = "";
              } else {
                if (I[F] === "fit") {
                  cell.width = "";
                } else {
                  if (I[F].match(/%$/)) {
                    cell.width = I[F];
                  } else {
                    cell.minWidth = cell.maxWidth = cell.width;
                  }
                }
              }
            }
          } else {
            if (G > E) {
              var k = 0;
              for (H = 0, B = h.length; H < B; H++) {
                F = h[H];
                v = Math.max(o[F], this.CHTMLlength2em(I[F], G));
                k += v - o[F];
                o[F] = v;
                t[F].style.width = e.Em(v);
              }
              E += k;
            }
            if (!C) {
              D = s;
            }
            if (G > E && D.length) {
              var x = (G - E) / D.length;
              for (H = 0, B = D.length; H < B; H++) {
                F = D[H];
                o[F] += x;
                t[F].style.width = e.Em(o[F]);
              }
              E = G;
            }
          }
        }
        o[c] = r.W[c];
        r.W = o;
        r.R = E;
        if (y) {
          this.CHTML.pwidth = l.width;
          this.CHTML.mwidth = e.Em(E);
          A.style.width = A.firstChild.style.width = "100%";
        }
      },
      CHTMLstretchCells: function(x, l) {
        var y = l.rows,
            w = l.H,
            k = l.D,
            m = l.W,
            t = l.J,
            s = y.length - 1;
        var p = l.HH,
            r = l.DD;
        for (var o = 0; o <= s; o++) {
          var z = y[o],
              q = this.data[o];
          if (!l.HD) {
            p = w[o];
            r = k[o];
          }
          for (var n = 0; n <= t; n++) {
            var v = z[n],
                u = q.data[n];
            if (!u) {
              continue;
            }
            if (u.CHTML.stretch === "V") {
              u.CHTMLstretchV(p, r);
            } else {
              if (u.CHTML.stretch === "H") {
                u.CHTMLstretchH(v, m[n]);
              }
            }
          }
        }
      },
      CHTMLaddLabels: function(j, l, A, I) {
        var u = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
        if (u.indentalignfirst !== b.INDENTALIGN.INDENTALIGN) {
          u.indentalign = u.indentalignfirst;
        }
        if (u.indentalign === b.INDENTALIGN.AUTO) {
          u.indentalign = a.displayAlign;
        }
        if (u.indentshiftfirst !== b.INDENTSHIFT.INDENTSHIFT) {
          u.indentshift = u.indentshiftfirst;
        }
        if (u.indentshift === "auto") {
          u.indentshift = "0";
        }
        var F = this.CHTMLlength2em(u.indentshift, e.cwidth);
        var G = this.CHTMLlength2em(j.minlabelspacing, 0.8);
        var t = G + l.W[c],
            C = 0,
            L = l.R;
        var p = this.CHTMLlength2em(a.displayIndent, e.cwidth);
        var x = (l.CALIGN[c] === b.INDENTALIGN.RIGHT ? -1 : 1);
        if (u.indentalign === b.INDENTALIGN.CENTER) {
          L += 2 * (t - x * (F + p));
          F += p;
        } else {
          if (l.CALIGN[c] === u.indentalign) {
            if (p < 0) {
              C = x * p;
              p = 0;
            }
            F += x * p;
            if (t > x * F) {
              F = x * t;
            }
            F += C;
            F *= x;
            L += F;
          } else {
            L += t - x * F + p;
            F -= x * p;
            F *= -x;
          }
        }
        var q = e.addElement(A, "mjx-box", {style: {
            width: "100%",
            "text-align": u.indentalign
          }});
        q.appendChild(I);
        var K = e.Element("mjx-stack");
        I.style.display = "inline-table";
        if (!I.style.width) {
          I.style.width = "auto";
        }
        K.style.verticalAlign = "top";
        I.style.verticalAlign = e.Em(l.T - l.B - l.H[0]);
        A.style.verticalAlign = "";
        if (F) {
          if (u.indentalign === b.INDENTALIGN.CENTER) {
            I.style.marginLeft = e.Em(F);
            I.style.marginRight = e.Em(-F);
          } else {
            var y = "margin" + (u.indentalign === b.INDENTALIGN.RIGHT ? "Right" : "Left");
            I.style[y] = e.Em(F);
          }
        }
        if (l.CALIGN[c] === "left") {
          A.insertBefore(K, q);
          K.style.marginRight = e.Em(-l.W[c] - C);
          if (C) {
            K.style.marginLeft = e.Em(C);
          }
        } else {
          A.appendChild(K);
          K.style.marginLeft = e.Em(-l.W[c] + C);
        }
        var o = l.labels,
            k = 0,
            r = l.H,
            w = l.D,
            n = l.RSPACE;
        if (j.fspace) {
          k = l.FSPACE[0] + (j.frame ? 1 / e.em : 0);
        }
        var E = l.HH,
            J = l.DD;
        for (var B = 0,
            z = o.length; B < z; B++) {
          if (!l.HD) {
            E = r[B];
            J = w[B];
          }
          if (o[B] && this.data[B].data[0]) {
            K.appendChild(o[B]);
            var v = this.data[B].data[0].CHTML;
            k += E - v.h;
            if (k) {
              o[B].style.marginTop = e.Em(k);
            }
            k = J - v.d;
          } else {
            k += E + J;
          }
          k += n[B];
        }
        A.style.width = this.CHTML.pwidth = "100%";
        A.style.minWidth = this.CHTML.mwidth = e.Em(Math.max(0, L));
      }
    });
    b.mtr.Augment({toCommonHTML: function(l, j) {
        l = this.CHTMLcreateNode(l);
        this.CHTMLhandleStyle(l);
        this.CHTMLhandleScale(l);
        if (!j) {
          j = {
            rows: [],
            labels: []
          };
        }
        var n = [];
        j.rows.push(n);
        j.labels.push(null);
        for (var k = 0,
            h = this.data.length; k < h; k++) {
          n.push(this.CHTMLaddChild(l, k, j));
        }
        this.CHTMLhandleColor(l);
        return l;
      }});
    b.mlabeledtr.Augment({toCommonHTML: function(n, k) {
        n = this.CHTMLcreateNode(n);
        this.CHTMLhandleStyle(n);
        this.CHTMLhandleScale(n);
        if (!k) {
          k = {
            rows: [],
            labels: []
          };
        }
        var o = [];
        k.rows.push(o);
        var j = e.Element("mjx-label");
        k.labels.push(j);
        this.CHTMLaddChild(j, 0, k);
        if (this.data[0]) {
          k.labeled = true;
        }
        for (var l = 1,
            h = this.data.length; l < h; l++) {
          o.push(this.CHTMLaddChild(n, l, k));
        }
        this.CHTMLhandleColor(n);
        return n;
      }});
    b.mtd.Augment({toCommonHTML: function(l, i) {
        l = this.CHTMLdefaultNode(l, i);
        if (this.isEmbellished()) {
          var m = this.CoreMO(),
              h = this.CHTML;
          if (m.CHTMLcanStretch("Vertical")) {
            h.stretch = "V";
          } else {
            if (m.CHTMLcanStretch("Horizontal")) {
              h.stretch = "H";
            }
          }
          if (h.stretch) {
            var j = m.Get("minsize", true);
            if (j) {
              if (h.stretch === "V") {
                var n = h.h + h.d;
                if (n) {
                  var k = this.CHTMLlength2em(j, n) / n;
                  if (k > 1) {
                    h.h *= k;
                    h.d *= k;
                  }
                }
              } else {
                h.w = Math.max(h.w, this.CHTMLlength2em(j, h.w));
              }
            }
          }
        }
        return l;
      }});
    MathJax.Hub.Startup.signal.Post("CommonHTML mtable Ready");
    MathJax.Ajax.loadComplete(e.autoloadDir + "/mtable.js");
  });
  (function(i, b, e, g) {
    var h;
    var j,
        a,
        d;
    var f = "'Times New Roman',Times,STIXGeneral,serif";
    var m = {
      ".MJXp-script": {"font-size": ".8em"},
      ".MJXp-right": {
        "-webkit-transform-origin": "right",
        "-moz-transform-origin": "right",
        "-ms-transform-origin": "right",
        "-o-transform-origin": "right",
        "transform-origin": "right"
      },
      ".MJXp-bold": {"font-weight": "bold"},
      ".MJXp-italic": {"font-style": "italic"},
      ".MJXp-scr": {"font-family": "MathJax_Script," + f},
      ".MJXp-frak": {"font-family": "MathJax_Fraktur," + f},
      ".MJXp-sf": {"font-family": "MathJax_SansSerif," + f},
      ".MJXp-cal": {"font-family": "MathJax_Caligraphic," + f},
      ".MJXp-mono": {"font-family": "MathJax_Typewriter," + f},
      ".MJXp-largeop": {"font-size": "150%"},
      ".MJXp-largeop.MJXp-int": {"vertical-align": "-.2em"},
      ".MJXp-math": {
        display: "inline-block",
        "line-height": "1.2",
        "text-indent": "0",
        "font-family": f,
        "white-space": "nowrap",
        "border-collapse": "collapse"
      },
      ".MJXp-display": {
        display: "block",
        "text-align": "center",
        margin: "1em 0"
      },
      ".MJXp-math span": {display: "inline-block"},
      ".MJXp-box": {
        display: "block!important",
        "text-align": "center"
      },
      ".MJXp-box:after": {content: '" "'},
      ".MJXp-rule": {
        display: "block!important",
        "margin-top": ".1em"
      },
      ".MJXp-char": {display: "block!important"},
      ".MJXp-mo": {margin: "0 .15em"},
      ".MJXp-mfrac": {
        margin: "0 .125em",
        "vertical-align": ".25em"
      },
      ".MJXp-denom": {
        display: "inline-table!important",
        width: "100%"
      },
      ".MJXp-denom > *": {display: "table-row!important"},
      ".MJXp-surd": {"vertical-align": "top"},
      ".MJXp-surd > *": {display: "block!important"},
      ".MJXp-script-box > * ": {
        display: "table!important",
        height: "50%"
      },
      ".MJXp-script-box > * > *": {
        display: "table-cell!important",
        "vertical-align": "top"
      },
      ".MJXp-script-box > *:last-child > *": {"vertical-align": "bottom"},
      ".MJXp-script-box > * > * > *": {display: "block!important"},
      ".MJXp-mphantom": {visibility: "hidden"},
      ".MJXp-munderover": {display: "inline-table!important"},
      ".MJXp-over": {
        display: "inline-block!important",
        "text-align": "center"
      },
      ".MJXp-over > *": {display: "block!important"},
      ".MJXp-munderover > *": {display: "table-row!important"},
      ".MJXp-mtable": {
        "vertical-align": ".25em",
        margin: "0 .125em"
      },
      ".MJXp-mtable > *": {
        display: "inline-table!important",
        "vertical-align": "middle"
      },
      ".MJXp-mtr": {display: "table-row!important"},
      ".MJXp-mtd": {
        display: "table-cell!important",
        "text-align": "center",
        padding: ".5em 0 0 .5em"
      },
      ".MJXp-mtr > .MJXp-mtd:first-child": {"padding-left": 0},
      ".MJXp-mtr:first-child > .MJXp-mtd": {"padding-top": 0},
      ".MJXp-mlabeledtr": {display: "table-row!important"},
      ".MJXp-mlabeledtr > .MJXp-mtd:first-child": {"padding-left": 0},
      ".MJXp-mlabeledtr:first-child > .MJXp-mtd": {"padding-top": 0},
      ".MJXp-merror": {
        "background-color": "#FFFF88",
        color: "#CC0000",
        border: "1px solid #CC0000",
        padding: "1px 3px",
        "font-style": "normal",
        "font-size": "90%"
      }
    };
    (function() {
      for (var n = 0; n < 10; n++) {
        var o = "scaleX(." + n + ")";
        m[".MJXp-scale" + n] = {
          "-webkit-transform": o,
          "-moz-transform": o,
          "-ms-transform": o,
          "-o-transform": o,
          transform: o
        };
      }
    })();
    var k = 1000000;
    var c = "V",
        l = "H";
    g.Augment({
      settings: b.config.menuSettings,
      config: {styles: m},
      hideProcessedMath: false,
      maxStretchyParts: 1000,
      Config: function() {
        if (!this.require) {
          this.require = [];
        }
        this.SUPER(arguments).Config.call(this);
        var n = this.settings;
        if (n.scale) {
          this.config.scale = n.scale;
        }
        this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
      },
      Startup: function() {
        j = MathJax.Extension.MathEvents.Event;
        a = MathJax.Extension.MathEvents.Touch;
        d = MathJax.Extension.MathEvents.Hover;
        this.ContextMenu = j.ContextMenu;
        this.Mousedown = j.AltContextMenu;
        this.Mouseover = d.Mouseover;
        this.Mouseout = d.Mouseout;
        this.Mousemove = d.Mousemove;
        var n = e.addElement(document.body, "div", {style: {width: "5in"}});
        this.pxPerInch = n.offsetWidth / 5;
        n.parentNode.removeChild(n);
        return i.Styles(this.config.styles, ["InitializePHTML", this]);
      },
      InitializePHTML: function() {},
      preTranslate: function(p) {
        var s = p.jax[this.id],
            t,
            q = s.length,
            u,
            r,
            v,
            o,
            n;
        for (t = 0; t < q; t++) {
          u = s[t];
          if (!u.parentNode) {
            continue;
          }
          r = u.previousSibling;
          if (r && String(r.className).match(/^MathJax_PHTML(_Display)?( MathJax_Processing)?$/)) {
            r.parentNode.removeChild(r);
          }
          n = u.MathJax.elementJax;
          if (!n) {
            continue;
          }
          n.PHTML = {display: (n.root.Get("display") === "block")};
          v = o = e.Element("span", {
            className: "MathJax_PHTML",
            id: n.inputID + "-Frame",
            isMathJax: true,
            jaxID: this.id,
            oncontextmenu: j.Menu,
            onmousedown: j.Mousedown,
            onmouseover: j.Mouseover,
            onmouseout: j.Mouseout,
            onmousemove: j.Mousemove,
            onclick: j.Click,
            ondblclick: j.DblClick,
            onkeydown: j.Keydown,
            tabIndex: b.getTabOrder(n)
          });
          if (b.Browser.noContextMenu) {
            v.ontouchstart = a.start;
            v.ontouchend = a.end;
          }
          if (n.PHTML.display) {
            o = e.Element("div", {className: "MathJax_PHTML_Display"});
            o.appendChild(v);
          }
          o.className += " MathJax_Processing";
          u.parentNode.insertBefore(o, u);
        }
      },
      Translate: function(o, s) {
        if (!o.parentNode) {
          return;
        }
        var n = o.MathJax.elementJax,
            r = n.root,
            p = document.getElementById(n.inputID + "-Frame"),
            t = (n.PHTML.display ? p.parentNode : p);
        this.initPHTML(r, p);
        try {
          r.toPreviewHTML(p);
        } catch (q) {
          if (q.restart) {
            while (p.firstChild) {
              p.removeChild(p.firstChild);
            }
          }
          throw q;
        }
        t.className = t.className.split(/ /)[0];
        if (this.hideProcessedMath) {
          t.className += " MathJax_Processed";
          if (o.MathJax.preview) {
            n.PHTML.preview = o.MathJax.preview;
            delete o.MathJax.preview;
          }
        }
      },
      postTranslate: function(s) {
        var o = s.jax[this.id];
        if (!this.hideProcessedMath) {
          return;
        }
        for (var q = 0,
            n = o.length; q < n; q++) {
          var p = o[q];
          if (p && p.MathJax.elementJax) {
            p.previousSibling.className = p.previousSibling.className.split(/ /)[0];
            var r = p.MathJax.elementJax.PHTML;
            if (r.preview) {
              r.preview.innerHTML = "";
              p.MathJax.preview = r.preview;
              delete r.preview;
            }
          }
        }
      },
      getJaxFromMath: function(n) {
        if (n.parentNode.className === "MathJax_PHTML_Display") {
          n = n.parentNode;
        }
        do {
          n = n.nextSibling;
        } while (n && n.nodeName.toLowerCase() !== "script");
        return b.getJaxFor(n);
      },
      getHoverSpan: function(n, o) {
        return n.root.PHTMLspanElement();
      },
      getHoverBBox: function(n, q, r) {
        var s = n.root.PHTML,
            p = n.PHTML.outerEm;
        var o = {
          w: s.w * p,
          h: s.h * p,
          d: s.d * p
        };
        if (s.width) {
          o.width = s.width;
        }
        return o;
      },
      Zoom: function(o, u, s, n, r) {
        u.className = "MathJax";
        this.idPostfix = "-zoom";
        o.root.toPHTML(u, u);
        this.idPostfix = "";
        u.style.position = "absolute";
        if (!width) {
          s.style.position = "absolute";
        }
        var t = u.offsetWidth,
            q = u.offsetHeight,
            v = s.offsetHeight,
            p = s.offsetWidth;
        if (p === 0) {
          p = s.parentNode.offsetWidth;
        }
        u.style.position = s.style.position = "";
        return {
          Y: -j.getBBox(u).h,
          mW: p,
          mH: v,
          zW: t,
          zH: q
        };
      },
      initPHTML: function(o, n) {},
      Remove: function(n) {
        var o = document.getElementById(n.inputID + "-Frame");
        if (o) {
          if (n.PHTML.display) {
            o = o.parentNode;
          }
          o.parentNode.removeChild(o);
        }
        delete n.PHTML;
      },
      ID: 0,
      idPostfix: "",
      GetID: function() {
        this.ID++;
        return this.ID;
      },
      VARIANT: {
        bold: "MJXp-bold",
        italic: "MJXp-italic",
        "bold-italic": "MJXp-bold MJXp-italic",
        script: "MJXp-scr",
        "bold-script": "MJXp-scr MJXp-bold",
        fraktur: "MJXp-frak",
        "bold-fraktur": "MJXp-frak MJXp-bold",
        monospace: "MJXp-mono",
        "sans-serif": "MJXp-sf",
        "-tex-caligraphic": "MJXp-cal"
      },
      MATHSPACE: {
        veryverythinmathspace: 1 / 18,
        verythinmathspace: 2 / 18,
        thinmathspace: 3 / 18,
        mediummathspace: 4 / 18,
        thickmathspace: 5 / 18,
        verythickmathspace: 6 / 18,
        veryverythickmathspace: 7 / 18,
        negativeveryverythinmathspace: -1 / 18,
        negativeverythinmathspace: -2 / 18,
        negativethinmathspace: -3 / 18,
        negativemediummathspace: -4 / 18,
        negativethickmathspace: -5 / 18,
        negativeverythickmathspace: -6 / 18,
        negativeveryverythickmathspace: -7 / 18,
        thin: 0.08,
        medium: 0.1,
        thick: 0.15,
        infinity: k
      },
      TeX: {x_height: 0.430554},
      pxPerInch: 72,
      em: 16,
      DELIMITERS: {
        "(": {dir: c},
        "{": {
          dir: c,
          w: 0.58
        },
        "[": {dir: c},
        "|": {
          dir: c,
          w: 0.275
        },
        ")": {dir: c},
        "}": {
          dir: c,
          w: 0.58
        },
        "]": {dir: c},
        "/": {dir: c},
        "\\": {dir: c},
        "\u2223": {
          dir: c,
          w: 0.275
        },
        "\u2225": {
          dir: c,
          w: 0.55
        },
        "\u230A": {
          dir: c,
          w: 0.5
        },
        "\u230B": {
          dir: c,
          w: 0.5
        },
        "\u2308": {
          dir: c,
          w: 0.5
        },
        "\u2309": {
          dir: c,
          w: 0.5
        },
        "\u27E8": {
          dir: c,
          w: 0.5
        },
        "\u27E9": {
          dir: c,
          w: 0.5
        },
        "\u2191": {
          dir: c,
          w: 0.65
        },
        "\u2193": {
          dir: c,
          w: 0.65
        },
        "\u21D1": {
          dir: c,
          w: 0.75
        },
        "\u21D3": {
          dir: c,
          w: 0.75
        },
        "\u2195": {
          dir: c,
          w: 0.65
        },
        "\u21D5": {
          dir: c,
          w: 0.75
        },
        "\u27EE": {
          dir: c,
          w: 0.275
        },
        "\u27EF": {
          dir: c,
          w: 0.275
        },
        "\u23B0": {
          dir: c,
          w: 0.6
        },
        "\u23B1": {
          dir: c,
          w: 0.6
        }
      },
      REMAPACCENT: {
        "\u20D7": "\u2192",
        "'": "\u02CB",
        "`": "\u02CA",
        ".": "\u02D9",
        "^": "\u02C6",
        "-": "\u02C9",
        "~": "\u02DC",
        "\u00AF": "\u02C9",
        "\u00B0": "\u02DA",
        "\u00B4": "\u02CA",
        "\u0300": "\u02CB",
        "\u0301": "\u02CA",
        "\u0302": "\u02C6",
        "\u0303": "\u02DC",
        "\u0304": "\u02C9",
        "\u0305": "\u02C9",
        "\u0306": "\u02D8",
        "\u0307": "\u02D9",
        "\u0308": "\u00A8",
        "\u030C": "\u02C7"
      },
      REMAPACCENTUNDER: {},
      length2em: function(r, p) {
        if (typeof(r) !== "string") {
          r = r.toString();
        }
        if (r === "") {
          return "";
        }
        if (r === h.SIZE.NORMAL) {
          return 1;
        }
        if (r === h.SIZE.BIG) {
          return 2;
        }
        if (r === h.SIZE.SMALL) {
          return 0.71;
        }
        if (this.MATHSPACE[r]) {
          return this.MATHSPACE[r];
        }
        var o = r.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
        var n = parseFloat(o[1] || "1"),
            q = o[2];
        if (p == null) {
          p = 1;
        }
        if (q === "em") {
          return n;
        }
        if (q === "ex") {
          return n * this.TeX.x_height;
        }
        if (q === "%") {
          return n / 100 * p;
        }
        if (q === "px") {
          return n / this.em;
        }
        if (q === "pt") {
          return n / 10;
        }
        if (q === "pc") {
          return n * 1.2;
        }
        if (q === "in") {
          return n * this.pxPerInch / this.em;
        }
        if (q === "cm") {
          return n * this.pxPerInch / this.em / 2.54;
        }
        if (q === "mm") {
          return n * this.pxPerInch / this.em / 25.4;
        }
        if (q === "mu") {
          return n / 18;
        }
        return n * p;
      },
      Em: function(n) {
        if (Math.abs(n) < 0.001) {
          return "0em";
        }
        return (n.toFixed(3).replace(/\.?0+$/, "")) + "em";
      },
      arrayEntry: function(n, o) {
        return n[Math.max(0, Math.min(o, n.length - 1))];
      }
    });
    MathJax.Hub.Register.StartupHook("mml Jax Ready", function() {
      h = MathJax.ElementJax.mml;
      h.mbase.Augment({
        toPreviewHTML: function(o, n) {
          return this.PHTMLdefaultSpan(o, n);
        },
        PHTMLdefaultSpan: function(q, o) {
          if (!o) {
            o = {};
          }
          q = this.PHTMLcreateSpan(q);
          this.PHTMLhandleStyle(q);
          this.PHTMLhandleColor(q);
          if (this.isToken) {
            this.PHTMLhandleToken(q);
          }
          for (var p = 0,
              n = this.data.length; p < n; p++) {
            this.PHTMLaddChild(q, p, o);
          }
          return q;
        },
        PHTMLaddChild: function(p, o, n) {
          var q = this.data[o];
          if (q) {
            if (n.childSpans) {
              p = e.addElement(p, "span", {className: n.className});
            }
            q.toPreviewHTML(p);
            if (!n.noBBox) {
              this.PHTML.w += q.PHTML.w + q.PHTML.l + q.PHTML.r;
              if (q.PHTML.h > this.PHTML.h) {
                this.PHTML.h = q.PHTML.h;
              }
              if (q.PHTML.d > this.PHTML.d) {
                this.PHTML.d = q.PHTML.d;
              }
              if (q.PHTML.t > this.PHTML.t) {
                this.PHTML.t = q.PHTML.t;
              }
              if (q.PHTML.b > this.PHTML.b) {
                this.PHTML.b = q.PHTML.b;
              }
            }
          } else {
            if (n.forceChild) {
              e.addElement(p, "span");
            }
          }
        },
        PHTMLstretchChild: function(q, p, s) {
          var r = this.data[q];
          if (r && r.PHTMLcanStretch("Vertical", p, s)) {
            var t = this.PHTML,
                o = r.PHTML,
                n = o.w;
            r.PHTMLstretchV(p, s);
            t.w += o.w - n;
            if (o.h > t.h) {
              t.h = o.h;
            }
            if (o.d > t.d) {
              t.d = o.d;
            }
          }
        },
        PHTMLcreateSpan: function(n) {
          if (!this.PHTML) {
            this.PHTML = {};
          }
          this.PHTML = {
            w: 0,
            h: 0,
            d: 0,
            l: 0,
            r: 0,
            t: 0,
            b: 0
          };
          if (this.inferred) {
            return n;
          }
          if (this.type === "mo" && this.data.join("") === "\u222B") {
            g.lastIsInt = true;
          } else {
            if (this.type !== "mspace" || this.width !== "negativethinmathspace") {
              g.lastIsInt = false;
            }
          }
          if (!this.PHTMLspanID) {
            this.PHTMLspanID = g.GetID();
          }
          var o = (this.id || "MJXp-Span-" + this.PHTMLspanID);
          return e.addElement(n, "span", {
            className: "MJXp-" + this.type,
            id: o
          });
        },
        PHTMLspanElement: function() {
          if (!this.PHTMLspanID) {
            return null;
          }
          return document.getElementById(this.id || "MJXp-Span-" + this.PHTMLspanID);
        },
        PHTMLhandleToken: function(o) {
          var n = this.getValues("mathvariant");
          if (n.mathvariant !== h.VARIANT.NORMAL) {
            o.className += " " + g.VARIANT[n.mathvariant];
          }
        },
        PHTMLhandleStyle: function(n) {
          if (this.style) {
            n.style.cssText = this.style;
          }
        },
        PHTMLhandleColor: function(n) {
          if (this.mathcolor) {
            n.style.color = this.mathcolor;
          }
          if (this.mathbackground) {
            n.style.backgroundColor = this.mathbackground;
          }
        },
        PHTMLhandleScriptlevel: function(n) {
          var o = this.Get("scriptlevel");
          if (o) {
            n.className += " MJXp-script";
          }
        },
        PHTMLhandleText: function(y, A) {
          var v,
              p;
          var z = 0,
              o = 0,
              q = 0;
          for (var s = 0,
              r = A.length; s < r; s++) {
            p = A.charCodeAt(s);
            v = A.charAt(s);
            if (p >= 55296 && p < 56319) {
              s++;
              p = (((p - 55296) << 10) + (A.charCodeAt(s) - 56320)) + 65536;
            }
            var t = 0.7,
                u = 0.22,
                x = 0.5;
            if (p < 127) {
              if (v.match(/[A-Za-ehik-or-xz0-9]/)) {
                u = 0;
              }
              if (v.match(/[A-HK-Z]/)) {
                x = 0.67;
              } else {
                if (v.match(/[IJ]/)) {
                  x = 0.36;
                }
              }
              if (v.match(/[acegm-su-z]/)) {
                t = 0.45;
              } else {
                if (v.match(/[ij]/)) {
                  t = 0.75;
                }
              }
              if (v.match(/[ijlt]/)) {
                x = 0.28;
              }
            }
            if (g.DELIMITERS[v]) {
              x = g.DELIMITERS[v].w || 0.4;
            }
            if (t > z) {
              z = t;
            }
            if (u > o) {
              o = u;
            }
            q += x;
          }
          if (!this.CHML) {
            this.PHTML = {};
          }
          this.PHTML = {
            h: 0.9,
            d: 0.3,
            w: q,
            l: 0,
            r: 0,
            t: z,
            b: o
          };
          e.addText(y, A);
        },
        PHTMLbboxFor: function(o) {
          if (this.data[o] && this.data[o].PHTML) {
            return this.data[o].PHTML;
          }
          return {
            w: 0,
            h: 0,
            d: 0,
            l: 0,
            r: 0,
            t: 0,
            b: 0
          };
        },
        PHTMLcanStretch: function(q, o, p) {
          if (this.isEmbellished()) {
            var n = this.Core();
            if (n && n !== this) {
              return n.PHTMLcanStretch(q, o, p);
            }
          }
          return false;
        },
        PHTMLstretchV: function(n, o) {},
        PHTMLstretchH: function(n) {},
        CoreParent: function() {
          var n = this;
          while (n && n.isEmbellished() && n.CoreMO() === this && !n.isa(h.math)) {
            n = n.Parent();
          }
          return n;
        },
        CoreText: function(n) {
          if (!n) {
            return "";
          }
          if (n.isEmbellished()) {
            return n.CoreMO().data.join("");
          }
          while ((n.isa(h.mrow) || n.isa(h.TeXAtom) || n.isa(h.mstyle) || n.isa(h.mphantom)) && n.data.length === 1 && n.data[0]) {
            n = n.data[0];
          }
          if (!n.isToken) {
            return "";
          } else {
            return n.data.join("");
          }
        }
      });
      h.chars.Augment({toPreviewHTML: function(n) {
          var o = this.toString().replace(/[\u2061-\u2064]/g, "");
          this.PHTMLhandleText(n, o);
        }});
      h.entity.Augment({toPreviewHTML: function(n) {
          var o = this.toString().replace(/[\u2061-\u2064]/g, "");
          this.PHTMLhandleText(n, o);
        }});
      h.math.Augment({toPreviewHTML: function(n) {
          n = this.PHTMLdefaultSpan(n);
          if (this.Get("display") === "block") {
            n.className += " MJXp-display";
          }
          return n;
        }});
      h.mo.Augment({
        toPreviewHTML: function(o) {
          o = this.PHTMLdefaultSpan(o);
          this.PHTMLadjustAccent(o);
          var n = this.getValues("lspace", "rspace", "scriptlevel", "displaystyle", "largeop");
          if (n.scriptlevel === 0) {
            this.PHTML.l = g.length2em(n.lspace);
            this.PHTML.r = g.length2em(n.rspace);
            o.style.marginLeft = g.Em(this.PHTML.l);
            o.style.marginRight = g.Em(this.PHTML.r);
          } else {
            this.PHTML.l = 0.15;
            this.PHTML.r = 0.1;
          }
          if (n.displaystyle && n.largeop) {
            var p = e.Element("span", {className: "MJXp-largeop"});
            p.appendChild(o.firstChild);
            o.appendChild(p);
            this.PHTML.h *= 1.2;
            this.PHTML.d *= 1.2;
            if (this.data.join("") === "\u222B") {
              p.className += " MJXp-int";
            }
          }
          return o;
        },
        PHTMLadjustAccent: function(p) {
          var o = this.CoreParent();
          if (o && o.isa(h.munderover) && this.CoreText(o.data[o.base]).length === 1) {
            var q = o.data[o.over],
                n = o.data[o.under];
            var s = this.data.join(""),
                r;
            if (q && this === q.CoreMO() && o.Get("accent")) {
              r = g.REMAPACCENT[s];
            } else {
              if (n && this === n.CoreMO() && o.Get("accentunder")) {
                r = g.REMAPACCENTUNDER[s];
              }
            }
            if (r) {
              s = p.innerHTML = r;
            }
            if (s.match(/[\u02C6-\u02DC\u00A8]/)) {
              this.PHTML.acc = -0.52;
            } else {
              if (s === "\u2192") {
                this.PHTML.acc = -0.15;
                this.PHTML.vec = true;
              }
            }
          }
        },
        PHTMLcanStretch: function(q, o, p) {
          if (!this.Get("stretchy")) {
            return false;
          }
          var r = this.data.join("");
          if (r.length > 1) {
            return false;
          }
          r = g.DELIMITERS[r];
          var n = (r && r.dir === q.substr(0, 1));
          if (n) {
            n = (this.PHTML.h !== o || this.PHTML.d !== p || (this.Get("minsize", true) || this.Get("maxsize", true)));
          }
          return n;
        },
        PHTMLstretchV: function(p, u) {
          var o = this.PHTMLspanElement(),
              t = this.PHTML;
          var n = this.getValues("symmetric", "maxsize", "minsize");
          if (n.symmetric) {
            l = 2 * Math.max(p - 0.25, u + 0.25);
          } else {
            l = p + u;
          }
          n.maxsize = g.length2em(n.maxsize, t.h + t.d);
          n.minsize = g.length2em(n.minsize, t.h + t.d);
          l = Math.max(n.minsize, Math.min(n.maxsize, l));
          var s = l / (t.h + t.d - 0.3);
          var q = e.Element("span", {style: {"font-size": g.Em(s)}});
          if (s > 1.25) {
            var r = Math.ceil(1.25 / s * 10);
            q.className = "MJXp-right MJXp-scale" + r;
            q.style.marginLeft = g.Em(t.w * (r / 10 - 1) + 0.07);
            t.w *= s * r / 10;
          }
          q.appendChild(o.firstChild);
          o.appendChild(q);
          if (n.symmetric) {
            o.style.verticalAlign = g.Em(0.25 * (1 - s));
          }
        }
      });
      h.mspace.Augment({toPreviewHTML: function(q) {
          q = this.PHTMLdefaultSpan(q);
          var o = this.getValues("height", "depth", "width");
          var n = g.length2em(o.width),
              p = g.length2em(o.height),
              s = g.length2em(o.depth);
          var r = this.PHTML;
          r.w = n;
          r.h = p;
          r.d = s;
          if (n < 0) {
            if (!g.lastIsInt) {
              q.style.marginLeft = g.Em(n);
            }
            n = 0;
          }
          q.style.width = g.Em(n);
          q.style.height = g.Em(p + s);
          if (s) {
            q.style.verticalAlign = g.Em(-s);
          }
          return q;
        }});
      h.mpadded.Augment({
        toPreviewHTML: function(u) {
          u = this.PHTMLdefaultSpan(u, {
            childSpans: true,
            className: "MJXp-box",
            forceChild: true
          });
          var o = u.firstChild;
          var v = this.getValues("width", "height", "depth", "lspace", "voffset");
          var s = this.PHTMLdimen(v.lspace);
          var q = 0,
              n = 0,
              t = s.len,
              r = -s.len,
              p = 0;
          if (v.width !== "") {
            s = this.PHTMLdimen(v.width, "w", 0);
            if (s.pm) {
              r += s.len;
            } else {
              u.style.width = g.Em(s.len);
            }
          }
          if (v.height !== "") {
            s = this.PHTMLdimen(v.height, "h", 0);
            if (!s.pm) {
              q += -this.PHTMLbboxFor(0).h;
            }
            q += s.len;
          }
          if (v.depth !== "") {
            s = this.PHTMLdimen(v.depth, "d", 0);
            if (!s.pm) {
              n += -this.PHTMLbboxFor(0).d;
              p += -s.len;
            }
            n += s.len;
          }
          if (v.voffset !== "") {
            s = this.PHTMLdimen(v.voffset);
            q -= s.len;
            n += s.len;
            p += s.len;
          }
          if (q) {
            o.style.marginTop = g.Em(q);
          }
          if (n) {
            o.style.marginBottom = g.Em(n);
          }
          if (t) {
            o.style.marginLeft = g.Em(t);
          }
          if (r) {
            o.style.marginRight = g.Em(r);
          }
          if (p) {
            u.style.verticalAlign = g.Em(p);
          }
          return u;
        },
        PHTMLdimen: function(q, r, n) {
          if (n == null) {
            n = -k;
          }
          q = String(q);
          var o = q.match(/width|height|depth/);
          var p = (o ? this.PHTML[o[0].charAt(0)] : (r ? this.PHTML[r] : 0));
          return {
            len: g.length2em(q, p) || 0,
            pm: !!q.match(/^[-+]/)
          };
        }
      });
      h.munderover.Augment({toPreviewHTML: function(r) {
          var t = this.getValues("displaystyle", "accent", "accentunder", "align");
          var n = this.data[this.base];
          if (!t.displaystyle && n != null && (n.movablelimits || n.CoreMO().Get("movablelimits"))) {
            r = h.msubsup.prototype.toPreviewHTML.call(this, r);
            r.className = r.className.replace(/munderover/, "msubsup");
            return r;
          }
          r = this.PHTMLdefaultSpan(r, {
            childSpans: true,
            className: "",
            noBBox: true
          });
          var p = this.PHTMLbboxFor(this.over),
              v = this.PHTMLbboxFor(this.under),
              u = this.PHTMLbboxFor(this.base),
              s = this.PHTML,
              o = p.acc;
          if (this.data[this.over]) {
            r.lastChild.firstChild.style.marginLeft = p.l = r.lastChild.firstChild.style.marginRight = p.r = 0;
            var q = e.Element("span", {}, [["span", {className: "MJXp-over"}]]);
            q.firstChild.appendChild(r.lastChild);
            if (r.childNodes.length > (this.data[this.under] ? 1 : 0)) {
              q.firstChild.appendChild(r.firstChild);
            }
            this.data[this.over].PHTMLhandleScriptlevel(q.firstChild.firstChild);
            if (o != null) {
              if (p.vec) {
                q.firstChild.firstChild.firstChild.style.fontSize = "60%";
                p.h *= 0.6;
                p.d *= 0.6;
                p.w *= 0.6;
              }
              o = o - p.d + 0.1;
              if (u.t != null) {
                o += u.t - u.h;
              }
              q.firstChild.firstChild.style.marginBottom = g.Em(o);
            }
            if (r.firstChild) {
              r.insertBefore(q, r.firstChild);
            } else {
              r.appendChild(q);
            }
          }
          if (this.data[this.under]) {
            r.lastChild.firstChild.style.marginLeft = v.l = r.lastChild.firstChild.marginRight = v.r = 0;
            this.data[this.under].PHTMLhandleScriptlevel(r.lastChild);
          }
          s.w = Math.max(0.8 * p.w, 0.8 * v.w, u.w);
          s.h = 0.8 * (p.h + p.d + (o || 0)) + u.h;
          s.d = u.d + 0.8 * (v.h + v.d);
          return r;
        }});
      h.msubsup.Augment({toPreviewHTML: function(q) {
          q = this.PHTMLdefaultSpan(q, {noBBox: true});
          if (!this.data[this.base]) {
            if (q.firstChild) {
              q.insertBefore(e.Element("span"), q.firstChild);
            } else {
              q.appendChild(e.Element("span"));
            }
          }
          var s = this.data[this.base],
              p = this.data[this.sub],
              n = this.data[this.sup];
          if (!s) {
            s = {bbox: {
                h: 0.8,
                d: 0.2
              }};
          }
          q.firstChild.style.marginRight = ".05em";
          var o = Math.max(0.4, s.PHTML.h - 0.4),
              u = Math.max(0.2, s.PHTML.d + 0.1);
          var t = this.PHTML;
          if (n && p) {
            var r = e.Element("span", {
              className: "MJXp-script-box",
              style: {
                height: g.Em(o + n.PHTML.h * 0.8 + u + p.PHTML.d * 0.8),
                "vertical-align": g.Em(-u - p.PHTML.d * 0.8)
              }
            }, [["span", {}, [["span", {}, [["span", {style: {"margin-bottom": g.Em(-(n.PHTML.d - 0.05))}}]]]]], ["span", {}, [["span", {}, [["span", {style: {"margin-top": g.Em(-(n.PHTML.h - 0.05))}}]]]]]]);
            p.PHTMLhandleScriptlevel(r.firstChild);
            n.PHTMLhandleScriptlevel(r.lastChild);
            r.firstChild.firstChild.firstChild.appendChild(q.lastChild);
            r.lastChild.firstChild.firstChild.appendChild(q.lastChild);
            q.appendChild(r);
            t.h = Math.max(s.PHTML.h, n.PHTML.h * 0.8 + o);
            t.d = Math.max(s.PHTML.d, p.PHTML.d * 0.8 + u);
            t.w = s.PHTML.w + Math.max(n.PHTML.w, p.PHTML.w) + 0.07;
          } else {
            if (n) {
              q.lastChild.style.verticalAlign = g.Em(o);
              n.PHTMLhandleScriptlevel(q.lastChild);
              t.h = Math.max(s.PHTML.h, n.PHTML.h * 0.8 + o);
              t.d = Math.max(s.PHTML.d, n.PHTML.d * 0.8 - o);
              t.w = s.PHTML.w + n.PHTML.w + 0.07;
            } else {
              if (p) {
                q.lastChild.style.verticalAlign = g.Em(-u);
                p.PHTMLhandleScriptlevel(q.lastChild);
                t.h = Math.max(s.PHTML.h, p.PHTML.h * 0.8 - u);
                t.d = Math.max(s.PHTML.d, p.PHTML.d * 0.8 + u);
                t.w = s.PHTML.w + p.PHTML.w + 0.07;
              }
            }
          }
          return q;
        }});
      h.mfrac.Augment({toPreviewHTML: function(r) {
          r = this.PHTMLdefaultSpan(r, {
            childSpans: true,
            className: "MJXp-box",
            forceChild: true,
            noBBox: true
          });
          var o = this.getValues("linethickness", "displaystyle");
          if (!o.displaystyle) {
            if (this.data[0]) {
              this.data[0].PHTMLhandleScriptlevel(r.firstChild);
            }
            if (this.data[1]) {
              this.data[1].PHTMLhandleScriptlevel(r.lastChild);
            }
          }
          var n = e.Element("span", {className: "MJXp-box"}, [["span", {className: "MJXp-denom"}, [["span", {}, [["span", {
            className: "MJXp-rule",
            style: {height: "1em"}
          }]]], ["span"]]]]);
          n.firstChild.lastChild.appendChild(r.lastChild);
          r.appendChild(n);
          var s = this.PHTMLbboxFor(0),
              p = this.PHTMLbboxFor(1),
              v = this.PHTML;
          v.w = Math.max(s.w, p.w) * 0.8;
          v.h = s.h + s.d + 0.1 + 0.25;
          v.d = p.h + p.d - 0.25;
          v.l = v.r = 0.125;
          o.linethickness = Math.max(0, g.length2em(o.linethickness || "0", 0));
          if (o.linethickness) {
            var u = n.firstChild.firstChild.firstChild;
            var q = g.Em(o.linethickness);
            u.style.borderTop = "none";
            u.style.borderBottom = (o.linethickness < 0.15 ? "1px" : q) + " solid";
            u.style.margin = q + " 0";
            q = o.linethickness;
            n.style.marginTop = g.Em(3 * q - 1.2);
            r.style.verticalAlign = g.Em(1.5 * q + 0.1);
            v.h += 1.5 * q - 0.1;
            v.d += 1.5 * q;
          } else {
            n.style.marginTop = "-.7em";
          }
          return r;
        }});
      h.msqrt.Augment({
        toPreviewHTML: function(n) {
          n = this.PHTMLdefaultSpan(n, {
            childSpans: true,
            className: "MJXp-box",
            forceChild: true,
            noBBox: true
          });
          this.PHTMLlayoutRoot(n, n.firstChild);
          return n;
        },
        PHTMLlayoutRoot: function(u, n) {
          var v = this.PHTMLbboxFor(0);
          var q = Math.ceil((v.h + v.d + 0.14) * 100),
              w = g.Em(14 / q);
          var r = e.Element("span", {className: "MJXp-surd"}, [["span", {style: {
              "font-size": q + "%",
              "margin-top": w
            }}, ["\u221A"]]]);
          var s = e.Element("span", {className: "MJXp-root"}, [["span", {
            className: "MJXp-rule",
            style: {"border-top": ".08em solid"}
          }]]);
          var p = (1.2 / 2.2) * q / 100;
          if (q > 150) {
            var o = Math.ceil(150 / q * 10);
            r.firstChild.className = "MJXp-right MJXp-scale" + o;
            r.firstChild.style.marginLeft = g.Em(p * (o / 10 - 1) / q * 100);
            p = p * o / 10;
            s.firstChild.style.borderTopWidth = g.Em(0.08 / Math.sqrt(o / 10));
          }
          s.appendChild(n);
          u.appendChild(r);
          u.appendChild(s);
          this.PHTML.h = v.h + 0.18;
          this.PHTML.d = v.d;
          this.PHTML.w = v.w + p;
          return u;
        }
      });
      h.mroot.Augment({
        toPreviewHTML: function(q) {
          q = this.PHTMLdefaultSpan(q, {
            childSpans: true,
            className: "MJXp-box",
            forceChild: true,
            noBBox: true
          });
          var p = this.PHTMLbboxFor(1),
              n = q.removeChild(q.lastChild);
          var t = this.PHTMLlayoutRoot(e.Element("span"), q.firstChild);
          n.className = "MJXp-script";
          var u = parseInt(t.firstChild.firstChild.style.fontSize);
          var o = 0.55 * (u / 120) + p.d * 0.8,
              s = -0.6 * (u / 120);
          if (u > 150) {
            s *= 0.95 * Math.ceil(150 / u * 10) / 10;
          }
          n.style.marginRight = g.Em(s);
          n.style.verticalAlign = g.Em(o);
          if (-s > p.w * 0.8) {
            n.style.marginLeft = g.Em(-s - p.w * 0.8);
          }
          q.appendChild(n);
          q.appendChild(t);
          this.PHTML.w += Math.max(0, p.w * 0.8 + s);
          this.PHTML.h = Math.max(this.PHTML.h, p.h * 0.8 + o);
          return q;
        },
        PHTMLlayoutRoot: h.msqrt.prototype.PHTMLlayoutRoot
      });
      h.mfenced.Augment({toPreviewHTML: function(q) {
          q = this.PHTMLcreateSpan(q);
          this.PHTMLhandleStyle(q);
          this.PHTMLhandleColor(q);
          this.addFakeNodes();
          this.PHTMLaddChild(q, "open", {});
          for (var p = 0,
              n = this.data.length; p < n; p++) {
            this.PHTMLaddChild(q, "sep" + p, {});
            this.PHTMLaddChild(q, p, {});
          }
          this.PHTMLaddChild(q, "close", {});
          var o = this.PHTML.h,
              r = this.PHTML.d;
          this.PHTMLstretchChild("open", o, r);
          for (p = 0, n = this.data.length; p < n; p++) {
            this.PHTMLstretchChild("sep" + p, o, r);
            this.PHTMLstretchChild(p, o, r);
          }
          this.PHTMLstretchChild("close", o, r);
          return q;
        }});
      h.mrow.Augment({toPreviewHTML: function(q) {
          q = this.PHTMLdefaultSpan(q);
          var p = this.PHTML.h,
              r = this.PHTML.d;
          for (var o = 0,
              n = this.data.length; o < n; o++) {
            this.PHTMLstretchChild(o, p, r);
          }
          return q;
        }});
      h.mstyle.Augment({toPreviewHTML: function(n) {
          n = this.PHTMLdefaultSpan(n);
          this.PHTMLhandleScriptlevel(n);
          return n;
        }});
      h.TeXAtom.Augment({toPreviewHTML: function(n) {
          n = this.PHTMLdefaultSpan(n);
          n.className = "MJXp-mrow";
          return n;
        }});
      h.mtable.Augment({toPreviewHTML: function(E) {
          E = this.PHTMLdefaultSpan(E, {noBBox: true});
          var r = this.getValues("columnalign", "rowalign", "columnspacing", "rowspacing", "columnwidth", "equalcolumns", "equalrows", "columnlines", "rowlines", "frame", "framespacing", "align", "width");
          var u = MathJax.Hub.SplitList,
              F,
              A,
              D,
              z;
          var N = u(r.columnspacing),
              w = u(r.rowspacing),
              L = u(r.columnalign),
              t = u(r.rowalign);
          for (F = 0, A = N.length; F < A; F++) {
            N[F] = g.length2em(N[F]);
          }
          for (F = 0, A = w.length; F < A; F++) {
            w[F] = g.length2em(w[F]);
          }
          var K = e.Element("span");
          while (E.firstChild) {
            K.appendChild(E.firstChild);
          }
          E.appendChild(K);
          var y = 0,
              s = 0;
          for (F = 0, A = this.data.length; F < A; F++) {
            var v = this.data[F];
            if (v) {
              var J = g.arrayEntry(w, F - 1),
                  C = g.arrayEntry(t, F);
              var x = v.PHTML,
                  q = v.PHTMLspanElement();
              q.style.verticalAlign = C;
              var B = (v.type === "mlabeledtr" ? 1 : 0);
              for (D = 0, z = v.data.length; D < z - B; D++) {
                var p = v.data[D + B];
                if (p) {
                  var M = g.arrayEntry(N, D - 1),
                      G = g.arrayEntry(L, D);
                  var I = p.PHTMLspanElement();
                  if (D) {
                    x.w += M;
                    I.style.paddingLeft = g.Em(M);
                  }
                  if (F) {
                    I.style.paddingTop = g.Em(J);
                  }
                  I.style.textAlign = G;
                }
              }
              y += x.h + x.d;
              if (F) {
                y += J;
              }
              if (x.w > s) {
                s = x.w;
              }
            }
          }
          var o = this.PHTML;
          o.w = s;
          o.h = y / 2 + 0.25;
          o.d = y / 2 - 0.25;
          o.l = o.r = 0.125;
          return E;
        }});
      h.mlabeledtr.Augment({PHTMLdefaultSpan: function(q, o) {
          if (!o) {
            o = {};
          }
          q = this.PHTMLcreateSpan(q);
          this.PHTMLhandleStyle(q);
          this.PHTMLhandleColor(q);
          if (this.isToken) {
            this.PHTMLhandleToken(q);
          }
          for (var p = 1,
              n = this.data.length; p < n; p++) {
            this.PHTMLaddChild(q, p, o);
          }
          return q;
        }});
      h.semantics.Augment({toPreviewHTML: function(n) {
          n = this.PHTMLcreateSpan(n);
          if (this.data[0]) {
            this.data[0].toPreviewHTML(n);
            MathJax.Hub.Insert(this.data[0].PHTML || {}, this.PHTML);
          }
          return n;
        }});
      h.annotation.Augment({toPreviewHTML: function(n) {}});
      h["annotation-xml"].Augment({toPreviewHTML: function(n) {}});
      MathJax.Hub.Register.StartupHook("onLoad", function() {
        setTimeout(MathJax.Callback(["loadComplete", g, "jax.js"]), 0);
      });
    });
    MathJax.Hub.Register.StartupHook("End Cookie", function() {
      if (b.config.menuSettings.zoom !== "None") {
        i.Require("[MathJax]/extensions/MathZoom.js");
      }
    });
  })(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.PreviewHTML);
  (function(b, g, f) {
    var c = b.config.menuSettings;
    var e = MathJax.OutputJax;
    var a = f.isMSIE && (document.documentMode || 0) < 8;
    var d = MathJax.Extension["fast-preview"] = {
      version: "2.6.0",
      enabled: true,
      config: b.CombineConfig("fast-preview", {
        Chunks: {
          EqnChunk: 10000,
          EqnChunkFactor: 1,
          EqnChunkDelay: 0
        },
        color: "inherit!important",
        updateTime: 30,
        updateDelay: 6,
        messageStyle: "none",
        disabled: f.isMSIE && !f.versionAtLeast("8.0")
      }),
      Config: function() {
        if (b.config["CHTML-preview"]) {
          MathJax.Hub.Config({"fast-preview": b.config["CHTML-preview"]});
        }
        var m,
            j,
            k,
            h,
            l;
        var i = this.config;
        if (!i.disabled && c.FastPreview == null) {
          b.Config({menuSettings: {FastPreview: true}});
        }
        if (c.FastPreview) {
          MathJax.Ajax.Styles({".MathJax_Preview .MJXf-math": {color: i.color}});
          b.Config({
            "HTML-CSS": i.Chunks,
            CommonHTML: i.Chunks,
            SVG: i.Chunks
          });
        }
        b.Register.MessageHook("Begin Math Output", function() {
          if (!h && d.Active()) {
            m = b.processUpdateTime;
            j = b.processUpdateDelay;
            k = b.config.messageStyle;
            b.processUpdateTime = i.updateTime;
            b.processUpdateDelay = i.updateDelay;
            b.Config({messageStyle: i.messageStyle});
            MathJax.Message.Clear(0, 0);
            l = true;
          }
        });
        b.Register.MessageHook("End Math Output", function() {
          if (!h && l) {
            b.processUpdateTime = m;
            b.processUpdateDelay = j;
            b.Config({messageStyle: k});
            h = true;
          }
        });
      },
      Disable: function() {
        this.enabled = false;
      },
      Enable: function() {
        this.enabled = true;
      },
      Active: function() {
        return c.FastPreview && this.enabled && !(e[c.renderer] || {}).noFastPreview;
      },
      Preview: function(h) {
        if (!this.Active()) {
          return;
        }
        var i = h.script.MathJax.preview || h.script.previousSibling;
        if (!i || i.className !== MathJax.Hub.config.preRemoveClass) {
          i = g.Element("span", {className: MathJax.Hub.config.preRemoveClass});
          h.script.parentNode.insertBefore(i, h.script);
          h.script.MathJax.preview = i;
        }
        i.innerHTML = "";
        i.style.color = (a ? "black" : "inherit");
        return this.postFilter(i, h);
      },
      postFilter: function(j, i) {
        if (!i.math.root.toPreviewHTML) {
          var h = MathJax.Callback.Queue();
          h.Push(["Require", MathJax.Ajax, "[MathJax]/jax/output/PreviewHTML/config.js"], ["Require", MathJax.Ajax, "[MathJax]/jax/output/PreviewHTML/jax.js"]);
          b.RestartAfter(h.Push({}));
        }
        i.math.root.toPreviewHTML(j);
      },
      Register: function(h) {
        b.Register.StartupHook(h + " Jax Require", function() {
          var i = MathJax.InputJax[h];
          i.postfilterHooks.Add(["Preview", MathJax.Extension["fast-preview"]], 50);
        });
      }
    };
    d.Register("TeX");
    d.Register("MathML");
    d.Register("AsciiMath");
    b.Register.StartupHook("End Config", ["Config", d]);
    b.Startup.signal.Post("fast-preview Ready");
  })(MathJax.Hub, MathJax.HTML, MathJax.Hub.Browser);
  MathJax.Ajax.loadComplete("[MathJax]/extensions/fast-preview.js");
  (function(a, e, b, f) {
    var c = b.config.menuSettings;
    var d = MathJax.Extension.AssistiveMML = {
      version: "2.6.1",
      config: b.CombineConfig("AssistiveMML", {
        disabled: false,
        styles: {
          ".MJX_Assistive_MathML": {
            position: "absolute!important",
            top: 0,
            left: 0,
            clip: (b.Browser.isMSIE && (document.documentMode || 0) < 8 ? "rect(1px 1px 1px 1px)" : "rect(1px, 1px, 1px, 1px)"),
            padding: "1px 0 0 0!important",
            border: "0!important",
            height: "1px!important",
            width: "1px!important",
            overflow: "hidden!important",
            display: "block!important",
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none"
          },
          ".MJX_Assistive_MathML.MJX_Assistive_MathML_Block": {width: "100%!important"}
        }
      }),
      Config: function() {
        if (!this.config.disabled && c.assistiveMML == null) {
          b.Config({menuSettings: {assistiveMML: true}});
        }
        a.Styles(this.config.styles);
        b.Register.MessageHook("End Math", function(g) {
          if (c.assistiveMML) {
            return d.AddAssistiveMathML(g[1]);
          }
        });
      },
      AddAssistiveMathML: function(g) {
        var h = {
          jax: b.getAllJax(g),
          i: 0,
          callback: MathJax.Callback({})
        };
        this.HandleMML(h);
        return h.callback;
      },
      RemoveAssistiveMathML: function(k) {
        var h = b.getAllJax(k),
            l;
        for (var j = 0,
            g = h.length; j < g; j++) {
          l = document.getElementById(h[j].inputID + "-Frame");
          if (l && l.getAttribute("data-mathml")) {
            l.removeAttribute("data-mathml");
            if (l.lastChild && l.lastChild.className.match(/MJX_Assistive_MathML/)) {
              l.removeChild(l.lastChild);
            }
          }
        }
      },
      HandleMML: function(l) {
        var g = l.jax.length,
            h,
            i,
            n,
            j;
        while (l.i < g) {
          h = l.jax[l.i];
          n = document.getElementById(h.inputID + "-Frame");
          if (h.outputJax !== "NativeMML" && n && !n.getAttribute("data-mathml")) {
            try {
              i = h.root.toMathML("").replace(/\n */g, "").replace(/<!--.*?-->/g, "");
            } catch (k) {
              if (!k.restart) {
                throw k;
              }
              return MathJax.Callback.After(["HandleMML", this, l], k.restart);
            }
            n.setAttribute("data-mathml", i);
            j = f.addElement(n, "span", {
              isMathJax: true,
              unselectable: "on",
              className: "MJX_Assistive_MathML" + (h.root.Get("display") === "block" ? " MJX_Assistive_MathML_Block" : "")
            });
            j.innerHTML = i;
            n.style.position = "relative";
            n.setAttribute("role", "presentation");
            n.firstChild.setAttribute("aria-hidden", "true");
            j.setAttribute("role", "presentation");
          }
          l.i++;
        }
        l.callback();
      }
    };
    b.Startup.signal.Post("AssistiveMML Ready");
  })(MathJax.Ajax, MathJax.Callback, MathJax.Hub, MathJax.HTML);
  MathJax.Callback.Queue(["Require", MathJax.Ajax, "[MathJax]/extensions/toMathML.js"], ["loadComplete", MathJax.Ajax, "[MathJax]/extensions/AssistiveMML.js"], function() {
    MathJax.Hub.Register.StartupHook("End Config", ["Config", MathJax.Extension.AssistiveMML]);
  });
  MathJax.Ajax.loadComplete("[MathJax]/config/TeX-AMS_CHTML-full.js");
})(require('process'));
