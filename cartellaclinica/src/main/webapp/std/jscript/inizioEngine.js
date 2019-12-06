// JavaScript Document

//Javascript NameSpace Per Gestire la chiusura di whale
var closeWhale = {

	arrayWindowOpened : new Array(),
	
	init:function(){
	},
	
	pushFinestraInArray:function(finestra){
		this.arrayWindowOpened.push(finestra);
	},
	
	clearArray: function(){
		for (var i=0;i<this.arrayWindowOpened.length;i++){
			try
			{
				this.arrayWindowOpened[i].close();	
			}
			catch(e)
			{
				alert('clearArray'+e.description);
			}
		}
	},
	
	retLenghtArray:function(){
		alert(this.arrayWindowOpened.length);
	},
	
	chiudiWhale:function(){
		try
		{
			closeWhale.clearArray();
		}catch(e)
		{
			alert('chiudiWhale'+e.description);
		}
			top.close();
	}
}


var statoFrame='chiuso';
//window.onload = function startup(){initGlobalObject();};

function initGlobalObject(){
	try{

		window.onunload = function scaricaFrameset(){scarica();};
		initbaseGlobal();
		initbaseUser();
		initbasePC();
//		alert("Sito in fase di test");
	}
	catch(e){
		;
	}
}

initGlobalObject();

function getStatoFrame(stato)
{
	if(stato == 'chiuso' || stato == 'aperto')
		statoFrame = stato;

	return statoFrame;
}


// funzione EXPANDMENU
function expandMenu(){
	if(statoFrame=='chiuso'){
		parent.document.all.oFrameset.cols = '170,*';
    	statoFrame='aperto';
 	}
 	else{
   		shrinkMenu();
   		statoFrame='chiuso';
 	}

	leftFrame.ShowHideLayer('layMenuContainer');

 // devo ridimensionare, se presente
 // il tabheader della worklist
 try{
	 mainFrame.workFrame.worklistMainFrame.resizeTabHeader();
 }
 catch(e){
	 ;
 }

}


// funzione SHRINKMENU
function shrinkMenu(){
	parent.document.all.oFrameset.cols = '20,*';
}


// funzione che scarica
// tutti gli oggetti aperti
function scarica(){

	//scarico pacs
	// non mi preoccupo del tipo
	// di pacs da scaricare
	// perchè è definito dentro a
	// HideIntegrazioni
	quitPacs();
}

// funzione che fa quit
// dei vari pacs
function quitPacs(){
	try{
		// chiude gli esami sul pacs
		mainFrame.hideFrame.sendToPacs("QUIT",mainFrame.hideFrame.objectSyncPacs,"");
	}
	catch(e){
		;
	}
}

function executeStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	top.dwr.engine.setAsync(false);
	dwrUtility.executeStatement(pFileName,pStatementName,pBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	top.dwr.engine.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}

function executeBatchStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	top.dwr.engine.setAsync(false);
	dwrUtility.executeBatchStatement(pFileName,pStatementName,pBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	top.dwr.engine.setAsync(true);
	return vResponse;
	
	function callBack(resp){
		vResponse = resp;
	}
}


function executeQuery(pFileName , pStatementName , pBinds){
	var vResponse;
	dwr.engine.setAsync(false);
	dwrUtility.executeQuery(pFileName,pStatementName,pBinds,callBack);
	dwr.engine.setAsync(true);
	return vRs;

	function callBack(resp){
		var valid=true;
		var error='';
		var ArColumns,ArData;
		
		if (resp[0][0] == 'KO') {
			valid = false;
			error = resp[0][1];
			ArColumns =  ArData = new Array();
		} else {
			ArColumns = resp[1];
			ArData = resp.splice(2, resp.length-1);
		}
		vRs = {
			isValid:valid,
			getError:function(){return error;},
			columns:ArColumns,
			data:ArData,
			size:ArData.length,
			current:null,
			next:function(){
				if(this.current==null && this.size>0){
					this.current = 0;
					return true;
				}else{
					return ++this.current < this.size;
				}
			},
			getString:function(pColumnName){
				return this.data[this.current][this.getColumnIndex(pColumnName)];
			},
			getInt:function(pColumnName){
				return parseInt(this.getString(pColumnName),10);
			},
			getColumnIndex:function(pColumnName){
				pColumnName = pColumnName.toUpperCase();
				for (var i = 0; i< this.columns.length;i++){
					if(this.columns[i] == pColumnName){
						return i;
					}
				}
			}
		}
	}
}


//funzione che nasce per ovviare il problema del passaggio degli array ad un opener. Si effettua la chiamata passando normalmente i parametri, più il tipo di chiamata
function executeType(statementFile, statementName, parameterIn, typeCall, pOuts){
	
	//alert(parameterIn);

	var resp='';
	var json_text = JSON.stringify(parameterIn);
	var param = JSON.parse(json_text);
	
	switch(typeCall){
	
		case 'executeStatement':
			
			resp=top.executeStatement(statementFile,statementName,param,(typeof pOuts=='undefined'?0:pOuts));
			return resp;
			break;
			
		case 'executeBatchStatement':
			
			resp=top.executeStatement(statementFile,statementName,param,(typeof pOuts=='undefined'?0:pOuts));
			return resp;
			break;				
			
		case 'executeQuery':
			
			resp=top.executeQuery(statementFile,statementName,param);
			return resp;
			break;
							
		default:
			break;
	}
}

