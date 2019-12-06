var VarSel = '';
var ValAmb = '';
var FasciaEtaSel = false;
var OpzioniSel = false;
var SelEta='';
var SelOpz = '';
var Selez = '#fe4747';
var Deselez = '#3c9cff';
var SelFasciaEta = 'lblEtaSel';
var CdcSel = '';
var ComuniSel = '';
var Anno = '';
var Oggi = '';
var RicInvito = '';
var txtPostel = '';
var Escl='';
var RitSalvataggio = '';
var WhcEscl='';
var WhcInv = '';
var idenReferti='';
var SelAll = false;

/* PRENOTAZIONE IN SCREENING */
function aggiorna_screening(){
var ret= '';
var myWhere = '';

	ret = checkCampi();
	if (ret!='KO'){
		myWhere = setMyWhere('0'); //Default senza parent
		if (myWhere !='KO'){
			document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_WK&WHERE_WK=WHERE'  + myWhere;
			document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_WK&WHERE_WK=WHERE'  + myWhere;
		}else{
			return;
		}
	}else{
		return;
	}
}

function prenota_selezionati(){
	var id_esami = '';
	var User = '';
	var Ip = '';
	var Valori = '';
	var stato_invito = '';
	var iden_anag = '';
	var DataIni = '';
	var DataFine = '';
	var TipoPren = '';
	var User = '';
	var Ip = '';
	var CdcIden = '';
   
	var TipoSP = 'MULTIPLA';
	id_esami = '0';
	stato_invito = '00';
	if(SelAll){
	    	iden_anag = stringa_codici(array_iden_anag);

	}else{
		iden_anag = stringa_codici;
	}
   	cd = parent.document.getElementById('txtDataIni');
	DataIni =convertData(cd.value);
	if(DataIni=='KO'){
		alert('Inserire una data valida');
		return;
		}
	cd = parent.document.getElementById('txtDataFine');
	DataFine = convertData(cd.value);
	if(DataFine=='KO'){
		alert('Inserire una data valida');
		return;
		}
	
	//Sollecito = parent.document.getElementById('lbl2Invito');
	UltMammo = parent.document.getElementById('lblUltimaMammo');
	SenzaMammo = parent.document.getElementById('lblSenzaMammo');
	
	CdcIden = parent.document.dati.cmbCdc.value;

	
	if(UltMammo.parentElement.style.background==Selez||SenzaMammo.parentElement.style.background==Selez){
		TipoPren ='1';
	}else{
		TipoPren ='0';
	}
	User = baseUser.IDEN_PER;
	Ip = baseUser.IP_COLLEGATO;
	Val = id_esami + '|'+stato_invito+'|'+iden_anag+'|'+DataIni+'|'+DataFine+'|'+TipoPren+'|'+User+'|'+Ip+'|'+CdcIden+'|'+TipoSP;
	dwr.engine.setAsync(false);
	dwrScreening.InserisciInvito(Val,RitSel);
	
	if(VarSel == 'OK'){
		//prenota_tutti();
		alert('Prenotazione eseguita con successo per le donne selezionate');
		var NewWhere = setMyWhere('1');//reload col parent
		if (NewWhere !='KO'){
			dwr.engine.setAsync(false);
//			dwrScreening.ContaRecord('PRENOTAZIONE*'+NewWhere,RitCount);
			MostraRecord('0');
			SelAll = false;
//			cd = parent.document.getElementById('lblWk');
//			cd.innerHTML = 'Risultato della ricerca, Donne Rimanenti da prenotare : ' + Count.split('*')[1];
			parent.document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_WK&WHERE_WK=WHERE'  + NewWhere;
			parent.document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_WK&WHERE_WK=WHERE'  + NewWhere;
		}else{
			return;
		}
	}else{
		alert('Prenotazione non eseguita per alcune anagrafiche, agenda complata per i giorni selezionati');
	}
	
	dwr.engine.setAsync(true);
}

var Count = '';
function RitCount(rec){
	Count = rec;
}

function RitSel(val){
	VarSel = val;
}

function GestComboCdc(){
	cmbCdc = document.dati.cmbCdc;
	Val = cmbCdc.value;
	dwrScreening.GestAmbiti(Val,RitAmb);
	if(ValAmb!='KO'){
		cd = document.getElementById('txtAmbito');
		cd.value = ValAmb;
	}else{
		cd = document.getElementById('txtAmbito');
		cd.value = '';
	}

}

function checkCampi(){
	var cmbcdc = document.dati.cmbCdc;
	var cmbcomuni = document.dati.cmbComuni;
	var cmbeta = document.dati.cmbEta;
	var txtetada = document.getElementById('TxtEtaDa');
	var txtetaa = document.getElementById('TxtEtaDa');
	var txtDataIni = document.getElementById('txtDataIni');
	var txtDataFine = document.getElementById('txtDataFine');
	var txtetasing = document.getElementById('txtEtaSingola');
	var lblTutte = document.getElementById('lblEtaTutte');
	var lblselfascia = document.getElementById('lblEtaSel');
	var lblselsing = document.getElementById('lblEtaSingola');
	var lblesec = document.getElementById('lblEseguito');
	var lblnuovi = document.getElementById('lblNuoviIngressi');
	var lblnonrisp = document.getElementById('lblNonRisp');
	var lblescl = document.getElementById('lblEscluse');
	var lblultima = document.getElementById('lblUltimaMammo');
	var lblsenzamammo = document.getElementById('lblSenzaMammo');



	var Ritorno = 'OK';
	
	if(cmbcdc.selectedIndex=='0'){//CDC
		alert('Selezionare un centro di costo');
		Ritorno = 'KO';
		return Ritorno;
	}else{
		CdcSel = cmbcdc.value; //CENTRI_DI_COSTO.IDEN
		
	}
	
	if(cmbcomuni.selectedIndex!='0'){
		ComuniSel = cmbcomuni.value;
	}else{
		//prendo tutti i comuni in base al centro di screening
		ComuniSel = 'ALL';
		
	}
	if(txtDataIni.value == ''){
		alert('Selezionare le date di Prenotazione');
		Ritorno = 'KO';
		return Ritorno;
	}
	

	if(SelEta == 'lblEtaSingola' && txtetasing.value ==''){
				alert('Indicare il parametro corretto di RICERCA SINGOLA');
				Ritorno = 'KO';
				return Ritorno;
	}
	//CONTROLLARE SE ALMENO UN TASTO E STATO SELEZIONATO
	if(lblesec.parentElement.style.background == '' && lblnuovi.parentElement.style.background == ''
			&& lblultima.parentElement.style.background == '' &&  lblsenzamammo.parentElement.style.background == ''){
		alert('Indicare un filtro Opzioni di selezione');
		Ritorno = 'KO';
		return Ritorno;
	}

}

function RitAmb(val){
	ValAmb = val;
}

function setMyWhere(Type){
	var whc='';
	var Ambito = '';
	//Layer Prenotazione Screening
	if (ComuniSel=='ALL'){
		whc = whc + ' '; //COD_AMB
	}
	if(Type == '0'){
		Ambito = document.getElementById('txtAmbito');
	}else if(Type = '1'){
		Ambito = parent.document.getElementById('txtAmbito');
	}
	
/////////////Fascia di età\\\\\\\\\\\\\\\\\
	var EtaSing = '';
	var EtaAll = '';
	if(Type == '0'){
		EtaSing = document.getElementById('lblEtaSingola');
		EtaSel = document.getElementById('lblEtaSel');
	}else if(Type = '1'){
		EtaSing = parent.document.getElementById('lblEtaSingola');
		EtaSel = parent.document.getElementById('lblEtaSel');	
	}
	if(EtaSing.parentElement.style.background == Selez){
		cd = document.getElementById('txtEtaSingola');
		eta = cd.value;
		dwr.engine.setAsync(false);
		dwrScreening.CalcolaAnnoNasc(eta,RitAnno);
		dwr.engine.setAsync(true);
		whc = whc + ' (DATA_FASCIA <=\''+Anno+'0101\' AND DATA_FASCIA>=\''+Anno+'1231\')';
		dwr.engine.setAsync(false);
		dwrScreening.CalcolaDatEsa(Anno+'*I',RitDatEsa);
		dwrScreening.CalcolaDatEsa(Anno+'*F',RitDatEsa);
		dwr.engine.setAsync(true);
	}else if (EtaSel.parentElement.style.background == Selez){
		//controllo combo
		var valEta = '';
		if(Type=='0'){
			cd = document.getElementById('cmbEta');
			valEta = cd.value;
		}else if (Type == '1'){
			cd = parent.document.getElementById('cmbEta');
			valEta = cd.value;
		}

		if(valEta != '0'){
			a = valEta.indexOf('*');
			if (a != -1){
				ArrEta = valEta.split('*');
				IniNasc = ArrEta[0];
				FineNasc = ArrEta[1];
				EtaIni = ArrEta[0];
				EtaFine = ArrEta[1];
				dwr.engine.setAsync(false);
				dwrScreening.CalcolaAnnoNasc(IniNasc,RitAnno);
				IniNasc = Anno;
				IniNasc = Anno+'1231';
				dwrScreening.CalcolaAnnoNasc(FineNasc,RitAnno);
				FineNasc = Anno;
				FineNasc = Anno+'0101';
				dwrScreening.CalcolaDatEsa(Anno+'*I',RitDatEsa);
				dwrScreening.CalcolaDatEsa(Anno+'*F',RitDatEsa);
				whc = whc + ' (DATA_FASCIA <= \''+IniNasc+'\' and DATA_FASCIA >= \''+FineNasc+'\')';
			}else{
				dwr.engine.setAsync(false);
				dwrScreening.CalcolaAnnoNasc(valEta,RitAnno);
				NascIni = Anno+'0101';
				NascFine = Anno+'1231';
				dwrScreening.CalcolaDatEsa(Anno+'*I',RitDatEsa);
				dwrScreening.CalcolaDatEsa(Anno+'*F',RitDatEsa);
				whc = whc + ' (DATA_FASCIA >=\''+NascIni+'\' AND DATA_FASCIA <=\''+NascFine+'\')';
			}
		}else{
			if(Type == '0'){
				cd = document.getElementById('txtEtaDa');
				ab = document.getElementById('txtEtaA');
			}else if(Type == '1'){
				cd = parent.document.getElementById('txtEtaDa');
				ab = parent.document.getElementById('txtEtaA');
			}

			if (cd.value != '' && ab.value != ''){
				daData = convertData(cd.value);
				aData = convertData(ab.value); 
				Anno = daData.substring(0,4);
				dwrScreening.CalcolaEta(Anno,RitCalcEta);
				dwrScreening.CalcolaDatEsa(Anno+'*I',RitDatEsa);
				dwrScreening.CalcolaDatEsa(Anno+'*F',RitDatEsa);
				if(daData !='KO' && aData !='KO'){
					whc = whc + ' DATA_FASCIA >= \''+daData+'\' and DATA_FASCIA <=\''+aData+'\'';
				}else{
					alert('Inserire una Data Valida in Opzioni Fascia Di Età');
					return 'KO';
				}
				
			}else{
				alert('Inserire una Data Valida in Opzioni Fascia Di Età');
				return 'KO';
			}
			
			
		}
	}else{
		whc = whc + ' DATA_FASCIA >= \'19000101\'';
	}

/////////////////Opzione di selezione\\\\\\\\\\\\\\\\\\\\
	if(Type == '0'){
		esec = document.getElementById('lblEseguito');
		NuoviIngr = document.getElementById('lblNuoviIngressi');
		lblult = document.getElementById('lblUltimaMammo');
		lblnomammo = document.getElementById('lblSenzaMammo');
		DataMammoIni = document.getElementById('txtDaDataSel').value ;
		DataMammoFine = document.getElementById('txtADataSel').value ;
	}else if(Type == '1'){
		esec = parent.document.getElementById('lblEseguito');
		NuoviIngr = parent.document.getElementById('lblNuoviIngressi');
		lblult = parent.document.getElementById('lblUltimaMammo');
		lblnomammo = parent.document.getElementById('lblSenzaMammo');
		DataMammoIni = parent.document.getElementById('txtDaDataSel').value ;
		DataMammoFine = parent.document.getElementById('txtADataSel').value ;
	}

	if(esec.parentElement.style.background == Selez){
		if(DataMammoFine != '' && DataMammoIni != ''){
			DataMammoIni = convertData(DataMammoIni);
			DataMammoFine = convertData(DataMammoFine);
			whc = whc + ' AND ULTIMA_DAT_ESA >=\''+DataMammoIni+'\' AND ULTIMA_DAT_ESA <=\''+DataMammoFine+'\''; 
		}else{
			whc = whc + ' AND ULTIMA_DAT_ESA >=\''+DatEsaFasciaIni+'\' AND ULTIMA_DAT_ESA <=\''+DatEsaFasciaFine+'\'';// calcolare periodo a seconda della fascia di età.
		}
	}
	if(NuoviIngr.parentElement.style.background == Selez){
		//nessuna dat_esa
		whc = whc + ' AND IDEN_ESAME IS NULL AND ULTIMA_DAT_ESA IS NULL';
	}
	if(lblult.parentElement.style.background == Selez){
		whc = whc + ' AND IDEN_ESAME IS NOT NULL AND ULTIMA_DAT_ESA <= \'20090101\'';
		
	}
	if(lblnomammo.parentElement.style.background == Selez){
		whc = whc + ' AND PRENOTATO = \'1\' AND ESEGUITO = \'0\'';
	}
	if(Ambito.value!=''){
		whc = whc + ' AND (COD_AMB_RES = \''+Ambito.value+'\' OR COD_AMB_DOM=\''+Ambito.value+'\')';
	}
	whc = whc  + ' AND SOSPESA = \'N\'';
	return whc;
}

function RitAnno(val){

	Anno = val;
}
var DatEsaFasciaIni='';
var DatEsaFaciaFine='';
function RitDatEsa(val){
	if(val.split('*')[1]=='I'){
		DatEsaFasciaIni = val.split('*')[0];
	}else{
		DatEsaFasciaFine = val.split('*')[0];
	}
}
function convertData(field){
	a = field.indexOf('/');
		
	if(a >'-1'){
			Giorno = field.substring(0,2);
			Mese = field.substring(3,5);
			Anno = field.substring(6,10);
			return Anno+Mese+Giorno;
		}else{
			//alert('Inserire una data valida');
			return 'KO';
		}


	}
function convertDataVisuale(data){
	var dataVisuale = '';
	Anno = data.substring(0,4);
	Mese = data.substring(4,6);
	Giorno = data.substring(6,8);
	dataVisuale = Giorno+ '/' + Mese + '/' + Anno; 
	return dataVisuale;
}
function Default(Obj){
	cd = document.getElementById(Obj);
	cd.parentElement.style.background = Selez;
	
	var d = new Date();
	var Day = d.getDate();
	var Month = d.getMonth();
	var Year = d.getFullYear();
	Month = Month + 1;
	M = Month.toString();
	G = Day.toString();
	if(M.length == 1){
		M = '0' + M;
		}
	if(G.length == 1){
		G = '0' + G;
		}
	Oggi = G + '/'+M+'/'+Year;
	abcd = document.getElementById('txtDataIni');
	abcd.value = Oggi;
	cd = document.getElementById('txtDataFine');
	cd.value= Oggi;

}
function NascondiOggetti(){

	Nascondi('txtEtaSingola');
	BloccaOggetto('txtAmbito');
	Default(SelFasciaEta);
}

function BloccaOggetto(obj){
	ab = document.getElementById(obj);
	ab.readOnly = true;
}

function SbloccaOggetto(obj){
	ab = document.getElementById(obj);
	ab.readOnly = false;
}
function checkNumber(){}

function checkCaratteri(){}

/*END PRENOTAZIONE IN SCREENING*/

/*CONSULTA PRENOTAZIONE E RICERCA ANAGRAFICA*/

function apriConsultaPren(){
	document.all.oIFricPaz.src='servletGenerator?KEY_LEGAME=SCREENING_RICERCA_PAZIENTE';
	document.all.oIFPren.src = "prenotazioneFrame?servlet=consultazioneCalendario%3Fvalore%3D'ARGEN'%2C'BONDE'%2C'CASSOLI'%2C'CENTO'%2C'COMAC'%2C'COPPA'%2C'DELTA'%2C'PORTO'%2C'S_ANNA'%2C'S_ANNA_USL'%26valore2%3D'41'%2C'59'%2C'52'%2C'18'%2C'32'%2C'9'%2C'68'%2C'20174'%2C'67'%26filtro_esami%3D%26Hoffset%3D0%26tipo%3DSCR";
}
//APRO L'ANAGRAFICA -- TEST
function ApriSchedaAnag(){
	iden_anag = stringa_codici(array_iden_anag);
	window.open("servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG="+iden_anag+"&READONLY='N'",fullscreen = 1);

}
function RicercaAnag(Tipo){
	dwr.engine.setAsync(false);
	var cogn = '';
	var nome = '';
	var data = '';
	var WKpaziente = '';
	
	cd = document.getElementById('txtCognome');
	cogn = cd.value;
	cd = document.getElementById('txtNome');
	nome = cd.value;
	cd = document.getElementById('txtData');
	data = cd.value;

	
	cogn =  cogn.toUpperCase();
	nome =  nome.toUpperCase();
	data =  data.toUpperCase();
	
	if(cogn!='' && cogn.length > 2){
		WKpaziente = ' COGNOME like \''+cogn +'%\'';
	}else{
		if(Tipo != 'S'){
			alert('Inserire almeno 3 lettere nel campo cognome');
			return;
		}
	}
	if(nome!='' && nome.length > 2){
		if(Tipo != 'S'){
			WKpaziente = WKpaziente + ' AND NOME like \''+nome +'%\'';
		}
	}
	if(data!=''&& data.length>9){
			WKpaziente = WKpaziente + ' AND DATA_NASCITA = \''+convertData(data) +'\'';
	}

	if(Tipo == 'S'){
		//passo la where alla wk
		WKpaziente = ' COGN like \''+cogn+'%\' AND NOME like \''+nome+'%\'';
		
		var ValSosp =document.all.cmbTipoSosp.value;
		if(ValSosp == '0'){
			if(cogn !='' && nome !=''){
				dwrScreening.ContaRecord('ESCLUSE*'+WKpaziente,RitCount);
				cd = document.getElementById('lblWkEscl');
				cd.innerHTML = 'Risultato della ricerca, Donne ricercate : ' + Count.split('*')[1];
				document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK&WHERE_WK='+ escape ('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;
				document.all.oIFWk.SRC_ORGINE='servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK&WHERE_WK='+ escape ('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;
			}else{
				applica_filtro('servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK');
			}
		}else{
			if(cogn!='' && nome != ''){
				WKpaziente = WKpaziente + ' AND IDEN_SOSP = '+ ValSosp;
				dwrScreening.ContaRecord('ESCLUSE*'+WKpaziente,RitCount);
				cd = document.getElementById('lblWkEscl');
				cd.innerHTML = 'Risultato della ricerca, Donne ricercate : ' + Count.split('*')[1];

				document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK&WHERE_WK='+ escape ('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;
				document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK&WHERE_WK='+ escape ('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;
			}else{
				WKpaziente = ' IDEN_SOSP = ' + ValSosp;
				dwrScreening.ContaRecord('ESCLUSE*'+WKpaziente,RitCount);
				cd = document.getElementById('lblWkEscl');
				cd.innerHTML = 'Risultato della ricerca, Donne ricercate : ' + Count.split('*')[1];
				document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK&WHERE_WK='+ escape ('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;
				document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK&WHERE_WK='+ escape ('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;

			}
		}
		
	}else{
		document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_RICERCA_PAZIENTE_WK&WHERE_WK=' + escape('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;
		document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_RICERCA_PAZIENTE_WK&WHERE_WK='+ escape ('WHERE '  + WKpaziente);//;&WHERE_WK=WHERE ID_ESAME=1138443';;
		try{
			parent.document.getElementById('oIFPren').src = "prenotazioneFrame?servlet=consultazioneCalendario%3Fvalore%3D'ARGEN'%2C'BONDE'%2C'CASSOLI'%2C'CENTO'%2C'COMAC'%2C'COPPA'%2C'DELTA'%2C'PORTO'%2C'S_ANNA'%2C'S_ANNA_USL'%26valore2%3D'41'%2C'59'%2C'52'%2C'18'%2C'32'%2C'9'%2C'68'%2C'20174'%2C'67'%26filtro_esami%3D%26Hoffset%3D0%26tipo%3DSCR";
			}catch(e){
				alert(e.descriptor);
			}
	}
}

function RicercaUltimoInvito(){
	iden_anag = stringa_codici(array_iden_anag);
	dwr.engine.setAsync(false);
	dwrScreening.RicercaInvito(iden_anag,RitPren);
	
	if(RicInvito =='KO'){
		alert('Invito non trovato in agenda per la paziente selezionata');
	}else{
		ArrInvito = RicInvito.split('*');
		var DataEsame = ArrInvito[2];
		var IdenAree = ArrInvito[1];
		var Cdc = ArrInvito[0];
		parent.parent.document.getElementById('oIFPren').src="prenotazioneDettaglio?tipo=SCR&valore="+Cdc+"&valore2=%2741%27%2C%2759%27%2C%2752%27%2C%2718%27%2C%2732%27%2C%279%27%2C%2768%27%2C%2720194%27%2C%2720174%27%2C%2767%27&filtro_esami=&Hdata="+DataEsame+"&id_aree="+IdenAree+"&id_area="+IdenAree+"&id_esame=&idx_esame=&menu_tenda=prenotazioneScreening&Hoffset=0&js_click=javascript%3A&js_indietro=javascript%3Aritorna_consulta%28%22SCR%22%2C+%22%27ARGEN%27%2C%27BONDE%27%2C%27CASSOLI%27%2C%27CENTO%27%2C%27COMAC%27%2C%27COPPA%27%2C%27DELTA%27%2C%27PORTO%27%2C%27S_ANNA%27%2C%27S_ANNA_USL%27%22%2C+%22%2741%27%2C%2759%27%2C%2752%27%2C%2718%27%2C%2732%27%2C%279%27%2C%2768%27%2C%2720194%27%2C%2720174%27%2C%2767%27%22%2C+%22%22%2C+%220%22%29%3BD3&ID_ANAG="+iden_anag;
	
	}
	
	
}

function RitPren(val){

	RicInvito = val;
}

//prenotazione sollecito-screening//dalla consulta prenotazione
function PrenotaScreening(){
	var id_anag_sel = '';
	var id_area = '';
	var iden_dettaglio = '';
	var InCdc= '';
	var DataPren = '';
	var TipoSP = '';
	TipoSP = 'DETTAGLIO';
	var id_esami = '0';
	var stato_invito = '0';//qua non serve a nulla
	var val = '';
	var TipoPren = '0';//qua nn serve a nulla
	
	if(typeof(parent.parent.document.all.oIFricPaz)!='undefined'){
		try{
			prenAn = parent.parent.document.all.oIFricPaz.contentWindow.frames['oIFWk'];
			id_anag_sel = prenAn.stringa_codici(prenAn.array_iden_anag);
			if(id_anag_sel == ''){
				alert('Selezionare un\'anagrafica');
				return;
			}
		}catch(e){
			alert('Ricercare prima l\'anagrafica su cui prenotare');
		}
	}else{
		var sr = parent.document.all.oIFPren.src;
		var aa = sr.indexOf('ID_ANAG')+8;
		sr = sr.substring(aa);
		if (sr!=''){
			id_anag_sel = sr;
		}else{
			alert('Ricercare nuovamente l\'anagrafica');
			return;
		}
	}

	
	id_area = document.all.cmbArea.value ;
	if(id_area == ''){
		alert('Scegliere l\'agenda su cui prenotare');
		return;
	}
	iden_dettaglio = stringa_codici(a_iden_dettaglio);
	var Forzatura = stringa_codici(a_forzatura);	
	//Forzatura = 'S';

	InCdc = document.all.valore.value;
	DataPren = document.all.Hdata.value;
	if(sr==''){
		User = prenAn.baseUser.IDEN_PER;
		Ip = prenAn.baseUser.IP_COLLEGATO;
	}else{
		User = top.baseUser.IDEN_PER;
		Ip = top.baseUser.IP_COLLEGATO;
	}

	val = id_esami + '|'+stato_invito+'|'+id_anag_sel+'|'+DataPren+'|'+DataPren+'|'+TipoPren+'|'+User+'|'+Ip+'|'+InCdc+'|'+TipoSP+'|'+id_area+'|'+iden_dettaglio+'|'+Forzatura;
	dwr.engine.setAsync(false);
	dwrScreening.InserisciInvito(val,RitInvDett);
	if(ritornoInvDett=='OK'){
		aggiorna();
	}else{
		alert('Prenotazione fallita, il record potrebbe essere in uso su un\'altra postazione');
	}
	
}
var ritornoInvDett = '';
function RitInvDett(valore){
	ritornoInvDett = valore;
}

////APRI STORICO PAZIENTE\\\\\
function VisualizzaStoricoPaziente(){
	var Valori = '';
	var iden_anag = 0;
	iden_anag = stringa_codici(array_iden_anag);
	dwr.engine.setAsync(false);
	dwrScreening.GetDatiPaziente(iden_anag,RitSto);
	dwr.engine.setAsync(true);
	if(StoricoRet.split('*')[0] == 'OK'){
		var Cogn = StoricoRet.split('*')[1];
		var Nome = StoricoRet.split('*')[2];
		var Data = StoricoRet.split('*')[3];
		window.open('servletGenerator?KEY_LEGAME=SCREENING_STORICO&ID_ANAGRAFICA='+iden_anag+'&COGN='+Cogn+'&NOME='+Nome+'&DATA='+Data,toolbar=0,menubar=0);
	}else{
		alert('La paziente selezionata non ha Mammografie precedenti');
	}
	
}
var StoricoRet = '';
function RitSto(Val){
	StoricoRet = Val;
}
function ChiudiStorico(){
	self.close();
}

function ValorizzaCampi(){
	cg = document.getElementById('COGN');
	nm = document.getElementById('NOME');
	dt = document.getElementById('DATA');
	lblCgn = document.all.lblCognomeRic;
	lblNm = document.all.lblNomeRic;
	lblDt = document.all.lblDataRic;
	
	lblCgn.innerHTML = lblCgn.innerHTML +  ' ' + cg.value;
	lblNm.innerHTML = lblNm.innerHTML + ' ' + nm.value;
	lblDt.innerHTML = lblDt.innerHTML + ' ' + dt.value;
	
	WkAnag = document.getElementById('ID_ANAGRAFICA').value;
	parent.document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_STORICO_WK&WHERE_WK=WHERE IDEN_ANAG='  + WkAnag;//;&WHERE_WK=WHERE ID_ESAME=1138443';;
	parent.document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_STORICO_WK&WHERE_WK=WHERE IDEN_ANAG'  + WkAnag;//;&WHERE_WK=WHERE ID_ESAME=1138443';;
	
}
///FINE STORICO PAZIENTE\\\
/*PAGINA ESCLUSIONI-SOSPESE*/

function InserisciEsclusione(){
	iden_anag = stringa_codici(array_iden_anag);
	Esclusione = CaricaEscl(iden_anag);
	var ArrEscl = '';
	ArrEscl = Esclusione.split('*');
	if(ArrEscl[0]=='OK'){
	
		window.open ('servletGenerator?KEY_LEGAME=SCREENING_INS_SOSP&ID_ANAGRAFICA='+iden_anag+'&SOSP='+ArrEscl[1]+'&INFO='+ArrEscl[2]+'&MOTIVO='+ArrEscl[3]+'&QUART='+ArrEscl[4]+'&MAS='+ArrEscl[5]+'&ALTROINT='+ArrEscl[6]+'&QUANDO='+ArrEscl[7]+'&DOCUMENTATA='+ArrEscl[8],toolbar=0,menubar=0);
	}else{
		
		window.open ('servletGenerator?KEY_LEGAME=SCREENING_INS_SOSP&ID_ANAGRAFICA='+iden_anag+'&SOSP=N',toolbar=0,menubar=0);
	}
	
}
function ChiudiEsclusioni(){
	self.close();
	
}
function SalvaEsclusione(){

	var CodSosp = '' ;
	IdAnag = document.all.ID_ANAGRAFICA.value;
	var DataMxRec = '';
	var DataDec = '';
	var InfoSelected = '';
	var Quart = 'N';
	var Mas = 'N';
	var AltroInt='N';
	var Chk = 'N';
	
	
	Obj = document.all['OptEscl'];//document.getElementById('OptEscl');
	
	for (i=0; i <= Obj.length;i++){
		if(Obj[i].checked){
			Selected = Obj[i].id;
			if(Selected == 'Deced'){
				cd = document.getElementById('txtDataDec');
				txtDataDec = convertData(cd.value);
				InfoSelected = txtDataDec;
			}else if(Selected == 'Interv'){
				Chk = 'S';
				chkQuart=document.getElementById('ChkQuart');//ChkAltro ChkMas
				chkAltro=document.getElementById('ChkAltro');
				chkMas=document.getElementById('ChkMas');
				txtAltInv = document.all.TxtIntAltro;
				if(chkQuart.checked){
					Quart = 'S';
				}
				if(chkMas.checked){
					Mas = 'S';
				}
				if(chkAltro.checked){
					AltroInt = 'S';
					InfoSelected = txtAltInv.value;
					if(InfoSelected == ''){
						alert('Specificare altro intervento');
						return;
					}
				}
			}else if(Selected == 'MxRec'){
				cd = document.getElementById('txtDateMxRec');
				DataMxRec = convertData(cd.value);
				InfoSelected = DataMxRec;
			}else if(Selected == 'AltroCen'){
				cd = document.getElementById('txtAltroCen');
				InfoSelected = cd.value;
			}else if(Selected == 'Altro'){
				cd = document.getElementById('txtAltro');
				InfoSelected = cd.value;
			}
			break;
		} 
		
	}
	
	var Valori = '';
	var Motivazione = '';
	cd = document.getElementById('txtMotivazione');
	if(cd.value!=''){
		Motivazione = cd.value;
	}
	PrimaInv = document.getElementById('lblPrimaInv');
	if(PrimaInv.parentElement.style.background==Selez){
		Quando = '00';//CONTROLLO SUL SEL
	}else{
		Quando = '10';
	}
	var ObjDoc = document.getElementById('ChkDoc');
	var Documentata = '';
	if(ObjDoc.checked){
		Documentata = 'S';
	}else{
		Documentata = 'N';
	}
	Valori = IdAnag+'*'+Selected+'*'+InfoSelected+'*'+Chk+'*'+Quart+'*'+Mas+'*'+AltroInt+'*'+Motivazione+'*'+Quando+'*'+Documentata;
	dwr.engine.setAsync(false);
	dwrScreening.SalvaEsclusione(Valori,RitSalvaEscl);
	dwr.engine.setAsync(true);
	
	if(RitSalvataggio == 'OK'){
		opener.parent.document.all.oIFWk.src = 'servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK';
		self.close();
		
	}else{
		alert('Errore durante il salvataggio');
	}
	
}

function RitSalvaEscl(valore){
	 RitSalvataggio = valore;
}
function CaricaEscl(IdAnag){
	dwr.engine.setAsync(false);
	dwrScreening.CaricaEslcusioni(IdAnag,RitEscl);
	dwr.engine.setAsync(true);
	return Escl;
	
}
function RitEscl(val){
	Escl = val;

}
function ValorizzaDati(){

	cd = document.getElementById('SOSP');
	if(cd.value !='N' ){
		Obj = document.all['OptEscl'];
		for (i=0;i<=Obj.length;i++){

			if(Obj[i].id == cd.value){
				if(cd.value=='MxRec' || cd.value=='Deced'||cd.value=='Interv' || cd.value=='AltroCen'|| cd.value=='Altro'){
					if(cd.value=='MxRec'){
						af = document.getElementById('INFO');
						ob = document.getElementById('txtDateMxRec');
						ob.value = convertDataVisuale(af.value);
					}else if(cd.value=='Deced'){
						af = document.getElementById('INFO');
						ob = document.getElementById('txtDataDec');
						ob.value = convertDataVisuale(af.value);
					}else if(cd.value=='Interv'){
						ObjQuart = document.getElementById('QUART');
						ObjMas =  document.getElementById('MAS');
						ObjAltroInt = document.getElementById('ALTROINT');
						//delgiu qua gestire caricamento  CHECK E INFO
						if(ObjQuart.value == 'S'){
							document.all.ChkQuart.checked = true;
						}
						if(ObjMas.value == 'S'){
							document.all.ChkMas.checked = true;
						}
						if(ObjAltroInt.value == 'S'){
							document.all.ChkAltro.checked = true;
							af = document.getElementById('INFO');
							ob = document.getElementById('txtIntAltro');
							ob.value = af.value;
						}

					}else if(cd.value=='AltroCen'){
						af = document.getElementById('INFO');
						ob = document.getElementById('txtAltroCen');
						ob.value = af.value;
					}else if(cd.value=='Altro'){
						af = document.getElementById('INFO');
						ob = document.getElementById('txtAltro');
						ob.value = af.value;
					}
				
				}
				Mot = document.getElementById('MOTIVO');
				AreaMotivo = document.getElementById('txtMotivazione');
				Quando = document.getElementById('QUANDO');
				Documentata = document.getElementById('DOCUMENTATA');
				if(Quando.value=='10'){
					document.all.lblDopoInv.parentElement.style.background=Selez;
					document.all.lblPrimaInv.parentElement.style.background=Deselez;
				}else{
					document.all.lblPrimaInv.parentElement.style.background=Selez;
					document.all.lblDopoInv.parentElement.style.background=Deselez;
				}
				if(Documentata.value == 'S'){
					document.all.ChkDoc.checked = true;
				}
				
				if(Mot.value!='null'){
					AreaMotivo.value = Mot.value;
				}else{
					AreaMotivo.value = '';
				}
				Obj[i].checked=true;
				break;
			}
		}
	}else{

		document.all.lblPrimaInv.parentElement.style.background = Selez;
	}
}
function ReintegraEsclusione(){
	iden_anag= stringa_codici(array_iden_anag);
	dwr.engine.setAsync(false);
	dwrScreening.ReintegraEsclusione(iden_anag,RitReint);
	dwr.engine.setAsync(true);
	
	if(RitornoEscl == 'OK'){
		alert('Donna reintegrata nel programma di Screening');
		parent.document.all.oIFWk.src = 'servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI_WK';
	}else{
		alert('Impossibile reintegrare la donna selezionata');
	}
	
}
var RitornoEscl = "";
function RitReint(val){
	RitornoEscl = val;
	
}
/*SEZIONE */ /*DONNE INVITATE NELLO SCREENING*/

function CaricaInviti(Type){
	dwr.engine.setAsync(false);
	if(Type == '0'){
		if(document.all.oDaData.value!=''){
			var DaData = convertData(document.all.oDaData.value);
		}
		if(document.all.oAData.value!=''){
			var AData = convertData(document.all.oAData.value);
		}
		var Cogn = document.getElementById('txtCognInv');
		var Nome = document.getElementById('txtNomeInv');
		var DataNasc = document.getElementById('txtDataInv');
		var cmbCdc = document.getElementById('cmbCdc');
	}else if(Type == '1'){
		var DaData = convertData(parent.document.all.oDaData.value);
		var AData = convertData(parent.document.all.oAData.value);
		var Cogn = parent.document.getElementById('txtCognInv');
		var Nome = parent.document.getElementById('txtNomeInv');
		var DataNasc = parent.document.getElementById('txtDataInv');
		var cmbCdc = parent.document.getElementById('cmbCdc');
	}
	var Where = '';
	Text = Cogn.value;
	Cogn.value = Text.toUpperCase();
	Text = Nome.value;
	Nome.value=Text.toUpperCase();
	
	if(Type == '0'){
		if(document.all.lblApprof.parentElement.style.background == Selez || Cogn.value != ''){
			document.all.oDaData.value = '';
			document.all.oAData.value = '';
		}else{
			if ((AData == 'KO'||DaData == 'KO' )&&(Cogn.value == '')){
				alert('Inserire le date nei filtri');
				return;
			}
		}
	}else if(Type == '1'){
		if(parent.document.all.lblApprof.parentElement.style.background == Selez || Cogn.value != ''){
			parent.document.all.oDaData.value = '';
			parent.document.all.oAData.value = '';
		}else{
			if ((AData == 'KO'||DaData == 'KO' )&&(Cogn.value == '')){
				alert('Inserire le date nei filtri');
				return;
			}
		}
	}
	if(Type == '0'){
		if(document.all.lblTutti.parentElement.style.background == Selez){
			if(AData !='KO' && AData!='KO'){
				Where = ' WHERE DATA_ESAME >= \''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'';
			}else{
				Where = '';
			}		
		
		}else if(document.all.lblStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'02\' AND STAMPATO_INVITO =\'S\' AND DATA_ESAME >=\'' + DaData +'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = ' WHERE STATO_INVITO =\'02\' AND STAMPATO_INVITO =\'S\'' ;
			}
		}else if(document.all.lblNonStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'01\' AND STAMPATO_INVITO IN (\'N\',\'Z\') AND DATA_ESAME >=\''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = 'WHERE STATO_INVITO =\'01\' AND STAMPATO_INVITO IN (\'N\',\'Z\')' ;
			}
		}else if(document.all.lblRefStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'04\' AND STAMPATO_REF =\'S\' AND DATA_ESAME >=\''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = ' WHERE STATO_INVITO =\'04\' AND STAMPATO_REF =\'S\'' ;
			}
		}else if(document.all.lblRefNonStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'03\' AND STAMPATO_REF =\'N\' AND DATA_ESAME >=\''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = ' WHERE STATO_INVITO =\'03\' AND STAMPATO_REF =\'N\'' ;
			}
		}else if(document.all.lblApprof.parentElement.style.background == Selez){
			Where = ' WHERE STATO_INVITO =\'02\' AND STAMPATO_SOLLECITO =\'N\' AND NSOLLECITI > 0' ;
		}
	}else if(Type == '1'){
		if(parent.document.all.lblTutti.parentElement.style.background == Selez){
			if(AData !='KO' && AData!='KO'){
				Where = ' WHERE DATA_ESAME >= \''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'';
			}else{
				Where = '';
			}		
		
		}else if(parent.document.all.lblStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'02\' AND STAMPATO_INVITO =\'S\' AND DATA_ESAME >=\'' + DaData +'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = ' WHERE STATO_INVITO =\'02\' AND STAMPATO_INVITO =\'S\'' ;
			}
		}else if(parent.document.all.lblNonStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'01\' AND STAMPATO_INVITO IN (\'N\',\'Z\') AND DATA_ESAME >=\''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = 'WHERE STATO_INVITO =\'01\' AND STAMPATO_INVITO IN (\'N\',\'Z\')' ;
			}
		}else if(parent.document.all.lblRefStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'04\' AND STAMPATO_REF =\'S\' AND DATA_ESAME >=\''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = ' WHERE STATO_INVITO =\'04\' AND STAMPATO_REF =\'S\'' ;
			}
		}else if(parent.document.all.lblRefNonStampati.parentElement.style.background == Selez){
			if(AData != 'KO' && DaData != 'KO'){
				Where = ' WHERE STATO_INVITO =\'03\' AND STAMPATO_REF =\'N\' AND DATA_ESAME >=\''+DaData+'\' AND DATA_ESAME <=\''+AData+'\'' ;
			}else{
				Where = ' WHERE STATO_INVITO =\'03\' AND STAMPATO_REF =\'N\'' ;
			}
		}else if(parent.document.all.lblApprof.parentElement.style.background == Selez){
			Where = ' WHERE STATO_INVITO =\'02\' AND STAMPATO_SOLLECITO =\'N\' AND NSOLLECITI > 0' ;
		}
		
	}
	if(Cogn.value != ''){
		var CognInv = Cogn.value;
		CognInv = CognInv.toUpperCase();
		if(Where == ''){
			Where = ' WHERE COGN LIKE \''+CognInv+'%\'';
		}else{
			Where = Where + ' AND COGN LIKE \''+CognInv+'%\'';
		}
	}
	if(Nome.value != ''){
		var NomeInv = Nome.value;
		NomeInv = NomeInv.toUpperCase();
		if(Where == ''){
			Where = Where + ' WHERE NOME LIKE \''+NomeInv+'%\'';
		}else{
			Where = Where + ' AND NOME LIKE \''+NomeInv+'%\'';
		}
	}
	if(DataNasc.value != ''){
		var DataInv = DataNasc.value;
		DataInv = DataInv.toUpperCase();
		if(Where == ''){
			Where = ' WHERE DATA=\''+DataInv+'\'';
		}else{
			Where = Where + ' AND DATA=\''+DataInv+'\'';
		}
	}
	if(cmbCdc.value != '0'){
		Where  = Where + ' AND IDEN_REPARTO=\''+cmbCdc.value+'\'';
	}
	WhereInv = Where;
	WhereInv = WhereInv.substring(6,WhereInv.length);//tolgo where_wk
	dwrScreening.ContaRecord('INVITI*'+WhereInv,RitCount);
	dwr.engine.setAsync(true);
	if(Type == '0'){
		cd = document.getElementById('lblWkInviti');
		cd.innerHTML = 'Risultato della ricerca, Donne ricercate : ' + Count.split('*')[1];
		document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_INVITI_WK&WHERE_WK='+ escape(Where);
		document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_INVITI_WK&WHERE_WK='+ escape(Where);
	}else if(Type == '1'){
		cd = parent.document.getElementById('lblWkInviti');
		cd.innerHTML = 'Risultato della ricerca, Donne ricercate : ' + Count.split('*')[1];
		parent.document.all.oIFWk.src='servletGenerator?KEY_LEGAME=SCREENING_INVITI_WK&WHERE_WK='+ escape(Where);
		parent.document.all.oIFWk.SRC_ORIGINE='servletGenerator?KEY_LEGAME=SCREENING_INVITI_WK&WHERE_WK='+ escape(Where);
	}


}

/*STAMPA_INVITO*/
function StampaInvito(){
	arr_iden_inviti = stringa_codici(array_iden_invito);
	arr_iden_inviti = arr_iden_inviti.replace('*',',');
	var url='elabStampa?stampaFunzioneStampa=LISTA_INVITI_SCR&stampaSelection={TAB_SCREENING_INVITI.iden} in [' + arr_iden_inviti + ']&stampaReparto=' + basePC.DIRECTORY_REPORT + '&stampaAnteprima=N';

	lancia_stampa(url);	
}

/*STAMPA_REFERTO*/
function StampaReferti(){
	arr_iden_esami = stringa_codici(array_iden_esami);
	if(arr_iden_esami.indexOf('*')>-1){
		arr_iden_esami =  arr_iden_esami.replace('*',',');
	}
	dwr.engine.setAsync(false);
	dwrScreening.GetIdenRef(arr_iden_esami,RitRef);

	var url="elabStampa?stampaFunzioneStampa=LISTA_REFERTI_SCR&stampaSelection={REFERTI.iden} in [" + idenReferti + "]&stampaReparto=" + basePC.DIRECTORY_REPORT + "&stampaAnteprima=N";
	dwr.engine.setAsync(true);
	lancia_stampa(url);	
	
}

function RitRef(val){
	idenReferti = val;
}
/*STAMPA LISTA ESCLUSIONI*/
function StampaListaEscl(){
	arr_iden_anag = stringa_codici(array_iden_anag);
	arr_iden_anag = arr_iden_anag.replace('*',',');
	var url = 'elabStampa?stampaFunzioneStampa=LISTA_ESCLUSE_SCR&stampaSelection={ANAG.iden} in [' + arr_iden_anag + ']&stampaReparto=' + basePC.DIRECTORY_REPORT + '&stampaAnteprima=N';
}

/*APRI SCHEDA APPOPRIATEZZA*/
function apriAppropriatezza(){

	var cod_scheda_appr = 'TAB_APP_SCREEN';
	var esame_accettato = '1';
	var iden_esame = '';
	var iden_anag = '';
	var iden_esa = '';
	
	iden_esame = stringa_codici(array_iden_esami);
	iden_anag = stringa_codici(array_iden_anag);
	esito_def = stringa_codici(array_esitodef);
	iden_esa = 3660;
	provenienza = 'A';
	
	if(esito_def != '00'){	
		var finestra = window.open("Appropriatezza?provenienza="+provenienza+"&iden_paz="+ iden_anag+"&iden_esame="+iden_esame+"&iden_esa="+iden_esa,"","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");		
		if (finestra){			
			finestra.focus();		
		}		
	else{			
		/*finestra = window.open("Appropriatezza?provenienza=R&cod_scheda=tab_app_filtro_rm_tc&iden_paz=244&num_esami=3&iden_esame=13","","top=0,left=0,width=800,height=600,status=yes");*/			
		finestra = window.open("Appropriatezza?provenienza="+provenienza+"&iden_paz="+ iden_anag+"&iden_esame="+iden_esame+"&iden_esa="+iden_esa,"","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");		
		}	
	}else{
		alert('L\'ESAME NON HA ANCORA UNA SCHEDA DI SCREENING COMPILATA CON ESITO DEFINITIVO');	
	}

}
//Lancio la stampa
function lancia_stampa(tipo)
{
	var wndprint;

	wndprint = window.open(tipo, 'winstampa', 'status = yes, scrollbars = no, height = 300, width = 500, top = 1, left = 1');
	if(wndprint) 
		wndprint.focus();
	else 
		wndprint = window.open(tipo, 'winstampa', 'status = yes, scrollbars = no, height = 300, width = 500, top = 1, left = 1');
	
}

/*LETTERE POSTEL*/
function CreaLettere(){
	var ritWrite ='';
	var iden_esami = stringa_codici(array_iden_esami);
	var stato_invito = stringa_codici(array_stato_invito);
	var stampato_invito = stringa_codici(array_stampato_invito);
	var TipoLettera='';
	
	//Controllo filtri sel
	if(parent.document.all.lblApprof.parentElement.style.background == Selez){
		TipoLettera = '2';
	}else{
		if(stato_invito.indexOf('01')==-1){
			alert('Le lettere per alcuni inviti selezionati sono già state create');
			return;
		}
		TipoLettera = '1';
	}
	Val = TipoLettera+'|'+iden_esami;
	dwr.engine.setAsync(false);
	dwrScreening.CreaLetterePostel(Val,RitPostel);
	dwr.engine.setAsync(true);
	ritWrite = WritePostelFile(txtPostel);
	if(ritWrite == 'OK'){
		alert('Lettere create correttamente per le donne selezionate');
		CaricaInviti('1');
	}else{
		alert('Errore durante la creazione delle lettere');
	}
}

function RitPostel(val){
	txtPostel = val;
}

function WritePostelFile(stringa){
	var RitFile = '';
	var d = new Date();
	var ora = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();
	var Adesso = ora+min+sec;
	
	try{
		
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		//var path = fso.GetSpecialFolder(2);
		var path = "c:";

		 var  a, ForAppending;
		  ForAppending = 8;
		  var File_Log;

		  File_Log=path+"\\ScreeningPostel"+Adesso+".csv";
	  
		  if (!fso.FileExists(File_Log))
			{
				fso.CreateTextFile (File_Log);
			}
		  a = fso.OpenTextFile(File_Log, ForAppending, false);
		  a.Write(stringa);
		  a.WriteBlankLines(1);
		  a.Close();
		  RitFile = 'OK';
		  
	}catch(e){
		alert(e);
		RitFile = 'KO';
	}
		return RitFile;
	}
/*END LETTERE POSTEL*/
/**/
/* GRAFICA - VISUALIZZAZIONE */
function RitornoCss(val){
	if(val=='lblEseguito'){
		cd = document.getElementById('lblNuoviIngressi');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblSenzaMammo');
		cd.parentElement.style.background = 'TEAL';
		//cd = document.getElementById('lbl2Invito');
		//cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblUltimaMammo');
		cd.parentElement.style.background = 'TEAL';
	}else if(val == 'lblNuoviIngressi'){
		cd = document.getElementById('lblEseguito');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblSenzaMammo');
		cd.parentElement.style.background = 'TEAL';
		cd = document.getElementById('lblUltimaMammo');
		cd.parentElement.style.background = 'TEAL';
	//	cd = document.getElementById('lbl2Invito');
		//cd.parentElement.style.background = '#3C9CFF';
	}else if(val == 'lblSenzaMammo'){
		cd = document.getElementById('lblEseguito');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblNuoviIngressi');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblUltimaMammo');
		cd.parentElement.style.background = 'TEAL';
		//cd = document.getElementById('lbl2Invito');
		//cd.parentElement.style.background = '#3C9CFF';
		
	}else if(val == 'lblUltimaMammo'){
		cd = document.getElementById('lblSenzaMammo');
		cd.parentElement.style.background = 'TEAL';
		cd = document.getElementById('lblEseguito');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblNuoviIngressi');
		cd.parentElement.style.background = '#3C9CFF';
		//cd = document.getElementById('lbl2Invito');
		//cd.parentElement.style.background = '#3C9CFF';
		
	}else if(val == 'lblEtaSel'){
		cd = document.getElementById('lblEtaSingola');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblEtaTutte');
		cd.parentElement.style.background = '#3C9CFF';
		Nascondi('txtEtaSingola');
		
	}else if(val == 'lblEtaSingola'){
		cd = document.getElementById('lblEtaSel');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblEtaTutte');
		cd.parentElement.style.background = '#3C9CFF';
		
	}else if(val == 'lblEtaTutte'){
		cd = document.getElementById('lblEtaSingola');
		cd.parentElement.style.background = '#3C9CFF';
		cd = document.getElementById('lblEtaSel');
		cd.parentElement.style.background = '#3C9CFF';
		Nascondi('txtEtaSingola');
		
	}
	//PAGINA SCREENING_INS_SOSP
	else if(val == 'lblDopoInv'){
		cd = document.getElementById('lblPrimaInv');
		cd.parentElement.style.background = '#3C9CFF';
	}else if(val == 'lblPrimaInv'){
		cd = document.getElementById('lblDopoInv');
		cd.parentElement.style.background ='#3C9CFF' ;
	}
	//PAGINA SCREENING_INVITI
	
	else if(val == 'lblTutti'){
		document.all.lblStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblApprof.parentElement.style.background = '#3C9CFF';
	}else if(val == 'lblStampati'){
		document.all.lblTutti.parentElement.style.background = '#3C9CFF';
		document.all.lblNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblApprof.parentElement.style.background = '#3C9CFF';
	}else if(val =='lblNonStampati'){
		document.all.lblTutti.parentElement.style.background = '#3C9CFF';
		document.all.lblStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblApprof.parentElement.style.background = '#3C9CFF';
	}else if(val == 'lblRefStampati'){
		document.all.lblTutti.parentElement.style.background = '#3C9CFF';
		document.all.lblStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblApprof.parentElement.style.background = '#3C9CFF';
	}else if(val == 'lblRefNonStampati'){
		document.all.lblTutti.parentElement.style.background = '#3C9CFF';
		document.all.lblStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblApprof.parentElement.style.background = '#3C9CFF';
	}else if(val == 'lblApprof'){
		document.all.lblTutti.parentElement.style.background = '#3C9CFF';
		document.all.lblStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblNonStampati.parentElement.style.background = '#3C9CFF';
		document.all.lblRefNonStampati.parentElement.style.background = '#3C9CFF';
	}
	
}
function setUpper(obj){
	cd = document.getElementById(obj);
	text = cd.value;
	cd.value = text.toUpperCase();
	
}

function changeIcon (val){
	if (val=='H'){
		document.body.style.cursor = 'hand';
	}else{
		document.body.style.cursor = 'auto';
	}

}
function colora(val){

	cd = document.getElementById(val);
	cd.parentElement.style.background = '#FE4747';
	RitornoCss(val);

	if(val== 'lblEtaTutte'|| val =='lblEtaSel' || val =='lblEtaSingola'){
		FasciaEtaSel = true;
		SelEta = val;
		} //fascia di età

	if(val== 'lblEseguito'|| val =='lblNuoviIngressi' || val =='lblUltimaMammo'|| val =='lblSenzaMammo') //opzioni di selezione
	{
	 OpzioniSel = true;
	 SelOpz = val;

	}else{
		OpzioniSel = false;
	}
		

	}

function Nascondi(obj){
	 cd = document.getElementById(obj); 
	 cd.style.visibility = 'hidden';
	}

function Visualizza(obj){
	 cd = document.getElementById(obj); 
	 cd.style.visibility = 'visible';	
	}
/*utility*/
function intercettaTasto(Tipo){
	if(Tipo=='A'){
		
		keycode = event.keyCode;
		if (event.keyCode == 13) {
			RicercaAnag('A');
		}
	}else{
		keycode = event.keyCode;
		if (event.keyCode == 13) {
			RicercaAnag('S');
		}
	}
}
function seleziona_tutti_scr()
{
	var idx;
	
	for(idx = 0; idx < document.all.oTable.rows.length; idx++){

		if (!hasClass(document.all.oTable.rows(idx), "sel")){
				illumina_multiplo(idx,array_iden_anag);
				}
			}
	SelAll = true;
}
function MostraRecord(Tipo){
	if(Tipo == '0'){
		parent.document.all.lblWk.innerHTML = 'Risultato, Totale :'+ _TOTALE_RECORD_WK;
	}
}
function deseleziona_tutti_scr()
{
	var idx;
	
	for(idx = 0; idx < document.all.oTable.rows.length; idx++)
		if(hasClass(document.all.oTable.rows(idx),"sel")){
			illumina_multiplo(idx, array_iden_anag);
		}
SelAll = false;
}
