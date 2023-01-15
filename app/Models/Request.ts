import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { RequestType, Status } from 'Contracts/enums'

export default class Request extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public message: string | null

    @column()
    public sent_by_user_id: number

    @column()
    public sent_to_user_id: number

    @column()
    public type: RequestType

    @column()
    public status: Status

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
