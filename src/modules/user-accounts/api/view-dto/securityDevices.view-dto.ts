import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { DevicesDocument } from '../../domain/securityDevices.entity';

export class DevicesViewModel {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(devices: DevicesDocument): DevicesViewModel {
    return {
      ip: devices.ip.toString(),
      title: devices.title,
      lastActiveDate: devices.lastActiveDate.toISOString(),
      deviceId: devices.deviceId,
    };
  }
}

export class DevicesViewPaginated extends PaginatedViewDto<
  DevicesViewModel[]
> {}
