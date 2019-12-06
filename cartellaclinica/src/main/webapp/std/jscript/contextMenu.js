// script per menu contestuale
// NB la tabella del menu contestuale ha id fisso: contextualMenu
// NON può esistere + di un menu contestuale in una pagina


// NB IMPORTANTE ***************
// per fare la selezione automatica
// della riga devo essere sicuro di aver caricato al_selriga.js
// affinchè abbia a disp

var rigaSelezionataDalContextMenu=-1;
var idToolTip = "oLayNoMenu";
var _funzioneIllumina = null;

// funzione che crea il 
// div e lo appende al documento
function creaDivMenuVuoto(valore){
	if (valore===""){return;}
	var oDiv=document.createElement("DIV");
	oDiv.setAttribute("id", valore);
	oDiv.innerText = "Permissioni negate, nessun menù disponibile.";
	document.body.appendChild(oDiv);
	oDiv.style.visibility = "hidden";	
	oDiv.style.position = "absolute";
	oDiv.style.left = document.body.scrollLeft+event.clientX;
	oDiv.style.top = document.body.scrollTop+event.clientY;
	oDiv.style.visibility = "visible";	
	oDiv.className = "ContextNull";
}

// funzione che elimina
// un elemento specificato
// tramite ID
function eliminaDivVuoto(valore){
	if (valore===""){return;}
	var object = document.getElementById(valore);
	if (object){
		object.removeNode(true);
	}	
}

function hideContextMenu()
{
	var object = document.getElementById("contextualMenu");
	if (object){
		document.all.contextualMenu.style.visibility='hidden';
	}
	// se non esiste menu
	// ci sarà quello di accesso negato
	// lo elimino
	eliminaDivVuoto(idToolTip);
}

function MenuTxDx(){
	
	if(typeof document.all.contextualMenu == 'undefined' || !document.all.contextualMenu){
		return;
	}
	
	var altezzaDocumento = document.body.offsetHeight;
	var larghezzaDocumento = document.body.offsetWidth;
	if (rigaSelezionataDalContextMenu!=-1){
		// se esistono più di una riga selezionata non faccio nulla
		// altrimenti simulo il click sulla riga
		if ((vettore_indici_sel.length<2)){
			if (vettore_indici_sel[0]!=rigaSelezionataDalContextMenu){
				if(_funzioneIllumina === null){
					//illumina(parseInt(rigaSelezionataDalContextMenu));
					illumina(parseInt(rigaSelezionataDalContextMenu,10));
				}else{	
					eval(_funzioneIllumina);
				}
			}
		}
	}
	// posizionamento orizzontale
	if ((event.clientX + document.all.contextualMenu.scrollWidth)>larghezzaDocumento){
		document.all.contextualMenu.style.left = document.body.scrollLeft+event.clientX - document.all.contextualMenu.scrollWidth;
	}
	else{
		document.all.contextualMenu.style.left = document.body.scrollLeft+event.clientX;
	}
	// posizionamento verticale
	if ((event.clientY+document.all.contextualMenu.scrollHeight)>altezzaDocumento){
		if ((event.clientY-document.all.contextualMenu.scrollHeight)>0){
			document.all.contextualMenu.style.top = document.body.scrollTop+(event.clientY-document.all.contextualMenu.scrollHeight);
		}else{
			document.all.contextualMenu.style.top = document.body.scrollTop;
		}
	}
	else{
		document.all.contextualMenu.style.top = document.body.scrollTop+event.clientY;
	}
	document.all.contextualMenu.style.visibility = "visible";
	rigaSelezionataDalContextMenu=-1;
	
	/*Attributi delle voci di menu nel caso CONTEXTMENU2012*/
	try {
		jQuery("#contextualMenu li").each(function(){
			jQuery(this).addClass("ContextMenuNormal");
			jQuery(this).mouseover(function(){
				jQuery(this).removeClass("ContextMenuNormal");
				jQuery(this).addClass("ContextMenuOver");
				jQuery(this).children("ul").show();
			});
			jQuery(this).mouseleave(function(){
				jQuery(this).removeClass("ContextMenuOver");
				jQuery(this).addClass("ContextMenuNormal");
				jQuery(this).children("ul").hide();
			});
		});
		jQuery("#contextualMenu li ul").each(function(){
			var parent = jQuery(this).parent();
			parent.addClass("contextMenuNode");
			jQuery(this).addClass("contextMenuUl");
			jQuery(this).css({"margin-left": parent.innerWidth()});
			jQuery(this).css({"margin-top": - 2*parent.outerHeight()});
		});
	} catch (i) {
		
	}
	
	/*Disattivazione/attivazione voci in base a v_globali, configura_pc, web (attributo show)*/
	try {
		jQuery("#contextualMenu li[show]").each(function(){
			try {
				if (typeof this.show != 'undefined') {
					if (eval(this.show) == true) {
						jQuery(this).show();
					} else {
						jQuery(this).hide();
					}
				}
			} catch (m) {

			}
		});
	} catch (k) {

	}
	
	/*Disattivazione voci non appropriate per la riga selezionata (attributo contextmenu)*/
	try {
		var proprieta_sel = stringa_codici(array_contextmenu);
		var x = eval('(' + proprieta_sel + ')');
		jQuery("#contextualMenu li[contextmenu]").each(function(){
			try {
				y = this.contextmenu.split(",");
				for (var i=0; i < y.length; i++) {
					if (x[y[i]]=="N") {
						jQuery(this).hide();
					} else {
						jQuery(this).show();
						return;
					}
				}
			} catch(l) {
				
			}
		});
	} catch (j) {
		
	}
	
	try{
		if (baseUser.ABILITA_CONTEXT_MENU=="S"){
				return true;
		}
		else{
			return false;
		}

	}
	catch(e){
		return false;
	}
}


// funzione richiamata nel caso in cui
// non si abbia nessuna voce
// disponibile perchè non si hanno le permissioni
function mostraTooltipMenuVuoto()
{
	var bolEsisteDiv = false;
	// controllare se esiste  già il livello
	var object = document.getElementById(idToolTip);
	if (object){
		bolEsisteDiv = true;
	}
	if (bolEsisteDiv){
		eliminaDivVuoto(idToolTip);
	}
	creaDivMenuVuoto(idToolTip);	
	var objectNode = document.getElementById(idToolTip);
	if (objectNode){
		objectNode.style.display='block';
	}
	try{
		if (baseUser.ABILITA_CONTEXT_MENU=="S"){
				return true;
		}
		else{
			return false;
		}

	}
	catch(e){
		return false;
	}
}

var nsMenu={
		menu : null,
		
		createMenu : function(procedura, x, y) {
			nsMenu.removeMenu();
			var cList = $('<ul></ul>').addClass('listUl').css({position: "absolute","top":y+'px',"left":x+'px'});;
		
			var vRs = top.executeQuery("menu.xml","getMenuJs",[procedura]);			
			while(vRs.next()) {
				
			    var li = $('<li/>')
		        .appendTo(cList);
			    var aaa = $('<a/>')
		        .attr('href','javascript:'+vRs.getString("LINK"))
		        .text(vRs.getString("LABEL"))
		        .appendTo(li);
			}
		
			cList.appendTo('body');
			
		},
		
		removeMenu : function() {
			$('.listUl').remove();
		}
			
			
	};

