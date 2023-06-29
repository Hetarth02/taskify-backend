import I18n from '@ioc:Adonis/Addons/I18n'

class Helper {
    public async successResponse(message: string, result: any): Promise<any> {
        return {
            status: true,
            message: message,
            result: result,
        }
    }

    public async errorResponse(message: string, result: any): Promise<any> {
        return {
            status: false,
            message: message,
            result: result,
        }
    }
}

export function trans(key: string, options?: any, locale?: string): string {
    return I18n.locale(locale ?? I18n.defaultLocale).formatMessage(key, options)
}

export default new Helper()
