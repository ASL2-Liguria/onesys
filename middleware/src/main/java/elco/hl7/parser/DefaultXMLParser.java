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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Set;

import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import ca.uhn.hl7v2.DefaultHapiContext;
import ca.uhn.hl7v2.ErrorCode;
import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.HapiContext;
import ca.uhn.hl7v2.model.AbstractGroup;
import ca.uhn.hl7v2.model.Group;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.Segment;
import ca.uhn.hl7v2.model.Structure;
import ca.uhn.hl7v2.parser.ModelClassFactory;
import ca.uhn.hl7v2.util.ReflectionUtil;
import ca.uhn.hl7v2.validation.ValidationContext;
import ca.uhn.hl7v2.validation.impl.NoValidation;
import ca.uhn.hl7v2.validation.impl.ValidationContextFactory;
import elco.insc.HL7;

/**
 * Override to create a private parser for a non-standard HL7 message
 *
 * @author Roberto Rizzo
 */
public class DefaultXMLParser extends elco.hl7.parser.XMLParser {

	private static final Set<String> ourForceGroupNames;
	private StringBuilder messageString = null;
	private PipeParser pipeParser = null;
	private boolean keepAllAsOriginal = false;
	private final HashMap<String, String> noVerifyRepetition = new HashMap<>();

	static {
		ourForceGroupNames = new HashSet<>();
		ourForceGroupNames.add("DIET");
	}

	/**
	 * @param context
	 *            the HAPI context
	 */
	public DefaultXMLParser(HapiContext context) {
		super(context);
	}

	/**
	 * Creates a new instance of DefaultXMLParser
	 *
	 * @param theFactory
	 *            custom factory to use for model class lookup
	 */
	public DefaultXMLParser(ModelClassFactory theFactory) {
		super(theFactory);
	}

	/**
	 * Convenience's factory method which returns an instance that has a new {@link DefaultHapiContext} initialized with a {@link NoValidation NoValidation validation context}.
	 *
	 * @return DefaultXMLParser with disabled validation
	 */
	public static DefaultXMLParser getInstanceWithNoValidation() {
		HapiContext context = new DefaultHapiContext();
		ValidationContext noValidation = ValidationContextFactory.noValidation();
		context.setValidationContext(noValidation);
		return new DefaultXMLParser(context);
	}

	/**
	 * Set a personal pipe parser to use in XML to Pipe transformation
	 *
	 * @param parser
	 *            elco.hl7.parser.PipeParser instance to use. Pass NULL to remove personal parser
	 */
	public void setPipeParser(PipeParser parser) {
		pipeParser = parser;
	}

	/**
	 * @return personal pipe parser to use in XML to Pipe transformation
	 */
	public PipeParser getPipeParser() {
		return pipeParser;
	}

	/**
	 * @param keep
	 *            Set to true to keep all segments as original
	 */
	public void setKeepAllAsOriginal(boolean keep) {
		keepAllAsOriginal = keep;
	}

	/**
	 * <p>
	 * Creates an XML Document that corresponds to the given Message object.
	 * </p>
	 * <p>
	 * If you are implementing this method, you should create an XML Document, and insert XML Elements into it that correspond to the groups and segments that belong to the message
	 * type that your subclass of XMLParser supports. Then, for each segment in the message, call the method <code>encode(Segment segmentObject, Element segmentElement)</code>
	 * using the Element for that segment and the corresponding Segment object from the given Message.
	 * </p>
	 */
	@Override
	public Document encodeDocument(Message source) throws HL7Exception {
		String messageClassName = source.getClass().getName();
		String messageName = messageClassName.substring(messageClassName.lastIndexOf('.') + 1);
		org.w3c.dom.Document doc = null;

		try {
			doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
			Element root = doc.createElement(messageName);
			doc.appendChild(root);
		} catch (Exception ex) {
			throw new HL7Exception("Can't create XML document - " + ex.getClass().getName(), ErrorCode.APPLICATION_INTERNAL_ERROR, ex);
		}
		encode(source, doc.getDocumentElement());

		return doc;
	}

	/**
	 * Copies data from a group object into the corresponding group element, creating any necessary child nodes.
	 */
	private void encode(ca.uhn.hl7v2.model.Group groupObject, org.w3c.dom.Element groupElement) throws HL7Exception {
		String[] childNames = groupObject.getNames();
		String messageName = groupObject.getMessage().getName();

		try {
			for (int i = 0; i < childNames.length; i++) {
				Structure[] reps = groupObject.getAll(childNames[i]);
				for (int j = 0; j < reps.length; j++) {
					Element childElement = groupElement.getOwnerDocument().createElement(makeGroupElementName(messageName, childNames[i]));
					groupElement.appendChild(childElement);
					if (reps[j] instanceof Group) {
						encode((Group) reps[j], childElement);
					} else if (reps[j] instanceof Segment) {
						encode((Segment) reps[j], childElement);
					}
				}
			}
		} catch (DOMException ex) {
			throw new HL7Exception("Can't encode group " + groupObject.getClass().getName(), ErrorCode.APPLICATION_INTERNAL_ERROR, ex);
		}
	}

	/**
	 * <p>
	 * Creates and populates a Message object from an XML Document that contains an XML-encoded HL7 message.
	 * </p>
	 * <p>
	 * The easiest way to implement this method for a particular message structure is as follows:
	 * <ol>
	 * <li>Create an instance of the Message type you are going to handle with your subclass of XMLParser</li>
	 * <li>Go through the given Document and find the Elements that represent the top level of each message segment.</li>
	 * <li>For each of these segments, call <code>parse(Segment segmentObject, Element segmentElement)</code>, providing the appropriate Segment from your Message object, and the
	 * corresponding Element.</li>
	 * </ol>
	 * At the end of this process, your Message object should be populated with data from the XML Document.
	 * </p>
	 *
	 * @throws HL7Exception
	 *             if the message is not correctly formatted.
	 */
	@Override
	public Message parseDocument(org.w3c.dom.Document xmlMessage, String version) throws HL7Exception {
		messageString = new StringBuilder();

		String messageName = xmlMessage.getDocumentElement().getTagName();
		Message doNotUseMessage = instantiateMessage(messageName, version, true);
		if (pipeParser != null) {
			doNotUseMessage.setParser(pipeParser);
		}
		parse(doNotUseMessage, xmlMessage.getDocumentElement());

		String pipeMessage = messageString.toString();
		messageString = null;

		return HL7.getMessage(pipeMessage, pipeParser);
	}

	/**
	 * Populates the given group object with data from the given group element, maintaining any unrecognized nodes.
	 */
	private void parse(ca.uhn.hl7v2.model.Group groupObject, org.w3c.dom.Element groupElement) throws HL7Exception {
		// String[] childNames = groupObject.getNames(); // NOSONAR
		String messageName = groupObject.getMessage().getName();

		NodeList allChildNodes = groupElement.getChildNodes();
		String[] childNames = new String[allChildNodes.getLength()];
		for (int i = 0; i < allChildNodes.getLength(); i++) {
			String name = allChildNodes.item(i).getNodeName();

			int pos = name.indexOf('.'); // remove group
			if (pos != -1) {
				name = name.substring(pos + 1);
			}
			childNames[i] = name;
		}

		Hashtable<String, Integer> repetition = new Hashtable<>(); // NOSONAR
		for (int i = 0; i < childNames.length; i++) {
			// 4 char segment names are second occurrences of a segment within a single message
			// structure. e.g. the second PID segment in an A17 patient swap message is known to hapi's code representation as PID2
			if (childNames[i].length() != 4) {
				int repPos = getRepetitionPosition(repetition, childNames[i]);
				try {
					parseReps(groupElement, groupObject, messageName, childNames[i], childNames[i], repPos);
				} catch (Exception ex) { // non-standard segment
					logger.debug("Add a non-standard segment: " + childNames[i], ex);
					String segIndexName = groupObject.addNonstandardSegment(childNames[i]);
					parseReps(groupElement, groupObject, messageName, childNames[i], segIndexName, repPos);
				}
			} else {
				// da capire
				logger.debug("Skipping rep segment: " + childNames[i]);
			}
		}
	}

	private int getRepetitionPosition(Hashtable<String, Integer> repetition, String name) { // NOSONAR
		int repPos = 1;
		Integer value = repetition.get(name);

		if (value != null) {
			repPos = value.intValue() + 1;
		}
		repetition.put(name, repPos);

		return repPos;
	}

	// param childIndexName may have an integer on the end if >1 sibling with same name (e.g. NTE2)
	private void parseReps(Element groupElement, Group groupObject, String messageName, String childName, String childIndexName, int repValue) throws HL7Exception {
		List<Node> reps = getChildElementsByTagName(groupElement, makeGroupElementName(messageName, childName));
		logger.debug("# of elements matching " + makeGroupElementName(messageName, childName) + ": " + reps.size());

		if (noVerifyRepetition.containsKey(childIndexName)) {
			AbstractGroup absg = (AbstractGroup) groupObject;
			ModelClassFactory factory = absg.getModelClassFactory();
			Structure structure = ReflectionUtil.instantiateStructure(absg.get(childIndexName).getClass(), absg.getParent(), factory);
			parseRep((Element) reps.get(repValue - 1), structure);
		} else {
			parseRep((Element) reps.get(repValue - 1), groupObject.get(childIndexName, repValue - 1));
		}
	}

	private void parseRep(Element theElem, Structure theObj) throws HL7Exception {
		if (theObj instanceof Group) {
			parse((Group) theObj, theElem);
		} else if (theObj instanceof Segment) {
			parseSegment((Segment) theObj, theElem);
		}
		logger.debug("Parsed element: " + theElem.getNodeName());
	}

	@Override
	protected boolean keepAsOriginal(Node node) {
		if (keepAllAsOriginal) {
			return true;
		}

		return super.keepAsOriginal(node);
	}

	private void parseSegment(Segment segment, Node node) throws HL7Exception {
		parse(segment, (Element) node);
		messageString.append(segment.encode());
		messageString.append((char) 13);
	}

	// includes direct children only
	private List<Node> getChildElementsByTagName(Element theElement, String theName) {
		List<Node> result = new ArrayList<>(10);
		NodeList children = theElement.getChildNodes();

		Node child;
		for (int i = 0; i < children.getLength(); i++) {
			child = children.item(i);
			if (child.getNodeType() == Node.ELEMENT_NODE && child.getNodeName().equals(theName)) {
				result.add(child);
			}
		}

		return result;
	}

	/**
	 * Given the name of a message and a Group class, returns the corresponding group element name in an XML-encoded message. This is the message name and group name separated by a
	 * dot. For example, ADT_A01.INSURANCE. If it looks like a segment name (i.e. has 3 characters), no change is made.
	 */
	private String makeGroupElementName(String messageName, String className) {
		String ret;

		if (className.length() > 4 || ourForceGroupNames.contains(className)) {
			StringBuilder elementName = new StringBuilder();
			elementName.append(messageName);
			elementName.append('.');
			elementName.append(className);
			ret = elementName.toString();
		} else if (className.length() == 4) {
			// It is not clear why this case is needed.. We should figure out why it was added, since removing it or optimizing its use would
			// prevent the need for "ourForGroupNames" above
			ret = className.substring(0, 3);
		} else {
			ret = className;
		}

		return ret;
	}

	@Override
	public void parse(Message message, String string) throws HL7Exception {
		// NOT USED
	}

	/**
	 * Not verify the segment repetition number during pipe transformation
	 *
	 * @param segmentName
	 *            The name of the segment to exclude (e.g. OBX)
	 */
	public void noVerifyRepetition4Segment(String segmentName) {
		noVerifyRepetition.put(segmentName, segmentName);
	}
}
