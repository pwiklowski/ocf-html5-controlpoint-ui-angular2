import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './app.component.css', './common.style.css' ],
  template: `
    <md-toolbar color="accent">
    <button class="app-icon-button" >
      <i class="material-icons app-toolbar-menu">menu</i>
    </button>
      <span>My Application Title</span>
    </md-toolbar>
    <md-card>
      <div devices></div>
    </md-card>
    <md-card>
      <div device></div>
    </md-card>

  `
  
})
export class AppComponent {
  constructor(){

  }
} 