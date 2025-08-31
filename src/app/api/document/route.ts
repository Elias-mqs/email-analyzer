import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import PDFParser from 'pdf2json'
import { extractTextSmart } from './helper'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Converte o File em Buffer
    const arrayBuffer = await file.arrayBuffer()
    // eslint-disable-next-line no-undef
    const buffer = Buffer.from(arrayBuffer)

    // Salva temporariamente no diretório /tmp
    const tempPath = path.join('/tmp', file.name)
    await fs.writeFile(tempPath, buffer)

    // Cria uma Promise para esperar o parsing
    const data = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser()
      pdfParser.on('pdfParser_dataReady', (pdfData) => resolve(pdfData))
      pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError))
      pdfParser.loadPDF(tempPath)
    })

    const content = extractTextSmart(data)

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename=conteudo.pdf.txt',
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Falha ao processar PDF' }, { status: 500 })
  }
}
