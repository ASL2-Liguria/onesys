// JavaScript Document

function myClsKillHome() {
	// posso creare qualche proprietà
}
function myGetIpAddress(){


	var k = 0;
	var strOutput = "";
	
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

// NB viene ritornato il valore in upperCase !!!!
function myGetHostName(){
	
	var WshNetwork = new ActiveXObject("WScript.Network");
	
	var dominio = "";
	var computerName = "";
	var strOutput ="";
	var objItem;
	var userDomain
	
	try{
		computerName = WshNetwork.ComputerName;
		userDomain = WshNetwork.UserDomain;

		var wmi=GetObject("winmgmts:!\\\\.\\root\\cimv2")
		var colItems = wmi.ExecQuery( "Select * from Win32_ComputerSystem" )
		var dominio = "";
		
		for(colItems=new Enumerator(colItems);!colItems.atEnd();colItems.moveNext()){
			dominio = colItems.item().Domain;
		}
		
		if (dominio!=""){
			if (computerName == userDomain){
			 // sono sotto workgroup
			 strOutput = computerName;
			}
			else{
	 			strOutput = computerName  + "." + dominio;
			}
		}
		else{
			strOutput = computerName;
		}
	}
	catch(e){
		alert("myGetHostName - Error: " + e.description);
	}
	return strOutput.toString().toUpperCase();
}


// restituisce il dominio
function myGetDomain(){
	var WshNetwork = new ActiveXObject("WScript.Network");
	
	var dominio = "";
	var computerName = "";
	var strOutput ="";
	var objItem;
	var userDomain
	
	try{
		computerName = WshNetwork.ComputerName;
		userDomain = WshNetwork.UserDomain;

		var wmi=GetObject("winmgmts:!\\\\.\\root\\cimv2")
		var colItems = wmi.ExecQuery( "Select * from Win32_ComputerSystem" )
		var dominio = "";
		
		for(colItems=new Enumerator(colItems);!colItems.atEnd();colItems.moveNext()){
			dominio = colItems.item().Domain;
		}
		strOutput = dominio;
	}
	catch(e){
		alert("myGetDomain - Error: " + e.description);
	}
	return strOutput.toString().toUpperCase();
}

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
function myOpenShell (valore, windowStyle){
	var ReturnCode ;
	try{
		var shell = new ActiveXObject("wscript.shell") 
		if (windowMode==""){windowMode=1;}
		var ReturnCode = shell.Run(valore, windowMode, true)
	}
	catch(e){
		alert("myOpenShell - Error: " + e.description);
	}
	
}


function myTerminateProcess(value){

	try{
		var wmi=GetObject("winmgmts:!\\\\.\\root\\cimv2")
		var colItems = wmi.ExecQuery( "Select * from Win32_Process Where Name = '" + value + "'" )
	
		for(colItems=new Enumerator(colItems);!colItems.atEnd();colItems.moveNext()){
			colItems.item().Terminate()
		}
	}
	catch(e){
		alert("myTerminateProcess - error: " + e.description);
	}
}


function myListAllProcess(){
	
	var msg = ""
	try{
		var e = new Enumerator( GetObject( "winmgmts:" ).InstancesOf( "Win32_process" ) );
		// Variable to hold the info we find 
		msg = "Processes\n";
		// Loop through processes 
		for (;!e.atEnd();e.moveNext()){    
			// Get object from enumerator
			var p = e.item ();     
			// Format message with process name and handle     
			msg += p.Name + " [" + p.Handle + "]\n";
		}
	}
	catch(e){
		alert("myListAllProcess - Error: " + e.description);
	}
	return msg ;
}

function mySleep(delay)
{
	try{
	    var start = new Date().getTime();
	    while (new Date().getTime() < start + delay);
	}
	catch(e){
		alert("mySleep: " + e.description)
	}
}



var clsKillHome = new myClsKillHome();
myClsKillHome.prototype.getIpAddress = myGetIpAddress;
myClsKillHome.prototype.getHostName = myGetHostName;
myClsKillHome.prototype.openShell = myOpenShell;
myClsKillHome.prototype.listAllProcess = myListAllProcess;
myClsKillHome.prototype.sleep = mySleep;
myClsKillHome.prototype.terminateProcess = myTerminateProcess;
myClsKillHome.prototype.getDomain = myGetDomain;
myGetDomain
