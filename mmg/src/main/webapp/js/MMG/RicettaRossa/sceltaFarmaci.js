$(function(){
	
	SCELTA_FARMACI.init();
	SCELTA_FARMACI.setEvents();
	NS_FENIX_SCHEDA.beforeClose = SCELTA_FARMACI.beforeClose;
});

var SCELTA_FARMACI = {
	
	idxRow		: null,
	objWk 		: null,
	objWkPA 	: null,
	objWkPAConf : null,
	objWkATC 	: null,
	objWkPresidi: null,
	
	$ricerca : $("#txtRicerca"),
	
	$ricercaPresidi : $("#txtRicercaPresidi"),
	
	$campoValue : unescape($("#CAMPO_VALUE").val()), 
	
	init:function()
	{
		this.idxRiga = $("#IDX_RIGA").val();
		
		$("#txtRicerca").attr("placeholder",traduzione.phFarmaci);
		$("#txtRicercaPresidi").attr("placeholder",traduzione.phPresidi);
		
		if(SCELTA_FARMACI.$campoValue != '')
		{
			var text = SCELTA_FARMACI.initText(SCELTA_FARMACI.$campoValue);
			SCELTA_FARMACI.$ricerca.val(text);
			SCELTA_FARMACI.$ricercaPresidi.val(text);
			SCELTA_FARMACI.initWkFarmaci(text, "FARMACI");
		}
		else
		{
			SCELTA_FARMACI.initWkFarmaci("NOTDEFINED");
		}
		
		SCELTA_FARMACI.$ricerca.focus();
		
		if (home.LIB.getParamUserGlobal( 'INFO_PAZIENTE_RR', 'N' ) == 'S') 
		{
			home.NS_MMG_UTILITY.infoPaziente.show();
		}
		
		SCELTA_FARMACI.setLayoutFarmaci();
	},
	
	setEvents:function()
	{
		$("body").on("keyup",function(e) {
			 if(e.keyCode == 13) {
				 SCELTA_FARMACI.search();
			 }
		});
		
		$("#butPA").on("click",function(){
			SCELTA_FARMACI.ricerca("PA", SCELTA_FARMACI.$ricerca.val());
		});
		
		$("#butDescrizione").on("click",function(){
			SCELTA_FARMACI.ricerca("DESCR", SCELTA_FARMACI.$ricerca.val());
		});
		
		$("#butCodice").on("click",function(){
			SCELTA_FARMACI.ricerca("CODICE", SCELTA_FARMACI.$ricerca.val());
		});
		
		$("#butRicerca").on("click",function(){
			SCELTA_FARMACI.ricercaPresidi('DESCR', SCELTA_FARMACI.$ricercaPresidi.val());
		});
		
		$("#butRicercaCodice").on("click",function(){
			SCELTA_FARMACI.ricercaPresidi('CODICE', SCELTA_FARMACI.$ricercaPresidi.val());
		});
		
		$("#txtRicerca").on("blur", function(){
			$(this).val($(this).val().toUpperCase());
		});
		
		$("#butSamePA").on("click", SCELTA_FARMACI.caricaWkSamePA);
		$("#butSameConf").on("click", SCELTA_FARMACI.caricaWkSameConf);
		$("#butSameATC").on("click", SCELTA_FARMACI.caricaWkSameATC);
		
		$("#li-tabSceltaPresidi").on("click",function() {
			SCELTA_FARMACI.setLayoutPresidi();
			
			if(SCELTA_FARMACI.$ricerca.val() != ''){				
				SCELTA_FARMACI.$ricercaPresidi.val(SCELTA_FARMACI.$ricerca.val());
				SCELTA_FARMACI.initWkPresidi('DESCR', SCELTA_FARMACI.$ricerca.val());
			}else{				
				SCELTA_FARMACI.initWkPresidi("NOTDEFINED");
			}
		});
	},

	initText:function(textIn){

		var textReturn = textIn.toUpperCase().replace("*"," ");
		textReturn = textReturn.replace(",", "\,");
		textReturn = textReturn.replace("&", "\&");
		textReturn = textReturn.replace("-", "\-");
		return $.trim(textReturn);
	},
	
	initWkFarmaci:function(val, typeWk){
		
		this.objWk = new WK({
            "id"    : typeof typeWk != 'undefined' ? typeWk : "FARMACI",
    	     "aBind" : ["bind"],
    	     "aVal"  : [val]
    	 });
		this.objWk.loadWk();
	},
	
	initWkPresidi:function(type, val){
		
		var wk = '';
		
		if(type == 'DESCR'){
			wk = 'PRESIDI';
		}else{
			wk = 'PRESIDI_CODICE';
		}
		
	    this.objWkPresidi = new WK({
            "id"    : wk,
            "aBind" : ["bind"],
            "aVal"  : [val],
            "container" : 'divWkPresidi'
	    });
	    
	    this.objWkPresidi.loadWk();
	},
	
	caricaWkSamePA: function() {
		
		$("#divWkSostituti").height(150);
		var selRow = SCELTA_FARMACI.objWk.getArrayRecord()[0];
		
		if(!selRow){
			home.NOTIFICA.warning({
				message : traduzione.lblNoScelta,
				title : "Attenzione"
			});
		}

	    this.objWkPA = new WK({
            "id"    : 'FARMACI_PA',
            "aBind" : ["bind"],
            "aVal"  : [selRow.CODICE_PRINCIPIO_ATTIVO],
            "container" : 'divWkSostituti'
	    });
	    this.objWkPA.loadWk();
	},
	
	caricaWkSameATC: function() {
		
		$("#divWkSostituti").height(150);
		var selRow = SCELTA_FARMACI.objWk.getArrayRecord()[0];
		
		if(!selRow){
			home.NOTIFICA.warning({
				message : traduzione.lblNoScelta,
				title : "Attenzione"
			});
		}
		
		this.objWkPA = new WK({
			"id"    : 'FARMACI_ATC',
			"aBind" : ["bind"],
			"aVal"  : [selRow.ATC],
			"container" : 'divWkSostituti'
		});
		this.objWkPA.loadWk();
	},
	
	caricaWkSameConf: function() {
		
		$("#divWkSostituti").height(150);
		var selRow = SCELTA_FARMACI.objWk.getArrayRecord()[0];
		
		if(!selRow){
			home.NOTIFICA.warning({
				message : traduzione.lblNoScelta,
				title : "Attenzione"
			});
		}
		
		this.objWkPA = new WK({
			"id"    : 'FARMACI_PA_CONF',
			"aBind" : ["bind"],
			"aVal"  : [selRow.CODICE],
			"container" : 'divWkSostituti'
		});
		this.objWkPA.loadWk();
	},
	
	ricercaPresidi:function(type,valueRic){
		
		valueRicerca = SCELTA_FARMACI.initText(valueRic);
		
		if (valueRicerca.length < 3){
			return alert("Immettere almeno 3 caratteri");
		}
		
		SCELTA_FARMACI.initWkPresidi(type, valueRicerca);
	},
	
	ricerca:function(type, valueRic){
		
		var valueRicerca = SCELTA_FARMACI.initText(valueRic);
		
		if (valueRicerca.length < 2){
			return alert("Immettere almeno 2 caratteri");
		}
		
		switch(type){
		
			case 'PA':
					SCELTA_FARMACI.initWkFarmaci(valueRicerca, "FARMACI_DESCR_PA");
					break;
					
			case 'CODICE':
					SCELTA_FARMACI.initWkFarmaci(valueRicerca, "FARMACI_CODICE");
					break;
			
			case 'DESCR':
			default:
					SCELTA_FARMACI.initWkFarmaci(valueRicerca, "FARMACI");
					break;
		}
	},
	
	search:function()
	{
		var tabAttivo = $(".tabActive").attr("id");
		
		switch(tabAttivo)
		{
			case 'li-tabScelta':
				SCELTA_FARMACI.ricerca("DESCR", SCELTA_FARMACI.$ricerca.val().toUpperCase());
				break;
			
			case 'li-tabSceltaPresidi':
				SCELTA_FARMACI.ricercaPresidi('DESCR', SCELTA_FARMACI.$ricercaPresidi.val().toUpperCase());
				break;
			
			default:
				SCELTA_FARMACI.ricerca("DESCR", SCELTA_FARMACI.$ricerca.val().toUpperCase());
				break;
		}
	},

	beforeClose:function()
	{
		home.NS_MMG_UTILITY.infoPaziente.hide();
		return true;
	},
	
	setLayoutFarmaci: function() 
	{
		$("#divWkSostituti").closest("tr").height(0);
		
		var h = $(".contentTabs").innerHeight() - $("#fldRicerca").outerHeight(true) - $("#fldSostituti").outerHeight(true) - 40;

		//imposto altezza minima in caso di risoluzioni bassissime
		if(h < 130){ h = 130; }
		
		$("#divWk").height( h );
	},
	
	setLayoutPresidi: function() 
	{
		var h = $(".contentTabs").innerHeight() - $("#fldRicercaPresidi").outerHeight(true) - 50;
		
		//imposto altezza minima in caso di risoluzioni bassissime
		if(h < 150){ h = 150; }
	
		$("#divWkPresidi").height( h );
	}
};

var WK_FARMACI = {
		
	choose:function(riga){
		
		if( parseInt( riga.PT ) > 0 ) {
			$.NS_DB.getTool({}).select({
				id: "RICETTE.CHECK_PIANO_TERAPEUTICO",
				parameter: {
					cod_farmaco : { v : riga.CODICE , t : 'V'},
					eta : { v : home.ASSISTITO.ETA , t : 'V'}
				}
			}).done( function( resp ){
				if (resp.result[0].PT > 0 ) {
					var dialogContent = $("<p/>").html(traduzione.lblFarmacoPT);
					var options = {
						'id'				: "dialogConfirm",
						'title' 			: traduzione.lblConfermaPT,
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'width'				: 250,
						'height'			: 320,
						'showBtnClose'		: false,
						'modal'				: true,
						'movable'			: true,
						'buttons': [{
								label: traduzione.lblAnnulla,
								action: function (ctx) {
									$.dialog.hide();
								}
							}, {
								label: traduzione.lblProcediPT,
								action: function (ctx) {
									home.RICETTA_FARMACI.setFarmaco(SCELTA_FARMACI.idxRiga, riga);
									NS_FENIX_SCHEDA.chiudi();
								}
							}
						]
					};
					var data_hidden = $("<input type='hidden'/>");
					var pt_data_fine = $("#PT_DATA_FINE").val();
					if (LIB.isValid(pt_data_fine)) {
						data_hidden.val(pt_data_fine);
					}
					$.dialog(dialogContent, options);

					data_hidden.Zebra_DatePicker({always_visible: dialogContent.parent(), onSelect: function(data,dataIso) {
						home.RICETTA_FARMACI.setFarmaco(SCELTA_FARMACI.idxRiga, riga,
								{data_ini:moment().format('YYYYMMDD'),data_fine:dataIso}
						);
						NS_FENIX_SCHEDA.chiudi();
					}});
				} else {
					home.RICETTA_FARMACI.setFarmaco(SCELTA_FARMACI.idxRiga, riga);
					NS_FENIX_SCHEDA.chiudi();
				}
			});
		} else {
			home.RICETTA_FARMACI.setFarmaco(SCELTA_FARMACI.idxRiga, riga);
			NS_FENIX_SCHEDA.chiudi();
		}
	},
	
	apriFarma:function(riga) {
		var url= home.baseGlobal.URL_MONOGRAFIE + riga[0].CODICE;
		var frame = $("<iframe/>", {"src":url, "width":"100%", "height":"300px" });
		var dialog = home.$.dialog(frame,{
			'id'				: "dialog",
			'title' 			: "Monografia",
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			'width'				: 800,
			'showBtnClose'		: false,
			'modal'				: true,
			'movable'			: true,
			'buttons' 			: [{label: traduzione.butChiudi, action: function (ctx) { home.$.dialog.hide(); }}]}
		);
	},
	
	apriSchedaFarmaco:function(riga) {
		if (LIB.isValid(riga.length)) {
			riga = riga[0];
		}
		var url="MMG_INFO_FARMACO&COD_FARMACO="+riga.CODICE;
		home.NS_MMG.apri( url );
	},
    
    selectFarmaco: function( data ) {
    	
    	var div = $('<div>');
    	var i = $('<i>', { 'class' : 'icon-check-empty worklist-icon', 'title' : 'Scegli' });
		i.on('click', function(){
			WK_FARMACI.choose(data);
		});
    	i.on('mouseenter', function(){
			$(this).addClass('icon-check-1').removeClass('icon-check-empty');
		});
    	i.on('mouseleave', function(){
			$(this).removeClass('icon-check-1').addClass('icon-check-empty');
		});
    	
		div.append(i);
		return div;
    },
	
	processInfoFarmaco: function(data) {
    	var div = $('<div>');
		var info = $('<i>', { 'class' : 'icon-info-circled', 'title' : 'Informazioni farmaco' });
		info.on('click', function(){
			WK_FARMACI.apriSchedaFarmaco(data);
		});
		if (LIB.isValid(data.TIPO_PRESCR)) {
			info.addClass("attenzione_1");
			info.attr("title", info.attr("title") + " - Indicazioni prescrivibilità");
		}
		div.append(info);
		if (LIB.isValid(data.NOTE_CUF)) {
			var arr = data.NOTE_CUF.split(",");
			for (var i=0; i < arr.length; i++) {
				var nota = $('<button>', {'title' : "Nota AIFA " + arr[i], 'type': 'button'});
				nota.append(arr[i]);
				nota.on("click", function() {
					FARMACI_COMMON.apriNoteCUF($(this).text());
				});
				div.append(nota);
			}
		}
		return div;
	}
	
};
