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
