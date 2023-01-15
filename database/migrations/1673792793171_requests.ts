import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { RequestType, Status } from 'Contracts/enums'

export default class extends BaseSchema {
    protected tableName = 'requests'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.integer('sent_by_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
            table.integer('sent_to_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

            table.text('message').nullable()

            this.schema.raw("CREATE TYPE request_types AS ENUM ('friend', 'challenge')")
            table.enum('type', Object.values(RequestType))

            this.schema.raw("CREATE TYPE status AS ENUM ('accept', 'pending', 'reject')")
            table.enum('status', Object.values(Status)).defaultTo(Status.PENDING)

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
        this.schema.raw('DROP TYPE IF EXISTS "request_types"')
        this.schema.raw('DROP TYPE IF EXISTS "status"')
        this.schema.dropTable(this.tableName)
    }
}
