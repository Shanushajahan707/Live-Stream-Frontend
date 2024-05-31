import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailpipe'
})
export class EmailpipePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const [username, domain] = value.split('@');
    if (!username || !domain) return value;

    const maskedUsername = username.length > 3
      ? username.substring(0, 3) + '*'.repeat(username.length - 3)
      : username[0] + '*'.repeat(username.length - 1);
    
    return `${maskedUsername}@${domain}`;
  }

}
