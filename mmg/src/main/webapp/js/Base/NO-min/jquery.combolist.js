(function ($)
{
    function combolist(el, options, onAfter)
    {
        this.el = $(el);
        this.elOpt = this.el.find(".combolist_opts");
        this.elIcon = this.el.find(".combolist_icon");
        this.elText = this.el.find(".combolist_text");
        this.elVal = this.el.find(".combolist_val");
        this.options = options;
        this.onAfter = onAfter;
        this._init(options);
    }
    $.fn.ComboList = function (options, onAfter)
    {
        var defaults = {
            maxHeight:0,
            enabled: true,
            callback: null,
            onSelect:null,
            initEmpty:true, /*valore iniziale vuoto*/
            ncev:false,     /*not considerate equal value*/
            processOptions:null,
            opt_height:30 /*altezza delle option di default*/

        };
        var options = $.extend(
            {}, defaults, options);

        var plugin = new combolist(this.get(0), options, onAfter);
        $(this).data('ComboList', plugin);


        if (typeof onAfter == 'function')
        {
            onAfter.call({obj:this});
        }

        return plugin;

        //return new radiobox(this.get(0), options, onAfter)
    };
    combolist.prototype = {
        _init: function (options)
        {
            var $this = this;
            if(options.enabled)
                this.enable();
            else
                this.disable();

            if(options.maxHeight !=0)
                this.elOpt.height(options.maxHeight)
            if(this.elVal.val() !="")
                this.setValue($this.elVal.val());
            else if(!this.options.initEmpty)
            {
                this.setValue($this.elOpt.find("ul").find("li").first().attr("data-value"));
            }

            //this.addOptions([{"value":1,"descr":"a","altro":"mah"},{"value":2,"descr":"b","altro":"car"}],true);
            //this.disable();
        },
        _setEvents:function()
        {
            var $this = this;
            this.el.on("click",function(){
                if($this.elOpt.hasClass('combolist_opts_opened'))
                    $this.closeOptions();
                else
                    $this.openOptions();
            });

            this.elOpt.on("click","li",function(){
               //$this.selectOption($(this).data()); /*IE non va*/
                $this.selectOption(LIB.getDataAttributes(this));
            });
        },
        openOptions:function()
        {
            this._closeOptions($(".combolist_opts"));//chiudo tutte le combo aperte
            var cb_pos = this.el.position();
            var cb_w =  this.el.innerWidth();
            var cb_h =  this.el.outerHeight();
            var cb_opt_pos = {"top":cb_pos.top+cb_h,"left":cb_pos.left}
            this.elOpt.width(cb_w);
            this.elOpt.css(cb_opt_pos);
            this.elOpt.addClass('combolist_opts_opened');
            this.elOpt.show();
        },
        closeOptions:function()
        {
            this._closeOptions(this.elOpt);
        },
        _closeOptions:function(el){
            el.removeClass('combolist_opts_opened');
            el.hide();
        },
        _createOption:function(d){
            var $this = this;
            var opt = $("<li>");
            d = this._linearizeData(d);
            if($.isFunction(this.options.processOptions))
            {
                opt = this.options.processOptions(opt,d);
            }
            else
            {
                opt.text(d.descr);
            }
            opt.css({height:this.options.opt_height});
            $.each(d,function(k1,v1){
                opt.attr("data-"+k1,v1);
            });
            if(LIB.isValid(d.className)){
                opt.addClass(d.className);
            }
            return opt;
        },
        /*tutti i campi (non i valori) del json vengono linearizzati in minuscolo*/
        _linearizeData:function(d){
            $.each(d, function(i, v) {
                d[i.toLowerCase()] = v;
                delete d[i.toUpperCase()];
            });
            return d;
        },
        addOptions:function(arr,reset)    /*[{value,descr,altro,..},{},...]*/
        {
            var $this = this;
            var list = this.elOpt.find("ul");
            if(!list.length)list = this.elOpt.append($("<ul>"));
            if(reset)this.removeOptions();
            $.each(arr,function(k,v){
                list.append($this._createOption(v));
            });
        },
        appendOptions:function(arr)
        {
           this.addOptions(arr,false);
        },
        /*rimuove le opzioni che soddisfano il filtro */
        removeOption:function(filter){
            var list = this.elOpt.find("ul");
            if(!list.length){this.elOpt.append($("<ul>"));return 0;}
            var opt = list.find("li[data-"+filter+"]");
            opt.remove();
            return opt.length;

        },
        removeOptions:function(){
           var list = this.elOpt.find("ul");
           if(!list.length)list = this.elOpt.append($("<ul>"));
           list.empty();
           this.elText.val("");
           this.elVal.val("");
        },
        selectOption:function(rec,no_cbk)
        {
            var $this = this;
            this.elText.val(rec.descr);
            this.elVal.val(rec.value);
            if(!no_cbk && $.isFunction(this.options.onSelect)){this.options.onSelect.call($this,rec); }
        },
        getValue:function()
        {
          return this.elVal.val();
        },
        getAttribute:function(id)
        {
            var list = this.elOpt.find("ul");
            var obj = list.find("li[data-value='"+ this.elVal.val()+"']");
            if(obj.length)return obj.attr("data-"+id);
        },
        setValue:function(value,no_cbk)
        {
            if(this.options.ncev && (value == this.getValue()))return; // se il valore è già selezionato e ho ncev non faccio nulla
            var list = this.elOpt.find("ul");
            var obj =list.find("li[data-value='"+value+"']");
            if(obj.length)
                /*this.selectOption(obj.data(),no_cbk); Non va su IE*/
                this.selectOption(LIB.getDataAttributes(obj[0]),no_cbk);
        },
        setFirstEmpty:function(){
            var list = this.elOpt.find("ul");
            if(list.length)list.prepend($("<li>",{'data-value':'','data-descr':''}).css({'height':'26px'}));
        },
        getDescr:function()
        {
            return this.elText.val();
        },
        disable:function()
        {
            this.el.off();
            this.elOpt.off();
            this.elIcon.hide();
        },
        enable:function()
        {
            this._setEvents();
            this.elIcon.show();
        }

    }
}(jQuery));


var COMBOLIST ={
    /*param :{id:,cmbOpt,opt:[{descr,value,...},{}],callback}*/
    crea:function(param){
        var $combo = $("<div>",{"id":param.id}).addClass("combolist");
        var $combo_ih = $("<input>",{"type":"hidden"}).addClass("combolist_val");
        var $combo_txt = $("<input>",{"type":"text","disabled":"disabled"}).addClass("combolist_text");
        var $combo_i = $("<i>").addClass("icon-down-dir-1 combolist_icon");
        var $combo_opt = $("<div>").addClass("combolist_opts").append( $("<ul>"));
        $combo.append($combo_ih,$combo_txt,$combo_i,$combo_opt);
        var cmb = $combo.ComboList(param.cmbOpt);
        if(typeof param.opt =="object") cmb.addOptions(param.opt);
        if(param.opt_selected) cmb.setValue(param.opt_selected);
        if($.isFunction(param.cbk))param.cbk(cmb);
        return $combo;
    }
}