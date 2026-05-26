import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'novel-reader-secret-key-change-me',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../data/novel.db'),
  isProduction: process.env.NODE_ENV === 'production',
  clientDistPath: path.resolve(__dirname, '../../client/dist'),
}
