var baseConfigurazioni = {	

	baseReparti : {
		
		getValue:function(cod_cdc,key){
			
			if(typeof baseConfigurazioni.baseReparti.reparti[cod_cdc] == 'undefined'){
				baseConfigurazioni.baseReparti.reparti[cod_cdc] = {};
			}
			
			if(typeof baseConfigurazioni.baseReparti.reparti[cod_cdc][key] == 'undefined'){
				dwrUtility.executeStatement('configurazioni.xml','getValueCdc',[cod_cdc,key],1,function(resp){
					if(resp[0]=='OK'){
						baseReparti[reparto][key]=resp[2];
					}else{
						alert(resp[1]);
					}
				});				
			}
			
			return baseConfigurazioni.baseReparti.reparti[cod_cdc][key];
			
		},
		
		reparti:{
		}
		
	},
	
	baseSito : {		
		
		getValue:function(sito,key){
		},
		
		siti:{
		}
	}

};

var baseReparti = baseConfigurazioni.baseReparti;
var baseSito = baseConfigurazioni.baseSito;