import { FieldConfig } from './authConfig'

export interface FormErrors {
  [key: string]: string | undefined
}

export const validateField = (field: FieldConfig, value: string): string | undefined => {
  if (!field.validation) return undefined

  const { validation } = field

  // Required validation
  if (validation.required && !value.trim()) {
    return validation.required
  }

  // Skip other validations if field is empty and not required
  if (!value.trim() && !validation.required) {
    return undefined
  }

  // Pattern validation
  if (validation.pattern) {
    const regex = new RegExp(validation.pattern.regex)
    if (!regex.test(value)) {
      return validation.pattern.message
    }
  }

  // Min length validation
  if (validation.minLength && value.length < validation.minLength.value) {
    return validation.minLength.message
  }

  // Max length validation
  if (validation.maxLength && value.length > validation.maxLength.value) {
    return validation.maxLength.message
  }

  return undefined
}

export const validateForm = (fields: FieldConfig[], values: Record<string, string>): FormErrors => {
  const errors: FormErrors = {}

  fields.forEach(field => {
    const error = validateField(field, values[field.id] || '')
    if (error) {
      errors[field.id] = error
    }
  })

  return errors
}

export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined)
}
