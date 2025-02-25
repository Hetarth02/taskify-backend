import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'api_tokens'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').primary()

            table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
            table.string('name').notNullable()
            table.string('type').notNullable()
            table.string('token', 64).notNullable().unique()
            table.timestamp('expires_at').nullable()

            // For MySQL
            // table.timestamps(true, true)

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
