import {MemeToGenerate} from "@memer/api-interfaces";

export class CreateMemeDto implements MemeToGenerate {
  top?: string;
  bottom?: string;
  meme: string;
}
