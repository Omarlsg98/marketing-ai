import ErrorPage from '@/components/error-page'

export default function NotFound() {
  return (
    <ErrorPage 
      statusCode={404}
      message="Sorry, we couldn't find the page you're looking for."
    />
  )
}