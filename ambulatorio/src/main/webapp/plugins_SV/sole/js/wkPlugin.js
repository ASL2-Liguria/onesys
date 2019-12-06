(function ($) {
    
        $.worklistDynamic = function (options) {

            var defaults = {
                   idTable:"oTableDyn",
                   trClass:"trTable",
                   arrayData:new Array(),
                   arrayTrAttribute:new Object(),
                   arrayColumnsData:new Array(),
                   jSonColumns:new Object(),
                   objAppend:null,
                   arrayProcessClass:new Array(),
                   callBack:null,
				   sortname:""
            };

            options = $.extend(defaults, options);
            return new WorklistDynamic(options);
        };

        function WorklistDynamic(opt) {

            this.options = opt;
            this.init(opt);
            this.setEvents(opt);

            return this;
        };
        
        WorklistDynamic.prototype = {
          init:function(opt){
                var $this = this;
                $this.createTable(opt);
                eval(opt.callBack);
          },
          setEvents:function(opt){
              
          },
          createTable:function(opt){
              var $table = $(document.createElement("table")).attr("id",opt.idTable);
              $.each(opt.arrayData,function(k,v){
                  var $tr = $(document.createElement("tr")).addClass(opt.trClass);
                  $.each(opt.arrayTrAttribute[k],function(att,val){
                      $tr.attr(att,val);
                  });
                  $.each(v,function(k1,v1){
                      $.each(opt.arrayColumnsData,function(pos,name){
                         if(name == k1) {
                             var $td = $(document.createElement("td"));
                             $td.attr("name_col",k1);
                             $td.html(v1);
                             $.each(opt.arrayProcessClass,function(ind,obj){
                                 if(obj.COLUMN == name){
                                     eval(obj.FUNCTION($td,v));
                                 }
                             });
                             $tr.append($td);
                             return false;
                         }
                      });
                  });
                  $table.append($tr);
              });
    
              $(opt.objAppend).append($table);
              var _width=0;
              $.each(opt.jSonColumns,function(k,v){
                     _width = _width + v.width;
              });
              _width = resizeW(_width);
			  var singleSel;
			  if (opt.singleSelect) singleSel = opt.singleSelect;
			  else singleSel = false;
            $table.flexigrid({dataType:"json",colModel:_Model,
                    usepager: false,
                    useRp: true,
                    rp: 15,
                    nowrap: false  ,
                    showTableToggleBtn: false,
                    width: _width,
                    height: 250,
					sortorder: "asc",
					sortname:opt.sortname,
					singleSelect: singleSel
                    }
                );
                
              function getDocWidth(){
                    return $(document).width();
              }
              
              function resizeW(w_tot_page){
                  if(w_tot_page > getDocWidth()){
                      return getDocWidth();
                  }else{
                      w_tot_page = w_tot_page + (getDocWidth() - w_tot_page- 22) ;
                      return w_tot_page;
                  }
              }
          }
        };

})(jQuery);