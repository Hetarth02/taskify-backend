import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Challenge extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public request_id: number

    @column()
    public sender_id: number

    @column()
    public receiver_id: number

    @column()
    public sender_task_id: number

    @column()
    public receiver_task_id: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime
}
