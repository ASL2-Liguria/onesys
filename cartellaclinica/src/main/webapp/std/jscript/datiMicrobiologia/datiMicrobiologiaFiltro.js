var _V_FILTRO = {
		'daData' : '',
		'aData' : '',
		'idenAnag':''
	};
var _V_DATI= null;

jQuery(document).ready(function(){
	
	window.WindowCartella = window;   
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    } 
	NS_DATI_MICRO.init();
	 
});

var NS_DATI_MICRO = {
		
	init:function(){
		NS_DATI_MICRO.setEvents();
		_V_DATI= WindowCartella.getForm();
		_V_FILTRO.idenAnag= WindowCartella.getPaziente('IDEN');
	
		
		if(WindowCartella.FiltroCartella.getLivelloValue()=='NUM_NOSOLOGICO'){
			if (WindowCartella.getRicovero("DEA_DATA_INGRESSO")!=''){
				if (_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
					vDataInizio=WindowCartella.getRicovero("DEA_DATA_INGRESSO");						
				}else{
					vDataInizio=WindowCartella.getPrericovero("DATA_INIZIO");
				}
			}
			else{
				vDataInizio=(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "") ? WindowCartella.getRicovero("DATA_INIZIO") :WindowCartella.getPrericovero("DATA_INIZIO");
			}
//			vDataInizio=(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "") ? parent.getRicovero("DATA_INIZIO") :parent.getPrericovero("DATA_INIZIO");
			$('#inpFiltroDaData').val(vDataInizio.substring(6,8)+'/'+vDataInizio.substring(4,6)+'/'+vDataInizio.substring(0,4));	
		}
		else{
			$('#inpFiltroDaData').val(clsDate.getData(clsDate.dateAdd(new Date(),"D",-60),'DD/MM/YYYY'));	
		}
		$('#inpFiltroAData').val(clsDate.getData(new Date(),'DD/MM/YYYY'));
		NS_UTILITY.impostaFiltroDate();
		
		
		
		NS_DATI_MICRO.loadIframe();

	},
	
	aggiornaDatiMicro : function(){
	
		if(!NS_UTILITY.checkPeriodoDate()){
			try{top.utilMostraBoxAttesa(false);}catch(e){}
			return alert('Inserire un range di date inferiore all\' anno');
		}
		
		if(!NS_UTILITY.impostaFiltroDate()){
			try{top.utilMostraBoxAttesa(false);}catch(e){}
			return;
		}
		
		try{WindowCartella.utilMostraBoxAttesa(true)}catch(e){};
		
		NS_DATI_MICRO.loadIframe();

	},
		
	loadIframe:function(){
		
		var height 	= $(window.parent).height() - 140;
		$('#iframeGriglia').css({'height' : height});
		
		url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiMicrobiologia.datiMicrobiologia';
		url	+= '&daData=' + _V_FILTRO.daData + '&aData=' + _V_FILTRO.aData;
		url += '&idPatient=' + _V_DATI.idRemoto;
        url += '&reparto=' + _V_DATI.reparto;
        url += '&emergenza_medica=' + WindowCartella.getPaziente('EMERGENZA_MEDICA');
		
		switch (WindowCartella.FiltroCartella.getLivelloValue())
		{
			case 'IDEN_ANAG':
				url += '&modalita=PAZIENTE';
				break;
			case 'ANAG_REPARTO':
				url += '&modalita=PAZIENTE_REPARTO';
				break;
			
			case 'NUM_NOSOLOGICO':	
				url += '&modalita=RICOVERO';
				if  (_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
					if (WindowCartella.getRicovero("DEA_STR")==null || WindowCartella.getRicovero("DEA_STR")==""){
						_V_DATI.nosologico = _V_DATI.ricovero;
					}else{
						_V_DATI.nosologico = _V_DATI.ricovero + ','+  WindowCartella.getRicovero("DEA_STR")+"-"+WindowCartella.getRicovero("DEA_ANNO")+"-"+WindowCartella.getRicovero("DEA_CARTELLA");
					}
				}else{
					_V_DATI.nosologico= _V_DATI.ricovero + ','+  _V_DATI.prericovero;
				}
				
				url +='&nosologico=' + _V_DATI.nosologico;	
//				url += (_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "") ? '&nosologico=' + _V_DATI.ricovero : '&nosologico=' + _V_DATI.ricovero + ',' + _V_DATI.prericovero;						
				break;
		}

		eval('var privacy = ' + WindowCartella.baseReparti.getValue(_V_DATI.reparto,'ATTIVA_PRIVACY'));
		url +="&ATTIVA_PRIVACY="+privacy.DATI_MICROBIOLOGIA.ATTIVA;
		url +="&TIPOLOGIA_ACCESSO="+WindowCartella.document.EXTERN.ModalitaAccesso.value;
		url +="&EVENTO_CORRENTE="+WindowCartella.getRicovero("NUM_NOSOLOGICO");		
		
		$("#iframeGriglia").attr("src", url);
	},
	
	setEvents : function(){
		
		$('#refreshDatiMicro').attr({"title":"Aggiorna"}).click(NS_DATI_MICRO.aggiornaDatiMicro);

		
		NS_UTILITY.controlloData('inpFiltroDaData');
		NS_UTILITY.controlloData('inpFiltroAData');
		NS_UTILITY.setDatepicker('inpFiltroDaData');
		NS_UTILITY.setDatepicker('inpFiltroAData');
		
		$('#inpFiltroDaData,#inpFiltroAData').attr('disabled','disabled');
		
	}

}

NS_UTILITY = {
		

		setDatepicker:function(idElemento){

			$('#' + idElemento).datepick({
				onClose : function(){
					NS_UTILITY.impostaFiltroDate();
				},
				showOnFocus: false,
				minDate: function(){	
					if(WindowCartella.FiltroCartella.getLivelloValue()=='NUM_NOSOLOGICO'){
						if(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
							return parent.clsDate.setData(parent.getRicovero("DATA_INIZIO"),"00:00");	
						}
							return parent.clsDate.setData(parent.getPrericovero("DATA_INIZIO"),"00:00");					
					}
					else{
						var d = new Date();			
	                    d.setYear('2011');
	                    d.setMonth('00');
	                    d.setDate('01');					
						return d;
					}
				},
				showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
			});		
		},
		controlloData:function(id){
			
			try {
				var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
				oDateMask.attach(document.getElementById(id));
			}catch(e){
				alert('Applicazione maschera data in errore: '+e.description);
			}
		},
	
		impostaFiltroDate : function(){

			var inpDaData	= $('#inpFiltroDaData').val();
			var inpAData	= $('#inpFiltroAData').val();
			
			if (inpAData.length > 10){
				alert('Attenzione. Controllare Il Valore Immesso nel Campo A DATA');
				var inpAData	= $('#inpFiltroAData').val('');
				return false;
			}
			
			if (inpDaData.length > 10){
				alert('Attenzione. Controllare Il Valore Immesso nel Campo DA DATA');
				$('#inpFiltroDaData').val('');
				return false;
			}
			
			if(inpDaData.length > 0){
	                        inpDaData	= inpDaData.substr(6,4) + inpDaData.substr(3,2) + inpDaData.substr(0,2);                
	                }
	                if(inpAData.length > 0)
				inpAData	= inpAData.substr(6,4) + inpAData.substr(3,2) + inpAData.substr(0,2);
			else{
				var date 	= new Date(); 
				var day		= '0' + date.getDate(); day	= day.substring((day.length-2),day.length);
				var month	= '0' + (date.getMonth()+1); month = month.substring((month.length-2),month.length);			
				var year	= date.getFullYear();
				inpAData	= year + month + day;
	                        var inpAData	= $('#inpFiltroAData').val( day +'/'+  month +'/'+ year);
				
			}
			
			_V_FILTRO.daData	=  inpDaData;
			_V_FILTRO.aData		=  inpAData;
			return true;
			
		},
		
		
		checkPeriodoDate : function(){
			
			var a 	= parseInt($('#inpFiltroDaData').val().substr(6,4) + $('#inpFiltroDaData').val().substr(3,2) +$('#inpFiltroDaData').val().substr(0,2));
			var b 	= parseInt($('#inpFiltroAData').val().substr(6,4) + $('#inpFiltroAData').val().substr(3,2) +$('#inpFiltroAData').val().substr(0,2));
			
			if(a > b){
                       return false;
                        }else{
                            var daTmpData  = new Date();
                            daTmpData.setYear( $('#inpFiltroDaData').val().substr(6,4));
                            daTmpData.setMonth($('#inpFiltroDaData').val().substr(3,2)-1);
                            daTmpData.setDate( $('#inpFiltroDaData').val().substr(0,2));
                            var aTmpData   = new Date();
                            aTmpData.setYear($('#inpFiltroAData').val().substr(6,4));
                            aTmpData.setMonth($('#inpFiltroAData').val().substr(3,2)-1);
                            aTmpData.setDate($('#inpFiltroAData').val().substr(0,2));
                        
                            var diff = (parseInt(aTmpData.getTime()-daTmpData.getTime())/(24*3600*1000));
                            if ((diff)>=365){
                                return false;
                            }
                        }     
			return true;
		},
				
		getUrlParameter : function(name){

			var tmpURL = document.location.href;
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec( tmpURL );
			
			if( results == null )
				return "";
			else
				return results[1];
		}
	}
