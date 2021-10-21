import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { Get3lastMessagesController } from "./controllers/GetLast3MessagesController";
import { GetProfileUserController } from "./controllers/GetProfileUserController";
import { isAuthenticated } from "./middleware/isAuthenticated";

const router = Router()

router.post('/authenticate', new AuthenticateUserController().handle)

router.post('/messages',
    isAuthenticated,
    new CreateMessageController().handle)

router.get('/messages/last3', new Get3lastMessagesController().handle)
router.get('/users/:user_id', new GetProfileUserController().handle)


export { router };