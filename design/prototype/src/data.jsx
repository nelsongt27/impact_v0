// Synthetic data based on briefing distributions
// (Real numbers preserved: 593 surveys, 7266 responses, 30+ clients, etc.)

const yearlyData = [
  { year: 2010, surveys: 4, responses: 38 },
  { year: 2011, surveys: 6, responses: 52 },
  { year: 2012, surveys: 9, responses: 87 },
  { year: 2013, surveys: 12, responses: 110 },
  { year: 2014, surveys: 18, responses: 168 },
  { year: 2015, surveys: 22, responses: 215 },
  { year: 2016, surveys: 28, responses: 278 },
  { year: 2017, surveys: 35, responses: 384 },
  { year: 2018, surveys: 42, responses: 472 },
  { year: 2019, surveys: 51, responses: 612 },
  { year: 2020, surveys: 38, responses: 458 },
  { year: 2021, surveys: 64, responses: 798 },
  { year: 2022, surveys: 130, responses: 1612, peak: true, label: '130 surveys · peak year' },
  { year: 2023, surveys: 91, responses: 1108 },
  { year: 2024, surveys: 78, responses: 942 },
  { year: 2025, surveys: 117, responses: 1421, peak: true, label: '117 surveys · second peak' },
  { year: 2026, surveys: 38, responses: 511 },
];

const annotations = {
  2020: 'COVID inflection',
  2022: '2022 peak',
  2025: '2025 peak',
};

const topClients = [
  { name: 'P&G',          surveys: 118, responses: 1532, since: 2012 },
  { name: 'GALP',         surveys: 26,  responses: 312,  since: 2016 },
  { name: 'CISCO',        surveys: 19,  responses: 234,  since: 2018 },
  { name: 'ALPEK',        surveys: 18,  responses: 208,  since: 2019 },
  { name: 'SIGMA',        surveys: 16,  responses: 192,  since: 2019 },
  { name: 'CREDICORP',    surveys: 15,  responses: 178,  since: 2020 },
  { name: 'POLPAICO BSA', surveys: 12,  responses: 142,  since: 2021 },
  { name: 'AFNS',         surveys: 12,  responses: 138,  since: 2021 },
  { name: 'MELI',         surveys: 11,  responses: 134,  since: 2017 },
  { name: 'CIRION',       surveys: 10,  responses: 118,  since: 2022 },
  { name: 'TELUS',        surveys: 9,   responses: 104,  since: 2022 },
  { name: 'TIKTOK',       surveys: 8,   responses: 96,   since: 2023 },
  { name: 'SCENIC GROUP', surveys: 7,   responses: 82,   since: 2023 },
  { name: 'INGRAM',       surveys: 6,   responses: 71,   since: 2023 },
  { name: 'DANONE',       surveys: 6,   responses: 68,   since: 2024 },
];

const surveyTypes = [
  { type: 'feedback',         count: 204, pct: 34.4 },
  { type: 'self_assessment',  count: 50,  pct: 8.4  },
  { type: 'assessment',       count: 33,  pct: 5.6  },
  { type: 'team_performance', count: 32,  pct: 5.4  },
  { type: 'diagnostic',       count: 17,  pct: 2.9  },
  { type: 'research',         count: 13,  pct: 2.2  },
  { type: 'other',            count: 244, pct: 41.1 },
];

const phases = [
  { phase: 'post', count: 205 },
  { phase: 'mid',  count: 24  },
  { phase: 'pre',  count: 23  },
  { phase: 'none', count: 341 },
];

const languages = [
  { lang: 'EN', count: 501, pct: 84.5 },
  { lang: 'ES', count: 69,  pct: 11.6 },
  { lang: 'PT', count: 23,  pct: 3.9  },
];

const confidence = [
  { level: 'high',   pct: 41 },
  { level: 'medium', pct: 39 },
  { level: 'low',    pct: 18 },
];

const totals = {
  responses: 7266,
  surveys: 593,
  clients: 30,
  years: 15,
  unknownClient: 219,
};

window.AxData = { yearlyData, annotations, topClients, surveyTypes, phases, languages, confidence, totals };
