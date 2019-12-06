var sceltaRapida='';
var readOnly = (new RegExp("^(s|true|on|)$", "i").test($('form[name=EXTERN] input[name=READONLY]').val() || 'N'));

jQuery(document).ready(function(){
	window.WindowCartella = window;
	while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
		window.WindowCartella = window.WindowCartella.parent;
	}
	window.baseReparti = WindowCartella.baseReparti;
	window.baseGlobal = WindowCartella.baseGlobal;
	window.basePC = WindowCartella.basePC;
	window.baseUser = WindowCartella.baseUser;

	try {
		SCELTA_PATOLOGIE.init();
		SCELTA_PATOLOGIE.setEvents();
	} catch(e) {
		alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
	}
});
var _filtro_list_elenco = null;
var indiceMax =0;

var SCELTA_PATOLOGIE = {
		
	init : function(){
		SCELTA_PATOLOGIE.LoadPatoScelte();
	//	SCELTA_PATOLOGIE.RicercaPatologie("", "", true);
		SCELTA_PATOLOGIE.caricaProfili();
		
		var selectSel=$('SELECT[name="PatologieSelezionate"]').width(1000).css({'height':'1000'});
		var divSel = $('<div/>').attr('id', 'divSel').css({'overflow-x':'scroll','overflow-y':'scroll','height':'300px'}).width(500);
		selectSel.parent().append(divSel);
		selectSel.remove();
		$('#divSel').append(selectSel);
		
		var selectSel=$('SELECT[name="PatologieElenco"]').width(1000).css({'height':'100%'});
		var divSel = $('<div/>').attr('id', 'divDaSel').css({'overflow-x':'scroll','overflow-y':'scroll','height':'300px'}).width(500);
		selectSel.parent().append(divSel);
		selectSel.remove();
		$('#divDaSel').append(selectSel);
		
	},
	
	setEvents: function() {
		if (readOnly) {
			$("#lblRicerca, #lblRegistra").parent().parent().hide();
		} else {
			document.getElementById("PatologieElenco").ondblclick=function(){
				add_selected_elements( 'PatologieElenco', 'PatologieSelezionate',true);sortSelect('PatologieSelezionate');
			};
			
			document.getElementById("PatologieSelezionate").ondblclick=function(){
				add_selected_elements( 'PatologieSelezionate', 'PatologieElenco',true);sortSelect('PatologieElenco');
			};
			
			$('#txtRicercaPatologie').bind('keypress', function(e) {
		        if(e.keyCode==13){
		        	SCELTA_PATOLOGIE.RicercaPatologie(document.dati.txtRicercaPatologie.value,document.dati.txtRicercaCodice.value,false);
		        }
			});
			
			$('#txtRicercaCodice').bind('keypress', function(e) {
		        if(e.keyCode==13){
		        	SCELTA_PATOLOGIE.RicercaPatologie(document.dati.txtRicercaPatologie.value,document.dati.txtRicercaCodice.value,false);
		        }
			});
			
			// Callback di registrazione
			document.body['ok_registra'] = function() {
				SCELTA_PATOLOGIE.chiudiScheda();
			};
			
			$('#txtRicercaPatologie').focus();
		}
	},
	
	RicercaPatologie: function(txtDescr,txtCodice,flgTutte){
		var whereCond=" ATTIVO= 'S' AND DESCR_PATO<>'...' ";
		if (!flgTutte){
			if((txtDescr != null) & (txtDescr != "")) { whereCond += " AND UPPER(DESCR_PATO) like UPPER('%"+txtDescr+"%')";}
			if((txtCodice != null) & (txtCodice != "")) { whereCond += " AND UPPER(COD_PATO) like UPPER('"+txtCodice+"%')";}
		}
		
		_filtro_list_elenco = new FILTRO_QUERY("PatologieElenco", null);
		_filtro_list_elenco.setValueFieldQuery("COD_PATO");  
		_filtro_list_elenco.setDescrFieldQuery("COD_PATO ||' - '|| DESCR_PATO");
		_filtro_list_elenco.setFromFieldQuery("radsql.VIEW_CC_PATOLOGIE");
		_filtro_list_elenco.setWhereBaseQuery(whereCond, "RICERCA_PATOLOGIE");
		_filtro_list_elenco.setOrderQuery("DESCR_PATO ASC");
		_filtro_list_elenco.searchListRefresh('','',function(){			
			var l=$('SELECT[name="PatologieElenco"] option').length;
			$('SELECT[name="PatologieElenco"]').css({'height':20+(l*15)});
			
			if(sceltaRapida!=''){
		  		$("SELECT[name='PatologieElenco']").val(sceltaRapida);
				add_selected_elements( 'PatologieElenco', 'PatologieSelezionate',true);sortSelect('PatologieSelezionate');
			sceltaRapida='';	
			}
			
		});
	},
	
	RiportaPatoSelezionate: function(){
		var lst_source=document.getElementById("PatologieSelezionate");
		var arrayScelti = [];
		var arrayPresenti = [];
		var lst_scelti="";
		var arrayNuovi = [];
		var arrayPatologie = [];
		
		// patologie già scelte nella opener
		lst_scelti=parent.jQuery(".patologieScelte");
		// le patologie già scelte vengono messe in arrayPresenti
		lst_scelti.each(function(){
			arrayPresenti.push($(this).attr("valore"));
		});
		// ciclo le patologie selezionate 
		var j=0;
		if (indiceMax==0){j=0;} else {j=1;}
		for (var i=0; i<lst_source.length;i++){	
			arrayScelti.push(lst_source[i].value);
			arrayPatologie.push(lst_source[i].value+'$'+lst_source[i].innerText);
			if($.inArray(lst_source[i].value, arrayPresenti) === -1){
                //parent.NS_ANAMNESI      === undefined ? null : parent.NS_ANAMNESI.aggiungiRigaPato(parseInt(indiceMax)+parseInt(j),lst_source[i].value,lst_source[i].text,"","");
                parent.NS_36_SETTIMANA  === undefined ? null : parent.NS_36_SETTIMANA.aggiungiRigaPato(parseInt(indiceMax)+parseInt(j),lst_source[i].value,lst_source[i].text,"","");
                parent.DAYSURGERY       === undefined ? null : parent.DAYSURGERY.aggiungiRigaPato(parseInt(indiceMax)+parseInt(j),lst_source[i].value,lst_source[i].text,"","");
				arrayNuovi.push(lst_source[i].value);
				j+=1;
			}
		}
		
		// si ricarica la lista delle patologie scelte per capire se qualcuna è stata cancellata
		lst_scelti=parent.jQuery(".patologieScelte");	
		lst_scelti.each(function(){
			if($.inArray($(this).attr("valore"), arrayScelti) === -1){
				//parent.NS_ANAMNESI      === undefined ? null : parent.NS_ANAMNESI.eliminaRigaPato($(this).attr("indice"));
                parent.NS_36_SETTIMANA  === undefined ? null : parent.NS_36_SETTIMANA.eliminaRigaPato($(this).attr("indice"));
                parent.DAYSURGERY       === undefined ? null : parent.DAYSURGERY.eliminaRigaPato($(this).attr("indice"));
			}
		});
		
		switch (parent.window.name) {
			case 'ANAMNESI':
				// Registra le patologie su CC_PATOLOGIE_RICOVERO
				if (arrayPatologie.length == 0) {
					alert('Selezionare almeno una patologia.');
				} else {
					$('#hPatologie').val(arrayPatologie.join('#'));
					registra();
				}
				break;
			default:
				SCELTA_PATOLOGIE.chiudiScheda();
		}
	},
    /**
     * @deprecata
     */
	in_array_jQuery: function (thaArray, element){	

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
	LoadPatoScelte: function(){
		var pato = parent.jQuery(".patologieScelte");
		var whereCond='';
		var elenco=[];		
		var indice=0;
		pato.each(function(index){		
			elenco.push("'"+$(this).attr("valore")+"'");	
			indice = $(this).attr("indice");
			if (indice>indiceMax) {indiceMax=indice;}; 
		});
		
		// Gestione apertura patologie dalla worklist dedicata
		if (elenco.length==0) {
			var codice = $('form[name=EXTERN] input[name=COD_PATOLOGIA]').val();
			if (typeof codice === 'string' && codice != '') elenco.push("'"+codice+"'");
		}
		
		if (elenco.length==0) {
			whereCond= 'COD_PATO=\'0\'';
			}
		else{
			whereCond= 'COD_PATO IN  ('+elenco.join(',')+')';
		}

		_filtro_list_elenco_scelti = new FILTRO_QUERY("PatologieSelezionate", null);
		//AGGIUNGO LO ZERO ALL'IDEN PER ALLINEARLE ALLE PRESTAZIONI DOVE METTO INVECE CHE LO '0' L'INFO SULLE CICLICHE
		_filtro_list_elenco_scelti.setValueFieldQuery("COD_PATO");  
		_filtro_list_elenco_scelti.setDescrFieldQuery("COD_PATO ||' - '|| DESCR_PATO");
		_filtro_list_elenco_scelti.setFromFieldQuery("radsql.VIEW_CC_PATOLOGIE");
		_filtro_list_elenco_scelti.setWhereBaseQuery(whereCond, "RICERCA_PATOLOGIE");
		_filtro_list_elenco_scelti.setOrderQuery("DESCR_PATO ASC");
		//alert(whereCond);
		_filtro_list_elenco_scelti.searchListRefresh();	
		
	},
	
	chiudiScheda: function(){
		try {
			parent.$.fancybox.close(); //fancybox
		} catch(e) {
			self.close(); //dialogbox		
		}
	},
	
	caricaProfili: function(){
		var contenuto='';
		eval(baseReparti.getValue(top.getForm().reparto,'FILTRI_SCELTA_PATOLOGIA'));	
		
		if (typeof (configPato) !='undefined'){
			for(var i in configPato) {
				contenuto+="<span  class='filtroPato' title='"+configPato[i].descr+"' value='"+configPato[i].id+"'>"+configPato[i].descr+"</span>";
			}
			
			$("#groupPatologie").prepend($("<fieldset id='fieldsetProfili'></fieldset>").append($("<legend>Scelta rapida</legend>")).append(contenuto));
		    
			$(".filtroPato").css({"text-align":"center",display:"block",float:"left",margin:"2px",padding:"0 8px",cursor:"pointer",background:"#CCC",	border:"1px solid #9E9DA1",color:"#232224"});	
			
			$('.filtroPato').click(function(){ 
				sceltaRapida = $(this).attr("value");
				if($("SELECT[name='PatologieSelezionate'] option[value='"+sceltaRapida+"']").length > 0){
					return;
				}
			  	SCELTA_PATOLOGIE.RicercaPatologie(null,sceltaRapida,false);
			});	
		}
	}
};
