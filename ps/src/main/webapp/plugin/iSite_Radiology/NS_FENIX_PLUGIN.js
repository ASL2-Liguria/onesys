// http://192.168.3.116:8081/fenix/plugin/iSite_Radiology/FenixPlugin.html

window.name = "plugin";

var debug = false;

var _DICOM_TAG_ACC_NUM = "00080050";	// Accession Number Dicom Tag

var iSiteCurrentUser = "";
var winFenix = null;
var accessionNumber = null;
var OpenAccessionNumber = new Object();
var ActiveCanvasPage="";
var canvasPage = null;
var OPEN_IMAGE=true;

var NS_FENIX_PLUGIN = {

    //	Richiamata all'apertura della pagina NS_FENIX_PLUGIN.html (plugin in iSite aperto alla login di iSite)
    //	Apre in una nuova finestra Fenix in autoLogin con l'utente di iSite
    LOGGER : null,
    init:function()
    {
        NS_CONSOLEJS.init();
        NS_CONSOLEJS.addLogger({name: 'isite', console: 0});
        this.LOGGER = NS_CONSOLEJS.loggers["isite"];
        iSiteCurrentUser = (debug) ? 'polaris' : Radiology.GetCurrentUser();
        try{
            iSiteCurrentUser= AppLogin.GetUserName();
        }
        catch(e)
        {;}
        Radiology.AddShelfMenuItem('Fenix');
        NS_FENIX_PLUGIN.apriFenix();
    },
    getScreenInfo:function()
    {
        var SInfo=  eval(AppLogin.getScreenResolution());
        this.LOGGER.warn('Screen Info : ' +JSON.stringify(SInfo))
        return SInfo;
    },
    //	Apre Fenix in una nuova finestra
    apriFenix:function()
    {
        var h = screen.availHeight;
        var scr=NS_FENIX_PLUGIN.getScreenInfo();
        this.LOGGER.info('Aperto Fenix Con La url: ' +scr.length)
        //var lastScreen=scr[scr.length-1];
        var lastScreen = scr[0];

        for(var i = 1; i < scr.length; i++)
        {
            if(lastScreen.left < scr[i].left)
                lastScreen = scr[i];
        }

        var nomeHost = AppLogin.GetLocalHostname();

        var url = !debug ? "http://alsfenix:8081/fenix/" : "http://alsfenix:8081/fenix/";
        //var url = !debug ? "http://172.30.119.16:8080/ris/" : 'http://172.30.119.16:8080/ris/';
        url += "Autologin?username=" + iSiteCurrentUser + "&nomeHost=" + nomeHost + "&url=/page?KEY_LEGAME=MAIN_PAGE";
        this.LOGGER.info('Versione 1.1 ')
        this.LOGGER.info('Aperto Fenix Con La url: ' +url)
        this.LOGGER.info('Aperto Fenix Con i parametri: ' + "top=0,left=" + lastScreen.left + ",width=" + lastScreen.width + ",height=" + lastScreen.height + ",status=yes,scrollbars=no")
        winFenix = window.open(url,"fenix","top=0,left=" + lastScreen.left + ",width=" + lastScreen.width + ",height=" + lastScreen.height + ",status=yes,scrollbars=no");
    },

    //	Chiude la finestra di Fenix eseguendo il logout
    chiudiFenix:function()
    {

        try{
            if(winFenix !== null)
            {
                winFenix.NS_ISITE_PLUGIN.logout();
                winFenix = null;
            }
        }
        catch(e)
        {
            null;
        }
        //alert("chiuso fenix");
    },

    //	In Fenix apre la console di refertazione con accession number dello studio corrente
    apriConsole:function(accessionNumber)
    {
        this.LOGGER.info("Tentativo apertura console per accession number: " +  accessionNumber);
        try{winFenix.NS_ISITE_PLUGIN}catch(e){this.LOGGER.info("Fenix Chiuso tento di aprirlo" );NS_FENIX_PLUGIN.apriFenix();}
        var jsonConsole=eval(winFenix.NS_ISITE_PLUGIN.getDatiConsolleAperta())

        if(jsonConsole.id_esame_dicom!='0')
        {
            if(jsonConsole.id_esame_dicom.indexOf(accessionNumber)>0)
            {
                this.LOGGER.info("Console aperta per lo studio selezionato non faccio niente");
                return;
            }
            else
            {
                this.LOGGER.info("Console aperta per altro studio, chiudo la consolle aperta");
                NS_FENIX_PLUGIN.chiudiConsole();
            }
        }
        else
        {
            this.LOGGER.info("Nessuna console aperta continuo");
        }


        if(winFenix != null)
        {

            //alert("apriConsole(" + accessionNumber + ")");
            if(winFenix.baseUser.TIPO_PERSONALE=='M')
            {
                if(winFenix.baseUser.TIPO_MEDICO=='R')
                {
                    winFenix.NS_ISITE_PLUGIN.apriConsole(accessionNumber,'N');
                }

            }
            else
            {
                winFenix.NS_ISITE_PLUGIN.apriDatiEsecuzione(accessionNumber);

            }

        }

    },

    //	In Fenix chiude la console di refertazione
    chiudiConsole:function()
    {
        //alert("NS_FENIX_PLUGIN.js - chiudiConsole");

        try
        {
            if(winFenix !== null)
            {
                //alert("NS_FENIX_PLUGIN.js - chiudiConsole()");

                if(winFenix.baseUser.TIPO_PERSONALE=='M')
                {
                    if(winFenix.baseUser.TIPO_MEDICO=='R')
                    {
                        winFenix.NS_ISITE_PLUGIN.chiudiConsole();
                    }
                }
                else
                {

                    winFenix.NS_ISITE_PLUGIN.chiudiDatiEsecuzione();
                }

                accessionNumber = null;
            }
            //alert("chiusa console");
        }
        catch(e)
        {
            //alert("NS_FENIX_PLUGIN.js - chiudiConsole ERROR " + e.message);
        }
    },

    //	Ritorna l'Accession Number dello studio corrente prendendo come parametro windowID e un DICOM TAG
    //	Vedi iSite Enterprise Reference Guide
    getAccessionNumber:function(windowID)
    {
        //alert(windowID);
        var acc_num = Radiology.GetDICOMValue(windowID,_DICOM_TAG_ACC_NUM);
        //alert("getAccessionNumber(" + acc_num + ")");

        var error = Radiology.GetLastErrorCode();
        //alert("Error: "+error);

        if(acc_num != null && !isNaN(acc_num.charCodeAt(0))) return acc_num;
        else
        {
            //alert("Errore durante la lettura dell'Accession Number [NS_FENIX_PLUGIN.js]");
            return null;
        }

        return null;
    },

    //	Chiudi Canvas
    chiudiCanvas:function()
    {
        //alert("NS_FENIX_PLUGIN.js - chiudiCanvas ["+canvasPage+"]");
        //alert(canvasPage);

        try
        {
            if(canvasPage !== null) Radiology.CloseCanvasPage(canvasPage,true);
            canvasPage = null;
        }
        catch(e)
        {
            alert("NS_FENIX_PLUGIN.chiudiCanvas ERROR " + e.message);
        }
    } ,
    getCurrentUser:function()
    {
        var strRetVal = Radiology.GetCurrentUser();
        return strRetVal;
    },

    showStudy:function(accession_number,patient_id,organization)
    {
        this.LOGGER.info("Controlla se canvas già aperto per parametri: AN:" +  accession_number + ' PID:' +patient_id+ ' ORG:' + organization );
        //controllo se non esiste un canvas con quel accession number già presente
        try{
            for(var k in OpenAccessionNumber) {
                this.LOGGER.info("Elaborazione" + k);
                if(accession_number.indexOf(OpenAccessionNumber[k].ACCESSION_NUMBER)>=0 && OpenAccessionNumber[k].ORGANIZATION==organization)
                {
                    this.LOGGER.info("Trovata la pagina con canvas id" + OpenAccessionNumber[k].CANVASID);
                    Radiology.setActivePage(OpenAccessionNumber[k].CANVASID,'CANVAS');
                    return;
                }
            }
        }
        catch(e)
        {
            this.LOGGER.info("Errore ricerca pagina : " + e.message);
        }
        this.LOGGER.info("Tentativo ricerca esame");
        InternalExamId= Radiology.FindExam(accession_number,patient_id,organization) ;
        this.LOGGER.info("Trovato Exam Id " + InternalExamId + " ERROR CODE:" + Radiology.GetLastErrorCode());
        OPEN_IMAGE=false;
        ActiveCanvasPage=  Radiology.OpenCanvasPage(InternalExamId,'',true,true,true);
        this.LOGGER.info("Aperta CanvId " + ActiveCanvasPage + " ERROR CODE:" + Radiology.GetLastErrorCode());

    } ,
    addimages:function(AccessionNumber,PatientId,organization) {
        this.LOGGER.info("Tentativo ricerca esame");
        InternalExamId= Radiology.FindExam(AccessionNumber,PatientId,organization) ;
        this.LOGGER.info("Trovato Exam Id " + InternalExamId + " ERROR CODE:" + Radiology.GetLastErrorCode());
        Radiology.OpenShelf(ActiveCanvasPage,InternalExamId,'',true)

        this.LOGGER.info("Aperta Shelf  ERROR CODE:" + Radiology.GetLastErrorCode());
    },
    close_cur_session:	function(AccessionNumber,azione) {
        var  action=false;
        if(azione==null || azione =='DISMISS'){action = false}else{action = true}
        Radiology.CloseCanvasPage(ActiveCanvasPage,action);


    }

};

//	Evento lanciato all'apertura di uno studio di immagini
//	Apre la console di refertazione in Fenix
function Radiology_EventImageWindowCreated(canvasPageID, shelfID, windowID, studyUID, seriesUID, imageUID, windowType)
{

    // NS_FENIX_PLUGIN.apriConsole(windowID);

    //var eventStr = "EventImageWindowCreated." +	"\ncanvasPageID: " + canvasPageID + "\nshelfID: " + shelfID + "\nwindowID: " + windowID + "\nstudyUID: " + studyUID +	"\nseriesUID: " + seriesUID + "\nimageUID: " + imageUID +	"\nwindowType: " + windowType;
    //alert(eventStr);
}

//	Evento lanciato alla chiusura di una Canvas Page
function Radiology_EventCanvasPageClosed(CanvasPageID)
{

}

//	Evento lanciato all'apertura di una Canvas Page
function Radiology_EventCanvasPageCreated(CanvasPageID)
{


}

//	Evento lanciato al logout di iSite
function Radiology_EventLogout(AutoLogoutFlag)
{

    NS_FENIX_PLUGIN.chiudiFenix();

    var eventStr = "EventLogout: AutoLogout Flag = " + AutoLogoutFlag;
    //alert(eventStr);
}

//This event is fired when the user selects a menu item added with the AddExamMenuItem.  
function Radiology_EventExamMenuSelected(MenuItem, IntExamID){}

// This event is fired when the user selects a menu item added with the AddShelfMenuItem.  
function Radiology_EventShelfMenuSelected(MenuItem, CanvasPageID, ShelfID){}

//This event is fired when the user selects a menu item added with the AddViewMenuItem.  
function Radiology_EventViewMenuSelected(MenuItem, ContextRecord){}

//This event is fired after a shelf has been loaded.
function Radiology_EventShelfLoaded(CanvasPageID, ShelfID){

    var SingleShelf  = new Object();
    var StatusShelf =Radiology.GetShelfStatus(ShelfID) ;
    var xmlStatusShelfDocument = $.parseXML( StatusShelf );
    var $xmlStatusShelf = $( xmlStatusShelfDocument );
    NS_FENIX_PLUGIN.LOGGER.debug("Shelf status aperta per shelfs  " + ShelfID  + " : " +  StatusShelf);
    AccNumber=  $('x00080050', $xmlStatusShelf).text();
    SingleShelf.ACCESSION_NUMBER  =   AccNumber;
    SingleShelf.ORGANIZATION =$('OrganizationCode', $xmlStatusShelf).text();
    SingleShelf.CANVASID=CanvasPageID;
    SingleShelf.MAINEXAM=$('MainExam', $xmlStatusShelf).text();
    SingleShelf.EXAMREADFLAG=$('ExamReadFLAG', $xmlStatusShelf).text();
    SingleShelf.EXAMID= $('IntExamID', $xmlStatusShelf).text();
    OpenAccessionNumber[ShelfID]= SingleShelf;


}

//This event is fired after a shelf exam has been closed.
function Radiology_EventShelfClosed(CanvasPageID, ShelfID){
    delete  OpenAccessionNumber[ShelfID]  ;
    NS_FENIX_PLUGIN.LOGGER.info("Shelf status rimossa per shelfs  " +ShelfID);

}

//This event is fired when new images are added to a shelf
function Radiology_EventNewImagesArrived(CanvasPageID, ShelfID,  updWndsXML, newWndsXML ){

}

//This event is fired when the user clicks the "MarkExamRead" button.  
//This event will only be fired if the Options property has the EnableFireExamMarkedReadEvent included.
function Radiology_EventExamMarkedRead(IntExamID){}

//This event is fired when a folder page visibilty changes
function Radiology_EventPageStatus(PageName, PageType, Visible){
    NS_FENIX_PLUGIN.LOGGER.info("Radiology_EventPageStatus parametri page name:" + PageName  + " PageType:"+ PageType+ " visible:" +Visible);
    try{
        if(Visible=='1' && PageType == 'CANVAS' )
        {

            if(OPEN_IMAGE)
            {
                var ShelfsParam =Radiology.ListShelfs(PageName)
                NS_FENIX_PLUGIN.LOGGER.info("ShelfsPara:" + ShelfsParam );


                var xmlShelfParam = $.parseXML( ShelfsParam );
                var ShelfID = $('ID', xmlShelfParam);
                $(ShelfID).each(function(k,v)
                {
                    var StatusShelf =Radiology.GetShelfStatus($(v).text()) ;
                    NS_FENIX_PLUGIN.LOGGER.info("Shelf sxmlper shelfs  : " +  $(v).text()+ " xml:" + StatusShelf );
                    var xmlStatusShelfDocument = $.parseXML( StatusShelf );
                    var $xmlStatusShelf = $( xmlStatusShelfDocument );
                    IsMainExam=$('MainExam', $xmlStatusShelf).text();
                    AccNumberTemp=  $('x00080050', $xmlStatusShelf).text();
                    if(!IsMainExam)
                    {
                        NS_FENIX_PLUGIN.LOGGER.info("Trovato Accession Number " +AccNumberTemp +  " ma MainExam=" + IsMainExam);
                    }
                    else
                    {
                        NS_FENIX_PLUGIN.LOGGER.info("Trovato Accession Number " +AccNumberTemp +  " e MainExam=" + IsMainExam + " quindi tentativo apertura");
                        AccNumberToOpen=  AccNumberTemp
                    }

                    NS_FENIX_PLUGIN.LOGGER.info("Shelf status visibile per shelfs  : " +  $(v).text()+ " Accession number:" + AccNumberToOpen );

                    if(AccNumberToOpen!='' && IsMainExam)
                        return false;

                })
                setTimeout(function(){
                    NS_FENIX_PLUGIN.LOGGER.info("Apertura console per  Accession number:" + AccNumberToOpen );
                    NS_FENIX_PLUGIN.apriConsole(AccNumberToOpen);
                },2000)

            }
            else
            {
                OPEN_IMAGE=true;
            }
            ActiveCanvasPage=PageName;
        }
        else if(Visible=='0' && PageType == 'CANVAS')
        {
            OPEN_IMAGE=true;
            NS_FENIX_PLUGIN.LOGGER.info("chiusura canvas tipo utente:" + winFenix.baseUser.TIPO_PERSONALE + " TIPO MEDICO:" + winFenix.baseUser.TIPO_MEDICO);
            if(winFenix.baseUser.TIPO_PERSONALE=='M')
            {
                if(winFenix.baseUser.TIPO_MEDICO=='R')
                {
                    NS_FENIX_PLUGIN.LOGGER.info("chiusura chiudi console:");
                    NS_FENIX_PLUGIN.chiudiConsole();
                }
            }
            else
            {
                NS_FENIX_PLUGIN.LOGGER.info("chiusura chiudiDatiEsecuzione");
                NS_FENIX_PLUGIN.chiudiDatiEsecuzione();

            }
        }
    }
    catch(e)
    {
        NS_FENIX_PLUGIN.LOGGER.error("Radiology_EventPageStatus Errore:" + e.message );
    }
}

//This event is fired when the preferences have been written to the server.
function Radiology_EventPreferencesApplied(){}

//This event is fired when the preferences dialog Apply button is pressed, which allows validate before the preferences are written.
function Radiology_EventPreferencesApply(PreferencePageName, PreferenceType){}

// This event is fired when user start the Media Export operation
function Radiology_EventMediaExportStarted(dirName){}

// This event is fired when user start the Media Export operation
function Radiology_EventMediaExportCancelled(){}

// This event is fired when user start the Media Export operation
function Radiology_EventMediaExportError(errCode, errDesc){}

// This event is fired when user start the Media Export operation

function Radiology_EventMediaExportComplete(){}

// This event is fired when the user opens the report window in an exam.
// This event only fires if Clinical exam notes are disabled and IDXModeX is enabled.
// This can be done through Options 'DisableClinicalExamNotes' and 'IDXModeX'
function Radiology_EventReportButtonClicked(studyInfo){}

// This event is fired when the user closes the report window in an exam.
// This event only fires if Clinical exam notes are disabled and IDXModeX is enabled.
// This can be done through Options 'DisableClinicalExamNotes' and 'IDXModeX'
function Radiology_EventReportClosed(examID){}

// This event is fired when the user selects a shelf button added with the AddShelfButton command.
function Radiology_EventShelfButton(buttonID, shelfID){
    alert(buttonID);
    alert(shelfID);

}

// This event is fired when the user selects a Timeline menu added through the API.
function Radiology_EventTimelineMenuSelected(menuName, examKey){}

// This event is fired when the user clicks on the Help button on the preferences page.
// This event is only enabled if 'IDXModeX' option is set.
function Radiology_EventPreferenceHelp(){}

// This event is fired when the MediaExportPage is closed.
// This event only fires if the 'HideFolder' option is set.
function Radiology_EventMediaExportPageClosed(){}

// This event is fired when an image Annotation is created.
function Radiology_EventAnnotationCreated(pageID, shelfID, windowID, studyID, seriesID, imageID, toolType, token, strXML){}

// This event is fired when an image Annotation is modified.
function Radiology_EventAnnotationModified(pageID, shelfID, windowID, studyID, seriesID, imageID, toolType, token, strXML){}

// This event is fired when an image Annotation is deleted.
function Radiology_EventAnnotationDeleted(pageID, shelfID, windowID, studyID, seriesID, imageID, toolType, token, strXML){}

// This event is fired when a presentation state is saved.
function Radiology_EventPresentationStateSaved(canvasPageID, shelfID, psID){}

// This event is fired when a presentation state is loaded to a shelf.
function Radiology_EventPresentationStateLoaded(canvasPageID, shelfID, psID){}

// This event is fired when an item is added to the local cache list but before download has begun.
function Radiology_EventCacheItemAdded(IntExamID, IntExcID){

}

// This event is fired when an item is deleted from the local cache.
function Radiology_EventCacheItemDeleted(IntExamID, IntExcID){}

// This event is fired when an error occurs when caching an exam locally.
function Radiology_EventCacheItemError(IntExamID, IntExcID, ErrorMsg){}

// This event is fired when an exam has finished caching to the local client machine.
function Radiology_EventCacheItemComplete(IntExamID, IntExcID){}

//This event is fired when the user selects a menu item added with the AddExamMenuItem.  
function Radiology_EventExamMenuSelected(MenuItem, IntExamID){}
// FINE EVENTI INIZIO INVOCAZIONE ISITE

