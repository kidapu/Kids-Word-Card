/** 配列の順番をばらす。元の配列は変えない。 */
export const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
