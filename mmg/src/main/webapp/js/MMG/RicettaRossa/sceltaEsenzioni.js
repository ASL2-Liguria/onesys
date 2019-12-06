$(function(){
	SCELTA_ESENZIONI.init();
	SCELTA_ESENZIONI.setEvents();
});

var SCELTA_ESENZIONI = {
		
	idxRiga : null,
	nsRicetta : null,
	$ricerca:$("#txtRicerca"),
	
	objWkPREST : null,
	objWkES_ASS : null,
		
	init:function(){
		
		this.idxRiga = $("#IDX_RIGA").val();
		
		$("#txtRicerca").attr("placeholder",traduzione.phEsenzioni);
		
		switch($("#PROVENIENZA").val()) {
			case 'PRESALVATAGGIO_ACCERTAMENTI':
				this.nsRicetta = home.RICETTA_ACCERTAMENTI;
				break;
			case 'ACCERTAMENTI':
				this.nsRicetta = home.RICETTA_ACCERTAMENTI;
				break;
			case 'PRESALVATAGGIO_FARMACI':
				$("#li-tabEsenzioniAssociabili").hide();
				this.nsRicetta = home.RICETTA_FARMACI;
				break;
			default:
				this.nsRicetta = home.RICETTA_FARMACI;
		}
		
		SCELTA_ESENZIONI.initWk();
		SCELTA_ESENZIONI.initWkEseAssistito();
		SCELTA_ESENZIONI.setSizeWk();
		
	},
	
	setEvents:function(){
		$("#butRicerca").on("click",function(){
			SCELTA_ESENZIONI.ricerca(SCELTA_ESENZIONI.$ricerca.val().toUpperCase(), 'DESCR');
		});
		
		$("#butRicercaCodice").on("click",function(){
			SCELTA_ESENZIONI.ricerca(SCELTA_ESENZIONI.$ricerca.val().toUpperCase(), 'COD');
		});
		
		$("body").on("keyup",function(e) {
		    if(e.keyCode == 13) {
		    	if($("#li-tabEsenzioniAssociabili").hasClass("tabActive")){
		    		SCELTA_ESENZIONI.refreshWkPrestazioni('');
		    	}else{
		    		SCELTA_ESENZIONI.ricerca(SCELTA_ESENZIONI.$ricerca.val().toUpperCase(), 'COD');
		    	}
		    }
		});
		
		$("#li-tabEsenzioniAssociabili").on("click",function(){
			var codice_acc = home.RICETTA_ACCERTAMENTI.getRowSelected().attr("cod_accertamento");
			SCELTA_ESENZIONI.initWkPrestazioni(codice_acc);
			SCELTA_ESENZIONI.initWkEsenzioniAssociate(codice_acc);
		});
		
		$("#butCercaPrest").on("click",function(){
			SCELTA_ESENZIONI.refreshWkPrestazioni('');
		});
	},
	
	initWkPrestazioni: function(codice){
		
		if (this.objWkPREST == null) 
		{
			$("#wkPrestazioniIN").height( 460 );
			
			this.objWkPREST = new WK({
				"id"        : 	'WK_PRESTAZIONI',
				"aBind"     :	["descr","codice"],
				"aVal"      :	["%25" + $("#txtCercaPrest").val().toUpperCase() + "%25", "%25" + codice + "%25"],
				"container" : 	'wkPrestazioniIN'
			});
			this.objWkPREST.loadWk();
		}
	},
	
	refreshWkPrestazioni:function(new_cod){
		
		SCELTA_ESENZIONI.objWkPREST.filter({
			"aBind"     :	["descr","codice"],
			"aVal"      :	["%25" + $("#txtCercaPrest").val().toUpperCase() + "%25", "%25" + new_cod + "%25"]
		});
	},
	
	initWkEsenzioniAssociate: function(cod_prestazione){

		if (this.objWkES_ASS == null) 
		{
			$("#wkEsenzioniOUT").height( 550 );
			
			this.objWkES_ASS = new WK({
				"id"        : 	'WK_PRESTAZIONI_ESENZIONI_ASSOCIATE',
				"aBind"     :	["cod_prestazione"],
				"aVal"      :	["%25" + cod_prestazione + "%25"],
				"container" : 	'wkEsenzioniOUT'
			});
			this.objWkES_ASS.loadWk();
		}
	},
	
	scegliAccertamento: function(riga){
		
		SCELTA_ESENZIONI.refreshWkEsenzioniAssociate(riga.COD_ACC);
	},
	
	refreshWkEsenzioniAssociate:function(new_cod){
		SCELTA_ESENZIONI.objWkES_ASS.filter({
			"aBind"     :	["cod_prestazione"],
			"aVal"      :	["%25" + new_cod + "%25"]
		});
	},
	
	initWk:function(){

		var Bind = new Array();
		var Value = new Array();
		
		var textRicerca = jQuery("#CAMPO_VALUE").val().toUpperCase();
		jQuery("#txtRicerca").val(textRicerca);
		
		Bind.push("descr");
		Value.push("%25");
		Bind.push("codice");
		Value.push(textRicerca + "%25");

		var params = {
	            "id"    : 'ESENZIONI',
	            "aBind" : Bind,
	            "aVal"  : Value
	    };
	    
		objWk = new WK(params);
	    objWk.loadWk();
	},
	
	initWkEseAssistito:function(){
		
		var Bind = new Array();
		var Value = new Array();
		
		Bind.push("iden_anag");
		Value.push(home.ASSISTITO.IDEN_ANAG);
		

	    var params = {
	            "id"    : 'ESENZIONI_PAZIENTE',
	            "aBind" : Bind,
	            "aVal"  : Value,
	            "container" : 'divWkEsenzioni'
	    };

	    objWkPA = new WK(params);
	    objWkPA.loadWk();
	},
	
	caricaWk:function(arBindValue){
		
		//salert(arBindValue.id + ' ' +arBindValue.arBind + ' ' + arBindValue.arValue)
		
		var sub = $("#"+arBindValue.id).worklist();
		sub.data.where.init();
		sub.data.where.set('', arBindValue.arBind, arBindValue.arValue);
		sub.data.load();

	},
	
	insert: function(pCodice, pDescrizione){

		this.nsRicetta.setEsenzione( this.idxRiga, { 
			/*descrizione: pCodice + ' - ' + pDescrizione, //eliminato nel momento in cui si è deciso di inserire solo il codice nella casella delle esenzioni*/ 
			descrizione: pCodice, 
			codice: pCodice } 
		);
		if (LIB.isValid($("#PROVENIENZA").val()) && $("#PROVENIENZA").val() == 'PRESALVATAGGIO_ACCERTAMENTI'){
			home.PRESALVATAGGIO_ACCERTAMENTI.setEsenzione(pCodice, pDescrizione);
		}
		if (LIB.isValid($("#PROVENIENZA").val()) && $("#PROVENIENZA").val() == 'PRESALVATAGGIO_FARMACI'){
			home.PRESALVATAGGIO_FARMACI.setEsenzione(pCodice, pDescrizione);
		}
	},
	
	ricerca:function(valueRic, typeRic){
		
		valueRicerca = valueRic.toUpperCase();
		
		if (valueRicerca.length < 3){
			return alert("Immettere almeno 3 caratteri");
		}
		
		bb=new Array();
		vv=new Array();
		
		switch(typeRic){
			
			case 'DESCR':
				bb.push("descr");
				vv.push(valueRicerca);
				bb.push("codice");
				vv.push('%25');
				break;
			
			case 'COD':
				bb.push("descr");
				vv.push('%25');
				bb.push("codice");
				vv.push(valueRicerca);
				break;
			
			default:
				bb.push("descr");
				vv.push('%25');
				bb.push("codice");
				vv.push(valueRicerca);
				break;
		}
		
		
		
		var obj = {
				id:"divWk",
    			arBind:bb,
    			arValue:vv
		};
		
		
		//alert('ese '+valueRicerca);
		SCELTA_ESENZIONI.caricaWk(obj);
	},
	
	setSizeWk:function(){
		
		var h = (( $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight( true ) ) / 2) - 50;
		
		//imposto altezza minima in caso di risoluzioni bassissime
		if(h < 150){ h = 150; }
		
		$("#divWk, #divWkEsenzioni").height( h );
	},
	
	chiudiScheda:function(){
		NS_FENIX_SCHEDA.chiudi();
	},
	
	apriPrestazioni: function(row){
		
		var iden = row[0].IDEN;
		home.NS_MMG.apri( 'MMG_ESENZIONI_PRESTAZIONI' + '&IDEN_ESENZIONE=' + iden);
	}
};

var WK_ESENZIONI = {

	init:function(){
	
	},
	
	choose:function(riga){
//		alert(riga)
		SCELTA_ESENZIONI.insert(riga.CODICE, riga.ESENZIONE);
		SCELTA_ESENZIONI.chiudiScheda();
	}
};
