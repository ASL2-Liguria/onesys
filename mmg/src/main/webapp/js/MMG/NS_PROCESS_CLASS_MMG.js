
var NS_PROCESS_CLASS_MMG =
{
    addIcon: function (type)
    {
        var icon_class = '', title = '';

        switch (type.toUpperCase())
        {
			case 'S':																									// SOSPENSIONE DELLA RIGA DELL'AGENDA
                icon_class	= 'icon-lock-empty';
				title		= 'Riga sospesa';
                break;
			case 'F':
				icon_class	= 'icon-wrench';
				title		= 'Prenotazione con forzatura';
				break;
            default :
                '';
        }

        return ( icon_class != '' ) ? $('<i>', { 'class' : icon_class + ' worklist-icon', 'title' : title }) : '';
    },
    
	processTdPaziente : function(data) {
		var $html = $("<div/>",{"style":"cursor:pointer;text-decoration: underline;font-weight: bold;"});
		if ( $.trim(data.PAZIENTE)!='' ) {
			$html.html(data.PAZIENTE);
			$html.on("click",function(){
				home.iden_anag_sel=data.IDEN_ANAGRAFICA;
				home.cod_fisc_sel=data.COD_FISC;
				//home.NS_WK_RICERCA.apri("MAIN_PAGE");
			});
		}else if( data.STATO != 'S' ){
			
			$('<i>', { 'class' : 'icon-user-add worklist-icon', 'title' : 'Prenota' }).appendTo( $html );
			$html.on("click",function(){
				NS_MENU_CONSULTA_AGENDA_GIORNALIERA.prenota([data],'N');
			});
		}
		return $html;
	},
	
    processTdNote : function(data) {
    	var $html = $("<div/>",{"style":"cursor:pointer"});
    	if ($.trim(data.NOTE)!='') {
    		$html.html(data.NOTE);
    	}else {
    		$('<i>', { 'class' : 'icon-pencil worklist-icon', 'title' : 'Inserisci nota' }).appendTo( $html );
    		$html.on("click",function(){
    			NS_MENU_CONSULTA_AGENDA_GIORNALIERA.note([data]);
    		});
    	}
    	return $html;
    },
    
    processTipoDiari : function(data){
    	
    	var className;
    	var title;
    	var iconOscurato = '';
    	var clickToOpen = true;
    	
    	if ( data.SCHEDA == null) {
    	
    		return null;
    	
    	}else if ( (data.SCHEDA == 'MMG_VISITE' || data.SCHEDA == 'PLS_VISITE' ) && (data.MEDICINA_INIZIATIVA == 'N')) {
    		
    		className = " icon-cancel-1 medIniz worklist-icon";
    		title = "Oscurata per Med. Iniziativa";
    	
    	}else if((data.SCHEDA == 'NOTE' || data.SCHEDA == 'GRAVIDANZA') && data.MEDICINA_INIZIATIVA == 'N' ){
    		
    		className = "icon-cancel-1 medIniz worklist-icon";
    		title = "Oscurata per Med. Iniziativa";
    		clickToOpen=false;
    	
    	}else if ( data.SCHEDA == 'MMG_VISITE' || data.SCHEDA == 'PLS_VISITE') {
    		
    		className = "icon-stethoscope worklist-icon";
    		title = "Visita";
    		
    	}else if ( data.SCHEDA.substring(0,15) == 'BILANCIO_SALUTE') {
    		
    		className = "icon-vcard worklist-icon";
    		title = "Bilancio di salute";
    	
    	}else if ( data.SCHEDA == 'MMG_ANAMNESI_PRE_NEONATALE') {
    		
    		className = "icon-vcard worklist-icon";
    		title = "Anamnesi";
    		
    	}else if( data.TIPO == 'MEDICINA_DI_INIZIATIVA' && home.baseUser.TIPO_UTENTE == 'M'){
    			
    		className = "icon-medkit medIniz worklist-icon";
    		title = "Anamnesi";
    	}
    	
    	/*
    	else if ( data.TIPO == 'ACCESSO') 
    	{
    		className = " icon-male worklist-icon";
    		title = "Accesso";
    	} 
    	else if ( data.TIPO == 'PRESCRIZIONE') 
    	{
    		className = "icon-medkit worklist-icon";
    		title = "Prescrizione";
    	} 
    	*/
    	
    	else 
    	{
    		null;
    	} 
    	
    	var divIcon = $("<div>");
    	
    	//creo l'eventuale iconcina per le schede (visite, bilanci, ecc.)
    	if(className != ''){	    		
    		
    		var iconToAppend = $('<i>', { 'class' : className , 'title' : title })
    		
    		if(clickToOpen){
    			iconToAppend.on('click', function(){ home.WK_DIARI.apriVisita( [data] ); });
    		}
    		
    		divIcon.append(iconToAppend);
    	}
    	
    	return divIcon.append(NS_PROCESS_CLASS_MMG.processOscuramento( data ));
    },
    
    addPlusButton: function( data ) {
    	
    	var parameters = new Array();
    	parameters.push({ 
			'IDEN':			data.IDEN, 
			'GIORNI':		data.GIORNI, 
			'ORA_INIZIO':	data.ORA_INIZIO,
			'ORA_FINE':		data.ORA_FINE, 
			'VALUE' : 		''
		});
    	
    	return $( document.createElement('i') )
    				.attr('title', 'Associa fascia oraria all\'agenda corrente')
    				.addClass('icon-plus-squared worklist-icon')
    				.on('click', function(){ home.AGENDA.addFasceOrarie( parameters ); } );
    },
    
    processOscuramento: function(data, wk, td) {
    	if (data.OSCURATO == 'S') {
    		return $( document.createElement('i') )
    		.attr('title', 'Dato oscurato')
    		.addClass('icon-minus-circled worklist-icon')
    		.css({"cursor":"auto","font-size":"16px","color": "red" });
    	} else {
    		return null;
		}
    },
    
    processNotaCuf: function(data, wk, td) {
    	var record = data;
    	
    	return $( document.createElement('i') )
    		.attr('title', 'Visualizza Nota')
    		.addClass('icon-search worklist-icon')
    		.css({"cursor":"pointer","font-size":"16px"}).on('click', function(){ UTILITA.apriNota( record ); } );
    	
    },
    
    setMenuWorklistPrincipale: function (data){
    	
    	var fraseConsenso 	= '';
    	var colorPrivacy 	= '';
    	
    	//coloro l'icona per evidenziare se il paziente ha concesso o meno il consenso MMG
    	switch(data.CONSENSO_PRIVACY_MMG){
    	
    		case 'S' : 
    			fraseConsenso 	= 'Consenso MMG concesso';
    			colorPrivacy 	= '#2CBB68'; //verde
    			break;
    			
    		case 'N' : 
    			fraseConsenso 	= 'Consenso MMG negato';
    			colorPrivacy 	= '#fc4141'; //rosso
    			break;
				
    		case 'X' :
    		default:
    			fraseConsenso 	= 'Consenso MMG non recepito';
    			colorPrivacy 	= '#FFC700'; //giallo scuro
    			break;
    	}
    	
        var 
        	cartellaAssistito	= $('<i>', { 'class' : 'icon-user worklist-icon', 		'title' : 'Apri Cartella Assistito | ' + fraseConsenso , "style" : "color:" + colorPrivacy}).on('click', function( event ) { NS_MENU_WORKLIST_ASSISTITI.apriCartellaAssistito( data ); }),
        	schedaAnagrafica	= $('<i>', { 'class' : 'icon-vcard worklist-icon', 		'title' : 'Apri Scheda Anagrafica' }).on('click', function( event ) { NS_MENU_WORKLIST_ASSISTITI.apriSchedaAnagrafica( data ); }),
        	datiStrutturati		= $('<i>', { 'class' : 'icon-chart-bar worklist-icon',	'title' : 'Visualizza Dati Strutturati' }).on('click', function( event ) { NS_MENU_WORKLIST_ASSISTITI.apriDatiStrutturati( data ); }),
        	documenti			= $('<i>', { 'class' : 'icon-doc worklist-icon',		'title' : 'Visualizza Documenti' }).on('click', function( event ) { NS_MENU_WORKLIST_ASSISTITI.apriDocumentiPaziente( data ); }),
        	prescrittore		= $('<i>', { 'class' : 'icon-user-md worklist-icon',	'title' : 'Imposta Medico Prescrittore' }).on('click', function( event ) {  NS_MENU_WORKLIST_ASSISTITI.setMedicoPrescrittore( data ); }),
        	allineamentoAnag	= $('<i>', { 'class' : 'icon-reply-all worklist-icon',		'title' : 'Tentativo di riallineamento informazioni paziente', "style" : "font-size:10px; color:green; font-weight:bold;" }).on('click', function( event ) {  NS_MENU_WORKLIST_ASSISTITI.tryUpdateAnag( data ); }),
        	iconContainer		= $('<div>');
        	/*icon-resize-horizontal*/
        
        home.MMG_CHECK.isMedico() ? iconContainer.append( cartellaAssistito, schedaAnagrafica, datiStrutturati, documenti, allineamentoAnag ) : iconContainer.append( cartellaAssistito, schedaAnagrafica, prescrittore, allineamentoAnag);
        
        //perchè qui e non sopra??? boh, io lo metto sopra e qualche Santo sarà
        /*if( home.baseUser.TIPO_UTENTE == 'A' )
        	iconContainer.append( prescrittore );*/
        
        return iconContainer;
    },
       
    setMortePaziente: function( data ){
    	
    	var iconCross 		= $(document.createElement('i')).addClass('icon-religious-christian worklist-icon').attr('title', 'Il paziente e\' deceduto');
    	var iconContainer	= $(document.createElement('div'));
    	
    	iconContainer.text( data['PAZIENTE'] );
    	if( LIB.isValid( data['DATA_MORTE'] ) ){
    		iconContainer.prepend( iconCross );
    	}
    	return iconContainer;
    },
    
    setSceltaProblema: function( data ){
    
    	var classe = home.ASSISTITO.IDEN_PROBLEMA != data.IDEN ? 'icon-check-empty' : 'icon-check-1';
    	
    	var selezionaProblema =
    	    $('<i>', {
    	        'class': classe + ' worklist-icon',
    	        'title': 'Seleziona problema'
    	    })
    	    .on('click', function () {
    	        if (classe != 'icon-check-1') {
    	            home.MAIN_PAGE.setPatientProblem(data.IDEN, data.PROBLEMA_COMPLETO);
    	        } else {
    	            home.MAIN_PAGE.unsetPatientProblem();
    	        }
    	    })
    	    .on('mouseenter', function () { 
    	        if (classe != 'icon-check-1') {
    	            $(this).addClass('icon-check-1').removeClass('icon-check-empty');
    	        }
    	    })
    	    .on('mouseleave', function () {
    	        if (classe != 'icon-check-1') {
    	            $(this).removeClass('icon-check-1').addClass('icon-check-empty');
    	        }
    	    });
    	 
		var msg = '', tipo = '';
		
		if( data.TIPO_PROBLEMA == 'ATT' )
			tipo = 'ATTIVO';
		else if( data.TIPO_PROBLEMA == 'ALT' )
			tipo = 'A LUNGO TERMINE';
		else if( data.TIPO_PROBLEMA == 'SOS' )
			tipo = 'SOSPETTO';
		else if( data.TIPO_PROBLEMA == 'PRG' )
			tipo = 'PREGRESSO';
    	
    	var stato = $(document.createElement('i')).addClass('worklist-icon').attr('title', tipo +'/'+ data.CHIUSO_DESCR);
    	var info  = $(document.createElement('i')).addClass('worklist-icon icon-info-circled');
    	
    	stato.attr('data-iden', data.IDEN);
    	
    	info.attr({
			'data-patient-summary': data.PAT_SUMMARY,
			'data-rischio':			data.RISCHIO,
			'data-medico':			data.DESCR_MED,
			'data-chiusura':		data.DATA_CHIUSURA,
			'note-chiusura':		data.NOTE_CHIUSURA,
			'data-tipo':			data.TIPO_PROBLEMA
		});
    	
    	info.on('click', function() {
			msg = '';

			if( !LIB.isValid( $(this).attr( 'data-chiusura' ) ) ) 
				msg = '<p>Tipologia: '+ tipo + '</p>';

			msg += '<p>Patient Summary: '+ ( $(this).attr( 'data-patient-summary' ) == 'S' ? 'Si' : 'No' ) + '</p>';
			msg += '<p>Patologia a rischio: '+ ( $(this).attr( 'data-rischio' ) == 'S' ? 'Si' : 'No' ) +'</p>';
			msg += '<p>Medico: '+ $(this).attr( 'data-medico' ) +'</p>';

			if( LIB.isValid( $(this).attr( 'data-chiusura' ) ) ) 
				msg += '<p>Data chiusura: '+ $(this).attr( 'data-chiusura' ) +'</p>';

			if( LIB.isValid( $(this).attr( 'note-chiusura' ) ) ) 
				msg += '<p>Note chiusura: '+ $(this).attr( 'note-chiusura' ) +'</p>';

			NOTIFICA.info({ title : data.PROBLEMA_COMPLETO, message : msg, timeout:10 });
		});
    	
    	if( data.CHIUSO == 'N' && ( data.TIPO_PROBLEMA == 'ATT' || data.TIPO_PROBLEMA == 'ALT' || data.TIPO_PROBLEMA == null) )
    		stato.addClass('icon-lock-open').addClass('green-color');
    	else if( data.CHIUSO == 'N' && data.TIPO_PROBLEMA == 'SOS' )
    		stato.addClass('icon-lock-open').addClass('yellow-color');
    	else if( data.CHIUSO == 'N' && data.TIPO_PROBLEMA == 'PRG' )
    		stato.addClass('icon-lock-open').addClass('brown-color');
    	else
    		stato.addClass('icon-lock').addClass('red-color');
    	
    	if(stato.hasClass('icon-lock-open') ) {
    		stato.on('click', function(){
				var iden = $(this).attr('data-iden');
				home.NS_MMG.confirm('Vuoi davvero chiudere il problema selezionato?', function(){
					WK_PROBLEMI.chiusuraRapida(iden,'N');
				});
			});
		}
    	
    	return $('<div>').append( selezionaProblema, stato, info,  NS_PROCESS_CLASS_MMG.processOscuramento( data ) );
    },
    
    setDescrizioneProblema: function( data ){
    	
    	var div = $( document.createElement('div') ), text;
    	
    	/* PC = PROBLEMA + CODICE ICD9, CP = CODICE ICD9 + PROBLEMA */
    	if( home.LIB.getParamUserGlobal( 'DESCRIZIONE_PROBLEMA', 'PC' ) == 'PC' ) 
    		text = data.PROBLEMA_COMPLETO;
    	else
    		text = data.PROBLEMA_COMPLETO_INVERTITO;	
    			
    	
    	return div.text( text );
    	
    },
    
    setListaUtenti:function( data ){

    	var icon_trash = $('<i>', { 'class' :'icon-trash worklist-icon', 'title' : 'Cancella' })
    		.on('click', function(){ 
    			NS_LISTA_UTENTI.cancella( data );
    		});
    	
    	var icon_open = $('<i>', { 'class' :'icon-search worklist-icon', 'title' : 'Apri' })
    		.on('click', function(){ 
    			NS_LISTA_UTENTI.apri( data );
    		});
    	
    	return $('<div>').append(icon_trash, icon_open);
    },
    
    setListaGruppi:function( data ){
		
    	var div = $('<div>');
    	
		if (NS_LISTA_GRUPPI.canModify(data)) {
			var icon_trash = $('<i>', { 'class' :'icon-trash worklist-icon', 'title' : 'Cancella' })
    		.on('click', function(){
    			NS_LISTA_GRUPPI.cancella( data );
    		});
			var icon_open = $('<i>', { 'class' :'icon-search worklist-icon', 'title' : 'Apri' })
				.on('click', function(){ 
					NS_LISTA_GRUPPI.modifica( data );
			});
			div.append(icon_trash, icon_open);
		}
		
    	return div;
    },
    
    setListaMessaggi:function( data ){
    
    	var div = $('<div>');
    	
    	var icon_trash = $('<i>', { 'class' :'icon-trash worklist-icon', 'title' : 'Cancella' })
    		.on('click', function(){
    			CENTRO_MESSAGGI.worklist.cancella( data );
    		});
		
    	var icon_reply = $('<i>', { 'class' :'icon-reply worklist-icon', 'title' : 'Rispondi' })
			.on('click', function(){ 
				CENTRO_MESSAGGI.worklist.rispondi( data );
			});

		var icon_forward = $('<i>', { 'class' :'icon-forward worklist-icon', 'title' : 'Inoltra' })
			.on('click', function(){ 
				CENTRO_MESSAGGI.worklist.inoltra( data );
		});

		if(data.MITTENTE != home.baseUser.USERNAME){ 	
			icon_trash = $('<i>', { 'class' :'icon-trash worklist-icon noIcon', 'title' : 'Cancella' })
		}

		div.append(icon_trash, icon_reply, icon_forward);
		
    	return div;
    },
    
    setOpenDocument:function( data ){
    	
    	var openDocument = 
    		$('<i>', { 'class' :'icon-doc', 'title' : 'Apri documento' })
    		.on('click', function(){ 
    			DOCUMENTI_PAZIENTE.apriDocRep(data);
    		});
    	
    	return $('<div>').append( openDocument );
    },
    
    setOpenGruppo:function( data ) {
    	var div = $('<div>');
		if (NS_LISTA_GRUPPI.canModify(data)) {
			var openGruppo = $('<i>',
				{ 'class' :'icon-search worklist-icon', 'title' : 'Apri il gruppo' }).on('click',
				function(){
					NS_LISTA_GRUPPI.modifica(data);
				}
			);
			div.append( openGruppo );
		}
    	return div;
    },
    
    showUpdateContent: function( data ){
    	
    	var icon = $(document.createElement('i')).addClass('icon-plus-squared worklist-icon');

    	icon.on('click', function(){

    		$.dialog( data.MESSAGGIO,
    				{
    			'id'				: 'dialogAggiornamenti',
    			'title'				: 'Contenuto dell\'aggiornamento del '+ data.DATA_AGGIORNAMENTO,
    			'width'				: "80%",
    			'ESCandClose'		: true,
    			'created'			: function(){ $('.dialog').focus(); },
    			'height'			: "500px",
    			'showBtnClose'		: false,
    			'content'			: data.MESSAGGIO,
    			'buttons'			: 
    				[
    				 {
    					 'label': 'Stampa',
    					 'action': function (context)
    					 {
    						 var prompts = {pIden:data.IDEN };

    						 home.NS_PRINT.print({
    							 path_report: "AGGIORNAMENTI.RPT" + "&t=" + new Date().getTime(),
    							 prompts: prompts,
    							 show: "S",
    							 output: "pdf"
    						 });
    					 }
    				 },
    				 {
    					 'label': 'Chiudi',
    					 'action': function (context)
    					 {
    						 context.data.close();
    					 }
    				 }
    				 ]
    				});
    			});
    	
    	return $(document.createElement('div')).append( icon );
    },
    
    setElencoADP:function( data ){
    	
    	var icon_print = $(document.createElement('i')).addClass('icon-print worklist-icon');
    	var icon_edit = $(document.createElement('i')).addClass('icon-pencil worklist-icon');
    	
    	icon_print.on('click', function(){ ELENCO_ADP.stampaModulo( data ); } );
    	icon_edit.on('click', function(){ 
    		if($("#PROVENIENZA").val()=='CARTELLA_OUT'){    			
    			NS_MENU_WORKLIST_ASSISTITI.apriCartellaAssistito( data , 'CARTELLA', function(){ home.NS_MMG.apri('MMG_ASSISTENZA_PROGR_V2');});
    		}else{
    			home.NS_MMG.apri('MMG_ASSISTENZA_PROGR_V2');
    		}
    		$(".butChiudi").trigger("click");
    	});
		
		return $(document.createElement('div')).append( icon_print, icon_edit );
    },
    
    setElencoConsensi:function( data ) {
    	
    	var icon_trash = $(document.createElement('i')).addClass('icon-trash worklist-icon');
    	var icon_print = $(document.createElement('i')).addClass('icon-print worklist-icon');
    	var icon_edit = $(document.createElement('i')).addClass('icon-pencil worklist-icon');
    	
    	icon_trash.on('click', function(){ WK_ELENCO_CONSENSI.cancella( data ); } );
    	icon_print.on('click', function(){ WK_ELENCO_CONSENSI.stampa( data ); } );
    	icon_edit.on('click', function(){ WK_ELENCO_CONSENSI.modifica( data ); } );
    	
    	return $(document.createElement('div')).append( icon_trash, icon_print, icon_edit );
    },
    
    setMenuDocumentiAllegati: function( data ) {
    	
    	var icon_trash = $(document.createElement('i')).addClass('icon-trash worklist-icon');
		var icon_show = $(document.createElement('i')).addClass('icon-search worklist-icon');
	
		icon_trash.on('click', function(){ DOCUMENTI_ALLEGATI.cancellaDocumento( data ); } );
		icon_show.on('click', function(){ DOCUMENTI_ALLEGATI.loadDocumento( data ); } );
		
		return $(document.createElement('div')).append( icon_trash, icon_show );
    },
    
    showStatoLettura:function( data ){
    	
    	var div = $(document.createElement('div'));
    	div.attr("id","divStatoLettura");
    	
    	if(data.DA_LEGGERE == 'S'){
			var icon_da_leggere = $(document.createElement('i')).addClass('icon-record worklist-icon sizeSmall').attr("title",traduzione.lblDaLeggere);
			icon_da_leggere.on('click', function() {
				CENTRO_MESSAGGI.worklist.setLetto( data, $(this));
			});
			div.append( icon_da_leggere );
    	}
    	
    	if(data.PRIORITA == '1'){
			var iconPriorita = $(document.createElement('i')).addClass('icon-alert worklist-icon sizeSmall').attr("title",traduzione.lblPriorita + ": " + traduzione.lblPriorita1).css("color","red");
			div.append( iconPriorita );
		}
    	return div;
    }
};

var NS_MENU_WORKLIST_ASSISTITI = {
		
	apriCartellaAssistito: function( data , funzione, callback ){
		
		if (typeof funzione == "undefined") {
			funzione = "CARTELLA";
		}
		
		var chk_cons = MMG_CHECK.checkConsenso(data, funzione);

		$.when(chk_cons.semaforo).then(function() {
			if(!chk_cons.bool){
				return;
			}
		
			if( NS_MENU_WORKLIST_ASSISTITI.mioAssistito( data.IDEN_MED_BASE ) ){
				
				home.NS_LOADING.showLoading();
				home.NS_MMG.apriCartella( data.IDEN_ANAG, 'SSN',
					function(){ 
						NS_MENU_WORKLIST_ASSISTITI.insertReminderExpiration( data );
						if( typeof callback == 'function' ){
							callback();
						}
				  } );
			
			}else{

				var frame = "<div>"+traduzione.lblMsgRegimeApertura+"</div>";
				
				var arrayButton = new Array();
				arrayButton.push( {label: traduzione.butRegimeLP, action: function() { home.$.dialog.hide(); home.NS_MMG.apriCartella( data.IDEN_ANAG, 'LP' );}});
				arrayButton.push( {label: traduzione.butRegimeAC, action: function() { home.$.dialog.hide(); home.NS_MMG.apriCartella( data.IDEN_ANAG, 'AC' );}});
				
				if (home.MMG_CHECK.isAdministrator()) {
					arrayButton.push( {label: traduzione.butRegimeSSN, action: function() { home.$.dialog.hide(); home.NS_MMG.apriCartella( data.IDEN_ANAG, 'SSN' );}});
				}
				
				arrayButton.push( {label: traduzione.butAnnulla, action: function () { home.$.dialog.hide(); }});
									 
				//home.NS_MMG.confirm("L'Assistito risulta associato ad un altro medico. Aprire la cartella con regime?", function() { home.NS_MMG.apriCartella( data.IDEN_ANAG, 'LP' ); });
				home.$.dialog(frame,{
					'id'				: "dialog",
					'title'				: traduzione.regimeApertura,
					'ESCandClose'		: true,
					'created'			: function(){ $('.dialog').focus(); },
					'width'				: 800,
					'showBtnClose'		: false,
					'modal'				: true,
					'movable'			: true,
					'buttons'			: arrayButton
				});
			}
		});
	},
		
	apriSchedaAnagrafica: function( data ){
		NS_MENU_WORKLIST_ASSISTITI.apriCartellaAssistito(data, "CARTELLA", function(){ home.NS_MMG.apri('SCHEDA_ANAGRAFICA_MMG&IDEN=', home.ASSISTITO.IDEN_ANAG ); } );
	},
		
	apriDocumentiPaziente: function( data ){
		NS_MENU_WORKLIST_ASSISTITI.apriCartellaAssistito(data, "DATI_DOCUMENTI", function () {/*home.NS_MMG.apri( 'DOCUMENTI_PAZIENTE' );*/home.NS_MMG.apriDocumentiPaziente( data );});
	},
	 
	apriDatiStrutturati: function( data ){
		
		var chk_cons = MMG_CHECK.checkConsenso(data, 'DATI_DOCUMENTI');
		
		$.when(chk_cons.semaforo).then(function() {
		
			if(!chk_cons.bool){
				return;
			}
			
			if( NS_MENU_WORKLIST_ASSISTITI.mioAssistito( data.IDEN_MED_BASE ) ){
				
				home.NS_LOADING.showLoading();
				home.NS_OBJECT_MANAGER.init( data.IDEN_ANAG, function(){
	
					home.MAIN_PAGE.setPatientInfo();	
					home.MAIN_PAGE.toggleMenu();
					
					/*
					var url =  'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioFiltro';
					url		+= '&reparto=MMG&nosologico=&elencoEsami=&numRichieste=5&idPatient='+ home.ASSISTITO.ID_REMOTO;
					url		+= '&DATA_NASC=' + home.ASSISTITO.DATA_NASCITA_ISO + '&daData=&aData=&provRisultati=&provChiamata=MMG&userLogin='+ home.baseUser.USERNAME +'&idenAnag='+ home.ASSISTITO.IDEN_ANAG + "&modalita=PAZIENTE";
					*/
				   
					home.NS_APPLICATIONS.switchTo( 'WHALE', home.NS_MMG.getWhaleUrl(), function(url_finale) {
									console.log(url_finale);
						home.NS_MMG.openUrl( url_finale, { fullscreen : false, showloading : false }, 'DATI_STRUTTURATI' );
					});
				});
				
			}else{

				var frame = "<div>"+traduzione.lblMsgRegimeAperturaFunzioneND+"</div>";
				
				var arrayButton = new Array();
				arrayButton.push( {label: traduzione.butRegimeLP, action: function() { home.$.dialog.hide(); home.NS_MMG.apriCartella( data.IDEN_ANAG, 'LP' );}});
				arrayButton.push( {label: traduzione.butRegimeAC, action: function() { home.$.dialog.hide(); home.NS_MMG.apriCartella( data.IDEN_ANAG, 'AC' );}});
				
				if (home.MMG_CHECK.isAdministrator()) {
					
					arrayButton.push( {
						label: traduzione.butRegimeSSN, 
						action: function() { 
							home.$.dialog.hide(); 
							home.NS_LOADING.showLoading();
							home.NS_OBJECT_MANAGER.init( data.IDEN_ANAG, function(){
						
								home.MAIN_PAGE.setPatientInfo();	
								home.MAIN_PAGE.toggleMenu();
								
								/*
								var url  = 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioFiltro';
								url		+= '&reparto=MMG&nosologico=&elencoEsami=&numRichieste=5&idPatient='+ home.ASSISTITO.ID_REMOTO;
								url		+= '&DATA_NASC=' + home.ASSISTITO.DATA_NASCITA_ISO + '&daData=&aData=&provRisultati=&provChiamata=MMG&userLogin='+ home.baseUser.USERNAME +'&idenAnag='+ home.ASSISTITO.IDEN_ANAG + "&modalita=PAZIENTE";
								*/
								
								home.NS_APPLICATIONS.switchTo( 'WHALE', home.NS_MMG.getWhaleUrl(), function(url_finale) {
									home.NS_MMG.openUrl( url_finale, { fullscreen : false, showloading : false }, 'DATI_STRUTTURATI' );
								});
							});
						}
					});
				}
		
				arrayButton.push( {label: traduzione.butAnnulla, action: function () { home.$.dialog.hide(); }});
									 
				//home.NS_MMG.confirm("L'Assistito risulta associato ad un altro medico. Aprire la cartella con regime?", function() { home.NS_MMG.apriCartella( data.IDEN_ANAG, 'LP' ); });
				
				home.$.dialog(frame,{
					'id'				: "dialog",
					'title'				: traduzione.regimeApertura,
					'ESCandClose'		: true,
					'created'			: function(){ $('.dialog').focus(); },
					'width'				: 800,
					'showBtnClose'		: false,
					'modal'				: true,
					'movable'			: true,
					'buttons'			: arrayButton
				});
			}
		});
	},
	
	//function che controlla se il paziente puo' essere visualizzato dall'utente (gruppo o medico curante).
	mioAssistito: function( IDEN_MED_BASE ) {
		
		home.WORKLIST_RICERCA.idenMedBase = IDEN_MED_BASE;
		
		return NS_MMG_UTILITY.checkPresenzaInArray( home.WORKLIST_RICERCA.gruppoMedico.split(','), home.WORKLIST_RICERCA.idenMedBase );
	},
	
    setMedicoPrescrittore: function( data ){
    	
    	home.NS_MMG.apri( 'INSERIMENTO_MEDICO', '&IDEN_ANAG='+ data.IDEN_ANAG );
    },
    
    /*
     * INSERISCE UN PROMEMORIA NELLA BACHECA SE LA DATA DI SCADENZA DELL'ASSISTENZA DEL MEDICO PER IL PAZIENTE CORRENTE E' 
     * MINORE DI 30 GIORNI DAL MOMENTO IN CUI SI APRE LA CARTELLA PAZIENTE
     */
    insertReminderExpiration: function( data ){
    	
    	if( LIB.isValid( home.ASSISTITO.SCADENZA_ASSISTENZA ) ){
    	
	    	var oggi		= moment( moment().format('YYYYMMDD'),'YYYYMMDD' );
	    	var	scadenza	= moment( home.ASSISTITO.SCADENZA_ASSISTENZA, 'YYYYMMDD' );
	    
	    	var obj = {
	    		'iden_anag'		: data.IDEN_ANAG,
	    		'text'			: 'Il giorno '+ scadenza.format('DD/MM/YYYY') +' scadra\' l\'assistenza del medico per il paziente '+ data.PAZIENTE,
	    		'data_inizio'	: moment().format('YYYYMMDD'),
	    		'data_fine'		: moment(home.ASSISTITO.SCADENZA_ASSISTENZA, "YYYYMMDD").add( 1, 'M').format('YYYYMMDD'),
	    		'priorita'		: 3,
	    		'sezione'		: 'BACHECA_SCADENZA_ASSISTENZA',
	    		'note'			: 'Questo promemoria e\' stato inserito automaticamente'
		   	};
	  
	    	if( scadenza.diff( oggi, 'days' ) <= 30 && home.ASSISTITO.PROMEMORIA_SCADENZA <= 0 )  {
	    		
	    		home.NS_MMG_UTILITY.insertPromemoria(obj);
	    	}	   
    	}
    },
    
    tryUpdateAnag:function(rec){
    	
    	var dialog = home.NS_MMG.confirm("ATTENZIONE!!! Questa operazione NON è necessaria nel caso in cui il paziente abbia le informazioni allineate (esenzioni, associazione medico paziente).<br><br>"+
    			"L'operazione tenterà di allineare le informazioni collegate al paziente a quelle presenti su AAC " +
        			".<br>Nel caso in cui non vengano allineate al primo tentativo, " +
        			"contattare l'assistenza.<br><br> ATTENZIONE!!! Non è necessario effettuare nuovi tentativi di riallineamento." +
        			" Continuare con l'operazione?",function() {
    		
    		NS_LOADING.showLoading();
    		
    		home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
				datasource:"WHALE",
				id:'ALLINEA_ANAG_VS_AAC_VOUT',
				parameter: {
					p_iden_anag			: { v : rec.IDEN_ANAG, t : 'N'},
					p_iden_per			: { v : home.baseUser.IDEN_PER, t : 'N'},
					vOut				: { v : null, t : 'V' , d: 'O'}
				}
			}).done( function(resp) {
				home.NOTIFICA.info({
					title: "Operazione eseguita",
					message: resp.vOut,
					timeout:"15"
				});
				
				//rieffettuo la ricerca con i parametri precedentemente inseriti
				if(home.WORKLIST_RICERCA.butLastAccess.hasClass("selected")){
					home.WORKLIST_RICERCA.butLastAccess.removeClass("selected");
					home.WORKLIST_RICERCA.butLastAccess.trigger("click");
				}else{					
					home.WORKLIST_RICERCA.butApplica.trigger("click");	
				}
				
				NS_LOADING.hideLoading();
				
			}).fail( function(resp) {
				home.NOTIFICA.error({
					title:traduzione.lblErrorSave,
					message:traduzione.lblNoSave
				});
				NS_LOADING.hideLoading();
			});
			dialog.destroy();
		});
    }
};

var NS_MENU_APPUNTI = {
		
		whereModifica: function( rec ) {
			return rec.length == 1;
		},
		
		modifica: function( rec, n_scheda ){
			home.NS_MMG.reloadPage( n_scheda, 'APPUNTI', '&IDEN=' + rec[0]['IDEN'] );
		},
		
		whereElimina: function( rec ){
			return rec.length == 1;
		},
		
		elimina: function( rec ){
			
			var parameters = { 'nIden' :  { 'v' : rec[0].IDEN, 't' : 'N' } };
			
			$.NS_DB.getTool({
				_logger: home.logger 
			}).call_function({
				id:			'MMG.ELIMINA_APPUNTI',
				parameter:	parameters
			}).done(function( response ){
				if( typeof response.p_result != 'undefined' ){
					home.NOTIFICA.success( { 
						title:		'Successo!',
						message:	response.p_result 
					});
					home.APPUNTI.loadWk();
				}
			}).fail(function( jqXHR, textStatus, errorThrown ) {
				home.logger.error('Errore NS_MENU_APPUNTI.elimina: ' + errorThrown );
			});
		},
		
		whereStampa: function( rec ){
			return rec.length == 1;
		},
		
		stampa: function( rec ){
			var vIden		= rec[0].IDEN; 
			var v_report	= 'APPUNTI_MEDICO.RPT';
			var prompts 	= {
				pIden:		vIden, 
				pIdenPer:	home.baseUser.IDEN_PER
			};

			home.NS_PRINT.print({
				path_report:	v_report + '&t=' + new Date().getTime(),
				prompts: 		prompts,
				show: 			LIB.getParamUserGlobal( 'ANTEPRIMA_STAMPA_MODULI', 'N' ),
				output: 		'pdf'
			});
			
			home.APPUNTI.toPrint = false;
		}
	};

