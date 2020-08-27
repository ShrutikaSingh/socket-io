 
### in ChatServiceService

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


### in ChatPageComponent

 export class ChatPageComponent implements OnInit {

  constructor(private chatservice: ChatServiceService) {
    this.chatservice.connectionComplete()
    .subscribe(data => {
      console.log(data, 'at port 3000');
    });
  }
 