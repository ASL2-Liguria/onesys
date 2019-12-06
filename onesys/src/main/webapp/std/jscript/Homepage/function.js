//	Tipsy plugin (tooltip)
(function($){function fixTitle($ele){if($ele.attr('title')||typeof($ele.attr('original-title'))!='string'){$ele.attr('original-title',$ele.attr('title')||'').removeAttr('title')}}function Tipsy(element,options){this.$element=$(element);this.options=options;this.enabled=true;fixTitle(this.$element)}Tipsy.prototype={show:function(){var title=this.getTitle();if(title&&this.enabled){var $tip=this.tip();$tip.find('.tipsy-inner')[this.options.html?'html':'text'](title);$tip[0].className='tipsy';$tip.remove().css({top:0,left:0,visibility:'hidden',display:'block'}).appendTo(document.body);var pos=$.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight});var actualWidth=$tip[0].offsetWidth,actualHeight=$tip[0].offsetHeight;var gravity=(typeof this.options.gravity=='function')?this.options.gravity.call(this.$element[0]):this.options.gravity;var tp;switch(gravity.charAt(0)){case'n':tp={top:pos.top+pos.height+this.options.offset,left:pos.left+pos.width/2-actualWidth/2};break;case's':tp={top:pos.top-actualHeight-this.options.offset,left:pos.left+pos.width/2-actualWidth/2};break;case'e':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth-this.options.offset};break;case'w':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width+this.options.offset};break}if(gravity.length==2){if(gravity.charAt(1)=='w'){tp.left=pos.left+pos.width/2-15}else{tp.left=pos.left+pos.width/2-actualWidth+15}}$tip.css(tp).addClass('tipsy-'+gravity);if(this.options.fade){$tip.stop().css({opacity:0,display:'block',visibility:'visible'}).animate({opacity:this.options.opacity})}else{$tip.css({visibility:'visible',opacity:this.options.opacity})}}},hide:function(){if(this.options.fade){this.tip().stop().fadeOut(function(){$(this).remove()})}else{this.tip().remove()}},getTitle:function(){var title,$e=this.$element,o=this.options;fixTitle($e);var title,o=this.options;if(typeof o.title=='string'){title=$e.attr(o.title=='title'?'original-title':o.title)}else if(typeof o.title=='function'){title=o.title.call($e[0])}title=(''+title).replace(/(^\s*|\s*$)/,"");return title||o.fallback},tip:function(){if(!this.$tip){this.$tip=$('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>')}return this.$tip},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=true},disable:function(){this.enabled=false},toggleEnabled:function(){this.enabled=!this.enabled}};$.fn.tipsy=function(options){if(options===true){return this.data('tipsy')}else if(typeof options=='string'){return this.data('tipsy')[options]()}options=$.extend({},$.fn.tipsy.defaults,options);function get(ele){var tipsy=$.data(ele,'tipsy');if(!tipsy){tipsy=new Tipsy(ele,$.fn.tipsy.elementOptions(ele,options));$.data(ele,'tipsy',tipsy)}return tipsy}function enter(){var tipsy=get(this);tipsy.hoverState='in';if(options.delayIn==0){tipsy.show()}else{setTimeout(function(){if(tipsy.hoverState=='in')tipsy.show()},options.delayIn)}};function leave(){var tipsy=get(this);tipsy.hoverState='out';if(options.delayOut==0){tipsy.hide()}else{setTimeout(function(){if(tipsy.hoverState=='out')tipsy.hide()},options.delayOut)}};if(!options.live)this.each(function(){get(this)});if(options.trigger!='manual'){var binder=options.live?'live':'bind',eventIn=options.trigger=='hover'?'mouseenter':'focus',eventOut=options.trigger=='hover'?'mouseleave':'blur';this[binder](eventIn,enter)[binder](eventOut,leave)}return this};$.fn.tipsy.defaults={delayIn:0,delayOut:0,fade:false,fallback:'',gravity:'n',html:false,live:false,offset:0,opacity:0.8,title:'title',trigger:'hover'};$.fn.tipsy.elementOptions=function(ele,options){return $.metadata?$.extend({},options,$(ele).metadata()):options};$.fn.tipsy.autoNS=function(){return $(this).offset().top>($(document).scrollTop()+$(window).height()/2)?'s':'n'};$.fn.tipsy.autoWE=function(){return $(this).offset().left>($(document).scrollLeft()+$(window).width()/2)?'e':'w'}})(jQuery);
// JavaScript Document

	$(document).ready(function()
	{
		$('#divReperibilita fieldset legend').text('Guardia');
		$('.info').tipsy({html: true/*,gravity: $.fn.tipsy.autoNS,opacity:1,trigger: 'focus'*/});
		
		
		$("#wrap2").after('<div id="help"><a href="javascript:;" id="icoHelp"></a><p>Per assistenza tecnica (software) contattare il numero 338 7233938, oppure nei casi non urgenti inviare una mail all indirizzo support.cartella@elco.it</p></div>');
			$("#icoHelp").click(function(){
			$("#help p").toggle();
		});

		initAppletLogout();

		try{
			opener.chiudiHomepage();
			}catch(e){}
	});

	function creaurl(valore,ip,user,abilitaNewHome)
	{
		switch (valore)
		{		
			case 'WHALE':
				window.open($("#WHALE").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=START_UNISYS&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");	
				rimuoviLink();	
				break;
						
			case 'ORDER_ENTRY':
				window.open($("#ORDER_ENTRY").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=START_UNISYS&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;
					
			case 'RICETTA_ROSSA':
				window.open($("#RICETTA_ROSSA").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=RICERCA_PAZIENTI&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;
				
			case 'PIANI_TERAPEUTICI':
				window.open($("#PIANI_TERAPEUTICI").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=RICERCA_PAZIENTI_PT&opener=UNISYS&trace_parameter='+valore,"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;	
			
			case 'PT_AMMINISTRAZIONE':
				window.open($("#PT_AMMINISTRAZIONE").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=PT_AMMINISTRAZIONE&opener=UNISYS&trace_parameter='+valore,"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;

			case 'GESTIONE_AMBULATORIALE':
				window.open($("#GESTIONE_AMBULATORIALE").val() + '/autoLogin?USER='+user+'&IP='+ip+'&KEY=START&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;	

			case 'GESTIONE_AMBULATORIALE_S':
				window.open($("#GESTIONE_AMBULATORIALE_S").val() + '/autoLogin?USER='+user+'&IP='+ip+'&KEY=START&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				self.close();
				break;	
				
			case 'GESTIONE_AMBULATORIALE_NS':
				window.open($("#GESTIONE_AMBULATORIALE_NS").val() + '/autoLogin?USER='+user+'&IP='+ip+'&KEY=START&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;		



			case 'WORKLIST_ESAMI_CONSULENZE':
				window.open($("#WORKLIST_ESAMI_CONSULENZE").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=WKREPARTO&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;
				
			case 'GESTIONE_CIS':
				//alert($("#GESTIONE_CIS").val() + '/autoLogin?PWD='+baseUser.WEBPASSWORD+'&USER='+user+'&IP='+ip+'&KEY=CIS');
				window.open($("#GESTIONE_CIS").val() + '/autoLogin?USER='+user+'&IP='+ip+'&KEY=CIS',"","status=yes fullscreen=yes scrollbars=yes");
				chiudiHomepage();
				break;				
			
			case 'REPOSITORY':
				window.open($("#REPOSITORY").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=RICERCA_PAZIENTI_CENTRI_PR&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				break;
			
			case 'MMG':
				var url = $("#MMG").val() + '/Autologin?username='+user+'&url=page?KEY_LEGAME=MAIN_PAGE&nomeHost='+ip;
				window.open(url,"","status=yes fullscreen=yes scrollbars=yes");
				rimuoviLink();
				self.close();
				break;	

			case 'I-PATIENT':
				if (window.user.TIPO=='I'){
					alert('Funzionalit� disponibile solo per il personale medico');
				}
				else{
					window.open($("#I-PATIENT").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=I-PATIENT',"","status=yes fullscreen=yes scrollbars=yes");	
					rimuoviLink();
				}	
				break;

		

			default:
				break;
		}
	}
	
	function creaurlbut(valore,ip,user,tipo,abilitaNewHome)
	{
		var conferma = '';
		switch(tipo)
		{
		case 'REPERIBILITA': 
				conferma = 'Attenzione: � stata scelta la modalit� operativa in regime di GUARDIA, che consente l\'accesso a dati di pazienti non ricoverati nel proprio reparto di normale competenza.\nTutte le operazioni eseguite verranno tracciate.\nContinuare?';
				break;
		default :
				conferma = 'Attenzione: � stata scelta la modalit� operativa in regime di '+tipo+', che consente l\'accesso a dati di pazienti non ricoverati nel proprio reparto di normale competenza.\nTutte le operazioni eseguite verranno tracciate.\nContinuare?';
				break;
		}
		
		
		switch (valore)
		{
			case 'WHALE':
				if(tipo == 'EMERGENZA')
				{
					if (confirm(conferma))
					{
						window.open($("#WHALE").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=PROFILO_EMERGENZA&opener=UNISYS&MODALITA_ACCESSO=EMERGENZA',"","status=yes fullscreen=yes scrollbars=yes");
						rimuoviLink();
					}
				}
				else if(tipo == 'REPERIBILITA')
				{
					if (confirm(conferma))
					{
						window.open($("#WHALE").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=PROFILO_REPERIBILITA&opener=UNISYS&MODALITA_ACCESSO=REPERIBILITA',"","status=yes fullscreen=yes scrollbars=yes");
						rimuoviLink();
					}
				}
				else if(tipo == 'SOSTITUZIONE_INFERMIERISTICA')
				{
					if (confirm(conferma))
					{
						window.open($("#WHALE").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=PROFILO_SOSTITUZIONE_INFERMIERISTICA&opener=UNISYS&MODALITA_ACCESSO=SOSTITUZIONE_INFERMIERISTICA',"","status=yes fullscreen=yes scrollbars=yes");
						rimuoviLink();
					}


				}			break;
			
			case 'ORDER_ENTRY':
				if(tipo == 'EMERGENZA')
				{
					if (confirm(conferma))
					{
						window.open($("#ORDER_ENTRY").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=PROFILO_EMERGENZA&opener=UNISYS&MODALITA_ACCESSO=EMERGENZA',"","status=yes fullscreen=yes scrollbars=yes");
						rimuoviLink();
					}
				}
				else if(tipo == 'REPERIBILITA')
				{
					if (confirm(conferma))
					{
						window.open($("#ORDER_ENTRY").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=PROFILO_REPERIBILITA&MODALITA_ACCESSO=REPERIBILITA&opener=UNISYS',"","status=yes fullscreen=yes scrollbars=yes");
						rimuoviLink();
					}
				}
				else if(tipo == 'SOSTITUZIONE_INFERMIERISTICA')
				{
					if (confirm(conferma))
					{
						window.open($("#ORDER_ENTRY").val() + '/autoLogin?utente='+user+'&postazione='+ip+'&pagina=PROFILO_SOSTITUZIONE_INFERMIERISTICA&opener=UNISYS&MODALITA_ACCESSO=SOSTITUZIONE_INFERMIERISTICA',"","status=yes fullscreen=yes scrollbars=yes");
						rimuoviLink();
					}
				}
			break;
			default:
			break;
		}
		
	}
	
	function rimuoviLink(){
		$('#divMenu a').removeAttr('href');
		$('#divReperibilita a').removeAttr('href');
		$('#divEmergenza a').removeAttr('href');
	}
	
	function closeHomepage()
	{
	    if($.browser.safari || navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1)
	    {
	        //IE 7 or Safari
	        window.open('','_self');
//	        window.close();
	    }
	    else if($.browser.mozilla )
		{
	    	window.open('', '_parent', '');
//	        window.close();
		}
	    else
	    {
	        //IE 6 in gi�...
	        window.opener = null;
//	        self.close();
	    }
	    var unload_url = "unloadSession?changeLogin=S";
		top.location.replace (unload_url);
	}
	
	
	function initAppletLogout()
	{
		if ($("#idAttivaApplet").val()=='S'){
			try{
				var $newobj = $('<OBJECT type="application/x-java-applet" height="0" width="0" id="ElcoApplet">'+
					'<param name="code" value="it.elco.applet.NomeHostSmartCardLogOff.class">'+
					'<param name="archive" value="std/app/SignedAppletHostSmartCard.jar">'+	
					'</OBJECT>');

				$('body').append($newobj);

				
			}catch(e){
				if(baseUser.LOGIN == 'lino' || baseUser.LOGIN == 'testelco2' ){
					alert('alert solo per utente Lino  testelco2: '+e.description);
				}
			}
		}
	}
	
	function LogoutSmart()
	{
		try
		{
			closeHomepage();
		}
		catch(e){
			alert('Error from log out function: '+e.description);
		}
	}
	/*Non c'� la definizione della funzione per evitare l'errore quando sono richiamate dall'applet*/
	function LoginSmartCard(cf){}

	function setHostName(nome_host,ip_rilevato){}