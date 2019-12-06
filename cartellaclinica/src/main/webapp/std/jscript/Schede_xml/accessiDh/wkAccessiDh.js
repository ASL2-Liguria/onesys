var _filtro_elenco_reparti=null;
var _filtro_elenco_esami=null;
var _filtro_elenco_contenitori=null;

var clientx ;
var clienty ;
var WindowCartella = null;
//creo due div
$(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	try{
		applica_filtro = FILTRO_WK_ACCESSI_DH.applica_filtro;
		dataOdierna(document.getElementById('txtADataRic'));
		var h = document.body.offsetHeight - $('iframe#oIFWk0').position().top;
		$('iframe#oIFWk0').css("height",h);
		
		$('#txtADataRic').parent()
			.prepend($('<a></a>').addClass("ArrowLeft").click(function(){FILTRO_WK_ACCESSI_DH.switchDay(-1)}))
			.append($('<a></a>').addClass("ArrowRight").click(function(){FILTRO_WK_ACCESSI_DH.switchDay(1)}));
	
		/*$('select[name="cmbRepProvenienza"]').parent()
			.append(
					$('<input name="switch" type="radio" value="0" checked="checked"/>')
						.click(applica_filtro)
				)
			.append($('<label>appuntamenti</label>'))
			.append(
					$('<input name="switch" type="radio" value="1"/>')
						.click(function(){	
							var cod_cdc = $("[name='cmbRepProvenienza'] option:selected").val();
							var dat_esa = clsDate.str2str($('#txtADataRic').val(),'DD/MM/YYYY','YYYYMMDD');
									
							url = "worklist"
								+ "?hidWhere= where REPARTO='"+ cod_cdc +"' and DATAESAMEISO = '" + dat_esa + "'"
								+ "&&hidOrder="
								;
							document.all.oIFWk0.src = top.NS_APPLICATIONS.switchTo("AMBULATORIO",url);
							})
				)			
			.append($('<label>prestazioni</label>'))						
			.append(
					$('<input name="switch" type="radio" value="1"/>')
						.click(function(){
							

							
								var cod_cdc = $("[name='cmbRepProvenienza'] option:selected").val();
								var url = "consultazioneCalendario?tipo=CDC&valore='" + cod_cdc + "'";
								
								url = "consultazioneInizio?tipo=CDC&events=onunload&actions=libera_all(baseUser.IDEN_PER, basePC.IP);";
																
							document.all.oIFWk0.src = top.NS_APPLICATIONS.switchTo("AMBULATORIO",url);
							})
				)			
			.append($('<label>occupazione</label>'))		
	*/
		//setto il filtro salvato
		valoreCombo=document.getElementById('hRepProvenienza').value;
		$("[name='cmbRepProvenienza']").find("option[value='"+valoreCombo+"']").attr("selected","selected");
	
		jQuery("body").keypress (function(e) {
			if(e.keyCode==13){
				jQuery("#txtNome").val(jQuery("#txtNome").val().toUpperCase());
				jQuery("#txtCognome").val(jQuery("#txtCognome").val().toUpperCase());
				aux_applica_filtro();
			}
		});
		
		document.getElementById('txtNome').onblur = function(){document.getElementById('txtNome').value=document.getElementById('txtNome').value.toUpperCase();};
		document.getElementById('txtCognome').onblur = function(){document.getElementById('txtCognome').value=document.getElementById('txtCognome').value.toUpperCase();};

	}catch(e){
		alert(e.description);
	}

});

function aggiorna(){
	FILTRO_WK_ACCESSI_DH.applica_filtro();
}


function aux_applica_filtro(){
	if (document.getElementById("cmbRepProvenienza").value=='')  {
		alert('Attenzione! Compilare il filtro Reparto e Data Appuntamento o Cognome');
	} 	else if (document.getElementById("txtCognome").value == ''  && document.getElementById('txtADataRic').value==''){
		alert('Attenzione! Compilare il filtro Data Appuntamento o Cognome');
	} else {
		setVeloNero('oIFWk0');
		applica_filtro();
	}
}


function resettaDati(){
	
	jQuery("#txtNome, #txtCognome, #txtADataRic").val("");
	$("[name='cmbRepProvenienza']").find("option[value='']").attr("selected","selected");
	
}

/*function apriCartella(obj,funzione,pDatiInterfunzione){

	var frameWK = document.getElementById('oIFWk0').contentWindow;

	if(obj!=null){
		setRiga(obj);
	}else{
		rigaSelezionataDalContextMenu = frameWK.vettore_indici_sel;
	}		

	var idenRicovero=	frameWK.array_iden_ricovero[rigaSelezionataDalContextMenu];
	var idenVisita=		frameWK.array_iden_visita[rigaSelezionataDalContextMenu]; 
	var dimesso=		frameWK.array_dimesso[rigaSelezionataDalContextMenu];

	url='servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente';
	url += "&funzione="+(typeof funzione=='undefined'?"apriVuota();":funzione);	
	url += "&DatiInterfunzione="+(typeof pDatiInterfunzione=='undefined' ? "" : pDatiInterfunzione);	
	url += (idenVisita=='' || idenVisita==-1 ? "&iden_ricovero="+idenRicovero : "&iden_visita="+idenVisita);	
	//url += "&ModalitaCartella="+(dimesso=='S'?"READONLY":"MODIFICA");
	//url += "&url=" + encodeURIComponent(url);
	//alert(url);
	
	var finestra = window.open(url,'','fullscreen=yes status=no');	
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}
}*/



function setRiga(obj){

	if(typeof obj =='undefined') obj = event.srcElement;
	
	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
	
	return rigaSelezionataDalContextMenu;
}

function apriStampa(stato,reparto,obj)
{
	var riga		= setRiga(obj);
	if (array_stato_ref[riga]=='F')
	{	
		var url = "ApriPDFfromDB?AbsolutePath="+top.getAbsolutePath()+"&idenVersione="+array_iden_ref[riga];
		window.open(url,'','scrollbars=yes,fullscreen=yes');	
	}
	else
	{
		var funzione 	= 'CONSULENZE_REFERTAZIONE';
		var sf			= '&prompt<pIdenTR>='+array_iden_testata[riga];

        WindowCartella.confStampaReparto(funzione,sf,'S','',null);
	}
}


function setDateFiltri(){	
	var tDay = new Date();
	var tMonth = tDay.getMonth()+1;
	var tDate = tDay.getDate();
	if ( tMonth < 10) tMonth = "0"+tMonth;
	if ( tDate < 10) tDate = "0"+tDate;
	//alert( tDate+"/"+tMonth+"/"+tDay.getFullYear());
	document.all['txtDaDataRic'].value = tDate+"/"+tMonth+"/"+tDay.getFullYear();
}

function caricamentoPagina(){
	setVeloNero('oIFWk0');
	applica_filtro();//WK_ACCESSI_DH
//	//document.getElementById('cmbStato').options[document.getElementById('cmbStato').options.selectedIndex].value="";
//	try{ removeVeloNero('oIFWk0')}catch(e){}
//	
}


function dataOdierna(oggetto){
	
	var data= new Date();
	var giorno= data.getDate() ;
	var mese=data.getMonth() +1;
	var anno=data.getYear();
	
	
	if (giorno.toString().length <2){
		
		//alert ('giorno prima '+giorno);
		giorno = '0'+giorno;
		
	}
	
	if (mese.toString().length <2){
		
		//alert ('giorno prima '+mese);
		mese = '0'+mese;
		
	}
	

	//data europea
	oggetto.value = giorno + '/' +mese+ '/' + anno;
	
	//data americana
	//oggetto.value = mese + '/' +giorno+ '/' + anno;

}


var FILTRO_WK_ACCESSI_DH ={
		
	switchDay:function(pValue){
		if($('#txtADataRic').val() == '')return;
		var Data = clsDate.setData(clsDate.str2str($('#txtADataRic').val(),'DD/MM/YYYY','YYYYMMDD'),'00:00');
		Data = clsDate.dateAdd(Data,'D',pValue);
		Data = clsDate.getData(Data,'DD/MM/YYYY');
		$('#txtADataRic').val(Data);
		FILTRO_WK_ACCESSI_DH.applica_filtro();
	},
	
		applica_filtro:function(){
			
			var a_filtri = document.getElementsByAttribute('*', 'FILTRO_CAMPO_DESCRIZIONE');
			var a_valori = null;
			var where    = '';
			var where_noe = '';
			var campo    = '';
			var valore	 = '';
			var save	 = '';
			var url_tmp	 = '';
			var tmp_where;
			
			if (document.getElementById("cmbRepProvenienza").value=='')  {
				alert('Attenzione! Compilare il filtro Reparto e Data Appuntamento o Cognome');
			} 	else if (document.getElementById("txtCognome").value == ''  && document.getElementById('txtADataRic').value==''){
				alert('Attenzione! Compilare il filtro Data Appuntamento o Cognome');
			} else {
				 setVeloNero('oIFWk0');

			for(var idx_filtri = 0; idx_filtri < a_filtri.length; idx_filtri++)
			{	
				// Salvo il filtro!
		                if(!_PRIMA_VOLTA)
                                    NS_SALVA_FILTRO.init(baseUser.LOGIN,a_filtri[idx_filtri]);            
                                            //save += generate_save_filtro(a_filtri[idx_filtri]);
				
				campo = a_filtri[idx_filtri].FILTRO_CAMPO_DB;
				valore = document.all[a_filtri[idx_filtri].FILTRO_CAMPO_VALORE].value;
				
				//alert(a_filtri[idx_filtri].FILTRO_CAMPO_DB + ' - ' +document.all[a_filtri[idx_filtri].FILTRO_CAMPO_VALORE].value);
				
				if(trim(valore) != '')
				{
					if(trim(where) != '')
					{
						where += ' and ';
					}
					if(a_filtri[idx_filtri].FILTRO_CAMPO_TIPO == 'DATE')
					{
						a_valori = valore.split('/');
						valore = "'" + a_valori[2] + a_valori[1] + a_valori[0] + "'";
						where += '(' + campo + valore;
					}
					else if(a_filtri[idx_filtri].FILTRO_CAMPO_VALORE == 'cmbRepProvenienza')
					{

						where += "(" + campo + valore +"'";
					}
					else
					{
						if(campo.toLowerCase().indexOf('like') > 0)
						{
							tmp_where = '';
							a_valori = valore.split(',');
							
							for(var idx_value = 0; idx_value < a_valori.length; idx_value++)
							{
								if(trim(tmp_where) != '')
								{
									tmp_where += ' or ';
								}
								
								if(typeof a_filtri[idx_filtri].FILTRO_CAMPO_AFTER_VALUE == 'string')
								{
									tmp_where += campo + a_valori[idx_value].replace(/\'/, "''") + a_filtri[idx_filtri].FILTRO_CAMPO_AFTER_VALUE + '\'';
								}
								else
								{
									tmp_where += campo + a_valori[idx_value].replace(/\'/, "''") + '\'';
								}
							}
							
							where += '(' + tmp_where;
						}
						else
						{

							where += '(' + campo + valore;
						}

					}
					
					if(campo.substr(campo.length - 1) == '(')
					{
						where += ')';
					}
					
					where += ')';
					
				}
			}
		        if(!_PRIMA_VOLTA)
		        {
		            NS_SALVA_FILTRO.save();
		        }
		        else
		            _PRIMA_VOLTA = false;
		        
			if(typeof document.all['WHERE_WK_EXTRA'] != 'undefined')
			{
				if(trim(document.all['WHERE_WK_EXTRA'].value) != '')
				{
					if(trim(where) != '')
					{
						where += ' and ';
					}
					
					var extra = document.all['WHERE_WK_EXTRA'].value.replace(/WHERE /, '');
					
					where += '(' + extra + ')';
				}
			}
			
			if(trim(where) != '')
			{				
				where_noe = 'WHERE ' + where;
				where = 'WHERE ' + escape(where);
			}
			
			try
			{
				if(where == '' && document.all['WHERE_WK'].value != '')
					where = document.all['WHERE_WK'].value.replace(/where /, '');
			}catch(e){
				alert(e.description);
			}
		
			if(typeof document.all.oIFWk0 != 'undefined')
			{	
				//alert(where);
				document.all.oIFWk0.src = genereate_url_wk('servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_APPUNTAMENTI_DH&ILLUMINA=javascript:illumina(this.sectionRowIndex);', where);				
			}

		}
		}
}

function apriDiari(obj){
		
	setRiga(obj);
	var idenVisita='';
	var idenRicovero='';
	if (document.getElementById('oIFWk0').contentWindow.array_iden_visita[rigaSelezionataDalContextMenu]!='-1')
		idenVisita=document.getElementById('oIFWk0').contentWindow.array_iden_visita[rigaSelezionataDalContextMenu];
	
	
	if (document.getElementById('oIFWk0').contentWindow.array_iden_ricovero[rigaSelezionataDalContextMenu]!='-1')
		idenRicovero=document.getElementById('oIFWk0').contentWindow.array_iden_ricovero[rigaSelezionataDalContextMenu];

	var reparto=document.getElementById('oIFWk0').contentWindow.array_cdc_reparti[rigaSelezionataDalContextMenu];
	
	
	url = 'servletGeneric?class=paginaTab.paginaTab&REPARTO='+reparto+'&IDEN_VISITA='+idenVisita+'&IDEN_RICOVERO='+idenRicovero+'&PROCEDURA=diarioAccessi';
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function apriAccesso(iden_anag,iden_visita,tipo_operazione){
//	var iden_anag = stringa_codici(array_iden_anag);
	if (iden_anag=='')
		return alert('Selezionare un paziente');
	var url = "servletGenerator?KEY_LEGAME=INSERIMENTO_ACCESSO&IDEN_ANAG="+iden_anag+"&IDEN_VISITA="+iden_visita;
	url +="&TIPO="+tipo_operazione;
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 300,
		'href'		: url,
		'type'		: 'iframe'
	});
}