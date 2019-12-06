// JavaScript Document

var jsonInfoCiclica = {"costINIZIO":"", "costFINE":""};

// JavaScript Document
// ******************
(function($) {
$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
	var oTable = $("#TAB_ESAMI").dataTable();
    // check that we have a column id
    if ( typeof iColumn == "undefined" ) return new Array();
     
    // by default we only want unique data
    if ( typeof bUnique == "undefined" ) bUnique = true;
     
    // by default we do want to only look at filtered data
    if ( typeof bFiltered == "undefined" ) bFiltered = true;
     
    // by default we do not want to include empty values
    if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;
     
    // list of rows which we're going to loop through
    var aiRows;
     
    // use only filtered rows
    if (bFiltered == true) aiRows = oSettings.aiDisplay;
    // use all rows
    else aiRows = oSettings.aiDisplayMaster; // all row numbers
 
    // set up data array   
    var asResultData = new Array();

    for (var i=0,c=aiRows.length; i<c; i++) {
        iRow = aiRows[i];
//        var aData = this.fnGetData(iRow);
        var aData = this.fnGetData(iRow);
        var sValue = aData[iColumn];
        // ignore empty values?
//		if (typeof(sValue)!="undefined"){
			try{
				if (typeof(sValue) != "undefined"){
					if (bIgnoreEmpty == true && sValue.toString==""){ 
						continue; 
					}
					// ignore unique values?
					else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1){
						continue;
					}
					// else push the value onto the result data array
					else{
						asResultData.push(sValue);
					}
				}
			}catch(e){alert("##" + e.description +"##");}
//		}
    }
//	alert("#" + asResultData +"#");
    return asResultData;
}}(jQuery));
 
 
function fnCreateSelect( aData, indiceColonna )
{
	var strOutput= "";
	try{
		
		var r='<select id="comboFiltro_' + indiceColonna+'"><option value=""></option>', i, iLen=aData.length;
		for ( i=0 ; i<iLen ; i++ )
		{
			r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
		}
		strOutput = r+'</select>';

	}
	catch(e){
		alert("fnCreateSelect - Error: " + e.description);
	}
    return strOutput;
}

// *******************
var params;
function getParams() {
	try{
		var idx = document.URL.indexOf('?');
		if (idx != -1) {
			var tempParams =  new Hashtable();
			var pairs = document.URL.substring(idx+1,document.URL.length).split('&');
			for (var i=0; i<pairs.length; i++) {
				nameVal = pairs[i].split('=');
				tempParams.put(nameVal[0],nameVal[1]);
			}
			return tempParams;
		}
	}
	catch(e){
		alert("getParams - Error:  "+ e.description);
	}
}	

function getHomeFrame(){
	var objHomeFrame;
	
	try{
		if (params.get("sorgente")=="worklist"){
			objHomeFrame = parent.top;
		}
		else{
			// TBD
			objHomeFrame = parent;
		}
	}
	catch(e){alert(e.description);}
	return objHomeFrame;
}

function init(){
	try{
		params = getParams();
		var strOggi = "";
		$("#lblGiornoErogazione").html(strOggi.getTodayDateFormat());
		try{
			jsonInfoCiclica.costINIZIO = parent.costInizioCiclo;
			jsonInfoCiclica.costFINE = parent.costFineCiclo;
		}
		catch(e){
			// valori di default
			jsonInfoCiclica.costINIZIO = "CICLICA";
			jsonInfoCiclica.costFINE = "FINE_CICLO";
		}
		initDataTable();
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
	finally{
		try{
			$("#infoImpegnativa").html(strInfoDemaNoNumimp);
		}catch(e){;}
	}
}

function highlightCheckCell(idCheck, triggeredBy){
	try{
//		alert($(triggeredBy).get(0).tagName);
		if($("#" + idCheck).attr('checked')){
			$("#" + idCheck).parent().addClass("selectedChk");
		}
		else{
			$("#" + idCheck).parent().removeClass("selectedChk");
		}
	}
	catch(e){
		alert("highlightCheckCell - Error:  "+ e.description);
	}
}

function initDataTable(){
	var strTmp= "";
	var indice = 1;
	try{
		oTable = $('#TAB_ESAMI').dataTable({
			"bPaginate": false,
			"bLengthChange": true,
			"bFilter": true,
			"bSort": true,
			"bInfo": false,
			"bAutoWidth": false,
			"sScrollY": "400px",
			"bScrollCollapse": true,
			"aoColumns": [
			{ "sWidth": "1%" }, 						  
			{ "sWidth": "3%" }, 
			{ "sWidth": "3%" }, 
			{ "sWidth": "3%" }, 
			null,
			null,
			null,
			null,
			null
			],				
			"bJQueryUI": false,
			'bRetrieve': true,
			"oLanguage": {
					"sZeroRecords": "Nessun elemento"
				}
		});
		// decommentare 
		/*
		for (var i =0;i<parent.baseUser.LISTAREPARTI.length;i++){
			if (strTmp == ""){
				strTmp = parent.baseUser.LISTAREPARTI[i];
			}
			else{
				strTmp += "," + parent.baseUser.LISTAREPARTI[i];
			}
		}*/
		// prendo i cdc scelti dall'utente nei filtri della wk
		
		try{
			strTmp = parent.parent.worklistTopFrame.$("#td_cdc").html();
			strTmp = strTmp.replace(/ /g, '');
		}catch(e){strTmp="";}
		if (strTmp =="" || strTmp == "undefined"){
			alert("Errore grave: nessun unita' erogante selezionata");
			parent.jQuery.fancybox.close();			
			return;
		}
		
 		try{rs = getHomeFrame().executeQuery('worklist_main.xml','getEsaDaEseguire',[strTmp]);}catch(e){alert("Errore: getEsaDaEseguire");return;}		
		var strCiclicita =""; 
		var chkCiclo = "";
		var chkFineCiclo = "";
		var chkEsaSel = "";
		//***************************
		//****** modifica DEMA ******
		//***************************
		var bolNoImpegnativa = false;
		//***************************
		
		// modifica 9-9-15
		
		while (rs.next()){
			// strCiclicita indica se è ultimo esame del pacchetto !
			strCiclicita = rs.getString("ULTIMO_ESAME_CICLICA");
			bolNoImpegnativa = false;
			// modifica 14-6-16
			if (rs.getString("iden_tick")!="107"){
				if (rs.getString("INT_EST")=="E" && (typeof(rs.getString("NUMIMP_NUMRICH"))=="undefined" || rs.getString("NUMIMP_NUMRICH")=="")){
					// controllo se e' extraLea
					if ((rs.getString("iden_pro")!="2872")&&(rs.getString("iden_pro")!="4492")){
						bolNoImpegnativa = true;
					}
				}
			}
			
			// controllo qui se esistono esami marcati con "fine ciclo" per la stessa impegantiva
			// ATTENZIONE : può capitare il caso che abbia in lista + esami , stessa impegnativa
			// e che li marchi entrambe con "fine ciclo"
			
			// forse è opportuno fare entrambe: far vedere che NON si può dare il fine ciclo, se già presente x un altro stessa impegnativa,
			// e all'atto dell'erogazione mettere CICLICA se esiste già altro esame marcato come "FINE CICLO"
			
			// **********
			if (strCiclicita !="S"){
				var strToAdd = "";
				 strToAdd = "$(\"#idchkCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkNonSelezionato\").addClass(\"chkSelezionato\");$(\"#idchkFineCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkSelezionato\").addClass(\"chkNonSelezionato\");";
				chkCiclo = "<span class='chkSelezionato' onclick='javascript:$(\"#idchkCiclo_"+ rs.getString("iden") + "\").attr(\"checked\", \"checked\");" + strToAdd + "' ><input type='radio' class='radioBigger' checked = 'checked' value ='"+ jsonInfoCiclica.costINIZIO + "' name='chkCiclo_" +rs.getString("iden") + "' id ='idchkCiclo_" +rs.getString("iden") + "'  /></span>";
				 strToAdd = "$(\"#idchkFineCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkNonSelezionato\").addClass(\"chkSelezionato\");$(\"#idchkCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkSelezionato\").addClass(\"chkNonSelezionato\");"
				chkFineCiclo = "<span class='chkNonSelezionato'  onclick='javascript:$(\"#idchkFineCiclo_"+ rs.getString("iden") + "\").attr(\"checked\", \"checked\");" + strToAdd + "'><input type='radio' class='radioBigger' value = '"+ jsonInfoCiclica.costFINE + "' name='chkCiclo_" +rs.getString("iden") + "' id ='idchkFineCiclo_" +rs.getString("iden") + "'  /></span>";
			}
			else // if(strCiclicita == "S")
			{
				// SONO nel caso di esame marcato come ultimo della ciclica, se deriva da un ripeti ciclica !!				
				 strToAdd = "$(\"#idchkCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkNonSelezionato\").addClass(\"chkSelezionato\");$(\"#idchkFineCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkSelezionato\").addClass(\"chkNonSelezionato\");";				
				chkCiclo = "<span class='chkNonSelezionato' onclick='javascript:$(\"#idchkCiclo_"+ rs.getString("iden") + "\").attr(\"checked\", \"checked\");" + strToAdd + "'><input type='radio' class='radioBigger'  value ='"+jsonInfoCiclica.costINIZIO+"' name='chkCiclo_" +rs.getString("iden") + "' id ='idchkCiclo_" +rs.getString("iden") + "'  /></span>";
				 strToAdd = "$(\"#idchkFineCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkNonSelezionato\").addClass(\"chkSelezionato\");$(\"#idchkCiclo_"+ rs.getString("iden") + "\").parent().removeClass(\"chkSelezionato\").addClass(\"chkNonSelezionato\");"
				chkFineCiclo = "<span class='chkSelezionato'  onclick='javascript:$(\"#idchkFineCiclo_"+ rs.getString("iden") + "\").attr(\"checked\", \"checked\");" + strToAdd + "'><input type='radio' checked = 'checked' class='radioBigger' value = '" + jsonInfoCiclica.costFINE + "' name='chkCiclo_" +rs.getString("iden") + "' id ='idchkFineCiclo_" +rs.getString("iden") + "'  /></span>";
			}
			//***************************
			//****** modifica DEMA ******
			//***************************			
			if (!bolNoImpegnativa){
				chkEsaSel = "<input type='checkbox' checked = 'checked'  id='chkEsaSel_" +rs.getString("iden") + "'  onclick='javascript:highLightRow(this)' /><label for='chkEsaSel_" +rs.getString("iden") + "'>&nbsp;</label>";
			}
			else{
				chkEsaSel = "&nbsp;";		
			}
			//***************************	
			oTable.fnAddData( [indice,chkCiclo, chkFineCiclo, chkEsaSel,rs.getString("paziente"),rs.getString("esa_descr"),rs.getString("NUMIMP_NUMRICH"),rs.getString("descr_sala"),rs.getString("reparto")], false);						

			indice ++;
		}		
		try{oTable.fnDraw();		}catch(e){}
		setTimeout(function (){oTable.fnAdjustColumnSizing();}, 10 );	
		//setTimeout(function (){oTable.fnSort( [ [3,'asc'] ] );},1000);
		// li seleziono tutti , SOLO quelli selezionabili
		//***************************
		//****** modifica DEMA ******
		//***************************			
		// modifica del 29-4-15
		
		$("#TAB_ESAMI tr").filter(function(){
		    return $(this).find('[id^="chkEsaSel_"]').length == 1 ;
		}).children("td").addClass("highlight");
		
		//***************************
		
		// converto checkbox
		/*$( "INPUT[type='checkbox'][id^='chkEsaSel_']").each(function(){ 
			$(this).button({ 
			  icons: {
				primary: "ui-icon-check"
			  },
			  text: false
			});
		});		*/
		// ****************************************************************
		/* Lasciare per ultimo: costruisce i filtri */
		$("tfoot th[id^='colCombo']").each( function ( i ) {
			var strHtml = "";
			var indiceColonna = $(this).attr("id").split("_")[1];
			if (indiceColonna!=0){
				strHtml = fnCreateSelect( oTable.fnGetColumnData(indiceColonna), indiceColonna );
				this.innerHTML =  strHtml ;
				$('select', this).change( function () {
					try{
						var valore = $(this).val();
						// resetto filtri pre esistenti
						$('#TAB_ESAMI').dataTable().fnFilter( "" );
						$('#TAB_ESAMI').dataTable().fnFilter( valore, indiceColonna );							
					}catch(e){alert(e.description);}
				} );
			}
		} );	
		// ****************************************************************		
		
		
	
		
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}	
}

function highLightRow(oggetto){
	try{
		var id = "";
		

		id = $(oggetto).attr("id").split("_")[1];
		
		
		if ($(oggetto).parent().hasClass("highlight")){
			$(oggetto).parent().parent().each(function(){
				$(this).children("td").removeClass("highlight").addClass("normal");
			});
			/*$("INPUT[type='checkbox'][id^='chkEsaSel_"+ id + "']").button({ 
			  icons: {
				primary: "ui-icon-closethick"
			  },
			  text: false
			});			*/
		}
		else{
			$(oggetto).parent().parent().each(function(){
				$(this).children("td").removeClass("normal").addClass("highlight");
			});
			/*
			$("INPUT[type='checkbox'][id^='chkEsaSel_"+ id + "']").button({ 
			  icons: {
				primary: "ui-icon-check"
			  },
			  text: false
			});	*/			
		}
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}	
}

function eroga(){
	try{
		// riferirsi alle costanti in esegui.ja ? Caricate in worklist principale ?
		var bolTuttoOk = false;
		var listaIdenINIZIO = new Array();
		var listaIdenFINE = new Array();
		// verificare se usare direttamente

		// DA RIVEDERE IN TOTO
		var rsCheckEsameRefertabile;
		var bolCheckDema = true;

		$("input[id^='chkEsaSel_'][checked='checked']").each(function(i){
//			alert($(this).attr("id"));
//			   alert($(this).val()); 	
			var iden = "";
			var radioName = "";
			var radioValue = "";
			
			// discernere tra esami con costInizioCiclo e costFineCi
//			jsonInfoCiclica.costINIZIO 
//			jsonInfoCiclica.costFINE 

			
			iden = $(this).attr("id").split("_")[1];
			if (iden!=""){
				// modifica 14-6-16
				//***************************
				//****** modifica DEMA ******
				//***************************		
				try{
					bolCheckDema = true;
					rsCheckEsameRefertabile = top.executeStatement('worklist_main.xml','checkEsameRefertabile',[iden],2);
					if (rsCheckEsameRefertabile[0] == 'KO') { 
						bolCheckDema = false;
						alert('checkEsameRefertabile' + rsCheckEsameRefertabile[1]);
						return; //return;
					}
					if (rsCheckEsameRefertabile[2] == 'KO') { 
						bolCheckDema = false;
						alert(rsCheckEsameRefertabile[3]);
						return; //return;
					}
					if (!bolCheckDema){
						alert("Esame " + iden + " non erogabile");
						return;
					}
				} catch (e) {
					alert("Errore: checkEsameRefertabile");
				}
				//***************************					
				
				radioName = "chkCiclo_" + iden ;
				radioValue = $("input[name='" + radioName +"']:checked").val();
				switch (radioValue){
					case jsonInfoCiclica.costINIZIO:
						listaIdenINIZIO.push(iden);
						break;
					case jsonInfoCiclica.costFINE:
						listaIdenFINE.push(iden);
						break;						
					default:
						break;
				}
			}
			else{
				alert("Errore grave: iden nullo!");
				return false;
			}
		});
		

		dwr.engine.setAsync(false);
		if (listaIdenINIZIO.length>0){
			CJsEMEseguiEsame.esecuzione_multipla_diretta(listaIdenINIZIO.toString().replaceAll(",","*"), function(message){
					if(message != ''){
						alert(message);
						bolTuttoOk = false;
						return;
					}

					try{
						var out = top.executeStatement('worklist_main.xml','updateStatoCiclo',[listaIdenINIZIO.toString(), jsonInfoCiclica.costINIZIO]);
						if (out[0] != 'OK') {
							alert("Errore " + out);
						}
						else{						bolTuttoOk = true;					}						
					}
					catch(e){
						alert("Error on updateStatoCiclo inizio: "+ e.description);
					}				
			});
		}
		// ****** fine ciclo
		if (listaIdenFINE.length>0){
			CJsEMEseguiEsame.esecuzione_multipla_diretta(listaIdenFINE.toString().replaceAll(",","*"), function(message){
					if(message != ''){
						alert(message);
						bolTuttoOk = false;
						return;
					}
					try{
						var out = top.executeStatement('worklist_main.xml','updateStatoCiclo',[listaIdenFINE.toString(), jsonInfoCiclica.costFINE]);
						if (out[0] != 'OK') {
							alert("Errore " + out);
							bolTuttoOk = false
						}
						else{						bolTuttoOk = true;					}						
					}
					catch(e){
						alert("Error on updateStatoCiclo fine: "+ e.description);
					}				
			});	
		}
		dwr.engine.setAsync(true);
		
	}
	catch(e){
		alert("eroga - Error:  "+ e.description);
	}
	finally{
		try{CJsEMEseguiEsame = null;}catch(e){;} 		
		if (bolTuttoOk){
			parent.aggiorna();
//			try{parent.jQuery.fancybox.close();						}catch(e){;}
		}
	}
}



function resetFilter(id){
	try{

		$("select[id^='comboFiltro_']  option:first-child").each( function ( i ) {		
			$(this).attr("selected", "selected");
		 });
		var oTable = $("#" + id).dataTable();
		var oSettings = oTable.fnSettings();
		for(iCol = 0; iCol < oSettings.aoPreSearchCols.length; iCol++) {
			oSettings.aoPreSearchCols[ iCol ].sSearch = '';
		}
		oSettings.oPreviousSearch.sSearch = '';
		oTable.fnDraw();
	}
	catch(e){
		alert("resetFilter - Error: " + e.description);
	}
}



function chiudi(value){
	if (!value){
		if (!confirm("Chiudere la scheda corrente ?")){
			return ;
		}
	}
	parent.jQuery.fancybox.close();						
}


// *******************