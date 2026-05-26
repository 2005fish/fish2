import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { config } from './config.js'
import { initSchema } from './db/schema.js'
import { errorHandler } from './middleware/errorHandler.js'
import novelsRouter from './routes/novels.js'
import chaptersRouter from './routes/chapters.js'
import authRouter from './routes/auth.js'
import bookshelfRouter from './routes/bookshelf.js'
import historyRouter from './routes/history.js'
import settingsRouter from './routes/settings.js'
import searchRouter from './routes/search.js'

const app = express()

// CORS: allow all origins in dev
if (!config.isProduction) {
  app.use(cors())
}

app.use(express.json())

initSchema()

// API routes
app.use('/api', novelsRouter)
app.use('/api/chapters', chaptersRouter)
app.use('/api/auth', authRouter)
app.use('/api/bookshelf', bookshelfRouter)
app.use('/api/history', historyRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/search', searchRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', production: config.isProduction })
})

// ── Production: serve built client ──
if (config.isProduction && fs.existsSync(config.clientDistPath)) {
  console.log(`Serving static files from ${config.clientDistPath}`)

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(config.clientDistPath, {
    maxAge: '7d',
    etag: true,
  }))

  // SPA fallback: all non-API routes serve index.html
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(config.clientDistPath, 'index.html'))
  })
}

// Error handler
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`)
  if (config.isProduction) {
    console.log('Production mode: serving built client')
  } else {
    console.log('Development mode: use "cd client && npx vite" for hot-reload')
  }
})
