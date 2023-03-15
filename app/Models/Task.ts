import { DateTime } from 'luxon'
import { TaskPriority } from 'Contracts/enums'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
}
