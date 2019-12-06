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
package elco.insc;

import java.io.File;
import java.time.ZonedDateTime;
import java.util.List;

import org.apache.camel.Handler;
import org.apache.camel.spi.Registry;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.SuffixFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.middleware.camel.beans.Config;

/**
 * @author Roberto Rizzo
 */
public final class DeleteOldExternalFileLogs {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Handler
	public final void handler(Registry registry) {
		try {
			Config deleteConf = (Config) registry.lookupByName("DeleteExternalLogsConfig");
			if (deleteConf != null) {
				String[] suffixs = { ".zip", ".log" };

				for (Object _path : deleteConf.getKeys()) {
					String deleteTimeString = deleteConf.getString((String) _path);
					int deleteTime = deleteTimeString != null ? Integer.parseInt(deleteTimeString) : Constants.deleteOldLogExternalFilesDays;

					ZonedDateTime date = ZonedDateTime.now().minusDays(deleteTime);
					long compareTime = date.toInstant().toEpochMilli();

					String dirPath = elco.insc.FileUtils.verifyPath((String) _path);
					deleteOldFiles(dirPath, suffixs, compareTime);
				}
			} else {
				logger.debug("DeleteOldExternalFileLogs: no configuration found");
			}
		} catch (Exception ex) {
			logger.error("DeleteOldExternalFileLogs", ex);
		}
	}

	private void deleteOldFiles(String dirPath, String[] suffixs, long compareTime) {
		try {
			List<File> logs = (List<File>) FileUtils.listFiles(new File(elco.insc.FileUtils.verifyPath(dirPath)), new SuffixFileFilter(suffixs), TrueFileFilter.TRUE);
			logs.parallelStream().forEach(log -> {
				if (!FileUtils.isFileNewer(log, compareTime)) {
					elco.insc.FileUtils.deleteFile(log);
					logger.info("File {} deleted", log.getAbsolutePath());
				}
			});
		} catch (Exception ex) {
			logger.info("DeleteOldExternalFileLogs, {}: {}", dirPath, ex);
		}
	}
}
