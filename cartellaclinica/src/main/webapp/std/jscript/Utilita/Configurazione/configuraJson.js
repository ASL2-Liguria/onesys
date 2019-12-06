function update() {
	var sql = "declare x clob := q'{" +  $('textarea[name=txtareaValore]').val() + "}'; begin update " 
		+ $('input[name=txtschema]').val() + "." 
		+ $('input[name=txttabella]').val() + " set " + $('input[name=txtColonna]').val() +
	 	"=x where " + $('input[name=txtWhere]').val()+ "; end;";
		toolKitDB.executeQueryData(sql, callback);
	
}

function callback(res) {
	if (res==1) {
		alert('update eseguito correttamente');
	} else {
		alert (res);
	}
}