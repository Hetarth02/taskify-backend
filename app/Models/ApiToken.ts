import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ApiToken extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public name: string

    @column()
    public type: string

    @column()
    public token: string

    @column.dateTime()
    public expires_at: DateTime | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime
}
