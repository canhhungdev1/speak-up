export class UserProfileDto {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string;
  createdAt: string;
}

export class AuthResponseDto {
  statusCode: number;
  message: string;
  isNewUser: boolean;
  user: UserProfileDto;
  meta: {
    asyncEmailTriggered: boolean;
    messageBroker?: string;
  };
}
