 
jQuery(document).ready(function() {	
caricaLabelOrder();
caricaWkMinus();
});


function annullaMat(){

	 $('#divInsMat').fadeOut(300);
}


//wk esami
function associaEsami(codice, descrizione){

	codice+='*';
	descrizione+='*';
	var splitCodice=codice.split('*');
	var splitDescrizione=descrizione.split('*'); 
	var ListEsaTappo=parent.$("#elencoEsamiTappo [tipo='esami']");
	var value='';
	var text='';
	var html='';
	var controllo='OK';
	
	//gestione del materiale per biologia molecolare
	if  (parent.parent.document.getElementById('hTipo').value=='B'){
		
		parent.$('#divInsMat').show(300);
		
		value=splitCodice[0];
		text=splitDescrizione[0];
		
		parent.document.getElementById('hEsame').value=value;
		parent.document.getElementById('hNomeEsame').value=text;

		//alert('hEsame: '+parent.document.getElementById('hEsame').value);
		//alert('hNomeEsame: '+parent.document.getElementById('hNomeEsame').value);
	
	}else{
		
		//gestione per esami di laboratorio e di  microbiologia
		for (var i=0;i<splitCodice.length;i++){

			value=splitCodice[i];
			//alert(value);
			
			for (var z=0;z<splitDescrizione.length;z++){
		
				text=value.substring(1,value.length) + ' - ' +splitDescrizione[i];
				//alert(text);
			}
			
			//aggiungo la option al listbox di riepilogo
			if (value !=''){

				html=creaElemento(value,'esami', text);
				
				if (ListEsaTappo.length > 0){
					
					//controllo se l'esame non è già presente
					for (var x=0;x<ListEsaTappo.length;x++){
						
						var split = ListEsaTappo[x].innerText.split(' - ');
						
						if(value.substring(1) == split[0]){ 
							controllo = 'KO';
						}
					}
					
					if (controllo == 'OK'){
						parent.document.getElementById('elencoEsamiTappo').appendChild(html);
					}
					
				}else{
					
					parent.document.getElementById('elencoEsamiTappo').appendChild(html);
				}
				
				controllo = 'OK';
			}
		}
			
		//parent.document.getElementById('txtRicEsami').value='';
		//ricaricaWk();
		//parent.ricercaEsameWk();
	
	try{ parent.sortableLi(); }catch(e){}
		
	}
}


function creaElemento(valore, tipo, testo){
	var html = document.createElement("li");
	html.setAttribute("value",valore);
	html.tipo = tipo;
	html.innerHTML = testo;
	return html;
	
}


//function richiamata dal tasto associa nel div di scelta dei materiali
function associaMat(){

	var combo=document.getElementById('elencoMat');
	var Listbox=document.getElementById('elencoEsamiTappo');
	var text=document.getElementById('hNomeEsame').value;
	var value=document.getElementById('hEsame').value;
	
	for (var i=0;i<combo.options.length;i++){
	
		if (combo.options[i].selected ){
			
			if (value!=''){value+=',';}
			value+=combo.options[i].value;
		}
	}
	
	//alert('text: '+text+'\n\n\n\nvalue:'+value);

	//aggiungo la option al listbox di riepilogo
	if (value !=''){
	
		Listbox.options[Listbox.options.length]=new Option(text, value );
	}
		
	document.getElementById('elencoEsami').contentWindow.ricaricaWk();
	annullaMat();

}


function caricaLabelOrder(){

	var order =document.EXTERN.ORDER_FIELD_CAMPO.value;
	//parent.document.getElementById('lblOrderEsami').innerText='';

	if (order !=''){
		if (order.substring(order.length-4,order.length)==' ASC'){
			//parent.document.getElementById('lblOrder').innerText+=order;
			parent.document.getElementById('lblOrderEsami').className='';
			addClass(parent.document.getElementById('lblOrderEsami'), 'orderAsc');
		}else{
			parent.document.getElementById('lblOrderEsami').className='';
			addClass(parent.document.getElementById('lblOrderEsami'), 'orderDesc');
		}
	}
}


function caricaWkMinus(){

//alert(parent.document.getElementById('hVisualizzazione').value);

	if(parent.document.getElementById('hVisualizzazione').value=='MOD'){

		ricaricaWk();
		return;
	}
}



function ricaricaWk(){

	var ListEsami=parent.document.getElementById('elencoEsamiTappo');
	var orderField=document.EXTERN.ORDER_FIELD_CAMPO.value;
	var splitEsa='';
	var cont=parent.document.getElementById('hContenitore').value;
	var elencoIden='';
	var src='';
	var height='';
	var whereWk='';
	var keyLegame=parent.document.getElementById('hTipoWk').value;
	var elencoIdenEsa='';
	var elencoIdenProf='';
	
	//gestione del materiale per biologia molecolare
	//alert(parent.parent.document.getElementById('hTipo').value);
	if  (parent.parent.document.getElementById('hTipo').value=='B'){
	
		height='500px';
	
		for (var i=0;i<ListEsami.length;i++){

			if (elencoIden!='' && ListEsami[i].value !=''){
		
				elencoIden+=',';
			}
			
			if(ListEsami[i].value!=''){
			
				splitEsa=ListEsami[i].value.split(',');
				elencoIden+=splitEsa[0];
				//alert(elencoIden);

			}
		}
		
	}else{
	
		height='350px';

		for (var i=0; i< ListEsami.length ;i++){
		
			//alert('tipo: '+ListEsami.options[i].value.substring(0,1));
	
			if (ListEsami[i].value.substring(0,1)=='E'){
				
				if (esame!=''){esame+=',';}
			
				esame+="'"+ListEsami[i].value+"'";
			
			}else if(ListEsami[i].value.substring(0,1)=='P'){
			
				if (profili!=''){profili+=',';}
			
				profili+="'"+ListEsami[i].value+"'";
			
			}
		}
		
		//valorizzo i campi nascosti degli iden associati alla scheda
		parent.document.getElementById('hElencoIdenEsa').value=elencoIdenEsa;
		parent.document.getElementById('hElencoIdenProf').value=elencoIdenProf;
	}	
		
	if (keyLegame==''){keyLegame='WK_ESAMI_CONFIGURATORE';}
	
	
	if (keyLegame=='WK_ESAMI_CONFIGURATORE'){
		
		if (elencoIdenEsa != ''){
			whereWk+="where iden not in ("+elencoIdenEsa+")";
		}else{
			whereWk+="where 1=1";
		}
		
	}else if (keyLegame=='WK_PROFILI_CONFIGURATORE'){
		
		if (elencoIdenProf != ''){
			whereWk+="where iden not in ("+elencoIdenProf+")";
		}else{
			whereWk+="where 1=1";
		}
	}

	src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+whereWk+"&ORDER_FIELD_CAMPO="+orderField;
	//alert(src);  
	parent.document.getElementById('hVisualizzazione').value='';

	//ricarico la worklist con la nuova where condition
	var iframe='';

	iframe+='<div id="divElencoEsami" ><IFRAME id=elencoEsami height='+height+' src="'+src+'" frameBorder=0 width=500 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	parent.$("#elencoEsami").replaceWith(iframe);

}



