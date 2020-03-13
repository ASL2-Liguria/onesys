var DATE = {

    /**
     * @param param {from:{date,format},to:{date,format}}
     *
     * @return Object  {anni,mesi,giorni}
     */
    diff:function(param)
    {
        var f,t;
        if(typeof(param.from)=="undefined"){/*return errorCapture({msg:"Unspecified param: from:{}",ret:null});}else{f=this.getData(param.from);*/}
        (typeof(param.to)=="undefined")?t=moment():t=this.getData(param.to);
        return {anni:t.diff(f,"years"),mesi:t.diff(f,"month"),giorni:t.diff(f,"days")};

    },
    /**
     * @param param {date,format}  default format: YYYYMMDD
     *
     * @return Boolean true if date is valid else false
     */
    isValid:function(param)
    {
        return this.getData(param).isValid();
    },
    /**
     * @param param {date,format,format_out}
     *
     * @return  Date formatted
     */
    format:function(param)
    {
        if(typeof(param.format_out)=="undefined"){param.format_out="DD/MM/YYYY";/*return errorCapture({msg:"Unspecified param: format_out",ret:null});*/}
        return this.getData(param).format(param.format_out);
    },
    /**
     *  USE INTERNAL!!!
     * @param param {date,format}
     *
     * @return  Date
     */
    getData:function(param)
    {
        if(typeof(param.date)=="undefined"){ return moment();/*return errorCapture({msg:"Unspecified param: date",ret:null});*/}
        if(typeof(param.format)=="undefined"){param.format="YYYYMMDD";}
        var d=moment(param.date,param.format);
        //if(!d.isValid()){return errorCapture({msg:"Invalid Date",ret:null,block:true});}  //PENSARE        <== ???????????
        return d;
    },

    /**
     * @param param {date,format} Date
     *
         * @return Object  {anno,mese,giorno}
     */
    toJson:function(param)
    {
        var d= this.getData(param);
        var j={anno:d.year(),mese:d.month()+1,giorno:d.date()}
        return j;
    },

    fromNow:function(param)
    {
        var d= this.getData(param);
        var t=moment();
        //W.I.P
    },

    getOggiYMD: function()
    {
        return moment().format('YYYYMMDD');
    },
    getOraHHmm: function()
    {
        return moment().format('HH:mm');
    },

    setEventDataOggi: function (param)
        /*{
         [lblSorgente]		id della td alla quale applicare l'evento "click" per impostare la data odierna
         [txtDestinazione]	input text dove salvare la data
         [hDestinazioneIso]	Input hidden dove salvare la data in formato iso
         }*/
    {
        $("#" + param.lblSorgente).addClass("clickToOggi");

        $("#" + param.lblSorgente).on("click", function ()
        {
            var datapicker = $("#" + param.txtDestinazione).data('Zebra_DatePicker');
            datapicker.setDataIso(DATE.getOggiYMD());
        });
    }

}