$(function(){
	POS_TER_CRONICA.init();
	POS_TER_CRONICA.setEvents();
});

var $appSuccessivi;

var colors = ['black', 'red', 'blue', 'purple', 'maroon', 'olive'];

var tableExists = false;

var days = 7;

var offset_days = 0;

var prompts = { pIdenAnag: home.ASSISTITO.IDEN_ANAG, pIdenPer: $("#IDEN_MED_PRESCR").val() };

var POS_TER_CRONICA = {
		
		objFarmaci : null,
		
		init:function(){
			
			POS_TER_CRONICA.objFarmaci = home.RICETTA_FARMACI.getObjSalvataggio();
			$("#butImposta").addClass("butVerde");
			POS_TER_CRONICA.buildIntestazione();
//			POS_TER_CRONICA.buildTables();
			POS_TER_CRONICA.buildFalseTables();
			
			$('#h-txtAData').val(moment().add(7, 'days').format('YYYYMMDD'));
            $('#txtAData').val(moment().add(7, 'days').format('DD/MM/YYYY'));
            
//            POS_TER_CRONICA.buildCalendar();
			
			$(".butSalva").hide();
			
			$appSuccessivi = $(".pos_input").contextMenu(menuApplicaAiSuccessivi, {
				openSubMenuEvent 	: "mousedown",
				openInfoEvent 		: "mousedown"
			});
		},
		
		setEvents:function(){
			$(".butStampa").on("click", function(){
				POS_TER_CRONICA.stampa();
			});
			
			$("body").on("keyup",function(e) 
					{
			    if(e.keyCode == 13){
			    	if(POS_TER_CRONICA.checkDate()){
				    	if(tableExists){
				    		home.NS_MMG.confirm("Ripulire il calendario?", function(){
				    			$("#fldFarmaciFirst").hide();
								POS_TER_CRONICA.pulisciCalendario();
								POS_TER_CRONICA.buildTables();
								POS_TER_CRONICA.buildCalendar();
							});
				    	}else{
				    		$("#fldFarmaciFirst").hide();
					    	POS_TER_CRONICA.buildTables();
					    	POS_TER_CRONICA.buildCalendar();
				    	}
			    	}
			    }
			});
			
			$("#butImposta").on("click", function(){
				if(POS_TER_CRONICA.checkDate()){
					if(tableExists){
			    		home.NS_MMG.confirm("Ripulire il calendario?", function(){
			    			$("#fldFarmaciFirst").hide();
							POS_TER_CRONICA.pulisciCalendario();
							POS_TER_CRONICA.buildTables();
							POS_TER_CRONICA.buildCalendar();
						});
			    	}else{
			    		$("#fldFarmaciFirst").hide();
				    	POS_TER_CRONICA.buildTables();
				    	POS_TER_CRONICA.buildCalendar();
			    	}
				}
			});
			
			$("#butPulisci").on("click", function(){
				if(tableExists){
					home.NS_MMG.confirm("Ripulire il calendario?", function(){
						POS_TER_CRONICA.pulisciCalendario();
						tableExists = false;
					});
		    	}
			});
		},
		
		checkDate: function(){
			
			// di default come data di inizio viene presa quella odierna
			var start = $('#h-txtDaData').val() == ''? moment().format('YYYYMMDD') : $('#h-txtDaData').val();
			// di default come data di fine presa quella di una settimana a partire da oggi
			var end = $('#h-txtAData').val() == ''? moment().add(7, 'days').format("YYYYMMDD") : $('#h-txtAData').val();
			
			/*** gia' che ci siamo mettiamo un controllino sulle date ***/
			
			if(end - start < 0){
				
				home.NOTIFICA.warning({
                    message		: "Intervallo di date non valido. Data fine terapia antecedente a quella di inizio.",
                    title		: "Attenzione",
                    timeout		: 8
				});
				return false;
			}else{

				offset_days = moment(start,"YYYYMMDD").diff(moment(moment().format('YYYYMMDD'),"YYYYMMDD"),"days");
				days = moment(end,"YYYYMMDD").diff(moment(start,"YYYYMMDD"),"days");
				return true;
			}
		},
		
		buildIntestazione: function(){
			
			var vIntestazione = $("#fldIntestazione table");
			
			vIntestazione.append( 
					$("<tr/>", { "class" : 'separator' } )
						.append(
							$("<td/>", { "class":"label informativa"})
								.append(
										$('<label>'+traduzione.lblInformativa+'<br>'+traduzione.lblInformativa2+'<br>'+traduzione.lblInformativa3+'</label>', { 'class' : 'label_separator' })
							))
							.append($(document.createElement('i')).addClass('icon-cancel-squared').attr({'title': 'Elimina'}).on('click', function(){POS_TER_CRONICA.elimina()})
							)
					);
		},

		buildCalendar: function(){
			
			/*** OCCHIO: coi valori di default la diff è 7 ma i giorni visualizzati sono 8 ***/
			
			var vTable = $("#fldFarmaci table");
			
			for(var i = 0; i < days + 1; i++) {
				vTable
				.append( $("<tr/>", { "class" : i } ) 
					.append( $("<td/>").css({'width': '120px'})
						.append( $("<label>", { "text": moment().add(i + offset_days, 'days').format("dddd") + " - " + moment().add(i + offset_days, 'days').format("MMMM Do"),  'class' : moment().add(i + offset_days, 'days').format("dddd") })		
						)
					)
				)
					
				$.each(POS_TER_CRONICA.objFarmaci.farmaco, function(idx, obj) {
					var posologia = home.RICETTA_FARMACI.getPosologiaFromIdx(obj.index);
					vTable.find("tr." + i ).append( $("<td/>").css({'width': '250px'})
							.append($("<input/>", {"value": posologia,"class": "pos_input", "id": i + '_' + idx}).css({'text-align': 'center', 'width': '95%', 'height': '50px'}).css({'color': colors[idx]})
						)
					);
				});
			}
			
			$('.pos_input').on("mousedown", function(e){ 
				if (e.button == '2') {
					$appSuccessivi.test(e, this);
				}
			});
			
			tableExists = true;
		},
		
		buildFalseTables: function(){
			var vTableFarmaci = $("#fldFarmaciFirst table");
			vTableFarmaci.append(
				$("<tr/>",{	"class": "intestazione"})
					.append( $("<th/>", { "class":"header"}).css({ 'width': '200px' })
						.append( $('<label><p><b>' + 'DATA' + ': </b></p></label>', { 'class' : 'label_data' })
						)
					)
			);
			
			$.each(POS_TER_CRONICA.objFarmaci.farmaco, function(idx, obj) {
				vTableFarmaci.find("tr.intestazione")
					.append( $("<th/>", { "class":"label"})
						.append(
							$('<label><p>' + obj.descr_farmaco.replace("*", " ") + '</p></label>', { 'class' : 'label_farmaco' }).css({'color': colors[idx]})
						)
					);
			});
		},
		
		buildTables: function(){
			
			var vTableFarmaci = $("#fldFarmaci table");
			vTableFarmaci.append(
				$("<tr/>",{	"class": "intestazione"})
					.append( $("<th/>", { "class":"header"}).css({ 'width': '200px' })
						.append( $('<label><p><b>' + 'DATA' + ': </b></p></label>', { 'class' : 'label_data' })
						)
					)
			);
			
			$.each(POS_TER_CRONICA.objFarmaci.farmaco, function(idx, obj) {
				vTableFarmaci.find("tr.intestazione")
					.append( $("<th/>", { "class":"label"})
						.append(
							$('<label><p>' + obj.descr_farmaco.replace("*", " ") + '</p></label>', { 'class' : 'label_farmaco' }).css({'color': colors[idx]})
						)
					);
			});
		},
		
		elimina: function(data){
			$("#fldIntestazione").hide();
		},
		
		pulisciCalendario: function(){
			$("#fldFarmaci table").empty();
			tableExists = false;
		},
		
		/*** OCCHIO: rischiamo di avere una stampa bruttina se abbiamo due farmaci insieme,
		 *  ognuno con una sua posologia e almeno 5 righe nella tabella
		 *  
		 *  Forse sarebbe da inserire un numero max di righe
		 *   oltre il quale mandare in stampa un foglio aggiuntivo  ***/		
		stampa: function(){
			
			var iTdays = ["Lunedì", "Martedì'", "Mercoledì'", "Giovedì'", "Venerdì'", "Sabato", "Domenica"];

			$.each(POS_TER_CRONICA.objFarmaci.farmaco, function(idx, obj) {
				
				prompts.farmaco = obj.descr_farmaco.replace("*", " ");
				prompts.farmaco = encodeURI(prompts.farmaco);

				prompts.pHTML = '';
				
				prompts.pHTML = '<html><head><style>';
				prompts.pHTML += 'table { width: 700px; } ';
				prompts.pHTML += 'td { height: 26px; width: 100px; } ';
				prompts.pHTML += 'th { height: 15px; width: 100px; background-color: D2D6D4; } ';
				prompts.pHTML += '</style></head><body>';

				prompts.pHTML += '<table style="font-size:12px;" border ="1";>';
				prompts.pHTML += '<tr>';
				
				for(var i = 0; i < 7; i++) {
					prompts.pHTML += '<th style="text-align:center;">' + iTdays[i] + '</th>';
				}
				
				/*** costruisco la prima riga della tabella 
				 * mi calcolo quanti td NON vuoti ho ( firstRow )
				 * e pongo prima di questi un numero di td vuoti ( voidTdFirstRow )
				 * per arrivare a completare la riga ***/
				prompts.pHTML += '</tr><tr>';
				
				var voidTdFirstRow = POS_TER_CRONICA.checkDayOfTheWeek( moment().add(offset_days, 'days').format("dddd") );
				
				POS_TER_CRONICA.addVoidTd( voidTdFirstRow );
				
				var firstRow = 7 - voidTdFirstRow;
				
				POS_TER_CRONICA.setGiorno( firstRow, idx );
				
				/*** calcolo il numero di td esclusa la prima riga:
				 * prendo il numero di giorni impostato (days + 1),
				 * aggiungo il numero di td vuoti che ho dovuto aggiungere - voidTdFirstRow ) -
				 * e sottraggo il numero di td che compone la prima riga della tabella: 7 (ovviamente)
				 * ***/
				var giorni_totali = (days + 1 + voidTdFirstRow );
				
				var righe_complete = parseInt((giorni_totali - 7)/7);
				
				prompts.pHTML += '</tr>';
				
				var check_num_righe = 1;
				
				for(var k = 0; k < righe_complete; k++) {
					POS_TER_CRONICA.setRigheComplete( (7 - voidTdFirstRow ), k, idx);
					
					check_num_righe++;
					if (check_num_righe % 4 == 0 ){
						
						prompts.pHTML += '</table>';
						prompts.pHTML += '</body></html>';
						
						POS_TER_CRONICA.print();
						
						prompts.pHTML = '';

						prompts.pHTML = '<html><head><style>';
						prompts.pHTML += 'table { width: 700px; } ';
						prompts.pHTML += 'td { height: 26px; width: 100px; } ';
						prompts.pHTML += 'th { height: 15px; width: 100px; background-color: D2D6D4; } ';
						prompts.pHTML += '</style></head><body>';

						prompts.pHTML += '<table style="font-size:12px;" border ="1";>';
						prompts.pHTML += '<tr>';
						
						for(var i = 0; i < 7; i++) {
							prompts.pHTML += '<th style="text-align:center;">' + iTdays[i] + '</th>';
						}
					}
				}
				
				var giorni_ultima_riga = (giorni_totali%7)
				var idxStartLastRowfirstRow = firstRow + (righe_complete*7);
				
				/*** Se necessaria, costruisco l'ultima riga***/
				
				if(giorni_ultima_riga != 0){
					
					prompts.pHTML += '<tr>';

					POS_TER_CRONICA.setLastRow( idxStartLastRowfirstRow, giorni_ultima_riga, idx);
					
					var voidTdLastRow = 7 - giorni_ultima_riga;
					
					POS_TER_CRONICA.addVoidTd(voidTdLastRow);
					
					prompts.pHTML += '</tr>';
				}
				
				prompts.pHTML += '</table>';
				
				prompts.pHTML += '</body></html>';
//				alert(prompts.pHTML)
				POS_TER_CRONICA.print();
			})
		},
		
		addSpace: function(str) {
			  var result = '';
			  while (str.length > 0) {
				  if(str.substring(0, 14).indexOf(' ') == -1){
					  if(str.substr(14, 1) != ' ' && str.substr(14, 1) != ''){
						  result += str.substring(0, 14) + '- ';
					  }else{
						  result += str.substring(0, 14) + ' ';
					  }
				  }else{
					  result += str.substring(0, 14);
				  }
				  str = str.substring(14);
			  }
			  return result;
		},
		
		print: function(){

			//devo eliminare gli spazi bianchi codificandoli altrimenti l'applet di stampa si arrabbia
			prompts.pHTML = encodeURI(prompts.pHTML);
//			prompts.farmaco = encodeURI(prompts.farmaco);
			
			home.NS_PRINT.print({
				path_report		: "POS_TER_CRONICHE.RPT" + "&t=" + new Date().getTime(),
				prompts			: prompts,
				show			: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output			: "pdf"
			});
		},
		
		setRigheComplete: function(daysFirstRow, row, IdxFarmaco){
			
			prompts.pHTML += '<tr>';
				
			for(var i = 0; i < 7; i++){
				var temp = i + daysFirstRow + 7 * row;
				prompts.pHTML += '<td style="text-align:center;"><b>';
				prompts.pHTML += moment().add(temp + offset_days, 'days').format("MMMM Do");
				prompts.pHTML += '</b><br><br>';
				prompts.pHTML += POS_TER_CRONICA.addSpace( $('#' + temp + '_' + IdxFarmaco).val() );
				prompts.pHTML += '</td>';
			}
			
			prompts.pHTML += '</tr>';
		},
		
		setGiorno: function(num_days, IdxFarmaco){
			
			num_days = typeof(num_days) == 'undefined' ? 7 : num_days;
			
			for(var i = 0; i < num_days; i++){
				prompts.pHTML += '<td style="text-align:center;"><b>';
				prompts.pHTML += moment().add(i + offset_days, 'days').format("MMMM Do");
				prompts.pHTML += '</b><br><br>';
				prompts.pHTML += POS_TER_CRONICA.addSpace( $('#' + i + '_' + IdxFarmaco).val() );
				prompts.pHTML += '</td>';
			}
		},
		
		setLastRow: function(idx, num, IdxFarmaco){
			
			for(var i = 0; i < num; i++){
				var temp = i + idx;
				prompts.pHTML += '<td style="text-align:center;"><b>';
				prompts.pHTML += moment().add(temp  + offset_days, 'days').format("MMMM Do");
				prompts.pHTML += '</b><br><br>';
				prompts.pHTML += POS_TER_CRONICA.addSpace( $('#' + temp + '_' + IdxFarmaco).val() );
				prompts.pHTML += '</td>';
			}
		},
		
		checkDayOfTheWeek: function(day_of_the_week){

			var num_of_void_td = 0;
			
			switch( day_of_the_week )
			{
				case 'Lunedì':
					num_of_void_td = 0;
					break;
				
				case 'Martedì':
					num_of_void_td = 1;
					break;
				
				case 'Mercoledì':
					num_of_void_td = 2;
					break;
				
				case 'Giovedì':
					num_of_void_td = 3;
					break;
					
				case 'Venerdì': 
					num_of_void_td = 4;
					break;
				
				case 'Sabato': 
					num_of_void_td = 5;
					break;
					
				case 'Domenica':
					num_of_void_td = 6;
					break;
				
				default: 
					num_of_void_td = 0;
			}

			return num_of_void_td;
		},
		
		addVoidTd: function(number){
			for(var i = 0; i < number; i++){
				prompts.pHTML += '<td></td>';
			}
		},
		
		context_menu : {
			
			applicaAiSuccessivi: function(id){
				
				var valToApll = $("#" + id).val();
				var colonna = id.split("_");
				
				for(var i = colonna[0]; i < days + 1; i++){
					$("#" + i + "_" + colonna[1]).val(valToApll)
				}
			}
		}
};

var menuApplicaAiSuccessivi = {
		"menu" : {
			"id" 		: "MENU_APPLICA AI_SUCCESSIVI",
			"structure" : {
			"list" 		: [ {
					"concealing" 	: "true",
					"link" 			: function(rec) {POS_TER_CRONICA.context_menu.applicaAiSuccessivi($(rec).attr("id"));},
					"enable" 		: "S",
					"icon_class" 	: "incolla",
					"where" 		: function(rec) {return true;},
					"output" 		: "traduzione.lblApplicaAiSuccessivi",
					"separator" 	: "false"
				} ]
			},
			"title" 	: "traduzione.lblMenu",
			"status" 	: true
		}
};
