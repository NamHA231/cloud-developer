import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
// const logger = createLogger('TodosAccess')
const docClient: DocumentClient = createDynamoDBClient();
const todosTable = process.env.TODOS_TABLE;
const todoIdIndex = process.env.TODOS_CREATED_AT_INDEX;

// TODO: Implement the dataLayer logic

export async function createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  export async function updateTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    console.log('todoItem', todoItem)
    const result = await docClient.update({
      TableName: todosTable,
      Key: {
        "userId": todoItem.userId,
        "todoId": todoItem.todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl, done = :done',
      ExpressionAttributeValues: {
        ':attachmentUrl': todoItem.attachmentUrl,
        ':done': todoItem.done
    }
    }).promise()

    return result.Attributes as TodoItem;
  }

  export async function getTodosbyUser(userId: String): Promise<TodoItem[]> {

  const result = await docClient.query({
      TableName : todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
  }).promise()

  return result.Items as TodoItem[];
  }

  export async function getTodobyId(todoId: String): Promise<TodoItem> {
    const result = await docClient.query({
        TableName : todosTable,
        IndexName : todoIdIndex,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()
    console.log('result', result);
    
    return result.Items.length ? result.Items[0] as TodoItem : null;
  }

  export async function deleteTodoItem(todoItem: TodoItem): Promise<String> {
    console.log('deleteTodoItem', todoItem)
    const result = await docClient.delete({
      TableName: todosTable,
      Key: {
        userId: todoItem.userId,
        todoId: todoItem.todoId
      }
    }).promise()
    console.log('result', result);
    
    return 'ok';
  }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }