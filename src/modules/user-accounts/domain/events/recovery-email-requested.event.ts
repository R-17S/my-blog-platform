export class RecoveryEmailRequestedEvent {
  constructor(
    public readonly email: string,
    public readonly recoveryCode: string,
  ) {}
}
