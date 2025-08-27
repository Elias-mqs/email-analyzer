import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Clock, Target, BarChart3 } from 'lucide-react'
import type { ClassificationResult } from '@/components/organisms/email-classifier'

interface StatsPanelProps {
  history: ClassificationResult[]
}

export function StatsPanel({ history }: StatsPanelProps) {
  const totalEmails = history.length
  const productiveCount = history.filter((r) => r.category === 'Produtivo').length
  const productivePercentage = Math.round((productiveCount / totalEmails) * 100)
  const avgConfidence = Math.round((history.reduce((acc, r) => acc + r.confidence, 0) / totalEmails) * 100)
  const avgProcessingTime = Math.round(history.reduce((acc, r) => acc + r.processingTime, 0) / totalEmails)

  return (
    <Card className="from-primary/5 to-accent/5 border-primary/20 bg-gradient-to-r">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="text-primary h-5 w-5" />
          Estatísticas da Sessão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center">
              <TrendingUp className="text-accent mr-1 h-4 w-4" />
              <span className="text-foreground text-2xl font-bold">{totalEmails}</span>
            </div>
            <p className="text-muted-foreground text-sm">Emails Analisados</p>
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center">
              <Target className="text-primary mr-1 h-4 w-4" />
              <span className="text-foreground text-2xl font-bold">{productivePercentage}%</span>
            </div>
            <p className="text-muted-foreground text-sm">Produtivos</p>
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center">
              <Badge variant="outline" className="px-2 py-1 text-lg">
                {avgConfidence}%
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">Confiança Média</p>
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center">
              <Clock className="text-accent mr-1 h-4 w-4" />
              <span className="text-foreground text-2xl font-bold">{avgProcessingTime}ms</span>
            </div>
            <p className="text-muted-foreground text-sm">Tempo Médio</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
