import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'challenges'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id')

            table.bigInteger('request_id').unsigned().references('id').inTable('requests').onDelete('CASCADE')

            table.bigInteger('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
            table.bigInteger('receiver_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

            table.bigInteger('sender_task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')
            table.bigInteger('receiver_task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE')

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
