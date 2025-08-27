'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { EmailUploadForm } from '@/components/molecules/email-upload-form'
import { ClassificationResults } from '@/components/molecules/classification-results'
import { Header } from '@/components/molecules/header'
import { StatsPanel } from '@/components/molecules/stats-panel'

export interface ClassificationResult {
  category: 'Produtivo' | 'Improdutivo'
  confidence: number
  suggestedResponse: string
  originalText: string
  processingTime: number
  keywords: string[]
  sentiment: 'Positivo' | 'Neutro' | 'Negativo'
}

export function EmailClassifier() {
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<ClassificationResult[]>([])

  const handleEmailSubmit = async (emailContent: string) => {
    setIsLoading(true)
    const startTime = Date.now()

    // Simular processamento da API com tempo realista
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Análise mais inteligente do conteúdo
    const lowerContent = emailContent.toLowerCase()

    // Palavras-chave para classificação produtiva
    const productiveKeywords = [
      'status',
      'requisição',
      'solicitação',
      'andamento',
      'prazo',
      'documento',
      'contrato',
      'proposta',
      'orçamento',
      'reunião',
      'projeto',
      'relatório',
      'aprovação',
      'assinatura',
      'urgente',
      'importante',
      'deadline',
    ]

    // Palavras-chave para classificação improdutiva
    const unproductiveKeywords = [
      'feliz natal',
      'parabéns',
      'aniversário',
      'festa',
      'convite pessoal',
      'piada',
      'meme',
      'corrente',
      'spam',
      'promoção pessoal',
    ]

    // Análise de sentimento básica
    const positiveWords = ['obrigado', 'agradeço', 'excelente', 'ótimo', 'perfeito']
    const negativeWords = ['problema', 'erro', 'falha', 'reclamação', 'insatisfeito']

    const foundProductiveKeywords = productiveKeywords.filter((keyword) => lowerContent.includes(keyword))
    const foundUnproductiveKeywords = unproductiveKeywords.filter((keyword) => lowerContent.includes(keyword))

    const isProductive = foundProductiveKeywords.length > foundUnproductiveKeywords.length
    const confidence = Math.min(
      0.95,
      0.65 + Math.max(foundProductiveKeywords.length, foundUnproductiveKeywords.length) * 0.1,
    )

    // Análise de sentimento
    const positiveCount = positiveWords.filter((word) => lowerContent.includes(word)).length
    const negativeCount = negativeWords.filter((word) => lowerContent.includes(word)).length
    let sentiment: 'Positivo' | 'Neutro' | 'Negativo' = 'Neutro'

    if (positiveCount > negativeCount) sentiment = 'Positivo'
    else if (negativeCount > positiveCount) sentiment = 'Negativo'

    // Respostas mais contextuais
    let suggestedResponse = ''
    if (isProductive) {
      if (lowerContent.includes('status') || lowerContent.includes('andamento')) {
        suggestedResponse =
          'Prezado(a), informamos que sua requisição está em andamento. Nossa equipe está trabalhando no seu pedido e entraremos em contato assim que houver atualizações. Estimamos conclusão em 2-3 dias úteis.'
      } else if (lowerContent.includes('documento') || lowerContent.includes('arquivo')) {
        suggestedResponse =
          'Prezado(a), recebemos sua solicitação de documentos. Os arquivos solicitados serão enviados em até 24 horas úteis. Caso precise de algo específico, por favor nos informe.'
      } else if (lowerContent.includes('reunião') || lowerContent.includes('encontro')) {
        suggestedResponse =
          'Prezado(a), agradecemos sua solicitação de reunião. Nossa agenda está sendo verificada e retornaremos com disponibilidades em breve. Qual seria o melhor horário para você?'
      } else {
        suggestedResponse =
          'Prezado(a), recebemos sua mensagem e ela está sendo analisada pela equipe responsável. Retornaremos com uma resposta detalhada em até 48 horas úteis.'
      }
    } else {
      suggestedResponse =
        'Prezado(a), agradecemos seu contato. Sua mensagem foi recebida e será direcionada ao setor apropriado para o devido tratamento.'
    }

    const processingTime = Date.now() - startTime
    const keywords = isProductive ? foundProductiveKeywords : foundUnproductiveKeywords

    const newResult: ClassificationResult = {
      category: isProductive ? 'Produtivo' : 'Improdutivo',
      confidence,
      suggestedResponse,
      originalText: emailContent,
      processingTime,
      keywords: keywords.slice(0, 5), // Máximo 5 palavras-chave
      sentiment,
    }

    setResult(newResult)
    setHistory((prev) => [newResult, ...prev.slice(0, 9)]) // Manter últimos 10 resultados
    setIsLoading(false)
  }

  const handleReset = () => {
    setResult(null)
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
          <EmailUploadForm onSubmit={handleEmailSubmit} isLoading={isLoading} disabled={isLoading} />
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
