import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './app.component.css', './common.style.css' ],
  template: `
    <div devices></div>
    <div class="iot-box" device></div>

  `
  
})
export class AppComponent {
  constructor(){

  }
} 