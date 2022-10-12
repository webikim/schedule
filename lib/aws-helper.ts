export const result2object = async (respondBody: ReadableStream<Uint8Array>) => {
    const reader = (respondBody).getReader();
    const result = await reader.read();
    return [new TextDecoder().decode(result.value), result.done];
}