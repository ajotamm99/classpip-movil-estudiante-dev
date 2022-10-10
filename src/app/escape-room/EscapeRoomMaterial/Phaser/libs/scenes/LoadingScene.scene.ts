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
import { ModuleWithProviders, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';

import { ScrollManager } from '../utilities/scroll-manager';
import { Pregunta } from 'src/app/clases/Pregunta';
import { Alumno } from 'src/app/clases';

export class LoadingScene extends Phaser.Scene {
    private backgroundKey = 'background-image'; // * Store the background image name
    private backgroundImageAsset = '/assets/prueba.jpeg'; // * Asset url relative to the app itself
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    private scrollManager: ScrollManager; // * Custom openforge utility for handling scroll
    

    constructor(private peticionesAPI: PeticionesAPIService,
        private sesion: SesionService) {
        super({ key: 'preloader' })
        
    }

    base;
    inscripcionAlumnoJuegoDeEscaperoom: AlumnoJuegoDeEscaperoom
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

    getData(){
        
        console.log("lo estoy haciendo 1");
        this.juegoSeleccionado = this.sesion.DameJuego();
        this.alumno = this.sesion.DameAlumno();
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
        }
    }

    loadEscenas(){
        
        this.load.setBaseURL('http://localhost:3000/api/imagenes');
        for (let i=0;i<this.EscenasActivas.length; i++){
            var key=(this.EscenasActivas[i].orden).toString();
            var image=this.Escenas.find(sc=>sc.id==this.EscenasActivas[i].escenaEscaperoomId).Tilesheet;
            var archive = this.Escenas.find(sc=>sc.id==this.EscenasActivas[i].escenaEscaperoomId).Archivo;
            this.load.image(key+'tiles', '/ImagenesEscenas/download/'+image);
            this.load.tilemapTiledJSON(key+'map', '/ArchivosEscenas/download/escena.json'+archive);
        }
    }

    loadObjetos(){
        
        this.load.setBaseURL('http://localhost:3000/api/imagenes');
        for (let b=0;b<this.ObjetosActivos.length; b++){
            var image= this.Objetos.find(obj=>obj.id == this.ObjetosActivos[b].objetoEscaperoomId).Imagen;
            this.load.image(this.ObjetosActivos[b].id+'obj','/ImagenesObjetos/download/'+image);
        }

    }

    loadPreguntas(){        
        this.load.setBaseURL('http://localhost:3000/api/imagenes');

    }

    loadSkins(){        
        this.load.setBaseURL('http://localhost:3000/api/imagenes');
    }


    async preload(): Promise<void> {
        this.getData();
    }

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {

        var map=this.make.tilemap({key:'1map'});
        var tilesheet=map.addTilesetImage('tilesetincial','1tiles');
        
        var layer1 = map.createLayer('suelo',tilesheet);
        var solid= map.createLayer('solid', tilesheet);

    }

    /**
     * * When the screen is resized, we
     *
     * @param gameSize
     */
    resize(gameSize: Phaser.Structs.Size): void {
        console.log('Resizing', gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}