var removeOnUnload = true;

try{
	$('input[name=chkEpisodio]').attr('checked', 'checked');
	$("input[name=txtGiorni]").attr('readonly','readonly');
}
catch(e){}


function init(){
	dd_config();	
	var ordine = document.all.nav.childNodes[0].ordine;
	
	document.body.onselectstart=function(){return false;}
	for (var i=0;i<document.all.tabMain.rows.length;i++)
	{
		
		var idenParametro = document.all.tabMain.rows[i].iden_parametro;
		document.getElementById(idenParametro+'#'+ordine).style.display='block';
		appendTarget(document.getElementById(idenParametro+'#'+ordine),ordine);
		//appendSlider(document.all['parametro'+idenParametro],document.all['parametro'+document.all.tabMain.rows[i].iden_parametro].chkParametro.precision,1,10);
		
	}
	
	document.all.nav.childNodes[0].className="tabberactive";	
	
	document.all.divMain.style.height = screen.availHeight - document.all.divMain.offsetTop - top.document.all.frameImpostazione.offsetTop -40;
	
	for(i=0;i<document.all.nav.childNodes.length-1;i++)
		document.all['Farmaci'+document.all.nav.childNodes[i].ordine].style.height = document.all.divMain.offsetHeight +'px';
		
	document.all['Farmaci'+ordine].style.display='block';	
	
		
	
}
function selectTabber(obj){
	for (var i=0;i<document.all.nav.childNodes.length-1;i++)
	{
		var ordine = document.all.nav.childNodes[i].ordine;
		if (obj == document.all.nav.childNodes[i])
		{
			document.all.nav.childNodes[i].className = "tabberactive";
			
			for(var j=0;j<document.all.tabMain.rows.length;j++)
			{
					var idenParametro = document.all.tabMain.rows[j].iden_parametro;					
					document.getElementById(idenParametro+'#'+ordine).style.display = 'block';
					appendTarget(document.getElementById(idenParametro+'#'+ordine),ordine);
			}
			document.all['Farmaci'+ordine].style.display = 'block';				
		}
		else
		{
			document.all.nav.childNodes[i].className = "";
			for(var j=0;j<document.all.tabMain.rows.length;j++)
			{
					var idenParametro = document.all.tabMain.rows[j].iden_parametro;					
					document.getElementById(idenParametro+'#'+ordine).style.display = 'none';
			}

			document.all['Farmaci'+ordine].style.display = 'none';	
		}
	}
}
function editPeriodo(obj){
	function classParam()
	{	
		var now = new Date();
		var giorno ='0' + now.getDate();
		var mese = '0' +(now.getMonth()+1);
		var anno = now.getYear();
		giorno = giorno.substring(giorno.length-2,giorno.length);
		mese = mese.substring(mese.length-2,mese.length);	
	
		this.ordine = obj.ordine;
		if (obj.data_ini=='')
			this.dataIni=anno+mese+giorno;
		else
			this.dataIni=obj.data_ini;
		if (obj.data_fine=='')
			this.dataFine=anno+mese+giorno;
		else		
			this.dataFine=obj.data_fine;
		this.n_giorni=obj.n_giorni;
		this.episodio=obj.episodio;
		this.ricovero=obj.ricovero;
		this.storico=obj.storico;
	}
	var param = new classParam();
	var xml = window.showModalDialog('modalUtility/grafici/impostaPeriodo.html',param,'dialogHeight:300px;dialogWidth:700px');
	if (xml==null || xml==undefined || xml=='')
		return;	

	var sql = "UPDATE CC_GRAFICI SET contenuto =  deletexml(contenuto,'/CHART/PERIODI/PERIODO[@ordine=\""+obj.ordine+"\"]')  where iden="+document.all.dati.idenGrafico.value;	
	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callBack);
	dwr.engine.setAsync(true);
	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		else
		{
			sql = "UPDATE CC_GRAFICI SET contenuto =  appendChildXML(contenuto,'/CHART/PERIODI',xmlTYPE('"+xml+"')) where iden="+document.all.dati.idenGrafico.value;	
			
			dwr.engine.setAsync(false);
			dwrTerapie.execute(sql,ricarica);
			dwr.engine.setAsync(true);			
		}
	}	

}
function ricarica(resp){
	if (resp!='OK')
		alert(resp);
	removeOnUnload = false;	
	document.all.dati.submit();		
}
function addPeriodo(){
	
	function classParam()
	{
		var now = new Date();
		var giorno ='0' + now.getDate();
		var mese = '0' +(now.getMonth()+1);
		var anno = now.getYear();
		giorno = giorno.substring(giorno.length-2,giorno.length);
		mese = mese.substring(mese.length-2,mese.length);
		
		this.ordine = parseInt(document.all.nav.childNodes[document.all.nav.childNodes.length-2].ordine,10)+1;
		this.dataIni=anno+mese+giorno;
		this.dataFine=anno+mese+giorno;
		this.n_giorni='';
		this.episodio='false';
		this.ricovero='false';
		this.storico='false';
	}
	var param = new classParam();
	var resp = window.showModalDialog('modalUtility/grafici/impostaPeriodo.html',param,'dialogHeight:300px;dialogWidth:700px');
	if (resp==null || resp==undefined || resp=='')
		return;
	
	var sql = "UPDATE CC_GRAFICI SET contenuto =  appendChildXML(contenuto,'/CHART/PERIODI',xmlTYPE('"+resp+"')) where iden="+document.all.dati.idenGrafico.value;	

	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,ricarica);
	dwr.engine.setAsync(true);
}
function removePeriodo(ordine){
	var sql = "update CC_GRAFICI set contenuto= deletexml(contenuto,'/CHART/*/*[@ordine=\""+ordine+"\"]') where iden="+document.all.dati.idenGrafico.value;
	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,ricarica);
	dwr.engine.setAsync(true);	
}
function abilitaParametro(obj){
	
	myForm = document.all['parametro'+obj.iden_parametro];

	myForm.chkParametroLine.checked=obj.checked;	
	myForm.chkParametroShape.checked=obj.checked;	
	myForm.chkParametroLabel.checked=obj.checked;
	
		
		
	if (obj.checked)
	{
		myForm.chkParametroLine.parentNode.style.visibility = "visible";
		myForm.chkParametroShape.parentNode.style.visibility = "visible";
		myForm.chkParametroLabel.parentNode.style.visibility = "visible";

		var sql = "UPDATE CC_GRAFICI SET contenuto =  appendChildXML(contenuto,'/CHART/PARAMETRI',xmlTYPE('<PARAMETRO iden_parametro=\""+obj.iden_parametro+"\" dimension=\"1\" precision=\"1\" line=\"S\" shape=\"S\" label=\"S\" />')) where iden="+document.all.dati.idenGrafico.value;
		dwr.engine.setAsync(false);
		dwrTerapie.execute(sql,callBack);
		dwr.engine.setAsync(true);
	}else
	{
		myForm.chkParametroLine.parentNode.style.visibility = "hidden";
		myForm.chkParametroShape.parentNode.style.visibility = "hidden";
		myForm.chkParametroLabel.parentNode.style.visibility = "hidden";		
		
		var sql = "update CC_GRAFICI set contenuto= deletexml(contenuto,'/CHART/*/*[@iden_parametro=\""+obj.iden_parametro+"\"]') where iden="+document.all.dati.idenGrafico.value;
		dwr.engine.setAsync(false);
		dwrTerapie.execute(sql,callBack);
		dwr.engine.setAsync(true);		
	}
	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		for (var i=0;i<document.all.tabMain.rows.length;i++)
			if (document.all.tabMain.rows[i].iden_parametro==obj.iden_parametro)
			{
				var row=i;
				break;
			}

		if (obj.checked)
			for (var i=0;i<document.all.tabMain.rows[row].cells[1].childNodes.length;i++)
			{
				document.all.tabMain.rows[row].cells[1].childNodes[i].src=document.all.tabMain.rows[row].cells[1].childNodes[i].src2call;
				appendTarget(document.all.tabMain.rows[row].cells[1].childNodes[i],document.all.tabMain.rows[row].cells[1].childNodes[i].ordine)
			}
		else
			for (var i=0;i<document.all.tabMain.rows[row].cells[1].childNodes.length;i++)
			{
				document.all.tabMain.rows[row].cells[1].childNodes[i].src="";
				removeTarget(document.all.tabMain.rows[row].cells[1].childNodes[i],document.all.tabMain.rows[row].cells[1].childNodes[i].ordine);
			}

	}
}
function visualizza(){
	function classParam(){
		this.arPeriodi  = new Array();
		this.arOrdine  = new Array();
		for (var i=0;i<document.all.nav.childNodes.length-1;i++)
		{
			this.arPeriodi.push(document.all.nav.childNodes[i].firstChild.innerText.replace('x',''));
			this.arOrdine.push(document.all.nav.childNodes[i].ordine);
		}

		this.arParametri = new Array();	 
		this.arIdenParametro = new Array();
		for (var i=0;i<document.all.tabMain.rows.length;i++)
		{
			myForm = document.all['parametro'+document.all.tabMain.rows[i].iden_parametro];
			
			if (myForm.chkParametro.checked)
			{
				this.arParametri.push(myForm.chkParametro.descr);
				this.arIdenParametro.push(myForm.chkParametro.iden_parametro);				
			}
		}
	}
	
	allineaAttributi();
	
	var param = new classParam();	
	if (param.arParametri.length==0)		
	{
		alert("Selezionare almeno un parametro");
		return;
	}
	
	retValue = window.showModalDialog("modalUtility/grafici/contenitore.html",param,"dialogHeight:500px;dialogWidth:700px; scroll: no ; status:no");
	if (retValue.wPeriodo.length==0)
		return;
	
	var upd ="";
	for (var i=0;i<param.arOrdine.length;i++)
		upd+="'/CHART/PERIODI/PERIODO[@ordine=\""+param.arOrdine[i]+"\"]/@dimension','"+retValue.wPeriodo[i]+"',"
		
	for (var i=0;i<param.arIdenParametro.length;i++)
		upd+="'/CHART/PARAMETRI/PARAMETRO[@iden_parametro=\""+param.arIdenParametro[i]+"\"]/@dimension','"+retValue.hParametro[i]+"',"		
	
	var sql = "update CC_GRAFICI set contenuto=updatexml(contenuto,"+upd.substring(0,upd.length-1)+") where iden=" + document.all.dati.idenGrafico.value;

	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callBack);
	dwr.engine.setAsync(true);		
	
	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		var url = "../../Charts?";
		url+= "height="+(screen.availHeight -20);
		url+= "&width="+(screen.availWidth -20);
		
		url+="&idenGrafico="+document.all.dati.idenGrafico.value;
		url+="&idenAnag="+document.all.dati.idenAnag.value;
		url+="&idenVisita="+document.all.dati.idenVisita.value;
		url+="&ricovero="+document.all.dati.ricovero.value;
		
		//window.open('modalUtility/grafici/chartContainer.html');
		window.open('modalUtility/grafici/chartContainer.html','','fullscreen=yes');
		//window.open(url,"","fullscreen=yes");
	}	
}

function allineaAttributi(){
	
	var esegui = false;
	var sql = "update CC_GRAFICI set contenuto = updatexml(contenuto";
	for (var i =0;i<document.all.tabMain.rows.length;i++)
	{
		myForm = document.all['parametro'+document.all.tabMain.rows[i].iden_parametro];
			
		if (myForm.chkParametro.checked)		
		{			
			esegui = true;
			sql += ",'/CHART/PARAMETRI/PARAMETRO[@iden_parametro=\""+document.all.tabMain.rows[i].iden_parametro+"\"]/@line'"
			if (myForm.chkParametroLine.checked)
				sql +=",'S'";
			else
				sql +=",'N'";
				
			sql += ",'/CHART/PARAMETRI/PARAMETRO[@iden_parametro=\""+document.all.tabMain.rows[i].iden_parametro+"\"]/@shape'"
			if (myForm.chkParametroShape.checked)
				sql +=",'S'";
			else
				sql +=",'N'";	
				
			sql += ",'/CHART/PARAMETRI/PARAMETRO[@iden_parametro=\""+document.all.tabMain.rows[i].iden_parametro+"\"]/@label'"
			if (myForm.chkParametroLabel.checked)
				sql +=",'S'";
			else
				sql +=",'N'";

			//sql += ",'/CHART/PARAMETRI/PARAMETRO[@iden_parametro=\""+document.all.tabMain.rows[i].iden_parametro+"\"]/@precision'"
			//sql+=",'1'";


		}
	}
	sql+=") where iden="+document.all.dati.idenGrafico.value;
	if (esegui)
	{
		dwr.engine.setAsync(false);
		dwrTerapie.execute(sql,callBackNoReload);
		dwr.engine.setAsync(true);		
	}

}

function apriGrafico(){
	
	/*var idenParametro = document.dati.cmbParametro.value;
	var range = document.dati.txtGiorni.value;
	var idAnag = document.EXTERN.idAnag.value;
	
	document.all.frameGrafico.src = "Charts?tipo="+idenParametro+"&idAnag="+idAnag+"&range="+range+"&height="+(document.all.frameGrafico.offsetHeight-50)+"&width="+(document.all.frameGrafico.offsetWidth-50);*/
	var idenParametro = document.dati.cmbParametro.value;
	var giorni = document.dati.txtGiorni.value==''? 0 : document.dati.txtGiorni.value;
	var idenRicovero = document.EXTERN.idenRicovero.value;
//	document.all.frameGrafico.src = "Charts?tipo="+idenParametro+"&idAnag="+idAnag+"&range="+range+"&height="+(document.all.frameGrafico.offsetHeight-50)+"&width="+(document.all.frameGrafico.offsetWidth-50);
	document.all.frameGrafico.src = "Charts?tipo="+idenParametro+"&idenVisita="+idenRicovero+"&range=3&giorni="+giorni+"&height="+(document.all.frameGrafico.offsetHeight-50)+"&width="+(document.all.frameGrafico.offsetWidth-50);
	
}

function controllaCheck(){
	
if (document.all.chkEpisodio.checked) {
		
		document.dati.txtGiorni.value = '';
		document.dati.txtGiorni.readOnly = true;

	}else{
		
		document.dati.txtGiorni.value = '1';
		document.dati.txtGiorni.readOnly = false;
		
	}
}

function controllaCombo() {
	
	var idenParametro = document.EXTERN.idenParametro.value;
	
	if(idenParametro != '')
		for(i = 0; i < document.dati.cmbParametro.length; i++)
			document.dati.cmbParametro[i].selected = (document.dati.cmbParametro[i].value == idenParametro);

}
	
function dd_config(){
	DragDrop.setup(
	  {
		  levelMouseMove :0,
		  object2disable:[document.body],
		  targetObject:[],			  
		  draggabledObject:[],	  
		  classDragObj:'objTrascinato',			  
		  generateHtmlContent:function(obj){return genHtml(obj);},				  
		  eventMouseUpInTarget:function(target){moveUpInTarget(target)},			  
		  eventMouseUpOutTarget:function(target){return null;},			  
		  eventMouseUpRestore:null,				  
		  eventMouseMoveInTarget:null,
		  eventMouseMoveOutTarget:null				  
	  }
	)
}
function genHtml(obj){
	return '<div iden_farmaco="'+obj.iden_farmaco+'" style="padding-top:30px;font-size:24px;text-align:center">'+obj.descr_farmaco+'</div>';
}

function appendObject(objTab,ordine){
	for (var i=0;i<objTab.rows.length;i++)
		parent.DragDrop.addSelectedObject({object:objTab.rows[i],gruppo:ordine,eventSelectedStyle:['background:yellow']});	
}
function appendTarget(obj,ordine){
	DragDrop.addTarget({object:obj,gruppo:ordine});
}
function removeTarget(obj,ordine){
	DragDrop.removeTarget({object:obj,gruppo:ordine});
}
function moveUpInTarget(target)
{
	var xmlFarmaco = '<FARMACO iden_farmaco="'+DragDrop.dragObj.firstChild.iden_farmaco+'" iden_parametro="'+target.iden_parametro+'" ordine="'+target.ordine+'" line="" shape="S" label="S"/>';
	var sql = "UPDATE CC_GRAFICI SET contenuto =  appendChildXML(contenuto,'/CHART/FARMACI',XMLTYPE('"+xmlFarmaco+"')) where iden =" +document.all.dati.idenGrafico.value;
	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callBack);
	dwr.engine.setAsync(true);
	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		target.src = target.src;
	}
	
}
function remove(idParametro,ordine,idFarmaco){

	var sql = "UPDATE CC_GRAFICI SET contenuto =  DELETEXML(contenuto,'/CHART/FARMACI/FARMACO[@iden_parametro=\""+idParametro+"\"][@ordine=\""+ordine+"\"][@iden_farmaco=\""+idFarmaco+"\"]') where iden =" +document.all.dati.idenGrafico.value;
	//alert(sql);
	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callBack);
	dwr.engine.setAsync(true);
	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		for (var i=0;i<document.all.tabMain.rows.length;i++)	
			for (var j=0;j<document.all.tabMain.rows[i].cells[1].childNodes.length;j++)
				if (document.all.tabMain.rows[i].cells[1].childNodes[j].iden_parametro==idParametro && document.all.tabMain.rows[i].cells[1].childNodes[j].ordine==ordine)
					document.all.tabMain.rows[i].cells[1].childNodes[j].src=document.all.tabMain.rows[i].cells[1].childNodes[j].src;
	}	
}
function setFarmacoAttribute(idParametro,ordine,idFarmaco,attr,value){
	
	var filter = "[@iden_parametro=\""+idParametro+"\"][@ordine=\""+ordine+"\"][@iden_farmaco=\""+idFarmaco+"\"]";
	var sql ="UPDATE CC_GRAFICI SET contenuto=UPDATEXML(contenuto,  '/CHART/FARMACI/FARMACO"+filter+"/@"+attr+"', '"+value+"') where iden="+document.all.dati.idenGrafico.value;
	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callBackNoReload);
	dwr.engine.setAsync(true);	
}

function registra(){
	allineaAttributi();
	
	var param = new Object();
	param.iden_ute       = (document.all.save.iden_ute.value!='');
	param.iden_anag      = (document.all.save.iden_anag.value!='');
	param.codice_reparto = (document.all.save.codice_reparto.value!='');
	param.descrizione    = document.all.save.descrizione.value;
	
	param.save = 'N';
	
	window.showModalDialog("modalUtility/grafici/registra.html",param,"dialogHeight:200px;dialogWidth:800px;; scroll: no ; status:no");
	
	if (param.save=='N')
		return;
	else
	{
		var sql = "Update CC_GRAFICI set";
		
		if (param.iden_ute)
		{
			document.all.save.iden_ute.value = true;
			sql+=" IDEN_UTE="+document.all.dati.idenPer.value+",";
		}
		else
			sql+=" IDEN_UTE=null,";
		if (param.iden_anag)
		{
			document.all.save.iden_anag.value = true;
			sql+=" IDEN_ANAG="+document.all.dati.idenAnag.value+",";
		}
		else
			sql+=" IDEN_ANAG=null,";
		if (param.codice_reparto)
		{
			document.all.save.codice_reparto.value = true;
			sql+=" CODICE_REPARTO='"+document.all.dati.reparto.value+"',";
		}
		else
			sql+=" CODICE_REPARTO=null,";
		
		document.all.save.descrizione.value = param.descrizione;
		sql += "DESCRIZIONE='"+param.descrizione+"'";
			
			
		sql+=" where iden="+document.all.dati.idenGrafico.value;	
		dwr.engine.setAsync(false);
		//alert(sql);
		dwrTerapie.execute(sql,callBackReloadWK);
		dwr.engine.setAsync(true);		
	}
	function callBackReloadWK(resp)
	{
		if (resp!='OK')
			alert(resp);		
		parent.document.all.oIFWorklist.src = parent.document.all.oIFWorklist.src;
	}
}
function unload(){
	
	if (!removeOnUnload)
		return;
	
	var sql = "delete from CC_GRAFICI where IDEN_ANAG is null and CODICE_REPARTO is null and IDEN_UTE is null and IDEN="+document.all.dati.idenGrafico.value;
	
	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callBackNoReload);
	dwr.engine.setAsync(true);		
	
}
function callBackNoReload(resp)
{
	if (resp!='OK')
		alert(resp);
}	
