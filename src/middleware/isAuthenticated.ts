import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken";

interface IPayLoad {
    sub: string
}

export function isAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({ error: "token invalid" })
    }
    const [name, token] = authToken.split(" ")
    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayLoad

        response.locals.user_id = sub

        return next()
    } catch (err) {
        return response.status(401).json({ error: 'token expired' })
    }
}