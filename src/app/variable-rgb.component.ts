import {Component, ViewChild, ElementRef} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Device, DeviceVariable} from './models.ts';
import {Subscription} from 'rxjs/Subscription';
import {MapToIterable} from './pipes';
import {VariableComponent} from './variable.component';
import {IotService} from './iot.service';

@Component({selector: '[variable]', template: `
    <div class="iot-resource">
        <b>{{ name}}</b><br>
        Red:<br>
        <md-slider #r value="{{red}}" type="range" min="0" max="255"> </md-slider><br>
        Green:<br>
        <md-slider #g value="{{green}}" type="range" min="0" max="255"></md-slider><br>
        Blue:<br>
        <md-slider #b value="{{blue}}" type="range" min="0" max="255"></md-slider><br>
    </div>`})
export class VariableColourRgbComponent extends VariableComponent {
  red : number;
  green : number;
  blue : number;
  
  @ViewChild('r') r;
  @ViewChild('g') g;
  @ViewChild('b') b;

  sub;

  constructor(private iot : IotService) {
    super();
  }

  init(di, name, value) {
    this.di = di;
    this.name = name;
    this.setValues(value);

    this.iot.onConnected(() => {
      this.sub = this.iot.subscribe("EventValueUpdate", { di: this.di, resource: this.name }, (data) => {
        this.setValues(data.value);
      });
    });
    this.r.registerOnTouched((value)=>{
      this.onChange(value, this.g.value, this.b.value);
    });
    this.g.registerOnTouched((value)=>{
      this.onChange(this.r.value, value, this.b.value);
    });
    this.b.registerOnTouched((value)=>{
      this.onChange(this.r.value, this.g.value, value);
    });
    
  }

  setValues(value) {
    let values = value["dimmingSetting"].split(",");
    this.red = parseInt(values[0]);
    this.green = parseInt(values[1]);
    this.blue = parseInt(values[2]);
    
    this.r.writeValue(this.red);
    this.g.writeValue(this.green);
    this.b.writeValue(this.blue);

  }

  onChange(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;

    let obj = {
      "dimmingSetting": this.red + "," + this.green + "," + this.blue
    };

    this.iot.setValue(this.di, this.name, obj);
  }
}
