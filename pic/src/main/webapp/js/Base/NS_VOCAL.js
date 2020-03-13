/*
 File: NS_VOCAL.js
 Autore: jack
 */

var NS_VOCAL =
{
    createObject: function(params){},          /* Funzione che crea l'elemento object e lo inserisce nel target (configurato nel params) */
    setCallbacks: function(params){},          /* Funzione per settare le callback in base agli eventi del componente vocale */
    init: function(params){},                  /* Funzione per inizializzare il componente */
    setup: function(params){},                 /* Funzione per settare i parametri al componente */
    isActive: function(){ return false; },     /* Funzione per vedere se il vocale è attivo o no */
    start: function(){},                       /* Funzione per avviare la dettatura del referto */
    isStarted: function(){ return false; },    /* Funzione per vedere se il vocale sta scrivendo o no */
    stop: function(){},                        /* Funzione per stoppare la dettatura del referto */
    setPosition: function(pos){},              /* Funzione per posizionare il cursore per poi applicarci il write (solo per casi speciali) */
    writeText: function(txt){}                 /* Funzione per inserire il testo ovunque serve */
};

/*******************************************************************************************************************************************************************************************/
var NS_VOCAL_GST =
{
    objectVocal: null,
    clientID: -1,
    callbacks: {},

    logger:
    {
        info: function(txt){},
        warn: function(txt){},
        error: function(txt){},
        clean: function(){}
    },

    flags:
    {
        vocal      : false, /* Indica lo stato del vocale in generale (se l'init è andato a buon fine) */
        profile    : false, /* Indica se il profilo è stato caricato o no */
        recognizer : false, /* Indica se il vocale sta scrivendo o no */
        stopping   : false  /* Indica se si sta interrupendo o no la dettatura */
    },

    enumCommand:
    {
        'Null'                      : 0,
        'Initialize'                : 1,
        'Deinitialize'              : 2,
        'LoadUser'                  : 3,
        'CreateNewDocument'         : 4,
        'DeleteDocument'            : 5,
        'ActiveDocument'            : 6,
        'InitializeRecognizer'      : 7,
        'PlayDocument'              : 8,
        'ActiveRecognizer'          : 9,
        'ActiveClient'              : 10,
        'ClientTextChanged'         : 11,
        'ClientMoveCursor'          : 12,
        'GetDocumentText'           : 13,
        'SetDocumentText'           : 14,
        'SaveRecording'             : 15,
        'ActivateClient'            : 16,
        'SetEngineParam'            : 17,
        'GetEngineParam'            : 18,
        'Reset'                     : 19,
        'ShowAlternatives'          : 20,
        'CtrlGrammar'               : 21,
        'GetGrammarsList'           : 22,
        'GetCommandsList'           : 23,
        'GetConceptsList'           : 24,
        'CtrlConcept'               : 25,
        'SaveDocument'              : 26,
        'LoadDocument'              : 27,
        'ShowHelp'                  : 28,
        'ShowMacro'                 : 29,
        'StopPlay'                  : 30,
        'UpdateSayAndSelect'        : 31,
        'AudioWizard'               : 32,
        'SetAlternative'            : 33,
        'SaveUserData'              : 34,
        'LoadModeScript'            : 35,
        'QueryData'                 : 36,
        'UpdateDocumentText'        : 37,
        'GetAlternativesCount'      : 38,
        'GetAudioQuality'           : 39,
        'GetUnprocessedAudioLength' : 40,
        'ActiveMode'                : 41,
        'GetState'                  : 42,
        'GetHelpContext'            : 43,
        'ArchiveDocument'           : 44,

        'Connected'                 : 50,
        'Disconnected'              : 51,
        'SetParam'                  : 52,
        'GetParam'                  : 53,
        'DownloadFile'              : 54,
        'UploadFile'                : 55,
        'CheckWord'                 : 56,
        'CreateMacro'               : 57,

        'OnAudioLevel'              : 100,
        'OnCommand'                 : 101,
        'OnDeviceEvent'             : 102,
        'OnError'                   : 103,
        'OnMacro'                   : 104,
        'OnPseudoDocText'           : 105,
        'OnText'                    : 106,
        'OnSayAndSelect'            : 107,
        'OnStateChange'             : 108,
        'OnPlay'                    : 109,
        'OnReconnectionRequired'    : 110,

        /* Integrazione Elco */
        'LoadUserProfile'           : 201,
        'SetText'                   : 202,
        'SetActiveRecognizer'       : 203,
        'SetActiveMode'             : 204,

        'SetIdleMode'               : 205,
        'SetCommandAndControlMode'  : 206,
        'SetDictationMode'          : 207,

        'Log'                       : 500
    },

    enumType:
    {
        'Command'      : 0,
        'Event'        : 1,
        'SetProperty'  : 2,
        'GetProperty'  : 3,
        'Internal'     : 4
    },

    enumRecognizer:
    {
        'Idle'              : 0,
        'CommandAndControl' : 1,
        'Dictation'         : 2,
        'Spelling'          : 3
    },

    enumCodeError:
    {
        'ok'                      : 0,        /* OK */
        'engineState'             : -100,     /* Stato engine non valido */
        'engineNull'              : -1001,    /* Engine non istanziato */
        'engineInvalidCommand'    : -1002,    /* Comando ricevuto da client non riconosciuto */
        'engineInvalidParams'     : -1003,    /* Parametri del comando non validi */
        'engineProcException'     : -1004,    /* Eccezione nell'elaborazione */
        'engineFileNotFound'      : -1005,    /* File non trovato : es. macro */
        'engineNotInitialized'    : -1006,    /* Non è stata fatta la Initialize */
        'engineUnableToSetValue'  : -1008,    /* Impossibile assegnare il valore alla proprietà */
        'engineNotActiveClient'   : -1010,    /* Solo client attivo può fare questa richiesta */
        'engineInvalidCommUnit'   : -1100,    /* Modulo comunicazione non valido */
        'socketException'         : -1110,    /* Eccezione socket */
        'socketNotConnected'      : -1111,    /* Socket non connesso */
        'socketConnectionFailed'  : -1112,    /* Connessione socket fallita */
        'engineIsProperty'        : -2000,    /* Indica che il comando è considerato come proprietà e non deve inviare risposta al client */
        'engineInvalidDoc'        : -3000,    /* ID Documento non valido */
        'fileArchiveError'        : -4000,    /* Impossibile creare archivio zip per differita */
        'fileCopyError'           : -4001     /* Copia archivio differita fallita */
    },

    setClientID: function(id)
    {
        this.clientID = id;
        this.flags.vocal = id > 0;

        if(this.flags.vocal && this.callbacks['afterClientID'] instanceof Function)
            this.callbacks['afterClientID']();

    },

    createFrameData: function(name, type, params)
    {
        return  {
            'Name'  : name,
            'Type'  : type,
            'par'   : params
        }
    },

    createMessage: function(name, type, params)
    {
        return "<FRAME>" + JSON.stringify(this.createFrameData(name, type, params)) + "</FRAME>";
    },

    sendMessage: function(message)
    {
        return this.objectVocal.executeCommand('vocal.send', [message]);
    },

    response: function(msg)
    {
        var json = {};
        eval('json = ' + msg);

        switch(json.Name)
        {
            case this.enumCommand.LoadUserProfile:
                /* Evento che indica che il caricamento del profilo è terminato */
                this.flags.profile = json.Type == this.enumType.Command && json.par[2] == this.enumCodeError.ok;

                break;

            case this.enumCommand.SetActiveRecognizer:
                /* Evento che indica che il client è attivo per scrivere */

                this.flags.recognizer = json.Type == this.enumType.Command && json.par[3] == this.enumCodeError.ok && !this.flags.stopping;

                break;

           /* case this.enumCommand.OnText:
                if(json.Type == this.enumType.Event) /* Evento di scrittura
                    //this.writeText(json.par[2]);

                break;
                */
            default:
            /* void */
        }

        /* TODO: da vedere se metterlo nel defaul dello switch o no... */
        if(typeof this.callbacks[json.Name + '_' + json.Type] == 'function')
        {
            this.logger.info('Esecuzione callback "' + json.Name + '_' + json.Type + '", parametro: ' + json.par.join());
            this.callbacks[json.Name + '_' + json.Type](json.par);
        }
    },

    loadProfile: function(params)
    {
        params = $.extend({}, {language: 38, dictionary: 'Radiologia', usercode: 'default', channel: '1'}, LIB.isValid(params) ? params : {});

        return this.sendMessage(this.createMessage(this.enumCommand.LoadUserProfile, this.enumType.Command, [this.clientID, params.language, params.dictionary, params.usercode, params.channel]));
    },

    activeRecognizer: function()
    {
        return this.sendMessage(this.createMessage(this.enumCommand.SetActiveRecognizer, this.enumType.Command, [this.clientID, 1, this.enumRecognizer.Dictation]));
    },

    deactiveRecognizer: function()
    {
        return this.sendMessage(this.createMessage(this.enumCommand.SetActiveRecognizer, this.enumType.Command, [this.clientID, 1, this.enumRecognizer.Idle]));
    },

    setupRemoteAudio: function(ip, port)
    {
        return this.objectVocal.executeCommand('audio.setAddressRemote', [ip, port]);
    },

    /* Override */
    createObject: function(params)
    {
        params = $.extend(true, {},
            {
                target:  $(document),
                name:    'fenixVocal',
                type:    'application/x-java-applet',
                width:   10,
                height:  10,


                param:
                {
                    archive:         'app/vocal/FenixVocal.jar',
                    code:            'it.elco.multimedia.vocal.FenixVocal.class',
                    java_version:    '1.7+',
                    java_arguments:  '-Ddeployment.logging=true -Ddeployment.trace=true -Djava.util.logging.config.class=it.elco.multimedia.vocal.logger.FenixLoggerConfig',
                    targetPage:      '_self',
                    config:          '',
                    initOnStart:     'N',
                    openConsoleTest: 'N',
                    separate_jvm:    true
                }
            }, params);

        if(typeof document[params.name] == 'undefined')
        {
            /*var html = $($.createElement('applet').attr({name: params.name, id: params.name, type: params.type, width: params.width, height: params.height}));
            var param;

            for (param in params.param)
            {
                html.append($($.createElement('param')).attr({name: param, value: params.param[param]}));
            }

            $(params.target).append(html);*/
			var html = "<object id=\"" + params.name + "\" name=\"" + params.name + "\" width=\"10\" type=\"application/x-java-applet\" height=\"10\">";
			html += "<param name=\"archive\" value=\"" + params.param.archive + "\">";
			html += "<param name=\"code\" value=\"" + params.param.code + "\">";
			html += "<param name=\"targetPage\" value=\"" + params.param.targetPage + "\">";
			html += "<param name=\"config\" value=\"" + params.param.config + "\">";
			html += "<param name=\"initOnStart\" value=\"" + params.param.initOnStart + "\">";
			html += "<param name=\"openConsoleTest\" value=\"" + params.param.openConsoleTest + "\">";
			html += "<param name=\"separate_jvm\" value=\"true\">";
			html += "</object>";
			$(params.target).append(html);

            this.objectVocal = document[params.name];
        }

        return true;
    },

    /* Override */
    setCallbacks: function(params)
    {
        if(LIB.isValid(params))
        {
            this.callbacks = $.extend(this.callbacks, params);

            return true;
        }

        return false;
    },

    /* Override */
    init: function(params)
    {
        try
        {
            home.NS_CONSOLEJS.addLogger({name: 'NS_VOCAL_GST', console: 0});

            this.logger = home.NS_CONSOLEJS.loggers['NS_VOCAL_GST'];
        }
        catch(ex)
        {}

        NS_VOCAL_GST.createObject(params);

        return this.objectVocal.executeCommand('vocal.init') == 'OK';
    },

    /* Override */
    setup: function(params)
    {
        if(this.flags.vocal)
            return this.loadProfile(params);

        return false;
    },

    /* Override */
    isActive: function()
    {
        return this.flags.vocal;
    },

    /* Override */
    start: function()
    {
        if(this.flags.vocal && this.flags.profile && !this.flags.recognizer)
        {
            this.flags.stopping = false;

            this.activeRecognizer();

            return true;
        }

        return false;
    },

    /* Override */
    isStarted: function()
    {
        return this.flags.recognizer && !this.flags.stopping;
    },

    /* Override */
    stop: function()
    {
        if(this.flags.vocal && this.flags.profile && this.flags.recognizer && !this.flags.stopping)
        {
            this.flags.stopping = true;

            this.deactiveRecognizer();

            return true;
        }

        return false;
    }
};