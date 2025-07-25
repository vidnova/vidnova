import { CreateDirectChatUseCase } from './create-direct-chat/create-direct-chat.use-case';
import { CreateGroupChatUseCase } from './create-group-chat/create-group-chat.use-case';
import { GetChatUseCase } from './get-chat/get-chat.use-case';
import { AddMembersToChatUseCase } from './add-member-to-chat/add-members-to-chat.use-case';

export const USE_CASES = [
  CreateDirectChatUseCase,
  CreateGroupChatUseCase,
  GetChatUseCase,
  AddMembersToChatUseCase,
];
