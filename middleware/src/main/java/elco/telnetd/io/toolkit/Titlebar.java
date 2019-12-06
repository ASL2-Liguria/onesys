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
package elco.telnetd.io.toolkit;

import java.io.IOException;

import elco.telnetd.io.BasicTerminalIO;
import elco.telnetd.io.terminal.ColorHelper;

/**
 * Class that implements a titlebar, for the top of the Terminal Window.
 */
public class Titlebar extends InertComponent {

	// Members
	private String mTitle;
	private int mAlign;
	private String mBgColor;
	private String mFgColor;

	// Constant definitions
	public static final int ALIGN_RIGHT = 1;
	public static final int ALIGN_LEFT = 2;
	public static final int ALIGN_CENTER = 3;

	/**
	 * Constructor for a simple titlebar instance.
	 */
	public Titlebar(BasicTerminalIO io, String name) {
		super(io, name);
	}// constructor

	/**
	 * Mutator method for the titletext property of the titlebar component.
	 *
	 * @param text
	 *            title String displayed in the titlebar.
	 */
	public void setTitleText(String text) {
		mTitle = text;
	}// setTitleText

	/**
	 * Accessor method for the titletext property of the titlebar component.
	 *
	 * @return String that is displayed when the bar is drawn.
	 */
	public String getTitleText() {
		return mTitle;
	}// getTitleText

	/**
	 * Mutator method for the alignment property.
	 *
	 * @param alignment
	 *            integer, valid if one of the ALIGN_* constants.
	 */
	public void setAlignment(int alignment) {
		if (alignment < 1 || alignment > 3) {
			alignment = 2; // left default
		} else {
			mAlign = alignment;
		}
	}// setAlignment

	/**
	 * Mutator method for the SoregroundColor property.
	 *
	 * @param color
	 *            String, valid if it is a ColorHelper color constant.
	 */
	public void setForegroundColor(String color) {
		mFgColor = color;
	}// setForegroundColor

	/**
	 * Mutator method for the BackgroundColor property.
	 *
	 * @param color
	 *            String, valid if it is a ColorHelper color constant.
	 */
	public void setBackgroundColor(String color) {
		mBgColor = color;
	}// setBackgroundColor

	/**
	 * Method that draws the titlebar on the screen.
	 */
	@Override
	public void draw() throws IOException {
		mIO.storeCursor();
		mIO.homeCursor();
		mIO.write(getBar());
		mIO.restoreCursor();
	}// draw

	/**
	 * Internal method that creates the true titlebarstring displayed on the terminal.
	 */
	private String getBar() {
		String ttitle = mTitle;
		// get actual screen width , remove the correction offset
		int width = mIO.getColumns() - 1;
		// get actual titletext width
		int textwidth = (int) ColorHelper.getVisibleLength(mTitle);

		if (textwidth > width) {
			ttitle = mTitle.substring(0, width);
		}
		textwidth = (int) ColorHelper.getVisibleLength(ttitle);

		// prepare a buffer with enough space
		StringBuilder bar = new StringBuilder(width + textwidth);
		switch (mAlign) {
		case ALIGN_LEFT:
			bar.append(ttitle);
			appendSpaceString(bar, width - textwidth);
			break;
		case ALIGN_RIGHT:
			appendSpaceString(bar, width - textwidth);
			bar.append(ttitle);
			break;
		case ALIGN_CENTER:
			int left = (width - textwidth != 0) ? ((width - textwidth) / 2) : 0;
			int right = width - textwidth - left;
			appendSpaceString(bar, left);
			bar.append(ttitle);
			appendSpaceString(bar, right);
		}

		return ColorHelper.boldcolorizeText(bar.toString(), mFgColor, mBgColor);
	}// getBar

	private void appendSpaceString(StringBuilder sbuf, int length) {
		for (int i = 0; i < length; i++) {
			sbuf.append(" ");
		}
	}// appendSpaceString
}
