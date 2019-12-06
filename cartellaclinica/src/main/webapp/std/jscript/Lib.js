/*
 *

 *	Tabulazione
 *	Author: Fabriziod
 *
 *	Si basa su una struttura del tipo:
 *	<div id="tab1"></div>
 *	<div id="tab2"></div>
 *	.....................
 *	<div id="tabN"></div>
 *
 *	Per attivare:
 *	var lista = ['NomeTab1','NomeTab2','NomeTab3'];
 *	var tabApertoDefault = 1;
 *	attivaTab(lista, tabApertoDefault);
 *
 */

function attivaTab(lista, attivo, parameters)
{
    parameters = typeof parameters == 'undefined' ? {} : parameters;
    parameters.action = typeof parameters.action == 'undefined' ? switchTab : parameters.action;
    parameters.lista = typeof parameters.lista == 'undefined' ? lista : parameters.lista;
    parameters.tabAttivo = typeof parameters.tabAttivo == 'undefined' ? attivo : parameters.tabAttivo;

    //var htmlTAB = "<ul id='nav'>\n";

    var tabulator = $("<ul></ul>").attr("id","nav");
    parameters.lista.forEach(function(element, index, array){

        var handler;
        
        if(typeof element == 'object' && typeof element.action == 'function'){
            handler = function(event){
            				if(!lista[index].loaded || lista[index].forcereload){
            					element.action();
            					lista[index].loaded = true;
            				}            				
            				switchTab(event);
            			};
        }else{
            handler = parameters.action;
        }

        var tab = $('"<li></li>')
                    .attr("tab","tab" + (index+1))
                    .attr("id",(index+1) == parameters.tabAttivo ? "active" : "")
                    .append(
                        $('<a></a>')
                            //.attr("href","#")
                            .append(
                                $('<span></span>')
                                    .text(typeof element == 'string' ? element : element.label)
                            )
                    )
                    .click(handler);
        tabulator.append(tab);
    });
    


    $("#tab1").before(tabulator);

    if(typeof attivo != 'undefined'){    	
    	$('ul#nav li:eq('+(attivo-1)+')').click();
    }    
    
    $('div[id^="tab"]').addClass("tab").hide();
    $('#tab'+parameters.tabAttivo).show();


    function switchTab(event){
        event.preventDefault();        
        
        $("ul#nav li").attr("id","");
        //$(this).attr("id","active");
        $(event.target).closest('li').attr("id","active");

        var divtab = $(event.target).closest('li').attr("tab");

        $(".tab").hide();
        //alert(divtab);
        $("#"+divtab).show();
    }
}


/*
 *	funzione forEach per JavaScript
 */
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

function elab_data(dataIn){anno = dataIn.substr(6,4);mese = dataIn.substr(3,2);giorno = dataIn.substr(0,2);return anno+mese+giorno;}

//	Ritorna la data odierna	in formato gg/mm/aaaa
function getDataOggi(){var dataOggi=new Date();dataOggiGiorno=dataOggi.getDate();dataOggiMese=dataOggi.getMonth()+1;dataOggiAnno=dataOggi.getFullYear();if(dataOggiGiorno<10){dataOggiGiorno="0"+dataOggiGiorno;}dataOggiStringa=""+dataOggiGiorno+"/";if(dataOggiMese<10){dataOggiMese="0"+dataOggiMese;}dataOggiStringa+=dataOggiMese+"/";dataOggiStringa+=dataOggiAnno;return dataOggiStringa;}

//	Ritorna la data odierna + 30 giorni	in formato gg/mm/aaaa
function getData30(){var dataOggi=new Date();dataOggi.setDate(dataOggi.getDate()+30);dataOggiGiorno=dataOggi.getDate();dataOggiMese=dataOggi.getMonth()+1;dataOggiAnno=dataOggi.getFullYear();if(dataOggiGiorno<10){dataOggiGiorno="0"+dataOggiGiorno;}dataOggiStringa=""+dataOggiGiorno+"/";if(dataOggiMese<10){dataOggiMese="0"+dataOggiMese;}dataOggiStringa+=dataOggiMese+"/";dataOggiStringa+=dataOggiAnno;return dataOggiStringa;}

//	Ritorna la data odierna + ggg giorni in formato gg/mm/aaaa
function getData(ggg){var dataOggi=new Date();dataOggi.setDate(dataOggi.getDate()+ggg);dataOggiGiorno=dataOggi.getDate();dataOggiMese=dataOggi.getMonth()+1;dataOggiAnno=dataOggi.getFullYear();if(dataOggiGiorno<10){dataOggiGiorno="0"+dataOggiGiorno;}dataOggiStringa=""+dataOggiGiorno+"/";if(dataOggiMese<10){dataOggiMese="0"+dataOggiMese;}dataOggiStringa+=dataOggiMese+"/";dataOggiStringa+=dataOggiAnno;return dataOggiStringa;}

//	Ritorna l'ora attuale in formato hh:mm
function getOra(){var dataOggi=new Date();var ora=dataOggi.getHours();if(ora<10)ora="0"+ora;var minuti=dataOggi.getMinutes();if(minuti<10)minuti="0"+minuti;return ora+":"+minuti;}

function getHeight(){var vW;var vH;if(typeof window.innerWidth!='undefined'){vW=window.innerWidth,vH=window.innerHeight}else if(typeof document.documentElement!='undefined'&&typeof document.documentElement.clientWidth!='undefined'&&document.documentElement.clientWidth!=0){vW=document.documentElement.clientWidth,vH=document.documentElement.clientHeight}else{vW=document.getElementsByTagName('body')[0].clientWidth,vH=document.getElementsByTagName('body')[0].clientHeight}return vH;}


function setFacoltativo(lbl, campo){
	$("#" + lbl).parent().removeClass("classTdLabel_O_O").addClass("classTdLabel");
	$("#" + campo).attr("STATO_CAMPO","E").attr("STATO_CAMPO_LABEL","").parent().removeClass("classTdField_O_O").addClass("classTdField");
}

function setRadioFacoltativo(lbl, campo){
	$("#" + lbl).parent().removeClass("classTdLabel_O_O").addClass("classTdLabel");
	$("[name='" + campo + "']").attr("STATO_CAMPO","E").attr("STATO_CAMPO_LABEL","").parent().removeClass("classTdField_O_O").addClass("classTdField");
}

function setObbligatorio(lbl, campo){
	$("#" + lbl).parent().removeClass("classTdLabel").addClass("classTdLabel_O_O");
	$("#" + campo).attr("STATO_CAMPO","O").attr("STATO_CAMPO_LABEL",lbl).parent().removeClass("classTdField").addClass("classTdField_O_O");
}

function setRadioObbligatorio(lbl, campo){
	$("#" + lbl).parent().removeClass("classTdLabel").addClass("classTdLabel_O_O");
	$("[name='" + campo + "']").attr("STATO_CAMPO","O").attr("STATO_CAMPO_LABEL",lbl).parent().removeClass("classTdField").addClass("classTdField_O_O");
}

//	MASKEDIT e CHECK
function _MaskAPI(){this.versione="0.1";this.istanza=0;this.objects={}}MaskAPI=new _MaskAPI();function MaskEdit(m,t){this.mask=m;this.tipo=t;this.errore=[];this.erroreCodice=[];this.valore="";this.cValore="";this.mostraParziale=false;this.id=MaskAPI.istanza++;this.ref="MaskAPI.objects['"+this.id+"']";MaskAPI.objects[this.id]=this}MaskEdit.prototype.attach=function(o){if(o.readonly==null||o.readonly==false){o.onkeydown=new Function("return "+this.ref+".isAllowKeyPress(event, this)");o.onkeyup=new Function("return "+this.ref+".getKeyPress(event, this)");o.onblur=new Function("this.value = "+this.ref+".format(this.value)")}};MaskEdit.prototype.isAllowKeyPress=function(e,o){if(this.tipo!="string"){return true}var xe=new xEvent(e);if(((xe.keyCode>47)&&(o.value.length>=this.mask.length))&&!xe.ctrlKey){return false}return true};MaskEdit.prototype.getKeyPress=function(e,o,_u){this.mostraParziale=true;var xe=new xEvent(e);if((xe.keyCode>47)||(_u==true)||(xe.keyCode==8||xe.keyCode==46)){var v=o.value,d;if(xe.keyCode==8||xe.keyCode==46){d=true}else{d=false}if(this.tipo=="number"){this.valore=this.setNumber(v,d)}else{if(this.tipo=="date"){this.valore=this.setDateKeyPress(v,d)}else{this.valore=this.setGeneric(v,d)}}o.value=this.valore}this.mostraParziale=false;return true};MaskEdit.prototype.format=function(s){if(this.tipo=="number"){this.valore=this.setNumber(s)}else{if(this.tipo=="date"){this.valore=this.setDate(s)}else{this.valore=this.setGeneric(s)}}return this.valore};MaskEdit.prototype.throwError=function(c,e,v){this.errore[this.errore.length]=e;this.erroreCodice[this.erroreCodice.length]=c;if(typeof v=="string"){return v}return true};MaskEdit.prototype.setGeneric=function(_v,_d){var v=_v,m=this.mask;var r="x#*",rt=[],nv="",t,x,a=[],j=0,rx={"x":"A-Za-z","#":"0-9","*":"A-Za-z0-9"};v=v.replace(new RegExp("[^"+rx["*"]+"]","gi"),"");if((_d==true)&&(v.length==this.cValore.length)){v=v.substring(0,v.length-1)}cValore=v;var b=[];for(var i=0;i<m.length;i++){x=m.charAt(i);t=(r.indexOf(x)>-1);if(x=="!"){x=m.charAt(i++)}if((t&&!this.mostraParziale)||(t&&this.mostraParziale&&(rt.length<v.length))){rt[rt.length]="["+rx[x]+"]"}a[a.length]={"char":x,"mask":t}}var carattereValido=false;if(!this.mostraParziale&&!(new RegExp(rt.join(""))).test(v)){return this.throwError(1,"Il valore \""+_v+"\" deve essere nel formato "+this.mask+".",_v)}else{if((this.mostraParziale&&(v.length>0))||!this.mostraParziale){for(i=0;i<a.length;i++){if(a[i].mask){while(v.length>0&&!(new RegExp(rt[j])).test(v.charAt(j))){v=(v.length==1)?"":v.substring(1)}if(v.length>0){nv+=v.charAt(j);carattereValido=true}j++}else{nv+=a[i]["char"]}if(this.mostraParziale&&(j>v.length)){break}}}}if(this.mostraParziale&&!carattereValido){nv=""}return nv};MaskEdit.prototype.setNumber=function(_v,_d){var v=String(_v).replace(/[^\d.-]*/gi,"");var m=this.mask;v=v.replace(/\./,"d").replace(/\./g,"").replace(/d/,".");if(!/^[\$А%ге]?((\$?[\+-]?([0#]{1,3}(,|\ |\а|_))?[0#]*(\.[0#]*)?)|([\+-]?\([\+-]?([0#]{1,3}(,|\ |\а|_))?[0#]*(\.[0#]*)?\)))[\$А%ге]?$/.test(m)){return this.throwError(1,"Maschera non valida per il costruttore!",_v)}if((_d==true)&&(v.length==this.cValore.length)){v=v.substring(0,v.length-1)}if(this.mostraParziale&&(v.replace(/[^0-9]/,"").length==0)){return v}this.cValore=v;if(v.length==0){v=NaN}var vn=Number(v);if(isNaN(vn)){return this.throwError(2,"Attenzione! Il valore non ш un numero valido!.",_v)}if(m.length==0){return v}var vi=String(Math.abs((v.indexOf(".")>-1)?v.split(".")[0]:v));var vd=(v.indexOf(".")>-1)?v.split(".")[1]:"";var _vd=vd;var isNegative=((Math.abs(vn)*-1==vn)&&(Math.abs(vn)!=0));var show={"е":(m.indexOf("е")!=-1),"г":(m.indexOf("г")!=-1),"А":(m.indexOf("А")!=-1),"$":(m.indexOf("$")!=-1),"%":(m.indexOf("%")!=-1),"(":(isNegative&&(m.indexOf("(")>-1)),"+":((m.indexOf("+")!=-1)&&!isNegative)};show["-"]=(isNegative&&(!show["("]||(m.indexOf("-")!=-1)));if(show["е"]&&(show["г"]||show["А"]||show["$"]||show["%"])){show["е"]=false}if(show["г"]&&(show["А"]||show["$"]||show["%"])){show["г"]=false}if(show["А"]&&(show["$"]||show["%"])){show["А"]=false}if(show["$"]&&show["%"]){show["$"]=false}m=m.replace(/[^#0._,]*/gi,"");var dm=(m.indexOf(".")>-1)?m.split(".")[1]:"";if(dm.length==0){vi=String(Math.round(Number(vi)));vd=""}else{var md=dm.lastIndexOf("0")+1;var nb0vd=0;var zeros="";while(nb0vd<=vd.length&&vd.substring(nb0vd,1)=="0"){nb0vd++;zeros+="0"}if(vd.length>dm.length){vd=zeros+String(Math.round(Number(vd.substring(0,dm.length+1))/10));if(vd.length>dm.length){addtovi=vd.substring(0,1);vd=vd.substring(1,vd.length);vi=String(Number(vi)+Number(addtovi))}while(vd.length<md){vd="0"+vd}}else{while(vd.length<md){vd+="0"}}}var im=(m.indexOf(".")>-1)?m.split(".")[0]:m;im=im.replace(/[^0#]+/gi,"");var mv=im.indexOf("0")+1;if(mv>0){mv=im.length-mv+1;while(vi.length<mv){vi="0"+vi}}if(/[#0]+(_|,)[#0]{3}/.test(m)){var x=[];var i=0;var n=Number(vi);while(n>999){x[i]="00"+String(n%1000);x[i]=x[i].substring(x[i].length-3);n=Math.floor(n/1000);i++}x[i]=String(n%1000);vi=x.reverse().join((m.substring(1,2)).replace("_"," "))}if((vd.length>0&&!this.mostraParziale)||((dm.length>0)&&this.mostraParziale&&(v.indexOf(".")>-1)&&(_vd.length>=vd.length))){v=vi+"."+vd}else{if((dm.length>0)&&this.mostraParziale&&(v.indexOf(".")>-1)&&(_vd.length<vd.length)){v=vi+"."+_vd}else{v=vi}}if(show["е"]){v=v+"е"}if(show["г"]){v="г"+v}if(show["А"]){v="А "+v}if(show["$"]){v="$"+v}if(show["%"]){v=v+" %"}if(show["+"]){v="+"+v}if(show["-"]){v="-"+v}if(show["("]){v="("+v+")"}return v};MaskEdit.prototype.setDate=function(_v){var v=_v;var m=this.mask;var a;var e;var mm;var dd;var yy;var x;var s;a=m.split(/[^mdy]+/);s=m.split(/[mdy]+/);e=v.split(/[^0-9]/);if(s[0].length==0){s.splice(0,1)}for(var i=0;i<a.length;i++){x=a[i].charAt(0).toLowerCase();if(x=="m"){mm=parseInt(e[i],10)-1}else{if(x=="d"){dd=parseInt(e[i],10)}else{if(x=="y"){yy=parseInt(e[i],10)}}}}if(String(yy).length<3){yy=2000+yy;if((new Date()).getFullYear()+20<yy){yy=yy-100}}var d=new Date(yy,mm,dd);if(d.getDate()!=dd){return this.throwError(1,"Giorno non valido!",_v)}else{if(d.getMonth()!=mm){return this.throwError(2,"Mese non valido!",_v)}}var nv="";for(i=0;i<a.length;i++){x=a[i].charAt(0).toLowerCase();if(x=="m"){mm++;if(a[i].length==2){mm="0"+mm;mm=mm.substring(mm.length-2)}nv+=mm}else{if(x=="d"){if(a[i].length==2){dd="0"+dd;dd=dd.substring(dd.length-2)}nv+=dd}else{if(x=="y"){if(a[i].length==2){nv+=d.getYear()}else{nv+=d.getFullYear()}}}}if(i<a.length-1){nv+=s[i]}}return nv};MaskEdit.prototype.setDateKeyPress=function(_v,_d){var v=_v;var m=this.mask;var k=v.charAt(v.length-1);var a;var e;var c;var ml;var vl;var mm="";var dd="";var yy="";var x;var p;var z;if(_d==true){while((/[^0-9]/gi).test(v.charAt(v.length-1))){v=v.substring(0,v.length-1)}if((/[^0-9]/gi).test(this.cValore.charAt(this.cValore.length-1))){v=v.substring(0,v.length-1)}if(v.length==0){return""}}a=m.split(/[^mdy]/);s=m.split(/[mdy]/);v=v.replace(/\s/g,"");e=v.split(/[^0-9]/);p=(e.length>0)?e.length-1:0;c=a[p].charAt(0);ml=a[p].length;for(var i=0;i<e.length;i++){x=a[i].charAt(0).toLowerCase();if(x=="m"){mm=parseInt(e[i],10)-1}else{if(x=="d"){dd=parseInt(e[i],10)}else{if(x=="y"){yy=parseInt(e[i],10)}}}}var nv="";var j=0;for(i=0;i<e.length;i++){x=a[i].charAt(0).toLowerCase();if(x=="m"){z=((/[^0-9]/).test(k)&&c=="m");mm++;if((e[i].length==2&&mm<10)||(a[i].length==2&&c!="m")||(mm>1&&c=="m")||(z&&a[i].length==2)){mm="0"+mm;if(mm>12){mm="1"}else{mm=mm.substring(mm.length-2)}if(mm==0){mm="0"}}vl=String(mm).length;ml=2;nv+=mm}else{if(x=="d"){z=((/[^0-9]/).test(k)&&c=="d");if((e[i].length==2&&dd<10)||(a[i].length==2&&c!="d")||(dd>3&&c=="d")||(z&&a[i].length==2)){dd="0"+dd;if(dd>31){dd="3"}else{dd=dd.substring(dd.length-2)}if(dd==0){dd="0"}}vl=String(dd).length;ml=2;nv+=dd}else{if(x=="y"){z=((/[^0-9]/).test(k)&&c=="y");if(c=="y"){yy=String(yy)}else{if(a[i].length==2){yy=d.getYear()}else{yy=d.getFullYear()}}if((e[i].length==2&&yy<10)||(a[i].length==2&&c!="y")||(z&&a[i].length==2)){yy="0"+yy;yy=yy.substring(yy.length-2)}ml=a[i].length;vl=String(yy).length;nv+=yy}}}if(((ml==vl||z)&&(x==c)&&(i<s.length))||(i<s.length&&x!=c)){nv+=s[i]}}this.cValore=(nv=="NaN")?"":nv;return this.cValore};function xEvent(e){if(window.Event){var isKeyPress=(e.type.substring(0,3)=="key");this.keyCode=(isKeyPress)?parseInt(e.which,10):0;this.button=(!isKeyPress)?parseInt(e.which,10):0;this.srcElement=e.target;this.type=e.type;this.x=e.pageX;this.y=e.pageY;this.screenX=e.screenX;this.screenY=e.screenY;if(!isKeyPress){if(document.layers){this.altKey=((e.modifiers&Event.ALT_MASK)>0);this.ctrlKey=((e.modifiers&Event.CONTROL_MASK)>0);this.shiftKey=((e.modifiers&Event.SHIFT_MASK)>0);this.keyCode=this.translateKeyCode(keyCode)}else{this.altKey=e.altKey;this.ctrlKey=e.ctrlKey;this.shiftKey=e.shiftKey}}}else{e=window.event;this.keyCode=parseInt(e.keyCode,10);this.button=e.button;this.srcElement=e.srcElement;this.tipo=e.type;if(document.all){this.x=e.clientX+document.body.scrollLeft;this.y=e.clientY+document.body.scrollTop}else{this.x=e.clientX;this.y=e.clientY}this.screenX=e.screenX;this.screenY=e.screenY;this.altKey=e.altKey;this.ctrlKey=e.ctrlKey;this.shiftKey=e.shiftKey}if(this.button==0){this.setKeyPressed(this.keyCode);this.keyChar=String.fromCharCode(this.keyCode)}}xEvent.prototype.translateKeyCode=function(i){var l={};if(!!document.layers){if(this.keyCode>96&&this.keyCode<123){return this.keyCode-32}l={96:192,126:192,33:49,64:50,35:51,36:52,37:53,94:54,38:55,42:56,40:57,41:48,92:220,124:220,125:221,93:221,91:219,123:219,39:222,34:222,47:191,63:191,46:190,62:190,44:188,60:188,45:189,95:189,43:187,61:187,59:186,58:186,"null":null}}return(!!l[i])?l[i]:i};xEvent.prototype.setKP=function(i,s){this.keyPressedCode=i;this.keyNonChar=(typeof s=="string");this.keyPressed=(this.keyNonChar)?s:String.fromCharCode(i);this.isNumeric=(parseInt(this.keyPressed,10)==this.keyPressed);this.isAlpha=((this.keyCode>64&&this.keyCode<91)&&!this.altKey&&!this.ctrlKey);return true};xEvent.prototype.setKeyPressed=function(i){var b=this.shiftKey;if(!b&&(i>64&&i<91)){return this.setKP(i+32)}if(i>95&&i<106){return this.setKP(i-48)}switch(i){case 49:case 51:case 52:case 53:if(b){i=i-16}break;case 50:if(b){i=64}break;case 54:if(b){i=94}break;case 55:if(b){i=38}break;case 56:if(b){i=42}break;case 57:if(b){i=40}break;case 48:if(b){i=41}break;case 192:if(b){i=126}else{i=96}break;case 189:if(b){i=95}else{i=45}break;case 187:if(b){i=43}else{i=61}break;case 220:if(b){i=124}else{i=92}break;case 221:if(b){i=125}else{i=93}break;case 219:if(b){i=123}else{i=91}break;case 222:if(b){i=34}else{i=39}break;case 186:if(b){i=58}else{i=59}break;case 191:if(b){i=63}else{i=47}break;case 190:if(b){i=62}else{i=46}break;case 188:if(b){i=60}else{i=44}break;case 106:case 57379:i=42;break;case 107:case 57380:i=43;break;case 109:case 57381:i=45;break;case 110:i=46;break;case 111:case 57378:i=47;break;case 8:return this.setKP(i,"[backspace]");case 9:return this.setKP(i,"[tab]");case 13:return this.setKP(i,"[enter]");case 16:case 57389:return this.setKP(i,"[shift]");case 17:case 57390:return this.setKP(i,"[ctrl]");case 18:case 57388:return this.setKP(i,"[alt]");case 19:case 57402:return this.setKP(i,"[break]");case 20:return this.setKP(i,"[capslock]");case 32:return this.setKP(i,"[space]");case 91:return this.setKP(i,"[windows]");case 93:return this.setKP(i,"[properties]");case 33:case 57371:return this.setKP(i*-1,"[pgup]");case 34:case 57372:return this.setKP(i*-1,"[pgdown]");case 35:case 57370:return this.setKP(i*-1,"[end]");case 36:case 57369:return this.setKP(i*-1,"[home]");case 37:case 57375:return this.setKP(i*-1,"[left]");case 38:case 57373:return this.setKP(i*-1,"[up]");case 39:case 57376:return this.setKP(i*-1,"[right]");case 40:case 57374:return this.setKP(i*-1,"[down]");case 45:case 57382:return this.setKP(i*-1,"[insert]");case 46:case 57383:return this.setKP(i*-1,"[delete]");case 144:case 57400:return this.setKP(i*-1,"[numlock]")}if(i>111&&i<124){return this.setKP(i*-1,"[f"+(i-111)+"]")}return this.setKP(i)};
function isValidTime(value){var colonCount=0;var hasMeridian=false;try{for(var i=0;i<value.length;i++){var ch=value.substring(i,i+1);if((ch<'0')||(ch>'9')){if((ch!=':')&&(ch!=' ')&&(ch!='a')&&(ch!='A')&&(ch!='p')&&(ch!='P')&&(ch!='m')&&(ch!='M')){return false}}if(ch==':'){colonCount++}if((ch=='p')||(ch=='P')||(ch=='a')||(ch=='A')){hasMeridian=true}}if((colonCount<1)||(colonCount>2)){return false}var hh=value.substring(0,value.indexOf(":"));if((parseFloat(hh)<0)||(parseFloat(hh)>23)){return false}if(hasMeridian){if((parseFloat(hh)<1)||(parseFloat(hh)>12)){return false}}if(colonCount==2){var mm=value.substring(value.indexOf(":")+1,value.lastIndexOf(":"))}else{var mm=value.substring(value.indexOf(":")+1,value.length)}if((parseFloat(mm)<0)||(parseFloat(mm)>59)){return false}if(colonCount==2){var ss=value.substring(value.lastIndexOf(":")+1,value.length)}else{var ss="00"}if((parseFloat(ss)<0)||(parseFloat(ss)>59)){return false}}catch(e){alert("isValidTime - Error: "+e.description)}return true}
function isValidData(value){if(value.length != 10){return false;}else{return true;}}
function checkData(oggetto){if($(oggetto).val() != ""){if (!isValidData($(oggetto).val().toString())){alert("Inserire una data valida");$(oggetto).val("");$(oggetto).focus();return false;}}}
function formatOra(oggetto){var oggetto;var valore;try{if(oggetto.value.toString().length==5){oggetto.value=""}valore=oggetto.value;window.event.returnValue=false;if(oggetto){if((window.event.keyCode>=48)&&(window.event.keyCode<=57)){oggetto.value=valore+String.fromCharCode(window.event.keyCode);if(oggetto.value.toString().length==2){oggetto.value=oggetto.value+":"}if(oggetto.value.toString().length==5){if(!isValidTime(oggetto.value.toString())){alert("Inserire un'ora valida");oggetto.value="";oggetto.focus();return false}}}else if((window.event.keyCode==9)){}else{alert("Inserire solo numeri");oggetto.focus()}}}catch(e){alert("formatOra - Error: "+e.description)}}
function checkOra(oggetto){if($(oggetto).val()!=""){if($(oggetto).val().length != 5){alert("Inserire un'ora valida [hh:mm]");$(oggetto).val("");$(oggetto).focus();return false;}}}
function checkEMail(eMail){var T=0;var stato=0;var mioChar="";var boolRet=false;var strTmp="";if(eMail!=""){for(T=0;T<eMail.length;T++){mioChar=eMail.charAt(T);switch(stato){case 0:strTmp=strTmp.concat("0");if(mioChar=="."){stato=1;}else{if(mioChar=="@"){stato=2;}else{if(!checkValidChar(mioChar)){T=eMail.length;}}}break;case 1:strTmp=strTmp.concat("1");if(checkValidChar(mioChar)){stato=0;}else{T=eMail.length;}break;case 2:strTmp=strTmp.concat("2");if(checkValidChar(mioChar)){stato=3;}else{T=eMail.length;}break;case 3:strTmp=strTmp.concat("3");if(mioChar=="."){stato=4;}else{if(!checkValidChar(mioChar)){T=eMail.length;}}break;case 4:strTmp=strTmp.concat("4");if(checkValidChar(mioChar)){stato=3;}else{T=eMail.length;}break;}}if(stato==3){boolRet=true;}}else{boolRet=true;}return boolRet;}
function checkValidChar(mioChar){var boolRet=false;if((mioChar>="a"&&mioChar<="z")||(mioChar>="A"&&mioChar<="Z")||(mioChar>="0"&&mioChar<="9")){boolRet=true;}return boolRet;}
function checkCodFisc(cf){if(cf!=""){var re=/^[a-zA-Z]{6}[0-9]{2}[a-zA-Z]{1}[0-9]{2}[a-zA-Z]{1}[0-9]{3}[a-zA-Z]{1}$/;var verifica=cf.match(re);if(!verifica&&cf!=""){return false;}return true;}return true;}
function ShowHideLayer(valore){if(valore==""){return;}objectNode=document.getElementById(valore);if(objectNode){if(objectNode.style.display=='block'){objectNode.style.display='none';}else if(objectNode.style.display=="none"){objectNode.style.display='block';}else if(objectNode.style.display==""){objectNode.style.display='none';}}}
function ShowLayer(valore){if(valore==""){return;}objectNode=document.getElementById(valore);if(objectNode){objectNode.style.display='block';}}
function HideLayer(valore){if(valore==""){return;}objectNode=document.getElementById(valore);if(objectNode){objectNode.style.display='none';}}