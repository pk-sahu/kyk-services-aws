package com.sms.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;
import java.util.Date;

import com.sms.model.WorksheetAWS;

public class WorksheetDateComparator implements Comparator<WorksheetAWS>{

	@Override
	public int compare(WorksheetAWS o1, WorksheetAWS o2) {

		if (o1.getWorksheetdate() == null || o2.getWorksheetdate() == null)
	        return 0;
	      
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    Date date1 = null;
	    Date date2 = null;
	    try {
	    	date1 = sdf.parse(o1.getWorksheetdate());
	    	date2 = sdf.parse(o2.getWorksheetdate());
	    } catch (ParseException e) {
	        e.printStackTrace();
	    }			      
	    return date2.compareTo(date1);
	}
}
