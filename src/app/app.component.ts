import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  visible: boolean;

  clickMe(): void {
    this.visible = false;
  }
  change(value: boolean): void {
    console.log(value);
  }
}
