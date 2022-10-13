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


export class LoadingScene extends Phaser.Scene{


    constructor() {
        super({ 
          key: 'preloader'
        })

        this.baseURL='http://localhost';
        this.idJuego=+localStorage.getItem('idJuego');
        this.idAlumno=+localStorage.getItem('idAlumno');
        this.urlGetInscripcionAlumno=this.baseURL + ':3000/api/alumnoescaperoom?filter[where][juegoDeEscaperoomId]='+this.idJuego+'&filter[where][alumnoId]='+this.idAlumno;    
        this.urlGetEscenasActivas=this.baseURL + ':3000/api/escenaescaperoomactiva?filter[where][juegoDeEscaperoomId]=' + this.idJuego;
        this.urlGetEscenas=this.baseURL + ':3000/api/escenasescaperoom/'
        this.urlGetObjetosActivos=this.baseURL +':3000/api/objetoactivoescaperoom?filter[where][juegoDeEscaperoomId]=' + this.idJuego;
        this.urlGetObjetos=this.baseURL +':3000/api/objetosescaperoom/'
        this.urlGetPreguntasActivas=this.baseURL +':3000/api/preguntasactivas?filter[where][juegoDeEscaperoomId]=' + this.idJuego;
        this.urlGetPreguntas=this.baseURL +':3000/api/Preguntas/'
        this.urlGetSkin=this.baseURL +':3000/api/skins/';
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
    //layers: Phaser.Tilemaps.TilemapLayer[]=[];
    //layerSelected: Phaser.Tilemaps.TilemapLayer;
    //solid: Phaser.Tilemaps.TilemapLayer[]=[];
    //solidSelected: Phaser.Tilemaps.TilemapLayer
  
    async getData(){

        /*
        if (this.juegoSeleccionado.Modo === 'Individual') {
        // Traigo la inscripción del alumno
        this.peticionesAPI.DameInscripcionAlumnoJuegoDeEscaperoom(this.juegoSeleccionado.id, this.alumno.id)
        .subscribe (inscripcion => {
            this.inscripcionAlumnoJuegoDeEscaperoom = inscripcion[0];
            console.log ('ya tengo la inscripcion');
            console.log (this.inscripcionAlumnoJuegoDeEscaperoom);
            // traigo los alumnos del juego
            this.peticionesAPI.DameAlumnosjuegoDeEscaperoom(this.juegoSeleccionado.id)
            .subscribe (alumnos => {
                this.alumnos = alumnos;
            });
        });
        this.peticionesAPI.DameEscenasActivasEscaperoom(this.juegoSeleccionado.id)
        .subscribe (res=>{
            
            console.log("lo estoy haciendo2");
            this.EscenasActivas=res;
            var cont=0;
            for(let b=0; b<this.EscenasActivas.length; b++){
                let esc: EscenaEscaperoom[]=[];
                esc= this.Escenas.filter(sc=> sc.id== this.EscenasActivas[b].escenaEscaperoomId);
                if (!(esc.length>0) ){                    
                    this.peticionesAPI.DameEscenasEscaperoom(this.EscenasActivas[b].escenaEscaperoomId)
                    .subscribe(res=>{
                        this.Escenas.push(res);
                    })
                }
                this.peticionesAPI.DameObjetosActivosEscaperoom(this.EscenasActivas[b].id)
                .subscribe(res=>{
                    for(let c=0; c<res.length; c++){
                        this.ObjetosActivos.push(res[c]);
                        let obj: ObjetoEscaperoom[]=[];
                        obj= this.Objetos.filter(obj=> obj.id== res[c].objetoEscaperoomId);
                        if (!(obj.length>0) ){                    
                            this.peticionesAPI.DameObjetosEscaperoom(res[c].objetoEscaperoomId)
                            .subscribe(res=>{
                                this.Objetos.push(res);
                            })
                        }
                        this.peticionesAPI.DamePreguntasActivasEscaperoom(res[c].id)
                        .subscribe(res=>{
                            this.PreguntasActivas.push(res);
                            let pr: Pregunta[]=[];
                            pr= this.Preguntas.filter(pr=> pr.id== res.preguntaId);
                            if (!(pr.length>0) ){                    
                                this.peticionesAPI.DamePreguntas(res.preguntaId)
                                .subscribe(res=>{
                                    this.Preguntas.push(res);
                                })
                            }
                        })
  
                    }
                    this.sesion.TomaObjetos(this.Objetos);
                })
                cont=b;
  
            }
            if(cont==this.EscenasActivas.length){
                
            this.loadEscenas();
            this.loadObjetos();
            this.loadPreguntas();
            this.sesion.TomaEscenas(this.Escenas);
            this.sesion.TomaObjetosActivos(this.ObjetosActivos);
            this.sesion.TomaPreguntas(this.Preguntas);
            this.sesion.TomaPreguntasActivas(this.PreguntasActivas);
            this.sesion.TomaObjetos(this.Objetos);
            this.sesion.TomaEscenasActivas(res);
            }
  
        })
        }*/
    }

  
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
  
  
          //this.load.image('1tiles', 'http://localhost:3000/api/imagenes/ImagenesEscenas/download/'+this.Escenas[0].Tilesheet)
          //this.load.tilemapTiledJSON('1map', 'http://localhost:3000/api/imagenes/ArchivosEscenas/download/'+this.Escenas[0].Archivo).on('filecomplete', function(){this.make.tilemap({key:'1map'});});;
  
          //var map=this.make.tilemap({key:'1map'});
          //var tilesheet=map.addTilesetImage('tilesetincial','1tiles');
        
          //var layer1 = map.createLayer('suelo',tilesheet);
          //var solid= map.createLayer('solid', tilesheet);
  
        //this.load.rexAwait
        
        
        //console.log(localStorage.getItem('1map').toString());
            //this.load.image('1tiles', localStorage.getItem('1tiles').toString());
            //this.load.tilemapTiledJSON('1map', localStorage.getItem('1map').toString());
  
    }
  
    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    create() {
        
        console.log('estoy en create');
        console.log(this.Escenas);
        this.maps.push(this.make.tilemap({key:'1map'}));
        this.tilesheets.push(this.maps[0].addTilesetImage('tilesetincial','1tiles'));
        
        this.layersActivas.push(this.maps[0].createLayer('suelo',this.tilesheets[0]));
        //t.setOrigin(0.5,0.5);
        this.layersActivas.push(this.maps[0].createLayer('solid', this.tilesheets[0]));
        //solid.setOrigin(0.5,0.5);   
  
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