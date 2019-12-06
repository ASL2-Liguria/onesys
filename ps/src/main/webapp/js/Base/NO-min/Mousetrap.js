// mousetrap v1.1.2
// craig.is/killing/mice
;window.Mousetrap=function(){function e(e,t,n){if(e.addEventListener)return e.addEventListener(t,n,!1);e.attachEvent("on"+t,n)}function t(e){return"keypress"==e.type?String.fromCharCode(e.which):f[e.which]?f[e.which]:l[e.which]?l[e.which]:String.fromCharCode(e.which).toLowerCase()}function n(e){var e=e||{},t=!1,n;for(n in m)e[n]?t=!0:m[n]=0;t||(b=!1)}function r(e,t,n,r,i){var s,u,a=[];if(!d[e])return[];"keyup"==n&&o(e)&&(t=[e]);for(s=0;s<d[e].length;++s)if(u=d[e][s],!(u.seq&&m[u.seq]!=u.level)&&n==u.action&&("keypress"==n||t.sort().join(",")===u.modifiers.sort().join(",")))r&&u.combo==i&&d[e].splice(s,1),a.push(u);return a}function i(e,t){!1===e(t)&&(t.preventDefault&&t.preventDefault(),t.stopPropagation&&t.stopPropagation(),t.returnValue=!1,t.cancelBubble=!0)}function s(e){e.which="number"==typeof e.which?e.which:e.keyCode;var s=t(e);if(s)if("keyup"==e.type&&y==s)y=!1;else{var u=e.target||e.srcElement,a=u.tagName;if(!(-1<(" "+u.className+" ").indexOf(" mousetrap ")?0:"INPUT"==a||"SELECT"==a||"TEXTAREA"==a||u.contentEditable&&"true"==u.contentEditable)){u=[];e.shiftKey&&u.push("shift");e.altKey&&u.push("alt");e.ctrlKey&&u.push("ctrl");e.metaKey&&u.push("meta");for(var u=r(s,u,e.type),f={},l=!1,a=0;a<u.length;++a)u[a].seq?(l=!0,f[u[a].seq]=1,i(u[a].callback,e)):!l&&!b&&i(u[a].callback,e);e.type==b&&!o(s)&&n(f)}}}function o(e){return"shift"==e||"ctrl"==e||"alt"==e||"meta"==e}function u(e,t,n){if(!n){if(!p){p={};for(var r in f)95<r&&112>r||f.hasOwnProperty(r)&&(p[f[r]]=r)}n=p[e]?"keydown":"keypress"}"keypress"==n&&t.length&&(n="keydown");return n}function a(e,s,f,l,p){var e=e.replace(/\s+/g," "),v=e.split(" "),w,E,S=[];if(1<v.length){var T=e,N=f;m[T]=0;N||(N=u(v[0],[]));e=function(){b=N;++m[T];clearTimeout(g);g=setTimeout(n,1e3)};f=function(e){i(s,e);"keyup"!==N&&(y=t(e));setTimeout(n,10)};for(l=0;l<v.length;++l)a(v[l],l<v.length-1?e:f,N,T,l)}else{E="+"===e?["+"]:e.split("+");for(v=0;v<E.length;++v)w=E[v],h[w]&&(w=h[w]),f&&"keypress"!=f&&c[w]&&(w=c[w],S.push("shift")),o(w)&&S.push(w);f=u(w,S,f);d[w]||(d[w]=[]);r(w,S,f,!l,e);d[w][l?"unshift":"push"]({callback:s,modifiers:S,action:f,seq:l,level:p,combo:e})}}for(var f={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},l={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},c={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},h={option:"alt",command:"meta","return":"enter",escape:"esc"},p,d={},v={},m={},g,y=!1,b=!1,w=1;20>w;++w)f[111+w]="f"+w;for(w=0;9>=w;++w)f[w+96]=w;e(document,"keypress",s);e(document,"keydown",s);e(document,"keyup",s);return{bind:function(e,t,n){for(var r=e instanceof Array?e:[e],i=0;i<r.length;++i)a(r[i],t,n);v[e+":"+n]=t},unbind:function(e,t){v[e+":"+t]&&(delete v[e+":"+t],this.bind(e,function(){},t))},trigger:function(e,t){v[e+":"+t]()},reset:function(){d={};v={}}}}();
