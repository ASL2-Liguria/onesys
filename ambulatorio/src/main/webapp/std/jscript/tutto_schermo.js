/*
 * linob: aggiunta modifica per evitare il resize all'interno della cartella
 * 
 */
function tutto_schermo(){
    var altezza;
    var largh;
    if (top.window.name!='schedaRicovero'){
        altezza = screen.availHeight ;
        largh = screen.availWidth;
        try {
                top.resizeTo(largh,altezza);
                top.moveTo(0,0);
        } catch (e) {
        }
    }
}