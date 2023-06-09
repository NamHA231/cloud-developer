import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosbyUser } from '../../helpers/todosAcess'
import { getUserId } from '../utils'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
// import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    console.log(event);
    const todos = await getTodosbyUser(getUserId(event));
    if (todos.length !== 0) {
      return {
        statusCode: 201,
        body: JSON.stringify({
          items: todos
        })
      }
    }

    return {
      statusCode: 404,
      body: ''
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
