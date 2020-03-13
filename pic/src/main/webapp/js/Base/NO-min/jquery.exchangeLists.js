/**
*  Exchange Lists (Liste di scambio), version 1.2
*  (c) 2012 Jacopo Brovida, El.co s.r.l
*
*  For details: jacopo.brovida@elco.it
*
*  Last Review: 28/01/2013
*/

/* OPTIONS
* 			onlySingleTransfert: 	ex. false
*			clickAndTransfert: 	ex. false
*			disabled: 		ex. true
*		    maxElementsSelectable  ex. 2
*			removeFirstListItems:	ex.true 	se false non rimuove gli elementi dalla prima lista
*			listHeader: ex.null    se object crea un header alle liste
*/
(function ($) {

	function ExchangeList(el, _options) {
		this.el = $(el);
		this.disabled=false;
		this.listFrom=$(".listFrom",this.el);		
		this.listTo=$(".listTo",this.el);
		this.options = {
			onlySingleTransfert: false,
			clickAndTransfert: true,
			disabled:false,
			removeFirstListItems:true,
			listHeaders:null,
            callback:null,
            beforeTransfert:null, /*funzione richiamata prima del trasferimento  (return true/false) se false non esegue il trasferimento*/
            maxElementsSelectable:0,  /*numero massimo di elementi selezionabili   se 0 infinito*/
            order:false /*se true permette di cambiare l'ordinamento degli elementi selezionati*/

			/*listHeaders:{
			  	listFrom:{
						title:"Esami Disponibili",
						buttons:[{id:"btnShowAll",text:"Visualizza Tutti"},{id:"btnCodDescr",text:"Cod+Descr"},{id:"btnRicerca",text:"Cerca",event:function(){$(".SearchEsa").toggle();}}],
						search:{label:"Filtro",input:"btnSearchEsa",buttons:[{id:"btnSearchCod",text:"Codice"},{id:"btnSearchDescr",text:"Descr."}]}
				},
				listTo:{	
						title:"Esami Selezionati",
						buttons:[{id:"btnRemoveAll",text:"Rimuovi Tutti"}],
				}
			}*/
		};
		this.setOptions(_options);	
		this.initialize();
	}

	$.fn.exchangeList = function (options) {
		var elcoExchangeControl;
		elcoExchangeControl = new ExchangeList(this.get(0), options);		
		return elcoExchangeControl;
	};
	
	
	ExchangeList.prototype = {

		initialize: function () {
			var me;
			me = this;
			if(me.options.listHeaders!=null){
				var headers=me.options.listHeaders;
              /*  var $list=    $(me.listFrom).parent();
                $list.prepend(me.creaHeader(headers.listFrom.title));
                if(headers.listFrom.buttons!=null || headers.listFrom.buttons!=""){
                    $list.append(me.creaButtons(headers.listFrom.buttons));
                }
                $list.append($("<hr/>"))     */

				$(me.listFrom).parent().prepend(me.creaHeader(headers.listFrom.title).append(me.creaButtons(headers.listFrom.buttons)).append($("<hr/>")));
                var hLists=$(".containerList",this.el).outerHeight();
                var hButtons=$(".btn",me.el).outerHeight();
                //$(".btn",me.el).css({"margin-top":((hLists-hButtons)/2)+20});
				if(headers.listFrom.search!=null){
					var divSearch=$("<div/>").addClass("searchContainer").append($("<span/>").html(headers.listFrom.search.label)).append($("<input/>").attr("type","text").attr("id","txtSearchEsa"));
					$(me.listFrom).prev().append(divSearch);
				}
				$(me.listTo).parent().prepend(me.creaHeader(headers.listTo.title).append(me.creaButtons(headers.listTo.buttons)).append($("<hr/>")));
			}

            var cW= this.el.innerWidth();
            this.listFrom.css({width:(cW/2)-60});
            this.listTo.css({width:(cW/2)-60});

            if(this.options.order)
            {
                this.listTo.css({width:(cW/2)-80});
                me.addOrder();
            }

			if(this.options.disabled)
            {
				me.disable();
			}
            else
            {
				if(this.options.clickAndTransfert)
                {
					//$("option",this.listFrom).dblclick(function(){alert("jj");me.transfert($(this),me.listTo);});   //IE
                    $(this.listFrom).dblclick(function(){
                            me.transfert($(this).find(':selected'),me.listTo);
                    }) ;

					if(me.options.removeFirstListItems){
						//$("option",this.listTo).live('dblclick',function(){me.transfert($(this),me.listFrom);});     //IE
                        $(this.listTo).live('dblclick',function(){
                            me.transfert($(this).find(':selected'),me.listFrom);
                        });
					}else{
						//$("option",this.listTo).live('dblclick',function(){$(this).remove();});      //IE
                        $(this.listTo).live('dblclick',function(){
                            $(this).find(':selected').remove();
                        });
					}
					
			    }
				if(this.options.onlySingleTransfert)
                {
					$(".butAddAll",this.el).remove();
					$(".butRemAll",this.el).remove();
				}
                else
                {
					$(".butAddAll",this.el).click(function(){
                        me.transfert($("option",me.listFrom),me.listTo);

                    });
					$(".butRemAll",this.el).click(function(){
                        me.transfert($("option",me.listTo),me.listFrom);

                    });
				}
				$(".butAddOne",this.el).click(function(){
                    me.transfert($("option:selected",me.listFrom),me.listTo);
                });
                if(me.options.removeFirstListItems)
                {
                    $(".butRemOne",this.el).click(function(){
                        me.transfert($("option:selected",me.listTo),me.listFrom);
                    });
                }
                else
                {
                    $(".butRemOne",this.el).click(function(){
                        $("option:selected",me.listTo).remove();
                    });
                }

            }
		},
		extendOptions: function (options) {
			$.extend(true,this.options, options);
		},
		setOptions: function (options) {
			var o = this.options;
			this.extendOptions(options);
			if (o.disabled){
				this.disable();
			}
		},
        callback:function(obj_from,list_to){
            fn = this.options.callback;
            if($.isFunction(fn)){ fn(obj_from,list_to); }
        },
        beforeTransfert:function(obj_from,list_to){
            fn = this.options.beforeTransfert;
            if($.isFunction(fn)){return fn(obj_from,list_to); }else{return true;}
        },
		disable: function () {
			this.listFrom.attr("disabled","true");
			this.listTo.attr("disabled","true");
		},
		enable: function () {
			this.listFrom.removeAttr("disabled");
			this.listTo.removeAttr("disabled");
			
		},
		transfert:function(_in,_out){
			var me;
			me = this;
           if(me.beforeTransfert(_in,_out))
           {
			   $(_in).each(function (){
				   	  $(_out).append($(this).clone());
					  if(me.options.removeFirstListItems){
						  $(this).remove();
					  }
				  });
                // me.updateSelected();
                me.callback(_in,_out);
           }
		},
        updateSelected:function(){
            var me;
            me = this;
            me.hListTo.val("");

           $("option",me.listTo).each(function(){
               var curr_value=$(this).val();
               if(me.hListTo.val()==""){
                   me.hListTo.val(curr_value);
               }else{
                   me.hListTo.val(me.hListTo.val()+","+curr_value);
               }

            });
            alert(me.hListTo.val());
        },
		creaHeader:function(title){
            var header=$("<div/>").addClass("excHeader");
            if(title!="" || title !=null){
                header.append($("<p/>").html(title));
            }
            return header;
        },
		creaButtons:function(_buttons){
            var buttons=[];
            if(_buttons!=null){
                $.each(_buttons,function(k,v){
                    //alert(v.id+"-"+v.text);
                    if(typeof(v.event) != "undefined" || v.event!=""){
                        buttons.push($("<button>").attr("type","button").addClass("btn").attr("id",v.id).html(v.text).bind("click",v.event));
                    }else{
                        buttons.push($("<button>").attr("type","button").addClass("btn").attr("id",v.id).html(v.text));
                    }
                });
            }
			return buttons;
		},
        addOrder:function(){
            var $this=this;
            var dOrder,iUp,iDown;
            dOrder = $("<div>").addClass("excOrder");
            iUp =  $("<i>").addClass("icon-up");
            iDown = $("<i>").addClass("icon-down");
            dOrder.append(iUp,iDown);
            $(this.listTo).parent().append(dOrder);
            iUp.on("click",function(e){
                var t = $("option:selected",$this.listTo);
                var index = t.index()-1;
                $("option:eq("+index+")",$this.listTo).before(t);
            });
            iDown.on("click",function(e){
                var t = $("option:selected",$this.listTo);
                var index = t.index()+1;
                $("option:eq("+index+")",$this.listTo).after(t);
            });
        }
		
	};
	
} (jQuery));