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

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.integration.Message;
import org.springframework.integration.MessageChannel;
import org.springframework.integration.file.remote.InputStreamCallback;
import org.springframework.integration.file.remote.RemoteFileTemplate;
import org.springframework.integration.file.remote.session.SessionFactory;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Calendar;
import java.util.UUID;


/**
 * Classe astratta che implementa DocumentiUtenteInterface per i documenti relativi agli MMG
 *
 * @author fabio.grillo
 */

public class DocumentiUtenteMMG implements DocumentiUtenteInterface {

    private static final Logger LOGGER = LoggerFactory.getLogger(DocumentiUtenteMMG.class);

    @Autowired
    private MessageChannel sftpChannelInsert;
    @Autowired
    private MessageChannel sftpChannelDelete;
    @Autowired
    private SessionFactory sftpSessionFactory;

    @Override
    public void addDocUtente(DocumentiUtenteController.Documento documento) {
        Calendar today = Calendar.getInstance();
        String append = today.get(Calendar.YEAR)+"/"+(today.get(Calendar.MONTH)+1)+"/"+today.get(Calendar.DAY_OF_MONTH);
        MultipartFile originFile = documento.getFile();
        File fileToTransfer = null;
        try {
            fileToTransfer = File.createTempFile(originFile.getOriginalFilename() + "-", ".tmp");
            FileOutputStream fos = new FileOutputStream(fileToTransfer);
            fos.write(originFile.getBytes());
            fos.close();
        } catch (IOException e) {
            LOGGER.error(e.toString());
        }

        final Message<File> message = MessageBuilder.withPayload(fileToTransfer)
                .setHeader("iden_medico",documento.getIdenPer())
                .setHeader("codice_categoria",documento.getCodCat())
                .setHeader("note",documento.getNote())
                .setHeader("nome_allegato",documento.getName())
                .setHeader("percorso",append)
                .setHeader("hashcode", String.valueOf(UUID.randomUUID()))
                .setHeader("ute_ins",documento.getUteIns())
                .build();

        sftpChannelInsert.send(message);
    }

    @Override
    public void deleteDocUtente(String id,String url,String filename) {
        final Message<String> msg = MessageBuilder.withPayload(id)
                .setHeader("url",url)
                .setHeader("filename",filename)
                .build();
        try {
            sftpChannelDelete.send(msg);
        } catch (Exception e) {
            LOGGER.error(e.toString());
        }
    }

    private static class InputStreamCallbackImpl implements InputStreamCallback {

        private byte[] fileContent;

        @Override
        public void doWithInputStream(InputStream inputStream) throws IOException {
            fileContent = IOUtils.toByteArray(inputStream);
        }

        public byte[] getContent(){
            return fileContent;
        }
    }

    @Override
    public byte[] getDocUtente(String id,String url,String filename) throws FileNotFoundException {
        final Message<String> msg = MessageBuilder.withPayload(url+'/'+filename)
                .build();
        RemoteFileTemplate sftpGetFile = new RemoteFileTemplate(sftpSessionFactory);

        InputStreamCallbackImpl impl = new InputStreamCallbackImpl();

        SpelExpressionParser parser = new SpelExpressionParser();
        sftpGetFile.setFileNameExpression(parser.parseExpression("payload"));

        boolean resp = sftpGetFile.get(msg, impl);

        if(resp){
            return impl.getContent();
        }else{
            throw new FileNotFoundException("Non è stato possibile recuperare il file richiesto");
        }
    }


}
