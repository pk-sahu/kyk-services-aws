package com.sms.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.UpdateItemOutcome;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator;
import com.amazonaws.services.dynamodbv2.model.Condition;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import com.sms.model.UserInfoAWS;
import com.sms.util.PasswordEncoderUtil;

@Repository
public class UserDaoAWS {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	
	@Value("${table.name.users}")
	private String userTableName;
	
	public UserInfoAWS findById(String id){
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":val", new AttributeValue().withS(id)); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(userTableName)
    	    .withFilterExpression("userid = :val")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	Map<String, AttributeValue> item = result.getItems().get(0);
    	UserInfoAWS userInfoAWS = convertUserFromItem(item); 
		return userInfoAWS;
	}
	
	public List<UserInfoAWS> findAll(){
		ScanRequest scanRequest = new ScanRequest().withTableName(userTableName);		
    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	List<UserInfoAWS> userList = new ArrayList<UserInfoAWS>();
    	for (Map<String, AttributeValue> item : result.getItems()){
    		UserInfoAWS userInfoAWS = convertUserFromItem(item); 
    		userList.add(userInfoAWS);
    	}
    	return userList;
	}
	
	public void save(UserInfoAWS userInfoAWS) {
		DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
		userInfoAWS.setId(Long.toString(new Date().toInstant().toEpochMilli()));
		userInfoAWS.setDateofbirth(userInfoAWS.getDateofbirth());
		mapper.save(userInfoAWS);
	}
	
	public void update(UserInfoAWS userInfoAWS) {
		DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
		Table table = dynamoDB.getTable(userTableName);
		String password = PasswordEncoderUtil.encodedPassword(userInfoAWS.getPlainpassword());
		Map<String, String> attributeNames = new HashMap<String, String>();
		attributeNames.put("#username", "username");
		attributeNames.put("#plainpassword", "plainpassword");
		attributeNames.put("#password", "password");
		attributeNames.put("#studentname", "studentname");
		attributeNames.put("#classname", "classname");
		attributeNames.put("#email", "email");
		attributeNames.put("#phone", "phone");
		attributeNames.put("#dateofbirth", "dateofbirth");
		attributeNames.put("#userstatus", "userstatus");
		
		Map<String, Object> attributeValues = new HashMap<String, Object>();
		attributeValues.put(":username", userInfoAWS.getUsername()); 
		attributeValues.put(":plainpassword", userInfoAWS.getPlainpassword());  
		attributeValues.put(":password", password);  
		attributeValues.put(":phone", userInfoAWS.getPhone());
		attributeValues.put(":studentname", userInfoAWS.getStudentname());
		attributeValues.put(":classname", userInfoAWS.getClassname());
		attributeValues.put(":email", userInfoAWS.getEmail());  
		attributeValues.put(":dateofbirth", userInfoAWS.getDateofbirth());
		attributeValues.put(":userstatus", userInfoAWS.getUserstatus()); 
		
		String updateExpression = "set #username=:username, #plainpassword=:plainpassword, #password=:password, "
				+ "#phone=:phone, #dateofbirth=:dateofbirth, #studentname=:studentname, #userstatus=:userstatus, "
				+ "#classname=:classname, #email=:email";
		
		UpdateItemOutcome outcome = table.updateItem(
			   "userid",			// key attribute name
			   userInfoAWS.getId(), // key attribute value
			   updateExpression, // UpdateExpression
			   attributeNames,
			   attributeValues);
	}
	
	public void deleteById(String id) {
		
		DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
		
        try {
        	UserInfoAWS userInfoAWS = null;
            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
            scanExpression.addFilterCondition("userid", new Condition()
            											.withComparisonOperator(ComparisonOperator.EQ)
            											.withAttributeValueList(new AttributeValue().withS(id)));
            List<UserInfoAWS> list = mapper.scan(UserInfoAWS.class, scanExpression);
            if (list != null && list.size() > 0) {
            	userInfoAWS = list.get(0);
            }
            mapper.delete(userInfoAWS);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("Item Deleted:");
	}
	
	public UserInfoAWS getActiveUser(String userName) {
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":username", new AttributeValue().withS(userName)); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(userTableName)
    	    .withFilterExpression("username = :username")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	Map<String, AttributeValue> item = result.getItems().get(0);
    	UserInfoAWS userInfoAWS = convertUserFromItem(item);    	
		
		return userInfoAWS;
	}
	
	public UserInfoAWS getUserDetail(String userName) {
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":username", new AttributeValue().withS(userName)); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(userTableName)
    	    .withFilterExpression("username = :username")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	Map<String, AttributeValue> item = result.getItems().get(0);
    	UserInfoAWS userInfoAWS = convertUserFromItem(item);    	
		
		return userInfoAWS;
	}
	
	private UserInfoAWS convertUserFromItem(Map<String, AttributeValue> item) {
		UserInfoAWS userInfoAWS = new UserInfoAWS();
		userInfoAWS.setId(item.get("userid").getS());
		userInfoAWS.setUsername(item.get("username").getS());
		userInfoAWS.setPassword(item.get("password").getS());
		userInfoAWS.setPlainpassword(item.get("plainpassword").getS());
		userInfoAWS.setStudentname(item.get("studentname").getS());
		userInfoAWS.setDateofbirth(item.get("dateofbirth").getS());
		userInfoAWS.setPhone(item.get("phone").getS());
		userInfoAWS.setClassname(item.get("classname").getS());
		userInfoAWS.setEmail(item.get("email").getS());
		userInfoAWS.setRole(item.get("role").getS());
		userInfoAWS.setUserstatus(item.get("userstatus").getS());
		return userInfoAWS;
	}
}
