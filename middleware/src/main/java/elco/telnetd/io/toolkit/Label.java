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
package elco.telnetd.io.toolkit;import java.io.IOException;import elco.telnetd.io.BasicTerminalIO;import elco.telnetd.io.terminal.ColorHelper;/** * Class that represents a label. */public class Label extends InertComponent {	// Members	private String mContent;	/**	 * Constructs a Label instance.	 *	 * @param io	 *            Instance of a class implementing the BasicTerminalIO interface.	 * @param name	 *            String that represents the components name.	 * @param text	 *            String that represents the visible label.	 */	public Label(BasicTerminalIO io, String name, String text) {		super(io, name);		setText(text);	}// constructor	/**	 * Constructs a Label instance, using the name as visible content.	 *	 * @param io	 *            Instance of a class implementing the BasicTerminalIO interface.	 * @param name	 *            String that represents the components name.	 */	public Label(BasicTerminalIO io, String name) {		super(io, name);		setText(name);	}// constructor	/**	 * Mutator method for the text property of the label component.	 *	 * @param text	 *            String displayed on the terminal.	 */	public void setText(String text) {		// set member		mContent = text;		// set Dimensions		mDim = new Dimension((int) ColorHelper.getVisibleLength(text), 1);	}// setText	/**	 * Accessor method for the text property of the label component.	 *	 * @return String that is displayed when the label is drawn.	 */	public String getText() {		return mContent;	}// getText	/**	 * Method that draws the label on the screen.	 */	@Override	public void draw() throws IOException {		if (mPosition == null) {			mIO.write(mContent);		} else {			mIO.storeCursor();			mIO.setCursor(mPosition.getRow(), mPosition.getColumn());			mIO.write(mContent);			mIO.restoreCursor();			mIO.flush();		}	}// draw}