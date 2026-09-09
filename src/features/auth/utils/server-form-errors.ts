import { AxiosError } from 'axios'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

export interface PydanticErrorItem {
  loc?: (string | number)[]
  msg?: string
  type?: string
}

export interface ServerErrorResponse {
  detail?:
    | string
    | PydanticErrorItem[]
    | { message?: string; field?: string }
  title?: string
  message?: string
}

/**
 * Parses server-side validation and authentication errors (from FastAPI / Axios)
 * and sets field-level errors on the React Hook Form instance directly below
 * the field that triggered the validation error.
 *
 * @param error Caught error from mutation or API call
 * @param setError React Hook Form's setError function
 * @returns true if an error was mapped and set on a field or root
 */
export function applyServerValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  if (!(error instanceof AxiosError)) {
    setError('root' as Path<T>, {
      type: 'server',
      message:
        error instanceof Error ? error.message : 'Network error occurred.',
    })
    return true
  }

  const status = error.response?.status
  const data = error.response?.data as ServerErrorResponse | undefined

  if (!data) {
    setError('root' as Path<T>, {
      type: 'server',
      message: error.message || 'An unexpected error occurred.',
    })
    return true
  }

  // 1. Handle Pydantic validation errors (FastAPI 422 Unprocessable Entity)
  if (Array.isArray(data.detail)) {
    let hasSetField = false
    for (const item of data.detail) {
      if (item && Array.isArray(item.loc) && typeof item.msg === 'string') {
        const fieldName = String(item.loc[item.loc.length - 1]) as Path<T>
        setError(fieldName, {
          type: 'server',
          message: item.msg,
        })
        hasSetField = true
      }
    }
    if (hasSetField) return true
  }

  // 2. Handle structured error object { field: string, message: string }
  if (
    data.detail &&
    typeof data.detail === 'object' &&
    !Array.isArray(data.detail)
  ) {
    const detailObj = data.detail as { message?: string; field?: string }
    const fieldName = (detailObj.field || 'root') as Path<T>
    setError(fieldName, {
      type: 'server',
      message: detailObj.message || 'Validation error.',
    })
    return true
  }

  // 3. Handle string detail (e.g. 401 Unauthorized, 403 Forbidden, 400 Bad Request)
  if (typeof data.detail === 'string' && data.detail.length > 0) {
    const detailStr = data.detail
    const lower = detailStr.toLowerCase()

    if (status === 401) {
      // Authentication credentials error -> target email if specific, otherwise password
      if (lower.includes('email') && !lower.includes('password')) {
        setError('email' as Path<T>, {
          type: 'server',
          message: detailStr,
        })
      } else {
        // "Incorrect email or password" or password error
        setError('password' as Path<T>, {
          type: 'server',
          message: detailStr,
        })
      }
      return true
    }

    if (status === 403) {
      setError('root' as Path<T>, {
        type: 'server',
        message: detailStr,
      })
      return true
    }

    // Check message content for field hints
    if (lower.includes('email') && !lower.includes('password')) {
      setError('email' as Path<T>, {
        type: 'server',
        message: detailStr,
      })
      return true
    } else if (lower.includes('password')) {
      setError('password' as Path<T>, {
        type: 'server',
        message: detailStr,
      })
      return true
    } else if (lower.includes('username')) {
      setError('username' as Path<T>, {
        type: 'server',
        message: detailStr,
      })
      return true
    } else {
      setError('root' as Path<T>, {
        type: 'server',
        message: detailStr,
      })
      return true
    }
  }

  // 4. Fallback message (title or generic message)
  const fallback =
    data.title || data.message || error.message || 'Authentication error.'
  setError('root' as Path<T>, {
    type: 'server',
    message: fallback,
  })
  return true
}

