import app from './app'
import { logger } from './utils/logger'

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  logger.logger.info(`Server is running at http://localhost:${port}`)
})
