'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileUploadZone } from '@/components/atoms/file-upload-zone'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Send, FileText, Sparkles } from 'lucide-react'

interface EmailUploadFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (emailContent: string) => void
  isLoading: boolean
  disabled: boolean
}

export function EmailUploadForm({ onSubmit, isLoading, disabled }: EmailUploadFormProps) {
  const [emailText, setEmailText] = useState('')
  const [activeTab, setActiveTab] = useState('text')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailText.trim()) {
      onSubmit(emailText.trim())
    }
  }

  const handleFileContent = (content: string) => {
    setEmailText(content)
    setActiveTab('text')
  }

  const handleExampleEmail = (type: 'productive' | 'unproductive') => {
    const examples = {
      productive:
        'Prezados, gostaria de solicitar o status atual da minha requisição de empréstimo protocolo #12345. O prazo inicial era de 15 dias úteis e já se passaram 10 dias. Preciso dessa informação para finalizar outros documentos relacionados. Agradeço a atenção e aguardo retorno.',
      unproductive:
        'Oi pessoal! Espero que todos estejam bem. Queria desejar um feliz natal antecipado para toda a equipe! Que 2024 seja um ano cheio de alegrias e realizações. Um abraço carinhoso para todos! 🎄🎅',
    }
    setEmailText(examples[type])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-foreground flex items-center gap-2 text-2xl font-semibold">
          <Sparkles className="text-primary h-6 w-6" />
          Enviar Email para Classificação
        </h2>
        <p className="text-muted-foreground">
          Cole o texto do email ou faça upload de um arquivo para análise automática
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger
            value="text"
            className="flex cursor-pointer items-center gap-2 transition-colors hover:bg-zinc-200/50"
          >
            <FileText className="h-4 w-4" />
            Texto Direto
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="flex cursor-pointer items-center gap-2 transition-colors hover:bg-zinc-200/50"
          >
            <Send className="h-4 w-4" />
            Upload de Arquivo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="mb-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleExampleEmail('productive')}
              disabled={disabled}
              className="text-xs"
            >
              Exemplo Produtivo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleExampleEmail('unproductive')}
              disabled={disabled}
              className="text-xs"
            >
              Exemplo Improdutivo
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-text">Conteúdo do Email</Label>
              <Textarea
                id="email-text"
                placeholder="Cole aqui o conteúdo do email que deseja classificar..."
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                className="focus:ring-primary/20 min-h-[200px] resize-none transition-all duration-200 focus:ring-2"
                disabled={disabled}
              />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>{emailText.length} caracteres</span>
                <span>
                  {
                    emailText
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }{' '}
                  palavras
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="group relative w-full overflow-hidden"
              disabled={!emailText.trim() || disabled}
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Classificar Email
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <FileUploadZone onFileContent={handleFileContent} disabled={disabled} />

          {emailText && (
            <div className="animate-in slide-in-from-top-2 space-y-2 duration-300">
              <Label>Conteúdo Carregado</Label>
              <div className="from-muted to-muted/50 max-h-32 overflow-y-auto rounded-md border bg-gradient-to-br p-3">
                <p className="text-muted-foreground text-sm">
                  {emailText.substring(0, 200)}
                  {emailText.length > 200 && '...'}
                </p>
              </div>

              <Button onClick={() => onSubmit(emailText)} className="group w-full" disabled={disabled} size="lg">
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Classificar Email Carregado
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
