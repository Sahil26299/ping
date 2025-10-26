"use client";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { FormConfig, FormErrors, getBrandingConfig, getLayoutConfig, getValidationConfig, hasFormErrors, validateForm } from '@/src/utilities'
import Link from 'next/link';

interface AuthFormProps {
  formConfig: FormConfig
  onSubmit: (values: Record<string, string>) => Promise<void>
  onSocialLogin: () => void
  onFooterAction: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({
  formConfig,
  onSubmit,
  onSocialLogin,
  onFooterAction
}) => {
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  const brandingConfig = getBrandingConfig()
  const layoutConfig = getLayoutConfig()
  const validationConfig = getValidationConfig()

  const handleFieldChange = (fieldId: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: undefined }))
    }
  }

  const handleTogglePassword = (fieldId: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldId]: !prev[fieldId] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm(formConfig.fields, values)
    setErrors(formErrors)
    
    if (hasFormErrors(formErrors)) return
    
    setIsLoading(true)
    try {
      await onSubmit(values)
      setValues({})
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={layoutConfig.container.className}>
      <div className={layoutConfig.formContainer.className}>
        {/* Logo/Brand Section */}
        <div className={layoutConfig.brandingSection.className}>
          <div className={`${brandingConfig.logo.size} ${brandingConfig.logo.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
            <span className={`${brandingConfig.logo.textColor} ${brandingConfig.logo.textSize}`}>
              {brandingConfig.logo.text}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{brandingConfig.title}</h1>
          <p className="text-muted-foreground">
            {formConfig.submitButton.text?.toLowerCase() === 'sign up' ? brandingConfig.subtitle.signup : brandingConfig.subtitle.login}
          </p>
        </div>

        {/* Form */}
        <div className={layoutConfig.formCard.className}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            {formConfig.fields.map(field => (
              <FormField
                key={field.id}
                field={field}
                value={values[field.id] || ''}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
                showPassword={showPasswords[field.id]}
                onTogglePassword={() => handleTogglePassword(field.id)}
              />
            ))}

            {/* Options */}
            {(formConfig.options.rememberMe.enabled || formConfig.options.forgotPassword.enabled) && (
              <div className="flex items-center justify-between">
                {formConfig.options.rememberMe.enabled && (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-muted-foreground">{formConfig.options.rememberMe.label}</span>
                  </label>
                )}
                {formConfig.options.forgotPassword.enabled && (
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {formConfig.options.forgotPassword.label}
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className={formConfig.submitButton.size}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>{formConfig.submitButton.loadingText}</span>
                </div>
              ) : (
                formConfig.submitButton.text
              )}
            </Button>
          </form>

          {/* Divider */}
          {formConfig.socialLogin.enabled && (
            <div className={layoutConfig.divider.className}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">{layoutConfig.divider.text}</span>
              </div>
            </div>
          )}

          {/* Social Login Button */}
          {formConfig.socialLogin.enabled && (
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-base font-medium"
              onClick={onSocialLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {formConfig.socialLogin.text}
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            {formConfig.footer.text}{' '}
            <Link 
              className="text-primary hover:text-primary/80 font-medium transition-colors p-0 text-[16px]"
              href={formConfig.footer.linkHref}
            >
              {formConfig.footer.linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
