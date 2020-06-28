import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'websocketdemo';
  roundsObserver = this.socket.fromEvent<string[]>('roundEnd');
  rounds = [];

  userID;
  gameID;

  constructor(private socket: Socket) {

    this.roundsObserver.subscribe(roundEnd => {
      this.rounds.push(roundEnd)
    });
  }

  play(move) {
    let output = {
      gameID: this.gameID,
      userID: this.userID,
      action: move
    };

    this.socket.emit('move', output)
  }

}
