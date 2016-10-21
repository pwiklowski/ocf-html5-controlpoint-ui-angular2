import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './app.component.css', './common.style.css' ],
  template: `<div devices></div>`
  
})
export class AppComponent {
  constructor(){

  }
} 