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
import com.sms.model.WorksheetAWS;

@Repository
public class WorksheetDao {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	
	@Value("${table.name.worksheets}")
	private String worksheetTableName;
	
	@Autowired
	private UserDaoAWS userRepository;
	
	public List<WorksheetAWS> getWorksheetForUser(String username){
		
		UserInfoAWS UserInfoAWS = userRepository.getUserDetail(username);
		
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":val", new AttributeValue().withS(UserInfoAWS.getClassname())); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(worksheetTableName)
    	    .withFilterExpression("classname = :val")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	List<WorksheetAWS> worksheetList = new ArrayList<WorksheetAWS>();
    	for (Map<String, AttributeValue> item : result.getItems()){
    		WorksheetAWS worksheetAWS = convertWorksheetFromItem(item); 
    		worksheetList.add(worksheetAWS);
    	}
		return worksheetList;
	}

	public WorksheetAWS findById(String id){
		
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":val", new AttributeValue().withS(id)); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(worksheetTableName)
    	    .withFilterExpression("worksheetid = :val")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	Map<String, AttributeValue> item = result.getItems().get(0);
    	WorksheetAWS worksheetAWS = convertWorksheetFromItem(item); 
		return worksheetAWS;
	}
	
	public List<WorksheetAWS> findAll(){
		
		ScanRequest scanRequest = new ScanRequest().withTableName(worksheetTableName);		
    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	List<WorksheetAWS> worksheetList = new ArrayList<WorksheetAWS>();
    	for (Map<String, AttributeValue> item : result.getItems()){
    		WorksheetAWS worksheetAWS = convertWorksheetFromItem(item); 
    		worksheetList.add(worksheetAWS);
    	}
		return worksheetList;
	}
	
	public WorksheetAWS save(WorksheetAWS worksheetAWS) {
		DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
		worksheetAWS.setId(Long.toString(new Date().toInstant().toEpochMilli()));
		String fileName = worksheetAWS.getFileName();
		String filetype = getFileType(fileName);    
		worksheetAWS.setFiletype(filetype);
		mapper.save(worksheetAWS);
		return worksheetAWS;
	}
	
	public WorksheetAWS update(WorksheetAWS worksheetAWS) {
		String filename = worksheetAWS.getFileName();
		DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
		Table table = dynamoDB.getTable(worksheetTableName);
		Map<String, String> attributeNames = new HashMap<String, String>();
		attributeNames.put("#worksheetname", "worksheetname");
		attributeNames.put("#worksheetdate", "worksheetdate");
		attributeNames.put("#classname", "classname");
		if(!"".equals(filename)){
			attributeNames.put("#filename", "filename");
			attributeNames.put("#filetype", "filetype");
		}
		
		Map<String, Object> attributeValues = new HashMap<String, Object>();
		attributeValues.put(":worksheetname", worksheetAWS.getWorksheetname()); 
		attributeValues.put(":worksheetdate", worksheetAWS.getWorksheetdate());  
		attributeValues.put(":classname", worksheetAWS.getClassname()); 
		if(!"".equals(filename)){
			attributeValues.put(":filename", worksheetAWS.getFileName());
			attributeValues.put(":filetype", getFileType(worksheetAWS.getFileName()));
		}
		
		String updateExpression = "set #worksheetname=:worksheetname, #worksheetdate=:worksheetdate, #classname=:classname";
		if(!"".equals(filename)){
			updateExpression = updateExpression + ", #filename=:filename, #filetype=:filetype";
		}
		
		UpdateItemOutcome outcome = table.updateItem(
			   "worksheetid",			// key attribute name
			   worksheetAWS.getId(), // key attribute value
			   updateExpression, // UpdateExpression
			   attributeNames,
			   attributeValues);
		return worksheetAWS;
	}
	
	public void deleteById(String id) {
		
        try {
        	WorksheetAWS worksheetAWS = null;
        	DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
            scanExpression.addFilterCondition("worksheetid", new Condition()
            											.withComparisonOperator(ComparisonOperator.EQ)
            											.withAttributeValueList(new AttributeValue().withS(id)));
            List<WorksheetAWS> list = mapper.scan(WorksheetAWS.class, scanExpression);
            if (list != null && list.size() > 0) {
            	worksheetAWS = list.get(0);
            }
            mapper.delete(worksheetAWS);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
	}
	
	private WorksheetAWS convertWorksheetFromItem(Map<String, AttributeValue> item) {
		WorksheetAWS worksheetAWS = new WorksheetAWS();
		worksheetAWS.setId(item.get("worksheetid").getS());
		worksheetAWS.setWorksheetname(item.get("worksheetname").getS());
		worksheetAWS.setWorksheetdate(item.get("worksheetdate").getS());
		worksheetAWS.setClassname(item.get("classname").getS());
		worksheetAWS.setFileName(item.get("filename").getS());
		worksheetAWS.setFiletype(item.get("filetype").getS());
		return worksheetAWS;
	}
	private String getFileType(String fileName) {
		return fileName.substring((fileName.lastIndexOf('.')+1));
	}
}
