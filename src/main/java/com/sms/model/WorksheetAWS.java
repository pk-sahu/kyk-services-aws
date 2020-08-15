package com.sms.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="worksheets")
public class WorksheetAWS {

	//HashKey
	@DynamoDBHashKey(attributeName = "worksheetid")
	private String id;
	
	@DynamoDBAttribute(attributeName = "worksheetname")
	private String worksheetname;
	
	@DynamoDBAttribute(attributeName = "worksheetdate")
	private String worksheetdate;
	
	@DynamoDBAttribute(attributeName = "classname")
	private String classname;
	
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

	public String getWorksheetname() {
		return worksheetname;
	}

	public void setWorksheetname(String worksheetname) {
		this.worksheetname = worksheetname;
	}

	public String getWorksheetdate() {
		return worksheetdate;
	}

	public void setWorksheetdate(String worksheetdate) {
		this.worksheetdate = worksheetdate;
	}
	
	public String getClassname() {
		return classname;
	}

	public void setClassname(String classname) {
		this.classname = classname;
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
