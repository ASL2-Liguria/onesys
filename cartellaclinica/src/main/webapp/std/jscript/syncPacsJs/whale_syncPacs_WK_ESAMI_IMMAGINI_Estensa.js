// alessandroc
// JavaScript Document
// file Js permette di aprire le immagini presenti su polaris
// dalla worklist WK_ESAMI_IMMAGINI
// AZIONI Possibili da whale:
// SHOWSTUDY_STUDY 		(apre l'immagine associata all'id_esame_dicom)

function syncEstensa() {
	var issuer = 'POLARIS';
	var pathFile = 'D://ESTENSA//';
	accNumber = stringa_codici(array_id_esame_dicom);
	accNumber=accNumber.replace("VS","");
	var comando = 'SHOWSTUDY';
	var listaNomeParametri = '';
	var listaValoriParametri = '';
	var idis = stringa_codici(array_idis);
	
	sendToEstensaPacs(comando, accNumber, issuer, idis, pathFile, listaNomeParametri, listaValoriParametri);
	
}

function JSettings()
{
	this.IE=document.all?true:false;
	this.MouseX=_JSettings_MouseX;
	this.MouseY=_JSettings_MouseY;
	this.SrcElement=_JSettings_SrcElement;
	this.Parent=_JSettings_Parent;
	this.RunOnLoad=_JSettings_RunOnLoad;
	this.FindParent=_JSettings_FindParent;
	this.FindChild=_JSettings_FindChild;
	this.FindSibling=_JSettings_FindSibling;
	this.FindParentTag=_JSettings_FindParentTag;
}
function _JSettings_MouseX(e)
{return this.IE?event.clientX:e.clientX;}
function _JSettings_MouseY(e)
{return this.IE?event.clientY:e.clientY;}
function _JSettings_SrcElement(e)
{return this.IE?event.srcElement:e.target;}
function _JSettings_Parent(Node)
{return this.IE?Node.parentNode:Node.parentElement;}
function _JSettings_RunOnLoad(Meth){var Prev=(window.onload)?window.onload:function(){};window.onload=function(){Prev();Meth();};}
function _JSettings_FindParent(Node, Attrib, Value)
{var Root = document.getElementsByTagName("BODY")[0];
Node = Node.parentNode;	while (Node != Root && Node.getAttribute(Attrib) != Value){Node=Node.parentNode;}
if (Node.getAttribute(Attrib) == Value)	{return Node;} else	{return null;}}
function _JSettings_FindParentTag(Node, TagName)
{var Root = document.getElementsByTagName("BODY")[0];
TagName=TagName.toLowerCase();
Node = Node.parentNode;	while (Node != Root && Node.tagName.toLowerCase() != TagName){Node=Node.parentNode;}
if (Node.tagName.toLowerCase() == TagName) {return Node;} else {return null;}}
function _JSettings_FindChild(Node, Attrib, Value)
{
	if (Node.getAttribute)
		if (Node.getAttribute(Attrib) == Value) return Node;

	var I=0;
	var Ret = null;
	for (I=0;I<Node.childNodes.length;I++)
	{
		Ret = FindChildByAttrib(Node.childNodes[I]);
		if (Ret) return Ret;
	}
	return null;
}
function _JSettings_FindSibling(Node, Attrib, Value)
{
	var Nodes=Node.parentNode.childNodes;
	var I=0;
	for (I=0;I<Nodes.length;I++)
	{
		if (Nodes[I].getAttribute)
		{
			if (Nodes[I].getAttribute(Attrib) == Value)
			{return Nodes[I];}
		}
	}
	return null;
}

var Settings = new JSettings();


/*0 Hide the window and activate another window. 
'1 Activate and display the window. (restore size and position) Specify this flag when displaying a window for the first time. 
'2 Activate & minimize. 
'3 Activate & maximize. 
'4 Restore. The active window remains active. 
'5 Activate & Restore. 
'6 Minimize & activate the next top-level window in the Z order. 
'7 Minimize. The active window remains active. 
'8 Display the window in its current state. The active window remains active. 
'9 Restore & Activate. Specify this flag when restoring a minimized window. 
'10 Sets the show-state based on the state of the program that started the application.
Percorso completo con /
*/
function openShell (valore, windowMode, waitFlag){
	var ReturnCode ;
	try{
		var shell = new ActiveXObject("WScript.Shell") ;
		if (windowMode==""){windowMode=1;}
		var ReturnCode = shell.Run(valore, windowMode, waitFlag);
	}
	catch(e){
		alert("openShell - Error: " + e.description);
	}
}


function deleteEstensaFiles(pathFile){
	var cmdToRun = "";
	try{
		var FSO = new ActiveXObject("Scripting.FileSystemObject") ;
	    FSO.deletefile (pathFile + "*.estensa", true);
	}
	catch(e){
//		alert("deleteEstensaFiles - Error: " + e.description);		
	}
}


function XMLWriter()
{
    this.XML=[];
    this.Nodes=[];
    this.State="";
    this.FormatXML = function(Str)
    {
        if (Str)
            return Str.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return ""
    }
    this.BeginNode = function(Name)
    {
        if (!Name) return;
        if (this.State=="beg") this.XML.push(">");
        this.State="beg";
        this.Nodes.push(Name);
        this.XML.push("<"+Name);
    }
    this.EndNode = function()
    {
        if (this.State=="beg")
        {
            this.XML.push("/>");
            this.Nodes.pop();
        }
        else if (this.Nodes.length>0)
            this.XML.push("</"+this.Nodes.pop()+">");
        this.State="";
    }
    this.Attrib = function(Name, Value)
    {
        if (this.State!="beg" || !Name) return;
        this.XML.push(" "+Name+"=\""+this.FormatXML(Value)+"\"");
    }
    this.WriteString = function(Value)
    {
        if (this.State=="beg") this.XML.push(">");
        this.XML.push(this.FormatXML(Value));
        this.State="";
    }
    this.Node = function(Name, Value, extendedSyntax)
    {
        if (!Name) return;
        if (this.State=="beg") this.XML.push(">");
//        this.XML.push((Value=="" || !Value)?"<"+Name+"/>":"<"+Name+">"+this.FormatXML(Value)+"</"+Name+">");
		if (Value=="" || !Value){
			if (extendedSyntax){
				this.XML.push("<"+Name+"></"+Name+">");				
			}
			else{
				this.XML.push("<"+Name+"/>");
			}
		}
		else{
			this.XML.push("<"+Name+">"+this.FormatXML(Value)+"</"+Name+">");
		}
        this.State="";
    }
    this.Close = function()
    {
        while (this.Nodes.length>0)
            this.EndNode();
        this.State="closed";
    }
    this.ToString = function(){return this.XML.join("");}
}
// *********************
// ATTENZIONE !! per la 
// masterizzazione facendo più
// file per ogni accNumber 
// verranno creati più CD !!!
// quindi per esami aventi lo stesso referto
// chiamare la procedura con UN SOLO accNumber !!!111111111

var intestazioneXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
var lastFileIndex = 0;




//@PARAM comando - valori possibili BURN, SHOWSTUDY, CLOSE_CURR_SESSION, QUIT
//@PARAM accNumber - accession number
//@PARAM issuer - indica il system description name
//@PARAM pathFile - indica il percorso ove salvare il file. NB *DEVE* terminare con \
//@PARAM fileName - nome del file che deve essere salvato, comprensivo di estensione
//@PARAM listaNomeParametri - elenco nome parametri splittati da #
//@PARAM listaValoriParametri - elenco valori parametri splittati da #
function sendToEstensaPacs(comando, accNumber, issuer, idis, pathFile, listaNomeParametri, listaValoriParametri){
	try{
		var url = basePC.URL_VE;
		if (url!='') {
			
			//if (baseUser.LOGIN=='alessandroc' || baseUser.LOGIN=='joele') {
				url += '/Estensa/ViewImages.aspx?';
				switch (idis) {
					case '2': 
						url += 'IdPres=' + accNumber + '&IdIs=2'; 
						break;
					case '6':
						url += 'ExternalId=' + accNumber + '&Issuer=ESTENSACARDIO&IdIs=6';
						break;
					default:
						url += 'ExternalId=' + accNumber + '&Issuer=POLARIS';
				
				}
			//	alert('IdIs:' + idis + '\nurl chiamata: ' + url);
			//} else {
			//	url += '/estensa/ViewImages.aspx?ExternalId=' + accNumber + '&Issuer=' + issuer;
			//}
			
			
			window.open(url);
		} else {
			if (comando==""){return;}
			if (lastFileIndex==0){
				// se è la prima sincro cancello
				// i precedenti files
				deleteEstensaFiles(pathFile);
			}
			//return;
			writeEstensaFileAndExecute(comando, accNumber, issuer, pathFile, listaNomeParametri, listaValoriParametri);		
		}
	}
	catch(e){
		alert("sendToEstensaPacs: " + e.description);
	}
}

function masterizzaEstensa()
{
	if (conta_esami_sel()==0 || conta_esami_sel()>1 ){
			alert('Selezionare un esame');
			return;
		}

writeEstensaFileAndExecute('BURN',stringa_codici(array_id_esame_dicom),'POLARIS','c:\\temp\\','','');
}
function writeEstensaFileAndExecute(comando, accNumber, issuer, pathFile, listaNomeParametri, listaValoriParametri){

   var listaAccNum;
   var i=0;
   var j=0;
   var strXML = "";
   var fso;
   var s;
	try{
		listaAccNum = accNumber.split("#");
		if (comando == "BURN" || comando == "SHOWSTUDY"){
			if (accNumber==""){alert("Nessun accession number definito.");return;}
			for (i=0; i<listaAccNum.length;i++){
				strXML = getXMLstring (comando,	listaAccNum[i], issuer, listaNomeParametri, listaValoriParametri);
				fileName = Right(("000000" + lastFileIndex.toString()).toString(),6) + ".estensa";
				// scrivo file				
				fso = new ActiveXObject("Scripting.FileSystemObject");
				s = fso.CreateTextFile(pathFile + fileName, true);
				s.Write(intestazioneXML + "\n" + strXML);
				s.Close();
				// devo quindi eseguire il file
				openShell(pathFile + fileName,1, false);
				lastFileIndex ++ ;	
			}
		}
		else{
			strXML = getXMLstring (comando,	"", issuer, listaNomeParametri, listaValoriParametri);			
			fileName = Right(("000000" + lastFileIndex.toString()).toString(),6) + ".estensa";
			// scrivo file				
			fso = new ActiveXObject("Scripting.FileSystemObject");
			s = fso.CreateTextFile(pathFile + fileName, true);
			s.Write(intestazioneXML + "\n" + strXML);
			s.Close();
			// devo quindi eseguire il file
			openShell(pathFile + fileName,1, false);
			lastFileIndex ++ ;	
		}
	}
	catch(e){
		alert("writeEstensaFileAndExecute- Error: " + e.descritpion);
	}
	finally{
			
	}
}
	


function getXMLstring (comando, accNumIesimo, issuer, listaNomeParametri, listaValoriParametri){
   var XML;	
	try{
		XML=new XMLWriter();			
		// creo sezione fissa
		// 
		XML.BeginNode("EstensaCommandParameters");
		XML.Attrib("Version", "1");				
		XML.Attrib("xmlns", "urn:EstensaCommandParameters");				
		// ENTITY *****
		XML.BeginNode("Entity");
		XML.Node("HostName","",true);
		XML.Node("IP","",true);				
		XML.BeginNode("ApplicationName");
		XML.WriteString("estensaParam.exe");
		XML.EndNode();//ApplicationName
		XML.BeginNode("ID");
		XML.WriteString("dc53f8ad-4b60-4a47-9b78-57a26475eefa");
		XML.EndNode();//ID
		XML.Node("UserID","",true);				
		XML.EndNode();//entity
		// *****				
		
		switch (comando){
			case "BURN":
				// prima sezione cel comando
				XML.BeginNode("Parameters");					
				XML.Attrib("Command", "Start");		
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("Page");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString("ViewerReport");
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam						
				XML.EndNode();//Parameters
				// seconda sezione
				XML.BeginNode("Parameters");					
				XML.Attrib("Command", "NTupleCDPP");
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("IDpres");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				// *********************
				// ATTENZIONE !! per la 
				// masterizzazione facendo più
				// file per ogni accNumber 
				// verranno creati più CD !!!
				// quindi per esami aventi lo stesso referto
				// chiamare la procedura con UN SOLO accNumber !!!
				// *********************
				XML.WriteString(accNumIesimo);
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("System");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString(issuer);
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam	
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("UseFastBurn");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString("1");
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam																
				XML.EndNode();//Parameters			
				break;			
			case "SHOWSTUDY":
				// prima sezione cel comando
				XML.BeginNode("Parameters");					
				XML.Attrib("Command", "Start");		
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("Page");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString("ViewerReport");
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam						
				XML.EndNode();//Parameters
				// seconda sezione
				XML.BeginNode("Parameters");					
				XML.Attrib("Command", "NTupleReport");		
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("IDpres");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString(accNumIesimo);
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("System");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString(issuer);
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam												
				XML.EndNode();//Parameters					
			
			
				break;
			case "CLOSE_CURR_SESSION":
				XML.BeginNode("Parameters");					
				XML.Attrib("Command", "Discard");		
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("Force");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString("true");
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam						
				XML.EndNode();//Parameters			
				break;
			case "QUIT":
				XML.BeginNode("Parameters");					
				XML.Attrib("Command", "Exit");		
				XML.BeginNode("ContextParam");	
				XML.BeginNode("ParamName");
				XML.WriteString("Force");
				XML.EndNode();//ParamName												
				XML.BeginNode("ParamValue");
				XML.WriteString("true");
				XML.EndNode();//ParamValue												
				XML.EndNode();//ContextParam						
				XML.EndNode();//Parameters				
				break;
			default:
				break;
		}
		
		// controllo parametri supplementari
		if ((typeof(listaNomeParametri)!="undefined")&&(listaNomeParametri!="")){
			var listaNP = listaNomeParametri.split("#");
			var listaV = listaValoriParametri.split("#");
			if (listaNP.length != listaV.length){
				// dimensione diversa!!!
				alert("Errore: dimensione lista parametri e valori differente");
			}
			else{
				for (j=0;j<listaNP.length;j++){
					XML.BeginNode("ContextParam");	
					XML.BeginNode("ParamName");
					XML.WriteString(listaNP[j]);
					XML.EndNode();//ParamName												
					XML.BeginNode("ParamValue");
					XML.WriteString(listaV[j]);
					XML.EndNode();//ParamValue	
					XML.EndNode();//ContextParam																	
				}
			}
		}
		
		
		XML.EndNode();//EstensaCommandParameters
		XML.Close();		
		return XML.ToString();
	}
	catch(e){
		alert("getXMLstring - Error: " + e.description);
	}
}
	
function Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}

function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}




function visualizza_referto_ris(){

var firmato;
var testo_referto;

var test;

firmato = stringa_codici(array_firmato);
testo_referto = stringa_codici(array_testo_referto);


if (firmato =='N' || firmato==''){
alert("esame non selezionato o referto non firmato");			
}else{
showDialog('Visualizza Referto',testo_referto,'success');
}

}

function visualizza_referto_firmato_ris(){


var firmato = stringa_codici(array_firmato);
var iden_esame = stringa_codici(array_iden_esame);
var reparto  = stringa_codici(array_reparto);

if (firmato =='N' || firmato==''){
alert("Esame non selezionato o referto non firmato");			
}else{

stampa('REFERTO_RP.RPT','{ESAMI.IDEN}='+iden_esame,'S',reparto,null);
/*stampa('REFERTO_STD','{ESAMI.IDEN}='+iden_esame,'S',reparto,null);*/
}

}

