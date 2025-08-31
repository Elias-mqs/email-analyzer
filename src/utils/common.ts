/* eslint-disable no-undef */
export const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const provisionalDomainUrl = 'https://email-analyzer-seven.vercel.app'
export const processEmailBaseUrl: string = process.env.NEXT_PUBLIC_EMAIL_API_URL || provisionalDomainUrl
