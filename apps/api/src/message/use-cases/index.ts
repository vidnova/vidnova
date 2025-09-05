import { CreateMessageUseCase } from './create-message/create-message.use-case';
import { CreateMessageReactionUseCase } from './create-message-reaction/create-message-reaction.use-case';
import { UpdateMessageUseCase } from './update-message/update-message.use-case';
import { DeleteMessageForAllUseCase } from './delete-message-for-all/delete-message-for-all.use-case';

export const USE_CASES = [
  CreateMessageUseCase,
  CreateMessageReactionUseCase,
  UpdateMessageUseCase,
  DeleteMessageForAllUseCase,
];
