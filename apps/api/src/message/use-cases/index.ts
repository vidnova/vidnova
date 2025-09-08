import { CreateMessageUseCase } from './create-message/create-message.use-case';
import { CreateMessageReactionUseCase } from './create-message-reaction/create-message-reaction.use-case';
import { UpdateMessageUseCase } from './update-message/update-message.use-case';
import { DeleteMessageForAllUseCase } from './delete-message-for-all/delete-message-for-all.use-case';
import { DeleteMessageSelfUseCase } from './delete-message-self/delete-message-self.use-case';
import { DeleteMessageReactionUseCase } from './delete-message-reaction/delete-message-reaction.use-case';

export const USE_CASES = [
  CreateMessageUseCase,
  CreateMessageReactionUseCase,
  UpdateMessageUseCase,
  DeleteMessageForAllUseCase,
  DeleteMessageSelfUseCase,
  DeleteMessageReactionUseCase,
];
