import axios from "axios"

type FastApiValidationItem = {
  loc?: Array<string | number>
  msg?: string
  type?: string
}

type FastApiErrorResponse = {
  detail?: string | FastApiValidationItem[]
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Ocurrió un error inesperado."
  }

  const data = error.response?.data as FastApiErrorResponse | undefined

  if (!data?.detail) {
    return "No se pudo completar la solicitud."
  }

  if (typeof data.detail === "string") {
    return data.detail
  }

  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const firstError = data.detail[0]
    return firstError.msg || "Error de validación."
  }

  return "No se pudo completar la solicitud."
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error)) {
    return {}
  }

  const data = error.response?.data as FastApiErrorResponse | undefined

  if (!Array.isArray(data?.detail)) {
    return {}
  }

  return data.detail.reduce<Record<string, string>>((acc, item) => {
    const last = item.loc?.[item.loc.length - 1]

    if (typeof last === "string" && item.msg) {
      acc[last] = item.msg
    }

    return acc
  }, {})
}