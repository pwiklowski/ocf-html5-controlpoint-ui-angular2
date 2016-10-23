import { Component } from '@angular/core';
import { IotService } from './iot.service';
import { Device } from './models';

@Component({
  selector: '[devices]',
  styleUrls: [ './devices.style.css' ],
  templateUrl: './devices.template.html'
})
export class DevicesComponent {
  devices: Array<Device> = new Array<Device>();
  
  onDeviceSelected;
  
  constructor(private iotService: IotService) {
    iotService.subscribe("EventDeviceListUpdate", {}, (response)=>{
      this.devices = response;
    });
    
    iotService.onConnected(()=>{
      iotService.getDevices();
    });
  }
  
  deviceSelected(device){
    console.log("device seleceted", device);
    if (this.onDeviceSelected !== undefined)
      this.onDeviceSelected(device);
  }

}
