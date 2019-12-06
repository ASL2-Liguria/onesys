var _filtro_list_elenco_scelte 		= null;
var _filtro_list_elenco_esami		= null;
var _filtro_list_elenco_range		= null;
var _filtro_list_elenco_materiali	= null;
var _filtro_elenco_skip_click		= null;

var _USER						= opener.parent._USER_LOGIN;

var NS_PAGINA	= {
	
	caricamento : function(){
		
		NS_PRESTAZIONI.caricaEsamiSelezionati();
		NS_PAGINA.setEvents();
		NS_PAGINA.setStyle();
		
	},
	
	setEvents : function(){
		
		// ONDBLCLICK PrestazioniSelezionate
		document.getElementById("PrestazioniSelezionate").ondblclick = function(){
			NS_PRESTAZIONI.deleteOption('PrestazioniSelezionate');
		};
		
		// ONDBLCLICK PrestazioniElenco
		document.getElementById("PrestazioniElenco").ondblclick = function(){
			NS_PRESTAZIONI.prepareAddOption($(this));
		};
		
		// ONCONTEXTMENU PrestazioniSelezionate
		document.getElementById("PrestazioniSelezionate").oncontextmenu = function(){
			NS_PRESTAZIONI.deleteOption('PrestazioniSelezionate');
		};
		
		// ONCONTEXTMENU PrestazioniElenco
		document.getElementById("PrestazioniElenco").oncontextmenu = function(){
			NS_PRESTAZIONI.prepareAddOption($(this));
		};
		
		$('#txtRicercaPrestazione').focus();
			
		// Ricerca per Descr
		$('#txtRicercaPrestazione').bind('keypress', function(e) {
	        if(e.keyCode==13){
            	NS_PRESTAZIONI.caricaEsamiElenco();
	        }
		});
	
		// Ricerca per Codice
		$('#txtRicercaCodice').bind('keypress', function(e) {
	        if(e.keyCode==13){
            	NS_PRESTAZIONI.caricaEsamiElenco();
	        }
		});
		
	},
	
	setStyle : function(){
		
		// Nascondo Label Per Ricerca Esami
		$('#hDescr').parent().css('display','none');
		
		// Set Intestazione ListBox
		$('#lblPrestazioniElenco').parent().css({'width':'50%','height':'35px','font-size':'12px'});
		$('#lblPrestazioniElenco').css({'width':'250px','display':'block'});
		$('#lblPrestazioniSelezionate').parent().css({'width':'50%','height':'35px'});;
		$('#lblPrestazioniSelezionate').css({'width':'250px'});
		
		// Listbox Esami
		$('[name="PrestazioniElenco"]').css({'backgroundColor':'#F2F5A9','border':'2px solid #F4FA58'});
		$('[name="PrestazioniSelezionate"]').css({'backgroundColor':'#BCF5A9','border':'2px solid #04B404'});

		// Button Inserimento Nuovo Esame
		$('a#lblCreaEsame').closest('div').css({'width':'175px'});
		
		// Button Remove Esame
		var btnDeletePrestazione	= $("<div class='pulsante' style='width:175px;'><a id=lblDeleteEsame href='javascript:NS_PRESTAZIONI.deletePrestazione()'>Elimina Prestazione</a></div>");
		$('a#lblCreaEsame').closest('td').prev().html(btnDeletePrestazione);
		$('#lblDeleteEsame').closest('div').css({'visibility':'hidden'});
		
	},
	
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
		
		var res	= false;
		var arr = thaArray.split(",");
		
		for(var i=0;i<arr.length;i++){

			if(arr[i] == element){
				res	= true;
				break;
			}
		}
		return res;
	},
	
	openInserimentoEsame : function(){			
		
		// [1] Apro in unaNuova Pagina la Scelta delle Prestazioni
		$.fancybox({
			'padding'	: 3,
			'width'		: $(document).width()/10*9,
			'height'	: 175,
			'href'		: 'servletGenerator?KEY_LEGAME=ADD_PRESTAZIONE_DATI_STRUTTURATI',
			'type'		: 'iframe',
			'showCloseButton':false
		});
		
	},
	
	
	chiudi : function(){
		self.close();
	}	
	
};

var NS_PRESTAZIONI	= {
	
	iden_esa 	: '',
	cod_dec_esa : '',
	descr_esa 	: '',
	range_esa 	: '',
	mat_esa 	: '',
	descr_mat 	: '',
	iden_range 	: '',
	
	// Carica Esami Selezionati Precedentemente 
	caricaEsamiSelezionati : function(){
		
		var combo		= opener.$('.trPrestazione');		
		var whereCond	= '';
		var elenco		= '';
		
		combo.each(function(index){			
			elenco	=	elenco != '' ? elenco += ',' : elenco;
			elenco 		+= $(this).attr('iden_range');						
		});

		elenco	=	elenco == '' ? elenco = 0 : elenco;
		
		whereCond= 'Iden_Range In (' + elenco + ')';
	
		_filtro_list_elenco_scelte = new FILTRO_QUERY("PrestazioniSelezionate" , null);
		_filtro_list_elenco_scelte.setValueFieldQuery("Iden||'$'||Iden_Range||'$'||Cod_Dec||'$'||Descsirm||'$'||Range||'$'||Cod_Materiale||'$'||Materiale");
		_filtro_list_elenco_scelte.setDescrFieldQuery("Descsirm||'  Range: '|| Range ||'  Materiale: '||Materiale");
		_filtro_list_elenco_scelte.setFromFieldQuery("Radsql.View_Esa_Range_materiale");
		_filtro_list_elenco_scelte.setWhereBaseQuery(whereCond, null);
		_filtro_list_elenco_scelte.setOrderQuery("Descsirm Asc");
		_filtro_list_elenco_scelte.searchListRefresh();
		
	},
	// Carica Esami per la Scelta
	caricaEsamiElenco : function(){
		
		var txtpresta 	= $('#txtRicercaPrestazione').val().toUpperCase();
		
		if((txtpresta != null) & (txtpresta != "")) 
			var whereCond = " Descsirm like '%" + txtpresta + "%'";

		_filtro_list_elenco_esami = new FILTRO_QUERY("PrestazioniElenco", null);
		_filtro_list_elenco_esami.setValueFieldQuery("Cod_Dec||'@'||Iden||'$ESAME$'||Descsirm||'$'||Evenienze||'$'||Ute_Ins_Esa");
		_filtro_list_elenco_esami.setDescrFieldQuery("Descsirm");
		_filtro_list_elenco_esami.setFromFieldQuery("Radsql.View_Esa_Range_materiale");
		_filtro_list_elenco_esami.setGroupQuery("Cod_Dec,Descsirm,Evenienze,Iden,Ute_Ins_Esa");
		_filtro_list_elenco_esami.searchListRefresh(whereCond,"RICERCA_ELENCO",function(){
			
			// Rese Handler
			$('select[name="PrestazioniElenco"]').unbind('change');
			
			// Se Refresh ListBox Nascondo Button
			$('#lblDeleteEsame').closest('div').css({'visibility':'hidden'});
			
			// Set Event Click Option
			$('[name="PrestazioniElenco"] option').each(function(){															 
				if($(this).val().toString().lastIndexOf(_USER) > 1)
					$(this).css({'background-color':'#FAAC58'}).attr('PROV','INS_MANU');				
			});	
			
			// Set Backgound Esame Inserito Manualmente
			$('select[name="PrestazioniElenco"]').change(function(){
															
				if($(this).val().toString().lastIndexOf(_USER) > 1)
					$('#lblDeleteEsame').closest('div').css({'visibility':'visible'});
				else
					$('#lblDeleteEsame').closest('div').css({'visibility':'hidden'});
				
				
			});			
		});		
		
		NS_PRESTAZIONI.setIntestazioneListBoxEsami({'action':'init'});
		
	},
	
	prepareAddOption : function(obj){
				
		var situazione	= $(obj).val().toString().split('$')[1];
		var valore		= $(obj).val().toString().split('$')[0];
		var descrizione	= $(obj).val().toString().split('$')[2];
		var evenienze	= $(obj).val().toString().split('$')[3];
			
		switch (situazione)
		{
			case 'ESAME' :			

				// [0] Seleziono Range
				NS_PRESTAZIONI.cod_dec_esa 	= valore.split('@')[0];
				NS_PRESTAZIONI.iden_esa 	= valore.split('@')[1];
				NS_PRESTAZIONI.descr_esa 	= descrizione;
				NS_PRESTAZIONI.setIntestazioneListBoxEsami({'action':'setEsameScelto'});


				if(evenienze > 1){

					var vWhere	= " Cod_dec = '" + NS_PRESTAZIONI.cod_dec_esa + "' and Range Is Not Null" ;

					_filtro_list_elenco_range = new FILTRO_QUERY("PrestazioniElenco", null);
					_filtro_list_elenco_range.setValueFieldQuery("Range||'$RANGE$'||Range||'$'||Iden_Range");
					_filtro_list_elenco_range.setDescrFieldQuery("Range");
					_filtro_list_elenco_range.setFromFieldQuery("Radsql.View_Esa_Range_materiale");
					_filtro_list_elenco_range.setGroupQuery("Range,Iden_Range");					
					_filtro_list_elenco_range.searchListRefresh(vWhere,"RICERCA_RANGE", function()
					{				
						if(document.getElementById("PrestazioniElenco").length < 1)
							NS_PRESTAZIONI.addSelectedOption();																		 
					});
					
				}else
					NS_PRESTAZIONI.skipOptionClick();
					
				break;
			
			case 'RANGE' :
				
				// [1] Seleziono i Materiali
				NS_PRESTAZIONI.range_esa	= valore;
				NS_PRESTAZIONI.setIntestazioneListBoxEsami({'action':'setRangeScelto'});
	
				var vWhere	= " Cod_Dec = '" + NS_PRESTAZIONI.cod_dec_esa + "' and Range = '" + NS_PRESTAZIONI.range_esa + "'" ;

				_filtro_list_elenco_materiali = new FILTRO_QUERY("PrestazioniElenco", null);
				_filtro_list_elenco_materiali.setValueFieldQuery("Cod_Materiale||'@'||Iden_Range||'$MATERIALE$'||Materiale||'$'||Iden_Range");
				_filtro_list_elenco_materiali.setDescrFieldQuery("Materiale");
				_filtro_list_elenco_materiali.setFromFieldQuery("Radsql.View_Esa_Range_materiale");
				_filtro_list_elenco_materiali.setGroupQuery("Cod_Materiale,Materiale,Iden_Range");				
				_filtro_list_elenco_materiali.searchListRefresh(vWhere,"RICERCA_RANGE" , function()
				{			
					if(document.getElementById("PrestazioniElenco").length < 1)
						NS_PRESTAZIONI.addSelectedOption();												 
				});
				break;
				
			case 'MATERIALE' :

				// [2] Preparo La Selezione dell'Esame
				NS_PRESTAZIONI.descr_mat 	= descrizione;
				NS_PRESTAZIONI.mat_esa 		= valore.split('@')[0];
				NS_PRESTAZIONI.iden_range 	= valore.split('@')[1];
				
				NS_PRESTAZIONI.setIntestazioneListBoxEsami({'action':'setMaterialeScelto'});
				/*
				if(_USER = 'arry')
					alert('Alert Solo Per ' + _USER + '\n - Iden Esa: ' +  NS_PRESTAZIONI.iden_esa + '\n - Descr Esa: ' +  NS_PRESTAZIONI.descr_esa + '\n - Cod Mat: ' + NS_PRESTAZIONI.mat_esa + '\n - Descr Mat: ' + NS_PRESTAZIONI.descr_mat + '\n - Range: ' + NS_PRESTAZIONI.range_esa + '\n - Iden Range: ' + NS_PRESTAZIONI.iden_range );
				*/		
				NS_PRESTAZIONI.addSelectedOption();
				NS_PRESTAZIONI.caricaEsamiElenco();
				break;
		}
		
		// Se Refresh ListBox Nascondo Button
		$('#lblDeleteEsame').closest('div').css({'visibility':'hidden'});		

	},
	
	skipOptionClick : function(){
	
		var whereCond = " Cod_Dec = '"+ NS_PRESTAZIONI.cod_dec_esa + "'";

		_filtro_elenco_skip_click = new FILTRO_QUERY("PrestazioniElenco", null);
		_filtro_elenco_skip_click.setValueFieldQuery("Iden||'$'||Cod_Dec||'$'||Descsirm||'$'||Range||'$'||Cod_Materiale||'$'||Materiale||'$'||iden_Range");
		_filtro_elenco_skip_click.setDescrFieldQuery("Descsirm");
		_filtro_elenco_skip_click.setFromFieldQuery("Radsql.View_Esa_Range_Materiale");
		_filtro_elenco_skip_click.setGroupQuery("Iden,Cod_Dec,Descsirm,Range,Cod_Materiale,Materiale,Iden_Range");
		_filtro_elenco_skip_click.searchListRefresh(whereCond,'RICERCA_ELENCO',function(){

			var objectSource	= document.getElementById('PrestazioniElenco');
			if(objectSource.length > 0){
							
				for (i=0; i<objectSource.length; i++)
				{	
					NS_PRESTAZIONI.iden_esa 	= objectSource[i].value.split('$')[0];
					NS_PRESTAZIONIcod_dec_esa 	= objectSource[i].value.split('$')[1];
					NS_PRESTAZIONI.descr_esa 	= objectSource[i].value.split('$')[2];
					NS_PRESTAZIONI.range_esa 	= objectSource[i].value.split('$')[3];
					NS_PRESTAZIONI.mat_esa 		= objectSource[i].value.split('$')[4];
					NS_PRESTAZIONI.descr_mat 	= objectSource[i].value.split('$')[5];
					NS_PRESTAZIONI.iden_range 	= objectSource[i].value.split('$')[6];
					NS_PRESTAZIONI.addSelectedOption();
					NS_PRESTAZIONI.caricaEsamiElenco();
				}
			}
		
		});		
		
	},

	addSelectedOption : function(){
		
		/*
			iden_esa 	: '',
			cod_dec_esa : '',
			descr_esa 	: '',
			range_esa 	: '',
			mat_esa 	: '',
			descr_mat 	: '',
			iden_range 	: '',
			
			// In Base Alle INFO Disponibili per Un Esame ne Creo la Select
			// Le INFO Sono salvate Nelle proprietà di NS_PRESTAZIONI Con La Struttura di Cui Sopra
		*/

		var objectTarget 	= document.getElementById('PrestazioniSelezionate');
		var optionSelected 	= document.createElement("Option");
		var optionText		= NS_PRESTAZIONI.descr_esa + ' ';
		var optionVal		= NS_PRESTAZIONI.iden_esa + '$' + NS_PRESTAZIONI.iden_range + '$' + NS_PRESTAZIONI.cod_dec_esa + '$' + NS_PRESTAZIONI.descr_esa + '$';
		
		if(typeof NS_PRESTAZIONI.range_esa != 'undefined'){
			
			optionText		+= '  Range: ' + NS_PRESTAZIONI.range_esa;
			optionVal		+= NS_PRESTAZIONI.range_esa + '$';
			
			if(typeof NS_PRESTAZIONI.mat_esa != 'undefined'){
				
				optionText		+= '  Materiale: ' + NS_PRESTAZIONI.descr_mat;
				optionVal		+= NS_PRESTAZIONI.mat_esa + '$' + NS_PRESTAZIONI.descr_mat;
			
			}
		}
		/*
		if(_USER = 'arry')
			alert(' Alert Solo per ' + _USER + '\n - Valore New Option: ' + optionVal + '\n - text New Option: ' + optionText);
		*/
		optionSelected.text 	= optionText;
		optionSelected.value 	= optionVal;
		
		if (!NS_PAGINA.in_array(objectTarget, optionSelected.value)){	
			objectTarget.add(optionSelected);
			NS_PRESTAZIONI.resetEsame();
		}else{
			NS_PRESTAZIONI.resetEsame();			
			NS_PRESTAZIONI.caricaEsamiElenco();
			alert('L\'esame Selezionato Risulta Inserito');			
		}		
		
	},	
	
	// Gestione Intestazione ListBox per Selezioni Complesse
	setIntestazioneListBoxEsami : function(obj){
		
		if(obj.action == 'init'){
	
			var divDettaglioPrestazione 	= $('<div></div>');
			var lblIntestazioneDettaglio	= $('<label></label>');
			
			$('.divDettaglioIntestazione').remove();
			$('#lblPrestazioniElenco').text('Elenco Esami Richiedibili');
			
			divDettaglioPrestazione.css({'height':'25px','border':'1px solid #6aa8f2','background-color':'#daf5fe','line-height':'25px','margin-bottom':'2px'}).addClass('divDettaglioIntestazione');			
			lblIntestazioneDettaglio.addClass('lblIntestazione').css({'font-size':'12px','font-weight':'bold','padding-left':'4px'}).text('Dettaglio Selezione');
						
			divDettaglioPrestazione.append(lblIntestazioneDettaglio);		
			$("[name='PrestazioniElenco']").css({'height':'228px'});
			$("[name='PrestazioniElenco']").parent().prepend(divDettaglioPrestazione);
			
		}else if(obj.action == 'setEsameScelto'){
		
			var lblDescrEsame	= $('<label></label>');
			lblDescrEsame.css({'border':'1px solid #FF8000','background-color':'#FFBF00','padding':'2px','margin-left':'5px'});
			lblDescrEsame.text(NS_PRESTAZIONI.descr_esa);
			
			$('.divDettaglioIntestazione').append(lblDescrEsame);			
			$('#lblPrestazioniElenco').text('Elenco Range Disponibili');
			
		}else if(obj.action == 'setRangeScelto'){
			
			var lblDescrRange	= $('<label></label>');
			lblDescrRange.css({'border':'1px solid #0B610B','background-color':'#04B404','padding':'2px','margin-left':'5px'});
			lblDescrRange.text(NS_PRESTAZIONI.range_esa);
			
			$('.divDettaglioIntestazione').append(lblDescrRange);			
			$('#lblPrestazioniElenco').text('Elenco Materiali Disponibili');
			
		}else if(obj.action == 'setMaterialeScelto'){
			
			var lblDescrMat	= $('<label></label>');
			lblDescrMat.css({'border':'1px solid #FFBF00','background-color':'#F7FE2E','padding':'2px','margin-left':'5px'});
			lblDescrMat.text(NS_PRESTAZIONI.descr_mat);
			
			$('.divDettaglioIntestazione').append(lblDescrMat);			
			$('#lblPrestazioniElenco').text('Elenco Esami Disponibili');
			
		}
	},
	

	// Remove Option From Selected
	deleteOption : function(elementoOrigine){
	
		var objectSource;
		var valore_iden; 
		var valore_descr;	
		var num_elementi	= 0;
		var i				= 0;	
		
		objectSource 		= document.getElementById(elementoOrigine);
		num_elementi 		= objectSource.length ;
		
		for (i=0; i<num_elementi; i++)
		{				
			if (objectSource[i].selected)
			{	
				remove_elem_by_id(elementoOrigine,i);
				i--;
				num_elementi--;					
			}			
		}
	
	},
	// Reset Impostazioni Add Option Selected
	resetEsame : function(){

		// NS_UTILITY.svuotaListBox(document.getElementById('PrestazioniElenco'));
		
		// Cancello Dettaglio Selezione
		$("div.divDettaglioIntestazione label:gt(0)").remove();
		
		// Reset Valore Oggetto
		NS_PRESTAZIONI.iden_esa 	= '';
		NS_PRESTAZIONI.cod_dec_esa 	= '';
		NS_PRESTAZIONI.iden_range 	= '';
		NS_PRESTAZIONI.descr_esa 	= '';
		NS_PRESTAZIONI.range_esa 	= '';
		NS_PRESTAZIONI.mat_esa 		= '';
		NS_PRESTAZIONI.descr_mat 	= '';

		$('#txtRicercaPrestazione').focus();
	},
	
	riportaSelezionati : function(){
		
		var lstSelezionati		= document.getElementById("PrestazioniSelezionate");
		var lstScelti			= window.opener.$(".trPrestazione");
		var arGiaScelti			= '';
		var arraySelezionati	= '';				
		var arrayNuovi			= '';
		
		var objCreaTR			= {};
		
		// [1] Recupero Gli Attributi degli Esami Selezionati Precedentemente
		lstScelti.each(function(){	
			arGiaScelti		=	arGiaScelti != '' ? arGiaScelti += ',' : arGiaScelti;
			arGiaScelti 	+= $(this).attr("iden_range");
		});

		// [2] Ciclo gli Esami Selezionati LISTBOX selezionati;
		for (var i = 0; i < lstSelezionati.length; i++)
		{	
			// [3] Concateno Esami Selezionati
			arraySelezionati	= arraySelezionati != '' ? arraySelezionati += ',' : arraySelezionati;
			arraySelezionati 	+= lstSelezionati[i].value.split('$')[1];
			
			// [4] Verifico Se L'esame è già stato selezionato precedentemente
			var idenRangeOpt	= lstSelezionati[i].value.split('$')[1];
			// [5] Se Esame Gia Presente in uelli Selezionati Precedentemente non Aggiungo Riga
			if (!NS_PAGINA.in_array_by_string(arGiaScelti, idenRangeOpt))
			{				
				var arObjCreaTR	= lstSelezionati[i].value.split('$');
				objCreaTR['IDEN']			= arObjCreaTR[0];
				objCreaTR['IDEN_ESA_RANGE']	= arObjCreaTR[1];
				objCreaTR['COD_DEC']		= arObjCreaTR[2];
				objCreaTR['DESCR']			= arObjCreaTR[3];
				objCreaTR['RANGE']			= arObjCreaTR[4];
				objCreaTR['MATERIALE']		= arObjCreaTR[6];
				objCreaTR['COD_MAT']		= arObjCreaTR[5];
				
				window.opener.NS_PAGINA.ELENCO_ESAMI.addEsame(objCreaTR);
				arrayNuovi += lstSelezionati[i].value + ",";
			}
		}
		
		// [6] Processo gli Esami "Gia Scelti". Quelli che non corrispondo a quelli selezionati li tolgo
		lstScelti.each(function(){
			if(!NS_PAGINA.in_array_by_string(arraySelezionati, $(this).attr("iden_range")))
				window.opener.NS_PAGINA.ELENCO_ESAMI.removeEsame($(this).attr("iden_range"));			
		});
		
		self.close();
	},
	
	// Elimina gli Esami Inseriti Manualmente
	deletePrestazione : function(){

		var objectSource;
		var idenEsa; 
		var valore_descr;	
		var num_elementi	= 0;
		var i				= 0;	
		
		objectSource 		= document.getElementById('PrestazioniElenco');
		num_elementi 		= objectSource.length ;
		
		for (i=0; i<num_elementi; i++){				
		
			if (objectSource[i].selected)
				idenEsa	= objectSource[i].value.split('$')[0].split('@')[1];					
						
		}
		
		if(isNaN(idenEsa)){
			alert('Prego Selezionare una Prestazione');
			return;
		}
		vResp	= opener.parent.executeStatement("datiStrutturatiLabo.xml","deletePrestazione",[idenEsa,_USER],1)

		if(vResp[0]=='KO')
			alert('Inserimento in Errore: \n' + vResp[1]);
		else{

			switch(vResp[2]){
				case '0' :
					alert('L\' Esame Selezionato Non e\' Stato Inserito Manualemte Pertanto NON Può Essere Rimosso');
					break;
				case '1' :
					alert('L\'Esame Selezionato Aveva Riferimenti di Sistema. Le Opzioni Inserite Manualemte dall\' Utente ' + _USER + ' Sono State Rimosse Successo ')
					break;
				case '2' :
					alert('La Prestazione Selezionata, Inserita Manualmente e\' Stata Rimossa con Successo');
					break;
			}
		}
		
		// Hide Button
		$('#lblDeleteEsame').closest('div').css({'visibility':'hidden'});
		
		// Refresh ListBox
		NS_PRESTAZIONI.caricaEsamiElenco();
		
		
	}
	
};

var NS_UTILITY	= {
	
	svuotaListBox : function(elemento){
				
		var object;
		var indice;
		
		if (typeof elemento == 'String'){		
			object = document.getElementById(elemento);
		}else{
			object = elemento;
		}
		
		indice = parseInt(object.length);

		if(indice > 0){
			if (object){				
				while (indice>-1){
					object.options.remove(indice);
					indice--;
				}
			}
		}
	}
};

jQuery(document).ready(function() {	
	
	NS_PAGINA.caricamento();

});