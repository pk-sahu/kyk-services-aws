package com.sms.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="photos")
public class PhotoAWS {

	//HashKey
	@DynamoDBHashKey(attributeName = "photoid")
	private String id;
	
	@DynamoDBAttribute(attributeName = "activity")
	private String activity;
	
	@DynamoDBAttribute(attributeName = "albumdate")
	private String albumdate;
	
	@DynamoDBAttribute(attributeName = "filename")
	private String fileName;
	
	@DynamoDBAttribute(attributeName = "filetype")
	private String filetype;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	public String getAlbumdate() {
		return albumdate;
	}

	public void setAlbumdate(String albumdate) {
		this.albumdate = albumdate;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFiletype() {
		return filetype;
	}

	public void setFiletype(String filetype) {
		this.filetype = filetype;
	}
	
}
