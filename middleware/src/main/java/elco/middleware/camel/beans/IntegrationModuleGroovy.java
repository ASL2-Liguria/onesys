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

import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.camel.Body;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.ExchangeProperties;
import org.apache.camel.Handler;
import org.apache.camel.Headers;
import org.apache.camel.spi.Registry;

import elco.insc.Constants;
import elco.insc.FileUtils;
import groovy.lang.Binding;
import groovy.lang.GroovySystem;
import groovy.lang.Script;
import groovy.util.GroovyScriptEngine;
import groovy.util.ScriptException;

/**
 * Used to run Groovy scripts in Camel
 *
 * @author Roberto Rizzo
 */
public final class IntegrationModuleGroovy {

	private final AtomicReference<GroovyScriptEngine> argse = new AtomicReference<>(null);
	private final String groovyScript;
	private boolean useMemoryLeaksWorkaround = false;
	private final boolean debug;

	/**
	 * Since 5.0.1
	 *
	 * @param groovyScript
	 * @param debug
	 * @param useMemoryLeaksWorkaround
	 */
	public IntegrationModuleGroovy(String groovyScript, boolean debug, boolean useMemoryLeaksWorkaround) {
		this(groovyScript, debug);
		this.useMemoryLeaksWorkaround = useMemoryLeaksWorkaround;
	}

	/**
	 * @param groovyScript
	 * @param debug
	 */
	public IntegrationModuleGroovy(String groovyScript, boolean debug) {
		this.groovyScript = groovyScript;
		this.debug = debug;
	}

	@Handler
	public Object handler(@Body Object body, @Headers Map<String, Object> headers, @ExchangeProperties Map<String, Object> properties, CamelContext context, Registry registry,
			Exchange exchange) throws ScriptException {
		try {
			if (argse.get() == null) {
				argse.compareAndSet(null, new GroovyScriptEngine(FileUtils.verifyPath(Constants.runtimeFilesDirectory) + context.getName() + Constants.contextScripts));
				argse.get().getConfig().setDebug(debug);
			}

			Binding binding = new Binding();
			binding.setVariable("inputMessage", body);
			binding.setVariable("headers", headers);
			binding.setVariable("properties", properties);
			binding.setVariable("context", context);
			binding.setVariable("registry", registry);
			binding.setVariable("exchange", exchange);
			Script script = argse.get().createScript(groovyScript, binding); // create a new object only if the script is changed
			script.run();
			if (useMemoryLeaksWorkaround) { // since 5.0.1
				argse.get().getGroovyClassLoader().clearCache();
				GroovySystem.getMetaClassRegistry().removeMetaClass(script.getClass());
			}

			return binding.hasVariable("outputMessage") ? binding.getVariable("outputMessage") : body;
		} catch (Exception ex) {
			throw new ScriptException(ex);
		}
	}
}
