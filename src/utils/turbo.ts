interface TurboColorStop {
  ratio: number;
  color: [number, number, number];
}

export const turboColorMap: TurboColorStop[] = [
  { ratio: 0.0, color: [48, 18, 59] },
  { ratio: 0.1, color: [24, 82, 177] },
  { ratio: 0.2, color: [0, 135, 204] },
  { ratio: 0.3, color: [74, 183, 118] },
  { ratio: 0.4, color: [171, 218, 60] },
  { ratio: 0.5, color: [243, 236, 34] },
  { ratio: 0.6, color: [249, 178, 8] },
  { ratio: 0.7, color: [241, 89, 41] },
  { ratio: 0.8, color: [180, 4, 38] },
  { ratio: 0.9, color: [75, 0, 36] },
  { ratio: 1.0, color: [0, 0, 0] },
];

export const grayColorMap: TurboColorStop[] = [
  { ratio: 0.0, color: [255, 255, 255] },
  { ratio: 0.5, color: [128, 128, 128] },
  { ratio: 1.0, color: [0, 0, 0] },
];

export const interpolateColors = (
  ratio: number,
  colorMode: string
): [number, number, number] => {
  let sortedColorStops: TurboColorStop[] = [];
  if (colorMode === "gray") {
    sortedColorStops = grayColorMap.sort((a, b) => a.ratio - b.ratio);
  } else if (colorMode === "turbo") {
    sortedColorStops = turboColorMap.sort((a, b) => a.ratio - b.ratio);
  }

  let lowerStop = sortedColorStops[0];
  let upperStop = sortedColorStops[sortedColorStops.length - 1];

  for (let i = 0; i < sortedColorStops.length - 1; i++) {
    if (
      ratio >= sortedColorStops[i].ratio &&
      ratio <= sortedColorStops[i + 1].ratio
    ) {
      lowerStop = sortedColorStops[i];
      upperStop = sortedColorStops[i + 1];
      break;
    }
  }

  const lowerRatio = lowerStop.ratio;
  const upperRatio = upperStop.ratio;

  const normalizedRatio = (ratio - lowerRatio) / (upperRatio - lowerRatio);

  const lowerColor = lowerStop.color;
  const upperColor = upperStop.color;

  const r = Math.round(
    lowerColor[0] + normalizedRatio * (upperColor[0] - lowerColor[0])
  );
  const g = Math.round(
    lowerColor[1] + normalizedRatio * (upperColor[1] - lowerColor[1])
  );
  const b = Math.round(
    lowerColor[2] + normalizedRatio * (upperColor[2] - lowerColor[2])
  );

  return [r, g, b];
};
