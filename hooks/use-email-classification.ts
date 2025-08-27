'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

export interface ClassificationRequest {
  emailContent: string
}

export interface ClassificationResponse {
  category: 'Produtivo' | 'Improdutivo'
  confidence: number
  suggestedResponse: string
}

// Hook para integração futura com a API
export function useEmailClassification() {
  const [result, setResult] = useState<ClassificationResponse | null>(null)

  const classifyEmail = useMutation({
    mutationFn: async (request: ClassificationRequest): Promise<ClassificationResponse> => {
      // Aqui será feita a integração com a API real
      // Por enquanto, retorna um mock
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return {
        category: request.emailContent.toLowerCase().includes('status') ? 'Produtivo' : 'Improdutivo',
        confidence: Math.random() * 0.3 + 0.7,
        suggestedResponse: request.emailContent.toLowerCase().includes('status')
          ? 'Prezado(a), informamos que sua requisição está em andamento.'
          : 'Agradecemos seu contato. Sua mensagem foi recebida.',
      }
    },
    onSuccess: (data) => {
      setResult(data)
    },
  })

  const resetResult = () => {
    setResult(null)
  }

  return {
    result,
    classifyEmail: classifyEmail.mutate,
    isLoading: classifyEmail.isPending,
    error: classifyEmail.error,
    resetResult,
  }
}
