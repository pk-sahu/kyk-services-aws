package com.sms.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="sessions")
public class SessionAWS {

	//HashKey
	@DynamoDBHashKey(attributeName = "sessionid")
	private String id;
	
	@DynamoDBAttribute(attributeName = "subject")
	private String subject;
	
	@DynamoDBAttribute(attributeName = "classname")
	private String classname;
	
	@DynamoDBAttribute(attributeName = "description")
	private String description;
	
	@DynamoDBAttribute(attributeName = "visibledate")
	private String visibleDate;
	
	@DynamoDBAttribute(attributeName = "filename")
	private String fileName;
	
	@DynamoDBAttribute(attributeName = "enabled")
	private int enabled = 1;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getClassname() {
		return classname;
	}

	public void setClassname(String classname) {
		this.classname = classname;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getVisibleDate() {
		return visibleDate;
	}

	public void setVisibleDate(String visibleDate) {
		this.visibleDate = visibleDate;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public int getEnabled() {
		return enabled;
	}

	public void setEnabled(int enabled) {
		this.enabled = enabled;
	}
}
