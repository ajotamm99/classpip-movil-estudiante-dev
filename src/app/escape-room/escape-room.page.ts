import { PhaserSingletonService } from './EscapeRoomMaterial/Phaser/libs/phaser-singleton.module';
import { Component, OnInit, NgZone } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.page.html',
  styleUrls: ['./escape-room.page.scss'],
})
export class EscapeRoomPage implements OnInit {

  constructor(private ngZone: NgZone) { }

  async ngOnInit() {
    await this.ngZone.runOutsideAngular(async ()=>{
      await PhaserSingletonService.init();
    });
    
  }

}
