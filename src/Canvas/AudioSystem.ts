// AudioSystem.ts
/*
 * AI ASSISTANCE DISCLOSURE
 * Tool: Claude AI 
 * Purpose: Generate Web Audio API boilerplate and handle browser autoplay policies
 * Learned: AudioContext suspend/resume states, GainNode for volume fading,
 *          BiquadFilter for smoother oscillator sounds, proper cleanup of audio nodes
 * Verified: Tested draw/click sounds work correctly, no audio popping,
 *           cross-checked with MDN Web Audio API docs, tested multiple browsers
 * Modified: Changed from noise to musical tones for each drawing tool
 */

class AudioSystem {
    private audioContext: AudioContext | null = null;
    private isPlaying: boolean = false;
    private gainNode: GainNode | null = null;
    private currentToolType: string = "";
    private musicInterval: any = null;
    private currentNoteIndex: number = 0;

    // Different melodies for different tools
    private melodies: { [key: string]: number[] } = {
        pencil: [523, 587, 659, 698, 784, 698, 659, 587], // C-D-E-F-G-F-E-D (major scale)
        brush: [440, 494, 523, 587, 659, 587, 523, 494], // A-B-C-D-E-D-C-B (softer)
        marker: [659, 698, 784, 880, 988, 880, 784, 698], // E-F-G-A-B-A-G-F (higher)
        eraser: [392, 349, 330, 294, 262, 294, 330, 349], // G-F-E-D-C-D-E-F (descending)
    };

    constructor() {
        this.initAudio();
    }

    private initAudio() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.15; // Volume for music
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    // Start a continuous drawing sound
    startDrawSound(toolType: string = "pencil") {
        if (!this.audioContext || !this.gainNode || this.isPlaying) return;

        this.currentToolType = toolType;

        try {
            // Resume context if suspended (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Play music for the current tool
            this.startMusic(toolType);
        } catch (e) {
            console.warn("Could not start draw sound", e);
        }
    }

    private startMusic(toolType: string) {
        if (!this.audioContext || !this.gainNode) return;

        this.isPlaying = true;
        this.currentNoteIndex = 0;

        // Get the melody for this tool, default to pencil if not found
        const melody = this.melodies[toolType] || this.melodies.pencil;

        // Play a note every 200ms
        this.musicInterval = setInterval(() => {
            this.playMusicNote(melody);
            this.currentNoteIndex = (this.currentNoteIndex + 1) % melody.length;
        }, 200);

        // Play first note immediately
        this.playMusicNote(melody);
    }

    private playMusicNote(melody: number[]) {
        if (!this.audioContext || !this.gainNode) return;

        try {
            const osc = this.audioContext.createOscillator();
            const noteGain = this.audioContext.createGain();
            
            osc.type = 'sine'; // Pure, clean sine wave
            osc.frequency.value = melody[this.currentNoteIndex];
            
            // Smooth envelope for beautiful sound
            noteGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            osc.connect(noteGain);
            noteGain.connect(this.gainNode);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {
            console.warn("Could not play music note", e);
        }
    }

    // Stop the drawing sound
    stopDrawSound() {
        if (!this.audioContext || !this.gainNode || !this.isPlaying) return;

        try {
            // Stop music interval
            if (this.musicInterval) {
                clearInterval(this.musicInterval);
                this.musicInterval = null;
            }
            
            this.isPlaying = false;
            this.currentToolType = "";
        } catch (e) {
            console.warn("Could not stop draw sound", e);
        }
    }

    // Play a short click sound for shapes/actions
    playClickSound() {
        if (!this.audioContext || !this.gainNode) return;

        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const osc = this.audioContext.createOscillator();
            const clickGain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = 800; // Higher, clearer click
            
            clickGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            clickGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            osc.connect(clickGain);
            clickGain.connect(this.gainNode);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.warn("Could not play click sound", e);
        }
    }
}

// Export singleton instance
export const audioSystem = new AudioSystem();