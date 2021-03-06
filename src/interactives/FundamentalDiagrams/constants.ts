export const total = 140;
export const vf = (80 * 1000) / 3600; /* 60 kph to m/s */
export const GR = (1 + Math.sqrt(5)) / 2;
export const carLength = 2.5;
export const carWidth = carLength / 2.5;
export const roadWidth = carWidth * GR*2.5;
export const sj = carLength*GR;
export const kj = 1 / sj;
export const k0 = kj / 3;
export const q0 = vf * k0;
export const w = q0 / (kj - k0);
export const delta = 0.5;
export const numLanes = 21;
