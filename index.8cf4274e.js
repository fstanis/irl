!function(){function e(e){return e&&e.__esModule?e.default:e}function t(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}class i{nextAfter(){return this.nextAfter_}getUrl_(){let e=this.baseUrl_;return this.useNew_&&(e+="/new"),`${e}.json?after=${this.after_}`}async fetch(){const e=await fetch(this.getUrl_()),t=await e.json();return this.nextAfter_=t.data.after,t.data.children.map((({data:e},t)=>{const i={url:e.url,author:e.author,title:e.title,permalink:"https://reddit.com"+e.permalink,id:e.id,index:t+1};return e.is_video&&(e.media.reddit_video||e.secure_media.reddit_video)?Object.assign(i,this.extractVideo_(e)):e.url.startsWith("https://v.redd.it/")?Object.assign(i,this.guessVideo_(e)):e.url.startsWith("https://i.redd.it/")||e.url.startsWith("https://i.imgur.com/")?Object.assign(i,this.extractImage_(e)):e.url.startsWith("https://gfycat.com/")&&Object.assign(i,this.extractGfycat_(e)),i})).filter((e=>e.image||e.video||e.gfycat))}extractImage_(e){return{image:{width:e.thumbnail_width,height:e.thumbnail_height,src:e.url}}}extractGfycat_(e){const t=e.url.match(/^https:\/\/gfycat\.com\/([^\/]+)/);return t?{gfycat:{width:e.thumbnail_width,height:e.thumbnail_height,id:t[1]}}:{}}extractVideo_(e){let t;return e.media.reddit_video?t=e.media.reddit_video:e.secure_media.reddit_video&&(t=e.secure_media.reddit_video),{video:{poster:this.getPoster_(e),src:{fallback:t.fallback_url,hls:t.hls_url,dash:t.dash_url}}}}guessVideo_(e){return{video:{poster:this.getPoster_(e),src:{fallback:`${e.url}/DASH_480.mp4?source=fallback`,hls:`${e.url}/HLSPlaylist.m3u8`,dash:`${e.url}/DASHPlaylist.mpd`}}}}getPoster_(e){if(e.preview&&e.preview.images)return e.preview.images[0].source.url.replace(/&amp;/g,"&")}constructor(e,t,i=!1){this.baseUrl_=e,this.after_=t||"",this.useNew_=i||!1,this.nextAfter_=null}}const n={me:{url:"https://www.reddit.com/r/me_irl",title:"me_irl"},meow:{url:"https://www.reddit.com/r/MEOW_IRL",title:"meow_irl"},woof:{url:"https://www.reddit.com/r/woof_irl",title:"woof_irl"}},r="meow";var s={};s=function(){"use strict";
/*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */var e=Object.prototype.toString,t=Array.isArray||function(t){return"[object Array]"===e.call(t)};function i(e){return"function"==typeof e}function n(e){return t(e)?"array":typeof e}function r(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function s(e,t){return null!=e&&"object"==typeof e&&t in e}function a(e,t){return null!=e&&"object"!=typeof e&&e.hasOwnProperty&&e.hasOwnProperty(t)}var o=RegExp.prototype.test;function c(e,t){return o.call(e,t)}var l=/\S/;function p(e){return!c(l,e)}var h={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function u(e){return String(e).replace(/[&<>"'`=\/]/g,(function(e){return h[e]}))}var d=/\s*/,m=/\s+/,f=/\s*=/,g=/\s*\}/,y=/#|\^|\/|>|\{|&|=|!/;function v(e,i){if(!e)return[];var n,s,a,o=!1,c=[],l=[],h=[],u=!1,v=!1,x="",k=0;function C(){if(u&&!v)for(;h.length;)delete l[h.pop()];else h=[];u=!1,v=!1}function j(e){if("string"==typeof e&&(e=e.split(m,2)),!t(e)||2!==e.length)throw new Error("Invalid tags: "+e);n=new RegExp(r(e[0])+"\\s*"),s=new RegExp("\\s*"+r(e[1])),a=new RegExp("\\s*"+r("}"+e[1]))}j(i||S.tags);for(var L,E,U,A,P,O,T=new b(e);!T.eos();){if(L=T.pos,U=T.scanUntil(n))for(var I=0,R=U.length;I<R;++I)p(A=U.charAt(I))?(h.push(l.length),x+=A):(v=!0,o=!0,x+=" "),l.push(["text",A,L,L+1]),L+=1,"\n"===A&&(C(),x="",k=0,o=!1);if(!T.scan(n))break;if(u=!0,E=T.scan(y)||"name",T.scan(d),"="===E?(U=T.scanUntil(f),T.scan(f),T.scanUntil(s)):"{"===E?(U=T.scanUntil(a),T.scan(g),T.scanUntil(s),E="&"):U=T.scanUntil(s),!T.scan(s))throw new Error("Unclosed tag at "+T.pos);if(P=">"==E?[E,U,L,T.pos,x,k,o]:[E,U,L,T.pos],k++,l.push(P),"#"===E||"^"===E)c.push(P);else if("/"===E){if(!(O=c.pop()))throw new Error('Unopened section "'+U+'" at '+L);if(O[1]!==U)throw new Error('Unclosed section "'+O[1]+'" at '+L)}else"name"===E||"{"===E||"&"===E?v=!0:"="===E&&j(U)}if(C(),O=c.pop())throw new Error('Unclosed section "'+O[1]+'" at '+T.pos);return _(w(l))}function w(e){for(var t,i,n=[],r=0,s=e.length;r<s;++r)(t=e[r])&&("text"===t[0]&&i&&"text"===i[0]?(i[1]+=t[1],i[3]=t[3]):(n.push(t),i=t));return n}function _(e){for(var t,i=[],n=i,r=[],s=0,a=e.length;s<a;++s)switch((t=e[s])[0]){case"#":case"^":n.push(t),r.push(t),n=t[4]=[];break;case"/":r.pop()[5]=t[2],n=r.length>0?r[r.length-1][4]:i;break;default:n.push(t)}return i}function b(e){this.string=e,this.tail=e,this.pos=0}function x(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function k(){this.templateCache={_cache:{},set:function(e,t){this._cache[e]=t},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}b.prototype.eos=function(){return""===this.tail},b.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var i=t[0];return this.tail=this.tail.substring(i.length),this.pos+=i.length,i},b.prototype.scanUntil=function(e){var t,i=this.tail.search(e);switch(i){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,i),this.tail=this.tail.substring(i)}return this.pos+=t.length,t},x.prototype.push=function(e){return new x(e,this)},x.prototype.lookup=function(e){var t,n=this.cache;if(n.hasOwnProperty(e))t=n[e];else{for(var r,o,c,l=this,p=!1;l;){if(e.indexOf(".")>0)for(r=l.view,o=e.split("."),c=0;null!=r&&c<o.length;)c===o.length-1&&(p=s(r,o[c])||a(r,o[c])),r=r[o[c++]];else r=l.view[e],p=s(l.view,e);if(p){t=r;break}l=l.parent}n[e]=t}return i(t)&&(t=t.call(this.view)),t},k.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},k.prototype.parse=function(e,t){var i=this.templateCache,n=e+":"+(t||S.tags).join(":"),r=void 0!==i,s=r?i.get(n):void 0;return null==s&&(s=v(e,t),r&&i.set(n,s)),s},k.prototype.render=function(e,t,i,n){var r=this.getConfigTags(n),s=this.parse(e,r),a=t instanceof x?t:new x(t,void 0);return this.renderTokens(s,a,i,e,n)},k.prototype.renderTokens=function(e,t,i,n,r){for(var s,a,o,c="",l=0,p=e.length;l<p;++l)o=void 0,"#"===(a=(s=e[l])[0])?o=this.renderSection(s,t,i,n,r):"^"===a?o=this.renderInverted(s,t,i,n,r):">"===a?o=this.renderPartial(s,t,i,r):"&"===a?o=this.unescapedValue(s,t):"name"===a?o=this.escapedValue(s,t,r):"text"===a&&(o=this.rawValue(s)),void 0!==o&&(c+=o);return c},k.prototype.renderSection=function(e,n,r,s,a){var o=this,c="",l=n.lookup(e[1]);function p(e){return o.render(e,n,r,a)}if(l){if(t(l))for(var h=0,u=l.length;h<u;++h)c+=this.renderTokens(e[4],n.push(l[h]),r,s,a);else if("object"==typeof l||"string"==typeof l||"number"==typeof l)c+=this.renderTokens(e[4],n.push(l),r,s,a);else if(i(l)){if("string"!=typeof s)throw new Error("Cannot use higher-order sections without the original template");null!=(l=l.call(n.view,s.slice(e[3],e[5]),p))&&(c+=l)}else c+=this.renderTokens(e[4],n,r,s,a);return c}},k.prototype.renderInverted=function(e,i,n,r,s){var a=i.lookup(e[1]);if(!a||t(a)&&0===a.length)return this.renderTokens(e[4],i,n,r,s)},k.prototype.indentPartial=function(e,t,i){for(var n=t.replace(/[^ \t]/g,""),r=e.split("\n"),s=0;s<r.length;s++)r[s].length&&(s>0||!i)&&(r[s]=n+r[s]);return r.join("\n")},k.prototype.renderPartial=function(e,t,n,r){if(n){var s=this.getConfigTags(r),a=i(n)?n(e[1]):n[e[1]];if(null!=a){var o=e[6],c=e[5],l=e[4],p=a;0==c&&l&&(p=this.indentPartial(a,l,o));var h=this.parse(p,s);return this.renderTokens(h,t,n,p,r)}}},k.prototype.unescapedValue=function(e,t){var i=t.lookup(e[1]);if(null!=i)return i},k.prototype.escapedValue=function(e,t,i){var n=this.getConfigEscape(i)||S.escape,r=t.lookup(e[1]);if(null!=r)return"number"==typeof r&&n===S.escape?String(r):n(r)},k.prototype.rawValue=function(e){return e[1]},k.prototype.getConfigTags=function(e){return t(e)?e:e&&"object"==typeof e?e.tags:void 0},k.prototype.getConfigEscape=function(e){return e&&"object"==typeof e&&!t(e)?e.escape:void 0};var S={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(e){C.templateCache=e},get templateCache(){return C.templateCache}},C=new k;return S.clearCache=function(){return C.clearCache()},S.parse=function(e,t){return C.parse(e,t)},S.render=function(e,t,i,r){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+n(e)+'" was given as the first argument for mustache#render(template, view, partials)');return C.render(e,t,i,r)},S.escape=u,S.Scanner=b,S.Context=x,S.Writer=k,S}();const a='<!doctype html>\n\x3c!--\n Copyright 2019 Google LLC\n\n Licensed under the Apache License, Version 2.0 (the "License");\n you may not use this file except in compliance with the License.\n You may obtain a copy of the License at\n\n      http://www.apache.org/licenses/LICENSE-2.0\n\n Unless required by applicable law or agreed to in writing, software\n distributed under the License is distributed on an "AS IS" BASIS,\n WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n See the License for the specific language governing permissions and\n limitations under the License.\n--\x3e\n\n<html ⚡ lang="en">\n\n<head>\n  <meta charset="utf-8">\n  <script async src="https://cdn.ampproject.org/v0.js"><\/script>\n  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"><\/script>\n  <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"><\/script>\n  <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-gfycat-0.1.js"><\/script>\n  <title>{{title}}</title>\n  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">\n  <link rel="canonical" href="{{canonical}}">\n  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>\n  <style amp-custom>\n    amp-img img {\n      object-fit: contain;\n    }\n\n    .textbox {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-family: sans-serif;\n      text-align: center;\n      margin: 2em;\n      color: white;\n      text-shadow: 1px 1px 2px black;\n      font-size: 1.5em;\n    }\n  </style>\n</head>\n\n<body>\n  <amp-story standalone supports-landscape title="{{title}}">\n    {{#items}}\n    <amp-story-page id="page{{index}}" data-reddit-id="{{id}}">\n      <amp-story-grid-layer template="vertical">\n        {{#video}}\n        <amp-video autoplay poster="{{poster}}" layout="fill">\n          <source src={{src.dash}} type="application/dash+xml">\n          <source src={{src.hls}} type="application/vnd.apple.mpegURL">\n          <source src="{{src.fallback}}" type="video/mp4">\n        </amp-video>\n        {{/video}}\n        {{#image}}\n        <amp-img src="{{src}}" layout="fill">\n        </amp-img>\n        {{/image}}\n        {{#gfycat}}\n        <amp-gfycat data-gfyid="{{id}}" layout="responsive" width="1" height="2">\n        </amp-gfycat>\n        {{/gfycat}}\n      </amp-story-grid-layer>\n      <amp-story-page-outlink layout="nodisplay">\n        <a href="{{permalink}}" target="_blank">Reddit post</a>\n      </amp-story-page-outlink>\n    </amp-story-page>\n    {{/items}}\n    <amp-story-page id="lastpage">\n      <amp-story-grid-layer template="fill">\n        <div class="textbox">\n          <p>You\'ve reached the end. Press "Load more" below.</p>\n        </div>\n      </amp-story-grid-layer>\n    </amp-story-page>\n  </amp-story>\n</body>\n\n</html>\n';e(s).parse(a);class o{async display_(){this.irl=new i(this.target_.url,this.after_,this.useNew_),await this.render_()}async render_(){const t=await this.irl.fetch(),i=e(s).render(a,{taget:this.target_.title,canonical:window.location.href,items:t});this.itemMap_=new Map(t.map((e=>[e.id,e])));const n=new Blob([i],{type:"text/html"}),r=URL.createObjectURL(n)+"#page="+this.page_,o=this.createIframe_();o.setAttribute("src",r),this.container_.prepend(o),await new Promise((e=>o.addEventListener("load",e))),URL.revokeObjectURL(r),this.iframe_&&this.container_.removeChild(this.iframe_),this.iframe_=o,o.style.display="",this.registerPageChange_(this.onStoryPageChange_);let c=`#mode=${this.mode_}&after=${this.irl.nextAfter()}`;this.useNew_&&(c+="&new"),this.next_.href=c}registerPageChange_(e){const t=this.iframe_.contentDocument.querySelector("amp-story");new MutationObserver((t=>{const i=t.map((e=>e.target)).find((e=>"AMP-STORY-PAGE"===e.tagName&&e.hasAttribute("active")));i&&e(i)})).observe(t,{subtree:!0,attributeFilter:["active"]})}createIframe_(){const e=document.createElement("iframe");return e.setAttribute("sandbox","allow-scripts allow-same-origin allow-top-navigation-by-user-activation"),e.style.display="none",e}constructor({container:e,iframe:i,next:s,fullscreen:a}){t(this,"onStoryPageChange_",(e=>{this.page_=e.getAttribute("id");const t=new URLSearchParams(window.location.hash.substring(1));t.set("page",this.page_),history.replaceState(null,"","#"+t.toString())})),t(this,"update_",(async()=>{const e=new URLSearchParams(window.location.hash.substring(1));this.mode_=e.get("mode")||r,this.after_=e.get("after")||"",this.useNew_=e.has("new"),this.page_=e.get("page")||"",this.target_=n[this.mode_],this.container_.className="",await this.display_(),this.container_.className="loaded"})),t(this,"resize_",(()=>{this.container_.style.height=window.innerHeight+"px"})),t(this,"fullscreen_",(()=>{this.isFullscreen_?(this.isFullscreen_=!1,document.exitFullscreen()):(this.isFullscreen_=!0,document.documentElement.requestFullscreen())})),this.container_=e,this.iframe_=null,this.isFullscreen_=!1,this.next_=s,this.mode_=r,this.page_="",window.addEventListener("hashchange",this.update_),window.addEventListener("resize",this.resize_),a.addEventListener("click",this.fullscreen_),this.resize_(),this.update_()}}async function c(){new o({container:document.querySelector("#container"),iframe:document.querySelector("#story"),next:document.querySelector("#next"),fullscreen:document.querySelector("#fullscreen")}),window.scrollTo(0,1)}"complete"===document.readyState||"interactive"===document.readyState?c():document.addEventListener("DOMContentLoaded",c)}();
//# sourceMappingURL=index.8cf4274e.js.map
