var SALVATAGGIO = {
	getDatiSuggerita: function(v_tipo, n_iden) {
		home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
			id:'SP_GET_SUGGERITA_DATI',
			parameter: {
				v_tipo					: { v : v_tipo, t : 'V'},
				n_iden					: { v : n_iden, t : 'N'},
				n_iden_suggeritore		: { v : null, t : 'N' , d: 'O'},
				v_descr_suggeritore		: { v : null, t : 'V' , d: 'O'},
				v_struttura_suggeritore	: { v : null, t : 'V' , d: 'O'}
			}
		}).done( function(resp) {
			$("#h-txtSuggerito_da").val(resp.n_iden_suggeritore);
			$("#txtSuggerito_da").val(resp.v_descr_suggeritore);
			$("#txtSuggerito_struttura").val(resp.v_struttura_suggeritore);
		}).fail( function(resp) {
			console.error(resp);
		});
	}
};
