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
        <md-slider #r 
          type="range"
          min="0"
          max="255"
          [(ngModel)]="red" 
          (slide)="onSlide(r, $event)"
          (click)="onClick(r, $event)"> 
        </md-slider><br>
        Green:<br>
        <md-slider #g type="range" min="0" max="255"
          [(ngModel)]="green" 
          (slide)="onSlide(g, $event)"
          (click)="onClick(g, $event)"> 
        </md-slider><br>
        Blue:<br>
        <md-slider #b type="range" min="0" max="255"
          [(ngModel)]="blue" 
          (slide)="onSlide(b, $event)"
          (click)="onClick(b, $event)"> 
        </md-slider><br>
    </div>`})
export class VariableColourRgbComponent extends VariableComponent {
  red : number = 0;
  green : number = 0;
  blue : number = 0;
  
  @ViewChild('r') r;
  @ViewChild('g') g;
  @ViewChild('b') b;

  sub;

  constructor(private iot : IotService) {
    super();
  }
  ngAfterViewInit(){
    this.iot.onConnected(() => {
      this.sub = this.iot.subscribe("EventValueUpdate", { di: this.di, resource: this.name }, (data) => {
        this.setValues(data.value);
      });
    });
  }

  init(di, name, value) {
    this.di = di;
    this.name = name;
    setTimeout(()=>{
      this.setValues(value);
    }, 100); 
  }

  setValues(value) {
    let values = value["dimmingSetting"].split(",");
    this.red = parseInt(values[0]);
    this.green = parseInt(values[1]);
    this.blue = parseInt(values[2]);
  }
  
  onSlide(slider, event){
    let v = this.calculateValue(slider, event.center.x);
    if(slider === this.r) this.updateValue(v, this.green, this.blue);
    if(slider === this.g) this.updateValue(this.red, v, this.blue);
    if(slider === this.b) this.updateValue(this.red, this.green, v);
  }
 
  //very ugly hack to trigger iot.setValue only when user changed value, using ngModelChange will lead to endless loop of updates 
  // onClick is called before value is updated and makes it useless
  calculateValue(slider, pos){
    var offset = slider._sliderDimensions.left;
    var size = slider._sliderDimensions.width;
    var percent = slider.clamp((pos - offset) / size);
    var exactValue =  slider.calculateValue(percent);
    return Math.round((exactValue - slider.min)  + slider.min);
  }
  
  onClick(slider, event){
    let v = this.calculateValue(slider, event.clientX);
    if(slider === this.r) this.updateValue(v, this.green, this.blue);
    if(slider === this.g) this.updateValue(this.red, v, this.blue);
    if(slider === this.b) this.updateValue(this.red, this.green, v);
  }


  updateValue(red, green, blue){
    let obj = {
      "dimmingSetting": red + "," + green + "," + blue
    };
    this.iot.setValue(this.di, this.name, obj);
  }
}
