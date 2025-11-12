import { ClientMessageFormat, ClientMessageType, ServerMessageFormat, ServerMessageType } from "./constants";

export const sendServerMessage = (
    ws: any, // ws: WebSocket,
    type: ServerMessageType,
    responseNumber: number,
    sequenceNumber: number,
    data: Buffer,
    ): void => {
        const bufferToSend = Buffer.alloc(3 + data.length)
        bufferToSend.writeUInt8(type, ServerMessageFormat.TYPE)
        bufferToSend.writeUInt8(responseNumber, ServerMessageFormat.RESPONSE)
        bufferToSend.writeUInt8(sequenceNumber, ServerMessageFormat.SEQUENCE)
        data.copy(bufferToSend, ServerMessageFormat.DATA)
        ws.send(bufferToSend)
}

export const sendClientMessage = (
    ws: WebSocket,
    type: ClientMessageType,
    lang: number,
    personality: number,
    responseNumber: number,
    data: Buffer,
    ): void => {
        const bufferToSend = Buffer.alloc(4 + data.length)
        bufferToSend.writeUInt8(type, ClientMessageFormat.TYPE)
        bufferToSend.writeUInt8(lang, ClientMessageFormat.LANG)
        bufferToSend.writeUInt8(personality, ClientMessageFormat.PERSONALITY)
        bufferToSend.writeUInt8(responseNumber, ClientMessageFormat.RESPONSE)
        data.copy(bufferToSend, ClientMessageFormat.DATA)
        ws.send(bufferToSend)
}