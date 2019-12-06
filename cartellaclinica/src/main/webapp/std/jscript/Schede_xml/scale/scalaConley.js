var WindowCartella = null;
jQuery(document).ready(function(){
	window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    
    // Gestione dell'apertura da finestra modale
    if (typeof window.dialogArguments === 'object')
    	window.WindowCartella = window.dialogArguments.top.window;
	
		//alert(document.getElementById('lblTitleConley').innerText);
	if (document.EXTERN.BISOGNO.value=='N'){
		document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	}
	
	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
	}

	try{
		if(WindowCartella.ModalitaCartella.isStampabile(document)==false){
		   document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		}
	}
	catch(e){}
	
	if (WindowCartella.baseGlobal.SITO != 'ASL5'){
		document.getElementById('chkNecessita').parentElement.parentElement.style.display = 'none';
	}
});




function countChecked(){
var count=0;
var click='N';
if (document.all.chkConleyDom1(1).checked || document.all.chkConleyDom2(1).checked || document.all.chkConleyDom3(1).checked || document.all.chkConleyDom4(1).checked || document.all.chkConleyDom5(1).checked || document.all.chkConleyDom6(1).checked)
	click='S';

		if (document.all.chkConleyDom1(0).checked)
			count+=2;
		if (document.all.chkConleyDom2(0).checked)
			count+=1;
		if (document.all.chkConleyDom3(0).checked)
			count+=1;
		if (document.all.chkConleyDom4(0).checked)
			count+=1;
		if (document.all.chkConleyDom5(0).checked)
			count+=2;
		if (document.all.chkConleyDom6(0).checked)
			count+=3;

if(click=='S' || count>0){		
document.all.txtTotale.value=count;	
document.all.txtTotale.disabled=true;
}
}



function chiudiConley(){

	try{
	var opener=window.dialogArguments;

	var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA, to_char(DATA_RIVALUTAZIONE,'DD/MM/YYYY') AS DATA_SUCCESSIVA from radsql.cc_scale where key_legame='SCALA_CONLEY' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
	query += "@DATA_ULTIMA_MODIFICA*DATA_SUCCESSIVA";
	query += "@1*1";
	dwr.engine.setAsync(false);
	CJsUpdate.select(query, gestDati);
	dwr.engine.setAsync(true);	

	}
	catch (e)
	{
	}

	}

function gestDati(dati){
	var array_dati=null;
	try{
	var opener=window.dialogArguments;
	array_dati = dati.split('@');
	if(array_dati[1] != undefined){
	opener.document.getElementById('txtDataConley').value=array_dati[0];
	opener.document.getElementById('txtDataSucConley').value=array_dati[1];
	opener.document.getElementById('txtEsitoConley').value=document.getElementById('txtTotale').value;
	}
	}catch (e)
	{
	}
}