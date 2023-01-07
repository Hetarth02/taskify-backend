import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('email', 255).notNullable().unique()
            table.string('username', 255).nullable().unique()
            table.string('password', 255).notNullable()
            table.boolean('email_verified').defaultTo(0).comment('0 => Not verified, 1 => Verified')
            table.string('profile_avatar', 255).nullable()
            table.string('remember_me_token').nullable()

            table.timestamps(true, true)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
