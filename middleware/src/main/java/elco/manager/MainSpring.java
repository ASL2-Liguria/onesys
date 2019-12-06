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
package elco.manager;

import java.util.Map;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.ShutdownRoute;
import org.apache.camel.ShutdownRunningTask;
import org.apache.camel.model.ProcessorDefinition;
import org.apache.camel.spi.InterceptStrategy;
import org.apache.camel.spi.ShutdownStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.LoggerContext;
import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.insc.LogbackUtils;

/**
 * @author Roberto Rizzo
 */
public final class MainSpring extends org.apache.camel.spring.Main {

	private Map<String, String> interceptStrategyContext;

	/**
	 * @author Roberto Rizzo
	 */
	private class ContainerWideInterceptor implements InterceptStrategy {

		private final Logger logger;

		public ContainerWideInterceptor() {
			LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();

			if (context.exists("INTERCEPTSTRATEGY") == null) {
				LogbackUtils.updateConfiguration(context, "META-INF/logback/interceptStrategyLogger.xml");
			}

			logger = LoggerFactory.getLogger("INTERCEPTSTRATEGY");
		}

		private void logMessage(Exchange exchange, Processor target, String prefix) {
			String contextName = exchange.getContext().getName();
			String exchangeId = exchange.getExchangeId();
			String routeId = exchange.getUnitOfWork().getRouteContext().getRoute().getId();
			String logMessage = contextName + "." + routeId + " - " + target.toString() + " [" + exchangeId + "]";
			logger.info("{}: {}", prefix, logMessage);
		}

		@Override
		public Processor wrapProcessorInInterceptors(final CamelContext context, final ProcessorDefinition<?> definition,
				final Processor target, final Processor nextTarget) throws Exception {

			return new Processor() { // NOSONAR
				@Override
				public void process(Exchange exchange) throws Exception {
					try {
						logMessage(exchange, target, "Before");
						target.process(exchange);
						logMessage(exchange, target, "After");
					} catch (Exception ex) {
						logMessage(exchange, target, "Error after");
						throw ex;
					}
				}
			};
		}
	}

	@Override
	protected void beforeStart() throws Exception {
		super.beforeStart();
		LOG.info(">>>>>>>>>>>>>>>>>>>> Start AC service >>>>>>>>>>>>>>>>>>>>");
	}

	@Override
	protected void afterStart() throws Exception {
		super.afterStart();
		LOG.info("<<<<<<<<<<<<<<<<<<<< AC service started <<<<<<<<<<<<<<<<<<<<");
	}

	@Override
	protected void beforeStop() throws Exception {
		super.beforeStop();
		LOG.info(">>>>>>>>>>>>>>>>>>>> Stop AC service >>>>>>>>>>>>>>>>>>>>");
	}

	@Override
	protected void afterStop() throws Exception {
		super.afterStop();
		LOG.info("<<<<<<<<<<<<<<<<<<<< AC service is stopped <<<<<<<<<<<<<<<<<<<<");
	}

	/**
	 * @param interceptStrategyContext
	 */
	public void setInterceptStrategyContext(Map<String, String> interceptStrategyContext) {
		this.interceptStrategyContext = interceptStrategyContext;
	}

	/**
	 * @param context
	 *            CamelContext
	 */
	public void configureContext(CamelContext context) {
		ShutdownStrategy strategy = context.getShutdownStrategy();
		strategy.setShutdownRoutesInReverseOrder(false); // use startup order
		strategy.setTimeout(Constants.ROUTESHUTDOWNTIMEOUT); // timeout to wait before forcing shutdown
		strategy.setShutdownNowOnTimeout(true); // force shutdown after timeout occurred

		context.setUseMDCLogging(true);
		context.setShutdownRunningTask(ShutdownRunningTask.CompleteCurrentTaskOnly); // try to complete only the current task
		context.setShutdownRoute(ShutdownRoute.Default); // try to shutdown routes as soon as possible

		if (!context.getName().equalsIgnoreCase(Constants.camelManagerContext)) {
			if (interceptStrategyContext.containsValue(context.getName())) {
				context.addInterceptStrategy(new ContainerWideInterceptor());
				LOG.info("Added intercept strategy to context {}", context.getName());
			}

			String contextJarsPath = Constants.contextJars + context.getName(); // path where context's specific jars must be placed
			LOG.info("Start class loader initialization for context {}", context.getName());
			FileUtils.mkDirQuietly(contextJarsPath); // create path if not already exists
			context.setApplicationContextClassLoader(new JarFileClassLoader(contextJarsPath, getApplicationContext().getClassLoader())); // set context's new class loader
			LOG.info("Class loader for context {} initialized", context.getName());
		}
	}

	/**
	 * @param context
	 *            CamelContext
	 */
	public void addContext(CamelContext context) {
		String contextJarsPath = Constants.contextJars + context.getName();
		if (!context.getName().equals(Constants.camelManagerContext)) {
			elco.insc.FileUtils.mkDirQuietly(contextJarsPath);
			context.setApplicationContextClassLoader(new JarFileClassLoader(contextJarsPath, getApplicationContext().getClassLoader())); // set context's new class loader
		}
		camelContexts.add(context);
		getApplicationContext().getBeanFactory().registerSingleton(context.getName(), context);
	}

	/**
	 * @param contextName
	 * @return boolean
	 */
	public boolean existContext(String contextName) {
		return camelContexts.stream().filter(context -> contextName.equalsIgnoreCase(context.getName())).findFirst().isPresent();
	}
}
