/**
 * @author Linob: Nuova gestione per la servlet caricata dal configuratore per
 *         la gestione del pc.
 */

jQuery(document).ready(function() 
{
	window.WindowCartella = window.opener.top;
	// Queste istruzioni vengono eseguite solo dalla nuova pagina creata con il
	// configuratore
	NS_GESTIONE_PC.init();
	NS_GESTIONE_PC.caricaDati();
	NS_GESTIONE_PC.setEvents();

});

var NS_GESTIONE_PC  = {
	stampantiEtichette:'',
	stampantiReferti:'',
	stampantiRicette:'',
	stampantiRicetteBianca:'',
	stampantiRicetteDema:'',
	checkPostazione:'',
	init:function(){
		setVeloNero('body')
	},
	

	caricaDati:function(checkAttivaApplet){
		var rs = null;
		var operazione = $('form[name=EXTERN] input[name=OPERAZIONE]').val();
	
		// Carica Dati PC
		var pBinds = new Array();
		pBinds.push($('form[name=EXTERN] input[name=CODICE]').val());

		rs = WindowCartella.executeQuery("gestione_pc.xml","info",pBinds);
		if(rs.next()){
			$('#txtNomeComputer').val(rs.getString('nome_host'));
			NS_GESTIONE_PC.checkPostazione = WindowCartella.basePC.NOME_HOST == rs.getString('nome_host') && WindowCartella.basePC.IP == rs.getString('ip');

			$('#txtIndirizzoIp').val(rs.getString('ip'));
			$('#txtUrlVe').val(rs.getString('url_ve'));
			$('input[name=chkAbilitaStampante]').attr('checked', rs.getString('scelta_stampante').toUpperCase() == 'S');	
			$('input[name=chkGestioneFirmaDigitale]').attr('checked', rs.getString('abilita_firma_digitale').toUpperCase() == 'S');
			$('select[name=cmbIdenAetitle]').val(rs.getString('IDEN_AETITLE_VE'));
			
			/*carico l'oggetto stampanti con quello salvato sul db*/
			NS_GESTIONE_PC.stampantiEtichette = new objStampanti(
												rs.getString('PRINTERNAME_ETI_CLIENT'),
												rs.getString('CONFIGURAZIONE_APPLET_ETI'),
												rs.getString('APPLET_ETICHETTE'));

			NS_GESTIONE_PC.stampantiReferti = new objStampanti(
												rs.getString('PRINTERNAME_REF_CLIENT'),
												rs.getString('CONFIGURAZIONE_APPLET_REF'),
												rs.getString('APPLET_REFERTI'));
			
			NS_GESTIONE_PC.stampantiRicette = new objStampanti(
												rs.getString('PRINTERNAME_RICETTA_ROSSA'),
												rs.getString('CONFIGURAZIONE_APPLET_RICETTA'),									
												rs.getString('APPLET_RICETTA_ROSSA'));			

			NS_GESTIONE_PC.stampantiRicetteBianca = new objStampanti(
												rs.getString('PRINTERNAME_RICETTA_BIANCA'),
												rs.getString('CONFIGURAZIONE_APPLET_BIANCA'),									
												rs.getString('APPLET_RICETTA_BIANCA'));	
		
			NS_GESTIONE_PC.stampantiRicetteDema  = new objStampanti(
												rs.getString('PRINTERNAME_RICETTA_DEMA'),
												rs.getString('CONFIGURAZIONE_APPLET_DEMA'),									
												rs.getString('APPLET_RICETTA_DEMA'));
			
//				Stampante Referti la carico solo con activex			
			NS_GESTIONE_PC.caricaComboStampanteFromActiveX($('select[name=cmbStampanteReferti]'),this.stampantiReferti.getStampante());
			if (typeof (checkAttivaApplet)=='undefined' ){
				$('input[name=chkAbilitaStampaApplet]').attr('checked',rs.getString('uso_applet_stampa').toUpperCase()=='S');
				var flag = $('#chkAbilitaStampaApplet').is(':checked');
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteEtichette]'), this.stampantiEtichette, flag);
//					Stampante Referti caricata con activex, quindi la lascio commentata					
//					NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteReferti]'), stampantiReferti, flag);
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteRicette]'), this.stampantiRicette, flag);
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteRicettaBianca]'), this.stampantiRicetteBianca, flag);
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteRicettaDema]'), this.stampantiRicetteDema, flag);
			}else{
				var flag = $('#chkAbilitaStampaApplet').is(':checked'); 
				$('input[name=chkAbilitaStampaApplet]').attr('checked',checkAttivaApplet);
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteEtichette]'), this.stampantiEtichette, flag);
//					Stampante Referti caricata con activex, quindi la lascio commentata
//					NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteReferti]'), stampantiReferti, flag);
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteRicette]'), this.stampantiRicette, flag);
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteRicettaBianca]'), this.stampantiRicetteBianca, flag);
				NS_GESTIONE_PC.caricaComboStampanti($('select[name=cmbStampanteRicettaDema]'), this.stampantiRicetteDema, flag);
			}

			NS_GESTIONE_PC.caricaComboDirectoryReport(rs.getString('directory_report'));
//				Stampante Etichetta carico la configurazione dell'applet
			NS_GESTIONE_PC.caricaComboConfigurazioneApplet( 'ETICHETTA',
															$('select[name=cmbConfStampanteEtichette]'),
															$('#hConfStampanteEtichette'),
															$('#txtConfStampanteEtichetteL'),
															$('#txtConfStampanteEtichetteR'),
															$('#txtConfStampanteEtichetteT'),
															$('#txtConfStampanteEtichetteB'),
															this.stampantiEtichette);
//				Stampante Ricetta Rossa carico la configurazione dell'applet
			NS_GESTIONE_PC.caricaComboConfigurazioneApplet( 'RICETTA_ROSSA',
															$('select[name=cmbConfStampanteRicette]'),
															$('#hConfStampanteRicette'),
															$('#txtConfStampanteRicetteL'),
															$('#txtConfStampanteRicetteR'),
															$('#txtConfStampanteRicetteT'),
															$('#txtConfStampanteRicetteB'),
															this.stampantiRicette);
//				Stampante Ricetta Bianca carico la configurazione dell'applet
			NS_GESTIONE_PC.caricaComboConfigurazioneApplet( 'RICETTA_BIANCA',
															$('select[name=cmbConfStampanteRicetteBianca]'),
															$('#hConfStampanteRicetteBianca'),
															'',
															'',
															'',
															'',
															this.stampantiRicetteBianca);
			NS_GESTIONE_PC.caricaComboConfigurazioneApplet( 'RICETTA_DEMATERIALIZZATA',
															$('select[name=cmbConfStampanteRicetteDema]'),
															$('#hConfStampanteRicetteDema'),
															'',
															'',
															'',
															'',
															this.stampantiRicetteDema);

		
		}else{
			alert('Nessun PC TROVATO')
		}
		

		removeVeloNero('body')
		
	},
	
	caricaComboStampanti:function(cmb,objstampante,flag){
//		Se flag = false: allora carico le stampanti dall'activex e seleziono quella sul db
		if (!flag){
			NS_GESTIONE_PC.caricaComboStampanteFromActiveX(cmb,objstampante.getStampante());
		}else{
		
//		Controllo Esistenza applet pagina di home
//		Se non esiste, allora, carico la pagina con activex, se invece esiste, allora devo ricaricare tutto per caricare la home
			try {
				if (typeof (WindowCartella.AppStampa)=='undefined'){
					NS_GESTIONE_PC.caricaComboStampanteFromActiveX(cmb,objstampante.getStampante());
				}else{
					NS_GESTIONE_PC.caricaComboStampanteFromApplet(cmb,objstampante.getStampante());
				}
			} catch(e) {
				alert(e.name+'\n'+e.message);
			}
		}
	},
	
	caricaComboStampanteFromActiveX:function(cmb,valueFromDb){
		if(cmb != null)
		{
			var WshNetwork = new ActiveXObject("WScript.Network");
			var oPrinters  = WshNetwork.EnumPrinterConnections();
			
/*Preso spunto dalla funzione carica_combo_printer del file jscript/enumPrinter.js*/			
			for(var i=0; i<oPrinters.Count(); i+=2)
			{		
				var printer_port = oPrinters.Item(i);
				var printer_name = oPrinters.Item(i+1);
				cmb.append(NS_GESTIONE_PC.utilita.creaOption(printer_name,printer_name,valueFromDb));			
			}	
		}
	},
	
	/**
	 * @param  cmb
	 * @param  valueFromDb
	 * @throws SyntaxError
	 */
	caricaComboStampanteFromApplet:function(cmb,valueFromDb){
		var listStampanti = JSON.parse(WindowCartella.AppStampa.getPrinterList());
		cmb.append(NS_GESTIONE_PC.utilita.creaOption('','',valueFromDb));
		for (var i = 0; i < listStampanti.printers.length; i++) {
			if (listStampanti.printers[i].toUpperCase().indexOf('FAX') === -1) {
//				alert(stampanti.printers[i]+'\n'+valueFromDb)
//				alert(stampanti.printers[i]==valueFromDb)
				cmb.append(NS_GESTIONE_PC.utilita.creaOption(listStampanti.printers[i],listStampanti.printers[i],valueFromDb));		
			}
		}
		
	},
	
	caricaComboConfigurazioneApplet:function(tipologia,cmb,hiddeinput,txtLeft,txtRight,txtTop,txtBottom,objstampante){
		hiddeinput.val(objstampante.getConfigurazione())
		cmb.append(NS_GESTIONE_PC.utilita.creaOption('','',objstampante.getTipoConf()));
		for ( var i in NS_GESTIONE_PC.configurazioni[tipologia]) {
			cmb.append(NS_GESTIONE_PC.utilita.creaOption(i,i,objstampante.getTipoConf(),NS_GESTIONE_PC.configurazioni[tipologia][i]));	
		}
		if (tipologia!='RICETTA_BIANCA' && tipologia!='RICETTA_DEMATERIALIZZATA'){
			txtLeft.val(objstampante.getMargin('L'));
			txtRight.val(objstampante.getMargin('R'));
			txtTop.val(objstampante.getMargin('T'));
			txtBottom.val(objstampante.getMargin('B'));								
		}

	},	
	
	caricaComboDirectoryReport:function(valueToCheck){
		$.ajax({
			url: "DirectoryReport", 
	        type: "POST",
	        data: "",     
	        cache: false,
	        dataType:"json",
	         
	        success: function (response) 
	        {
	        
	        		var data = response;
	        		$('select[name=cmbDirectoryReport]').append(NS_GESTIONE_PC.utilita.creaOption('','',valueToCheck));

	        		for(var key in data){
	        			var valore =String(data[key]);
	        			$('select[name=cmbDirectoryReport]').append(NS_GESTIONE_PC.utilita.creaOption(valore,valore,valueToCheck));
	        		}

	        },
	        error:function(response)
	        {
	        	alert('response-errore'+response);
	        }
	    });
		
		
		
	},
	
	setEvents:function(){
		$('.classTabHeaderMiddle label').css('cursor', 'pointer').each(function(){
			var id = $(this).attr('id').replace('lbl', 'group');
			$(this)[0].onclick = function(){ShowHideLayer(id);};
		});
		
//		Disabilito sempre la stampa dei referti
		$('select[name=cmbConfStampanteReferti]').attr('disabled',true);
		
//		Ridimensiono i combo per la scelta delle configurazioni		
		$('select[name=cmbConfStampanteEtichette]').width('300px');	
		$('select[name=cmbConfStampanteRicette]').width('300px');		
		
		//Disabilito i campi della stampante, se il pc non è quello in uso
		if (!NS_GESTIONE_PC.checkPostazione) {
			$('select[name=cmbStampanteEtichette]').attr('disabled',true);
			$('select[name=cmbConfStampanteEtichette]').attr('disabled',true);
			$('select[name=cmbStampanteReferti]').attr('disabled',true);
			$('select[name=cmbConfStampanteReferti]').attr('disabled',true);
			$('select[name=cmbStampanteRicette]').attr('disabled',true);
			$('select[name=cmbConfStampanteRicette]').attr('disabled',true);
			$('select[name=cmbStampanteRicettaBianca]').attr('disabled',true);
			$('select[name=cmbConfStampanteRicetteBianca]').attr('disabled',true);
			$('select[name=cmbStampanteRicettaDema]').attr('disabled',true);
			$('select[name=cmbConfStampanteRicetteDema]').attr('disabled',true);
			$('#txtConfStampanteRicetteL').attr('disabled',true);
			$('#txtConfStampanteRicetteR').attr('disabled',true);
			$('#txtConfStampanteRicetteT').attr('disabled',true);
			$('#txtConfStampanteRicetteB').attr('disabled',true);
			$('#txtConfStampanteEtichetteL').attr('disabled',true);
			$('#txtConfStampanteEtichetteR').attr('disabled',true);
			$('#txtConfStampanteEtichetteT').attr('disabled',true);
			$('#txtConfStampanteEtichetteB').attr('disabled',true);			
			$("input[name=chkAbilitaStampaApplet]").attr('disabled',true);
		}else{
			$('select[name=cmbConfStampanteEtichette]').change(function() {
				$('select[name=cmbConfStampanteEtichette] option:selected').each(function() {
					$('#hConfStampanteEtichette').val($(this).attr('configurazione'));
					NS_GESTIONE_PC.stampantiEtichette = '';
					NS_GESTIONE_PC.stampantiEtichette = new objStampanti(
							$('select[name=cmbStampanteEtichette] option:selected').val(),
							$(this).attr('configurazione'),
							$('select[name=cmbConfStampanteEtichette] option:selected').val());
					$('#txtConfStampanteEtichetteL').val(NS_GESTIONE_PC.stampantiEtichette.getMargin('L'));
					$('#txtConfStampanteEtichetteR').val(NS_GESTIONE_PC.stampantiEtichette.getMargin('R'));
					$('#txtConfStampanteEtichetteT').val(NS_GESTIONE_PC.stampantiEtichette.getMargin('T'));
					$('#txtConfStampanteEtichetteB').val(NS_GESTIONE_PC.stampantiEtichette.getMargin('B'));					
									
				});
			});
	
			$('select[name=cmbConfStampanteRicette]').change(function() {
				$('select[name=cmbConfStampanteRicette] option:selected').each(function() {
					$('#hConfStampanteRicette').val($(this).attr('configurazione'));
					NS_GESTIONE_PC.stampantiRicette = '';
					NS_GESTIONE_PC.stampantiRicette = new objStampanti(
							$('select[name=cmbStampanteRicette] option:selected').val(),
							$(this).attr('configurazione'),
							$('select[name=cmbConfStampanteRicette] option:selected').val());
					
					
					$('#txtConfStampanteRicetteL').val(NS_GESTIONE_PC.stampantiRicette.getMargin('L'));
					$('#txtConfStampanteRicetteR').val(NS_GESTIONE_PC.stampantiRicette.getMargin('R'));
					$('#txtConfStampanteRicetteT').val(NS_GESTIONE_PC.stampantiRicette.getMargin('T'));
					$('#txtConfStampanteRicetteB').val(NS_GESTIONE_PC.stampantiRicette.getMargin('B'));	
					
				});
			});
			$('select[name=cmbConfStampanteRicetteBianca]').change(function() {
				$('select[name=cmbConfStampanteRicetteBianca] option:selected').each(function() {
					$('#hConfStampanteRicetteBianca').val($(this).attr('configurazione'));
					NS_GESTIONE_PC.stampantiRicetteBianca = '';
					NS_GESTIONE_PC.stampantiRicetteBianca = new objStampanti(
							$('select[name=cmbStampanteRicettaBianca] option:selected').val(),
							$(this).attr('configurazione'),
							$('select[name=cmbConfStampanteRicetteBianca] option:selected').val());

					
				});
			});			

			$('select[name=cmbConfStampanteRicetteDema]').change(function() {
				$('select[name=cmbConfStampanteRicetteDema] option:selected').each(function() {
					$('#hConfStampanteRicetteDema').val($(this).attr('configurazione'));
					NS_GESTIONE_PC.stampantiRicetteDema = '';
					NS_GESTIONE_PC.stampantiRicetteDema = new objStampanti(
							$('select[name=cmbStampanteRicettaDema] option:selected').val(),
							$(this).attr('configurazione'),
							$('select[name=cmbConfStampanteRicetteDema] option:selected').val());

					
				});
			});	
			
			$('select[name=cmbConfStampanteEtichette]').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('select[name=cmbConfStampanteReferti]').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('select[name=cmbConfStampanteRicette]').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('select[name=cmbConfStampanteRicetteBianca]').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('select[name=cmbConfStampanteRicetteDema]').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteEtichette').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteReferti').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteRicette').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteRicetteL').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteRicetteR').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteRicetteT').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteRicetteB').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteEtichetteL').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteEtichetteR').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteEtichetteT').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			$('#txtConfStampanteEtichetteB').attr('disabled',!$("input[name=chkAbilitaStampaApplet]").is(':checked'));
			
			$("input[name=chkAbilitaStampaApplet]").change(function() {
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbStampanteEtichette] option'));
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbStampanteReferti] option'));
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbStampanteRicette] option'));
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbStampanteRicettaBianca] option'));
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbConfStampanteEtichette] option'));
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbConfStampanteReferti] option'));
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbConfStampanteRicette] option'));				
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbConfStampanteRicetteBianca] option'));						
				NS_GESTIONE_PC.utilita.rimuoviOption($('select[name=cmbConfStampanteRicetteDema] option'));
				if( $(this).is(':checked') ) {
					setVeloNero('body');
					if (typeof(WindowCartella.AppStampa)=='undefined'){
						WindowCartella.NS_LOAD_APPLET_PRINT.init();	
						NS_GESTIONE_PC.performAppletCode(10)
					}else{
				    	NS_GESTIONE_PC.caricaDati(true);
						NS_GESTIONE_PC.setEvents();							
					}
				}else{
					setVeloNero('body');
					NS_GESTIONE_PC.caricaDati(false);
					NS_GESTIONE_PC.setEvents();						
				}
			});
		
	
		
		}
	},

	
	performAppletCode:function(count) {
	    var applet = WindowCartella.AppStampa;
	    if (typeof(applet)=='undefined' && count > 0) {
	       setTimeout( function() { NS_GESTIONE_PC.performAppletCode( --count ); }, 2000 );
	    }
	    else if (typeof (applet)!='undefined') {
	       // use the applet for something
	    	NS_GESTIONE_PC.caricaDati(true);
			NS_GESTIONE_PC.setEvents();
	    }
	    else {
	       alert( 'applet failed to load' );
	    }
	},  
	
	utilita:{
		creaOption:function(value,text,val,attr){
			var tmpValue = typeof (value)=='undefined'||value==''?value:value.replace(/\s+/g,"") ;
			var tmpVal = typeof (val)=='undefined'?value:val.replace(/\s+/g, "");
			var option = $('<option/>', {
			    'value': value,
			    'selected': tmpValue == tmpVal?'selected':'',
			    'configurazione':typeof (attr)=='undefined'?'':attr
			});
			option[0].innerHTML = text;
			return option;
		},
		
		rimuoviOption:function(cmb){
			cmb.each(function(){
				$(this).remove();
			})
		}
	},
	
	configurazioni:{
		// Configurazione Stampa A4,usando le predefinite del pc
		REFERTI:{
			STAMPANTE_DEFAULT : '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}'
		},
		// Configurazione Stampa A4,usando le predefinite del pc
		RICETTA_BIANCA:{
			STAMPANTE_A4 				: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_A5_ORIZZONTALE 	: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,148.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_A5_ORIZZONTALE_SAMSUNG 	: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[2]},{"setPageMargins":[[148.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_A5_VERTICALE 	 	: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[148.0,210.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}'
		},

		// Configurazione Stampa Ricetta Dematerializzata,usando le predefinite del pc
		RICETTA_DEMATERIALIZZATA:{
			STAMPANTE_A4 				: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_A5_ORIZZONTALE 	: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,148.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_A5_ORIZZONTALE_1 	: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.5,0.0,0.5,148.0],4]}]}',
			STAMPANTE_A5_ORIZZONTALE_2 	: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[210.0,148.5,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_A5_VERTICALE 	 	: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setPageScale":[1]},{"setCustomPageDimension":[148.0,210.0,4]},{"setOrientation":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}'
		},		
		// Configurazione Stampa Ricetta
		RICETTA_ROSSA : {
			//Configurazione Ricetta Rossa Verticale
			ORIENTAMENTO_VERTICALE:'{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[2]},{"setPageScale":[1]},{"setPageMargins":[[56.0,26.5,0.0,77.0],4]}]}',
			//Configurazione Ricetta Rossa Orizzontale
			ORIENTAMENTO_ORIZZONTALE: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,12.0,150.0],4]}]}'	
			
		},
		//Configurazione Stampa Etichetta
		ETICHETTA : {
			ETICHETTA_VITRO:'{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[50.0,30.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.1,0.1,0.1,0.1],4]}]}'
		} 	
				
	},
	
	salva:function(){
		NS_GESTIONE_PC.stampantiRicette.setMargin('L',$('#txtConfStampanteRicetteL').val());
		NS_GESTIONE_PC.stampantiRicette.setMargin('R',$('#txtConfStampanteRicetteR').val());
		NS_GESTIONE_PC.stampantiRicette.setMargin('T',$('#txtConfStampanteRicetteT').val());
		NS_GESTIONE_PC.stampantiRicette.setMargin('B',$('#txtConfStampanteRicetteB').val());			
		
		$('#hConfStampanteRicette').val(NS_GESTIONE_PC.stampantiRicette.creaConfStampante());
		
		NS_GESTIONE_PC.stampantiEtichette.setMargin('L',$('#txtConfStampanteEtichetteL').val());
		NS_GESTIONE_PC.stampantiEtichette.setMargin('R',$('#txtConfStampanteEtichetteR').val());
		NS_GESTIONE_PC.stampantiEtichette.setMargin('T',$('#txtConfStampanteEtichetteT').val());
		NS_GESTIONE_PC.stampantiEtichette.setMargin('B',$('#txtConfStampanteEtichetteB').val());	
			
		$('#hConfStampanteEtichette').val(NS_GESTIONE_PC.stampantiEtichette.creaConfStampante());				

		$('#hConfStampanteRicetteBianca').val(NS_GESTIONE_PC.stampantiRicetteBianca.getConfigurazione());

		$('#hConfStampanteRicetteDema').val(NS_GESTIONE_PC.stampantiRicetteDema.getConfigurazione());
		
		registra();
	},
	
	
	
	setSessionValue:function(){
		alert('Per rendere effettive le modifiche riloggarsi sul sistema.'); 
		/*var parameters = {
		                    "ip": $('#txtIndirizzoIp').val(),
		                    "nome_host":$('#txtNomeComputer').val()
		                    };
		 
		 var str = JSON.stringify(parameters);
		
		$.ajax({
			url: "RicaricaPC?", 
	        type: "POST",
	        data: str,     
	        cache: false,
	        dataType:"json",
	         
	        success: function (response) 
	        {
	        
        		var data = response;
        		alert(data.success+'\n'+typeof data.success)
        		if (data.success=='OK'){

        			opener.parent.Ricerca.put_last_value($('#txtIndirizzoIp').val());
        			self.close();
        			
        			
        		}else{
        			alert('Errore nella response')
        		}
	        },
	        error:function(response)
	        {
	        	alert('Server not response');
	        }
	    });*/
	},
	
	close:function(){
		self.close();
	}

};




var objStampanti = function(stampante,conf,tipoConf) { 
	this._stampante 			= stampante;
	this._configurazione		= conf;
	this._tipoconf	 			= tipoConf;
	this.setParam(conf);
}

objStampanti.prototype = {
	
	getStampante: function(){
		return this._stampante;
	},
	
	getConfigurazione :function(){
		return this._configurazione;
	},
	
	getTipoConf:function(){
		return this._tipoconf;
	},

	setParam:function(conf){
		if (conf==''){
			this._pageWidth = '';
			this._pageHeight = '';
			this._pageOrientation = '';
			this._marginLeft = '';
			this._marginTop = '';
			this._marginRight = '';
			this._marginBottom = '';			
		}else{
			var rx = new RegExp(
					'.*setCustomPageDimension":\\[([^,]+),([^,]+)'
					+'.*setOrientation":\\[([^\\]]+)'
					+'.*setPageMargins":\\[\\[([^,]+),([^,]+),([^,]+),([^\\]]+)'
					+'.*'
					,'');
			var array_rx = rx.exec(conf);
			if (array_rx && array_rx.length>0){
				this._pageWidth = array_rx[1];
				this._pageHeight = array_rx[2];
				this._pageOrientation = array_rx[3];
				this._marginLeft = array_rx[4];
				this._marginTop = array_rx[5];
				this._marginRight = array_rx[6];
				this._marginBottom = array_rx[7];				
			}
		}
	},
	
	getPageWidth:function(){
		return this._pageWidth;
	},

	getPageHeight:function(){
		return this._pageHeight;
	},
	
	getPageOrientation:function(){
		return this._pageOrientation;
	},
	
	getMargin:function(param){
		switch(param){
			case 'L': return this._marginLeft;break;	
			case 'R': return this._marginRight;break;
			case 'T': return this._marginTop;break;
			case 'B': return this._marginBottom;break;
			default: return '';
		}
	},

	setMargin:function(param,value){
		switch(param){
			case 'L': return this._marginLeft=value;break;	
			case 'R': return this._marginRight=value;break;
			case 'T': return this._marginTop=value;break;
			case 'B': return this._marginBottom=value;break;
			default: return '';
		}
	},	
	
	creaConfStampante:function(){
		var pageWidth = this.checkAttribute(this.getPageWidth(), '210.0', this.checkDouble);
		var pageHeight = this.checkAttribute(this.getPageHeight(), '297.0', this.checkDouble);
		var pageOrientation = this.checkAttribute(this.getPageOrientation(),'1', this.checkOrientation);
		var marginLeft = this.checkAttribute(this.getMargin('L'), '0.0', this.checkDouble);
		var marginTop = this.checkAttribute(this.getMargin('T'), '0.0', this.checkDouble);
		var marginRight = this.checkAttribute(this.getMargin('R'), '0.0', this.checkDouble);
		var marginBottom = this.checkAttribute(this.getMargin('B'), '0.0', this.checkDouble);
		
		var output = '{"methods":['
			+ '{"autoRotateandCenter":[false]}'
			+ ','
			+ '{"setPageSize":[8]}'
			+ ','
			+ '{"setCustomPageDimension":[' + pageWidth + ',' + pageHeight + ',4]}'
			+ ','
			+ '{"setOrientation":[' + pageOrientation +']}'
			+ ',{"setPageScale":[1]}'
			+ ',{"setPageMargins":[[' + marginLeft + ',' + marginTop + ',' + marginRight + ',' + marginBottom + '],4]}'
			+ ']}';
		return output;
	},
	
	checkDouble: function(str_double) {
		var output = "" + str_double;
		output = output.replace(",", ".");
		if (output.indexOf(".") < 0) {
			output += ".0";
		}
		return output;
	},
	
	checkAttribute: function(attr, predefinito, checker_function) {
		if (typeof (attr)!='undefined' && attr != '') {
			if (typeof (checker_function)!='undefined') {
				return checker_function(attr);
			} else {
				return attr;
			}
		} else {
			return predefinito;
		}
	}
	
};