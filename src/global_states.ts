import { writable } from "svelte/store";

export const p5Canvas = writable<HTMLCanvasElement | null>(null);
