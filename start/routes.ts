/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Test API
Route.get('/', async () => {
    return { hello: 'world' }
})

// Health Check API
Route.get('health', async ({ response }: HttpContextContract) => {
    const report = await HealthCheck.getReport()

    return report.healthy ? response.ok(report) : response.badRequest(report)
}).as('health')

// Web Routes
Route.get('/verify/:email', 'AuthController.verify').as('verifyEmail')

Route.group(() => {
    // Auth APIs
    Route.post('login', 'AuthController.login').as('login')
    Route.post('register', 'AuthController.register').as('register')

    Route.group(() => {
        // User APIs
        Route.get('logout', 'AuthController.logout').as('logout')
        Route.get('profile', 'AuthController.profile').as('profile')
        Route.post('update-profile', 'AuthController.updateProfile').as('updateProfile')

        // Tasks APIs
        Route.get('tasks', 'TasksController.getTasks').as('getTasks')
        Route.post('task', 'TasksController.createTask').as('createTask')

        // Comment APIs
        Route.post('comment', 'CommentsController.createTaskComment').as('createTaskComment')
    }).middleware('auth:api')
    // Comment APIs
    Route.get('/:task_id/comments', 'CommentsController.getTaskComments').as('getTaskComments')

    // Discover APIs
    Route.get('discover', 'TasksController.discover').as('discover')
}).prefix('/api')
