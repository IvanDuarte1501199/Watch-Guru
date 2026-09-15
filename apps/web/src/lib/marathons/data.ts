import type { Locale } from '../i18n/config';
import type { MediaKind } from '../tmdb/types';

/* Hand-curated franchise marathons. Entries are listed in in-universe (chronological)
   order; release order comes from TMDB dates. TMDB ids were checked against the API. */

export type Localized = Record<Locale, string>;

export interface MarathonGroup {
  id: string;
  label: Localized;
}

export interface MarathonEntry {
  kind: MediaKind;
  id: number;
  era?: string;
  arcs: string[];
  /** Part of the short version: what you need to follow the main story. */
  essential: boolean;
  /** When it happens in-universe, e.g. "19 ABY" or "1926". */
  when?: Localized;
}

export interface Marathon {
  slug: string;
  name: Localized;
  tagline: Localized;
  /** Crawlable intro for the marathon page. */
  intro: Localized;
  /** Caveats about the order, shown above the list. */
  note?: Localized;
  /** Brand-ish color used for accents on cards. */
  accent: string;
  /** Entry key (`movie:123`) whose backdrop represents the marathon. */
  cover: string;
  /** Entry keys whose posters show on cards. */
  posters: [string, string, string];
  eraLabel: Localized;
  eras: MarathonGroup[];
  arcs: MarathonGroup[];
  entries: MarathonEntry[];
}

const L = (es: string, en: string): Localized => ({ es, en });
const group = (id: string, es: string, en = es): MarathonGroup => ({ id, label: L(es, en) });

function entry(kind: MediaKind) {
  return (id: number, era: string | undefined, arcs = '', essential = false, when?: Localized): MarathonEntry => ({
    kind,
    id,
    era,
    arcs: arcs ? arcs.split(' ') : [],
    essential,
    when,
  });
}
const movie = entry('movie');
const tv = entry('tv');

/** Star Wars dating: before/after the Battle of Yavin (ABY/DBY in Spanish, BBY/ABY in English). */
const bby = (years: string) => L(`${years} ABY`, `${years} BBY`);
const aby = (years: string) => L(`${years} DBY`, `${years} ABY`);
const year = (value: string) => L(value, value);

export const entryKey = (item: { kind: MediaKind; id: number }) => `${item.kind}:${item.id}`;

export const marathons: Marathon[] = [
  {
    slug: 'marvel',
    name: L('Marvel (MCU)', 'Marvel (MCU)'),
    tagline: L('Del Capitán América de 1943 al multiverso', 'From 1943 Captain America to the multiverse'),
    intro: L(
      'Todas las películas y series de Marvel Studios en orden cronológico o de estreno: la Saga del Infinito, la Saga del Multiverso y lo que viene. Filtrá por fase o por personaje (Avengers, Spider-Man, Guardianes de la Galaxia…) y seguí tu progreso.',
      'Every Marvel Studios movie and series in chronological or release order: the Infinity Saga, the Multiverse Saga and what comes next. Filter by phase or by character (Avengers, Spider-Man, Guardians of the Galaxy…) and track your progress.',
    ),
    note: L(
      'El orden cronológico sigue la línea de tiempo oficial de Disney+. Loki y ¿Qué pasaría si…? transcurren fuera del tiempo, y Los 4 Fantásticos ocurre en otro universo.',
      "Chronological order follows Disney+'s official timeline. Loki and What If...? happen outside time, and The Fantastic Four takes place in another universe.",
    ),
    accent: '#e23636',
    cover: 'movie:299534',
    posters: ['movie:24428', 'movie:299534', 'movie:634649'],
    eraLabel: L('Fase', 'Phase'),
    eras: [
      group('phase-1', 'Fase 1', 'Phase 1'),
      group('phase-2', 'Fase 2', 'Phase 2'),
      group('phase-3', 'Fase 3', 'Phase 3'),
      group('phase-4', 'Fase 4', 'Phase 4'),
      group('phase-5', 'Fase 5', 'Phase 5'),
      group('phase-6', 'Fase 6', 'Phase 6'),
    ],
    arcs: [
      group('avengers', 'Avengers'),
      group('iron-man', 'Iron Man'),
      group('captain-america', 'Capitán América', 'Captain America'),
      group('thor', 'Thor'),
      group('spider-man', 'Spider-Man'),
      group('guardians', 'Guardianes de la Galaxia', 'Guardians of the Galaxy'),
      group('ant-man', 'Ant-Man'),
      group('doctor-strange', 'Doctor Strange'),
      group('black-panther', 'Black Panther'),
      group('captain-marvel', 'Capitana Marvel', 'Captain Marvel'),
      group('hulk', 'Hulk'),
      group('multiverse', 'Multiverso', 'Multiverse'),
      group('street-level', 'Héroes de barrio', 'Street level'),
    ],
    entries: [
      movie(1771, 'phase-1', 'captain-america avengers', true),
      movie(299537, 'phase-3', 'captain-marvel', true),
      movie(1726, 'phase-1', 'iron-man avengers', true),
      movie(10138, 'phase-1', 'iron-man'),
      movie(1724, 'phase-1', 'hulk'),
      movie(10195, 'phase-1', 'thor'),
      movie(24428, 'phase-1', 'avengers iron-man captain-america thor hulk', true),
      movie(76338, 'phase-2', 'thor'),
      movie(68721, 'phase-2', 'iron-man'),
      movie(100402, 'phase-2', 'captain-america', true),
      movie(118340, 'phase-2', 'guardians', true),
      movie(283995, 'phase-3', 'guardians'),
      movie(99861, 'phase-2', 'avengers iron-man captain-america thor hulk', true),
      movie(102899, 'phase-2', 'ant-man'),
      movie(271110, 'phase-3', 'captain-america iron-man avengers spider-man black-panther ant-man', true),
      movie(497698, 'phase-4', 'avengers'),
      movie(284054, 'phase-3', 'black-panther', true),
      movie(315635, 'phase-3', 'spider-man iron-man'),
      movie(284052, 'phase-3', 'doctor-strange'),
      movie(284053, 'phase-3', 'thor hulk', true),
      movie(363088, 'phase-3', 'ant-man'),
      movie(299536, 'phase-3', 'avengers iron-man captain-america thor spider-man guardians doctor-strange black-panther hulk', true),
      movie(299534, 'phase-3', 'avengers iron-man captain-america thor spider-man guardians doctor-strange black-panther ant-man captain-marvel hulk', true),
      tv(84958, 'phase-4', 'multiverse', true),
      tv(91363, 'phase-4', 'multiverse'),
      tv(85271, 'phase-4', 'avengers', true),
      tv(88396, 'phase-4', 'captain-america'),
      movie(566525, 'phase-4', ''),
      movie(524434, 'phase-4', ''),
      movie(429617, 'phase-3', 'spider-man'),
      movie(634649, 'phase-4', 'spider-man doctor-strange multiverse', true),
      movie(453395, 'phase-4', 'doctor-strange multiverse', true),
      tv(88329, 'phase-4', 'avengers street-level'),
      tv(92749, 'phase-4', ''),
      movie(505642, 'phase-4', 'black-panther'),
      tv(122226, 'phase-5', 'street-level'),
      tv(92783, 'phase-4', 'hulk street-level'),
      tv(92782, 'phase-4', 'captain-marvel'),
      movie(616037, 'phase-4', 'thor guardians'),
      movie(640146, 'phase-5', 'ant-man multiverse'),
      movie(447365, 'phase-5', 'guardians'),
      tv(114472, 'phase-5', 'captain-marvel'),
      movie(609681, 'phase-5', 'captain-marvel avengers'),
      tv(138501, 'phase-5', ''),
      movie(533535, 'phase-5', 'multiverse'),
      movie(822119, 'phase-5', 'captain-america avengers'),
      tv(202555, 'phase-5', 'street-level'),
      movie(986056, 'phase-5', 'avengers', true),
      tv(114471, 'phase-5', 'black-panther'),
      movie(969681, 'phase-6', 'spider-man', true),
      movie(617126, 'phase-6', 'multiverse', true),
    ],
  },
  {
    slug: 'dc',
    name: L('DC', 'DC'),
    tagline: L('Del Hombre de Acero al nuevo DCU', 'From Man of Steel to the new DCU'),
    intro: L(
      'Las películas y series de DC en orden: el Universo Extendido (DCEU), el nuevo DCU de James Gunn y las historias aparte como The Batman o Joker. Filtrá por Liga de la Justicia, Superman, Batman o Escuadrón Suicida.',
      'DC movies and series in order: the DC Extended Universe (DCEU), James Gunn’s new DCU and standalone stories like The Batman or Joker. Filter by Justice League, Superman, Batman or Suicide Squad.',
    ),
    note: L(
      'El DCU arranca de cero con Creature Commandos y Superman (2025). Peacemaker conecta los dos universos. Joker y The Batman son historias independientes.',
      'The DCU starts fresh with Creature Commandos and Superman (2025). Peacemaker bridges both universes. Joker and The Batman are standalone stories.',
    ),
    accent: '#3b82f6',
    cover: 'movie:1061474',
    posters: ['movie:414906', 'movie:1061474', 'movie:791373'],
    eraLabel: L('Universo', 'Universe'),
    eras: [
      group('dceu', 'DCEU'),
      group('dcu', 'Nuevo DCU', 'New DCU'),
      group('elseworlds', 'Historias aparte', 'Elseworlds'),
    ],
    arcs: [
      group('justice-league', 'Liga de la Justicia', 'Justice League'),
      group('superman', 'Superman'),
      group('batman', 'Batman'),
      group('wonder-woman', 'Mujer Maravilla', 'Wonder Woman'),
      group('aquaman', 'Aquaman'),
      group('shazam', 'Shazam!'),
      group('suicide-squad', 'Escuadrón Suicida', 'Suicide Squad'),
      group('joker', 'Joker'),
    ],
    entries: [
      movie(297762, 'dceu', 'wonder-woman justice-league', true),
      movie(464052, 'dceu', 'wonder-woman'),
      movie(49521, 'dceu', 'superman justice-league', true),
      movie(209112, 'dceu', 'superman batman wonder-woman justice-league', true),
      movie(297761, 'dceu', 'suicide-squad joker batman'),
      movie(141052, 'dceu', 'justice-league superman batman wonder-woman aquaman'),
      movie(791373, 'dceu', 'justice-league superman batman wonder-woman aquaman', true),
      movie(297802, 'dceu', 'aquaman', true),
      movie(287947, 'dceu', 'shazam'),
      movie(495764, 'dceu', 'suicide-squad'),
      movie(436969, 'dceu', 'suicide-squad', true),
      tv(110492, 'dceu', 'suicide-squad', true),
      movie(436270, 'dceu', 'shazam'),
      movie(594767, 'dceu', 'shazam wonder-woman'),
      movie(298618, 'dceu', 'justice-league batman superman'),
      movie(565770, 'dceu', ''),
      movie(572802, 'dceu', 'aquaman'),
      tv(219543, 'dcu', 'suicide-squad'),
      movie(1061474, 'dcu', 'superman justice-league', true),
      movie(1081003, 'dcu', 'superman'),
      movie(475557, 'elseworlds', 'joker', true),
      movie(889737, 'elseworlds', 'joker'),
      movie(414906, 'elseworlds', 'batman', true),
      tv(194764, 'elseworlds', 'batman'),
    ],
  },
  {
    slug: 'star-wars',
    name: L('Star Wars', 'Star Wars'),
    tagline: L('De la Alta República a la Primera Orden', 'From the High Republic to the First Order'),
    intro: L(
      'Toda la saga Star Wars en orden cronológico o de estreno: las tres trilogías, Rogue One, The Mandalorian, Andor, las series animadas y más. Filtrá por era o por saga Skywalker y mirá en qué año de la galaxia pasa cada una.',
      'The whole Star Wars saga in chronological or release order: the three trilogies, Rogue One, The Mandalorian, Andor, the animated series and more. Filter by era or by the Skywalker saga and see when in the galaxy each one happens.',
    ),
    note: L(
      'Las fechas usan la Batalla de Yavin (Una nueva esperanza) como referencia: ABY es antes y DBY es después.',
      'Dates use the Battle of Yavin (A New Hope) as reference: BBY is before and ABY is after.',
    ),
    accent: '#facc15',
    cover: 'movie:11',
    posters: ['movie:11', 'movie:1891', 'tv:82856'],
    eraLabel: L('Era', 'Era'),
    eras: [
      group('high-republic', 'Alta República', 'High Republic'),
      group('fall-of-jedi', 'Caída de los Jedi', 'Fall of the Jedi'),
      group('empire', 'Reinado del Imperio', 'Reign of the Empire'),
      group('rebellion', 'Era de la Rebelión', 'Age of Rebellion'),
      group('new-republic', 'Nueva República', 'New Republic'),
      group('first-order', 'Ascenso de la Primera Orden', 'Rise of the First Order'),
    ],
    arcs: [
      group('skywalker', 'Saga Skywalker', 'Skywalker saga'),
      group('anthology', 'Antologías', 'Anthology'),
      group('mandoverse', 'Mandoverso', 'Mandoverse'),
      group('animated', 'Animadas', 'Animated'),
    ],
    entries: [
      tv(114479, 'high-republic', '', false, bby('100')),
      movie(1893, 'fall-of-jedi', 'skywalker', true, bby('32')),
      movie(1894, 'fall-of-jedi', 'skywalker', true, bby('22')),
      tv(4194, 'fall-of-jedi', 'animated', false, bby('22–19')),
      movie(1895, 'fall-of-jedi', 'skywalker', true, bby('19')),
      tv(105971, 'empire', 'animated', false, bby('19–18')),
      movie(348350, 'empire', 'anthology', false, bby('13–10')),
      tv(92830, 'empire', '', false, bby('9')),
      tv(83867, 'empire', '', true, bby('5–0')),
      tv(60554, 'empire', 'animated', false, bby('5–0')),
      movie(330459, 'rebellion', 'anthology', true, bby('0')),
      movie(11, 'rebellion', 'skywalker', true, bby('0')),
      movie(1891, 'rebellion', 'skywalker', true, aby('3')),
      movie(1892, 'rebellion', 'skywalker', true, aby('4')),
      tv(82856, 'new-republic', 'mandoverse', true, aby('9')),
      tv(115036, 'new-republic', 'mandoverse', false, aby('9')),
      tv(202879, 'new-republic', 'mandoverse', false, aby('9')),
      movie(1228710, 'new-republic', 'mandoverse'),
      tv(114461, 'new-republic', 'mandoverse animated', false, aby('11')),
      movie(140607, 'first-order', 'skywalker', true, aby('34')),
      movie(181808, 'first-order', 'skywalker', true, aby('34')),
      movie(181812, 'first-order', 'skywalker', true, aby('35')),
    ],
  },
  {
    slug: 'middle-earth',
    name: L('El Señor de los Anillos', 'The Lord of the Rings'),
    tagline: L('Toda la Tierra Media, de la Segunda Edad al Retorno del Rey', 'All of Middle-earth, from the Second Age to the Return of the King'),
    intro: L(
      'Cómo ver El Señor de los Anillos y El Hobbit en orden, junto con Los Anillos de Poder y La Guerra de los Rohirrim. Cronológico según las edades de la Tierra Media o por fecha de estreno.',
      'How to watch The Lord of the Rings and The Hobbit in order, together with The Rings of Power and The War of the Rohirrim. Chronological by the ages of Middle-earth or by release date.',
    ),
    accent: '#d4a72c',
    cover: 'movie:122',
    posters: ['movie:120', 'movie:49051', 'movie:122'],
    eraLabel: L('Edad', 'Age'),
    eras: [group('second-age', 'Segunda Edad', 'Second Age'), group('third-age', 'Tercera Edad', 'Third Age')],
    arcs: [
      group('lotr', 'Trilogía del Anillo', 'Rings trilogy'),
      group('hobbit', 'El Hobbit', 'The Hobbit'),
      group('prequels', 'Precuelas', 'Prequels'),
    ],
    entries: [
      tv(84773, 'second-age', 'prequels', false, L('Segunda Edad', 'Second Age')),
      movie(839033, 'third-age', 'prequels', false, L('T.E. 2758', 'T.A. 2758')),
      movie(49051, 'third-age', 'hobbit', true, L('T.E. 2941', 'T.A. 2941')),
      movie(57158, 'third-age', 'hobbit', true, L('T.E. 2941', 'T.A. 2941')),
      movie(122917, 'third-age', 'hobbit', true, L('T.E. 2941', 'T.A. 2941')),
      movie(120, 'third-age', 'lotr', true, L('T.E. 3018', 'T.A. 3018')),
      movie(121, 'third-age', 'lotr', true, L('T.E. 3019', 'T.A. 3019')),
      movie(122, 'third-age', 'lotr', true, L('T.E. 3019', 'T.A. 3019')),
    ],
  },
  {
    slug: 'game-of-thrones',
    name: L('Game of Thrones', 'Game of Thrones'),
    tagline: L('Los Targaryen, Dunk y Egg y la guerra por el Trono de Hierro', 'The Targaryens, Dunk and Egg and the war for the Iron Throne'),
    intro: L(
      'El orden para ver Game of Thrones y sus precuelas: House of the Dragon, El caballero de los Siete Reinos y la serie original, con el año de Poniente en que transcurre cada una.',
      'The order to watch Game of Thrones and its prequels: House of the Dragon, A Knight of the Seven Kingdoms and the original series, with the Westeros year each one takes place.',
    ),
    note: L(
      'Los años se cuentan desde la Conquista de Aegon (d.C.).',
      "Years are counted from Aegon's Conquest (AC).",
    ),
    accent: '#94a3b8',
    cover: 'tv:1399',
    posters: ['tv:94997', 'tv:1399', 'tv:224372'],
    eraLabel: L('Época', 'Period'),
    eras: [],
    arcs: [],
    entries: [
      tv(94997, undefined, '', true, L('129 d.C.', '129 AC')),
      tv(224372, undefined, '', false, L('209 d.C.', '209 AC')),
      tv(1399, undefined, '', true, L('298–305 d.C.', '298–305 AC')),
    ],
  },
  {
    slug: 'wizarding-world',
    name: L('Harry Potter', 'Harry Potter'),
    tagline: L('El Mundo Mágico, de Grindelwald a Hogwarts', 'The Wizarding World, from Grindelwald to Hogwarts'),
    intro: L(
      'Cómo ver Harry Potter y Animales Fantásticos en orden cronológico o de estreno: las 11 películas del Mundo Mágico con el año en que transcurre cada una.',
      'How to watch Harry Potter and Fantastic Beasts in chronological or release order: all 11 Wizarding World movies with the year each one takes place.',
    ),
    accent: '#c9a227',
    cover: 'movie:671',
    posters: ['movie:671', 'movie:673', 'movie:12445'],
    eraLabel: L('Saga', 'Saga'),
    eras: [
      group('fantastic-beasts', 'Animales Fantásticos', 'Fantastic Beasts'),
      group('harry-potter', 'Harry Potter'),
    ],
    arcs: [],
    entries: [
      movie(259316, 'fantastic-beasts', '', true, year('1926')),
      movie(338952, 'fantastic-beasts', '', false, year('1927')),
      movie(338953, 'fantastic-beasts', '', false, year('1932')),
      movie(671, 'harry-potter', '', true, year('1991')),
      movie(672, 'harry-potter', '', true, year('1992')),
      movie(673, 'harry-potter', '', true, year('1993')),
      movie(674, 'harry-potter', '', true, year('1994')),
      movie(675, 'harry-potter', '', true, year('1995')),
      movie(767, 'harry-potter', '', true, year('1996')),
      movie(12444, 'harry-potter', '', true, year('1997')),
      movie(12445, 'harry-potter', '', true, year('1998')),
    ],
  },
  {
    slug: 'x-men',
    name: L('X-Men', 'X-Men'),
    tagline: L('Mutantes, Wolverine y Deadpool', 'Mutants, Wolverine and Deadpool'),
    intro: L(
      'La saga de X-Men de Fox en orden: la trilogía original, las precuelas, Wolverine, Deadpool y Logan. Filtrá por personaje y elegí entre orden cronológico o de estreno.',
      'Fox’s X-Men saga in order: the original trilogy, the prequels, Wolverine, Deadpool and Logan. Filter by character and choose chronological or release order.',
    ),
    note: L(
      'Días del futuro pasado reescribe la línea temporal, así que el orden cronológico es el más aceptado, no el único. Deadpool & Wolverine está en la maratón de Marvel.',
      'Days of Future Past rewrites the timeline, so the chronological order is the most accepted one, not the only one. Deadpool & Wolverine is in the Marvel marathon.',
    ),
    accent: '#f59e0b',
    cover: 'movie:127585',
    posters: ['movie:36657', 'movie:263115', 'movie:293660'],
    eraLabel: L('Etapa', 'Stage'),
    eras: [
      group('original', 'Trilogía original', 'Original trilogy'),
      group('prequels', 'Precuelas', 'Prequels'),
      group('spin-offs', 'Spin-offs'),
    ],
    arcs: [
      group('wolverine', 'Wolverine'),
      group('deadpool', 'Deadpool'),
      group('phoenix', 'Fénix', 'Phoenix'),
    ],
    entries: [
      movie(49538, 'prequels', '', true),
      movie(2080, 'spin-offs', 'wolverine'),
      movie(36657, 'original', 'wolverine', true),
      movie(36658, 'original', 'wolverine', true),
      movie(36668, 'original', 'wolverine phoenix'),
      movie(76170, 'spin-offs', 'wolverine'),
      movie(127585, 'prequels', 'wolverine', true),
      movie(293660, 'spin-offs', 'deadpool', true),
      movie(246655, 'prequels', ''),
      movie(383498, 'spin-offs', 'deadpool'),
      movie(320288, 'prequels', 'phoenix'),
      movie(340102, 'spin-offs', ''),
      movie(263115, 'spin-offs', 'wolverine', true),
    ],
  },
  {
    slug: 'fast-and-furious',
    name: L('Rápidos y Furiosos', 'Fast & Furious'),
    tagline: L('La familia, en el orden correcto', 'The family, in the right order'),
    intro: L(
      'Cómo ver Rápidos y Furiosos en orden cronológico: Tokyo Drift no va tercera. Todas las películas de la saga y el spin-off Hobbs & Shaw, también por fecha de estreno.',
      'How to watch Fast & Furious in chronological order: Tokyo Drift isn’t third. Every movie in the saga plus the Hobbs & Shaw spin-off, also by release date.',
    ),
    note: L(
      'Reto Tokio se estrenó tercera, pero transcurre después de Rápidos y Furiosos 6.',
      'Tokyo Drift came out third, but takes place after Fast & Furious 6.',
    ),
    accent: '#f97316',
    cover: 'movie:168259',
    posters: ['movie:9799', 'movie:51497', 'movie:168259'],
    eraLabel: L('Etapa', 'Stage'),
    eras: [],
    arcs: [group('saga', 'Saga principal', 'Main saga'), group('spin-off', 'Spin-off')],
    entries: [
      movie(9799, undefined, 'saga', true),
      movie(584, undefined, 'saga'),
      movie(13804, undefined, 'saga', true),
      movie(51497, undefined, 'saga', true),
      movie(82992, undefined, 'saga', true),
      movie(9615, undefined, 'saga'),
      movie(168259, undefined, 'saga', true),
      movie(337339, undefined, 'saga'),
      movie(384018, undefined, 'spin-off'),
      movie(385128, undefined, 'saga'),
      movie(385687, undefined, 'saga', true),
    ],
  },
  {
    slug: 'jurassic',
    name: L('Jurassic Park', 'Jurassic Park'),
    tagline: L('Del parque original a Jurassic World', 'From the original park to Jurassic World'),
    intro: L(
      'Todas las películas de Jurassic Park y Jurassic World en orden, más las series animadas Campamento Cretácico y Teoría del Caos, que encajan entre las películas.',
      'Every Jurassic Park and Jurassic World movie in order, plus the animated series Camp Cretaceous and Chaos Theory, which fit between the movies.',
    ),
    accent: '#22c55e',
    cover: 'movie:329',
    posters: ['movie:329', 'movie:135397', 'movie:1234821'],
    eraLabel: L('Saga', 'Saga'),
    eras: [group('jurassic-park', 'Jurassic Park'), group('jurassic-world', 'Jurassic World')],
    arcs: [],
    entries: [
      movie(329, 'jurassic-park', '', true),
      movie(330, 'jurassic-park', ''),
      movie(331, 'jurassic-park', ''),
      movie(135397, 'jurassic-world', '', true),
      tv(93741, 'jurassic-world', ''),
      movie(351286, 'jurassic-world', '', true),
      tv(237512, 'jurassic-world', ''),
      movie(507086, 'jurassic-world', '', true),
      movie(1234821, 'jurassic-world', '', true),
    ],
  },
  {
    slug: 'conjuring',
    name: L('El Conjuro', 'The Conjuring'),
    tagline: L('Los casos Warren, Annabelle y La Monja', 'The Warren cases, Annabelle and The Nun'),
    intro: L(
      'El orden cronológico del universo de El Conjuro: La Monja, Annabelle, La Llorona y los casos de Ed y Lorraine Warren, con el año en que pasa cada historia.',
      'The Conjuring universe in chronological order: The Nun, Annabelle, La Llorona and Ed and Lorraine Warren’s cases, with the year each story takes place.',
    ),
    accent: '#b91c1c',
    cover: 'movie:138843',
    posters: ['movie:138843', 'movie:396422', 'movie:439079'],
    eraLabel: L('Saga', 'Saga'),
    eras: [],
    arcs: [
      group('conjuring', 'El Conjuro', 'The Conjuring'),
      group('annabelle', 'Annabelle'),
      group('nun', 'La Monja', 'The Nun'),
      group('llorona', 'La Llorona'),
    ],
    entries: [
      movie(439079, undefined, 'nun', true, year('1952')),
      movie(396422, undefined, 'annabelle', true, year('1955')),
      movie(968051, undefined, 'nun', false, year('1956')),
      movie(250546, undefined, 'annabelle', false, year('1967')),
      movie(138843, undefined, 'conjuring', true, year('1971')),
      movie(521029, undefined, 'annabelle conjuring', false, year('1972')),
      movie(480414, undefined, 'llorona', false, year('1973')),
      movie(259693, undefined, 'conjuring', true, year('1977')),
      movie(423108, undefined, 'conjuring', true, year('1981')),
      movie(1038392, undefined, 'conjuring', true, year('1986')),
    ],
  },
];

export function findMarathon(slug: string): Marathon | undefined {
  return marathons.find((marathon) => marathon.slug === slug);
}
