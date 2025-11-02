const o=`// Author: TapiocaFox
// Title:  FoxGL Utils

export const getAudioBufferByAssetId = async (foxGL, audioCtx, id) => {
    return await audioCtx.decodeAudioData((await foxGL.getAssetArrayBufferById(id)));
};

export const playAudioBuffer = async (audioCtx, audioBuffer, offset = 0, loop = false) => {
    const src = audioCtx.createBufferSource();
    src.buffer = audioBuffer;
    src.loop = loop;
    src.connect(audioCtx.destination);
    src.start(audioCtx.currentTime + offset);
};`;export{o as u};
