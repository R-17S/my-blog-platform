import { RegistrationEmailRequestedEvent } from '../../domain/events/registration-email-requested.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';

@EventsHandler(RegistrationEmailRequestedEvent)
export class SendRegistrationEmailHandler
  implements IEventHandler<RegistrationEmailRequestedEvent>
{
  constructor(private readonly emailService: EmailService) {}
  async handle(event: RegistrationEmailRequestedEvent) {
    await this.emailService.sendRegistrationEmail(event.email, event.code);
  }
}
