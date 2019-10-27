import * as colors from "@material-ui/core/colors";
export const total = 550;
export const blockX = total - 80;

export const vf1 = (100 * 1000) / 3600; /* 60 mph to m/s */
export const qc1 = 4500 / 3600;
export const kj1 = 110 / 1000;
export const sj1 = 1 / kj1;
export const kc1 = qc1 / vf1;
export const w1 = qc1 / (kj1 - kc1);

export const vf2 = (60 * 1000) / 3600;
export const kc2 = kc1 * 0.6;
export const kj2 = kj1;
export const sj2 = 1 / kj2;
export const qc2 = kc2 * vf2;
export const w2 = qc2 / (kj2 - kc2);

export const carLength = 5;
export const carHeight = 2;
export const roadWidth = 10;
export const delta = 0.15;

export const duration = 105;
export const blockDuration = 35;
export const blockStart = 15 - delta;
export const blockTimes = [blockStart, blockStart + blockDuration];

export const Q = qc1 * 0.68;

export const aDetector = 30;
export const dDetector = total - 50;
export const speed = 6;

export const aColor = colors.deepOrange["A400"];
export const dColor = colors.indigo["A400"];
