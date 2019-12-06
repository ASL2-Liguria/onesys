var _filtro_list_elenco_scelte 	= null;
var _filtro_list_elenco 		= null;

/*
var _USER						= top.baseUser.LOGIN;
var _USER_TIPO					= top.baseUser.TIPO;
var _USER_IDEN					= top.baseUser.IDEN_PER;*/
// var _PZ_CDC						= top.getAccesso('COD_CDC');
var _PZ_CDC						= parent._V_DATI.reparto;



jQuery(document).ready(function() {	
	NS_PAGINA.caricamento();
	NS_PAGINA.setEvents();
});

var NS_PAGINA	= {
	
	caricamento : function(){
                
            	if (typeof parent.$('#provChiamata')!='undefined' && parent.$('#provChiamata').val() =='MMG'){
                    $('#body').addClass('bodyMMG');
		}
            
		NS_PAGINA.setStyle();
		NS_PRESTAZIONI.carica(); 
	},
	
	setEvents : function(){
              
		// ONDBLCLICK EsamiElenco                
                $('[name="EsamiElenco"]').dblclick(function() {
                    NS_PRESTAZIONI.add_elements('EsamiElenco', 'EsamiSelezionati', true);
                    sortSelect('EsamiSelezionati');
		});
		// ONDBLCLICK EsamiSelezionati
                $('[name="EsamiSelezionati"]').dblclick(function() {
			NS_PRESTAZIONI.add_elements('EsamiSelezionati', 'EsamiElenco', true);
			sortSelect('EsamiElenco');
		});
		
		// ONCONTEXTMENU EsamiSelezionati
		$('[name="EsamiSelezionati"]').bind("contextmenu",function(e){
			NS_PRESTAZIONI.add_elements('EsamiSelezionati', 'EsamiElenco', true);
			sortSelect('EsamiElenco');
		}); 
		
		// ONCONTEXTMENU EsamiElenco
		$('[name="EsamiElenco"]').bind("contextmenu",function(e){
			NS_PRESTAZIONI.add_elements('EsamiElenco', 'EsamiSelezionati', true);
			sortSelect('EsamiSelezionati');
		}); 
		
		$('#txtRicercaPrestazione').focus();
			
		// Heandler Ricerca da Invio
		$('#txtRicercaEsami').bind('keypress', function(e) {
	        if(e.keyCode==13)
                    NS_PRESTAZIONI.caricaEsamiElenco();	        
		});
		
		// Heandler Ricerca Da Button
		$("#lblRicerca").parent().click(function(){
			NS_PRESTAZIONI.caricaEsamiElenco();
		});
		
		// Nascondo Label Per Ricerca Esami
		$('#hDescr').parent().css('display','none');		
		
	},
	
	setStyle : function(){
		
		// Set Intestazione ListBox
		$('#lblEsamiElenco').parent().css({'width':'50%','height':'35px','font-size':'12px'});
		$('#lblEsamiElenco').css({'width':'250px','display':'block'});
		$('#lblEsamiSelezionati').parent().css({'width':'50%','height':'35px'});;
		$('#lblEsamiSelezionati').css({'width':'250px'});
		
		// Normalizzo le Width
		$('[name="dati"]').css({'width': $('#body').width()});
		$('#fancybox-overlay').css({'width': $('#body').width()});
		
		$('[name="EsamiElenco"]').css({'backgroundColor':'#F2F5A9','border':'2px solid #F4FA58'});
		$('[name="EsamiSelezionati"]').css({'backgroundColor':'#BCF5A9','border':'2px solid #04B404'});
	
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

		var res=false;
		var arr = thaArray.split(",");
		
		for(var i=0;i<arr.length;i++){

			if(arr[i] == element){
				res=true;
				break;
			}
		}
		return res;
	},
	
	creaNuovoProfilo : function(){			
		
		$.fancybox({
			'padding'	: 3,
			'width'		: $(document).width()/10*9,
			'height'	: $(document).height()/10*9,
			'href'		: 'servletGenerator?KEY_LEGAME=CONFIGURAZIONE_PROFILI_DATI_STRUTTURATI&REPARTO=' + _PZ_CDC,
			'type'		: 'iframe',
			'showCloseButton':false
		});

	},
	
	chiudi : function(){
		parent.$.fancybox.close();
	}	
	
};

var NS_PRESTAZIONI	= {
	
	// Carica Esami Selezionati Precedentemente 
	carica : function(){

		var combo		= parent.$('#hEsamiFiltro').val();
		combo			= combo.split(',');
		var whereCond	= '';
		var elenco		= '';
		
		// Ciclo INPUT HIDDEN per Cod_Esa
		for(var i = 0; i < combo.length; i++){
			elenco	= elenco != '' ? elenco += ',' : elenco;
			elenco	+= "'" + combo[i] + "'";
		}

		// elenco	=	elenco == '' ? elenco = 0 : elenco;		
		whereCond	= " branca='L' AND COD_ESA LIKE 'E%' and attivo='S' and Cod_Esa In (" + elenco + ")";
		// Le query Vengono Effettuae sulla nuova Tabella che Detiene anche le informazionisui Range e i Materiali di Riferimento
		_filtro_list_elenco_scelte = new FILTRO_QUERY("EsamiSelezionati" , null);
		_filtro_list_elenco_scelte.setValueFieldQuery("Cod_Esa");
		_filtro_list_elenco_scelte.setDescrFieldQuery("Descsirm");
		_filtro_list_elenco_scelte.setFromFieldQuery("Radsql.tab_esa");
		_filtro_list_elenco_scelte.setWhereBaseQuery(whereCond, null);
		_filtro_list_elenco_scelte.setGroupQuery("Cod_Esa,Descsirm");

		_filtro_list_elenco_scelte.searchListRefresh();

		whereCond2	= " branca='L' AND COD_ESA LIKE 'E%' and attivo='S' ";
		_filtro_list_elenco = new FILTRO_QUERY("EsamiElenco", null);
		_filtro_list_elenco.setValueFieldQuery("Cod_Esa");
		_filtro_list_elenco.setDescrFieldQuery("Descsirm");
		_filtro_list_elenco.setFromFieldQuery("Radsql.tab_esa");
		_filtro_list_elenco.setWhereBaseQuery(whereCond2, null);
		_filtro_list_elenco.setGroupQuery("Cod_Esa,Descsirm");
	},
	
	// Carica Esami per la Scelta
	caricaEsamiElenco : function(){

		var txtpresta = document.getElementById('txtRicercaEsami').value.toUpperCase();
		var whereCond = '';
	
		if((txtpresta != null) & (txtpresta != ""))
			whereCond += " UPPER(Descsirm) like '%" + txtpresta + "%'";		

		_filtro_list_elenco.searchListRefresh(whereCond,"RICERCA_ELENCO");
               
		
	},
	
	add_elements : function(elementoOrigine, elementoDestinazione, rimozione){

                $obj = $('[name="'+elementoOrigine+'"]');                       
                $obj.find('option:selected').clone().appendTo('[name="'+elementoDestinazione+'"]');
                $obj.find('option:selected').remove();
		/*
		var objectSource;	
                var objectTarget;
                var valore_iden; 
		var valore_descr;	
		var num_elementi	= 0;
		var i				= 0;		
		
		
                objectSource = document.getElementsByName(elementoOrigine)[0];
		objectTarget = document.getElementsByName(elementoDestinazione)[0];
                
		if ( typeof objectSource!='undefined' && typeof objectTarget!='undefined')
		{

			//num_elementi = objectSource.length ;

                
                        /*for (i=0; i<num_elementi; i++)
			{	
				if (objectSource[i].selected)
				{	
					valore_iden     = objectSource[i].value;
					valore_descr 	= objectSource[i].text;
					var oOption 	= document.createElement("Option");
					oOption.text 	= valore_descr;
					oOption.value 	= valore_iden;
					if (!NS_PAGINA.in_array(objectTarget, valore_iden)){	

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
		}*/		
	},
	
	riportaSelezionati : function(){
		var lstSelezionati			= document.getElementsByName("EsamiSelezionati")[0];
		var arraySelezionati		= '';				
		var arraySelezionatiRange	= '';
		var arraySelezionatiTxt		= '';
              
		for (var i = 0; i < lstSelezionati.length; i++)
		{	
			// [3] Concateno Esami Selezionati - Salvo anche l'iden della Tabella Nuova per effettuare una Seleziona al caricamento + precisa
			arraySelezionati		= arraySelezionati != '' ? arraySelezionati += ',' : arraySelezionati;
			arraySelezionatiRange	= arraySelezionatiRange != '' ? arraySelezionatiRange += ',' : arraySelezionatiRange;
			
			arraySelezionati 		+= lstSelezionati[i].value.split('$')[0];
			arraySelezionatiRange 	+= lstSelezionati[i].value.split('$')[1];
			
			arraySelezionatiTxt	= arraySelezionatiTxt != '' ? arraySelezionatiTxt += ', ' : arraySelezionatiTxt;
			arraySelezionatiTxt += lstSelezionati[i].text;
		}

		parent.$('#hEsamiFiltro').val(arraySelezionati);
		parent.$('#hEsamiFiltroRange').val(arraySelezionatiRange);
		
		if(arraySelezionatiTxt != '')
			parent.$('#lblSceltaEsamiProfili').addClass('esamiSelezionatiTrue');
		else
			parent.$('#lblSceltaEsamiProfili').removeClass('esamiSelezionatiTrue');
		
		parent.$('#lblSceltaEsamiProfili').attr('title',arraySelezionatiTxt);
		parent.$.fancybox.close();

	}
	
};

var NS_PROFILI = {
	
	scegliEsamiProfilo : function(codprofilo){
		
		//alert('[0] Scegli Profilo Codice: ' + codprofilo);
		var lst_dest 	= document.getElementById('ProfiliElenco'); 
		var sql			= "Select Te.Cod_Esa, Te.Descsirm FROM Radsql.Tab_Esa_Gruppi Teg Inner Join Radsql.Tab_Esa Te ON Te.Iden = Teg.Iden_Esa Where Teg.Cod_Gruppo = '" + codprofilo + "'";
		
		//alert('[0] Scegli Profilo sql: ' + sql);
		dwr.engine.setAsync(false);		
		toolKitDB.getListResultData(sql, NS_PROFILI.creaOptEsami);
		dwr.engine.setAsync(true);
		
	},

	creaOptEsami : function(elenco){
		
		var Listbox	= document.getElementsByName('EsamiSelezionati')[0];
		arrayOpt	= new Array();

		for (var i=0;i<elenco.length; i++){
		
			var oOption = document.createElement("Option");
			oOption.text = elenco[i][1];
			oOption.value = elenco[i][0];			
			if (!NS_PAGINA.in_array(Listbox, oOption.value)){
				Listbox.add(oOption);
			}
			
		}
		
	}
};

function scegliEsamiProfilo(codprofilo){

	NS_PROFILI.scegliEsamiProfilo(codprofilo);
}
