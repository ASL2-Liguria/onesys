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
import java.util.ArrayList;

import elco.telnetd.io.BasicTerminalIO;

/**
 * Class implementing a selection menu.
 */
public class Selection extends ActiveComponent {

	// Members & Associations
	private final ArrayList<String> mOptions;
	private int mSelected;
	private int mLastSelected;
	public static final int ALIGN_LEFT = 1;
	public static final int ALIGN_RIGHT = 2;

	/**
	 * Constructs a Selection instance.
	 *
	 * @param io
	 *            Object instance implementing the BasicTerminalIO interface.
	 * @param name
	 *            String representing this instances name.
	 */
	public Selection(BasicTerminalIO io, String name) {
		super(io, name);
		mOptions = new ArrayList<>(10);
		mLastSelected = 0;
		mSelected = 0;
	}// constructor

	/**
	 * Method to add an Option to a Selection instance.
	 *
	 * @param str
	 *            String representing the option.
	 */
	public void addOption(String str) {
		mOptions.add(str);
	}// addOption

	/**
	 * Method to insert an Option to a Selection instance at a specific index. Falls back to add, if index is corrupt.
	 *
	 * @param str
	 *            String representing the option.
	 * @param index
	 *            int representing the desired index.
	 */
	public void insertOption(String str, int index) {
		try {
			mOptions.add(index, str);
		} catch (ArrayIndexOutOfBoundsException aex) {
			addOption(str);
		}
	}// insertOption

	/**
	 * Method to remove an existing Option from a Selection instance.
	 *
	 * @param str
	 *            String representing the option.
	 */
	public void removeOption(String str) {
		for (int i = 0; i < mOptions.size(); i++) {
			if (mOptions.get(i).equals(str)) {
				removeOption(i);
				return;
			}
		}
	}// removeOption

	/**
	 * Method to remove an existing Option from a Selection instance. Does nothing if the index is corrupt.
	 *
	 * @param index
	 *            int representing the options index.
	 */
	public void removeOption(int index) {
		try {
			mOptions.remove(index);
		} catch (ArrayIndexOutOfBoundsException aex) {
			// nothing
		}
	}// removeOption

	/**
	 * Accessor method for an option of this selection. Returns null if index is corrupt.
	 *
	 * @param index
	 *            int representing the options index.
	 * @return Strnig that represents the option.
	 */
	public String getOption(int index) {
		try {
			Object o = mOptions.get(index);
			if (o != null) {
				return (String) o;
			}
		} catch (ArrayIndexOutOfBoundsException aex) {
			// nothing
		}
		return null;
	}// getOption

	/**
	 * Accessor method to retrieve the selected option. Returns -1 if no option exists.
	 *
	 * @return index int representing index of the the selected option.
	 */
	public int getSelected() {
		return mSelected;
	}// getSelected

	/**
	 * Mutator method to set selected option programatically. Does nothing if the index is corrupt.
	 *
	 * @param index
	 *            int representing an options index.
	 */
	public void setSelected(int index) throws IOException {
		if (index < 0 || index > mOptions.size()) {
			return;
		}
		mLastSelected = mSelected;
		mSelected = index;
		// needs redraw
		draw();
	}// setSelected

	/**
	 * Method that will make the selection active, reading and processing input.
	 */
	@Override
	public void run() throws IOException {
		int in;
		draw();
		mIO.flush();
		do {
			// get next key
			in = mIO.read();
			switch (in) {
			case BasicTerminalIO.LEFT:
			case BasicTerminalIO.UP:
				if (!selectPrevious()) {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.RIGHT:
			case BasicTerminalIO.DOWN:
				if (!selectNext()) {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.TABULATOR:
			case BasicTerminalIO.ENTER:
				in = -1;
				break;
			default:
				mIO.bell();
			}
			mIO.flush();
		} while (in != -1);

	}// run

	/**
	 * Method that draws the component.
	 */
	@Override
	public void draw() throws IOException {
		String opttext = getOption(mSelected);
		int diff = getOption(mLastSelected).length() - opttext.length();

		if (diff > 0) {
			StringBuilder sbuf = new StringBuilder();
			sbuf.append(opttext);
			for (int i = 0; i < diff; i++) {
				sbuf.append(" ");
			}
			opttext = sbuf.toString();
		}

		if (mPosition != null) {
			mIO.setCursor(mPosition.getRow(), mPosition.getColumn());
		}
		mIO.write(opttext);
		mIO.moveLeft(opttext.length());
	}// draw

	private boolean selectNext() throws IOException {
		if (mSelected < (mOptions.size() - 1)) {
			setSelected(mSelected + 1);
			return true;
		}
		return false;
	}// selectNext

	private boolean selectPrevious() throws IOException {
		if (mSelected > 0) {
			setSelected(mSelected - 1);
			return true;
		}
		return false;
	}// selectPrevious
}
