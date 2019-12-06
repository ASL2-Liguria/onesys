// JavaScript Document
function checkEquipeEsegui(){
	var HIdenEsame;
	HIdenEsame = stringa_codici(array_iden_esame);	
	dwr.engine.setAsync(false);
	dwrCheckEquipeEsegui.Esegui(HIdenEsame,ritorno);
	dwr.engine.setAsync(true);
	
}

function ritorno(variabile){
if(variabile == 'OK'){
	esegui();
}else{
	alert("Compilare tutti i dati riferiti all'equipe prima di eseguire");
	
}
}

function stampa_ref_validati_worklist()
{

	var nome_procedura;
	var ip;
	var host;
	
	nome_procedura = 'SP_EVENTOSTAMPATUTTIREFERTI';
	//ip =  basePC.IP;
	ip = myGetIpAddress();
	//host = basePC.NOME_HOST;
	host = myGetHostName();
	//dwr.engine.setAsync(false);
	functionDwr.launch_sp (nome_procedura +'@IString#IString@'+ip+'#'+host,Risposta);
	//dwr.engine.setAsync(true);
	alert('Richiesta di Stampa eseguita')
	
}

function Risposta(value){

}
function myGetIpAddress(){

var k = 0;
var strOutput = '';

     try{
               var wmi=GetObject("winmgmts:!\\\\.\\root\\cimv2")
               var nac=wmi.ExecQuery("Select * from Win32_NetworkAdapterConfiguration Where IPEnabled =True")
                               
                for(nac=new Enumerator(nac);!nac.atEnd();nac.moveNext()){
                         if (k==0){
                                strOutput = nac.item().ipAddress(0);
                                   }
                                  k++;
                       }
                }
                catch(e){
                    alert("myGetIpAddress - Error: " + e.description);
                }
                return strOutput;
}

function myGetHostName(){
                
                var WshNetwork = new ActiveXObject("WScript.Network");
                
                var dominio = "";
                var computerName = "";
                var strOutput ="";
                var objItem;
                var userDomain
                
                computerName = WshNetwork.ComputerName;
                userDomain = WshNetwork.UserDomain;
				//alert(computerName)
				return computerName ;
				//alert(userDomain);

}
