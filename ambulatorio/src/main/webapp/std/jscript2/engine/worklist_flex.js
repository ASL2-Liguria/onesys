(function(jQuery)
{
	var flex                 = null; 
	var _call_js_after_load = new Array();
	
	jQuery.fn.extend(
	{
		getAbsolutePathServer: function()
		{
		    var loc = window.location;
		    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
		    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
		},
		
		disableSelection : function()
		{ 
				return this.each(function()
				{
						this.onselectstart = function(){return false;};
						this.unselectable = "on"; 
						jQuery(this).css('user-select', 'none'); 
						jQuery(this).css('-o-user-select', 'none'); 
						jQuery(this).css('-moz-user-select', 'none'); 
						jQuery(this).css('-khtml-user-select', 'none'); 
						jQuery(this).css('-webkit-user-select', 'none'); 
				}); 
		},
		
		getHeightWindow: function()
		{
			var retHeight = 0;
			
			if(typeof(window.innerWidth) == 'number' )
				retHeight = window.innerHeight;
			else
				if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
					retHeight = document.documentElement.clientHeight;
				else
					if(document.body && (document.body.clientWidth || document.body.clientHeight))
						retHeight = document.body.clientHeight;
			
			return retHeight;
		},
		
		getWidthWindow: function()
		{
			var retWidth = 0;
			
			if(typeof(window.innerWidth) == 'number')
				retWidth = window.innerWidth;
			else
				if( document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
					retWidth = document.documentElement.clientWidth;
				else if(document.body && (document.body.clientWidth || document.body.clientHeight))
					retWidth = document.body.clientWidth;
			
			return retWidth;
		},
		
		getXMLHttp: function()
		{
			if (jQuery.browser.msie && jQuery.browser.version.substr(0,1) <= 7)
				return new ActiveXObject("Microsoft.XMLHTTP");
			else
				return new XMLHttpRequest();
		}
	}); 
	
	jQuery.createWorklist = function(table, parametri)
	{
		/*var flex       = null;*/
		var thead      = null;
		var tfoot      = null;
		var colgroup   = null;
		var model_coll = null;
		var col        = null;
		var tr         = null;
		var th         = null;
		var obj        = null;
		var div_temp   = null;
		var idx        = null;
		var value_tmp  = null;
		var table_fix  = null;
		var table_foot = null;
		var obj_temp   = null;
		
		// Controllo parametri
		parametri = jQuery.extend({method: 'POST',
							  dataType: 'json',
							  width: 'auto', 
						  	  height:'auto'}, 
						  	  parametri);
		
		// Pulisco la tabella...
		jQuery(table).attr({cellPadding: 0, cellSpacing: 0, border: 0}).removeAttr('width');

		// Oggetto griglia della worklist
		flex = 
		{
			// Flag per capire se sta caricando o no i record...
			loading: false,
			
			// Aggiungo i div per contenere la tabella, ridimensionamento e altro...
			divContainer:   document.createElement('div'), // Div che contiene tutto
			divLoading:     document.createElement('div'), // Div del loading
			divColumnDrag:  document.createElement('div'), // Div per il ridimensionamento
			divHeaderFixed: document.createElement('div'), // Div per l'head fisso
			divTableScroll: document.createElement('div'), // Div per la tabella scrollabile
			divFootFixed:   document.createElement('div'), // Div per il foot della tabella (paginazione...)
			
			// Gestione dei parametri, in più c'è la gestione dell'ordinamento...
			manageParam:
			{
				_param: new Array(),
				
				append: function(nome, valore)
				{
					flex.manageParam._param.splice(nome, 1);
					flex.manageParam._param[nome] = valore;
				},
				
				getParam: function()
				{
					var chiave;
					var ret    = new Array();
					
					for(chiave in flex.manageParam._param)
					{
						ret.push({name: chiave, value: flex.manageParam._param[chiave]});
					}
					
					if(parametri.params)
					{
						// Metto in "join" i parametri...
						for(chiave = 0; chiave < parametri.params.length; chiave++)
						{
							if(typeof flex.manageParam._param[parametri.params[chiave].name] == 'undefined')
							{
								ret.push({name: parametri.params[chiave].name, value: parametri.params[chiave].value});
							}
						}
					}
					
					return ret;
				}
			},
			
			// Gestione di paginazione
			page:
			{
				current_page: -1,
				page_rows: -1,
				total: -1,
				
				setCurretPage: function(valore)
				{
					flex.page.current_page = valore;

					flex.manageParam.append("N_PAGINA", valore);
					
					flex.page.refreshInfo();
				},
				
				setPageRow: function(valore)
				{
					flex.page.page_rows = valore;
					flex.manageParam.append("N_REC_PAGINA", valore);
				},
				
				setTotal: function(valore)
				{
					flex.page.total = valore;
					flex.manageParam.append("N_TOTALE_RECORD", valore);
					flex.page.refreshInfo();
				},
				
				movePage: function(valore)
				{
					flex.page.setCurretPage(parseInt(flex.page.current_page, 10) + parseInt(valore, 10));
					flex.page.refreshInfo();
					flex.loadData();
				},
				
				refreshInfo: function()
				{
					jQuery('th.clsPageInfo', flex.divFootFixed).text(flex.page.current_page + ' / ' +flex.page.total);
					
					if(flex.page.current_page == 1)
						jQuery('div.clsFooterFixed th.clsPreview', flex.divContainer).css({visibility:'hidden'});
					else
						jQuery('div.clsFooterFixed th.clsPreview', flex.divContainer).css({visibility:'visible'});
					
					if(flex.page.current_page == flex.page.total || flex.page.total == -1)
						jQuery('div.clsFooterFixed th.clsNext', flex.divContainer).css({visibility:'hidden'});
					else
						jQuery('div.clsFooterFixed th.clsNext', flex.divContainer).css({visibility:'visible'});
				}
			},
			
			waitLoading: function(attivo)
			{
				if(attivo)
					jQuery(flex.divLoading).show();
				else
					jQuery(flex.divLoading).hide();
				
				return attivo;
			},
			
			// Lo utilizzo per capire se sto ridimensionando la colonna o spostarla
			configDrag: 
			{
				tipo: '', 
				obj: null, 
				leftStart: null, 
				leftLast: null, 
				colDest: null, 
				timeStart: null, 
				timeLast: null,
				init: function()
				{
					flex.configDrag.tipo      = null;
					flex.configDrag.obj       = null;
					flex.configDrag.leftStart = null;
					flex.configDrag.leftLast  = null;
					flex.configDrag.colDest   = null;
					flex.configDrag.timeStart = null;
					flex.configDrag.timeLast  = null;
				}
			},
			
			loadData: function()
			{
				var param = null;
				
				if(parametri.url && !flex.loading)
				{
					flex.loading = true;
					flex.waitLoading(true);
					
					// Eh eh eh.... questo è un bel numero!
					if(parametri.usepager)
					{
						var n_rec_value = jQuery().getHeightWindow() - jQuery(flex.divContainer).offset().top - 50; // 25 header, 25 footer
						
						flex.page.setPageRow(Math.floor(n_rec_value / 25) - 1);
					}
					
					param = flex.manageParam.getParam()
					// ****************************************************
					// modifica aldo 28/7/15
					try{
						// controllo solo il caso di precedenti !!!
						var strWhereWk = "";
						if ((param[4].name =="TIPO_WK")&&(param[4].value =="WK_AMB_PRECEDENTI")){
							var errorWkLogFile = new parent.parent.leftConsolle.ElcoJsLogFileObject();		
							if (param[5].name =="WHERE_WK"){
								strWhereWk = param[5].value;
							}
							if (strWhereWk=="" || strWhereWk=="undefined" || typeof(strWhereWk) == "undefined"){
								strWhereWk = " WHERE IDEN_ANAG =" + parent.parent.leftConsolle.globalIdenAnag +" AND ((IDEN <> "+ parent.parent.leftConsolle.getValue("oEsa_Ref")+ ") OR iden is null) AND (SPLIT_CONTAINS(REPARTO,'"+parent.parent.leftConsolle.baseUser.LISTAREPARTI+"')=1)";
								errorWkLogFile.setSaveDateTimeEachRow(true);
								errorWkLogFile.appendToFileWithFileLimit(errorWkLogFile.getUserTempFolder() +"\\errorBuildWk.log", JSON.stringify(param)+"\nSetto: " + strWhereWk, 2097152);
								// rimpappo al volo
								param[5].value = strWhereWk;
							}
						}
					}
					catch(e){
						strWhereWk = " where IDEN = -1 ";
						try{errorWkLogFile.appendToFileWithFileLimit(errorWkLogFile.getUserTempFolder() +"\\errorBuildWk.log", JSON.stringify(param)+"\nEccezione: " + e.description +"\nSetto: " + strWhereWk, 2097152);}catch(e){;}
						// rimpappo al volo
						param[5].value = strWhereWk;						
					}
					// ****************************************************					
					jQuery.ajax(
					{
						type: parametri.method,
						url: jQuery().getAbsolutePathServer() + 'worklistLoad?TIPO_WK=' + parametri.tipo_wk,//parametri.url,
						data: param,
						dataType: parametri.dataType,
						contentType: "application/x-www-form-urlencoded;charset=UTF-8",
						success: function(data){flex.addData(data);},
						error: function(XMLHttpRequest, textStatus, errorThrown){alert('createWorklist - Error: ' + textStatus + '\nMessage:' + errorThrown);}
					});
				}
			},
			
			// Popola e aggiunge una riga al tbody della griglia
			addData: function(dati)
			{
				var tbody = null;
				
				flex.page.setCurretPage(dati.current_page);
				flex.page.setPageRow(dati.page_rows);
				flex.page.setTotal(dati.total);
				
				jQuery(table).find('tbody').each(function(){jQuery(this).remove();})
				
				tbody = document.createElement("tbody");
				
				jQuery(tbody).attr('width', '100%');
				jQuery(table).append(tbody);

				if(dati)
				{
					flex.attachArrayHead(dati.array_js);
					
					jQuery.each(dati.rows, function(i, row)
					{
						var cells = row.cell;
						var tr   = document.createElement('tr');
						var td   = null;
						
						if(row.id)
							jQuery(tr).attr('id', row.id);
						
						if(parametri.alternate_color && (i%2) == 0)
							jQuery(tr).addClass('clsOdd');
						
						/*jQuery(tr).hover(function()
						{
							jQuery(this).addClass('clsOver');
						},
						function()
						{
							jQuery(this).removeClass('clsOver');
						});
						*/
						for(idx = 0; idx < cells.length; idx++)
						{
							value_tmp = '';
							td        = document.createElement('td');
							
							if(cells[idx] != null)
							{
								if(cells[idx].link != '' && cells[idx].link != 'undefined' && cells[idx].link != null && typeof cells[idx].link != 'undefined')
									value_tmp = "<div><a onclick='" + cells[idx].link + "'>" + cells[idx].value + "</a></div>";
								else
									if(cells[idx].value != '')
										value_tmp = "<div>" + cells[idx].value + "</div>";
							}
							
							jQuery(td).html(value_tmp == '' ? '&nbsp;':value_tmp);
							
							jQuery(tr).append(td);
						}
						
						jQuery(tbody).append(tr);
					});
				}
				
				// Reimposto l'altezza!
				flex.adjustHeight();
				flex.adjustPositionResize();
				flex.setEvent();
				
				flex.loading = false;
				flex.waitLoading(false);
				
				// Sarà richiama solo una volta...
				for(idx = 0; _call_js_after_load != null && idx < _call_js_after_load.length; idx++)
				{
					eval(_call_js_after_load[idx]);
				}
				_call_js_after_load = null;
			},
			
			// Funzione che serve per salvare gli array nell'head!
			attachArrayHead: function(valore)
			{
				var script = document.createElement('script');
				
				jQuery('script#' + parametri.title, document).each(function()
				{
					jQuery(this).remove();
				});
				
				jQuery(script).attr('id', parametri.title);
				script.text = valore;
				
				document.getElementsByTagName('head')[0].appendChild(script);
			},
			
			// Sperimentale
			setEvent: function()
			{
				jQuery(window).resize(function()
				{
					if(parametri.usepager) {
						jQuery(flex.divTableScroll).height(jQuery().getHeightWindow() - jQuery(flex.divContainer).offset().top - jQuery(flex.divHeaderFixed).height() - jQuery(flex.divFootFixed).height());
					} else {
						jQuery(flex.divTableScroll).height(jQuery().getHeightWindow() - jQuery(flex.divContainer).offset().top - jQuery(flex.divHeaderFixed).height());
					}
					flex.adjustHeight();
				});
				
				jQuery.each(parametri.event_row, function(idx, value)
				{
					var ev = value.evento;
					
					if(ev.substr(0,2) == 'on')
						ev = ev.substr(2, ev.length);
					
					jQuery('tr', table).bind(ev, function(eve)
					{
						eval(value.azione);
					});
				});
				
//				jQuery(table).delegate("td[title='']", "hover", function()
				 // modifica aldo 8/10/2014
 				jQuery(table).delegate("td", "hover", function()
				{ 
					if (jQuery(this).attr('title')=="" || typeof(jQuery(this).attr('title'))=="undefined"){
						if ((parametri.colModel[jQuery(this).index()].display=="")||((parametri.colModel[jQuery(this).index()].display=="&nbsp;"))){
							jQuery(this).attr('title', '');						
						}
						else{
							jQuery(this).attr('title', parametri.colModel[jQuery(this).index()].display + ': ' + jQuery(this).first().text());
						}
					}
				});
				/*
				jQuery('tbody tr', table).hover(function()
				{
					jQuery(this).addClass('clsOver');
				},
				function()
				{
					jQuery(this).removeClass('clsOver');
				});*/
			},
			
			// Serve per impostare l'altezza dei div per resize
			adjustHeight: function()
			{
				if(parametri.usepager) {
					jQuery(flex.divTableScroll).height(jQuery().getHeightWindow() - jQuery(flex.divContainer).offset().top - jQuery(flex.divHeaderFixed).height() - jQuery(flex.divFootFixed).height());
				} else {
					jQuery(flex.divTableScroll).height(jQuery().getHeightWindow() - jQuery(flex.divContainer).offset().top - jQuery(flex.divHeaderFixed).height() - 25);
				}
				jQuery(flex.divLoading).height(jQuery().getHeightWindow() - jQuery(flex.divContainer).offset().top);
				jQuery(flex.divColumnDrag).find('div').height(jQuery(flex.divHeaderFixed).height());
				
				if(jQuery('table.classTabHeader').last().find('div.pulsante').size() > 0)
				{
					jQuery(flex.divTableScroll).height(jQuery(flex.divTableScroll).height() - 27);//jQuery(flex.divContainer).height() - 50);
				}
			},
			
			// Riposizione tutti i div del resize
			adjustPositionResize: function()
			{
				var val_temp = 0;
				
				jQuery('colgroup', table).each(function()
				{
					if(jQuery('col', this).size() == 0)
						jQuery(this).remove();
					else
						jQuery(this).attr('width', '100%');
				});
				
				for(var idx = 1; idx < jQuery('colgroup col', table).size(); idx++)
				{
					val_temp += parseInt(jQuery('colgroup col', table).eq(idx - 1).attr('width').replace(/px/,''), 10);//parseInt(jQuery('colgroup col', table).eq(idx - 1).width(), 10);
					
					jQuery('div#' + (idx - 1), flex.divColumnDrag).css({'left': val_temp - 3});
				};
			},
			
			// Funzioni di salvataggio \m/
			saveDimCol: function(idx, value)
			{
				dwr.engine.setAsync(false);
				toolKitDB.executeQueryWeb("begin UTILITY_WORKLIST.SAVE_COL_DIMENSIONI('" + parametri.title + "', '" + parametri.colModel[idx].name + "', '" + baseUser.LOGIN + "', '" + value + "'); end;", function(risp){});
				dwr.engine.setAsync(true);
			},
			
			savePosCol: function(value)
			{
				dwr.engine.setAsync(false);
				toolKitDB.executeQueryWeb("begin UTILITY_WORKLIST.SAVE_COL_POSIZIONI('" + parametri.title + "', '" + baseUser.LOGIN + "', '" + value + "'); end;", function(risp){});
				dwr.engine.setAsync(true);
			},
			
			saveOrderCol: function(value)
			{
				dwr.engine.setAsync(false);
				toolKitDB.executeQueryWeb("begin UTILITY_WORKLIST.SAVE_COL_ORDER('" + parametri.title + "', '" + baseUser.LOGIN + "', '" + value + "'); end;", function(risp){});
				dwr.engine.setAsync(true);
			},
			
			// Funzione che serve per scambiare le colonne
			moveColumn: function(idx_1, idx_2)
			{
				var idx;
				var col    = null;
				var th     = null;
				var ordine = null;
				var model  = null;
				
				if(idx_1 != idx_2 && (idx_2 - idx_1) != 1)
				{
					flex.waitLoading(true);
					
					// Scambio i colmodel!!!
					model = parametri.colModel[idx_1];
					if(idx_1 > idx_2)
					{
						parametri.colModel.splice(idx_1, 1);
						parametri.colModel.splice(idx_2, 0, model);
					}
					else
					{
						parametri.colModel.splice(idx_2, 0, model);
						parametri.colModel.splice(idx_1, 1);
					}
					
					col     = jQuery('colgroup col:eq(' + idx_1 + ')', table);
					col_fix = jQuery('colgroup col:eq(' + idx_1 + ')', flex.divHeaderFixed);
					th      = jQuery('thead th:eq(' + idx_1 + ')', flex.divHeaderFixed);
					
					if(jQuery('colgroup col:eq(' + (idx_1) + ')', table).attr('width') == '')
					{
						// Imposto larghezza di default...
						jQuery(col).attr('width', '80');
						jQuery(col_fix).attr('width', '80');
					}
					
					jQuery('thead th:eq(' + idx_2 + ')', flex.divHeaderFixed).before(th);
					
					jQuery('colgroup col:eq(' + idx_2 + ')', table).before(col);
					jQuery('colgroup col:eq(' + idx_2 + ')', flex.divHeaderFixed).before(col_fix);
					
					for(idx = 0; idx <= jQuery('tbody tr', table).size(); idx++)
					{
						jQuery('tr:eq(' + idx + ') td:eq(' + idx_2 + ')', table).before(jQuery('tr:eq(' + idx + ') td:eq(' + idx_1 + ')', table));
					}
					
					jQuery('colgroup col', table).last().removeAttr('width');
					jQuery('table colgroup col', flex.divHeaderFixed).last().removeAttr('width');
					
					for(idx = 0, ordine = ''; idx < parametri.colModel.length; ordine+=((idx > 0 ? ',':'') + parametri.colModel[idx++].name));
					
					flex.savePosCol(ordine);
					
					flex.adjustPositionResize();
					
					flex.waitLoading(false);
				}
			},
			
			// Funzione di inizio evento per il resize o sposta
			dragStart: function(tipo, ev, obj)
			{
				var tmp = null;
				
				if(tipo == 'move')
				{
					tmp = document.createElement('div');
					
					jQuery(tmp).html(jQuery(obj).html());
					jQuery(tmp).css({'width':jQuery(obj).width(), 'height':jQuery(obj).height(), 'top':'30px', 'left':ev.pageX - Math.round(jQuery(obj).width()/2)});
					jQuery(tmp).attr('idx', jQuery(obj).index());//.fadeTo(0, 0.8);
					jQuery(tmp).hide();
					
					obj = tmp;
					
					jQuery('div.clsWorklist div.clsWorklistResize').append(obj); // 
					
					jQuery('div.clsWorklist table tr th').hover(function()
					{
						if(jQuery(flex.configDrag.obj).css('display') != 'none')
						{
							jQuery('div.clsWorklist table tr th.clsOverMove').removeClass('clsOverMove');
							jQuery(this).addClass('clsOverMove');
							flex.configDrag.colDest = this;
						}
					});
				}
				
				jQuery(obj).addClass('cls_' + tipo);
				flex.configDrag.colDest   = ev.currentTarget;
				flex.configDrag.tipo      = tipo;
				flex.configDrag.obj       = obj;
				flex.configDrag.leftStart = flex.configDrag.leftLast = parseInt(jQuery(obj).css('left').replace(/px/, ''), 10);
				flex.configDrag.timeStart = (new Date()).getTime();
			},
			
			dragMove: function(ev)
			{
				var pos_x = 0;
				
				if(flex.configDrag.obj != null)
				{
					pos_x = ev.pageX;
					
					if(flex.configDrag.tipo == 'move')
					{
						jQuery('div.clsWorklist table tr th.clsOverMove').hover();
						
						if(Math.abs(flex.configDrag.leftStart - ev.pageX) >= 10)
						{
							jQuery(flex.configDrag.obj).show();
							
							if(ev.pageX >= Math.round(jQuery(flex.configDrag.obj).width()/2))
								pos_x -= Math.round(jQuery(flex.configDrag.obj).width()/2);
							else
								pos_x -= Math.round(jQuery(flex.configDrag.obj).width()/2) + (pos_x - Math.round(jQuery(flex.configDrag.obj).width()/2));
						}
					}
					else
						pos_x -= 3;
					
					jQuery(flex.configDrag.obj).css('left', pos_x);
				}
				
				flex.configDrag.leftLast = ev.pageX;
			},
			
			dragEnd: function(ev)
			{
				var id      = '';
				var col    = null;
				var larg   = 0;
				var change = false;
				var order  = '';
				
				if(flex.configDrag.obj != null)
				{
					flex.configDrag.timeLast = (new Date()).getTime();
					
					if(flex.configDrag.tipo == 'resize')
					{
						id      = jQuery(flex.configDrag.obj).attr('id');
						col     = jQuery('colgroup col:eq(' + id + ')', table);
						col_fix = jQuery('table colgroup col:eq(' + id + ')', flex.divHeaderFixed);
						larg    = parseInt(jQuery(col).attr('width').replace(/px/, ''), 10) + parseInt(jQuery(flex.configDrag.obj).css('left').replace(/px/, ''), 10) - flex.configDrag.leftStart;
						
						if(larg <= 10)
						{
							larg = parseInt(jQuery(col).attr('width').replace(/px/, ''), 10)
							
							jQuery(flex.configDrag.obj).css({'left':flex.configDrag.leftStart});
						}
						else
							change = true;
						
						jQuery(col).attr('width', larg + 'px');
						jQuery(col_fix).attr('width',larg + 'px');
						jQuery(flex.configDrag.obj).removeClass('cls_resize');
						
						if(change)
						{
							flex.saveDimCol(id, larg);
							
							jQuery('div.clsWorklist div.clsWorklistResize div:gt(' + id + ')').each(function()
							{
								jQuery(this).css({'left':(parseInt(jQuery(this).css('left').replace(/px/, ''), 10) + parseInt(jQuery(flex.configDrag.obj).css('left').replace(/px/, ''), 10) - flex.configDrag.leftStart) + 'px'});
							});
						}
					}
					else
					{
						if(flex.configDrag.tipo == 'move')
						{
							jQuery('div.clsWorklist table tr th.clsOverMove').removeClass('clsOverMove');
							
							if(Math.abs(flex.configDrag.timeLast - flex.configDrag.timeStart) > 800)
							{
								flex.moveColumn(jQuery(flex.configDrag.obj).attr('idx'), jQuery(flex.configDrag.colDest).index());
							}
							
							jQuery(flex.configDrag.obj).remove();
						}
						jQuery('div.clsWorklist table tr th').unbind('mouseenter').unbind('mouseleave');
					}
					
					flex.configDrag.init();
				}
			},
			
			// Funzione che serve per ricaricare l'ordinamento in base all'header
			rebuildOrderFlex: function()
			{
				var ordRet = '';
				
				jQuery('div.clsWorklist table tr th[class^="clsOrder"]').each(function()
				{
					if(ordRet != '')
						ordRet +=', ';
					
					ordRet += parametri.colModel[jQuery(this).index()].name + ' ' + jQuery(this).attr('class').split('_')[1];
				})
				
				flex.manageParam.append('ORDINAMENTO', ordRet);
				
				return ordRet;
			}
		};
		// Fine oggetto griglia
		
		// Caricamento dei parametri "request"
		jQuery.each(parametri.params, function(idx, value)
		{
			flex.manageParam.append(name, value);
		});
		
		// Configuro il div di attesa...
		jQuery(flex.divLoading).addClass('clsWaitLoading').html('&nbsp;').fadeTo(0, 0.8);//.hide();
		jQuery(flex.divContainer).append(jQuery(flex.divLoading));
		
		// Creo head della worklist e il colgroup per il ridimensionamento!
		model_coll = parametri.colModel;
		if(model_coll)
		{
			colgroup  = document.createElement('colgroup');
			thead     = document.createElement('thead');
			tr        = document.createElement('tr');
			
			for(idx = 0, value_tmp = 0; idx < model_coll.length; value_tmp += model_coll[idx++].width)
			{
				obj      = model_coll[idx];
				th       = document.createElement('th');
				col      = document.createElement('col');
				
				if(obj.link != '' && obj.link != null && obj.link != 'undefined' && typeof obj.link != 'undefined')
				{
					obj_temp = document.createElement('a');
					
					jQuery(obj_temp).html(obj.display);
					jQuery(obj_temp).attr('href', '#');
					jQuery(obj_temp).attr('lancia', obj.link.replace(/javascript:/, '').replace(/return false;/,''));
					
					jQuery(obj_temp).click(function(ev)
					{
						ev.stopPropagation();
						eval(jQuery(this).attr('lancia'));
					});
					
					jQuery(th).html(obj_temp);
					
					obj_temp = null;
				}
				else
					jQuery(th).html(obj.display);
				
				// Da completare: ordinamento...
				
				if(obj.width && idx < (model_coll.length - 1))
					jQuery(col).attr('width', obj.width + 'px');
				
				jQuery(tr).append(th);
				jQuery(colgroup).append(col);
				
				if(obj.sort_this != '')
					jQuery(th).addClass('clsOrder_' + obj.sort_this);
				
				//Setto la posizione del div e lo appendo!!!;
				if(idx > 0)
				{
					div_temp = document.createElement('div');
					
					jQuery(div_temp).attr('id', idx - 1);
					jQuery(flex.divColumnDrag).append(jQuery(div_temp));//.css({'left': value_tmp - 1 + 'px'}));
				}
			}
			
			jQuery(thead).append(tr);
			jQuery(table).prepend(colgroup);
			
			// Creo la tabella per rendere fisso l'head
			table_fix = jQuery(document.createElement('table')).attr({cellPadding: 0, cellSpacing: 0, border: 0}).removeAttr('width').prepend(thead).prepend(jQuery(colgroup).clone(true)).append(document.createElement("tbody"));
			
			jQuery(table).css({'width': '100%'});
			jQuery(table_fix).css({'width': '100%'});
		}
				
		table.flex = flex;
		
		// Setto le classi e gli id ai div...
		jQuery(flex.divContainer).addClass('clsWorklist');
		jQuery(flex.divColumnDrag).addClass('clsWorklistResize');
		jQuery(flex.divHeaderFixed).addClass('clsHeaderFixed');
		jQuery(flex.divTableScroll).addClass('clsTableScroll');
		
		// Appendo gli oggetti ai div
		jQuery(flex.divContainer).append(flex.divColumnDrag);
		
		jQuery(table_fix).before(flex.divHeaderFixed);
		jQuery(flex.divHeaderFixed).append(table_fix);
		jQuery(flex.divContainer).append(flex.divHeaderFixed);
		
		jQuery(table).before(flex.divContainer);
		jQuery(flex.divContainer).append(table);
		jQuery(flex.divTableScroll).append(table);
		jQuery(flex.divContainer).append(flex.divTableScroll);
		
		// Controllo se bisogna utilizzare l'inpaginazione...
		if(parametri.usepager)
		{
			table_foot = document.createElement('table');
			colgroup   = document.createElement('colgroup');
			col        = document.createElement('col');
			tfoot      = document.createElement('tfoot');
			tr         = document.createElement('tr');
			th         = document.createElement('th');
			
			jQuery(table_foot).attr({cellPadding: 0, cellSpacing: 0, border: 0}).removeAttr('width');
			
			// Il primo deve occupare tutto lo spazio
			jQuery(colgroup).append(document.createElement('col'));
			jQuery(tr).append(document.createElement('th'));
			
			jQuery(col).attr('width', '20');
			jQuery(colgroup).append(col);
			
			jQuery(th).click(function(){flex.page.movePage(-1)});
			jQuery(th).html('&nbsp;');
			jQuery(th).css({visibility:'hidden'})
			jQuery(th).addClass('clsButton');
			jQuery(th).addClass('clsPreview'); // lo nascondo visto che è la prima pagina...
			
			jQuery(tr).append(th);
			
			col = document.createElement('col');
			th  = document.createElement('th');
			
			jQuery(col).attr('width', '50');
			jQuery(colgroup).append(col);
			
			jQuery(th).addClass('clsPageInfo');
			jQuery(tr).append(th);
			
			col = document.createElement('col');
			th  = document.createElement('th');
			
			jQuery(col).attr('width', '20');
			jQuery(colgroup).append(col);
			
			jQuery(th).click(function(){flex.page.movePage(1)});
			
			jQuery(th).html('&nbsp;');
			jQuery(th).css({visibility:'hidden'})
			jQuery(th).addClass('clsButton');
			jQuery(th).addClass('clsNext');
			jQuery(tr).append(th);
			
			jQuery(tfoot).append(tr);
			
			jQuery(table_foot).append(colgroup);
			jQuery(table_foot).append(tfoot);
			jQuery(table_foot).addClass('clsTableFoot');
			
			jQuery(flex.divFootFixed).append(table_foot);
			jQuery(flex.divFootFixed).addClass('clsFooterFixed');
			jQuery(flex.divContainer).append(flex.divFootFixed);
			
			jQuery('.clsButton', table_foot).hover(function(){jQuery(this).addClass('clsButtonOver')}, function(){jQuery(this).removeClass('clsButtonOver')});
		}
		
		flex.adjustHeight();
		
		// Da completare: resize, buttons, ordinamenti e altre cose...
		// Setto gli eventi per il resize!
		jQuery('div.clsWorklist div.clsWorklistResize div').mousedown(function(ev)
		{
			flex.dragStart('resize', ev, this);
		});
		
		// Setto gli eventi per lo spostamento delle colonne...
		jQuery('div.clsWorklist div.clsHeaderFixed table thead tr th').mousedown(function(ev)
		{
			flex.dragStart('move', ev, this);
		});
		
		jQuery(document).mousemove(function(ev)//'div.clsWorklist'
		{
			flex.dragMove(ev);
		});
		
		jQuery(document).mouseup(function(ev) //'div.clsWorklist'
		{
			flex.dragEnd(ev);
		})
		.hover(function(ev)
		{
		},
		function(ev)
		{
			if(ev.pageX < 0 || ev.pageY < 0) flex.dragEnd(ev);
		});
		
		// L'evento per l'order by...
		jQuery('div.clsWorklist div.clsHeaderFixed table thead tr th').click(function(ev)
		{
			var order = '';
			
			if(jQuery(this).html() != '&nbsp;' && jQuery(this).html() != '&nbsp;')
			{
				if(!flex.loading)
				{
					if(!ev.ctrlKey)
						jQuery('div.clsWorklist table tr th:lt(' + jQuery(this).index() + '), div.clsWorklist table tr th:gt(' + jQuery(this).index() + ')').removeClass('clsOrder_asc').removeClass('clsOrder_desc');
					
					if(jQuery(this).hasClass(''))
						jQuery(this).addClass('clsOrder_asc');
					else
						if(jQuery(this).hasClass('clsOrder_asc'))
							jQuery(this).removeClass('clsOrder_asc').addClass('clsOrder_desc');
						else
							if(jQuery(this).hasClass('clsOrder_desc'))
								jQuery(this).removeClass('clsOrder_desc');
					
					order = flex.rebuildOrderFlex();
					
					if(order == '')
						order = parametri.colModel[jQuery(this).index()].name + ',';
					// modifica aldo 1/8/14
					try{
						if (order.substring(0,9)=="EXTRA_COL"){
							return;
						}
					}catch(e){
						//alert(e.description);
					}
					// *******************************
					flex.saveOrderCol(order);
					
					flex.loadData();
				}
			}
		});
		
		// Disabilito la selezione all'interno del div...
		jQuery(flex.divHeaderFixed).disableSelection();
		
		// da verificare!!!
		jQuery('body').css({'overflow-y':'hidden'});
		jQuery('body').css({'overflow-x':'auto'});
		
		// E' assurdo, ma per ie è l'unica salvezza!!!
		//window.XMLHttpRequest = undefined;
		// Una volta completata la costruzione, passo al caricamento dei dati!
		flex.rebuildOrderFlex();
		flex.loadData();
		return table;
	};
	
	jQuery.fn.callJSAfterInitWorklist = function(js)
	{
		_call_js_after_load.push(js);
	}
	
	jQuery.fn.refreshWorklist = function(where)
	{
		if(where == '')
			where = 'rownum <= 200'; // Sicurezza!!!
		
		flex.manageParam.append('WHERE_WK', where);
		flex.loadData();
	}
	
	jQuery.fn.worklist = function(param)
	{
		jQuery.createWorklist(this, param);
	};
})(jQuery);

jQuery(document).ready(function()
{
	jQuery('table script', this).each(function()
	{
		jQuery('div#idLayerWorklist').css({"margin-top":25});
		//jQuery('table.classTabHeader').last().hide();
		var script = jQuery(this).html();
		script = script.replace("/*", "").replace("*/", "");
		eval(script);
	});
});
