(function($)
{
	var flex                = null;
	var _call_js_after_load = new Array();
	
	$.fn.extend(
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
						$(this).css('user-select', 'none'); 
						$(this).css('-o-user-select', 'none'); 
						$(this).css('-moz-user-select', 'none'); 
						$(this).css('-khtml-user-select', 'none'); 
						$(this).css('-webkit-user-select', 'none'); 
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
			if ($.browser.msie && $.browser.version.substr(0,1) <= 7)
				return new ActiveXObject("Microsoft.XMLHTTP");
			else
				return new XMLHttpRequest();
		}
	}); 
	
	$.createWorklist = function(table, parametri)
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
		parametri = $.extend({method: 'POST',
							  dataType: 'json',
							  width: 'auto', 
						  	  height:'auto'}, 
						  	  parametri);
		
		// Pulisco la tabella...
		$(table).attr({cellPadding: 0, cellSpacing: 0, border: 0}).removeAttr('width');
		
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
					
					if(flex.page.current_page == 1)
						$('div.clsFooterFixed th.clsPreview', flex.divContainer).css({visibility:'hidden'});
					else
						$('div.clsFooterFixed th.clsPreview', flex.divContainer).css({visibility:'visible'});
					
					if(flex.page.current_page == flex.page.total)
						$('div.clsFooterFixed th.clsNext', flex.divContainer).css({visibility:'hidden'});
					else
						$('div.clsFooterFixed th.clsNext', flex.divContainer).css({visibility:'visible'});
					
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
					$('th.clsPageInfo', flex.divFootFixed).text(flex.page.current_page + ' / ' +flex.page.total);
				}
			},
			
			waitLoading: function(attivo)
			{
				if(attivo)
					$(flex.divLoading).show();
				else
					$(flex.divLoading).hide();
				
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
						var n_rec_value = $().getHeightWindow() - $(flex.divContainer).offset().top - 50; // 25 header, 25 footer
						
						flex.page.setPageRow(Math.floor(n_rec_value / 25) - 1);
					}
					
					param = flex.manageParam.getParam();
					
					$.ajax(
					{
						type: parametri.method,
						url: $().getAbsolutePathServer() + 'worklistLoad?TIPO_WK=' + parametri.tipo_wk,//parametri.url,
						data: param,
						dataType: parametri.dataType,
						contentType: "application/x-www-form-urlencoded;charset=UTF-8",
						success: function(data){flex.addData(data);},
						error: function(XMLHttpRequest, textStatus, errorThrown){alert('Error: ' + textStatus + '\nMessage:' + errorThrown);}
					});//XMLHttpRequest
				}
			},
			
			// Popola e aggiunge una riga al tbody della griglia
			addData: function(dati)
			{
				var tbody = null;
				
				flex.page.setCurretPage(dati.current_page);
				flex.page.setPageRow(dati.page_rows);
				flex.page.setTotal(dati.total);
				
				$(table).find('tbody').each(function(){$(this).remove();});
				
				tbody = document.createElement("tbody");
				
				$(tbody).attr('width', '100%');
				$(table).append(tbody);
				
				if(dati)
				{
					flex.attachArrayHead(dati.array_js);
					
					$.each(dati.rows, function(i, row)
					{
						var cells = row.cell;
						var tr   = document.createElement('tr');
						var td   = null;
						
						if(row.id)
							$(tr).attr('id', row.id);
						
						if(parametri.alternate_color && (i%2) == 0)
							$(tr).addClass('clsOdd');
						
						for(idx = 0; idx < cells.length; idx++)
						{
							value_tmp = '';
							td        = document.createElement('td');
							
							if(cells[idx] != null)
							{
								if(cells[idx].link != '' && cells[idx].link != 'undefined' && cells[idx].link != null && typeof cells[idx].link != 'undefined')
									value_tmp = "<div><a onclick='" + cells[idx].link + "'>" + cells[idx].value + "</a></div>";
								else
									value_tmp = cells[idx].value;
							}
							
							$(td).html(value_tmp == '' ? '&nbsp;':value_tmp);
							
							$(tr).append(td);
						}
						
						$(tbody).append(tr);
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
			//	_call_js_after_load = null;
			},
			
			// Funzione che serve per salvare gli array nell'head!
			attachArrayHead: function(valore)
			{
				var script = document.createElement('script');
				
				$('script#' + parametri.title, document).each(function()
				{
					$(this).remove();
				});
				
				$(script).attr('id', parametri.title);
				script.text = valore;
				
				document.getElementsByTagName('head')[0].appendChild(script);
			},
			
			// Sperimentale
			setEvent: function()
			{
				$(window).resize(function()
				{
					if(parametri.usepager)
						$(flex.divTableScroll).height($().getHeightWindow() - $(flex.divContainer).offset().top - $(flex.divHeaderFixed).height() - $(flex.divFootFixed).height());
					else
						$(flex.divTableScroll).height($().getHeightWindow() - $(flex.divContainer).offset().top - $(flex.divHeaderFixed).height());
					
					//$(flex.divContainer).width($().getWidthWindow() - $(flex.divContainer).offset().left);
					
					flex.adjustHeight();
				});
				
				$.each(parametri.event_row, function(idx, value)
				{
					var ev = value.evento;
					
					if(ev.substr(0,2) == 'on')
						ev = ev.substr(2, ev.length);
					
					$('tr', table).bind(ev, function(eve)
					{
						eval(value.azione);
					});
				});
				
				$(table).delegate("td[title='']", "hover", function()
				{
					$(this).attr('title', parametri.colModel[$(this).index()].display + ': ' + $(this).first().text());
				});
				
				$('tbody tr', table).hover(function()
				{
					$(this).addClass('clsOver');
				},
				function()
				{
					$(this).removeClass('clsOver');
				});
			},
			
			// Serve per impostare l'altezza dei div per resize
			adjustHeight: function()
			{
				if(parametri.usepager)
					$(flex.divTableScroll).height($().getHeightWindow() - $(flex.divContainer).offset().top - $(flex.divHeaderFixed).height() - $(flex.divFootFixed).height());
				else
					$(flex.divTableScroll).height($().getHeightWindow() - $(flex.divContainer).offset().top - $(flex.divHeaderFixed).height());
				
				//$(flex.divColumnDrag).find('div').height($().getHeightWindow() - $(flex.divContainer).offset().top);
				$(flex.divLoading).height($().getHeightWindow() - $(flex.divContainer).offset().top);
				$(flex.divColumnDrag).find('div').height($(flex.divHeaderFixed).height());
				
				if($('table.classTabHeader').last().find('div.pulsante').size() > 0)
				{
					$(flex.divTableScroll).height($(flex.divTableScroll).height() - 27);//$(flex.divContainer).height() - 50);
				}
			},
			
			// Riposizione tutti i div del resize
			adjustPositionResize: function()
			{
				var val_temp = 0;
				
				$('colgroup', table).each(function()
				{
					if($('col', this).size() == 0)
						$(this).remove();
					else
						$(this).attr('width', '100%');
				});
				
				for(var idx = 1; idx < $('colgroup col', table).size(); idx++)
				{
					val_temp += parseInt($('colgroup col', table).eq(idx - 1).attr('width').replace(/px/,''), 10);//parseInt($('colgroup col', table).eq(idx - 1).width(), 10);
					
					$('div#' + (idx - 1), flex.divColumnDrag).css({'left': val_temp - 3});
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
					
					col     = $('colgroup col:eq(' + idx_1 + ')', table);
					col_fix = $('colgroup col:eq(' + idx_1 + ')', flex.divHeaderFixed);
					th      = $('thead th:eq(' + idx_1 + ')', flex.divHeaderFixed);
					
					if($('colgroup col:eq(' + (idx_1) + ')', table).attr('width') == '')
					{
						// Imposto larghezza di default...
						$(col).attr('width', '80');
						$(col_fix).attr('width', '80');
					}
					
					$('thead th:eq(' + idx_2 + ')', flex.divHeaderFixed).before(th);
					
					$('colgroup col:eq(' + idx_2 + ')', table).before(col);
					$('colgroup col:eq(' + idx_2 + ')', flex.divHeaderFixed).before(col_fix);
					
					for(idx = 0; idx <= $('tbody tr', table).size(); idx++)
					{
						$('tr:eq(' + idx + ') td:eq(' + idx_2 + ')', table).before($('tr:eq(' + idx + ') td:eq(' + idx_1 + ')', table));
					}
					
					$('colgroup col', table).last().removeAttr('width');
					$('table colgroup col', flex.divHeaderFixed).last().removeAttr('width');
					
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
					
					$(tmp).html($(obj).html());
					$(tmp).css({'width':$(obj).width(), 'height':$(obj).height(), 'top':'30px', 'left':ev.pageX - Math.round($(obj).width()/2)});
					$(tmp).attr('idx', $(obj).index());//.fadeTo(0, 0.8);
					$(tmp).hide();
					
					obj = tmp;
					
					$('div.clsWorklist div.clsWorklistResize').append(obj); // 
					
					$('div.clsWorklist table tr th').hover(function()
					{
						if($(flex.configDrag.obj).css('display') != 'none')
						{
							$('div.clsWorklist table tr th.clsOverMove').removeClass('clsOverMove');
							$(this).addClass('clsOverMove');

							flex.configDrag.colDest = this;
						}
					});
				}
				
				$(obj).addClass('cls_' + tipo);
				flex.configDrag.colDest   = ev.currentTarget;
				flex.configDrag.tipo      = tipo;
				flex.configDrag.obj       = obj;
				flex.configDrag.leftStart = flex.configDrag.leftLast = parseInt($(obj).css('left').replace(/px/, ''), 10);
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
						$('div.clsWorklist table tr th.clsOverMove').hover();
						
						if(Math.abs(flex.configDrag.leftStart - ev.pageX) >= 10)
						{
							$(flex.configDrag.obj).show();
							
							if(ev.pageX >= Math.round($(flex.configDrag.obj).width()/2))
								pos_x -= Math.round($(flex.configDrag.obj).width()/2);
							else
								pos_x -= Math.round($(flex.configDrag.obj).width()/2) + (pos_x - Math.round($(flex.configDrag.obj).width()/2));
						}
					}
					else
						pos_x -= 3;
					
					$(flex.configDrag.obj).css('left', pos_x);
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
						id      = $(flex.configDrag.obj).attr('id');
						col     = $('colgroup col:eq(' + id + ')', table);
						col_fix = $('table colgroup col:eq(' + id + ')', flex.divHeaderFixed);
						larg    = parseInt($(col).attr('width').replace(/px/, ''), 10) + parseInt($(flex.configDrag.obj).css('left').replace(/px/, ''), 10) - flex.configDrag.leftStart;
						
						if(larg <= 10)
						{
							larg = parseInt($(col).attr('width').replace(/px/, ''), 10)
							
							$(flex.configDrag.obj).css({'left':flex.configDrag.leftStart});
						}
						else
							change = true;
						
						$(col).attr('width', larg + 'px');
						$(col_fix).attr('width',larg + 'px');
						$(flex.configDrag.obj).removeClass('cls_resize');
						
						if(change)
						{
							flex.saveDimCol(id, larg);
							
							$('div.clsWorklist div.clsWorklistResize div:gt(' + id + ')').each(function()
							{
								$(this).css({'left':(parseInt($(this).css('left').replace(/px/, ''), 10) + parseInt($(flex.configDrag.obj).css('left').replace(/px/, ''), 10) - flex.configDrag.leftStart) + 'px'});
							});
						}
					}
					else
					{
						if(flex.configDrag.tipo == 'move')
						{
							$('div.clsWorklist table tr th.clsOverMove').removeClass('clsOverMove');
							
							if(Math.abs(flex.configDrag.timeLast - flex.configDrag.timeStart) > 800)
							{
								//$('div.clsWorklist table tr th.clsOverMove').removeClass('clsOverMove');
								flex.moveColumn($(flex.configDrag.obj).attr('idx'), $(flex.configDrag.colDest).index());
							}
							
							$(flex.configDrag.obj).remove();
						}
						$('div.clsWorklist table tr th').unbind('mouseenter').unbind('mouseleave');
					}
					
					flex.configDrag.init();
				}
			},
			
			// Funzione che serve per ricaricare l'ordinamento in base all'header
			rebuildOrderFlex: function()
			{
				var ordRet = '';
				$('div.clsWorklist table tr th[class^="clsOrder"]').each(function()
				{
					if(ordRet != '')
						ordRet +=', ';
					
					ordRet += parametri.colModel[$(this).index()].name + ' ' + $(this).attr('class').split('_')[1];
				})
				
				flex.manageParam.append('ORDINAMENTO', ordRet);
				
				return ordRet;
			}
		};
		// Fine oggetto griglia
		
		// Caricamento dei parametri "request"
		$.each(parametri.params, function(idx, value)
		{
			flex.manageParam.append(name, value);
		});
		
		// Configuro il div di attesa...
		$(flex.divLoading).addClass('clsWaitLoading').html('&nbsp;').fadeTo(0, 0.8);//.hide();
		$(flex.divContainer).append($(flex.divLoading));
		
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
					
					$(obj_temp).html(obj.display);
					$(obj_temp).attr('href', '#');
					$(obj_temp).attr('lancia', obj.link.replace(/javascript:/, '').replace(/return false;/,''));
					
					$(obj_temp).click(function(ev)
					{
						ev.stopPropagation();
						eval($(this).attr('lancia'));
					});
					
					$(th).html(obj_temp);
					
					obj_temp = null;
				}
				else
					$(th).html(obj.display);
				
				// Da completare: ordinamento...
				
				if(obj.width && idx < (model_coll.length - 1))
					$(col).attr('width', obj.width + 'px');
				
				$(tr).append(th);
				$(colgroup).append(col);
				
				if(obj.sort_this != '')
					$(th).addClass('clsOrder_' + obj.sort_this);
				
				//Setto la posizione del div e lo appendo!!!;
				if(idx > 0)
				{
					div_temp = document.createElement('div');
					
					$(div_temp).attr('id', idx - 1);
					$(flex.divColumnDrag).append($(div_temp));//.css({'left': value_tmp - 1 + 'px'}));
				}
			}
			
			$(thead).append(tr);
			$(table).prepend(colgroup);
			
			// Creo la tabella per rendere fisso l'head
			table_fix = $(document.createElement('table')).attr({cellPadding: 0, cellSpacing: 0, border: 0}).removeAttr('width').prepend(thead).prepend($(colgroup).clone(true)).append(document.createElement("tbody"));
			
			$(table).css({'width': '100%'});
			$(table_fix).css({'width': '100%'});
		}
		
		table.flex = flex;
		
		// Setto le classi e gli id ai div...
		$(flex.divContainer).addClass('clsWorklist');
		$(flex.divColumnDrag).addClass('clsWorklistResize');
		$(flex.divHeaderFixed).addClass('clsHeaderFixed');
		$(flex.divTableScroll).addClass('clsTableScroll');
		
		//$(flex.divContainer).css({'width': $().getWidthWindow() - $(flex.divContainer).offset().left, 'height': $().getHeightWindow() - $(flex.divContainer).offset().top - 24});
		//$(flex.divContainer).width($().getWidthWindow() - $(flex.divContainer).offset().left);
		
		// Appendo gli oggetti ai div
		$(flex.divContainer).append(flex.divColumnDrag);
		
		$(table_fix).before(flex.divHeaderFixed);
		$(flex.divHeaderFixed).append(table_fix);
		$(flex.divContainer).append(flex.divHeaderFixed);
		
		$(table).before(flex.divContainer);
		$(flex.divContainer).append(table);
		$(flex.divTableScroll).append(table);
		$(flex.divContainer).append(flex.divTableScroll);
		
		// Controllo se bisogna utilizzare l'inpaginazione...
		if(parametri.usepager)
		{
			table_foot = document.createElement('table');
			colgroup   = document.createElement('colgroup');
			col        = document.createElement('col');
			tfoot      = document.createElement('tfoot');
			tr         = document.createElement('tr');
			th         = document.createElement('th');
			
			$(table_foot).attr({cellPadding: 0, cellSpacing: 0, border: 0}).removeAttr('width');
			
			// Il primo deve occupare tutto lo spazio
			$(colgroup).append(document.createElement('col'));
			$(tr).append(document.createElement('th'));
			
			$(col).attr('width', '20');
			$(colgroup).append(col);
			
			$(th).click(function(){flex.page.movePage(-1)});
			$(th).html('&nbsp;');
			$(th).css({visibility:'hidden'})
			$(th).addClass('clsButton');
			$(th).addClass('clsPreview'); // lo nascondo visto che è la prima pagina...
			
			$(tr).append(th);
			
			col = document.createElement('col');
			th  = document.createElement('th');
			
			$(col).attr('width', '50');
			$(colgroup).append(col);
			
			$(th).addClass('clsPageInfo');
			$(tr).append(th);
			
			col = document.createElement('col');
			th  = document.createElement('th');
			
			$(col).attr('width', '20');
			$(colgroup).append(col);
			
			$(th).click(function(){flex.page.movePage(1)});
			
			$(th).html('&nbsp;');
			$(th).css({visibility:'hidden'})
			$(th).addClass('clsButton');
			$(th).addClass('clsNext');
			$(tr).append(th);
			
			$(tfoot).append(tr);
			
			$(table_foot).append(colgroup);
			$(table_foot).append(tfoot);
			$(table_foot).addClass('clsTableFoot');
			
			$(flex.divFootFixed).append(table_foot);
			$(flex.divFootFixed).addClass('clsFooterFixed');
			$(flex.divContainer).append(flex.divFootFixed);
			
			$('.clsButton', table_foot).hover(function(){$(this).addClass('clsButtonOver')}, function(){$(this).removeClass('clsButtonOver')});
			
			//$(flex.divTableScroll).height($().getHeightWindow() - $(flex.divContainer).offset().top - $(flex.divHeaderFixed).height() - $(flex.divFootFixed).height());
		}
		//else
		//	$(flex.divTableScroll).height($().getHeightWindow() - $(flex.divContainer).offset().top - $(flex.divHeaderFixed).height());
		
		flex.adjustHeight();
		
		// Da completare: resize, buttons, ordinamenti e altre cose...
		// Setto gli eventi per il resize!
		$('div.clsWorklist div.clsWorklistResize div').mousedown(function(ev)
		{
			flex.dragStart('resize', ev, this);
		});
		
		// Setto gli eventi per lo spostamento delle colonne...
		$('div.clsWorklist div.clsHeaderFixed table thead tr th').mousedown(function(ev)
		{
			flex.dragStart('move', ev, this);
		});
		
		$(document).mousemove(function(ev)//'div.clsWorklist'
		{
			flex.dragMove(ev);
		});
		
		$(document).mouseup(function(ev) //'div.clsWorklist'
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
		$('div.clsWorklist div.clsHeaderFixed table thead tr th').click(function(ev)
		{
			var order = '';
			
			if($(this).html() != '&nbsp;' && $(this).html() != '&nbsp;')
			{
				if(!flex.loading)
				{
					if(!ev.ctrlKey)
						$('div.clsWorklist table tr th:lt(' + $(this).index() + '), div.clsWorklist table tr th:gt(' + $(this).index() + ')').removeClass('clsOrder_asc').removeClass('clsOrder_desc');
					
					if($(this).hasClass(''))
						$(this).addClass('clsOrder_asc');
					else
						if($(this).hasClass('clsOrder_asc'))
							$(this).removeClass('clsOrder_asc').addClass('clsOrder_desc');
						else
							if($(this).hasClass('clsOrder_desc'))
								$(this).removeClass('clsOrder_desc');
					
					order = flex.rebuildOrderFlex();
					
					flex.saveOrderCol(order);
					
					flex.loadData();
				}
			}
		});
		
		// Disabilito la selezione all'interno del div...
		//$(flex.divContainer).disableSelection();
		$(flex.divHeaderFixed).disableSelection();
		
		// Esperimento!!
		/*$(window).resize(function()
		{
			flex.adjustPositionResize();
		});*/
		//$('body').css({'overflow':'hidden'});
		// da verificare!!!
		$('body').css({'overflow-y':'hidden'});
		$('body').css({'overflow-x':'auto'});
		
		// Una volta completata la costruzione, passo al caricamento dei dati!
		flex.rebuildOrderFlex();
		flex.loadData();
		
		return table;
	};
	
	$.fn.callJSAfterInitWorklist = function(js)
	{
		_call_js_after_load.push(js);
	}
	
	$.fn.refreshWorklist = function(where)
	{
		if(where == '')
			where = 'rownum <= 200'; // Sicurezza!!!
		
		vettore_indici_sel = new Array();
		
		flex.manageParam.append('WHERE_WK', where);
		flex.loadData();
	}
	
	$.fn.worklist = function(param)
	{
		$.createWorklist(this, param);
	};
})($);

jQuery(document).ready(function()
{
	jQuery('table script', this).each(function()
	{
		// Quì serve per la worklist di polaris di merda
		jQuery('div#idLayerWorklist').css({"margin-top":25});
		//jQuery('table.classTabHeader').last().hide();
		var script = jQuery(this).html();
		script = script.replace("/*", "").replace("*/", "");
		
		eval(script);
	});
	
	//jQuery(".DropDownIcon img").attr("height","24").attr("width","24");
	jQuery(".ContextIcon img").attr("height","24").attr("width","24");
});