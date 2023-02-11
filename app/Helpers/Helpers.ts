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

export default new Helper()
