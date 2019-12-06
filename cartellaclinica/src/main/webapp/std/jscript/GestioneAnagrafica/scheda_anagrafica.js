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
	if(document.frmDati.strComRes.value == '')
		document.frmDati.hComRes.value = '';

	if(document.frmDati.strProfessione.value == '')
		document.frmDati.hProfessione.value = '';

	if(document.frmDati.strNazione.value == '')
		document.frmDati.hNazione.value = '';

	if(document.frmDati.strMedBase.value == '')
    	document.frmDati.hMedBase.value = '';
	
	if(document.frmDati.strQuaBeneficiario.value == '')
		document.frmDati.hQualBenef.value = '';
		
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
			CJsGestioneAnagrafica.eliminaEsenzioniPaziente(idenAnag+'*'+sorgente, cbkeliminaEsenzioniPaziente);
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
		if(sorgente == 'RicercaPazienti')
			opener.aggiorna_chiudi();
		else
			opener.aggiorna();//sorgente = 'worklist'
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
		if(msg_sorgente[1] == 'RicercaPazienti')
			opener.aggiorna_chiudi();
		else
			opener.aggiorna();//sorgente = 'worklist'
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
		if(controlla_altezza())
			bmiCalc(document.frmDati);
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
		return false
	}

	if (!checkNum(height,"Altezza")) 
	{
		form.altezza.select();
		form.altezza.focus();
		return false
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
		var interp = "Sottopeso"
	} 
	else 
	{
		if (bmi < 25.0) 
		{
			var interp = "Normopeso"
		} 
		else 
		{
			if (bmi < 30.0) 
			{
				var interp = "Sovrappeso"
			} 
			else 
			{
				var interp = "Obesità"
			}
		}
	}

	form.sup_corporea.value = AreaSupCorporea;
	form.peso_ideale.value = PesIdKg;
	form.body_mass_index.value = bmi;
	form.risultato_peso.value = interp;

	return true
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
    return number
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
		document.tab_std.mywhere.value="";
	windowHandle=window.open("", "winstd", "status=yes, scrollbars=auto, height=600, width=400, top=10, left=10");
	if(valore=="CM")
	{
		document.tab_std.myproc.value="TAB_COMN";
		document.tab_std.myric.value=document.frmDati.strLuogoNas.value;
		
	}
	if(valore=="CR")
	{
		document.tab_std.myproc.value="TAB_COMR";
		document.tab_std.myric.value=document.frmDati.strComRes.value;
		
	}
	if(valore=="CD")
	{
		document.tab_std.myproc.value="TAB_COMD";
		document.tab_std.myric.value=document.frmDati.strComDom.value;
		
	}
	if(valore=="NAZ")
	{
		document.tab_std.myproc.value="TAB_NAZIONI";
		document.tab_std.myric.value=document.frmDati.strNazione.value;
		
	}
	if(valore=="MEDB")
	{
		document.tab_std.myproc.value="TAB_MEDB";
		document.tab_std.myric.value=document.frmDati.strMedBase.value;
		
	}
	if(valore=="CCSE")
	{
		document.tab_std.myproc.value="TAB_STRU_EMAN";
		document.tab_std.myric.value=document.frmDati.strStruEman.value;
		document.tab_std.mywhere.value="COD_NAZ='"+document.frmDati.hNazione.value+"'";
		
	}
	if(valore=="PROF")
	{
		document.tab_std.myproc.value="TAB_PRF";
		document.tab_std.myric.value=document.frmDati.strProfessione.value;
		
	}
	if(valore=="QBEN")
	{
		document.tab_std.myproc.value="TAB_QUAL_BENEFICIARI";
		document.tab_std.myric.value=document.frmDati.strQuaBeneficiario.value;
		
	}
	document.tab_std.submit();
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
		if(stato==3)
			boolRet=true;
	}	//if(eMail!="")
	else
		boolRet=true;
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



function insert(valore)
{
	var doc = document.frmDati;
	var mancano = '';
	//document.frmDati.strPresso.disabled=false;
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
	
	/*
	alert('OB_NASCITA: ' + baseGlobal.OB_NASCITA);
	alert('OB_CODICE_FISCALE: ' + baseGlobal.OB_CODICE_FISCALE);
	alert('OB_RESIDENZA: ' + baseGlobal.OB_RESIDENZA);
	*/
	
	
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
			//alert(ritornaJsMsg("MSG_NOCOGNINSERT"));
			//document.frmDati.strCogn.focus();
			mancano = '- COGNOME\n';
		}
		
		if(doc.strNome.value == '')
		{
			//alert(ritornaJsMsg("MSG_NONOMEINSERT"));
			//document.frmDati.strNome.focus();
			mancano += '- NOME\n';
		}
		
		if(doc.strDataPaz.value == '' || doc.strDataPaz.value.length != 10)
		{
			//alert(ritornaJsMsg("MSG_NODATAINSERT"));
			//document.frmDati.strDataPaz.focus();
			mancano += '- DATA DI NASCITA\n';
		}
		else
		{
			tmp=document.frmDati.strDataPaz.value
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
			if(parseInt(dataOggiStringa)<parseInt(data_stringa))
			{
				alert(ritornaJsMsg("MSG_NOCORRECTDATAINSERT"));
				document.frmDati.strDataPaz.focus();
				return;
			}
		}
			
		if(doc.hSesso.value == '')
		{
			//alert(ritornaJsMsg("MSG_NOSESSOINSERT"));
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

			if(doc.strLuogoNas.value == '')
			{
				//alert(ritornaJsMsg('MSG_NOLUOGONASCITAINSERT'));
				//document.frmDati.strLuogoNas.focus();
				mancano += '- LUOGO DI NASCITA\n';
			}
		}
	
		//Codice Fiscale
		if(baseGlobal.OB_CODICE_FISCALE == "S")
		{
			if(document.frmDati.strCodiceFisc.value == '')
			{
				//alert(ritornaJsMsg('MSG_NOCODICEFISCALEINSERT'));
				//document.frmDati.strCodiceFisc.focus();
				mancano += '- CODICE FISCALE\n';
			}
		}
	
		//Residenza
		if(baseGlobal.OB_RESIDENZA == "S") 
		{
			if(document.frmDati.strComRes.value == '')
			{
				//alert(ritornaJsMsg('MSG_NORESIDENZAINSERT'));
				//document.frmDati.strComRes.focus();
				mancano += '- COMUNE DI RESIDENZA\n';
			}
		}
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
	}

	if(valore=="esame")
	{
		document.frmDati.inserire_esame.value="S";
	}
	
	document.frmDati.strNome.value = document.frmDati.strNome.value.toUpperCase();
	document.frmDati.strCogn.value = document.frmDati.strCogn.value.toUpperCase();
	
	//calc_cod_fisc('registrazione');
	
	var cod_fisc_inserito  = document.frmDati.strCodiceFisc.value;
	
	if(cod_fisc_inserito != '')
	{
		if(cod_fisc_inserito.length < 16)
		{
			alert(ritornaJsMsg('alert_cod_fisc_errato'));//Attenzione il codice fiscale inserito è errato
			return;
		}
		
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
	var char = '';
	
	try{
		char = carattere_errato.split('x');
	}
	catch(e){
		char = carattere_errato;
	}
	
	for(i = 0; i < stringa.length; i++)
		for(j = 0; j < char.length; j++)
			if(stringa.charAt(i) == char[j])
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
/*if((stringa.substring(i, i+1) == '\\') || (stringa.substring(i, i+1) == '|') || (stringa.substring(i, i+1) == '!')
		|| (stringa.substring(i, i+1) == '"') || (stringa.substring(i, i+1) == '£')	|| (stringa.substring(i, i+1) == '$')																								  	    || (stringa.substring(i, i+1) == '&') || (stringa.substring(i, i+1) == '/') || (stringa.substring(i, i+1) == '(')
        || (stringa.substring(i, i+1) == ')') || (stringa.substring(i, i+1) == '=')	|| (stringa.substring(i, i+1) == '?')		
		|| (stringa.substring(i, i+1) == '^') || (stringa.substring(i, i+1) == '*') || (stringa.substring(i, i+1) == 'ç')
		|| (stringa.substring(i, i+1) == '°') || (stringa.substring(i, i+1) == '§') || (stringa.substring(i, i+1) == '_')
		|| (stringa.substring(i, i+1) == '-') || (stringa.substring(i, i+1) == ';') || (stringa.substring(i, i+1) == ':')
		|| (stringa.substring(i, i+1) == '.') || (stringa.substring(i, i+1) == '#') || (stringa.substring(i, i+1) == '+')
		|| (stringa.substring(i, i+1) == '>') || (stringa.substring(i, i+1) == '<')
		)*/
		
		/*if(stringa.charAt(i).toUpperCase() != "A" && stringa.charAt(i).toUpperCase() != "B" && stringa.charAt(i).toUpperCase() != "C" && stringa.charAt(i).toUpperCase() != "D" && stringa.charAt(i).toUpperCase() != "E" && stringa.charAt(i).toUpperCase() != "F" && stringa.charAt(i).toUpperCase() != "G" && stringa.charAt(i).toUpperCase() != "H" && stringa.charAt(i).toUpperCase() != "I" && stringa.charAt(i).toUpperCase() != "J" && stringa.charAt(i).toUpperCase() != "K" && stringa.charAt(i).toUpperCase() != "L" && stringa.charAt(i).toUpperCase() != "M" && stringa.charAt(i).toUpperCase() != "N" && stringa.charAt(i).toUpperCase() != "O" && stringa.charAt(i).toUpperCase() != "P" && stringa.charAt(i).toUpperCase() != "Q" && stringa.charAt(i).toUpperCase() != "R" && stringa.charAt(i).toUpperCase() != "S" && stringa.charAt(i).toUpperCase() != "T" && stringa.charAt(i).toUpperCase() != "U" && stringa.charAt(i).toUpperCase() != "V" && stringa.charAt(i).toUpperCase() != "X" && stringa.charAt(i).toUpperCase() != "W" && stringa.charAt(i).toUpperCase() != "Y" && stringa.charAt(i).toUpperCase() != "Z" && stringa.charAt(i).toUpperCase() != " " && stringa.charAt(i).toUpperCase() != "'" 																																																																																																																																																																																																																																																																																																			
																																																																																																																																																																																																																																																																																																					&& stringa.charAt(i).toUpperCase() != "0" && stringa.charAt(i).toUpperCase() != "1" && stringa.charAt(i).toUpperCase() != "2"																																																																																																																																																																																																																																																																																																					&& stringa.charAt(i).toUpperCase() != "3" && stringa.charAt(i).toUpperCase() != "4" && stringa.charAt(i).toUpperCase() != "5"
&& stringa.charAt(i).toUpperCase() != "6" && stringa.charAt(i).toUpperCase() != "7" && stringa.charAt(i).toUpperCase() != "8"
&& stringa.charAt(i).toUpperCase() != "9")*/





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


function gestione_data_paziente(valore)
{
	document.frmDati.strDataPaz.value=checkDate(valore);
	document.frmDati.strAge.value=getAge(valore);
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