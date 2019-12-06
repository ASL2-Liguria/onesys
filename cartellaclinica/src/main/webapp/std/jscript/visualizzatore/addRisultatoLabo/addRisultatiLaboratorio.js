jQuery(document).ready(function() {	
	
	NS_PAGINA.INTESTAZIONE.creaIntestazione();
	NS_PAGINA.INTESTAZIONE.setStyleIntestazione();
	NS_PAGINA.INTESTAZIONE.setEventsIntestazione();
	NS_PAGINA.STYLES.setgenericStyle();
	
});

var NS_HTML = {
	
	createElement : function(element){
		return $(document.createElement(element.toString()));
	},
	
	appElemToElem : function(objAncestor, objSon){
		objAncestor.append(objSon);
		return objAncestor;
	},
	
	setAttribute : function(obj, attribute, value){
		return obj.attr(attribute, value);
	},
	
	innerElement : function(obj, type, value){
		obj.html(value);
		return obj;
	},
	
	addTr : function(classTr, codEsa, idenEsa, vRangeEsa, matEsa, idenEsaRange){
		
		var tr	= NS_HTML.createElement('tr');
		tr		= tr.addClass(classTr);
		tr		= NS_HTML.setAttribute(tr,'cod_esa',codEsa);
		tr		= NS_HTML.setAttribute(tr,'iden_esa',idenEsa);
		tr		= NS_HTML.setAttribute(tr,'range_esa',vRangeEsa);
		tr		= NS_HTML.setAttribute(tr,'mat_esa',matEsa);
		tr		= NS_HTML.setAttribute(tr,'iden_range',idenEsaRange);
		
		return tr;
	},
	
	addTdLabel : function(classTd, classLabel, txtLbl){
		
		var td	= NS_HTML.createElement('td');
		td		= td.addClass(classTd);
		var lbl	= NS_HTML.createElement('label');
		lbl		= lbl.addClass(classLabel);
		
		txtLbl	= txtLbl == '' ? 'N.D.' : txtLbl;
		if(txtLbl != undefined)
			lbl	= NS_HTML.innerElement(lbl,'html',txtLbl);
		
		td		= NS_HTML.appElemToElem(td, lbl);
		return td;
	},
	
	addTd : function(classTd, htmlAgg){
		
		var td	= NS_HTML.createElement('td');
		td		= td.addClass(classTd);
		
		htmlAgg	= htmlAgg == undefined ? '' : htmlAgg;
		
		td		= NS_HTML.appElemToElem(td, htmlAgg);
		
		return td;
	},
	
	addTdInput : function(classTd, classInput, datepicker){
		
		var td	= NS_HTML.createElement('td');
		td		= NS_HTML.setAttribute(td,'class',classTd);
		
		var inp	= NS_HTML.createElement('input');
		inp		= NS_HTML.setAttribute(inp,'class',classInput);
		
		td		= NS_HTML.appElemToElem(td, inp);
		
		if(datepicker){
			NS_HTML.setDatepicker(inp);
		}
		
		return td;
	},
	
	setDatepicker:function(pInput){
		pInput.datepick({
			showOnFocus: false,
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
		});		
	},
	
	setElementEvent : function(selezElemento, handler, action){
		$(selezElemento).bind(handler, function(){
			eval(action);
		});
	}
	
};

var NS_PAGINA = {
		
	close : function(){
		parent.$.fancybox.close();
	},
	
	INTESTAZIONE : {
		
		creaIntestazione : function(){	
		
			// alert('[0] Create Intestazione');
			var tableIntestazione;
			var trIntestazione;
			var tdAggiungi;
			var tdPrestazione;
			var tdRange;
			var tdMateriale;
			var tdData;
			var tdOra;
			var tdRisultato;
			
	
			tableIntestazione	= NS_HTML.createElement('table');
			tableIntestazione 	= NS_HTML.setAttribute(tableIntestazione, 'class','tableIntestazione');
			
			trIntestazione		= NS_HTML.createElement('tr');
			trIntestazione		= NS_HTML.setAttribute(trIntestazione, 'class','trIntestazione');
			
			// [1] Colonna Pulsante Apertura Scelta Prestazioni
			tdAggiungi	= NS_HTML.addTdLabel('classTdLabelLink tdIntestazione tdAggiungi','lblIntestazione', 'AGGIUNGI');
			
			// [2] Colonna Intestazione Descrizione Prestazione
			tdPrestazione	= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdPrestazione','lblIntestazione', 'PRESTAZIONE');
			
			// [3] Colonna Valore Min Prestazione
			tdRange	= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdRange','lblIntestazione', 'RANGE');
			
			// [5] Colonna U.M. Prestazione
			tdMateriale	= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdMateriale','lblIntestazione', 'MATERIALE');
			
			// [6] Colonna Data Prestazione
			tdData	= NS_HTML.addTdLabel('classTdLabel_O TdLblPrestazione tdIntestazione tdData','lblIntestazione', 'DATA');
			
			// [7] Colonna Ora Prestazione
			tdOra	= NS_HTML.addTdLabel('classTdLabel_O TdLblPrestazione tdIntestazione tdOra','lblIntestazione', 'ORA');
			
			// [8] Colonna Risultato Prestazione
			tdRisultato		= NS_HTML.addTdLabel('classTdLabel_O TdLblPrestazione tdIntestazione tdRisultato','lblIntestazione', 'RISULTATO');
			
			// [9] Appendo i TD ai TR
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdAggiungi);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdPrestazione);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdRange);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdMateriale);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdData);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdOra);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdRisultato);
			
			// alert('[1] Append Table');
			tableIntestazione	= NS_HTML.appElemToElem(tableIntestazione, trIntestazione);
			
			$('#divPrestazioni').append(tableIntestazione);
		},
	
		setStyleIntestazione : function(){
				
			// [0] Normalizzo le Width
			$('[name="dati"]').css({'width': $('#body').width()});
			$('#fancybox-overlay').css({'width': $('#body').width()});
		
			// [1] Setto Lo Stile Dinamicamente perchè i CSS di default mi SOVRASCRIVONO lo stile
			$('.tableIntestazione').css('width','100%');
			
			$('.trIntestazione').css('height','35px');
			$(".trIntestazione td:first-child").css('border-left','1px solid BLUE');
			$('.tdIntestazione').css('line-height','25px');
			$('.tdIntestazione').css('border-bottom','2px solid blue');
			
			$('.tdAggiungi').css('width','8%');
			$('.tdPrestazione').css('width','30%');			
			$('.tdRange').css('width','12%');
			$('.tdMateriale').css('width','10%');
			$('.tdData').css('width','12%');
			$('.tdOra').css('width','8%');
			$('.tdRisultato').css('width','15%');
	
		},
	
		setEventsIntestazione : function(){
			// [1] Click Handler su "AGGIUNGI"
			$('.trIntestazione:first-child').click(function(){NS_PAGINA.INTESTAZIONE.openSceltaPrestazioni();})
		},
		
		openSceltaPrestazioni : function(){			
			// [1] Apro in unaNuova Pagina la Scelta delle Prestazioni
			window.open('servletGenerator?KEY_LEGAME=SCELTA_ESAMI_DATI_STRUTTURATI','_blank','fullscreen=yes');
		}
	},
	
	STYLES : {
	
		setgenericStyle : function(){
			
			var a	= $('#groupDatiPrestazioni').next().height();
			var b	= $('#groupDatiPrestazioni').next().offset().top;
			var c	= $(document).height();
			var d	= $('#divPrestazioni').height();
			$('#divPrestazioni').css({'height':c-(a+b)+d+'px'});
			// alert(a +' - ' + b + ' - ' + c);
		}
		
	},
	ELENCO_ESAMI : {
		
		/* 	{
		 * 		IDEN 		: <iden_esa>,
		 * 		COD_ESA 	: <cod_esa>,
		 * 		COD_DEC 	: <cod_dec>,
		 * 		DESCR 		: <descr>,
		 * 		VAL_MIN 	: <val_min>,
		 * 		VAL_MAX 	: <val_max>,
		 * 		MATERIALE	: <MATERIALE>,
		 * 	}
		 */
		objEsame : {},
		
		btnAddRemove : "<div class='btnAddSamePrestazione' onclick='NS_PAGINA.ELENCO_ESAMI.addSameEsame();'></div><div class='btnRemoveSamePrestazione' onclick='NS_PAGINA.ELENCO_ESAMI.removeSameEsame()'></div>",
		
		addEsame : function(obj){
			
			NS_PAGINA.ELENCO_ESAMI.objEsame	= obj;

			// [0] Creo il TD alert(obj['COD_DEC'] + ' - ' + obj['IDEN'] + ' - ' + obj['RANGE'] + ' - ' + obj['COD_MAT'] + ' - ' + obj['IDEN_ESA_RANGE'])
			var trPrestazione	= NS_HTML.addTr('trPrestazione',obj['COD_DEC'],obj['IDEN'],obj['RANGE'],obj['COD_MAT'],obj['IDEN_ESA_RANGE']);

			
			// [1] Creo i Vari TR
			var tdAggiungi		= NS_HTML.addTd('TdLblPrestazione tdTrPrestazione', NS_PAGINA.ELENCO_ESAMI.btnAddRemove);			
			var tdPrestazione	= NS_HTML.addTdLabel('TdLblPrestazione tdTrPrestazione','lblTrPrestazione lblPrestDescr',obj['DESCR']);
			var tdRange			= NS_HTML.addTdLabel('TdLblPrestazione tdTrPrestazione','lblTrPrestazione lblPrestVMin',obj['RANGE']);
			var tdMateriale		= NS_HTML.addTdLabel('TdLblPrestazione tdTrPrestazione','lblTrPrestazione lblPrestUM',obj['MATERIALE']);
			var tdData			= NS_HTML.addTdInput('classTdField tdTrPrestazione','inputTrPrestazioneData inputPrestData', true);
			var tdOra			= NS_HTML.addTdInput('classTdField tdTrPrestazione','inputTrPrestazioneOra inputPrestOra', false);
			var trRisultato		= NS_HTML.addTdInput('classTdField tdTrPrestazione','inputTrPrestazioneRisultato inputPrestRisultato', false);
						
			// [2] Appendo i TD ai TR
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdAggiungi);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdPrestazione);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdRange);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdMateriale);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdData);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdOra);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, trRisultato);
			
			// [3] Appendo il TR alla TABLE
			$('.tableIntestazione').append(trPrestazione);
			
			NS_PAGINA.ELENCO_ESAMI.setStyleEsame();
			NS_PAGINA.ELENCO_ESAMI.setEventEsame();			
			
		},
		
		setEventEsame : function(){

			// [0] Evento al key Up per Ora Prestazione
			$('.trPrestazione').each(function(){
				// Converto Oggetto Jquery in oggetto JS per poter eseguire la funzione al Key Up
				var inputOra = $(this).find('.inputPrestOra');
				$(this).find('.inputPrestOra').keyup(function(){oraControl_onkeyup(inputOra[0]);});
			});
			
			NS_UTILITY.controlloData();
		},

		setStyleEsame : function(){
			
			$('.tdTrPrestazione').css('border-bottom','2px solid RED');
			$('.trPrestazione').css('height','35px');
			$("[cod_esa='" +  NS_PAGINA.ELENCO_ESAMI.objEsame['COD_ESA'] + "'] td:first-child").css('border-left','1px solid RED');
			$(".trPrestazione td:first-child").css('border-left','1px solid RED');
			
			// [0] Normalizzo le Width A Seconda Del Numero delle Prestazioni
			if($('.trPrestazione').length > 1){				
				$('[name="dati"]').css({'width': $('#body').width()-20});
				$('#fancybox-overlay').css({'width': $('#body').width()-20});
			}else{
				$('[name="dati"]').css({'width': $('#body').width()});
				$('#fancybox-overlay').css({'width': $('#body').width()});
			}
		},
		
		addSameEsame : function(){

			var clone;
			var obj 	= $(event.srcElement).closest('tr');
			
			// [0] Clono TR senza Heandler
			clone = $(obj).clone(false);
			
			// [1] Appendo TR Clonato al TR Sorgente
			$(obj).after(clone);
			
			// [2] Rimuovo dal Tr Clonato il Datepicker
			clone.find('.trigger').remove();
			NS_HTML.setDatepicker(clone.find('.inputTrPrestazioneData').removeClass('hasDatepick'));
			
			// [3] Azzero i Valori degli INPUT nel TR
			$(clone).find('input').val('');	
			
			// [4] Heandler ora Esame
			NS_PAGINA.ELENCO_ESAMI.setEventEsame();
			
		},
		
		removeSameEsame : function(){
				
			var obj 	= $(event.srcElement).closest('tr');
			obj.remove();
			
		},
		
		removeEsame : function(iden_range){
			$("[iden_range='" + iden_range + "']").remove();
		},
		
		saveRisultatiLaboratorio : function(){
				
			var insert			= 'OK';
			var pBindMatrix 	= [];
			
			// [1] Get Info Paziente
			var vResp	= parent.executeStatement("datiStrutturatiLabo.xml","getInfoPaziente",[parent._V_FILTRO.idenAnag],4);
			if(vResp[0]=='KO')
				return alert('Inserimento in Errore: \n' + vResp[1]);
			
			// [1.1] Ciclo i TR per Estrapolare i Valori dei Risultati e li Pusho dentro Array Multidimensionale pBindMatrix
			$('.trPrestazione').each(function(idx){
				
				var dataOra	= clsDate.str2str($(this).find('.inputPrestData').val(),'DD/MM/YYYY','YYYYMMDD') + $(this).find('.inputPrestOra').val();
				var codEsa	= $(this).attr('cod_esa');
				
				// [1.2] Gestione Range (Valore Riferimento o V Min - V Max)
				if( $(this).attr('range_esa').split(' - ').length > 1){
					var vMin 	= $(this).attr('range_esa').split(' - ')[0];
					var vMax 	= $(this).attr('range_esa').split(' - ')[1];
				}else{
					var vMin 	= $(this).attr('range_esa');
					var vMax 	= $(this).attr('range_esa');
				}
				var vMat	= $(this).attr('mat_esa');				
				var result	= $(this).find('.inputPrestRisultato').val();		
				
				if (dataOra.length < 13 || (result == null || result == '')){
					alert('Controllare la corretta compilazione di DATA, ORA e RISULTATO');
					insert = 'KO';
				}

				pBindMatrix.push([parent._V_FILTRO.idenAnag,dataOra,codEsa,vMin,vMax,vMat,result,vResp[2],vResp[3], vResp[4],parent._USER_LOGIN,parent._V_DATI.reparto]);
				
				if(parent._USER_LOGIN == 'arry')
					alert('ALERT DEBUG SOLO PER ARRY \n - Iden Anag: ' + parent._V_FILTRO.idenAnag + '\n - Data Ora: ' + dataOra + '\n - Cod Esa: ' + codEsa + '\n - Val Min: ' + vMin + '\n Val Max: ' + vMax + '\n Materiale: ' + vMat + '\n Risultato: ' + result + '\n - Nome, Cognome, Data :' + vResp[2] + ' - ' + vResp[3] + ' - ' + vResp[4] + ' - ' + parent._USER_LOGIN + '\n - Reparto: ' + parent._V_DATI.reparto);
					
			});

			if (insert == 'KO')
				return;
					
			
			// [2] executeBatchStatement + array Multidimensionale Meno Chiamate DWR. 
			var resp = parent.executeBatchStatement("datiStrutturatiLabo.xml","insertNewRisultato",pBindMatrix);
			
			if(resp[0]=='KO'){
				return alert('Inserimento in Errore: \n' + vResp[1]);
			}else{			
				alert('Risultati Inseriti Correttamente');
				parent.$.fancybox.close();
				parent.NS_DATI_LABO.NS_FILTRI_FUNZIONI.aggiornaDatiStrutturati();
			}
			
		}
	}
};

NS_UTILITY	= {
	
	controlloData:function(){

		$('.inputTrPrestazioneData').each(function(){												   
			try{
				var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
				oDateMask.attach($(this)[0]);
			}catch(e){alert(e.description)}
		})
	}	
}


