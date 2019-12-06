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
 
 
function fnCreateSelect( aData )
{
	var strOutput= "";
	try{
		var r='<select><option value=""></option>', i, iLen=aData.length;
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
			objHomeFrame = top;
		}
		else if (params.get("sorgente")=="console"){
			objHomeFrame = top.opener.top			
		}
		else if (params.get("sorgente")=="OCULISTICA"){
			objHomeFrame = opener.parent.top.opener.top;	
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
		$( "#accordion" ).accordion({
			heightStyle: "content"
		});
		$.datepicker.setDefaults(
			$.extend(
			{'dateFormat':'dd/mm/yy'},
			$.datepicker.regional['it']
			)
		);	
		// **** date , fare each su tipo = DATE
		var strOggi = "",
		strOggi = strOggi.getTodayStringFormat();		
		$("input[tipo='DATA']").each(function(){		
			$(this).datepicker();	
			$(this).val(strOggi.toItalianDateFormat());
		});
		

		// ******* orari, fare each su tipo = ORARIO
		$("input[tipo='ORARIO']").each(function(){
			$(this).timeEntry({show24Hours: true,separator: '.',initialField: 0,noSeparatorEntry: true});
			$(this).val((new String("")).getNowTimeFormat());
		});
		$("#CERT_VIS_OCU_MEDICO").val(getHomeFrame().baseUser.DESCRIPTION);

		$( 'button' ).button().css('width','98%');	

		// lasciare per ultimo 		
		// workaround su box del datepicker visibile
		$("#ui-datepicker-div").hide();
		// *****************************			
		
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



function chiudi(value){
	if (!value){
		if (!confirm("Chiudere la scheda corrente ?")){
			return ;
		}
	}
	//parent.jQuery.fancybox.close();
	if (params.get("sorgente")=="OCULISTICA"){
		// da console viene fatta una window.open
		self.close();
	}
	else if (params.get("sorgente")=="worklist"){
		getHomeFrame().jQuery.fancybox.close();
	}
}

function stampa(modulo){
	var sf = "";
	var urlStampa="";
	var idenAnag =params.get("idenAnag");
	if (idenAnag=="" || idenAnag=="undefined" || typeof(idenAnag)=="undefined"){
		alert("Errore grave: ID anagrafico non valido");
		return;
	}
	switch(modulo){
		case "CERT_VIS_OCU":
		// report collegato: CERT_LAVORO.RPT
			sf = "{ANAG.IDEN}=" + idenAnag;
			urlStampa = '../../elabStampa?stampaFunzioneStampa=CERT_LAVORO&stampaSelection=' + sf + '&stampaAnteprima=S';			
			urlStampa += "&stampaReparto=CERT_VARI";
			urlStampa += "&prompt<pDataVisita>=" + $("#CERT_VIS_OCU_DATA_VISITA").val();
			urlStampa += "&prompt<pMedico>=" + $("#CERT_VIS_OCU_MEDICO").val();
			urlStampa += "&prompt<pOraInizio>=" + $("#CERT_VIS_OCU_ORA_INI").val();
			urlStampa += "&prompt<pOraFine>=" + $("#CERT_VIS_OCU_ORA_FINE").val();
			urlStampa += "&prompt<pCitta>=" + params.get("citta");
			// vale PERS o 104
			urlStampa += "&prompt<pTipoCert>=" + ($("input[name='CERT_VIS_OCU_DOC']:checked").val())		
			urlStampa += "&prompt<pPaz104>=" + $("#CERT_VIS_OCU_104_PAZ").val();
			
			// 		$("#SPEDIZ_REFERTO").val();
			
			break;
		case"RET_AMSLER":
			urlStampa = "../pdfModuli/retAmsler.pdf";
			break;
		case"MOD_FERIE":			
			urlStampa = "../pdfModuli/moduloFerieA1.pdf";
			break;
		case "TONOMETRIA":
			sf = "{INFOMOD_OCULISTICA_TONI.IDEN_ANAG} =" + idenAnag+ " and (not isnull({INFOMOD_OCULISTICA_TONI.OCU_TONO_DX}) or not isnull({INFOMOD_OCULISTICA_TONI.OCU_TONO_SX}))"
			urlStampa = '../../elabStampa?stampaFunzioneStampa=TONOMETRIA&stampaSelection=' + sf + '&stampaAnteprima=S';			
			break;
		default:
			break;
	}
	if (urlStampa == ""){return;}
	var finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
	}		
}


// *******************