import { AwaitLoaderPlugin } from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';
import UIPlugins from 'phaser3-rex-plugins/templates/ui/ui-plugin';
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
import { CommonModule } from '@angular/common';
import { Component, Inject, ModuleWithProviders, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
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
    tiempoEmpleadoTotalMinutos: number=0;
    tiempoEmpleadoTotalJuegoMinutos: number=0;
    timedEventtest: Phaser.Time.TimerEvent;
    textTerminado: Phaser.GameObjects.Text;
    playerReady: boolean=false;
    juegoTerminado: boolean=false;
    imagesObjects: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]=[];
    coordinatesStored: Array<any>=[];
    objectlayer: Phaser.GameObjects.Layer;
    exitLayer: Phaser.GameObjects.GameObject[];
    bagActiva: boolean=false;
    requisitosCumplidos: boolean= false;
    collideSalida: Phaser.Physics.Arcade.Collider;
    countcol: number=0;
    haycolision: boolean=false;
    tempcol: number=0;
    estoyEnSalida: boolean=false;
    dialogoAbierto: boolean=false;
    joyStick: any;
    cursorsJoystick: any;
    firedEventFinal: boolean=false;

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
        this.urlPostInscripcionAlumno=this.baseURL + ':3000/api/alumnoescaperoom/';  
           
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
    urlPostInscripcionAlumno: string;
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
    PreguntasActivasEscenaActiva: PreguntaActiva[]=[];
    Objetos:ObjetoEscaperoom[]=[];
    Skin: SkinActiva;
    SkinDatos: Skin;
    Preguntas: Pregunta[]=[];
    PreguntasActivas: PreguntaActiva[]=[];
    tiempoActual: number;
    tiempoEmpleadoTotal: number;
    mecanica: string;
    puntosTotal: number=0;
    puntosEscenaActiva: number[]=[];
    puntosEscenaActivaAcumulados: number=0;
    puntosAcumulados: number=0;
    puntosRestarAcumulados: number=0;
    nota: number=0;
    penalizacion: number=5;    
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
        //this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
  
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

        
        /*var percentText = this.make.text({
            x: xtext,
            y: ytext,
            text: '0%',
            style: {
                font: heighttext +'px monospace',
                color: '#ffffff'
            }
        }).setDepth(1); */       
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

        //this.load.image('2preg',"http://localhost:3000/api/imagenes/ImagenesPreguntas/download/madrid_4t.jpg")
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
                                if (imagen!=undefined){
                                    console.log('tengo imagen', cont, imagen);
                                    
                                    game.load.image(((cont+1)+'preg'), "http://localhost:3000/api/imagenes/ImagenesPreguntas/download/madrid_4t.png")
                                    
                                    /*.on('filecomplete-image-'+(cont+1)+'preg',()=>{
                                        cont++;
                                        console.log('enterd');
                                        if(cont==game.PreguntasActivas.length){        
                                            successCallback();
                                        }    
                                    });*/
                                    
 
                                }
                                cont++;
                                console.log('enterd');
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

        this.load.on('loaderror', (file)=>{
            console.log(file);
        })
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
            //percentText.setText(parseInt(percent)* 100 + '%');
        });

        this.load.on("complete", ()=>{
            progressBar.destroy();
            progressBox.destroy();
            //percentText.destroy();
        });
    }
  
    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    create() {

        this.EscenaEnCurso= this.EscenasActivas[this.contadorEscenas-1];

        for(let i=0; i<this.ObjetosActivos.length;i++){
            if(this.ObjetosActivos[i].escenaActivaId==this.EscenaEnCurso.id){
                this.ObjetosActivosEscenaActiva.push(this.ObjetosActivos[i]);
            }
        }

        
        
        this.image.destroy();
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.nota=10;

        for(let i=0; i<this.EscenasActivas.length; i++){
            this.tiemposEscenas.push(this.EscenasActivas[i].TiempoLimite);
            this.puntosEscenaActiva.push(this.EscenasActivas[i].RequisitoPuntos);
        }
        for(let b=0; b<this.PreguntasActivas.length; b++){
            this.puntosTotal+=this.PreguntasActivas[b].PuntosSumar;
        }
        
        this.cameras.main.setBackgroundColor('#000000');

        //Bucle para crear mapas, objetos y colisiones
        for(let c=0; c<this.EscenasActivas.length; c++){            
            this.maps.push(this.make.tilemap({key:(c+1).toString()+'map'}));
            this.tilesheets.push(this.maps[c].addTilesetImage('tileset',(c+1).toString()+'tiles'));
            
        }
        
        this.layersActivas.push(this.maps[0].createLayer('suelo',this.tilesheets[0],0,0).setDepth(0).setOrigin(0,0));
        //this.layersActivas[0].setX(((this.widthWindow-this.layersActivas[0].width)/2));

        this.layersActivas.push(this.maps[0].createLayer('solido', this.tilesheets[0],0,0).setDepth(2).setOrigin(0,0));
        //this.layersActivas[1].setX(((this.widthWindow-this.layersActivas[1].width)/2));
        this.layersActivas[1].setCollisionByProperty({collides: true});

        this.layersActivas.push(this.maps[0].createLayer('salida', this.tilesheets[0],0,0).setDepth(0).setOrigin(0,0))
        //this.layersActivas[2].setCollisionByProperty({collides: true});
        console.log(this.layersActivas[2]);

        //Cargamos la mochila y los controles
        if(this.layersActivas[0].width<=this.widthWindow && this.layersActivas[0].height<=this.HeightWindow-45){
            this.bag= this.add.image(this.layersActivas[0].width, this.layersActivas[0].height,'bag').setOrigin(1,1).setScale(0.15).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive().on('pointerup',()=>{
                this.MostrarObjetosRecogidos();
            })
        }else if(this.layersActivas[0].width>=this.widthWindow && this.layersActivas[0].height<=this.HeightWindow-45){
            this.bag= this.add.image(this.widthWindow, this.layersActivas[0].height,'bag').setOrigin(1,1).setScale(0.15).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive().on('pointerup',()=>{
                this.MostrarObjetosRecogidos();
            })
        }else if(this.layersActivas[0].width<=this.widthWindow && this.layersActivas[0].height>=this.HeightWindow-45){
            this.bag= this.add.image(this.layersActivas[0].width, this.HeightWindow-45,'bag').setOrigin(1,1).setScale(0.15).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive().on('pointerup',()=>{
                this.MostrarObjetosRecogidos();
            })
        }else{
            this.bag= this.add.image(this.widthWindow, this.HeightWindow-45,'bag').setOrigin(1,1).setScale(0.15).setScrollFactor(0).setDepth(this.layersActivas.length+1).setAlpha(0.6).setInteractive().on('pointerup',()=>{
                this.MostrarObjetosRecogidos();
            })
        }        
        
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
        this.player.setScale(0.09);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(1);
        this.player.setOrigin(0.5,0.5);
        this.player.setVelocity(0);

        //OBJETOS RANDOM
        var vectorXstored: Phaser.Math.Vector2[]=[];
        for(let i=0; i<this.ObjetosActivosEscenaActiva.length; i++){
                console.log(this.ObjetosActivosEscenaActiva.length);
                var valid=false;
                while(!valid){
                    var randomX=Math.floor(this.layersActivas[0].width*Math.random());
                    var randomY=Math.floor(this.layersActivas[0].height*Math.random());
                            
                    var x=this.maps[0].worldToTileXY(randomX,randomY);
                    var foundX=vectorXstored.find(sc=>sc ==x);          
                    console.log(foundX);

                    console.log(this.maps[0].getTileAt(x.x,x.y));
                    if(this.maps[0].getTileAt(x.x,x.y,false,'solido')==null && foundX==undefined && !valid){
                        vectorXstored.push(x);
                        console.log(vectorXstored);
                        //this.objectlayer.add(this.physics.add.sprite(randomX,randomY,(i+1)+'obj'));
                        //this.objectlayer
                        this.imagesObjects.push(this.physics.add.sprite(randomX,randomY,(i+1)+'obj').setImmovable().setDepth(this.layersActivas.length+1));
                        
                        this.physics.add.overlap(this.player, this.imagesObjects[i], ()=>{

                            //se almacena el indice
                            this.countcol+=1;
                            if(!this.haycolision){
                                this.playerReady=false;
                                //console.log('collisiooon'+i);
                                if(!this.dialogoAbierto){
                                    
                                    this.dialogoAbierto=true;
                                    if(this.ObjetosActivosEscenaActiva[i].PreguntaBool){
                                        this.player.setVelocity(0);
                                        console.log('este es el contador', i, this.imagesObjects)

                                        this.ShowDialog(this.imagesObjects[i], i, i);
                                        //console.log(this.ObjetosActivos[i].PreguntaBool,this.PreguntasActivas.length);
                                        //this.add.image(0,0,i+'preg').setDepth(this.layersActivas.length+2).setOrigin(0,0);
                                    }else if(this.ObjetosActivosEscenaActiva[i].PistaBool){                                    
                                        this.player.setVelocity(0);
                                        this.ShowDialogPista(i, i);

                                    }
                                }
                                this.haycolision=true;
                            }                       

                        })
                        valid=true;
                    }
                }
            
        }

        //si queremos modificar el collidebox del sprite
        //this.player.body.setSize(this.player.width, this.player.height/2, false);
        this.physics.add.collider(this.player, this.layersActivas[1]);


        //si queremos hacer check con collider en la salida (no recomendable, y el overlap no funciona bien
        //, asi que optamos por una funcion que checkee los tiles de salida en el update)
        //migrar a fisicas 'matter' en vez de 'arcade'
        /*this.collideSalida=this.physics.add.collider(this.player, this.layersActivas[2],()=>{
                this.countcol+=1;
                if(!this.haycolision){
                    this.haycolision=true;
                    //this.playerReady=false;
                    this.CheckRequisitos();   
                }         
        })*/

        
        this.cameras.main.startFollow(this.player, true, 0.4, 0.4);
        
        this.playerReady=true;
        //this.cameras.add().startFollow(this.cameras.main)
        
        //Texto de tiempo, nota y score
        this.textEscenas= this.add.text(0,0,'Escena: '+this.contadorEscenas+'/'+this.EscenasActivas.length+'\n'+'Nota: '+this.nota +'\n'+'Tiempo disponible: '+ this.tiemposEscenas[this.contadorEscenas-1]+':00')
        .setDepth(this.layersActivas.length+2).setScrollFactor(0);

        
        

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
        
        /*const debugGraph= this.add.graphics().setAlpha(0.7).setDepth(5);
        this.layersActivas[2].renderDebug(debugGraph,{
            tileColor:null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 48, 255),

        })*/
        //this.cameras.main.zoom=1.1;

        //@ts-ignore
        this.joyStick = this.plugins.get('rexVirtualJoystick').add(this, {
            x: 75+50,
            y: this.HeightWindow-40-75-25,
            radius:60,
            base: this.add.circle(0, 0, 60, 0x888888),
            thumb: this.add.circle(0, 0, 30, 0xcccccc),
            dir: '4dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        }).setDepth(5)
        .setAlpha(0.4)
        .setScrollFactor(0);

        this.cursorsJoystick=this.joyStick.createCursorKeys();

    
    }

    update(time: number, delta: number): void {
        if (this.tempcol==this.countcol && this.haycolision==true){
            this.haycolision=false;
            this.tempcol=0;
            this.countcol=0;
            //this.playerReady=true;
        }
        this.tempcol=this.countcol;
        //TIMECONTROLS



        //console.log(this.maps[0].getTileAt(this.maps[0].worldToTileX(this.player.x),this.maps[0].worldToTileY(this.player.y),false,'salida'));
        //console.log(this.maps[0].worldToTileXY(this.player.x, this.player.y));
            if(this.timerGlobal>=this.EscenaEnCurso.TiempoLimite*60){
                if(!this.firedEventFinal){                    
                    this.firedEventFinal=true;                
                    this.onEventFinal();
                }
            }
        

        //CONTROLREQUISITOS

        //PLAYER CONTROLS
        
        
        if(this.playerReady){
            if(this.maps[this.contadorEscenas-1].getTileAt(this.maps[this.contadorEscenas-1].worldToTileX(this.player.x),this.maps[this.contadorEscenas-1].worldToTileY(this.player.y),false,'salida')!=null){
                //console.log('estoy en salida');
                if(!this.estoyEnSalida){
                    this.CheckRequisitos();                
                    this.estoyEnSalida=true;
                }
            }else{
                this.estoyEnSalida=false;
            }
            this.player.setVelocity(0);
            if (this.cursorsJoystick.left.isDown)
            {
                this.player.setVelocityX(-200);
            }
            else if (this.cursorsJoystick.right.isDown)
            {
                this.player.setVelocityX(200);
            }

            if (this.cursorsJoystick.up.isDown)
            {
                this.player.setVelocityY(-200);
            }
            else if (this.cursorsJoystick.down.isDown)
            {
                this.player.setVelocityY(200);
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
            this.tiempoEmpleadoTotalMinutos=this.timerGlobal/60 | 0;
            
            this.tiempoActual=this.EscenaEnCurso.TiempoLimite*60 - this.timerGlobal;
            var min=this.tiempoActual/60 | 0;
            var sec= this.tiempoActual % 60;
            var secStr: string =sec.toString();
            if (sec<10){
                secStr='0'+sec;
            }
            //console.log(this.nota);
            this.textEscenas.text='Escena: '+this.contadorEscenas+'/'+this.EscenasActivas.length+'\n'+'Nota: '+ this.nota +'\n'+'Tiempo disponible: '+ min+':'+secStr;
        }
    }

    onEventFinal(){
        //this.contadorEscenas+=1;
        if(this.contadorEscenas==this.EscenasActivas.length){            
            this.timedEvent.destroy();
                
            this.tiempoEmpleadoTotalJuegoMinutos+=(this.EscenaEnCurso.TiempoLimite);                

            this.JuegoTerminado();
            //Pantalla Juego terminado + fetch post
        }else{
            
            this.timedEvent.destroy();
                
            this.tiempoEmpleadoTotalJuegoMinutos+=(this.EscenaEnCurso.TiempoLimite);
            //Añadir código pasar de escena
            this.changeScene();
            //penalización de 0,5 puntos
            this.nota=this.nota - 0.5;

        }
        
    }

    changeScene(){
        
        this.contadorEscenas+=1;
        if(this.contadorEscenas>this.EscenasActivas.length){
            this.JuegoTerminado();
        }else{
            this.timedEvent.destroy();            
            this.EscenaEnCurso=this.EscenasActivas[this.contadorEscenas-1];
            this.playerReady=false;
            this.player.removeAllListeners().destroy();
            //this.textEscenas.destroy();
            
            this.physics.world.colliders.destroy();
            console.log(this.imagesObjects);
            for(let b=0; b<this.imagesObjects.length; b++){
                if(this.imagesObjects[b]!=undefined){                
                    this.imagesObjects[b].destroy();
                }
            }
            this.imagesObjects=[];

            this.ObjetosActivosEscenaActiva=[];

            for (let i=0; i<this.ObjetosActivos.length;i++){
                console.log(this.EscenasActivas,this.contadorEscenas,this.EscenaEnCurso);
                if(this.ObjetosActivos[i].escenaActivaId==this.EscenaEnCurso.id){
                    this.ObjetosActivosEscenaActiva.push(this.ObjetosActivos[i]);
                    console.log(this.ObjetosActivosEscenaActiva);
                }
            }


            for(let i=0; i<this.layersActivas.length; i++){
                this.layersActivas[i].removeAllListeners().destroy();
            }

            
            this.layersActivas= [];
            console.log(this.maps, this.tilesheets, this.layersActivas);

            this.layersActivas.push(this.maps[this.contadorEscenas-1].createLayer('suelo',this.tilesheets[this.contadorEscenas-1],0,0).setDepth(0).setOrigin(0,0));

            this.layersActivas.push(this.maps[this.contadorEscenas-1].createLayer('solido', this.tilesheets[this.contadorEscenas-1],0,0).setDepth(2).setOrigin(0,0));
            this.layersActivas[1].setCollisionByProperty({collides: true});

            this.layersActivas.push(this.maps[this.contadorEscenas-1].createLayer('salida', this.tilesheets[this.contadorEscenas-1],0,0).setDepth(3).setOrigin(0,0))

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
            this.player.setScale(0.09);
            this.player.setCollideWorldBounds(true);
            this.player.setDepth(1);
            this.player.setOrigin(0.5,0.5);
            this.player.setVelocity(0);
    

            //si queremos modificar el collidebox del sprite
            //this.player.body.setSize(this.player.width, this.player.height/2, false);
            this.physics.add.collider(this.player, this.layersActivas[1]);
            
            this.cameras.main.startFollow(this.player, true, 0.4, 0.4);
            
            var vectorXstored: Phaser.Math.Vector2[]=[];
            for(let i=0; i<this.ObjetosActivosEscenaActiva.length; i++){
                    
                    console.log(this.ObjetosActivos.length);
                    var valid=false;
                    while(!valid){
                        var randomX=Math.floor(this.layersActivas[0].width*Math.random());
                        var randomY=Math.floor(this.layersActivas[0].height*Math.random());
                                
                        var x=this.maps[this.contadorEscenas-1].worldToTileXY(randomX,randomY);
                        var foundX=vectorXstored.find(sc=>sc ==x);          
                        console.log(foundX);

                        console.log(this.maps[this.contadorEscenas-1].getTileAt(x.x,x.y));
                        if(this.maps[this.contadorEscenas-1].getTileAt(x.x,x.y,false,'solido')==null && foundX==undefined && !valid){
                            vectorXstored.push(x);
                            console.log(vectorXstored);
                            //this.objectlayer.add(this.physics.add.sprite(randomX,randomY,(i+1)+'obj'));
                            //this.objectlayer
                            this.imagesObjects.push(this.physics.add.sprite(randomX,randomY,(i+1)+'obj').setImmovable().setDepth(this.layersActivas.length+1));
                            this.physics.add.overlap(this.player, this.imagesObjects[i], ()=>{
                                //se almacena el indice
                                //console.log('fufa');
                                this.countcol+=1;
                                if(!this.haycolision){
                                    this.playerReady=false;
                                    //console.log('collisiooon'+i);
                                    if(!this.dialogoAbierto){
                                        
                                        this.dialogoAbierto=true;
                                        if(this.ObjetosActivosEscenaActiva[i].PreguntaBool){
                                            this.player.setVelocity(0);
                                            this.ShowDialog(this.imagesObjects[i], i, i);
                                            //console.log(this.ObjetosActivos[i].PreguntaBool,this.PreguntasActivas.length);
                                            //this.add.image(0,0,i+'preg').setDepth(this.layersActivas.length+2).setOrigin(0,0);
                                        }else if(this.ObjetosActivosEscenaActiva[i].PistaBool){                                    
                                            this.player.setVelocity(0);
                                            this.ShowDialogPista(i, i);

                                        }
                                    }
                                    this.haycolision=true;
                                }                       

                            })
                            valid=true;   
                        }
                    }
                    
                
            }
            
            this.playerReady=true;
            this.puntosEscenaActivaAcumulados=0;
            var min=this.timerGlobal/60 | 0;
            this.tiempoEmpleadoTotalJuegoMinutos+=min;
            this.timerGlobal=0;
            this.tiempoEmpleadoTotalMinutos=0;
            this.timedEvent= this.time.addEvent({ delay: 1000, repeat: this.EscenaEnCurso.TiempoLimite*60, callback: this.onEvent, callbackScope:this });
            this.firedEventFinal=false;
            
        }
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
        this.joyStick.destroy();
        
        this.textEscenas.destroy();
        
        for(let i=0; i<this.layersActivas.length; i++){
            this.layersActivas[i].removeAllListeners().destroy();
        }

        for(let b=0; b<this.imagesObjects.length;b++){
            if(this.imagesObjects[b]!=undefined){                
                this.imagesObjects[b].destroy();
            }
        }
        this.imagesObjects=[];

        //this.maps[0].destroy();
        this.layersActivas=[];
        this.bag.destroy();
        //destroy gamepad too
        var config: Phaser.Types.GameObjects.Text.TextStyle= {align: 'center'};
        this.textTerminado= this.add.text(this.widthWindow/2, this.HeightWindow/2, 'JUEGO TERMINADO \n \n'
        +'Nota Final: '+ this.nota+'\n' +'Tiempo Empleado: '+ this.tiempoEmpleadoTotalJuegoMinutos, config).setOrigin(0.5,0.5);
        this.cameras.main.startFollow(this.textTerminado);

        this.inscripcionAlumnoJuegoDeEscaperoom[0].Resuelto=true;
        this.inscripcionAlumnoJuegoDeEscaperoom[0].PuntosTotalesAlumno=this.nota;
        this.inscripcionAlumnoJuegoDeEscaperoom[0].TiempoEnResolver=this.tiempoEmpleadoTotalJuegoMinutos;
        console.log(JSON.stringify(this.inscripcionAlumnoJuegoDeEscaperoom[0]));
        /*
        const {...obj} = this.inscripcionAlumnoJuegoDeEscaperoom[0];
        obj.Resuelto=true;
        obj.PuntosTotalesAlumno=this.nota;
        obj.TiempoEnResolver=this.tiempoEmpleadoTotalJuegoMinutos;

        console.log(obj);
        */

        fetch(this.urlPostInscripcionAlumno+this.inscripcionAlumnoJuegoDeEscaperoom[0].id, {
            method:'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.inscripcionAlumnoJuegoDeEscaperoom[0]),
        })
        
    }

    CheckRequisitos(){
        //por ahora solo esta para modo puntos
        console.log(this.puntosEscenaActiva);
        console.log(this.puntosEscenaActivaAcumulados, this.puntosEscenaActiva[this.contadorEscenas-1]);
        if(this.puntosEscenaActivaAcumulados>=this.puntosEscenaActiva[this.contadorEscenas-1]){
            this.playerReady=false;
            this.player.setVelocity(0);
            
            if(this.contadorEscenas<this.EscenasActivas.length){
                //@ts-ignore
                var toast = this.rexUI.add.toast({
                    x: this.widthWindow/2,
                    y: (this.HeightWindow-40)/2,
                    //@ts-ignore
                    background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x2e571f),
                    text: this.add.text(0, 0, '', {
                        fontSize: '12px',
                        wordWrap: {
                            width: this.widthWindow/2
                        },
                    }),
                    space: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20,
                    },
                })
                .setDepth(this.layersActivas.length+4)
                .setScrollFactor(0)
                .showMessage("Buena suerte en la siguiente escena");
            }
            
            this.time.addEvent({ delay: 1000, callback: this.changeScene, callbackScope:this });

        }else{
            //@ts-ignore
            var toast = this.rexUI.add.toast({
                x: this.widthWindow/2,
                y: (this.HeightWindow-40)/2,
                //@ts-ignore
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x2e571f),
                text: this.add.text(0, 0, '', {
                    fontSize: '12px',
                    wordWrap: {
                        width: this.widthWindow/2
                    },
                }),
                space: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                },
            })
            .setDepth(this.layersActivas.length+4)
            .setScrollFactor(0)
            .showMessage("Vaya, parece que no se puede entrar...");
        }

    }

    
    ShowDialog(imagen: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, id: number, cont: number) {
        console.log(this.PreguntasActivas, this.ObjetosActivos, cont);
        var pregAct= this.PreguntasActivas.find(pre=>pre.objetoActivoId==this.ObjetosActivosEscenaActiva[id].id);
        //fix en creacion de juego, algo va regular no sube todas las preguntas activas
        if(pregAct!=null){
            var preg= this.Preguntas.find(preg=>preg.id== pregAct.preguntaId);
            console.log(preg, preg.Imagen,  this.layersActivas[0].width/4, this.HeightWindow/4);
            if(preg.Tipo=="Cuatro opciones"){
                var preguntas= this.shuffleArray(preg.RespuestaCorrecta,preg.RespuestaIncorrecta1, preg.RespuestaIncorrecta2, preg.RespuestaIncorrecta3);
                
                if(preg.Imagen!=undefined){
                    this.playerReady=false;
                    this.createDialog4OptionsImg(preg, preguntas,cont,pregAct);
            
                }else{
                    this.playerReady=false;
                    this.createDialog4OptionsNoImg(preg, preguntas,cont,pregAct);
                }
            }else if(preg.Tipo="Verdadero o falso"){
                if(preg.Imagen!=undefined){
                    this.playerReady=false;
                    this.createDialogVFImg(preg, preguntas,cont,pregAct);
            
                }else{
                    this.playerReady=false;
                    this.createDialogVFNoImg(preg, preguntas,cont,pregAct);
                }
            }

        }
        

    }

    ShowDialogPista(i: number, cont: number){
        //@ts-ignore
        var toast = this.rexUI.add.toast({
            x: this.widthWindow/2,
            y: (this.HeightWindow-40)/2,
            //@ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x2e571f),
            text: this.add.text(0, 0, '', {
                fontSize: '12px',
                wordWrap: {
                    width: this.widthWindow/2
                },
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
        })
        .setDepth(this.layersActivas.length+4)
        .setScrollFactor(0)
        .showMessage(this.ObjetosActivosEscenaActiva[i].PistaString);
    }

    createLabel(scene, text) {
        return scene.rexUI.add.label({
            width: 20, // Minimum width of round-rectangle
            height: 6, // Minimum height of round-rectangle
          
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 6, 10, 0x5e92f3),
    
            text: scene.add.text(0, 0, text, {
                fontSize: '12px',
                
                wordWrap: {
                    width: this.widthWindow/2
                },

            }),
    
            space: {
                left: 6,
                right: 6,
                top: 6,
                bottom: 6
            }
        });
    }

    createLabelVF(scene, text) {
        return scene.rexUI.add.label({
            // width: 40,
            // height: 40,
    
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),
    
            text: scene.add.text(0, 0, text, {
                fontSize: '12px'
            }),
    
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        });
    }

    shuffleArray(str1:string, str2: string, str3:string, str4:string){
        let vectorOr: string[]=[];
        vectorOr.push(str1,str2,str3,str4);
        var temp="";
        for(let i=0; i<4; i++){
            temp=vectorOr[i];
            var rand= Math.random()*3.99;
            var index=Math.floor(rand);
            vectorOr[i]=vectorOr[index];
            vectorOr[index]=temp;
            if(i==3){
                return vectorOr;
            }
        }
        

    }

    createDialog4OptionsNoImg(preg, preguntas,id,pregAct){
        var choice="";
        //@ts-ignore
        var dialog = this.rexUI.add.dialog({
            x: this.widthWindow/2,
            y: (this.HeightWindow-40)/2,
            width: this.layersActivas[0].width/4,
            height: 100,
            
            //@ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.createLabel(this, preg.Tematica).setDraggable(),

            toolbar: [
                this.createLabel(this, 'X')
            ],

            content: this.createLabel(this, preg.Pregunta),

            choices: [
                this.createLabel(this, preguntas[0]),
                this.createLabel(this, preguntas[1]),
                this.createLabel(this, preguntas[2]),                        
                this.createLabel(this, preguntas[3]),
            ],

            actions: [
                this.createLabel(this, 'Enviar')
            ],

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 20,
                content: 20,
                description: 25,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 10,

                toolbarItem: 5,
                choice: 8,
                action: 15,
            },

            expand: {
                title: false,
                content: true,
                // description: false,
                // choices: false,
                // actions: true,
            },

            align: {
                title: 'left',
                // content: 'left',
                // description: 'left',
                // choices: 'left',
                actions: 'right', // 'center'|'left'|'right'
            },

            click: {
                mode: 'pointerdown',
                clickInterval: 100
            },

            draggable: false,
        })
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(1000)
        .setDepth(this.layersActivas.length+4)
        .setScrollFactor(0)
        .hideAction(0)
        .setDraggable('background');

        
        var game=this;
        dialog
        .on('button.click', function (button, groupName, index, pointer, event) {
            if(groupName=='actions'){
                if(choice==preg.RespuestaCorrecta){
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',
                            
                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackCorrecto);
                    dialog.destroy();
                    game.dialogoAbierto=false;
                    game.puntosEscenaActivaAcumulados+=pregAct.PuntosSumar;
                    game.puntosAcumulados+=pregAct.PuntosSumar;
                    game.imagesObjects[id].destroy();
                }else{
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',

                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackIncorrecto);
                    dialog.destroy();
                    
                    game.dialogoAbierto=false;
                    game.puntosRestarAcumulados+=pregAct.PuntosRestar;
                    game.nota=Math.round((((game.puntosTotal-game.puntosRestarAcumulados)/game.puntosTotal)*10)*100)/100;
                }
                game.playerReady=true;

            }else if(groupName=='choices'){
                
                dialog.forEachChoice((button, index, buttons)=>{
                    button.getElement('background').setStrokeStyle();
                }, this);
                button.getElement('background').setStrokeStyle(1, 0xffffff);
                choice=button.getElement('text')._text;
                dialog.showAction(0);
                
            }else if(groupName=='toolbar'){
                    dialog.destroy();
                    
                    game.dialogoAbierto=false;
                    this.playerReady=true;
            }
        }, this);
    }

    ShowDialogImage(preg: Pregunta, preguntas,id,pregAct){
        
        var ind=this.Preguntas.findIndex(prg=>prg==preg);
        
        console.log("lo creo",ind);
        //@ts-ignore
        var dialog = this.rexUI.add.dialog({
            x: this.widthWindow/2,
            y: (this.HeightWindow-40)/2,
            width: this.layersActivas[0].width/4,
            height: 100,
            
            //@ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.createLabel(this, "Imagen").setDraggable(),

            toolbar: [
                this.createLabel(this, 'X'),
                this.createLabel(this, 'Ver Pregunta')
            ],
            //@ts-ignore
            content: this.add.image(0,0,(ind+1)+'preg').setScale(0.5),

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: 0,

                title: 0,
                content: 0,
                description: 0,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 10,

                toolbarItem: 5,
                choice: 8,
                action: 15,
            },

            expand: {
                title: false,
                content: false,
                // description: false,
                // choices: false,
                // actions: true,
            },

            align: {
                title: 'left',
                content: 'center',
                // description: 'left',
                // choices: 'left',
                actions: 'right', // 'center'|'left'|'right'
            },

            click: {
                mode: 'pointerdown',
                clickInterval: 100
            },

            draggable: false,
        })
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(1000)
        .setDepth(this.layersActivas.length+5)
        .setScrollFactor(0)
        .setDraggable('background');

        
        var game=this;
    dialog
        .on('button.click', function (button, groupName, index, pointer, event) {
            if(groupName=='toolbar'){
                dialog.destroy();
                
                if(index==0){
                    game.playerReady=true;                    
                    game.dialogoAbierto=false;
                }else{                    
                    game.createDialog4OptionsImg(preg,preguntas,id,pregAct);
                }

            }
        }, this);
    }

    createDialog4OptionsImg(preg, preguntas,id,pregAct){
        var choice="";
        //@ts-ignore
        var dialog = this.rexUI.add.dialog({
            x: this.widthWindow/2,
            y: (this.HeightWindow-40)/2,
            width: this.layersActivas[0].width/4,
            height: 100,
            
            //@ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.createLabel(this, preg.Tematica).setDraggable(),

            toolbar: [
                this.createLabel(this, 'X'),
                this.createLabel(this, 'Ver Imagen')
            ],

            content: this.createLabel(this, preg.Pregunta),

            choices: [
                this.createLabel(this, preguntas[0]),
                this.createLabel(this, preguntas[1]),
                this.createLabel(this, preguntas[2]),                        
                this.createLabel(this, preguntas[3]),
            ],

            actions: [
                this.createLabel(this, 'Enviar'),
                
            ],

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 20,
                content: 20,
                description: 25,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 10,

                toolbarItem: 5,
                choice: 8,
                action: 15,
            },

            expand: {
                title: false,
                content: true,
                // description: false,
                // choices: false,
                // actions: true,
            },

            align: {
                title: 'left',
                // content: 'left',
                // description: 'left',
                // choices: 'left',
                actions: 'right', // 'center'|'left'|'right'
            },

            click: {
                mode: 'pointerdown',
                clickInterval: 100
            },

            draggable: false,
        })
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(1000)
        .setDepth(this.layersActivas.length+4)
        .setScrollFactor(0)
        .hideAction(0)
        .setDraggable('background');

        
        var game=this;
    dialog
        .on('button.click', function (button, groupName, index, pointer, event) {
            if(groupName=='actions'){
                if(choice==preg.RespuestaCorrecta){
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',

                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackCorrecto);
                    dialog.destroy();                            
                    game.dialogoAbierto=false;            
                    game.puntosEscenaActivaAcumulados+=pregAct.PuntosSumar;                    
                    game.puntosAcumulados+=pregAct.PuntosSumar;
                    game.imagesObjects[id].destroy();
                }else{
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',
                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackIncorrecto);
                    dialog.destroy();                        
                    game.dialogoAbierto=false;                
                    game.puntosRestarAcumulados+=pregAct.PuntosRestar;
                    game.nota=Math.round((((game.puntosTotal-game.puntosRestarAcumulados)/game.puntosTotal)*10)*100)/100;
                }
                game.playerReady=true;
            }else if(groupName=='choices'){
                
                dialog.forEachChoice((button, index, buttons)=>{
                    button.getElement('background').setStrokeStyle();
                }, game);
                button.getElement('background').setStrokeStyle(1, 0xffffff);
                choice=button.getElement('text')._text;
                dialog.showAction(0);
                
            }else if(groupName=='toolbar'){                
                
                if(index==0){
                    dialog.destroy();
                    game.playerReady=true;                    
                    game.dialogoAbierto=false;
                }else{
                    game.ShowDialogImage(preg, preguntas,id,pregAct);
                    dialog.destroy();
                }
            }
        }, this);
    }

    createDialogVFNoImg(preg, preguntas,id,pregAct){
        var choice="";
        //@ts-ignore
        var dialog = this.rexUI.add.dialog({
            x: this.widthWindow/2,
            y: (this.HeightWindow-40)/2,
            width: this.layersActivas[0].width/4,
            height: 100,
            
            //@ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.createLabel(this, preg.Tematica).setDraggable(),

            toolbar: [
                this.createLabel(this, 'X'),
            ],

            content: this.createLabel(this, preg.Pregunta),

            actions: [                
                this.createLabel(this, 'Verdadero'),
                this.createLabel(this, 'Falso')
            ],

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 20,
                content: 20,
                description: 25,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 10,

                toolbarItem: 5,
                choice: 8,
                action: 15,
            },

            expand: {
                title: false,
                // content: false,
                // description: false,
                // choices: false,
                // actions: true,
            },

            align: {
                title: 'left',
                // content: 'left',
                // description: 'left',
                // choices: 'left',
                actions: 'right', // 'center'|'left'|'right'
            },

            click: {
                mode: 'pointerdown',
                clickInterval: 100
            },

            draggable: false,
        })
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(1000)
        .setDepth(this.layersActivas.length+4)
        .setScrollFactor(0)
        .setDraggable('background');

        
        var game=this;
        dialog
        .on('button.click', function (button, groupName, index, pointer, event) {
            if(groupName=='actions'){
                var choice=button.getElement('text')._text;
                choice= choice.toLowerCase();
                if(choice==preg.RespuestaCorrecta){
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',
                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackCorrecto);
                    dialog.destroy();                    
                    game.dialogoAbierto=false;
                    game.puntosEscenaActivaAcumulados+=pregAct.PuntosSumar;
                    game.puntosAcumulados+=pregAct.PuntosSumar;
                    game.imagesObjects[id].destroy();
                }else{
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',
                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackIncorrecto);
                    dialog.destroy();                    
                    game.dialogoAbierto=false;                    
                    game.puntosEscenaActivaAcumulados+=pregAct.PuntosSumar;
                    game.puntosRestarAcumulados+=pregAct.PuntosRestar;
                    game.nota=Math.round((((game.puntosTotal-game.puntosRestarAcumulados)/game.puntosTotal)*10)*100)/100;
                    game.imagesObjects[id].destroy();
                }
                game.playerReady=true;

            }else if(groupName=='toolbar'){
                    dialog.destroy();                    
                    game.dialogoAbierto=false;
                    this.playerReady=true;
            }
        }, this);
    }

    ShowDialogVFImage(preg, preguntas,id,pregAct){
        
        console.log("lo creo");
        var ind=this.Preguntas.findIndex(prg=> prg==preg);
        //@ts-ignore
        var dialog = this.rexUI.add.dialog({
            x: this.widthWindow/2,
            y: (this.HeightWindow-40)/2,
            width: this.layersActivas[0].width/4,
            height: 100,
            
            //@ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.createLabel(this, "Imagen").setDraggable(),

            toolbar: [
                this.createLabel(this, 'X'),
                this.createLabel(this, 'Ver Pregunta')
            ],
            //@ts-ignore
            content: this.add.image(0,0,(ind+1)+'preg').setScale(0.5),

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: 0,

                title: 0,
                content: 0,
                description: 0,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 10,

                toolbarItem: 5,
                choice: 8,
                action: 15,
            },

            expand: {
                title: false,
                content: false,
                // description: false,
                // choices: false,
                // actions: true,
            },

            align: {
                title: 'left',
                //content: 'center',
                // description: 'left',
                // choices: 'left',
                actions: 'right', // 'center'|'left'|'right'
            },

            click: {
                mode: 'pointerdown',
                clickInterval: 100
            },

            draggable: false,
        })
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(1000)
        .setDepth(this.layersActivas.length+5)
        .setScrollFactor(0)
        .setDraggable('background');

        
        var game=this;
    dialog
        .on('button.click', function (button, groupName, index, pointer, event) {
            if(groupName=='toolbar'){
                dialog.destroy();                
                
                if(index==0){
                    game.playerReady=true;
                    game.dialogoAbierto=false;
                }else{
                    game.createDialogVFImg(preg,preguntas,id,pregAct);
                }

            }
        }, this);
    }

    createDialogVFImg(preg, preguntas,id,pregAct){
        var choice="";
        //@ts-ignore
        var dialog = this.rexUI.add.dialog({
            x: this.widthWindow/2,
            y: (this.HeightWindow-40)/2,
            width: this.layersActivas[0].width/4,
            height: 100,
            
            //@ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.createLabel(this, preg.Tematica).setDraggable(),

            toolbar: [
                this.createLabel(this, 'X'),
                this.createLabel(this, 'Ver Imagen')
            ],

            content: this.createLabel(this, preg.Pregunta),

            actions: [                
                this.createLabel(this,'Verdadero'),
                this.createLabel(this, 'Falso'),
            ],

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 20,
                content: 20,
                description: 25,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 10,

                toolbarItem: 5,
                choice: 8,
                action: 15,
            },

            expand: {
                title: false,
                content: true,
                // description: false,
                // choices: false,
                actions: false,
            },

            align: {
                title: 'left',
                // content: 'left',
                // description: 'left',
                // choices: 'left',
                actions: 'right', // 'center'|'left'|'right'
            },

            click: {
                mode: 'pointerdown',
                clickInterval: 100
            },

            draggable: false,
        })
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(1000)
        .setDepth(this.layersActivas.length+4)
        .setScrollFactor(0)
        .setDraggable('background');

        
        var game=this;
    dialog
        .on('button.click', function (button, groupName, index, pointer, event) {
            if(groupName=='actions'){
                var choice=button.getElement('text')._text;
                choice= choice.toLowerCase();
                if(choice==preg.RespuestaCorrecta){
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',
                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackCorrecto);
                    dialog.destroy();                    
                    game.dialogoAbierto=false;
                    game.puntosEscenaActivaAcumulados+=pregAct.PuntosSumar;
                    game.puntosAcumulados+=pregAct.PuntosSumar;
                    game.imagesObjects[id].destroy();
                }else{
                    var toast = this.rexUI.add.toast({
                        x: game.widthWindow/2,
                        y: (game.HeightWindow-40)/2,
            
                        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x1565c0),
                        text: this.add.text(0, 0, '', {
                            fontSize: '12px',
                            wordWrap: {
                                width: game.widthWindow/2
                            },
                        }),
                        space: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    })
                    .setDepth(game.layersActivas.length+4)
                    .setScrollFactor(0)
                    .showMessage(preg.FeedbackIncorrecto);
                    dialog.destroy();                    
                    game.dialogoAbierto=false;                    
                    game.puntosEscenaActivaAcumulados+=pregAct.PuntosSumar;
                    game.puntosRestarAcumulados+=pregAct.PuntosRestar;
                    game.nota=Math.round((((game.puntosTotal-game.puntosRestarAcumulados)/game.puntosTotal)*10)*100)/100;
                    game.imagesObjects[id].destroy();
                }
                game.playerReady=true;

            }else if(groupName=='toolbar'){                
                
                if(index==0){
                    dialog.destroy();
                    game.playerReady=true;
                    game.dialogoAbierto=false;
                }else{
                    game.ShowDialogVFImage(preg, preguntas,id,pregAct);
                    dialog.destroy();
                }
            }
        }, this);
    }

    MostrarObjetosRecogidos(){
        if(!this.bagActiva){
            //open dialog
            this.bagActiva=true;
        }else{
            //close diaglog
            this.bagActiva=false;
        }
    }


  }