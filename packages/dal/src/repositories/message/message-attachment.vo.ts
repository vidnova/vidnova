import { MessageAttachmentType } from '@ecorally/shared';

export class MessageAttachment {
  constructor(
    private readonly _id: string,
    private readonly _fileName: string,
    private readonly _fileSize: number,
    private readonly _mimeType: string,
    private readonly _url: string,
    private readonly _type: MessageAttachmentType,
    private readonly _messageId: string,
  ) {}

  get id(): string {
    return this._id;
  }

  get fileName(): string {
    return this._fileName;
  }

  get fileSize(): number {
    return this._fileSize;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get url(): string {
    return this._url;
  }

  get type(): MessageAttachmentType {
    return this._type;
  }

  get messageId(): string {
    return this._messageId;
  }

  toJSON() {
    return {
      id: this._id,
      fileName: this._fileName,
      fileSize: this._fileSize,
      mimeType: this._mimeType,
      url: this._url,
      type: this._type,
    };
  }
}
