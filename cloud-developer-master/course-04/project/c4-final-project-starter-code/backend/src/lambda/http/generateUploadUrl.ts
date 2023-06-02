import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodobyId, updateTodoItem } from '../../helpers/todosAcess'
import { getUploadUrl } from '../../helpers/attachmentUtils'

// import { getUserId } from '../utils'
const bucketName = process.env.ATTACHMENT_S3_BUCKET;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const todoId = event.pathParameters.todoId;
      console.log('todoId', todoId);
      console.log('event', event);
      const todo = await getTodobyId(todoId);
      console.log('todo', todo);
      
      todo.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

      console.log(todoId);
      await updateTodoItem(todo);
      const uploadUrl = await getUploadUrl(todoId);
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: uploadUrl
        })
      }

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
