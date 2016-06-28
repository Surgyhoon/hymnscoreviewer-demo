import { MusicSheet, IXmlElement, VexFlowMusicSheetCalculator, GraphicalMusicSheet, VexFlowMusicSheetDrawer } from "../MusicSheetCalculator";

export class MusicSheet {
    constructor() {
        return;
    }

    private canvas: HTMLCanvasElement;
    private sheet: MusicSheet;

    public load(sheet: Element): void {
      let score: IXmlElement = new IXmlElement(sheet);
      let calc: VexFlowMusicSheetCalculator = new VexFlowMusicSheetCalculator();
      let reader: MusicSheetReader = new MusicSheetReader();
      this.sheet = reader.createMusicSheet(score, path);
    }

    public display(canvas: HTMLCanvasElement): void {
      this.canvas = canvas;
      let gms: GraphicalMusicSheet = new GraphicalMusicSheet(sheet, calc);
      // FIXME: draw on canvas!
      (new VexFlowMusicSheetDrawer()).drawSheet(gms);
    }

    public free(): void {
      this.canvas = undefined;
      this.sheet = undefined;
      return;
    }
}
