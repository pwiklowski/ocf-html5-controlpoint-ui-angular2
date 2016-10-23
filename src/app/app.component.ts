import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Device } from './models';
import { DeviceComponent } from './device.component';
import { DevicesComponent } from './devices.component';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './app.component.css', './common.style.css' ],
  template: `
    <md-toolbar color="accent">
    <button class="app-icon-button" (click)="showDeviceList()" >
      <i class="material-icons app-toolbar-menu">menu</i>
    </button>
      <span>My Application Title</span>
    </md-toolbar>
    <div id="iot-devices">
      <md-card>
        <div #devices devices></div>
      </md-card>
    </div>
    
    <div id="iot-device">
      <md-card>
        <div #device device></div>
      </md-card>
    </div>

  `
  
})
export class AppComponent {
  @ViewChild("device") device : DeviceComponent;
  @ViewChild("devices") devices : DevicesComponent;
  
  ngOnInit(){
    this.devices.onDeviceSelected = (device)=>{
      this.device.setDevice(device);
      this.device.show();
      this.devices.hide();
    };
  }
  
  showDeviceList(){
    this.device.hide();
    this.devices.show();
  }
  
  

} 