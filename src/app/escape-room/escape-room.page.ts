import { AwaitLoaderPlugin } from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';
import { SesionService } from './../servicios/sesion.service';
import { PhaserSingletonService } from './EscapeRoomMaterial/Phaser/libs/phaser-singleton.module';
import { Component, OnInit, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { PeticionesAPIService } from '../servicios';
import Phaser from 'phaser';
import { BootScene } from './EscapeRoomMaterial/Phaser/libs/scenes/boot.scene';
import { Location } from '@angular/common';
import { Alumno, Pregunta, TablaHistorialPuntosAlumno } from '../clases';
import { AlumnoJuegoDeEscaperoom } from '../clases/clasesParaJuegoDeEscapeRoom/AlumnoJuegoDeEscaperoom';
import { EscenaActiva } from '../clases/clasesParaJuegoDeEscapeRoom/EscenaActiva';
import { EscenaEscaperoom } from '../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { ObjetoActivo } from '../clases/clasesParaJuegoDeEscapeRoom/ObjetoActivo';
import { ObjetoEscaperoom } from '../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { PreguntaActiva } from '../clases/clasesParaJuegoDeEscapeRoom/PreguntaActiva';
import { Skin } from '../clases/clasesParaJuegoDeEscapeRoom/Skin';
import { SkinActiva } from '../clases/clasesParaJuegoDeEscapeRoom/SkinActiva';
import { IonContent } from '@ionic/angular';
import { JuegoDeEscapeRoom } from '../clases/clasesParaJuegoDeEscapeRoom/JuegoDeEscaperoom';
import { LoadingScene } from './EscapeRoomMaterial/Phaser/libs/scenes/LoadingScene.scene';




@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.page.html',
  styleUrls: ['./escape-room.page.scss'],
})
export class EscapeRoomPage implements OnInit,OnDestroy {
  @ViewChild('phaser-example', { static: false }) content: Phaser.Scene;
  constructor(private location: Location, private ngZone: NgZone, private peticionesAPI: PeticionesAPIService, private sesion: SesionService) { }

  game: Phaser.Game;
  async ngOnInit() {

    await this.ngZone.runOutsideAngular(async ()=>{
      this.game= new Phaser.Game({
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.RESIZE,
            width: window.innerWidth,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            height: window.innerHeight,
        },
        parent: 'phaser-example',
        physics: {
          default: 'arcade',
        },
        backgroundColor: "#add8e6",
        plugins: {
          global: [{
              key: 'rexAwaitLoader',
              plugin: AwaitLoaderPlugin,
              start: true
          },
        ]},
        scene: [BootScene,LoadingScene],
        render: {
            transparent: false,
            pixelArt: true,
        },})

      });
    
  }

  VolverAtras(){
    this.location.back();
    console.log(this.game.scene.getScene('preloader').data.get('sesion').DameEscenas());
  }

  async ngOnDestroy() {
    this.game.destroy(true,false);
  }

}
