import { CreateDirectChatUseCase } from './create-direct-chat/create-direct-chat.use-case';
import { CreateGroupChatUseCase } from './create-group-chat/create-group-chat.use-case';
import { GetChatUseCase } from './get-chat/get-chat.use-case';
import { AddMembersToChatUseCase } from './add-member-to-chat/add-members-to-chat.use-case';
import { DeleteChatMemberUseCase } from './delete-chat-member/delete-chat-member.use-case';
import { UpdateChatMemberRoleUseCase } from './update-chat-member-role/update-chat-member-role.use-case';
import { UpdateChatInfoUseCase } from './update-chat-info/update-chat-info.use-case';
import { GetUserChatsUseCase } from './get-user-chats/get-user-chats.use-case';
import { DeleteChatSelfUseCase } from './delete-chat-self/delete-chat-self.use-case';
import { DeleteChatUseCase } from './delete-chat/delete-chat.use-case';

export const USE_CASES = [
  CreateDirectChatUseCase,
  CreateGroupChatUseCase,
  GetChatUseCase,
  AddMembersToChatUseCase,
  DeleteChatMemberUseCase,
  UpdateChatMemberRoleUseCase,
  UpdateChatInfoUseCase,
  GetUserChatsUseCase,
  DeleteChatSelfUseCase,
  DeleteChatUseCase,
];
