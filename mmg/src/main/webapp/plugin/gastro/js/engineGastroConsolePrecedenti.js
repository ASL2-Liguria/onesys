$(document).ready(function()
{
	$("#txtReferto").removeClass("ui-input-text");	
	$("#iFrameWk").attr("src","../../servletGenerator?KEY_LEGAME=VIEW_WK_PREC&WHERE_WK=IDEN_ANAG=" + window.location.toString().split("=")[1]);
});
