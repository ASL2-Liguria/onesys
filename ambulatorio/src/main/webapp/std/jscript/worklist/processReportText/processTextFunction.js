// funzione che appoggiandosi a
// arrayInitialProcessedTextReport
// ritornerà il testo iniziale secondo le 
// situazioni del caso (metodica, sito...)
function getInitialProcessedTextReport(){
	var strOutput = "";
	var i=0;
	
	
	try{
		// controllo se sto refertando la stessa metodica
		// di tipo ECO Ostetrica
		if ((sameModality()) && (array_metodica[0]=="K")){
			// METODICA: ECO OSTETRICA
			for (i=0;i<array_descr_esame.length;i++){
				if(strOutput==""){
					strOutput = array_descr_esame[i];
				}
				else{
					strOutput = strOutput + "\r\n" + array_descr_esame[i];
				}
			}			
			if ((baseUser.USENEWREPORTTOOL=="S")||(baseUser.USETINYMCE=="S")){
				strOutput = "<P>" + strOutput + "</P><p><br />&nbsp;</p>";
			}
			strOutput += "\r\n" + arrayInitialProcessedTextReport[0];			
		}
		else{
			// ALTRI
			for (i=0;i<array_descr_esame.length;i++){
				if(strOutput==""){
					strOutput = array_descr_esame[i];
				}
				else{
					strOutput = strOutput + "\r\n" + array_descr_esame[i];
				}
				if (((baseUser.USENEWREPORTTOOL=="S")||(baseUser.USETINYMCE=="S"))&&(basePC.ABILITA_SYNTHEMA=="N"&& basePC.ABILITA_PHONEIDOS=="N" && basePC.ABILITA_MAGIC_PHONEIDOS=="N")){
					strOutput = "<P>" + strOutput + "</P><p><br />&nbsp;</p>";
				}				
				strOutput += arrayInitialProcessedTextReport[i];
			}
		}
		if (((baseUser.USENEWREPORTTOOL=="S")||(baseUser.USETINYMCE=="S"))&&(basePC.ABILITA_SYNTHEMA=="N"&& basePC.ABILITA_PHONEIDOS=="N" && basePC.ABILITA_MAGIC_PHONEIDOS=="N")){
			// fare replaceall di \r\n con <BR>
			strOutput.toString().replaceAll("\r\n","<br />");
		}
//		alert("#" + strOutput +"#");
	}
	catch(e){
		alert("getInitialProcessedTextReport - Error: "+ e.description);
	}
	
	return strOutput;
}