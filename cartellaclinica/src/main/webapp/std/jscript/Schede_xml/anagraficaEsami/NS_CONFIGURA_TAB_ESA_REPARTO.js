/**
 * @author linob
 * @data 27-02-2015
 * @page tab_esa_reparto js
 */
/*
 * ELIMINARE DBQUERY URGENZE
 * ELIMINARE txt di ricerca o per ora nascondere/abilitare solo per i reparti??Forse
 * AGGIUNGERE DUE RADIO:
 * RADIO RICHIESTA/CONSULENZA
 * RADIO STRUTTURA/REPARTI
 * CONTROLLO SE SCELGO CONSULENZA, NON DEVO CAMBIARE L'URGENZA -> FILTRO DESTINATARIO SI DEVE CARICARE DINAMICAMENTE(??????)
 */

var WindowCartella = null;

jQuery(document).ready(function() {
	var topname = top.window.name;
    window.WindowHome = window;
    while (window.WindowHome.name != topname && window.WindowHome.parent != window.WindowHome) {
        window.WindowHome = window.WindowHome.parent;
    }
    window.baseReparti = WindowHome.baseReparti;
    window.baseGlobal = WindowHome.baseGlobal;
    window.basePC = WindowHome.basePC;
    window.baseUser = WindowHome.baseUser;

    try {
    	WindowHome.utilMostraBoxAttesa(false);
    } catch (e) {}

    try {
    	NS_CONFIGURA_TAB_ESA_REPARTO.init();
    	NS_CONFIGURA_TAB_ESA_REPARTO.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }

});


var NS_CONFIGURA_TAB_ESA_REPARTO = {
	es_reparto:'',
	array_urgenze:[],
	jsonRiepilogo:[],
	tipologia_richiesta:'',
	_filtro_list_reparti:'',
	_filtro_list_dest:'',
	jsonSalvataggio:[],
	
	init:function(){
		NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_dest		= new FILTRO_QUERY("elencoDestinatario", null);

	    $('div#divRiepilogo').find('table.classDataEntryTable').remove();  
	    var table = '<table rules="all"><thead><tr>' +
					utility_esami.creaTh("thRiep", "10%",  "Modifica") +
				    utility_esami.creaTh("thRiep", "40%", "Descrizione Esame") +
				    utility_esami.creaTh("thRiep", "10%", "Destinatario") +
				    utility_esami.creaTh("thRiep", "10%", "Sito") +
				    utility_esami.creaTh("thRiep", "20%", "Struttura/Reparto Richiedente") +
				    utility_esami.creaTh("thRiep", "5%",  "Urgenza") +	    
				    utility_esami.creaTh("thRiep", "5%",  "Incl/Escl") +
				    '</tr></thead><tbody id="idTableRiepilogo"></tbody></table>';
	    
	    document.getElementById('divRiepilogo').innerHTML = table; 
	},
	
	setEvents:function(){	
		$('input[name="radTipologiaRichiesta"]').change(function() {               			
    		NS_CONFIGURA_TAB_ESA_REPARTO.filtroDestinatario(NS_CONFIGURA_TAB_ESA_REPARTO.generaWhereDestinatario($('input[name="radTipologiaRichiesta"]:checked').val()));    		
    	});

		$('input[name="radTipologiaStrutturaReparti"]').change(function() {
			NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_reparti 	= new FILTRO_QUERY("elencoReparti", null);
			switch ($(this).val()){
			case 'R':
				NS_CONFIGURA_TAB_ESA_REPARTO.filtroReparti();				
				break;
			case 'S':
				NS_CONFIGURA_TAB_ESA_REPARTO.filtroStruttura();				
				break;
			case 'A':
				NS_CONFIGURA_TAB_ESA_REPARTO.filtroSito();				
				break;				
			}	
    	});

		
		
		$('#txtRicercaDestinatario').keypress( function(e) {
            /* ENTER PRESSED*/
            if (e.keyCode == 13) {
    			if (typeof $('input[name="radTipologiaRichiesta"]:checked').val()=='undefined'){
    				return alert('Selezionare prima una tipologia di richiesta.')
    			}else{
    				var searchList = "UPPER(DESCR) like '%" + $('#txtRicercaDestinatario').val().toUpperCase() + "%'";
    				NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_dest.searchListRefresh(searchList, "RICERCA_DESTINATARIO")
    			} 
            }
        });
				
		var filtro;
	
		$('#txtRicercaReparti').keypress( function(e) {
            if (e.keyCode == 13) {
            	NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_reparti.searchListRefresh("UPPER(DESCR) like '%" + $('#txtRicercaReparti').val().toUpperCase() + "%'", "RICERCA_REPARTI"); 
            }
        });	
		
		$('div#divElencoDestinatario').find('div#groupDestinatario').find('table.classDataEntryTable').delegate("select[name=elencoDestinatario]", "change", function() {
			var valore = '';
			if ($('input[name="radTipologiaRichiesta"]:checked').val()=='R'){
				valore = $('select[name=elencoDestinatario] option:selected').val();
			}else{
				valore = 'CONSULENZA';
			} 

			NS_CONFIGURA_TAB_ESA_REPARTO.caricaUrgenze();
			for (var key in AssociaTipologiaRichiesta){
				if ($.inArray(valore,AssociaTipologiaRichiesta[key]["EROGATORE"])>-1){
					NS_CONFIGURA_TAB_ESA_REPARTO.tipologia_richiesta =AssociaTipologiaRichiesta[key]["TIPOLOGIA_RICHIESTA"];
					NS_CONFIGURA_TAB_ESA_REPARTO.filtroUrgenze(AssociaTipologiaRichiesta[key]["URGENZA"]);
				}
			}
		})
		$("select[name=elencoDestinatario]")[0].onclick = function(){
			try {
				$("select[name=elencoDestinatario]").val($("select[name=elencoDestinatario] option:selected").val());
			}
			catch(e) {
				alert(e.message);
			}
		};

		$("select[name=elencoReparti]")[0].onclick = function(){
			try {
				$("select[name=elencoReparti]").val($("select[name=elencoReparti] option:selected").val());
			}
			catch(e) {
				alert(e.message);
			}
		};			

		$("select[name=elencoUrgenza]")[0].onclick = function(){
			try {
				$("select[name=elencoUrgenza]").val($("select[name=elencoUrgenza] option:selected").val());
			}
			catch(e) {
				alert(e.message);
			}
		};			
	},
	
	
	filtroDestinatario:function (whereCond){
		var param = {
				"valore"	: "COD_CDC",
				"campo"  	: "DESCR",
				"tabella"	: "RADSQL.CENTRI_DI_COSTO",
				"where"  	: "ATTIVO='S' and "+whereCond,
				"order"	 	: "DESCR ASC",
				"enablewait": "S"
			}
		NS_CONFIGURA_TAB_ESA_REPARTO.generaFiltro(NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_dest,param);	
	},
	
	filtroUrgenze:function (array_confronto){
		var arrayToRemove = $.map(NS_CONFIGURA_TAB_ESA_REPARTO.array_urgenze, function(el){
			  return $.inArray(el, array_confronto) > -1 ? null : el;
			})
		
		$.each(arrayToRemove,function(index,value){
			$('select[name=elencoUrgenza] [value='+value+']').remove();
			NS_CONFIGURA_TAB_ESA_REPARTO.array_urgenze.push($(value).val());
		})			
	},


	filtroReparti:function (){
		var param = {
			"valore"	: "COD_CDC",
			"campo"  	: "DESCR",
			"tabella"	: "RADSQL.CENTRI_DI_COSTO",
			"where"  	: "ATTIVO='S' and tipo_cdc in ('0','1','8')",
			"order"	 	: "DESCR ASC",
			"enablewait": "N",
			"attributi" :{"optStruttura"	: "STRUTTURA", "optSito"	: "SITO"}
			
		}
		NS_CONFIGURA_TAB_ESA_REPARTO.generaFiltro(NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_reparti,param);		
	},

	filtroStruttura:function (){
		var param = {
			"valore"	: "STRUTTURA",
			"campo"  	: "STRUTTURA",
			"tabella"	: "RADSQL.CENTRI_DI_COSTO",
			"where"  	: "ATTIVO='S' and tipo_cdc in ('0','1','8') and struttura is not null",
			"order"	 	: "",
			"enablewait": "N",
			"groupby"   : "STRUTTURA"			
		}
		NS_CONFIGURA_TAB_ESA_REPARTO.generaFiltro(NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_reparti,param);		
	},	

	filtroSito:function (){
		var param = {
			"valore"	: "SITO",
			"campo"  	: "SITO",
			"tabella"	: "RADSQL.CENTRI_DI_COSTO",
			"where"  	: "ATTIVO='S' and tipo_cdc in ('0','1','8') and sito is not null",
			"order"	 	: "",
			"enablewait": "N",
			"groupby"   : "SITO"			
		}
		NS_CONFIGURA_TAB_ESA_REPARTO.generaFiltro(NS_CONFIGURA_TAB_ESA_REPARTO._filtro_list_reparti,param);		
	},		
	
	generaFiltro:function(obj,param){

		obj.setEnableWait(param["enablewait"]);
		obj.setValueFieldQuery(param["valore"]);
		obj.setDescrFieldQuery(param["campo"]);
		obj.setFromFieldQuery(param["tabella"]);
		obj.setWhereBaseQuery(param["where"]);
		obj.setOrderQuery(param["order"]);
		if (typeof (param["attributi"])!='undefined'){
			for (var key in param["attributi"]){
				obj.setDataFieldQuery(key,param["attributi"][key]);
			}
		}

		if (typeof (param["groupby"])!='undefined'){
			obj.setGroupQuery(param["groupby"]);
		}
		
		obj.searchListRefresh();		
	},
	
	generaWhereDestinatario:function(valore){
		if (valore=='R'){
			return "TIPO_CDC NOT IN ('0','1','8')";
		}else{
			return "TIPO_CDC IN ('0','1','8')"
		}
	},
	
	caricaUrgenze:function(){
		$('select[name=elencoUrgenza] option').remove();
		for (var key in urgenze){
			NS_CONFIGURA_TAB_ESA_REPARTO.array_urgenze.push(urgenze[key]["valore"]);
			
		    $('<option/>', {
	            'value': urgenze[key]["valore"],
	            'text': urgenze[key]["testo"]
	        }).appendTo('select[name=elencoUrgenza]');				
		};
	},
	
	idenEsaExcluded:function(){

		var arRepTmp = [];
		var arStrTmp = [];
		var arSitTmp = [];

		var $destinatario = $('select[name=elencoDestinatario] option:selected'); 
		var $reparti = $('select[name=elencoReparti] option:selected');
		var $tipologia_richiesta = $('input[name=radTipologiaRichiesta]:checked');
		var $urgenza = $('select[name=elencoUrgenza] option:selected');
		
		switch ($('input[name="radTipologiaStrutturaReparti"]:checked').val()){
		case 'R':
			arRepTmp = NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.reparto',[	$destinatario.val(),
																																		$reparti.val(),
																																		$tipologia_richiesta.val(),
																																		$urgenza.val(),
																																		'N']);
			
			arStrTmp = NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.struttura',[$destinatario.val(),
			                                                                                                                             $reparti.attr("optstruttura"),
																																		$tipologia_richiesta.val(),
																																		$urgenza.val(),
																																		'N']);					

			arSitTmp = NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.sito',[$destinatario.val(),
																																	$tipologia_richiesta.val(),
																																	$urgenza.val(),
																																	'N']);			
			
			break;
		case 'S':
			arStrTmp = NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.struttura',[	$destinatario.val(),
			                                                                                                                             	$reparti.val(),
																																			$tipologia_richiesta.val(),
																																			$urgenza.val(),
																																			'N']);
			arSitTmp = NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.sito',[$destinatario.val(),
																																	$tipologia_richiesta.val(),
																																	$urgenza.val(),
																																	'N']);				
			break;
		case 'A':
			arSitTmp = NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.sito',[$destinatario.val(),
																																	$tipologia_richiesta.val(),
																																	$urgenza.val(),
																																	'N']);				
			break;
		default: break;
		}
		
		var arRet = [];
//		if (
//				(arRepTmp.length>0 && arStrTmp.length==0 && arSitTmp.length==0) || 
//				(arRepTmp.length==0 && arStrTmp.length>0 && arSitTmp.length==0) || 
//				(arRepTmp.length==0 && arStrTmp.length==0 && arSitTmp.length>0)){
//			if (arRepTmp.length>0){
//				arRet=arRepTmp
//			}else if (arStrTmp.length>0) {
//				arRet=arStrTmp;
//			}else{
//				arRet=arSitTmp;
//			}
//		}else{
//			for (var i = arStrTmp.length - 1; i >= 0; i--) {
//			    var obj = arStrTmp[i];
//			    for(var j=0;j<arRepTmp.length;j++){
//			    	if (arRepTmp[j].getIdenEsa()=== obj.getIdenEsa()){
//			    		arStrTmp.splice(i, 1);	
//			    	}
//			    }
//			}
//			arRet = arRepTmp.concat(arStrTmp);
//		}
		arRet = arRet.concat(arRepTmp);
		arRet = arRet.concat(arStrTmp);
		arRet = arRet.concat(arSitTmp);		
		return arRet;
	},
	
	creaRiepilogo:function(){
		NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo = [];
		setVeloNero("groupRiepilogo","groupRiepilogo")
		var $destinatario	= $('select[name=elencoDestinatario] option:selected'); 
		var $reparti 		= $('select[name=elencoReparti] option:selected');
		var $tipologia_ric	= $('input[name=radTipologiaRichiesta]:checked');
		var $urgenza 		= $('select[name=elencoUrgenza] option:selected');
//		pBinds.push($destinatario.val());
//		pBinds.push($reparti.val());
//		pBinds.push($tipologia_ric.val());
//		pBinds.push($urgenza.val());
//		pBinds.push('S')

		switch ($('input[name="radTipologiaStrutturaReparti"]:checked').val()){
		case 'R':
			NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.concat(
						NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.reparto',[$destinatario.val(),
						                                                                                                                $reparti.val(),
						                                                                                                                $tipologia_ric.val(),
						                                                                                                                $urgenza.val(),
						                                                                                                                'S']));
			
			NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.concat(
					NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.struttura',[$destinatario.val(),
					                                                                                                                  $reparti.attr("optstruttura"),
						                                                                                                              $tipologia_ric.val(),
						                                                                                                              $urgenza.val(),
						                                                                                                              'S']));			
			
			NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.concat(
					NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.sito',[$destinatario.val(),
					                                                                                                             $tipologia_ric.val(),
						                                                                                                         $urgenza.val(),
						                                                                                                         'S']));		
		break;
		case 'S':
			NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.concat(
					NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.struttura',[$destinatario.val(),
					                                                                                                                  $reparti.val(),
					                                                                                                                  $tipologia_ric.val(),
					                                                                                                                  $urgenza.val(),'S']));				
			
			NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.concat(
					NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.sito',[$destinatario.val(),
					                                                                                                             $tipologia_ric.val(),
						                                                                                                         $urgenza.val(),
						                                                                                                         'S']));
		break;
		case 'A':
			NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.concat(
					NS_CONFIGURA_TAB_ESA_REPARTO.queryTabEsaReparto('gestioneAnagraficaEsami.xml','tab_esa_reparto.select.sito',[$destinatario.val(),
					                                                                                                             $tipologia_ric.val(),
						                                                                                                         $urgenza.val(),
						                                                                                                         'S']));
		default:break;
		}
		
		
		/*RIMUOVO GLI IDEN ESA DA RIMUOVERE*/
		if (NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.length==0){
			return alert('Nessun esame disponibile per la selezione eseguita')
		}
		var arToExclude = [];
		arToExclude = NS_CONFIGURA_TAB_ESA_REPARTO.idenEsaExcluded();
		if (arToExclude.length>0){
			for (var i = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.length - 1; i >= 0; i--) {
			    var obj = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo[i];
			    for(var j=0;j<arToExclude.length;j++){
			    	if (arToExclude[j].getIdenEsa()=== obj.getIdenEsa()){
			    		console.log(arToExclude[j].getIdenEsa()+'------'+ obj.getIdenEsa())
			    		NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.splice(i, 1);	
			    	}
			    }
			}
		}
		
		
		$('#idTableRiepilogo').children().remove();
		var tmpTable = [];

	    for (var index=0;index<NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo.length;index++){
	    	var item = NS_CONFIGURA_TAB_ESA_REPARTO.jsonRiepilogo[index];
			tmpTable[index] = utility_esami.creaRiga(item,index,'disabled','tdRiep',true);
	    }

	    $('#idTableRiepilogo').append(tmpTable.join(''));
	     
		$('#groupRiepilogo').find('table').delegate(".abilitaModifica", "change", function() {
			if ($(this).attr('checked')){
			    $(this).parent("td").parent("tr").find("input:not(.abilitaModifica)").attr('disabled',false);
			    $(this).parent("td").parent("tr").children().addClass('tdRiepSel');
			    $(this).parent("td").parent("tr").children().removeClass('tdRiep');
				
			}else{
				$(this).parent("td").parent("tr").children().addClass('tdRiep');
				$(this).parent("td").parent("tr").children().removeClass('tdRiepSel');
			    $(this).parent("td").parent("tr").find("input:not(.abilitaModifica)").attr('disabled',true);		
			}
		});

		removeVeloNero("groupRiepilogo")
	},
	
	
	queryTabEsaReparto:function(pStatementFile,pStatementQuery,pBinds){
		var arTmp = [];
		var res = WindowHome.executeQuery(pStatementFile,pStatementQuery,pBinds);
		while (res.next()){
			var esame_tab_esa_reparto = new esameTabEsaReparto(
					res.getString("iden"),
					res.getString("descr_esa"),
					res.getString("reparto_destinazione"),
					res.getString("tipo"),
					res.getString("struttura_richiedente"),
					res.getString("reparto_sorgente"),
					res.getString("reparto_sorgente_descrizione"),
					res.getString("urgenza"),
					res.getString("includi")					
			);		    
			    
			arTmp.push(esame_tab_esa_reparto);			
		}
		return arTmp;
	},
	
	salva:function(){
		var scelta = $('input[name="radTipologiaStrutturaReparti"]:checked').val();
		var repStruSito = $('select[name=elencoReparti] option:selected').val();
		var tipologia_richiesta = $('input[name=radTipologiaRichiesta]:checked').val();
		var ret = [];
		var struttura = '';
		var reparto = '';
		var statementEx = '';
		var statementIn = '';
		$('#groupRiepilogo').find('table').find(".abilitaModifica:checked").each(function(i,item){
			var iden_esame = $(item).attr("iden_esame");//mi salvo l'iden esame
			var index = $(item).attr("index");
			var $tr = $(item).parent('td').parent('tr:first');
			var descr_esame = $tr.find('#idTdDescrEsame'+index).text();
			var destinatario = $tr.find('#idTdDestinatario'+index).text();
			switch(scelta){
			case 'R':
				struttura = '';
				reparto = repStruSito;
				statementEx = 'tab_esa_reparto.reparto.escludi';
				statementIn = 'tab_esa_reparto.reparto.includi';	
				break;
			case 'S':
				struttura = repStruSito;
				reparto = '';				
				statementEx = 'tab_esa_reparto.struttura.escludi';
				statementIn = 'tab_esa_reparto.struttura.includi';					
				break;
			case 'A':
				struttura = '';
				reparto = '';
				statementEx = 'tab_esa_reparto.sito.escludi';				
				statementIn = 'tab_esa_reparto.sito.includi';	
				break;
			default:
				break;
			}
			
			var urgenza = $tr.find('input#idurg'+index+':checked').val();
			var includi = $tr.find('input[name=incl_escl'+index+']:checked').val();

			//esclusione: sito update/struttura insert/reparto insert
			//inclusione: sito/struttura/reparto
			var pBinds = [iden_esame,destinatario,tipologia_richiesta/*,sito*/,struttura,reparto,urgenza,includi,WindowHome.baseUser.IDEN_PER];
			if (includi==='N'){
				ret.push(NS_CONFIGURA_TAB_ESA_REPARTO.eseguiStatement('gestioneAnagraficaEsami.xml',statementEx,pBinds,descr_esame,includi));
			}else{
				ret.push(NS_CONFIGURA_TAB_ESA_REPARTO.eseguiStatement('gestioneAnagraficaEsami.xml',statementIn,pBinds,descr_esame,includi));
			}
		});
		
		
		alert(ret.join('\n'));
		$('#idTableRiepilogo').children().remove();
		NS_CONFIGURA_TAB_ESA_REPARTO.creaRiepilogo();
	},
	
	eseguiStatement:function(pStatementFile,pStatementQuery,arValori,descrEsame,includi){
		var obj = [];
		var messageOk = includi==='S'? 'Esame '+descrEsame+' incluso correttamente':'Esame '+descrEsame+' escluso correttamente';
		var messageKo = includi==='S'? 'Esame '+descrEsame+' errore durante la fase di inclusione':'Esame '+descrEsame+' errore durante la fase di esclusione';
		var resp = WindowHome.executeStatement(pStatementFile,pStatementQuery,arValori);
		if (resp[0]=="KO"){
			obj["check"] = resp[0];
			obj["message"] = messageKo + resp[1];
		}else{
			obj["check"] = resp[0];
			obj["message"] = messageOk;			
		}
		return obj["message"];
	},
	
	apriImportaEsame:function(){
        var url = "servletGenerator?KEY_LEGAME=FILTRO_WK_ANAGRAFICA_ESAMI_AGGIUNGI&ILLUMINA=javascript:illumina_multiplo_generica(this.sectionRowIndex);";
        if (NS_CONFIGURA_TAB_ESA_REPARTO.tipologia_richiesta=='' || $('select[name=elencoUrgenza] option:selected').val()==''){
        	return alert('Selezionare il destinatario/l\'urgenza dell\'esame/degli esami da importare')
        }else{
            url += "&tipologia_richiesta = "+NS_CONFIGURA_TAB_ESA_REPARTO.tipologia_richiesta;        	
            url += "&destinatario = "+$('select[name=elencoDestinatario] option:selected').val();
            url += "&urgenza = " + $('select[name=elencoUrgenza] option:selected').val();
        }
        $.fancybox({
            'padding': 3,
            'width': 900,
            'height': 500,
            'href': url,
            'type': 'iframe',
            'scrolling':'no',
            'enableEscapeButton':false
        });
	},
	
	importaEsame:function(objEsame){
		var $reparti = $('select[name=elencoReparti] option:selected');
		var listaTr = [];
		for (var index=0;index<=objEsame.length-1;index++){
			var obj = objEsame[index];
			listaTr[index] = utility_esami.creaRiga(obj,index,'','tdRiepImp',false);
		}
		var table = listaTr.join(''); 
		$('#idTableRiepilogo').append(table);
	},
	
	resetta:function(){
		window.location.reload();
		
		
		
	}
}

var urgenze = {
	"0":{
		"valore":"0",
		"testo":"Routine"
	},	
	"1":{
		"valore":"1",
		"testo":"Urgenza Differita"
	},
	"2":{
		"valore":"2",
		"testo":"Urgenza"
	},
	"3":{
		"valore":"3",
		"testo":"Emergenza"
	}	
}


var AssociaTipologiaRichiesta = {
	"LABORATORIO" :{
		"TIPOLOGIA_RICHIESTA":"0",
		"EROGATORE":["LABO"],
		"URGENZA":["0","2","3"]
	},
	"RADIOLOGIA" :{
		"TIPOLOGIA_RICHIESTA":"1",
		"EROGATORE":["RADIO","SAVON","ALBEN","CAIRO","NEURO"],
		"URGENZA":["0","1","2","3"]
	},
	"MEDICINA NUCLEARE" :{
		"TIPOLOGIA_RICHIESTA":"2",
		"EROGATORE":["MEDNUC"],
		"URGENZA":["0"]
	},
	"MEDICINA NUCLEARE RIA" :{
		"TIPOLOGIA_RICHIESTA":"3",
		"EROGATORE":["MEDNUCRIA"],
		"URGENZA":["0","2"]
	},
	"CARDIOLOGIA" :{
		"TIPOLOGIA_RICHIESTA":"4",
		"EROGATORE":["CARDIO_AL","CARDIO_CA","CARDIO_PL","ATS_CAR_SV","AMB_CAR_SV"],
		"URGENZA":["0","1","2","3"]
	},
	"MICROBIOLOGIA" :{
		"TIPOLOGIA_RICHIESTA":"13",
		"EROGATORE":["MICRO"],
		"URGENZA":["0"]
	},		
	"ENDOSCOPIA" :{
		"TIPOLOGIA_RICHIESTA":"10",
		"EROGATORE":["ENDOSV","ENDOAL"],
		"URGENZA":["0","1","2","3"]
	},
	"CONSULENZA":{
		"TIPOLOGIA_RICHIESTA":"5",
		"EROGATORE":["CONSULENZA"],
		"URGENZA":["0","2"]
		
	}
};


var esameTabEsaReparto = function(idenEsa, descrEsa, destin, tipoRic, struttura, reparto, repartosorgentedescr, urgenza, inclEscl){
	this._idenEsa 	= idenEsa;
	this._descrEsa	= descrEsa;
	this._destin	= destin;
	this._tipoRic	= tipoRic;
	this._struttura = struttura;		
	this._reparto	= reparto;
	this._repsorgdescr = repartosorgentedescr;
	this._urgenza	= urgenza;
	this._inclEscl	= inclEscl;		
}

esameTabEsaReparto.prototype = {
	getIdenEsa:function(){
		return this._idenEsa;
	},
	getDescrEsa:function(){
		return this._descrEsa;
	},
	getDestinatario:function(){
		return this._destin;
	},
	getTipoRichiesta:function(){
		return this._tipoRic;	
	},
	getStruttura:function(){
		return this._struttura;
	},
	
	getReparto:function(){
		return this._reparto;
	},
	getRepartoDescr:function(){
		return this._repsorgdescr;
	},
	getUrgenza:function(opt){
		return urgenze[this._urgenza][opt];
	},
	getSito:function(){
		this._sito=" ";
		if (utility_esami.checkNull(this._struttura) && utility_esami.checkNull(this._reparto)){
			this._sito = "ASL2";
		}  
		return this._sito;
	},
	getInclEscl:function(){
		return this._inclEscl;	
	}	
};


var utility_esami = {
		
		creaTh:function(cls,width,txt){
			return '<th class='+cls+' width="'+width+'">'+utility_esami.checkUndefined(txt)+'</th>'
		},
		
		
		creaTd:function(cls,id,width,txt,obj){
			var td = '';
			if (typeof (obj)=='undefined' || obj.length == 0){
				td = '<td id="'+id+'" class="'+cls+'" width="'+width+'" >'+utility_esami.checkUndefined(txt)+'</td>'
			}else{
				td = '<td id="'+id+'" class="'+cls+'" width="'+width+'" >'+obj.join('')+'</td>'							
			}
			return td;
			
		},
		creaLabel:function(forInput,cls,txt){
			return '<label for="'+forInput+'" class="'+cls+'">'+utility_esami.checkUndefined(txt)+'</label>';
		},
		
		checkNull:function(val){
			if (val =='' || val== null){
				return true;
			}else{
				return false;
			}
		},
		checkUndefined:function(val){
			if (typeof(val)=='undefined'){
				return '';
			}else{
				return val;
			}
		},
		
		creaRiga:function(item,index,valoreDisabledInput,classTd,checkInputAbilitaModifica){
	    	var tmpTr = '<tr class="trRiep">';
	    	var inputAbilitaModifica = '';
	    	if (checkInputAbilitaModifica){
	    		inputAbilitaModifica = '<input type="checkbox" class="abilitaModifica" iden_esame="'+item.getIdenEsa()+'"  index="'+index+'" />';
	    	}else{
	    		inputAbilitaModifica = '<input type="checkbox" class="abilitaModifica" iden_esame="'+item.getIdenEsa()+'"  index="'+index+'" checked="checked" disabled="disabled"/>';
	    	}
	    	tmpTr+= utility_esami.creaTd(classTd,"idTdAbilita"+index,"10%",'',[inputAbilitaModifica]);	    	
	    	tmpTr+= utility_esami.creaTd(classTd,"idTdDescrEsame"+index,"30%",item.getDescrEsa()+" -- "+item.getIdenEsa());	  
	    	tmpTr+= utility_esami.creaTd(classTd,"idTdDestinatario"+index,"10%",item.getDestinatario());
	    	tmpTr+= utility_esami.creaTd(classTd,"idTdSito"+index,"10%",item.getSito());
	    	
//	    	var strutturaValue = '';
//	    	var inputStruttura = '';
//	    	var repartoValue = '';
//	    	var repartoText = '';
//	    	var inputReparto = '';
//	    	
//	    	if (item.getStruttura()=='' && item.getReparto()==''){
//	    		strutturaValue	= strutturaDefault;
//	    		repartoValue 	= repartoValueDefault;
//	    		repartoText		= repartoTextDefault;
//	    		inputStruttura 	= '<input type="radio" attr_input="struttura" name="StrutturaReparto'+index+'" id="str'+index+'" value="'+strutturaValue+'"  '+utility_esami.attributoDisable(valoreDisabledInput)+' />'; 
//		    	inputReparto 	= '<input type="radio" attr_input="reparto" name="StrutturaReparto'+index+'" id="rep'+index+'" value="'+repartoValue+'" '+utility_esami.attributoDisable(valoreDisabledInput)+' />';
//
//	    	}else{
//	    		if (item.getStruttura()!='' && item.getReparto()==''){
//		    		strutturaValue 	= item.getStruttura();
//		    		repartoValue 	= repartoValueDefault;
//		    		repartoText		= repartoTextDefault;
//		    		inputStruttura 	= '<input type="radio" attr_input="struttura" name="StrutturaReparto'+index+'" id="str'+index+'" value="'+strutturaValue+'" checked="checked" '+utility_esami.attributoDisable(valoreDisabledInput)+' />'; 
//			    	inputReparto 	= '<input type="radio" attr_input="reparto" name="StrutturaReparto'+index+'" id="rep'+index+'" value="'+repartoValue+'" '+utility_esami.attributoDisable(valoreDisabledInput)+' />';
//	    		
//	    		}else{
//		    		strutturaValue 	= strutturaDefault
//		    		repartoValue	= item.getReparto();
//		    		repartoText		= item.getRepartoDescr();
//		    		inputStruttura 	= '<input type="radio" attr_input="struttura" name="StrutturaReparto'+index+'" id="str'+index+'" value="'+strutturaValue+'"  '+utility_esami.attributoDisable(valoreDisabledInput)+' />'; 
//			    	inputReparto 	= '<input type="radio" attr_input="reparto" name="StrutturaReparto'+index+'" id="rep'+index+'" value="'+repartoValue+'" checked="checked"   '+utility_esami.attributoDisable(valoreDisabledInput)+' />';
//	    		}
//	    	}
//	    	
//	    	
//	    	var labelStruttura 	= utility_esami.creaLabel("str"+index,"",strutturaValue);   
//	    	var labelReparto 	= utility_esami.creaLabel("rep"+index,"",repartoText);	    	
//	    	
//	    	tmpTr+= utility_esami.creaTd(classTd,"idTdReparto"+index,"44%",'',[inputStruttura,labelStruttura,inputReparto,labelReparto]);
	    	var valore = '';
	    	if (item.getStruttura()=='' && item.getReparto()==''){
	    		valore='';
	    	}else{
	    		if ($('input[name="radTipologiaStrutturaReparti"]:checked').val()=='R'){
		    		if (item.getStruttura()!='' && item.getReparto()==''){
		    			valore = item.getStruttura();
		    		}else{
		    			valore = item.getRepartoDescr();
		    		}
	    		}else{
	    			valore = item.getStruttura();
	    		}
	    	}
	    	
	    	tmpTr+= utility_esami.creaTd(classTd,"idTdReparto"+index,"20%",valore);
	    	
	    	var inputUrgenza = '<input type="radio" name="urg'+index+'" id="idurg'+index+'" value="'+item.getUrgenza("valore")+'" checked="checked" '+utility_esami.attributoDisable(valoreDisabledInput)+' />';
	    	var labelUrgenza = utility_esami.creaLabel("idurg"+index,"",item.getUrgenza("testo"));
	    	tmpTr+= utility_esami.creaTd(classTd,"idTdUrgenza"+index,"5%",'',[inputUrgenza,labelUrgenza]);
	    	
	    	var checkedIncl = item.getInclEscl()=='S'?'checked="checked"':'';
	    	var checkedEscl = item.getInclEscl()=='N'?'checked="checked"':'';
	    	var inputincl = '<input type="radio" name="incl_escl'+index+'" id="idincludi'+index+'" value="S" '+checkedIncl+' '+utility_esami.attributoDisable(valoreDisabledInput)+' />';
			var labelincl = utility_esami.creaLabel("idincludi"+index,"","Includi");	
			var inputescl = '<input type="radio" name="incl_escl'+index+'" id="idescludi'+index+'" value="N" '+checkedEscl+' '+utility_esami.attributoDisable(valoreDisabledInput)+' />';
			var labelescl = utility_esami.creaLabel("idescludi"+index,"","Escludi");
			tmpTr+= utility_esami.creaTd(classTd,"idTdIncludi"+index,"5%",'',[inputincl,labelincl,inputescl,labelescl]);	    	
			tmpTr+= '</tr>';
			return tmpTr; 
		},
		
		attributoDisable:function(value){
			if (value=='disabled'){
				return 'disabled="disabled"';
			}else{
				return '';
			}
		}
		
}






















