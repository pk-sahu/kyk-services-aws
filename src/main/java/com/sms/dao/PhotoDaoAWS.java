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
import com.sms.model.PhotoAWS;

@Repository
public class PhotoDaoAWS {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	
	@Value("${table.name.photos}")
	private String photoTableName;
	
	public PhotoAWS findById(String id){
		
		Map<String, AttributeValue> expressionAttributeValues = new HashMap<String, AttributeValue>();
    	expressionAttributeValues.put(":val", new AttributeValue().withS(id)); 
    	        
    	ScanRequest scanRequest = new ScanRequest()
    	    .withTableName(photoTableName)
    	    .withFilterExpression("photoid = :val")
    	    .withExpressionAttributeValues(expressionAttributeValues);

    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	Map<String, AttributeValue> item = result.getItems().get(0);
    	PhotoAWS photoAWS = convertPhotoFromItem(item); 
		return photoAWS;
	}
	
	public List<PhotoAWS> findAll(){
		
		ScanRequest scanRequest = new ScanRequest().withTableName(photoTableName);		
    	ScanResult result = amazonDynamoDB.scan(scanRequest);
    	List<PhotoAWS> photoList = new ArrayList<PhotoAWS>();
    	for (Map<String, AttributeValue> item : result.getItems()){
    		PhotoAWS photoAWS = convertPhotoFromItem(item); 
    		photoList.add(photoAWS);
    	}
		return photoList;
	}
	
	public PhotoAWS save(PhotoAWS photoAWS) {
		DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
		photoAWS.setId(Long.toString(new Date().toInstant().toEpochMilli()));
		String fileName = photoAWS.getFileName();
		String filetype = getFileType(fileName);    
		photoAWS.setFiletype(filetype);
		mapper.save(photoAWS);
		return photoAWS;
	}
	
	public PhotoAWS update(PhotoAWS photoAWS) {
		String filename = photoAWS.getFileName();
		DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);
		Table table = dynamoDB.getTable(photoTableName);
		Map<String, String> attributeNames = new HashMap<String, String>();
		attributeNames.put("#activity", "activity");
		attributeNames.put("#albumdate", "albumdate");
		if(!"".equals(filename)){
			attributeNames.put("#filename", "filename");
			attributeNames.put("#filetype", "filetype");
		}
		
		Map<String, Object> attributeValues = new HashMap<String, Object>();
		attributeValues.put(":activity", photoAWS.getActivity()); 
		attributeValues.put(":albumdate", photoAWS.getAlbumdate());  
		if(!"".equals(filename)){
			attributeValues.put(":filename", photoAWS.getFileName());
			attributeValues.put(":filetype", getFileType(photoAWS.getFileName()));
		}
		
		String updateExpression = "set #activity=:activity, #albumdate=:albumdate";
		if(!"".equals(filename)){
			updateExpression = updateExpression + ", #filename=:filename, #filetype=:filetype";
		}
		
		UpdateItemOutcome outcome = table.updateItem(
			   "photoid",			// key attribute name
			   photoAWS.getId(), // key attribute value
			   updateExpression, // UpdateExpression
			   attributeNames,
			   attributeValues);
		return photoAWS;
	}
	
	public void deleteById(String id) {
		
        try {
        	PhotoAWS photoAWS = null;
        	DynamoDBMapper mapper = new DynamoDBMapper(amazonDynamoDB);
            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
            scanExpression.addFilterCondition("photoid", new Condition()
            											.withComparisonOperator(ComparisonOperator.EQ)
            											.withAttributeValueList(new AttributeValue().withS(id)));
            List<PhotoAWS> list = mapper.scan(PhotoAWS.class, scanExpression);
            if (list != null && list.size() > 0) {
            	photoAWS = list.get(0);
            }
            mapper.delete(photoAWS);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
	}
	
	private PhotoAWS convertPhotoFromItem(Map<String, AttributeValue> item) {
		PhotoAWS photoAWS = new PhotoAWS();
		photoAWS.setId(item.get("photoid").getS());
		photoAWS.setActivity(item.get("activity").getS());
		photoAWS.setAlbumdate(item.get("albumdate").getS());
		photoAWS.setFileName(item.get("filename").getS());
		photoAWS.setFiletype(item.get("filetype").getS());
		return photoAWS;
	}
	private String getFileType(String fileName) {
		return fileName.substring((fileName.lastIndexOf('.')+1));
	}
}
