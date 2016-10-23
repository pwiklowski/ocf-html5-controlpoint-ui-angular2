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
  hide(){
    let device = document.getElementById("iot-devices");
    device.style.transform = "translateY(500px)";
    device.style.opacity = "0";
  }
  show(){
    let device = document.getElementById("iot-devices");
    device.style.transform = "translateY(0px)";
    device.style.opacity = "1";
  }

}
