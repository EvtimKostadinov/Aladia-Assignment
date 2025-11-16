import { ApiProperty } from '@nestjs/swagger';

export class UserRto {
  @ApiProperty({
    example: '6372e3a2f3b9a5e4b3f2e1a2',
    description: 'The unique identifier of the user (MongoDB ObjectId)',
  })
  _id: string;

  @ApiProperty({
    example: 'test@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2025-11-09T16:30:00.123Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The timestamp when the user was last updated',
    example: '2025-11-09T16:30:00.123Z',
  })
  updatedAt: string;
}
