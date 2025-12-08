# 📐 Requirements Specification

## ✅ Functional Requirements (16)

**FR#1 — Draw Anything**  
Users can draw arbitrary lines and shapes anywhere on the canvas.

**FR#2 — Create Shapes**  
Users can create shapes via drag-and-drop, including fill or outline-only.

**FR#3 — Border**  
Users can set both border (stroke) color and fill color for shapes.

**FR#4 — Select Color**  
Users can select the color for either the shape tool or the pen tool.

**FR#5 — Broadcast Updates**  
The system must broadcast a user’s drawing updates to all connected users with **≤100ms latency**.

**FR#6 — Adjust Brush**  
Users can adjust brush size and opacity for pen strokes.

**FR#7 — Zoom**  
The system must allow zooming in and out for detailed editing.

**FR#8 — Sound Effect**  
The system can play playful sound effects during brush drawing.

**FR#9 — Centralize Tools**  
The system must include a menu that centralizes all tools in one UI location.

**FR#10 — Edit Action**  
Users can undo or redo actions.

**FR#11 — Save Drawing**  
Users can save their drawing locally.

**FR#12 — Insert Image**  
Users can insert images into their canvas.

**FR#13 — Share Drawing**  
Users can share their work via email.

**FR#14 — React**  
An interactive character reacts to the drawing in real time.

**FR#15 — Draw Effects**  
Users can draw effects using hand-tracking features.

**FR#16 — Take Pictures**  
Users can take a picture using a camera and add it to the canvas.

---

## 🔧 Non-Functional Requirements (6)

**NFR#1 — Import and Export (Performance)**  
Import/export operations must be fast with no interruptions during drawing.

**NFR#2 — Navigate Interface (Usability)**  
The interface must be simple, intuitive, and easy for all users to navigate.

**NFR#3 — Support Users (Scalability)**  
The system must support **at least 10 concurrent users** without performance degradation.

**NFR#4 — Protect User’s Work (Reliability)**  
The system must auto-save drawing progress to the browser every **30 seconds**.

**NFR#5 — Support All Devices (Compatibility)**  
The system must run on all major browsers and mobile devices.

**NFR#6 — Be Attractive for Users (Fun / Style)**  
The system should promote fun, creativity, and playful user interaction.

---

## ⚠️ Constraints (2)

**C#1 — Operating Systems (Supportability)**  
The website must support only operating systems released within the **last 7 years**.

**C#2 — Access Standards (Accessibility)**  
The system must meet **WCAG 2.1 web accessibility standards**.

# 📋 Project TODO / Progress

## ✅ Completed Tasks (After Sprint #3)

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
- Shape menu preview.
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

// Shape Types
export type ShapeType = "rectangle" | "circle" | "triangle" | "square" | "";

export interface Shape {
    type: ShapeType;
    strokeSize: number;
    strokeColor: [number, number, number];
    fillColor: [number, number, number];
    start: Point;
    end: Point;
}

// Stroke Types

type strokeTypes = "pencil" | "brush" | "marker";

export interface Stroke {
    strokeType: strokeTypes;
    penSize: number;
    color: [number, number, number];
    points: Point[];
}
```

---

# Recent Updates

## New Features Implemented

- **Take Picture** — Screenshot functionality to capture canvas content and save as PNG to local downloads  
  - Added `html2canvas` dependency to `package.json`  
  - Implemented `addPicture()` function in `ToolMenu.svelte`  
    - Uses `html2canvas` to capture `.canvas-container` DOM element  
    - Converts canvas to blob and triggers automatic download  
    - File naming: `draw-screenshot-{timestamp}.png`  
  - Added "Take Picture" button in `MiscPanel.svelte`  
  ```ts
  // ToolMenu.svelte - Key implementation
  const canvas = await html2canvas(canvasContainer);
  canvas.toBlob((blob) => {
    link.download = `draw-screenshot-${Date.now()}.png`;
    link.click();
  }, 'image/png');
  ```  

- **Import Image** — Import images from local files and add them to the canvas  
  - Implemented `importImage()` function in `ToolMenu.svelte`  
    - Creates hidden file input element dynamically  
    - Accepts all image formats via `accept="image/*"`  
    - Dispatches `canvas:addPicture` event with file blob  
  - Modified `canvas:addPicture` event listener in `CanvasState.ts`  
    - Draws images to permanent layer using `getPermanentLayer()`  
    - Ensures images persist across canvas redraws  
  - Added "Import Image" button in `MiscPanel.svelte`  
  ```ts
  // ToolMenu.svelte
  fileInput.onchange = (e) => {
    if (file) dispatchAddPicture(file);
  };
  
  // CanvasState.ts - Draw to permanent layer
  p.loadImage(url, (img) => {
    permanent.image(img, 0, 0);  // Persists across redraws
  });
  ```  

- **Random Pattern** — Generate random spiral patterns on the canvas  
  - Modified `canvas:sketch.pattern` event listener in `CanvasState.ts`  
    - Generates random step, zoom, and startColour values  
    - Draws pattern directly to permanent layer  
  - Updated `createPattern()` function in `PatternCreator.ts`  
    - Uses HSB color mode for smooth color transitions  
    - Resets to RGB color mode after drawing  
    - Removed background clearing to allow pattern overlay  
  ```ts
  // PatternCreator.ts - Core loop
  p.colorMode(p.HSB, 360, 100, 100);
  for (let i = 0; i < 360; i++) {
    p.stroke(colour % 360, 100, 50);
    p.line(oldX, oldY, newX, newY);
    rotationAngle += step;
    length -= magnify;
    colour += 1;
  }
  p.colorMode(p.RGB, 255);
  ```  

- **Clear Function** — Fixed to properly clear permanent layer, history, and all state arrays  
  - Added `clearAll()` function in `SyncSubsystem.ts`  
    - Clears permanent layer background  
    - Clears history, strokes, and shapes arrays  
  - Modified `canvas:clear` event listener in `CanvasState.ts`  
    - Calls `clearAll()` instead of directly clearing canvas  
    - Also clears local strokes array and currentStroke  
  ```ts
  // SyncSubsystem.ts
  export function clearAll() {
    permanentLayer.background(255);
    history.length = 0;
    strokes.length = 0;
    shapes.length = 0;
  }
  ```  

- **Persistent History** — Auto-save drawings to `localStorage` and restores on refresh  
  - Added `persistHistory()` and `restoreFromStorage()` in `SyncSubsystem.ts`  
    - Serializes `history` and redraws strokes/shapes into the permanent layer when reloaded  
  - Made history writes in `CanvasSubsystem.ts` persist after each stroke/shape and restore during setup  

## Code Improvements

- **Fixed image import persistence**  
  - Modified `canvas:addPicture` event listener in `CanvasState.ts`  
    - Changed from drawing to main canvas `p` to permanent layer  
    - Uses `getPermanentLayer()` to access permanent graphics layer  
    - Images now persist after canvas redraws  

- **Fixed shape fill color disappearing after undo**  
  - Added RGB color mode enforcement in `drawShape()` function in `Shape.ts`  
    - Sets `p.colorMode(p.RGB, 255)` before drawing  
  - Added RGB color mode enforcement in `drawStroke()` function in `CanvasState.ts`  
    - Ensures correct color mode for stroke rendering  
  - Prevents color mode conflicts from pattern generator's HSB mode  
  ```ts
  // Shape.ts & CanvasState.ts
  p.colorMode(p.RGB, 255);  // Reset before drawing
  ```  

- **Removed Redo functionality**  
  - Removed `redo()` function from `Dispatch.ts`  
  - Removed `canvas:redo` event listener from `syncListeners()` in `SyncSubsystem.ts`  
  - Removed Redo button and prop from `MiscPanel.svelte`  
  - Removed Redo import and usage from `ToolMenu.svelte`
