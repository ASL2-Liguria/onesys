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
package elco.hl7;

import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import ca.uhn.hl7v2.parser.EncodingCharacters;
import ca.uhn.hl7v2.parser.Escaping;

/**
 * Handles "escaping" and "unescaping" of text according to the HL7 escape sequence rules defined in section 2.10 of the standard (version 2.4). Currently, escape sequences for
 * multiple character sets are unsupported. The highlighting, hexademical, and locally defined escape sequences are also unsupported.
 *
 * @author Roberto Rizzo
 */
public class Escape implements Escaping {

	private final HashMap<String, Character> escapes = new HashMap<>(5);

	/**
	 * limits the size of variousEncChars to 1000, can be overridden by system property.
	 */
	private final Map<EncodingCharacters, EncLookup> variousEncChars = Collections.synchronizedMap(new LinkedHashMap<EncodingCharacters, EncLookup>(5, 0.75f, true) {

		private static final long serialVersionUID = 1L;
		final int maxSize = Integer.parseInt(System.getProperty(Escape.class.getName() + ".maxSize", "1000"));

		@Override
		protected boolean removeEldestEntry(Map.Entry<EncodingCharacters, EncLookup> eldest) {
			return this.size() > maxSize;
		}
	});

	/**
	 * Add a couple of values "escape <-> translate" (e.g. \\X000d\\ <-> \r)
	 *
	 * @param escape
	 *            escape
	 * @param translate
	 *            value
	 */
	public void addEscape(String escape, Character translate) {
		escapes.put(escape, translate);
	}

	/**
	 * Clear all couples of values "escape <-> translate" and characters mapping
	 */
	public void clearEscapes() {
		escapes.clear();
		variousEncChars.clear();
	}

	@Override
	public String escape(String text, EncodingCharacters encChars) {
		EncLookup esc = getEscapeSequences(encChars);
		int textLength = text.length();

		StringBuilder result = new StringBuilder(textLength);
		for (int i = 0; i < textLength; i++) {
			boolean charReplaced = false;
			char c = text.charAt(i);

			for (int j = 0; j < esc.characters.length; j++) {
				if (text.charAt(i) == esc.characters[j]) {
					// Formatting escape sequences such as /.br/ should be left alone
					if (j == 4 && i + 1 < textLength && text.charAt(i + 1) == '.') {
						int nextEscapeIndex = text.indexOf(esc.characters[j], i + 1);
						if (nextEscapeIndex > 0) {
							result.append(text.substring(i, nextEscapeIndex + 1));
							charReplaced = true;
							i = nextEscapeIndex;
							break;
						}
					}

					result.append(esc.encodings[j]);
					charReplaced = true;
					break;
				}
			}
			if (!charReplaced) {
				result.append(c);
			}
		}

		return result.toString();
	}

	@Override
	public String unescape(String text, EncodingCharacters encChars) {
		// If the escape char isn't found, we don't need to look for escape sequences
		char escapeChar = encChars.getEscapeCharacter();
		boolean foundEscapeChar = false;
		for (int i = 0; i < text.length(); i++) {
			if (text.charAt(i) == escapeChar) {
				foundEscapeChar = true;
				break;
			}
		}
		if (!foundEscapeChar) {
			return text;
		}

		int textLength = text.length();
		StringBuilder result = new StringBuilder(textLength + 20);
		EncLookup esc = getEscapeSequences(encChars);
		char escape = esc.characters[4];
		int encodingsCount = esc.characters.length;
		int i = 0;
		while (i < textLength) {
			char c = text.charAt(i);
			if (c != escape) {
				result.append(c);
				i++;
			} else {
				boolean foundEncoding = false;

				// Test against the standard encodings
				for (int j = 0; j < encodingsCount; j++) {
					String encoding = esc.encodings[j];
					int encodingLength = encoding.length();
					if ((i + encodingLength <= textLength) && text.substring(i, i + encodingLength).equals(encoding)) {
						result.append(esc.characters[j]);
						i += encodingLength;
						foundEncoding = true;
						break;
					}
				}

				if (!foundEncoding) {
					// If we haven't found this, there is one more option. Escape sequences of /.XXXXX/ are
					// formatting codes. They should be left intact
					if ((i + 1 < textLength) && text.charAt(i + 1) == '.') {
						int closingEscape = text.indexOf(escape, i + 1);
						if (closingEscape > 0) {
							String substring = text.substring(i, closingEscape + 1);
							result.append(substring);
							i += substring.length();
						} else {
							i++;
						}
					} else {
						i++;
					}
				}
			}
		}

		return result.toString();
	}

	/**
	 * Returns a HashTable with escape sequences as keys, and corresponding Strings as values.
	 */
	private EncLookup getEscapeSequences(EncodingCharacters encChars) {
		EncLookup escapeSequences = variousEncChars.get(encChars);
		if (escapeSequences == null) {
			// this means we haven't got the sequences for these encoding characters yet - let's make them
			escapeSequences = new EncLookup(encChars);
			variousEncChars.put(encChars, escapeSequences);
		}

		return escapeSequences;
	}

	/**
	 * A performance-optimized replacement for using when mapping from HL7 special characters to their respective encodings
	 */
	private class EncLookup {

		private char[] characters = null;
		private String[] encodings = null;

		EncLookup(EncodingCharacters ec) {
			int additionalSize = (escapes.size() == 0) ? 1 : escapes.size();

			characters = new char[5 + additionalSize];
			encodings = new String[5 + additionalSize];

			characters[0] = ec.getFieldSeparator();
			characters[1] = ec.getComponentSeparator();
			characters[2] = ec.getSubcomponentSeparator();
			characters[3] = ec.getRepetitionSeparator();
			characters[4] = ec.getEscapeCharacter();
			char[] codes = { 'F', 'S', 'T', 'R', 'E' };
			for (int i = 0; i < codes.length; i++) {
				StringBuilder seq = new StringBuilder();
				seq.append(ec.getEscapeCharacter());
				seq.append(codes[i]);
				seq.append(ec.getEscapeCharacter());
				encodings[i] = seq.toString();
			}

			int e = 5;
			if (escapes.size() > 0) {
				Iterator<String> it = escapes.keySet().iterator();
				while (it.hasNext()) {
					String key = it.next();
					Character value = escapes.get(key);
					characters[e] = value;
					encodings[e] = key;
					e++;
				}
			} else {
				characters[e] = '\r';
				encodings[e] = "\\X000d\\";
			}
		}
	}
}
