import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Device, DeviceVariable } from './models.ts';
import { Subscription } from 'rxjs/Subscription';
import { MapToIterable } from './pipes';


@Component({
    selector: '[variable]',
    template: `
    <div>
        {{name}}
        <div *ngFor="let v of values | mapToIterable">
            {{v.key}}: {{ v.value}}
        </div>
    </div>`,
})
export class VariableComponent {
    name: string;
    di: string;

    init(di, name, value){

    }
}

