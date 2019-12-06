jQuery(document).ready(function() {
	SCELTA_LISTA_DOPPIA_CONS.init();
	SCELTA_LISTA_DOPPIA_CONS.setEvents();
});

SCELTA_LISTA_DOPPIA_CONS ={
	arrayPrestazioni		 	: new Array(),
	arrayPrestazioniAggiunte 	: new Array(),
	arrayBeforeClose			: new Array(),
	arrayTmp					: new Array(), 
	check						:{
									prestazioniAggiunte:'',
									clasPrestazioniInserite:'',
									idenPrestazioniInserite:''
								},
	
	init:function(){
		/*Funzione che carica gli esami selezionati*/
		SCELTA_LISTA_DOPPIA_CONS.loadEsami();
		/*Funzione che carica gli esami selezionabili*/
		SCELTA_LISTA_DOPPIA_CONS.loadEsamiToSelected();				

	},
	
	/*Carico la lista degli esami selezionati*/
	loadEsami:function(){
		var idListBox 		= 'elencoSelezionate';
		var statementFile 	= 'OE_Consulenza.xml';
		var statementName 	= 'consulenze.caricaPrestazioniRichiesta';
		var parameters 		= [$('#HIDDEN_IDEN_TESTATA_RICHIESTE').val()];
		
		var rs = top.executeQuery(statementFile,statementName,parameters);
		while(rs.next()){
			SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioni.push(rs.getString("valore"));
			SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioniAggiunte.push(rs.getString("valore"));
			/*
			
			add_elem(idListBox,rs.getString("valore"),rs.getString("testo"),'insertFromReparto');
			SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioniAggiunte.push(rs.getString("valore"));
			
			$('[name="elencoSelezionate"] option:not(.insertFromPS)').each(function(index)
			{
				alert($(this).val());
				alert(SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioni);
				$('#hCampo').val($('#hCampo').val()+$(this).val()+"@");
			});

			*/
			if (rs.getString("esame_associato")=='N')
			{
				add_elem(idListBox,rs.getString("valore"),rs.getString("testo"),'insertFromPS');
			}
			else
			{
				add_elem(idListBox,rs.getString("valore"),rs.getString("testo"),'insertFromReparto');

			}
			
		}
	},

	/*Carico la lista degli esami selezionabili(tutte quelle diverse da quelle già selezionate)*/
	loadEsamiToSelected:function(){
		var idListBox 			= 'elencoSelezionabili';
		var cdc_destinatario 	= $('#HIDDEN_CDC_DESTINATARIO').val();
		var cdc_sorgente		= $('#HIDDEN_CDC_SORGENTE').val();
		var statementFile 		= 'OE_Consulenza.xml';
		var statementName 		= 'consulenze.caricaPrestazioniSelezionabili';
		var tipoRichiesta		= 'C';
		var parameters 			= [cdc_destinatario,cdc_sorgente,tipoRichiesta];

		var rs = top.executeQuery(statementFile,statementName,parameters);
		while(rs.next()){
			//$.inArray(valoreDaRicercare,ArrayNelQualeRicercare)-> mi ritorna la posizione dell'elemento
			if ($.inArray(rs.getString("valore"),SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioniAggiunte)<0){
				//funzione presente in optionJsUtil.js,aggiunge gli elementi al listbox
				add_elem(idListBox,rs.getString("valore"),rs.getString("testo"));				
			}
		}
		//funzione presente in optionJsUtil.js,riordina gli elementi al listbox
		sortSelect(idListBox);	
	},
	
	/* 
	 * Registrazione delle prestazioni inserite.
	 * Ad ogni registrazione,vengono cancellate tutte le prestazioni e vengono reinserite
	 * */
	registraPrestazioneAggiuntive:function(){
		setVeloNero('body');
		$('#hCampo').val('');
		//valorizzazione del campo nascosto con tab_esa.iden delle prestazioni che si vogliono registrare
		SCELTA_LISTA_DOPPIA_CONS.valorizzaCampoNascostoEsamiAggiunti();

		if (!SCELTA_LISTA_DOPPIA_CONS.check.prestazioniAggiunte)
		{
			alert('Errore nella registrazione delle prestazioni:inserire almeno una prestazione');
			removeVeloNero('body');
			return;
		}
		
		
		var statementFile = 'OE_Consulenza.xml';
		var statementName = 'consulenze.registraPrestazioniAggiuntive';
		var idenTabEsaPrestazioni =SCELTA_LISTA_DOPPIA_CONS.check.idenPrestazioniInserite;
		idenTabEsaPrestazioni = idenTabEsaPrestazioni.substring(0,idenTabEsaPrestazioni.length-1);
		var parameters = [idenTabEsaPrestazioni,$('#HIDDEN_IDEN_TESTATA_RICHIESTE').val()];
		var resp =  top.executeStatement(statementFile,statementName,parameters,1);

		if (resp[0]=='OK')
		{
			alert('Prestazioni Registrate con successo!');
			remove_all_elem('elencoSelezionate');
			SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioni = new Array();
			SCELTA_LISTA_DOPPIA_CONS.loadEsami();
			$('#hCampo').val('');
			removeVeloNero('body');
			SCELTA_LISTA_DOPPIA_CONS.chiudiPrestazioneAggiuntive();
		}else {
			alert('Errore nel salvataggio delle prestazioni.\nDescrizione errore:'+resp[1]);
			remove_all_elem('elencoSelezionate');
			SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioni = new Array();
			SCELTA_LISTA_DOPPIA_CONS.loadEsami();
			removeVeloNero('body');
		}
	},
	
	/*Setto i comportamenti dei listbox*/
	setEvents:function(){
		//$('.notSelected').attr('disabled','disabled');
		
		$('[name="elencoSelezionabili"]').dblclick( function () {
			add_selected_elements('elencoSelezionabili', 'elencoSelezionate', true);
			$('[name="elencoSelezionate"] option').each(function(){
				if ($(this).hasClass(''))
				{
					if ($.inArray($(this).val(),SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioni)<0)
					{		
						$(this).attr('class','insertFromReparto');
					}else{
						$(this).attr('class','insertFromPS');						
					}
				}
			});
		});
		
		$('[name="elencoSelezionate"]').dblclick( function () {
			add_selected_elements('elencoSelezionate', 'elencoSelezionabili', true);
			sortSelect('elencoSelezionabili');	
		});
	},

	/*
	 * Pulsante Chiudi:controlla se prima di chiudere sia stato modificato qualcosa rispetto al caricamento. Se qualcosa è stato modificato, 
	 * dà la possibilità di registrare le modifiche fatte
	 * */
	chiudiPrestazioneAggiuntive:function(){
		
		if (!SCELTA_LISTA_DOPPIA_CONS.checkPrestazioniAggiunte()){
			parent.$.fancybox.close();			
		}else
		{
			var txtconfermauscita = confirm('Ci sono delle modifiche non salvate. Procedere con il salvataggio?');
			if (txtconfermauscita==true)
			{
				SCELTA_LISTA_DOPPIA_CONS.registraPrestazioneAggiuntive();
				parent.$.fancybox.close();
			}else
			{
				parent.$.fancybox.close();	
			}
		}
	},	
	
	checkPrestazioniAggiunte:function(){
		var bolCheckPrestazioniAggiunte = false;

		var tmpArray = new Array();
		
		
		$('[name="elencoSelezionate"] option').each(function(index)
		{
			if ($(this).val()==''){
				//Non salvo se non ci sono prestazioni inserite
				bolCheckPrestazioniAggiunte=false;	
			}	
			else{
				tmpArray.push($(this).val());
				
				var prestazione = $(this).val();
				if ($.inArray(prestazione.toString(),SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioni)<0){
					//controlla se la prestazione ciclata è stata aggiunta
					bolCheckPrestazioniAggiunte=true;
				}else{
					bolCheckPrestazioniAggiunte=false;
					
				}
			}
		});
		/*Se non ci sono stata prestazioni aggiunte, controlla che non ci siano state delle eliminazioni rispetto al caricamento*/	
		if (!jQuery.isEmptyObject(tmpArray)){
			if (bolCheckPrestazioniAggiunte==false && tmpArray.length<SCELTA_LISTA_DOPPIA_CONS.arrayPrestazioni.length){
				bolCheckPrestazioniAggiunte=true;
			}
		}

		return bolCheckPrestazioniAggiunte;
	},
	
	valorizzaCampoNascostoEsamiAggiunti:function(){
		
		SCELTA_LISTA_DOPPIA_CONS.check.prestazioniAggiunte = '';
		SCELTA_LISTA_DOPPIA_CONS.check.clasPrestazioniInserite = '';
		SCELTA_LISTA_DOPPIA_CONS.check.idenPrestazioniInserite = '';
		
		SCELTA_LISTA_DOPPIA_CONS.check.prestazioniAggiunte = SCELTA_LISTA_DOPPIA_CONS.checkPrestazioniAggiunte();

		//se ritorna false, rispetto all'array(iniziale o quello dopo il salvataggio) non è stato modificato nulla.
		//se ritorna true, rispetto all'array(iniziale o quello dopo il salvataggio) non è stato modificato nulla.

		if (SCELTA_LISTA_DOPPIA_CONS.check.prestazioniAggiunte){
			
			$('[name="elencoSelezionate"] option').each(function(index)
				{
					$('#hCampo').val($('#hCampo').val()+$(this).val()+"@");
					SCELTA_LISTA_DOPPIA_CONS.check.idenPrestazioniInserite += $(this).val()+"@";
					SCELTA_LISTA_DOPPIA_CONS.check.clasPrestazioniInserite += $(this).attr('class')+"@";

				});
		}
//		alert(SCELTA_LISTA_DOPPIA_CONS.check.idenPrestazioniInserite + '\n\r' +SCELTA_LISTA_DOPPIA_CONS.check.clasPrestazioniInserite);
	}
	
	
};






