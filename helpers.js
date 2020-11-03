import * as Playa from 'playa';
import * as Tone from 'tone';

export const toToneTicks = (ticks) => {
    const ppqMult = Playa.Ticks['4n'] / Tone.Transport.PPQ;
    return ticks === 0 ? 0 : `${ticks / ppqMult}i`;
}

export const toToneEvent = (event) => {
    return {
        ...event,
        chord: event.chord ? event.chord.map(m => new Playa.Note(m).n) : undefined,
        time: toToneTicks(event.time),
        note: event.note,
        dur: toToneTicks(event.dur),
    };
}
