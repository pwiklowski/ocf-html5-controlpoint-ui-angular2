import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { DevicesComponent } from './devices.component';
import { IotService } from './iot.service';
import { DeviceComponent } from './device.component'

import { VariableColourRgbComponent } from './variable-rgb.component';
import { VariableLightDimmingComponent } from './variable-dimming.component';
import { VariableGenericComponent } from './variable-generic.component';
import { VariableBinnaryComponent } from './variable-binnary.component';

import { Pipe } from '@angular/core';

@Pipe({
    name: 'mapToIterable'
})
export class MapToIterable {
    transform(map: {}, args: any[] = null): any {
        if (!map)
            return null;
        return Object.keys(map).map((key) => ({ 'key': key, 'value': map[key] }));
    }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    DevicesComponent,
    DeviceComponent,
    VariableGenericComponent,
    VariableLightDimmingComponent,
    VariableColourRgbComponent,
    VariableBinnaryComponent,
    MapToIterable
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    MaterialModule.forRoot(),
    FormsModule
  ],
  entryComponents: [
      VariableGenericComponent,
      VariableLightDimmingComponent,
      VariableBinnaryComponent,
      VariableColourRgbComponent
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    IotService
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}

  hmrOnInit(store) {
    this.appRef.tick();
  }

  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

