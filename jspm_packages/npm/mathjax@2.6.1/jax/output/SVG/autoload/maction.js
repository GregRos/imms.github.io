/* */ 
"format cjs";
/*
 *  /MathJax/jax/output/SVG/autoload/maction.js
 *
 *  Copyright (c) 2009-2015 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

MathJax.Hub.Register.StartupHook("SVG Jax Ready",function(){var f="2.6.0";var c=MathJax.ElementJax.mml,g=MathJax.OutputJax.SVG;var d,e,b;var a=g.config.tooltip=MathJax.Hub.Insert({delayPost:600,delayClear:600,offsetX:10,offsetY:5},g.config.tooltip||{});c.maction.Augment({SVGtooltip:MathJax.HTML.addElement(document.body,"div",{id:"MathJax_SVG_Tooltip"}),toSVG:function(h,k){this.SVGgetStyles();var i=this.SVG();var j=this.selected();if(j.type=="null"){this.SVGsaveData(i);return i}i.Add(this.SVGdataStretched(this.Get("selection")-1,h,k));i.removeable=false;this.SVGhandleHitBox(i);this.SVGhandleSpace(i);this.SVGhandleColor(i);this.SVGsaveData(i);return i},SVGhandleHitBox:function(h){var j=g.Element("rect",{width:h.w,height:h.h+h.d,y:-h.d,fill:"none","pointer-events":"all"});h.element.insertBefore(j,h.element.firstChild);var i=this.Get("actiontype");if(this.SVGaction[i]){this.SVGaction[i].call(this,h,h.element,this.Get("selection"))}},SVGstretchH:c.mbase.prototype.SVGstretchH,SVGstretchV:c.mbase.prototype.SVGstretchV,SVGaction:{toggle:function(h,j,i){this.selection=i;g.Element(j,{cursor:"pointer"});j.onclick=MathJax.Callback(["SVGclick",this])},statusline:function(h,j,i){j.onmouseover=MathJax.Callback(["SVGsetStatus",this]),j.onmouseout=MathJax.Callback(["SVGclearStatus",this]);j.onmouseover.autoReset=j.onmouseout.autoReset=true},tooltip:function(h,j,i){j.onmouseover=MathJax.Callback(["SVGtooltipOver",this]),j.onmouseout=MathJax.Callback(["SVGtooltipOut",this]);j.onmouseover.autoReset=j.onmouseout.autoReset=true}},SVGclick:function(j){this.selection++;if(this.selection>this.data.length){this.selection=1}var i=this;while(i.type!=="math"){i=i.inherit}var h=MathJax.Hub.getJaxFor(i.inputID);h.Update();return MathJax.Extension.MathEvents.Event.False(j)},SVGsetStatus:function(h){this.messageID=MathJax.Message.Set((this.data[1]&&this.data[1].isToken)?this.data[1].data.join(""):this.data[1].toString())},SVGclearStatus:function(h){if(this.messageID){MathJax.Message.Clear(this.messageID,0)}delete this.messageID},SVGtooltipOver:function(i){if(!i){i=window.event}if(b){clearTimeout(b);b=null}if(e){clearTimeout(e)}var h=i.pageX;var k=i.pageY;if(h==null){h=i.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;k=i.clientY+document.body.scrollTop+document.documentElement.scrollTop}var j=MathJax.Callback(["SVGtooltipPost",this,h+a.offsetX,k+a.offsetY]);e=setTimeout(j,a.delayPost)},SVGtooltipOut:function(h){if(e){clearTimeout(e);e=null}if(b){clearTimeout(b)}var i=MathJax.Callback(["SVGtooltipClear",this,80]);b=setTimeout(i,a.delayClear)},SVGtooltipPost:function(h,o){e=null;if(b){clearTimeout(b);b=null}var n=this.SVGtooltip;n.style.display="block";n.style.opacity="";if(this===d){return}n.style.left=h+"px";n.style.top=o+"px";n.innerHTML="";var k=MathJax.HTML.addElement(n,"span");var m=this;while(m.type!=="math"){m=m.inherit}var i=MathJax.Hub.getJaxFor(m.inputID);this.em=c.mbase.prototype.em=i.SVG.em;this.ex=i.SVG.ex;this.linebreakWidth=i.SVG.lineWidth;this.cwidth=i.SVG.cwidth;var j=this.data[1];m=c.math(j);try{m.toSVG(k,n)}catch(l){this.SetData(1,j);n.style.display="none";if(!l.restart){throw l}MathJax.Callback.After(["SVGtooltipPost",this,h,o],l.restart);return}this.SetData(1,j);d=this},SVGtooltipClear:function(i){var h=this.SVGtooltip;if(i<=0){h.style.display="none";h.style.opacity="";b=null}else{h.style.opacity=i/100;b=setTimeout(MathJax.Callback(["SVGtooltipClear",this,i-20]),50)}}});MathJax.Hub.Startup.signal.Post("SVG maction Ready");MathJax.Ajax.loadComplete(g.autoloadDir+"/maction.js")});
