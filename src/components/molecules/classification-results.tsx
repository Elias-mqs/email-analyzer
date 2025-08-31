'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, RotateCcw, Copy, Mail, Clock, Hash, Heart } from 'lucide-react'
import { useState } from 'react'
import { ClassificationResponse } from '@/hooks/use-email-classification'

interface ClassificationResultsProps {
  result: ClassificationResponse
  onReset: () => void
}

export function ClassificationResults({ result, onReset }: ClassificationResultsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyResponse = async () => {
    await navigator.clipboard.writeText(result.suggestedResponse ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isProdutivo = result.category === 'Produtivo'
  const confidencePercentage = result.confidence !== undefined ? Math.round(result.confidence * 100) : 0

  const getSentimentColor = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) {
      return 'text-gray-600'
    }

    if (sentiment > 0.2) {
      return 'text-green-600'
    } else if (sentiment < -0.2) {
      return 'text-red-600'
    } else {
      return 'text-yellow-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-semibold">Resultado da Classificação</h2>
        <Button variant="outline" onClick={onReset} className="hover:bg-primary/10 bg-transparent">
          <RotateCcw className="mr-2 h-4 w-4" />
          Nova Análise
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isProdutivo ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Categoria Identificada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge
                variant={isProdutivo ? 'default' : 'destructive'}
                className="animate-in zoom-in-50 px-4 py-2 text-lg duration-300"
              >
                {result.category ?? 'Desconhecido'}
              </Badge>
              <span className="text-muted-foreground text-sm">{confidencePercentage}% de confiança</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nível de Confiança</span>
                <span className="font-medium">{confidencePercentage}%</span>
              </div>
              <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                    isProdutivo
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">
                  <span className="text-muted-foreground mr-1">Processamento:</span>
                  <span className="font-medium">
                    {result.processingTime !== undefined ? result.processingTime.toFixed(3) + 'ms' : 'N/A'}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${getSentimentColor(result.sentimentScore)}`} />
                <span className="text-sm">
                  <span className="text-muted-foreground mr-1">Sentimento:</span>
                  <span className={`ml-1 ${getSentimentColor(result.sentimentScore)}`}>
                    {result.sentimentScore !== undefined && result.sentimentScore !== null
                      ? result.sentimentScore.toFixed(3)
                      : 'N/A'}
                  </span>
                </span>
              </div>

              {Array.isArray(result.keywords) && result.keywords.length > 0 && (
                <div className="flex items-center gap-2">
                  <Hash className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    <span className="text-muted-foreground mr-1">palavras-chave</span>
                    <span className="font-medium">{result.keywords.length}</span>
                  </span>
                </div>
              )}
            </div>

            {Array.isArray(result.keywords) && result.keywords.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">Palavras-chave identificadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="text-primary h-5 w-5" />
              Resposta Sugerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="from-muted to-muted/50 rounded-lg border bg-gradient-to-br p-4">
              <p className="text-sm leading-relaxed">{result.suggestedResponse ?? 'Nenhuma resposta sugerida.'}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyResponse}
              className={`w-full transition-all duration-200 ${
                copied ? 'border-green-200 bg-green-50 text-green-700' : 'hover:bg-primary/5'
              }`}
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'Copiado!' : 'Copiar Resposta'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Analisado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="from-muted to-muted/30 max-h-48 overflow-y-auto rounded-lg border bg-gradient-to-br p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {result.formattedContent ?? 'Nenhum texto analisado.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
