'use client'

import type React from 'react'

import { useCallback, useState } from 'react'
import { Upload, FileText, AlertCircle, FileCheck2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProcessDocument } from '@/hooks/use-process-document'

interface FileUploadZoneProps {
  // eslint-disable-next-line no-unused-vars
  onFileContent: (content: string) => void
  disabled?: boolean
  emailText?: string
}

export function FileUploadZone({ onFileContent, disabled, emailText }: FileUploadZoneProps) {
  const { processDocumentAsync } = useProcessDocument()

  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      const validTypes = ['text/plain', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setError('Apenas arquivos .txt e .pdf são suportados')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Arquivo muito grande. Máximo 5MB permitido')
        return
      }

      try {
        let content = ''

        if (file.type === 'text/plain') {
          content = await file.text()
        } else if (file.type === 'application/pdf') {
          const response = await processDocumentAsync(file)

          content = response
        }

        onFileContent(content)
      } catch {
        setError('Erro ao processar arquivo')
      }
    },
    [onFileContent, processDocumentAsync],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile, disabled],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])

      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile],
  )

  return (
    <div className="space-y-4">
      {emailText ? (
        <div
          className={cn(
            'border-primary/50 bg-primary/5 relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <FileCheck2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">O conteúdo está carregado!</h3>
              <p className="text-muted-foreground">Você pode prosseguir com a análise.</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragOver && !disabled && 'border-primary bg-primary/5',
            !isDragOver && 'border-border hover:border-primary/50',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 rounded-full p-3">
                <Upload className="text-primary h-8 w-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Arraste e solte seu arquivo aqui</h3>
              <p className="text-muted-foreground">ou clique para selecionar</p>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>.txt</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>.pdf</span>
              </div>
            </div>
          </div>

          <input
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileInput}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={disabled}
          />
        </div>
      )}

      {error && (
        <div className="text-destructive flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
