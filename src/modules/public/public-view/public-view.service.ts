import { Injectable, Scope } from '@nestjs/common';
import { OptionsService } from '../../options/options.service';

@Injectable({ scope: Scope.REQUEST })
export class PublicViewService {
  options = {};
  constructor(private optionService: OptionsService) {
    this.optionService.findDefault().then((options) => {
      this.options = options;
    });
  }

  async getUserTheme() {
    console.log(this.options);
    return this.options['theme'] || 'default';
  }
}
