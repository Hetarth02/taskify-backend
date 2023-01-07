import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
import isEmail from 'validator/lib/isEmail'
import constants from 'App/Helpers/constant'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
    /**
     * Register
     *
     * @author Hetarth Shah
     * @param request HttpContextContract
     * @returns Promise<any>
     */
    public async register({ request }: HttpContextContract): Promise<any> {
        const registerSchema = schema.create({
            email: schema.string(
                {
                    trim: true,
                },
                [
                    rules.email(),
                    rules.normalizeEmail({ allLowercase: true }),
                    rules.unique({
                        table: 'users',
                        column: 'email',
                        caseInsensitive: true,
                    }),
                ]
            ),
            password: schema.string({ trim: true }),
        })

        const payload = await request.validate({
            schema: registerSchema,
            messages: {
                'required': 'The {{ field }} is required!',
                'email.unique': 'This {{ field }} is already taken!',
            },
        })

        await User.create({
            email: payload.email,
            password: payload.password,
        })

        let route = Route.makeSignedUrl(
            'verifyEmail',
            {
                email: payload.email,
            },
            {
                expiresIn: '30m',
            }
        )

        await Mail.sendLater((message) => {
            message
                .from('hetarth02@gmail.com')
                .to(payload.email)
                .subject('Welcome Onboard!')
                .htmlView('emails/welcome', {
                    url: `${Env.get('APP_URL')}${route}`,
                })
        })

        return { status: true, message: 'Registered Successfully!', result: '' }
    }

    /**
     * Login
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @param request HttpContextContract
     * @param response HttpContextContract
     * @returns Promise<any>
     */
    public async login({ auth, request, response }: HttpContextContract): Promise<any> {
        const registerSchema = schema.create({
            email: schema.string({ trim: true }),
            password: schema.string({ trim: true }),
        })

        const payload = await request.validate({
            schema: registerSchema,
            messages: {
                required: 'The {{ field }} is required!',
            },
        })

        if (isEmail(payload.email)) {
            try {
                const token = await auth.use('api').attempt(payload.email, payload.password, {
                    expiresIn: constants.TOKEN_EXPIRY,
                })
                return { status: true, message: 'Logged In!', result: token }
            } catch {
                return response.unauthorized({ status: false, message: 'Invalid credentials', result: '' })
            }
        } else {
            const user = await User.query().where('username', payload.email).firstOrFail()

            // Verify password
            if (!(await Hash.verify(user.password, payload.password))) {
                return response.unauthorized({ status: false, message: 'Invalid credentials', result: '' })
            }
            const token = await auth.use('api').generate(user, {
                expiresIn: constants.TOKEN_EXPIRY,
            })

            return { status: true, message: 'Logged In!', result: token }
        }
    }

    /**
     * Verify Email
     *
     * @author Hetarth Shah
     * @param request HttpContextContract
     * @param params HttpContextContract
     * @returns Promise<any>
     */
    public async verify({ request, params }: HttpContextContract): Promise<any> {
        if (request.hasValidSignature()) {
            await User.query().where({ email: params.email }).update({ email_verified: true })
            return { status: true, message: 'Email verification Success!', result: '' }
        }

        return { status: false, message: 'Signature is missing or URL was tampered.', result: '' }
    }

    /**
     * Logout
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @returns Promise<any>
     */
    public async logout({ auth }: HttpContextContract): Promise<any> {
        await auth.use('api').revoke()
        return { status: true, message: 'Logged Out!', result: '' }
    }
}
