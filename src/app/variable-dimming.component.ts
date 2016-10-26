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
        <md-slider #slider
          [(ngModel)]="value" 
          type="range"
          min="{{min}}"
          max="{{max}}"
          (slide)="onSlide($event)"
          (click)="onClick($event)">
        </md-slider>
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
  
  ngAfterViewInit(){
    this.iot.onConnected(() => {
      this.sub = this.iot.subscribe("EventValueUpdate", { di: this.di, resource: this.name }, (data) => {
        this.value = data.value["dimmingSetting"];
      });
    });
  }

  init(di, name, value) {
    this.name = name;
    this.di = di;
    this.min = value["range"].split(",")[0];
    this.max = value["range"].split(",")[1];
    
    setTimeout(()=>{
      this.value = value["dimmingSetting"];
    }, 10); 
  }
  
  onSlide(event){
    this.updateValue(this.calculateValue(event.center.x));
  }
 
  //very ugly hack to trigger iot.setValue only when user changed value, using ngModelChange will lead to endless loop of updates 
  // onClick is called before value is updated and makes it useless
  calculateValue(pos){
    var offset = this.slider._sliderDimensions.left;
    var size = this.slider._sliderDimensions.width;
    var percent = this.slider.clamp((pos - offset) / size);
    var exactValue = this.slider.calculateValue(percent);
    return Math.round((exactValue - this.slider.min)  + this.slider.min);
  }
  
  onClick(event){
    this.updateValue(this.calculateValue(event.clientX));
  }
  
  updateValue(value){
    let obj = {
      "dimmingSetting": value
    };
    this.iot.setValue(this.di, this.name, obj);
  }
}
