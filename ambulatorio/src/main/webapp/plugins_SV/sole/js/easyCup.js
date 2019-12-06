var NS_EASY_CUP = {
 //url:"http://192.168.104.30:8190/easycup/sso?",
  url:EASYCUP_SERVICES.URL_WEB,
  PRENOTA:function(_OBJ){
      NS_EASY_CUP.init(_OBJ);
  },
  init:function(_OBJ){
      NS_EASY_CUP.call(_OBJ);
  },
  call:function(_OBJ){
        var dataToSend="INPUT="+ JSON.stringify(_OBJ);
        jQuery.support.cors = true;
        //var _url= "http://192.168.3.222:7001/EASYCup";
        var _url= EASYCUP_SERVICES.URL_MIDDLEWARE;      
        jQuery.support.cors = true;
        $.ajax({
            url: _OBJ.url,
            data:"CALL="+_url+"&PARAM=userName=easycup::"+dataToSend,
            cache: false,
            type: "POST",
            crossDomain: false,
            async:false,
            dataType: 'json',
			timeout:1000,
            contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {
                var rp = JSON.stringify(resp);
                //LOGGER.write(rp);
                if(resp.RESPONSE.ESITO == "OK"){
                    DATA_SEND.tokenid = resp.RESPONSE.TOKEN;    
                }else{
                    alert(resp.RESPONSE.ERRORE);
                    return;
                }
                DATA_SEND.getMD5val();
                NS_EASY_CUP.open();
            },
            error: function (resp)
            {
                alert('Collegamento con EasyCup non disponibile');
            }
        });  
  },
  open:function(){
      window.open(NS_EASY_CUP.url+"tokenid="+DATA_SEND.tokenid+"&applicationname="+DATA_SEND.applicationname+"&checksum="+DATA_SEND.checksum,"EasyCup","");
  }
};

var DATA_SEND = {
    //applicationname:"ONESYS",
    applicationname:EASYCUP_SERVICES.applicationname,
    checksum:"",
    //key:"123456",
    key:EASYCUP_SERVICES.key,
    getMD5val:function(){
            dwr.engine.setAsync(false);
            var v_sql="select lower(get_md5_val('"+DATA_SEND.tokenid+DATA_SEND.applicationname+DATA_SEND.key+"')) from dual";
            toolKitDB.getResultData(v_sql,function(rs){
                DATA_SEND.checksum=rs[0];
            });
            dwr.engine.setAsync(true);
            
      }
};
