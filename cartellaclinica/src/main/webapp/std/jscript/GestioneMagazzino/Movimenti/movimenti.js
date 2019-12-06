/**/
function chiudi(pagina_da_vis)
{
	var pagina = 1;
	var iden_articolo = '';
	
	if(parent.name == 'MMN_movimento'){
		chiudiInserimentoNelBidoneMN();
	}
	else{
		if(pagina_da_vis != 1)
			pagina = opener.document.form_ric_maga.pagina_da_vis.value;
			
		opener.parent.RicercaMagazzinoFrame.ricerca(pagina);
		self.close();
	}
}

/*Funzione richiamata dalla gestione di un movimento dalla sezione di Magazzino MN.
*/
function chiudiInserimentoNelBidoneMN()
{
	opener.aggiorna("SL_MagazzinoMN?where_condition=WHERE DELETED = 'N' AND CHIUSO = 'N' AND RITIRATO = 'N'", 'Bidoni');
	self.close();			
}

/**/
function chiudi_ins_mod()
{
	var doc = opener.parent.RicercaMagazzinoFrame.document.form_ric_maga;
	
	doc.descr_mov_art.value = document.form_mg_mov.descr_art.value;
	doc.codice_mov_barre.value = document.form_mg_mov.cod_bar_art.value;
	doc.txtDaData.value = document.form_mg_mov.txtDaData.value;
	doc.txtAData.value = document.form_mg_mov.txtAData.value;
	doc.lotto_mov.value = document.form_mg_mov.cod_lotto.value;
	
	doc.magazzino_attivo.value = document.form_mg_mov.iden_magazzino.value;
	
	chiudi(1);	
}

/**/		
function scegli_articolo()
{
	finestraArticoli = window.open('','winArticoli','width=400,height=600, resizable = yes, status=yes, top=10,left=10, scrollbars=yes');
	document.form_articoli.myric.value = document.form_mg_mov.descr_art.value;
	document.form_articoli.myproc.value = 'TAB_ARTICOLI';
	document.form_articoli.mywhere.value = '';
	document.form_articoli.submit();
}

/**/
function associa_dati_mg_giacenze()
{
	winAssociaMgGiacenze = window.open('','winAssMgGiacenze','width=40,height=60, resizable = yes, status=yes, top=10000,left=10000');
	document.form_art_magazzino.articolo.value = document.form_mg_mov.hiden_art.value;
	document.form_art_magazzino.magazzino.value = document.form_mg_mov.iden_magazzino.value;
	document.form_art_magazzino.submit();
}

/**/
function controlla_qta_mov()
{
	if(isNaN(document.form_mg_mov.qta_mov.value)) 
	{
		alert(ritornaJsMsg('numero'));
        document.form_mg_mov.qta_mov.value = ''; document.form_mg_mov.qta_mov.focus();
        return;
	}
	var array_tip_cau = document.form_mg_mov.causale.value.split('*');
 	if(document.form_mg_mov.giacenza.value != '' && array_tip_cau[0] == 'S')
	{
		if(document.form_mg_mov.giacenza.value - document.form_mg_mov.qta_mov.value != 0)
		{
			if(Math.max(document.form_mg_mov.qta_mov.value,document.form_mg_mov.giacenza.value) == document.form_mg_mov.qta_mov.value)
			{
				alert(ritornaJsMsg('qta_errata'));
            	document.form_mg_mov.qta_mov.value = '';
           	 	document.form_mg_mov.qta_mov.focus();
            	return;
			}
		 }
	}
}

/**/
function controlla_data()
{
	if(document.form_mg_mov.txtAData.value != '')
	{
		var data_oggi = new Date();
        var anno_oggi = data_oggi.getYear();
        var mese_oggi = data_oggi.getMonth()+1;
        var giorno_oggi = data_oggi.getDate();
		
        var data = document.form_mg_mov.txtAData.value.split('/');
        var data_scadenza = data[2] + data[1] + data[0];

		var m_oggi = mese_oggi;
		for(i = 1; i < 10; i++)
			if(mese_oggi == i) 
				m_oggi = '0'+ mese_oggi;
				
		var g_oggi = giorno_oggi;
		for(i = 1; i < 10; i++)
			if(giorno_oggi == i) 
				g_oggi = '0'+ giorno_oggi;		
				
	
		var a_m_g_oggi = anno_oggi.toString() + m_oggi.toString() + g_oggi.toString();

		/*alert('OGGI: ' + a_m_g_oggi);
		alert('DATA SCADENZA: ' + data_scadenza);*/

		if(a_m_g_oggi > data_scadenza)
		{
             alert(ritornaJsMsg('data_scad_errata'));//La data di scadenza è antecedente a quella odierna
             //document.form_mg_mov.txtAData.value = '';
             document.form_mg_mov.txtAData.focus();
        }
	}
}

/**/
function registra(tipo_operazione)
{
	var mancano = '';
	var gest_lotto = false;
	var lotto = '';
	var doc = document.form_mg_mov;	
	var cau = doc.causale.value.split('*');
	
	doc.iden_cau.value = cau[1];
    
	if(doc.tipologia[0].checked)
		doc.htipologia.value = 'S';
	if(doc.tipologia[1].checked)
		doc.htipologia.value = 'U';
			
	lotto = baseGlobal.GESTIONE_LOTTO;	
	if(lotto == 'S')
		gest_lotto = true;

	if(doc.descr_art.value == '' || doc.iden_magazzino.value == '' || doc.causale.value == '' || doc.qta_mov.value == '' ||  doc.htipologia.value == '' || (gest_lotto == true && (doc.cod_lotto.value == '' || doc.txtAData.value == '')))
	{
		if(doc.descr_art.value == '')
		{
			mancano = '- ARTICOLO\n';
		 }
		 if(doc.iden_magazzino.value == '')
		 {
			mancano += '- MAGAZZINO\n';
		 }
		if(doc.causale.value == '')
		{
			mancano += '- CAUSALE\n';
		 }
		if(doc.qta_mov.value == '')
		{
			mancano += '- QUANTITA\'\n';
		}
		
		if(gest_lotto)
		{
			if(doc.cod_lotto.value == '')
			{
				mancano += '- CODICE DEL LOTTO\n';
			}
			if(doc.txtAData.value == '')
			{
				mancano += '- DATA SCADENZA DEL LOTTO\n';
			}
	    }
		
		if(doc.htipologia.value == '')
		{
			/*alert(ritornaJsMsg('empty_value_tipologia'));*/
			mancano += '- TIPOLOGIA\n';
		}
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	
	if('MOD' == tipo_operazione)
	{
		doc.nome_campi.value = 'qta_mov*note*tipo_uso*numero_ordine*data_ordine*numero_bolla*data_bolla*ditta*data_taratura*ora_taratura*iden_ope';
		
		doc.request.value = 'qta_mov*note*htipologia*numero_ordine*txtDataOrdine*numero_bolla*txtDataBolla*ditta*txtDataTaratura*ora_taratura*iden_ope';
		
		doc.tipo_campo_db.value = 'D*S*S*S*S*S*S*S*S*S*S';
	}
	else
	{//INSERIMENTO
		doc.hiden_magazzino.value = document.form_mg_mov.iden_magazzino.value;
		
        doc.nome_campi.value = 'dat_mov*iden_art*iden_cau*qta_mov*cod_lotto*data_scad*note*iden_magazzino*tipo_uso*numero_ordine*data_ordine*numero_bolla*data_bolla*ditta*data_taratura*ora_taratura*iden_ope';
		
        doc.request.value = 'txtDaData*hiden_art*iden_cau*qta_mov*cod_lotto*txtAData*note*hiden_magazzino*htipologia*numero_ordine*txtDataOrdine*numero_bolla*txtDataBolla*ditta*txtDataTaratura*ora_taratura*iden_ope';
        
		doc.tipo_campo_db.value = 'S*L*L*L*S*S*S*L*S*S*S*S*S*S*S*S*S';	
	}
		
	if(tipo_operazione == 'INS' && parent.name == 'MMN_movimento'){
		doc.inserito_da.value = 'MAGAZZINO_MN';
		
		doc.nome_campi.value += '*inserito_da';
		doc.request.value += '*inserito_da';
		doc.tipo_campo_db.value += '*S';
		
		doc.submit();
		alert(ritornaJsMsg('registrazione'));//Registrazione effettuata		
		chiudiInserimentoNelBidoneMN();
	}
	else{
		doc.submit();		
		alert(ritornaJsMsg('registrazione'));//Registrazione effettuata		
		chiudi_ins_mod();
	}
}

/*Funzione richiamata alla fine del caricamento della pagina di inserimento del movimento.
Tale funzione blocca la causale se la provenienza è dal magazzino di medicina nucleare.
Se la provenienza è la MN allora la causale deve essere di SCARICO*/
function gestioneCausaleMN()
{
	var doc = document.form_mg_mov;	
	var tipo_causale = doc.causale.value.split('*');
	
	//option value='C*1'  tipo causale + iden
	
	if(parent.name == 'MMN_movimento'){
		for(i = 0; i < doc.causale.length; i++)
			if(doc.causale[i].value.indexOf('S') != -1){
				doc.causale[i].selected = true;
				doc.causale.disabled = true;
			}
	}
}

