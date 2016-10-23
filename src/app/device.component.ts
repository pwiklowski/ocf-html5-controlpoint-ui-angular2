import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { DevicesComponent } from './devices.component';
import { IotService } from './iot.service';
import { Device } from './models';
import { VariableColourRgbComponent } from './variable-rgb.component';
import { VariableLightDimmingComponent } from './variable-dimming.component';
import { VariableGenericComponent } from './variable-generic.component';
import { VariableComponent } from './variable.component';

@Component({
  selector: '[device]',
  template: `
  <div #container>
    <md-card-title>{{device?.name}}</md-card-title>    
    <md-card-subtitle>{{device?.id}}</md-card-subtitle>    
  </div>`,
})
export class DeviceComponent extends Component{   
  device: Device;
  componentFactoryResolver: ComponentFactoryResolver;
  resourceComponents: Map<string, VariableComponent> = new Map<string, VariableComponent>();
    
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  
  
  constructor(componentFactoryResolver: ComponentFactoryResolver, private iotService: IotService) {
    this.componentFactoryResolver = componentFactoryResolver;
  }
  
  setDevice(device){
    this.device = device;
    this.iotService.onConnected(()=>{
      this.iotService.getDevice(this.device.id, (device)=>{
        this.container.clear();
        console.log("on connected from device component")

        device.resources.forEach(v => {
          let factory = this.componentFactoryResolver.resolveComponentFactory(
              this.variableComponentFactory(v.values["rt"]));

          let c = this.container.createComponent(factory);  
          (<any>c.instance).init(this.device.id, v.name, v.values);

          this.resourceComponents[v.name] = c;
        });
      });
    });
  }
  

  variableComponentFactory(rt) : any{
    if (rt == "oic.r.light.dimming"){
      return VariableLightDimmingComponent;
    }else if(rt === "oic.r.colour.rgb"){
      return VariableColourRgbComponent;
    }else{
      return VariableGenericComponent;
    }
  }

  hide(){
    let device = document.getElementById("iot-device");
    device.style.transform = "translateY(500px)";
    device.style.opacity = "0";
  }
  show(){
    let device = document.getElementById("iot-device");
    device.style.transform = "translateY(0px)";
    device.style.opacity = "1";
  }
}