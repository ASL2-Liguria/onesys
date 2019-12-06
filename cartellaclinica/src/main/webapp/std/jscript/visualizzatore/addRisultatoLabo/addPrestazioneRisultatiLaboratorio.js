jQuery(document).ready(function() {	
	
	NS_PAGINA.INTESTAZIONE.creaIntestazione();
	NS_PAGINA.INTESTAZIONE.setStyleIntestazione();
	NS_PAGINA.ESAME.addEsame();
	
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
	
	addTr : function(classTr, codEsa, idenEsa){
		
		var tr	= NS_HTML.createElement('tr');
		tr		= tr.addClass(classTr);
		tr		= NS_HTML.setAttribute(tr,'cod_esa',codEsa);
		tr		= NS_HTML.setAttribute(tr,'iden_esa',idenEsa);
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
		
			var tableIntestazione;
			var trIntestazione;
			var tdAggiungi;
			var tdPrestazione;
			var lblPrestazione;
			var tdValMin;
			var lblValMin;
			var tdValMax;
			var lblValMax;
			var tdUM;
			var lblUM;
			var tdData;
			var tdRisultato;
			var tdNote;
	
			tableIntestazione	= NS_HTML.createElement('table');
			tableIntestazione 	= NS_HTML.setAttribute(tableIntestazione, 'class','tableIntestazione');
			
			trIntestazione		= NS_HTML.createElement('tr');
			trIntestazione		= NS_HTML.setAttribute(trIntestazione, 'class','trIntestazione');

			// [1] Colonna Intestazione Descrizione Prestazione
			tdPrestazione	= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdPrestazione','lblIntestazione', 'PRESTAZIONE');
			
			// [2] Colonna Valore Min Prestazione
			tdValMin		= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdValMin','lblIntestazione', 'VALORE MIN.');
						
			// [3] Colonna Valore Max Prestazione
			tdValMax		= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdValMax','lblIntestazione', 'VALORE MAX.');
			
			// [4] Colonna U.M. Prestazione
			tdUM			= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdUM','lblIntestazione', 'UNIT&Agrave; DI MISURA');
			
			// [5] Colonna Note Prestazione
			tdNote			= NS_HTML.addTdLabel('TdLblPrestazione tdIntestazione tdNote','lblIntestazione', 'NOTE');
			
			// [6] Appendo i TD ai TR
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdPrestazione);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdValMin);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdValMax);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdUM);
			trIntestazione		= NS_HTML.appElemToElem(trIntestazione, tdNote);
			
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
			

			$('.tdPrestazione').css('width','40%');			
			$('.tdValMin').css('width','15%');
			$('.tdValMax').css('width','15%');
			$('.tdUM').css('width','15%');
			$('.tdNote').css('width','15%');

	
		}
	},
	
	ESAME : {
		
		addEsame : function(){
			
			// [0] Creo il TD
			var trPrestazione	= NS_HTML.addTr('trPrestazione','','');
			
			// [1] Creo i Vari TR						
			var tdPrestazione	= NS_HTML.addTdInput('TdLblPrestazione tdTrPrestazione','inputTrPrestazioneDescr','', false);
			var tdValMin		= NS_HTML.addTdInput('TdLblPrestazione tdTrPrestazione','inputTrPrestazioneVMin','', false);
			var tdValMax		= NS_HTML.addTdInput('TdLblPrestazione tdTrPrestazione','inputTrPrestazioneVMax','', false);
			var tdUM			= NS_HTML.addTdInput('TdLblPrestazione tdTrPrestazione','inputTrPrestazioneUM','', false);
			var tdNote			= NS_HTML.addTdInput('TdLblPrestazione tdTrPrestazione','inputTrPrestazioneNote', false);
						
			// [2] Appendo i TD ai TR

			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdPrestazione);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdValMin);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdValMax);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdUM);
			trPrestazione	= NS_HTML.appElemToElem(trPrestazione, tdNote);
			
			// [3] Appendo il TR alla TABLE
			$('.tableIntestazione').append(trPrestazione);
			
			NS_PAGINA.ESAME.setStyleEsame();
			// NS_PAGINA.ELENCO_ESAMI.setEventEsame();			
			
		},
		
		setStyleEsame : function(){
			
			$('.tdTrPrestazione').css('border-bottom','2px solid RED');
			$('.trPrestazione').css('height','40px');
			$('.trPrestazione input').css('height','30px').css('line-height','24px').css('font-size','16px');
			$('.inputTrPrestazioneDescr').css('width','100%');
			$(".trPrestazione td:first-child").css('border-left','1px solid RED');
						
		},
		
		salvaEsame : function(){
			
			$('.trPrestazione input').each(function(){			 
				$(this).val($(this).val().toUpperCase());
			});

			var newPrestDescr	= $('.inputTrPrestazioneDescr').val();
			var newPrestVMin	= $('.inputTrPrestazioneVMin').val();
			var newPrestVMax	= $('.inputTrPrestazioneVMax').val();
			var newPrestUM		= $('.inputTrPrestazioneUM').val();
			var newPrestNote	= $('.inputTrPrestazioneNote').val();
			var newPrestLogin	= parent._USER;
			
			if(parent._USER == 'arry')
				alert(' - Descrizione: ' + newPrestDescr + '\n - Val Min: ' + newPrestVMin + '\n - Val Max: ' + newPrestVMax + '\n - Val UM: ' + newPrestUM + '\n - User: ' + newPrestLogin + '\n - Note: ' + newPrestNote);
			
			if(isNaN(newPrestVMin) || isNaN(newPrestVMax)){
				alert('I Valori di Riferimento devono essere campi Numerici');
				return;
			}

			// [1] Salvataggio Nuova Prestazione
			var vResp	= executeStatement("datiStrutturatiLabo.xml","insertNewPrestazione",[newPrestLogin,newPrestDescr,newPrestVMin,newPrestVMax,newPrestUM,newPrestNote],4);

			if(vResp[0]=='KO'){
				return alert('Inserimento in Errore: \n' + vResp[1]);
			}

			// [2] Creo Option - 13610$12837$HGB$EMOGLOBINA  *$13,5 - 18$Sangue$Sangue
			var oOption 	= document.createElement("Option");
			oOption.value 	= vResp[2] + '$' + vResp[4] + '$' +  vResp[3] + '$' + newPrestDescr + '$' + newPrestVMin + ' - ' + newPrestVMax + '$' + '' + '$' + '';
			oOption.text 	= newPrestDescr + ' Range: ' + newPrestVMin + ' - ' + newPrestVMax;

			// [3] Appendo Option
			var objectTarget = parent.document.getElementById('PrestazioniSelezionate');
			objectTarget.add(oOption);
			
			parent.NS_PRESTAZIONI.caricaEsamiElenco();
			
			NS_PAGINA.close();
			
			return;
		}
	}
};