import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'task_partners'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id')

            table.bigInteger('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')
            table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

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
