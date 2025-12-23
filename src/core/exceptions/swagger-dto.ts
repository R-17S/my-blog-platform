import { ApiProperty } from '@nestjs/swagger';

export class SwaggerErrorMessage {
  @ApiProperty({ example: 'Login should be unique' }) message: string;
  @ApiProperty({ example: 'login' }) field: string;
}
export class SwaggerErrorResponse {
  @ApiProperty({ type: [SwaggerErrorMessage] })
  errorsMessages: SwaggerErrorMessage[];
}
