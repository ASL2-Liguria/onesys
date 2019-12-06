// JavaScript Document
var SAVER = {
	valuesArray: [],
	stmToSave:"",
	hndHome:parent.parent.top,
	setHome: function(value){
		this.hndHome;
	},
	getHome: function(){
		return this.hndHome;
	},		
	setStmToSave: function(value){
		this.stmToSave = value;
	},
	getStmToSave: function(){
		return this.stmToSave;
	},
	setValuesArray: function(lista){
		this.valuesArray = lista;
	},
	getValuesArray: function(){
		return this.valuesArray;
	},
	doSave:function(){
		var strLog = "";
		var listaDati = this.getValuesArray();
		var stm = this.getHome().executeStatement('gestioneNuovoAmbu.xml',this.getStmToSave(),listaDati,0);		
		if (stm[0]!="OK"){
			strLog = "Errore \n" + stm[1] ;
			throw new Error(strLog) ;
		}		
		else{
			strLog = "Procedura '" + this.getStmToSave() +"' correttamente eseguita";
		}
	}
}

var ERASER = {
	stmToDel:"",
	hndHome:parent.parent.top,
	valuesArray: [],	
	setHome: function(value){
		this.hndHome;
	},
	getHome: function(){
		return this.hndHome;
	},	
	setStmToDel: function(value){
		this.stmToDel = value;
	},
	getStmToDel: function(){
		return this.stmToDel;
	},
	setValuesArray: function(lista){
		this.valuesArray = lista;
	},
	getValuesArray: function(){
		return this.valuesArray;
	},	
	doErase:function(){
		var strLog = "";

		var stm = this.getHome().executeStatement('gestioneNuovoAmbu.xml',this.getStmToDel(),this.getValuesArray(),0);		
		if (stm[0]!="OK"){
			strLog = "Errore \n" + stm[1] ;
			throw new Error(strLog) ;
		}		
		else{
			strLog = "Procedura '" + this.getStmToDel() +"' correttamente eseguita";
		}
	}
}

var TABLE_BUILDER = {
	nomeSezione: "",
	fieldsArray: [],
	stmToLoad:"",
	stmToSave:"",
	fieldsToCreateDelStm: [],
	hndHome:parent.parent.top,
	setHome: function(value){
		this.hndHome = value;
	},
	getHome: function(){
		return this.hndHome;
	},
	setSezione: function(value){
		this.nomeSezione = value;
	},
	getSezione: function(){
		return this.nomeSezione;
	},
	setStmToSave: function(value){
		this.stmToSave = value;
	},
	getStmToSave: function(){
		return this.stmToSave;
	},
	setStmToLoad: function(value){
		this.stmToLoad = value;
	},
	getStmToLoad: function(){
		return this.stmToLoad;
	},	
	setFieldsArray: function(lista){
		this.fieldsArray = lista;
	},
	getFieldsArray: function(){
		return this.fieldsArray;
	},
	setFieldsToCreateDelStm: function(lista){
		this.fieldsToCreateDelStm = lista;
	},
	getFieldsToCreateDelStm: function(){
		return this.fieldsToCreateDelStm;
	},
	getRenderedTable:function(){
		var strTable = "", strThead = "", strTbody = "", strTfoot = "";
		var delParam = "";
		
		function createDelParam(){
			delParam = "";
			for (var i=0; i < listaCampiToCreateDelStm.length; i++){
				if (i==0){
					delParam += "{\""+ listaCampiToCreateDelStm[i].nomedb +"\":\"" + rs.getString(listaCampiToCreateDelStm[i].nomedb) +"\"}";
				}
				else{
					delParam += ", {\""+ listaCampiToCreateDelStm[i].nomedb +"\":\"" + rs.getString(listaCampiToCreateDelStm[i].nomedb) +"\"}";
				}
			}
			delParam = "{\"stmToDel\":[" + delParam + "]}";
			delParam = delParam.replace(/\"/g, "|");
		}
		/*<thead>  <tr>     <th>Month</th>     <th>Savings</th>  </tr> </thead>*/
		var listaCampi = this.getFieldsArray();
		var listaCampiToCreateDelStm = this.getFieldsToCreateDelStm();
		if (typeof(listaCampi)=="undefined"){
			throw new Error("Errore campi non definiti") ;
		}
		try{
			for (var k=0; k < listaCampi.length; k++){
				strThead += "<th>" + listaCampi[k].th_value + "</th>"
			}
			if (strThead!=""){
				// inserisco tag mancanti e colonne per inserimento e cancellazione
				strThead = "<thead><tr><th>&nbsp;</th><th>&nbsp;</th>" + strThead + "</tr></thead>";
			}
			var rs = this.getHome().executeQuery('gestioneNuovoAmbu.xml',this.getStmToLoad(),[]);
			while (rs.next()){
				strTbody += "<tr>";
				// settare il delStatement e non getSezione
				createDelParam();
				strTbody += "<td><a href='#' onclick='javascript:insertRow(\"" + this.getSezione()+"\");'>Ins.</a></td><td><a href='#' onclick='javascript:deleteRow(\"" + this.getSezione()+"\", \"" + delParam + "\");return true;'>Canc.</a></td>";
				for (var i=0; i < listaCampi.length; i++){
					strTbody += "<td>" + rs.getString(listaCampi[i].nomedb) + "</td>";
				}
				strTbody += "</tr>";
			}
			if (strTbody!=""){
				strTbody = "<tbody>" + strTbody + "</tbody>"
			}
			strTable = "<table id='dataTable_" + this.getSezione() +"' class='clsDatiTabella'>" + strThead + strTbody + "</table>";
		}
		catch(e){
			throw new Error("getRenderedTable, Error: " + e.description) ;
		}
		return strTable;
	}
}