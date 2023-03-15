import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import constants from 'App/Helpers/constant'
import { column, beforeSave, BaseModel, computed } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public email: string

    @column()
    public username: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public email_verified: boolean

    @column()
    public profile_avatar: string | null

    @column()
    public remember_me_token: string | null

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }

    @computed()
    public get getProfileAvatarUrl() {
        return `${constants.PROFILE_URL}/${this.profile_avatar}`
    }
}
