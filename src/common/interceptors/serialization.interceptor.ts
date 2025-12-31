import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import {
  SERIALIZATION_GROUPS_KEY,
  SerializationGroups,
} from '../decorators/serialize-response.decorator';

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Get serialization groups from decorator
    const groups = this.reflector.get<SerializationGroups[]>(
      SERIALIZATION_GROUPS_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        if (!data || !groups) {
          return data;
        }

        // Determine user context
        let userContext = SerializationGroups.PUBLIC;
        if (user) {
          const isSuperAdmin = user.roles?.some(
            (role) => role.name === 'superadmin',
          );
          const isAdmin = user.roles?.some((role) =>
            role.permissions?.some(
              (permission) =>
                permission.resource === 'user' &&
                permission.action === 'manage',
            ),
          );
          if (isSuperAdmin || isAdmin) {
            userContext = SerializationGroups.ADMIN;
          } else {
            userContext = SerializationGroups.USER;
          }
        }

        // Filter groups based on user context
        let activeGroups = groups;
        if (userContext === SerializationGroups.PUBLIC) {
          activeGroups = groups.filter((group) => group === SerializationGroups.PUBLIC);
        } else if (userContext === SerializationGroups.USER) {
          activeGroups = groups.filter(
            (group) => group === SerializationGroups.PUBLIC || group === SerializationGroups.USER,
          );
        }
        // For admin, use all groups

        const options: ClassTransformOptions = {
          groups: activeGroups,
          excludeExtraneousValues: true,
        };

        // Handle arrays and single objects
        if (Array.isArray(data)) {
          return data.map((item) => this.transformItem(item, options));
        } else if (data && typeof data === 'object') {
          // Handle paginated responses
          if (data.data && Array.isArray(data.data)) {
            return {
              ...data,
              data: data.data.map((item) => this.transformItem(item, options)),
            };
          }
          return this.transformItem(data, options);
        }

        return data;
      }),
    );
  }

  private transformItem(item: any, options: ClassTransformOptions): any {
    if (!item || typeof item !== 'object') {
      return item;
    }

    // Get the constructor of the item to determine its type
    const itemConstructor = item.constructor;

    // Apply transformation
    try {
      return plainToClass(itemConstructor, item, options);
    } catch (error) {
      // If transformation fails, return the original item
      // This handles cases where the item doesn't have a proper constructor
      return item;
    }
  }
}
