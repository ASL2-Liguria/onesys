// definisco le chiamate a funzionalità già presenti
var strDefaultPulsanteApriInterfaccia = "Apri interfaccia di configurazione";

// linkInterfaccia: valorizzato se si può chiamare funzionalità già esustenti
// urlIFrameGestione: valorizzato se è stata fatta una nuova interfaccia ad hoc,
// altrimenti viene caricata la tabella basandosi su jsonDataInfo
var jsonNoteSezioni = 
{"elencoSezioni":[
				{"T_CDC":{"legenda":"", "nota":"", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().manu_tab('amb_T_CDC');", "urlIFrameGestione":"","iFrame_height":"300px"}},
				{"T_SALE":{"legenda":"Nota bene", "nota":"Ricordarsi di inserire il codice cdc per i flussi. I campi \"Riga...\" possono esser utili per i report.", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().manu_tab('amb_T_SALE');", "urlIFrameGestione":"","iFrame_height":"300px"}},
				{"T_SALE2":{"legenda":"Nota bene", "nota":"Ricordarsi di rendere prenotabili e accessibili al CUP le aree.", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().manu_tab('amb_T_SALE');", "urlIFrameGestione":"","iFrame_height":"300px"}},
				{"T_ESA":{"legenda":"Nota bene", "nota":"Ricordarsi di compilare il \"Codice 4\", campo utilizzato per i flussi.", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().manu_tab('T_ESA');", "urlIFrameGestione":"","iFrame_height":"300px"}},
				{"CUP_TAB_ESA":{"legenda":"Nota bene", "nota":"Funzionalita' per la gestione associazione codici prestazioni ai codici cup, \"Ises\" incluso ", "livelloWarning":"", "linkInterfaccia":"", "urlIFrameGestione":"gestConfigCupTabEsa.html","iFrame_height":"300px"}},
				{"T_SALE3":{"legenda":"Nota bene", "nota":"Entrare nell'elenco delle aree ed associare le prestazioni.", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().manu_tab('amb_T_SALE');", "urlIFrameGestione":""}},
				{"T_WEB":{"legenda":"", "nota":"", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().manu_tab('T_WEB', '105,*');", "urlIFrameGestione":"","iFrame_height":"300px"}},
				{"CONFIGURA_STAMPE":{"legenda":"", "nota":"", "livelloWarning":"", "linkInterfaccia":"", "urlIFrameGestione":"gestConfigStampeFirma.html","iFrame_height":"300px"}},
				{"MODULI_CONSOLE":{"legenda":"", "nota":"", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().apri('gestioneFormat');", "urlIFrameGestione":"","iFrame_height":"300px"}},
				{"REPORT_FILE":{"legenda":"Nota bene", "nota":"Ricordarsi di copiare i file dei report nella opportuna cartella del nuovo cdc creato.", "livelloWarning":"", "linkInterfaccia":"", "urlIFrameGestione":"","iFrame_height":"300px"}}	,
				{"CONFIGURA_XDS":{"legenda":"", "nota":"", "livelloWarning":"", "linkInterfaccia":"", "urlIFrameGestione":"gestConfigXDS.html","iFrame_height":"300px"}},
				{"AGENDA":{"legenda":"Nota bene", "nota":"Impostare come numero giorni il valore 365 e come data di partenza la giornata di ieri", "livelloWarning":"", "linkInterfaccia":"javascript:getHomeFrame().apri('agendaInizio');", "urlIFrameGestione":"","iFrame_height":"300px"}},
				{"CUP_TAB_AGENDE":{"legenda":"Nota bene", "nota":"Funzionalita' per configurare il legame tra agenda Ambulatorio e agenda su Cup.", "livelloWarning":"", "linkInterfaccia":"", "urlIFrameGestione":"gestConfigCupTabCdc_CupTabAgende.html","iFrame_height":"300px"}}
]};


// qui descrivo come recuperare i dati e come salvarli
// ATTENZIONE all'ordinamento dei campi: DEVE matchare quello di 
// gestione nello statement
var jsonDataInfo = 
{"elencoSezioni":	
	[
	 {"CUP_TAB_ESA":{"stmToLoad":"getDati_CUP_TAB_ESA","fieldsToLoad":[
		{"nomedb":"COD_ESA","th_value":"Cod.prestazione"},
		{"nomedb":"DESCR","th_value":"Descr.prestazione"},
		{"nomedb":"ISES","th_value":"COD_ISES_UE - UNER_STRT0"}
		],
	 	"fieldsToCreateDelStm":[
		{"nomedb":"COD_ESA"},
		{"nomedb":"ISES"}
		],
	 "fieldsToInsert":[
					   {"nomedb":"COD_ESA","descr":"Codice prestazione","tipoControllo":"combo","defaultValue":"","stmToInitDeafaultValue":"getAllCodEsa", "tipoDato":"S", "maxLung":6, "upCase":true, "obbligatorio":"N", "extra_attributi":[{"attributo":"onchange", "valore":"javascript:$('#DESCR').val(getText('COD_ESA'));"},{"attributo":"daSalvare", "valore":"S"}]},
					   {"nomedb":"DESCR","descr":"Descrizione","tipoControllo":"text","defaultValue":"","stmToInitDeafaultValue":"", "tipoDato":"S", "maxLung":60, "upCase":false, "obbligatorio":"N", "extra_attributi":[{"attributo":"daSalvare", "valore":"S"}]},
					   {"nomedb":"ISES","descr":"Codice Ises","tipoControllo":"text","defaultValue":"","stmToInitDeafaultValue":"", "tipoDato":"S", "maxLung":50, "upCase":true, "obbligatorio":"N", "extra_attributi":[{"attributo":"daSalvare", "valore":"S"}]}],
	 "stmToSave":"setDati_CUP_TAB_ESA",
	 "stmToDel":"delDati_CUP_TAB_ESA"
	 }},
	{"CUP_TAB_AGENDE":{"stmToLoad":"getDati_CUP_TAB_AGENDE","fieldsToLoad":[
		{"nomedb":"COD_ISES_UE","th_value":"COD_ISES_UE - UNER_STRT0"},
		{"nomedb":"CUP_DESCR_CDC","th_value":"CUP UE"},
		{"nomedb":"STZE_STRT0","th_value":"STZE_STRT0"},
		{"nomedb":"CUP_DESCR_SALA","th_value":"CUP Stanza"},
		{"nomedb":"IDEN_ARE","th_value":"Iden_are"},
		{"nomedb":"AMBU_DESCR_AREA","th_value":"AMBU Area"},
		{"nomedb":"ambu_descr_cdc","th_value":"AMBU Cdc"}
		],
		"fieldsToCreateDelStm":[
		{"nomedb":"COD_ISES_UE"},
		{"nomedb":"STZE_STRT0"}
		],
	 "fieldsToInsert":[],
	 "stmToSave":"setDati_CUP_TAB_AGENDE",
	 "stmToDel":"delDati_CUP_TAB_AGENDE"
	 }}	 
	]
}