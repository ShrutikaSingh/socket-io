
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
#### in  ChatServiceService 
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

#### in  ChatPageComponent.ts
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