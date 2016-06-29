import { MusicSheet, IXmlElement, VexFlowMusicSheetCalculator, GraphicalMusicSheet, VexFlowMusicSheetDrawer } from "../MusicSheetCalculator";

export class MusicSheet {
    constructor() {
      this.drawer = new VexFlowMusicSheetDrawer(canvas);
    }

    private canvas: HTMLCanvasElement;
    private sheet: MusicSheet;
    private drawer: MusicSheetDrawer;

    public load(sheet: Element): void {
      let score: IXmlElement = new IXmlElement(sheet);
      let calc: VexFlowMusicSheetCalculator = new VexFlowMusicSheetCalculator();
      let reader: MusicSheetReader = new MusicSheetReader();
      this.sheet = reader.createMusicSheet(score, path);
    }

    public display(canvas: HTMLCanvasElement): void {
      this.canvas = canvas;
      let gms: GraphicalMusicSheet = new GraphicalMusicSheet(sheet, calc);
      this.drawer.drawSheet(gms);
    }

    public free(): void {
      this.canvas = undefined;
      this.sheet = undefined;
      return;
    }
}
