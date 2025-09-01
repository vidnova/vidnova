export class MessageQuery {
  static readonly SELECT_FIELDS = {
    id: true,
    content: true,
    isUpdated: true,
    type: true,
    createdAt: true,
    updatedAt: true,
    chatId: true,
    reactions: {
      select: {
        id: true,
        emoji: true,
        createdAt: true,
        user: { select: { id: true, firstName: true, lastName: true, imageUrl: true } },
      },
    },
    attachments: {
      select: { id: true, fileName: true, fileSize: true, mimeType: true, url: true, type: true },
    },
    replyTo: {
      select: { id: true, content: true },
    },
    sender: {
      select: { id: true, firstName: true, lastName: true, imageUrl: true },
    },
  };
}
