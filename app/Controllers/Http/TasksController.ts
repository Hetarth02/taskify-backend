import Task from 'App/Models/Task'
import Helpers, { trans } from 'App/Helpers/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'

export default class TasksController {
    /**
     * Get User Tasks
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @param request HttpContextContract
     * @returns Promise<any>
     */
    public async getTasks({ auth, request }: HttpContextContract): Promise<any> {
        const { page, perPage, is_public, priority } = request.qs()

        const tasks = await Task.query()
            // .preload('sub_tasks')
            // .whereNull('parent_id')
            .where('user_id', auth.user!.id)
            .if(is_public, (query) => {
                query.where('is_public', is_public)
            })
            .if(priority, (query) => {
                query.where('priority', priority)
            })
            .orderBy('id', 'desc')
            .paginate(page ?? 1, perPage ?? 10)

        return await Helpers.successResponse(trans('messages.COMMON.data_fetch_success'), tasks.toJSON())
    }

    /**
     * Create Task
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @param request HttpContextContract
     * @returns Promise<any>
     */
    public async createTask({ auth, request }: HttpContextContract): Promise<any> {
        const payload = await request.validate(CreateTaskValidator)

        await Task.create({
            tags: payload.tags,
            title: payload.title,
            user_id: auth.user?.id,
            end_at: payload.end_at,
            priority: payload.priority,
            is_public: payload.is_public,
            parent_id: payload.parent_id,
            description: payload.description,
            is_complete: payload.is_complete,
            in_challenge: payload.in_challenge,
        })

        return await Helpers.successResponse(trans('messages.TASK.create_success'), [])
    }

    /**
     * Discover Public Tasks
     *
     * @author Hetarth Shah
     * @param request HttpContextContract
     * @returns Promise<any>
     */
    public async discover({ request }: HttpContextContract): Promise<any> {
        const { page, perPage } = request.qs()

        const tasks = await Task.query()
            .whereNull('parent_id')
            .where('is_public', true)
            .orderBy('id', 'desc')
            .paginate(page ?? 1, perPage ?? 10)

        return await Helpers.successResponse(trans('messages.COMMON.data_fetch_success'), tasks.toJSON())
    }
}
