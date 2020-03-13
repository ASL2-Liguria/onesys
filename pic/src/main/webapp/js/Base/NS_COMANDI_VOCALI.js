var comandi_vocale = [
    [/consulta prenotazione/gi , "NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=CONSULTA_PRENOTAZIONE', id: 'CONSULTA_PRENOTAZIONE', fullscreen: false});"],
    [/camera calda/gi , "NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=PICCOLO_CHIMICO', id: 'PICCOLO_CHIMICO', fullscreen: false});"],
    [/saluta/gi , "NS_COMANDI_EXECUTE.parla('Buongiorno a tutti');"],
    [/\*/gi , "NS_COMANDI_EXECUTE.parla('Usa un linguaggio consono al tuo posto di lavoro');"],
    [/ricerca paziente/gi, "NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=WORKLIST&TAB_ATTIVO=filtroRicPazCognNomeData&MSG=' + msg, id: 'WORKLIST', fullscreen: false})" ],
    [/work list/gi,  "NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=WORKLIST&TAB_ATTIVO=filtroWk&MSG=' + msg, id: 'WORKLIST', fullscreen: false})" ],
    [/pannello notifiche/gi , "NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=PANNELLO_NOTIFICHE', id: 'PANNELLO_NOTIFICHE', fullscreen: true});"],
    [/statistiche/gi , "NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=PENTAHO', id: 'PENTAHO', fullscreen: true});"],
    [/riepilogo/gi , "NS_COMANDI_VOCALI.parla('" + baseUser.DESCRIZIONE.split(/ /gi)[2] + " oggi hai refertato 5 esami. Di questi ne hai firmati 4')"]
];

$(document).ready(function(){
    NS_COMANDI_VOCALI.init();
})

var NS_COMANDI_VOCALI= {
    NS_COMANDI_EXECUTE: null,
    init: function () {
        if (bowser.name == 'Chrome') {
            NS_COMANDI_EXECUTE = NS_COMANDI_VOCALI_CHROME;
            NS_COMANDI_EXECUTE.init();
        }
        else if (bowser.name == 'Internet Explorer') {
            NS_COMANDI_EXECUTE = NS_COMANDI_VOCALI_VUOTO;
            NS_COMANDI_EXECUTE.init();
        } else if (bowser.name == 'Firefox') {
            NS_COMANDI_EXECUTE = NS_COMANDI_VOCALI_VUOTO;
            NS_COMANDI_EXECUTE.init();
        } else if (bowser.name == 'Safari') {
            NS_COMANDI_EXECUTE = NS_COMANDI_VOCALI_SAFARI;
            NS_COMANDI_EXECUTE.init();
        } else {
            NS_COMANDI_EXECUTE = NS_COMANDI_VOCALI_VUOTO;
            NS_COMANDI_EXECUTE.init();
        }

        NS_COMANDI_EXECUTE.setEvents()
        var n=Math.floor((Math.random() * 10) + 1)+1;
        var nome = baseUser.DESCRIZIONE.split(/ /gi);
       // NS_COMANDI_EXECUTE.parla("buongiorno " + nome[nome.length-1] + ". hai ancora " + n + " referti da firmare");
    },
    ascolta: function (cbk) {
        NS_COMANDI_EXECUTE.ascolta(cbk)
    } ,
    parla: function (mess) {
        NS_COMANDI_EXECUTE.parla(mess)
    }  ,


    apriPagina: function (msg) {
        // console.log('entra in Apri pagina con msg = '+msg);
        var find = false;
        if (msg != "" && msg != null) {
            $.each(comandi_vocale, function (k, v) {

                if (msg.match(v[0])) {
                    eval(v[1]);
                    find = true;
                }


            })
            if (!find) {
                NS_COMANDI_VOCALI.parla("Comando Non Trovato");
            }

        } else {
            return
        }
    }
}

var NS_COMANDI_VOCALI_VUOTO={

    init: function()       {return;},
    parla:  function(mess) {return;},
    ascolta : function(cbk){return;},
    setEvents: function () {return;}

}

var NS_COMANDI_VOCALI_CHROME = {

    init: function () {
        NS_COMANDI_VOCALI_CHROME.$this = this;
        NS_COMANDI_VOCALI_CHROME.SPEECH = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        NS_COMANDI_VOCALI_CHROME.SPEECH.voice = voices[10]; // Note: some voices don't support altering params
        NS_COMANDI_VOCALI_CHROME.SPEECH.voiceURI = 'native';
        NS_COMANDI_VOCALI_CHROME.SPEECH.volume = 1; // 0 to 1
        NS_COMANDI_VOCALI_CHROME.SPEECH.rate = 1; // 0.1 to 10
        NS_COMANDI_VOCALI_CHROME.SPEECH.pitch = 2; //0 to 2
        NS_COMANDI_VOCALI_CHROME.SPEECH.lang = 'it-IT';
    },

    setEvents: function () {
        //Mousetrap.bind('ctrl+alt+k',function(){NS_COMANDI_VOCALI_CHROME.ascolta(NS_COMANDI_VOCALI_CHROME.apriPagina)});
        NS_COMANDI_VOCALI_CHROME.ascolta(NS_COMANDI_VOCALI.apriPagina)

    },

    parla: function (mess) {

        //  console.log(NS_COMANDI_VOCALI_CHROME);
        NS_COMANDI_VOCALI_CHROME.SPEECH.text = mess;
        window.speechSynthesis.speak(NS_COMANDI_VOCALI_CHROME.SPEECH);
    },

    ascolta: function (cbk) {
        if (cbk == null)
        {
            cbk=NS_COMANDI_VOCALI.apriPagina;
        }
        var recognition = new webkitSpeechRecognition();
        recognition.lang = "it";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = function (event) {
            var final_transcript = "";
            var interim_transcript = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {

                if (event.results[i].isFinal) {
                    final_transcript = event.results[i][0].transcript;
                    // console.log(final_transcript);
                    //recognition.stop();
                    if(final_transcript.match(/fenix/gi) || final_transcript.match(/felix/gi))
                        cbk(final_transcript)
                }
            }

            return;

        }
        recognition.start();
    }
}

var NS_COMANDI_VOCALI_SAFARI = {

    init: function () {
        NS_COMANDI_VOCALI_SAFARI.$this = this;
        NS_COMANDI_VOCALI_SAFARI.SPEECH = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        NS_COMANDI_VOCALI_SAFARI.SPEECH.volume = 1; // 0 to 1
        NS_COMANDI_VOCALI_SAFARI.SPEECH.rate   = 1; // 0.1 to 10
        NS_COMANDI_VOCALI_SAFARI.SPEECH.pitch  = 1; //0 to 2
        NS_COMANDI_VOCALI_SAFARI.SPEECH.lang   = 'it-IT';
    },

    setEvents: function () {
        //Mousetrap.bind('ctrl+alt+k',function(){NS_COMANDI_VOCALI_CHROME.ascolta(NS_COMANDI_VOCALI_CHROME.apriPagina)});
        // NS_COMANDI_VOCALI_CHROME.ascolta(NS_COMANDI_VOCALI.apriPagina)
        return;
    },

    parla: function (mess) {

        //console.log(NS_COMANDI_VOCALI_SAFARI);
        NS_COMANDI_VOCALI_SAFARI.SPEECH.text = mess;
        window.speechSynthesis.speak(NS_COMANDI_VOCALI_SAFARI.SPEECH);
    },

    ascolta: function (cbk) {
        /*creo un area di testo nascosta */
        $('.audioNascosto').remove();
        var testoAudio = $('<div></div>').attr('style','float:left; height:24px').attr('id','audioHidden').addClass('audioNascosto');
        var casellaTesto = $(document.createElement('input')).attr('id','audioNascosto').attr('type','text');
        casellaTesto.on('keyup',function(){
            //console.log('evento change sul casella di testo' + $("#audioNascosto").val());
            setTimeout("NS_COMANDI_VOCALI_SAFARI.elaboraAscolta()",2000)
        })

        testoAudio.append(casellaTesto);
        $('#miniMenu').append(testoAudio);
        $('#audioNascosto').focus();
        return;
    },
    elaboraAscolta: function ()
    {
        //console.log('entra in elaboraAscolta audionascosto.val() ' + $("#audioNascosto").val());
        NS_COMANDI_VOCALI_SAFARI.apriPagina($("#audioNascosto").val());

    } ,
    apriPagina: function (msg) {
        //console.log('entra in Apri pagina con msg = '+msg);
        var find = false;
        if (msg != "" && msg != null) {
            $.each(comandi_vocale, function (k, v) {

                if (msg.match(v[0])) {
                    eval(v[1]);
                    find = true;
                }


            })
            if (!find) {
                NS_COMANDI_VOCALI.parla("Comando Non Trovato");
            }
            else
            {
                $("#audioNascosto").val("");
                $("#audioHidden").remove();

            }

        } else {
            return
        }
    }
}