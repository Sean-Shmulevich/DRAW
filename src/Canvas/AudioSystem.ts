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

            // Create white noise for realistic marker scratch sound
            const bufferSize = this.audioContext.sampleRate * 2;
            const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            
            // Fill with random values for white noise
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const whiteNoise = this.audioContext.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            
            // Filter to make it sound like paper friction
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 3000; // Mid-high frequencies for scratch sound
            filter.Q.value = 0.5; // Not too narrow
            
            whiteNoise.connect(filter);
            filter.connect(this.gainNode);
            
            // Fade in
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.05);
            
            whiteNoise.start();
            this.isPlaying = true;
            
            // Store reference to stop it later
            (this as any).noiseSource = whiteNoise;
        } catch (e) {
            console.warn("Could not start draw sound", e);
        }
    }
  // Stop the drawing sound
    stopDrawSound() {
        if (!this.audioContext || !this.gainNode || !this.isPlaying) return;

        try {
            // Fade out
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);
            
            const noiseSource = (this as any).noiseSource;
            if (noiseSource) {
                noiseSource.stop(this.audioContext.currentTime + 0.05);
                (this as any).noiseSource = null;
            }
            
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