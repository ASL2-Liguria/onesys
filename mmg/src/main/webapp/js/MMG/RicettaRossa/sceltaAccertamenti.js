$(document).ready(function(){
	
	SCELTA_ACCERTAMENTI.setEvents();
	SCELTA_ACCERTAMENTI.init();

});

var SCELTA_ACCERTAMENTI = {
	
	objWkGruppi:null,
	
	$ricerca:$("#txtRicerca"),
	
	$ricerca_profili: $("#txtRicercaGruppi") ,
	
	init:function(){
	
		home.SCELTA_ACCERTAMENTI = this;
		home.SCELTA_ACCERTAMENTI.body = $("body");

		SCELTA_ACCERTAMENTI.setLayout();
		
		$("#txtRicerca").focus().attr("placeholder",traduzione.phAccertamenti);
		$("#txtRicercaGruppi").attr("placeholder",traduzione.phProfili);
		
		//controllo il valore del parametro dei sinonimi nella ricerca
		var valSinonimi = LIB.getParamUserGlobal('SINONIMI_ACCERTAMENTI','S');
		$("#radSinonimi").data('RadioBox').selectByValue(valSinonimi);
		
		//controllo il valore del parametro della frequenza nella ricerca. Se non trovo nulla, imposto il valore ad N in modo che usino la query meno costosa
		var valFrequenza = LIB.getParamUserGlobal('FREQUENZA_ACCERTAMENTI','N');
		$("#radFrequenza").data('RadioBox').selectByValue(valFrequenza);
		
		SCELTA_ACCERTAMENTI.checkRicerca();
	},
	
	
	setEvents:function(){
		
		$("#li-tabSceltaProfili").on("click",function() {
			SCELTA_ACCERTAMENTI.initWkProfili();
		});
		
		$("#li-tabScelta").on("click",function() {
			SCELTA_ACCERTAMENTI.initWk('NOTDEFINED');
		});
		
		$("#butDescrizione").on("click", function(){
			SCELTA_ACCERTAMENTI.ricerca("DESCR");
		});
		
		$("#butCodice").on("click", function(){
			SCELTA_ACCERTAMENTI.ricerca("COD");
		});
		
		$("body").on("keyup",function(e) {
		    if(e.keyCode == 13) {
		    	SCELTA_ACCERTAMENTI.search("DESCR");
		    }
		});
		
		$("#txtRicercaGruppi").on("keyup",function(e) {
			if(e.keyCode == 13) {
				SCELTA_ACCERTAMENTI.search("DESCR");
				SCELTA_ACCERTAMENTI.ricerca_gruppi($(this).val());
			}
		});

		$(".butChiudi").off("click");
		$(".butChiudi").on("mousedown",function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			
			$.dialog(traduzione.lblConfirmChiudi,{
				
				'title'				:"Attenzione",
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'buttons'			:[
                         {
                        	 label : "Si",
                        	 keycode : "13",
                        	 action : function() {
                        		 NS_FENIX_SCHEDA.chiudi();
							}
                         },
                         {
                        	 label:"No",
                        	 action: function(){$.dialog.hide();}
                         }]
				});
		});
		
		$(".butInserisci").on("click", function(){
			SCELTA_ACCERTAMENTI.insertGroup();
		});
		
		$("#butRicerca").on("click", function(){
			SCELTA_ACCERTAMENTI.ricerca_gruppi(SCELTA_ACCERTAMENTI.$ricerca_profili.val());
		});
		
		$("#ListProfili").on("dblclick",function(){
			SCELTA_ACCERTAMENTI.loadDetails($("#ListProfili").val());
		});
		
		$("#ListDettagli").mousedown(function(e){ 
		    if( e.button == 2 ) { 
		    	$(this).find("option:selected").remove();
		    } 
		});
		
		$("#ListDettagli").on("dblclick",function(){ 
		    	$(this).find("option:selected").remove();		 
		});
		
		$("#ListAccScelti").mousedown(function(e){ 
		    if( e.button == 2 ) { 
		    	$(this).find("option:selected").remove();
		    } 
		});
		
		$("#chkRicercaEsatta").on("click",function(){
			if(!$(this).attr("checked") && SCELTA_ACCERTAMENTI.$ricerca.val() != ''){
				SCELTA_ACCERTAMENTI.ricerca("DESCR");
			}
		});
		
		$("#butRicercaEsatta").on("click",function(){
			if(!$(this).attr("checked") && SCELTA_ACCERTAMENTI.$ricerca.val() != ''){
				SCELTA_ACCERTAMENTI.ricerca("DESCR_ESATTA");
			}
		});
		
		$("#ListAccScelti").on("dblclick",function(){ 
		    	$(this).find("option:selected").remove();		 
		});
		
		$(".butCreaProfili").on("click",function(){
			home.NS_MMG.apri("GESTIONE_PROFILI");
		});			
	},
	
	add:function(pAccertamento) {
		var vTr = $("<tr/>",{codice:pAccertamento.COD_ACC})
			.append($("<td/>", {'class':'accertamento tdText'})
				.append(vAcc = $("<input/>",{ "type" : "text", "value":pAccertamento.ACCERTAMENTO}))
			)
			.append($("<th/>", {'class':'btn'})
					.on("click", function() {$(this).parent().remove();})
					.text(traduzione.lblRimuovi));
		vTr.attr("cicliche", pAccertamento.CICLICHE);
		vTr.attr("num_sedute", pAccertamento.NUM_SEDUTE);
		vTr.attr("appropriatezza", pAccertamento.APPROPRIATEZZA);
		/*
		 *	disabilitazione alla modifica delle prestazioni che non siano extra o libere 
		 * 	if (pAccertamento.COD_ACC.substring(0,6)!='EXTRA.' && pAccertamento.COD_ACC.substring(0,6)!='LIBERA.') {
		 *		vAcc.attr("disabled", true).css({'color':'black'});
		 *	}
		 */
		
		$("fieldset#fldRiepilogo table").prepend(vTr);
	},

	checkDouble:function(codice){
	
		var controllo = false;
		
		$("#fldRiepilogo tr").each(function() {
			if ($(this).attr("codice")==codice){
				controllo = true;
				return; 
			}
		});
		
		return controllo;
	},
	
	checkRicerca:function(){
	
		var textRicerca = $("#CAMPO_VALUE").val().toUpperCase();
		var ric = textRicerca.substring(1);
		
		var sinonimi = LIB.getParamUserGlobal('SINONIMI_ACCERTAMENTI','S');
		
		if(textRicerca.substring(0,1) == '*'){
			if(ric != ''){
				
				SCELTA_ACCERTAMENTI.$ricerca_profili.val(ric);
				$("#li-tabSceltaProfili").trigger("click");
			}else{
				SCELTA_ACCERTAMENTI.initWk();
			}
		}else{
			if(textRicerca != ''){
				SCELTA_ACCERTAMENTI.$ricerca.val(textRicerca);
				SCELTA_ACCERTAMENTI.initWk();
			}else{
				SCELTA_ACCERTAMENTI.initWk('NOTDEFINED');
			}
		}
	},
	
	checkSinonimo:function(valSinonimo){
		
		//se la wk è accertamenti ritorno il valore corretto del radio dei sinonimi
		if(SCELTA_ACCERTAMENTI.checkWk() == 'ACCERTAMENTI'){
			return valSinonimo;
		}else{			
			return valSinonimo != 'N' ? '%25' : valSinonimo;
		}
	},
	
	checkWk:function(){
		
		return $('#radFrequenza').data('RadioBox').val() == 'S' ? 'ACCERTAMENTI_COUNT' : 'ACCERTAMENTI';
	},
	
	initText:function(textIn){
		
		var text = textIn.toUpperCase();
		text = text.replace("*"," ");

		return text;
	},
	
	
	initWk:function(obj){
		
		var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight( true ) - $('#fldDataAcc').outerHeight( true ) - 100; 
		
		//imposto altezza minima in caso di risoluzioni bassissime
		if(h < 150){ h = 150; }
		
		$("#divWk, #divWkGruppi").height( h );
		
		var Bind = new Array();
		var Value = new Array();
		var text = SCELTA_ACCERTAMENTI.$ricerca.val().toUpperCase();
		var controlloSpazi = text.indexOf(' ');
		text = text.replace(" ","%25");

		var radioVal = SCELTA_ACCERTAMENTI.checkSinonimo($("#h-radSinonimi").val());
		
		Bind.push("descrizione");
		if(controlloSpazi > -1){
			Value.push(text+"%25");
		}else{
			Value.push("%25"+text+"%25");
		}
		Bind.push("codice"); 
		Value.push("%25");
		Bind.push("sinonimo");
		Value.push(radioVal);
		Bind.push("iden_per");
		Value.push(home.baseUser.IDEN_PER);
		
		//controllo per evitare che carichi tutti gli accertamenti del catalogo
		if(typeof obj != 'undefined' &&  obj == 'NOTDEFINED'){
			Value = [obj, obj, obj, 0];
		}else if(typeof obj != 'undefined' &&  obj != 'NOTDEFINED'){
			Bind = obj.arBind;
			Value = obj.arValue;
		}
		
		var p = {
			"id"	:	SCELTA_ACCERTAMENTI.checkWk(),
			"aBind"		:Bind,
			"aVal"		:Value
		};
		
		objWk = new WK(p);
		objWk.loadWk();
		
	},
	
	initWkProfili:function(){

		if (this.objWkGruppi==null) {
			$("#divWkGruppi").height(200).width("100%");
			
			var textGruppi = SCELTA_ACCERTAMENTI.$ricerca_profili.val().toUpperCase();
			var aBind = new Array();
			var aValue = new Array();
			
			aBind.push("descrizione");
			aValue.push("%25"+textGruppi+"%25");
			aBind.push("codice");
			aValue.push("%25");
			aBind.push("iden_utente");
			aValue.push(home.baseUser.IDEN_PER);
			
			var param = {
					"id"		:"ACCERTAMENTI_GRUPPI",
					"aBind"		:aBind,
					"aVal"		:aValue,
					"container" : 'divWkGruppi'
			};
			
			
			this.objWkGruppi = new WK(param);
			this.objWkGruppi.loadWk();
		} else {
			this.objWkGruppi.refresh();
		}
	},
	
	insertGroup:function(){
		
		arrAccertamenti = new Array();
/*		arrCodAccertamenti = new Array();
		arrData = new Array();
		arrHData = new Array();*/

		if($("#fldRiepilogo tr").length<1){
			home.NOTIFICA.warning({
				message:traduzione.lblWarningMsg,
				title: traduzione.lblWarningTitle,
				timeout:10
			});
			return;
		}
		
		$("#fldRiepilogo tr").each(function() {

			arrAccertamenti.push({
				accertamento: $(this).find("td.accertamento input").val(),
				cod_accertamento: $(this).attr("codice"),
				data: $("#Data").val(),
				data_hidden: $("#h-Data").val(),
				cicliche: NS_MMG_UTILITY.getAttr($(this),"cicliche", "0"),
				num_sedute: NS_MMG_UTILITY.getAttr($(this),"num_sedute", "0"),
				appropriatezza: NS_MMG_UTILITY.getAttr($(this),"appropriatezza", "")
			});
		});
		
		home.RICETTA_ACCERTAMENTI.insertAccertamenti(arrAccertamenti);
		NS_FENIX_SCHEDA.chiudi();
	},

	loadDetails:function(valorePadre){
		var param = {"s_n":"S","iden_profilo":valorePadre.toString()};
		toolKitDB.getResultDatasource("MMG_DATI.ACCERTAMENTI_CROSS","MMG_DATI",param,null,function(resp){
			$.each(resp,function(k,v){
				$.each(v,function(k1,opz){
					if(k1 == "CODICE"){
						valore = opz;
					}
					if(k1 == "DESCRIZIONE"){
						descr = opz;
					}
				});
				
				if(!SCELTA_ACCERTAMENTI.checkDouble(valore)){
					NS_LISTBOX.addItem($("#ListDettagli"),descr,valore);
					SCELTA_ACCERTAMENTI.add({'ACCERTAMENTO':descr,'COD_ACC':valore, 'CICLICHE': v.CICLICHE, 'NUM_SEDUTE': v.NUM_SEDUTE, 'APPROPRIATEZZA': v.APPROPRIATEZZA});
				}else{
					home.NOTIFICA.warning({
						message:traduzione.lblAccertamentiUguali,
						title: traduzione.lblTitoloAccertamentiUguali
					});
				}

			});
		});
	},
	
	ricerca:function(type){

		var Bind = new Array();
		var Value = new Array();

		var percentuale = "%25";
		var text = SCELTA_ACCERTAMENTI.$ricerca.val().toUpperCase();
		var controlloSpazi = text.indexOf(" ");
		
		//controllo la spunta sulla ricerca esatta
		/*if($("#h-chkRicercaEsatta").val() == 'S'){*/
		if(type == 'DESCR_ESATTA'){
			percentuale = "";
		}else{
			text = text.replace(" ",percentuale);			
		}
		
		if(text.length < 2){
			alert("Inserire almeno 2 caratteri");
			return;
		}

		switch(type){
			 
			case 'COD':
				$('#radFrequenza').data('RadioBox').selectByValue('N');
				Bind.push("descrizione");
				Value.push("%25");
				Bind.push("codice");
				Value.push(text+percentuale);
				
				break;
				
			case 'DESCR_ESATTA':
			case 'DESCR':
			default:
				Bind.push("descrizione");
				if(controlloSpazi > -1){
					Value.push(text+percentuale);
				}else{
					Value.push(percentuale+text+percentuale);
				}
				Bind.push("codice");
				Value.push("%25");
				break;
		}
		
		var sinonimo  = SCELTA_ACCERTAMENTI.checkSinonimo($('#radSinonimi').data('RadioBox').val());
		
		Bind.push("sinonimo");
		Value.push( sinonimo);
		Bind.push("iden_per");
		Value.push( home.baseUser.IDEN_PER);
		
		var obj = {
				arBind:Bind,
				arValue:Value
		};
		
		//alert('ricerca: '+JSON.stringify(obj));
		
		SCELTA_ACCERTAMENTI.initWk(obj);
		
		//controllo il valore del parametro della frequenza nella ricerca. Se non trovo nulla, imposto il valore ad N in modo che usino la query meno costosa
		var valFrequenza = LIB.getParamUserGlobal('FREQUENZA_ACCERTAMENTI','N');
		$("#radFrequenza").data('RadioBox').selectByValue(valFrequenza);
		
		//non posso più refreshare la wk in quanto non mi considera il nuovo id della wk
		//SCELTA_ACCERTAMENTI.refreshWk(obj);
	},
	
	/**
	 * @deprecated
	 */
	refreshWk:function(arBindValue, idDiv){
		
		var divWorklist = typeof idDiv != 'undefined' ? idDiv : 'divWk'; 

		var sub = $("#"+divWorklist).worklist();
		
		sub.data.where.init();
		sub.data.where.set(arBindValue.id, arBindValue.arBind, arBindValue.arValue);
		sub.data.load();
	},
	
	ricerca_gruppi:function(value){
	
		var text = value.toUpperCase();
		var Bind = new Array();
		var Value = new Array();
		Bind.push("descrizione");
		Value.push("%25" + text + "%25");
		Bind.push("iden_utente");
		Value.push(home.baseUser.IDEN_PER);
		 
		var obj = {
			arBind:Bind,
			arValue:Value
		};
	
		SCELTA_ACCERTAMENTI.refreshWk(obj, 'divWkGruppi');
	},
	
	search:function(type){
		
		var  tabAttivo = $(".tabActive").attr("id");

		switch(tabAttivo){
		
			case 'li-tabScelta':
				
		    	SCELTA_ACCERTAMENTI.ricerca(type);
				break;
			
			case 'li-tabSceltaProfili':

				SCELTA_ACCERTAMENTI.ricerca_gruppi(SCELTA_ACCERTAMENTI.$ricerca_profili.val());
				break;
			
			default:
				
				SCELTA_ACCERTAMENTI.ricerca(type);
				break;
		}
	},
	
	setLayout:function(){
		
		$("#hRicerca").parent().hide();
		$("#lblTitoloDettagli").attr("colSpan","8");
		
		$("#txtRicerca").parents().attr("colSpan","2");
		$("#butDescrizione, #butCodice").parent().css({"width":"50%", "text-align":"center"});
		
		$(".tdCheck").attr("colSpan","8");
		
		$("#ListDettagli").attr("colSpan","8");
		$("#txtRicercaGruppi").next().width(250);		
		
		var icon_obj = { arrowPosition : 'top', width : '300' };
		NS_MMG_UTILITY.infoPopup(traduzione['lblNota'], icon_obj, $("#butRicercaEsatta"));
		
		var icon_obj_2 = { arrowPosition : 'top', width : '300' };
		NS_MMG_UTILITY.infoPopup(traduzione['lblInfoData'], icon_obj, $("#lblData"));
		
		var icon_obj_3 = { arrowPosition : 'top', width : '300' };
		NS_MMG_UTILITY.infoPopup(traduzione['lblInfoOrdinaFreq'], icon_obj, $("#lblFrequenza"));
	}
};

var WK_ACCERTAMENTI = {
		
	select:function(riga){
		
	},
	
	choose:function(riga){
		
		NS_LISTBOX.addItem($("#ListAccScelti"),riga.ACCERTAMENTO, riga.COD_ACC);
		SCELTA_ACCERTAMENTI.add(riga);
		SCELTA_ACCERTAMENTI.$ricerca_profili.val("");
		SCELTA_ACCERTAMENTI.$ricerca.val("").focus();
	},
	
	processInfoAccertamento: function(data) {
    	var div = $('<div>');
		if (LIB.isValid(data.APPROPRIATEZZA)) {
			var arr = data.APPROPRIATEZZA.split(",");
			for (var i=0; i < arr.length; i++) {
				var nota = $('<button>', {'title' : "Nota Appropriatezza " + arr[i], 'type': 'button'});
				nota.append(arr[i]);
				nota.on("click", function() {
					ACCERTAMENTI_COMMON.getInfoNote(data.COD_ACC);
				});
				div.append(nota);
			}
		}
		return div;
	}
};

WK_ACC_GRUPPI = {
	
	choose:function(riga){
		SCELTA_ACCERTAMENTI.loadDetails(riga.IDEN);
		SCELTA_ACCERTAMENTI.$ricerca_profili.val("");
		SCELTA_ACCERTAMENTI.$ricerca.val("");
	}
};