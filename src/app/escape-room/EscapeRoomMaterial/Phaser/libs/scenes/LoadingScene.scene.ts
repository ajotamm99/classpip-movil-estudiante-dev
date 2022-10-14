import { AwaitLoaderPlugin } from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';
import { AlumnoJuegoDeEscaperoom } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/AlumnoJuegoDeEscaperoom';
import { SesionService } from './../../../../../servicios/sesion.service';
import { PreguntaActiva } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/PreguntaActiva';
import { SkinActiva } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/SkinActiva';
import { ObjetoEscaperoom } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { ObjetoActivo } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoActivo';
import { EscenaEscaperoom } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { EscenaActiva } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaActiva';
import { Skin } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/Skin';
import * as Phaser from 'phaser';
import { PeticionesAPIService } from 'src/app/servicios'; 
import { CommonModule } from '@angular/common';
import { Component, Inject, ModuleWithProviders, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
import { ScrollManager } from '../utilities/scroll-manager';
import { Pregunta } from 'src/app/clases/Pregunta';
import { Alumno } from 'src/app/clases';
import { getMatAutocompleteMissingPanelError } from '@angular/material';
import { EscapeRoomPageModule } from 'src/app/escape-room/escape-room.module';


export class LoadingScene extends Phaser.Scene{
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;


    constructor() {
        super({ 
          key: 'preloader'
        })

        //Cuando la creamos construimos las URL y sacamos los ids

        this.baseURL='http://localhost';
        this.idJuego=+localStorage.getItem('idJuego');
        this.idAlumno=+localStorage.getItem('idAlumno');
        //localStorage.clear();
        this.urlGetInscripcionAlumno=this.baseURL + ':3000/api/alumnoescaperoom?filter[where][juegoDeEscaperoomId]='+this.idJuego+'&filter[where][alumnoId]='+this.idAlumno;    
        this.urlGetEscenasActivas=this.baseURL + ':3000/api/escenaescaperoomactiva?filter[where][juegoDeEscaperoomId]=' + this.idJuego;
        this.urlGetEscenas=this.baseURL + ':3000/api/escenasescaperoom/'
        this.urlGetObjetosActivos=this.baseURL +':3000/api/objetoactivoescaperoom?filter[where][juegoDeEscaperoomId]=' + this.idJuego;
        this.urlGetObjetos=this.baseURL +':3000/api/objetosescaperoom/'
        this.urlGetPreguntasActivas=this.baseURL +':3000/api/preguntasactivas?filter[where][juegoDeEscaperoomId]=' + this.idJuego;
        this.urlGetPreguntas=this.baseURL +':3000/api/Preguntas/'
        this.urlGetSkin=this.baseURL +':3000/api/skins/22';
    }
    //variables localstorage
    idAlumno: number;
    idJuego: number;

    //urls para los fetch
    baseURL:string;
    urlGetInscripcionAlumno: string;
    urlGetEscenasActivas: string;
    urlGetEscenas: string;
    urlGetObjetosActivos: string;
    urlGetObjetos: string;
    urlGetPreguntasActivas: string;
    urlGetPreguntas: string;
    urlGetSkin: string;


    //variables que pedimos mediante fetch
    inscripcionAlumnoJuegoDeEscaperoom: AlumnoJuegoDeEscaperoom;
    juegoSeleccionado: any;
    alumno: Alumno;
    alumnos: Alumno[]=[];
    EscenasActivas: EscenaActiva[]=[];
    Escenas: EscenaEscaperoom[]=[];
    ObjetosActivos: ObjetoActivo[]=[];
    Objetos:ObjetoEscaperoom[]=[];
    Skin: SkinActiva;
    SkinDatos: Skin;
    Preguntas: Pregunta[]=[];
    PreguntasActivas: PreguntaActiva[]=[];
    tiempo: number;
    mecanica: string;
    puntos: number;

    //variables escenas
    maps: Phaser.Tilemaps.Tilemap[]=[];
    mapSelected: Phaser.Tilemaps.Tilemap;
    tilesheets: Phaser.Tilemaps.Tileset[]=[];
    tilesheetSelected: Phaser.Tilemaps.Tileset;
    layersActivas: Phaser.Tilemaps.TilemapLayer[]=[];    
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  
    preload(){        
        //PROGRESS AT PRELOAD
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        //@ts-ignore
        var width: number = this.game.config.width;        
        //@ts-ignore
        var height: number= this.game.config.height;
        console.log(width, height);

        var loadingText = this.make.text({
            x: width/2,
            y: height/2-50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                color: '#ffffff'
            }
        });
        //loadingText.setOrigin(0.5, 0.5);   
        
        var percentText = this.make.text({
            x: width/2+120,
            y: 300,
            text: '0%',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        }).setDepth(1);
        //percentText.setOrigin(0.5, 0.5);

        var game=this;

        //Si se quiere poner una imagen de fondo, al ser la primera que se carga será casi instantaneo 
        //y permanecerá hasta que se carguen todos los recursos
        //Se puede combinar con el progress bar
        //La foto se puede cargar desde los assets del proyecto o haciendo una peticion fetch y cargandola instantaneamente
        /*this.load.image('fondo','./assets/prueba.jpeg').on("complete", ()=>{
            this.add.image(0,0,"fondo").setDepth(-1);
        });*/

        //RECOGEMOS INSCRIPCION
        //@ts-ignore
        this.load.rexAwait(function(successCallback, failureCallback) { 
            fetch(game.urlGetInscripcionAlumno, {method:'GET'})
              .then(res=>
                res.json())
                .then(data=>
                  {
                    game.inscripcionAlumnoJuegoDeEscaperoom=data;
                    console.log(data);
                    successCallback();
                  }
                );
      
        });
        
        //RECOGEMOS ESCENAS
        //@ts-ignore
        this.load.rexAwait(function(successCallback, failureCallback) { 
            fetch(game.urlGetEscenasActivas, {method:'GET'})
              .then(res=>
                res.json())
                .catch(err=>{
                    failureCallback();
                })
                .then(data=>
                  {
                    game.EscenasActivas=data;
                    console.log(game.EscenasActivas);
                    var cont=0;
                    for(let i=0; i<game.EscenasActivas.length;i++){
                        if(!game.Escenas.some(sc=>sc.id==game.EscenasActivas[i].escenaEscaperoomId)){
                            fetch(game.urlGetEscenas+game.EscenasActivas[i].escenaEscaperoomId, {method:'GET'})
                            .then(res=>
                            res.json())
                            .catch(err=>{
                                failureCallback();
                            })
                            .then(data=>{
                                game.Escenas.push(data);
                                var imagen= data.Tilesheet;
                                var archivo= data.Archivo;
                                game.load.image((cont+1)+'tiles', 'http://localhost:3000/api/imagenes/ImagenesEscenas/download/'+imagen)
                                game.load.tilemapTiledJSON((cont+1)+'map', 'http://localhost:3000/api/imagenes/ArchivosEscenas/download/'+archivo);
                                
                                console.log(data);
                                cont++;
                                   
                                if(cont==game.EscenasActivas.length){        
                                    successCallback();
                                }
                            });
                        }else{
                            cont++;                               
                            if(cont==game.EscenasActivas.length){        
                                successCallback();
                            }
                        }                    
                    }
                  }
                );
        });

        //RECOGEMOS OBJETOS
        //@ts-ignore
        this.load.rexAwait(function(successCallback, failureCallback) { 
            fetch(game.urlGetObjetosActivos, {method:'GET'})
                .then(res=>
                res.json())
                .catch(err=>{
                    failureCallback();
                })
                .then(data=>
                    {
                    game.ObjetosActivos=data;
                    console.log(game.ObjetosActivos);
                    var cont=0;
                    for(let i=0; i<game.ObjetosActivos.length;i++){
                        if(!game.Objetos.some(obj=>obj.id==game.ObjetosActivos[i].objetoEscaperoomId)){
                            fetch(game.urlGetObjetos+game.ObjetosActivos[i].objetoEscaperoomId, {method:'GET'})
                            .then(res=>
                            res.json())
                            .catch(err=>{
                                failureCallback();
                            })
                            .then(data=>{
                                game.Objetos.push(data);
                                var imagen= data.Imagen;
                                game.load.image((cont+1)+'obj', 'http://localhost:3000/api/imagenes/ImagenesObjetos/download/'+imagen)
                               
                                console.log(data);
                                cont++;
                                    
                                if(cont==game.ObjetosActivos.length){        
                                    successCallback();
                                }
                            });
                        }else{
                            cont++;                               
                            if(cont==game.ObjetosActivos.length){        
                                successCallback();
                            }
                        }                    
                    }
                    }
                );
        });

        //RECOGEMOS PREGUNTAS
        //@ts-ignore
        this.load.rexAwait(function(successCallback, failureCallback) { 
            fetch(game.urlGetPreguntasActivas, {method:'GET'})
              .then(res=>
                res.json())
                .catch(err=>{
                    failureCallback();
                })
                .then(data=>
                  {
                    game.PreguntasActivas=data;
                    console.log(game.PreguntasActivas);
                    var cont=0;
                    for(let i=0; i<game.PreguntasActivas.length;i++){
                        if(!game.Preguntas.some(preg=>preg.id==game.PreguntasActivas[i].preguntaId)){
                            fetch(game.urlGetPreguntas+game.PreguntasActivas[i].preguntaId, {method:'GET'})
                            .then(res=>
                            res.json())
                            .catch(err=>{
                                failureCallback();
                            })
                            .then(data=>{
                                game.Preguntas.push(data);
                                var imagen= data.Imagen;
                                game.load.image((cont+1)+'preg', 'http://localhost:3000/api/imagenes/ImagenesPreguntas/download/'+imagen)
                                
                                console.log(data);
                                cont++;
                                   
                                if(cont==game.PreguntasActivas.length){        
                                    successCallback();
                                }
                            });
                        }else{
                            cont++;                               
                            if(cont==game.PreguntasActivas.length){        
                                successCallback();
                            }
                        }                    
                    }
                  }
                );
        });

        //RECOGEMOS SKINS
        //De momento solo tenemos una Skin, pero se podría añadir una escena previa a esta y común 
        //a las demás combinaciones de modos en la que se muestre al jugador que skin quiere dependiendo
        //del historial de puntos que tenga. Se puede utilizar un plugin de diálogos de RexRainbow.
        //poniendo en transparente las no disponibles. Una vez seleccionada se pasa al registry de PHaser 
        //para ser accedido por la escena principal y la cargamos en create. 
        //@ts-ignore
        this.load.rexAwait(function(successCallback, failureCallback) { 
            fetch(game.urlGetSkin, {method:'GET'})
              .then(res=>
                res.json())
                .catch(err=>{
                    failureCallback();
                })
                .then(data=>
                  {
                    game.SkinDatos=data;
                    var imagen= data.Spritesheet;
                    //var Archivo = data.Archivo;
                    game.load.image('1skinimg', 'http://localhost:3000/api/imagenes/ImagenesSkins/download/'+imagen)
                    //game.load.('1skinimg', 'http://localhost:3000/api/imagenes/ImagenesSkins/download/'+imagen)
                                
                    console.log(game.SkinDatos);
                    successCallback();
                  }
                );
        });


        this.load.on("progress", (percent)=>{
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * percent, 30).scale;
            percentText.setText(parseInt(percent)* 100 + '%');
        });

        this.load.on("complete", ()=>{
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
  
  
    }
  
    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    create() {

        

        this.cursors = this.input.keyboard.createCursorKeys();
        
        console.log('estoy en create');
        console.log(this.Escenas);
        this.maps.push(this.make.tilemap({key:'1map'}));
        this.tilesheets.push(this.maps[0].addTilesetImage('tilesetincial','1tiles'));
        
        this.layersActivas.push(this.maps[0].createLayer('suelo',this.tilesheets[0]).setDepth(0));
        //t.setOrigin(0.5,0.5);
        this.layersActivas.push(this.maps[0].createLayer('solid', this.tilesheets[0]).setDepth(2));
        //solid.setOrigin(0.5,0.5);  
        this.layersActivas[1].setCollisionByProperty({collides: true})

        //@ts-ignore
        this.cameras.main.setBounds(0, 0, this.layersActivas[0].width, this.layersActivas[0].height);
        //@ts-ignore
        this.physics.world.setBounds(0, 0, this.layersActivas[0].width, this.layersActivas[0].height);


        //@ts-ignore
        this.player= this.physics.add.image(this.game.config.width/2 + 150, this.game.config.height/2,'1skinimg');
        this.player.setScale(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(1);
        this.physics.add.collider(this.player, this.layersActivas[1]);
        this.cameras.main.startFollow(this.player, true, 0.4, 0.4);
  
    }

    update(time: number, delta: number): void {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-500);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(500);
        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-500);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(500);
        }
    }
  
    resize (gameSize, baseSize, displaySize, resolution)
    {
        var width = gameSize.width;
        var height = gameSize.height;
    
        this.cameras.resize(width, height);
    
        for(let i=0; i<this.layersActivas.length; i++){
            this.layersActivas[i].setSize(width, height);
        }
        //this.layer1.setSize(width, height);
        //this.solid.setSize(width, height);
    }
  }