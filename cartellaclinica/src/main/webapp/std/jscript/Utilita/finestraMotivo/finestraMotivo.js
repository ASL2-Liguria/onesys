function getMotivoModale(lunghezza_minima){
	return window.showModalDialog("servletGenerator?KEY_LEGAME=FINESTRA_MOTIVO",lunghezza_minima,"dialogWidth: 400px; dialogHeight: 130px; scroll: no ; status:no ");
}
function getMotivoControind(lunghezza_minima){
	//alert(gup("IDEN_VISITA"));
	return window.showModalDialog("servletGenerator?KEY_LEGAME=FINESTRA_MOTIVO_CONTROINDICAZIONE",lunghezza_minima,"dialogWidth: 400px; dialogHeight: 300px; scroll: no ; status:no ");
}
function getMotivoData(lunghezza_minima, date,chkChiusuraDet,params){
	return window.showModalDialog("servletGenerator?KEY_LEGAME=FINESTRA_MOTIVO_DATA",[lunghezza_minima,date,chkChiusuraDet,params],"dialogWidth: 600px; dialogHeight: 300px; scroll: no ; status:no ");
}
function getMotivoMedico(lunghezza_minima){
	return window.open("servletGenerator?KEY_LEGAME=FINESTRA_MOTIVO_MEDICO","finestra","width: 500px; height: 300px; scroll: no ; status:no ");
}
function getDaDataAData(inDataIni,inDataFine,inOraIni,inOraFine,inMotivo){
	function classDate(){
		this.dataIni = inDataIni;
		this.oraIni = inOraIni;
		this.dataFine = inDataFine;
		this.oraFine = inOraFine;
		this.motivo = inMotivo;
	}
	var param = new classDate();
	return window.showModalDialog("modalUtility/DaDataAData.html",param,"dialogWidth: 500px; dialogHeight: 300px; scroll: no ; status:no");
}
function getConfermaOrario(data_default,ora_default,array_date){
	function clsParam(){
		this.ora_default = ora_default;
		this.data_default = data_default;		
		this.array_date = array_date;
	}
	var param = new clsParam();
	return window.showModalDialog("modalUtility/confermaOrario.html",param,"dialogWidth: 200px; dialogHeight: 200px; scroll:no ; status:no ");
}
function getConfermaOrarioNote(data_default,ora_default,array_date, note, livello, dose_var,arUdm){
	function clsParam(){
		this.ora_default = ora_default;
		this.data_default = data_default;		
		this.array_date = array_date;
		this.nota = note;
		this.livello = livello;
		this.dose_var = dose_var;
		if(typeof arUdm != 'undefined'){
			this.arUdm = arUdm;
		}		
	}
	var x = 480;
	var y = 300 + (array_date.length>2?(15*(array_date.length-2)):0);
	if (dose_var) {
		y += 25*(dose_var.split('|').length);
	} 
	var param = new clsParam();
	return window.showModalDialog("modalUtility/confermaOrarioNote.html",param,"dialogWidth:"+x+"px; dialogHeight:"+y+"px; scroll:no ; status:no ");
}
function getNotaDaDataAData(data_default,ora_default,array_date){
	function clsParam(){
		this.ora_default = ora_default;
		this.data_default = data_default;		
		this.array_date = array_date;
	}
	var param = new clsParam();
	return window.showModalDialog("modalUtility/NotaDaDataAData.html",param,"dialogWidth: 250px; dialogHeight: 350px; scroll:no ; status:no ");
}
function getDaDataAData_noOra(inDataIni,inDataFine){
	function classDate(){
		this.dataIni = inDataIni;
		this.dataFine = inDataFine;
	}	
	var param = new classDate();
	return window.showModalDialog("modalUtility/DaDataAData_noOra.html",param,"dialogWidth: 300px; dialogHeight: 150px; scroll: no ; status:no");
}
function getNumericValue(in_number){

	return window.showModalDialog("modalUtility/getNumericValue.html",in_number,"dialogWidth: 175px; dialogHeight: 75px; scroll: no ; status:no");
}

function getDati(pPageName,pParam){		
	var DialogWidth = (typeof pParam['dialogWidth'] != 'undefined' ? 'dialogWidth:' + 'px;' : '');
	var DialogHeight = (typeof pParam['dialogHeight'] != 'undefined' ? 'dialogHeight:' + 'px;' : '');
	var DialogTop = (typeof pParam['dialogTop'] != 'undefined' ? 'dialogTop:' + 'px;' : '');
	var DialogLeft = (typeof pParam['dialogLeft'] != 'undefined' ? 'dialogLeft:' + 'px;' : '');
	
	var DialogParameters = DialogWidth + ' ' + DialogHeight + ' ' + DialogTop + ' ' + DialogLeft + ' scroll: no ; status:no;';
	
	return window.showModalDialog("modalUtility/"+pPageName+".html",pParam,DialogParameters);	
}

function getNotaTerapia(nota_pre, livello_pre) {
	return window.showModalDialog("modalUtility/NotaTerapia.html",[nota_pre,livello_pre],"dialogWidth: 300px; dialogHeight: 150px; scroll: no ; status:no");
}

function getDosaggioDettaglio(dosaggio) {
	return window.showModalDialog("modalUtility/TerapiaInserisciDosaggio.html",[dosaggio],"dialogWidth: 300px; dialogHeight: 150px; scroll: no ; status:no");
}

function getDaDataADataDiario (inDataIni,inDataFine){
	function classDate(){
		this.dataIni = inDataIni;
		this.dataFine = inDataFine;
	}	
	var param = new classDate();
	return window.showModalDialog("modalUtility/DaDataADataDiario.html",param,"dialogWidth: 300px; dialogHeight: 150px; scroll: no ; status:no");

}

function getCambioVelocita(pDataInizio,pOraInizio,pSosp) {
	function classDati(){
		this.sospensione=pSosp;
		this.dataInizio=pDataInizio;
		this.oraInizio=pOraInizio;
	}
	var param = new classDati();
	return window.showModalDialog("servletGenerator?KEY_LEGAME=FINESTRA_SCELTA_VELOCITA",param,"dialogWidth: 450px; dialogHeight: 200px; scroll: no ; status:no");
}

//prende parametri dal top
function  gup( name ){

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var tmpURL = document.location.href;
	var results = regex.exec( tmpURL );

	if( results == null ){
		return "";
	}else{
		return results[1];
	}
}

function getDaDataADataDiarioRicovero (inDataIni,inDataFine,arrayTipoRicoveroTxt,arrayTipoRicoveroVal){
	function classDati(){
		this.dataIni        = inDataIni;
		this.dataFine       = inDataFine;
        this.tiporicoveroTxt= arrayTipoRicoveroTxt;
        this.tiporicoveroVal= arrayTipoRicoveroVal;
	}

	var param = new classDati();
    var paramValue = window.showModalDialog("modalUtility/preOperatorio/DaDataADataTipoRicovero.html",param,"dialogWidth: 500px; dialogHeight: 250px; scroll: no ; status:no");
	return paramValue;
}
