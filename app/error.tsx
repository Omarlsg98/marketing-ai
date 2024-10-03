'use client'

import ErrorPage from '@/components/error-page'

export default function Error({ error }: { error: Error }) {
  return (
    <ErrorPage 
      statusCode={500}
      message="We're sorry, but we're having trouble processing your request. Please try again later."
    />
  )
}