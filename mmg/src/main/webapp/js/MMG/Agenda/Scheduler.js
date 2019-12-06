$(function() {
	SCHEDULER.init();
});

var event_type = [
                  { key: 'P', label: "Prenotazione" }, 
                  { key: 'S', label: "Assenza/Ferie" },
                  { key: 'N', label: "Nota" }
                  ];

var SCHEDULER = {
		
		medici : [],
		idMedici : '',
		idMedicoSelected : '',
		orariMedici : {},
		loader: null,
		
		init: function() {
			home.NS_CONSOLEJS.addLogger({ name: 'SCHEDULER', console: 0 });
			SCHEDULER.logger = home.NS_CONSOLEJS.loggers['SCHEDULER'];
			
			home.SCHEDULER = this;
			SCHEDULER.loader = SCHEDULER_LOADING;

			SCHEDULER.setEvents();

			SCHEDULER.configScheduler();
			
			SCHEDULER_LOADING.loadOrariMedici();
			
			$(".dhx_cal_navline").append($("<i/>", {'id': 'bt-conf','class' : 'icon-cog-1'})
					.on("click", SCHEDULER.apriConfigurazioneOrari ));
			
			/*
			 * tapullo se presente month_tab
			 */
			$("div[name=week_tab]").removeClass("dhx_cal_tab_last");
			
			var su = scheduler.scrollUnit;
			scheduler.scrollUnit = function () {
				su.apply(scheduler, arguments);
				SCHEDULER.mask.unit(scheduler._date);
			}
		},
		
		setEvents: function() {
			$("#cmbMedico").on("change", function(){
				SCHEDULER.idMedicoSelected  = $(this).find("option:selected").val();

				if (scheduler.getState().mode == 'unit')
					scheduler.setCurrentView(new Date(), "week");
				else 
					NS_FENIX_SCHEDULER.aggiorna();
			});
			
			$(document).on('click', '.dhx_cal_zoom_out_button', function (e) {
	            if (SCHEDULER.idxStep < (SCHEDULER.steps.length - 1))
	                SCHEDULER.idxStep += 1;
	            SCHEDULER.configZoom();
	            NS_FENIX_SCHEDULER.aggiorna({});
//	            SCHEDULER.scrollTo7();
	        });
	        $(document).on('click', '.dhx_cal_zoom_in_button', function (e) {
	            if (SCHEDULER.idxStep > 0)
	                SCHEDULER.idxStep -= 1;
	            SCHEDULER.configZoom();
	            NS_FENIX_SCHEDULER.aggiorna({});
//	            SCHEDULER.scrollTo7();
	        });
			
			$(document).on('click', 'input[name="type"]', function() {
				$('.autocomplete').remove();
				SCHEDULER.bindAutocompleteAssistiti();
			});
			
		},

		configScheduler: function() {
			scheduler.locale.labels.unit_tab = "Medicina di gruppo";
			scheduler.locale.labels.section_custom="Medico";
			scheduler.config.first_hour = 8;
			scheduler.config.last_hour = 21;
			scheduler.config.full_day = true;
			scheduler.config.event_duration = 15;
			scheduler.config.multi_day = true;
			scheduler.config.details_on_create=true;
			scheduler.config.details_on_dblclick=true;
			scheduler.config.hour_size_px = 132;
			scheduler.config.xml_date="%Y-%m-%d %H:%i";
			scheduler.config.buttons_right = ["dhx_save_btn", "dhx_cancel_btn"];
			scheduler.config.buttons_left = ["dhx_delete_btn"];
			scheduler.xy.min_event_height = 0;
			scheduler.config.repeat_date = "%d/%m/%Y";
			scheduler._skin_xy.nav_height = [79,22];
			
			SCHEDULER.configZoom();
			
			scheduler.templates.event_header = function(start,end,ev) { return /*scheduler.templates.event_date(start) + " - " +*/ ev.text;};
			scheduler.templates.event_text = function(start,end,ev) { return ''; };
			
			$("#cmbMedico option[data-value]").each(function(i, e) {
				SCHEDULER.medici.push({key : $(e).val(), label : $(e).text()});
				SCHEDULER.idMedici += $(e).val() + ",";
				
				if ($(e).val() == home.baseUser.IDEN_PER) {
					$(this).attr("selected",true);
					SCHEDULER.idMedicoSelected = $(e).val();
				}
			});

			SCHEDULER.idMedici = SCHEDULER.idMedici.substring(0,SCHEDULER.idMedici.length -1);
			
			scheduler.templates.event_class = function (start, end, event) {
				switch(event.type) {
				case 'P': return "evn_prenotazione"; 
				case 'N': return "evn_nota";
				case 'S': return "evn_sospeso";
				}
			};

			// configurazione sezioni del form
			scheduler.config.lightbox.sections = [
			                                      { name: "type", height: 20, options: event_type, map_to: "type", type: "radio", vertical: false, default_value: 'P' },
			                                      { name:"description", height:25, map_to:"text", type:"textarea" , focus:true},
			                                      { name: "recurring", height: 115, type: "recurring", map_to: "rec_type", button: "recurring"},
			                                      { name: "time", height: 100, type: "time", map_to: "auto"}
			                                      ];

			scheduler.attachEvent("onEventAdded", function( id, ev){
				SCHEDULER.saveEvent('-1', ev);
			});

			scheduler.attachEvent("onEventChanged", function(id,ev){ 
				SCHEDULER.saveEvent(id, ev);
			});

			scheduler.attachEvent("onEventDeleted", function(id){
				SCHEDULER.deleteEvent(id);
			});

			scheduler.attachEvent("onLightbox", function(id){ 				 
				SCHEDULER.bindAutocompleteAssistiti();
			});
			
			scheduler.attachEvent("onAfterLightbox", function (){
				$('.autocomplete').remove();
			});
			
			scheduler.attachEvent("onViewChange", function (new_mode, new_date) {
				
				switch (new_mode) {
				case 'day':
					if(!SCHEDULER.checkMedSelected()) return;
					SCHEDULER_LOADING.dayLoading(new_date);
					SCHEDULER.mask.day(new_date);
					break;

				case 'week':
					if(!SCHEDULER.checkMedSelected()) return;
					SCHEDULER_LOADING.weekLoading(new_date);
					SCHEDULER.mask.week(new_date);
					break;
				
				case 'month':
					if(!SCHEDULER.checkMedSelected()) return;
					SCHEDULER_LOADING.monthLoading(new_date);
					SCHEDULER.mask.month(new_date); /*TODO*/
					break;

				case 'unit':
					$("#cmbMedico").val('');
					SCHEDULER.idMedicoSelected = '';
					SCHEDULER_LOADING.unitLoading(new_date);
					SCHEDULER.mask.unit(new_date);
					break;
				}
				
			});
			
			if (SCHEDULER.medici.length > 1 ) {
				scheduler.createUnitsView({
					name: "unit",
					property: "id_medico",
					list: SCHEDULER.medici,
					skip_incorrect: true, // se true, salta la visualizzazione di eventi di id_sala non in lista oppure ""
					size: 7, //the number of units that should be shown in the view
					step: 1  //the number of units that will be scrolled at once
				});
				
				if (home.baseUser.TIPO_PERSONALE == 'A') {
					scheduler.init('sScheduler',new Date(),"unit");
				} else {
					scheduler.init('sScheduler',new Date(),"week");
				}
			} else {
				$("[name=unit_tab]").hide();
				$("[name=cmbMedico]").attr("disabled",true);
				scheduler.init('sScheduler',new Date(),"week");
			}
			
		},

		executeCall : function(params) {

			$.NS_DB.getTool({_logger: SCHEDULER.logger}).call_function({
				id: 'CREA_UPD_EVENTO_AGENDA',
				parameter: params
			})
			.done(function (response) {
//				scheduler.cancel_lightbox();
				NS_FENIX_SCHEDULER.aggiorna();
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				SCHEDULER.logger.error('Errore SCHEDULER.executeCall: ' + errorThrown);
				NOTIFICA.error({ message: errorThrown, title: "Errore salvataggio evento" });
				NS_FENIX_SCHEDULER.aggiorna();
	        });
		},

		deleteEvent: function( id ) {
			SCHEDULER.executeCall({
				p_iden			: { v : id, t : 'N' },
				p_stato			: { v : 'X', t : 'V' }
			});
		},

		saveEvent: function(id, data) {
			if (id.indexOf('#')>-1) 
				return;
			if (scheduler.getState().mode != 'unit')
			{
				if (SCHEDULER.idMedicoSelected=='')
					return NS_FENIX_SCHEDULER.aggiorna();
				else
					data.id_medico = SCHEDULER.idMedicoSelected;
				
				data.iden_anag = NS_MMG_UTILITY.getAttr($(".dhx_cal_ltext textarea"), "data-c-value", 0);
			}
			
			var params = {
					p_iden			: { v : id, t : 'N' },
					p_iden_med		: { v : data.id_medico, t : 'N' },
					p_iden_anag 	: { v : data.iden_anag, t : 'N' },
					p_data_inizio	: { v : moment(data.start_date).format('YYYYMMDD HH:mm'), t : 'V' },
					p_data_fine		: { v : moment(data.end_date).format('YYYYMMDD HH:mm'), t : 'V' },
					p_ute_ins		: { v : home.baseUser.IDEN, t : 'N' },
					p_nota 			: { v : data.text, t : 'V' },
					p_rec_type 		: typeof data.rec_type == 'undefined' || data.rec_type =='' ? undefined : { v : data.rec_type, t : 'V' },
					p_event_pid 	: typeof data.event_pid == 'undefined' || data.event_pid =='' ? undefined : { v : data.event_pid, t : 'N' },
					p_event_length	: typeof data.event_length == 'undefined' || data.event_length =='' ? undefined : { v : data.event_length, t : 'N' },
					p_type 			: { v : data.type, t : 'V' }
			};
			SCHEDULER.executeCall(params);
		},
		
		checkMedSelected: function() {
			if (SCHEDULER.idMedicoSelected =='')
			{
				NOTIFICA.warning({ message: "Selezionare un medico dal menu a tendina", title: "Attenzione" });
				scheduler.clearAll();
				return false;
			}
			else
				return true;
		},
		
		steps: [5, 10, 15, 30, 60],
		idxStep: 2,
		configZoom: function () 
		{
	        var format = scheduler.date.date_to_str("%H:%i");
	        var k = 44;
	        scheduler.config.hour_size_px = (60 / SCHEDULER.steps[SCHEDULER.idxStep]) * k;
			scheduler.config.event_duration = SCHEDULER.steps[SCHEDULER.idxStep];
	        scheduler.templates.hour_scale = function (date) {
	            var html = "";
	            var h = (SCHEDULER.steps[SCHEDULER.idxStep] > 20) ? 2*k : k;
	            for (var i = 0; i < 60 / SCHEDULER.steps[SCHEDULER.idxStep]; i++) {
	                html += "<div style='height:" + h + "px;line-height:" + h/2 + "px;'>" + format(date) + "</div>";
	                date = scheduler.date.add(date, SCHEDULER.steps[SCHEDULER.idxStep], "minute");
	            }
	            return html;
	        };
	    },
		
		bindAutocompleteAssistiti: function() {
		
			$(".dhx_cal_ltext textarea").unbind();
			
			if ($("input[name='type']:checked").val()=='P') {
				$(".dhx_cal_ltext textarea").autocomplete({
					'storedQuery':'AUTOCOMPLETE.AC_ASSISTITI',
					'onSelect':function(data){
					},
					'minChars':'3',
					'binds':{"iden_utente": home.baseUser.IDEN_PER},
					'zIndex':'100000','width':'300','maxHeight':'400','deferRequestBy':'400',
					'idList':'acAssistiti','serviceUrl':'autocompleteAjax','datasource':'MMG_DATI','maxResults':'40'});
			}
		},
		
		mask: {

			day: function( date ) {
				var d = date.getDay();
				if (LIB.isValid(SCHEDULER.orariMedici[SCHEDULER.idMedicoSelected]) && 
						SCHEDULER.orariMedici[SCHEDULER.idMedicoSelected][d == 0 ? 6 : d - 1].length>0)
				{
					scheduler.markTimespan({  
					days: 		[ d ], // parte da domenica               
					zones: 		SCHEDULER.orariMedici[SCHEDULER.idMedicoSelected][d == 0 ? 6 : d - 1],       
					css:   		"green_section" /*,
					invert_zones : true*/
					});
				}
			},
			
			month: function() {
				/*TODO*/
			},
			
			week: function() {
				if (!LIB.isValid(SCHEDULER.orariMedici[SCHEDULER.idMedicoSelected])) return;
				for (var d = 0; d < SCHEDULER.orariMedici[SCHEDULER.idMedicoSelected].length; d++ )
				{
					if (SCHEDULER.orariMedici[SCHEDULER.idMedicoSelected][d].length>0)
					{
							scheduler.markTimespan({  
							days: 		[ d == 6 ? 0 : d + 1], // parte da domenica               
							zones: 		SCHEDULER.orariMedici[SCHEDULER.idMedicoSelected][d],       
							css:   		"green_section"/* ,
							invert_zones : true*/
							});
					}
				}
			},
			
			unit: function( date ) {
				var d = date.getDay();
				for (var i = scheduler._props.unit.position;
						i < scheduler._props.unit.options.length
								&& i < scheduler._props.unit.position + scheduler._props.unit.size;
						i++) {
					var idMed = scheduler._props.unit.options[i].key;
					if (SCHEDULER.orariMedici[idMed] && SCHEDULER.orariMedici[idMed][d == 0 ? 6 : d - 1].length>0) {
						scheduler.markTimespan({
							days: 		[ d ], // parte da domenica               
							zones: 		SCHEDULER.orariMedici[idMed][d == 0 ? 6 : d - 1],       
							css:   		"green_section" ,
							sections : 	{ unit: idMed }/*,
							invert_zones : true*/
						});
					}
				}
			}
		},
		
		apriConfigurazioneOrari: function() {
			if(!SCHEDULER.checkMedSelected()) return;
			var optSel = $("#cmbMedico option:selected");
			home.NS_MMG.apri( "SCHEDA_AGENDA", 
					"&IDEN=" + (LIB.isValid(optSel.attr("iden_conf")) ? optSel.attr("iden_conf") : "")  + 
					"&ID_MEDICO=" + optSel.val()  + 
					"&DESCR_MEDICO=" + optSel.text() ); 
		}
		
};



var SCHEDULER_LOADING = {

		db: null,

		setEvents: function () {
			$(document).ajaxStart(function (e) {
				//SCHEDULER.logger.debug("ajaxStart");
				home.NS_LOADING.showLoading({
					timeout: 0,
					loadingclick: function () {
						if (xhr && xhr.readyState != 4) {
							xhr.abort();
						}

						SCHEDULER.logger.warn("click su schermata nera per loading scheduler");

						NOTIFICA.warning(
								{
									message: traduzione.warnAbortLoading,
									title: "Warning!",
									timeout: 5,
									width: 300
								});
					}
				});
			});

			$(document).ajaxStop(function () {
				//SCHEDULER.logger.debug("ajaxStop");
				home.NS_LOADING.hideLoading();
			});
		},

		loadFromDb: function( param )
		{
			if (!SCHEDULER_LOADING.db)
				SCHEDULER_LOADING.db = $.NS_DB.getTool({_logger: SCHEDULER.logger});

			SCHEDULER_LOADING.db.select( param )
				.done( function(resp) {
					scheduler.clearAll();
					scheduler.parse(resp.result[0]["EVENTI"],"xml");
			});
		},
		
		dayLoading: function (data)
		{
			SCHEDULER_LOADING.loadFromDb({
				id: "AGENDA.LOAD_EVENTS_BY_MEDICO",
				parameter: {
					iden_med : { v : SCHEDULER.idMedicoSelected , t : 'N'},
					data_ini : { v : moment(data).format('YYYYMMDD'), t : 'V'},
					data_fine : { v : moment(data).add(1,'d').format('YYYYMMDD'), t : 'V'},
					type_result : 'C'
				}	
			});
		},

		weekLoading: function (data) {
			
			SCHEDULER_LOADING.loadFromDb({
				id: "AGENDA.LOAD_EVENTS_BY_MEDICO",
				parameter: {
					iden_med : { v : SCHEDULER.idMedicoSelected , t : 'N'},
					data_ini : { v : moment(data).day(1).format('YYYYMMDD'), t : 'V'},
					data_fine : { v : moment(data).day(8).format('YYYYMMDD'), t : 'V'},
					type_result : 'C'
				}	
			});
		},
		
		monthLoading: function (data) {
			
			SCHEDULER_LOADING.loadFromDb({
				id: "AGENDA.LOAD_EVENTS_BY_MEDICO",
				parameter: {
					iden_med : { v : SCHEDULER.idMedicoSelected , t : 'N'},
					data_ini : { v : moment(data).startOf('month').format('YYYYMMDD'), t : 'V'},
					data_fine : { v : moment(data).endOf('month').add(1,'d').format('YYYYMMDD'), t : 'V'},
					type_result : 'C'
				}	
			});
		},

		unitLoading: function (data) {

			SCHEDULER_LOADING.loadFromDb({
				id: "AGENDA.LOAD_EVENTS_BY_GRUPPO",
				parameter: {
					id_medici : { v : SCHEDULER.idMedici , t : 'V'},
					data_ini : { v : moment(data).format('YYYYMMDD'), t : 'V'},
					data_fine : { v : moment(data).add(1,'d').format('YYYYMMDD'), t : 'V'},
					type_result : 'C'
				}	
			});
		},
		
		loadOrariMedici: function() {
			
			if (!SCHEDULER_LOADING.db)
				SCHEDULER_LOADING.db = $.NS_DB.getTool({_logger: SCHEDULER.logger});

			SCHEDULER_LOADING.db.select( {
				id: "AGENDA.LOAD_ORARI",
				parameter: {
					id_medici : { v : SCHEDULER.idMedici , t : 'V'}
				}	
			})
			.done( function(resp) {
					for (var i = 0; i < resp.result.length ; i++) {
						SCHEDULER.orariMedici[resp.result[i].IDEN_MEDICO] = eval(resp.result[i].ORARI);
						$("#cmbMedico option[value="+resp.result[i].IDEN_MEDICO+"]").attr("iden_conf", resp.result[i].IDEN);
					}
					
					NS_FENIX_SCHEDULER.aggiorna();
			});
		}
};