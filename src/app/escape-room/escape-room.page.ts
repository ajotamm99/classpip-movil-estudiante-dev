import { PhaserSingletonService } from './EscapeRoomMaterial/Phaser/libs/phaser-singleton.module';
import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.page.html',
  styleUrls: ['./escape-room.page.scss'],
})
export class EscapeRoomPage implements OnInit {

  constructor() { }

  async ngOnInit() {
    await PhaserSingletonService.init();
  }

}
