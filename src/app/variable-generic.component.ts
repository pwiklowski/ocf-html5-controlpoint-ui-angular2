import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { VariableComponent } from './variable.component';
@Component({
    selector: '[variable]',
    template: `
    <div>
        {{name}}
        <div *ngFor="let v of value | mapToIterable">
            {{v.key}}: {{ v.value}}
        </div>
    </div>`,
})
export class VariableGenericComponent extends VariableComponent {
    value;
    init(name, value){
        this.name = name;
        this.value = value;
    }
}

