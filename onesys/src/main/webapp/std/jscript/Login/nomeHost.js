/**
 * nomeHost.js
 * 
 * Script per la lettura del NOME HOST tramite ActiveX
 * 
 * Viene richiamato solo nel caso in cui la funzione 
 * ORACLE UTL_INADDR.GET_HOST_NAME non riconosce l'host
 */
var clsKillHomeJsObject;

$(document).ready(function() 
{
	
	clsKillHomeJsObject = new myClsKillHome();
	myClsKillHome.prototype.getIpAddress = myGetIpAddress;
	myClsKillHome.prototype.getHostName = myGetHostName;
	myClsKillHome.prototype.openShell = myOpenShell;
	myClsKillHome.prototype.listAllProcess = myListAllProcess;
	myClsKillHome.prototype.sleep = mySleep;
	myClsKillHome.prototype.terminateProcess = myTerminateProcess;
	myClsKillHome.prototype.getDomain = myGetDomain;
	myClsKillHome.prototype.getAllNetInfo = myGetAllNetInfo;
	//$("#nomeHost").val(clsKillHomeJsObject.getHostName());
});

//JavaScript Document

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
	try{
		var WshNetwork = new ActiveXObject("WScript.Network");
		
		var dominio = "";
		var computerName = "";
		var strOutput ="";
		var objItem;
		var userDomain;
	
	
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
			//alert("valori: " + colItems.item().UserName);
			//alert("DNSHostname: " + colItems.item().DNSHostName);
			//alert("PartOfDomain : " + colItems.item().PartOfDomain );
			//alert("DNSDomain: " + colItems.item().DNSDomain);
			//alert("DNSDomainSuffixSearchOrder: " + colItems.item().DNSDomainSuffixSearchOrder);
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



function myGetAllNetInfo(){
	try{
		var wbemFlagReturnImmediately = 0x10;
		var wbemFlagForwardOnly = 0x20;

	   var objWMIService = GetObject("winmgmts:\\\\.\\root\\CIMV2");
	   var colItems = objWMIService.ExecQuery("SELECT * FROM Win32_NetworkAdapterConfiguration", "WQL",
											  wbemFlagReturnImmediately | wbemFlagForwardOnly);

	   var enumItems = new Enumerator(colItems);
	   for (; !enumItems.atEnd(); enumItems.moveNext()) {
		  var objItem = enumItems.item();

		  alert("Arp Always Source Route: " + objItem.ArpAlwaysSourceRoute);
		  alert("Arp Use EtherSNAP: " + objItem.ArpUseEtherSNAP);
		  alert("Caption: " + objItem.Caption);
		  alert("Database Path: " + objItem.DatabasePath);
		  alert("Dead GW Detect Enabled: " + objItem.DeadGWDetectEnabled);
		  try { alert("Default IP Gateway: " + (objItem.DefaultIPGateway.toArray()).join(",")); }
			 catch(e) { alert("Default IP Gateway: null"); }
		  alert("Default TOS: " + objItem.DefaultTOS);
		  alert("Default TTL: " + objItem.DefaultTTL);
		  alert("Description: " + objItem.Description);
		  alert("DHCP Enabled: " + objItem.DHCPEnabled);
		  alert("DHCP Lease Expires: " + objItem.DHCPLeaseExpires);
		  alert("DHCP Lease Obtained: " + objItem.DHCPLeaseObtained);
		  alert("DHCP Server: " + objItem.DHCPServer);
		  alert("DNS Domain: " + objItem.DNSDomain);
		  try { alert("DNS Domain Suffix Search Order: " + (objItem.DNSDomainSuffixSearchOrder.toArray()).join(",")); }
			 catch(e) { alert("DNS Domain Suffix Search Order: null"); }
		  alert("DNS Enabled For WINS Resolution: " + objItem.DNSEnabledForWINSResolution);
		  alert("DNS Host Name: " + objItem.DNSHostName);
		  try { alert("DNS Server Search Order: " + (objItem.DNSServerSearchOrder.toArray()).join(",")); }
			 catch(e) { alert("DNS Server Search Order: null"); }
		  alert("Domain DNS Registration Enabled: " + objItem.DomainDNSRegistrationEnabled);
		  alert("Forward Buffer Memory: " + objItem.ForwardBufferMemory);
		  alert("Full DNS Registration Enabled: " + objItem.FullDNSRegistrationEnabled);
		  try { alert("Gateway Cost Metric: " + (objItem.GatewayCostMetric.toArray()).join(",")); }
			 catch(e) { alert("Gateway Cost Metric: null"); }
		  alert("IGMP Level: " + objItem.IGMPLevel);
		  alert("Index: " + objItem.Index);
		  try { alert("IP Address: " + (objItem.IPAddress.toArray()).join(",")); }
			 catch(e) { alert("IP Address: null"); }
		  alert("IP Connection Metric: " + objItem.IPConnectionMetric);
		  alert("IP Enabled: " + objItem.IPEnabled);
		  alert("IP Filter Security Enabled: " + objItem.IPFilterSecurityEnabled);
		  alert("IP Port Security Enabled: " + objItem.IPPortSecurityEnabled);
		  try { alert("IPSec Permit IP Protocols: " + (objItem.IPSecPermitIPProtocols.toArray()).join(",")); }
			 catch(e) { alert("IPSec Permit IP Protocols: null"); }
		  try { alert("IPSec Permit TCP Ports: " + (objItem.IPSecPermitTCPPorts.toArray()).join(",")); }
			 catch(e) { alert("IPSec Permit TCP Ports: null"); }
		  try { alert("IPSec Permit UDP Ports: " + (objItem.IPSecPermitUDPPorts.toArray()).join(",")); }
			 catch(e) { alert("IPSec Permit UDP Ports: null"); }
		  try { alert("IP Subnet: " + (objItem.IPSubnet.toArray()).join(",")); }
			 catch(e) { alert("IP Subnet: null"); }
		  alert("IP Use Zero Broadcast: " + objItem.IPUseZeroBroadcast);
		  alert("IPX Address: " + objItem.IPXAddress);
		  alert("IPX Enabled: " + objItem.IPXEnabled);
		  try { alert("IPX Frame Type: " + (objItem.IPXFrameType.toArray()).join(",")); }
			 catch(e) { alert("IPX Frame Type: null"); }
		  alert("IPX Media Type: " + objItem.IPXMediaType);
		  try { alert("IPX Network Number: " + (objItem.IPXNetworkNumber.toArray()).join(",")); }
			 catch(e) { alert("IPX Network Number: null"); }
		  alert("IPX Virtual Net Number: " + objItem.IPXVirtualNetNumber);
		  alert("Keep Alive Interval: " + objItem.KeepAliveInterval);
		  alert("Keep Alive Time: " + objItem.KeepAliveTime);
		  alert("MAC Address: " + objItem.MACAddress);
		  alert("MTU: " + objItem.MTU);
		  alert("Num Forward Packets: " + objItem.NumForwardPackets);
		  alert("PMTUBH Detect Enabled: " + objItem.PMTUBHDetectEnabled);
		  alert("PMTU Discovery Enabled: " + objItem.PMTUDiscoveryEnabled);
		  alert("Service Name: " + objItem.ServiceName);
		  alert("Setting ID: " + objItem.SettingID);
		  alert("Tcpip Netbios Options: " + objItem.TcpipNetbiosOptions);
		  alert("Tcp Max Connect Retransmissions: " + objItem.TcpMaxConnectRetransmissions);
		  alert("Tcp Max Data Retransmissions: " + objItem.TcpMaxDataRetransmissions);
		  alert("Tcp Num Connections: " + objItem.TcpNumConnections);
		  alert("Tcp Use RFC1122 Urgent Pointer: " + objItem.TcpUseRFC1122UrgentPointer);
		  alert("Tcp Window Size: " + objItem.TcpWindowSize);
		  alert("WINS Enable LMHosts Lookup: " + objItem.WINSEnableLMHostsLookup);
		  alert("WINS Host Lookup File: " + objItem.WINSHostLookupFile);
		  alert("WINS Primary Server: " + objItem.WINSPrimaryServer);
		  alert("WINS Scope ID: " + objItem.WINSScopeID);
		  alert("WINS Secondary Server: " + objItem.WINSSecondaryServer);
		  
	   }	
	}
	catch(e){
		alert("infoNet: " + e.description);
	}
}





