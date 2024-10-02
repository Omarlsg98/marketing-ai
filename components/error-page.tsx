import Image from 'next/image'
import Link from 'next/link'

interface ErrorPageProps {
  statusCode: number
  message?: string
}

export default function ErrorPage({
  statusCode,
  message = "We're sorry, but something went wrong. Please try again later.",
}: ErrorPageProps) {
  const errorImageSrc = `/assets/error-pages/${statusCode}.png`

  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="mb-8">
          <Image
            src={errorImageSrc}
            alt={`Error ${statusCode}`}
            width={400}
            height={300}
            className="w-full h-auto"
          />
        </div>
        <div className="text-center">
          <p className="text-lg mb-8">{message}</p>
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary dark:bg-primary-foreground rounded-md hover:bg-primary/90 dark:hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-foreground dark:ring-offset-gray-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}