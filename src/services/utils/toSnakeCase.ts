const toSnakeCase = (str: string): string =>
    str &&
    str
        .replace(/ć/g, 'c')
        .replace(/č/g, 'c')
        .replace(/đ/g, 'dj')
        .replace(/ž/g, 'z')
        .replace(/Ć/g, 'c')
        .replace(/Č/g, 'c')
        .replace(/Đ/g, 'dj')
        .replace(/Ž/g, 'z')
        .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map((x: string) => x.toLowerCase())
        .join('_')

export default toSnakeCase
