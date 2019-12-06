function seleziona_tutti(vettore)
{
	var indice=0;
	for(indice = 0; indice < vettore.length; indice ++)
	{
		document.all.oTable.rows(indice).style.backgroundColor = sel;
		nuovo_indice_sel(indice);
	}
}

//*******************************

function deseleziona_tutti(vettore)
{
	var indice=0;
	for(indice = 0; indice < vettore.length; indice ++)
	{
		document.all.oTable.rows(indice).style.backgroundColor = desel;
		rimuovi_indice(indice);
	}
}

//*******************************


function cancellazione(){
	
	var codici = "";

	codici = stringa_codici(array_iden);
	if (codici == ""){
		alert("Selezionare almeno una riga");
		return;
	}

	CancErrori.CancellaRow(codici,ritornaErrore)

 }
  
//*******************************
  
  function ritornaErrore(Errore){
  if (Errore.length<3)
	{
		// chiamare pulsante applica di sopra		
		parent.Personale.document.form_ricerca.submit();
	}
	else
	{
		alert(Errore);
	}
	CancErrori = null;
  }

