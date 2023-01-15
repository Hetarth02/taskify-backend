import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TaskPriority } from 'Contracts/enums'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
            table.integer('parent_id').unsigned().nullable().references('id').inTable('tasks').onDelete('CASCADE')

            table.string('title', 255).notNullable()
            table.text('description').nullable()
            table.jsonb('tags').nullable()
            table.boolean('is_public').defaultTo(true)
            table.boolean('is_complete').defaultTo(false)

            this.schema.raw("CREATE TYPE task_priority AS ENUM ('high', 'medium', 'low')")
            table.enum('priority', Object.values(TaskPriority)).defaultTo(TaskPriority.LOW)

            table.timestamp('end_at').nullable()

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
        this.schema.raw('DROP TYPE IF EXISTS "task_priority"')
        this.schema.dropTable(this.tableName)
    }
}
