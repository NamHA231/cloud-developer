import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodobyId, updateTodoItem } from '../../helpers/todosAcess'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // try {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      console.log(todoId);
      console.log(updatedTodo);
      let todo = await getTodobyId(todoId);
      todo = { ...todo, ...updatedTodo };
      await updateTodoItem(todo);
      return {
        statusCode: 201,
        body: 'ok'
      }
    // } catch (error) {
    //   return {
    //     statusCode: 500,
    //     body: error
    //   }
    // }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
