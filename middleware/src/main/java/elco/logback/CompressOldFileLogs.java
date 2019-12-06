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
package elco.logback;

import java.io.File;
import java.time.ZonedDateTime;
import java.util.List;

import org.apache.camel.Handler;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.SuffixFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.Compression;
import elco.insc.Constants;

/**
 * Bean used to compress, in zip format, old log files
 *
 * @author Roberto Rizzo
 */
public final class CompressOldFileLogs {

	private static final Logger logger = LoggerFactory.getLogger(CompressOldFileLogs.class);

	@Handler
	public final void handler() {
		try {
			ZonedDateTime date = ZonedDateTime.now().minusDays(1);
			long compareTime = date.toInstant().toEpochMilli();

			List<File> logs = (List<File>) FileUtils.listFiles(new File(elco.insc.FileUtils.verifyPath(Constants.logsDirectory)), new SuffixFileFilter(".log"),
					TrueFileFilter.TRUE);
			logs.parallelStream().forEach(log -> {
				if (!FileUtils.isFileNewer(log, compareTime)) {
					try { // NOSONAR
						Compression.zip(log.getAbsolutePath());
						elco.insc.FileUtils.deleteFile(log);
						logger.info("File {} zipped", log.getAbsolutePath());
					} catch (Exception ex) {
						logger.error("", ex);
					}
				}
			});
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}
}
