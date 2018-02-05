import {
  keys,
  message,
} from 'wire-webapp-proteus'

import * as CBOR from 'wire-webapp-cbor'

const sodium = require('libsodium-wrappers-sumo')

import { Buffer } from 'buffer'
import { sodiumFromHex } from './utils/hex'

export class Envelope {
  public static decode(d: CBOR.Decoder) {
    const header = {}
    let cipherMessage
    const nprops = d.object()
    for (let i = 0; i <= nprops - 1; i += 1) {
      switch (d.u8()) {
        case 0: {
          (header as IEnvelopeHeader).senderIdentity = keys.IdentityKey.decode(d)
          break
        }
        case 1: {
          const npropsMac = d.object()
          for (let j = 0; j <= npropsMac - 1; j += 1) {
            switch (d.u8()) {
              case 0:
                (header as IEnvelopeHeader).mac = new Uint8Array(d.bytes())
                break
              default:
                d.skip()
            }
          }
          break
        }
        case 2: {
          (header as IEnvelopeHeader).baseKey = keys.PublicKey.decode(d)
          break
        }
        case 3: {
          const npropsMac = d.object()
          for (let j = 0; j <= npropsMac - 1; j += 1) {
            switch (d.u8()) {
              case 0:
                (header as IEnvelopeHeader).sessionTag = `0x${sodium.to_hex(new Uint8Array(d.bytes()))}`
                break
              default:
                d.skip()
            }
          }
          break
        }
        case 4: {
          (header as IEnvelopeHeader).isPreKeyMessage = d.bool()
          break
        }
        case 5: {
          const npropsMac = d.object()
          for (let j = 0; j <= npropsMac - 1; j += 1) {
            switch (d.u8()) {
              case 0:
                (header as IEnvelopeHeader).messageByteLength = new Uint16Array(new Uint8Array(d.bytes()).buffer)[0]
                break
              default:
                d.skip()
            }
          }
          break
        }
        case 6: {
          cipherMessage = message.CipherMessage.decode(d)
          break
        }
        default: {
          d.skip()
        }
      }
    }
    return new Envelope((header as IEnvelopeHeader), cipherMessage as message.CipherMessage)
  }

  public static deserialize(buf: ArrayBuffer) {
    const d = new CBOR.Decoder(buf)
    return Envelope.decode(d)
  }

  public static decrypt(envelopeBuf: ArrayBuffer, preKey: keys.PreKey) {
    return Envelope.deserialize(sodium.crypto_box_seal_open(
      envelopeBuf,
      preKey.key_pair.public_key.pub_curve,
      preKey.key_pair.secret_key.sec_curve,
      'uint8array'
    ).buffer)
  }

  constructor(public header: IEnvelopeHeader, public cipherMessage: message.CipherMessage) {
    this.header = header
    this.cipherMessage = cipherMessage
  }

  public encrypt(preKeyID: number, preKeyPublicKey: keys.PublicKey) {
    const envelopeBuf = Buffer.from(sodium.crypto_box_seal(
      new Uint8Array(this.serialise()), // binary represent
      preKeyPublicKey.pub_curve
    ))
    // prepend the pre-key ID
    const preKeyIDBuf = Buffer.from(Uint16Array.from([preKeyID]).buffer as ArrayBuffer)
    const concatedBuf = Buffer.concat([preKeyIDBuf, envelopeBuf]) // Buffer
    return sodium.to_hex(concatedBuf)
  }

  public serialise() {
    const e = new CBOR.Encoder()
    this.encode(e)
    return e.get_buffer()
  }

  public encode(e: CBOR.Encoder) {
    const {
      senderIdentity, // sender's public key, for envelope reassemble
      mac, // Message authentication code
      baseKey,
      sessionTag,
      isPreKeyMessage,
      messageByteLength,
    } = this.header

    e.object(7)
    e.u8(0)
    senderIdentity.encode(e)
    e.u8(1)
    e.object(1)
    e.u8(0)
    e.bytes(mac)
    e.u8(2)
    baseKey.encode(e)
    e.u8(3)
    e.object(1)
    e.u8(0)
    e.bytes(sodiumFromHex(sessionTag, true))
    e.u8(4)
    e.bool(Number(isPreKeyMessage))
    e.u8(5)
    e.object(1)
    e.u8(0)
    e.bytes(new Uint8Array(Uint16Array.from([messageByteLength]).buffer))
    e.u8(6)
    this.cipherMessage.encode(e)
  }
}

export interface IEnvelopeHeader {
  senderIdentity: keys.IdentityKey
  mac: Uint8Array
  baseKey: keys.PublicKey
  sessionTag: string
  isPreKeyMessage: boolean
  messageByteLength: number
}
