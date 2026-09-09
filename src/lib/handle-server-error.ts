import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ErrorResponseData {
  title?: string
  detail?: string | Array<{ msg?: string }>
  message?: string
}

export function handleServerError(error: unknown): string {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number((error as { status: unknown }).status) === 204
  ) {
    errMsg = 'No content.'
  }

  if (error instanceof AxiosError) {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers?.['retry-after']
      const retryMsg = retryAfter
        ? ` Please wait ${retryAfter}s before trying again.`
        : ' Please wait a moment before trying again.'
      errMsg = `Rate limit exceeded.${retryMsg}`
      toast.error(errMsg)
      return errMsg
    }

    const data = error.response?.data as ErrorResponseData | undefined
    if (data) {
      if (typeof data.title === 'string' && data.title.length > 0) {
        errMsg = data.title
      } else if (typeof data.detail === 'string' && data.detail.length > 0) {
        errMsg = data.detail
      } else if (Array.isArray(data.detail) && data.detail.length > 0) {
        const first = data.detail[0]
        if (first && typeof first.msg === 'string' && first.msg.length > 0) {
          errMsg = first.msg
        }
      } else if (typeof data.message === 'string' && data.message.length > 0) {
        errMsg = data.message
      }
    }
  }

  toast.error(errMsg)
  return errMsg
}
