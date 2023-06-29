import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, column, HasMany, hasMany, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

type TaskCommentQuery = ModelQueryBuilderContract<typeof TaskComment>

export default class TaskComment extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public task_id: number

    @column()
    public parent_id: number | null

    @column()
    public comment: string | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @hasMany(() => TaskComment, {
        localKey: 'id',
        foreignKey: 'parent_id',
    })
    public sub_comments: HasMany<typeof TaskComment>

    @beforeFetch()
    public static getCommentThread(query: TaskCommentQuery) {
        query.preload('sub_comments')
    }
}
