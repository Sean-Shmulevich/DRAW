// === Supporting Interfaces === //
type UUID = string;

interface Point {
  x: number;
  y: number;
}

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Drawing {
  drawingId: UUID;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  saveLocally(): void;
  shareByEmail(recipient: string): void;
}

// === ToolMenu & EmailService === //
class ToolMenu {
  isVisible: boolean = false;
  selectedTool: string = "";

  // Example of interaction with user
  chooseTool(tool: string) {
    this.selectedTool = tool;
  }
}

class EmailService {
  sendDrawing(recipient: string): void {
    console.log(`Sending drawing to ${recipient}...`);
  }
}

// === User Class (Main) === //
class User {
  id: UUID;
  name: string;
  toolMenu: ToolMenu;
  emailService: EmailService;
  drawings: Drawing[] = [];

  constructor(id: UUID, name: string) {
    this.id = id;
    this.name = name;
    this.toolMenu = new ToolMenu();
    this.emailService = new EmailService();
  }

  // === User Actions === //

  draw(): void {
    console.log(`${this.name} is drawing...`);
  }

  chooseShape(): void {
    console.log(`${this.name} selected a shape.`);
  }

  selectColor(): void {
    console.log(`${this.name} selected a color.`);
  }

  adjustBrush(): void {
    console.log(`${this.name} adjusted the brush.`);
  }

  zoomInOut(): void {
    console.log(`${this.name} zoomed the view.`);
  }

  undo(): void {
    console.log(`${this.name} performed undo.`);
  }

  redo(): void {
    console.log(`${this.name} performed redo.`);
  }

  saveLocally(): void {
    console.log(`${this.name} saved drawing locally.`);
  }

  insertImage(): void {
    console.log(`${this.name} inserted an image.`);
  }

  shareByEmail(recipient: string): void {
    console.log(`${this.name} shared drawing via email.`);
    this.emailService.sendDrawing(recipient);
  }

  drawEffects(): void {
    console.log(`${this.name} applied visual effects.`);
  }

  takePicture(): void {
    console.log(`${this.name} took a picture.`);
  }
}
