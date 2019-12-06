$(document).ready(function(){
	window.baseUser = opener.top.baseUser;
	
	beforeSISS.init();
	FirmaSiss.init();
});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++)if ((new Date().getTime() - start) > milliseconds)break;
}


var beforeSISS = {
	salvaFirma:'KO',
	closeFirma:false,
	tabellaDiRiferimento:'CC_LETTERA_VERSIONI',
	pdfPosition:'',
	reparto:'',
	report:'',
	sfReport:'',
	
	init:function(){
		beforeSISS.PreparaFirmaConsulenza();
	},
	
	PreparaFirmaConsulenza:function(){
		/* 	
		 * Chiama la procedura che inserisce all'interno di cc_firma_pdf un record su cui fare l'update
		 * call radsql.oe_consulenza.insertbeforeprocfirmasiss
		*/
			var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;

			var valoriParametri = new Array();	
			var tipiParametri = new Array();	
			
			/*da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']*/	

			tipiParametri.push('VARCHAR');
			valoriParametri.push($('#typeProcedure').val());	

			tipiParametri.push('VARCHAR');
			valoriParametri.push(beforeSISS.tabellaDiRiferimento);	
			/* Iden Del Referto*/
			tipiParametri.push('NUMBER');
			valoriParametri.push($('#idenReferto').val());		

			tipiParametri.push('NUMBER');
			valoriParametri.push( typeof $('#idenRefOld')=='undefined' ? 0:$('#idenRefOld').val());		

			tipiParametri.push('NUMBER');
			valoriParametri.push($('#whereReport').val());	
			
			tipiParametri.push('NUMBER');
			valoriParametri.push(baseUser.IDEN_PER);
			
			/*fine parametri per la SP*/
			dwr.engine.setAsync(false);
			dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,beforeSISS.afterdwrPreparazione);
			dwr.engine.setAsync(true);
		},
		
	afterdwrPreparazione:function(variReturn){
		if(variReturn==null || variReturn=='')
		{
			beforeSISS.pdfPosition=document.formConfigurazioneFirma.webScheme.value+'://';
			beforeSISS.pdfPosition+=document.formConfigurazioneFirma.webServerName.value+':';
			beforeSISS.pdfPosition+=document.formConfigurazioneFirma.webServerPort.value;
			beforeSISS.pdfPosition+=document.formConfigurazioneFirma.webContextPath.value;
			
			beforeSISS.reparto  = document.formConfigurazioneFirma.REPARTO.value;
			beforeSISS.report   = document.formConfigurazioneFirma.REPORT.value;
			beforeSISS.sfReport = document.formConfigurazioneFirma.WHERE_REPORT.value;

			beforeSISS.pdfPosition+='/ServletStampe?';
			beforeSISS.pdfPosition+='report=' + beforeSISS.reparto + '/' + beforeSISS.report;
			beforeSISS.pdfPosition+=beforeSISS.componiPdfUrlConsulenza();
			sleep(500);
			FirmaSiss.creaOcx();
		}
		else
		{
			alert(variReturn);
		}
	},
	
	componiPdfUrlConsulenza:function ()
	{
		return "&prompt<pIdenTR>="+ $('#idenTes').val()+"&prompt<pIdenVersione>="+$('#idenReferto').val();
	},
	

	closeAnteprima:function()
	{
		beforeSISS.closeFirma=true;
		if (beforeSISS.salvaFirma=='KO')
		{
			dwr.engine.setAsync(false);
			dwrPreparaFirma.resetFirma('{call RADSQL.OE_CONSULENZA.resetRefetazioneConsulenza(?)}',$('#idenTes').val(),beforeSISS.afterReset);	
			dwr.engine.setAsync(true);
		}
		//OnFileClose();
		opener.chiudi();
		self.close();
	},

	afterReset:function(ret){
		//alert(ret);
		}
	
};

$(window).unload(function() {
	if (beforeSISS.closeFirma==false)
		beforeSISS.closeAnteprima();
});