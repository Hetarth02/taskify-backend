import { DateTime } from 'luxon'
import { RequestType, Status } from 'Contracts/enums'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Request extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public sender_id: number

    @column()
    public receiver_id: number

    @column()
    public message: string | null

    @column()
    public type: RequestType

    @column()
    public status: Status

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime
}
