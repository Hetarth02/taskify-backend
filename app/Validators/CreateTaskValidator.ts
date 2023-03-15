import { TaskPriority } from 'Contracts/enums'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class CreateTaskValidator {
    constructor(protected ctx: HttpContextContract) {}

    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */
    public schema = schema.create({
        title: schema.string(
            {
                trim: true,
            },
            [rules.maxLength(255)]
        ),
        parent_id: schema.number.optional(),
        description: schema.string.optional({ trim: true }),
        tags: schema.object.optional().members({
            tags: schema.array.optional([rules.minLength(1)]).members(schema.string()),
        }),
        is_public: schema.boolean.optional(),
        is_complete: schema.boolean.optional(),
        in_challenge: schema.boolean.optional(),
        priority: schema.enum.optional(Object.values(TaskPriority)),
        end_at: schema.date.optional({
            format: 'sql',
        }),
    })

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */
    public messages: CustomMessages = {
        required: 'The {{ field }} is required!',
        maxLength: 'There should not more than {{ options.maxLength }} characters!',
    }
}
