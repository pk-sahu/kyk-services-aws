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
import com.sms.model.SessionAWS;
import com.sms.model.UserInfoAWS;

@Repository
public class SessionDaoAWS {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	
	@Value("${table.name.sessions}")
	private String sessionTableName;
	
	@Autowired
	private UserDaoAWS userRepository;
	
	public List<SessionAWS> getSessionForUser(String username){
		
		UserInfoAWS UserInfoAWS = userRepository.getUserDetail(username);
		
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":val", new AttributeValue().withS(UserInfoAWS.getClassname())); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(sessionTableName)
    	    .withFilterExpression("classname = :val")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	List<SessionAWS> sessionList = new ArrayList<SessionAWS>();
    	for (Map<String, AttributeValue> item : result.getItems()){
    		SessionAWS sessionAWS = convertSessionFromItem(item); 
    		sessionList.add(sessionAWS);
    	}
		return sessionList;
	}
	public SessionAWS findById(String id){
		
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":val", new AttributeValue().withS(id)); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(sessionTableName)
    	    .withFilterExpression("sessionid = :val")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	Map<String, AttributeValue> item = result.getItems().get(0);
    	SessionAWS sessionAWS = convertSessionFromItem(item); 
		return sessionAWS;
	}
	
	public List<SessionAWS> findAll(){
		
		ScanRequest scanRequest = new ScanRequest().withTableName(sessionTableName);		
    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	List<SessionAWS> sessionList = new ArrayList<SessionAWS>();
    	for (Map<String, AttributeValue> item : result.getItems()){
    		SessionAWS sessionAWS = convertSessionFromItem(item); 
    		sessionList.add(sessionAWS);
    	}
		return sessionList;
	}
	
	public SessionAWS save(SessionAWS sessionAWS) {
		DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
		sessionAWS.setId(Long.toString(new Date().toInstant().toEpochMilli()));
		sessionAWS.setVisibleDate(sessionAWS.getVisibleDate());
		mapper.save(sessionAWS);
		return sessionAWS;
	}
	
	public SessionAWS update(SessionAWS sessionAWS) {
		String filename = sessionAWS.getFileName();
		DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
		Table table = dynamoDB.getTable(sessionTableName);
		Map<String, String> attributeNames = new HashMap<String, String>();
		attributeNames.put("#subject", "subject");
		attributeNames.put("#classname", "classname");
		attributeNames.put("#description", "description");
		attributeNames.put("#visibledate", "visibledate");
		if(!"".equals(filename))
			attributeNames.put("#filename", "filename");
		
		Map<String, Object> attributeValues = new HashMap<String, Object>();
		attributeValues.put(":subject", sessionAWS.getSubject()); 
		attributeValues.put(":classname", sessionAWS.getClassname());  
		attributeValues.put(":description", sessionAWS.getDescription());  
		attributeValues.put(":visibledate", sessionAWS.getVisibleDate());  
		if(!"".equals(filename))
			attributeValues.put(":filename", sessionAWS.getFileName()); 
		
		String updateExpression = "set #subject=:subject, #classname=:classname, #description=:description, #visibledate=:visibledate";
		if(!"".equals(filename))
			updateExpression = updateExpression + ", #filename=:filename";
		
		UpdateItemOutcome outcome = table.updateItem(
			   "sessionid",			// key attribute name
			   sessionAWS.getId(), // key attribute value
			   updateExpression, // UpdateExpression
			   attributeNames,
			   attributeValues);
		return sessionAWS;
	}
	
	public void deleteById(String id) {
		
        try {
        	SessionAWS sessionAWS = null;
        	DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
            scanExpression.addFilterCondition("sessionid", new Condition()
            											.withComparisonOperator(ComparisonOperator.EQ)
            											.withAttributeValueList(new AttributeValue().withS(id)));
            List<SessionAWS> list = mapper.scan(SessionAWS.class, scanExpression);
            if (list != null && list.size() > 0) {
            	sessionAWS = list.get(0);
            }
            mapper.delete(sessionAWS);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
	}
	
	private SessionAWS convertSessionFromItem(Map<String, AttributeValue> item) {
		SessionAWS sessionAWS = new SessionAWS();
		sessionAWS.setId(item.get("sessionid").getS());
		sessionAWS.setSubject(item.get("subject").getS());
		sessionAWS.setClassname(item.get("classname").getS());
		sessionAWS.setDescription(item.get("description").getS());
		sessionAWS.setVisibleDate(item.get("visibledate").getS());
		sessionAWS.setFileName(item.get("filename").getS());
		sessionAWS.setEnabled(Integer.parseInt(item.get("enabled").getN()));
		return sessionAWS;
	}
}
