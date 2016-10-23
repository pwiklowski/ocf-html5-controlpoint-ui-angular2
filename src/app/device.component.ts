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
    <md-card-title>{{device.name}}</md-card-title>    
    <md-card-subtitle>{{device.uuid}}</md-card-subtitle>    
  </div>`,
})
export class DeviceComponent extends Component{   
  device: Device;
  componentFactoryResolver: ComponentFactoryResolver;
  resourceComponents: Map<string, VariableComponent> = new Map<string, VariableComponent>();
    
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  
  constructor(componentFactoryResolver: ComponentFactoryResolver, private iotService: IotService) {
    this.device = new Device();
    this.device.uuid = "0685B960-736F-46F7-BEC0-9E6CBD61ADC2";
    this.device.name = "Device name";
    this.componentFactoryResolver = componentFactoryResolver;
  }
  
  ngOnInit() {
    this.iotService.subscribe("EventDeviceListUpdate", {}, (response)=>{
      console.log("device list update");
    });
    
    this.iotService.onConnected(()=>{
      this.iotService.getDevice(this.device.uuid, (device)=>{
        console.log("on connected from device component");

        device.resources.forEach(v => {
          let factory = this.componentFactoryResolver.resolveComponentFactory(
              this.variableComponentFactory(v.values["rt"]));


          let c = this.container.createComponent(factory);  
          (<any>c.instance).init(this.device.uuid, v.name, v.values);

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


  attach(component, callback, detachCallback) : any{ 
    let factory = this.componentFactoryResolver.resolveComponentFactory(component);
    let c = this.container.createComponent(factory);  

    let w = c.location.nativeElement;


    this.window = w;
    this.redraw();
    callback(c);

    this.show(w);

    (<any>c.instance).onClose = () => {
        this.hide(this.window);
        detachCallback();
    };

  }
  hide(window){
    if(window != undefined){
      window.style.transform = this.transformOpen;
      window.style.opacity = "0";
      setTimeout(()=>{
            this.container.clear();
            this.window = undefined;
      
      }, this.translateTime);
    }
  }
  show(window){
    if(window != undefined){
      window.style.transform = this.transformClosed;
      window.style.opacity = "100";
    }
  }
    
}