
export enum TabType {
  ABOUT = 'ABOUT',
  STUDIO_PRO = 'STUDIO_PRO',
  VIRTUAL_SHOOT = 'VIRTUAL_SHOOT',
  IMAGE_BLENDER = 'IMAGE_BLENDER',
  SHIFTER_3D = 'SHIFTER_3D',
  IMAGINE = 'IMAGINE',
  MOCKUP_STUDIO = 'MOCKUP_STUDIO',
  VISUAL_IDENTITY = 'VISUAL_IDENTITY'
}

export interface ControlState {
  visualWizard: boolean;
  referenceUsage: string;
  lightingStyle: string;
  cameraPerspective: string;
  shotType: string;
  lightingShadowStyle: string;
  timeOfDay: string;
  weather: string;
  season: string;
  quality: string;
  cameraKit: string;
  productDetailer: string;
  creativeFX: string;
  portraitEnhance: string;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  role?: string;
}
