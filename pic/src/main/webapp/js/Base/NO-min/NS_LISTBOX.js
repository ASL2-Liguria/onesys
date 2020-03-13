var NS_LISTBOX = {
    //ValOrText VALUE or TEXT
    Options:null,
    cached:false,
    search:function(objList,String,filterType){
        NS_LISTBOX.cache(objList);
        NS_LISTBOX.filter(objList,String,filterType);
    },
    cache:function(objList){
        if(!NS_LISTBOX.cached){
            NS_LISTBOX.Options = $("option",objList).clone();
            NS_LISTBOX.cached = true;
        }
    },
    addItem:function(objList,option) {
        var $opt = $(option);
        $(objList).append($opt);
    },
    filter:function(objList,String,filterType) {
        objList.empty();
        if(filterType==null || filterType =="")filterType="descr";

        NS_LISTBOX.Options.each(function(k,v)
        {
            var c;
            switch (filterType.toLowerCase())
            {
                case "value" :
                    c = $(v).val();
                    break;
                case "descr":
                    c = $(v).text();
                    break;
                default :
                    c = $(v).attr(filterType);
                    break;
            }

            if(NS_LISTBOX.compare(c,String)) {
                NS_LISTBOX.addItem(objList,v);
            }

        });
    },
    compare:function(v,String){
         return (v.indexOf(String.toUpperCase())  != -1);
    },
    get_default:function(){
        return NS_LISTBOX.Options.clone();
    },
    set_new_default:function(objList){
        NS_LISTBOX.Options = $("option",objList);
        NS_LISTBOX.cached = true;
    },
    backDefault:function(objList){
        if(NS_LISTBOX.Options != null){
            objList.empty();
            objList.append(NS_LISTBOX.Options);
        }
    },
    backDefaultByList:function(List,objList){
        objList.empty();
        objList.append(List);
    }
};