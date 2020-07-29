package com.sms.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;
import java.util.Date;

import com.sms.model.PhotoAWS;

public class AlbumDateComparator implements Comparator<PhotoAWS>{

	@Override
	public int compare(PhotoAWS o1, PhotoAWS o2) {

		if (o1.getAlbumdate() == null || o2.getAlbumdate() == null)
	        return 0;
	      
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    Date date1 = null;
	    Date date2 = null;
	    try {
	    	date1 = sdf.parse(o1.getAlbumdate());
	    	date2 = sdf.parse(o2.getAlbumdate());
	    } catch (ParseException e) {
	        e.printStackTrace();
	    }			      
	    return date2.compareTo(date1);
	}
}
