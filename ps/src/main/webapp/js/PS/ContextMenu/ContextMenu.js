var FRASI_STD_MENU = {

    "menu": {
        "id": "MENU_FRASI_STD",
        "structure": {
            "list": [
                {
                    "id": "apriFrasiStdRefertazione",
                    "concealing": "true",
                    "link": function (rec) {
                        home.RIFERIMENTO_VERBALE = window;
                        home.NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=FRASI_STD_REFERTAZIONE&ELEMENTO_SELEZIONATO='
                            + rec.elemento+'&PAGINA_APERTURA='+rec.pagina, id: 'FrasiStdRefertazione', fullscreen: true});
                    },
                    "enable": "S",
                    "url_image": "./img/CMenu/modifica.png",
                    "where": function (rec) { return (rec!==undefined); },
                    "output": "traduzione.lblFrasiStdRef",
                    "separator": "false"
                }
                /*{
                    "id": "apriFrasiStdInserimento",
                    "concealing": "true",
                    "link": function (rec) {
                        alert("elemento : "+rec.elemento+"\npagina : " + rec.pagina);
                    },
                    "enable": "S",
                    "url_image": "./img/CMenu/aggiungi.png",
                    "where": function (rec) { if(rec!==undefined) return true; },
                    "output": "traduzione.lblInsFrasiStd",
                    "separator": "false"
                }*/
            ]
        },
        "title": "traduzione.lblMenu",
        "status": true
    }

};