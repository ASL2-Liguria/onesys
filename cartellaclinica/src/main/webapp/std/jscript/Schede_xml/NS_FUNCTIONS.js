var NS_FUNCTIONS = {
    addEmptyTd: function(id, row, column, number) {
        //alert("ID: "+id+"\nROW: "+row+"\nCOLUMN: "+column+"\nNUMBER: "+number);
        for (var i = 0; i < number; i++) {
            $("<TD></TD>").insertAfter('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + row + ') > td:eq(' + column + ')');
        }
    },
    addInputText: function(id, input, td, last) {
        if (td != null && NS_FUNCTIONS.controlArrayStructure([td])) {
            var elem = td.split("|");
            $('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + elem[0] + ') > td:eq(' + elem[1] + ') > ' + last + ':last').after(input);
        }
    },
    prependTd: function(id, element){
    	 $('#' + id).parent().parent().prepend('<td class="classTdLabel">'+element+'</td>');
    },
    moveLeftField: function(settings) {
		var element = $('#'+settings.name);
		element = typeof settings.element === 'object' ? settings.element : element;//opzionale
		var parent = element.parent();
		var node;
		node = typeof settings.node === 'object' ? settings.node : element.parent().prev();//opzionale
		if (settings.colspan === undefined) {//default
			var colspan = parseInt(element.parent().attr("colspan")) + parseInt(node.attr("colspan"));
			settings.colspan = isNaN(colspan) ? 1 : colspan;
		}
		node.attr('colspan', settings.colspan);
		if (typeof settings.width === 'string') element.css('width', settings.width);//opzionale
		node.append(settings.space);
		element.parent().children().remove().appendTo(node);
		parent.remove();
    },
    calculateBMI: function(weight, height) {
        return weight > 0 && height > 0 ? NS_FUNCTIONS.roundTo2(weight/((height/100)*(height/100))) : '';
    },
    controlArrayStructure: function(array) {
        for (var i = 0; i < array.length; i++) {
            var elem = array[i].split("|");
            if (elem.length != 3) {
                alert("ERRORE: Controllare la struttura degli elementi nell'array: (indice_riga|indice_colonna|numero)");
                return false;
            } else {
                for (var j = 0; j < elem.length; j++) {
                    if (!NS_FUNCTIONS.isInteger(elem[j])) {
                        alert("ERRORE: Controllare il contenuto degli elementi nell'array: (intero|intero|intero)");
                        return false;
                    }
                }
            }
        }
        return true;
    },
	controlloData:function(id){
		try {
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById(id));
		}catch(e){
		}
	},
	controlloNumerico_onkeydown:function(e) {
        // Consenti: backspace, delete, tab, escape, enter, virgola, punto e meno
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 109, 110, 188, 189, 190]) !== -1 ||
            // Consenti: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            ($.inArray(e.keyCode, [65, 67, 86, 88, 90]) !== -1 && e.ctrlKey === true) || 
            // Consenti: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
        }
        // Garantisce che sia stato premuto una cifra e termina il keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
	},
	controlloNumerico_onblur:function(e) {
    	var value = $(this).val().replace(/^\s+|\s+$/, '').replace(',','.');
    	if (value != '') {
    		var number = parseFloat(value);
    		number = isNaN(number) ? 0 : number; 
    		if (number < 0) {
    			alert('Inserire un valore positivo.');
    			$(this).focus();
    		}
    		value = ''+number;
    	}
    	$(this).val(value);
	},
    emptyTd: function(id, row, column) {
        $('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + row + ') > td:eq(' + column + ')').empty();
    },            
    enableDisable: function(radChkID, arrayEnable, arrayInput, focus/*opzionale*/, callback/*opzionale*/) {
    	callback = typeof callback === 'object' ? callback : new Object();
        
        for (var i=0; i < arrayInput.length; i++) {
            // Attributi disponibili alla funzione di callback
        	this.id = arrayInput[i];
        	this.enable = false;
            
        	// Disabilito di default ogni campo
        	$('#' + arrayInput[i]).attr('disabled', 'disabled');
        	var value = $('#' + this.id).val();
        	$('#' + this.id).val('');
        	
        	// ... e poi controllo se il valore di radChkID corrisponde ad almeno uno dei valori forniti
        	for (var j=0; !this.enable && j < arrayEnable.length; j++) {
                this.enable = radChkID.attr('value') == arrayEnable[j];
            	if (this.enable) {
                	// Abilita il campo
                    $('#' + this.id).removeAttr('disabled');
                    $('#' + this.id).val(value);
                    if (focus) $('#' + this.id).focus();
                }
        	}
        	
            // Chiamata opzionale ad una funzione di callback
        	if (typeof callback['function'] === 'function') {
                try {
                	callback['function'].apply(callback.scope ? callback.scope : this, callback.arguments ? callback.arguments : []);
                } catch	(e) {
                	alert(e.message);
                }
        	}
        }
    },
    enableDisableRadio: function(radChkID, arrayEnable, arrayInput, focus/*opzionale*/, callback/*opzionale*/) {
    	callback = typeof callback === 'object' ? callback : new Object();
        
        for (var i=0; i < arrayInput.length; i++) {
            // Attributi disponibili alla funzione di callback
        	this.id = arrayInput[i];
        	this.enable = false;
            
        	// Disabilito di default ogni campo
        	$('#' + arrayInput[i]).attr('disabled', 'disabled');
        	var checked = $('#' + this.id).attr("checked");
        	$('#' + this.id).attr("checked", false);
        	
        	// ... e poi controllo se il valore di radChkID corrisponde ad almeno uno dei valori forniti
        	for (var j=0; !this.enable && j < arrayEnable.length; j++) {
                this.enable = radChkID.attr('value') == arrayEnable[j];
            	if (this.enable) {
                	// Abilita il campo
                    $('#' + this.id).removeAttr('disabled');
                    $('#' + this.id).attr("checked", checked);
                    if (focus) $('#' + this.id).focus();
                }
        	}
        	
            // Chiamata opzionale ad una funzione di callback
        	if (typeof callback['function'] === 'function') {
                try {
                	callback['function'].apply(callback.scope ? callback.scope : this, callback.arguments ? callback.arguments : []);
                } catch	(e) {
                	alert(e.message);
                }
        	}
        }
    },
    getProtocolHost: function() {
        return location.protocol+"//"+location.host+"/"+window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
    },
    hideRecords: function(recordsID) {
        $("#"+recordsID).parent().parent().hide();
    },
    hidePrint: function(printID) {
        $("#"+printID).parent().parent().hide();
    },            
    hideRecordsPrint: function(recordsID, printID) {
        NS_FUNCTIONS.hideRecords(recordsID);
        NS_FUNCTIONS.hidePrint(printID);
    },
    input: {
        date: function(idName,value) {
         var str= "<INPUT id='" + idName + "' class='hasDatepick' maxLength='10' size='10' name='" + idName + "'";        
         if (typeof(value)!='undefined'){
        	 str+=" value='"+value+"'";
         }        
        str+=" STATO_CAMPO='E' length='10' max_length='10'><IMG class='trigger datepick-trigger' src='"+NS_FUNCTIONS.getProtocolHost()+"/imagexPix/calendario/cal20x20.gif'/>";
        return str;
        }
    },            
    inputRadioTable: function(id, tdArray) {
//        function carriageReturn(id, row, column, number) {
//            //alert("ID: "+id+"\nROW: "+row+"\nCOLUMN: "+column+"\nNUMBER: "+number);            
//            var index = 1;
//            $('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + row + ') > td:eq(' + column + ')').find('INPUT').each(function() {
//                switch (number) {
//                    case '1':
//                        index != 1 ? $('<BR/>').insertBefore($(this)) : null;
//                        break;
//                    default:
//                        index % number == 1 && index != 1 ? $('<BR/>').insertBefore($(this)) : null;
//                        break;
//                }
//                index++;
//            });
//        }
        
        function createTableInput(id, row, column, number, totInput) {
            var arrayInput = NS_FUNCTIONS.loadInputIntoTd(id, row, column);
            var arrayLabel = NS_FUNCTIONS.loadLabelIntoTd(id, row, column);
            //alert("riga "+row+", colonna "+column+". Numeno input: "+totalInput);
            
            var table = '';
            
            for (var i = 0; i < totInput; i++) {
                // Apro la TABLE
                table += i == 0 ? '<TABLE CELLPADDING="3" CELLSPACING="3">' : '';
                
                if (number == 1) {
                    table += '<TR><TD>'+arrayInput[i]+arrayLabel[i].html()+'</TD></TR>';
                } else {
                    table += (i + 1) % number == 1 ? '<TR>' : '';
                    table += '<TD>'+arrayInput[i]+arrayLabel[i].html()+'</TD>';
                    table += (i + 1) % number == 0 ? '</TR>' : '';                
                }

                // Chiudo la TABLE
                table += i == totInput - 1 ? '</TABLE>' : '';
            }
            
            //alert(table);
            NS_FUNCTIONS.emptyTd(id, row, column);
            NS_FUNCTIONS.setupInputTd(id, row, column, table);
        }       

        if (tdArray != null && NS_FUNCTIONS.controlArrayStructure(tdArray)) {
            for (var i = 0; i < tdArray.length; i++) {
                var elem = tdArray[i].split("|");
                //carriageReturn(id, elem[0], elem[1], elem[2]);
                var totInput = NS_FUNCTIONS.numberInputIntoTd(id, elem[0], elem[1]);
                createTableInput(id, elem[0], elem[1], elem[2], totInput);
            }
        }
    },
    isInteger: function(number) {
        var numericExpression = /^[0-9]+$/;
        return number.match(numericExpression) == null ? false : true;
    },
    loadInputIntoTd: function(id, row, column) {
        var arrayInput = new Array();
        $('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + row + ') > td:eq(' + column + ')').find('INPUT').each(function() {
            arrayInput.push(NS_FUNCTIONS.wrapInput($(this)));
        });
        return arrayInput;
    },
    loadLabelIntoTd: function(id, row, column) {
        var arrayLabel = new Array();
        $('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + row + ') > td:eq(' + column + ')').find('LABEL').each(function() {
            arrayLabel.push($(this).clone(true));
        });
        return arrayLabel;
    },
    numberInputIntoTd: function(id, row, column) {
        return $('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + row + ') > td:eq(' + column + ')').find('INPUT').length;
    },            
    print: function(nameFunction, preview) {
        var vDati = WindowCartella.getForm(document);

        if (!WindowCartella.ModalitaCartella.isStampabile(vDati)) {
            return;
        }

        var funzione = nameFunction;
        var anteprima = preview;
        var reparto = vDati.reparto;
        var sf = '&prompt<pVisita>=' + document.EXTERN.IDEN_VISITA.value;
        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
    },
    records: function() {
        registra();
    },
    roundTo2 : function(number) {  
        return + (Math.round(number + "e+2")  + "e-2");
    },            
    setDatepicker: function(id) {
        $('#' + id).removeClass('hasDatepick');
        $('#' + id).next().remove();
        $('#' + id).datepick({
            onClose: function() {
                jQuery(this).focus();
            },
            showOnFocus: false,
            minDate: function() {
            	
            	var d = new Date();			
                d.setYear('1900');
                d.setMonth('00');
                d.setDate('01');					
				return d;
              /*  switch (WindowCartella.FiltroCartella.getLivelloValue()) {
                    case "IDEN_ANAG":
                    case "ANAG_REPARTO":
                        return clsDate.setData(WindowCartella.getPaziente("DATA"), "00:00");
                    case "NUM_NOSOLOGICO":
                        return clsDate.setData(WindowCartella.getRicovero("DATA_INIZIO"), "00:00");
                    case "IDEN_VISITA":
                        return clsDate.setData(WindowCartella.getAccesso("DATA_INIZIO"), "00:00");
                }*/
            },
            showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
        });
    },  
    setDimensioniPagina: function() {
        $('div.tab').height(document.body.offsetHeight - $('div.tab').position().top - 50);
    },
    setupInputTd: function(id, row, column, html) {
        $('#' + id + ' > table.classDataEntryTable > tbody:last > tr:eq(' + row + ') > td:eq(' + column + ')').html(html);
    },            
    showHideCalendar: function(inputID, showHideBoolean) {
        switch(showHideBoolean) {
            case false:
                $('#'+inputID).next().hide();
                break;
            case true:
                $('#'+inputID).next().show();
                break;
        }
    },
    tableFormatting: function(id, arrayIndexAdd) {
        if (arrayIndexAdd != null && NS_FUNCTIONS.controlArrayStructure(arrayIndexAdd)) {
            for (var i = 0; i < arrayIndexAdd.length; i++) {
                var elem = arrayIndexAdd[i].split("|");
                NS_FUNCTIONS.addEmptyTd(id, elem[0], elem[1], elem[2]);
            }
        }
    },
    wrapInput: function(input) {
        return input.wrapAll('<div></div>').parent().html();
    },
    setColumnsDimension: function(idDiv, arrayTdDimension) {
        $('DIV#' + idDiv + ' TABLE TBODY TR').each(function(i) {
           $(this).find("TD").each(function(j) {
               switch(j) {
                   case 0: $(this).css('width',arrayTdDimension[j]); break;
                   case 1: $(this).css('width',arrayTdDimension[j]); break;
                   case 2: $(this).css('width',arrayTdDimension[j]); break;
                   case 3: $(this).css('width',arrayTdDimension[j]); break;
                   case 4: $(this).css('width',arrayTdDimension[j]); break;
                   case 5: $(this).css('width',arrayTdDimension[j]); break;
                   case 6: $(this).css('width',arrayTdDimension[j]); break;                 
                   default: $(this).css('width','12,5%'); break;
               }
           }); 
        });  
    },
    disableEnableInputText: function(idInput, actualValue, enableValue) {
        if (actualValue == enableValue) {
            $('#' + idInput).removeAttr('disabled');
        } else {
            $('#' + idInput).attr('disabled','disabled');
            $('#' + idInput).val("");
        }
    },
	apriTestiStandard: function(targetOut){
		if(_STATO_PAGINA == 'L') return;

		var url='servletGenerator?funzione=LETTERA_STANDARD&KEY_LEGAME=SCHEDA_TESTI_STD&TARGET='+targetOut+'&PROV='+document.EXTERN.FUNZIONE.value;
		$.fancybox({
			'padding'	: 3,
			'width'		: 1024,
			'height'	: 580,
			'href'		: url,
			'type'		: 'iframe'
		});
	},
	setCampoStato: function(field, label, stato){
		var overwrite = function(f, l,s) {
			var classField= s=='O'?'classTdField_O':'classTdField';
			var classLabel = $('[name='+l+']').attr("onclick") == null ? 'classTdLabel' : 'classTdLabelLink';
			classLabel= s=='O'? classLabel+'_O':classLabel;
			
			$('[name='+f+']').attr('STATO_CAMPO', s);
			$('[name='+f+']').attr('STATO_CAMPO_LABEL', l);
			$('[name='+f+']').parent().attr('class', classField);
			$('[name='+l+']').parent().attr('class', classLabel);			
		};
		
		if (typeof field === 'object') {
			for (var i in field) {
				overwrite(i, field[i], stato[i]);
			}
		} else if (typeof field === 'string' && typeof label === 'string') {
			overwrite(field, label, stato);
		}
	},
	openTablePopup: function(pParam) {
		pParam.id = (typeof pParam.id === 'string' ? pParam.id : null);
		pParam.title = (typeof pParam.title === 'string' ? pParam.title : "");
		pParam.header = (typeof pParam.header === 'string' ? pParam.header : "");
		pParam.footer = (typeof pParam.footer === 'string' ? pParam.footer : "");
		pParam.width = (typeof pParam.width === 'number' ? pParam.width : 500);
		pParam.height = (typeof pParam.height === 'number' ? pParam.height : 'auto');
		pParam.content = (typeof pParam.content === 'object' && typeof pParam.content.length === 'number' ? pParam.content : []);
		
		var obj = $('<table/>');
		if (pParam.content.length > 0) {
			var w = Math.floor(100/pParam.content.length)+"%";

			var head = $('<tr/>');
			for (var i in pParam.content) {
				head.append($('<th/>', {style:"width:"+w}).html(pParam.content[i].title));
			}
			$(obj).append(head);
			var body = $('<tr/>');
			for (var i in pParam.content) {
				body.append($('<td/>', {style:"vertical-align:top"}).html(pParam.content[i].text));
			}
			$(obj).append(body);
		}
		        
		remove();
				
		$('body').append(
	    	$('<div/>', {id: pParam.id, title: pParam.title})
	            .append(pParam.header)
	            .append(obj)
	            .append(pParam.footer)
	    );
		
	    $('#'+pParam.id)
	    .dialog({
	        position: [event.clientX, event.clientY],
	        width: pParam.width,
	        height: pParam.height
	    })
	    .css({"font-size": "12px"});
	    
	    setEvents();
		
		function remove() {
		   $('#'+pParam.id).remove();
		}
		
		function setEvents() {
		   $("body").click(remove);
		}
	},
	
	/**
	 * Modifica il valore di un campo di tipo testo nella pagina marcandolo come 'uncommitted' (non ancora registrato).
	 * 
	 * @param element     l'elemento jQuery di cui si vuole assegnare il valore    
	 * @param value       valore da assegnare
	 * @param overwrite   (opzionale) se false il nuovo valore è assegnato solo se quello corrente è vuoto
	 * @returns {Object}  l'elemento jQuery modificato
	 */
	assegnaCampoTestoNonRegistrato: function(element, value, overwrite) {
		var oldValue = element.val();
		overwrite = typeof overwrite === "boolean" ? overwrite : true;

		if (value == '' || oldValue==value || (oldValue != '' && overwrite==false)) return element;

		element.attr("data-uncommitted", "uncommitted");
		if (element.attr("id") != '') { 
			$("[name="+element.attr("name")+"]").each(function() {
				$("label[for="+$(this).attr("id")+"]").attr("data-uncommitted", "uncommitted");
			});
		}

		if (value != null && (typeof value === "string" || typeof value === "object")) element.val(value);
		return element;
	},
	
	/**
	 * Modifica il valore di un campo di tipo radio nella pagina marcandolo come 'uncommitted' (non ancora registrato).
	 * 
	 * @param element     l'elemento jQuery di cui si vuole assegnare il valore    
	 * @param value       valore da assegnare
	 * @param overwrite   (opzionale) se false il nuovo valore è assegnato solo se quello corrente è vuoto
	 * @returns {Object}  l'elemento jQuery modificato
	 */
	assegnaCampoRadioNonRegistrato: function(element, value, overwrite) {
		overwrite = typeof overwrite === "boolean" ? overwrite : true;
		var campo = element.attr("name");
		var match = $('input[name='+campo+'][value='+value+']').is(':checked') || ( 
		            typeof $('input[name='+campo+']:checked').val() === "undefined" && value == '');
		var obj = element.filter(function(){
			return $(this).val() == value;
		});
		element = NS_FUNCTIONS.assegnaCampoTestoNonRegistrato(typeof obj.attr('name') === "string" ? obj : element, match ? value : null, overwrite);
		if (overwrite) element.attr('checked', value != '' ? true : false);
	},

	/**
	 * Segnala i campi marcati come 'uncommitted' (non ancora registrati).
	 * 
	 * @param funct (opzionale)
	 */
	segnalaCampiNonRegistrati: function(funct) {
		$("[data-uncommitted]").each(typeof funct === 'function' ? funct : function(){
			$(this).data('color', $(this).css('color'));
			$(this).css('color', '#FF0000');
			if($(this).attr('type')=='select-one'){
				$(this).children().css('background-color', '#FF0000');
			}
		});
	},
	
	/**
	 * Ripristina i campi marcati come 'uncommitted' (non ancora registrati).
	 * 
	 * @param funct (opzionale)
	 */
	segnalaCampiRegistrati: function(funct) {
		$("[data-uncommitted]").each(typeof funct === 'function' ? funct : function(){
			if (typeof $(this).data('color') === 'string') {
				$(this).css('color', $(this).data('color'));
			}
		});
	},
	
	/**
	 * Aggiunge due pulsanti '+' e '-' per poter incrementare o decrementare di 1 un campo di testo.
	 * 
	 * @param $element  l'elemento jQuery di cui si vuole poter modificare il valore.
	 */
	addCounter: function(element) {
		function add(id) {
			var n = parseInt($('#'+id).val(),10) || 0;
			$('#'+id).val(n+1);
		}
		
		function sub(id) {
			var n = parseInt($('#'+id).val(),10) || 0;
			$('#'+id).val(n-1 > 0 ? n-1 : 0);
		}
		
		element.each(function(){
			var id = $(this).attr("id");
			$(body).append('<map name="bModifier-'+id+'"><area class="bPlus" shape="rect" coords="0,0,15,15" nohref="nohref" alt=""/><area class="bMinus" shape="rect" coords="0,16,16,30" nohref="nohref" alt=""/></map>');
			//TODO
			$(this).after('<img style="vertical-align:middle;cursor:pointer" usemap="#bModifier-'+id+'" border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEIklEQVR42p2VaU+bRxSF/QP6OxqRKglVUtHS0nRRkk+tKvUDEhQUgVlMYguQKpYqFCFEy77HZjGYqmBwAQdiE0AISNhMHYxNwBCQEAEbDMY2i8FiPZ07FKiDk7R9pat5PZ5zZubOPPcVCASC93xFamoqpFIpCgsLER4ejjeNE7zeUVxcjLm5OWxsbGBvbw87OzuwWq3o6elBREQE3mpgMBhw+hwcHJzF0dER79vf30d2djZ8Guj1ej5oe3sbbrcbHo8Hu7u7LDx8FVtbW7z/8PAQSUlJ8DIoLy/nYhdb9ub2Fm9JHCUUoiAvl61iHw7HOtbW1uB0ujA7O+ttMDExAfe2G/b1ddjZQIfTCafDic8DAyGOjoaHmVoti1haWmTiOVgsFojF4hOT5ORkLCwswGazYWVlBetrdtgsVtiWrLjzxZeIjxXBwf6bmzZjhoXRaITZbEZ+fv6JQU5ODubn57nJ4qtXiI+7j68Cg/Dt13fw4SU/fOLvj29u3UZQQAB+fvAAOt0oRoaHUVZWdmKQkpICk8mEKfMUm2Eav2b9grjoWEhi4xBw5RpufRqE+yIR7oaGIT8nF93d3ejq6kJWVhbOckBnTEc4OjoKo8kIo2EchufPcfuzm4j+4S5GdDp0P+mC9vFjNDY2oq2tDZGRkecGeXl5bGk67tzR0cEGatCufoSP/a8j+Lvv0fJIDYVCAUVtLWpZK5fLceEeKJVKaLVaqFQqNCkboWIhFsbgpx+TUFf/Ox7KpHjIjruqqgoitiWfN5FmISOaoaqyCvJqOWRSGYqKilBSUsITFx8fj7eykJ6eDplMhoqKCkhZSyIyyMjIQFhYGN4J0/+Ii519fX2glZSWloISLJFIQH3vNAgODkZ/f/8Zff98lpeXUVBQ8OYtREVF8Rpwii3BRBRSEJlEIT0ajcZ3Em0rNs4+YXsqpCCECfHNzU24XC5uUllZ6X2Mzc3NOD4+Zqg6uQGthIIE1OdwOGC32znOq6urjMolb4NpxgDNQIMIaedrQhIRqQTczMwMb4khbkDZpg5KEtU+IvIlM3w5ZYb5xSQmTS9gMhgxrh/DBIOOeKH6QReLG+Tm5nKcyXmZFQq1UoVr7/vho8tXcd3vCm58cBX+ly7j5o0APNFo0f/0KYaGhvgRc4OEhASMjY1hcnIStJVObQckcfcgiRFxpEVRMYiJFEIiugd1Swva29vR2dmJtLS0cxoJTzIZGBzEsG4E4+Pj0P+pxxD7/WxgAL29vZxUAq2hoQGtra0ICQk5N6CPyCAbTChTqNVqqP5gVDY1ob6+Hr/V1aGmpobhrOAtFeEL94D2RGKagUR1f4uqq6s5WCQisKgNDQ31jTMllCoOCUlEppRtCnqnq+yDSO+7LWTfAqp39E08FWVmZiIxMRH/msb/En8BovIDHqsZgDIAAAAASUVORK5CYII="/>');
			$(this).keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);
			
			$('map[name=bModifier-'+id+'] area.bPlus').click(function(){add(id);}).dblclick(function(){add(id);});
			$('map[name=bModifier-'+id+'] area.bMinus').click(function(){sub(id);}).dblclick(function(){sub(id);});
		});
	},
	
	/**
	 * Converte un intero in notazione esavigesimale biiettiva (alfabetico base 26).
	 *
	 * @param {Number} int - Un intero positivo maggiore di zero
	 * @return {String} Il valore del numero espresso in base 26 biiettivo minuscolo
	 */
	bijectiveBase26: function (int){
	    var sequence      = "abcdefghijklmnopqrstuvwxyz".split("");
	    var length        = sequence.length;

	    if(int <= 0)      return int;
	    if(int <= length) return sequence[int - 1];

	    var index  = (int % length) || length;
	    var result = [sequence[index - 1]];

	    while((int = Math.floor((int - 1) / length)) > 0){
	        index = (int % length) || length;
	        result.push(sequence[index - 1]);
	    }

	    return result.reverse().join("");
	},
	
	/**
	 * Aggiunge l'attributo "for" alle label accanto a radio input e checkbox.
	 * In caso di "id" non definito per i radio button, questo viene generato
	 * aggiungendo al "name" un suffisso passato come parametro.
	 * 
	 * @param {String} suffix - Suffisso esprimibile in uno dei seguenti modi:
	 *   %d            (default) intero decimale       
	 *   %o            intero ottale
	 *   %s %S         stringa (valore)
	 *   %x %X         intero esadecimale
	 *   %z %Z         intero biiettivo in base 26 (alfabetico base 26)
	 *   %%            inserisce il simbolo %
	 */
	addForLabel: function(suffix) {
		var ids = {};
		$("input:radio, input:checkbox").each(function() {
			var $this = $(this);
			var name = $this.attr("name");
			if (typeof ids[name] === "number") {
				ids[name] += 1;
			} else {
				ids[name] = 1;
			}
			var label = $this.find(" ~ label").first();
			if (typeof label.attr("tagName") === 'string') {
				var id = $this.attr("id");
				if (id == '' && name != '') { // Id non è definito
					id = name;
					if ($this.is(":radio")) {
						var radioId = typeof suffix === 'string' ? suffix : "%d";
						
						// Genera il suffisso nel formato passato come parametro
						id += radioId.replace(/\%([0-9]+)?([dosSxXzZ\%])/, function(match, padding, format) {
							var p = isNaN(Number(padding)) ? 0 : Number(padding); 
							switch("%"+format) {
								// Intero decimale
								case "%d":
									var pad = new Array(1 + p).join("0");
									return (pad+ids[name]).slice(-pad.length);
								
								// Intero ottale
								case "%o":
									var pad = new Array(1 + p).join("0");
									return (pad+ids[name].toString(8)).slice(-pad.length);
								
								// Stringa (valore)
								case "%s":
									return $this.val();
								case "%S":
									return $this.val().toUpperCase();
								
								// Intero esadecimale
								case "%x":
									var pad = new Array(1 + p).join("0");
									return (pad+ids[name].toString(16)).slice(-pad.length);
								case "%X":
									var pad = new Array(1 + p).join("0");
									return (pad+ids[name].toString(16)).slice(-pad.length).toUpperCase();
								
								// Intero biiettivo in base 26 (alfabetico base 26)
								case "%z":
									var pad = new Array(1 + p).join("a");
									return (pad+NS_FUNCTIONS.bijectiveBase26(ids[name])).slice(-pad.length);
								case "%Z":
									var pad = new Array(1 + p).join("a");
									return (pad+NS_FUNCTIONS.bijectiveBase26(ids[name])).slice(-pad.length).toUpperCase();
								
								// Inserisce il simbolo %
								case "%%":
									return "%";
								
								// Formato sconosciuto
								default:
							}
							return "";
						});
					}
					$this.attr("id", id);
				} // end if Id non è definito
				label.attr("for", id);
			}
		});
	}
};
