import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { getUserId } from '../utils';
// import { createTodo } from '../../businessLogic/todos'
import { createTodoItem } from '../../helpers/todosAcess'
import { prepareTodo } from '../../helpers/todos'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const todo = prepareTodo(newTodo, event);
    const createTodo = await createTodoItem(todo);
    return {
      statusCode: 201,
      body: JSON.stringify({
        createTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
