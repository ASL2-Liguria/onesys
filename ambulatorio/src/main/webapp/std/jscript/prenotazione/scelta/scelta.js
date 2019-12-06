function seleziona_tutto()
{
	var i;
	// modifica 31-8-16
	try{
		if (!(document.getElementById("btSelAll"))){
		   var row = document.getElementById("lblTitolo").parentNode.parentNode;
	    	var x = row.insertCell(2);
			x.className = "classButtonHeader";
    		x.innerHTML = "<div class='pulsante' id='btSelAll'><a id='lblSelAll' href='javascript:seleziona_tutto();'>Seleziona tutto</a></div>";
		}
	}
	catch(e){
		alert(e.description);
	}	
	for(i=0; i<a_indice.length; i++)
		{ 		highLight(i,false);	}
		
	//		rimappo click errato !
	var table = document.getElementById("oTable");
	for (var i = 0, row; row = table.rows[i]; i++) {
		//iterate through cells
		//cells would be accessed using the "cell" variable assigned in the for loop
		try{
			row.onclick = function(){
				highLight(this.sectionRowIndex, true);				
			}
			
		} catch(e){
			;		 
		}
	}
		
		
}


// modifica 31-8-16
// dal momento che NON posso modificare
// illumina_multiplo di al_selRiga (usata da tutte le nuove wk)
// ne faccio una sola finalizzata allo scopo di selezionare
// sempre e comunque una riga
function highLight(indice, forceSwitch){
	var resto=0;
	if (hasClass(document.all.oTable.rows(indice), "sel")){
		// gia selezionato
		if (forceSwitch){
			rimuovi_indice(indice);
			removeClass(document.all.oTable.rows(indice), "sel");
			removeClass(document.all.oTable.rows(indice), "col_over");
		}
	}
	else{
		// seleziona
		addClass(document.all.oTable.rows(indice), "sel");
		nuovo_indice_sel(indice);
	}
	old_selezionato = indice;
}
// ********


function registra()
{
	var id_sel;
	
	id_sel = stringa_codici(a_indice);
	
	if(id_sel == '')
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{
		opener.inserisci_prenotazione(id_sel);
		self.close();
	}
}

function registra_consulta()
{
	var id_sel;
	
	id_sel = stringa_codici(a_indice);
	
	if(id_sel == '')
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{
		opener.inserisci_prenotazione_consultazione(id_sel);
		self.close();
	}
}