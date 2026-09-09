import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { applyServerValidationErrors } from './server-form-errors'

describe('applyServerValidationErrors', () => {
  it('maps FastAPI 422 Pydantic validation errors to specific fields', () => {
    const setError = vi.fn()
    const error = new AxiosError('Unprocessable Entity')
    error.response = {
      status: 422,
      data: {
        detail: [
          {
            loc: ['body', 'email'],
            msg: 'value is not a valid email address',
            type: 'value_error',
          },
          {
            loc: ['body', 'password'],
            msg: 'String should have at least 1 character',
            type: 'string_too_short',
          },
        ],
      },
    } as AxiosResponse

    const result = applyServerValidationErrors(error, setError)
    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'value is not a valid email address',
    })
    expect(setError).toHaveBeenCalledWith('password', {
      type: 'server',
      message: 'String should have at least 1 character',
    })
  })

  it('maps 401 Incorrect email or password to password field', () => {
    const setError = vi.fn()
    const error = new AxiosError('Unauthorized')
    error.response = {
      status: 401,
      data: {
        detail: 'Incorrect email or password.',
      },
    } as AxiosResponse

    const result = applyServerValidationErrors(error, setError)
    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('password', {
      type: 'server',
      message: 'Incorrect email or password.',
    })
  })

  it('maps specific email error string to email field', () => {
    const setError = vi.fn()
    const error = new AxiosError('Bad Request')
    error.response = {
      status: 400,
      data: {
        detail: 'No account found with this email address.',
      },
    } as AxiosResponse

    const result = applyServerValidationErrors(error, setError)
    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'No account found with this email address.',
    })
  })

  it('maps specific username error string to username field', () => {
    const setError = vi.fn()
    const error = new AxiosError('Bad Request')
    error.response = {
      status: 400,
      data: {
        detail: "Username 'johndoe' already exists",
      },
    } as AxiosResponse

    const result = applyServerValidationErrors(error, setError)
    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('username', {
      type: 'server',
      message: "Username 'johndoe' already exists",
    })
  })

  it('maps 403 inactive account error to root', () => {
    const setError = vi.fn()
    const error = new AxiosError('Forbidden')
    error.response = {
      status: 403,
      data: {
        detail: 'Your account is inactive. Please contact administrator.',
      },
    } as AxiosResponse

    const result = applyServerValidationErrors(error, setError)
    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('root', {
      type: 'server',
      message: 'Your account is inactive. Please contact administrator.',
    })
  })

  it('handles structured object errors with field property', () => {
    const setError = vi.fn()
    const error = new AxiosError('Bad Request')
    error.response = {
      status: 400,
      data: {
        detail: {
          field: 'email',
          message: 'Email already registered',
        },
      },
    } as AxiosResponse

    const result = applyServerValidationErrors(error, setError)
    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Email already registered',
    })
  })

  it('handles non-Axios generic error by setting root', () => {
    const setError = vi.fn()
    const error = new Error('Connection refused')

    const result = applyServerValidationErrors(error, setError)
    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('root', {
      type: 'server',
      message: 'Connection refused',
    })
  })
})

