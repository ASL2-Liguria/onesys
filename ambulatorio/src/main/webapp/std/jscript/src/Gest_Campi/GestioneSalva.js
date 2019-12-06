// JavaScript Document
function RegistraDBCampo (Imposta)  {
		
	document.formAggCampo.HCampo.value=document.formAggCampo.FieCampo.value;
	document.formAggCampo.HCampocheck.value=document.formAggCampo.FieCampoCheck.value;
	document.formAggCampo.HDescrizione.value=document.formAggCampo.FieDescrizione.value;
	document.formAggCampo.HValore.value=document.formAggCampo.FieValore.value;
	//alert(Imposta);
	document.formAggCampo.HImposta.value=Imposta;
	//alert(document.formAggCampo.HImposta.value);
	document.formAggCampo.submit();
	opener.document.location.replace("Serv_GestCampi_Campi");
	self.close();
}

function RegistraDBScheda (Imposta)  {
	if (document.formAggCampo.FieCampo.value='')
	{	alert("Nome campo Obbligatorio")
		return;}
	if (document.formAggCampo.FieDescrizione.value='')
	{	alert("Descizione Obbligatoria");
		return;}
	document.formAggCampo.HScheda.value=document.formAggCampo.FieCampo.value;
	document.formAggCampo.HImposta.value=Imposta;
	document.formAggCampo.submit();
	opener.document.location.replace("Serv_GestCampi_Ope");
	self.close();
}

function CancellaDBScheda(Imposta,DaCanc){
	//alert(DaCanc);	
	document.formAggCampo.HScheda.value=DaCanc;
	document.formAggCampo.HImposta.value=Imposta;
	document.formAggCampo.submit();
	opener.document.location.replace("Serv_GestCampi_Ope");
	//self.close();
}

function CancellaDBCampo(Imposta,DaCanc){
	//alert(DaCanc);	
	document.formAggCampo.HScheda.value=DaCanc;
	document.formAggCampo.HImposta.value=Imposta;
	document.formAggCampo.submit();
	opener.document.location.replace("Serv_GestCampi_Campi");
	//self.close();
}

