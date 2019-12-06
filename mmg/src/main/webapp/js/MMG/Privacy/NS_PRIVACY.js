$(function() {
	
		NS_PRIVACY.init();
		NS_PRIVACY.successSaveScheda = NS_FENIX_SCHEDA.successSave;
		//per ora commento la parte altrimenti l'override dei js delle pagine viene sovrascritto. Quindi VA AGGIUNTO nel successSave della pagina
		//NS_FENIX_SCHEDA.successSave = NS_PRIVACY.save;
});

var NS_PRIVACY = {
		
		objOscuramento: {},
		
		menu: null,
		
		init: function()
		{
			NS_PRIVACY.loadOscuramento();
			NS_PRIVACY.setEvents();
		},
		
		setEvents: function()
		{
			NS_PRIVACY.menu = $(document).contextMenu(menuPrivacy,{openSubMenuEvent: "click", openInfoEvent: "click"});
			$(document).on("mousedown","input,select,textarea,.RBpuls,.CBpuls,.maschera", function(e) {
				if(e.button == '2')
					NS_PRIVACY.menu.test(e, this);
			});
		},
		
		loadOscuramento: function() 
		{
			home.$.NS_DB.getTool({_logger : home.logger}).select({
	            id:'PRIVACY.GET_OSCURAMENTO_SCHEDA',
	            parameter:
	            {
					/*"iden_scheda"		: { v : idenScheda, t : 'N'},*/
					"iden_anag"			: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
					"key_legame"		: { v : $("#KEY_LEGAME").val(), t : 'V'},
	            }
			}).done( function( resp ) {
			
				if (resp.result.length > 0){
					
					obj = resp.result[0].OSCURAMENTO;
					obj = NS_MMG_UTILITY.parseXml(obj);
					
					var v_json = xml2json(obj,"");
					
					//devo rimpiazzare 'undefined' poiche' compare dopo la conversione e crea casino
					//v_json = v_json.replace("undefined",'');
					//aggiunto il secondo parametro a xml2json non dovrebbe fare piu' casino
					eval("NS_PRIVACY.objOscuramento  = " + v_json);
					NS_PRIVACY.objOscuramento = NS_PRIVACY.objOscuramento['privacy'];
										
					//controllo che l'oggetto non sia null altrimenti va in errore la funzione oscura		
					if(NS_PRIVACY.objOscuramento == null){
						NS_PRIVACY.objOscuramento = {};
					}
					
					NS_PRIVACY.setOscuramento();
				}
			});
		},
		
		setOscuramento: function() 
		{
			//ora devo prendere il tag privacy all'interno dell'xml
			var arr = NS_PRIVACY.objOscuramento;
			
			for (var i in arr){
				
				var el = $("#"+i);
				if (arr[i].utente == home.baseUser.IDEN_PER){
					el.addClass("oscurato");
				}else{
					el.closest("td")
						.css({"position":"relative"})
						.append($("<div/>", {"class":"maschera", "id_element": i}).text(traduzione.lblDatoOscurato)
					);
					if (i == 'cmbFamiliaritaResult')
						$("#lblFamiliarita").hide();
				}
			}
		},
		
		oscura: function(element) 
		{
			home.NS_MMG.confirm(traduzione.lblConfermaOscuramento,function() {
			
				var $this = $(element);
				if ($this.hasClass("RBpuls")){
					$this = $this.closest(".RadioBox");
				}else if ($this.hasClass("CBpuls")){
					$this = $this.closest(".CheckBox");
				}	
				
				$this.addClass("oscurato");
				NS_PRIVACY.objOscuramento[$this.attr("id")] = { utente : home.baseUser.IDEN_PER };
			});
		},
		
		disoscura: function(element)
		{
			var $this = $(element);
			if ($this.hasClass("maschera"))
			{
				home.NS_MMG.confirm(traduzione.lblRimozioneOscuramento,function() {
					var mask = $this.closest("td").find("div.maschera");
					var id = mask.attr("id_element");
					var el = $("#"+id);
					
					if(LIB.isValid(OSCURAMENTI_CUSTOM) && LIB.isValid(OSCURAMENTI_CUSTOM[id]) && LIB.isValid(OSCURAMENTI_CUSTOM[id].disoscura))
						OSCURAMENTI_CUSTOM[id].disoscura();
					else if (el.hasClass("RadioBox"))
						el.data("RadioBox").empty();	
					else
						el.val('');
						
					mask.remove();
					delete NS_PRIVACY.objOscuramento[$this.attr("id_element")];
				});
			}
			else
			{
				if ($this.hasClass("RBpuls")) 
					$this = $this.closest(".RadioBox");
				
				$this.removeClass("oscurato");
				delete NS_PRIVACY.objOscuramento[$this.attr("id")];
			}
		},
		
		save: function( idenScheda )
		{
			var v_xml = json2xml( NS_PRIVACY.objOscuramento);
			
			//tolgo e rimetto i tag privacy per evitare che ci siano doppioni e invalidino l'xml
			v_xml = v_xml.replace("<privacy>","");
			v_xml = v_xml.replace("</privacy>","");
			//occhio che se e' vuoto mette il tag <privacy/> che i replace precedenti non contemplano
			v_xml = v_xml.replace("<privacy/>","");
			v_xml = '<privacy>'+v_xml+'</privacy>';
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'SAVE_OSCURAMENTO_SCHEDA',
	            parameter:
	            {
	            	"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
	            	/*"pIdenScheda"		: { v : idenScheda, t : 'N'},*/
					"pIdenAnag"			: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
					"pKeyLegame"		: { v : $("#KEY_LEGAME").val(), t : 'V'},
					"pOscuramento"		: { v : v_xml, t : 'C'}
	            }
			}).done( function(response) {
				NS_PRIVACY.successSaveScheda(response);
			});
		},
		
		checkCampo: function (element){
			var $this = $(element);
			if ($this.hasClass("RBpuls")){
				$this = $this.closest(".RadioBox");
			}else if ($this.hasClass("CBpuls")){
				$this = $this.closest(".CheckBox");
			}
			return $this;
		},
		
		WK : {
			oscuraRecord: function( rec, val, table, wk, nomeColonnaIden )
			{
				home.NS_MMG.confirm( (val=='S') ? traduzione.confirmOscura : traduzione.confirmDisoscura , function() {

					home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
			            id:'UPD_CAMPO_STORICIZZA',
			            parameter:
			            {
			            	"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
							"pTabella" 			: { v : table, t : 'V'},
							"pNomeCampo" 		: { v : "OSCURATO", t : 'V'},
							"pIdenTabella" 		: { v : rec[0].IDEN, t : 'N' },
							"pNewValore" 		: { v : val, t : 'V' },
							"pStoricizza" 		: { v : "S", t : 'V' },
							"pCampoIdenWhere" 	: { v : (typeof nomeColonnaIden != 'undefined' ? nomeColonnaIden : "IDEN"), t : 'V' }
			            }
					}).done( function() {
						wk.refresh();
					});
				});

			}
		}
}; 

var menuPrivacy = {
		"menu" : {
			"id" : "MENU_COMMONS",
			"structure" : {
				"list" : [ {
					"concealing"	: "true",
					"link"			:  NS_PRIVACY.oscura,
					"enable"		: "S",
					"icon_class"	: "blocca",
					"where"			: function(rec){ return (!NS_PRIVACY.checkCampo(rec).hasClass("maschera") && !NS_PRIVACY.checkCampo(rec).hasClass("oscurato") && home.ASSISTITO.IDEN_MED_BASE == home.baseUser.IDEN_PER);},
					"output"		: "traduzione.lblOscura",
					"separator"		: "false"
				},
				{
					"concealing"	: "true",
					"link"			:  NS_PRIVACY.disoscura,
					"enable"		: "S",
					"icon_class"	: "bloccaverde",
					"where"			: function(rec){ return (NS_PRIVACY.checkCampo(rec).hasClass("maschera") || NS_PRIVACY.checkCampo(rec).hasClass("oscurato") && home.ASSISTITO.IDEN_MED_BASE == home.baseUser.IDEN_PER);},
					"output"		: "traduzione.lblDisoscura",
					"separator"		: "false"
				}]
			},
			"title" : "traduzione.lblMenu",
			"status" : true
		}
};