import { useMutation } from '@tanstack/react-query'
import { processEmailBaseUrl } from '@/utils/common'

async function fetchDocumentText(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${processEmailBaseUrl}/api/document`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to fetch document text')
    }

    return await response.text()
  } catch {
    throw new Error('Failed to process document')
  }
}

export function useProcessDocument() {
  const mutation = useMutation({
    mutationFn: fetchDocumentText,
  })

  return {
    processDocument: mutation.mutate,
    processDocumentAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  }
}
