// JavaScript Document
// NB se usato in combinazione
// con la classe java classWK
// viene utilizzato l'id 
// "idRow"+indice

var cssCollapseRow = "classCollapseRow";

// funzione che collassa
// tutte le righe 
function collapseAllRows()
{
	var i =0
	var ultimoId = "";
	var valoreRadice = "";
	
	for (i=0;i<document.all.oTable.rows.length;i++){
		if (ultimoId=="")
		{
			ultimoId = document.all.oTable.rows(i).id.toString().split("_")[0];
		}
		else
		{
			valoreRadice = document.all.oTable.rows(i).id.toString().split("_")[0].toString();
			if (ultimoId==valoreRadice)
			{
				// stesso gruppo
				hideRow(document.all.oTable.rows(i).id);
			}
			else
			{
				// gruppo diverso
				ultimoId = valoreRadice;
			}
		}
	}
}

function showAllRows(){
	var i =0
	var ultimoId = "";
	
	for (i=0;i<document.all.oTable.rows.length;i++){
		ultimoId = document.all.oTable.rows(i).id.toString();
		showRow(ultimoId);
	}	
}

// Jack!
function HideShowAllGroupRows(ind)
{
	var id = document.all.oTable.rows(ind).id;
	var ok = true;
	
	if(document.all.oTable.rows.length>ind+1)
	{
		if(document.all.oTable.rows(ind+1).id.toString().split("_")[0].toString() != id.split("_")[0].toString())
		{
			ok = false;
		}
		else
		{
			if(ind>0 && !ok)
			{
				if(document.all.oTable.rows(ind-1).id.toString().split("_")[0].toString() != id.split("_")[0].toString())
				{
					ok = false;
				}
				else
				{
					ind--;
				}
			}
			else
			{
				ind++;
			}
		}
	}
	
	if(ok)
	{
		if(document.all.oTable.rows(ind).style.display == 'none' || document.all.oTable.rows(ind).style.display == '')
		{
			showAllGroupRows(id);
		}
		else
		{
			hideAllGroupRows(id);
		}
	}
}

function showAllGroupRows(id)
{
	managerHideShowAllGroupRows(id, 'S')
}

function hideAllGroupRows(id)
{
	managerHideShowAllGroupRows(id, 'H');
}

function managerHideShowAllGroupRows(id, tipo)
{
	var i;
	var elabId = '';
	var primo = true;
	var a_id = id.split('_');
	var a_id_row;
	
	for (i=0; i<document.all.oTable.rows.length; i++)
	{
		elabId = document.all.oTable.rows(i).id.toString();
		
		a_id_row = elabId.split('_');
		
		if(a_id[0] == a_id_row[0])
		{
			if(tipo == 'S')
			{
				showRow(elabId);
			}
			else
			{
				if(!primo)
				{
					hideRow(elabId)
				}
				else
				{
					showRow(elabId);
					primo = false;
				}
			}
		}
	}	
}
// Fine Jack!

// funzione che nasconde la riga
// NON viene effettivamente nascosta
// agendo sullo style perchè
// porterebbe a problemi di allineamento
// con gli array js associati
//
// verificare se è opportuno
// rimappare la classe di queste righe
function hideRow(rowId){
	
	var object 
	
	object = document.getElementById(rowId);
	if (object){
		object.style.display = "none";
	}
}

function showRow(rowId){
	
	var object 
	
	object = document.getElementById(rowId);
	if (object){
		// object.style.className = cssCollapseRow;
		object.style.display = "block";
	}
}