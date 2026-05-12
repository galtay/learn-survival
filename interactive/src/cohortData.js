export const sharedCohort = [
  { id: 1,  T: 4,  C: 40 },
  { id: 2,  T: 35, C: 7  },
  { id: 3,  T: 9,  C: 40 },
  { id: 4,  T: 12, C: 40 },
  { id: 5,  T: 28, C: 13 },
  { id: 6,  T: 18, C: 40 },
  { id: 7,  T: 32, C: 19 },
  { id: 8,  T: 21, C: 40 },
  { id: 9,  T: 22, C: 40 },
  { id: 10, T: 30, C: 24 },
];

export const getObservedCohort = () => {
  return sharedCohort.map(p => ({
    id: p.id,
    y: Math.min(p.T, p.C),
    d: p.T <= p.C ? 1 : 0
  })).sort((a, b) => a.y - b.y);
};
