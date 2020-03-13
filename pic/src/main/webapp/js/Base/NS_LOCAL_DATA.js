NS_LOCAL_DATA={

    init:function(){
        this.DATA = new $.Map();
    },
    getData:function(id,param,cbk){
        var data = this.DATA.getValue(id);
        if(data)
           cbk(data);
        else
            this._getDataFromDB(id,param,cbk)

    },
    _getDataFromDB:function(id,param,cbk){
        var db = $.NS_DB.getTool();
        var xhr = db.select(
            {
                datasource: param.datasource,
                id:param.id,
                parameter: param.bind
            });

        xhr.done(function(response){

            response.p_result;
            _getData(o);

        });
        xhr.fail(function(response){
            console.error(response);
        });
    },
    setData:function(id,data){

    },
    clear:function(id){

    },

    _getData: function(data){
        return data;
    }
}


