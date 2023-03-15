import Task from 'App/Models/Task'
import Helpers from 'App/Helpers/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'
// import { TaskPriority } from 'Contracts/enums'

export default class TasksController {
    /**
     * Get User Data
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @param request HttpContextContract
     * @returns Promise<any>
     */
    public async getTasks({ auth, request }: HttpContextContract): Promise<any> {
        const { page, perPage } = request.qs()

        const tasks = await Task.query()
            .where('user_id', auth.user!.id)
            .paginate(page ?? 1, perPage ?? 10)

        return await Helpers.successResponse('Data fetched successfully!', tasks.toJSON())
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
            user_id: auth.user?.id,
            parent_id: payload.parent_id,
            title: payload.title,
            description: payload.description,
            tags: payload.tags,
            is_public: payload.is_public,
            is_complete: payload.is_complete,
            in_challenge: payload.in_challenge,
            priority: payload.priority,
            end_at: payload.end_at,
        })

        return await Helpers.successResponse('Task created successfully!', [])
    }
}
