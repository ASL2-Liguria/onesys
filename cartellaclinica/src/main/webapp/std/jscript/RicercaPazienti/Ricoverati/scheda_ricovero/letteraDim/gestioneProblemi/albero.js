var altezza = 0;
var frameAttivo;
function chiudiAlbero()
{
	document.all[frameAttivo].src= "";
	document.all[frameAttivo].style.display='none';
	document.all[frameAttivo].style.height='0px';
}
function setProblema(obj)
{
	obj.className = 'ramoAperto';
	top.codICD.innerText = obj.innerText;
	top.formSalva.idenIcd.value = obj.id;
	top.chiudiAlbero();
}
function apriAlbero()
{
	frameAttivo='frameICD';
	document.all[frameAttivo].style.display='block';
	document.all[frameAttivo].src="albero?tipo=SETTORI&valore=";	
}
function apriRamo(obj)
{
	frameAttivo = 'frame'+obj.id;
	if (document.all[frameAttivo].style.display=='block')
	{
		obj.className = 'ramoChiuso';
		document.all[frameAttivo].style.display='none';
		setDimension();
		return;
	}
	for (i=0;i<document.all.oTable.rows.length;i++){
		chiudiRamo(document.all.oTable.rows[i].cells[0].firstChild);
	}
	obj.className = 'ramoAperto';
	document.all[frameAttivo].style.display='block';
	document.all[frameAttivo].src="albero?tipo="+obj.tipo2open+"&valore="+obj.id;

}

function chiudiRamo(obj)
{	
	obj.className = 'ramoChiuso';
	document.all['frame'+obj.id].src= "";
	document.all['frame'+obj.id].style.display='none';	
	document.all['frame'+obj.id].style.height='0px';
}

function setDimension()
{
	document.all[frameAttivo].style.height=altezza;
	if (frameAttivo=='frameICD')
		return;

		parent.altezza=parseInt(document.getElementById('oTable').offsetHeight)+5;
		parent.setDimension();

}
function setAltezza()
{
	if (frameAttivo=='frameICD')
		return;

	parent.altezza=parseInt(document.getElementById('oTable').offsetHeight)+5;      
   	parent.setDimension();
}
function aggiornaOpener()
{
	opener.top.apriProblemiAllerte();
}
function registra()
{
	document.formSalva.note.value = document.all.txtNote.innerText;
	document.formSalva.priorita.value=document.all.cmbPriorita.options[document.all.cmbPriorita.selectedIndex].value;
	document.formSalva.submit();
	opener.aggiorna();
}
function risolvi(obj)
{
	if (obj.risolto=='S')
	{
		document.formSalva.risolto.value = 'N'
		obj.risolto='N';
		obj.className = 'risoltoN';
	}else
	{
		document.formSalva.risolto.value = 'S'
		obj.risolto='S';
		obj.className = 'risoltoS';		
	}	
}
	