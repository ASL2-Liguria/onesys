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
package elco.middleware.camel.beans;

import java.io.File;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.apache.camel.Body;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.ExchangeProperties;
import org.apache.camel.Handler;
import org.apache.camel.Headers;
import org.apache.camel.spi.Registry;

import elco.insc.Constants;
import elco.insc.FileUtils;
import groovy.util.ScriptException;

/**
 * since 6.0.9<br>
 * Used to run Javascript scripts in Camel
 *
 * @author Roberto Rizzo
 */
public final class IntegrationModuleNashorn {

	private final AtomicReference<File> arScriptPath = new AtomicReference<>(null);
	private long lastCheckTime = 0;
	private final ScriptEngine engine;
	private String script;
	private final String javascript;

	/**
	 * @param javascript
	 */
	public IntegrationModuleNashorn(String javascript) {
		this.javascript = javascript;
		engine = new ScriptEngineManager().getEngineByName("Nashorn");
	}

	@Handler
	public Object handler(@Body Object body, @Headers Map<String, Object> headers, @ExchangeProperties Map<String, Object> properties, CamelContext context, Registry registry,
			Exchange exchange) throws ScriptException {
		if (arScriptPath.get() == null) {
			arScriptPath.compareAndSet(null, new File(FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context.getName() + Constants.contextScripts + javascript));
		}

		try {
			Bindings bindings = engine.getBindings(ScriptContext.ENGINE_SCOPE);
			bindings.put("inputMessage", body);
			bindings.put("headers", headers);
			bindings.put("properties", properties);
			bindings.put("context", context);
			bindings.put("registry", registry);
			bindings.put("exchange", exchange);

			if (FileUtils.isFileNewer(arScriptPath.get(), lastCheckTime)) {
				lastCheckTime = System.currentTimeMillis();
				script = FileUtils.loadString(arScriptPath.get().getAbsolutePath(), Constants.DEFAULT_VM_CHARSET);
			}

			engine.eval(script, bindings);

			Object outputMessage = bindings.get("outputMessage");

			return outputMessage != null ? outputMessage : body;
		} catch (Exception ex) {
			throw new ScriptException(ex);
		}
	}
}
