import { DateTime } from 'luxon'
import { TaskPriority } from 'Contracts/enums'
import { BaseModel, beforeFetch, column, HasMany, hasMany, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

type TaskQuery = ModelQueryBuilderContract<typeof Task>

export default class Task extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public parent_id: number | null

    @column()
    public title: string

    @column()
    public description: string | null

    @column({ consume: (value: Record<string, string[] | undefined>) => value?.tags ?? [] })
    public tags: Record<string, string[] | undefined>

    @column()
    public is_public: boolean

    @column()
    public is_complete: boolean

    @column()
    public in_challenge: boolean

    @column()
    public priority: TaskPriority

    @column.dateTime()
    public end_at: DateTime | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @hasMany(() => Task, {
        foreignKey: 'id',
        localKey: 'parent_id',
    })
    public sub_tasks: HasMany<typeof Task>

    @beforeFetch()
    public static gettaskThread(query: TaskQuery) {
        query.preload('sub_tasks').whereNotNull('parent_id')
    }
}
