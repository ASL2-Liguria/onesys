var _filtro_list_gruppo  	= null;
var _filtro_list_profili 	= null;
var _filtro_list_elenco  	= null;
var _filtro_list_scelti  	= null;
var _filtro_list_esa_pro  	= null;
var _filtro_elenco_esami  	= null;
var _ID_PROFILO 		 	= null;
var _POS_PROFILO	 	 	= null;
var _CDC_ACCESSO			= parent._PZ_CDC;
var _tipo  				 	= null;
var tipoRic				 	= '';

//do al pulsante chiudi la funzione corretta per la chiusura, dato che non so da dove deve aprirsi il configuratore dei profili
//$("#lblChiudi").attr("href","javascript:self.close();");

$(document).ready(function() {	
	
	NS_PAGINA.caricamento();	

});

var NS_PAGINA	= {
	
	caricamento : function(){
		
		NS_PAGINA.setEvents();
		NS_PAGINA.setStyle();
		NS_PROFILO.caricaProfiliElencoReparto();
		NS_PAGINA.showHideDettaglio('hide');
	
	},
	setEvents : function(){

		// Handler Ricerca Profili da Tasto Invio
		$('#txtRicercaProfilo').bind('keypress', function(e){
	        if(e.keyCode==13)
	        	NS_PROFILO.caricaProfiliElencoReparto();
		});
		
		// Handler Ricerca Esami da Abbinare a Profilo
		$('#txtEsamiRicerca').bind('keypress', function(e){
	        if(e.keyCode==13)
	        	NS_PROFILO.caricaEsamiElenco();
		});

		// Istanzio I Filtri Query
		NS_PROFILO.caricaFiltriQuery();
		
		// ONDBLCLICK Esami Selezionati del Profilo
		document.getElementById("lstEsamiScelti").ondblclick = function(){
			NS_PROFILO.add_elements('lstEsamiScelti', 'lstEsami', true);
			sortSelect('lstEsami');
		};
		
		// ONDBLCLICK Esami Elenco 
		document.getElementById("lstEsami").ondblclick = function(){
			NS_PROFILO.add_elements('lstEsami', 'lstEsamiScelti', true);
			sortSelect('lstEsamiScelti');
		};
		
		// ONDBLCLICK Elenco Profili Reparto
		document.getElementById("lstProfili").ondblclick = function(){
			NS_PROFILO.setDettaglioProfiloEsistente();
		};
		
		
	},
	
	setStyle : function(){
	
		// Normalizzo le Width
		$('[name="dati"]').css({'width': $('#body').width()});
		$('#fancybox-overlay').css({'width': $('#body').width()});
		
		// Set Style Listbox Scelta Esami #CEF1FF     -  98DC9A    -   F5DA81
		$('[name="lstEsami"]').css({'backgroundColor':'#F2F5A9','border':'2px solid #F4FA58'});
		$('[name="lstEsamiScelti"]').css({'backgroundColor':'#BCF5A9','border':'2px solid #04B404'});

		
	},
	
	showHideDettaglio : function(showHide){

		if(showHide == 'hide'){
			
			// [0] Nascondo La sezione
			var obj 	= $('#lblTitleDettaglioGruppo').closest('tr');
			obj.hide();
			$('table#groupElencoGruppi').next().hide();
			$('#groupDettaglioGruppo').hide();
			$('#groupDettaglioGruppo').next().hide();
			
			// [1] Svuolto Le listbox
			NS_UTILITY.svuotaListBox('lstEsami');
			NS_UTILITY.svuotaListBox('lstEsamiScelti');
			
			// [2] Azzero il Campo di Ricerca Testuale
			$('#txtEsamiRicerca').val('');
			
		}else{
			
			// [0] Mostro La sezione
			var obj 	= $('#lblTitleDettaglioGruppo').closest('tr');
			obj.show();
			$('#groupDettaglioGruppo').show();
			$('#groupDettaglioGruppo').next().show();
			
		}
		
	},
	chiudi : function(){
		
		parent.$.fancybox.close();
		
	}	
};

var NS_PROFILO 	= {
	
	caricaFiltriQuery : function(){	
		
		// [0] Caricato Profili Reparto
		_filtro_list_profili = new FILTRO_QUERY("lstProfili" , null);
		_filtro_list_profili.setDistinctQuery('S');
		_filtro_list_profili.setValueFieldQuery("COD_GRUPPO");
		_filtro_list_profili.setDescrFieldQuery("DESCR");
		_filtro_list_profili.setFromFieldQuery("RADSQL.TAB_ESA_GRUPPI");
		_filtro_list_profili.setOrderQuery("COD_GRUPPO ASC");
		
		// [1] Caricato Elenco Esami generico
		_filtro_elenco_esami = new FILTRO_QUERY("lstEsami", null);
		_filtro_elenco_esami.setValueFieldQuery("Iden||'$'||Cod_Dec");
		_filtro_elenco_esami.setDescrFieldQuery("Descsirm");
		_filtro_elenco_esami.setFromFieldQuery("Radsql.View_Esa_Range_Materiale");
		_filtro_elenco_esami.setGroupQuery("Iden,Cod_Dec,Descsirm");
		
		// [2] Caricato Elenco Esami Profili
		_filtro_list_esa_pro = new FILTRO_QUERY("lstEsamiScelti" , null);
		_filtro_list_esa_pro.setValueFieldQuery("E.Iden||'$'||E.Cod_Dec");
		_filtro_list_esa_pro.setDescrFieldQuery("E.Descsirm");
		_filtro_list_esa_pro.setFromFieldQuery("Radsql.View_Esa_Range_Materiale E Inner Join Radsql.tab_Esa_gruppi Teg on Teg.Iden_Esa = E.Iden");
		_filtro_list_esa_pro.setGroupQuery("E.Iden,E.Cod_Dec,E.Descsirm");

	},
	
	caricaProfiliElencoReparto : function(){
		
		var txtProfilo 	= document.getElementById('txtRicercaProfilo').value.toUpperCase();
		var whereCond	= " Sito = 'VISUALIZZA_PRO_LABO' And Reparto ='" + _CDC_ACCESSO + "'";

		if((txtProfilo != null) & (txtProfilo != ""))
			whereCond +=  " and Descr like '%" + txtProfilo + "%' ";
		
		_filtro_list_profili.searchListRefresh(whereCond,"RICERCA_ELENCO");
		
		return;
		
	},
	
	//Carica Elenco Esami Profilo
	caricaEsamiElencoProfilo :function(){
		
		var codProfilo 	= $('#txtProfilo').attr('cod_profilo');
		var whereCond	= " Teg.Sito = 'VISUALIZZA_PRO_LABO' AND Teg.Reparto ='" + _CDC_ACCESSO + "' AND Teg.Cod_Gruppo = '" + codProfilo + "' AND E.Iden = Teg.Iden_Esa ";

		_filtro_list_esa_pro.searchListRefresh(whereCond,"RICERCA_ELENCO");
		
		return;
	},
	
	// Carica Esami da Abbinare a Profilo
	caricaEsamiElenco : function(){
		
		var txtpresta 	= document.getElementById('txtEsamiRicerca').value.toUpperCase();
		var whereCond	= '';
		
		if((txtpresta != null) & (txtpresta != "")) { 
			whereCond += " Descsirm like '%" + txtpresta + "%'";
		}

		_filtro_elenco_esami.searchListRefresh(whereCond,"RICERCA_ELENCO");
		
	},
	
	// Valorizza Dettaglio Profilo
	setDettaglioProfiloEsistente : function(){
				
		var listProfiliReparto;
		var codProfilo; 
		var descrProfilo;	
		var numProfili;		
		
		listProfiliReparto = document.getElementById('lstProfili');
		
		numProfili = listProfiliReparto.length ;
			
		for (var i = 0; i<numProfili; i++)
		{				
			if (listProfiliReparto[i].selected)
			{					
				
				codProfilo		= listProfiliReparto.options(i).value;
				descrProfilo 	= listProfiliReparto.options(i).text;
				
				$('#txtProfilo').val(descrProfilo).attr('cod_profilo',codProfilo);
				NS_PROFILO.caricaEsamiElencoProfilo();

			}			
		}
		NS_PAGINA.showHideDettaglio('show');
	},
	
	inserisciNuovoProfilo : function(){

		// [0] Mostro La Sezione
		NS_PAGINA.showHideDettaglio('show');
		
		// [1] Svuoto le ListBox
		NS_UTILITY.svuotaListBox('lstEsami');
		NS_UTILITY.svuotaListBox('lstEsamiScelti');
		
		// [2] Valorizzo Descrizione e Azzero Codice Nuovo Profilo
		$('#txtProfilo').val($('#txtRicercaProfilo').val().toUpperCase()).attr('cod_profilo','');
	},
	
	registraProfilo : function(){
		
		var reparto			= _CDC_ACCESSO;
		var concatIdenEsa	= '';
		var descrNewprofilo	= $('#txtProfilo').val();
		var tipoOperazione	= '';
		var codNewProfilo 	= $('#txtProfilo').attr('cod_profilo');
		
		var listEsamiScelti = document.getElementById('lstEsamiScelti');
		
		for (var i=0; i<listEsamiScelti.length; i++)
		{
			concatIdenEsa	= concatIdenEsa != '' ? concatIdenEsa += ',' : concatIdenEsa;
			concatIdenEsa	+= listEsamiScelti[i].value;
		}
		
		// Definisco Cod_gruppo a Seconda di Modifica o Inserimento
		if( codNewProfilo == '' || codNewProfilo == null){
			// Inserimento
			tipoOperazione	= '0';
			codNewProfilo	= 'PRO_' + descrNewprofilo.replace(' ','_');
		}else{
			// Modifica
			tipoOperazione	= '1';
			codNewProfilo	= codNewProfilo;
		}
		
		// alert(' - Reparto: ' + reparto+ '\n - Descr Profilo: ' + descrNewprofilo + '\n - Cod New Profilo: ' + codNewProfilo + '\n - Concat iden Esa: ' + concatIdenEsa);

		var vResp = executeStatement("datiStrutturatiLabo.xml","manageProfilo",[reparto,codNewProfilo,descrNewprofilo,concatIdenEsa,tipoOperazione],0);

		if(vResp[0]=='KO'){
			return alert('Inserimento in Errore: \n' + vResp[1]);
		}else{
			
			if(tipoOperazione == 0){
				alert('Profilo Inserito Correttamente');
			}else{
				alert('Profilo Modificato Correttamente');
			}
			NS_PROFILO.caricaProfiliElencoReparto();
			NS_PAGINA.showHideDettaglio('hide');
		}
			
			
	},
	
	cancellaProfilo : function(){
		
		// Tipo Operazione 2 = Delete
		var tipoOperazione	= '2';
		var reparto			= _CDC_ACCESSO;
		var concatIdenEsa	= 'DEL';
		var codProToDelete	= '';
		var listProfiliReparto = document.getElementById('lstProfili');
		
		for (var i = 0; i<listProfiliReparto.length; i++)
		{				
			if (listProfiliReparto[i].selected)
			{			
				codProToDelete		= listProfiliReparto.options(i).value;
				// alert(' - Reparto : ' + reparto + '\n - Codice Profilo: ' + codProToDelete )
				var vResp	= executeStatement("datiStrutturatiLabo.xml","manageProfilo",[reparto,codProToDelete,'',concatIdenEsa,tipoOperazione],0);
				if(vResp[0]=='KO'){
					return alert('Inserimento in Errore: \n' + vResp[1]);
				}else{
					alert('Profilo Eliminato Correttamente');				
					NS_PROFILO.caricaProfiliElencoReparto();
				}
			}			
		}
	},
	
	// Ritorna nella Tabella di Scelta Esami o Profili
	reloadEsaProfili : function(){
		
		parent.$.fancybox.close();
		parent.location.reload();
		
	},
	
	// Sposta Esami Da Elenco a Scelti
	add_elements : function(elementoOrigine, elementoDestinazione, rimozione){
		
		var objectSource;
		var objectTarget;
		var valore_iden; 
		var valore_descr;	
		var num_elementi	= 0;
		var i				= 0;		
		
		objectSource = document.getElementById(elementoOrigine);
		objectTarget = document.getElementById(elementoDestinazione);

		if ((objectSource)&&(objectTarget))
		{			
			num_elementi = objectSource.length ;
			
			for (i=0; i<num_elementi; i++)
			{				
				if (objectSource[i].selected)
				{					
					valore_iden		= objectSource.options(i).value;
					valore_descr 	= objectSource.options(i).text;
					
					var oOption 	= document.createElement("Option");
					oOption.text 	= valore_descr;
					oOption.value 	= valore_iden;

					if (!NS_UTILITY.in_array(objectTarget, valore_iden)){	
						
						// Aggiungo Option Alla Destinazione
						objectTarget.add(oOption);
					
						// Rimuovo Elemento dalla Sorgente
						if (rimozione == true){
							remove_elem_by_id(elementoOrigine,i);
							i--;
							num_elementi--;
						}
						
					}else{
						alert('L\'esame Selezionato Risulta Inserito');
					}
				}			
			}
		}		
	}
		
};

var NS_UTILITY	= {
		
	in_array : function(thaArray, element){	

		var res	= false;	
		for(var e = 0; e<thaArray.length; e++){

			if(thaArray[e].value == element){
				res	= true;
				break;
			}
		}
		return res;
	},
	
	in_array_by_string : function(thaArray, element){	

		var res=false;
		var arr = thaArray.split(",");
		
		for(var i=0;i<arr.length;i++){
			//alert('arr[I].value: '+arr[i]+'\n\nelement: '+element);
			if(arr[i] == element){
				res=true;
				break;
			}
		}
		return res;
	},
	
	svuotaListBox : function(elemento){	
		
		var object;
		var indice;
		object = document.getElementById(elemento);
		
		if (object){
			indice = parseInt(object.length);
			while (indice>-1){
				object.options.remove(indice);
				indice--;
			}
		}
	}
};

function call_function_db(id, gruppo, descr, esa, iden_per, call_back){
		
		sql = "{call ? := GESTIONE_PROFILI_RICETTA('" + id + "','" + gruppo + "', '" + descr + "', '" + esa + "','"+iden_per+"') }";
		
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, call_back);
		dwr.engine.setAsync(true);
}