var WindowCartella 	= null;
var _V_DATI			= null;
var _TIPO_BILANCIO	= null;	

$(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	NS_BILANCIO.init();
	
});

var NS_BILANCIO = {
				
		init : function() {
			
			_V_DATI			= WindowCartella.getForm();
			
			switch(_STATO_PAGINA) {
				
				case 'I' : 

					_TIPO_BILANCIO	= NS_UTILITY.getUrlParameter('TIPO_BILANCIO');
					$('#hTipoBilancio').val(_TIPO_BILANCIO);
					NS_BILANCIO.Settings.setDataOra();
					NS_BILANCIO.Data.infusioni();
					NS_BILANCIO.Data.valorizzaCampiPV();
					
					if (_TIPO_BILANCIO == 'STANDARD')
						NS_BILANCIO.Settings.setDatepicker();
					else
						NS_BILANCIO.Settings.setDatepickerManuale();
					
					break;
				
				case 'E' :
					
					_TIPO_BILANCIO	= $('#hTipoBilancio').val();
					
					NS_BILANCIO.Settings.setDataOraModifica();
					NS_BILANCIO.Data.infusioni();
					break;
				
				case 'L' : 
					
					_TIPO_BILANCIO	= $('#hTipoBilancio').val();
					
					NS_BILANCIO.Settings.setDataOraModifica();
					NS_BILANCIO.Data.infusioni();
					$("input,textarea").attr("disabled",true); 
					$("a#lblRegistra").parent().hide();
					break;
				
				default: 
			}
			
			NS_BILANCIO.setEvents();

		},
				
		setEvents : function() {
			
			// Check Number Perspiratio
			$('#txtPerspiratio').blur(function(){NS_UTILITY.controllaCampiNumerici('txtPerspiratio', 'Perspiratio');});
			
			// Handler Ora Inizio Riferimento Bilancio + Controlli su Data
			if (_STATO_PAGINA != 'L'){
				$("#txtOraBilancioFine").keyup(function(){
					oraControl_onkeyup(document.getElementById('txtOraBilancioFine'));
				}).blur(function(){
					NS_BILANCIO.Settings.setDataOraManuale();
				});
				NS_UTILITY.controlloData('dteDataBilancioFine');
				NS_UTILITY.controlloData('txtDataBilancioFine');
			}
			
			if (_TIPO_BILANCIO == 'STANDARD'){
				$('#txtDataBilancioFine').closest('TD').remove();
			}else{
				$('#dteDataBilancioFine').closest('TD').remove();
			}
			
			switch(_STATO_PAGINA)
			{
				case 'L' : break;
				default:
					
					$("#lblInfusi").css({"color":"blue","text-decoration":"underline"}).attr("title","Calcola totale infusi").click(function() {
						var totaleInfusi	= 0;

						$("iframe#frameTerapie").contents().find('tr[SOTTOTIPO_SCHEDA!="ENTERALE"]').each(function(){																			   
							_stato	= $(this).attr('STATO_INFUSIONE');
							_infuso	= $(this).find("td[name='infuso']").text();							
							if (_stato == 'I' || _stato == 'E'){
								// alert(_infuso + ' - ' + _stato);
								totaleInfusi+=Number(_infuso.replace(",",".").replace(".",""));
							}
						});
						$("#txtInfusi").val(totaleInfusi);
					});
				
					$("#lblNutrizioneEnterale").css({"color":"blue","text-decoration":"underline"}).attr("title","Calcola Nutrizione Enterale").click(function() {
						var totaleEnterale	= 0;
	
						$("iframe#frameTerapie").contents().find('tr[SOTTOTIPO_SCHEDA="ENTERALE"]').each(function(){																			   
							_stato	= $(this).attr('STATO_INFUSIONE');
							_infuso	= $(this).find("td[name='infuso']").text();							
							if (_stato == 'I' || _stato == 'E'){
								// alert(_infuso + ' - ' + _stato);
								totaleEnterale+=Number(_infuso.replace(",",".").replace(".",""));
							}
						});
						$("#txtNutrizioneEnterale").val(totaleEnterale);
					});
					
					$("label#lblTotaleOut").css({"color":"blue","text-decoration":"underline"}).attr("title","Calcola totale uscite").click(function() {
						var totale=
							toNumber($("#txtDiuresi").val().replace(",","."))+
							toNumber($("#txtFeci").val().replace(",","."))+
							toNumber($("#txtAspirazione").val().replace(",","."))+
							toNumber($("#txtEmodialisi").val().replace(",","."))+
							toNumber($("#txtDrenaggi").val().replace(",","."))+
							toNumber($("#txtVomito").val().replace(",",".")) +
							toNumber($("#txtPerspiratio").val().replace(",","."));
						$("#txtTotaleOut").val( Math.round(totale*100)/100);
						NS_BILANCIO.calcolaBilancio();
					});
					
					$("label#lblTotaleIn").css({"color":"blue","text-decoration":"underline"}).attr("title","Calcola totale entrate").click(function() {
						var totale=
							toNumber($("#txtInfusi").val().replace(",","."))+
							toNumber($("#txtBevande").val().replace(",","."))+ 
							toNumber($("#txtNutrizioneEnterale").val().replace(",","."))+
							toNumber($("#txtLiquidiFuoriReparto").val().replace(",","."))+
							toNumber($("#txtSangue").val().replace(",","."));
						$("#txtTotaleIn").val( Math.round(totale*100)/100);
						NS_BILANCIO.calcolaBilancio();
					});
					
					$("input[name=txtTotaleIn],input[name=txtTotaleOut]").blur(NS_BILANCIO.calcolaBilancio);
					function toNumber(txt) {
						return isNaN(Number(txt.replace(",",".")))? 0 : Number(txt.replace(",","."));
					}
			}
		},
		
		registraScheda : function() {
			var infusi = $("iframe#frameTerapie")[0].contentWindow.NS_TERAPIE_BILANCIO.createObjectInfusi();
			$("#hInfusi").val(infusi);
			$('#hTipoBilancio').val(_TIPO_BILANCIO);
			
			registra();
		},
		
		chiudiScheda : function() {
            parent.$.fancybox.close();
		},
		
		aggiornaOpener : function() {
			
			var frameWk = $("iframe#WkBilancio",parent.document);
			frameWk.attr("src",frameWk.attr("src"));		 
			NS_BILANCIO.chiudiScheda();

			
		},
		
		calcolaBilancio : function() {
			$('input[name=txtTotaleBilancio]').val( Math.round(($('#txtTotaleIn').val().replace(",",".")	- $('#txtTotaleOut').val().replace(",","."))*100)/100);
		},
		
		Settings	: {
			
			oraRiferimento			: '',
			dataRiferimento			: '',
			dataOraRiferimento 		: '',
			
			oraRiferimentoFine		: '',
			dataRiferimentoFine		: '',
			dataOraRiferimentoFine 	: '',

			setDataOraModifica		: function(pData){
				
				$('#txtOraBilancio').text($('#hOraBilancio').val())
				$('#dteDataBilancioFine').text(WindowCartella.clsDate.str2str($('#hDataBilancioFine').val(),'YYYYMMDD','DD/MM/YYYY'));
				
				if (_TIPO_BILANCIO == 'STANDARD'){
					
					$('#lblTxtOraBilancioFine').text($('#hOraBilancioFine').val());
					$('#txtOraBilancioFine').closest('TD').remove();
					
					this.dataRiferimento	= $('#hDataBilancio').val();		
					this.oraRiferimento		= $('#txtOraBilancio').text();					
					this.dataOraRiferimento = this.dataRiferimento + this.oraRiferimento;
					
					this.dataRiferimentoFine	= $('#hDataBilancioFine').val();		
					this.oraRiferimentoFine		= $('#txtOraBilancio').text();					
					this.dataOraRiferimentoFine = this.dataRiferimentoFine + this.oraRiferimentoFine;
					
				}else{
					
					$('#txtOraBilancioFine').val($('#hOraBilancioFine').val())/*.attr("disabled",true)*/;
					$('#lblTxtOraBilancioFine').closest('TD').remove();
					
					this.dataRiferimento	= $('#hDataBilancio').val();		
					this.oraRiferimento		= $('#txtOraBilancio').text();					
					this.dataOraRiferimento = this.dataRiferimento + this.oraRiferimento;
					
					this.dataRiferimentoFine	= $('#hDataBilancioFine').val();		
					this.oraRiferimentoFine		= $('#txtOraBilancioFine').val();					
					this.dataOraRiferimentoFine = this.dataRiferimentoFine + this.oraRiferimentoFine;
					
				}
				
			},
			
			setDataOra		: function(pData){								

				/*
				 * La data Di Riferimento è Quella di Partenza del bilancio in questione 
				 * Es. Se in Rianimazione Dimettono un PZ Ricoverato il Griorno stesso devono poter compilare il Bilancio per la giornata stessa
				 */

				var data 		= typeof pData == 'undefined' ? new Date() : pData;				
				var dataIni		= new Date();
				var dataFine 	= new Date();
							
				// Disabilito Ora Inizio Bilancio 
				$('#txtOraBilancio').text(WindowCartella.baseReparti.getValue(_V_DATI.reparto,"BILANCIO_IDRICO_ORARIO"));
				
				if (_TIPO_BILANCIO == 'STANDARD'){

					// Data Riferimento Bilancio Stndard = (Data Odierna - 1) 
					data 			= data.getTime()  - (1*24*60*60*1000);
					
					if (typeof pData == 'undefined')
						dataIni.setTime(data);
					else
						dataIni = pData;
					
					data 			= dataIni.getTime() + (1*24*60*60*1000)
					dataFine.setTime(data);

					$('input[name=hDataBilancio]').val(WindowCartella.clsDate.getData(dataIni,'YYYYMMDD'));
					$('input[name=dteDataBilancio]').val(WindowCartella.clsDate.getData(dataIni,'DD/MM/YYYY'));
					$('input[name=hDataBilancioFine]').val(WindowCartella.clsDate.getData(dataFine,'YYYYMMDD'));
					$('[name=dteDataBilancioFine]').text(WindowCartella.clsDate.getData(dataFine,'DD/MM/YYYY'));
				
					// Gestione Ora Fine Riferimento BIlancio
					$('#lblTxtOraBilancioFine').text(WindowCartella.baseReparti.getValue(_V_DATI.reparto,"BILANCIO_IDRICO_ORARIO"));
					$('#txtOraBilancioFine').closest('TD').remove();
					
				}else{
					
					data = data.getTime()  + (1*24*60*60*1000); 			
					dataFine.setTime(data);
					
					$('input[name=hDataBilancio]').val(WindowCartella.clsDate.getData(new Date(),'YYYYMMDD'));
					$('input[name=dteDataBilancio]').val(WindowCartella.clsDate.getData(new Date(),'DD/MM/YYYY'));
					$('input[name=hDataBilancioFine]').val(WindowCartella.clsDate.getData(new Date(),'YYYYMMDD'));
					$('#txtDataBilancioFine').val(WindowCartella.clsDate.getData(new Date(),'DD/MM/YYYY'));
				
					// Gestione Ora Fine Riferimento BIlancio
					$('#txtOraBilancioFine').val(WindowCartella.clsDate.getOra(new Date()))
					$('#lblTxtOraBilancioFine').closest('TD').remove();
				}
				
				/*
					var dataRif = WindowCartella.clsDate.str2str($('#dteDataBilancio').val(),'DD/MM/YYYY','YYYYMMDD');
					dataRif 	= clsDate.str2date(dataRif,'YYYYMMDD');
					dataRif		= new Date(dataRif.getTime());
					dataRif		= clsDate.getData(dataRif,'YYYYMMDD');
				*/
				
				this.dataRiferimento		= $('input[name=hDataBilancio]').val()/*dataRif*/;
				this.dataRiferimentoFine	= $('input[name=hDataBilancioFine]').val();

				$('input#hDataBilancio').val(this.dataRiferimento);
				$('#hOraBilancio').val($('#txtOraBilancio').text());

				if (_TIPO_BILANCIO == 'STANDARD'){
					$('#hOraBilancioFine').val($('#lblTxtOraBilancioFine').text());
				}else{
					$('#hOraBilancioFine').val($('#txtOraBilancioFine').val());
				}
				
				this.oraRiferimento			= $('#hOraBilancio').val();
				this.oraRiferimentoFine		= $('#hOraBilancioFine').val();	
				this.dataOraRiferimento 	= this.dataRiferimento + this.oraRiferimento;
				this.dataOraRiferimentoFine = this.dataRiferimentoFine + this.oraRiferimentoFine;
				
			},
			
			setDataOraManuale : function(){
				
				$('input[name=hDataBilancio]').val(WindowCartella.clsDate.getData(clsDate.str2date(WindowCartella.clsDate.str2str($('#dteDataBilancio').val(),'DD/MM/YYYY','YYYYMMDD'),'YYYYMMDD'),'YYYYMMDD'));
				this.dataRiferimento		= $('input[name=hDataBilancio]').val();
				this.dataOraRiferimento 	= this.dataRiferimento + this.oraRiferimento;
				
				
				$('input[name=hDataBilancioFine]').val(WindowCartella.clsDate.getData(clsDate.str2date(WindowCartella.clsDate.str2str($('#txtDataBilancioFine').val(),'DD/MM/YYYY','YYYYMMDD'),'YYYYMMDD'),'YYYYMMDD'));
				this.dataRiferimentoFine	= $('#hDataBilancioFine').val();		
				this.oraRiferimentoFine		= $('#txtOraBilancioFine').val();			
				this.dataOraRiferimentoFine = this.dataRiferimentoFine + this.oraRiferimentoFine;
				
				$('#hOraBilancioFine').val(this.oraRiferimentoFine);
				NS_BILANCIO.Settings.resetDinamicInput();
				NS_BILANCIO.Data.infusioni();
				NS_BILANCIO.Data.valorizzaCampiPV();
				
			},
			setDatepicker : function(){
				
				$('#dteDataBilancio').focus(function(){$(this).blur();}).datepick({
					onClose: function(){ 
						NS_BILANCIO.Settings.setDataOra(clsDate.str2date(WindowCartella.clsDate.str2str($('#dteDataBilancio').val(),'DD/MM/YYYY','YYYYMMDD'),'YYYYMMDD'));
						NS_BILANCIO.Settings.resetDinamicInput();							
						NS_BILANCIO.Data.infusioni();
						NS_BILANCIO.Data.valorizzaCampiPV();
					},
					showOnFocus: false,  
					showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
				});
			
			},
			
			setDatepickerManuale : function(){
				
				$('#dteDataBilancio,#txtDataBilancioFine').focus(function(){$(this).blur();}).datepick({
					onClose: function(){ 
						NS_BILANCIO.Settings.setDataOraManuale();
					},
					showOnFocus: false,  
					showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
				});
			
			},
			
			resetDinamicInput : function(){
			
				$('#groupBilancio input').val('');
				$('#groupBilancio TEXTAREA').html('');

			}
		},
		
		Data 	: {
			
			getValuePVBilancio	: function(pFile, pStatement, pBinds, pNReturnValue){
					
				var vResp	= WindowCartella.executeStatement(pFile,pStatement,pBinds,pNReturnValue);
				// alert(pBinds + '\n' + vResp);
				if(vResp[0]=='KO')
					return alert('getValueParametroVBilancio: \n' + vResp[1]);
				else
					return vResp[2] == null ? '' : vResp[2];
						
				
			},
			
			valorizzaCampiPV : function(){
			
				NS_BILANCIO.Data.drenaggi();
				NS_BILANCIO.Data.diuresi();		
				NS_BILANCIO.Data.bevande();
				NS_BILANCIO.Data.ristagnoGastrico();
				NS_BILANCIO.Data.feci();
				NS_BILANCIO.Data.liquidiFuoriReparto();
			},

			infusioni : function() {
				
				var url = "servletGeneric?class=cartellaclinica.pianoGiornaliero.bilancioIdrico" + "&IDEN_VISITA="+ _V_DATI.iden_ricovero + "&DATA_INI=" + NS_BILANCIO.Settings.dataOraRiferimento+ "&DATA_FINE=" + NS_BILANCIO.Settings.dataOraRiferimentoFine;
				$("iframe#frameTerapie").attr("src",url);
				
			},
			
			drenaggi : function(){
				$('#txtDrenaggi').val( NS_BILANCIO.Data.getValuePVBilancio("parametri.xml","getSumParametro",[_V_DATI.iden_ricovero,NS_BILANCIO.Settings.dataOraRiferimento, NS_BILANCIO.Settings.dataOraRiferimentoFine,'DRENAGGI'],1));
			},			
			
			diuresi : function(){				
				$('#txtDiuresi').val( NS_BILANCIO.Data.getValuePVBilancio("parametri.xml","getSumParametro",[_V_DATI.iden_ricovero,NS_BILANCIO.Settings.dataOraRiferimento,NS_BILANCIO.Settings.dataOraRiferimentoFine,'DIURESI'],1));			
			},
			
			bevande : function(){				
				$('#txtBevande').val( NS_BILANCIO.Data.getValuePVBilancio("parametri.xml","getSumParametro",[_V_DATI.iden_ricovero,NS_BILANCIO.Settings.dataOraRiferimento,NS_BILANCIO.Settings.dataOraRiferimentoFine,'BEVANDA'],1));			
			},
			
			ristagnoGastrico : function(){
				$('#txtAspirazione').val( NS_BILANCIO.Data.getValuePVBilancio("parametri.xml","getSumParametro",[_V_DATI.iden_ricovero,NS_BILANCIO.Settings.dataOraRiferimento,NS_BILANCIO.Settings.dataOraRiferimentoFine,'RG'],1));			
			},
			
			feci : function(){
				$('#txtFeci').val( NS_BILANCIO.Data.getValuePVBilancio("parametri.xml","getSumParametro",[_V_DATI.iden_ricovero,NS_BILANCIO.Settings.dataOraRiferimento,NS_BILANCIO.Settings.dataOraRiferimentoFine,'FECI'],1));
			},
			
			liquidiFuoriReparto : function(){
				$('#txtLiquidiFuoriReparto').val( NS_BILANCIO.Data.getValuePVBilancio("parametri.xml","getSumParametro",[_V_DATI.iden_ricovero,NS_BILANCIO.Settings.dataOraRiferimento,NS_BILANCIO.Settings.dataOraRiferimentoFine,'LIQUIDI_FUORI_REPARTO'],1));
			}
		}
};

var NS_UTILITY = {
	
	getUrlParameter : function(name){

		var tmpURL = document.location.href;
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( tmpURL );
		
		if( results == null )
			return "";
		else
			return results[1];
	},
	
	controllaCampiNumerici : function(idCampo, label){

		var value = $('#'+idCampo).val().replace (',','.');
		
		if (isNaN(value)){
			alert ('il valore immesso in '+' " ' + label + ' " '+' non è un numero. Il campo richiede un valore numerico');
			$('#' + idCampo).val($(this).val().replace(',','.'));
			$('#' + idCampo).focus();
			return;		
		}
		
	},
	
	controlloData : function(id){
		
		try {
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById(id));
		}catch(e){
			alert('Applicazione maschera data in errore: '+ e.description);
		}
		
	}
};

