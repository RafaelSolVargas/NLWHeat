import { serverHttp } from "./app"

const PORT = process.env.PORT
serverHttp.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`))