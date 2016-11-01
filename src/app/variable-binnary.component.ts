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
      <md-slide-toggle [(ngModel)]="value" (change)="onChange($event)"></md-slide-toggle>
    </div>`
})
export class VariableBinnaryComponent extends VariableComponent {
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
        this.value = data.value["value"];
      });
    });
  }

  init(di, name, value) {
    this.name = name;
    this.di = di;
    
    setTimeout(()=>{
      this.value = value["value"];
    }, 10); 
  }

  onChange(e){
    console.log(e);
    this.updateValue(e.checked);
  }
 
  
  updateValue(value){
    let obj = {
      "value": value
    };
    this.iot.setValue(this.di, this.name, obj);
  }
}
