import { createArp, Scale, Rhythm } from 'playa';
import * as Tone from 'tone';
import { toToneEvent } from './helpers';

const partProgress = document.getElementById('partProgress');
let partCreated = false;

async function ready() {
    const synth = await createSynth();
    const rhythm = Rhythm.free('1:0:0', ['4n', '8n']);
    const arp = createArp(new Scale('G4', Scale.Aeolian), [1, 6, 3, 5, 3, 2], rhythm);

    const part = new Tone.Part((time, value) => {
        if (value.isRest) return;

        Tone.Draw.schedule(() => {
            partProgress.value = part.progress;
        }, time);

        synth.triggerAttackRelease(value.note, value.dur, time, Math.random() * 0.5 + 0.5);
    }, arp.map(toToneEvent)).start(0);

    part.loop = true;
    part.loopEnd = '1:0:0';
    partCreated = true;
}

async function createSynth() {
    const synth = new Tone.PolySynth(Tone.DuoSynth);
    const volume = new Tone.Volume(-12).toDestination();
    const panner = new Tone.Panner(0);
    const reverb = new Tone.Reverb({
        decay: 4,
        wet: 0.4,
        preDelay: 0.15
    });

    await reverb.generate();

    const feedbackDelay = new Tone.FeedbackDelay("8n", 0.3)

    synth.set({
        voice0: {
            oscillator: {
                type: "triangle4"
            },
            volume: -10,
            envelope: {
                attack: 0.01,
                release: 0.1,
                sustain: 1
            }
        },
        voice1: {
            volume: -6,
            envelope: {
                attack: 0.005,
                release: 0.2,
                sustain: 1
            }
        }
    });

    synth.chain(panner, feedbackDelay, reverb, volume);

    return synth;
}

async function play() {
    await Tone.start();
    if(!partCreated) {
        await ready()
    }
    Tone.Transport.start('+0.01');
}

function stop() {
    Tone.Transport.stop();
}

document.getElementById('play').addEventListener('click', play);
document.getElementById('stop').addEventListener('click', stop);
