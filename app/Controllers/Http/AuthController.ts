import crypto from 'crypto'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
import isEmail from 'validator/lib/isEmail'
import constants from 'App/Helpers/constant'
import Helper, { trans } from 'App/Helpers/Helpers'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateProfileValidator from 'App/Validators/UpdateProfileValidator'

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
            username: payload.email.split('@')[0],
            profile_avatar: crypto.randomUUID(),
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

        return await Helper.successResponse(trans('messages.AUTH.register_success'), '')
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
            message: trans('messages.AUTH.invalid_credentials'),
            result: '',
        }

        if (isEmail(payload.email)) {
            try {
                const token = await auth.use('api').attempt(payload.email, payload.password, {
                    expiresIn: constants.TOKEN_EXPIRY,
                })

                return await Helper.successResponse(trans('messages.AUTH.login_success'), token)
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

            return await Helper.successResponse(trans('messages.AUTH.login_success'), token)
        }
    }

    /**
     * Verify Email
     *
     * @author Hetarth Shah
     * @param request HttpContextContract
     * @param params HttpContextContract
     * @param view HttpContextContract
     * @returns Promise<any>
     */
    public async verify({ request, params, view }: HttpContextContract): Promise<any> {
        let responseData = {
            status: false,
            message: trans('messages.AUTH.invalid_signature'),
            result: '',
        }

        if (request.hasValidSignature()) {
            await User.query().where({ email: params.email }).update({ email_verified: true })
            responseData.status = true
            responseData.message = trans('messages.AUTH.email_verification_success')
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
        return await Helper.successResponse(trans('messages.AUTH.logout_success'), '')
    }

    /**
     * Get User Data
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @returns Promise<any>
     */
    public async profile({ auth }: HttpContextContract): Promise<any> {
        return await Helper.successResponse(trans('messages.COMMON.data_fetch_success'), auth.user)
    }

    /**
     * Update User Profile
     *
     * @author Hetarth Shah
     * @param auth HttpContextContract
     * @param request HttpContextContract
     * @param response HttpContextContract
     * @returns Promise<any>
     */
    public async updateProfile({ auth, request, response }: HttpContextContract): Promise<any> {
        const payload = await request.validate(UpdateProfileValidator)
        const unauthorizedResponseData = {
            status: false,
            message: trans('messages.AUTH.invalid_credentials'),
            result: '',
        }

        if (auth.user && Object.keys(payload).length > 0) {
            const user = await User.findOrFail(auth.user.id)

            if (payload.username && payload.username !== '') {
                user.username = payload.username
            }

            if (payload.password && payload.password !== '') {
                user.password = payload.password
            }

            await user.save()
        } else {
            return response.unauthorized(unauthorizedResponseData)
        }

        await auth.user.refresh()

        return await Helper.successResponse(trans('messages.AUTH.profile_update_success'), auth.user)
    }
}
