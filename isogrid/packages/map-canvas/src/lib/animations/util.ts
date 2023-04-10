export const pause = async (t: number) => await new Promise(resolve => {
    setTimeout(resolve, t)
})

export const hop = (step: number, totalSteps: number, hopHeight: number): number => {
    const d = step / totalSteps
    return ((-2 * d ** 2) + (2 * d)) * hopHeight
}

export const repeatStep = async (
    step: { (step: number, totalSteps: number): void },
    totalSteps: number,
    delay = 5
) => {
    for (let i = 0; i++, i < totalSteps;) {
        await step(i, totalSteps)
        await pause(delay)
    }
}
