/*
 * Libreria per l'interazione ad elementi offline da parte della parte online
 */
var OFFLINE_LIB = {
		
		isAttivo: function() {
			return OFFLINE_LIB.parametroAttivoSuPC('OFFLINE_ATTIVO');
		},
		
		parametroAttivoSuPC: function(parametro) {
			var parametro_attivo=LIB.getParamUserGlobal(parametro,'N');
			var attivo;
			
			if (parametro_attivo != "N") {
				if (parametro_attivo == "S") {
					attivo = true;
				} else {
					try {
						attivo = JSON.parse(parametro_attivo)[basePC.IP]=="S";
					} catch (e) {
						console.error(e);
						attivo = false;
					}
				}
			}
			
			return attivo;
		},
		
		sincronizzazioneAutomatica: function() {
			return OFFLINE_LIB.parametroAttivoSuPC('OFFLINE_AUTOSYNC');
		},
		
		sincronizzazioneGruppo: function() {
			return OFFLINE_LIB.parametroAttivoSuPC('OFFLINE_SINCRONIZZA_GRUPPO');
		},
		
		getUrl: function() {
			return 'page?KEY_LEGAME=OFFLINE&UTENTE=' + home.baseUser.USERNAME;
		}
		
}