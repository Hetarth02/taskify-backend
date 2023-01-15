import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { TaskPriority } from 'Contracts/enums'

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

    @column({ consume: (value: Record<string, string[]>) => value.tags })
    public tags: string[]

    @column()
    public is_public: boolean

    @column()
    public is_complete: boolean

    @column()
    public priority: TaskPriority

    @column.dateTime()
    public end_at: DateTime | null

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
