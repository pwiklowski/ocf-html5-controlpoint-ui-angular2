import {Injectable} from '@angular/core';

class Subscription {
  callback;
  params;
  event;

  constructor(event, params, callback) {
    this.event = event;
    this.params = params;
    this.callback = callback;
  }
}

@Injectable()
export class IotService {

  static RequestGetDevices = "RequestGetDevices";
  static RequestSearchDevices = "RequestSearchDevices";
  static RequestGetDevice = "RequestGetDevice";
  static ResponseGetDevice = "ResponseGetDevice";
  static RequestSetValue = "RequestSetValue";

  static EventDeviceListUpdate = "EventDeviceListUpdate";
  static EventValueUpdate = "EventValueUpdate";

  subscriptions = new Map < number,
  Subscription > ();
  subscriptionId = 0;

  onConnectedCallbacks = [];

  socket;
  mid = 0;
  callbacks = {};

  constructor() {
    this.connect();
  }

  connect() {
    this.socket = new WebSocket("ws://127.0.0.1:7002/");
    this.socket.onmessage = (e) => {
      this.onMessage(e);
    };

    this.socket.onopen = (e) => {
      console.log('Connected!');
      this.onConnectedCallbacks.forEach((callback) => {
          callback();
        });
      this.onConnectedCallbacks = [];
    };

    this.socket.onclose = (e) => {
      console.log('Disconnected! reconnect!');
      setTimeout(() => this.connect(), 1000);
    };

  }

  private send(request, callback = undefined) {
    let message = {
      "payload": request
    };

    if (callback !== undefined) {
      message["mid"] = this.mid;
      this.callbacks[this.mid] = callback;
      this.mid++;
    }

    this.socket.send(JSON.stringify(message));
  }

  private onMessage(e) {
    let data = JSON.parse(e.data);
    let event = data.event;
    let mid = data.mid;

    let callback = this.callbacks[mid];

    if (callback !== undefined) {
      callback(data.payload);
      delete this.callbacks[mid];
    } else {
      for (let sub in this.subscriptions) {
        let s = this.subscriptions[sub];

        if (s.event == event) {
          if (event == IotService.EventValueUpdate) {
            if (s.params.di == data.payload.di && s.params.resource == data.payload.resource) {
              s.callback(data.payload);
            }
          } else {
            s.callback(data.payload);
          }
        }
      }
    }

  }

  getDevices() {
    this.send({"request": IotService.RequestGetDevices});
  }
  
  searchDevices(){
    this.send({"request": IotService.RequestSearchDevices});
  }

  getDevice(uuid, callback) {
    this.send({
      "request": IotService.RequestGetDevice,
      "uuid": uuid
    }, callback);
  }

  setValue(di, variable, value) {
    this.send({"request": IotService.RequestSetValue, "di": di, "resource": variable, "value": value});
  }

  subscribe(event, params, callback) : number {
    let s = new Subscription(event, params, callback);
    console.log("subscribe " + event , params);

    this.subscriptionId++;
    this.subscriptions[this.subscriptionId] = s;
    return this.subscriptionId;
  }

  onConnected(callback) {
    if (this.socket.readyState == 1) 
      callback();
    else 
      this.onConnectedCallbacks.push(callback);
    }
  
}
