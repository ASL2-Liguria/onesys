//JavaScript Document

var infoExamToShow=new Object();
var idInfoLayerAboutExam = "idInfoLayerAboutExam";
var idInfoLayerAboutExamInner = "idInfoLayerAboutExamInner";
var idInfoLayerAboutExamShadow = "idInfoLayerAboutExamShadow";
var bolCreatedInfoExamLayer =false;

var clientx 
var clienty 


function initInfoExamToShow(){
	infoExamToShow.COGN = "";
	infoExamToShow.NOME = "";
	infoExamToShow.DATA = "";
	infoExamToShow.DESCR_ESAME = "";
	infoExamToShow.DATA_ESAME = "";
	infoExamToShow.QUESITO = "";
	infoExamToShow.QUADRO_CLI = "";
	infoExamToShow.IDEN_ESAME = "";
	infoExamToShow.NOTE = "";
	
}

function showInfoLayerAboutExam(idenEsame, oggetto){

	var sql = ""
		clientx = event.clientX;
	clienty = event.clientY;
	var elencoDescrizioni = "";

	try{
		initInfoExamToShow();
		// chiudo quello eventualmente aperto
		hideInfoLayerInWorklist();
		if(idenEsame==""){return;}
		// UrlFunction.encode(this.value)
		sql = "select esami.iden, quesito , quadro_cli, anag.cogn, anag.nome, anag.data, esami.dat_esa data_esame, tab_esa.descr descr_esame , esami.note from esami, anag, tab_esa where esami.iden=" + idenEsame;
		sql += " and esami.iden_esa = tab_esa.iden and esami.iden_anag = anag.iden";
		infoExamToShow.IDEN_ESAME = idenEsame;
		getXMLData("",parseSql(sql),"processXmlDocument");
	}
	catch(e){
		alert("showInfoLayerAboutExam " + e.description)
	}
}


//funzione che nasconde livello
//riguardante le info dell'esame (quesito, quadro)
function hideInfoLayerInWorklist(){
	hideInfoLayerById(idInfoLayerAboutExam);
	hideInfoLayerById(idInfoLayerAboutExamInner);
	hideInfoLayerById(idInfoLayerAboutExamShadow);	


}

function hideInfoLayerById(id){
	var obj = document.getElementById(id);
	if (obj){
		obj.style.visibility = 'hidden';
	}	
}


//funzione di callback
//che viene chiamata solo in caso 
//non ci sia alcun errore
//in input si ha solo l'oggetto trovato tramite il tag
//response
function processXmlDocument(xmlDoc){

	var quesitoTagObj;
	var quadroTagObj;
	var quesitoValue;
	var quadroValue;

	var cognTagObj;
	var nomeTagObj;
	var dataTagObj;
	var descrEsameTagObj;	
	var datEsaTagObj;
	var noteTagObj;

	var cognObjValue;
	var nomeObjValue;	
	var dataObjValue;	
	var descrEsameObjValue;
	var datEsaObjValue;
	var noteObjValue;

	try{
		if (xmlDoc){
			// quesito
			quesitoTagObj = xmlDoc.getElementsByTagName("QUESITO")[0];
			if (quesitoTagObj){
				quesitoValue = quesitoTagObj.childNodes[0].nodeValue;
				if ((quesitoValue=="null")||(quesitoValue=="undefined")){
					quesitoValue = "";
				}				
			}
			// quadro
			quadroTagObj = xmlDoc.getElementsByTagName("QUADRO_CLI")[0];
			if (quadroTagObj){
				quadroValue = quadroTagObj.childNodes[0].nodeValue;
				if ((quadroValue=="null")||(quadroValue=="undefined")){				
					quadroValue = "";
				}
			}
			// cognome
			cognTagObjValue = xmlDoc.getElementsByTagName("COGN")[0];
			if (cognTagObjValue){
				cognObjValue = cognTagObjValue.childNodes[0].nodeValue;
				if ((cognObjValue=="null")||(cognObjValue=="undefined")){					
					cognObjValue = "";
				}
			}	
			// nome 
			nomeTagObjValue = xmlDoc.getElementsByTagName("NOME")[0];
			if (nomeTagObjValue){
				nomeObjValue = nomeTagObjValue.childNodes[0].nodeValue;
				if ((nomeObjValue=="null")||(nomeObjValue=="undefined")){									
					nomeObjValue = "";
				}
			}	
			// data nascita
			dataTagObjValue = xmlDoc.getElementsByTagName("DATA")[0];
			if (dataTagObjValue){
				dataObjValue = dataTagObjValue.childNodes[0].nodeValue;
				if ((dataObjValue=="null")||(dataObjValue=="undefined")){													
					dataObjValue = "";
				}
				else{
					dataObjValue = dataObjValue.substring(6,8) + "/" + dataObjValue.substring(4,6) + "/" + dataObjValue.substring(0,4)
				}
			}	
			// descr esame
			descrEsameTagObj = xmlDoc.getElementsByTagName("DESCR_ESAME")[0];
			if (descrEsameTagObj){
				descrEsameObjValue = descrEsameTagObj.childNodes[0].nodeValue;
				if ((descrEsameObjValue=="null")||(descrEsameObjValue=="undefined")){																	
					descrEsameObjValue = "";
				}
			}		
			
			// note
			noteTagObj = xmlDoc.getElementsByTagName("NOTE")[0];
			if (noteTagObj){
				noteObjValue = noteTagObj.childNodes[0].nodeValue;
				if ((noteObjValue=="null")||(noteObjValue=="undefined")){																	
					noteObjValue = "";
				}
			}				
			// data esame
			datEsaTagObj = xmlDoc.getElementsByTagName("DATA_ESAME")[0];
			if (datEsaTagObj){
				datEsaObjValue = datEsaTagObj.childNodes[0].nodeValue;
				if ((datEsaObjValue=="null")||(datEsaObjValue=="undefined")){													
					datEsaObjValue = "";
				}
				else{
					datEsaObjValue = datEsaObjValue.substring(6,8) + "/" + datEsaObjValue.substring(4,6) + "/" + datEsaObjValue.substring(0,4)
				}
			}	

		}
	}
	catch(e){
		alert("processXmlResponse " + e.description)
	}
	infoExamToShow.QUESITO = quesitoValue;
	infoExamToShow.QUADRO_CLI = quadroValue;	
	infoExamToShow.COGN = cognObjValue;
	infoExamToShow.NOME = nomeObjValue;
	infoExamToShow.DATA = dataObjValue;
	infoExamToShow.DESCR_ESAME = descrEsameObjValue;	
	infoExamToShow.NOTE = noteObjValue;	
	infoExamToShow.DATA_ESAME = datEsaObjValue;
	
	
	/* 
	if (!bolCreatedInfoExamLayer){
		//creo x la prima volta il layer
		createDivInfoExamLayer();		
	}
	setLayerPosition(clienty,clientx);
	*/
	

	// setto contenuto
	setContentLayer(idInfoLayerAboutExamInner);

}




//creo livello con le informazioni
//dell'esame al suo interno
function createDivInfoExamLayer(){

	var divInfoLayer
	var divInfoLayerInner
	var divInfoLayerShadow	


	try{
		divInfoLayerInner = document.createElement("DIV");
		divInfoLayerInner.id = idInfoLayerAboutExamInner;
		divInfoLayerInner.className = "boxInfoLayer-inner";	

		divInfoLayer = document.createElement("DIV");
		divInfoLayer.title = ritornaJsMsg('tooltipInfoLayer');
		divInfoLayer.id = idInfoLayerAboutExam;
		divInfoLayer.className = "boxInfoLayer";
		divInfoLayer.appendChild(divInfoLayerInner);
//		divInfoLayer.style.visibility = "visible";
		divInfoLayer.onclick = function(){hideInfoLayerInWorklist();}


		// shadow
		divInfoLayerShadow = document.createElement("DIV");
		divInfoLayerShadow.id = idInfoLayerAboutExamShadow;
		divInfoLayerShadow.className = "boxInfoLayerShadow";


		document.body.appendChild(divInfoLayer);
		document.body.appendChild(divInfoLayerShadow);
		bolCreatedInfoExamLayer = true;
	}
	catch(e){
		alert("createDivInfoExamLayer " + e.description);
	}
}
//funzione 
//che compone il 
//contenuto del layer
//nel formato html
function setContentLayer(id){

	var obj = document.getElementById(id);
	var contenutoHtml = "";
	var prelevabile = "";
	var jsonObj;
		
	
	try{
		var indice = getIdexOfArray(array_iden_esame,infoExamToShow.IDEN_ESAME);
		if (indice!=-1){
			jsonObj = JSON.parse(array_contextmenu[indice]);
			prelevabile = jsonObj.PRELEVABILE;
		}
		else{
			prelevabile = "N";
		}
	}
	catch(e){
		prelevabile = "N";
	}
//	if(obj){
		// paziente 
		contenutoHtml = "<label class='TitoloInfoFromWk'>"+ ritornaJsMsg('lblInfoPaziente') + "</label>";		
		contenutoHtml += infoExamToShow.COGN + " " +  infoExamToShow.NOME + " " + infoExamToShow.DATA;		
		// esame
		contenutoHtml += "<label class='TitoloInfoFromWk'>"+ ritornaJsMsg('lblInfoEsame') + "</label>";		
		contenutoHtml += infoExamToShow.DATA_ESAME + " - " + infoExamToShow.DESCR_ESAME;
		// elenco esami
		if (prelevabile=="S"){
			contenutoHtml += "<label class='TitoloInfoFromWk'>Elenco esami prelievo</label>";		
			contenutoHtml += "<label id='idLblElencoEsami'></label>"		
		}
		// quesito
		contenutoHtml += "<label class='TitoloInfoFromWk'>"+ ritornaJsMsg('lblQuesito') + "</label>";
		contenutoHtml += infoExamToShow.QUESITO ;
		contenutoHtml += "<BR><br><br>";
		// quadro
		contenutoHtml += "<label class='TitoloInfoFromWk'>"+ ritornaJsMsg('lblQuadro') + "</label>"
		contenutoHtml += infoExamToShow.QUADRO_CLI ;
		contenutoHtml += "<br><br>";
//		obj.innerHTML = contenutoHtml;
		// ***************
		// note
		contenutoHtml += "<label class='TitoloInfoFromWk'>Note</label>"
		contenutoHtml += infoExamToShow.NOTE ;

		$.fancybox({ 
			'padding'	: 3,
			 autoDimensions: false,
			'width'		: document.documentElement.offsetWidth/10*5,
			'height'	: document.documentElement.offsetHeight/10*5,
			'content' : contenutoHtml,
			'hideOnOverlayClick':false,
			'hideOnContentClick':true			
		});		
		
//		obj.innerHTML = contenutoHtml;
//		obj.style.visibility = 'visible';
		// riempio info elenco esami labo (?????)
		if (prelevabile=="S"){fillElencoEsamiLabo(infoExamToShow.IDEN_ESAME);}
//	}
}

function getIdexOfArray(lista, valore){
	var indice = -1;

	for (var i=0;i<lista.length;i++){
		if (valore == lista[i]){
			indice = i;
			break;
		}
	}
	return indice;
}

function fillElencoEsamiLabo(idenEsame){
	jQuery.ajax({
		type: "GET",
		url: "InfoPrelievo",
		data: {'idenEsame' : idenEsame},
		cache: false,
		dataType: "json",
		contentType: "application/json; charset=ISO-8859-1",
		success: function(data){
			var elencoDescrizioni = "";
			try{
				if(data.rows.length>0){
					// più di una riga
					//alert("Valore: " + JSON.stringify(data));
					$.each(data.rows, function(key) {
						testo = data.rows[key].DESCR;
						if (elencoDescrizioni == ""){
							elencoDescrizioni = testo;
						}
						else{
							elencoDescrizioni += "<BR/>" + testo;
						}
					});// fine each
					$("#idLblElencoEsami").html( elencoDescrizioni );
				}
			}
			catch(e){
				alert("Error parsing json object " + e.description);
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error type: " + textStatus + " - " + errorThrown + " - " + jqXHR.responseText);
		}
	});	
}

function setLayerPosition(top,left){
	var altezzaDocumento = document.body.offsetHeight;	
	var obj = document.getElementById(idInfoLayerAboutExam);

	var posizioneTop
	var posizioneLeft

	try{
		if (obj){
			obj.style.visibility = 'visible';		
			obj.style.position = "absolute";
			posizioneLeft = left;
			// posizionamento verticale
			if ((top+obj.scrollHeight)>altezzaDocumento){
				if ((top-obj.scrollHeight)>0){
					posizioneTop = document.body.scrollTop+(top-obj.scrollHeight);
				}
				else{
					posizioneTop = document.body.scrollTop
				}

			}
			else{
				posizioneTop = document.body.scrollTop+top;
			}	
			obj.style.left = posizioneLeft ;
			obj.style.top = posizioneTop;
		}
		// sposto anche l'ombra
		var objShadow = document.getElementById(idInfoLayerAboutExamShadow);
		if (objShadow){
			objShadow.style.visibility = 'visible';		
			objShadow.style.position = "absolute";
			objShadow.style.left = parseInt(posizioneLeft+5);
			objShadow.style.top =  parseInt(posizioneTop+5);
		}
	}
	catch(e){
		alert("setLayerPosition " + e.description);
	}

}



