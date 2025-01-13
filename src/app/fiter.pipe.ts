import { Pipe, PipeTransform } from '@angular/core';
import { Event } from './services/events/events.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: Event[], searchText: string): Event[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return item.name.toLowerCase().includes(searchText) ||
             item.destiny.toLowerCase().includes(searchText);
    });
  }
}