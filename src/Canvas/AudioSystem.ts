// AudioSystem.ts
/*
 * AI ASSISTANCE DISCLOSURE
 * Tool: Claude AI 
 * Purpose: Generate Web Audio API boilerplate and handle browser autoplay policies
 * Learned: AudioContext suspend/resume states, GainNode for volume fading,
 *          BiquadFilter for smoother oscillator sounds, proper cleanup of audio nodes
 * Verified: Tested draw/click sounds work correctly, no audio popping,
 *           cross-checked with MDN Web Audio API docs, tested multiple browsers
 * Modified: Removed unnecessary functions to keep only essential audio features
 */

class AudioSystem {
    private audioContext: AudioContext | null = null;
    private isPlaying: boolean = false;
    private gainNode: GainNode | null = null;
    private oscillator: OscillatorNode | null = null;

    constructor() {
        // Initialize on first user interaction to comply with browser policies
        this.initAudio();
    }

    private initAudio() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.1; // Low volume for subtle effect
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    // Start a continuous drawing sound
    startDrawSound() {
        if (!this.audioContext || !this.gainNode || this.isPlaying) return;

        try {
            // Resume context if suspended (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            this.oscillator = this.audioContext.createOscillator();
            this.oscillator.type = 'sine';
            this.oscillator.frequency.value = 200; // Soft pencil-like frequency
            
            // Create a filter for smoother sound
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            
            this.oscillator.connect(filter);
            filter.connect(this.gainNode);
            
            // Fade in
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.05);
            
            this.oscillator.start();
            this.isPlaying = true;
        } catch (e) {
            console.warn("Could not start draw sound", e);
        }
    }

    // Stop the drawing sound
    stopDrawSound() {
        if (!this.audioContext || !this.oscillator || !this.gainNode || !this.isPlaying) return;

        try {
            // Fade out
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);
            
            this.oscillator.stop(this.audioContext.currentTime + 0.05);
            this.isPlaying = false;
            this.oscillator = null;
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
            osc.frequency.value = 400;
            
            clickGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
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