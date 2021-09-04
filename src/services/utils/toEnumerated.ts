const toEnumerated = (text: string): string => {
    return (
        text[0].toLowerCase() +
        text
            .slice(1, text.length)
            .replace(/[A-Z]/g, letter => `_${letter.toUpperCase()}`)
    )
}

export default toEnumerated
