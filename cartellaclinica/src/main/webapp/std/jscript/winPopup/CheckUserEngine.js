function initGlobalObject(){
	try{
		if (bolAutenticato==true){
			opener.continua("OK*" + idenMedFirma + "*" + userLogin + "*" + userDescription + "*" + userReparto + "*" + userTipo + "*" + userTipoMed);
		}
		else{
			opener.continua("KO");
		}
	}
	catch(e){
		;
	}
	self.close();
	
}