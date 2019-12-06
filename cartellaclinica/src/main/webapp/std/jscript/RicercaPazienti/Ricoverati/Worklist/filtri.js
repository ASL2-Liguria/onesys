//PROFILO DI REPERIBILITA' DIVENTA PROFILO DI GUARDIA... ma nel codice lascio reperibilità, altrimenti devo cambiare un po' di id e label
var _PRIMO_CARICAMENTO = true;
try{
	if (baseUser.MODALITA_ACCESSO.toString() != '' && typeof baseUser.MODALITA_ACCESSO != 'undefined' ){
		var profilo=baseUser.MODALITA_ACCESSO;
	}else{
		var profilo='REPARTO';
	}
	
	
}catch(e){
	var profilo='REPARTO';
}

profilo=profilo.toString();


if (profilo == ''){profilo='REPARTO';}
/*la variabile controllo è legata al caricamento della wk dei ricoverati
  se OK allora carica, se KO blocca il caricamento*/
var controllo='OK';

jQuery(document).ready(function(){
	
	//aggiungo l'evento onchange al combo della struttura
	document.getElementsByName('cmbStruttura')[0].onchange=function(){
		mostraReparti(profilo);
	};                  
	caricamento();
});


function caricamento(){

	var url='';
	
	try{
		
		h= parent.document.getElementById('workFrame').offsetHeight - document.getElementById('oIFWk').offsetTop;
		document.getElementById('oIFWk').style.height = h+'px';
		
	}catch(e){
		//alert(e.description)
		h= document.body.offsetHeight - document.getElementById('oIFWk').offsetTop;
		document.getElementById('oIFWk').style.height = h+'px';
	}

	$("input[name^='txt']").keyup(function(){
			intercettaTasti(this);
		});
	
	//disabilito il caricamento della wk se siamo in regime di emergenza e reperibilità
	if(profilo == 'EMERGENZA' || profilo == 'REPERIBILITA' || profilo == 'SOSTITUZIONE_INFERMIERISTICA' || profilo=='METAL'){
		controllo = 'KO';
		if (top.leftFrame) {
			try {
				top.leftFrame.document.getElementById('layBM').style.visibility='hidden';
			} catch (e) {
				jQuery(top.leftFrame).load(function(){
					top.leftFrame.document.getElementById('layBM').style.visibility='hidden';
				});
			}
		}
	} else{
		document.getElementById('hStrutturaEme').value = '';
		document.getElementById('hStrutturaRepe').value = '';
		document.getElementById('hStrutturaSostInferm').value = '';
	}
	gestCampiProfilo();
	
	url='SL_RicPazRicoverati?tipo_wk=WK_RICERCA_PAZIENTI_RICOVERATI_REMOTA';
	url+='&nome_vista=VIEW_WK_RICOVERATI';
	url+='&applicativo=WHALE';
	url+='&provenienza=consultazione_per_ricoverati';
	url+="&hidOrder=''";
	//alert(url);
	
	if(baseUser.IDEN_GROUP!='99'){
		applica_filtro_ricoverati(url); 
	}

}


function aux_filtro(){
	
	controllo='OK';
	
	if(profilo == 'EMERGENZA' || profilo=='METAL'){
		
		if(document.getElementById('hStrutturaEme').value != ''){
			document.getElementById('hStrutturaEme').value =  "'" + document.getElementsByName('cmbStruttura')[0].value + "'";
		}
		
		if(document.getElementsByName('cmbStruttura')[0].value == ''){
			
			jQuery("input[name=hRepartiElencoEme]").val('');
			document.getElementById('lblRepartiElencoEme').innerText = '';
			alert('Prima di proseguire scegliere una Struttura ospedaliera e i Reparti');
			controllo='KO';
			return;
		}	
		
		if (jQuery("input[name=hRepartiElencoEme]").val() == ''){
			alert('Prima di proseguire scegliere un reparto');
			controllo='KO';
			return;
		}
		

		
	}else if(profilo == 'REPERIBILITA'){
		
		if(document.getElementById('hStrutturaRepe').value != ''){

			document.getElementById('hStrutturaRepe').value =  "'" + document.getElementsByName('cmbStruttura')[0].value + "'";
		
		}
	
		if(document.getElementsByName('cmbStruttura')[0].value == ''){

			document.getElementById('hRepartiElencoRepe').value = '';
			document.getElementById('lblRepartiElencoRepe').innerText = '';
			alert('Prima di proseguire scegliere una Struttura ospedaliera e i Reparti');
			controllo='KO';
			return;
		}
		
		if (document.getElementById('hRepartiElencoRepe').value == ''){
			alert('Prima di proseguire scegliere un reparto');
			controllo='KO';
			return;
		}
	
	}else if(profilo == 'SOSTITUZIONE_INFERMIERISTICA'){
		
		if(document.getElementById('hStrutturaSostInferm').value != ''){

			document.getElementById('hStrutturaSostInferm').value =  "'" + document.getElementsByName('cmbStruttura')[0].value + "'";
		
		}
	
		if(document.getElementsByName('cmbStruttura')[0].value == ''){

			document.getElementById('hRepartiElencoSostInferm').value = '';
			document.getElementById('lblRepartiElencoSostInferm').innerText = '';
			alert('Prima di proseguire scegliere una Struttura ospedaliera e i Reparti');
			controllo='KO';
			return;
		}
		
		if (document.getElementById('hRepartiElencoSostInferm').value == ''){
			alert('Prima di proseguire scegliere un reparto');
			controllo='KO';
			return;
		}
	
		
		
	}else{
		
		document.getElementById('hStrutturaEme').value = '';
		document.getElementById('hStrutturaRepe').value = '';
		document.getElementById('hStrutturaSostInferm').value = '';
		controllo='OK';
	}
}


function applica_filtro_ricoverati(url_new){
	
	//utilMostraBoxAttesa(true);
	
	if(baseUser.IDEN_GROUP=='99'&& $('#txtCognome').val().length<2){
		alert('Prego inserire almeno le due lettere iniziali nel campo Cognome.');
		return;
	}
	
	if (controllo != 'KO'){
		
		setVeloNero('oIFWk');
	
		var query_filtri='';
		
		_DEFAULT_FIELD_FILTRO = 'hidWhere';
		//	url_new=url_new+'&hidOrder=';	

		//document.dati.WHERE_WK_EXTRA.value = ' IDEN_PER='+baseUser.IDEN_PER;

		var stati = (document.getElementById('hStatoElenco').value).split(",");
		var ElencoReparti = "";
	
		switch(baseUser.MODALITA_ACCESSO ){
	
			case 'EMERGENZA'	: 
			case 'METAL'	:	
				ElencoReparti = document.getElementById('hRepartiElencoEme').value;
				break;
			case 'REPERIBILITA'	: ElencoReparti = document.getElementById('hRepartiElencoRepe').value;
				break;
			case 'SOSTITUZIONE_INFERMIERISTICA'	: ElencoReparti = document.getElementById('hRepartiElencoSostInferm').value;
				break;
			case 'REPARTO'		: ElencoReparti = document.getElementById('hRepartiElenco').value;
				break;
			default 			: ElencoReparti = document.getElementById('hRepartiElenco').value;
				break;
		}

		if(stati.length<5 && stati.length>0 ){
			
			for (var indice=0; indice<stati.length; indice++) {
			
				if (query_filtri!='')
					query_filtri+=' OR ';				
			
				switch (trim(stati[indice])) {
					case "'RIC'":		query_filtri+=" ( (CODICE_REPARTO IN ("+ElencoReparti+ ") OR REPARTO_APPOGGIO IN ("+ElencoReparti+ ")) and DIMESSO_DB='N' and CODICE_DIMISSIONE IS NULL )"; /*RICOVERATI*/

/*					case "'RIC'":		query_filtri+=" ( (CODICE_REPARTO IN ("+ElencoReparti+ ") and REPARTO_APPOGGIO IS NULL) and DIMESSO_DB='N' and CODICE_DIMISSIONE IS NULL )";*/ /*RICOVERATI*/
						break;
						
					case "'DIM'":		query_filtri+=" (( CODICE_REPARTO IN ("+ElencoReparti+ ") OR REPARTO_APPOGGIO IN ("+ElencoReparti+ ")) and DIMESSO_DB='S' and (CODICE_DIMISSIONE is null or CODICE_DIMISSIONE <> 'TRS'))"; /*DIMESSI*/
						break;
						
					case "'APP_A'":		query_filtri+=" ( CODICE_REPARTO IN ("+ElencoReparti+") and REPARTO_APPOGGIO is not null and DIMESSO_DB='N' ) "; /*IN APPOGGIO A*/
						break;
						
					case "'APP_DA'":	query_filtri+=" ( REPARTO_APPOGGIO in ("+ElencoReparti+ ") and DIMESSO_DB='N' ) "; /*IN APPOGGIO DA*/
						break;
						
					case "'TRS'":		query_filtri+=" ( CODICE_REPARTO IN ("+ElencoReparti+") and CODICE_DIMISSIONE='TRS') "; /*TRASFERITI*/
						break;
						
					default:			query_filtri += "( CODICE_REPARTO IN ("+ElencoReparti+ ") OR REPARTO_APPOGGIO IN ("+ElencoReparti+ "))";
						break;																								

				}		
			}
			
		}else{
			
			query_filtri += "( CODICE_REPARTO IN ("+ElencoReparti+ ") OR REPARTO_APPOGGIO IN ("+ElencoReparti+ "))";
			
		}

		//alert('query_filtri: '+query_filtri);
		applica_filtro_reparto2(url_new,query_filtri);
	}
}


function response_salva_filtro_reparto(risp){}


function applica_filtro_reparto2(url_new, query_filtri){
	
	//var a_filtri = document.getElementsByAttribute('*', 'FILTRO_CAMPO_VALORE');var where_noe = '';	var risp	 = '';
	var a_filtri 	= document.getElementsByAttribute('*', 'FILTRO_CAMPO_DESCRIZIONE');
	var a_valori 	= null;
	var where    	= '';
	var campo    	= '';
	var descr		='';
	var valore	 	= '';
	var url_tmp		= '';
	var tmp_where	= '';
	var risp		= '';
	
	if (typeof baseUser.MODALITA_ACCESSO == 'undefined'){
			profilo = 'REPARTO';
	}

	for(var idx_filtri = 0; idx_filtri < a_filtri.length; idx_filtri++){	
	
		switch(profilo){
			
			case 'REPARTO':

				if(a_filtri[idx_filtri].name!='lblRepartiRepe'){
					if(a_filtri[idx_filtri].name!='lblRepartiEme'){
						if(a_filtri[idx_filtri].name!='lblRepartiSostInferm'){
							if(a_filtri[idx_filtri].name!='hStrutturaEme'){
								if(a_filtri[idx_filtri].name!='hStrutturaRepe'){
									if(a_filtri[idx_filtri].name!='hStrutturaSostInferm'){
										//risp = salva_filtro(a_filtri[idx_filtri]);
										//risp += generate_save_filtro(a_filtri[idx_filtri]);
										if (!_PRIMO_CARICAMENTO)                                            
											NS_SALVA_FILTRO.init(baseUser.LOGIN,a_filtri[idx_filtri]);
									}
								}
							}
						}
					}	
				}
				break;

			case 'EMERGENZA':
			case 'METAL':

				if(a_filtri[idx_filtri].name!='lblReparti'){
					if(a_filtri[idx_filtri].name!='lblRepartiRepe'){
						if(a_filtri[idx_filtri].name!='lblRepartiSostInferm'){
							if(a_filtri[idx_filtri].name!='hStrutturaRepe'){
								if(a_filtri[idx_filtri].name!='hStrutturaSostInferm'){
									//risp = salva_filtro(a_filtri[idx_filtri]);
									//risp += generate_save_filtro(a_filtri[idx_filtri]);
									_PRIMO_CARICAMENTO = false;
									NS_SALVA_FILTRO.init(baseUser.LOGIN,a_filtri[idx_filtri]);
								}
							}
						}
					}	
				}
				break;

			case 'REPERIBILITA':

				if(a_filtri[idx_filtri].name!='lblReparti'){
					if(a_filtri[idx_filtri].name!='lblRepartiEme'){
						if(a_filtri[idx_filtri].name!='lblRepartiSostInferm'){
							if(a_filtri[idx_filtri].name!='hStrutturaSostInferm'){
								if(a_filtri[idx_filtri].name!='hStrutturaEme'){
									//risp = salva_filtro(a_filtri[idx_filtri]);
									//risp += generate_save_filtro(a_filtri[idx_filtri]);
									_PRIMO_CARICAMENTO = false;
									NS_SALVA_FILTRO.init(baseUser.LOGIN,a_filtri[idx_filtri]);
								}
							}
						}
					}	
				}
				break;

			case 'SOSTITUZIONE_INFERMIERISTICA':

				if(a_filtri[idx_filtri].name!='lblReparti'){
					if(a_filtri[idx_filtri].name!='lblRepartiRepe'){
						if(a_filtri[idx_filtri].name!='lblRepartiEme'){
							if(a_filtri[idx_filtri].name!='hStrutturaEme'){					
								if(a_filtri[idx_filtri].name!='hStrutturaRepe'){
									//risp = salva_filtro(a_filtri[idx_filtri]);
									//risp += generate_save_filtro(a_filtri[idx_filtri]);
									_PRIMO_CARICAMENTO = false;
									NS_SALVA_FILTRO.init(baseUser.LOGIN,a_filtri[idx_filtri]);
								}
							}
						}	
					}
				}
				break;

			default:

				if(a_filtri[idx_filtri].name!='lblRepartiRepe'){
					if(a_filtri[idx_filtri].name!='lblRepartiEme'){
						if(a_filtri[idx_filtri].name!='lblRepartiSostInferm'){
							if(a_filtri[idx_filtri].name!='hStrutturaEme'){
								if(a_filtri[idx_filtri].name!='hStrutturaSostInferm'){							
									if(a_filtri[idx_filtri].name!='hStrutturaRepe'){
										//risp = salva_filtro(a_filtri[idx_filtri]);
										//risp += generate_save_filtro(a_filtri[idx_filtri]);
										if (!_PRIMO_CARICAMENTO)                                            
											NS_SALVA_FILTRO.init(baseUser.LOGIN,a_filtri[idx_filtri]);
									}
								}
							}
						}
					}	
				}
				break;
		}
		
		campo = a_filtri[idx_filtri].FILTRO_CAMPO_DB;
		descr=a_filtri[idx_filtri].FILTRO_CAMPO_DESCRIZIONE;
		valore = document.getElementById(a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_VALORE")).value;
		
		//alert('campo: '+campo +'\ndescr: '+descr+'\nvalore: '+valore+ '\ncondizione: '+(typeof campo != 'undefined' && trim(valore) != '' && trim(descr)!='lblStatoElenco' ));

		if(typeof campo != 'undefined' && trim(valore) != '' && trim(descr)!='lblStatoElenco' ){
			
			if(trim(where) != ''){
				where += ' and ';
			}
			
			if(a_filtri[idx_filtri].FILTRO_CAMPO_TIPO == 'DATE'){
				a_valori = valore.split('/');
				valore = "'" + a_valori[2] + a_valori[1] + a_valori[0] + "'";
				where += '(' + campo + valore;
			
			}else{
				
				if(campo.toLowerCase().indexOf('like') > 0){
					tmp_where = '';
					a_valori = valore.split(',');
					
					for(var idx_value = 0; idx_value < a_valori.length; idx_value++){
						
						if(trim(tmp_where) != ''){
							tmp_where += ' or ';
						}
						
						if(typeof a_filtri[idx_filtri].FILTRO_CAMPO_AFTER_VALUE == 'string'){
							tmp_where += campo + a_valori[idx_value].replace(/\'/, "''") + a_filtri[idx_filtri].FILTRO_CAMPO_AFTER_VALUE + '\'';
						}else{
							tmp_where += campo + a_valori[idx_value].replace(/\'/, "''") + '\'';
						}
					}
					
					where += '(' + tmp_where;
				
				}else{
				
					where += '(' + campo + valore;
				}
			}

			if(campo.substr(campo.length - 1) == '('){
				where += ')';
			}
			
			where += ')';
		}
	}
	
	//SALVATAGGIO FILTRI
	//save_filtro(risp);
        if (!_PRIMO_CARICAMENTO)
            NS_SALVA_FILTRO.save();
        else
            _PRIMO_CARICAMENTO = false;
	if(typeof document.getElementById('WHERE_WK_EXTRA') != 'undefined'){
		
		if(trim(document.getElementById('WHERE_WK_EXTRA').value) != ''){
			
			if(trim(where) != ''){
				where += ' and ';
			}
			
			var extra = document.getElementById('WHERE_WK_EXTRA').value.replace(/WHERE /, '');
			
			where += '(' + extra + ')';
		}
	}
	
	if(trim(where) != ''){
		
		where_noe = 'WHERE ' + where;
		
		if (query_filtri!='')
		where += ' AND (' + query_filtri + ' ) ';
		//alert('where '+ where);
		where = 'WHERE ' + escape(where);
	
	/******************************************************************************************************************
		L'else seguente subentra nel caso in cui nessun filtro è selezionato, non considerando REPARTI e STATO_PAZIENTE.
		Questi ultimi non vengono considerati compilati in quanto non possono funzionare come un filtro normale,
		poichè sono dipendenti tra loro
	*******************************************************************************************************************/
	}else{
		
		where = 'WHERE 1=1 '; 
			
		if(query_filtri != ''){
			where += 'and '+query_filtri; 
		}
	}
	
	try{	

		if(where == '' && document.getElementById('WHERE_WK').value != ''){
			where = document.getElementById('WHERE_WK').value.replace(/where /, '');
		}
		
	}catch(e){}
	
	
	if(typeof url_new != 'undefined'){
		
		document.getElementById('oIFWk').setAttribute('SRC_ORIGINE', url_new);
	}
	if(typeof not_init == 'undefined'){
		
		_WK_PAGINE_ATTUALE = 1;
	}
	
	if(typeof document.getElementById('oIFWk') != 'undefined'){
		
		/*if(document.getElementById('oIFWk').getAttribute('src') == 'blank')
			document.getElementById('oIFWk').src = genereate_url_wk(document.getElementById('oIFWk').getAttribute('SRC_ORIGINE'), where);
		else
			document.getElementById('oIFWk').contentWindow.jQuery().refreshWorklist(where_noe);*/
		
		if (document.getElementById('oIFWk').getAttribute('src') == 'blank'){
		
			url='SL_RicPazRicoverati?tipo_wk=WK_RICERCA_PAZIENTI_RICOVERATI_REMOTA';
			url+='&nome_vista=VIEW_WK_RICOVERATI';
			url+='&applicativo=WHALE';
			url+='&provenienza=consultazione_per_ricoverati';
			url+="&hidOrder=''";
		
			document.getElementById('oIFWk').setAttribute('SRC_ORIGINE', url);
		}
		
		document.getElementById('oIFWk').setAttribute('src', genereate_url_wk(document.getElementById('oIFWk').getAttribute('SRC_ORIGINE') +'&filtro_reparti='+document.dati.hRepartiElenco.value , where));
	
	}else{
		
		url_tmp = document.location + '';
		url_tmp = url_tmp.substr(url_tmp.indexOf('?') + 1, url_tmp.length);
		url_tmp = genereate_url_wk(url_tmp, where, true);
		document.location.replace(url_tmp);
	}
}



function intercettaTasti(obj){
	
	if(window.event.keyCode==13){
	
		window.event.keyCode = 0;
		aux_filtro();
		applica_filtro_ricoverati();
		return;
  	}
	
	obj.value= obj.value.toUpperCase();
}
function resettaFiltri(){
	var doc = document.dati;
	
	
	doc.txtCognome.value = '';
	doc.txtNome.value = '';
	doc.txtDataNascita.value = '';
	doc.txtNosologico.value = '';
	doc.txtStanza.value = '';
	doc.txtLetto.value = '';
}
/*
function trim(str){    
if(!str || typeof str != 'string')       
return null;    
return str.replace(/^[\s]+/,'').replace(/[\s]+$/,'').replace(/[\s]{2,}/,' ');
}
*/

//funzione che gestisce la visibilità del campo a seconda del proilo selezionato dall'utente nel barmenu
function gestCampiProfilo(){
	
	var valoreCombo='';
	document.getElementById('lblTitolo').innerText= 'Ricerca Pazienti Ricoverati';
	
	//nascondo tutti i campi inizialmente
	jQuery("#lblReparti,#lblRepartiElenco,#lblRepartiEme,#lblRepartiElencoEme,#lblRepartiRepe,#lblRepartiElencoRepe,#lblRepartiSostInferm,#lblRepartiElencoSostInferm,#lblStruttura,#hStrutturaEme,#hStrutturaSostInferm,#hStrutturaRepe").parent().hide();
	jQuery("[name='cmbStruttura']").parent().hide();

	//PROFILO REPERIBILITA ////////////////////////
	if (profilo == 'REPERIBILITA'){
		
		document.getElementById('lblTitolo').innerText = "   " + document.getElementById('lblTitolo').innerText + "   -   GUARDIA   ";
			
		//valorizzo il combo della struttura
		valoreCombo=document.getElementById('hStrutturaRepe').value.substring(1,document.getElementById('hStrutturaRepe').value.length-1);
		document.getElementById('hWhereCond').value=valoreCombo;
		$("[name='cmbStruttura']").find("option[text='"+valoreCombo+"']").attr("selected","selected");
	
		jQuery("[name='cmbStruttura']").parent().show();
		jQuery("#lblStruttura").parent().show();
		if (document.getElementsByName('cmbStruttura')[0].value!=''){
			jQuery("#lblStruttura, #lblRepartiRepe, #lblRepartiElencoRepe").parent().show();
		}
		jQuery("#hRepartiElenco, #hRepartiElencoEme, #hStrutturaEme").val('');
		jQuery("#hRepartiElenco, #hRepartiElencoSostInferm, #hStrutturaSostInferm").val('');
		
		//coloro la label - Commentare in caso non si voglia evidenziare
		jQuery('#lblTitolo').css('color','#018844');
		jQuery('#lblTitolo').css('background','white');
		jQuery('#lblTitolo').css('height','19px');
		jQuery('#lblTitolo').css('line-height','19px');
		jQuery('#lblTitolo').css('border','1px solid #018844');
		jQuery('#lblRepartiRepe').parent().css('background','#fdfd00');
	
		
		//registro la scelta tramite dwr
		//tracciaProfilo(profilo);

	//PROFILO EMERGENZA ////////////////////////
	}else if (profilo == 'EMERGENZA'){
		
		document.getElementById('lblTitolo').innerText = "   " + document.getElementById('lblTitolo').innerText + "   -   EMERGENZA   ";
		
		valoreCombo=document.getElementById('hStrutturaEme').value.substring(1,document.getElementById('hStrutturaEme').value.length-1);
		document.getElementById('hWhereCond').value=valoreCombo;
		$("[name='cmbStruttura']").find("option[text='"+valoreCombo+"']").attr("selected","selected");
		
		jQuery("[name='cmbStruttura']").parent().show();
		jQuery("#lblStruttura").parent().show();
		if (document.getElementsByName('cmbStruttura')[0].value!=''){
			jQuery("#lblStruttura, #lblRepartiEme, #lblRepartiElencoEme").parent().show();
		}
		jQuery("#hRepartiElenco, #hRepartiElencoRepe, #hStrutturaRepe").val('');
		jQuery("#hRepartiElenco, #hRepartiElencoSostInferm, #hStrutturaSostInferm").val('');
		
		//coloro la label - Commentare in caso non si voglia evidenziare
		jQuery('#lblTitolo').css('color','red');
		jQuery('#lblTitolo').css('background','white');
		jQuery('#lblTitolo').css('line-height','19px');
		jQuery('#lblTitolo').css('height','19px');
		jQuery('#lblTitolo').css('border','1px solid red');
		jQuery('#lblRepartiEme').parent().css('background','#fdfd00');
		
		//registro la scelta tramite dwr
		//tracciaProfilo(profilo);
	
	//SCELTA DEFAULT REPARTO ////////////////////
		//PROFILO EMERGENZA ////////////////////////
	}
else if (profilo == 'METAL'){
		
	document.getElementById('lblTitolo').innerText ="   " + document.getElementById('lblTitolo').innerText;
		
		valoreCombo=document.getElementById('hStrutturaEme').value.substring(1,document.getElementById('hStrutturaEme').value.length-1);
		document.getElementById('hWhereCond').value=valoreCombo;
		$("[name='cmbStruttura']").find("option[text='"+valoreCombo+"']").attr("selected","selected");
		
		jQuery("[name='cmbStruttura']").parent().show();
		jQuery("#lblStruttura").parent().show();
		if (document.getElementsByName('cmbStruttura')[0].value!=''){
			jQuery("#lblStruttura, #lblRepartiEme, #lblRepartiElencoEme").parent().show();
		}
		jQuery("#hRepartiElenco, #hRepartiElencoRepe, #hStrutturaRepe").val('');
		jQuery("#hRepartiElenco, #hRepartiElencoSostInferm, #hStrutturaSostInferm").val('');
		
		//coloro la label - Commentare in caso non si voglia evidenziare
		jQuery('#lblTitolo').css('color','red');
		jQuery('#lblTitolo').css('background','white');
		jQuery('#lblTitolo').css('line-height','19px');
		jQuery('#lblTitolo').css('height','19px');
		jQuery('#lblTitolo').css('border','1px solid red');
		jQuery('#lblRepartiEme').parent().css('background','#fdfd00');
		
		//registro la scelta tramite dwr
		//tracciaProfilo(profilo);
	
	//SCELTA DEFAULT REPARTO ////////////////////
		//PROFILO EMERGENZA ////////////////////////
	}
	else if (profilo == 'SOSTITUZIONE_INFERMIERISTICA'){
		
		document.getElementById('lblTitolo').innerText = "   " + document.getElementById('lblTitolo').innerText + "   -   SOSTITUZIONE INFERMIERISTICA   ";
		
		valoreCombo=document.getElementById('hStrutturaSostInferm').value.substring(1,document.getElementById('hStrutturaSostInferm').value.length-1);
		document.getElementById('hWhereCond').value=valoreCombo;
		$("[name='cmbStruttura']").find("option[text='"+valoreCombo+"']").attr("selected","selected");
		
		jQuery("[name='cmbStruttura']").parent().show();
		jQuery("#lblStruttura").parent().show();
		if (document.getElementsByName('cmbStruttura')[0].value!=''){
			jQuery("#lblStruttura, #lblRepartiSostInferm, #lblRepartiElencoSostInferm").parent().show();
		}
		jQuery("#hRepartiElenco, #hRepartiElencoRepe, #hStrutturaRepe").val('');
		jQuery("#hRepartiElenco, #hRepartiElencoEme, #hStrutturaEme").val('');
	
		//coloro la label - Commentare in caso non si voglia evidenziare
		jQuery('#lblTitolo').css('color','blue');
		jQuery('#lblTitolo').css('background','white');
		jQuery('#lblTitolo').css('line-height','19px');
		jQuery('#lblTitolo').css('height','19px');
		jQuery('#lblTitolo').css('border','1px solid red');
		jQuery('#lblRepartiSostInferm').parent().css('background','#fdfd00');
		
		//registro la scelta tramite dwr
		//tracciaProfilo(profilo);
	
	//SCELTA DEFAULT REPARTO ////////////////////
	
	}else{
		/*caso iniziale*/	
		jQuery("#lblReparti, #lblRepartiElenco").parent().show();
		jQuery("#hRepartiElencoEme, #hRepartiElencoRepe, #hRepartiElencoSostInferm, #hStrutturaRepe, #hStrutturaEme, #hStrutturaSostInferm").val('');
		jQuery('#lblTitolo').css('color','#0000ff'); //torno al colore normale

		//registro la scelta tramite dwr
		//tracciaProfilo(profilo);
	}
}


function tracciaProfilo(profilo){
	
	//alert('dwr Action: '+profilo);
	dwr.engine.setAsync(false);
	dwrTraceUserAction.callTraceUserAction('',profilo.toString(),'TRACCIA_PROFILO','');
	dwr.engine.setAsync(true);
}


function mostraReparti(profilo){
	
	if (document.getElementsByName('cmbStruttura')[0].value != ''){
		
		document.getElementById('hWhereCond').value = document.getElementsByName('cmbStruttura')[0].value;
			
		if (profilo == 'EMERGENZA' || profilo=='METAL'){
			
			jQuery("#lblRepartiEme, #lblRepartiElencoEme").parent().show(500);
			document.getElementById('lblRepartiElencoEme').innerText = '';
			document.getElementById('hRepartiElencoEme').value = '';
			document.getElementById('hStrutturaEme').value =  "'" + document.getElementsByName('cmbStruttura')[0].value + "'";
			
		}else if (profilo == 'REPERIBILITA'){
			
			jQuery("#lblRepartiRepe, #lblRepartiElencoRepe").parent().show(500);
			document.getElementById('lblRepartiElencoRepe').innerText = '';
			document.getElementById('hRepartiElencoRepe').value = '';
			document.getElementById('hStrutturaRepe').value = "'" + document.getElementsByName('cmbStruttura')[0].value + "'";
			
		}else if (profilo == 'SOSTITUZIONE_INFERMIERISTICA'){
			
			jQuery("#lblRepartiSostInferm, #lblRepartiElencoSostInferm").parent().show(500);
			document.getElementById('lblRepartiElencoSostInferm').innerText = '';
			document.getElementById('hRepartiElencoSostInferm').value = '';
			document.getElementById('hStrutturaSostInferm').value = "'" + document.getElementsByName('cmbStruttura')[0].value + "'";
		}else{
		
			//cancello i campi nascosti e resetto la situazione 
			jQuery("#lblRepartiElenco, #lblRepartiEme, #lblRepartiElencoEme, #lblRepartiRepe, #lblRepartiElencoRepe, #lblRepartiSostInferm, #lblRepartiElencoSostInferm").parent().hide(200);
			jQuery("#hRepartiElencoRepe, #hRepartiElencoEme").val('');
		
			//alert('Attenzione! Scegliere una struttura');
		}
	}
}