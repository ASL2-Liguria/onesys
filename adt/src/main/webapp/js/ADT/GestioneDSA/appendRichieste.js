/**
 * Nasmespace per la gestione degli elementi creati dinamicamente
 * */
NS_APPEND_RICHIESTE ={
	/**
	 * Funzione per la creazione della tabella dove vengono
	 * inseriti i quesiti, quadri, ecc
	 * */	
	creaIntestazioneTable : function(){
		var tr = document.createElement("tr");
		var thEsame = document.createElement("th");
		var thErogatore = document.createElement("th");
		var thQuesito = document.createElement("th");
		var thQuadro = document.createElement("th");
		var thNote = document.createElement("th");
		var thDataProp = document.createElement("th");
		var thOraProp = document.createElement("th");
		var thFlagOE =  document.createElement("th");
		
		thFlagOE.innerText='OE';
		thDataProp.innerText = "DATA PROPOSTA";
		thOraProp.innerText = "ORA PROPOSTA";
		thEsame.innerText = "ESAMI";
		thErogatore.innerText = "EROGATORE";
		thQuesito.innerText = "QUESITO";
		thQuadro.innerText = "QUADRO";
		thNote.innerText = "NOTE";
		$(tr).addClass("trIntestazione");
		
		tr.appendChild(thDataProp);
		tr.appendChild(thOraProp);
		tr.appendChild(thEsame);
		tr.appendChild(thFlagOE);
		tr.appendChild(thErogatore);
		tr.appendChild(thQuesito);
		tr.appendChild(thQuadro);
		tr.appendChild(thNote);
		$("#colAltriDati").find("table.campi").append(tr);
	},
	/**
	 * Funzione che popola la tabella di cui sopra, per ogni prestazione,
	 * con il nome esame, provenienza, ecc...
	 * */
	creaTrTable : function(jsonRichieste){	
		var dataProp =$("#DATA_OE").val();
		var oraProp;
		$("#colAltriDati").find("tr.trDati").remove();
		var jsonSegRich = [];
		for ( var i = 0; i < jsonRichieste.length; i++) {
			jsonSegRich = jsonRichieste[i];					
			var tr = document.createElement("tr");
			var tdEsami = document.createElement("td");
			var tdErogatore = document.createElement("td");
			var tdQuesito = document.createElement("td");
			var tdQuadro = document.createElement("td");
			var tdNote = document.createElement("td");
			var tdDataProp = document.createElement("td");
			var tdOraProp = document.createElement("td");
			var tdchkOE = document.createElement("td");
			var taQuesito = document.createElement("textarea");
			var taQuadro = document.createElement("textarea");
			var taNote = document.createElement("textarea");
			var inputDataProp = document.createElement("input");
			var inputOraProp = document.createElement("input");
			var chkOE = document.createElement("input");
			var cmbEsa = document.createElement("select");
			
			chkOE.setAttribute("type","checkbox");
			var tdInput=document.createElement("input");
			/*if (!jsonSegRich.MULTI_EROGATORE){
				for ( var j = 0; j < jsonSegRich.ESAMI.length; j++) {
					//alert( jsonSegRich.ESAMI[j]);
					//logger.debug(jsonSegRich.ESAMI[j].ESAME);
					tdEsami.innerText += (j+1)+") "+jsonSegRich.ESAMI[j].ESAME+" \n";
				}
			}
			else{
				for ( var j = 0; j < jsonSegRich.ESAMI.length; j++) {
						$("<option id=esa"+jsonSegRich.ESAMI[j].IDEN_ESA+" value=" +jsonSegRich.ESAMI[j].IDEN_ESA+">"+jsonSegRich.ESAMI[j].ESAME+"</option>").appendTo(cmbEsa);	
					}
				tdEsami.appendChild(cmbEsa);
			}*/
			var flgcmb=false;
			for ( var j = 0; j < jsonSegRich.ESAMI.length; j++) {
				if (jsonSegRich.ESAMI[j].MULTI_EROGATORE){
					cmbEsa.setAttribute("id","cmbEsa_"+jsonSegRich.ESAMI[j].CODICE_REGIONALE);
					$("<option id=esa"+jsonSegRich.ESAMI[j].IDEN_ESA+" value=" +jsonSegRich.ESAMI[j].IDEN_ESA+">"+jsonSegRich.ESAMI[j].ESAME+"</option>").appendTo(cmbEsa);
					flgcmb=true;
				}
				else{
					tdEsami.innerText += (j+1)+") "+jsonSegRich.ESAMI[j].ESAME+" \n";
				}
			}
			if (flgcmb) {tdEsami.appendChild(cmbEsa);}
			tdErogatore.innerText = jsonSegRich.EROGATORE;
			tdDataProp.className = "tdData";
			tdOraProp.className = "tdText";
			$(tdOraProp).addClass("oracontrol");
			$(tdOraProp).addClass("w80px");
			tdQuesito.className = "tdTextarea";
			tdQuadro.className = "tdTextarea";
			tdNote.className = "tdTextarea";
			taQuesito.className = "autoText";
			taQuadro.className = "autoText";
			taNote.className = "autoText";
			tdchkOE.className="tdCheckbox";
			inputOraProp.setAttribute("type", "text");
			inputOraProp.setAttribute("id", "txtOraProp_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA);
			inputDataProp.setAttribute("type", "text");
			inputDataProp.setAttribute("id", "txtDataProp_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA);
			taQuesito.setAttribute("id", "taQuesito_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA);
			taQuesito.innerText=jsonSegRich.QUESITO;
			taQuadro.setAttribute("id", "taQuadro_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA);
			taNote.setAttribute("id", "taNote_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA);			
			$(tr).addClass("trDati");
			tr.setAttribute("id", i);
			if (!jsonSegRich.MULTI_EROGATORE) {
				chkOE.checked=true;
			}
			chkOE.setAttribute("id","chkOE"+i);
			tdOraProp.appendChild(inputOraProp);
			tdDataProp.appendChild(inputDataProp);
			tdQuesito.appendChild(taQuesito);
			tdQuadro.appendChild(taQuadro);
			tdNote.appendChild(taNote);
			tdchkOE.appendChild(chkOE);
			tr.appendChild(tdDataProp);
			tr.appendChild(tdOraProp);
			tr.appendChild(tdEsami);
			tr.appendChild(tdchkOE);
			tr.appendChild(tdErogatore);
			tr.appendChild(tdQuesito);
			tr.appendChild(tdQuadro);
			tr.appendChild(tdNote);				
			$("#colAltriDati").find("table.campi").append(tr);
			
			//script per il plugin della data
			$("#txtDataProp_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA).Zebra_DatePicker({
				startWithToday:true, readonly_element: false, 
				format:'d/m/Y', months:(traduzione.Mesi).split(','),
				days:(traduzione.Giorni).split(',')});
			$("#txtDataProp_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA).maskData({});
			
			//script dell'ora
			$('td.oracontrol input')
	        .live()
	        .setMask("29:59")
	        .val(moment().format('HH:mm'))
	        .keypress(function() {
	            var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	            if (newMask != currentMask) {
	                $(this).setMask(newMask);
	            }
	        })
	        if (moment(dataProp,'YYYYMMDD')>moment()){
	        	var d=dataProp.substring(6)+'/'+dataProp.substring(4,6)+'/'+dataProp.substring(0,4);
				$("#txtDataProp_"+ jsonSegRich.COD_DEC+jsonSegRich.METODICA).val(d);
				$('td.oracontrol input').val("08:00");
			};
		//	alert("creaTrTable : \n" + jsonSegRich);
			//setto i campi obbligatori
	        NS_APPEND_RICHIESTE.campiObbligatori(jsonSegRich);		
		}		
		//autosize delle textarea
        $("textarea.autoText").autosize();        
	},
	/**
	 * Aggiunge al Json delle richieste le informazioni ottenute dai campi 
	 * creati dinamicamente di quesito, quadro ecc..
	 * */
	addValueJSON : function(){
		var dataprop;
		var oraprop;
		
		for ( var i = 0; i < NS_INVIA_RICHIESTE.jsonRichieste.length; i++) {
			var jsonSegRich = NS_INVIA_RICHIESTE.jsonRichieste[i];
			for ( var j = 0; j < jsonSegRich.ESAMI.length; j++) {				
				jsonSegRich.QUESITO = $("#taQuesito_" + jsonSegRich.COD_DEC+jsonSegRich.METODICA).val();
				jsonSegRich.QUADRO = $("#taQuadro_" + jsonSegRich.COD_DEC+jsonSegRich.METODICA).val();
				jsonSegRich.NOTE = $("#taNote_" + jsonSegRich.COD_DEC).val();
				dataprop=$("#txtDataProp_" + jsonSegRich.COD_DEC+jsonSegRich.METODICA).val();
				jsonSegRich.DATA_PROPOSTA = dataprop.substring(6)+dataprop.substring(3,5)+dataprop.substring(0,2);
				oraprop=$("#txtOraProp_" + jsonSegRich.COD_DEC+jsonSegRich.METODICA).val();
				oraprop=oraprop.replace(':','');
				jsonSegRich.ORA_PROPOSTA = oraprop;
				//alert("add value : \n" + jsonSegRich.DATA_PROPOSTA+"\n"+jsonSegRich.ORA_PROPOSTA);
			}
		}
		
	},
	/**
	 * Rende obbligatorie le textarea del quesito e del quadro clinico(create dinamicamente),
	 * a seconda della metodica
	 * */
	campiObbligatori : function(jsonSegRich){	
		//alert("campiObbligatori : \n" + JSON.stringify(jsonSegRich));
		if(jsonSegRich.METODICA == "1" || jsonSegRich.METODICA == "2" || 
				jsonSegRich.METODICA == "3" || jsonSegRich.METODICA == "4" || jsonSegRich.METODICA == "V" || 
				jsonSegRich.METODICA == "W" || jsonSegRich.METODICA == "X"){
			var name = "taQuesito_SAVON";//"taQuesito_"+ jsonSegRich.COD_DEC;
			V_DSA_INS_RICHIESTE.elements.taQuesito_SAVON =
					{tab : "tabPrest", name : "Quesito "+jsonSegRich.EROGATORE ,"status":"required"};
//			NS_RICHIEDI_PREST_DSA.validator.attach($("#taQuadro_"+ jsonSegRich.COD_DEC),
//					{tab : "tabPrest", "name" : "Quadro "+jsonSegRich.EROGATORE ,"status":"required"});
			//alert(V_DSA_INS_RICHIESTE);
			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_DSA_INS_RICHIESTE"});

		}
	}
};