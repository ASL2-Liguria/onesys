// JavaScript Document
function chiudiFancyBox(){
	try{
		$.fancybox.close();
	}
	catch(e){
		alert("chiudiFancyBox - Error: "+ e.description);
	}
}

function initProcedureCreateLayerChangeStatus(){
	createLayerSortingColumns();
	//addToolTipToHeader("idHeaderTableWk");
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
	
	
	var contentHtml = "";
	

	div_container = createDiv("divChangeStatus_container");
	div_header = createDiv("divSortCol_header");

	var lbl_header = createLabel("lblStatus_header");
	lbl_header.innerText = "Prego selezionare un nuovo stato";
	// appendo label
	div_header.appendChild(lbl_header);
	
	// appendo header al container
	div_container.appendChild(div_header);
	
	
	
	div_content = createDiv("divSortCol_content");
	// per ora li creo staticamente poi verranno
	// creati dinamicamente
	contentHtml = "<table width='200'>";
	contentHtml += "<tr><td><label class='statoPointer' ><input gruppo = 'statoAgg' type='radio' name='listaStati' value='NP' id='listaStati_0' onclick = 'javascript:adjustStatusStyle();'/>Non presentato</label></td></tr>";
	contentHtml += "<tr><td><label class='statoPointer' ><input gruppo = 'statoAgg' type='radio' name='listaStati' value='D' id='listaStati_1' onclick = 'javascript:adjustStatusStyle();'/>Disdetto</label></td></tr>";
	contentHtml += "<tr><td><label class='statoPointer' ><input gruppo = 'statoAgg' type='radio' name='listaStati' value='DP' id='listaStati_2' onclick = 'javascript:adjustStatusStyle();'/>Disdetto e Riprenota</label></td> </tr></table>";
	
	// appendo oggetto select
	div_content.innerHTML = contentHtml;
	// appendo content al wrapper
	
	// appendo wrapper al container
	div_container.appendChild(div_content);

	
	// ********* footer
	div_footer = createDiv("divSortCol_footer");
	div_footer.appendChild(createPulsante("idBt_CloseStatus","bt_CloseStatus","javascript:chiudiFancyBox();","Chiudi"));
	//div_footer.appendChild(createPulsante("idBt_CloseLayMoveCol","bt_CloseLayMoveCol","javascript:hidePositionColLayer('divChangeStatus_container');hidePositionColLayer('divSortCol_shadow');"));
	
	div_footer.appendChild(createPulsante("idBt_SaveStatus","bt_SaveStatus","javascript:salvaStatoAggiuntivo();","Registra"));		

	// appendo al container
	div_container.appendChild(div_footer);		
	// appendo al body
	document.body.appendChild(div_container);
	hidePositionColLayer('divChangeStatus_container');	
}

// rimappa i colori dei radio button
function adjustStatusStyle(){
	try{
		//alert(oggetto.parentNode.nodeName);
		
		$("input:radio").each(function(indice) {
			// Iterate through all checked radio buttons
			if($(this).is(':checked')) {
				// implementare una classe 
				 $(this.parentNode).css('color', 'red');
				// $(this.parentNode).attr('class','rdBtChecked');
			}
			else{
				 $(this.parentNode).css('color', 'black');
				//$(this.parentNode).attr('class' , 'rdBtUnChecked');
			}
		});
//		alert ($(this).val());
	}
	catch(e){
		alert("checkStatus - Error: "+ e.description);
	}
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

function createPulsante(idDiv, idLink, hrefLink, textLink){
	var oggDiv;
	var oggA;
	
	oggDiv = createDiv(idDiv);
	oggDiv.className = "pulsante";
	oggA = createA(idLink, hrefLink);
	oggA.innerHTML = textLink;
	oggDiv.appendChild(oggA);
	return oggDiv;
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




 // ********************************************
 
