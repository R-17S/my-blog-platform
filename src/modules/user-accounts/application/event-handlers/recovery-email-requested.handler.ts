import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RecoveryEmailRequestedEvent } from '../../domain/events/recovery-email-requested.event';
import { EmailService } from '../email.service';

@EventsHandler(RecoveryEmailRequestedEvent)
export class SendRecoveryEmailHandler
  implements IEventHandler<RecoveryEmailRequestedEvent>
{
  constructor(private readonly emailService: EmailService) {}
  async handle(event: RecoveryEmailRequestedEvent) {
    await this.emailService.sendRecoveryEmail(event.email, event.recoveryCode);
  }
}
