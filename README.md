
# STEP 1

## informing about the connection 

### frontend
#### in ChatServiceService

 export class ChatServiceService {
  constructor() { }
  private socket = io('http://localhost:3000/'); //this is trying to make a connection therefore we need to listen to it in server

  connectionComplete() {
    const observable = new Observable<String>((observer) =>
    this.socket.on('connect', () => {
       observer.next('connected to server');
    })
    );
    return observable;
  }


### in ChatPageComponent.ts

 export class ChatPageComponent implements OnInit {

  constructor(private chatservice: ChatServiceService) {
    this.chatservice.connectionComplete()
    .subscribe(data => {
      console.log(data, 'at port 3000');
    });
  }
 

## -> every time the new users joins

### (backend)
#### in node app.js 
brodcast to that particular room the data that user has joined that particular room

io.on('connection',(socket)=>{ //this socket is same that we created in index.html that is io()
    console.log("new connection made over socket")
    socket.on('join',(data)=>{  //event emitted will be join
        console.log("data",data);
        socket.join(data.room);
        console.log(data.user + " has join to room " + data.room);
        socket.broadcast.to(data.room).emit('newuserjoined', {user:  data.user, message: 'has joined the room' }) //informs every user in this room that a new user has joined
    })
})

### frontend
#### in  ChatService Service 
create the observable so as to listen to everytime the new user joins 

 newUserJoined() {
    return Observable.create((observer) => {
    this.socket.on('newuserjoined', (msg) => {
       observer.next(msg);
    });
   });
  }


#####      or

 create an observable with new 

 newUserJoined()
    {
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new user joined', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

#### in  ChatPage Service
in constructor of the component subscribe to the methoda so that one evry join of user the client app will know

constructor(private chatservice: ChatServiceService) {
this.chatservice.newUserJoined()
    .subscribe(msg => {
      console.log(msg.user + msg.message );
    });



# STEP 2
## Creating message array and pushing the data in array and printing them

#### in  ChatPageComponent.ts
export class ChatPageComponent implements OnInit {
  user: String;
  room: String;
  messageArray: Array<{user: String, message: String}> = [];
  constructor(private chatservice: ChatServiceService) {
    this.chatservice.connectionComplete()
    .subscribe(data => {
      console.log(data, 'at port 3000');
    });

    this.chatservice.newUserJoined()
    .subscribe(datas => {
      console.log(datas.user  + datas.message );
      console.log('mssss', this.messageArray);
      this.messageArray.push(datas);
    });
  }

#### in  ChatPageComponent Html
 <div class="row">
        <div class="well" style="height:200px; padding:15px;">
            <div *ngFor="let item of messageArray">
            <span><strong>{{item.user}} : </strong> {{item.message}}</span>
            </div>
        </div>
    </div>


# Step 3
## when someone leaves the room


### (backend)
#### in node app.js 
    socket.on('leave',(data)=>{  //event emitted will be join
        //here first broadcast then leave 
        console.log(data.user + " Left the room " + data.room);
        socket.broadcast.to(data.room).emit('userleftroom', {user:  data.user, message: 'Has Left the room' }) //informs every user in this room that a new user has joined
        socket.leave(data.room);
    })

### (frontend)
#### Creating message array and pushing the data in array and printing them

#### in  ChatPage Service

 leaveRoom(data) {
    console.log('here leave')
    this.socket.emit('leave', data);
  }

  userleftRoom() {
    console.log("at left")
    const observable = new Observable <{user: String , message: String}> ((observer) => {
      this.socket.on('userleftroom', datas => {
        observer.next(datas);
      });
    });
    return observable;
  }


#### in  ChatPageComponent.ts
 messageArray: Array<{user: String, message: String}> = [];
  constructor(private chatservice: ChatServiceService) {
    this.chatservice.userleftRoom()
    .subscribe(data => {
      console.log(data.user + "left the room ")
      console.log('msg', this.messageArray);
      this.messageArray.push(data);
    });
  }


  leave() {
    this.chatservice.leaveRoom({user: this.user, room: this.room});
  }


  #### in  ChatPageComponent Html
    <button type="button" class="btn btn-default" (click)="leave()">Leave</button>
     <div class="row">
        <div class="well" style="height:200px; padding:15px;">
            <div *ngFor="let item of messageArray">
            <span><strong>{{item.user}} : </strong> {{item.message}}</span>
            </div>
        </div>
    </div>    


# Ros Connection 

# Step 1

## connect to ros service and emit and ros_success event 
### (backend)
#### in node server.js 

const io= socketIO(server);

ros = new ROSLIB.Ros({
    url: 'wss://dev.flytbase.com/websocket',
});

io.on('connection',(socket)=>{ //this socket is same that we created in index.html that is io()
    console.log("new connection made over socket", socket.id)
    ros.on('connection', () => {
        console.log('Connected to websocket server.');
        socket.emit('ros_success', {success: true, message: 'connected'});
    });
})

### (frontend)
#### Creating a clientSocket  service in angular app and listening to connection event 
export class ClientSocketService {
  constructor() { }
  private socket = io('http://localhost:5000/'); // this is trying to make a connection therefore we need to listen to it in server


### (in frontend only )
#### Creating a connection completefinction to listen to listen to the connect and create observables because it can be emitted any time

 connectionComplete() {
          const observable = new Observable<String>((observer) =>
          this.socket.on('connect', (msg) => {
            //console.log(msg,'mssg');
            observer.next('connected to server');
            })
          );
          return observable;
    }

### (in frontend only )
#### Creating a ros connection func to get that the client is properly connect to the ros and also listening its ros_success event that was emitted before
rosconnention() {
        const observable = new Observable((observer) =>
        this.socket.on('ros_success', (msg) => {
          console.log(msg, 'mssg');
          observer.next(msg);
          })
        );
        return observable;
      }

### so the frontend code looks like  of CleintSocketService with Ros looks like
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ClientSocketService {
  constructor() { }
  private socket = io('http://localhost:5000/'); // this is trying to make a connection therefore we need to listen to it in server

  // create observable to let client now that if the server is connected

    connectionComplete() {
          const observable = new Observable<String>((observer) =>
          this.socket.on('connect', (msg) => {
            //console.log(msg,'mssg');
            observer.next('connected to server');
            })
          );
          return observable;
    }

      rosconnention() {
        const observable = new Observable((observer) =>
        this.socket.on('ros_success', (msg) => {
          console.log(msg, 'mssg');
          observer.next(msg);
          })
        );
        return observable;
      }

}


#### in  ng ros lib Compontent.ts subscribe to the observables of .connectionComplete() and rosconnention() in constructor.

export class NgRoslibComponent implements OnInit {
  
  constructor (
        private rosService: RosAuthService,
        private velocitySetService: VelocitySetService,
        private  clientSocketService: ClientSocketService
        ) 
        {

        this.clientSocketService.connectionComplete()
        .subscribe((data) => {
          console.log('here at ng-ros', data);
        });

        this.clientSocketService.rosconnention()
        .subscribe((data) => {
          console.log('here at ros connection', data);
        });
    }

