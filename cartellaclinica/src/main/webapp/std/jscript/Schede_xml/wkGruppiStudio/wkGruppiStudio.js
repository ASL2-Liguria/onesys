/* WK_GRUPPI_STUDIO */
var WK_GRUPPI_STUDIO = {

	rimuovi : function() {
		if (confirm("Confermi la rimozione del paziente dal gruppo?")) {
			var iden_membro = stringa_codici(array_iden_membro);
			var iden_gruppo = stringa_codici(array_iden_gruppo);

			var resp = top.executeStatement('gruppi.xml', 'removeMembro', [iden_membro, 'ANAG', iden_gruppo, top.baseUser.IDEN_PER]);

			if (resp[0] == 'KO') {
				alert(resp[1]);
			} else {
				parent.FILTRO_WK_GRUPPI_STUDIO.applica_filtro_gruppi_studio();
			}
		}
	}

};
