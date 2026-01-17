export class RegistrationEmailRequestedEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
