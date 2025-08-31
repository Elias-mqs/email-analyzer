'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { EmailUploadForm } from '@/components/molecules/email-upload-form'
import { ClassificationResults } from '@/components/molecules/classification-results'
import { Header } from '@/components/molecules/header'
import { StatsPanel } from '@/components/molecules/stats-panel'
import { ClassificationResponse, useEmailClassification } from '@/hooks/use-email-classification'

export function EmailClassifier() {
  const { classifyAsync, isLoading, data: result, reset } = useEmailClassification()

  const [history, setHistory] = useState<ClassificationResponse[]>([])
  const [contentHasBeenReset, setContentHasBeenReset] = useState(false)

  useEffect(() => {
    if (result) {
      setHistory((prev) => [result, ...prev.slice(0, 9)])
    }
  }, [result])

  const handleEmailSubmit = async (emailContent: string | File) => {
    try {
      if (typeof emailContent === 'string') {
        await classifyAsync({ text: emailContent })
      } else {
        await classifyAsync({ file: emailContent })
      }
    } catch {
      throw new Error('Erro ao classificar o email')
    }
  }

  const handleReset = () => {
    reset()
    setContentHasBeenReset(true)
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Header />

      {history.length > 0 && (
        <div className="mt-8">
          <StatsPanel history={history} />
        </div>
      )}

      <div className="mt-8 space-y-8">
        <Card className="from-card to-card/50 border-0 bg-gradient-to-br p-6 shadow-lg">
          <EmailUploadForm
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
            disabled={isLoading}
            contentHasBeenReset={contentHasBeenReset}
            setContentHasBeenReset={setContentHasBeenReset}
          />
        </Card>

        {result && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <ClassificationResults result={result} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}
