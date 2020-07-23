package com.sms.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;
import java.util.Date;

import com.sms.model.SessionAWS;

public class VisibleDateComparator implements Comparator<SessionAWS>{

	@Override
	public int compare(SessionAWS o1, SessionAWS o2) {

		if (o1.getVisibleDate() == null || o2.getVisibleDate() == null)
	        return 0;
	      
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    Date date1 = null;
	    Date date2 = null;
	    try {
	    	date1 = sdf.parse(o1.getVisibleDate());
	    	date2 = sdf.parse(o2.getVisibleDate());
	    } catch (ParseException e) {
	        e.printStackTrace();
	    }			      
	    return date2.compareTo(date1);
	}
}
