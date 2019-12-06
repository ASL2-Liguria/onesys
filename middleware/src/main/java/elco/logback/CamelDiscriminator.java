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
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.sift.Discriminator;
import ch.qos.logback.core.spi.ContextAwareBase;
import ch.qos.logback.core.util.OptionHelper;

/**
 * @author Roberto Rizzo
 */
public class CamelDiscriminator extends ContextAwareBase implements Discriminator<ILoggingEvent> {

	private static final String SEPARATOR = File.separator;
	private String key;
	private String[] discrKeys;
	private String defaultValue;
	private boolean started = false;

	/**
	 * <p>
	 * Return the value associated with an MDC entry designated by the Key property. If that value is null, then return the value assigned to the DefaultValue property.
	 * </p>
	 */
	@Override
	public String getDiscriminatingValue(ILoggingEvent event) {
		Map<String, String> mdcMap = event.getMDCPropertyMap();
		if (mdcMap.isEmpty()) {
			return defaultValue;
		}

		String mdcValues = new String();
		for (String _key : discrKeys) {
			String tempMdcValue = mdcMap.get(_key);
			if (tempMdcValue != null) {
				mdcValues += tempMdcValue + SEPARATOR;
			}
		}

		return StringUtils.defaultIfEmpty(mdcValues, defaultValue);
	}

	@Override
	public boolean isStarted() {
		return started;
	}

	@Override
	public void start() {
		int errors = 0;
		if (OptionHelper.isEmpty(key)) {
			errors++;
			addError("The \"Key\" property must be set");
		}
		if (OptionHelper.isEmpty(defaultValue)) {
			errors++;
			addError("The \"DefaultValue\" property must be set");
		}
		if (errors == 0) {
			started = true;
		}
	}

	@Override
	public void stop() {
		started = false;
	}

	@Override
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
		discrKeys = key.split("_");
	}

	/**
	 * @return String
	 * @see #setDefaultValue(String)
	 */
	public String getDefaultValue() {
		return defaultValue;
	}

	/**
	 * <p>
	 * The default MDC value in case the MDC is not set for {@link #setKey(String) mdcKey}.
	 * <p/>
	 * <p>
	 * For example, if {@link #setKey(String) Key} is set to the value "someKey", and the MDC is not set for "someKey", then this appender will use the default value, which you can
	 * set with the help of this method.
	 * <p/>
	 *
	 * @param defaultValue
	 */
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
}
