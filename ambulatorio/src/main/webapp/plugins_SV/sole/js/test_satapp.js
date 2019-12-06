function satapp(){
    NS_SATAPP.init($("#operazione").val(),$("#v_iden_anag").val(),$("#num_pre").val(),$("#extra_db").val(),$("#reparto").val());
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||"";
}

function stp_init(){
    $("#operazione").val(getURLParameter("tipo_registrazione"));
    $("#v_iden_anag").val(getURLParameter("iden_anag"));
    $("#extra_db").val(getURLParameter("extra_db"));
    $("#reparto").val(getURLParameter("reparto"));
    $("#num_pre").val(getURLParameter("num_pre"));
}