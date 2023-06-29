import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Helpers from 'App/Helpers/Helpers'
import TaskComment from 'App/Models/TaskComment'
import CreateTaskCommentValidator from 'App/Validators/CreateTaskCommentValidator'

export default class CommentsController {
    /**
     * Get Task Comments
     *
     * @author Hetarth Shah
     * @param request HttpContextContract
     * @returns Promise<any>
     */
    public async getTaskComments({ request }: HttpContextContract): Promise<any> {
        const { task_id } = request.params()
        const { page, perPage } = request.qs()

        const task_comments = await TaskComment.query()
            .preload('sub_comments')
            .where('task_id', task_id)
            .orderBy('created_at', 'desc')
            .paginate(page ?? 1, perPage ?? 10)

        return await Helpers.successResponse('Data fetched successfully!', task_comments.toJSON())
    }

    /**
     * Create Task Comment
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @param request HttpContextContract
     * @returns Promise<any>
     */
    public async createTaskComment({ auth, request }: HttpContextContract): Promise<any> {
        const payload = await request.validate(CreateTaskCommentValidator)

        await TaskComment.create({
            user_id: auth.user?.id,
            task_id: payload.task_id,
            comment: payload.comment,
            parent_id: payload.parent_id,
        })

        return await Helpers.successResponse('Comment created successfully!', [])
    }
}
