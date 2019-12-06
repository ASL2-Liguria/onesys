var _filtro_list_elenco = null;
var _filtro_list_scelti  = null;
var WindowCartella = null;

jQuery(document).ready(function(){

	window.WindowCartella = window;
	while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
		window.WindowCartella = window.WindowCartella.parent;
	}
	window.baseReparti = WindowCartella.baseReparti;
	window.baseGlobal = WindowCartella.baseGlobal;
	window.basePC = WindowCartella.basePC;
	window.baseUser = WindowCartella.baseUser;

	caricamento();

	arrayLabelName.push($('#lblTitleTipoMed').attr('id'));
	//rimuovo evento per  apri/chiudi
	$('#groupTipoMed legend').unbind( "click" ); 


	switch (_STATO_PAGINA){

	// 	INSERIMENTO ////////////////////////////////
	case 'I':
		arrayLabelValue.push('Selezionare la figura professionale di interesse: ');
		//ONBLUR  txtOraProposta
		jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });

		//ONKEYUP  txtOraProposta
		jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });

		//ONBLUR  txtDataProposta
		jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });

		//ONCONTEXTMENU  cmbSceltaPrest
		document.getElementById('cmbSceltaPrest').oncontextmenu=function(){ add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', true);sortSelect('cmbSceltaPrest'); };

		//ONDBLCLICK  cmbSceltaPrest
		document.getElementById('cmbSceltaPrest').ondblclick= function(){ add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', true);sortSelect('cmbSceltaPrest'); };

		//ONCONTEXTMENU  cmbPrestRich
		document.getElementById('cmbPrestRich').oncontextmenu=function(){ add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true);sortSelect('cmbPrestRich'); };

		//ONDBLCLICK  cmbPrestRich
		document.getElementById('cmbPrestRich').ondblclick= function(){ add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true);sortSelect('cmbPrestRich'); };

		//ONLOAD  body
		document.getElementById('lblTitleUrgenza').innerText='Grado di urgenza: ';
		document.all.hUrgenza.value='0';
		setUrgenza();
		valorizzaMed();
		nascondiCampi();
		setWhereScanDB("STRUTTURA='"+document.EXTERN.STRUTTURA.value+"' and cod_cdc<>'"+document.EXTERN.HrepartoRicovero.value+"'");
		cambiaPulsante();
		filtroQuery();

		break;


		// 	MODIFICA ////////////////////////////////
	case 'E':
		arrayLabelValue.push('');
		//ONBLUR  txtOraProposta
		jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });

		//ONKEYUP  txtOraProposta
		jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });

		//ONBLUR  txtDataProposta
		jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });

		//ONCONTEXTMENU  cmbSceltaPrest
		document.getElementById('cmbSceltaPrest').oncontextmenu=function(){ add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', true);sortSelect('cmbSceltaPrest'); };

		//ONDBLCLICK  cmbSceltaPrest
		document.getElementById('cmbSceltaPrest').ondblclick= function(){ add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', true);sortSelect('cmbSceltaPrest'); };

		//ONCONTEXTMENU  cmbPrestRich
		document.getElementById('cmbPrestRich').oncontextmenu=function(){ add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true);sortSelect('cmbPrestRich'); };

		//ONDBLCLICK  cmbPrestRich
		document.getElementById('cmbPrestRich').ondblclick= function(){ add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true);sortSelect('cmbPrestRich'); };

		//ONLOAD  body
		setUrgenzaScheda();
		valorizzaMed();
		nascondiCampi();
		cambiaPulsante();	
		filtroQuery();
		break;

		// LETTURA ////////////////////////////////
	case 'L':
		arrayLabelValue.push('');
		//ONLOAD  body
		cambiaPulsante();
		valorizzaMed();		
		filtroQuery();
		break;
	}


	/*setTimeout(function(){tipo_med.init();tipo_med.setEvents();},500);*/
	tipo_med.init();
	tipo_med.setEvents();
	tipo_med.valorizzaButtonTipoMed();
});


//funzione richiamata all'onload della pagina
function caricamento(){
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}

	document.all.lblTitleUrgenza.innerText='Grado urgenza';

	//nascondo in lettura il tasto registra
	if (document.EXTERN.LETTURA.value=='S'){
		document.getElementById('lblRegistra').parentElement.style.display='none';
	}else{
		jQuery('#txtOpeRich').attr("readOnly",true);
	}

	document.getElementById('Hiden_anag').value = document.EXTERN.Hiden_anag.value;

	jQuery("#lblRepartoRic").parent().css("width","170px");
	jQuery("#txtQuesito").parent().css({float:'left'}).append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtQuesito');}));
	jQuery("#txtQuesito").parent().css({float:'left'}).append($('<div></div>').addClass('classDivEpi').attr("title","Recupera Epicrisi").click(function() {
		var rs = WindowCartella.executeQuery("diari.xml", "getEpicrisiRicovero", WindowCartella.getRicovero("NUM_NOSOLOGICO"));
		// Recupero valori epicrisi e carico in textarea
		while (rs.next()) {
			$("#txtQuesito").append(rs.getString("EPICRISI") + "<br/>");
		}
	}));

	//funzione che carica la data proposta se arriva in input
	try{ 

		dataAppuntamento=WindowCartella.DatiInterfunzione.get('DataAppuntamento');

		if(dataAppuntamento != ''){
			document.getElementById('txtDataProposta').value = isoToDate(dataAppuntamento);
			//rimuovo la data dal top dopo che l'ho utilizzata
			//top.DatiInterfunzione.remove('DataAppuntamento');
		}

	}catch(e){}


	//maskedit sulla data proposta
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
		document.getElementById('lblTestiStandard').innerText='Testi Std';
	}catch(e){
		//alert(e.description);
	}
}


//funzione che carica il listbox delle prestazioni
function filtroQuery(){

	var ElencoEsami=document.all.HelencoEsami.value;
	var whereCond='';
	var whereCond2='';
	var elenco='';

	var vCdcDestinatario = document.EXTERN.DESTINATARIO.value;
	var vCdcSorgente = document.EXTERN.HrepartoRicovero.value;

	//se il campo HelencoEsami non è vuoto utilizzo i valori per filtrare gli esami nella query
	if (ElencoEsami != ''){

		var esame= new Array();
		esame = ElencoEsami.split('#');
		//alert(esame);

		for (var i=0;i<esame.length;i++){

			if (esame[i]!=''){

				if (elenco==''){
					elenco=esame[i];
				}else{
					elenco+=','+esame[i];
				}
				//alert(elenco);
			}
		}

		whereCond2='iden in ('+elenco+')';
		whereCond='and iden NOT in ('+elenco+')';
	} 

	_filtro_list_elenco = new FILTRO_QUERY('cmbSceltaPrest', null);
	_filtro_list_elenco.setValueFieldQuery('col01');
	_filtro_list_elenco.setDescrFieldQuery('col02');
	_filtro_list_elenco.setFromFieldQuery("table(RADSQL.GETESAMIRICHIEDIBILI('"+vCdcDestinatario+"','"+vCdcSorgente+"','C','0','',''))");
	_filtro_list_elenco.setOrderQuery('col02 ASC');
	_filtro_list_elenco.searchListRefresh();

	_filtro_list_scelti = new FILTRO_QUERY('cmbPrestRich', null);
	_filtro_list_scelti.setValueFieldQuery('IDEN');
	_filtro_list_scelti.setDescrFieldQuery('DESCR');
	_filtro_list_scelti.setFromFieldQuery('RADSQL.TAB_ESA TE');
	_filtro_list_scelti.setWhereBaseQuery(whereCond2);
	_filtro_list_scelti.setOrderQuery('TE.DESCR ASC');	

	if (ElencoEsami != '')
		_filtro_list_scelti.searchListRefresh();


}

//funzione che valroizza i campo medico e operatore
function valorizzaMed(){

	//alert ('BASEuSER.tipo: '+baseUser.TIPO);

	if (document.EXTERN.LETTURA.value != 'S') {

		if (baseUser.TIPO == 'M'){

			document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER; 
			document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpeRich.value = baseUser.DESCRIPTION;
			//jQuery('#txtMedPrescr').attr("readOnly",true);

		}else{

			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpeRich.value = baseUser.DESCRIPTION;
		}
	}

	if (typeof document.EXTERN.Hiden_pro != 'undefined'){	
		document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	}
}

//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){

	var urgenza = document.all.hUrgenza.value;

	//controllo se la pagina è in modalità di inserimento
	//if (_STATO_PAGINA == 'I'){
		switch(urgenza){
		// Non urgente
		case '0':

			if (document.all.lblTitleUrgenza.innerText == '    Grado Urgenza:  ' + ' URGENZA    '){
				//controllo se l'urgenza prima del click è diversa
				document.dati.HelencoEsami.value = '';
			}

			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' Non Urgente    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'routine');
			break;

			// Urgenza
		case '2':

			if (document.all.lblTitleUrgenza.innerText == '    Grado Urgenza:  ' + ' ROUTINE    '){

			}

			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' Urgente    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenza');
			break;
		}
		return;

	/*}else{	

		alert ('Impossibile modificare il grado di urgenza');	
	}*/
}

//funziona che modifica la label in modalità visualizzazione/modifica
function setUrgenzaScheda(){

	var urgenza = document.EXTERN.URGENZA.value;
	document.all.lblTitleUrgenza.innerText = 'Grado Urgenza';

	document.all.hUrgenza.value = urgenza;

	switch(urgenza){
	// Non urgente
	case '0':

		document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  NON URGENTE    ';
		document.all.lblTitleUrgenza.className = '';
		addClass(document.all.lblTitleUrgenza,'routine');
		break;

		// Urgenza
	case '2':

		document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  URGENZA    ';
		document.all.lblTitleUrgenza.className = '';
		addClass(document.all.lblTitleUrgenza,'urgenza');
		break;
	}
}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	//HideLayer('groupOperatori');
	HideLayerFieldset("divGroupOperatori");
	//HideLayer('groupDatiAmm');
	HideLayerFieldset("divGroupDatiAmministrativi");

	document.getElementById('txtMotivoAnnullamento').style.display='none';
	document.getElementById('lblMotivoAnnullamento').style.display='none';
	//HideLayer('groupUrgenza');
	//if ($('#divGroupTipoMed').find('table tbody tr').children('td').length==1) mette sempre nascosto
	$('#groupTipoMed').hide();
}

//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){	

	var esami = '';
	var doc = document.dati;
	var esaMetodica='';

	//	Valorizza HelencoEsami 
	for(var i = 0; i < doc.cmbPrestRich.length; i++){

		esaMetodica = doc.cmbPrestRich[i].value;

		if(esami != ''){
			esami += '#';
		}		

		esami += esaMetodica;

		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	doc.HelencoEsami.value = '';
	doc.HelencoEsami.value = esami;

	if(baseUser.LOGIN =='lucas'){

		var debug = 'IDEN: ' + document.EXTERN.IDEN.value;
		debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
		debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
		debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
		debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
		debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
		debug += '\nESAMI: ' + doc.HelencoEsami.value;
		debug += '\nURGENZA: ' + doc.hUrgenza.value;
		debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
		debug += '\nQUESITO: ' + doc.txtQuesito.value;
		debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value; 

		alert(debug);
	}

	//alert("TIPO: " + $('#hTabPerTipo').val() + "\nTIPO_MED: " + $('#hTabPerTipo_Med').val());

	registra();	
}


function  apriTestiStandard(targetOut){

	if(_STATO_PAGINA == 'L'){return;}

	var url='servletGenerator?KEY_LEGAME=SCHEDA_TESTI_STD&TARGET='+targetOut+'&PROV='+document.EXTERN.FUNZIONE.value;
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}


function stampa_scheda_richiesta(){

	var sf		 = "&prompt<pIdenTR>="+document.EXTERN.ID_STAMPA.value;
	var funzione = 'CONSULENZE_REFERTAZIONE';	
	var reparto	 = document.EXTERN.HrepartoRicovero.value;
	var anteprima;	
	var stampante = basePC.PRINTERNAME_REF_CLIENT;

	if(basePC.PRINTERNAME_REF_CLIENT==''){
		anteprima='S';
	}else{
		anteprima='N';
	}		

	var stampante=basePC.PRINTERNAME_REF_CLIENT;
	WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,stampante);
}

function setCdcRepartoConsulenza(){
	document.EXTERN.DESTINATARIO.value = jQuery("#hRepartoRic").val();
	$('#hTabPerTipo').val('');
	$('#hTabPerTipo_Med').val('');    
	tipo_med.valorizzaButtonTipoMed();
	filtroQuery();		
}


var tipo_med = {

		init:function(){
			if(_STATO_PAGINA == 'I'){ 
				//alert(document.EXTERN.DESTINATARIO.value);
				if (document.EXTERN.DESTINATARIO.value != null && document.EXTERN.DESTINATARIO.value != '') {
					var resultSet = WindowCartella.executeQuery('OE_Consulenza.xml','consulenze.retrieveTipoMed',[document.EXTERN.DESTINATARIO.value]);
					if (resultSet.size==1) {
						resultSet.next();
						$('#hTabPerTipo').val(resultSet.getString('TIPO'));
						$('#hTabPerTipo_Med').val(resultSet.getString('TIPO_MED'));
					}else{
						//arrayLabelName.push($('#lblTitleTipoMed').attr('id'));
						//arrayLabelValue.push('Selezionare la figura professionale di interesse: ');                                   
					}
				} 
			}

			if(_STATO_PAGINA == 'E'){
				$('.pulsanteTipoMed').each(function(){
					if ($(this).attr('tipo') ==$('#hTabPerTipo').val()){		
						$('#lblTitleTipoMed').text('Selezionare la figura professionale di interesse: '+$(this).text());
					}
				});
			}

			if(_STATO_PAGINA == 'L'){
				$('#groupTipoMed').hide();
				$('.pulsanteTipoMed').each(function(){
					if ($(this).attr('tipo') ==$('#hTabPerTipo').val()){		
						$('#lblTitleTipoMed').text('Selezionare la figura professionale di interesse: '+$(this).text());
					}
				});
			}
		},

		setEvents:function(){
			$('.pulsanteTipoMed').click(function(){
				$('#hTabPerTipo').val($(this).attr("tipo"));
				$('#hTabPerTipo_Med').val($(this).attr("tipo_med"));
				$('#lblTitleTipoMed').text('Selezionare la figura professionale di interesse: '+$(this).text());
			});	
		},

		valorizzaButtonTipoMed:function(){
			//Se modifico dinamicamente il reperto, allora modifico la scelta del tipo_med
			$('#divGroupTipoMed').find('table tbody tr').children().remove();
			$('#groupTipoMed').show();
			var resultSet = WindowCartella.executeQuery('OE_Consulenza.xml','consulenze.retrieveTipoMed',[document.EXTERN.DESTINATARIO.value]);
			if (resultSet.size==1){
				resultSet.next();
				$('#groupTipoMed').hide();
				$('#hTabPerTipo').val(resultSet.getString('TIPO'));
				$('#hTabPerTipo_Med').val(resultSet.getString('TIPO_MED'));  
			}
			else{
				while(resultSet.next()){
					//$('[name="hTabPerTipo"]').val('');
					//$('[name="hTabPerTipo_Med"]').val('');				
					var width = Math.round(100/resultSet.size);
					
					//Le richieste fatte a RRF_PL da parte di un reparto di PIETRA LIGURE non devono poter essere fatte direttamente al fisioterapiasta
					if(resultSet.getString('TIPO')=='F' && document.EXTERN.DESTINATARIO.value=='RRF_PL' && WindowCartella.getReparto("STRUTTURA_CDC")=='PIETRA LIGURE'){
						null;
					}
					else{
						var $td = $("<td class='classTdField' width='"+width+"%'><span class='pulsanteTipoMed' tipo="+resultSet.getString('TIPO')+" tipo_med="+resultSet.getString("TIPO_MED")+">"+resultSet.getString("DESCR")+"</SPAN></td>");
						$('#divGroupTipoMed').find('table tbody tr').append($td);
						$('#divGroupTipoMed').find('table tbody colgroup').append('<COL>');
						tipo_med.setEvents();
						//arrayLabelName.push($('#lblTitleTipoMed').attr('id'));
						//arrayLabelValue.push('Selezionare la figura professionale di interesse: ');
						$('#lblTitleTipoMed').text('Selezionare la figura professionale di interesse: ');
						switch($('[name="hTabPerTipo"]').val()) {
						case 'M':
							$('[name="hTabPerTipo_Med"]').val() == 'F' ? $('#lblTitleTipoMed').append('Fisiatra') : null; 
							break;
						case 'L':
							$('#lblTitleTipoMed').append('Logopedista');
							break;
						case 'F':
							$('#lblTitleTipoMed').append('Fisioterapista');
							break;
						default: 
							$('#lblTitleTipoMed').append('');
						}
					}
				}
			}		
		}              
};