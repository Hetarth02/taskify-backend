import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import Helper from 'App/Helpers/Helpers'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
import isEmail from 'validator/lib/isEmail'
import constants from 'App/Helpers/constant'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
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
        const payload = await request.validate(RegisterValidator)

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

        return await Helper.successResponse('Registered Successfully!', '')
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
        const payload = await request.validate(LoginValidator)
        const unauthorizedResponseData = {
            status: false,
            message: 'Invalid credentials!',
            result: '',
        }

        if (isEmail(payload.email)) {
            try {
                const token = await auth.use('api').attempt(payload.email, payload.password, {
                    expiresIn: constants.TOKEN_EXPIRY,
                })

                return await Helper.successResponse('Logged In!', token)
            } catch {
                return response.unauthorized(unauthorizedResponseData)
            }
        } else {
            const user = await User.query().where('username', payload.email).firstOrFail()

            // Verify password
            if (!(await Hash.verify(user.password, payload.password))) {
                return response.unauthorized(unauthorizedResponseData)
            }

            const token = await auth.use('api').generate(user, {
                expiresIn: constants.TOKEN_EXPIRY,
            })
            return await Helper.successResponse('Logged In!', token)
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
    public async verify({ request, params, view }: HttpContextContract): Promise<any> {
        let responseData = {
            status: false,
            message: 'Signature is missing or URL was tampered.',
            result: '',
        }

        if (request.hasValidSignature()) {
            await User.query().where({ email: params.email }).update({ email_verified: true })
            responseData.status = true
            responseData.message = 'Email verification Success!'
        }

        return await view.render('auth/verified', responseData)
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
        return await Helper.successResponse('Logged Out!', '')
    }
}
