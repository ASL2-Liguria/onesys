// Ritorna le dimensioni senza "px"
;$.fn.pixels=function(property){return parseInt(this.css(property).slice(0,-2));};


/*-- UTILITY----(Provvisorio)*/
;$.fn.removeAttributes = function(regex) {
    return this.each(function() {
        var attributes = $.map(this.attributes, function(attr) {
            return attr.name;
        });
        var $this = $(this);
        $.each(attributes, function(i, attr) {

            if (regex.test(attr)) {
                // alert(attr);
                $this.removeAttr(attr);
            }
        });
    });
}

$.fn.like=function() { var lk="%25"; return (arguments[0])?lk+this.val()+lk:this.val()+lk; };
String.prototype.like=function(){var lk="%25";return (arguments[0])?lk+this+lk:this+lk;};

$.event.special.keyEnter = {
    setup: function(data, namespaces) {
        $elem = $(this);
        $elem.bind('keypress', jQuery.event.special.keyEnter.handler);
    },
    teardown: function(namespaces) {
        $elem = $(this);
        $elem.unbind('keypress', jQuery.event.special.keyEnter.handler)
    },
    handler: function(event) {
        if (event.keyCode == '13')
        {
            event.type = "keyEnter";
            jQuery.event.handle.apply(this, arguments);
        }
    }

};

var a=window.alert;
window.alert=function(msg)
{
    var tmp_msg=msg;
    tmp_msg+="\n[TYPEOF] : "+typeof(msg);
    if(typeof(msg)=="object")
    {
        try{
            tmp_msg+="\n[JSON] : "+JSON.stringify(msg);
        }catch(e){

        }
    }

    a(tmp_msg);

    return window.alert;
};

var LIB = {
        getHeight:function(){var vW;var vH;if(typeof window.innerWidth!='undefined'){vW=window.innerWidth,vH=window.innerHeight;}else if(typeof document.documentElement!='undefined'&&typeof document.documentElement.clientWidth!='undefined'&&document.documentElement.clientWidth!=0){vW=document.documentElement.clientWidth,vH=document.documentElement.clientHeight;}else{vW=document.getElementsByTagName('body')[0].clientWidth,vH=document.getElementsByTagName('body')[0].clientHeight;}return vH;},
        getWidth:function(){var vW;var vH;if(typeof window.innerWidth!='undefined'){vW=window.innerWidth,vH=window.innerHeight;}else if(typeof document.documentElement!='undefined'&&typeof document.documentElement.clientWidth!='undefined'&&document.documentElement.clientWidth!=0){vW=document.documentElement.clientWidth,vH=document.documentElement.clientHeight;}else{vW=document.getElementsByTagName('body')[0].clientWidth,vH=document.getElementsByTagName('body')[0].clientHeight;}return vW;},
        print_r:function(o,level,max){var output="";if(!level)level=0;var padding="";for(var j=0;j<level+1;j++)padding+="    ";if(!max)max=10;if(level==max)return padding+"Max level ["+level+"] reached\n";if(typeof(o)=='object'){for(var item in o){var value=o[item];if(typeof(value)=='object'){output+=padding+"["+item+"] => Array\n";output+=LIB.print_r(value,level+1,max);}else{output+=padding+"["+item+"] => \""+value+"\"\n";}}}else{output="("+typeof(o)+") => "+o;}return output;},
        getJoined:function(o,c){var t=new Array(0);$.each(o,function(k,v){t.push(v[c]);});return t.join();},
        checkParameter:function(params,key,def){params = (typeof params != 'undefined') ? params : {};if(typeof params[key] == 'undefined'){params[key] = def;}},
        getParameter:function(params,key){if(typeof params[key] == 'undefined')return null;return params[key];},
        getParamUserGlobal:function (type, def) {
        	if (LIB.isValid(home.baseUser[type]) && home.baseUser[type] != "")
        		return home.baseUser[type];
        	if (LIB.isValid(home.baseGlobal[type]) && home.baseGlobal[type] != "")
        		return home.baseGlobal[type];
        	return def;
        },
        getParamPcGlobal:function (type, def) {
        	if (LIB.isValid(home.basePC[type]) && home.basePC[type] != "")
        		return home.basePC[type];
        	if (LIB.isValid(home.baseGlobal[type]) && home.baseGlobal[type] != "")
        		return home.baseGlobal[type];
        	return def;
        },
        /**
        * Restituisce il valore del parametro di configurazione richiesto
        *
        * @param {String | Array} key : se Array restituisce il primo valore non nullo, non undefined relativo alle chiave all'indice elaborato
        * @param {String} sito : sito della configurazione, se non presente viene utilizzato quello di default
        * @returns {String}
        * @throws {String} se impossibile ottenere una valore valido per la/e chiave/i fornita/e
        */
        getParamGlobal : function(key, sito){
            var output;
            var parametri = (sito ? home.baseGlobal[sito] : home.baseGlobal);

            if(typeof key === 'object'){
                for(var i=0;i < key.length; i++){
                    var value = parametri[key[i]];
                    if(value){
                        output = value;
                        break;
                    }
                }
            }else{
                output = parametri[key];
            }

            if(output){
                return output;
            }else{
                throw "Impossibile ottenere un valore valido per la chiave di configurazione " + JSON.stringify(key);
            }
        },
        getUnixtime:function(){var foo=new Date;return foo.getTime();},
        isValid:function(n){return typeof n !== 'undefined' && n !== null;},
        ToF:function(o){if(typeof(o)=="boolean")return o;return o==="S" || o==="Y" || o==="true" || o==="YES";}, /*TrueOrFalse*/
        getMymeType:function(ext){var mymetypes = {"txt": "application/text","pdf": "application/pdf","gif"	: "image/gif","doc"	: "application/msword" ,"docx" : "application/msword","jpg" : "image/jpeg","jpeg" : "image/jpeg","xls" : "application/excel","xlsx" : "application/excel","png" : "image/png","bmp" : "image/bmp","avi" : "video/avi"}; return ( typeof mymetypes[ext] !== 'undefined' ) ? mymetypes[ext] :"type/undefined";},
        isHour: function(val){var r = new RegExp( '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$' );return r.test( val );},
        stopBubble:function(e){"use strict";if(e){e.stopPropagation();}else{window.event.cancelBubble=true;}},
		getIEVersion: function(){
			var rv = -1;
			if (navigator.appName == 'Microsoft Internet Explorer') {
				var ua = navigator.userAgent;
				var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null)
					rv = parseFloat( RegExp.$1 );
			}else if (navigator.appName == 'Netscape') {
			    var ua = navigator.userAgent;
			    var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			    if (re.exec(ua) != null)
			    	rv = parseFloat( RegExp.$1 );
			}
			return rv;
		},
        xmlToString: function(xmlData){if(typeof XMLSerializer == 'undefined') return xmlData.xml; else return (new XMLSerializer()).serializeToString(xmlData);},
        setGetParameter:function(_url,paramName, paramValue)
        {
            var url = (_url!=null)?_url:window.location.href;
            if (url.indexOf(paramName + "=") >= 0)
            {
                var prefix = url.substring(0, url.indexOf(paramName));
                var suffix = url.substring(url.indexOf(paramName)).substring(url.indexOf("=") + 1);
                suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
                url = prefix + paramName + "=" + paramValue + suffix;
            }
            else
            {
                if (url.indexOf("?") < 0)
                    url += "?" + paramName + "=" + paramValue;
                else
                    url += "&" + paramName + "=" + paramValue;
            }
            return url;
        },
        //ritorna json gli attributi data- di un oggetto js passato come parametro (XKE' in IE non funziona data())
        getDataAttributes:function(e){var t={};$.each(e.attributes,function(e,n){if(/^data-/.test(n.name)){var r=n.name.substr(5).replace(/-(.)/g,function(e,t){return t.toLowerCase();});t[r.toLowerCase()]=n.value;}});return t;},
        // tabella config_web.permessi
        getPermesso:function(gruppo,id,defaultVal){return (typeof home.basePermission[gruppo] !== 'undefined') ? ( (typeof (home.basePermission[gruppo])[id] !== 'undefined') ? (home.basePermission[gruppo])[id] : defaultVal) : defaultVal;}
};

;(function($){var num=function(value){return parseInt(value,10)||0};$.each(['min','max'],function(i,name){$.fn[name+'Size']=function(value){var width,height;if(value){if(value.width!==undefined){this.css(name+'-width',value.width)}if(value.height!==undefined){this.css(name+'-height',value.height)}return this}else{width=this.css(name+'-width');height=this.css(name+'-height');return{'width':(name==='max'&&(width===undefined||width==='none'||num(width)===-1)&&Number.MAX_VALUE)||num(width),'height':(name==='max'&&(height===undefined||height==='none'||num(height)===-1)&&Number.MAX_VALUE)||num(height)}}}});$.fn.isVisible=function(){return this.is(':visible')};$.each(['border','margin','padding'],function(i,name){$.fn[name]=function(value){if(value){if(value.top!==undefined){this.css(name+'-top'+(name==='border'?'-width':''),value.top)}if(value.bottom!==undefined){this.css(name+'-bottom'+(name==='border'?'-width':''),value.bottom)}if(value.left!==undefined){this.css(name+'-left'+(name==='border'?'-width':''),value.left)}if(value.right!==undefined){this.css(name+'-right'+(name==='border'?'-width':''),value.right)}return this}else{return{top:num(this.css(name+'-top'+(name==='border'?'-width':''))),bottom:num(this.css(name+'-bottom'+(name==='border'?'-width':''))),left:num(this.css(name+'-left'+(name==='border'?'-width':''))),right:num(this.css(name+'-right'+(name==='border'?'-width':'')))}}}})}(jQuery));
;(function($){$.fn.realWidth=function(totalWidth){return this.each(function(){var $this=$(this);var pleft=$this.padding().left;var pright=$this.padding().right;var mleft=$this.margin().left;var mright=$this.margin().right;var bleft=$this.border().left;var bright=$this.border().right;var w=totalWidth-pleft-pright-mleft-mright-bleft-bright;$this.width(w)})}})(jQuery);
;(function($){$.fn.realHeight=function(totalHeight){return this.each(function(){var $this=$(this);var ptop=$this.padding().top;var pbottom=$this.padding().bottom;var mtop=$this.margin().top;var mbottom=$this.margin().bottom;var btop=$this.border().top;var bbottom=$this.border().bottom;var h=totalHeight-ptop-pbottom-mtop-mbottom-btop-bbottom;$this.height(h)})}})(jQuery);

/* Funzione che rimuove la parte "px" e ritorna un number... */
String.prototype.removePX = function(){try{return parseInt(this.toLowerCase().replace('px', ''), 10);}catch(ex){return this;}}

/* Funzione per ricercare un oggetto json dentro un array tramite chiave */
Array.prototype.searchForKeyJSON = function(id){for(var i in this)if(LIB.isValid(this[i][id]))return {'index' : i, 'key' : id, 'value' : this[i][id]};return null;}

Array.prototype.compare = function (array) {if (!array)return false;if (this.length != array.length)return false;for (var i = 0; i < this.length; i++) {if (this[i] instanceof Array && array[i] instanceof Array) {if (!this[i].compare(array[i]))return false;}else if (this[i] != array[i]) {return false;}}return true;}
/*controlla se gli elementi dell'array sono tutti uguali*/
Array.prototype.allValuesSame = function(){

    if(this.length > 0) {
        for(var i = 1; i < this.length; i++)
        {
            if(this[i] !== this[0])
                return false;
        }
    }
    return true;
}

/* Controlla se il click è destro o no... */
function isRightClick(ev){var ret = false;if(ev.which)ret = (ev.which == 3);else if (ev.button) ret = (ev.button == 2);return ret;}

function sleep(milliseconds){var start = new Date().getTime();for (var i = 0; i < 1e7; i++){if((new Date().getTime() - start) > milliseconds){break;}}};

var userAgent=navigator.userAgent.toLowerCase();
jQuery.browser={version: (userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1],chrome: /chrome/.test( userAgent ),safari: /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),opera: /opera/.test( userAgent ),msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),ipad: /ipad/.test( userAgent ) ,iphone: /iphone/.test( userAgent ),android: /android/.test( userAgent )};

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};
/**
 * semaphore
 * crea un semaforo per indicare l ostato attivita'
 */
$.fn.semaphore = function(steps){
    var obj = $(document.createElement("div")).addClass("semaphore");
    for(var i=0; i< steps.length; i++){
        obj.append($(document.createElement("i")).css("color", steps[i].color).attr("title", steps[i].title).addClass("icon-record"));
    }
    this.append(obj);
};

/* definizione di object keys qualora non esistente ( compatiibilita' ie8) */
if (!Object.keys) {
	Object.keys = (function() {
		'use strict';
		var hasOwnProperty =
			Object.prototype.hasOwnProperty
			, hasDontEnumBug = !({toString : null}).propertyIsEnumerable('toString')
			, dontEnums =
				[
				 	'toString'
			        , 'toLocaleString'
			        , 'valueOf'
			        , 'hasOwnProperty'
			        , 'isPrototypeOf'
			        , 'propertyIsEnumerable'
			        , 'constructor'
			    ]
			, dontEnumsLength = dontEnums.length;

		return function(obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
};

/*GESTIONE LOCKS_ROW*/
var LOCKS = {
    /**
     *
     * @param {type} params
     * @param {type} callbackOK
     * @param {type} callbackKO
     */
    lock_rows: function(params, callbackOK, callbackKO)
        /*
         params = {
          p_table : {v:'value',t:'V'},
          p_iden : {v:'value',t:'V'}, separati da virgola
          p_username :  {v:'value',t:'V'},
          p_ip : {v:'value',t:'V'},
          p_sito :  {v:'value',t:'V'},
          p_result : {d:'O',t:'V'}
          p_message :  {d:'O',t:'V'}
         }
         */
    {
        logger.debug(JSON.stringify(params));
        var db = $.NS_DB.getTool({setup_default:{datasource:'POLARIS_DATI',async:false}});

        var xhr = db.call_procedure({
                    id: "PKG_ROWS_LOCK.DO_LOCK",
                    parameter: params
                });

        xhr.done(
                function (data, textStatus, jqXHR) {
                    logger.debug('lock_rows(): ' + JSON.stringify(data) + ' chiamata con i parametri: ' + JSON.stringify(params));

                    var result = data.p_result;
                    var message = data.p_message;

                    if(result === 'OK')
                    {
                        if (typeof callbackOK === "function") {
                            callbackOK(data);
                        }
                    }
                    else
                    {
                        if (typeof callbackKO === "function") {
                            callbackKO(message);
                        }
                    }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
                logger.error("LOCK_ROWS in errore: " + JSON.stringify(jqXHR) + " con parametri: " + JSON.stringify(params));
                if (typeof callbackKO === "function") {
                    callbackKO(jqXHR, textStatus, errorThrown);
                }
        });

    },
    /**
     *
     * @param {type} params
     * @param {type} callbackOK
     * @param {type} callbackKO
     */
    unlock_rows: function(params, callbackOK, callbackKO)
    //  procedure DO_UNLOCK (p_table VARCHAR2, p_iden number, p_username varchar2, p_ip varchar2, p_sito in varchar2 := 'RIS', p_result out varchar2) as
        // se non vengono passati parametri vengono sbloccate tutte le righe dell'utente collegato
        /*
         params = {
          p_table : {v:'value',t:'V'},
          p_iden : {v:'value',t:'V'}, separati da virgola
          p_username :  {v:'value',t:'V'},
          p_ip : {v:'value',t:'V'},
          p_sito :  {v:'value',t:'V'},
          p_result : {d:'O',t:'V'}
         }
         */
    {
        var params = (typeof params !== 'undefined') ? params :
        {
            p_table : {v:'',t:'V'},
            p_iden : {v:'',t:'V'},
            p_username :  {v: home.baseUser.USERNAME,t:'V'},
            p_ip : {v:home.basePC.IP,t:'V'},
            p_sito :  {v:$('#SITO').val(),t:'V'},
            p_result : {d:'O',t:'V'}
        };

        var db = $.NS_DB.getTool({setup_default:{datasource:'POLARIS_DATI',async:false}});

        var xhr = db.call_procedure({
                    id: "PKG_ROWS_LOCK.DO_UNLOCK",
                    parameter: params
                });

        xhr.done(
                function (data, textStatus, jqXHR) {
                    logger.debug('lock_rows(): ' + JSON.stringify(data) + ' chiamata con i parametri: ' + JSON.stringify(params));

                    var result = data.p_result;

                    if(result === 'OK')
                    {
                        if (typeof callbackOK === "function") {
                            callbackOK(data);
                        }
                    }
                    else
                    {
                        if (typeof callbackKO === "function") {
                            callbackKO();
                        }
                    }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
                logger.error("LOCK_ROWS in errore: " + JSON.stringify(jqXHR) + " con parametri: " + JSON.stringify(params));
                if (typeof callbackKO === "function") {
                    callbackKO(jqXHR, textStatus, errorThrown);
                }
        });
    },

    /**
     * Verifica che la riga di cui si chiede l'analisi risulta bloccata o meno da una altro utente
     * @param {type} params : {p_table, p_iden}
     * @param {type} callbackOK : chiamata con fn({isLocked, username, data_lock, ip})
     * @param {type} callbackKO : chiamata con fn(errorString, exception)
     * @returns {undefined}
     */
    check_lock: function(params, callbackOK, callbackKO)
        /*
         {
         [p_table] tabella da controllare
         [p_iden] iden della riga da controllare
         }
         */
    {


        params = $.extend({o_username : {d:"O", t:"V"}, o_data_lock: {d:"O", t:"V"}, o_ip: {d:"O", t:"V"}, o_Personale : {d:"O", t:"V"}}, params);

        var db = $.NS_DB.getTool({setup_default:{datasource:'POLARIS_DATI',async:false}});

        var xhr = db.call_procedure({
                    id: "PKG_ROWS_LOCK.DO_CHECK",
                    parameter: params
                });

        xhr.done(
                function (data, textStatus, jqXHR) {
                    logger.debug("PKG_ROWS_LOCK.DO_CHECK con parametri: " + JSON.stringify(params));
                    if (typeof callbackOK === "function") {
                        logger.debug(JSON.stringify(data));
                        callbackOK({isLocked: LIB.isValid(data.o_username), username: data.o_username, data_lock: data.o_data_lock, ip: data.o_ip, personale : data.o_Personale});
                    }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
                 logger.error("PKG_ROWS_LOCK.DO_CHECK in errore: " + JSON.stringify(jqXHR) + " con parametri: " + JSON.stringify(params));
                    if (typeof callbackKO === "function") {
                        callbackKO(jqXHR);
                    }
        });

    }
};