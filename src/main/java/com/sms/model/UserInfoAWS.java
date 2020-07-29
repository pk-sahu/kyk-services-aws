package com.sms.model;

import java.util.Date;
import java.util.UUID;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAutoGenerateStrategy;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBGeneratedUuid;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="users")
public class UserInfoAWS {
	
	//HashKey
	@DynamoDBHashKey(attributeName = "userid")
	private String id;
	
	@DynamoDBAttribute(attributeName = "username")
	private String username;
	
	@DynamoDBAttribute(attributeName = "password")
	private String password;
	
	@DynamoDBAttribute(attributeName = "plainpassword")
	private String plainpassword;
	
	@DynamoDBAttribute(attributeName = "studentname")
	private String studentname;
	
	@DynamoDBAttribute(attributeName = "dateofbirth")
	private String dateofbirth;	

	@DynamoDBAttribute(attributeName="phone")
	private String phone;
	
	@DynamoDBAttribute(attributeName = "classname")
	private String classname;
	
	@DynamoDBAttribute(attributeName = "email")
	private String email;
	
	@DynamoDBAttribute(attributeName = "role")
	private String role = "ROLE_USER";
	
	@DynamoDBAttribute(attributeName = "enabled")
	private int enabled = 1;
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPlainpassword() {
		return plainpassword;
	}

	public void setPlainpassword(String plainpassword) {
		this.plainpassword = plainpassword;
	}

	public String getStudentname() {
		return studentname;
	}

	public void setStudentname(String studentname) {
		this.studentname = studentname;
	}

	public String getDateofbirth() {
		return dateofbirth;
	}

	public void setDateofbirth(String dateofbirth) {
		this.dateofbirth = dateofbirth;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getClassname() {
		return classname;
	}

	public void setClassname(String classname) {
		this.classname = classname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public int getEnabled() {
		return enabled;
	}

	public void setEnabled(int enabled) {
		this.enabled = enabled;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
}
