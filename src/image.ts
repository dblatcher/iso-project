
export const imageUrlToSprites = async (href: string, cols: number, rows: number) => {

    const response = await fetch(href)
    const blob = await response.blob()
    const bitmap = await createImageBitmap(blob);
    const { height, width } = bitmap

    const cellWidth = width / cols
    const cellHeight = height / rows

    const frame1Bitmap = await createImageBitmap(blob, 0, 0, cellWidth, cellHeight)

    const canvas = document.createElement('canvas')
    canvas.height = cellHeight
    canvas.width = cellWidth
    const ctx = canvas.getContext('2d')
    ctx.drawImage(frame1Bitmap, 0, 0)
    const dataUrl = canvas.toDataURL()
    return dataUrl
}

export const imgToSprites = async (img: HTMLImageElement, cols: number, rows: number) => {
    const { height, width } = img.getBoundingClientRect()
    const cellWidth = width / cols
    const cellHeight = height / rows


    const makeCellCanvas = async (col: number, row: number): Promise<HTMLCanvasElement> => {

        const cellCanvas = document.createElement('canvas')
        cellCanvas.height = cellHeight
        cellCanvas.width = cellWidth
        const ctx = cellCanvas.getContext('2d')
        const frameBitmap = await createImageBitmap(
            img,
            col * cellWidth,
            row * cellHeight,
            (col + 1) * cellWidth,
            (row + 1) * cellHeight
        )
        ctx.drawImage(frameBitmap, 0, 0)
        return cellCanvas
    }

    return Promise.all([
        makeCellCanvas(1, 0),
        makeCellCanvas(0, 0),
        makeCellCanvas(0, 1),
    ])
}