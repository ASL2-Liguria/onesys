// JavaScript Document
var console_schedaDaCaricare = "";
function initSchedaInConsole(value){
	// setto variabile per nome scheda
	console_schedaDaCaricare = value;
}


// ATTENZIONE valutare se unificare la gestione dell' apertura
// delle finestre
function apriSchedaInConsole(){
	
	var url = "";
	var timer ;
	
	try{
		// controllare se esistono più esami 
		switch (console_schedaDaCaricare){
			case "VIEW_ECO_OST_X_CONSOLE":
				url= "esameinfoeco?";
				url += "idenEsa=" + array_iden_esame[0];
				url += "&idenAnag=" + globalIdenAnag;
				url += "&refreshOnExit=N";				
				if (classReferto.FIRMATO !="S"){
					url += "&readonly=N";
				}
				else{
					url += "&readonly=S";
				}
				var finestra = window.open(url,"wndInfoEcoOst","status=yes,top=0,left=0,width="+ screen.availWidth +", height=" + screen.availHeight+",scrollbars=yes");
				if (finestra){
					finestra.focus();
				}
				else{
					finestra = window.open(url ,"wndInfoEcoOst","status=yes,top=0,left=0,width="+ screen.availWidth +", height=" + screen.availHeight+",scrollbars=yes");
				}	
				timer = window.setTimeout("try{finestra.focus();}catch(e){;})",500);							
				break;
			default:
				url = console_schedaDaCaricare + ".html?iden_esame="+ array_iden_esame[0] + "&iden_anag=" + globalIdenAnag + "&scheda=" + console_schedaDaCaricare + "&iden_scheda=" + iden_scheda_in_console + "&iden_ref=" + classReferto.IDEN + "&ute_mod=" + baseUser.IDEN_PER;
				var finestra = window.open(url,"","top=0, left=0, width=900px, height=650px, status=yes, scrollbars=yes");
				if (finestra){
					finestra.focus();
				}
				else{
					finestra = window.open(url,"","top=0, left=0, width=900px, height=650px, status=yes, scrollbars=yes");			
				}
				timer = window.setTimeout("try{finestra.focus();}catch(e){;})",500);			
				break;
		}

	}
	catch(e){
		alert("apriSchedaInConsole - Error: "  + e.description);
	}
}
