import { Request, Response } from "express"
import { GetProfileUserService } from "../services/GetProfileUserService"

class GetProfileUserController {
    async handle(request: Request, response: Response) {
        const { user_id } = request.params;

        const service = new GetProfileUserService()
        const result = await service.execute(user_id)

        return response.json(result)

    }
}

export { GetProfileUserController }