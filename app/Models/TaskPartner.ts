import User from './User'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class TaskPartner extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public task_id: number

    @column()
    public user_id: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @belongsTo(() => User, {})
    public user: BelongsTo<typeof User>
}
