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
  
  constructor(private iotService: IotService) {
    iotService.subscribe("EventDeviceListUpdate", {}, (response)=>{
      this.devices = response;
    });
    
    iotService.onConnected(()=>{
      iotService.getDevices();
    });
  }

}
