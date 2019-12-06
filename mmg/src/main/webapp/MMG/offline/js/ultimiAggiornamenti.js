var ULTIMI_AGGIORNAMENTI = {

	init: function() {
		/*Lasciare immutata la riga seguente*/
		var vOffline=14;
		$("#divVersioneOffline").text("Release: " + vOffline);
		$("#butAggiorna").addClass("butAggiorna");
		$("#butReimporta").addClass("butReimporta");
		$.when(NS_OFFLINE.semaforo_utente).then(function(){
			ULTIMI_AGGIORNAMENTI.createList();
			ULTIMI_AGGIORNAMENTI.setEvents();
		});
	},
	
	setEvents: function() {
		$("#li-tabUltimiAggiornamenti").on("click",function(){
			/*Sull'apertura del tab faccio alcuni refresh*/
			ULTIMI_AGGIORNAMENTI.refreshEventiDaInviare();
		});
		
		$("#butAggiorna").on( 'click', function() {
			NS_OFFLINE.sync_all(1);
		} );

		$("#butReimporta").on( 'click', function() {
			home_offline.NS_OFFLINE_TOP.confirm( traduzione.lblUltimiAggiornamentiReimporta, function() {
				NS_OFFLINE.sync_all(2);
			});
		});
		

		if(LIB.getIEVersion() < 0) {
			$("#butCreaShortcut").on('click', function() {
				var url;
				var filename;
				$.get("MMG/offline/link.html", function (data) {
					var newData = data.replace("#URL#",window.location);
					var newDataEncoded = encodeURIComponent(newData);
					var link = document.createElement("a");
					link.href = "data:text/html;," + newDataEncoded;
					link.download = document.title + ".html";
					link.click();
				});
			});
			$(".dontShowChrome").hide();
		} else {
			$("#butCreaShortcut").hide();
			$(".dontShowIE").hide();
		}

		if(home.baseUser.GRUPPO_PERMESSI.indexOf("SUPER_ADMIN") > 0 || LIB.getIEVersion() > 0) {
			/*Funziona solo su IE*/
			$("#butRicaricaPagine").on( 'click', function() {
				home_offline.NS_OFFLINE_TOP.confirm( traduzione.lblRicaricaPagine, function() {
					NS_OFFLINE.wipeCache();
				});
			});
		} else {
			$("#divRicaricaPagine").hide();
		}
		
		$("#butEventiDaElaborareInvia").on("click", function() {
			$.when(NS_OFFLINE.syncEventi(true)).then(function(){
				ULTIMI_AGGIORNAMENTI.refreshEventiDaInviare();
			});
		});

	},
	
	eventi_da_inviare: 0,
	
	refreshEventiDaInviare: function() {
		return NS_OFFLINE.getEVENTI().count().done(function(data) {
			
			ULTIMI_AGGIORNAMENTI.eventi_da_inviare = data;

			$("#eventiDaElaborare").text(data);
			$("#eventiAggiornamento").text(moment(NS_OFFLINE_UPDATES.getUpdateDate("EVENTI")).format( 'DD/MM/YYYY - HH:mm' ));
			
			if (data > 0 && LIB.getIEVersion() < 0) {
				var scarica = "<elementi>";
				
				var ev = NS_OFFLINE.getEVENTI().each(function(item) {
					scarica += "<elemento>" + json2xml(item.value) + "</elemento>";
				});				
				ev.done(function() {
					scarica += "</elementi>";
					$("#eventiScarica").html("(<a id='backup_mmg_offline' target='_blank' href='data:text/xml;," + encodeURIComponent(scarica) + "' download='backup_mmg_offline_" + moment().format("YYYYMMDDHHmm") + ".xml'>scarica una copia</a>)");
				});
			} else {
				$("#eventiScarica").empty();
			}
		});
	},
	
	createListElement: function(tabella, sottoinsieme, descrizione, queryparam_custom) {
		if (typeof sottoinsieme == "undefined")
			sottoinsieme = "";
		var tabella_sottoinsieme = tabella + sottoinsieme;
		if (typeof descrizione == "undefined")
			descrizione = tabella.toUpperCase();
		if (typeof queryparam_custom == "undefined")
			queryparam_custom = {};
		
		var li = $( document.createElement('li') ),
			data	= NS_OFFLINE_UPDATES.getUpdateDate( tabella_sottoinsieme ),
			text	= '';
		
		text = 'Aggiornamento <strong>'+ descrizione + '</strong> effettuato il <strong class="dataAggiornamento">' + moment( data ).format( 'DD/MM/YYYY - HH:mm' ) +'</strong>';
		
		li.attr("id", "ultimoAggiornamento" + tabella_sottoinsieme);
		li.html( text );
		li.append( ULTIMI_AGGIORNAMENTI.getButReimporta(tabella, tabella_sottoinsieme, sottoinsieme, descrizione, queryparam_custom));
		li.append( ULTIMI_AGGIORNAMENTI.getButAggiorna(tabella, tabella_sottoinsieme, sottoinsieme, descrizione, queryparam_custom));
		$("<span class='progressAggiornamento'></span>").appendTo(li);
		return li;
	},
	
	createList: function() {
		
		var ul = $( document.createElement('ul') ).addClass('data-list' );
		
		for( var tabella in home_offline.NS_OFFLINE.TABLE_DA_SINCRONIZZARE ) {
			if (tabella == "ASSISTITI") {
				for (var i=0; i < UTENTE.IDEN_MEDICI_GRUPPO.length; i++) {
					var iden_utente = UTENTE.IDEN_MEDICI_GRUPPO[i];
					if (!OFFLINE_LIB.sincronizzazioneGruppo() && iden_utente != home.baseUser.IDEN_PER) {
						continue;
					}
					NS_OFFLINE.TABLE.PERSONALE.index("IDEN_PER").get(iden_utente).done(function(record) {
						if (typeof record != "undefined") {
							if (record.TIPO == "M") {
								/*
								 * Occhio a non valorizzare variabili fuori dal done, che qui potrebbero avere valori diversi causa asincronicita'
								 */
								var sottoinsieme = record.IDEN_PER;
								var queryparam_custom = {iden_med_base: record.IDEN_PER};
								var li = ULTIMI_AGGIORNAMENTI.createListElement("ASSISTITI", sottoinsieme, "ASSISTITI di " + record.DESCRIZIONE, queryparam_custom);
								li.appendTo( ul );
							} else {							
								console.error("IDEN_PER " + iden_utente + " contenuto in IDEN_MEDICI_GRUPPO ma non medico");
							}
						} else {
							console.error("IDEN_PER " + iden_utente + " non presente in PERSONALE");
						}
					});
				}
			} else {
				var li = ULTIMI_AGGIORNAMENTI.createListElement(tabella);
				li.appendTo( ul );
			}
		}
		
		$('#listaUltimiAggiornamenti').empty().append( ul );
		
	},
	
	getButAggiorna: function(tabella, tabella_sottoinsieme, sottoinsieme, descrizione, queryparam_custom) {
		var but = $("#butAggiorna").clone();
		but.attr("id", "butAggiorna" + tabella_sottoinsieme);
		but.on("click", function() {
			NS_OFFLINE_UPDATES.sync( tabella, {forza: 1, ritardo: 100, queryparam_custom: queryparam_custom, sottoinsieme: sottoinsieme} );
		}).show();
		return but;
	},
	
	getButReimporta: function( tabella, tabella_sottoinsieme, sottoinsieme, descrizione, queryparam_custom) {
		var but = $("#butReimporta").clone();
		but.attr("id", "butReimporta" + tabella_sottoinsieme);
		but.on( 'click', function() {
			home_offline.NS_OFFLINE_TOP.confirm( traduzione.lblUltimiAggiornamentiReimporta, function() {
				NS_OFFLINE_UPDATES.sync( tabella, {forza: 2, ritardo: 250, queryparam_custom: queryparam_custom, sottoinsieme: sottoinsieme} );
			});
		}).show();
		return but;
	},
	
	syncing: {
	},
	
	iAmSyncing: function() {
		var bool = false;
		for (b in ULTIMI_AGGIORNAMENTI.syncing) {
			bool = bool || ULTIMI_AGGIORNAMENTI.syncing[b];
		}
		return bool;
	},
	
	updateProgress: function (tabella_sottoinsieme, html, end) {
		var tab = $("#li-tabUltimiAggiornamenti");
		if (!end) {
			ULTIMI_AGGIORNAMENTI.syncing[tabella_sottoinsieme] = true;
			var loading = " <div class='ultimiAggiornamentiLoading'>&nbsp;</div>";
			if ($(".ultimiAggiornamentiLoading", tab).length == 0)
				tab.append($(loading));
			html += loading;
		} else {
			ULTIMI_AGGIORNAMENTI.syncing[tabella_sottoinsieme] = false;
			if (!ULTIMI_AGGIORNAMENTI.iAmSyncing()) {
				$(".ultimiAggiornamentiLoading", tab).remove();
			}
			$("#ultimoAggiornamento" + tabella_sottoinsieme).each(function(){
				$(".ultimiAggiornamentiLoading", this).remove();
				var data = NS_OFFLINE_UPDATES.getUpdateDate( tabella_sottoinsieme);
				$(".dataAggiornamento", this).text(moment( data ).format( 'DD/MM/YYYY - HH:mm' ) );
			});
		}
		$("#ultimoAggiornamento" + tabella_sottoinsieme + " .progressAggiornamento").html(" - " + html);
	}

};