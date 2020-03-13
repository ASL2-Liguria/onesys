/* Copyright (c) 2018, EL.CO. SRL.  All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * THIS SOFTWARE IS PROVIDED FREE OF CHARGE AND ON AN "AS IS" BASIS,
 * WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED INCLUDING
 * WITHOUT LIMITATION THE WARRANTIES THAT IT IS FREE OF DEFECTS, MERCHANTABLE,
 * FIT FOR A PARTICULAR PURPOSE OR NON-INFRINGING. THE ENTIRE RISK
 * AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU.
 * SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
 * NECESSARY SERVICING, REPAIR, OR CORRECTION.
 * IN NO EVENT SHALL ELCO SRL BE LIABLE TO YOU FOR DAMAGES, INCLUDING
 * ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING
 * OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING, BUT NOT
 * LIMITED TO, LOSS OF DATA, DATA BEING RENDERED INACCURATE, LOSS OF
 * BUSINESS PROFITS, LOSS OF BUSINESS INFORMATION, BUSINESS INTERRUPTIONS,
 * LOSS SUSTAINED BY YOU OR THIRD PARTIES, OR A FAILURE OF THE SOFTWARE
 * TO OPERATE WITH ANY OTHER SOFTWARE) EVEN IF ELCO SRL HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGES.
 */
package it.elco.fenix.pic.documenti;

import it.elco.baseObj.factory.baseFactory;
import it.elco.baseObj.iBase.iBaseUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.FileNotFoundException;


/**
 * Controller per la gestione dei documenti per la privacy relativi agli utenti
 * (es. nomine responsabili esterni al trattamento del dato per gli MMG).
 *
 * @author fabio.grillo
 */


@Controller
@RequestMapping(value = "/dispatcher/utente/documento")
public class DocumentiUtenteController {

    private static final Logger LOGGER = LoggerFactory.getLogger(DocumentiUtenteController.class);

    public static class Documento {
        private int idenPer;
        private int uteIns;
        private String codCat;
        private String name;
        private String note;
        private MultipartFile file;

        public Documento(int idenPer, String codCat, String name, String note) {
            this.idenPer = idenPer;
            this.codCat = codCat;
            this.name = name;
            this.note = note;
        }

        public Documento() {}

        public int getIdenPer() {
            return idenPer;
        }

        public void setIdenPer(int idenPer) {
            this.idenPer = idenPer;
        }

        public int getUteIns() {
            return uteIns;
        }

        public void setUteIns(int uteIns) {
            this.uteIns = uteIns;
        }

        public String getCodCat() {
            return codCat;
        }

        public void setCodCat(String codCat) {
            this.codCat = codCat;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getNote() {
            return note;
        }

        public void setNote(String note) {
            this.note = note;
        }

        public MultipartFile getFile() {
            return file;
        }

        public void setFile(MultipartFile file) {
            this.file = file;
        }

    }

    @Autowired
    private DocumentiUtenteInterface docUtenteInterface;

    /**
     * Aggiunge al repository e database un documento per un medico
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public void addDocUtente(@ModelAttribute Documento documento, HttpServletRequest req) throws ServletException {
        LOGGER.info("Aggiunta documento chiamato file:" + documento.getFile().getName());

        //da decommentare dopo i test
        HttpSession session =req.getSession(false);
        //BASEUSER sembra essere nullo
        iBaseUser user;
        try {
            user = baseFactory.getBaseUser(session);
        }catch(ClassCastException ex){
            throw  new ServletException("Non è stato possibile recuperare l'oggetto baseUser dalla sessione", ex);
        }

        documento.setUteIns(Integer.valueOf(user.get("IDEN_PER")));

        docUtenteInterface.addDocUtente(documento);
    }


    /**
     * Cancella il documento dal database
     * @param id
     */
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public void deleteDocUtente(@PathVariable("id") String id, @RequestParam("url") String url, @RequestParam("filename") String filename) {
        LOGGER.info("Elimino il documento {} dal database",id);
        docUtenteInterface.deleteDocUtente(id,url,filename);
    }

    /**
     * Recupera il documento dal database per visualizzarlo
     * @param id
     */
    @RequestMapping(value="/{id}", method = RequestMethod.GET, produces = "application/pdf")
    @ResponseBody
    public byte[] getDocUtente(@PathVariable("id") String id, @RequestParam("url") String url, @RequestParam("filename") String filename) throws FileNotFoundException {
        LOGGER.info("Recupero il documento {}.",id);
        return docUtenteInterface.getDocUtente(id,url,filename);
    }

}