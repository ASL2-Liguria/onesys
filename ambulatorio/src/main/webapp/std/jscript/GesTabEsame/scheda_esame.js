// modifica 9-6-16 
var gblScaricoDema = false;
// ************************
// modifica 14-6-16
var gblScaricoManuale = false;						
// *******************

//var chiusura    = true;
// ATTENZIONE : modifica pro DEMA
//  il valore di default era true
// si DEVE verificare che i flussi continuino
// a funzionare correttamente
var chiusura    = false;
// ******************
var apri_scandb = true;
var id_obj		= '';
var ges_satapp = true;
var esa_no_rice = [43538,39960,40323,40321,40692,41274,40936,44782,43801,44152,41274];

// ****************
// modifica 14-6-16
var controlloEffettuato = false;
var statoManuale = '';
var impegnativaPresente = "";
// *****************

//***************************
//****** modifica DEMA ******
//***************************
var globalSito = "SAVONA";
var abilitazioneDema = "N";
// **********************

jQuery(function($){
	try{
            //if(document.gestione_esame.tipo_registrazione.value != "IA" ){
			$("#dataricetta").mask("99/99/9999");
            //}
	}
	catch(e){
	}
	try{$("input[name='medicoinviante']").first().removeClass("clsTextFullWidth");}catch(e){;}
	//***************************
	//****** modifica DEMA ******
	//***************************
	initbaseUser();
	try{globalSito = getHomeFrame().getConfigParam("SITO");}catch(e){globalSito = "SAVONA";}


	// modifica 13-6-16	
	try{
		if (globalSito=="SAVONA"){	abilitazioneDema = "S";	}
	}catch(e){;}
	// **********************	
	// modifica 7-10-15
	if (globalSito=="SAVONA"){
		$("#lblFlag").closest("table").remove();
		// ****************
		// modifica 14-6-16
		// modifica 31-8-16
		//controllo readOnly dematerializzate
		// modifica 21-10-16
		if (document.gestione_esame.Hint_est.value=="E" && document.gestione_esame.tipo_registrazione.value.split("*")[0].substr(0,1) != "I" && document.gestione_esame.tipo_registrazione.value.split("*")[0].substr(0,1) != "P" && NS_SATAPP.isDema(document.gestione_esame.Hiden_esame.value))		
		{
			//setReadOnlyField("IMPEGNATIVA,impegnativa");
			impegnativaPresente = document.gestione_esame.impegnativa.value;
			setReadOnlyField("IMPEGNATIVA,impegnativa");
			document.gestione_esame.impegnativa.readOnly=true;
		}
		// ***************************
	}
	// ***********
	
	// *********************
	// modifica 2-9-15
	setTimeout(function(){
			var cdcPreselezionato = "";
			try{
				cdcPreselezionato = $("input[type='text'][name='selCDC']").first().val();
				// correzione dle 7-9-15
				// aggiungere controllo tipo di provenienza che DEVE essere esterna
				if ((globalSito=="SAVONA")&&(cdcPreselezionato=="AMB_RAD_SV")&&(document.gestione_esame.tipo_registrazione.value.toString().substr(0,1)!="P")&&(document.gestione_esame.Hint_est.value=="E")){ 
					setObligatoryField("IMPEGNATIVA");
				}
			}catch(e){;}
			},2000);
	// **********************

//	alert(abilitazioneDema +"#");
	// opener.name
	/*
	da worklist:
	worklistMainFrame
	da ricerca paziente o da elenco esami di ricerca paz
	RicPazWorklistFrame
	
	*/
	// carico configurazioni
//	initConfigurazioniFromDb();

	try{
		// modifica aldo 26/8/14
		try{
			var radioTerap_utentiAbilitati = getHomeFrame().getConfigParam("GESTIONE_NUM_CART_RADTERAP.UTENTI_ABILITATI").split(",");
			if (radioTerap_utentiAbilitati.length >0){
				try{
					for (var k=0;k<radioTerap_utentiAbilitati.length;k++){
						if (radioTerap_utentiAbilitati[k]==baseUser.LOGIN){
							bolCreaGestRadioTerap = true;
							break;
						}
					}
					
				}catch(e){}
			}
		}
		catch(e){
			// ATTENZIONE, chiamata da whale si 
			// andr� sempre in eccezione perche' non si
			// riesce ad accedere all'ogetto home e quindi a getConfigParam
			//alert(e.description);
			bolCreaGestRadioTerap =false;
		}
		if(bolCreaGestRadioTerap){
			// creo riga per gestione
			var strTrToAdd = "<tr><td id='tdRADTERAP_NUM_CARTELLA' class='classTdLabel'>Numero Cartella</td><td class='classTdField' colspan='3'><input type='text' id='RADTERAP_NUM_CARTELLA' /></td></tr>";
			$("table[class='classDataEntryTable']").first().prepend(strTrToAdd);
			numCartellaRadTer_obj.setIdRelatedObj("RADTERAP_NUM_CARTELLA");
			numCartellaRadTer_obj.init(document.gestione_esame.Hiden_anag.value, document.gestione_esame.Hreparto.value);
		}
		// **************************
		
		//***************************
		//****** modifica DEMA ******
		//***************************
		if (!String.prototype.trim) {
		  (function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
			  return this.replace(rtrim, '');
			};
		  })();
		}	
		if ((globalSito=="SAVONA")&&(abilitazioneDema=="S")){
			// modifica 13-6-16
			// oltre alla gestione "live"
			$("select[name='selTicket']").on('change',function(){
				if (document.gestione_esame.Hint_est.value=="E"){																	   
					if  ( ($("option:selected", this).val()!="6")&&($("option:selected", this).val()!="87")){							
						// modifica 14-6-16
						// commento vecchio modalita
						setEditableField("IMPEGNATIVA");
						setEditableField("DATA_RICETTA");		
						if (!gblScaricoManuale){
							$("INPUT[name='impegnativa']").attr('readonly', false);								
						}
						else{
							$("INPUT[name='impegnativa']").attr('readonly', true);								
						}
						$("#dataricetta").unmask();
						// modifica 8-11-16
						//	$("#dataricetta").attr('readonly', true).val("");
						if ($("#dataricetta").val() != ""){
							$("#dataricetta").attr('readonly', true);
						}
						// ****************
					}
					else{
						setObligatoryField("IMPEGNATIVA");		
						setObligatoryField("DATA_RICETTA");
						if (!gblScaricoManuale){
							$("INPUT[name='impegnativa']").attr('readonly', false);
						}
						$("#dataricetta").attr('readonly', false);					
						$("#dataricetta").mask("99/99/9999");							
					}
				}
			});
			
			// *********************					

			// vedere select * from radsql.tab_tipo_mod_med where tipo ='P'
			if (document.gestione_esame.Hiden_mod_prescr.value == 103 && document.gestione_esame.tipo_registrazione.value== 'I')
				{
					//document.gestione_esame.provenienza.readOnly = true;
					document.gestione_esame.impegnativa.readOnly = true;
					$("#btSbloccaImpegnativa").hide();
					document.gestione_esame.selTicket.readOnly = true;
					document.gestione_esame.esenzione.readOnly = true;
					document.gestione_esame.selAccesso.disabled = true;
					document.gestione_esame.selPrioritaLea.disabled = true;
					document.gestione_esame.dataricetta.readOnly = true;
					document.gestione_esame.selPrescrittiva.disabled = true;
					document.gestione_esame.medicoinviante.readOnly = true;
					document.gestione_esame.cod_fisc_med.readOnly = true;
					document.gestione_esame.selTipoMedPrescr.disabled = true;
				}
				
				ges_satapp = true;
				var _operazione = document.gestione_esame.tipo_registrazione.value;
				var _iden_anag  = document.gestione_esame.Hiden_anag.value;
				var _num_pre    = document.gestione_esame.Hnum_pre.value;
				var _extra_db   = document.gestione_esame.extra_db.value;
				var _reparto    = document.gestione_esame.Hreparto.value;
				var bol_checkSatapp=false;
				
				// modifica 14-6-16
				try{bol_checkSatapp = NS_SATAPP.checkSatapp(_extra_db,_operazione,_num_pre);}	catch(e){alert("checkSatapp errore" + e.description);}	
				// modifica 9-6-16
				gblScaricoDema = bol_checkSatapp;
				// ************************
				// modifica 28-11-16
				// lo triggero se e solo se NON � dema !!!
				if (!gblScaricoDema){
					$("select[name='selTicket']").change();
				}
				// ***********				
				if(NS_SATAPP.checkManuale(_extra_db)){
					// modifica 14-6-16
					gblScaricoManuale = true;						
					// *******************					
					document.gestione_esame.extra_db.value = "";
					setObligatoryField("IMPEGNATIVA,impegnativa,TICKET,ticket,DATA_RICETTA,data_ricetta");
					controlloEffettuato = true;
					document.gestione_esame.impegnativa.readOnly = true;
					document.gestione_esame.impegnativa.value= GetTag(_extra_db,"MANUALE");
					statoManuale = GetTag(_extra_db,"STATO");
				}
				else if(bol_checkSatapp){
					// ********************************** fine modifica 14-6-16					
					$("[name='impegnativa']").attr("readonly","readonly");
					if($("[name='esenzione']").val()==""){
						$("[name='selTicket']").attr("disabled","disabled");
					}
							// modifica 9-6-16
							// $("#data_acc").attr("readonly","readonly");
							// *******					$("#dataricetta").attr("readonly","readonly");
					$("[name='txtQuesitoClinico']").attr("readonly","readonly");
					$("[name='txtQuadroClinico']").attr("readonly","readonly");
					$("[name='txtCodEsterno6']").attr("readonly","readonly");
					$("[name='esenzione']").attr("readonly","readonly");
					$("[name='selPrioritaLea'],[name='selAccesso'],[name='selPrescrittiva']").attr("disabled","disabled");
					$("#lblDataAcc,#lblOraAccettazione,#lblDataRicetta").parent().removeClass("classTdLabelObb");
					$("#lblDataAcc,#lblOraAccettazione,#lblDataRicetta").parent().addClass("classTdLabel");
					$("#IMPEGNATIVA").removeClass("classTdLabelOpt");
					$("#IMPEGNATIVA").addClass("classTdLabel");
					$("[name='esenzione']").attr("disabled","disabled");
					//$("#lblEsenzione").val("Esenzione dell'impegnativa");
					$("[name='selEsenzioniPaziente']").attr("disabled","disabled");
					$("#dataricetta,#data_acc,[name='ora_acc'],[name='impegnativa'],[name='txtQuesitoClinico'],[name='provenienza'],[name='txtQuadroClinico'],[name='txtCodEsterno6']").live("keydown",function(e){
						if(e.keyCode=="8"){
							return false;
						}
					});
					// modifica 14-6-16						
					// controlli Marco
					// seleziono  "Ricetta Elettronica con CF Barcode"
					//$("select[name='selTipoRice'] option[value=1]").attr("selected", true);
					document.getElementsByName("selTipoRice")[0].value = 1;
					document.getElementsByName("selTipoRice")[0].disabled=true;
					// disabilito "regime erogazione"
					$("select[name='selOnere']").attr("disabled","disabled");

					// modifica 31-8-16
					// se 2497, MINISTERO SANITA (MARITTIMI) --> 82, Assistiti SASN con Visita Ambulatoriale
					if (document.gestione_esame.Hiden_pro.value==2497){
						$("select[name='selOnere'] option[value=82]").attr("selected", true);
					}else{
						$("select[name='selOnere'] option[value=122]").attr("selected", true);
					}
					// ****

					// blocco data ricetta
					$("#dataricetta").unmask();
					$("#dataricetta").attr('readonly', true);
					// blocco provenienza
					$("[name='provenienza']").attr("readonly","readonly");	
					$("#lblProvenienza").parent().addClass("classTdLabelObb").removeClass("classTdLabelLinkObb");
					//setTimeout(function(){	$("#lblProvenienza").addBack().off();},2000);
						// blocco prescrivente
						$("[name='cod_fisc_med']").attr("readonly","readonly");							
						$("[name='medicoinviante']").attr("readonly","readonly");	
						if ($("#lblMedicoInviante").parent().hasClass("classTdLabelLinkOpt")){
							$("#lblMedicoInviante").parent().addClass("classTdLabelOpt").removeClass("classTdLabelLinkOpt");
						}
						if ($("#lblMedicoInviante").parent().hasClass("classTdLabelLink")){
							$("#lblMedicoInviante").parent().addClass("classTdLabel").removeClass("classTdLabelLink");
						}					
						if ($("#lblMedicoInviante").parent().hasClass("classTdLabelLinkObb")){
							$("#lblMedicoInviante").parent().addClass("classTdLabelObb").removeClass("classTdLabelLinkObb");
						}	
						$("input[name='ora_acc']").attr("readonly", false);			
						// ********************						
						// ********************	
						// ***** fine controlli marco													
					
				}else{
					if(NS_SATAPP.checkInformatizzata(_extra_db)){
						//// modifica 14-6-16
						alert("checkInformatizzata!!");
						// ***********						
						if($("[name='esenzione']").val()==""){
								$("[name='selTicket']").attr("disabled","disabled");
						}
						$("[name='provenienza'],[name='esenzione']").attr("disabled","disabled");
							// modifica 9-6-16
							// $("#data_acc").attr("readonly","readonly");
							// *******						
						$("[name='txtQuesitoClinico'],[name='provenienza']").attr("readonly","readonly");
						$("[name='txtQuadroClinico']").attr("readonly","readonly");
						$("[name='txtCodEsterno6']").attr("readonly","readonly");
						$("#lblDataAcc,#lblOraAccettazione,#lblDataRicetta").parent().addClass("classTdLabel");
						/*$("#IMPEGNATIVA").removeClass("classTdLabel");
						$("#IMPEGNATIVA").addClass("classTdLabelObb");*/
						$("#lblImpegnativa").parent().addClass("classTdLabelObb");
			
			
			
			
						$("#lblEsenzione").val("Esenzione dell'impegnativa");
						if($("[name='esenzione']").val()!="" && $("[name='selTicket']").val() =="" ){
							 CodiceEsenzioneValido($("[name='Hiden_esenzione']").val(),null);
						}
					}
				}
			
			
			
				/*gestione campi oscurati in caso di associazione ferrara*/
				if(document.gestione_esame.tipo_registrazione.value == "IA"){

					/*Controllo se l'esenzione � associabile*/
					dwr.engine.setAsync(false);
					var idEsa = document.gestione_esame.Hiden_esa.value.split("*");
					var str_esa = "";
					$.each(idEsa,function(k,v){
						if(v!=""){
							str_esa +=v + ",";
						}
					});
					str_esa = str_esa.substring(0,str_esa.length -1);
					/*if($("[name='Hiden_esenzione']").val()!=""){
						var v_sql = "select count(*) as nrec from view_rr_tab_esa_esenz where iden_esenzione in ("+$("[name='Hiden_esenzione']").val()+") and iden_prestazione in ("+str_esa+")";
						toolKitDB.getListResultData(v_sql,function(rs){
							if(rs == 0){
								//se non � associabile allora lo sbianco e carico la fascia contrattuale se ce l'ho dall'anagrafica
								$("[name='hIdenEsenzione']").val("");
								$("[name='esenzione']").val("");
								v_sql ="select distinct iden_tick from esenzioni_paziente where iden_anag = "+$("[name='Hiden_anag']").val() + " and iden_tick is not null and (data_fine is null or data_fine >= to_char(sysdate,'yyyyMMdd') ) and deleted='N' and  rownum < 2" ;
								toolKitDB.getResultData(v_sql,function(resp){
								   if(resp !=null){
									   try{
									   $("[name='selTicket']").val(resp[0]).attr("disabled","disabled");;
										}catch(e){   
									   }
								   }
								});
							}else{
								//associo fascia contrattuale corretta
								CodiceEsenzioneValido($("[name='Hiden_esenzione']").val(),null);
								$("[name='esenzione']").attr("disabled","disabled");
								$("[name='selTicket']").attr("disabled","disabled");
							}
						});
						dwr.engine.setAsync(true);
					}else{
						//se non � associabile allora lo sbianco e carico la fascia contrattuale se ce l'ho dall'anagrafica
						$("[name='hIdenEsenzione']").val("");
						$("[name='esenzione']").val("");
						v_sql ="select distinct iden_tick from esenzioni_paziente where iden_anag = "+$("[name='Hiden_anag']").val() + " and iden_tick is not null and (data_fine is null or data_fine >= to_char(sysdate,'yyyyMMdd') ) and deleted='N' and  rownum < 2" ;
						toolKitDB.getResultData(v_sql,function(resp){
						   if(resp !=null){
							   $("[name='selTicket']").val(resp[0]).attr("disabled","disabled");;
						   }
						});
					}
					$.each($("[name='selEsenzioniPaziente'] option"),function(k,v){
						$("[name='selEsenzioniPaziente']").val(v.value);
					});*/
					document.all.lblQuesitoClinico.onclick = new Function("finestra_popup(document.gestione_esame.txtQuesitoClinico.value, 'TAB_ICD_COD_DIA_QUESITO', '', '', 'S', '');");
					$("#STATO_PAZIENTE, [name='selStato'],[name='selCDC'],#CDC,#FASCIA_ORARIA,[name='fasciaoraria']").hide();
					$("#PROVENIENZA,#CODICE_LEA,#MOD_ACCESSO,#NOTE,#PATOLOGIA").parent().hide();
					$("#dataricetta,#data_acc,[name='ora_acc']").attr("readonly","readonly");
					$("#lblDataAcc,#lblOraAccettazione,#lblSalaMacchina,#lblDataRicetta,#lblImpegnativa").parent().removeClass("classTdLabelObb");
					$("#lblDataAcc,#lblOraAccettazione,#lblSalaMacchina,#lblDataRicetta,#lblImpegnativa").parent().addClass("classTdLabel");
					//$("[name='impegnativa']").attr("readonly","readonly");
					$("[name='selSalMac'],[name='selEsenzioniPaziente']").attr("disabled","disabled");
					//$("#dataricetta,#data_acc,[name='ora_acc'],[name='impegnativa']").live("keydown",function(e){ old version
					$("#dataricetta,#data_acc,[name='ora_acc']").live("keydown",function(e){
						if(e.keyCode=="8"){
							return false;
						}
					});
					/**layers*/
					if(baseUser.TIPO !="M" || baseUser.TIPO_MED != 'R'){
						$("#PROPONENTE,#TECNICO1,#ANESTESISTA,#INFERMIERE1").parent().hide();
						document.gestione_esame.medicoinviante.value = "";
						$("#INVIANTE").addClass("classTdLabelLinkObb");
						document.gestione_esame.cod_fisc_med.value = "";
						document.gestione_esame.Hiden_medi.value="";
						document.all.lblMedicoInviante.onclick = new Function("finestra_popup(document.gestione_esame.medicoinviante.value, 'TAB_MEDI_RR', '', '', 'S', '');");
					}
					else{
						$("#oTablelblTitoloGruppoPersonale,#divGruppoPersonale").hide();										
					}
					setDefaultField("IMPEGNATIVA,impegnativa");
					$("#oTablelblTitoloGruppoInfoGenerali,#divGruppoInfoGenerali").hide();
					$("#oTablelblTitleCodiciEsterni,#divGruppoCodEst").hide();
					/*$("#SALA_MACCHINA,#CODICE_ESENZIONE").parent().addClass("classTdLabelOpt");*/
					$("#QUESITO_CLINICO").addClass("classTdLabelLinkObb");	
					setObligatoryField("QUESITO_CLINICO,quesitoclinico");
					$("#TICKET").removeClass("classTdLabelOpt");
					$("#TICKET").addClass("classTdLabel");
				}				
		}
		else{
			ges_satapp = false;
		}
		// ***************************
		
	}
	catch(e){
		alert("DEMA - Error: " + e.description);
		ges_satapp = false;
	}
	
	// mettere controllo che se ho una sola
	// scelta possibile la seleziona di default
	//alert(document.gestione_esame.selSalMac.length);
	if (document.gestione_esame.selSalMac.length==2){
		// un solo elemento valido 
		// lo seleziono
		document.gestione_esame.selSalMac.options(1).selected = true;
		document.gestione_esame.selSalMac.onchange();
	}
	
	// ****** 
	// controllo se un'associazione e resetto
	// valori LEA
	if ((document.gestione_esame.Hnum_pre.value !="")&&(document.gestione_esame.Hiden_esame.value == "")){
		// associa
		try{
			if(!ges_satapp){
				// ******** per ferrara commentare
				document.getElementById("dataricetta").value = ""
				document.gestione_esame.selTipoRice.options(0).selected = true;
				document.gestione_esame.selTipoRice.onchange();

				document.gestione_esame.selTicket.options(0).selected = true;
				document.gestione_esame.selTicket.onchange();

				document.gestione_esame.Hiden_esenzione.value = ""; 
				try{document.gestione_esame.esenzione.value = "";}catch(e){;} 
				// *********
				document.gestione_esame.selPrioritaLea.options.item(0).selected = true;
				document.gestione_esame.Hcodice_lea.value = "";
				document.getElementById("img_garanzia_lea").src = "imagexPix/schedaAnag/nospuntaradio.gif";
				document.gestione_esame.Hgaranzia_lea.value = "N";
				document.getElementById("img_primo_lea").src = "imagexPix/schedaAnag/nospuntaradio.gif";
				document.gestione_esame.Hprimo_acc.value = "N";
				// regime erogazione - onere
				try{document.gestione_esame.selOnere.options.item(0).selected = true;
				document.gestione_esame.selOnere.onchange();
				document.gestione_esame.Hiden_one.value = "";}catch(e){;}
			}
		}
		catch(e){
			alert("error reset field: " + e.description); 
		}
	}
	
	// ****** controllo se sono in associa esame, in 
	// tal caso forzo controllo obbligatorieta campi
	// in base alla provenienza
	try{
		if ((document.gestione_esame.Hiden_pro.value != "") && (document.gestione_esame.Hiden_sal.value !="") && (document.gestione_esame.Hiden_mac.value!="")){
			aggiorna_ticket();
		}
	}
	catch(e){
		alert("Associazione Error: " + e.description); 
	}
	// *******************************************************
	try{
		if (getHomeFrame().getConfigParam("SHOW_SAVE_PRINT")=="N"){
			$("#btSavePrint").parent().parent().hide();	
		}
	}
	catch(e){
		// lo nascondo comunque
		$("#btSavePrint").parent().parent().hide();	
	}
	
	
	// ********************** modifica per obbligatoriet� campi LEA *******************
	// modifica del 11/11/14
	var strToAddLEA = "";
	strToAddLEA = "<select onChange='javascript:document.gestione_esame.Hgaranzia_lea.value=this.options[this.selectedIndex].value;' name='selGaranziaLea' id ='selGaranziaLea'><option value=''></option><option value='S'>Si</option><option value='N'>No</option></select>";
	$("#img_garanzia_lea").parent().prepend(strToAddLEA);
	$("#img_garanzia_lea").hide();	
//	$("#img_garanzia_lea").remove();
	
	
	// PRIMO_ACC_LEA 
	strToAddLEA = "<select onChange='javascript:document.gestione_esame.Hprimo_acc.value=this.options[this.selectedIndex].value;' name='selPrimoAccLea' id ='selPrimoAccLea'><option value=''></option><option value='S'>Si</option><option value='N'>No</option></select>";	
	$("#img_primo_lea").parent().prepend(strToAddLEA);
	$("#img_primo_lea").hide();	
//	$("#img_primo_lea").remove();
	
	
	if (document.gestione_esame.Hiden_esame.value =="") {
		// inserimento
		// azzero il valore perche' di default e' sempre N !!
		document.gestione_esame.Hgaranzia_lea.value = "";
		document.gestione_esame.Hprimo_acc.value = "";
	}
	else{
		// modifica
		$("#selGaranziaLea option[value='" + document.gestione_esame.Hgaranzia_lea.value +"']").attr('selected', 'selected');
		$("#selPrimoAccLea option[value='" + document.gestione_esame.Hprimo_acc.value +"']").attr('selected', 'selected');		
	}
	// ********************************************************************************
	
	//***************************
	//****** modifica DEMA ******
	//***************************	
	if ((globalSito=="SAVONA")&&(abilitazioneDema=="S")&&(document.gestione_esame.tipo_registrazione.value == "IA")){								
		$("#IMPEGNATIVA").removeClass("classTdLabelObb");
		$("#IMPEGNATIVA").removeClass("classTdLabelOpt");
		$("#IMPEGNATIVA").addClass("classTdLabel");
		for (var z=0 ;z<aCampiNome.length;z++){
			if (aCampiNome[z].toString().toUpperCase()=="IMPEGNATIVA"){
				break;
			}
		}
		aStato[z]=10;
	}
	// ********************************************************************************
	// modifica 13-6-16
	// modifica 14-6-16
	// modifica 31-8-16 (aggiunto substr)	
	// triggero controllo su ticket e obbligatorieta' impegnativa
	if ((globalSito=="SAVONA")&&(document.gestione_esame.tipo_registrazione.value.split("*")[0]!= 'I')&&(document.gestione_esame.tipo_registrazione.value.split("*")[0].substr(0,1)!= 'P')&&(document.gestione_esame.tipo_registrazione.value.split("*")[0]!= 'IA')){
		// da fare solamente sino allo stato di accettato
			
		// *****************
		var rs;
		// esame singolo , quindi numerico
		if (!isNaN(document.gestione_esame.Hiden_esame.value)){
			rs = numCartellaRadTer_obj.getQueryFrame().executeQuery('worklist_main.xml','getInfoEsame',[document.gestione_esame.Hiden_esame.value]);
			if (rs.next()){
				var objEsame = {};
				objEsame.PRENOTATO = rs.getString("prenotato");						
				objEsame.ACCETTATO = rs.getString("accettato");
				objEsame.ESEGUITO = rs.getString("eseguito");
				objEsame.REFERTATO = rs.getString("refertato");
				objEsame.STATO = rs.getString("stato");			
			}else{
				//alert("Errore grave: esame cancellato!");
			}
			if (!$("select[name='selTicket']").prop("disabled")){
				try{$("select[name='selTicket']").change();}catch(e){;}
				if (objEsame.ESEGUITO =="1"){
					$("[name='selTicket']").attr("disabled","disabled");
				}
			}
		}
		// ***********		
	}
	// modifica 31-8-16 (aggiunto split)
	if ((globalSito=="SAVONA")&&(document.gestione_esame.tipo_registrazione.value.split("*")[0]== 'IA')){
		if (!$("select[name='selTicket']").prop("disabled")){
			try{$("select[name='selTicket']").change();}catch(e){;}
		}
	}
	// *************

	// modifica 28-11-16				
	if ((globalSito=="SAVONA") && gblScaricoDema && (document.gestione_esame.tipo_registrazione.value.split("*")[0].substr(0,1) == "M")){	
		lockCampiDema();
	}
	// ********************
	
});	// fine jquery Ready 
			

// ********** ferrara
//@deprecated
/*
function initConfigurazioniFromDb(){
	var rs;
	var strToEval;
	try{
		// test
		// caricarli in automatico da configurazione pre esistente
		// valutare di fare una query unica !!!!
		for (var i=0; i<configurazioniToLoad.length;i++){
			rs =  opener.top.executeQuery('configurazioni.xml','getConfigPageParam',[configurazioniToLoad[i].split("*")[0],configurazioniToLoad[i].split("*")[1],'S']);
			if (rs.next()){
				strToEval = "jsonConfigurazioni[\"" + 	configurazioniToLoad[i].split("*")[1] + "\"] = \"" + rs.getString("valore") + "\";"
				eval(strToEval);
			}
		}
	}
	catch(e){
		alert("initConfigurazioniFromDb - error: " + e.description);
	}			
}*/

// *****

function CodiceEsenzioneValido(HidenEsenzione,Esenzione){
    dwr.engine.setAsync(false);
    var v_sql ="select fx_esenzione_ticket("+HidenEsenzione+") from dual";
    toolKitDB.getResultData(v_sql,function(rs){
       if(rs[0]!="0"){
           $("[name='selTicket']").val(rs[0]);
       }
    });
    dwr.engine.setAsync(true);
    
}

function importante(stato)
{
	if(id_obj != '')
	{
		if(stato)
			setImportantField(id_obj);
		else
			setDefaultField(id_obj);
		
		id_obj = '';
	}
	
	hideContextMenu();
}

function set_open_scandb(valore)
{
	apri_scandb = valore;
}

function chiudi(msg)
{
	var _operazione = document.gestione_esame.tipo_registrazione.value;
	var _iden_anag  = document.gestione_esame.Hiden_anag.value;
	var _num_pre    = document.gestione_esame.Hnum_pre.value;
	var _extra_db   = document.gestione_esame.extra_db.value;
	var _reparto    = document.gestione_esame.Hreparto.value;
	// ***********************
	if (premutoAnnulla){
//		alert("here");
		if (globalSito=="FERRARA"){
			window.onunload = function(){;}
			try{opener.aggiorna("A");}catch(e){;}
			self.close();					
		}
		else{
			opener.aggiorna();
			self.close();
		}	
		return;
	}
	// ***********************
	// ***** modifica del 3/10/14
	// devo comunque togliere il lock
	annullamentoGestione.libera_scheda(document.gestione_esame.Hiden_esame.value);
	// *****
	if(!chiusura)
	{
		// ***** modifica del 3/10/14
		// commento perche' deve essere fatto sempre e comunque
		//dwr.engine.setAsync(false);
		//annullamentoGestione.libera_scheda(document.gestione_esame.Hiden_esame.value);
		//dwr.engine.setAsync(true);
		// *******
		if(msg != null && msg != '')
		{
			alert(msg);
		}
		try
		{
			if (globalSito=="FERRARA"){
				opener.aggiorna("A");
				self.close();					
			}
			else{
				opener.aggiorna();
				//***************************
				//****** modifica DEMA ******
				//***************************
				try{
					if(NS_SATAPP.checkSatapp(_extra_db,_operazione,_num_pre) && _operazione=='I'){
						NS_SATAPP.AnnullaBlocco(_extra_db,_iden_anag);
						if(NS_SATAPP.esito_annullamento=="KO") alert('Problema annullamento blocco ricetta dematerializzata');
					}
				}catch(e){alert("Error on esito_annullamento " + e.description);}
				//***************************						
				self.close();
			}
		}
		catch(ex)
		{
		}
		chiusura = true;
	}
	else{
		try{
			// modifica aldo: se non ha nulla da fare dopo
			// aggiorna e chiude
			if (document.gestione_esame.Hservlet_succ.value=="" || document.gestione_esame.Hservlet_succ.value=="undefined" || typeof(document.gestione_esame.Hservlet_succ.value)=="undefined"){
				// modifica ferrara
				if (globalSito=="FERRARA"){
					window.onunload = function(){;}
					opener.aggiorna("A");
					self.close();					
				}
				else{
					opener.aggiorna();
					self.close();
				}
			}
			else{
				var nextAction = document.gestione_esame.Hservlet_succ.value;
				if (nextAction.toLowerCase().indexOf("javascript")>-1){
					eval(nextAction);
				}
			}
		}catch(ex){}		
	}
}

var premutoAnnulla = false;
function annulla()
{
	premutoAnnulla = true;
	try{
		try{
			if (opener.baseGlobal.GEST_APPROPRIATEZZA=="S"){
				try{annullamentoGestione.annullaAppr(document.gestione_esame.Hiden_esame.value, chiudi);}catch(e){;}
			}
		}catch(e){;}
		if(document.gestione_esame.tipo_registrazione.value.substr(0,1) == 'P')
		{
			annullamentoGestione.libera_agenda();
			ritorna_prenotazione();
		}
		else{
			chiudi();
		}
	}
	catch(e){alert("annulla - Error: " + e.description);}
}

function nascondi_ticket()
{
	document.gestione_esame.selTicket.style.visibility = 'hidden';
	document.all.lblDescrTicket.innerText = document.all.lblNoTicket.value;
	document.all.CODICE_ESENZIONE.className = 'classTdLabel';
	document.gestione_esame.esenzione.style.visibility = 'hidden';
	document.all.lblDescrEsenzione.innerText = document.all.lblNoEsenzione.value;
        document.all.lblDescrEsenzione.onclick = new Function("return;");
	document.gestione_esame.Hiden_tick.style.visibility = 'hidden';
	
	document.all.lblImpegnativa.innerText = document.all.lblHNoso.value;
	document.all.btSbloccaImpegnativa.style.visibility = 'hidden';
}

function visualizza_ticket()
{
	document.gestione_esame.selTicket.style.visibility = 'visible';
	document.all.lblDescrTicket.innerText = document.all.lblTicket.value;
	document.gestione_esame.esenzione.style.visibility = 'visible';
	document.all.lblDescrEsenzione.innerText = document.all.lblEsenzione.value;
	document.gestione_esame.Hiden_tick.style.visibility = 'visible';
	if(document.gestione_esame.esenzione.disabled)
	{
		document.all.CODICE_ESENZIONE.className = 'classTdLabel';
	}
	else
	{
		document.all.CODICE_ESENZIONE.className = 'classTdLabelLink';
		document.all.lblDescrEsenzione.onclick = new Function("finestra_popup(document.gestione_esame.esenzione.value, 'TAB_ESEPAT', '', '', 'S', '');");
	}
	
	document.all.lblImpegnativa.innerText = document.all.lblHImp.value;
	
	document.all.btSbloccaImpegnativa.style.visibility = 'hidden'; //visible
	document.all.btSbloccaImpegnativa.style.display = 'none';
	
	if(document.gestione_esame.Hute_sblocca_impegnativa.value != '')
	{
		document.gestione_esame.impegnativa.readOnly=true;
		document.all.lblSbloccaImpegnativa.innerHTML="Inserisci impegnativa";
		document.all.lblSbloccaImpegnativa.href="javascript:abilita_impegnativa();";
	}
}

function aggiorna_ticket()
{
	var a_check = (typeof _VERIFICA_TICKET != 'undefined' && _VERIFICA_TICKET != '' ? _VERIFICA_TICKET:'I,O').split(',');
	var ok = true;
	// modifica 14-6-16	
	initbaseUser();
	// ************
	
	for(var idx = 0; idx < a_check.length && ok; ok=(document.gestione_esame.Hint_est.value != a_check[idx++]));
	
	//if(document.gestione_esame.Hint_est.value == 'I' || document.gestione_esame.Hint_est.value == 'O')
	if(!ok)
	{
		nascondi_ticket();
	}
	else
	{
		visualizza_ticket();	
	}
	
	try
	{
		document.gestione_esame.provenienza.dwr();
	}
	catch(ex)
	{
//				alert("errore in scheda_esame.js " + ex.description);
	}
	
	try
	{
		// qui  rimappo numero impegnativa se e solo se e' un esterno!!!
		// modifica aldo 29/12: solo se NON e' un esterno 
		// ricarico num.imp.
		if (document.gestione_esame.Hint_est.value != "E"){
			ricava_num_ps();
		}
	}
	catch(ex)
	{
	}
	// modifica 14-6-16
	if (globalSito=="SAVONA"){

		// modifica 31-8-16
		if (document.gestione_esame.Hiden_pro.value==2497){
			$("select[name='selOnere'] option[value=82]").attr("selected", true);
		}		
		// ********************
	
		// modifica 31-8-16
		// corregge anche baco 8679 (aggiunto substr)
		// modifica 21-10-16
		if (document.gestione_esame.Hint_est.value=="E" && document.gestione_esame.tipo_registrazione.value.split("*")[0].substr(0,1) != "I" && document.gestione_esame.tipo_registrazione.value.split("*")[0].substr(0,1) != "P" && NS_SATAPP.isDema(document.gestione_esame.Hiden_esame.value))		
		{
			try
			{
				setReadOnlyField("IMPEGNATIVA,impegnativa");
				document.gestione_esame.impegnativa.value = impegnativaPresente;
				document.gestione_esame.impegnativa.readOnly=true;
			}
			catch(e)
			{
				null;
			}
		}
		else
		{
			try
			{
				//setEditableField("IMPEGNATIVA,impegnativa");
				var _operazione = document.gestione_esame.tipo_registrazione.value.split("*")[0];
				var _iden_anag  = document.gestione_esame.Hiden_anag.value;
				var _num_pre    = document.gestione_esame.Hnum_pre.value;
				var _extra_db   = document.gestione_esame.extra_db.value;
				var _reparto    = document.gestione_esame.Hreparto.value;
				if (!NS_SATAPP.checkSatapp(_extra_db,_operazione,_num_pre) && !controlloEffettuato)
				{
					if(_operazione != 'M' && _operazione != 'E') document.gestione_esame.impegnativa.value = "";
					document.gestione_esame.impegnativa.readOnly = false;
				}
			}
			catch(e){
				null;
			}
		}
	}
	// ******************
	
}




function sblocca_impegnativa()
{
	document.richiediUtentePassword.setRichiediPwdRegistra(true);
	document.richiediUtentePassword.view('document.gestione_esame.impegnativa.readOnly=true;setReadOnlyField("IMPEGNATIVA,impegnativa");document.all.lblSbloccaImpegnativa.innerHTML="Inserisci impegnativa";document.all.lblSbloccaImpegnativa.href="javascript:abilita_impegnativa();";', 'S');
}

function abilita_impegnativa()
{
	// modifica 14-6-16	
	initbaseUser();
	// *******	
	document.gestione_esame.Hute_sblocca_impegnativa.value = '';
	document.gestione_esame.Hnote_sblocca_impegnativa.value = '';
	document.gestione_esame.impegnativa.readOnly=false;
	// modifica dema
	setDefaultField("IMPEGNATIVA,impegnativa,DATA_RICETTA,dataricetta");
	document.all.lblSbloccaImpegnativa.innerHTML="Sblocca impegnativa";
	document.all.lblSbloccaImpegnativa.href="javascript:sblocca_impegnativa();";
}

function finestra_popup(myRic, myProc, myWhere, myOgg, apri, codice)
{
	// modifica 14-6-16
	// per non andare a toccare la gestione di ges_campi_check
	// ed eventualmente intaccare altri flussi, gestisco qui il caso
	// di provenienza
	if (myProc =="TAB_PRO" && gblScaricoDema){
		return;
	}
	// ****************	
	if(!apri_scandb) return;
	if(myProc == '') return;
	if(apri != 'S')
	{
		if(codice != '') return;
		if(myRic == '') return;
	}
	
	/*if(document.gestione_esame.Hreparto.value == '' && !document.gestione_esame.selSalMac.disabled)
	{
		alert('Si prega di selezionare prima la sala per determinare il CDC!');
		return;
	}*/
	
	var popup = window.open('', 'winstd', 'status = yes, scrollbars = no, height = 1, width = 1, top = 1500, left = 1500');
	if(popup) popup.focus();
		else popup = window.open('', 'winstd', 'status = yes, scrollbars = no, height = 1, width = 1, top = 1500, left = 1500');
	
	myRic = myRic.toUpperCase();
	//***************************
	//****** modifica DEMA ******
	//***************************		
	var _operazione = document.gestione_esame.tipo_registrazione.value;
	var _iden_anag  = document.gestione_esame.Hiden_anag.value;
	var _num_pre    = document.gestione_esame.Hnum_pre.value;
	var _extra_db   = document.gestione_esame.extra_db.value;
	var _reparto    = document.gestione_esame.Hreparto.value;
	try{
		if ((globalSito=="SAVONA") && (myProc=="TAB_PRO")){
			if(NS_SATAPP.checkSatapp(_extra_db,_operazione,_num_pre)){
				myWhere="TAB_PRO.ATTIVO='S' and TAB_PRO.INT_EST='E'";
			}
		}
	}
	catch(e){alert("error on checkSatapp " + e.description);}
	//***************************
	document.tab_std.myric.value = myRic == '' ? '' : myRic;
	document.tab_std.myproc.value = myProc == '' ? '' : myProc;
	document.tab_std.mywhere.value = myWhere == '' ? '' : myWhere;
	document.tab_std.myogg.value = myOgg == '' ? '' : myOgg;
	document.tab_std.loc_reparto.value = document.gestione_esame.Hreparto.value;
	
	document.tab_std.submit();
}

function annulla_quesito()
{
	document.gestione_esame.hcod_quesito_clinico.value = '';
	document.gestione_esame.txtQuesitoClinicoCod.value = '';
}

function aggiorna_pagina()
{
	document.gestione_esame.aggiorna_pagina.value = 'S';
	document.gestione_esame.action = 'schedaEsame';
	
	document.gestione_esame.submit();
}

function cambia_urgenza(urg)
{
	document.gestione_esame.urgente.value = urg;
	
	switch(urg)
		{
			// Non urgente
			case '0':
				document.all.lblNotaUrgenza.innerText = document.all.btNonUrgenza.innerText;
				break;
			
			// Urgenza differita
			case '1':
				document.all.lblNotaUrgenza.innerText = document.all.btUrgenzaDifferita.innerText;
				break;
			
			// Urgenza
			case '2':
				document.all.lblNotaUrgenza.innerText = document.all.btUrgenza.innerText;
				break;
			
			// Emergenza
			case '3':
				document.all.lblNotaUrgenza.innerText = document.all.btEmergenza.innerText;
				break;
		}
	
	document.gestione_esame.txtQuesitoClinico.value = document.gestione_esame.txtQuesitoClinico.value.replace(/\<br>/g,"\n");
	
	return;
}

function cambia_stato_paz(codice)
{
	document.gestione_esame.Htip_esec.value = codice;
}

function cambia_ticket(codice)
{
	document.gestione_esame.Hiden_tick.value = codice;
}

function cambia_cdc(codice)
{
	document.gestione_esame.Hreparto.value = codice;
}

function cambia_sala(valore)
{
	var pos = valore.indexOf('#', 0);
	var pos2 = valore.indexOf('#', pos + 1);
	var codice_sal, codice_mac, reparto;
	
	if(pos > 0)
	{
		document.gestione_esame.Hiden_sal.value = valore.substr(0, pos);
		document.gestione_esame.Hiden_mac.value= valore.substr(pos + 1, pos2 - pos - 1);
		document.gestione_esame.selCDC.value = valore.substr(pos2 + 1, valore.length - pos2);
		document.gestione_esame.Hreparto.value = valore.substr(pos2 + 1, valore.length - pos2);
	}
	else
	{
		document.gestione_esame.Hiden_sal.value = valore;
		document.gestione_esame.Hiden_mac.value= '';
		document.gestione_esame.selCDC.value = '';
		document.gestione_esame.Hreparto.value= '';
	}
	
	document.gestione_esame.Hiden_are.value= '';
	// *********************
	// modifica 2-9-15
	try{
//		alert("intEst: " + document.gestione_esame.Hint_est.value); 
		var myIdx = aCampiNome.lastIndexOf("IMPEGNATIVA");
		var myTd = document.getElementById(aCampiNome[myIdx]);
//		alert(myTd.className);
		if ((globalSito=="SAVONA")&&(document.gestione_esame.selCDC.value=="")&&(document.gestione_esame.Hint_est.value=="I")&& (myTd.className!="classTdLabelObb") ){
			setEditableField("IMPEGNATIVA");			
		}
		else{
			if ((globalSito=="SAVONA")&&(document.gestione_esame.selCDC.value=="AMB_RAD_SV")&&(document.gestione_esame.tipo_registrazione.value.toString().substr(0,1)!="P")&&(document.gestione_esame.Hint_est.value=="E")){ 
				setObligatoryField("IMPEGNATIVA");
			}
		}
	}catch(e){;}
	// ***************
	// modifica 21-10-15
	if  ((globalSito=="SAVONA")&& (bolCreaGestRadioTerap) && (document.gestione_esame.tipo_registrazione.value.toString().substr(0,1)!="P")&&($("#" + numCartellaRadTer_obj.getIdRelatedObj()).val()=="") && (document.gestione_esame.Hiden_esame.value =="")){
		numCartellaRadTer_obj.init(document.gestione_esame.Hiden_anag.value, document.gestione_esame.selCDC.value);
	}
	// **********************
}

function cambia_ricetta(codice)
{
	document.gestione_esame.Htipo_ricetta.value = codice;
}

function cambia_onere(codice)
{
	document.gestione_esame.Hiden_one.value = codice;
}

function cambia_patologia(codice)
{
	document.gestione_esame.Hiden_patologia.value = codice;
}

function cambia_accesso(codice)
{
	document.gestione_esame.Hiden_mod_acc.value = codice;
}

function cambia_prescrittiva(codice)
{
	document.gestione_esame.Hiden_mod_prescr.value = codice;
}

function cambia_tipo_med_prescr(codice)
{
	document.gestione_esame.Hiden_tipo_med_prescr.value = codice;
}

function setClass()
{
	document.all.tableQuesiti.className = 'classDataEntryTable';
}


// ferrara
// funzione che setta semplicemente cosa
// fare dopo la registrazione, ovvero: stampa
function setPaggSuccStampa(){
	try{
		if(document.gestione_esame.Hservlet_succ.value == '')
		{
			document.gestione_esame.Hservlet_succ.value = 'javascript:';
		}
		else
		{
			document.gestione_esame.Hservlet_succ.value = document.gestione_esame.Hservlet_succ.value.replace("self.close();", "");
		}
		
		document.gestione_esame.Hservlet_succ.value += 'document.location.replace("elabStampa?stampaFunzioneStampa=ETICHETTE_STD&stampaIdenEsame=' + document.gestione_esame.Hiden_esame.value + '&stampaReparto=' + document.gestione_esame.Hreparto.value + '&stampaAnteprima=N'+ '&stampaIdenAnag='+document.gestione_esame.Hiden_anag.value + '");';
	}
	catch(e){
		alert("setPaggSuccStampa - " + e.description);
	}
}

function registra(stampa)
{
	var pagSuccIdentPaz = "";
	var paramSuccIdentPaz = "";
	// modifica 4-5-15
	// modifica 7-5-15
	try{
		if 	($("#data_acc").val()!="" && $("#data_acc").val()!="undefined"){
			if (!controllo_data($("#data_acc").val())){
			   alert("Prego inserire una data valida"); return; 
			}			
		}
	}catch(e){;}
	// ********

	// ****************
	// modifica 3-2-16
	try{
		
		if (!String.prototype.getTodayStringFormat) {
		  (function()
			{
				String.prototype.getTodayStringFormat = function()
				{
					var dataOggi ;
				
				
					dataOggi=new Date();
					var dataOggiGiorno=dataOggi.getDate();
					if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
					var dataOggiMese=dataOggi.getMonth()+1;
					if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
					var dataOggiAnno=dataOggi.getFullYear();
					var dataOggiStringa= dataOggiAnno.toString() + dataOggiMese.toString() + dataOggiGiorno.toString();
					return dataOggiStringa;
				};
				String.prototype.dateToStringFormat = function()
				{
					var strOutput ;
					try{
						strOutput = this.substring(6,10) + this.substring(3,5) + this.substring(0,2);
					}
					catch(e){
						strOutput = "!ERROR CONVERSION!";
					}
					return strOutput;
				};
			})();
		}			
		var oggi = (new String("")).getTodayStringFormat();
		if ($("#dataricetta").val()!=""){
			// modificato 9-6-16	
			if (!controllo_data($("#dataricetta").val())){
				alert("Attenzione: data ricetta non valida, prego correggere.");
				$("#dataricetta").focus();
				return;
			}
			//	*************			
			if ($("#dataricetta").val().dateToStringFormat()>oggi){
				alert("Attenzione: data ricetta futura, prego correggere.");
				$("#dataricetta").focus();
				return;
			}
		}


		
	}catch(e){
//		alert(e.description);
	}
	// ********************

	// ***************************************	
	// modifica aldo 27/8/14 per radioterapia
	if (bolCreaGestRadioTerap){
		// ********
		// modifica 23-9-15
		var cdcPreselezionato = "";
		try{
			// modifica 21-10-15
			// NB verificare se lasciare questa obbligatorieta'
			cdcPreselezionato = $("input[type='text'][name='selCDC']").first().val();
			if (cdcPreselezionato!="AMB_RAD_SV"){
				if  ((globalSito=="SAVONA") && ($.trim($("#" + numCartellaRadTer_obj.getIdRelatedObj()).val())=="")&&(document.gestione_esame.tipo_registrazione.value.toString().substr(0,1)=="I")){
					if (!confirm("Attenzione, numero di cartella NON correttamente compilato. Continuare ugualmente?")){
						 $("#"+idRT_cartella).focus();
						return;
					}
				}
			}
			else{			
				// ********
				if ((globalSito=="SAVONA")&&(cdcPreselezionato=="AMB_RAD_SV")&&(document.gestione_esame.tipo_registrazione.value.toString().substr(0,1)!="P")){ 
					// modifica 20-11-15
					// *********************
					if ((jQuery.inArray( "8392", document.gestione_esame.Hiden_esa.value.split("*") )==-1)&& (jQuery.inArray( "8393", document.gestione_esame.Hiden_esa.value.split("*") )==-1)){
						var idRT_cartella = numCartellaRadTer_obj.getIdRelatedObj();
						if ($.trim($("#"+idRT_cartella).val())==""){
						   alert("Prego inserire una numero cartella valido."); $("#"+idRT_cartella).focus();return; 
						}
					}
					// *********************					
				}
			}
		}catch(e){;}
		// ********	

		// modifica 24-8-16
		if (document.gestione_esame.Hreparto.value!="" && document.gestione_esame.Hreparto.value !="undefined" && document.gestione_esame.Hiden_anag.value!="" && document.gestione_esame.Hiden_anag.value!="undefined"){
			if (!numCartellaRadTer_obj.save(document.gestione_esame.Hiden_anag.value, document.gestione_esame.Hreparto.value)){
				alert("Errore: Impossibile registrare il numero di cartella, id: " + document.gestione_esame.Hiden_anag.value + ", ue: " + document.gestione_esame.Hreparto.value + ".\nContattare l'amministratore di sistema.");
				if (!confirm("Continuare comunque senza registrare il numero di cartella?")){
					return false;
				}
			}
		}
		// ************	

	}
	// ***************************************
	// ***************************************	
	
	// ********************** modifica per obbligatoriet� campi LEA *******************
	// modifica del 11/11/14
	if ($("#GARANZIA_LEA").hasClass("classTdLabelObb") && $("#selGaranziaLea :selected").attr('value')==""){
		alert("Prego compilare '" + arrayLabelValue[jQuery.inArray( "lblGaranziaLea", arrayLabelName )] + "'");return;
	}
	if ($("#lblPrimoLea").parent().hasClass("classTdLabelObb") && $("#selPrimoAccLea :selected").attr('value')==""){
		alert("Prego compilare '" + arrayLabelValue[jQuery.inArray( "lblPrimoLea", arrayLabelName )] + "'");return;
	}	
	// ********************************************************************************
	
	// ******************** modifica del 20-4-15
	var regex_quesito = /[a-zA-Z0-9]+/;
	if (trim($("textarea[name='txtQuesitoClinico']").val()) != "" && !regex_quesito.test(trim($("textarea[name='txtQuesitoClinico']").val()))) {
		return alert("La nota diagnosi in forma testuale non e' significativa, inserirne una di senso compiuto."); 
	}
	// ********************************************************************************	
	
	if(document.gestione_esame.Htip_esec.value == 'undefined')
		document.gestione_esame.Htip_esec.value = '';
	
	// Funzione generata dalla servlet
	if(check_dati())
	{
            
		document.gestione_esame.data_pre.disabled = false;
		document.gestione_esame.ora_pre.disabled = false;
		
		document.gestione_esame.data_acc.disabled = false;
		document.gestione_esame.ora_acc.disabled = false;
		
		document.gestione_esame.data_ese.disabled = false;
		document.gestione_esame.ora_ese.disabled = false;
		
		chiusura=true;
		if(stampa == 'S')
		{
			// caso classico
			// difficile implementare l'identificazione paziente
			// perche' non si ha ancora l'iden !!!
			setPaggSuccStampa();
		}
		//***************************
		//****** modifica DEMA ******
		//***************************	
		if ((globalSito=="SAVONA")&&(abilitazioneDema=="S")){
			if(ges_satapp){
				// modifica 14-6-16, attenzione, il controllo va bene SOLO per la dema ?
				if(!controlloEffettuato && document.gestione_esame.Hint_est.value == 'E' && document.gestione_esame.impegnativa.value!="")
				{
					verifica_impegnativa(document.gestione_esame.impegnativa);
					if(document.gestione_esame.impegnativa.value=="") return;
				}		
				// ********************					
				try{
				   // attenzione cambiare !
					getHomeFrame().apri_attesa();
					// ***********
					var _operazione = document.gestione_esame.tipo_registrazione.value;
					var _iden_anag  = document.gestione_esame.Hiden_anag.value;
					var _num_pre    = document.gestione_esame.Hnum_pre.value;
					var _extra_db   = document.gestione_esame.extra_db.value;
					var _reparto    = document.gestione_esame.Hreparto.value;
					var v_iden_esa = document.gestione_esame.Hiden_esa.value.split("*");
					var prestazioni = [];
					var respSatapp  = "";
		
					dwr.engine.setAsync(false);
					var flg_ricetta = false;
					var str_esa="";

					if(document.gestione_esame.Hint_est.value !="E"){
						flg_ricetta = false;
					}else{
						if(NS_RICETTA_ESTERNA.esito !="RR"){
							$.each(v_iden_esa,function(k,v){
								if(v!=""){
									str_esa +=  v + "*"    ;
		
								}
							});
							str_esa = str_esa.substring(0,str_esa.length - 1);
							var v_data_ricetta ="select IDEN from tab_esa where iden in (select column_value from table(split('"+str_esa+"','*')))";
							toolKitDB.getListResultData(v_data_ricetta,function(rs){
								$.each(rs,function(row,array){
									flg_ricetta =true;
									prestazioni.push(array[0]);
									   
								});
		
		
							});   
							// modifica 13-6-16
							// per ora viene commentato !!
							/*
							if(baseUser.TIPO !="M"){
								if(document.all.Hiden_medi.value ==""){
									alert("Inserire Medico Prescrivente!");
									return;
								}
							}*/
							// **************
							if(document.gestione_esame.impegnativa.value=="")
								flg_ricetta =true;
							else
							{
								verifica_impegnativa(document.gestione_esame.impegnativa);
								if(document.gestione_esame.impegnativa.value=="") return;
								flg_ricetta =false;
							}
						}else if(NS_RICETTA_ESTERNA.esito=="RR"){

							verifica_impegnativa(document.all.impegnativa);
							if($("[name='impegnativa']").val() == ""){
									return;
							}
							flg_ricetta = false;
							dwr.engine.setAsync(false);
							var v_xml = "<SATPED>";
							v_xml += "<ESITO>KO</ESITO>";
							v_xml += "<IDEN_TESTATA>"+NS_RICETTA_ESTERNA.iden_testata+"</IDEN_TESTATA>";
							v_xml += "<CODICE_PRESCRIZIONE_SOLE>"+$("[name='impegnativa']").val()+"</CODICE_PRESCRIZIONE_SOLE>";
							v_xml += "<TIPO_RICETTA>DEMATERIALIZZATA</TIPO_RICETTA>";
							v_xml +="<ASSOCIATO>N</ASSOCIATO>";
							v_xml +="<NUM_PRE_ASSOCIATO></NUM_PRE_ASSOCIATO>";
							v_xml += "</SATPED>";
							var v_sql="BEGIN RICETTA.SP_GESTIONE_RESPONSE('"+v_xml+"');END;";
							toolKitDB.executeQueryData(v_sql,function(rs){
							});
							dwr.engine.setAsync(true);
							NS_STAMPA.init("P",NS_RICETTA_ESTERNA.iden_testata);
						}
					}                        

					var bolDisabilitaSilente = false;
					if(_operazione =="IA" && flg_ricetta == true && bolDisabilitaSilente==true){
						/*Stampo la ricetta*/
						
						var v_nre="";
						/*mi prendo l'nre*/
						/*v_sql ="select numimp_numrich from esami where num_pre = "+ _num_pre + " and rownum < 2 and numimp_numrich is not null";
						toolKitDB.getResultData(v_sql,function(rs){v_nre=rs[0]});*/
			   
						var v_sql = "select get_progressivoaccettazione() from dual";                            
						toolKitDB.getResultData(v_sql,function(rs){
							_num_pre = rs[0];
						});
		//alert("ASSOCIAZIONE _num_pre" + _num_pre);

						// *************** modifica Aldo per salvare num_pre originale 11/7/14
						$("form[name='gestione_esame']").append("<input type='hidden' name='Hnum_pre_originale' value='" + document.gestione_esame.Hnum_pre.value + "' />");
						// ************************************************************
						document.gestione_esame.Hnum_pre.value =_num_pre ;    
						/*associazione*/
						var codice_prestazioni = "";
						$.each(v_iden_esa,function(k,v){
							if(v!=""){
								var v_cod="";
								var v_sql ="select cod1 from cod_est_tab_esa  where iden_esa = " + v;
								toolKitDB.getResultData(v_sql,function(re){
		
									try{
										v_cod = re[0];
									}catch(e){}
		
								});
								// attenzione gestire con statement su whale !
								// getCodicePrestazioni
								var rs;
								try{
									rs =  parent.top.executeQuery('dema.xml','getCodicePrestazioni',[v_cod]);
								}
								catch(e){
									try{rs =  opener.parent.top.executeQuery('dema.xml','getCodicePrestazioni',[v_cod]);}catch(e){alert("Error on getCodicePrestazioni"); return;}
								}
								if (rs.next()){
									//alert("#"  + rs.getString("codice_prestazioni") +"#");
									codice_prestazioni += rs.getString("codice_prestazioni") +",";
								}
								
							}
						});
						codice_prestazioni = codice_prestazioni.substring(0,codice_prestazioni.length - 1);
						if (codice_prestazioni==""){
							// che faccio !?!? codici nulli !!
							alert("codice_prestazioni NULLI !!! Codici non definiti nel db cartella");
						}
						var v_urgenza = $("[name='selPrioritaLea']").val();
						var v_quesito =$("[name='txtQuesitoClinico']").val();
						var v_id_esenzione =$("[name='Hiden_esenzione']").val();
						var v_cod_esenzione="";
						var esenzioni=[];
						esenzioni.push($("[name='Hiden_esenzione']").val());
						/*$.each($("[name='selEsenzioniPaziente'] option").val(),function(k,v){
							if(v!=""){
								esenzioni.push(v.value);
							}
						});
						toolKitDB.getResultData("select RR_ESENZIONE_PRESTAZIONE('"+codice_prestazioni+"','"+esenzioni+"') from dual",function(rs){
							if(rs!=""){
									var v_object = eval("(" + rs[0]+ ")");
									$.each(v_object,function(k,v){
		
													  try{
														v_id_esenzione = v;
													  }catch(e){}
		
									});
							}
						});*/
						if(v_id_esenzione !=""){
							v_sql = "select cod_esenzione from tab_esenzioni_patologia where iden = "+$("[name='Hiden_esenzione']").val();
							toolKitDB.getResultData(v_sql , function(rs){try{v_cod_esenzione = rs[0];}catch(e){}});
		
						}
						else{
							/*if($("[name='selEsenzioniPaziente']").val()!=""){
								v_id_esenzione = $("[name='selEsenzioniPaziente']").val();
								var v_sql2= "select cod_esenzione from tab_esenzioni_patologia where iden = "+v_id_esenzione;
								toolKitDB.getResultData(v_sql2 , function(rs){v_cod_esenzione = rs[0];});                                            
							}*/
						}
		
						dwr.engine.setAsync(true);
						//var v_cod_sole =$("[name='txtCodEsterno6']").val();
						v_iden_per = baseUser.IDEN_PER;
						if(baseUser.TIPO !="M" || baseUser.TIPO_MED != 'R'){
							v_iden_per = document.all.Hiden_medi.value;
						}
						var _obj = {"iden_anag":_iden_anag,"codice_prestazioni":codice_prestazioni,"urgenza":v_urgenza,"quesito_libero":v_quesito,"codice_esenzione":v_cod_esenzione,"nre_riferimento":v_nre,"num_pre_associato":_num_pre,"IDEN_PER":v_iden_per};
						//alert("call NS_RICETTA_ESTERNA.init\n" + JSON.stringify(_obj));
						NS_RICETTA_ESTERNA.init(_obj);
							//alert("NS_RICETTA_ESTERNA.esito " + NS_RICETTA_ESTERNA.esito);

						if(NS_RICETTA_ESTERNA.esito=="OK"){
							document.gestione_esame.impegnativa.value = NS_RICETTA_ESTERNA.ret_nre;
							//document.gestione_esame.txtCodEsterno6.value = NS_RICETTA_ESTERNA.ret_codice_sole;
					
							var v_iden_esa = [];
							/*$.each($("[name='descr_esame'] option"),function(k,v){
								v_iden_esa.push(v.value);
							});*/
							var v_obj = {"NRE":NS_RICETTA_ESTERNA.ret_nre,"CODICE_AUTENTICAZIONE_SAC":NS_RICETTA_ESTERNA.ret_autenticazione,"PC":opener.basePC.IP.substring(0,20),"IDEN_PRESTAZIONI":prestazioni, "IDEN_ANAG":_iden_anag,"IDEN_PER":baseUser.IDEN_PER};
							/*_extra_db = E_DB.gesXml(v_obj);*/
							_extra_db = NS_RE_SARPED.init(v_obj);
							document.gestione_esame.extra_db.value = _extra_db;
		
							_operazione = "I";
							gesStampaDema(stampa,NS_RICETTA_ESTERNA.ret_nre);
						}
						else
						{
							gesStampa(stampa);
						}
						getHomeFrame().chiudi_attesa();
					}
					else
					{
						gesStampa(stampa);
					}
				}
				catch(e){alert("Registra - Error:  " + e.description);return;}
			}		// fine	ges_satapp
			else
			{
				gesStampa(stampa);
			}
		}// fine gestione DEMA SAVONA
		// ***********************************************	  
	   // **************
		// modifica 18-4-16
		// per evitare doppio click
		$("#btSave").parent().parent().hide();			
		// ********************

		// modifica 14-6-16
	   	if((statoManuale == "A")&& (globalSito=="SAVONA")){
			var formObj = $('form[name="gestione_esame"]');
			//registra la scheda esame
			$.ajax( {
				type: "POST",
				url: formObj.attr( 'action' ),
				data: formObj.serialize(),
				success: function( response ) {
					window.opener.accettaEsameNew(document.gestione_esame.Hiden_esame.value);
					// modifica 31-8-16
					// inspiegabilmente per casi multipli NON salva il ticket !!
					// tappullo salvandolo a mano ??		
					var stm = numCartellaRadTer_obj.getQueryFrame().executeStatement('worklist_main.xml','updateTicketMultiEsa',[document.gestione_esame.Hiden_tick.value,document.gestione_esame.Hiden_esame.value.replace(/[*]/g, ",")],0);
					if (stm[0]!="OK"){
						alert("Errore nell'aggiornamento dell'esame/i.\n" + stm[1]);
					}
					// ***************

					self.close();
				}
			});
		}
		else{
			document.gestione_esame.submit();
		}
		//	**************************
	}
}

function gesStampaDema(stampa,impegnativa)
{
	var stampato="";
	if(document.gestione_esame.Hservlet_succ.value == '')
	{
		document.gestione_esame.Hservlet_succ.value = 'javascript:';
	}
	else
	{
		document.gestione_esame.Hservlet_succ.value = document.gestione_esame.Hservlet_succ.value.replace("self.close();", "");
	}
	document.gestione_esame.Hservlet_succ.value += 'call_servlet_dema("' + document.gestione_esame.Hiden_esame.value + '","'+document.gestione_esame.Hreparto.value+'","'+document.gestione_esame.Hiden_anag.value+'","'+stampa+'");';
}

function gesStampa(stampa)
{
	if(stampa == 'S')
	{
		//document.gestione_esame.Hservlet_succ.value = 'elabStampa?stampaFunzioneStampa=ETICHETTE_STD&stampaIdenEsame=' + document.gestione_esame.Hiden_esame.value + '&stampaReparto=' + document.gestione_esame.Hreparto.value + '&stampaAnteprima=S'+ '&stampaIdenAnag='+document.gestione_esame.Hiden_anag.value;
		if(document.gestione_esame.Hservlet_succ.value == '')
		{
			document.gestione_esame.Hservlet_succ.value = 'javascript:';
		}
		else
		{
			document.gestione_esame.Hservlet_succ.value = document.gestione_esame.Hservlet_succ.value.replace("self.close();", "");
		}
		
		document.gestione_esame.Hservlet_succ.value += 'document.location.replace("elabStampa?stampaFunzioneStampa=ETICHETTE_STD&stampaIdenEsame=' + document.gestione_esame.Hiden_esame.value + '&stampaReparto=' + document.gestione_esame.Hreparto.value + '&stampaAnteprima=N'+ '&stampaIdenAnag='+document.gestione_esame.Hiden_anag.value + '");';
	}
}


function continua()
{
	if(document.gestione_esame.Hiden_anag.value == '0'){
		document.gestione_esame.Hiden_anag.value = '';
	}

	// ***************
	var bolDaWhale = false;
	try{
		try{
			if (top.name == "schedaRicovero") {
				bolDaWhale = true;
			}
		}
		catch(e){;}

		// ******************
		// modifica 14-6-16
		try{
			if (!String.prototype.getTodayStringFormat) {
			  (function()
				{
					String.prototype.getTodayStringFormat = function()
					{
						var dataOggi ;
					
					
						dataOggi=new Date();
						var dataOggiGiorno=dataOggi.getDate();
						if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
						var dataOggiMese=dataOggi.getMonth()+1;
						if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
						var dataOggiAnno=dataOggi.getFullYear();
						var dataOggiStringa= dataOggiAnno.toString() + dataOggiMese.toString() + dataOggiGiorno.toString();
						return dataOggiStringa;
					};
					String.prototype.dateToStringFormat = function()
					{
						var strOutput ;
						try{
							strOutput = this.substring(6,10) + this.substring(3,5) + this.substring(0,2);
						}
						catch(e){
							strOutput = "!ERROR CONVERSION!";
						}
						return strOutput;
					};
				})();
			}		
			var oggi = (new String("")).getTodayStringFormat();
			if ($("#dataricetta").val()!=""){
				// modificato 9-6-16	
				if (!controllo_data($("#dataricetta").val())){
					alert("Attenzione: data ricetta non valida, prego correggere.");
					$("#dataricetta").focus();
					return;
				}
				//	*************			
				if ($("#dataricetta").val().dateToStringFormat()>oggi){
					alert("Attenzione: data ricetta futura, prego correggere.");
					$("#dataricetta").focus();
					return;
				}
			}
		}catch(e){;}
		// **************

		//alert(top.prenotaDaConsulta + " " + document.gestione_esame.Hiden_anag.value +"#");
		// il problema sembra presentarsi perch� se arrivo da prenotazione
		// diretta del paziente la variabile prenotaDaConsulta DEVE essere N
		// in tal caso avrei l'Hiden_anag valorizzato, diversamente se arrivo
		// da consulta prenotaDaConsulta DEVE essere S e Hiden_anag NON valorizzato o = 0
		
		// ******************
		// modifica 31-8-16
		if ((globalSito=="SAVONA")&&(document.gestione_esame.impegnativa.value!="")&&(document.gestione_esame.tipo_registrazione.value.substr(0,1) == "P")){
//		if ((globalSito=="SAVONA")&&(document.gestione_esame.impegnativa.value!="")&&($("#lblImpegnativa").parent().hasClass("classTdLabelObb"))){	
			verifica_impegnativa(document.gestione_esame.impegnativa);
			if(document.gestione_esame.impegnativa.value=="") {	document.gestione_esame.impegnativa.focus();return;	}
		}
		// *************


		// dopo analisi: la funzione chiamata da "Prenota appuntamento" aveva come parametro
		// INS_PRENO_CONSULTA , cambiandolo in INS_PRENO il parametro prenotaDaConsulta risulta corretto
		// ma il flusso di lavoro � totalmente diverso ! Credo che sia una modifica fatta ad hoc per whale
		// quindi , come workaround, si potrebbe in prima battuta fare una query per capire se matchano Hiden_anag
		// e la label del paziente, per evitare la notifica di "situazione imprevista" e non incasinare ulteriormente
		// il flusso della prenotazione!!
		if ((top.prenotaDaConsulta=="S" )&&(document.gestione_esame.Hiden_anag.value!="")&&(bolDaWhale==false)){
			// controllo se il paziente "in canna" matcha con quello sul quale si sta lavorando
			var cfPaz = $("label[id='lblXXX']").html().split("cod. fiscale: ")[1].substring(0,16);
			
			var rs;
			var bolMatchPatient = false;
			
			if (cfPaz!=""){
				try{
					rs =  parent.top.executeQuery('Prenotazione.xml','getIdPatientByCF',[cfPaz]);
				}
				catch(e){
					rs =  opener.parent.top.executeQuery('Prenotazione.xml','getIdPatientByCF',[cfPaz]);
				}
				if (rs.next()){
					if (rs.getString("iden") == document.gestione_esame.Hiden_anag.value){
						bolMatchPatient = true;
					}	
				}
			}
			if (!bolMatchPatient){
				if (confirm("Situazione imprevista: gia' presente un paziente in memoria, id anagrafico: " + document.gestione_esame.Hiden_anag.value + "\nInterrompere prenotazione?")){
					return;
				}
			}
		}
	}
	catch(e){
		//alert("Inside scheda_esame " + e.description);
	}
	// ***************


    
	if(document.gestione_esame.Htip_esec.value == 'undefined')
		document.gestione_esame.Htip_esec.value = '';
	
	if(check_dati())
	{
		document.gestione_esame.data_pre.disabled = false;
		document.gestione_esame.ora_pre.disabled = false;
		
		document.gestione_esame.data_acc.disabled = false;
		document.gestione_esame.ora_acc.disabled = false;
		
		document.gestione_esame.data_ese.disabled = false;
		document.gestione_esame.ora_ese.disabled = false;
		
		chiusura=true;
		//document.gestione_esame.method = 'get';
		// test aldo 20130502
		/*if (document.gestione_esame.Hiden_infoweb_richiesta.value !=""){
		 document.gestione_esame.tipo_azione.value = 'P';
		}*/
		// **********************
		if(document.gestione_esame.tipo_azione.value == 'C')
		{
			// Passo dalla consultazione!
			document.gestione_esame.action = 'consultazioneInizio';
			document.gestione_esame.action_app.value = 'S';
		}
		else
		{
			// Passo alla prenotazione normale!
			//document.gestione_esame.action = 'prenotazioneInizio';
			document.gestione_esame.action = 'javascript:next_prenotazione();';
		}
		
		if(document.gestione_esame.tipo_registrazione.value == 'PC' || document.gestione_esame.tipo_registrazione.value == 'PR')
		{
			if(parent.frameDirezione)
			{
				if(parent.frameDirezione.document.all.btDataOra.style.visibility == 'hidden')
				{
					document.gestione_esame.tipo_registrazione.value = 'P';
				}
				
				parent.frameDirezione.colora_sel_desel('btDataOra');
			}
		}
		//alert('scheda_esame.js : '+ document.gestione_esame.action);		
		document.gestione_esame.submit();
	}
}
/*
function check_dati()
{
	var oInp = null;
	var ret = true;
	var msg = 'Mancano i seguenti campi:\n';
	var i;
	var j;
	var c=0;
	/*
	for(i = 0; i < aCheck.length; i++)
	{
		if(aCheck[i] != '')
		{
			oInp = document.getElement(aCheck[i]);
			alert(aCheck[i]);
			if(oInp != null)
			{alert(oInp);
				if(oInp.value == '')
				{
					msg += aCheck[i] + '\n';
				}
			}
			
			oInp = null;
		}
	}*/
	/*
	oInp = document.getElementsByTagName('input');
	
	for(i = 0; i < oInp.length; i++)
	{
		for(j = 0; j < aCheck.length; j++)
		{
			if(aCheck[j] != '' && oInp[i].name == aCheck[j])
			{
				if(oInp[i].value == '')
				{
					msg += aCheckDescr[j] + '\n';
					c++;
				}
			}
		}
	}
	
	oInp = null;
	
	oInp = document.getElementsByTagName('textarea');
	
	for(i = 0; i < oInp.length; i++)
	{
		for(j = 0; j < aCheck.length; j++)
		{
			if(aCheck[j] != '' && oInp[i].name == aCheck[j])
			{
				if(oInp[i].value == '')
				{
					msg += aCheckDescr[j] + '\n';
					c++;
				}
			}
		}
	}
	
	oInp = null;
	
	if(c > 0)
	{
		alert(msg);
		ret = false;
	}
	
	return ret;
}*/

function swap_img_flag(img, campo)
{
	if(campo.value=="S")
	{
		campo.value="N";
		img.src = "imagexPix/schedaAnag/nospuntaradio.gif";
	}
	else
	{
		campo.value="S";
		img.src = "imagexPix/schedaAnag/spuntaradio2.gif";
	}
}

function check_num(campo, virgola)
{
	var tmp = campo.value;
	var checkNum = '0123456789';
	var charTmp = '';
	var check = true;
	var i=0;
	
	if(virgola)
	{
		checkNum += ',';
		tmp = tmp.replace('.', ',');
	}
	
	while(i <= tmp.length && check)
	{
		charTmp = tmp.charAt(i++);
		
		check = (checkNum.indexOf(charTmp) != -1);
	}
	
	if(!check)
	{
		alert('Inserire numero valido!');
		tmp = '';
		campo.focus();
	}
	
	campo.value = tmp;
}

function ricava_num_ps()
{
	var par = '';
	
	if(document.gestione_esame.Hiden_pro.value != '' && document.gestione_esame.Hiden_anag.value != '')
	{
		par = 'SP_RICAVA_NUM_PS@IString#IString#OVarchar#OVarchar@';
		par += document.gestione_esame.Hiden_pro.value + '#';
		par += document.gestione_esame.Hiden_anag.value;
		
		dwr.engine.setAsync(false);
		
		functionDwr.launch_sp(par, risp_ricava_num_ps);
		
		dwr.engine.setAsync(true);
	}
}

function risp_ricava_num_ps(valore)
{
	var a_val;
	
	if(valore != '')
	{
		a_val = valore.split('@');
		
		if(a_val[0] == 'IMP')
		{
			document.gestione_esame.impegnativa.value = a_val[1];
		}
		else
		{
			if(a_val[0] == 'PS')
			{
				document.gestione_esame.num_ps.value = a_val[1];
			}
		}
	}
}

function calcola_anni(mesi)
{
	if (!isNaN(mesi) && mesi != '' && document.gestione_esame.txtEtaPaz.value == '')
		document.gestione_esame.txtEtaPaz.value = parseInt(parseInt(mesi, 10) / 12, 10);
}

function calcola_mesi(anni)
{
	if (!isNaN(anni) && anni != '' && document.gestione_esame.txtEtaPazMesi.value == '')
		document.gestione_esame.txtEtaPazMesi.value = parseInt(anni, 10) * 12;
}

function apri_storico()
{
	var win = null;
	var id  = document.gestione_esame.Hiden_esame.value;
	
	win = window.open('servletGenerator?KEY_LEGAME=STORICO_QUESITI&IDEN_ESAME=' + id, '', 'status = yes, scrollbars = yes, height = 480, width = 640, top = 1, left = 1');
	if(win)
		win.focus();
	else
		window.open('servletGenerator?KEY_LEGAME=STORICO_QUESITI&IDEN_ESAME=' + id, '', 'status = yes, scrollbars = yes, height = 480, width = 640, top = 1, left = 1');
}

function cambia_tipo_dsa(valore)
{
	document.gestione_esame.Hiden_tipo_day_service.value = valore;
}

function verifica_dsa(numero)
{
	var par = '';
	
	if(document.gestione_esame.numero_day_service.value != '')
	{
		par = 'SP_VERIFICA_ESISTENZA_DSA_ESA@IString#IString#OVarchar@';
		par += (document.gestione_esame.Hiden_anag.value == '0' ? ' ':document.gestione_esame.Hiden_anag.value) + '#';
		par += document.gestione_esame.numero_day_service.value;
		
		dwr.engine.setAsync(false);
		
		functionDwr.launch_sp(par, risp_verifica_dsa);
		
		dwr.engine.setAsync(true);
	}
}

function risp_verifica_dsa(risposta)
{
	var a_risp = risposta.split('@');
	var conf = false;
	
	if(trim(a_risp[1]) != '')
		if(trim(a_risp[0]) == 'OK')
			conf = confirm(trim(a_risp[1]));
		else
			alert(trim(a_risp[1]));
	
	if(document.all.lblTitoloScheda.innerHTML.indexOf(' - ') > 0)
		document.all.lblTitoloScheda.innerHTML = document.all.lblTitoloScheda.innerHTML.substr(0, document.all.lblTitoloScheda.innerHTML.indexOf(' - '));
	
	if(!conf)
	{
		if(trim(a_risp[1]) != '')
		{
			document.gestione_esame.Hiden_anag.value = '';
			document.gestione_esame.numero_day_service.value = '';
		}
	}
	else
	{
		document.gestione_esame.Hiden_anag.value = a_risp[2];
		
		if(trim(a_risp[1]) != '')
		{
			document.all.lblTitoloScheda.innerHTML = document.all.lblTitoloScheda.innerHTML + ' - ' + a_risp[1].split('\n')[1];
		}
	}
}



//***************************
//****** modifica DEMA ******
//***************************	


//***************************
//****** modifica DEMA ******
//***************************	
//	modifica 14-6-16
// modifica 31-8-16
function verifica_impegnativa(numero_impegnativa)
{
	var vImpegnativa = numero_impegnativa.value;
	var bolControlloNRE = false;
	var bolDematerializzata = false;
	
	var idenTickSel = document.gestione_esame.Hiden_tick.value;

	if (!gblScaricoManuale){
		if(vImpegnativa != ''){
			// modificato 9-6-16		
			var rs;
			// *****************
			// document.gestione_esame.Hiden_tick.value pu� esser vuoto !
			// document.gestione_esame.tipo_registrazione.value.substr(0,1) == "P" se sto facendo prenotazione
			if (idenTickSel==""){idenTickSel=0;}
			rs = numCartellaRadTer_obj.getQueryFrame().executeQuery('dema.xml','isTicket_to_check',[idenTickSel]);
			if (rs.next()){
				if ((parseInt(rs.getString("NUM"))>0)||(idenTickSel==0)){
					if ((document.gestione_esame.tipo_registrazione.value=="I")||(document.gestione_esame.tipo_registrazione.value.substr(0,1) == "P")){
						if (gblScaricoDema){
							// controllo NRE
							bolControlloNRE = true;
						}
						else{
							// controllo poligrafico
							bolControlloNRE = false;
						}
					}
					else{
						// NON sono in inserimento
						rs = numCartellaRadTer_obj.getQueryFrame().executeQuery('dema.xml','is_dematerializzata',[document.gestione_esame.Hiden_esame.value]);
						if (rs.next()){
							if (rs.getString("cod11")=="DEMATERIALIZZATA"){
								bolDematerializzata = true;
							}
						}
						if (bolDematerializzata){
							// controllo NRE
							bolControlloNRE = true;
						}
						else{
							// controllo poligrafico
							bolControlloNRE = false;
						}
					}
					var stmToCall ="";
					if (bolControlloNRE){
						stmToCall = "check_nre";
					}
					else{
						stmToCall = "check_poligrafico";
					}
					rs = numCartellaRadTer_obj.getQueryFrame().executeQuery('dema.xml',stmToCall,[vImpegnativa]);
					if (rs.next()){
						if (rs.getString("esito")=="N"){
							//	modifica 14-6-16
							if (bolControlloNRE){
								// ho controllato poligrafico e non va bene
								// quindi lo segnalo, farlo SOLO per il prenotato (??)
								alert("Attenzione: se si sta tendando d'inserire un NRE, \u00E8 necessario prima accettare o erogare l'esame effettuando, quindi, lo scarico della dematerializzata!")
								numero_impegnativa.value = "";
								return;									
							}
							else{
								alert("Attenzione: inserire un numero poligrafico valido!")
								numero_impegnativa.value = "";
								return;			
							}
							// **************
						}
					}								
				}
			}	// fine controllo ticket da controllare
		} // fine controllo esistenza rs
	} // controllo scarico manuale (da prenotato a accettato senza impegnativa, x una rossa)
}
//***************************

// *********************************************
// NON esisteva la funzione....(???)
function cambia_priorita_lea(value){
	try{
		document.gestione_esame.Hcodice_lea.value = value;
	}
	catch(e){alert("cambia_priorita_lea - Error: " + e.description)}
}
// *********************************************


var bolCreaGestRadioTerap =false;
// **************************************************************
// **************************************************************
// modifica aldo 16-3-15
var numCartellaRadTer_obj = {
	idRelatedObj: "",
	savedValue:"",
	init:function(idenAnag, reparto){
		var id = this.getIdRelatedObj();
		if (id=="" || idenAnag=="" || reparto ==""){return;}
		//var rs = opener.top.executeQuery('radioTerapia.xml','getNumCartella',[idenAnag, reparto]);
		var rs = this.getQueryFrame().executeQuery('radioTerapia.xml','getNumCartella',[idenAnag, reparto]);
	
		if (rs.next()){
			this.setSavedValue(rs.getString("NUM_CARTELLA"));
			$("#"+id).val(this.getSavedValue());
		}

	},
	save:function(idenAnag, reparto){
		var value = $("#"+this.getIdRelatedObj()).val();
		if (value==""){return true;}
//		var stm = opener.top.executeStatement('radioTerapia.xml','saveNumCartella',[idenAnag, reparto, value, baseUser.LOGIN],0);
		var stm = this.getQueryFrame().executeStatement('radioTerapia.xml','saveNumCartella',[idenAnag, reparto, value, baseUser.LOGIN],0);
		if (stm[0]!="OK"){
//			alert("Errore: problemi nella salvataggio. " + stm[1]);
			alert("Errore: problemi nella salvataggio.\nNum.Cartella: " + value +" gia' presente per cdc: " + reparto);
			return false;
		}
		else{
			//tutto ok chiudo
			//idenSal = stm[2];
			this.setSavedValue(value);
			return true;
		}

	},
	setIdRelatedObj: function(idValue){
		this.idRelatedObj = idValue;
	},
	getIdRelatedObj: function(){
		return this.idRelatedObj;
	},
	setSavedValue: function(value){
		this.savedValue = value;
	},
	getSavedValue: function(){
		return this.savedValue;
	},
	getQueryFrame: function(){
		try {
			if (opener.top){
				return opener.top;
			}
			else{
				return top;
			}
		}
		catch(e){
			return top;
		}		
	}
}
// **************************************************************


function getHomeFrame(){
	try {
		if (opener.top.home){
			return opener.top.home;
		}
		else{
			return top.home;
		}
	}
	catch(e){
		// MEGA "PATCH" per la prenotazione da dema !!
		try{
			if (top.location.href.toString().indexOf("prenotazioneFrame?visual_bt_direzione=N")>-1){
				return top.opener.top.home;			
			}
			else{
				return top.home;
			}
		}
		catch(e){
			return top.home;
		}
	}
}


// **** modifica 4-5-15
function controllo_data(stringa){
	var espressione = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
	if (!espressione.test(stringa))
	{
	    return false;
	}else{
		anno = parseInt(stringa.substr(6),10);
		mese = parseInt(stringa.substr(3, 2),10);
		giorno = parseInt(stringa.substr(0, 2),10);
		
		var data=new Date(anno, mese-1, giorno);
		if(data.getFullYear()==anno && data.getMonth()+1==mese && data.getDate()==giorno){
			return true;
		}else{
			return false;
		}
	}
}


// *****************
// modifica 14-6-16
function cambia_priorita_lea(codice)
{
	document.gestione_esame.Hcodice_lea.value = codice;
}
// *****************

// modifica 28-11-16
function lockCampiDema(){
	try{
		$("[name='provenienza']").attr("readonly","readonly");	
		$("select[name='selOnere']").attr("disabled","disabled");
		$("[name='impegnativa']").attr("readonly","readonly");
		$("[name='selTicket']").attr("disabled","disabled");
		$("#dataricetta").unmask();
		$("#dataricetta").attr('readonly', true);	
		$("[name='selTipoRice']").attr("disabled","disabled");		
		$("[name='selPrioritaLea'],[name='selAccesso'],[name='selPrescrittiva']").attr("disabled","disabled");
		$("[name='esenzione']").attr("readonly","readonly");	
		$("[name='txtQuesitoClinico']").attr("readonly","readonly");		
		$("[name='selTipoMedPrescr']").attr("disabled","disabled");
		$("[name='cod_fisc_med']").attr("readonly","readonly");							
		$("[name='medicoinviante']").attr("readonly","readonly");
	}catch(e){;}
}
// **********