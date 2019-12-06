
	jQuery(document).ready(function() {
			
		var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT_DIREZIONE&ILLUMINA=javascript:illumina_multiplo_generica(this.sectionRowIndex);";

		WK_DIREZIONE.caricamento();
		WK_DIREZIONE.setEvents();
		
		//alert(document.getElementById('oIFWk').src);
		//document.getElementById('oIFWk').src = url;
		applica_filtro(url);
		
	//	ricercaRemota();
		
		setVeloNero('oIFWk');

	});


	var WK_DIREZIONE = {
			
		caricamento : function(){
			
			jQuery("#lblReparti, #txtReparti").parent().hide(100);
			//$('body').css('overflow','hidden');
			
			WK_DIREZIONE.cambioFiltro();
			
			//da vedere. Popolamento automatico delle date
			document.dati.txtDaData.value = WK_DIREZIONE.getData(clsDate.dateAdd(new Date(),'Y',-1),'DD/MM/YYYY');
			document.dati.txtAData.value = WK_DIREZIONE.getData(new Date(),'DD/MM/YYYY');
			
			//allargo i campi di testo dove serve
			jQuery("input#inValMedico").attr("style","width=300px");
			jQuery("input#txtFarmaco").attr("style","width=300px");
			jQuery("input#txtNomePaziente").attr("style","width=300px");
			jQuery("input#txtCognPaziente").attr("style","width=300px");
			jQuery("input#txtCodFisc").attr("style","width=300px");
		},
		
		getData : function(pDate,format){
			
			var anno = pDate.getFullYear();	
			var mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
			var giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
			
			var data = giorno + '/' + mese + '/' + anno;
			
			switch(format){
				case 'YYYYMMDD':	
					return anno + mese + giorno;
				case 'DD/MM/YYYY':	
					return data;		
			}
		},
		
		setEvents : function(){
			
			//popolo il campo nascosto per il filtro della wk
			document.getElementById('cmbStruttura').onchange = function(){
				document.getElementById('hStruttura').value = "'" + document.getElementById('cmbStruttura').value + "'";	
				if (document.getElementById('hStruttura').value  == "''"){
					document.getElementById('hStruttura').value='';
				}
			};
			
			//aggiungo l'evento onchange al combo della struttura
			document.getElementById('cmbStruttura').onchange=function(){
				WK_DIREZIONE.cambioFiltro();
				WK_DIREZIONE.cmbOnChange();
			};
			
			//evento di aggiornamento sul tasto invio
			jQuery("body").keyup(function(){
				if(event.keyCode == '13'){
					
					if (jQuery("#txtFarmaco").val() == ''){ jQuery("#hCodPrAtt").val(""); }
					if (jQuery("#inValMedico ").val()== ''){ jQuery("#hMed").val(""); }
					
					setVeloNero('oIFWk');
					applica_filtro();
				}
			});
			
			jQuery("#txtFarmaco").blur(function(){
				if (jQuery("#txtFarmaco").val() == ''){
					jQuery("#hCodPrAtt").val("");
				}
			});
			
			jQuery("#inValMedico ").blur(function(){
				
				if (jQuery("#inValMedico ").val()== ''){ 
					jQuery("#hMed").val("");
				}
			});
			
			$('#txtCognPaziente').bind('keyup', function(){
				$('#txtCognPaziente').val($('#txtCognPaziente').val().toUpperCase());
			});
			
			$('#txtNomePaziente').bind('keyup', function(){
				$('#txtNomePaziente').val($('#txtNomePaziente').val().toUpperCase());
			});
			$('#txtCodFisc').bind('keyup', function(){
				$('#txtCodFisc').val($('#txtCodFisc').val().toUpperCase());
			});
			
			//click per il debug dei filtri
			jQuery("#lblStruttura").click(function(e){
				
				if (baseUser.LOGIN == 'lucas'){
					
					var debug='DEBUG solo per utente lucas:\n';
					debug += '\n hStruttura: '+document.getElementById("hStruttura").value;
					debug += '\n hCodPrAtt: '+jQuery("#hCodPrAtt").val();
					debug += '\n hMed: '+jQuery("#hMed").val();
					debug += '\n hReparti: '+jQuery("#hReparti").val();
					debug += '\n txtDaData: '+jQuery("#txtDaData").val();
					debug += '\n txtAData : '+jQuery("#txtAData ").val();
					debug += '\nSRC oIFWk: '+document.getElementById('oIFWk').src;
					
					alert(debug);
				}
			});
		},

		cambioFiltro : function (){
			if (document.getElementById('cmbStruttura').value != ''){

				document.getElementById('lblRepartiOnly').parentElement.style.display='none';
				document.getElementById('lblReparti').parentElement.style.display='block';
				document.getElementById('txtRepartiOnly').parentElement.style.display='none';
				document.getElementById('txtReparti').parentElement.style.display='block';
				document.getElementById('hStruttura').value = '';
				document.getElementById('hReparti').value = '';
				document.getElementById('hRepartiOnly').value = '';
				document.getElementById('txtRepartiOnly').innerHTML='';
			}else{
				document.getElementById('lblRepartiOnly').parentElement.style.display='block';
				document.getElementById('lblReparti').parentElement.style.display='none';
				document.getElementById('txtRepartiOnly').parentElement.style.display='block';
				document.getElementById('txtReparti').parentElement.style.display='none';
				document.getElementById('hStruttura').value = '';
				document.getElementById('hRepartiOnly').value = '';
				document.getElementById('txtRepartiOnly').innerHTML='';
			}
		},
		
		cmbOnChange : function(){
			
			if (document.getElementById('cmbStruttura').value != ''){
				
				document.getElementById('hStruttura').value =  "'" + document.getElementById('cmbStruttura').value + "'";
				document.getElementById('hReparti').value = '';
				document.getElementById('hWhereCond').value = document.getElementById('cmbStruttura').value;
				document.getElementById('txtReparti').innerText = '';
				
			}else{
			
				document.getElementById('hReparti').value = '';
				document.getElementById('hStruttura').value = '';
				
			}
		},
		ricercaRemota: function(){
		var pCampi = new Array();
		var pValori = new Array();
		
		pCampi.push('daData');
		pValori.push($('input[name=txtDaData]').val().substr(6,4)+$('input[name=txtDaData]').val().substr(3,2)+$('input[name=txtDaData]').val().substr(0,2));
		pCampi.push('aData');
		pValori.push($('input[name=txtAData]').val().substr(6,4)+$('input[name=txtAData]').val().substr(3,2)+$('input[name=txtAData]').val().substr(0,2));
		
		if ($('#inValMedico'.val()!='')){
		pCampi.push('medicoPrescr');
		pValori.push($('input[name=hCodFiscPrescr]').val());	
		}
			
			
			
		},
		
		cancellaMetadati : function(){
			
			dwr.engine.setAsync(false);
			dwrPianiTerapeutici.cancellaMetadati(); 
			dwr.engine.setAsync(true);
		}
	};

