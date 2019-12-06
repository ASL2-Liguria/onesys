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
package it.elco.fenix.adt.controller;

import it.elco.database.converters.PlsInteger;
import it.elco.database.converters.Varchar;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

@Controller
@RequestMapping(value = "/api/personale")
public class PersonaleController extends DefaultFunctionController {

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getPersonaleList(HttpSession session, @RequestParam(required = false) String descr) throws IOException, SQLException {
        return getResult(session ,"API.GET_PERSONALE_BY_DESCRIZIONE", Varchar.makeIn(descr));
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getPersonaleById(HttpSession session, @PathVariable Integer id) throws IOException, SQLException {
        return getResult(session, "API.GET_PERSONALE_BY_ID", PlsInteger.makeIn(id));
    }

    @ResponseBody
    @RequestMapping(value = "/medici", method = RequestMethod.GET)
    public String getMediciList(HttpSession session, @RequestParam(required = false) String descr) throws IOException, SQLException {
        return getResult(session ,"API.GET_MEDICO_BY_DESCRIZIONE", Varchar.makeIn(descr));
    }

    @ResponseBody
    @RequestMapping(value = "/medici/{id}", method = RequestMethod.GET)
    public String getMediciById(HttpSession session, @PathVariable Integer id) throws IOException, SQLException {
        return getResult(session, "API.GET_PERSONALE_BY_ID", PlsInteger.makeIn(id));
    }

    @ResponseBody
    @RequestMapping(value = "/medici/{codice}", method = RequestMethod.GET)
    public String getMediciByCodice(HttpSession session, @PathVariable String codice) throws IOException, SQLException {
        return getResult(session, "API.GET_PERSONALE_BY_CODICE", Varchar.makeIn(codice));
    }

    @ResponseBody
    @RequestMapping(value = "/infermieri", method = RequestMethod.GET)
    public String getInfermieruList(HttpSession session, @RequestParam(required = false) String descr) throws IOException, SQLException {
        return getResult(session ,"API.GET_INFERMIERE_BY_DESCRIZIONE", Varchar.makeIn(descr), Varchar.makeIn(descr));
    }

    @ResponseBody
    @RequestMapping(value = "/infermieri/{id}", method = RequestMethod.GET)
    public String getInfermieriById(HttpSession session, @PathVariable Integer id) throws IOException, SQLException {
        return getResult(session, "API.GET_PERSONALE_BY_ID", PlsInteger.makeIn(id));
    }

}
