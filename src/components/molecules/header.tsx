import { Mail, Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="space-y-4 text-center">
      <div className="flex items-center justify-center gap-3">
        <div className="bg-primary/10 rounded-lg p-3">
          <Mail className="text-primary h-8 w-8" />
        </div>
        <div className="bg-accent/10 rounded-lg p-3">
          <Zap className="text-accent h-8 w-8" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-foreground text-4xl font-bold text-balance">Classificador Inteligente de Emails</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-pretty">
          Automatize a classificação e resposta de emails corporativos com inteligência artificial
        </p>
      </div>

      <div className="text-muted-foreground flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-2 w-2 rounded-full"></div>
          <span>Classificação Automática</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-accent h-2 w-2 rounded-full"></div>
          <span>Respostas Sugeridas</span>
        </div>
      </div>
    </header>
  )
}
