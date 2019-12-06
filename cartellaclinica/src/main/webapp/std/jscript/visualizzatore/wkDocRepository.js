
$(document).ready(function()
		{

	WK_DOC_REPOSITORY.init();

		});

var WK_DOC_REPOSITORY = {

		init:function()
		{	
			if (typeof (parent.EXTERN.PROV) !='undefined' && parent.EXTERN.PROV.value =='MMG'){
				$('body').addClass('bodyMMG');
			}

			parent.removeVeloNero('frameWkDoc');
			parent.$("#frameWkDoc").height(parent.document.body.offsetHeight - parent.$("#frameWkDoc").position().top-50);
			
			
			if(parent.confBase.APERTURA_PACS=='N'){
				$('.imagePacs',$('table#oTable tr>td:nth-child(1)>div')).hide();
			}
			
			//se viene aperto il visualizzatore passando l'id richiesta e c'è solo un documento apro direttamente il doc	
			if (((typeof (parent.EXTERN.identificativoEsterno) !='undefined' && parent.EXTERN.identificativoEsterno.value!='') || (typeof (parent.EXTERN.idDocumento) !='undefined' && parent.EXTERN.idDocumento.value!='')) && document.getElementById('oTable').rows.length==1){
				nuovo_indice_sel(0);
				parent.$('#lblChiudi').parent().parent().hide();
				WK_DOC_REPOSITORY.apriDoc();
			}
		},

		apriDoc: function()
		{
			var mimetype;
			var uri;
			var uriss;
			var idDoc;
			var repartoIn='';
			
			if (rigaSelezionataDalContextMenu==-1){
			    mimetype = stringa_codici(ar_mimetype);
			    uri = stringa_codici(ar_uri);
			    uriss = stringa_codici(ar_uriss);
			    idDoc=stringa_codici(ar_id);
			}
			else{
			    mimetype =ar_mimetype[rigaSelezionataDalContextMenu];
			    uri =ar_uri[rigaSelezionataDalContextMenu];
			    uriss =ar_uriss[rigaSelezionataDalContextMenu];
			    idDoc=ar_id[rigaSelezionataDalContextMenu];	
			}
			
			if(mimetype == ''){ return alert('Attenzione: effettuare una selezione');}

			parent.$('#frameWkDoc').hide();
			parent.$('#frameFiltri').hide();

			if( typeof (top.CartellaPaziente)!='undefined'){
				top.CartellaPaziente.Menu.hide();
			}
			
			parent.$("#frameDoc").height(parent.document.body.offsetHeight - parent.$("#frameDoc").position().top+25);
			parent.$("#groupFooter").parent().hide();
			if( typeof (top.CartellaPaziente)!='undefined'){	
			    top.setDimensioniFrameWork();
			}
			
			var stampantePC = parent.basePC.PRINTERNAME_REF_CLIENT;
			parent.$('#frameDoc').show().attr('src','openDocument?mimeType='+mimetype+'&uri='+uri+'&uriSS='+uriss+'&stampante='+stampantePC);
		
			
			parent.$('#lblChiudiDoc').parent().parent().show();

			if(typeof(parent.EXTERN.reparto )!='undefined'){
				repartoIn=parent.EXTERN.reparto.value;
			}

			parent.idDocOpen=stringa_codici(ar_id);

			if (parent.confBase.TRACE=='S'){
				parent.dwr.engine.setAsync(false);
				parent.dwrTraceUserAction.callTraceUserAction(repartoIn,'APRI',idDoc,'VISUALIZZATORE');
				parent.dwr.engine.setAsync(true);
			}
		},
		

		 getDatiPacs: function(){
			var sqlBinds = new Array(); 
			
			if (rigaSelezionataDalContextMenu==-1){
			    vIdEsameDicom = stringa_codici(ar_idEsameDicom);
			}
			else{
				vIdEsameDicom=ar_idEsameDicom[rigaSelezionataDalContextMenu];
			}
			
			if(vIdEsameDicom == ''){ return alert('Attenzione: nessuna immagine associata a questo documento');}
			
			var splitIdEsameDicom=vIdEsameDicom.split(',');
			
			sqlBinds.push(splitIdEsameDicom[0]);
			parent.dwr.engine.setAsync(false);
			parent.dwrUtility.executeQuery("visualizzatore.xml","getDatiPacs",sqlBinds,getUrlPacs);
			parent.dwr.engine.setAsync(true);
				


			function getUrlPacs(resp){
				if(resp[0][0]=='KO'){
					isValid = false;
					error = resp[0][1];
					ArColumns =  ArData =  new Array();
				}else{
					
					var urlCareStreamVEToCall = "";
					var regEx = /\*/g;
					var strAccessionNumber="";	
					var patId = "";
					var globalNodeName="";
					urlCareStreamVEToCall = basePC.URL_VE;
					strAccessionNumber = vIdEsameDicom.replace(',','\\').replace(regEx,"\\");
					patId = resp[2][0];	
					globalNodeName=resp[2][2];
					
					if (baseGlobal.SITO == 'RAVENNA'){
						var urlPhilipsPacs = basePC.URL_VE+'&acc='+ splitIdEsameDicom[0] +'&mrn='+ patId;
						var wndIsite=window.open(urlPhilipsPacs);
						if (wndIsite)
						{
							wndIsite.focus();
						}
						else
						{
							wndIsite=window.open(urlPhilipsPacs);
						}
						
					}
					else{
					
						urlCareStreamVEToCall = urlCareStreamVEToCall + "&user_name=elco&password=elco";
			
						urlCareStreamVEToCall = urlCareStreamVEToCall + "&patient_id="+ patId;					
						urlCareStreamVEToCall = urlCareStreamVEToCall + "&accession_number="+ strAccessionNumber;
						urlCareStreamVEToCall = urlCareStreamVEToCall + "&server_name="+ globalNodeName;
			
						var hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
						if (hndMP){
							hndMP.focus();
						}
						else{
							hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
						}
			
					}
			
				}
			}
		}

};

function setRiga(obj){
  
	if(typeof obj =='undefined') obj = event.srcElement;

	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
	return rigaSelezionataDalContextMenu;
}

aggiungi_ordinamento= function(campo, tipo){
	parent.frameFiltri._WK_ORDINAMENTO=campo + ' ' + tipo;
	parent.frameFiltri.VISDOC_FILTRI.ricercaDoc();
};
