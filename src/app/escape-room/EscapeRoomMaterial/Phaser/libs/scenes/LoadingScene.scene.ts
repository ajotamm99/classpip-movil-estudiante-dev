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
    maincam: Phaser.Cameras.Scene2D.Camera;
    bag: Phaser.GameObjects.Image;
    timedEvent: Phaser.Time.TimerEvent;
    timerGlobal: number=0;
    hiddenTimeStamp: number=0;
    tiempoEmpleadoTotalMinutos: number;
    timedEventtest: Phaser.Time.TimerEvent;
    textTerminado: Phaser.GameObjects.Text;
    playerReady: boolean=false;
    juegoTerminado: boolean=false;
    imagesObjects: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]=[];
    coordinatesStored: Array<any>=[];
    objectlayer: Phaser.GameObjects.Layer;
    exitLayer: Phaser.GameObjects.GameObject[];

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
    //variables pantalla
    widthWindow: number;
    HeightWindow: number;

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
    EscenaEnCurso: EscenaActiva;
    Escenas: EscenaEscaperoom[]=[];
    ObjetosActivos: ObjetoActivo[]=[];
    ObjetosActivosEscenaActiva: ObjetoActivo[]=[];
    Objetos:ObjetoEscaperoom[]=[];
    Skin: SkinActiva;
    SkinDatos: Skin;
    Preguntas: Pregunta[]=[];
    PreguntasActivas: PreguntaActiva[]=[];
    tiempoActual: number;
    tiempoEmpleadoTotal: number;
    mecanica: string;
    puntosTotal: number;
    nota: number;
    penalizacion: number;    
    tiemposEscenas: number[]=[];


    //variables escenas
    maps: Phaser.Tilemaps.Tilemap[]=[];
    mapSelected: Phaser.Tilemaps.Tilemap;
    tilesheets: Phaser.Tilemaps.Tileset[]=[];
    tilesheetSelected: Phaser.Tilemaps.Tileset;
    layersActivas: Phaser.Tilemaps.TilemapLayer[]=[];    
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    image: Phaser.GameObjects.Image;
    textEscenas:Phaser.GameObjects.Text;
    contadorEscenas: number;
    camera2: Phaser.Cameras.Scene2D.Camera;

    preload(){ 
        //RESPONSIVE PRELOAD
        //La barra de carga se ajustará al tamaño de la pestaña
        //Si se quiere hacer que sea reactiva al cambio durante la carga, 
        //añadir las variables en la función resize   
        //@ts-ignore
        var width: number = this.game.config.width;
        this.widthWindow=width;        
        //@ts-ignore
        var height: number= this.game.config.height;
        this.HeightWindow= height;

        var heightbar=0.10*height;
        var widthbar=0.25*width;
        var ybar=(height-heightbar)/2;
        var xbar=(width-widthbar)/2;
        var widthprbar=0.92*widthbar; 
        var heightprbar=0.60*heightbar;    
        var yprbar=ybar+((heightbar-heightprbar)/2);
        var xprbar= xbar +((widthbar- widthprbar)/2);        
        var heighttext=Math.floor(0.9*heightprbar);
        var widthtext=0.1*widthprbar;
        var ytext=yprbar+(heightprbar-heighttext)/2;
        var xtext=xprbar+(widthprbar-widthtext)/2;
        

        //PROGRESS AT PRELOAD
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(xbar, ybar, widthbar, heightbar);

        
        var percentText = this.make.text({
            x: xtext,
            y: ytext,
            text: '0%',
            style: {
                font: heighttext +'px monospace',
                color: '#ffffff'
            }
        }).setDepth(1);        
        //percentText.setOrigin(0.5, 0.5);

        var game=this;

        //Si se quiere poner una imagen de fondo, al ser la primera que se carga será casi instantaneo 
        //y permanecerá hasta que se carguen todos los recursos
        //Se puede combinar con el progress bar
        //La foto se puede cargar desde los assets del proyecto o haciendo una peticion fetch y cargandola instantaneamente,
        //
        //this.game.scene.getScenes
        
        this.image= this.add.image(0.5*width,0.1*height,"fondo").setOrigin(0.5,0).setDepth(3);
        this.contadorEscenas=1;

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
                                if (imagen){
                                    game.load.image((cont+1)+'preg', 'http://localhost:3000/api/imagenes/ImagenesPreguntas/download/'+imagen)
                                }
                                
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
            progressBar.fillRect(xprbar, yprbar, widthprbar * percent, heightprbar);
            percentText.setText(parseInt(percent)* 100 + '%');
        });

        this.load.on("complete", ()=>{
            progressBar.destroy();
            progressBox.destroy();
            percentText.destroy();
        });
    }
  
    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    create() {
        this.EscenaEnCurso= this.EscenasActivas[this.contadorEscenas-1];
        
        this.image.destroy();
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.nota=10;

        for(let i=0; i<this.EscenasActivas.length; i++){
            this.tiemposEscenas.push(this.EscenasActivas[i].TiempoLimite);
        }
        for(let b=0; b<this.PreguntasActivas.length; b++){
            this.puntosTotal+=this.PreguntasActivas[b].PuntosSumar;
        }
        
        this.maincam= this.cameras.main.setBackgroundColor('#000000');

        //Bucle para crear mapas, objetos y colisiones
        for(let c=0; c<this.EscenasActivas.length; c++){            
            this.maps.push(this.make.tilemap({key:(c+1).toString()+'map'}));
            this.tilesheets.push(this.maps[c].addTilesetImage('tilesetincial',(c+1).toString()+'tiles'));
        }
        
        this.layersActivas.push(this.maps[0].createLayer('suelo',this.tilesheets[0],0,0).setDepth(0).setOrigin(0,0));
        //this.layersActivas[0].setX(((this.widthWindow-this.layersActivas[0].width)/2));

        this.layersActivas.push(this.maps[0].createLayer('solid', this.tilesheets[0],0,0).setDepth(2).setOrigin(0,0));
        //this.layersActivas[1].setX(((this.widthWindow-this.layersActivas[1].width)/2));
        this.layersActivas[1].setCollisionByProperty({collides: true})

        //Cargamos la mochila y los controles
        if(this.layersActivas[0].width<=this.widthWindow && this.layersActivas[0].height<=this.HeightWindow-45){
            this.bag= this.add.image(this.layersActivas[0].width, this.layersActivas[0].height,'bag').setOrigin(1,1).setScale(0.2).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive();  
        }else if(this.layersActivas[0].width>=this.widthWindow && this.layersActivas[0].height<=this.HeightWindow-45){
            this.bag= this.add.image(this.widthWindow, this.layersActivas[0].height,'bag').setOrigin(1,1).setScale(0.2).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive();  
        }else if(this.layersActivas[0].width<=this.widthWindow && this.layersActivas[0].height>=this.HeightWindow-45){
            this.bag= this.add.image(this.layersActivas[0].width, this.HeightWindow-45,'bag').setOrigin(1,1).setScale(0.2).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive();  
        }else{
            this.bag= this.add.image(this.widthWindow, this.HeightWindow-45,'bag').setOrigin(1,1).setScale(0.2).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive();  
        }        
        this.exitLayer= this.maps[0].createFromObjects('salida',{name:'exit'});
        
        //Añadimos la física de las camáras y los bordes del mapa(tambien se podría hacer añadiendo la
        //propiedad collides: true a los bordes del mapa creado en Tiled)
        //@ts-ignore
        this.cameras.main.setBounds(0, 0, this.layersActivas[0].width, this.layersActivas[0].height);
        //@ts-ignore
        this.physics.world.setBounds(0, 0, this.layersActivas[0].width, this.layersActivas[0].height);
        

        //Añadimos el player
        //@ts-ignore
        this.player= this.physics.add.image(this.layersActivas[0].width/2 + 150, this.game.config.height/2,'1skinimg');
        
        //En este caso lo escalo manualmente, hay que fijarse al subir las skins de que 
        //tienen que ser de un tamaño similar a los tiles de la escena
        this.player.setScale(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(1);
        this.player.setOrigin(0,0);
        this.player.setVelocity(0);

        //OBJETOS RANDOM
        var vectorXstored: Phaser.Math.Vector2[]=[];
        for(let i=0; i<this.ObjetosActivos.length; i++){
            console.log(this.ObjetosActivos.length);
            var valid=false;
            while(!valid){
                var randomX=Math.floor(this.layersActivas[0].width*Math.random());
                var randomY=Math.floor(this.layersActivas[0].height*Math.random());
                        
                var x=this.maps[0].worldToTileXY(randomX,randomY);
                var foundX=vectorXstored.find(sc=>sc ==x);          
                console.log(foundX);

                console.log(x);
                if(this.maps[0].getTileAt(x[0],x[1])==null && foundX==undefined && !valid){
                    vectorXstored.push(x);
                    console.log(vectorXstored);
                    //this.objectlayer.add(this.physics.add.sprite(randomX,randomY,(i+1)+'obj'));
                    //this.objectlayer
                    this.imagesObjects.push(this.physics.add.sprite(randomX,randomY,(i+1)+'obj').setImmovable().setDepth(this.layersActivas.length+1));
                    this.physics.add.overlap(this.player, this.imagesObjects[i], ()=>{
                        console.log('collisiooon');

                    })
                    valid=true;
                }
            }
        }

        //si queremos modificar el collidebox del sprite
        //this.player.body.setSize(this.player.width, this.player.height/2, false);
        this.physics.add.collider(this.player, this.layersActivas[1]);
        this.cameras.main.startFollow(this.player, true, 0.4, 0.4);
        this.playerReady=true;
        //this.cameras.add().startFollow(this.cameras.main)
        
        //Texto de tiempo, nota y score
        this.textEscenas= this.add.text(0,0,'Escena: '+this.contadorEscenas+'/'+this.EscenasActivas.length+'\n'+'Nota: '+this.nota +'\n'+'Tiempo disponible: '+ this.tiemposEscenas[this.contadorEscenas-1]+':00')
        .setDepth(this.layersActivas.length+2).setScrollFactor(0);

        //Función que necesitaremos para re-escalar la mochila y los botones dentro de la pestaña
        

        //Configuración timer
        this.timedEvent= this.time.addEvent({ delay: 1000, repeat: this.EscenaEnCurso.TiempoLimite*60, callback: this.onEvent, callbackScope:this });
        //this.timedEventtest= this.time.addEvent({ delay: 3000, callback: this.testDelete, callbackScope:this });
        
        //Timer continua aunque se minimize la pestaña para que no hagan trampas
        this.game.events.on('hidden', () => {
            this.hiddenTimeStamp = performance.now();
            });

        this.game.events.on('visible', () => {
            let elapsedTime = Math.floor((performance.now() - this.hiddenTimeStamp)/1000); //seconds
            this.timerGlobal += elapsedTime;
            })

        this.scale.on('resize', this.resize, this);

        //Debug mode to see colliding layer
        /*
        const debugGraph= this.add.graphics().setAlpha(0.7).setDepth(5);
        this.layersActivas[1].renderDebug(debugGraph,{
            tileColor:null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 48, 255),

        })*/
    
    }

    update(time: number, delta: number): void {
        //console.log('hola');
        //TIMECONTROLS
        
        if (this.contadorEscenas==this.EscenasActivas.length){
            if(this.timerGlobal>=this.EscenaEnCurso.TiempoLimite*60){                
                this.onEventFinal(true);
            }else{       
                //logica cuando completa el juego         
                //this.onEventFinal(false);
            }
        }

        //NEEDSCONTROL

        //PLAYER CONTROLS
        if(this.playerReady){
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
        
    }
  
    resize (gameSize, baseSize, displaySize, resolution)
    {

        var width = gameSize.width;
        //this.HeightWindow=gameSize.width;
        var height = gameSize.height;
        //this.widthWindow = height;
        console.log(width, height);
        
        if(this.juegoTerminado){
            this.textTerminado.setPosition(width/2, height/2);
        }else{
            this.bag.setX(width);
            this.bag.setY(height);
        
            this.cameras.resize(width, height);

            if(this.layersActivas[0].width<=width && this.layersActivas[0].height<=height){
                this.bag.setPosition(this.layersActivas[0].width,this.layersActivas[0].height);
            }else if(this.layersActivas[0].width>=width && this.layersActivas[0].height<=height){            
                this.bag.setPosition(width,this.layersActivas[0].height-5);
            }else if(this.layersActivas[0].width<=width && this.layersActivas[0].height>=height){            
                this.bag.setPosition(this.layersActivas[0].width,height-5);
            }else{                
                this.bag.setPosition(width,height-5);
            }
            
        }
    }

    onEvent(){
        if(!this.juegoTerminado){
            this.timerGlobal+=1;
            this.tiempoActual=this.EscenaEnCurso.TiempoLimite*60 - this.timerGlobal;
            var min=this.tiempoActual/60 | 0;
            var sec= this.tiempoActual % 60;
            var secStr: string =sec.toString();
            if (sec<10){
                secStr='0'+sec;
            }
            this.textEscenas.text='Escena: '+this.contadorEscenas+'/'+this.EscenasActivas.length+'\n'+'Nota: '+this.nota +'\n'+'Tiempo disponible: '+ min+':'+secStr;
        }
    }

    onEventFinal(pasado: boolean){
        this.contadorEscenas+=1;
        if(this.contadorEscenas>this.EscenasActivas.length){            
            this.timedEvent.destroy();
            if(pasado){
                this.tiempoEmpleadoTotal+=this.EscenaEnCurso.TiempoLimite*60;
                this.tiempoEmpleadoTotalMinutos=this.tiempoEmpleadoTotal/60 | 0;                
            }else{
                this.tiempoEmpleadoTotal+=this.timerGlobal;
                this.tiempoEmpleadoTotalMinutos=this.tiempoEmpleadoTotal/60 | 0;
            }
            this.JuegoTerminado();
            //Pantalla Juego terminado + fetch post
        }else{
            
            this.timedEvent.destroy();
            if(pasado){
                this.tiempoEmpleadoTotal+=this.EscenaEnCurso.TiempoLimite*60;
                this.tiempoEmpleadoTotalMinutos=this.tiempoEmpleadoTotal/60 | 0;                
                this.timerGlobal=0;       
            }else{
                this.tiempoEmpleadoTotal+=this.timerGlobal;
                this.tiempoEmpleadoTotalMinutos=this.tiempoEmpleadoTotal/60 | 0;                
                this.timerGlobal=0;
            }
            //Añadir código pasar de escena
            this.EscenaEnCurso=EscenaActiva[this.contadorEscenas-1];
            this.changeScene();
            this.timedEvent=this.time.addEvent({ delay: 1000, repeat: this.EscenaEnCurso.TiempoLimite*60, callback: this.onEvent, callbackScope:this });
        
            this.textEscenas.text='Escena: '+this.contadorEscenas+'/'+this.EscenasActivas.length+'\n'+'Nota: '+this.nota +'\n'+'Tiempo disponible: '+ this.tiemposEscenas[this.contadorEscenas-1]+':00';
        

        }
        
    }

    changeScene(){
        
        this.playerReady=false;
        this.player.removeAllListeners().destroy();
        
        this.physics.world.colliders.destroy();    

        for(let i=0; i<this.layersActivas.length; i++){
            this.layersActivas[i].removeAllListeners().destroy();
        }
        
        this.layersActivas=[];

        this.layersActivas.push(this.maps[this.contadorEscenas-1].createLayer('suelo',this.tilesheets[this.contadorEscenas-1],0,0).setDepth(0).setOrigin(0,0));

        this.layersActivas.push(this.maps[this.contadorEscenas-1].createLayer('solid', this.tilesheets[this.contadorEscenas-1],0,0).setDepth(2).setOrigin(0,0));
        this.layersActivas[1].setCollisionByProperty({collides: true});

        //Añadimos la física de las camáras y los bordes del mapa(tambien se podría hacer añadiendo la
        //propiedad collides: true a los bordes del mapa creado en Tiled)
        //@ts-ignore
        this.cameras.main.setBounds(0, 0, this.layersActivas[0].width, this.layersActivas[0].height);
        //@ts-ignore
        this.physics.world.setBounds(0, 0, this.layersActivas[0].width, this.layersActivas[0].height);
        

        //Añadimos el player
        //@ts-ignore
        this.player= this.physics.add.image(this.layersActivas[0].width/2 + 150, this.game.config.height/2,'1skinimg');
        //En este caso lo escalo manualmente, hay que fijarse al subir las skins de que 
        //tienen que ser de un tamaño similar a los tiles de la escena
        this.player.setScale(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(1);
        this.player.setOrigin(0,0);

        //si queremos modificar el collidebox del sprite
        //this.player.body.setSize(this.player.width, this.player.height/2, false);
        this.physics.add.collider(this.player, this.layersActivas[1]);
        this.playerReady=true;
        this.cameras.main.startFollow(this.player, true, 0.4, 0.4);
    }

    testDelete(){
        this.JuegoTerminado();
    }

    JuegoTerminado(){
        this.playerReady=false;
        this.cursors=undefined;
        this.juegoTerminado=true;
        
        this.physics.world.colliders.destroy(); 
        this.player.removeAllListeners().destroy();
        
        this.textEscenas.destroy();
        
        for(let i=0; i<this.layersActivas.length; i++){
            this.layersActivas[i].removeAllListeners().destroy();
        }
        //this.maps[0].destroy();
        this.layersActivas=[];
        this.bag.destroy();
        //destroy gamepad too

        var config: Phaser.Types.GameObjects.Text.TextStyle= {align: 'center'};
        this.textTerminado= this.add.text(this.widthWindow/2, this.HeightWindow/2, 'JUEGO TERMINADO \n \n'
        +'Nota Final: '+ this.nota+'\n' +'Tiempo Empleado: '+ this.tiempoEmpleadoTotalMinutos, config).setOrigin(0.5,0.5);
        this.cameras.main.startFollow(this.textTerminado);
    }

    CheckRequisitos(){

    }
  }