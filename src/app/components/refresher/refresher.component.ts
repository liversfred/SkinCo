import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-refresher',
  templateUrl: './refresher.component.html',
  styleUrls: ['./refresher.component.scss'],
})
export class RefresherComponent {
  @Input() showRefresher: boolean = true;
  @Output() refresh = new EventEmitter<RefresherCustomEvent>;

  constructor() { }

  onRefresh(event: RefresherCustomEvent) {
    this.refresh.emit(event);
  }

}
