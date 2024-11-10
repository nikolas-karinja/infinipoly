export const log = (message, clearConsole) =>
{
    if (clearConsole)
        console.clear()

    console.log(message)
}