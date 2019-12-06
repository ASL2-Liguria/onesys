var idenTappo='';

jQuery(document).ready(function() {	
	
	//riduco la finestrella dell'inserimento del tappo
	$("[name='dati']").css("width","450 px");
	$("[name='dati']").css("padding","20 px");
	$("body").addClass("nero");
	
	//aggiungo l'evento onchange al combo della classe (Colore)
	$("select[name=cmbClasse]").change(function(){
		var classeScelta= this.options[this.options.selectedIndex].value;
		cambiaColore(classeScelta);
	});
});


//funzione che cambia colore allo sfondo dell'iframe a seconda della classe del tappo. Prende le classe dal file ListaEsami.css
function cambiaColore(className){
	
	document.body.className ='';
	$("body").addClass(className);	
}


//funzione che inserisce il tappo. Richiama la funzione radsql.INS_TAPPO
function registraNuovoTappo(){
	
	var msg='';
	var sql='';
	var v_descr= document.getElementById("txtNome").value.toUpperCase();
	var v_classe= document.getElementById("cmbClasse").value;
	var v_idenScheda= parent.parent.document.EXTERN.IDEN.value;

	parent.jQuery("#hClasse").val(v_classe);
	
	if(document.getElementById('txtNome').value == '') {
		msg+='-Inserire Nome';
	}
	if(document.getElementById('cmbClasse').value == '') {
		msg+='-Inserire Colore \n';
	}

	
	//messaggio di alert per i campi 'obbligatori'
	if (msg != ''){
		
		alert(msg);
		
	}else{
	
		//qui registro il nuovo tappo

		sql = "{call ? := radsql.CLS_INS_TAPPO('"+ v_descr +"','"+ v_classe +"', "+ v_idenScheda +")}";
		//alert(sql);
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, callIden);
		dwr.engine.setAsync(true);
	}
	
	//funzione di callback per recuperare l'iden del tappo salvato
	function callIden(resp){
		//alert('iden del tappo o resp: '+resp);
		if(resp.substring(0,2) != 'KO'){
			idenTappo=resp;
			parent.document.getElementById('elencoTappi').contentWindow.ricaricaWk();
			
			parent.$.fancybox.close();
			
			//simulo quello che fa la funzione visualizzaTappo//////////////////////////
			visualizzaTappoIns(idenTappo, v_descr, v_classe)

			parent.document.getElementById("lblColore").parentElement.className ='';
			addClass(parent.document.getElementById("lblColore").parentElement, parent.document.getElementById("hClasse").value);
			parent.document.getElementById("lblColore").innerText='QUESTO E\' IL COLORE DEL CONTENITORE';
			//alert('className: '+document.getElementById("lblColore").parentElement.className);
			
			
		}else{
			alert("Errore nel salvataggio: "+resp.substring(3));
			location.replace(location);
		}
	}
}

function visualizzaTappoIns(idenTappo, v_descr, v_classe){
	
	parent.document.getElementById('hContenitore').value = idenTappo;
	parent.document.getElementById('hDescrContenitore').value = v_descr;
	parent.document.getElementById('hClasse').value = v_classe;
	parent.document.getElementById('lblElencoEsamiTappo').innerText = v_descr;
	
	//mostro il dettaglio dei tappi
	parent.$('#divEsamiTappo').show(300);
	parent.$('#divRicEsami').show(300);

	parent.filtroEsamiTappo();
	
	//opacizzo div dei tappi e nascondo il listbox (in IE6 non si opacizza)
	addClass(parent.document.getElementById('divElencoTappi'),'opacity');
	addClass(parent.document.getElementById('divTappiScheda'),'opacity');

}




