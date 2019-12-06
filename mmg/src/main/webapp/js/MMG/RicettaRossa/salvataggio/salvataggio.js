var $esenzioni;

$(document).ready(function(){
	SALVATAGGIO_RR.init();
	SALVATAGGIO_RR.setEvents();
	SALVATAGGIO_RR.buildFarmaciTable();
	SALVATAGGIO_RR.checkPrivacy();
});

var SALVATAGGIO_RR = {
		
		objSalvataggio : null,
		
		objControl : null,
		
		//controlloStampa:false,
		
		selectedLine: '',
		
		init:function(){
			
			home.RICETTA_FARMACI.setNScheda($("#N_SCHEDA").val());
			
			home.PRESALVATAGGIO_FARMACI = this;
			
			SALVATAGGIO_RR.objSalvataggio = home.RICETTA_FARMACI.getObjSalvataggio();
			SALVATAGGIO_RR.objControl = home.RICETTA_FARMACI.getObjControl();
			SALVATAGGIO_RR.checkRows();
			
			if( home.LIB.getParamUserGlobal( 'SALVATAGGIO_RAPIDO_RR', 'S' ) == 'S' && $(".tdNota").length<1 && $(".tdNoAllergie").length>0){
				
				var n_scheda = $("#N_SCHEDA").val();
				var id_scheda = "#iScheda-" + n_scheda;
				home.$(id_scheda).hide();
				
				SALVATAGGIO_RR.save();
				
			}else{
				
				//Continua a schiantare il database :(
				if (LIB.getParamUserGlobal("INTERAZIONI_FARMACI","N") == "S") {
					SALVATAGGIO_RR.checkInterazioni();
				}
				NS_MMG_UTILITY.removeVeloNero('page');
			
				if($(".tdAllergia").length>0){
					
					$("#fldAllergieFarmaco").addClass("fldAllergieFarmaco");
					home.NOTIFICA.warning({
						message:traduzione.lblPresAllergie,
						title: "Attenzione"
					});
				}
				
				if($(".tdNota").length>0){
					
					home.NOTIFICA.info({
						message:traduzione.lblSelFarmaci,
						title: "Attenzione"
					});
				}
			}
			
			SALVATAGGIO_RR.originalDiagnosi = $('#lblDiagnosi').text();
			
			SALVATAGGIO_RR.updateDiagnosiChars();
			
			$("#txtSuggerito_da, #txtSuggerito_struttura").closest("tr").hide();
			
			
			var stampa_posologia = "N";
			for (var u=0; u < SALVATAGGIO_RR.objSalvataggio.farmaco.length; u++) {
				if (SALVATAGGIO_RR.objSalvataggio.farmaco[u].stampa_posologia == "S") {
					stampa_posologia = "S";
				}
			}
			
			if(stampa_posologia == "N" && LIB.isValid(home.baseUser.POSOLOGIA_RR) && home.baseUser.POSOLOGIA_RR != undefined){
				stampa_posologia = home.baseUser.POSOLOGIA_RR
			}
			$('#radStampaPosologia').data('RadioBox').selectByValue( stampa_posologia );
			home.CARTELLA.stampaPosologia = stampa_posologia;
			
			$esenzioni = $(".classEsenzione").contextMenu(menuEsenzioni, {
				openSubMenuEvent : "mousedown",
				openInfoEvent : "mousedown"
			});
			
			$(".butSalvataggio").addClass("butVerde");
			
			if (!home.MMG_CHECK.isMedico()) {
				$(".butSalvaNoPrint").hide();
			}
		},
		
		setEvents:function(){
			
			$("body").on("keyup",function(e){
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				//tasto f2
				if(e.keyCode == "113"){
					e.preventDefault();
					$(".butSalvataggio").trigger("click");
				}
				//tasto esc
				else if(e.keyCode == "27"){
					e.preventDefault();
					$(".butChiudi").trigger("click");
				}
			});
			
			$(".tdNota").on("click", function(){
				SALVATAGGIO_RR.checkClass($(this));
			});
			
			$(".butChiudi").off("click");
			$(".butChiudi").on("click", function(){
				if(confirm(traduzione.lblChiudiScheda)){
					SALVATAGGIO_RR.chiudiScheda();
				}
			});
			
			var func_salvataggio = function(stampa_ricetta){
	
				if($(".tdAllergia").length>0) {
					home.NS_MMG.confirm(traduzione.lblAllergiaSave, function(){
						NS_MMG_UTILITY.setVeloNero('page');
						SALVATAGGIO_RR.save(stampa_ricetta);
					});
				}else{
					SALVATAGGIO_RR.save(stampa_ricetta);
				}
				var n_scheda = $("#N_SCHEDA").val();
				var id_scheda = "#iScheda-" + n_scheda;
				home.$(id_scheda).hide();
			};
			$(".butSalvataggio").one("click",func_salvataggio);
			
			$(".butSalvaNoPrint").one("click", function(){
				func_salvataggio("N");
			});
			
			$(".icon-info-circled").on("click",function(){
				//alert($(this).parent().attr("codicenota"));
				FARMACI_COMMON.apriNoteCUF($(this).parent().attr("codicenota"));
			});
			
			$("#butInserisci").on("click", function(){
				
				testo = $("#txtDiagnosi").val() + "Proc. di prevenzione";
				$("#txtDiagnosi").val(testo);
			});
			
			$('#txtDiagnosi').on('keyup blur', SALVATAGGIO_RR.updateDiagnosiChars );
			
			$('#radSuggerita').on("change", function(){
				if($("#h-radSuggerita").val() == 'S'){
					$("#txtSuggerito_da, #txtSuggerito_struttura").closest("tr").show();
				}else{
					$("#txtSuggerito_da, #txtSuggerito_struttura").closest("tr").hide();
					$("#txtSuggerito_da, #txtSuggerito_struttura").val('');
					$("#h-txtSuggerito_da").val('');
				}
			});

			$('#radStampaPosologia').on("change", function(){
				if($('#h-radStampaPosologia').val() != ''){
					home.CARTELLA.stampaPosologia = $('#h-radStampaPosologia').val();
				}
			});
			
			$('.esenzione input').on("dblclick",function(){
				selectedLine = $(this).parent("td").parent("tr").attr("title");
				home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=PRESALVATAGGIO_FARMACI&CAMPO_VALUE=");
			}).on("mousedown", function(e){ 
				if (e.button == '2') {
					$esenzioni.test(e, this);
				}
			}); 
			
			$(document).on("click",".delAcc", SALVATAGGIO_RR.cancellaFarmaco ) ;
		},

		checkPrivacy:function(){
			
			NS_MMG_UTILITY.checkPermessoSpecialista([$("#txtDiagnosi")]);
		},
		
		buildFarmaciTable:function() {

			var vAcc;
			var vEsenz;
			var riga;
			
			/*TD per vari flag, per ora solo Ripetibile*/
			var tdflag;
			var tdStampaPA;
			var ripetibile;
			var pa;
			var vTable = $("#fldRiepilogo table");
			
			vTable.append("<tr class='head'><th>"+traduzione.lblCancella+"</th><th>"+traduzione.farmaco+"</th><th>"+traduzione.esenzione+"</th><th>Ripetibile</th><th>Stampa Nome Farmaco</th></tr>");
			
			$.each(SALVATAGGIO_RR.objSalvataggio.farmaco, function(idx, obj) {
				
				vTable.append(
					riga = $("<tr/>", {	
						"codice":obj.cod_farmaco, 
						"pa":obj.cod_pa, 
						"classe_farmaco":obj.classe, 
						"class":"dati", 
						"title":idx
					}).append(
						$("<td/>").append(
							$('<i>', { 'class' : 'delAcc icon-cancel-1' })
						)).append(
						$("<td/>",{"class":"farmaco"}).append(
							vAcc = $("<input/>", {"value":obj.descr_farmaco})
						)).append(
						$("<td/>",{"class":"esenzione"}).append(
							vEsenz = $("<input/>", {
								"value":home.RICETTA_FARMACI.getEsenzioneFromIdx(obj.index),
								"title":home.RICETTA_FARMACI.getEsenzioneFromIdx(obj.index),
								"data-value":obj.cod_esenzione
							})
						))
					);
				
				riga.append(tdflag = $("<td/>"));
				riga.append(tdStampaPA = $("<td/>"));				
				
				if (obj.forzatura=="B" || (obj.classe=="C" && obj.forzatura != "R")
						|| ($("td.tdNota[cod_farmaco="+obj.cod_farmaco+"]").length > 0) // && $(".tdNotaSel[cod_farmaco="+obj.cod_farmaco+"]").length == 0
					) {
					tdflag.append(ripetibile = $("<button></button>", {"class": "ripetibile"}));
					ripetibile.on("click", function() {
						var questo = $(this);
						NS_MMG_UTILITY.buttonSwitch(questo, {
								before: function() {
									questo.attr("style", "background-color: white;");
								},
								text: "SI"
							}, {
								before: function() {
									questo.removeAttr("style");
								},
								text: "NO"
							}
						);
					});
					
					if(LIB.isValid(obj.ripetibile) && obj.ripetibile == "S") {
						ripetibile.trigger("click");
					}else{
						NS_MMG_UTILITY.buttonDeselect(ripetibile, {text:"NO"});
					}
					
					if ($("td.tdNotaSel[cod_farmaco="+obj.cod_farmaco+"]").length > 0) {
						ripetibile.hide();
					}
				}
				
				tdStampaPA.append(pa = $("<button></button>", {"class": "pa"}));
				pa.on("click", function() {
						NS_MMG_UTILITY.buttonSwitch($(this), {
							before: function() {
								$(this).attr("style", "background-color: white;");
							},
							text: "SI"
						},{
							before: function() {
								$(this).removeAttr("style");
							},
							text: "NO"
						}
					);
				});
				
				/*
				SHOW_FARMACO_ORIGINALE = 0 --> stampa del principio attivo
				SHOW_FARMACO_ORIGINALE = 1 --> stampa del farmaco
				*/
				
				if(!LIB.isValid(obj.SHOW_FARMACO_ORIGINALE)){
					//Controllo il valore in base al parametro globale
					if(home.LIB.getParamUserGlobal( 'SHOW_FARMACO_ORIGINALE', '1' ) == '0'){						
						NS_MMG_UTILITY.buttonDeselect(pa, {text:"NO"});
					}else{
						NS_MMG_UTILITY.buttonSelect(pa, {text:"SI"});	
					}
				}else{
					//controllo il valore in base al parametro all'interno dell'oggetto di salvataggio
					if(obj.SHOW_FARMACO_ORIGINALE == "0"){
						NS_MMG_UTILITY.buttonDeselect(pa, {text:"NO"});
					}else{
						NS_MMG_UTILITY.buttonSelect(pa, {text:"SI"});	
					}
				}
				//home.RICETTA_FARMACI.getEsenzioneFromIdx(obj.index);
				
				if(obj.suggerita == "S" && radSuggerita.val() != "S") {
					$("#radSuggerita_S").trigger("click");
					SALVATAGGIO.getDatiSuggerita("FARMACI", obj.iden);
				}
			});
			
		},
		
		cancellaFarmaco: function(){
			var offset = 1; // header row
			if ($("#fldRiepilogo tr.dati").length < 2 ) {
				home.NOTIFICA.warning({message:"Impossibile cancellare tutti i farmaci", title: "Attenzione"});
				return;
			}
			var tr = $(this).closest("tr");
			var idx = tr.index() - offset;

			SALVATAGGIO_RR.objSalvataggio.farmaco.splice(idx,1);
			tr.remove();
		},
		
		updateDiagnosiChars: function(){
			
			 var max = 256, current = $('#txtDiagnosi').val().length;
			
			 if( !LIB.isValid( $('#txtDiagnosi').attr('maxLength') ) ){
				 $('#txtDiagnosi').attr('maxLength', max);
			 }
			 
			 $('#lblDiagnosi').text( SALVATAGGIO_RR.originalDiagnosi + ' (caratteri usati '+ current +'/'+ max +')' );
		},
		
		//funzione che controlla la selezione di una nota sola per ogni farmaco
		checkClass:function(obj){
			
			var codiceNota = obj.attr("codicenota");
			var thisCod  = obj.attr("cod_farmaco");
			var cont = 0;
			
			//rimuovo la selezione da tutte le note cuf relative al frmaco e che sono diverse da quella selezionata
			$("tr[idx=" + obj.parent().attr("idx") + "] td.tdNotaSel").each(function(){
				if($(this).attr("cod_farmaco") == thisCod  && $(this).attr("codicenota") != codiceNota){ /*controllo ridondante?*/
					$(this).removeClass("tdNotaSel");
				}
			});
			
			//ora passo a fare i controlli su quella selezionata. Ovviamente se gia' selezionata la deseleziono e metto l'attributo notaCuf della riga del farmaco vuoto
			if(!obj.hasClass("tdNotaSel")){
				obj.addClass("tdNotaSel");
				$("tr[codice="+thisCod+"]").attr("notaCuf",obj.attr("codicenota"));
				$("tr[codice="+thisCod+"] td button.ripetibile").hide();
			}else{
				obj.removeClass("tdNotaSel");
				$("[codice="+thisCod+"]").attr("notaCuf","");
				$("tr[codice="+thisCod+"] td button.ripetibile").show();
			}
		},
		
		//funzione che effettua controlli sulle righe della tabella delle note cuf
		checkRows:function(){

			//nascondo la parte delle note cuf se non ho risultati (come potrebbe succedere per le prestazioni e gli accertamenti
			if($("#tableNote tr").length < 1){
				$("#fldNoteCuf").hide();
			}
			
			//se una nota cuf era gia' stata selezionata la riseleziono
			var arrFarmaci = SALVATAGGIO_RR.objSalvataggio.farmaco;
			for (var i=0;i<arrFarmaci.length;i++){
				var cod_farmaco=arrFarmaci[i].cod_farmaco;
				var notaCuf = arrFarmaci[i].note_cuf;
				var forzaturaFarm = arrFarmaci[i].forzatura;
				$(".tdNota[cod_farmaco="+cod_farmaco+"]").each(function(){
					if($("#tableNote tr[idx=" + $(this).parent().attr("idx") + "] td.tdNota.tdNotaSel").length > 0) {
						return true; /*prossimo elemento*/
					}
					if($(this).attr("codicenota")==notaCuf){
						$(this).addClass("tdNotaSel");
						return false; //interrompe il ciclo, selezionando la nota per un solo farmaco
					}
					if($(this).attr("codicenota")=="forzaRR" && forzaturaFarm == 'R'){
						$(this).addClass("tdNotaSel");
						return false; //interrompe il ciclo, selezionando la nota per un solo farmaco
					}
				});
			}
		},
		
		/*
		 * DA RIVEDERE
		 * 
		 * Fare query su database con principi attivo in prescrizione e iden_anag.
		 * 
		 * Attualmente:
		 * 1) si blocca
		 * 2) Non vengono piu' (dal 08/04/2016) valorizzati da interfaccia gli array da verificare
		 * 
		 * @returns {undefined}
		 */
		checkInterazioni:function(){
			
			/******************************************************************************************
			 	farmaci : sono i farmaci prescritti negli ultimi sei mesi, compresi quelli attuali
			 	pa: sono i principi attivi dei farmaci che sto prescrivendo in questo momento
			*******************************************************************************************/
			
			var params = {
				'farmaci' 	: SALVATAGGIO_RR.objControl.prodottiDaControllare.toString(),
				'pa'		: SALVATAGGIO_RR.objControl.paDaControllare.toString()
			};
			
			var array_controllo = new Array();
			var descr_farmaco = '';
			var descr_pa = '';
			
			dwr.engine.setAsync(false);
			toolKitDB.getResultDatasource( 'MMG_DATI.INTERAZIONI_FARMACI', 'MMG_DATI', params, null, function( response ){
				
				for(var i=0; i<=response.length; i++){
					
					descr_farmaco = '';
					descr_pa = '';
				
					if(typeof response[i] != 'undefined'){
						
						var codice_farmaco = response[i].CODICE_PRODOTTO;
						var codice_pa_interagente = response[i].CODICE_PA_INTERAGENTE;
						
						for(var x=0;x<=SALVATAGGIO_RR.objControl.farmaco.length;x++){
							
							var obj = SALVATAGGIO_RR.objControl.farmaco[x];
							
							if(typeof obj != 'undefined'){
								if(obj[0]==codice_farmaco){
									descr_farmaco = obj[1];
								}
								
								if(obj[2]==codice_pa_interagente){
									descr_pa = obj[1];
								}
							}
						}

						//metto insieme i valori della risposta per controllare la presenza di eventuali doppioni (vedi parte dopo della funzione)
						var val = codice_farmaco + '@' + codice_pa_interagente + '@' + response[i].DESCRIZIONE_INTERAZIONE;
						
						descr_pa = response[i].DESCRIZIONE + ' ( Farmaco: ' + descr_pa + ' )';
						
						//controllo che non ci sia un avviso ripetuto. In pratica eseguo una distinct a mano senza farla fare al db
						if(!NS_MMG_UTILITY.checkPresenzaInArray(array_controllo,val)){
						
							array_controllo.push(val);
							
							home.NOTIFICA.warning({
								message: SALVATAGGIO_RR.setMsgInterazioni( descr_farmaco, descr_pa, response[i].DESCRIZIONE_INTERAZIONE,'NOTIFICA'),
								title: "Attenzione",
								timeout: 120
							});	
						}
							
					}
				}
				
			});
			dwr.engine.setAsync(true);
		},
		
		chiudiScheda:function(){
			NS_FENIX_SCHEDA.chiudi();
		},
		
		save:function(stampa_ricetta){
			/*
			if(SALVATAGGIO_RR.controlloStampa){
				return;
			}
			
			SALVATAGGIO_RR.controlloStampa = true;
			*/
			var obj = SALVATAGGIO_RR.objSalvataggio;
			obj.diagnosi = NS_MMG_UTILITY.stripHTML($("#txtDiagnosi").val());
			obj.stampaInformativa = radStampaInformativa.val();
			obj.suggerita = radSuggerita.val() != '' ? radSuggerita.val() : 'N';
			obj.suggerita_da = ($("#h-txtSuggerito_da").length > 0) ? $("#h-txtSuggerito_da").val() : "";
			obj.suggerita_struttura = ($("#txtSuggerito_struttura").length > 0) ? $("#txtSuggerito_struttura").val() : "";
			obj.ricovero = radRicovero.val();
			obj.altro = radAltro.val();
			obj.stampa_posologia = radStampaPosologia.val() != '' ? radStampaPosologia.val() : 'N';
			
			var notecounter = 0;
			
			$("#fldRiepilogo tr.dati").each(function(i) {				
				delete obj.farmaco[i].stampa_posologia; //tengo solo la posologia globale. In alternativa potrei sovrascriverla con quella globale ma preferisco evitare ridondanze
				
				//se il codice dell'esenzione esiste, e il campo di testo dell'esenzione non e' vuoto, di conseguenza salvo l'esenzione 
				obj.farmaco[i].cod_esenzione = $(this).find("td.esenzione input").attr("data-value") != undefined && $(this).find("td.esenzione input").val() != ''? $(this).find("td.esenzione input").attr("data-value") : '';
				obj.farmaco[i].ripetibile = $(this).find("td button.ripetibile").hasClass("selected") ? "S" : "";
				obj.farmaco[i].SHOW_FARMACO_ORIGINALE = $(this).find("td button.pa").hasClass("selected") ? "1" : "0";
				
				var nota = $("#fldNoteCuf tr[idx=" + notecounter + "] td.tdNota[cod_farmaco="+obj.farmaco[i].cod_farmaco+"]");
				var codicenota = NS_MMG_UTILITY.getAttr(nota.filter(".tdNotaSel"),"codicenota","");
				
				if (nota.length > 0) {
					notecounter++;
				}
				
				/*valorizzo la nota e l'eventuale forzatura nel caso nota 04*/
				if(codicenota == "forzaRR") {
				
					obj.farmaco[i].note_cuf = "";
					obj.farmaco[i].forzatura="R";
				
				} else {
					
					obj.farmaco[i].note_cuf = codicenota;
//					obj.farmaco[i].forzatura="";
				}
				/*	se ci sono note per il farmaco ma non risultano essere state scelte allora forzo il farmaco su Ricetta Bianca
					tranne nel caso di esenzioni G01, G02, V01. */
				if (nota.length > 0 && obj.farmaco[i].note_cuf == ""
						&& obj.farmaco[i].forzatura != "R"
						&& obj.farmaco[i].cod_esenzione != 'G01'
						&& obj.farmaco[i].cod_esenzione != 'G02'
						&& obj.farmaco[i].cod_esenzione != 'V01'
					){
					obj.farmaco[i].forzatura = "B";
				}
				
				if (obj.farmaco[i].ripetibile == "S") {
					//obj.farmaco[i].forzatura = "B";
					//obj.farmaco[i].qta = 1; /*Lascio all'utente la liberta' di mettere qualsiasi quantita' voglia, visto che non e' conoscibile a priori quante scatole acquistera' il paziente. La ignoro in stampa.*/
				}
			});
			
			//richiamo la funzione di salvataggio e stampa nel frame della ricetta farmaci;
			home.RICETTA_FARMACI.saveStampa(stampa_ricetta);
			//NS_MMG_UTILITY.removeVeloNero('page');
			//SALVATAGGIO_RR.controlloStampa = false;
			//home.NS_FENIX_TOP.chiudiUltima();
		},
		
		//funzione che setta il campo delle diagnosi concatenando i risultati della query
		setDiagnosi:function(){
			
			var vProblemi = '';
		    var	vDiagnosi = '';
		    var	callDb = false;
		
			$.each(SALVATAGGIO_RR.objSalvataggio.farmaco, function(k,v) {
				
				(v.problema != '') ? ( callDb = true, vProblemi += v.problema +"," ) : ( vProblemi += "0," );
			});
			
			if (callDb){
				
				toolKitDB.getResultDatasource('RICETTE.SET_DIAGNOSI','MMG_DATI',{"iden_problemi": vProblemi.substring(0, vProblemi.length - 1 )},null,function(resp){
					
					$.each(resp,function(k,v){
						
						if(vDiagnosi != ''){
							vDiagnosi += "  |  " + v["DESCRIZIONE"];
						}else{
							vDiagnosi += v["DESCRIZIONE"];
						}
					});
					$("#txtDiagnosi").val(vDiagnosi);
				});
			}
		},
		
		setMsgInterazioni:function(vFarmaco, vPa, vInterazione, type){
			
			//gestisco se il messaggio viene consegnato per un alert o un messaggio di notifica
			var a_capo = typeof type != 'undefined' ? '<br/>' : '\n' ;
			var und = typeof type != 'undefined' ? '<u>' : '' ;
			var undFinal = typeof type != 'undefined' ? '</u>' : '' ;
			

			var msg = '';
			msg += und + '* Principio Attivo prescritto: ____________________________ '+ undFinal + a_capo + vPa + a_capo + a_capo;
			msg += und + '* Farmaco interagente: _______________________________ '+ undFinal + a_capo + vFarmaco + a_capo + a_capo;
			msg += und + '* Interazione possibile: _______________________________ '+ undFinal + a_capo + vInterazione ;
			
			return msg;
		},
		
		setNota:function(){
			
			var nota = '';
			
			if($("#txtDiagnosi").val() != ''){
				nota = $("#txtDiagnosi").val()+'\n\n'+ home.infoCartella.note;
				$("#txtDiagnosi").val(nota);
			}else{
				nota = home.infoCartella.note;
				if(nota!=''){
					$("#txtDiagnosi").val(nota);
				}
			}
		},
		
		setEsenzione: function (cod, descr){
			$("tr[title=" + selectedLine + "] .esenzione input").attr("title", cod + ' - ' + descr).attr( "value", cod + ' - ' + descr).attr("data-value", cod);
		},
		
		context_menu : {
			
			applicaEsenzioni: function(riga){

				var ese = riga.find(".esenzione input").val();
				var codEse = riga.find(".esenzione input").attr("data-value");
				
				$(".esenzione input").each(function() {
					
	
						var _riga = $(this).closest("tr");
						
						//controllo se la riga è riferita ad un presidio o cose del genere o ad un farmaco di classe C (magari la prossima volta controlla se è solo per i farmaci o anche per gli accertamenti, PIRLA!!!!)
						if( !LIB.isValid(_riga.attr("classe_farmaco")) ||
								(_riga.attr("classe_farmaco") == 'C' && ( codEse != 'G02' || codEse != 'G01' ))){
							return;
						}
						_riga.find(".esenzione input").val(ese);
						_riga.find(".esenzione input").attr("data-value", codEse);
					
				});
			}
		}
};

var menuEsenzioni = {
		"menu" : {
			"id" 		: "MENU_RICETTA_ESENZIONI",
			"structure" : {
			"list" 		: [ {
					"concealing" 	: "true",
					"link" 			: function(rec) {SALVATAGGIO_RR.context_menu.applicaEsenzioni($(rec).closest("tr"));},
					"enable" 		: "S",
					"icon_class" 	: "incolla",
					"where" 		: function(rec) {return true;},
					"output" 		: "traduzione.lblApplicaEsenzioni",
					"separator" 	: "false"
				} ]
			},
			"title" 	: "traduzione.lblMenu",
			"status" 	: true
		}
	};

var AC = {
		
		select:function(){
			
		},
		
		choose:function(){
			
		}
};
