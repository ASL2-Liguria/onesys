/* Variabile globali */
var sSql = '';
var id_esame = '';
var ins_art = '1';

/* Funzioni per la pagina */
function desel_tutto(val)
{
	var i;
	
	for(i = 0; i < document.gestione_scarico.sElencoEsami.length; i++)
	{
		document.gestione_scarico.sElencoEsami.options(i).selected = val;
	}
}

function seleziona_tutto()
{
	desel_tutto(true);
}

function deseleziona_tutto()
{
	desel_tutto(false);
}

function pulisci_elenco(elSorg)
{
	var i;
	
	if(elSorg != null)
	{
		for(i = elSorg.length; i >= 0; i--)
		{
			elSorg.options.remove(i);
		}
	}
}

function find_elemento(ric, elSorg)
{
	var i;
	var idxRet = -1;
	var a_ric = ric.split('#');
	var a_scar;
	
	ric = trim(ric);
	
	if(ric != '' && elSorg != null)
	{
		for(i=0; i < elSorg.length && idxRet == -1; i++)
		{
			/*if(elSorg.options(i).value.indexOf(ric) >= 0)
			{
				idxRet = i;
			}*/
			
			a_scar = elSorg.options(i).value.split('#');
			
			if(a_scar[0] == a_ric[0] && a_scar[1] == a_ric[1] && a_scar[2] == a_ric[2] && a_scar[3] == a_ric[3] && a_scar[4] == a_ric[4] && a_scar[5] == a_ric[5] && a_scar[7] == a_ric[7])
			{
				idxRet = i;
			}
		}
	}
	
	return idxRet;
}

function add_elemento(id, descr, el)
{
	if(el != null)
	{
		var oOpt = document.createElement('Option');
		
		oOpt.text = descr;
		oOpt.value = id;
		el.add(oOpt);
	}
}

function remove_elemento(idx, elSorg)
{
	if(idx >-1 && elSorg != null)
	{
		elSorg.options.remove(idx);
	}
}

function disattiva_ricerca(ric)
{
	if(ric == '0')
	{
		document.gestione_scarico.txtDescr.readOnly = true;
		document.gestione_scarico.txtCodiceBarre.readOnly = true;
		document.gestione_scarico.txtCodice.readOnly = false;
		document.gestione_scarico.txtCodice.focus();
	}
	
	if(ric == '1')
	{
		document.gestione_scarico.txtCodice.readOnly = true;
		document.gestione_scarico.txtDescr.readOnly = true;
		document.gestione_scarico.txtCodiceBarre.readOnly = false;
		document.gestione_scarico.txtCodiceBarre.focus();
	}
	
	if(ric == '2')
	{
		document.gestione_scarico.txtCodice.readOnly = true;
		document.gestione_scarico.txtCodiceBarre.readOnly = true;
		document.gestione_scarico.txtDescr.readOnly = false;
		document.gestione_scarico.txtDescr.focus();
	}
}

function intercetta_tasti()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
		cerca_materiale();
	}
}

function sel_des(elenco, valore)
{
	if(elenco != null && valore != null)
	{
		var i;
		for(i = 0; i < elenco.length; i++)
		{
			elenco[i].selected = valore;
		}
	}
}

function genera_codice_lista(elSorg)
{
	var i;
	var codRet = '';
	
	if(elSorg != null)
	{
		for(i=0; i < elSorg.length; i++)
		{
			if(codRet != '')
			{
				codRet += '*';
			}
			codRet += elSorg.options(i).value;
		}
	}
	
	return codRet;
}

function oggi()
{
	var data = new Date();
	var dd = '00' + data.getDate();
	var mm = '00' + (data.getMonth() + 1);
	var yyyy = data.getYear();
	
	dd = dd.substr(dd.length-2, dd.length);
	mm = mm.substr(mm.length-2, mm.length);
	
	return yyyy + mm + dd;
}

function formatta_data(data)
{
	return data == '' ? '':data.substr(6, 2) + '/' + data.substr(4, 2) + '/' + data.substr(0, 4);
}

/* PARTE DELL'ELENCO ARTICOLI */
function verifica_articoli()
{
	sSql = 'select distinct MG_ART.IDEN, MG_ART.DESCR, MG_ART.COD_ART, MG_ART.COD_BAR, MG_GIACENZE.GIACENZA, MG_ART.MDC_SINO ';
	sSql += 'from MG_ART, MG_MOV, MG_GIACENZE ';
	sSql += "where MG_ART.ATTIVO = 'S' and MG_MOV.IDEN_MAGAZZINO = " + document.gestione_scarico.hMagazzino.value + " and MG_ART.IDEN = MG_MOV.IDEN_ART and MG_GIACENZE.IDEN_ART = MG_ART.IDEN and MG_GIACENZE.IDEN_MAGAZZINO = MG_MOV.IDEN_MAGAZZINO ";
	sSql += 'order by MG_ART.DESCR';
	
	scaricoDWR.ricava_dati_articoli(sSql, carica_articoli);
}

function carica_articoli(vRet)
{
	var a_tmp;
	var a_iden;
	var a_descr;
	var a_cod_art;
	var a_cod_bar;
	var a_giacenza;
	var a_mdc;
	var idx;
	var spazi = '                                                                                        ';
	var txt_tmp;
	var oValue;
	var oText;
	
	pulisci_elenco(document.gestione_scarico.sElencoArt);
	
	if(vRet != null && vRet != '')
	{
		a_tmp = vRet.split("@@");
		
		a_iden 		= a_tmp[0].split("##");
		a_descr 	= a_tmp[1].split("##");
		a_cod_art 	= a_tmp[2].split("##");
		a_cod_bar 	= a_tmp[3].split("##");
		a_giacenza 	= a_tmp[4].split("##");
		a_mdc		= a_tmp[5].split("##");
		
		for(idx = 0; idx < a_iden.length; idx++)
		{
			txt_tmp = a_cod_bar[idx] + spazi;
			oText = txt_tmp.substr(0, 30);
			
			txt_tmp = a_giacenza[idx] + spazi;
			oText += txt_tmp.substr(0, 10);
			
			txt_tmp = a_descr[idx] + spazi;
			oText += txt_tmp.substr(0, 70);
			
			txt_tmp = a_cod_art[idx] + spazi;
			oText += txt_tmp.substr(0, 30);
			
			oValue = a_iden[idx] + '#' + a_cod_art[idx] + '#' + a_cod_bar[idx] + '#' + a_descr[idx] + '#' + a_mdc[idx];
			
			add_elemento(oValue, oText, document.gestione_scarico.sElencoArt);
		}
	}
	else
	{
		//alert('Errore durante il caricamento degli articoli!');
	}
	
	check_default_opt();
}

/* PARTE DEL LOTTO */
function verifica_lotto(idx)
{
	var id_art;
	var a_id;
	var ret;
	
	pulisci_elenco(document.gestione_scarico.selLotto);
	
	if(idx >= 0)
	{
		id_art = document.gestione_scarico.sElencoArt.options(idx).value;
		a_id = id_art.split("#");
		
		sSql = 'select COD_LOTTO, DATA_SCAD, IDEN, QTA ';
		sSql += 'from MG_QTA_LOTTO ';
		sSql += 'where DATA_SCAD >= \'' + oggi() + '\' and ';
		sSql += 'IDEN_ART = ' + a_id[0];
		sSql += ' order by DATA_SCAD desc';
		
		scaricoDWR.ricava_dati(sSql, carica_lotto);
	}
}

function carica_lotto(vRet)
{
	var a_tmp;
	var a_cod_lotto;
	var a_data_scad;
	var a_iden;
	var a_qta;
	var lung = 0;
	var i;
	
	if(vRet != null && vRet != '' && vRet != 'null')
	{
		a_tmp = vRet.split("*");
		a_cod_lotto = a_tmp[0].split(",");
		a_data_scad = a_tmp[1].split(",");
		a_iden = a_tmp[2].split(",");
		a_qta = a_tmp[3].split(",");
		lung = a_cod_lotto.length;
	}
	else
	{
		
	}
	
	if(lung > 0)
	{
		for(i = 0; i < lung; i++)
		{
			add_elemento(a_cod_lotto[i] + '#' + a_data_scad[i] + '#' + a_iden[i] + '#' + a_qta[i], a_cod_lotto[i] + ' - ' + formatta_data(a_data_scad[i]), document.gestione_scarico.selLotto);
		}
	}
	
	if(document.gestione_scarico.sElencoArt.selectedIndex >= 0 && ins_art == null)
	{
		aggiungi_materiale();
	}
	
	ins_art = '1';
}

function set_tipo(val)
{
	document.gestione_scarico.hTipo.value = val;
}

/* MAGAZZINO */
function cambia_maga()
{
	document.gestione_scarico.hMagazzino.value = document.gestione_scarico.selMaga.options(document.gestione_scarico.selMaga.selectedIndex).value;
	document.gestione_scarico.hDescrMagazzino.value = document.gestione_scarico.selMaga.options(document.gestione_scarico.selMaga.selectedIndex).text;
	
	verifica_articoli();
}

/* RICERCA */
function pulisci()
{
	document.gestione_scarico.txtCodice.value = '';
	document.gestione_scarico.txtCodiceBarre.value = '';
	document.gestione_scarico.txtDescr.valuevalue = '';
	
	if(document.gestione_scarico.optRicerca[0].checked)
	{
		document.gestione_scarico.txtCodice.focus();
	}
	else
	{
		if(document.gestione_scarico.optRicerca[1].checked)
		{
			document.gestione_scarico.txtCodiceBarre.focus();
		}
		else
		{
			document.gestione_scarico.txtDescr.focus();
		}
	}
}

function cerca_materiale()
{
	var ok = true;
	
	// Ricerca per codice
	if(document.gestione_scarico.optRicerca[0].checked)
	{
		if(document.gestione_scarico.txtCodice.value != '')
		{
			document.gestione_scarico.txtCodice.value = document.gestione_scarico.txtCodice.value.toUpperCase();
			document.gestione_scarico.sElencoArt.selectedIndex = ricava_indice(document.gestione_scarico.sElencoArt.selectedIndex, document.gestione_scarico.txtCodice.value, 1);
		}
		else
		{
			alert('Inserire codice!');
		}
	}
	
	// Ricerca per codice barre
	if(document.gestione_scarico.optRicerca[1].checked)
	{
		if(document.gestione_scarico.txtCodiceBarre.value != '')
		{
			document.gestione_scarico.txtCodiceBarre.value = document.gestione_scarico.txtCodiceBarre.value.toUpperCase();
			document.gestione_scarico.sElencoArt.selectedIndex = ricava_indice(document.gestione_scarico.sElencoArt.selectedIndex, document.gestione_scarico.txtCodiceBarre.value, 2);
		}
		else
		{
			alert('Inserire codice barre!');
		}
	}
	
	// Ricerca per descrizione
	if(document.gestione_scarico.optRicerca[2].checked)
	{
		if(document.gestione_scarico.txtDescr.value != '')
		{
			document.gestione_scarico.txtDescr.value = document.gestione_scarico.txtDescr.value.toUpperCase();
			document.gestione_scarico.sElencoArt.selectedIndex = ricava_indice(document.gestione_scarico.sElencoArt.selectedIndex, document.gestione_scarico.txtDescr.value, 3);
		}
		else
		{
			alert('Inserire descrizione!');
		}
	}
	
	if(document.gestione_scarico.chkSens.checked)
	{
		ins_art = '1';
	}
	else
	{
		ins_art = null;
	}
	
	verifica_lotto(document.gestione_scarico.sElencoArt.selectedIndex);
}

function ricava_indice(idx, ric, pos)
{
	var ret_idx = -1;
	var esci	= false;
	var a_tmp;
	var primo;
	var i;
	
	if(idx < 0)
	{
		idx = 0;
		primo = false;
	}
	else
	{
		idx++;
		primo = true;
	}
	
	while(!esci)
	{
		for(i = idx; i < document.gestione_scarico.sElencoArt.length; i++)
		{
			a_tmp = document.gestione_scarico.sElencoArt.options(i).value.split("#");
			
			
			if(document.gestione_scarico.chkSens.checked)
			{
				if(a_tmp[pos].indexOf(ric) >= 0)
				{
					ret_idx = i;
					break;
				}
			}
			else
			{
				if(a_tmp[pos] == ric)
				{
					ret_idx = i;
					break;
				}
			}
		}
		if(ret_idx == -1 && primo)
		{
			idx = 0;
			primo = false;
		}
		else
		{
			esci = true;
		}
	}
	
	return ret_idx;
}

/* PARTE DI SCARICO MATERIALE */
function aggiungi_materiale()
{
	var i;
	
	if(document.gestione_scarico.sElencoEsami.selectedIndex == -1)
	{
		alert('Selezionare almeno un esame!');
		return;
	}
	
	if(document.gestione_scarico.sElencoArt.selectedIndex == -1)
	{
		alert('Selezionare un articolo!');
		return;
	}
	
	if(isNaN(document.gestione_scarico.txtQta.value) || trim(document.gestione_scarico.txtQta.value) == '')
	{
		alert('Inserire quantità valida!');
		return;
	}
	
	if(document.gestione_scarico.hTipo.value == '')
	{
		alert('Selezionare tipo Utilizzo/Scarto!');
		return;
	}
	
	// Proseguo cn l'inserimento...
	for(i = 0; i < document.gestione_scarico.sElencoEsami.length; i++)
	{
		if(document.gestione_scarico.sElencoEsami.options(i).selected)
		{
			scarica_materiale(document.gestione_scarico.sElencoEsami.options(i).value);
		}
	}
	
	pulisci();
}

function scarica_materiale(esame_sel)
{
	var id_maga    = document.gestione_scarico.hMagazzino.value;
	var descr_maga = document.gestione_scarico.hDescrMagazzino.value;
	var qta        = document.gestione_scarico.txtQta.value;
	var tipo       = document.gestione_scarico.hTipo.value;
	var a_esa      = esame_sel.split('#');
	var a_art      = document.gestione_scarico.sElencoArt.value.split('#');
	var a_lotto;
	var cod_temp;
	var idx;
	
	if(document.gestione_scarico.selLotto.value != '')
	{
		a_lotto = document.gestione_scarico.selLotto.value.split('#');
	}
	else
	{
		a_lotto = new Array('', '', '');
	}
	
	cod_temp = genera_codice(id_maga, a_esa[0], a_art[0], '', tipo, a_lotto[2], a_art[4]);
	
	idx = find_elemento(cod_temp, document.gestione_scarico.sElencoScar);
	//a_iden[idx] + '#' + a_cod_art[idx] + '#' + a_cod_bar[idx] + '#' + a_descr[idx] + '#' + a_mdc[idx]
	if(idx >-1)
	{
		// Caso di scarico già presente...
		update_scarico(idx, id_maga, descr_maga, a_esa[0], a_esa[1], a_art[0], a_art[1], a_art[3], a_art[2], qta, tipo, a_lotto[2], a_lotto[0], a_lotto[1], a_art[4]);
	}
	else
	{
		// Caso di un nuovo scarico...
		add_scarico(id_maga, descr_maga, a_esa[0], a_esa[1], a_art[0], a_art[1], a_art[3], a_art[2], qta, tipo, a_lotto[2], a_lotto[0], a_lotto[1], a_art[4]);
	}
}

function genera_codice(id_magazzino, id_esame, id_articolo, qta, tipo, id_lotto, mdc)
{
	return document.gestione_scarico.num_pre.value + '#' + id_magazzino + '#' + id_esame + '#' + id_articolo + '#' + tipo + '#' + id_lotto + '#' + qta + '#' + mdc;
}

function genera_descrizione(descr_esame, cod_bar, descr_articolo, cod_art, qta, tipo, descr_magazzino, cod_lotto, data)
{
	var descr_ret = '';
	var descr_tmp = '';
	
	descr_esame += '';
	cod_bar += '';
	descr_articolo += '';
	cod_art += '';
	qta += '';
	tipo += '';
	descr_magazzino += '';
	cod_lotto += '';
	data += '';
	/*
	descr_tmp = descr_esame + '                                                          ' ;
	descr_ret = descr_tmp.substr(0, 35);
	
	descr_tmp = cod_bar + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 15);
	
	descr_tmp = descr_articolo + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 30);
	
	descr_tmp = cod_art + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 10);
	
	descr_tmp = qta + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 5);
	
	descr_tmp = tipo + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 2);
	
	descr_tmp = descr_magazzino + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 25);
	
	descr_tmp = cod_lotto + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 10);
	
	descr_tmp = formatta_data(data) + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 10);
	*/
	
	descr_tmp = descr_esame + '                                                          ' ;
	descr_ret = descr_tmp.substr(0, 20);
	
	descr_tmp = cod_bar + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 15);
	
	descr_tmp = descr_articolo + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 25);
	
	descr_tmp = cod_art + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 10);
	
	descr_tmp = qta + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 5);
	
	descr_tmp = tipo + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 2);
	
	descr_tmp = descr_magazzino + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 25);
	
	descr_tmp = cod_lotto + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 10);
	
	descr_tmp = formatta_data(data) + '                                                          ' ;
	descr_ret += descr_tmp.substr(0, 10);
	
	return descr_ret;
}

function add_scarico(id_magazzino, descr_magazzino, id_esame, descr_esame, id_articolo, cod_art, descr_articolo, cod_bar, qta, tipo, id_lotto, cod_lotto, data, mdc)
{
	var descr_list = genera_descrizione(descr_esame, cod_bar, descr_articolo, cod_art, qta, tipo, descr_magazzino, cod_lotto, data);
	var cod = genera_codice(id_magazzino, id_esame, id_articolo, qta, tipo, id_lotto, mdc);
	
	add_elemento(cod, descr_list, document.gestione_scarico.sElencoScar);
}

function update_scarico(indice, id_magazzino, descr_magazzino, id_esame, descr_esame, id_articolo, cod_art, descr_articolo, cod_bar, qta, tipo, id_lotto, cod_lotto, data, mdc)
{
	var a_scarico = document.gestione_scarico.sElencoScar.options(indice).value.split('#');
	var qta_temp = (parseInt(a_scarico[6], 10) + parseInt(qta, 10)) + '';
	var descr_list = genera_descrizione(descr_esame, cod_bar, descr_articolo, cod_art, qta_temp, tipo, descr_magazzino, cod_lotto, data);
	var cod = genera_codice(id_magazzino, id_esame, id_articolo, qta_temp, tipo, id_lotto, mdc);
	
	document.gestione_scarico.sElencoScar.options(indice).text = descr_list;
	document.gestione_scarico.sElencoScar.options(indice).value = cod;
}

function cancella_scarico()
{
	var i;
	
	if(document.gestione_scarico.sElencoScar.selectedIndex == -1)
	{
		alert('Selezionare uno scarico');
		return;
	}
	
	for(i = document.gestione_scarico.sElencoScar.length; i > 0 ; i--)
	{
		remove_elemento(document.gestione_scarico.sElencoScar.selectedIndex, document.gestione_scarico.sElencoScar);
	}
}

function check_default_opt()
{
	initbaseUser();
	document.gestione_scarico.txtQta.value = '1';
	document.gestione_scarico.optTipo[0].checked = true;
	set_tipo(document.gestione_scarico.optTipo[0].value);
	document.gestione_scarico.optRicerca[1].checked = true;
	disattiva_ricerca('1');
}

/* REGISTRAZIONE e CHIUSURA*/
function check_dati()
{
	var idx_esa;
	var idx_scar;
	var a_esa;
	var a_scar;
	var check;
	var count;
	var elenco = '';
	var risultato = true;
	
	// Controllo se ci sono da scaricare dei metodi di contrasto (MDC)!!!!
	for(idx_esa = 0; idx_esa < document.gestione_scarico.sElencoEsami.length; idx_esa++)
	{
		count = 0;
		check = false;
		a_esa = document.gestione_scarico.sElencoEsami.options(idx_esa).value.split('#');
		
		if(a_esa[2] == 'S')
		{
			for(idx_scar = 0; idx_scar < document.gestione_scarico.sElencoScar.length && !check; idx_scar++)
			{
				a_scar = document.gestione_scarico.sElencoScar.options(idx_scar).value.split('#');
				
				if(a_scar[2] == a_esa[0]) // è lo stesso esame!
				{
					count++;
					check = a_scar[7] == 'S';
				}
			}
			
			if(count > 0)
			{
				if(!check)
				{
					if(elenco != '')
						elenco += '\n -';
					
					elenco += '\t- ' + a_esa[1];
				}
			}
			else
			{
				if(elenco != '')
					elenco += '\n';
				
				elenco += '\t- ' + a_esa[1];
			}
		}
	}
	
	if(elenco != '')
	{
		risultato = false;
		alert('Attenzione! Sono presenti esami che richiedono materiale mdc, prego aggiungerli nell\'elenco.\nEsami che richiedono tali materiali sono:\n' + elenco);
	}
	
	return risultato;
}

function registra()
{
	var cod;
	
	if(document.gestione_scarico.sElencoEsami.selectedIndex == -1)
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{
		if(check_dati())
		{
			cod = genera_codice_lista(document.gestione_scarico.sElencoScar);
			
			if(cod == '')
			{
				scaricoDWR.elimina(document.gestione_scarico.num_pre.value, check_registra);
			}
			else
			{
				scaricoDWR.registra(cod, check_registra);
			}
		}
	}
}

function check_registra(ret)
{
	id_esame = '';
	
	if(ret.toUpperCase().indexOf('ERR') > 0 && trim(ret) != '')
	{
		alert(ret);
	}
	else
	{
		id_esame = ret;
		alert('Registrazione effettuata con successo!');
	}
}

function chiudi()
{
	parent.parent.parent.opener.aggiorna();
	parent.parent.close();
}