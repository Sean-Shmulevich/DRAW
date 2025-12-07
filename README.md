# 📋 Project TODO / Progress

## ✅ Completed Tasks

- Stroke slider works  
- Color picker works  
- Start Sync System + Undo  
  - Pool for points along line while drawing  
  - Store points for each line  
  - Redraw lines  
  - Store shape type and start + end points  
  - Redraw shapes  
- Brush menu with three different brush types  
- Menu section for cool p5.js sketches (e.g., pattern creator)  
- Shape creator tool (with fill + stroke customization)  
- Add picture  
- Export (email or local)  
- Custom event dispatching (ToolMenu → CanvasSubsystem)  
- Clean/move alternate drawings into their own folder
- Use a preview + permanent graphics layer for unconfirmed drawings  
  - Needed to clear canvas while drawing shapes without removing existing strokes (shadowing)
---

## ⏳ In-Progress / Remaining Tasks

### Refactor
- Split responsibility of Stroke out of CanvasState and use CanvasState.ts for orchestrating state passing to different drawing functions.
### 🔄 Sync & Persistent State
- Save `history` in `SyncSystem.ts` to localStorage  
- Load persisted drawing state on refresh  

### 🖌️ UI Interactions / Tooling
- UI shape fill  
- UI shape stroke size  
  - Currently tied to line stroke size  
  - Event exists but not wired fully  
- UI stroke / outline color  
  - Event exists and is being received  
  - State not updating correctly in `shape.ts`  
- Implement eraser  
  - Likely use a pen tool with background-color strokes  

### ✉️ Email & Exporting
- Draft email using the native OS email client  
  - Attach canvas image blob  

### ✋ Interaction Experiments
- Hand actions (handtrack.js)

---

# 🧩 Canvas Custom Events

Custom DOM events used for communication between the **Svelte UI** and the **p5.js canvas subsystem**.

---

## 🎨 Brush / Pen Events

- `canvas:pen.setSize`  
- `canvas:pen.setColor`  
- `canvas:setTool`  
- `canvas:pen.setBrushType`  

---

## 🟦 Shape Events

- `canvas:shape.setStrokeSize`  
- `canvas:shape.setFillColor`  
- `canvas:shape.setStrokeColor`  

---

## 🖼️ Canvas Operations

- `canvas:undo`  
- `canvas:redo`  
- `canvas:clear`  
- `canvas:sketch.pattern`  

---

## 📷 Add Picture

- `canvas:addPicture`  

---

## 💾 Save

- `canvas:save`  

---

# 🛠️ Type Definitions

### Tool Types
```ts
export type ToolType = "stroke" | "shape";

### Shape Types
```ts
export type ShapeType = "rectangle" | "circle" | "triangle" | "square" | "";

```ts
export interface Shape {
    type: ShapeType;
    strokeSize: number;
    strokeColor: [number, number, number];
    fillColor: [number, number, number];
    start: Point;
    end: Point;
}

### Stroke Types

```ts
type strokeTypes = "pencil" | "brush" | "marker";

```ts
export interface Stroke {
    strokeType: strokeTypes;
    penSize: number;
    color: [number, number, number];
    points: Point[];
}
