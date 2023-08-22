import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'auditRecords'
})
export class AuditRecordsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
