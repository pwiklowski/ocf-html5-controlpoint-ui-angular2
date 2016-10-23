import {Component, ViewContainerRef,ViewChild} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Device, DeviceVariable} from './models.ts';
import {Subscription} from 'rxjs/Subscription';
import {MapToIterable} from './pipes';
import {VariableComponent} from './variable.component';

import {IotService} from './iot.service';

@Component({
  selector: '[variable]',
  template: `
    <div class="iot-resource">
        <b>{{name}}</b><br>
        <md-slider #slider value="{{value}}" type="range" min="{{min}}" max="{{max}}"></md-slider>
    </div>`
})
export class VariableLightDimmingComponent extends VariableComponent {
  value : number = 0;
  max : number;
  min : number;

  sub;
  @ViewChild('slider') slider; 

  constructor(private iot : IotService) {
    super();

  }

  init(di, name, value) {
    this.name = name;
    this.di = di;
    this.value = value["dimmingSetting"];
    this.min = value["range"].split(",")[0];
    this.max = value["range"].split(",")[1];

    this.iot.onConnected(() => {
      this.sub = this.iot.subscribe("EventValueUpdate", { di: this.di, resource: this.name }, (data) => {
        this.value = data.value["dimmingSetting"];
        this.slider.writeValue(this.value);
      });
    });
      
    this.slider.registerOnTouched((value)=>{
      if (value !== undefined){
        let obj = {
          "dimmingSetting": parseInt(value)
        };
        this.iot.setValue(this.di, this.name, obj);
      }
    });
  }
}
