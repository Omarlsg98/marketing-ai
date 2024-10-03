'use client'

import ErrorPage from '@/components/error-page'

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body>
        <ErrorPage 
          statusCode={500}
          message="A critical error occurred. We're working on fixing it."
        />
      </body>
    </html>
  )
}