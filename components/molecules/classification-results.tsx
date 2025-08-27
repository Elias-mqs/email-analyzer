'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, RotateCcw, Copy, Mail, Clock, Hash, Heart } from 'lucide-react'
import type { ClassificationResult } from '@/components/organisms/email-classifier'
import { useState } from 'react'

interface ClassificationResultsProps {
  result: ClassificationResult
  onReset: () => void
}

export function ClassificationResults({ result, onReset }: ClassificationResultsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyResponse = async () => {
    await navigator.clipboard.writeText(result.suggestedResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isProdutivo = result.category === 'Produtivo'
  const confidencePercentage = Math.round(result.confidence * 100)

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positivo':
        return 'text-green-600'
      case 'Negativo':
        return 'text-red-600'
      default:
        return 'text-gray-600'
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
        {/* Classificação Principal */}
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
                {result.category}
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
                  <span className="font-medium">{result.processingTime}ms</span>
                  <span className="text-muted-foreground ml-1">processamento</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${getSentimentColor(result.sentiment)}`} />
                <span className="text-sm">
                  <span className="font-medium">Sentimento:</span>
                  <span className={`ml-1 ${getSentimentColor(result.sentiment)}`}>{result.sentiment}</span>
                </span>
              </div>

              {result.keywords.length > 0 && (
                <div className="flex items-center gap-2">
                  <Hash className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    <span className="font-medium">{result.keywords.length}</span>
                    <span className="text-muted-foreground ml-1">palavras-chave</span>
                  </span>
                </div>
              )}
            </div>

            {result.keywords.length > 0 && (
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

        {/* Resposta Sugerida */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="text-primary h-5 w-5" />
              Resposta Sugerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="from-muted to-muted/50 rounded-lg border bg-gradient-to-br p-4">
              <p className="text-sm leading-relaxed">{result.suggestedResponse}</p>
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

      {/* Email Original */}
      <Card>
        <CardHeader>
          <CardTitle>Email Analisado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="from-muted to-muted/30 max-h-48 overflow-y-auto rounded-lg border bg-gradient-to-br p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.originalText}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
