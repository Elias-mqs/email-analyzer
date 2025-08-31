'use client'
import { useMutation } from '@tanstack/react-query'
import { baseUrl } from '@/utils/common'

export interface ClassificationResponse {
  category: string
  confidence?: number
  suggestedResponse?: string
  originalText: string
  processingTime?: number
  keywords?: string[]
  sentiment?: string
  formattedContent?: string
  [key: string]: any
}

interface ClassificationInput {
  text?: string
  file?: File
}

export async function classifyEmail(input: ClassificationInput): Promise<ClassificationResponse> {
  let response: Response

  if (input.text) {
    response = await fetch(`${baseUrl}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailContent: input.text }),
    })
  } else if (input.file) {
    const formData = new FormData()

    formData.append('file', input.file)
    response = await fetch(`${baseUrl}/classify`, {
      method: 'POST',
      body: formData,
    })
  } else {
    throw new Error('Nenhum texto ou arquivo fornecido')
  }

  if (!response.ok) throw new Error('Erro ao classificar')
  return response.json()
}

export function useEmailClassification() {
  const mutation = useMutation({
    mutationFn: classifyEmail,
  })

  return {
    classify: mutation.mutate,
    classifyAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  }
}
