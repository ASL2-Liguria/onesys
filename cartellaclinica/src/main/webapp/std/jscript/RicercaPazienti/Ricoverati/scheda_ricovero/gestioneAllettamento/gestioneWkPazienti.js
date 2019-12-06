var NS_WK_PAZIENTI = {
	pStatementFile:'CCE_gestioneAllettamento.xml',
	row:{},
	
/*Carica la wk dei pazienti da allettare o dei pazienti allettati:
- (value)==true ? wk dei pazienti da allettare : wk dei pazienti allettati
- (load)==true ? wk dei pazienti da allettare al caricamento : wk dei pazienti allettati al caricamento(senza usare i filtri su nome,cognome,data,cod_fisc e codice_reparto)
*/	
	creaWKPazienti:function(value){
		var pParam = new Array();
		var pStatementNome = '';
		setVeloNero('divExtra','div');
		if ($('#idCognome').val()=='' &&  $('#idNome').val()=='' && $('#idData').val()=='' && $('#idCodFisc').val()=='' /*&& $('#idRepDegenza option:selected').val()==''*/)
		{
			/*Se i filtri sono vuoti,ricerca come al caricamento*/
			pStatementNome = value==true?"allettamento.wk_pazienti_da_allettare_al_caricamento":"allettamento.wk_pazienti_allettati_al_caricamento";
			pParam.push($('#idRepDegenza option:selected').val());			
			/*if (pStatementNome =='allettamento.wk_pazienti_allettati_al_caricamento')
				pParam.push($('#iden_gruppo').val());*/			
		}else{
			/*ricerca con i filtri valorizzati*/
			pStatementNome = value==true?"allettamento.wk_pazienti_da_allettare":"allettamento.wk_pazienti_allettati";
			pParam.push($('#idCognome').val());
			pParam.push($('#idNome').val());
			pParam.push($('#idData').val());
			pParam.push($('#idData').val());				
			pParam.push($('#idCodFisc').val());
			pParam.push($('#idRepDegenza option:selected').val());
			/*if (pStatementNome =='allettamento.wk_pazienti_allettati')
				pParam.push($('#iden_gruppo').val());*/
		}
		var $table = $('<table></table>');
		var $tbody = $table.append("<tbody></tbody>").children("tbody");
		WindowHome.executeQuery(NS_WK_PAZIENTI.pStatementFile,pStatementNome,pParam,function(rs){
			while (rs.next()){
				var value = new Array();
				value.push(NS_WK_PAZIENTI.creaSpanInfo());
				value.push(NS_WK_PAZIENTI.creaSpanIco(rs));	
				NS_WK_PAZIENTI.creaTd($tbody.append("<tr></tr>").children("tr:last"),value);					
			}
			removeVeloNero('divExtra');	
			$('#divExtra').append($table);
			NS_WK_PAZIENTI.setEvents();
		});
	},

	creaTd:function(obj,arrayValue){
		if (typeof arrayValue['title']=='undefined')
		{
			for(var i in arrayValue){
				obj.append("<td></td>").children("td:last").append(arrayValue[i]);
			}
		}else{
				obj.append("<td class='"+arrayValue['titleClass']+"'></td>").children("td:last").append(arrayValue['title']);
				obj.append("<td class='"+arrayValue['valueClass']+"'></td>").children("td:last").append(arrayValue['value']);
		}	
	},
	
	creaSpanInfo:function(){
		var $span = $("<span class='iconInfo'></span>");
			
		return $span;
		
	},
	
	creaSpanIco:function(vRs){
		var $spanParent = $("<span class='patientSpan'></span>");

		$spanParent.attr('iden_anag',vRs.getString("iden_anag"));
		$spanParent.attr('iden_ricovero',vRs.getString("iden_ricovero"));
		$spanParent.attr('iden_visita',vRs.getString("iden_visita"));
		$spanParent.attr('num_nosologico',vRs.getString("num_nosologico"));						
		$spanParent.attr('sesso',vRs.getString("sesso"));
		$spanParent.attr('paziente',vRs.getString("paziente"));
						
		var $span 		= vRs.getString("sesso")=='M'?$("<span class='iconMan'></span>"):$("<span class='iconWoman'></span>");

		var $spanPatientInfo = $("<span class='spanPatientInfo'></span>")
		$spanPatientInfo.text(vRs.getString("paziente"));
		
		var $spanRepartoInfo = $("<span class='spanRepartoInfo'></span>");
		$spanRepartoInfo.text("Reparto di Degenza: "+vRs.getString("reparto_degenza"));
		
		$spanParent.append($span);
		$spanParent.append($spanPatientInfo);
		$spanParent.append($spanRepartoInfo);
		return $spanParent;
	},
	
	creaSpanStanza:function(vRs){
		var $span = $("<span id='iconStanza'>Apri Stanza</span>");
		var iden_gruppo = vRs.getString("iden_gruppo");
		var iden_stanza = vRs.getString("iden_stanza");
		$span.click(function(){
			NS_ALLETTAMENTO_STANZE_LETTI.apriStanza(iden_gruppo,iden_stanza);
			});				
		return $span;
	
	},

    setEvents:function(){
		
		$('#divExtra table tr:odd').css("background-color", "#39F");
		$('.patientSpan').attr("title","Trascinare sulla stanza/letto per allettare");
		//Gestione Drag and Drop
        $('#divExtra table').find('tr td span.patientSpan').draggable({
				revert: 'invalid',
				helper:'clone',
				start: function( ev, ui ) {
					NS_WK_PAZIENTI.row = this;
				}
        	});
		//Gestione Creazione Div Info Paziente		
		$('#divExtra table').find('tr td span.iconInfo').click(function(){
			$('#divContent').append(
				$('<div id="idInfoPatient" class="infoPatient" title="Dettaglio Paziente"></div>').append(NS_INFO_PATIENT.creaTableInfo($(this)))
			);
			$('#idInfoPatient').dialog({
				position:	{ my: "right bottom", at: "left top", of: $(this) }
			});
		});
		
    }		
};

var NS_INFO_PATIENT = {
	
	creaTableInfo:function(obj){
		var param = new Array();
		param.push(obj.parent().parent().find('td span.patientSpan').attr('iden_ricovero'));
		var $table = $('<table cellspacing="2" width="100%" class="classFormRicPaz" border="0" cellpadding="2"></table>');
		var $tbody = $table.append("<tbody></tbody>").children("tbody");
		var rs = WindowHome.executeQuery(NS_WK_PAZIENTI.pStatementFile,'allettamento.infoPaziente',param);
		while (rs.next()){
			
			for (var i in rs.columns){
				
				var array = {
					titleClass:'colonneRicercaTitle',
					title:'',
					valueClass:'colonneRicercaField',
					value:''	
				};
				switch (rs.columns[i]){
					case 'COGN': array.title = 'Cognome';break;
					case 'NOME': array.title = 'Nome';break;
					case 'DATA_NASCITA': array.title = 'Data di nascita';break;
					case 'COD_FISC': array.title = 'Codice Fiscale';break;
					case 'NUM_NOSOLOGICO': array.title = 'Num.Ricovero';break;
					case 'DATA_ENTRATA': array.title = 'Data di Ricovero';break;
					case 'PROVENIENZA': array.title = 'Provenienza';break;
					case 'SITUAZIONE_PAZIENTE': array.title = 'Situazione Paziente';break;
					default: '';																													
				}
				
				array.value = rs.getString(rs.columns[i]);
				NS_WK_PAZIENTI.creaTd($tbody.append("<tr></tr>").children("tr:last"),array);
			}
		}
		return $table;
	},
		
	creaTableWkPatientInfo:function(obj){
		var param = new Array();
		param.push(obj.parent().parent().attr('id'));
		var $table = $('<table cellspacing="2" width="100%" class="classFormRicPaz" border="0" cellpadding="2"></table>');
		var $tbody = $table.append("<tbody></tbody>").children("tbody");
		$tbody.append("<tr><td class='colonneRicercaTitle'>Paziente</td><td class='colonneRicercaTitle'>Letto</td><td class='colonneRicercaTitle'>Situazione Paziente</td></tr>");	
		var rs = WindowHome.executeQuery(NS_WK_PAZIENTI.pStatementFile,'allettamento.wk_pazienti_allettati_in_stanza',param);
		if (rs.size==0)
		{
			$tbody.append("<tr><td class='colonneRicercaTitle' colspan='4'>Stanza Vuota</td></tr>");		
		}else
		{
			while (rs.next()){	
				var array = {
					value1:'',
					value2:'',
					value3:''																
				};
				
				array.value1 = rs.getString("PAZIENTE");
				array.value2 = rs.getString("DESCR_LETTO");
				array.value3 = rs.getString("SITUAZIONE_PAZIENTE")==""?"---":rs.getString("SITUAZIONE_PAZIENTE");
	
				NS_WK_PAZIENTI.creaTd($tbody.append("<tr class='colonneRicercaField'</tr>").children("tr:last"),array);
			}
		}
		return $table;		
	}

};

