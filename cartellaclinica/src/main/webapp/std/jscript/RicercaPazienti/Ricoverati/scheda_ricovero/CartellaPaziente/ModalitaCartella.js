var ModalitaCartella = {

	logger:null,

	check:function(section_code,form,output_default){
		try{

			//controllo se è document o formdati, se è document(chiamata dal frame) cerco il form corretto
			form = typeof form == 'undefined' ? getForm() : form;
			form = typeof form.nodeName == 'undefined' ? form : getForm(form);			
			
			/*if(typeof CartellaPaziente.getModalita()[section_code] == 'undefined') throw "";
			alert(
				section_code + '\n' + 
				CartellaPaziente.getFunzione() + '\n' + 
				CartellaPaziente.getModalita() + '\n' + 
				typeof CartellaPaziente.getModalita()[section_code] + '\n' + 
				CartellaPaziente.getModalita()[section_code].Default + '\n' + 
				CartellaPaziente.getModalita()[section_code][form.funzioneAttiva] + '\n' + 
				typeof CartellaPaziente.getModalita()[section_code][form.funzioneAttiva]
			);*/

			var Sezione = CartellaPaziente.getModalita()[section_code];					
			
			var Value   = (
							typeof Sezione[form.funzioneAttiva]!='undefined'?
							Sezione[form.funzioneAttiva]:
							Sezione.Default
			);
			
			ModalitaCartella.logger.debug(section_code + '; ' + form.funzioneAttiva + ';' + Value);
			
			ModalitaCartella.logger.debug(section_code + '; ' + form.funzioneAttiva + '; TIPO UTENTE: ' + typeof Value[baseUser.TIPO]);
			if(typeof Value[baseUser.TIPO] != 'undefined' ){				
				Value = Value[baseUser.TIPO];
			}else{
				ModalitaCartella.logger.debug(section_code + '; ' + form.funzioneAttiva + '; Defualt: ' + typeof Value.Default);
				if(typeof Value.Default != 'undefined'){
					Value = Value.Default;
				}else{
					Value = Value;
				}
			}		
			
			ModalitaCartella.logger.info(section_code + '; ' + form.funzioneAttiva + ';' + Value);
	
			switch (typeof Value){
				case 'function' : return Value();
				default 		: return Value;

			}
			

		}catch(e){
			alert(e.description);
			ModalitaCartella.logger.warning(e.description);
			return output_default;			
		}
	},

	getClassName:function(pForm){
		return CartellaPaziente.getModalita()['CLASSNAME'];
	},

	isReadonly:function(pForm){
		return !ModalitaCartella.check('MODIFICA',pForm,true);
	},

	isStampabile:function(pForm){
		return ModalitaCartella.check('STAMPA',pForm,{'Abilitata':false,'Statement':null})['Abilitata'];		
	},
	
	getStampaStatement:function(pForm){
		return ModalitaCartella.check('STAMPA',pForm,{'Abilitata':false,'Statement':null})['Statement'];
	},

	isDisponibile:function(pForm){
		return ModalitaCartella.check('APERTURA',pForm,false);
	},

	getAfterSave:function(pForm){
		return ModalitaCartella.check('AFTER_SAVE',pForm,'');
	},

	getFilter:function(pForm){
		return ModalitaCartella.check('FILTER',pForm,'');
	},

	getFilters:function(pForm){
		return ModalitaCartella.check('FILTERS',pForm,{});
	},

	getFilterData:function(pForm){
		return ModalitaCartella.check('FILTER_DATA',pForm,{'DA_DATA':{enable:false},'A_DATA':{enable:false}});
	},
	
	getFilterNrRecords:function(pForm){
		return ModalitaCartella.check('NUMERO_RECORDS',pForm,{'enable':false,value:''});
	},
	
	getMenus:function(pForm){
		return ModalitaCartella.check('MENU',pForm,{});
	},

	getVisibleLabels:function(pForm){
		return ModalitaCartella.check('LABELS',pForm,{});
	},

	getTipoInserimento:function(pForm){
		return ModalitaCartella.check('INSERIMENTO',pForm,{});
	},
		
	basic:{
			CLASSNAME:'Blue',
			MODIFICA:{
				'Default':{
					'Default':true,
					'OSS':false
				},
				ANAMNESI:{
					'Default':false,
					'M':true
				},
				ESAME_OBIETTIVO:{
					'Default':false,
					'M':true					
				},
				PIANO_TERAPEUTICO:{
					'Default':true,
					'OSS':false
				},
				DATI_GENERALI:{
					'Default':true			
				},
                SCALA_FACE:{
                    'Default':false,
                    'M':true
                },
                SCALA_SOAS:{
                    'Default':false,
                    'I':true
                },
                TRIAGE:{
                    'Default':false,
                    'OST':true,
                    'M':true
                },
                SETTIMANA36:{
                    'Default':false,
                    'OST':true
                },
                MONITORAGGIO:{
                    'Default':false,
                    'OST':true,
                    'M':true
                },
                PARTOGRAMMA_PARTO:{
                    'Default':false,
                    'OST':true,
                    'M':true
                },
                ESAME_OBIETTIVO_SPECIALISTICO:{
                        'Default':false,
                        'M':true					
                },
                QUESTIONARIO_ANAMNESTICO:{
                        'Default':false,
                        'M':true					
                }, 
                VALUTAZIONE_DIMISSIBILITA:{
                        'Default':false,
                        'M':true					
                },
                ESAME_OBIETTIVO_DS:{
                        'Default':false,
                        'M':true	
                },
                SEGNALAZIONE_DECESSO:{
                    'Default':false,
                    'M':true	
                }
			},
			APERTURA:{
				'Default'			:true,
				RIEPILOGO_RICOVERO	:false,
				PROGETTO_METAL:false
			},
			STAMPA:{
				'Default':{
					'Default':{'Abilitata':true,'Statement':null},
					'O':{'Abilitata':false,'Statement':null}
				},
				TERAPIE_GLOBALI:{
					'Default':{'Abilitata':true,'Statement':'TerapieGlobaliReparto.Stampa'},
					'O':{'Abilitata':false,'Statement':null}
				},
				DATI_GENERALI:{
					'Default':{'Abilitata':true,'Statement':null}							
				},
				
				/* Schede con stampa disabilitata */
				SCALA_BARTHEL:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_BBS:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_DGI:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_TIS:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_FM:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_HPT:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_FAC:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_TUG:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_10MWT:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_6MWT:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_MOTRICITY_INDEX:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_TCT:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_TINETTI:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_ASHA:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCALA_DOSS:{
					'Default':{'Abilitata':false,'Statement':null}							
				},
				SCHEDA_IVG:{
					'Default':{'Abilitata':false,'Statement':null}							
				}
			},
			INSERIMENTO:{Default:''},
			AFTER_SAVE:{
				Default					:'',
				INSERIMENTO_RICHIESTA	:'reloadWk',
				MODIFICA_RICHIESTA		:'reloadWk',
				INSERIMENTO_PRESTAZIONE :'reloadWk'
			},			
			FILTER:{
				Default							:	'NUM_NOSOLOGICO',
				LETTERA_AL_CURANTE				:	'IDEN_VISITA',
				LETTERA_TRASFERIMENTO			:	'IDEN_VISITA',
				LETTERA_PRIMO_CICLO				:	'IDEN_VISITA',
				PROBLEMI						:   function(){
														if(getReparto("COD_STRUTTURA") != ""){
															return 'ANAG_STRUTTURA';
														}else{
															return 'ANAG_REPARTO';
														}
													},
                RIEPILOGO_RICOVERO              :   'ANAG_REPARTO',
                WORKLIST_ESAMI					: 	'ANAG_REPARTO',
                WORKLIST_ESAMI_DA_REPARTO		: 	'IDEN_ANAG'
			},
			FILTERS:{				
				Default:{
					IDEN_VISITA		:	{label:'',menu:true, enable:false},					
					NUM_NOSOLOGICO	:	{label:'Ricovero',menu:true, enable:true}
				},
				LETTERA_TRASFERIMENTO:{
					IDEN_VISITA		:	{label:'',menu:true, enable:true},
					NUM_NOSOLOGICO	:	{label:'Ricovero',menu:true, enable:false}
				},
				LETTERA_AL_CURANTE:{
					IDEN_VISITA		:	{label:'',menu:true, enable:true},
					NUM_NOSOLOGICO	:	{label:'Ricovero',menu:true, enable:false}
				},								
				LETTERA_PRIMO_CICLO:{
					IDEN_VISITA		:	{label:'',menu:true, enable:true},
					NUM_NOSOLOGICO	:	{label:'Ricovero',menu:true, enable:false}
				},
				WORKLIST_ESAMI:{
					//NUM_NOSOLOGICO	:	{label:'Ricovero',menu:true, enable:true},
					ANAG_REPARTO	:	{label:'Paziente + Reparto',menu:false,enable:true},
					IDEN_ANAG		:	{label:'Paziente',menu:false,enable:true}					
				},
				WORKLIST_ESAMI_DA_REPARTO:{
				},
				PROBLEMI:function(){
					return {
						IDEN_VISITA		:	{label:ModalitaCartella.getLabelMenuAccesso(),menu:true, enable:false},					
						NUM_NOSOLOGICO	:	{label:'Ricovero',menu:true, enable:true},
						IDEN_ANAG		:	{label:'Paziente',menu:false,enable:true},
						ANAG_STRUTTURA	:	{label:'Paziente + Struttura',menu:false,enable:(getReparto("COD_STRUTTURA") != '')},
						ANAG_REPARTO	:	{label:'Paziente + Reparto',menu:false,enable:true}
					};
 				},
                RIEPILOGO_RICOVERO:{
                    IDEN_VISITA		:	{label:'',menu:true, enable:false},
                    NUM_NOSOLOGICO	:	{label:'Ricovero',menu:true, enable:true},
                    ANAG_REPARTO	:	{label:'Paziente + Reparto',menu:false,enable:true}
                }
			},
			FILTER_DATA:{
				Default:{
					'DA_DATA':{enable:false,value:""},
					'A_DATA':{enable:false,value:""}
				},
				DATI_LABORATORIO:{
					'DA_DATA':{enable:false,value:""},					
					'A_DATA':{enable:false,value:clsDate.getData(new Date(),'YYYYMMDD')}
				},
				RIEPILOGO_RICOVERO:{
                    'DA_DATA':{enable:true,value:function(){
                                switch (FiltroCartella.getLivelloValue()){
                                    case 'ANAG_REPARTO':
                                        return clsDate.getData(clsDate.dateAdd(new Date(),"D",-60),'YYYYMMDD');

                                    case 'NUM_NOSOLOGICO':
                                            return getRicovero("DATA_INIZIO");
                                    default:
                                        return clsDate.getData(new Date(),'YYYYMMDD');
                                    }
                                    //return getRicovero("DATA_INIZIO");
                            }
						},
					'A_DATA':{enable:true,value:function(){
                            switch (FiltroCartella.getLivelloValue()){
                                case 'ANAG_REPARTO':
                                    return clsDate.getData(clsDate.dateAdd(new Date(),"D",+60),'YYYYMMDD');
                                case 'NUM_NOSOLOGICO':
                                    if(getRicovero("DIMESSO") == 'S'){
                                        return getRicovero("DATA_FINE");
                                    }else{
                                        return clsDate.getData(clsDate.dateAdd(new Date(),"D",+60),'YYYYMMDD');
                                    }
                                default :
                                    return clsDate.getData(clsDate.dateAdd(new Date(),"D",+60),'YYYYMMDD');
                            }
                        }
				    }
                },
				PIANO_TERAPEUTICO:{
					'DA_DATA':{enable:true,value:function(){
											switch(FiltroCartella.getLivelloValue()){
												case 'IDEN_VISITA':
													if(getAccesso("DIMESSO") == 'N'){
														return clsDate.getData(new Date(),'YYYYMMDD');
													}else{
														return getAccesso("DATA_INIZIO");
													}
												case 'NUM_NOSOLOGICO':
													if(getRicovero("DIMESSO") == 'N'){
														return clsDate.getData(new Date(),'YYYYMMDD');
													}else{
														return getRicovero("DATA_INIZIO");
													}
												default:
													return clsDate.getData(new Date(),'YYYYMMDD');
											}
											
										}
					},
					'A_DATA':{enable:true,value:function(){	
											return clsDate.dateAddStr(FiltroCartella.getDaDataValue(),"YYYYMMDD","00:00","D",+1);											
										}
					}					
				}				
				
			},
			NUMERO_RECORDS:{
				DATI_LABORATORIO:{
					enable 	: false,
					value	: function(){
						var configurazione	= baseReparti.getValue(getReparto("COD_CDC"),"VISUALIZZATORE_NUM_RICH");
						var nRichieste		= configurazione.split('#')[1];
						return nRichieste;
					},
					value_select : function(){
						var configurazione	= baseReparti.getValue(getReparto("COD_CDC"),"VISUALIZZATORE_NUM_RICH");
						var valore_select	= configurazione.split('#')[0];
						return valore_select;
					}
				}
			},
			LABELS:{
				Default:{
					IDEN_VISITA:[],
					NUM_NOSOLOGICO:[],
					ANAG_STRUTTURA:[],
					IDEN_ANAG:['lblFunzione'],
					ANAG_REPARTO:['lblFunzione','lblReparto']
				}
			},
			MENU:{
				Default:{
					IDEN_VISITA:{},
					NUM_NOSOLOGICO:{
						statement:'getRicoveri',
						title:'RICOVERI',
						columns:[
							{field:'TIPOLOGIA'		,label:'Regime'		,width:'5%'},
							{field:'NUM_NOSOLOGICO'	,label:'Nosologico'	,width:'20%'},
							{field:'DATA_INIZIO'	,label:'Dal'		,width:'15%'},
							{field:'DATA_FINE'		,label:'Al'			,width:'15%'},
							{field:'REPARTO'		,label:'In'			,width:'25%'}
						]
					}
				}
			}
	},
	
	setModificatori:function(pObj,pModificatori){	
		ModalitaCartella.setModificatoreTipoRicovero(pObj,pModificatori.TipoRicovero);
		ModalitaCartella.setModificatoreReparto(pObj,pModificatori.Reparto);
		ModalitaCartella.setModificatoreStato(pObj,pModificatori.StatoRicovero);
		ModalitaCartella.setModificatoreTipoApertura(pObj,pModificatori);
	},
	
	setModificatoreTipoRicovero:function(pObj,pTipoRicovero){
		ModalitaCartella.logger.info("setModificatoreTipoRicovero('"+pTipoRicovero+"');");
		switch(pTipoRicovero){
			case ''://probabilmente arriva da ricerca paziente, da definire
					/*if(baseUser.LIVELLO == 0){
						
						for (var i in pObj.FILTERS){
							if(typeof pObj.FILTERS[i].IDEN_VISITA != 'undefined')
								pObj.FILTERS[i].IDEN_VISITA.label = "Trasferimento";
							if(typeof pObj.FILTERS[i].NUM_NOSOLOGICO != 'undefined')
								pObj.FILTERS[i].NUM_NOSOLOGICO.label = "Ricovero";								
						}						
						
						pObj.MENU.Default.IDEN_VISITA = {
										statement:'getTrasferimenti',
										title:'TRASFERIMENTI',
										columns:[
											{field:'DATA_INIZIO',label:'Dal'	,width:'25%'},
											{field:'DATA_FINE'	,label:'Al'		,width:'25%'},
											{field:'REPARTO'	,label:'In'		,width:'25%'}
										]
									};						
					}else{*/
						pObj.FILTER = {Default : 'IDEN_ANAG'};
						pObj.FILTERS = {Default : {'IDEN_ANAG':{label:'Paziente',menu:false, enable:true}}};						
					//}
				break;
			case 'TRS':																		
			case 'ORD':
			case 'URG':			
			case 'PRE':
            case 'PRE-VPO':
			case 'PS':
			case 'OBI': //@todo da valutare meglio		
						ModalitaCartella.setModificatoreORD(pObj);
				break;
			case 'DH':	
			case 'PRE-DH':
						ModalitaCartella.setModificatoreDH(pObj);
				break;
			case 'DS':
			case 'ODS':
			case 'PRE-DS':	
			case 'DSA':
			case 'PRE-DSA':
						ModalitaCartella.setModificatoreDS(pObj);					
				break;
			case 'AMB':
						ModalitaCartella.setModificatoreAMB(pObj);
				break;
			default: 	alert('Tipo ricovero non riconosciuto');
				break;				
		}
				
	},
	
    setModificatoreORD: function(pObj) {

        pObj.MODIFICA['ANAMNESI']['M'] = function() {
            return ModalitaCartella.checkSchedaByUser("getSchedaXml", true);
        };
        pObj.MODIFICA['ESAME_OBIETTIVO']['M'] = function() {
        	return ModalitaCartella.checkSchedaByUser('getSchedaXml', true);
        };

        pObj.INSERIMENTO.Default = 'IDEN_VISITA';

        pObj.FILTER['INSERIMENTO_PRENOTAZIONE'] = 'IDEN_VISITA';
        pObj.FILTER['INSERIMENTO_RICHIESTA'] = 'IDEN_VISITA';
        pObj.FILTER['INSERIMENTO_RICHIESTA_PRENOTAZIONE'] = 'IDEN_VISITA';

        pObj.FILTERS['DATI_LABORATORIO'] = {
            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true},
            IDEN_ANAG: {label: 'Paziente', menu: false, enable: true}
        };

        pObj.FILTERS['INSERIMENTO_PRENOTAZIONE'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: '', menu: true, enable: false}
        };
        pObj.FILTERS['INSERIMENTO_RICHIESTA'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: '', menu: true, enable: false}
        };
        pObj.FILTERS['INSERIMENTO_RICHIESTA_PRENOTAZIONE'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: '', menu: true, enable: false}
        };

        pObj.FILTERS['DIARIOINFERMIERE'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true}
        };
        pObj.FILTERS['DIARIOMEDICO'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true}
        };
        pObj.FILTERS['PIANO_TERAPEUTICO'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true}
        };
        pObj.FILTERS['WORKLIST_RICHIESTE'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true},
            IDEN_ANAG: {label: 'Paziente', menu: false, enable: true}
        };
        pObj.FILTERS['DIARIORIAB'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true}
        };
        pObj.FILTERS['DIARIODIET'] = {
            IDEN_VISITA: {label: '', menu: true, enable: true},
            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true}
        };

        for (var i in pObj.FILTERS) {
            if (typeof pObj.FILTERS[i].IDEN_VISITA != 'undefined')
                pObj.FILTERS[i].IDEN_VISITA.label = "Trasferimento";
            if (typeof pObj.FILTERS[i].NUM_NOSOLOGICO != 'undefined')
                pObj.FILTERS[i].NUM_NOSOLOGICO.label = "Ricovero";
        }

        ModalitaCartella.getLabelMenuAccesso = function() {
            return "Trasferimento";
        };

        pObj.LABELS.Default.IDEN_VISITA = ['lblFunzione', 'lblCartella', 'lblReparto', 'lblDataInizio', 'lblGiorni', 'lblDataFine'];
        pObj.LABELS.Default.NUM_NOSOLOGICO = ['lblFunzione', 'lblCartella', 'lblReparto', 'lblDataInizioRicovero', 'lblGiorniRicovero', 'lblDataFineRicovero'];
        pObj.LABELS.Default.ANAG_STRUTTURA = ['lblFunzione', 'lblCartella', 'lblReparto', 'lblDataInizioRicovero', 'lblGiorniRicovero', 'lblDataFineRicovero'];
        pObj.LABELS.Default.PS_RICOVERO = ['lblFunzione', 'lblCartella', 'lblReparto'];
        pObj.MENU.Default.IDEN_VISITA = {
            statement: 'getTrasferimenti',
            title: 'TRASFERIMENTI',
            columns: [
                {field: 'DATA_INIZIO', label: 'Dal', width: '25%'},
                {field: 'DATA_FINE', label: 'Al', width: '25%'},
                {field: 'REPARTO', label: 'In', width: '25%'}
            ]
        };

    },
	
	setModificatoreDH:function(pObj){

        pObj.MODIFICA['ANAMNESI']['M'] 			= function(){return ModalitaCartella.checkSchedaByCodCdc("getSchedaXml",true);};
        pObj.MODIFICA['ESAME_OBIETTIVO']['M']	= function(){return ModalitaCartella.checkSchedaByUser('getSchedaXml',true);};

        pObj.APERTURA.RIEPILOGO_RICOVERO = true;
		
		pObj.INSERIMENTO.Default = 'NUM_NOSOLOGICO';
		
//		pObj.AFTER_SAVE.INSERIMENTO_RICHIESTA 	= 'checkAppuntamentiReloadWk';
		pObj.AFTER_SAVE.MODIFICA_RICHIESTA 		= 'checkAssociaPrestazioneCheckAppuntamentiReloadWk';
		pObj.AFTER_SAVE.PIANO_TERAPEUTICO		= 'checkAppuntamentiReloadPiano';
		pObj.AFTER_SAVE.INSERIMENTO_PRESTAZIONE	= 'checkAppuntamentiReloadRiepilogo';
		
		pObj.AFTER_SAVE.INSERIMENTO_RICHIESTA	= 'checkAssociaPrestazioneCheckAppuntamentiShowRiepilogo';
		
		
		pObj.FILTER['DATI_LABORATORIO'] = 'ANAG_REPARTO';
		
		pObj.FILTERS['DATI_LABORATORIO']={					
					NUM_NOSOLOGICO	:{label:'Ricovero'			,menu:true, enable:true},
					ANAG_REPARTO	:{label:'Paziente + Reparto',menu:false, enable:true}
				};				
		
		pObj.FILTERS['WORKLIST_RICHIESTE']={
					NUM_NOSOLOGICO	:{label:'Ricovero'			,menu:true, enable:true},
					ANAG_REPARTO	:{label:'Paziente + Reparto',menu:false, enable:true},
					IDEN_ANAG		:{label:'Paziente'			,menu:false, enable:true}
				};				
						
		for (var i in pObj.FILTERS){
			if(typeof pObj.FILTERS[i].NUM_NOSOLOGICO != 'undefined')
				pObj.FILTERS[i].NUM_NOSOLOGICO.label = "Ricovero";
			if(typeof pObj.FILTERS[i].IDEN_VISITA != 'undefined')
				pObj.FILTERS[i].IDEN_VISITA.label = "Accesso";							
		}	
		
		ModalitaCartella.getLabelMenuAccesso = function(){return "Accesso";};	
		
		pObj.LABELS.Default.IDEN_VISITA = ['lblFunzione','lblCartella','lblReparto','lblDataInizio'];
		pObj.LABELS.Default.NUM_NOSOLOGICO = ['lblFunzione','lblCartella','lblReparto','lblDataInizioRicovero','lblDataFineRicovero'];			
		pObj.LABELS.Default.ANAG_STRUTTURA = ['lblFunzione','lblCartella','lblReparto','lblDataInizioRicovero','lblGiorniRicovero','lblDataFineRicovero'];			
		
		pObj.MENU.Default.IDEN_VISITA = {
						statement:'getAccessi',
						title:'ACCESSI',
						columns:[
							{field:'DATA_INIZIO',label:'Del'	,width:'25%'},
							{field:'PROGRESSIVO',label:'Progr.'	,width:'10%'},
							{field:'NOTE'		,label:'Note'	,width:'45%'}
						]
					};	
		
		pObj.STAMPA.TERAPIE_GLOBALI.Default.Statement 	= "TerapieGlobaliDH.Stampa";		
	},
	
	setModificatoreDS:function(pObj){
		
		pObj.INSERIMENTO.Default = 'IDEN_VISITA';	
		
		for (var i in pObj.FILTERS){
			if(typeof pObj.FILTERS[i].IDEN_VISITA != 'undefined')
				pObj.FILTERS[i].IDEN_VISITA.label = "Trasferimento";
			if(typeof pObj.FILTERS[i].NUM_NOSOLOGICO != 'undefined')
				pObj.FILTERS[i].NUM_NOSOLOGICO.label = "Ricovero";								
		}	
		
		ModalitaCartella.getLabelMenuAccesso = function(){return "Trasferimento";};
		
		pObj.LABELS.Default.IDEN_VISITA = ['lblFunzione','lblCartella','lblReparto','lblDataInizio'];
		pObj.LABELS.Default.NUM_NOSOLOGICO = ['lblFunzione','lblCartella','lblReparto','lblDataInizioRicovero','lblDataFineRicovero'];			
		
		pObj.MENU.Default.IDEN_VISITA = {
						statement:'getAccessi',
						title:'ACCESSI',
						columns:[
							{field:'DATA_INIZIO',label:'Del'	,width:'25%'},
							{field:'PROGRESSIVO',label:'Progr.'	,width:'10%'},
							{field:'NOTE'		,label:'Note'	,width:'45%'}
						]
					};			
		
	},
	
	
	setModificatoreAMB:function(pObj){
		
		pObj.INSERIMENTO.Default = 'IDEN_VISITA';
		
		pObj.FILTER['ESAME_OBIETTIVO'] 	= 'IDEN_VISITA';

		pObj.FILTER['DATI_LABORATORIO'] 	= 'IDEN_ANAG';		
		
		pObj.AFTER_SAVE.INSERIMENTO_PRESTAZIONE	= 'reloadWkAMB';
		/*for (var i in pObj.FILTERS){
			if(typeof pObj.FILTERS[i].IDEN_VISITA != 'undefined')
				pObj.FILTERS[i].IDEN_VISITA.label = "Contatto";
			if(typeof pObj.FILTERS[i].NUM_NOSOLOGICO != 'undefined')
				pObj.FILTERS[i].NUM_NOSOLOGICO.label = "Paziente";	// era Paziente in reparto	
		}*/

		pObj.FILTERS['DATI_LABORATORIO']={					
					IDEN_ANAG	:{label:'Paziente',menu:false, enable:true}
				};				
	
		for (var i in pObj.FILTERS){
			if(typeof pObj.FILTERS[i].IDEN_VISITA != 'undefined')
				pObj.FILTERS[i].IDEN_VISITA.label = "Contatto";
			if(typeof pObj.FILTERS[i].NUM_NOSOLOGICO != 'undefined')
				pObj.FILTERS[i].NUM_NOSOLOGICO.label = "Paziente";	// era Paziente in reparto	
		}
		
		ModalitaCartella.getLabelMenuAccesso = function(){return "Contatto";};

		pObj.MENU.Default.IDEN_VISITA = {
				statement:'getAccessi',
				title:'CONTATTI',
				columns:[
					{field:'DATA_INIZIO',label:'Del'	,width:'25%'},
					{field:'PROGRESSIVO',label:'Progr.'	,width:'10%'},
					{field:'NOTE'		,label:'Note'	,width:'45%'}
				]
			};	
		
	},
	
	setModificatoreStato:function(pObj,pStato){
		ModalitaCartella.logger.info("setModificatoreStato('"+pStato+"');");
		switch(pStato){
			case '':
				break;
			case 'POSTRICOVERO':
			case 'PROTETTA':
				 pObj.CLASSNAME = 'Green';
				break;
								
			case 'DIMESSO':
				pObj.STAMPA = {
                                    'Default':{'Abilitata':false,'Statement':null},
                                    'SETTIMANA36':{'Abilitata':CartellaPaziente.getRicovero("TIPOLOGIA").search("PRE")>=0,'Statement':null},
                                    'MONITORAGGIO':{'Abilitata':CartellaPaziente.getRicovero("TIPOLOGIA").search("PRE")>=0,'Statement':null}
                        };
				
			case 'TRASFERITO':
			case 'READONLY':
			case 'ATTESAESITI':
			case 'PROSECUZIONE':
				pObj.CLASSNAME = 'Red';
				
				pObj.APERTURA['INSERIMENTO_PRENOTAZIONE'] 			= false;
				pObj.APERTURA['INSERIMENTO_RICHIESTA'] 				= false;								
				pObj.APERTURA['INSERIMENTO_RICHIESTA_PRENOTAZIONE'] = false;												
				pObj.APERTURA['PT']				 					= false;
				pObj.APERTURA['RR_RICETTA_ROSSA_FARMACI'] 			= false;
				pObj.APERTURA['RR_RICETTA_ROSSA_PRESTAZIONI'] 		= false;
								
				pObj.MODIFICA = {
					Default:false,
					'LETTERA_PROSECUZIONE': (pStato == 'PROSECUZIONE')
				};				
								
				break;
			
			default:alert('Stato ricovero non riconosciuto');
				break;
		}
		
	},
	
	setModificatoreTipoApertura:function(pObj,pModificatori){
            
            pTipoApertura = pModificatori.TipoApertura;
            
		ModalitaCartella.logger.info("setModificatoreTipoApertura('"+pTipoApertura+"');");
		switch(pTipoApertura){
			case ''	://nessuna apertura peculiare
				break;			
			case 'CONSULENZA':
				pObj.CLASSNAME = 'Red';
				
				pObj.APERTURA['INSERIMENTO_RICHIESTA'] 				= false;
				pObj.APERTURA['INSERIMENTO_PRENOTAZIONE'] 			= false;				
				pObj.APERTURA['INSERIMENTO_RICHIESTA_PRENOTAZIONE'] = false;	

				pObj.MODIFICA 	= {
									'Default':false,
									'DIARIORIAB':(baseUser.TIPO =='L' || baseUser.TIPO =='F' || (baseUser.TIPO =='M' && baseUser.TIPO_MED =='F')),
                                    'DIARIODIET':(baseUser.TIPO =='D')
								  };
				pObj.STAMPA 	= {
									'Default':{'Abilitata':false,'Statement':null},
									'DIARIORIAB':{'Abilitata':(baseUser.TIPO =='L' || baseUser.TIPO =='F' || (baseUser.TIPO =='M' && baseUser.TIPO_MED =='F')),'Statement':null},
									'DIARIODIET':{'Abilitata':(baseUser.TIPO =='D'),'Statement':null}
									};						
				
				break;
			case 'PRESA_IN_CARICO':
				
				pObj.APERTURA['INSERIMENTO_RICHIESTA'] 				= false;
				pObj.APERTURA['INSERIMENTO_PRENOTAZIONE'] 			= false;				
				pObj.APERTURA['INSERIMENTO_RICHIESTA_PRENOTAZIONE'] = false;	

				pObj.MODIFICA 	= {
									'Default':false,
									'MODULISTICA':(baseUser.TIPO =='F' || (baseUser.TIPO =='M' && baseUser.TIPO_MED =='F')),
									'DIARIORIAB':(baseUser.TIPO =='F' || (baseUser.TIPO =='M' && baseUser.TIPO_MED =='F')),
			                        'SCALA_10MWT':true,
			                        'SCALA_ASHA':true,
			                        'SCALA_BRADEN':true,
			                        'SCALA_6MWT':true,
			                        'SCALA_APRI':true,
			                        'SCALA_BARTHEL':true,
			                        'SCALA_BBS':true,
			                        'SCALA_CHILD_PUGH':true,
			                        'SCALA_DGI':true,
			                        'SCALA_DOS':true,
			                        'SCALA_CONLEY':true,
			                        'SCALA_FAC':true,
			                        'SCALA_FACE':true,
			                        'SCALA_FM':true,
			                        'SCALA_GLASGOW':true,
			                        'SCALA_HARRIS':true,
			                        'SCALA_HPT':true,
			                        'SCALA_MELD':true,
			                        'SCALA_MGAPS':true,
			                        'SCALA_MMSE':true,
			                        'SCALA_MOTRICITY_INDEX':true,
			                        'SCALA_NAFLD':true,
			                        'SCALA_NIH_STROKE':true,
			                        'SCALA_OXFORD_HIP':true,
			                        'SCALA_OXFORD_KNEE':true,
			                        'SCALA_RANKIN':true,
			                        'SCALA_SOAS':true,
			                        'SCALA_TCT':true,
			                        'SCALA_TEGNER':true,
			                        'SCALA_TINETTI':true,
			                        'SCALA_TIS':true,
			                        'SCALA_TUG':true
								  };
				pObj.STAMPA 	= {
									'Default':{'Abilitata':false,'Statement':null},
									'MODULISTICA':{'Abilitata':(baseUser.TIPO =='F' || (baseUser.TIPO =='M' && baseUser.TIPO_MED =='F')),'Statement':null},
									'DIARIORIAB':{'Abilitata':( baseUser.TIPO =='F' || (baseUser.TIPO =='M' && baseUser.TIPO_MED =='F')),'Statement':null}
									};						
				
				break;
			case 'CONSULENZA_ASSISTENTE_SOCIALE':

				pObj.APERTURA 	= {
						'Default': false,
						'EMPTY': true,
						'DATI_GENERALI':true,
                        'PIANO_TERAPEUTICO':true,
                        'DIARIOINFERMIERE':true,
                        'MODULISTICA':true,
                        'VISUALIZZA TERAPIE':true,
                        'BISOGNI_ASSISTENZIALI':true,
                        'TABULATORE_SINTESI':true,
                        'BISOGNI_SINTESI':true,
                        'BISOGNO_RESPIRARE':true,
                        'BISOGNO_RIPOSO':true,
                        'BISOGNO_ELIMINAZIONE_URINARIA':true,
                        'BISOGNO_IGIENE':true,
                        'BISOGNO_MOVIMENTO':true,
                        'BISOGNO_COMUNICARE':true,
                        'BISOGNO_CARDIOCIRCOLATORIA':true,
                        'BISOGNO_AMBIENTE_SICURO':true,
                        'BISOGNO_ALIMENTARSI':true,
                        'SCALA_10MWT':true,
                        'SCALA_BRADEN':true,
                        'SCALA_6MWT':true,
                        'SCALA_APRI':true,
                        'SCALA_BARTHEL':true,
                        'SCALA_BBS':true,
                        'SCALA_BBS':true,
                        'SCALA_CHILD_PUGH':true,
                        'SCALA_DGI':true,
                        'SCALA_CONLEY':true,
                        'SCALA_FAC':true,
                        'SCALA_FACE':true,
                        'SCALA_FM':true,
                        'SCALA_GLASGOW':true,
                        'SCALA_HARRIS':true,
                        'SCALA_HPT':true,
                        'SCALA_MELD':true,
                        'SCALA_MGAPS':true,
                        'SCALA_MMSE':true,
                        'SCALA_MOTRICITY_INDEX':true,
                        'SCALA_NAFLD':true,
                        'SCALA_NIH_STROKE':true,
                        'SCALA_OXFORD_HIP':true,
                        'SCALA_OXFORD_KNEE':true,
                        'SCALA_RANKIN':true,
                        'SCALA_SOAS':true,
                        'SCALA_TCT':true,
                        'SCALA_TEGNER':true,
                        'SCALA_TINETTI':true,
                        'SCALA_TIS':true,
                        'SCALA_TUG':true,
                        'SCALA_VALUTAZIONE_FUNZIONALE':true,
                        'DIARIOSOCIALE':true
					  };

				pObj.MODIFICA 	= {
									'Default':false,
									'DIARIOSOCIALE':true
								  };					
				
				break;
			case 'METAL':
				pObj.MODIFICA 	= {
									'Default':true,
									'DIARIOMEDICO':false,
									'DIARIOINFERMIERE':false,
									'DIARIO':false
								  };
				pObj.APERTURA={
				'Default':true,
				'RIEPILOGO_RICOVERO':false
				};
				
				break;
			case 'MODIFICA':
            case 'REPARTO':    
			case 'REPERIBILITA':
			case 'EMERGENZA':
			case 'SOSTITUZIONE_INFERMIERISTICA':
                break;
			case 'CLOSEAFTERSAVE':
				//pObj.AFTER_SAVE.INSERIMENTO_RICHIESTA = function(){self.close();};
				pObj.AFTER_SAVE['INSERIMENTO_RICHIESTA'] = 'chiudiCartella';
				pObj.AFTER_SAVE['MODIFICA_RICHIESTA'] = 'chiudiCartella';
				break;
            case 'DIAGNOSTICA':
                    
                    pObj.CLASSNAME = 'Red';
                
                    pObj.MODIFICA = {Default:false};
                
                    pObj.APERTURA['INSERIMENTO_RICHIESTA'] 				= false;
                    pObj.APERTURA['INSERIMENTO_PRENOTAZIONE'] 			= false;				
                    pObj.APERTURA['INSERIMENTO_RICHIESTA_PRENOTAZIONE'] = false;	                            
    				pObj.APERTURA['PT']				 					= false;
    				pObj.APERTURA['RR_RICETTA_ROSSA_FARMACI'] 			= false;
    				pObj.APERTURA['RR_RICETTA_ROSSA_PRESTAZIONI'] 		= false;
                    
                    pObj.STAMPA = {'Default':{'Abilitata':false,'Statement':null}};
                
                    for (var i in pObj.FILTERS){                                    
                        if(typeof pObj.FILTERS[i].NUM_NOSOLOGICO !== 'undefined'){
                            pObj.FILTERS[i].NUM_NOSOLOGICO.menu = false;
                        }
                    }
                
                    if(pModificatori.StatoRicovero !== '' && pModificatori.StatoRicovero !== 'POSTRICOVERO' && pModificatori.StatoRicovero !== 'PROTETTA'){
                        pObj.APERTURA = {
                            Default:false,
                    'EMPTY': true
                        };
                        alert("Attenzione, non è più possibile accedere in lettura ai dati della cartella");
                    }
                    break;
			default:alert('Tipologia di apertura non riconosciuta');
		}
	},
	
	setModificatoreReparto:function(pObj,pCodCdc){
		switch (pCodCdc) {
			case 'NIDO_SV':
			case 'NIDO_PL':
			case 'PAT_NEO_SV':
			case 'PAT_NEO_PL':
		        pObj.MODIFICA['ANAMNESI']['M'] = function() {
	            	return ModalitaCartella.checkSchedaByCodCdc("getSchedaXml", true);
	        	};
		        pObj.MODIFICA['ESAME_OBIETTIVO']['M'] = function() {
	            	return ModalitaCartella.checkSchedaByCodCdc("getSchedaXml", true);
	        	};
	        	break;
			case 'UTIC_SV':
			case 'ATS_CAR_SV':
			case 'DH_CARD_SV':	
				pObj.MODIFICA['DIARIO'] = function(){
					if (baseUser.TIPO=='M' ){
						var txtMessage = "Diario Medico";
						return ModalitaCartella.checkSchedaCompilata("getSchedaXml",["ANAMNESI","ESAME_OBIETTIVO"],txtMessage);
					}else{
						return true;
					}
				};
				
		        pObj.MODIFICA['DIARIOMEDICO'] = function(){
		        	if (baseUser.TIPO=='M'){
			        	var txtmessage="Diario Medico";
			        	return ModalitaCartella.checkSchedaCompilata("getSchedaXml",["ANAMNESI","ESAME_OBIETTIVO"],txtmessage);		        		
		        	}
		        };
				break;
			case 'MED_URG_SV':
			case 'OBI_SV':
			case 'MED_URG_PL':
			case 'OBI_PL':
				pObj.FILTER['DIARIO'] = 'PS_RICOVERO';
				pObj.FILTER['DIARIOMEDICO'] = 'PS_RICOVERO';
				pObj.FILTER['DIARIOINFERMIERE'] = 'PS_RICOVERO';

		        pObj.FILTERS['DIARIO'] = {
			            PS_RICOVERO: {label: 'Percorso clinico', menu: false, enable: true},
			            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true},
			            IDEN_VISITA: {label: 'Trasferimento', menu: true, enable: true}
			        };
		        pObj.FILTERS['DIARIOMEDICO'] = {
			            PS_RICOVERO: {label: 'Percorso clinico', menu: false, enable: true},
			            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true},
			            IDEN_VISITA: {label: 'Trasferimento', menu: true, enable: true}
			        };
		        pObj.FILTERS['DIARIOINFERMIERE'] = {
			            PS_RICOVERO: {label: 'Percorso clinico', menu: false, enable: true},
			            NUM_NOSOLOGICO: {label: 'Ricovero', menu: true, enable: true},
			            IDEN_VISITA: {label: 'Trasferimento', menu: true, enable: true}
			        };
				
	        default:
		}
	},
	
	checkSchedaByCodCdc:function(pStatementName,pCanInsert){
		
		ModalitaCartella.logger.debug("checkSchedaByCodCdcByCodCdc('"+pStatementName+"',"+pCanInsert+");");
					
		var ReturnValue = pCanInsert;

		var rs = executeQuery(
					"cartellaPaziente.xml",
					pStatementName,
					[CartellaPaziente.getFunzione(),
					FiltroCartella.getIdenRiferimento(getForm())]
				);
		if(rs.next()){
			ModalitaCartella.logger.debug("checkSchedaByCodCdc Esiste record -->" + true);
			
			var MatchIdenVisitaRegistrazione = rs.getString("IDEN_VISITA_REGISTRAZIONE") == CartellaPaziente.getAccesso("IDEN");
			ModalitaCartella.logger.debug("checkSchedaByCodCdc Match iden_visita_registrazione -->" + MatchIdenVisitaRegistrazione);
			
			var MatchCodCdcRegistrazione = rs.getString("COD_CDC") == CartellaPaziente.getReparto("COD_CDC");												
			ModalitaCartella.logger.debug("checkSchedaByCodCdc Match cod_cdc -->" + ReturnValue);

						
			ReturnValue = rs.getString("IDEN_VISITA_REGISTRAZIONE") == "" || MatchIdenVisitaRegistrazione || MatchCodCdcRegistrazione;			
			
		}else{
			ModalitaCartella.logger.debug("checkSchedaByCodCdc Esiste record -->" + false);
		}
		
		ModalitaCartella.logger.debug("checkSchedaByCodCdc ReturnValue-->" + ReturnValue);
		return ReturnValue;
	},

    checkSchedaByUser:function(pStatementName,pCanInsert){
        ModalitaCartella.logger.debug("checkSchedaByUser('"+pStatementName+"',"+pCanInsert+");");

        var ReturnValue = pCanInsert;

        var rs = executeQuery(
            "cartellaPaziente.xml",
            pStatementName,
            [CartellaPaziente.getFunzione(),
                FiltroCartella.getIdenRiferimento(getForm())]
        );

        if(rs.next()){
            ModalitaCartella.logger.debug("checkSchedaByUser Esiste record -->" + true);

            var MatchIdenPerUteIns = rs.getString("UTE_INS") == baseUser.IDEN_PER;
            ModalitaCartella.logger.debug("checkSchedaByUser Match inden_per ute_ins -->" + MatchIdenPerUteIns /*+'   -   ' +rs.getString("UTE_INS") +'   -   '+  baseUser.IDEN_PER*/);

            var difference = clsDate.difference.hour(new Date(),clsDate.str2date(rs.getString("DATA_INSERIMENTO"),'YYYYMMDD',rs.getString("ORA_INSERIMENTO")));

            var MatchDataInsDateNow = difference<=12?true:false;
            ModalitaCartella.logger.debug("checkSchedaByUser Match data_ins -->" + MatchDataInsDateNow);


            ReturnValue = rs.getString("IDEN_VISITA_REGISTRAZIONE") == "" || (MatchIdenPerUteIns && MatchDataInsDateNow);


        }else{
            ModalitaCartella.logger.debug("checkSchedaByUser Esiste record -->" + false);
        }

        ModalitaCartella.logger.debug("checkSchedaByUser ReturnValue-->" + ReturnValue);
        return ReturnValue;
    },
/**
 * @author: linob, @date:2015-04-13 
 * @param pStatementName getSchedaXml le schede tipo anamnesi/esame obiettivo
 * @param pFunzioniDaControllare array con le funzioni da controllare
 * @param fnzToOpen Dicitura della funzione da popolare
 * @returns {Boolean}
 */    
    checkSchedaCompilata:function(pStatementName,pFunzioniDaControllare,fnzToOpen){
    	var pBinds = [];
    	var objReturn = [];
    	for (var i=0;i<pFunzioniDaControllare.length;i++){
    		ModalitaCartella.logger.debug("checkSchedaCompilata: funzione da controllare -->" + pFunzioniDaControllare[i]);
    		pBinds = [];
    		pBinds.push(pFunzioniDaControllare[i]);
    		pBinds.push(FiltroCartella.getIdenRiferimento(getForm()));
        	var rs = executeQuery('cartellaPaziente.xml',pStatementName,pBinds);
        	if (rs.next()){
                ModalitaCartella.logger.debug("checkSchedaCompilata: la funzione "+pFunzioniDaControllare[i] +"-->" + true);
                objReturn[pFunzioniDaControllare[i]]={"stato":"OK","message":""};
            }else{
            	ModalitaCartella.logger.debug("checkSchedaCompilata: la funzione "+pFunzioniDaControllare[i] +"-->" + false);
            	objReturn[pFunzioniDaControllare[i]]={"stato":"KO","message":pFunzioniDaControllare[i]};
            }    		
    	}
    	
    	var check = true;
		var messaggio = [];
    	for (var i in objReturn){
    		if (objReturn[i].stato=="KO"){
    			check = false;
    			messaggio.push(objReturn[i]["message"]);
    		}
    	}
    	if (!check){
    		var mex = "Prima di procedere con l'inserimento del "+fnzToOpen+" compilare le seguenti schede:\n" +messaggio.join('\n');
    		alert(mex);
    	}
   
    	return check;
    },
	
	getLabelMenuAccesso:function(){return 'Abstract method exception';}
};