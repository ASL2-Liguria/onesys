var height = screen.height;
var width = screen.width;

/*
	Funzione utilizzata per ricaricare il frame di Ricerca delle Richieste
	(in particolare della combo-box di scelta del Reparto di Provenienza)
*/

function aggiorna()
{
	//parent.RicercaRichiesteFrame.ricerca();

	var doc = document.frmAggiorna;
	
	doc.action = 'worklistRichieste';
	doc.target = 'RecordRichiesteFrame';
	doc.method = 'POST';
	
	doc.tipo_wk.value = document.form_wkl_richieste.Htipowk.value;
	doc.nome_vista.value = 'VIEW_RICHIESTE_WORKLIST';	
	doc.provenienza.value = 'worklistRichieste';
	doc.hidWhere.value = document.form_wkl_richieste.hidWhere.value;
	//doc.hidOrder.value = document.form_wkl_richieste.hidOrder.value;	
	
	doc.submit();
}

/*
	Funzione richiamata per effettuare la ricerca sulle richieste
*/
function ricerca(pagina)
{
	var nome_campo;
	var value_campo;
	var filtri_footer;
	var stringa = '';
	
	var da_data = document.all.txtDaData.value.substring(6,10) + document.all.txtDaData.value.substring(3,5) + document.all.txtDaData.value.substring(0,2);
	var a_data = document.all.txtAData.value.substring(6,10) + document.all.txtAData.value.substring(3,5) + document.all.txtAData.value.substring(0,2);
	
	if(da_data != '' && a_data != '' && da_data > a_data)
	{
		alert('Attenzione:il filtro DATA FINE è antecedente al filtro A DATA.La ricerca non verrà effettuata');
		return;
	}
	
/*
if(document.form_ric_richieste.inv.checked == 0 && document.form_ric_richieste.pren.checked == 0 && document.form_ric_richieste.acc.checked == 0 && document.form_ric_richieste.eseg.checked == 0 && document.form_ric_richieste.ref.checked == 0 && document.form_ric_richieste.tutte.checked == 0)
*/
	if(document.form_ric_richieste.sel_tipo.value == '')
	{
		alert(ritornaJsMsg('alert_tipo'));
		return;
	}
	if(document.form_ric_richieste.cdc.value == '')
	{
		alert(ritornaJsMsg('alert_cdc'));
		return;
	}	
	
	/*TIPO(layout) == view_richieste_worklist.STATO_RICHIESTA*/
	filtri_footer = 'Tipo: TUTTE ';
	if(document.form_ric_richieste.sel_tipo.value == 'INV')
	{
		nome_campo = 'STATO_RICHIESTA';
		document.form_ric_richieste.htipo.value = 'I';
		value_campo = document.form_ric_richieste.htipo.value;
		filtri_footer = 'Tipo: INV ';
	}
	if(document.form_ric_richieste.sel_tipo.value == 'PREN')
	{
		nome_campo = 'STATO_RICHIESTA';
		document.form_ric_richieste.htipo.value = 'P';
		value_campo = document.form_ric_richieste.htipo.value;
		filtri_footer = 'Tipo: PREN ';
	}
	if(document.form_ric_richieste.sel_tipo.value == 'ACC')
	{
		nome_campo = 'STATO_RICHIESTA';
		document.form_ric_richieste.htipo.value = 'A';
		value_campo = document.form_ric_richieste.htipo.value;
		filtri_footer = 'Tipo: ACC ';
	}
	if(document.form_ric_richieste.sel_tipo.value == 'ESEG')
	{
		nome_campo = 'STATO_RICHIESTA';
		document.form_ric_richieste.htipo.value = 'E';
		value_campo = document.form_ric_richieste.htipo.value;
		filtri_footer = 'Tipo: ESEG ';
	}
	if(document.form_ric_richieste.sel_tipo.value == 'REF')
	{
		nome_campo = 'STATO_RICHIESTA';
		document.form_ric_richieste.htipo.value = 'R';
		value_campo = document.form_ric_richieste.htipo.value;
		filtri_footer = 'Tipo: REF ';
	}
	if(document.form_ric_richieste.sel_tipo.value == 'ANN')
	{
		nome_campo = 'STATO_RICHIESTA';
		document.form_ric_richieste.htipo.value = 'X';
		value_campo = document.form_ric_richieste.htipo.value;
		filtri_footer = 'Tipo: ANN ';
	}

	document.form_ric_richieste.cognome.value = replace_stringa(document.form_ric_richieste.cognome.value, "'");
	document.form_ric_richieste.nome.value = replace_stringa(document.form_ric_richieste.nome.value, "'");

	stringa += " where " + nome_campo + " = '" + value_campo + "'";

/*REPARTO*/
	if(document.form_ric_richieste.sel_tipo.value == 'TUTTE')
		stringa = " where cdc in(" + document.form_ric_richieste.cdc.value + ")";
	else
		stringa += " and cdc in(" + document.form_ric_richieste.cdc.value + ")";
	filtri_footer += 'Cdc: ' + document.form_ric_richieste.cdc.value + ' ';

/*METODICA*/
	nome_campo = 'metodica';
/*Le metodiche possono essere più di una, queste sono separate dal carattere '*' e ritornate dalla funzione ricerca_metodiche
contenuta nella pagina RicercaRichiesteClass*/
	var where_metodiche = ricerca_metodiche();
		
	stringa += where_metodiche;
	if(filtri_footer_metodiche != '')
		filtri_footer += 'Metodiche: ' + filtri_footer_metodiche;

	if(document.form_ric_richieste.nome.value != '')	
	{
		stringa += " and nome_paz like '" + raddoppia_apici(document.form_ric_richieste.nome.value) + "%'";
		filtri_footer += 'Nome: ' + document.form_ric_richieste.nome.value.toUpperCase() + ' ';
	}
	if(document.form_ric_richieste.cognome.value != '')
	{
		stringa += " and cogn_paz like '" + raddoppia_apici(document.form_ric_richieste.cognome.value) + "%'";
		filtri_footer += ' Cognome: ' + document.form_ric_richieste.cognome.value.toUpperCase() + ' ';
	}
	if(document.form_ric_richieste.txtDataNascita.value != '')
	{
		stringa += " and data_nasc like '" + document.form_ric_richieste.txtDataNascita.value + "'";
		filtri_footer +=' Data Nascita:' + document.form_ric_richieste.txtDataNascita.value + ' ';
	}

/*DATA_RICHIESTA*/
	
	/*AGGIUNTA FABIO PER FILTI LAGOSANTO */
	d=new Date();
	giorno=d.getDate();
	
	if (giorno<10) 
	{
	giorno = '0' + giorno;
	}
	
	
	mese=d.getMonth()+1;

	if (mese<10) 
	{
		mese= '0' + mese;
	}
	anno=d.getYear()
	oggi=giorno +'/'+mese+'/'+anno;
	giornifa=giorniMeno(10)

	if(document.form_ric_richieste.sel_tipo.value == 'INV')
	{
		if(document.form_ric_richieste.txtDaData.value == '' || document.form_ric_richieste.txtDaData.value== oggi || document.form_ric_richieste.txtDaData.value== giornifa)
		{

			document.form_ric_richieste.txtDaData.value = '';
		}
		if(document.form_ric_richieste.txtAData.value != '' || document.form_ric_richieste.txtAData.value== oggi || document.form_ric_richieste.txtAData.value== giornifa)
		{
			document.form_ric_richieste.txtAData.value = '';
		}
	}
	if(document.form_ric_richieste.sel_tipo.value == 'PREN')
	{
		if(document.form_ric_richieste.txtDaData.value == '' || document.form_ric_richieste.txtDaData.value== oggi || document.form_ric_richieste.txtDaData.value== giornifa)
		{
			document.form_ric_richieste.txtDaData.value = oggi;
		}
		if(document.form_ric_richieste.txtAData.value != '' || document.form_ric_richieste.txtAData.value== oggi ||document.form_ric_richieste.txtAData.value== giornifa)
		{
			document.form_ric_richieste.txtAData.value = '';
		}
	}
	if(document.form_ric_richieste.sel_tipo.value == 'ACC')
	{
		if(document.form_ric_richieste.txtDaData.value == '' || document.form_ric_richieste.txtDaData.value== oggi || document.form_ric_richieste.txtDaData.value== giornifa)
		{
			document.form_ric_richieste.txtDaData.value = oggi;
		}
		if(document.form_ric_richieste.txtAData.value != '' || document.form_ric_richieste.txtAData.value== oggi || document.form_ric_richieste.txtAData.value== giornifa)
		{
			document.form_ric_richieste.txtAData.value = '';
		}
	}
	if(document.form_ric_richieste.sel_tipo.value == 'ESEG')
	{
		if(document.form_ric_richieste.txtDaData.value == '' || document.form_ric_richieste.txtDaData.value== oggi || document.form_ric_richieste.txtDaData.value== giornifa)
		{
			document.form_ric_richieste.txtDaData.value = '';
		}
		if(document.form_ric_richieste.txtAData.value != '' || document.form_ric_richieste.txtAData.value== oggi || document.form_ric_richieste.txtAData.value== giornifa)
		{
			document.form_ric_richieste.txtAData.value = '';
		}
	}
	if(document.form_ric_richieste.sel_tipo.value == 'REF')
	{
		if(document.form_ric_richieste.txtDaData.value == '' || document.form_ric_richieste.txtDaData.value== oggi || document.form_ric_richieste.txtDaData.value== giornifa)
		{
			document.form_ric_richieste.txtDaData.value = giornifa;
		}
		if(document.form_ric_richieste.txtAData.value != '' || document.form_ric_richieste.txtAData.value== oggi || document.form_ric_richieste.txtAData.value== giornifa)
		{
			document.form_ric_richieste.txtAData.value = oggi;
		}
	}
	if(document.form_ric_richieste.sel_tipo.value== 'ANN')
	{
		if(document.form_ric_richieste.txtDaData.value == '' || document.form_ric_richieste.txtDaData.value== oggi || document.form_ric_richieste.txtDaData.value== giornifa)
		{
			document.form_ric_richieste.txtDaData.value = '';
		}
		if(document.form_ric_richieste.txtAData.value != '' || document.form_ric_richieste.txtAData.value== oggi || document.form_ric_richieste.txtAData.value== giornifa)

		{
			document.form_ric_richieste.txtAData.value = '';
		}
	}
	if(document.form_ric_richieste.sel_tipo.value == 'TUTTE')
	{
		if(document.form_ric_richieste.txtDaData.value == '' || document.form_ric_richieste.txtDaData.value== oggi || document.form_ric_richieste.txtDaData.value== giornifa)
		{

			document.form_ric_richieste.txtDaData.value = giornifa;
		}
		if(document.form_ric_richieste.txtAData.value != '' || document.form_ric_richieste.txtAData.value== oggi || document.form_ric_richieste.txtAData.value== giornifa)

		{
			document.form_ric_richieste.txtAData.value = oggi;
		}
	}



	if(document.form_ric_richieste.sel_tipo.value == 'INV')
	{	
		if(document.form_ric_richieste.txtDaData.value != '')
		{
			stringa += " and data_richiesta_order_by >= '" + formatta_data(document.form_ric_richieste.txtDaData.value) + "'";
			filtri_footer += 'Data Inizio: ' + document.form_ric_richieste.txtDaData.value + ' ';
		}
		
		if(document.form_ric_richieste.txtAData.value != '')
		{
			stringa += " and data_richiesta_order_by <= '" + formatta_data(document.form_ric_richieste.txtAData.value) + "'";
			filtri_footer += 'Data Fine: ' + document.form_ric_richieste.txtAData.value + ' ';
		}
	}
	else
	{
		if(document.form_ric_richieste.txtDaData.value != '')
		{
			stringa += " and DATA_SCHEDULAZIONE_ORDER_BY >= '" + formatta_data(document.form_ric_richieste.txtDaData.value) + "'";
			filtri_footer += 'Data Inizio: ' + document.form_ric_richieste.txtDaData.value + ' ';
		}
		
		if(document.form_ric_richieste.txtAData.value != '')
		{
			stringa += " and DATA_SCHEDULAZIONE_ORDER_BY <= '" + formatta_data(document.form_ric_richieste.txtAData.value) + "'";
			filtri_footer += 'Data Fine: ' + document.form_ric_richieste.txtAData.value + ' ';
		}		
	}
	

/*URGENZA*/
	if(document.form_ric_richieste.filtro.value != 4)
	{
		stringa += " and urgenza = '" + document.form_ric_richieste.filtro.value + "'";
		if(document.form_ric_richieste.filtro.value == 0)
			filtri_footer += 'Filtro Urgenza: NON URGENTE ';
		if(document.form_ric_richieste.filtro.value == 1)
			filtri_footer += 'Filtro Urgenza: URGENTE DIFFERIBILE ';
		if(document.form_ric_richieste.filtro.value == 2)
			filtri_footer += 'Filtro Urgenza: URGENTE ';
		if(document.form_ric_richieste.filtro.value == 3)
			filtri_footer += 'Filtro Urgenza: EMERGENZA ';	
	}

/*REPARTO PROVENIENZA: testata_richieste.IDEN_TAB_PRO = tab_pro.iden*/
	if(document.form_ric_richieste.reparto_prov.value != 0)
	{
		stringa += " and IDEN_TAB_PRO = " + document.form_ric_richieste.reparto_prov.value;//IDEN_REP
		filtri_footer += 'Reparto: ' + document.form_ric_richieste.reparto_prov.options[document.form_ric_richieste.reparto_prov.selectedIndex].text + ' ';
	}

	document.form_ric_richieste.hidWhere.value = stringa;

	document.all.LBL_FLTInfoFiltro.innerText = filtri_footer;

	//alert('WHERE CONDITION: ' + stringa);
	//alert(filtri_footer);
	//alert(resetta_metodiche);
	//alert('PAGINA: ' + pagina);
	
	if(pagina != 'undefined')
		document.form_ric_richieste.pagina_da_vis.value = pagina;

	document.form_ric_richieste.submit();

	if(resetta_metodiche == 'true'){
		dwr.engine.setAsync(false);
		CJsRichieste.gestione_metodica('', cbkMetodiche);
		dwr.engine.setAsync(true);
	}
}


function giorniPiu(gg)
{	
	d=new Date();
	giorno=d.getDate()+gg;
	mese=d.getMonth()+1;
	
	if (giorno<10) 
	{
	giorno = '0' + giorno;
	}
	if (giorno>28) 
	{
		if (mese==2)
		{
			mese=3;
			giorno = '0'+giorno-28;
		}
		if (mese==4 || mese==6 || mese==9  || mese==11)
		{
			mese=mese+1;
			giorno = '0'+giorno-30;
		}
		if (mese==1 || mese==3 || mese==5  || mese==7 || mese==8 || mese==10 || mese==12)
		{
			mese=mese+1;
			giorno = '0'+giorno-31;
		}
	}
	if (mese<10) 
	{
	mese= '0' + mese;
	}
	giornipiu=giorno +'/'+mese+'/'+anno;
	
	return giornipiu;
}


function giorniMeno(gg)
{	
	d=new Date();
	giorno=d.getDate()-gg;
	mese=d.getMonth()+1;
	
	
	if (giorno<1) 
	
	{
		if (mese==3)
		{
			mese=2;
			giorno = 29+giorno;
		}
		else
		{
			if (mese==5 || mese==7 || mese==	10  || mese==12)
			{
				mese=mese-1;
				giorno = 30+giorno;
			}
			else
			{
				if(mese == 1){
					mese = 12;
					anno = anno - 1;
				}
				else
					mese=mese-1;
					
				giorno = 31+giorno;
			}
		}
	}
		if (giorno<10) 
		{
		giorno = '0' + giorno;
		}
		if (mese<10) 
		{
			mese= '0' + mese;
		}
	
	giornimeno=giorno +'/'+mese+'/'+anno;
	
	return giornimeno;
}


function cbkMetodiche()
{
	if(resetta_metodiche == 'false')
		CJsRichieste = null;
}

function formatta_data(data_)
{
	var giorno = data_.substring(0,2);
	var mese = data_.substring(3,5);
	var anno = data_.substring(6,10);
	var a_m_g = anno.toString() + mese.toString() + giorno.toString();
	return a_m_g;
}

/*
	Devo selezionare una richiesta alla volta anche se dello stesso paziente poichè
	vi sarebbero 2 o più testate da passare alla scheda esame.Impossibile per questa
	visualizzarne più di una alla volta
*/
function accettazione()
{ 
	/*INFOWEB.anag.iden or INFOWEB.testata_richieste.iden_anag*/
	var iden_anag;
	var idenAnag;
	
	if(vettore_indici_sel.length == 0 || vettore_indici_sel.length > 1)
	{
		if(vettore_indici_sel.length > 1)
			alert(ritornaJsMsg("selezionare_una_richiesta"));
		else
			alert(ritornaJsMsg("selezionare"));
		return;
	}
	
	if(!controllo_stato_richieste())
	{
		var elenco_richieste_da_accettare = stringa_codici(iden_worklist);
		if(elenco_richieste_da_accettare == '')
		{
			alert(ritornaJsMsg("selezionare"));
			return;
		}

		try
		{
			idenAnag = stringa_codici(array_iden_anag);
			iden_anag = idenAnag;
		}
		catch(e)
		{
			idenAnag = stringa_codici(array_iden_anag).split('*');
			iden_anag = idenAnag[0];
		}
	

		//alert('IDEN_RICHIESTE: ' + elenco_richieste_da_accettare);
		//alert('radsql.ANAG.iden: ' + iden_anag);
		
		
		/*Controllo se il paziente è READONLY*/	
		if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
		{
			alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
			return;		
		}
		/**/

		apri_accettazione(iden_anag);
	}
}

/*
	@valore: contiene come primo elemento l'eventuale iden o errore
			 -1: errore
			  0: COD_EST_ANAG.iden_infoweb_anag non trovato => apertura ricerca paziente
			  COD_EST_ANAG.iden_anag esiste l'associazione delle richiesta con l'anagrafica in radsql;
			
			 come secondo lo stato dell'esame (A, P)  
			 come terzo valore INFOWEB.anag.iden

function cbkJsAccettaPrenota(idenAnag_statoEsame)
{
	var idenAnag_stato = idenAnag_statoEsame.split('@'); 
	//alert('radsql.ANAG.iden: ' + idenAnag_stato[0]);
	//alert('STATO: ' + idenAnag_stato[1]);
	//alert('INFOWEB.ANAG.iden ' + idenAnag_stato[2]);

	if(idenAnag_stato[0] == -1)
	{
		alert(idenAnag_stato[0]);//errore 
		return;
	}
	else
		if(idenAnag_stato[0] == 0)
		{
			//Apertura dell ricerca del paziente per effettuare l'accettazione della richiesta
			apri_ric_paz_accettazione(idenAnag_stato);
		}
		else
		{
			//Cod_est_anag già valorizzato.Apertura della scheda esame per accettazione.
			//Passo a Jack solo radsql.anag.iden
			apri_accettazione(idenAnag_stato[0]);
		}
}
*/

/*
	Caso in cui non vi è l'associazione fra un paziente in infoweb e radsql (quindi non esiste l'associazione
	in cod_est_anag ovvero iden_infoweb_anag valorizzato);
	quindi verrà aperta la Ricerca del Paziente per nome, cognome e data.
	Il menù di questa worklist presenta: Inserimento, Modifica, Cancellazione paziente + Accettazione
*/
function apri_ric_paz_accettazione(idenAnag_stato)
{
	alert('VERIFICA DI UTILIZZO?????');
	var nome_paz 	     = stringa_codici(array_nome_paz).split('*'); 
	var cogn_paz 	     = stringa_codici(array_cogn_paz).split('*'); 
	var data_nasc 	     = stringa_codici(array_data_nasc).split('*'); 
	var sesso_paz 	     = stringa_codici(array_sesso).split('*'); 
	var stato_esame      = idenAnag_stato[1];
	var funzione 		 = "ric_cogn_nome_data(";
	var infowebIden_anag = idenAnag_stato[2];
	/*testata_richieste.iden*/
	var elenco_richieste_da_accettare = stringa_codici(iden_worklist);

	//var param = 'RicPazFrameset?';
	var param = 'SL_RicercaPazienteFrameset?';
	param += 'menuVerticalMenu=worklistRichieste&';
	param += 'provenienza=worklistRichieste&';
	param += 'rows_frame_uno=141&';
	param += 'rows_frame_due=380,*&';
	param += 'param_ric=COGN,NOME,DATA&';
	param += 'nome_paz=' + nome_paz[0] + '&';
	param += 'cogn_paz=' + cogn_paz[0] + '&';
	param += 'data_nasc=' + data_nasc[0] + '&';
	param += 'sesso_paz=' + sesso_paz[0] + '&';
	param += 'nome_funzione_ricerca=' + funzione + '&';
	
	param += 'elenco_richieste_da_accettare='+ elenco_richieste_da_accettare + '&';
	param += 'tipo_registrazione=' + stato_esame + '&';
	param += 'IDEN_INFOWEB_ANAG=' + infowebIden_anag;

	top.mainFrame.workFrame.document.location.replace(param);
}


/*
	Caso in cui verrà aperta la scheda esame per effettuare l'accettazione delle richieste.
	Esiste già l'associazione del paziente di infoweb con radsql, quindi passerò a Jack
	solo rad_sql.ANAG.iden così lui eviterà di fare l'update su cod_est_anag.
	
	@param radsql.ANAG.iden
*/
function apri_accettazione(anag_iden)
{
	var query = null;
	/*testata_richieste.iden*/
	testata_richiesteIden = stringa_codici(iden_worklist);
	
	query = 'select IDEN_TAB_ESA FROM infoweb.DETTAGLIO_RICHIESTE ';
	query += "where metodica <>  '0' and ";
	query += 'iden_testata=';
	
	//alert(query + '  ' + testata_richiesteIden + '  ' + anag_iden);return;
	
	dwr.engine.setAsync(false);
	CJsRichieste.trova_tab_esaIden(query + '@' + testata_richiesteIden + '@' + anag_iden, cbkTrovaTabEsaIden);
	dwr.engine.setAsync(true);
}

function cbkTrovaTabEsaIden(tabEsaIden_anagIden)
{
	//alert(tabEsaIden_anagIden);
	var spl = tabEsaIden_anagIden.split('@');
	var url_send = 'sceltaEsami?';
	
	url_send += "Hiden_infoweb_richiesta=" + stringa_codici(iden_worklist) + "&";
	url_send += "tipo_registrazione=IR&";
	url_send += "Hiden_esa=" + spl[0] + "&";
	url_send += "Ha_sel_iden=" + spl[0];
	
	var win_scheda_esame = window.open(url_send, 'winAccettazioneRichiesta', 'width=1000, height=1000, status=yes, top=0, left=0, scrollbars=yes')
	if(win_scheda_esame)
		win_scheda_esame.focus();
	else
		win_scheda_esame = window.open(url_send, 'winAccettazioneRichiesta', 'width=1000, height=1000, status=yes, top=0, left=0, scrollbars=yes')
}

/*
	Funzione che passa i parametri SchedaEsame

function esami(scelta_scheda_esame, stato_esame, esame_paz)
{
	alert('funzione esami');
	var iden_anag = stringa_codici(array_iden);
	if(iden_anag == '')
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	document.form_accetta_paziente.Hiden_anag.value = iden_anag;
	document.form_accetta_paziente.tipo_registrazione.value = stato_esame;
	document.form_accetta_paziente.Hiden_esa.value = esame_paz;
	document.form_accetta_paziente.submit();
}
*/
function prenotazione()
{
	var iden_anag;
	var idenAnag;
	var query = null;
	
	if(vettore_indici_sel.length == 0 || vettore_indici_sel.length > 1)
	{
		if(vettore_indici_sel.length > 1)
			alert(ritornaJsMsg("selezionare_una_richiesta"));
		else
			alert(ritornaJsMsg("selezionare"));
		return;
	}
	
	if(!controllo_stato_richieste())
	{
		var elenco_richieste_da_accettare = stringa_codici(iden_worklist);
		if(elenco_richieste_da_accettare == '')
		{
			alert(ritornaJsMsg("selezionare"));
			return;
		}


		try
		{
			idenAnag = stringa_codici(array_iden_anag).split('*');
			iden_anag = idenAnag[0];
		}
		catch(e)
		{
			idenAnag = stringa_codici(array_iden_anag);
			iden_anag = idenAnag;
		}
		
		
		/*Controllo se il paziente è READONLY*/	
		if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
		{
			alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
			return;		
		}
		/**/
		
		testata_richiesteIden = stringa_codici(iden_worklist);

		query = 'select IDEN_TAB_ESA FROM infoweb.DETTAGLIO_RICHIESTE ';
		query += "where metodica <>  '0' and ";
		query += 'iden_testata=';
		
		dwr.engine.setAsync(false);
		CJsRichieste.trova_tab_esaIden(query + '@' + testata_richiesteIden + '@' + iden_anag, cbkTrovaTabEsaIdenPren);		
		dwr.engine.setAsync(true);
	}
}

function cbkTrovaTabEsaIdenPren(tabEsaIden_anagIden)
{
	var spl = tabEsaIden_anagIden.split('@');

	var url_send = "prenotazioneFrame?servlet=sceltaEsami%3Ftipo_registrazione%3DP%26Hiden_infoweb_richiesta%3D" + stringa_codici(iden_worklist) + "%26Ha_sel_iden%3D" + spl[0] + "%26cmd_extra%3Dparent.parametri%253Dnew+Array('RICHIESTE')%3B%26next_servlet%3Djavascript%3Acheck_richiesta_prenota()%3B%26Hclose_js%3Dchiudi_prenotazione()%3B&events=onunload&actions=libera('" + baseUser.IDEN_PER + "', '"+basePC.IP+"');&";
		
	parent.document.location.replace(url_send);
}

/*
	Funzione che effettua il controllo se le richieste selezionate sono INVIATE (TR.stato_richiesta == 'I')
*/
function controllo_stato_richieste()
{
	var errore = false;
	var stato = stringa_codici(array_stato_richiesta);
    //alert('STATO RICHIESTA: ' + stato);
	
	var stati = stato.split('*');
		
	for(i = 0; i < stati.length; i++)
	{
		if(stati[i] != 'I')
		{
			errore = true;
			alert(ritornaJsMsg("stato_inviato"));//alert('La richiesta deve essere nello stato inviato');
			i = stati.lenght;
		}
	}
		
	
	return errore;
}


/*
	ANNULLAMENTO DI UNA RICHIESTA PER VOLTA
	Effettua una update su INFOWEB.testata_richiesta:
	STATO = 'A'
	UTE_ANNULLA
	COD_DEC_UTE_ANNULLA
	RICHIESTA_CONTROLLATA = 'S'
	UTE_CONTROLLO
	COD_DEC_UTE_CONTROLLO
	MOTIVO_ANNULLAMENTO
*/
function annulla()
{
	var numero_record_selezionati = vettore_indici_sel.length;
	if(numero_record_selezionati == 0 || numero_record_selezionati > 1)
	{
		if(numero_record_selezionati == 0)
			alert(ritornaJsMsg("selezionare"));
		else	
			alert(ritornaJsMsg("selezionare_una_richiesta"));
		return;
	}
	
	var iden_anag = stringa_codici(array_iden_anag);
	/*Controllo se il paziente è READONLY*/	
	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	
	
	if(!controllo_stato_richieste())
	{
		var iden_richiesta = stringa_codici(iden_worklist);
		document.frm_motivo_annullamento.action = 'SL_MotivoAnnullamentoRichiesta';
		document.frm_motivo_annullamento.target = 'annulla_richiesta';
		
		var win_annulla_richiesta = window.open('','annulla_richiesta', 'width=700,height=250, resizable = yes, status=yes, top=300,left=150');
		if(win_annulla_richiesta)
		{
			win_annulla_richiesta.focus();
		}
		else
	 		win_annulla_richiesta = window.open('','annulla_richiesta', 'width=700,height=250, resizable = yes, status=yes, top=300,left=150');
	
		document.frm_motivo_annullamento.iden_richiesta.value = iden_richiesta;
		document.frm_motivo_annullamento.submit();
	}
}


/*
	Rende la richiesta selezionata (una sola per volta) controllata ovvero il campo richiesta_controllata = 'S'
	aggiorna anche i campi ute_controllo e cod_dec_ute_controllo.
	Questa operazione viene gestita con ajax.
*/
function richiesta_controllata()
{
	var numero_record_selezionati = vettore_indici_sel.length;
	if(numero_record_selezionati == 0 || numero_record_selezionati > 1)
	{
		if(numero_record_selezionati == 0)
			alert(ritornaJsMsg("selezionare"));
		else
			alert(ritornaJsMsg("selezionare_una_richiesta"));
		return;
	}
	
	/*Controllo se il paziente è READONLY*/	
	var iden_anag = stringa_codici(array_iden_anag);
	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	
	
	if(!controllo_stato_richieste())
	{
		var iden_richiesta = stringa_codici(iden_worklist);
		//alert(iden_richiesta);
		dwr.engine.setAsync(false);
		CJsRichieste.richiesta_controllata(iden_richiesta, cbkRichiestaControllata);
		dwr.engine.setAsync(true);
	}
}

/*
	Funzione di callback dopo aver reso controllata una richiesta
*/
function cbkRichiestaControllata(message)
{
	if(message == '')
		aggiorna();
	else
		alert(message);
}

/*
	Nella worklist delle richieste dal link dei dati del paziente verrà aperta una pagina di sola
	visualizzazione della richiesta
*/
function visualizza_richiesta(riga)
{
	var doc = document.form_vis_richiesta;
	doc.action = 'SL_VisualizzaRichiesta?readonly=true';//VisualizzaRichiesta
	doc.target = 'winVisRich';
	
	var iden_richiesta='';
	if (riga.toString()=="")
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	iden_richiesta = iden_worklist[riga];
	
	doc.iden.value = iden_richiesta;//doc.iden_richiesta
	doc.iden_anag.value = array_iden_anag[riga];
	
	var finestra = window.open("","winVisRich","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra = window.open("","winVisRich","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	doc.submit();
}


/*
	Funzione per effettuare la visualizzazione delle informazioni di ogni richiesta

function vis_pop(idx)
{
	var cont = "<table class='body_info'>";
	cont += "<tr>";
	cont += "<td class = 'titolo'>" + document.form_wkl_richieste.esa_prenotati.value + "</td>";
	cont += "</tr>";
	cont += "<tr>";
	cont += "<td>" + array_informazioni[idx][0] + "</td>";
	cont += "</tr>";
	
	if(array_informazioni[idx][1] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'titolo'>" + document.form_wkl_richieste.med_pre.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td>" + array_informazioni[idx][1]+"</td>";
		cont += "</tr>";
	}
	
	if(array_informazioni[idx][2] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'titolo'>" + document.form_wkl_richieste.ope_rich.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td>" + array_informazioni[idx][2] + "</td>";
		cont += "</tr>";
	}
	
	
	if(array_informazioni[idx][3] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'titolo'>" + document.form_wkl_richieste.stato_paziente.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td>" + array_informazioni[idx][3] + "</td>";
		cont += "</tr>";
	}
	
	if(array_informazioni[idx][4] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'titolo'>" + document.form_wkl_richieste.quesito.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td>" + array_informazioni[idx][4] + "</td>";
		cont += "</tr>";
	}
	
	if(array_informazioni[idx][5] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'titolo'>" + document.form_wkl_richieste.quadro_cli.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td>" + array_informazioni[idx][5] + "</td>";
		cont += "</tr>";
	}

	if(array_informazioni[idx][6] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'titolo'>" + document.form_wkl_richieste.ope_contr.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td>"+  array_informazioni[idx][6]+"</td>";
		cont += "</tr>";
		cont += "<tr>";
	}
	
	if(array_informazioni[idx][7] != '')
	{
		cont += "<td class = 'titolo'>" + document.form_wkl_richieste.ope_annulla.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td>" + array_informazioni[idx][7] + "</td>";
		cont += "</tr>";
	}
	
	cont += "</table>";
	
	popup(cont, '#f0ffff',100);
}
*/


/*
	Funzione per la paginazione associata al pulsante 'Avanti' della worklist delle Richieste
	@param pagina indica la pagina successiva a quella corrente
*/
function avanti(pagina)
{
	document.form_wkl_richieste.pagina_da_vis.value = pagina;
	document.form_wkl_richieste.submit();
}

/*
	Funzione per la paginazione associata al pulsante 'Indietro' della worklist delle Richieste
	@param pagina indica la pagina precedente a quella corrente
*/
function indietro(pagina)
{
	document.form_wkl_richieste.pagina_da_vis.value = pagina;
	document.form_wkl_richieste.submit();
}

/*
	Funzione che apre la finestra di scelta dei centri di costo
*/
function gestioneCDC()
{
	var doc = document.form_gest_cdc;
	
	parent.document.all.oFramesetGesRichieste.rows = '167,*,0';
	
	doc.action='SL_GestFiltroCDC';
	doc.target='gest_cdc';
	
	doc.nome_funzione_applica.value = 'applica_richieste()';
	doc.nome_funzione_chiudi.value = 'chiudi()';
	doc.hCdc.value = document.form_ric_richieste.cdc.value;
	
	window.open('', 'gest_cdc','width=1000,height=600, status=yes, top=10,left=10');
	
	doc.submit();
}			

/*
	Funzione richiamata per effettuare l'aggiornamento delle provenienze in base alla scelta dei
	centri di costo.Infatti tale funzione è richiamata dopo aver premuto il pulsante 'Applica' della 
	finestra di scelta dei centri di costo
	@param cdc indica l'elenco dei centri di costo scelti dalla finestra della selezione dei cdc
*/
function ass_reparto_prov_cdc(cdc)
{
	if(cdc  == '')
		cdc = document.form_ric_richieste.cdc.value;
	document.form_ass_prov_cdc.elenco_cdc.value = cdc;
	document.form_ass_prov_cdc.submit();
}

/*
	Funzione utilizzata per effettuare la cancellazione degli elementi del combo-box delle provenienze
*/
function remove_option_provenienze()
{
	var num_options = parent.RicercaRichiesteFrame.document.form_ric_richieste.reparto_prov.length;
	for(idx = num_options; idx > 0; idx--)
	{
		parent.RicercaRichiesteFrame.document.form_ric_richieste.reparto_prov.options.remove(idx);
		parent.RicercaRichiesteFrame.document.form_ric_richieste.reparto_prov.options[idx]=null;
		parent.RicercaRichiesteFrame.document.form_ric_richieste.reparto_prov.length = 1;
	}
}

/*
	Funzione utilizzata per caricare le nuove provenienze derivanti dalla scelta dei nuovi centri
	di costo.
	@param idx   
	@param id 	  indica il value da mettere nelle option della combo-box delle provenienze	
	@param descr  indica la descrizione dell'elemento del combo-box delle provenienze	
	@param el	  indica il nome dell'elemento combo-box provenienze
*/
function update_elemento(idx, id, descr, el)
{
	if(el != null && idx > 0)
	{
		parent.RicercaRichiesteFrame.document.form_ric_richieste.reparto_prov.options[idx] = new Option(descr, id);
	}
}

function raddoppia_apici(value)
{
	var stringa = value.replace(/\'/g, "\'\'");//var stringa = value.replace('\'', '\'\'');
	return stringa;
}

function intercetta_tasti()
{
	if(window.event.keyCode==13)
	{
		window.event.keyCode = 0;
		document.form_ric_richieste.cognome.value = document.form_ric_richieste.cognome.value.toUpperCase();
		document.form_ric_richieste.nome.value = document.form_ric_richieste.nome.value.toUpperCase();
		ricerca();
  	}
}

function ricerca_metodiche()
{
	var valore_campo;
	var where = '';
	filtri_footer_metodiche = '';
	
	var metodiche = '';
	
	//alert('METODICHE DB ' + document.form_ric_richieste.hMetodica.value);
	
	if(document.form_ric_richieste.hMetodica.value != '')
	{
		try{
			metodiche = document.form_ric_richieste.hMetodica.value.split(",");
		}
		catch(e){
			metodiche = document.form_ric_richieste.hMetodica.value;
		}

		
		/*if(metodiche.length > 0)
		{
			for(i = 0; i < metodiche.length; i++)
				where += " AND METODICA LIKE " + metodiche[i];
		}25.03.2008*/

		
		
		if(metodiche.length > 0)
		{
			for(i = 0; i < metodiche.length; i++)
				if(i==0)
				   where += " AND (METODICA LIKE " + metodiche[i];
				else
				   where += " OR METODICA LIKE " + metodiche[i];
			
			where = where + ')';
		}
		
		
		
	}
	
	//alert('where metodiche: ' + where);
	return (where);
}

function apri_metodiche()
{
	win_metodica = window.open('SL_Gestione_Metodiche_Richieste', '', 'width=1000,height=600, status=yes, top=10,left=10');
}

function resetta()
{
	var doc = document.form_ric_richieste;
	doc.txtDaData.value 	 = '';
	doc.txtAData.value 		 = '';
	doc.cognome.value 		 = '';
	doc.nome.value 			 = '';
	doc.txtDataNascita.value = '';
	doc.filtro.value 		 = '4';
	doc.sel_tipo.value 		 = 'INV';//TUTTE
	doc.reparto_prov.value 	 = '0';
	document.all.LBL_FLTInfoFiltro.innerText 		 = 'Tipo: INV';
	
	/*Metodiche*/
	doc.hMetodica.value = '';
	
	document.all.td_metodica_field.innerText = ritornaJsMsg('nms');//'Nessuna Metodica Selezionata';
	document.all.td_metodica_field.title = ritornaJsMsg('nms');//'Nessuna Metodica Selezionata';
	document.all.td_metodica_label.title = ritornaJsMsg('nms');//'Nessuna Metodica Selezionata';
	resetta_metodiche = 'true';
}


/*Visualizza gli esami del paziente che ha la richiesta*/
function visualizza_esami_paziente()
{
	var anagrafica = '';
	var posizione_asterix = -1;
	var doc = document.form_visualizza_esami;

	doc.target = 'AssociaReparti_CdcFrame';
	doc.action = 'worklist';
	doc.tipowk.value = 'WK_VIS_ESAMI_RICHIESTE';
	//doc.namecontextmenu.value = '';
	
	anagrafica = stringa_codici(array_iden_anag);
	
	//alert('ANAG.iden: ' + anagrafica);
	
	try{
		posizione_asterix = anagrafica.indexOf("*");
	}
	catch(e){
		posizione_asterix = -1;
	}
	
	if(posizione_asterix != -1){
		alert(ritornaJsMsg("selezionare_una_richiesta"));
		return;
	}
	else
	{
		parent.document.all.oFramesetGesRichieste.rows = '167,*,300';
		doc.hidWhere.value = 'where iden_anag = ' + anagrafica;
		doc.submit();	
	}
}


function apri_chiudi()
{
	ShowHideLayer('div');
	riposiziona_frame_righe('167', parent.document.all.oFramesetGesRichieste, '50');
}


/**
Bug 1116
*/
function aperturaSchede(){
	var keyId = null;	
	var url = null;
	
	keyId = stringa_codici(iden_worklist);
	url = 'servletGenerator?KEY_GRUPPO=RICHIESTE&KEY_ID=' + keyId;
	url += '&FILTRO=' + keyId;
	
	var finestra = window.open(url, 'winSchede','width='+width+',height='+height+', resizable = yes, status=yes, top=0,left=0');
}


/**
*/
function gestioneCalendario(){
	jQuery('#txtDaData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});	
	
	jQuery('#txtAData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
	
	jQuery('#txtDataNascita').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});

}


function caricamento(){
	try{
		connectDragDropToObjectById();
		// definisco la funzione di callback
		// che DOVRA' accettare in ingresso 2 parametri (nomeCampo, variazioneRelativa
		setCallBackAfterDragDrop("callBackFunctionAfterColResizing");
	}
	catch(e){
		alert(e.description);
	}
}