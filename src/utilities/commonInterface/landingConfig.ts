import landingConfig from '../json/landingConfig.json'

export interface LandingConfig {
  meta: {
    title: string
    description: string
    keywords: string[]
  }
  branding: {
    logo: {
      text: string
      size: string
      color: string
      textColor: string
      textSize: string
    }
    companyName: string
    companyNameSize: string
  }
  hero: {
    enabled: boolean
    heading: {
      text: string
      highlightedWord: string
      highlightedWordIndex: number
      size: string
      gradient: string
    }
    description: string
    ctaButtons: Array<{
      id: string
      text: string
      href: string
      variant: string
      className: string
    }>
    stats: Array<{
      id: string
      value: string
      label: string
    }>
    animation: {
      enabled: boolean
      type: string
      file: string
      height: number
      width: number
    }
  }
  features: {
    enabled: boolean
    heading: {
      text: string
      size: string
    }
    description: string
    items: Array<{
      id: string
      icon: string
      title: string
      description: string
    }>
  }
  cta: {
    enabled: boolean
    heading: string
    description: string
    buttons: Array<{
      id: string
      text: string
      href: string
      variant: string
      className: string
    }>
    background: string
  }
  footer: {
    enabled: boolean
    copyright: string
    className: string
  }
  layout: {
    container: {
      className: string
    }
    background: {
      className: string
    }
    sections: {
      spacing: string
      container: string
    }
  }
}

export const getLandingConfig = (): LandingConfig => landingConfig as LandingConfig
