// JavaScript Document


function initProcedureCreateLayerSortingColumns(){
	addEventHandlingToWkHeader("idHeaderTableWk");
	createLayerSortingColumns();
	addToolTipToHeader("idHeaderTableWk");
}


// funzione che crea il livello DIV
// che conterrà il listbox e relativi link
// per l'ordinamento della posizione delle colonne

function createLayerSortingColumns(){
	var div_container;
	var div_header;
	var div_wrapper;
	var div_content;
	var div_rightUp;
	var div_rightDown;
	var div_footer;
	var div_shadow ;
	



	div_container = createDiv("divSortCol_container");
	div_header = createDiv("divSortCol_header");

	var lbl_header = createLabel("lblSortCol_header");
	// appendo label
	div_header.appendChild(lbl_header);
	
	// appendo header al container
	div_container.appendChild(div_header);
	
	
	div_wrapper = createDiv("divSortCol_wrapper");
	div_content = createDiv("divSortCol_content");
	
	var sel_content = document.createElement('Select');
	sel_content.id = "divSortCol_listaCol";
	sel_content.size = 8;
	// appendo oggetto select
	div_content.appendChild(sel_content);
	// appendo content al wrapper
	div_wrapper.appendChild(div_content);
	// appendo wrapper al container
	div_container.appendChild(div_wrapper);
	
	div_rightUp = createDiv("divSortCol_rightUp");
	div_rightUp.appendChild(createPulsante("idBt_MoveUpCol","bt_moveUpCol","javascript:moveUpDownElement('divSortCol_listaCol',-1);"));
	// appendo al container
	div_container.appendChild(div_rightUp);
	
	div_rightDown = createDiv("divSortCol_rightDown");
	div_rightDown.appendChild(createPulsante("idBt_MoveDownCol","bt_moveDownCol","javascript:moveUpDownElement('divSortCol_listaCol',1);"));	
	// appendo al container
	div_container.appendChild(div_rightDown);	
	
	// ********* footer
	div_footer = createDiv("divSortCol_footer");
	div_footer.appendChild(createPulsante("idBt_CloseLayMoveCol","bt_CloseLayMoveCol","javascript:hidePositionColLayer('divSortCol_container');hidePositionColLayer('divSortCol_shadow');"));		
	div_footer.appendChild(createPulsante("idBt_SaveMoveCol","bt_SaveMoveCol","javascript:salvaPositionColWk();"));		

	// appendo al container
	div_container.appendChild(div_footer);		
	// appendo al body
	document.body.appendChild(div_container);
	
	// creo ombra
	div_shadow = createDiv("divSortCol_shadow");
	document.body.appendChild(div_shadow);

	// CARICO combo
	fill_select("divSortCol_listaCol", arrayJsFieldWkKeyCampo,arrayJsFieldWkLabel);
	hidePositionColLayer('divSortCol_container');	
	hidePositionColLayer('divSortCol_shadow');	
}

// metodo che crea DIV 
// e ritorna l'oggetto costruito
// parametri:
// id    
//
function createDiv(idValue){
	var oggetto ;
	
	oggetto = document.createElement("DIV");
	oggetto.id = idValue;
	return oggetto;
}

// metodo che crea LABEL 
// e ritorna l'oggetto costruito
// parametri:
// id    
//
function createLabel(id){
	var oggetto ;
	
	oggetto = document.createElement("LABEL");
	oggetto.id = id;
	return oggetto;
}


function createA(id, hrefLink){
	var oggetto;
	
	oggetto = document.createElement("A");
	oggetto.href = hrefLink;
	oggetto.id = id;
	return oggetto;
}

function createPulsante(idDiv, idLink, hrefLink){
	var oggDiv;
	var oggA;
	
	oggDiv = createDiv(idDiv);
	oggDiv.className = "pulsante";
	oggA = createA(idLink, hrefLink);
	oggDiv.appendChild(oggA);
	return oggDiv;
}


function addEventHandlingToWkHeader(idHeader){
	var oggetto
	
	if (idHeader==""){return;}
	oggetto = document.getElementById(idHeader);
	if (oggetto){
		oggetto.ondblclick = function() {
			ShowAndSetPositionColLayer('divSortCol_container',0);
			ShowAndSetPositionColLayer('divSortCol_shadow',3);			
			}
	}

	
}


// funzione chemostra
// e posizione ove è il cursore il livello
// desiderato
function ShowAndSetPositionColLayer(idDiv, offset){
	
	var oggetto
	var altezzaDocumento = document.body.offsetHeight;
	var larghezzaDocumento = document.body.offsetWidth;	
	
		
	oggetto = document.getElementById(idDiv);
	if (!oggetto){return;}
	oggetto.style.visibility='visible';

	try{
		// posizionamento orizzontale
		if ((event.clientX + document.all.contextualMenu.scrollWidth)>larghezzaDocumento){
			oggetto.style.left = document.body.scrollLeft+event.clientX - oggetto.scrollWidth + offset;
		}
		else{
			oggetto.style.left = document.body.scrollLeft+event.clientX + offset;
		}
		// posizionamento verticale
		if ((event.clientY+oggetto.scrollHeight)>altezzaDocumento){
			if ((event.clientY-oggetto.scrollHeight)>0){
				oggetto.style.top = document.body.scrollTop+(event.clientY-oggetto.scrollHeight) + offset;}
			else{
				oggetto.style.top = document.body.scrollTop + offset;
			}
		}
		else{
			oggetto.style.top = document.body.scrollTop+event.clientY + offset;
		}	
	}
	catch(e){
		alert("ShowAndSetPositionLayer " + e.description);
	}
}

function hidePositionColLayer(idDiv){
	
	var oggetto;
	
	oggetto = document.getElementById(idDiv);
	if (!oggetto){return;}	
	oggetto.style.visibility='hidden';
}


// salva posizione dei campi della wk
// corrente
function salvaPositionColWk(){
	
	var tipoWk
	var valorePosColWk
	

	
	tipoWk = tipoWorklist;
	valorePosColWk = getAllOptionCodeWithSplitElement("divSortCol_listaCol",",")
//	alert("tipo: " + tipoWk);
//	alert("valorePosColWk: " + valorePosColWk);
	// far chiamata ajax che 
	// chiama il metodo dell'utente
	callSetPosizioneCampiWk	(tipoWk, valorePosColWk);
	
}

// "attacca" il tooltip all'header 
// della tabella delle intestazioni
function addToolTipToHeader(idHeader){
	
	var oggetto;

	try{
		oggetto = document.getElementById(idHeader);
		if (oggetto){
			// ****
			oggetto.title = ritornaJsMsg("ttSortCol");
		}
	}
	catch(e){
		alert("addToolTipToHeader - " + e.description)
	}
}


 // ********************* AJAX *****************
function callSetPosizioneCampiWk(tipoWk, valore){

	if (tipoWk==""){return;}
	try{
		// controllo utente expired
		ajaxUserManage.ajaxSetPosizioneCampiWk(tipoWk,valore,replySetPosizioneCampiWk);
	}
	catch(e){
		alert("callSetPosizioneCampiWk - " + e.description)
	}		
}


var replySetPosizioneCampiWk =function (returnValue){
	var utente = "";	
	
	if (returnValue==true){
		alert(ritornaJsMsg("jsmsgHave2Refreh"));
	}
	else{
		alert(ritornaJsMsg("jsmsgNoRefresh"));
	}	
}
 // ********************************************
 
