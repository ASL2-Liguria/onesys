 // ATTENZIONE !!!
 // x non modificare codice JAVA
 // viene usato il campo  configura_pc.ABILITA_MP2IMG 
 // per impostare se il pc ha ibmviavoice installato !!!
// ***************

// script che include, tramite il metodo createElement
// l'oggetto per refertare. L'inclusione avviene per mezzo
// di un file js esterno per aggirare la protezione di MS (EOLAS)
document.write('<object classid="clsid:EB5FCA59-2E4F-466B-8F78-0D31429C404D" id = "objReportControl" codebase ="cab/rptcontrol/prjReportControl.CAB#version=1,0,0,6" width=500 height =300>');
document.write('<param name="width" value="500">');
document.write('<param name="height" value="300">');
document.write('<param name="trace" value="true">');
document.write('<param name="readonly" value="false">');
document.write('<param name="logreport" value="true">');
document.write('<param name="saveAlsoReportRtf" value="true">');
document.write('<param name="infostatusbar" value=" ">');
document.write('<param name="daybeforedelete" value="2">');
document.write('<param name="wmode" value="trasparent">');
document.write('</object>');




