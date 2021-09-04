const arrayBufferToString = (arrayBuffer: Buffer): string => {
    return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer))
}

export default arrayBufferToString
