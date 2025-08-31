export function extractTextSmart(pdfData: any): string {
  const allLines: Record<number, { x: number; text: string }[]> = {}

  pdfData.Pages.forEach((page: any, pageIndex: number) => {
    page.Texts.forEach((t: any) => {
      const y = Math.round(t.y * 10) + pageIndex * 10000
      const text = t.R.map((r: any) => decodeURIComponent(r.T)).join('')

      if (!allLines[y]) {
        allLines[y] = []
      }

      allLines[y].push({ x: t.x, text })
    })
  })

  const sortedY = Object.keys(allLines)
    .map(Number)
    .sort((a, b) => a - b)

  const output: string[] = []

  sortedY.forEach((y) => {
    const sortedLine = allLines[y].sort((a, b) => a.x - b.x)

    let lineText = ''
    let lastX = 0

    sortedLine.forEach(({ x, text }, i) => {
      // define "gap" entre caracteres → ajustável
      const gap = x - lastX
      if (i > 0 && gap > 1.0) {
        lineText += ' ' // se o espaço é "grande", adiciona espaço
      }
      lineText += text
      lastX = x
    })

    output.push(lineText.trim())
  })

  return output.join('\n')
}
