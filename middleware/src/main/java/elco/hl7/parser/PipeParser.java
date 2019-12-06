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
package elco.hl7.parser;

import java.util.StringTokenizer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ca.uhn.hl7v2.DefaultHapiContext;
import ca.uhn.hl7v2.ErrorCode;
import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.HapiContext;
import ca.uhn.hl7v2.model.Group;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.Primitive;
import ca.uhn.hl7v2.model.Segment;
import ca.uhn.hl7v2.model.Structure;
import ca.uhn.hl7v2.model.Type;
import ca.uhn.hl7v2.model.Varies;
import ca.uhn.hl7v2.parser.EncodingCharacters;
import ca.uhn.hl7v2.parser.ParserConfiguration;
import ca.uhn.hl7v2.util.Terser;
import ca.uhn.hl7v2.validation.ValidationContext;
import ca.uhn.hl7v2.validation.impl.NoValidation;
import ca.uhn.hl7v2.validation.impl.ValidationContextFactory;
import elco.hl7.Escape;

/**
 * Override to create a private parser for a non-standard HL7 message
 *
 * @author Roberto Rizzo
 */
public class PipeParser extends ca.uhn.hl7v2.parser.PipeParser {

	private static final Logger logger = LoggerFactory.getLogger(PipeParser.class);
	private static final String SEGDELIM = "\r"; // see section 2.8 of spec
	private final ParserConfiguration parserConfiguration = new ParserConfiguration();
	private final Escape escape = new Escape();

	public PipeParser() {
		this(new DefaultHapiContext());
	}

	public PipeParser(HapiContext context) {
		super(context);
		parserConfiguration.setEscaping(escape);
		context.setParserConfiguration(parserConfiguration);
	}

	/**
	 * Add a couple of values "escape <-> translate" (e.g. \\X000d\\ <-> \r)
	 *
	 * @param escape
	 *            escape
	 * @param translate
	 *            value
	 */
	public void addEscape(String escape, Character translate) {
		this.escape.addEscape(escape, translate);
	}

	/**
	 * Convenience's factory method which returns an instance that has a new {@link DefaultHapiContext} initialized with a {@link NoValidation NoValidation validation context}.
	 *
	 * @return PipeParser with disabled validation
	 */
	public static PipeParser getInstanceWithNoValidation() {
		HapiContext context = new DefaultHapiContext();
		ValidationContext noValidation = ValidationContextFactory.noValidation();
		context.setValidationContext(noValidation);
		return new PipeParser(context);
	}

	/**
	 * Convenience's factory method which returns an instance that has a new {@link DefaultHapiContext}.
	 *
	 * @return PipeParser
	 */
	public static PipeParser getInstanceWithValidation() {
		HapiContext context = new DefaultHapiContext();
		return new PipeParser(context);
	}

	@Override
	public void parse(Type destinationField, String data, EncodingCharacters encodingCharacters) throws HL7Exception {
		String[] components = split(data, String.valueOf(encodingCharacters.getComponentSeparator()));
		for (int i = 0; i < components.length; i++) {
			String[] subcomponents = split(components[i], String.valueOf(encodingCharacters.getSubcomponentSeparator()));
			for (int j = 0; j < subcomponents.length; j++) {
				String val = subcomponents[j];
				if (val != null) {
					val = destinationField.getMessage().getParser().getParserConfiguration().getEscaping().unescape(val, encodingCharacters);
				}
				Terser.getPrimitive(destinationField, i + 1, j + 1).setValue(val);
			}
		}
	}

	@Override
	public String doEncode(Segment structure, EncodingCharacters encodingCharacters) throws HL7Exception {
		return encode(structure, encodingCharacters);
	}

	@Override
	protected String doEncode(Message source) throws HL7Exception {
		// get encoding characters ...
		Segment msh = (Segment) source.get("MSH");
		String fieldSepString = Terser.get(msh, 1, 0, 1, 1);

		if (fieldSepString == null) {
			throw new HL7Exception("Can't encode message: MSH-1 (field separator) is missing");
		}

		char fieldSep = '|';
		if (fieldSepString.length() > 0) {
			fieldSep = fieldSepString.charAt(0);
		}

		String encCharString = Terser.get(msh, 2, 0, 1, 1);

		if (encCharString == null) {
			throw new HL7Exception("Can't encode message: MSH-2 (encoding characters) is missing");
		}

		if (encCharString.length() != 4) {
			throw new HL7Exception("Encoding characters '" + encCharString + "' invalid -- must be 4 characters", ErrorCode.DATA_TYPE_ERROR);
		}
		// throw new HL7Exception("Encoding characters '" + encCharString + "' invalid -- must be 4 characters", HL7Exception.DATA_TYPE_ERROR); // NOSONAR
		EncodingCharacters en = new EncodingCharacters(fieldSep, encCharString);

		// pass down to group encoding method which will operate recursively on children ...
		return encode(source, en);
	}

	public static String encode(Group source, EncodingCharacters encodingChars) throws HL7Exception {
		StringBuilder result = new StringBuilder();
		String[] names = source.getNames();

		String firstMandatorySegmentName = null;
		boolean haveEncounteredMandatorySegment = false;
		boolean haveEncounteredContent = false;
		boolean haveHadMandatorySegment = false;
		boolean haveHadSegmentBeforeMandatorySegment = false;

		for (int i = 0; i < names.length; i++) {
			Structure[] reps = source.getAll(names[i]);
			boolean nextNameIsRequired = source.isRequired(names[i]);

			boolean havePreviouslyEncounteredMandatorySegment = haveEncounteredMandatorySegment;
			haveEncounteredMandatorySegment |= nextNameIsRequired;
			if (nextNameIsRequired && !haveHadMandatorySegment && !source.isGroup(names[i])) {
				firstMandatorySegmentName = names[i];
			}

			for (int rep = 0; rep < reps.length; rep++) {
				if (reps[rep] instanceof Group) {
					String encodedGroup = encode((Group) reps[rep], encodingChars);
					result.append(encodedGroup);

					if (encodedGroup.length() > 0) {
						if (!haveHadMandatorySegment && !haveEncounteredMandatorySegment) {
							haveHadSegmentBeforeMandatorySegment = true;
						}
						if (nextNameIsRequired && !haveHadMandatorySegment && !havePreviouslyEncounteredMandatorySegment) {
							haveHadMandatorySegment = true;
						}
						haveEncounteredContent = true;
					}
				} else {
					String segString = encode((Segment) reps[rep], encodingChars);
					if (segString.length() >= 4) {
						result.append(segString);
						result.append(SEGDELIM);

						haveEncounteredContent = true;

						if (nextNameIsRequired) {
							haveHadMandatorySegment = true;
						}

						if (!haveHadMandatorySegment && !haveEncounteredMandatorySegment) {
							haveHadSegmentBeforeMandatorySegment = true;
						}
					}
				}
			}
		}

		if (firstMandatorySegmentName != null && !haveHadMandatorySegment && !haveHadSegmentBeforeMandatorySegment && haveEncounteredContent) {
			return firstMandatorySegmentName.substring(0, 3) + encodingChars.getFieldSeparator() + SEGDELIM + result;
		}

		return result.toString();
	}

	public static String encode(Segment source, EncodingCharacters encodingChars) {
		StringBuilder result = new StringBuilder();
		result.append(source.getName());
		result.append(encodingChars.getFieldSeparator());

		// start at field 2 for MSH segment because field 1 is the field delimiter
		int startAt = 1;
		if (isDelimDefSegment(source.getName())) {
			startAt = 2;
		}

		// loop through fields; for every field delimit any repetitions and add field delimiter after ...
		int numFields = source.numFields();
		for (int i = startAt; i <= numFields; i++) {
			try {
				Type[] reps = source.getField(i);
				for (int j = 0; j < reps.length; j++) {
					String fieldText = encode(reps[j], encodingChars);
					// if this is MSH-2, then it shouldn't be escaped, so unescape it again
					if (isDelimDefSegment(source.getName()) && i == 2) {
						fieldText = source.getMessage().getParser().getParserConfiguration().getEscaping().unescape(fieldText, encodingChars);
					}
					result.append(fieldText);
					if (j < reps.length - 1) {
						result.append(encodingChars.getRepetitionSeparator());
					}
				}
			} catch (HL7Exception e) {
				logger.error("Error while encoding segment: ", e);
			}

			result.append(encodingChars.getFieldSeparator());
		}

		// strip trailing delimiters ...
		return stripExtraDelimiters(result.toString(), encodingChars.getFieldSeparator());
	}

	public static String encode(Type source, EncodingCharacters encodingChars) {
		if (source instanceof Varies) {
			Varies varies = (Varies) source;
			if (varies.getData() != null) {
				source = varies.getData();
			}
		}

		StringBuilder field = new StringBuilder();
		for (int i = 1; i <= Terser.numComponents(source); i++) {
			StringBuilder comp = new StringBuilder();
			for (int j = 1; j <= Terser.numSubComponents(source, i); j++) {
				Primitive p = Terser.getPrimitive(source, i, j);
				comp.append(encodePrimitive(p, encodingChars));
				comp.append(encodingChars.getSubcomponentSeparator());
			}
			field.append(stripExtraDelimiters(comp.toString(), encodingChars.getSubcomponentSeparator()));
			field.append(encodingChars.getComponentSeparator());
		}

		return stripExtraDelimiters(field.toString(), encodingChars.getComponentSeparator());
	}

	private static boolean isDelimDefSegment(String theSegmentName) {
		boolean is = false;
		if ("MSH".equals(theSegmentName) || "FHS".equals(theSegmentName) || "BHS".equals(theSegmentName)) {
			is = true;
		}
		return is;
	}

	private static String encodePrimitive(Primitive p, EncodingCharacters encodingChars) {
		String val = (p).getValue();
		if (val == null) {
			val = "";
		} else {
			val = p.getMessage().getParser().getParserConfiguration().getEscaping().escape(val, encodingChars);
		}
		return val;
	}

	private static String stripExtraDelimiters(String in, char delim) {
		char[] chars = in.toCharArray();

		// search from back end for first occurrence of non-delimiter ...
		int c = chars.length - 1;
		boolean found = false;
		while (c >= 0 && !found) {
			if (chars[c--] != delim) {
				found = true;
			}
		}

		String ret = "";
		if (found) {
			ret = String.valueOf(chars, 0, c + 2);
		}

		return ret;
	}

	@Override
	public String getEncoding(String message) {
		// quit if the string is too short
		if (message.length() < 4) {
			logger.warn("Message length < 4");
			return null;
		}

		// string should start with "MSH"
		if (!message.startsWith("MSH")) {
			logger.warn("Message doesn't start with MSH: " + message);
			return null;
		}

		// 4th character of each segment should be field delimiter
		char fourthChar = message.charAt(3);
		StringTokenizer st = new StringTokenizer(message, String.valueOf(SEGDELIM), false);
		while (st.hasMoreTokens()) {
			String x = st.nextToken();
			if (x.length() > 0) {
				if (Character.isWhitespace(x.charAt(0))) {
					x = stripLeadingWhitespace(x);
				}
				if (x.length() >= 4 && x.charAt(3) != fourthChar) {
					logger.warn(x + " - " + x.charAt(3) + " != " + fourthChar);
					return null;
				}
			}
		}

		// should be at least 11 field delimiters (because MSH-12 is required)
		int nextFieldDelimLoc = 0;
		for (int i = 0; i < 11; i++) {
			nextFieldDelimLoc = message.indexOf(fourthChar, nextFieldDelimLoc + 1);
			if (nextFieldDelimLoc < 0) {
				logger.warn("Field delimiters < 11");
				return null;
			}
		}

		return "VB";
	}
}
