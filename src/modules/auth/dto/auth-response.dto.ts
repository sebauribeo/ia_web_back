import { ApiProperty } from '@nestjs/swagger';

class UserProfile {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  access_token: string;

  @ApiProperty()
  user: UserProfile;
}
