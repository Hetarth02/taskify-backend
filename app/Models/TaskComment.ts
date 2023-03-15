import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TaskComment extends BaseModel {
    @column({ isPrimary: true })
    public id: number

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
}
