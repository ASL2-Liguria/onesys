function calc_cod_fisc(registrazione)
{
	initbaseGlobal();

	cognome = document.frmDati.strCogn.value;
	nome 	= document.frmDati.strNome.value;
	data 	= document.frmDati.strDataPaz.value;
	sesso 	= document.frmDati.hSesso.value;
	cod_com = document.frmDati.hCodCom.value;
	
	if(registrazione == 'registrazione' && cod_com == "" && baseGlobal.OB_NASCITA == 'N')
	{
		return;
	}
	
	if(cognome=="")
	{
		alert(ritornaJsMsg("MSG_NOCOGN"));
		document.frmDati.strCogn.focus();
		return;
	}
	if(nome=="")
	{
		alert(ritornaJsMsg("MSG_NONOME"));
		document.frmDati.strNome.focus();
		return;
	}
	if(data=="")
	{
		alert(ritornaJsMsg("MSG_NODATANAS"));
		document.frmDati.strDataPaz.focus();
		return;
	}
	if(cod_com == "")
	{
		alert(ritornaJsMsg("MSG_NOCOMNAS"));
		document.frmDati.strLuogoNas.focus();
		return;
	}
	valore=calcola_cfs(cognome,nome,data,sesso,cod_com);
	if (valore!="")
	{
		document.frmDati.strCodiceFisc.value = valore;
		return;
	}
}

function apriEsenzioni(readOnly)
{
	//document.frmDati.action="SL_EsenzioniPaziente?readonly="readOnly;
	//document.frmDati.submit();
	
	document.frmDati.action="SL_EsenzioniPaziente?readonly="+readOnly;
	document.frmDati.target = "wndEsenzione";
	
	var esenzione = window.open('','wndEsenzione','status=yes, width=1000, height=680, top=0,left=5');//
		//fullscreen=yes
	document.frmDati.submit();
}

function aggiorna()
{
}

function stampa(iden_anag)
{
	if(iden_anag == '-1')
	{
		alert('Impossibile effettuare la stampa.Paziente sconosciuto');
		return;
	}
	document.form_stampa.stampaIdenEsame.value = iden_anag;
	document.form_stampa.stampaFunzioneStampa.value = 'SCHEDA_ANAG_STD';
	document.form_stampa.stampaSorgente.value= 'Scheda_Anagrafica';
	
	document.form_stampa.action = 'elabStampa';
	document.form_stampa.target = 'wndStampaAnag';
	
	winStampa = window.open('','wndStampaAnag','status=yes, scrollbars = yes, width=1000, height=680, top=0,left=5');
	if (winStampa)
	{	
		winStampa.focus();
	}
	else
	{
		winStampa = window.open("","wndStampaAnag","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
	}
	document.form_stampa.submit();
}


function putDataValue(valore)
{
	if(valore=="CM")
	{
		oldValue=document.all.strLuogoNas.value;
		oldIden=document.all.hLuogoNas.value;
	}
	else if(valore=="CR")
	{
		oldValue=document.all.strComRes.value;
		oldIden=document.all.hComRes.value;
	}
	else if(valore=="CD")
	{
		oldValue=document.all.strComDom.value;
		oldIden=document.all.hComDom.value;
	}
	else if(valore=="NAZ")
	{
		oldValue=document.all.strNazione.value;
		oldIden=document.all.hIdenNaz.value;
	}
	else if(valore=="MEDB")
	{
		oldValue=document.all.strMedBase.value;
		oldIden=document.all.hMedBase.value;
	}
	else if(valore=="CCSE")
	{
		oldValue=document.all.strStruEman.value;
		oldIden=document.all.strDescStruttura.value;
	}
	else if(valore=="PROF")
	{
		oldValue=document.all.strProfessione.value;
		oldIden=document.all.hProfessione.value;
	}
}

/*Metodo che effettua il controllo di univocità sul campo della transcodifica: cod_dec di ogni tabella*/
function controlData(valore)
{
	if(valore=="CM")
	{
		if(oldValue!=document.all.strLuogoNas.value && oldIden==document.all.hLuogoNas.value)
		{
			document.all.hLuogoNas.value="";
		}
	}
	else if(valore=="CR")
	{
		if(oldValue!=document.all.strComRes.value && oldIden==document.all.hComRes.value)
		{
			document.all.hComRes.value="";
		}
	}
	else if(valore=="CD")
	{
		if(oldValue!=document.all.strComDom.value && oldIden==document.all.hComDom.value)
		{
			document.all.hComDom.value="";
		}
	}
	else if(valore=="NAZ")
	{
		//alert(oldValue+" - "+document.all.strNazione.value);
		if(oldValue!=document.all.strNazione.value)
		{
			if(oldIden==document.all.hIdenNaz.value)
			{
				document.all.hIdenNaz.value="";
			}
			document.all.strStruEman.value="";
			document.all.strDescStruttura.value="";
		}
	}
	else if(valore=="MEDB")
	{
		if(oldValue!=document.all.strMedBase.value && oldIden==document.all.hMedBase.value)
		{
			document.all.hMedBase.value="";
		}
	}
	else if(valore=="CCSE")
	{
		if(oldValue!=document.all.strStruEman.value && oldIden==document.all.strDescStruttura.value)
		{
			document.all.strDescStruttura.value="";
		}
	}
	else if(valore=="PROF")
	{
		if(oldValue!=document.all.strProfessione.value && oldIden==document.all.hProfessione.value)
		{
			document.all.hProfessione.value="";
		}
	}
}


function clearParamScanDb()
{
	if(document.frmDati.strComRes.value == ''){
		document.frmDati.hComRes.value = '';
	}
	if(document.frmDati.strProfessione.value == ''){
		document.frmDati.hProfessione.value = '';
	}
	if(document.frmDati.strNazione.value == ''){
		document.frmDati.hNazione.value = '';
	}
	if(document.frmDati.strMedBase.value == ''){
    	document.frmDati.hMedBase.value = '';
	}
	if(document.frmDati.strQuaBeneficiario.value == ''){
		document.frmDati.hQualBenef.value = '';
	}	
	document.frmDati.action = 'SL_TestaAnag';
	document.frmDati.target = '_self';
	document.frmDati.method = 'POST';
}

/** Funzione che serve per eseguire i passi finali prima della 
 *	chiusura della finestra della gestione della scheda anagrafica
 */
function chiudi(sorgente, idenAnag, procedura)
{
	//alert(sorgente + '   ' + idenAnag + '   ' + procedura);	
	if(idenAnag == -1)
	{
		//alert('Cancello esenzioni paziente');
		try
		{
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.eliminaEsenzioniPaziente(idenAnag+'*'+sorgente, cbkeliminaEsenzioniPaziente);
			dwr.engine.setAsync(true);
		}
		catch(e){
			/*Creos!!!!!!*/
			opener.aggiorna();
			self.close();
		}
	}
	else
	{
		//alert('Non cancello esenzioni paziente');
		if(sorgente == 'visualizza_esami_ric_paz')
		{
			self.close();
			return;
		}
		if(sorgente == 'FromMenuVerticalMenu'){//RicercaPazienti
			opener.aggiorna_chiudi();
		}else{
			opener.aggiorna();//sorgente = 'worklist'
		}
		self.close();
	}
}


function cbkeliminaEsenzioniPaziente(errorMessage_sorgente)
{
	CJsGestioneAnagrafica = null;
	var msg_sorgente = errorMessage_sorgente.split('@');

	if(msg_sorgente[0] != '')
	{
		alert(msg_sorgente[0]);
		try{
			chiudi('RicercaPazienti', '', '');
		}
		catch(e){
		}
		return;
	}
	else
	{
		if(msg_sorgente[1] == 'visualizza_esami_ric_paz')
		{
			self.close();
			return;
		}
		if(msg_sorgente[1] == 'RicercaPazienti'){
			opener.aggiorna_chiudi();
		}else{
			opener.aggiorna();//sorgente = 'worklist'
		}
		self.close();
	}
}


/*CALCOLO PESO CORPOREO IDEALE*/
function calcolo_peso_ideale()
{
	gestioneDIV();
	if(document.frmDati.peso.value != '' && document.frmDati.altezza.value != '' &&
	   document.frmDati.peso.value != '0' && document.frmDati.altezza.value != '0')
	{
		if(controlla_altezza()){
			bmiCalc(document.frmDati);
		}
	}
	
	disabilitaCertificata();
}

function controlla_altezza()
{
	var ok = true;
	var position = document.frmDati.altezza.value.indexOf('.');
	if(position != -1)
	{
		ok = false;
		document.frmDati.altezza.value = '';
		document.frmDati.altezza.focus();
		alert(ritornaJsMsg('alert_cm'));
	}
	return ok;
}


function bmiCalc(form) 
{
	var weight = Number(form.peso.value);
    var height = Number(form.altezza.value);

	if (!checkNum(weight,"Peso")) 
	{
		form.peso.select();
		form.peso.focus();
		return false;
	}

	if (!checkNum(height,"Altezza")) 
	{
		form.altezza.select();
		form.altezza.focus();
		return false;
	}

    if (form.hSesso.value == 'F')//form.sex[1].checked 
	{      
        //  0 = sesso maschile
        //  1 = sesso femminile
    	idealConvert = 45.5;	//  fattore di conversione per sesso F
     } 
     else 
	 {
     	idealConvert = 50;	//  fattore di conversione per sesso M
     }
	/*
	 if (form.hu.selectedIndex == 0) 
	 {  
		 //  se le unità sono "cm"
		 AltezzaMetri = height / 100;
	 }

     if (form.hu.selectedIndex == 1) 
	 {
        //  se le unità sono "metri"
      AltezzaMetri = height;
     }
	 */
	AltezzaMetri = height/100;
	var AreaSupCorporea = 0.20247 * Math.pow(AltezzaMetri,0.725) * Math.pow(weight,0.425);
    var PesIdKg = idealConvert + 2.3 * ((AltezzaMetri * 100 /2.54) - 60);
    var bmi = weight / Math.pow(AltezzaMetri,2);
   
    AreaSupCorporea = rounding(AreaSupCorporea,2);
    PesIdKg = Math.round(PesIdKg);
    bmi = rounding(bmi,1);

	if (bmi < 18.5) 
	{
		var interp = "Sottopeso";
	} 
	else 
	{
		if (bmi < 25.0) 
		{
			var interp = "Normopeso";
		} 
		else 
		{
			if (bmi < 30.0) 
			{
				var interp = "Sovrappeso";
			} 
			else 
			{
				var interp = "Obesità";
			}
		}
	}

	form.sup_corporea.value = AreaSupCorporea;
	form.peso_ideale.value = PesIdKg;
	form.body_mass_index.value = bmi;
	form.risultato_peso.value = interp;

	return true;
}


function checkNum(val,text) 
{
	if ((val == null) || (isNaN(val)) || (val == "") || (val < 0)) 
	{
		alert("Inserire un valore corretto il parametro " + text + ".");
        return false;
     }
     return true;
}


function rounding(number,decimal) 
{
	multiplier = Math.pow(10,decimal);
	number = Math.round(number * multiplier) / multiplier;
    return number;
}


/*
function cambiaDataNulla()
{
	if(document.frmDati.hDataDaVerificare.value=="S")
	{
		document.frmDati.hDataDaVerificare.value="N";
		document.frmDati.imgdata.src = "imagexPix/schedaAnag/nospuntaradio.gif";
	}
	else
	{
		document.frmDati.hDataDaVerificare.value="S";
		document.frmDati.imgdata.src = "imagexPix/schedaAnag/spuntaradio2.gif";
	}
}
*/

/*
 @param tipo: 0 maschio
 			  1 femmina
*/
function settaMaschioFemmina(tipo)
{	
	if(tipo == 0)
	{
		document.frmDati.femmina.src="imagexPix/schedaAnag/nospuntaradio.gif";
		document.frmDati.maschio.src="imagexPix/schedaAnag/spuntaradio2.gif";
		document.frmDati.hSesso.value="M";
	}
	else
	{
		document.frmDati.femmina.src="imagexPix/schedaAnag/spuntaradio2.gif";
		document.frmDati.maschio.src="imagexPix/schedaAnag/nospuntaradio.gif";
		document.frmDati.hSesso.value="F";
	}
}


function trattDatiPers()
{
	if(document.frmDati.hTrattDatiPers.value=="S")
	{
		document.frmDati.hTrattDatiPers.value="N";
		document.frmDati.imgDatiPers.src = "imagexPix/schedaAnag/nospuntaradio.gif";
	}
	else
	{
		document.frmDati.hTrattDatiPers.value="S";
		document.frmDati.imgDatiPers.src = "imagexPix/schedaAnag/spuntaradio2.gif";
	}
}

function finestre_popup(valore)
{
	if(document.all.hIdenNaz.value=="" && valore=="CCSE")
	{
		alert(ritornaJsMsg("MSG_INSERTCITTADINANZA"));
		return;
	}
	
	document.tab_std.mywhere.value = "";
	
	if(valore == "CM")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_COMN";
		document.tab_std.myric.value=document.frmDati.strLuogoNas.value;
		document.tab_std.submit();
	}
	if(valore=="CR")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_COMR";
		document.tab_std.myric.value=document.frmDati.strComRes.value;
		document.tab_std.submit();
	}
	if(valore=="CD")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_COMD";
		document.tab_std.myric.value=document.frmDati.strComDom.value;
		document.tab_std.submit();
	}
	if(valore=="NAZ")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_NAZIONI";
		document.tab_std.myric.value=document.frmDati.strNazione.value;
		document.tab_std.submit();
	}
	if(valore=="MEDB")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_MEDB";
		document.tab_std.myric.value=document.frmDati.strMedBase.value;
		document.tab_std.submit();
	}
	if(valore=="CCSE")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_STRU_EMAN";
		document.tab_std.myric.value=document.frmDati.strStruEman.value;
		document.tab_std.mywhere.value="COD_NAZ='"+document.frmDati.hNazione.value+"'";
		document.tab_std.submit();
	}
	if(valore=="PROF")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_PRF";
		document.tab_std.myric.value=document.frmDati.strProfessione.value;
		document.tab_std.submit();
	}
	if(valore=="QBEN")
	{
		windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
		document.tab_std.myproc.value="TAB_QUAL_BENEFICIARI";
		document.tab_std.myric.value=document.frmDati.strQuaBeneficiario.value;
		document.tab_std.submit();	
	}
}

function checkEMail(eMail)
{
	var T=0;
	var stato=0;
	var mioChar='';
	var boolRet=false;
	var strTmp="";

	if(eMail!="")
	{
		for(T=0 ; T<eMail.length ; T++)
		{
			mioChar=eMail.charAt(T);
			switch(stato)
			{
				case 0:
					strTmp=strTmp.concat("0");
					if(mioChar=='.')
					{
						stato=1;
					}
					else if(mioChar=='@')
					{
						stato=2;
					}
					else if(!checkValidChar(mioChar))
					{
						T=eMail.length;
					}
					break;
				case 1:
					strTmp=strTmp.concat("1");
					if(checkValidChar(mioChar))
					{
						stato=0;
					}
					else
					{
						T=eMail.length;
					}
					break;
				case 2:
					strTmp=strTmp.concat("2");
					if(checkValidChar(mioChar))
					{
						stato=3;
					}
					else
					{
						T=eMail.length;
					}
					break;
				case 3:
					strTmp=strTmp.concat("3");
					if(mioChar=='.')
					{
						stato=4;
					}
					else if(!checkValidChar(mioChar))
					{
						T=eMail.length;
					}
					break;
				case 4:
					strTmp=strTmp.concat("4");
					if(checkValidChar(mioChar))
					{
						stato=3;
					}
					else
					{
						T=eMail.length;
					}
					break;
			}	//switch(stato)
		}	//for(T=0 ; T<eMail.length ; T++)
		//Controllo validita EMail
		if(stato==3){
			boolRet=true;
		}
	}	//if(eMail!="")
	else{
		boolRet=true;
	}
	return boolRet;
}

function checkValidChar(mioChar)
{
	var boolRet=false;

	if((mioChar>='a' && mioChar<='z') || (mioChar>='A' && mioChar<='Z') || (mioChar>='0' && mioChar<='9'))
	{
		boolRet=true;
	}

	return boolRet;
}


/*	
Controllo su data di nascita 
(impedire che la data di nascita sia più vecchia di 150 anni – non si può inserire data futura)
*/
function insert(valore)
{
	var doc = document.frmDati;
	var mancano = '';

	if (windowHandle != -1)
	{
		windowHandle.close();
	}
	
	if(check_data(doc.strCogn) == false || check_data(doc.strNome) == false)//	   || check_data(doc.strIndirizzoDom) == false || check_data(doc.strIndirizzo) == false)
	{
		return;
	}
	
	gestione_data_paziente(doc.strDataPaz.value);	
	
	if(document.frmDati.strLuogoNas.value == '')
	{
		document.frmDati.hLuogoNas.value = '';
		document.frmDati.hCodCom.value = '';
	}

	//inizio controllo campi
	if(doc.strCogn.value == '' ||
	   doc.strNome.value == '' ||
	   (document.frmDati.strDataPaz.value == '' || document.frmDati.strDataPaz.value.length != 10) ||
	   doc.hSesso.value == '' ||
	   (document.frmDati.hComRes.value != '' && document.frmDati.strCodiceReg.value != '999') || 
	   baseGlobal.OB_NASCITA == 'S' ||
	   baseGlobal.OB_CODICE_FISCALE == "S" ||
	   baseGlobal.OB_RESIDENZA == "S")
	{
		if(doc.strCogn.value == '')
		{
			mancano = '- COGNOME\n';
		}
		
		if(doc.strNome.value == '')
		{
			mancano += '- NOME\n';
		}
		
		if(doc.strDataPaz.value == '' || doc.strDataPaz.value.length != 10)
		{
			mancano += '- DATA DI NASCITA\n';
		}
					
		if(doc.hSesso.value == '')
		{
			mancano += '- SESSO\n';
		}	
		
		if(doc.hComRes.value != '' && doc.strCodiceReg.value != '999')
		{
			if(doc.strCUsl.value == '')
			{
				alert(ritornaJsMsg("MSG_NOCUSLINSERT"));
				doc.strCUsl.focus();
				return;
			}
		}

		//Nascita
		if(baseGlobal.OB_NASCITA == "S") 
		{

			if(document.all.hLuogoNas.value == '') //if(doc.strLuogoNas.value == '')
			{
				mancano += '- LUOGO DI NASCITA\n';
			}
		}
	
		//Codice Fiscale
		if(baseGlobal.OB_CODICE_FISCALE == "S")
		{
			if(document.frmDati.strCodiceFisc.value == '')
			{
				mancano += '- CODICE FISCALE\n';
			}
		}
	
		//Residenza
		if(baseGlobal.OB_RESIDENZA == "S") 
		{
			if(document.all.hComRes.value == '')//if(document.frmDati.strComRes.value == '')
			{
				mancano += '- COMUNE DI RESIDENZA\n';
			}
			/*VERONA
			if(document.frmDati.strIndirizzo.value == '')
			{
				mancano += '- INDIRIZZO DI RESIDENZA\n';
			}

			
			if(document.frmDati.strNCivico.value == '')
			{
				mancano += '- NUMERO CIVICO DI RESIDENZA\n';
			}*/			
		}
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
	}//Fine controllo campi 
	
	/*CONTROLLO SULLA DATA DI NASCITA: se data inserita è maggiore di 150 anni o se ha data futura*/
	tmp = document.frmDati.strDataPaz.value;
	if(tmp != ''){
		data_stringa=tmp.substr(6, 4)+tmp.substr(3, 2)+tmp.substr(0, 2)
		dataOggi=new Date();
		dataOggiGiorno=dataOggi.getDate();
		dataOggiMese=dataOggi.getMonth()+1;
		dataOggiAnno=dataOggi.getFullYear();
		dataOggiStringa=""+dataOggiAnno;
		if(dataOggiMese<10)
			dataOggiStringa+="0";
		dataOggiStringa+=dataOggiMese;
		if(dataOggiGiorno<10)
			dataOggiGiorno+="0";
		dataOggiStringa+=dataOggiGiorno;
		/*Controllo se la data inserita è futura*/
		if(parseInt(dataOggiStringa)<parseInt(data_stringa))
		{
			alert(ritornaJsMsg("MSG_NOCORRECTDATAINSERT"));//La data di nascita del paziente ha valore futuro
			document.frmDati.strDataPaz.focus();
			return;
		}
		
		annoInserito = tmp.substr(6, 4);
		valoreMinimoAccettabile = (parseInt(dataOggiAnno)-parseInt(150));
		//alert('anno insert: ' + annoInserito);
		//alert('anno oggi-150: ' + valoreMinimoAccettabile);
		if(parseInt(annoInserito) < parseInt(valoreMinimoAccettabile)){
			alert('La data di nascita del paziente è troppo vecchia');
			document.frmDati.strDataPaz.focus();
			return;		
		}
	}
	if(!controlloStrutturaTesseraSanitaria())
		return;
	
	if(valore=="esame")
	{
		document.frmDati.inserire_esame.value="S";
	}
	
	document.frmDati.strNome.value = document.frmDati.strNome.value.toUpperCase();
	document.frmDati.strCogn.value = document.frmDati.strCogn.value.toUpperCase();
	
	//calc_cod_fisc('registrazione');
	
	var cod_fisc_inserito  = document.frmDati.strCodiceFisc.value;
	
	if(cod_fisc_inserito != '' && (cod_fisc_inserito.substring(0,3).toUpperCase() != 'STP'))
	{
		if(doc.hcertificato.value == 'N' || doc.hcertificato.value == ''){
			/*if(cod_fisc_inserito.length < 16)
			{
				alert(ritornaJsMsg('alert_cod_fisc_errato'));//Attenzione il codice fiscale inserito è errato
				return;
			}*/
			
			
			var cod_fisc_right = controllo_correttezza_cod_fisc(document.frmDati.strCodiceFisc, 'alert_cod_fisc_errato');	
			if(cod_fisc_right != 1)
				return;
			
			var cognome = document.frmDati.strCogn.value;
			var nome 	= document.frmDati.strNome.value;
			var data 	= document.frmDati.strDataPaz.value;
			var sesso 	= document.frmDati.hSesso.value;
			var cod_com = document.frmDati.hCodCom.value;
			
			var cod_fisc_calcolato = calcola_cfs(cognome,nome,data,sesso,cod_com);
			
			/*alert('C.F. calcolato: ' + cod_fisc_calcolato);
			alert('C.F. inserito: ' + cod_fisc_inserito);*/
			
			if(cod_fisc_calcolato != cod_fisc_inserito.toUpperCase())
			{
				if(confirm(ritornaJsMsg('cfins') + " " + cod_fisc_inserito + " " + ritornaJsMsg('cfcalc') + " " + cod_fisc_calcolato + " " + ritornaJsMsg('cffine')))//Registrare quello inserito?
				{
					document.frmDati.strCodiceFisc.value = cod_fisc_inserito;
				}
				else
					document.frmDati.strCodiceFisc.value = cod_fisc_calcolato;
			}
		}
	}
	else
		if(baseGlobal.CHECK_COD_FISC == 'S')
		{
			alert(ritornaJsMsg('alert_cod_fisc_nullo')); 
		}
		
	
	document.frmDati.strCodiceFisc.value = document.frmDati.strCodiceFisc.value.toUpperCase();
	
	
	document.frmDati.strIndirizzo.value = document.frmDati.strIndirizzo.value.toUpperCase();
	document.frmDati.strNCivico.value = document.frmDati.strNCivico.value.toUpperCase();
	
	document.frmDati.strIndirizzoDom.value = document.frmDati.strIndirizzoDom.value.toUpperCase();
	document.frmDati.strCivicoDom.value = document.frmDati.strCivicoDom.value.toUpperCase();

	clearParamScanDb();
	document.frmDati.submit();
}

/*
	Funzione richiamata dal tag Cognome e Nome
*/
function check_data(data)
{
	var ricerca = true;
	
	var nome = '';
	
	var stringa = replace_stringa(data.value, "'");
	
	stringa = trim(stringa);
	
	var carattere_errato = baseGlobal.SET_CARATTERI_ERRATI;
	var charx = '';
	
	try{
		charx = carattere_errato.split('x');
	}
	catch(e){
		charx = carattere_errato;
	}
	
	for(i = 0; i < stringa.length; i++)
		for(j = 0; j < charx.length; j++)
			if(stringa.charAt(i) == charx[j])
			{
				ricerca = false;
				
				if(data.name == 'strCogn')
				{
					nome += 'COGNOME';
				}
				else
					if(data.name == 'strIndirizzoDom')
					{
						nome += 'INDIRIZZO DOMICILIO';
					}
					else
						if(data.name == 'strIndirizzo')
						{
							nome += 'INDIRIZZO RESIDENZA';
						}
						else
							nome += 'NOME';
						
				alert("Attenzione:carattere non valido nel campo " + nome);//alert(ritornaJsMsg('alert_underscore'));
				//data.value = '';
				//data.focus();
				i = stringa.length;
			}

	var appoggio = '';
	
	if(ricerca)
	{
		appoggio = replace_stringa(data.value, "'");
		data.value = appoggio.toUpperCase();
	}
	
	return ricerca;		
}

function check_float(valore)
{
	/*fvalo = parseFloat(valore.slice(10,2));
	alert(fvalo);*/
	
	if(isNaN(valore.value)) 
	{
		alert(ritornaJsMsg('alert_num_float')); 
		valore.value = ''; 
		valore.focus();
		return;
	} 
	else 
		calcolo_peso_ideale();
}

/**

**/
function gestione_data_paziente(valore)
{
	document.frmDati.strDataPaz.value = checkDate(valore);
	document.frmDati.strAge.value = getAge(valore);
	document.frmDati.strAgeMesi.value = getAgeMesi(valore);
}

function gestione_data_pazienteMorte(valore)
{
	document.frmDati.strDataPazMorte.value = checkDate(valore);
	//document.frmDati.strAge.value = getAge(valore);
	//document.frmDati.strAgeMesi.value = getAgeMesi(valore);
}



function gestioneDIV()
{
	document.all.primoDiv.style.display = 'block';
	document.all.primoDiv2.style.display = 'block';
	//document.all.NoteDiv.style.display = 'block';
	document.all.secondoDiv.style.display = 'block';
}



/**
	Funzione aggiunta per la gestione della certificazione MEF 
	utilizzando il db e la roba di Jack(attualmente disabilitata)
*/
function gestioneEventiCampi(){
	var doc = document.frmDati;
	
	set_eventi_check();

	try{
		if(doc.operazione.value != 'INS' && doc.hcertificato.value != '' && doc.hcertificato.value != 'N'){
			
			//alert('anag.CERTIFICATO: ' + doc.hcertificato.value);
			doc.strCogn.dwr();
			doc.strCogn.dwr();
			doc.strNome.dwr();
			doc.strDataPaz.dwr();
			doc.hSesso.dwr();
			doc.strLuogoNas.dwr();
			doc.strCodiceFisc.dwr();
			
			document.getElementById("LBL_LUOGONAS").onclick = '';
			document.getElementById("strLuogoNas").onblur = '';
			document.getElementById("LBL_CODFISC").onclick = '';
		}
	}
	catch(e){
		alert(e.description);
	}
}


/**
	Controllo richiesto dalla Lombardia-Bergamo.
	Ad ogni installazione verificare se è corretto anche nelle altre regioni
*/
function controlloStrutturaTesseraSanitaria(){
	var risultato = true;
	var codiceFiscale = document.frmDati.strCodiceFisc.value;
	var tessera = document.frmDati.strIdCard.value;
	
	if(tessera != '' && tessera == codiceFiscale){
		risultato = false;
		alert('Attenzione: la struttura della tessera sanitaria non è valida');
		try{
			document.frmDati.strIdCard.focus();
		}
		catch(e){
		}
	}
	else
		document.frmDati.strIdCard.value = document.frmDati.strIdCard.value.toUpperCase()
	return risultato;
}

