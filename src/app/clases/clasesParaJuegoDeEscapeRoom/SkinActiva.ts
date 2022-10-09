export class SkinActiva {

    id: number;
    skinId: number;
    alumnoId: number;
  
    constructor(alumnoId?: number, skinId?: number) {
  
      this.alumnoId = alumnoId;
      this.skinId = skinId;
  
    }
  }