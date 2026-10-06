/**
 * data/teams.js
 * -----------------------------------------------------------------------
 * Fuente única de datos de los 20 clubes de LaLiga (temporada 2026/27).
 * Este archivo lo usa generate.js (Node) para construir las sub-páginas
 * de /equipos y el bloque window.LALIGA_TEAMS que usa la landing page.
 *
 * NOTA PARA ADRIÁN: las cifras de títulos (Liga, Copa del Rey, Europa)
 * están verificadas hasta la temporada 2025/26 (Barcelona campeón de
 * LaLiga esa temporada). Si tu maestro pide datos más recientes,
 * actualízalos aquí y vuelve a correr `node generate.js`.
 *
 * Estructura de cada equipo:
 *  - slug: identificador usado en el nombre de archivo /equipos/<slug>.html
 *  - colors.primary/secondary/accent: paleta usada para theming CSS
 *  - titles: arreglo de {label, count} -> se renderiza como tarjetas
 *  - achievements: logros/momentos destacados en frase corta
 *  - history: 2-3 frases de historia breve
 * -----------------------------------------------------------------------
 */

const TEAMS = [
  {
    slug: "real-madrid",
    name: "Real Madrid CF",
    nickname: "Los Blancos / Los Merengues",
    city: "Madrid",
    founded: 1902,
    stadium: { name: "Santiago Bernabéu", capacity: 78297 },
    colors: { primary: "#FFFFFF", secondary: "#1B1F3B", accent: "#C9A24B" },
    isTop4: true,
    category: "El más laureado del mundo",
    history:
      "Fundado en 1902, el Real Madrid es el club con más Copas de Europa/Champions League de la historia. Su rivalidad con el FC Barcelona, El Clásico, es el partido de clubes más seguido del planeta. Ha sido durante décadas la referencia mundial del fútbol de clubes.",
    titles: [
      { label: "LaLiga", count: 36 },
      { label: "Copa del Rey", count: 20 },
      { label: "Champions League", count: 15 },
      { label: "Supercopa de España", count: 13 },
    ],
    achievements: [
      "Club con más títulos de Copa de Europa / Champions League de la historia",
      "Primer club en ganar 5 Champions League consecutivas (1956-1960)",
      "Elegido 'Mejor Club del Siglo XX' por la FIFA",
    ],
    rival: "FC Barcelona — El Clásico",
  },
  {
    slug: "barcelona",
    name: "FC Barcelona",
    nickname: "Blaugrana / Culés",
    city: "Barcelona",
    founded: 1899,
    stadium: { name: "Spotify Camp Nou", capacity: 105000 },
    colors: { primary: "#004D98", secondary: "#A50044", accent: "#EDBB00" },
    isTop4: true,
    category: "Més que un club",
    history:
      "Fundado en 1899 por Joan Gamper, el FC Barcelona adoptó el lema 'Més que un club' (más que un club) por su papel como símbolo de identidad catalana. La era de La Masía y el tiki-taka de Guardiola lo convirtieron en referencia de un estilo de juego que cambió el fútbol moderno.",
    titles: [
      { label: "LaLiga", count: 27 },
      { label: "Copa del Rey", count: 31 },
      { label: "Champions League", count: 5 },
      { label: "Supercopa de España", count: 14 },
    ],
    achievements: [
      "Récord histórico de títulos de Copa del Rey (31)",
      "Único equipo europeo en ganar el sextete (6 títulos en un año, 2009 y 2015)",
      "Cuna de futbolistas ganadores del Balón de Oro: Messi, Cruyff, Ronaldinho y más",
    ],
    rival: "Real Madrid CF — El Clásico",
  },
  {
    slug: "atletico-de-madrid",
    name: "Atlético de Madrid",
    nickname: "Colchoneros / Rojiblancos",
    city: "Madrid",
    founded: 1903,
    stadium: { name: "Cívitas Metropolitano", capacity: 70460 },
    colors: { primary: "#CB3524", secondary: "#262E62", accent: "#FFFFFF" },
    isTop4: true,
    category: "El espíritu 'nunca dejes de luchar'",
    history:
      "Fundado en 1903, el Atlético de Madrid construyó su identidad sobre la garra y el sacrificio, resumidos en su lema 'Nunca dejes de creer'. Bajo Diego Simeone vivió su etapa más exitosa reciente, incluyendo dos finales de Champions League.",
    titles: [
      { label: "LaLiga", count: 11 },
      { label: "Copa del Rey", count: 10 },
      { label: "UEFA Europa League", count: 3 },
      { label: "Supercopa de Europa", count: 3 },
    ],
    achievements: [
      "Tercer club español con más títulos de Liga",
      "Finalista de la Champions League en 2014 y 2016",
      "Uno de los tres clubes que nunca ha descendido de Primera junto a Real Madrid y Athletic",
    ],
    rival: "Real Madrid CF — El Derbi Madrileño",
  },
  {
    slug: "athletic-club",
    name: "Athletic Club",
    nickname: "Los Leones",
    city: "Bilbao",
    founded: 1898,
    stadium: { name: "San Mamés", capacity: 53289 },
    colors: { primary: "#EE2523", secondary: "#FFFFFF", accent: "#000000" },
    isTop4: true,
    category: "Cantera pura, orgullo vasco",
    history:
      "Fundado en 1898, el Athletic Club es único en el fútbol mundial por su política de cantera: solo alinea jugadores formados en el País Vasco. Pese a esta autoimpuesta limitación, es uno de los tres clubes fundadores que jamás ha descendido de Primera División.",
    titles: [
      { label: "LaLiga", count: 8 },
      { label: "Copa del Rey", count: 24 },
      { label: "Supercopa de España", count: 3 },
    ],
    achievements: [
      "Segundo club con más Copas del Rey de la historia",
      "Uno de los tres clubes que ha disputado todas las temporadas de Primera",
      "Política de cantera única en el fútbol de élite mundial",
    ],
    rival: "Real Sociedad — El Derbi Vasco",
  },
  {
    slug: "valencia",
    name: "Valencia CF",
    nickname: "Che / Murciélagos",
    city: "Valencia",
    founded: 1919,
    stadium: { name: "Mestalla", capacity: 49430 },
    colors: { primary: "#FFFFFF", secondary: "#EE7203", accent: "#000000" },
    isTop4: false,
    category: "Histórico de la Liga",
    history:
      "Fundado en 1919, el Valencia CF vivió su época dorada a comienzos de los 2000, ganando dos Ligas y llegando a dos finales consecutivas de Champions League (2000 y 2001). Es uno de los clubes con más historia del fútbol español.",
    titles: [
      { label: "LaLiga", count: 6 },
      { label: "Copa del Rey", count: 8 },
      { label: "UEFA Europa League", count: 2 },
      { label: "Recopa de Europa", count: 1 },
    ],
    achievements: [
      "Finalista de la Champions League en 2000 y 2001",
      "Quinto club con más títulos de Liga en España",
      "Campeón de la Supercopa de Europa en 1980",
    ],
    rival: "Levante UD — El Derbi Valenciano",
  },
  {
    slug: "real-sociedad",
    name: "Real Sociedad",
    nickname: "La Real / Txuri-urdin",
    city: "San Sebastián",
    founded: 1909,
    stadium: { name: "Reale Arena", capacity: 39500 },
    colors: { primary: "#0066B3", secondary: "#FFFFFF", accent: "#002855" },
    isTop4: false,
    category: "Cantera vasca de élite",
    history:
      "Fundada en 1909, la Real Sociedad vivió su mejor época a inicios de los 80 con dos Ligas consecutivas. Históricamente ligada a la cantera vasca (igual que el Athletic durante años), ha sido semillero de grandes futbolistas como Xabi Alonso o Griezmann.",
    titles: [
      { label: "LaLiga", count: 2 },
      { label: "Copa del Rey", count: 3 },
    ],
    achievements: [
      "Campeón de Liga en 1980/81 y 1981/82",
      "Campeón de Copa del Rey en 2019/20",
      "Semifinalista de la Copa de Europa en 1983",
    ],
    rival: "Athletic Club — El Derbi Vasco",
  },
  {
    slug: "sevilla",
    name: "Sevilla FC",
    nickname: "Nervionenses / Sevillistas",
    city: "Sevilla",
    founded: 1890,
    stadium: { name: "Ramón Sánchez-Pizjuán", capacity: 43883 },
    colors: { primary: "#FFFFFF", secondary: "#D2001C", accent: "#000000" },
    isTop4: false,
    category: "El rey de la Europa League",
    history:
      "Fundado en 1890, el Sevilla FC es uno de los clubes más antiguos de España. Es el máximo dominador histórico de la UEFA Europa League, competición que ha levantado más veces que ningún otro club del continente.",
    titles: [
      { label: "LaLiga", count: 1 },
      { label: "Copa del Rey", count: 5 },
      { label: "UEFA Europa League", count: 7 },
    ],
    achievements: [
      "Récord absoluto de títulos de UEFA Europa League (7)",
      "Uno de los clubes fundadores del fútbol español (1890)",
      "Referencia mundial en la formación de talento sudamericano",
    ],
    rival: "Real Betis — El Gran Derbi",
  },
  {
    slug: "real-betis",
    name: "Real Betis Balompié",
    nickname: "Verdiblancos / Béticos",
    city: "Sevilla",
    founded: 1907,
    stadium: { name: "Benito Villamarín", capacity: 60720 },
    colors: { primary: "#00954C", secondary: "#FFFFFF", accent: "#000000" },
    isTop4: false,
    category: "Pasión verdiblanca",
    history:
      "Fundado en 1907, el Real Betis es sinónimo de una de las aficiones más pasionales de España, con el lema 'Viva el Betis manque pierda' (aunque pierda). Ganó su primera Copa del Rey en 1977 y esperó 45 años para la segunda, en 2022.",
    titles: [
      { label: "LaLiga", count: 1 },
      { label: "Copa del Rey", count: 2 },
    ],
    achievements: [
      "Campeón de Copa del Rey en 1976/77 y 2021/22",
      "Único campeón de Liga en la temporada 1934/35",
      "Una de las hinchadas más reconocidas de España",
    ],
    rival: "Sevilla FC — El Gran Derbi",
  },
  {
    slug: "villarreal",
    name: "Villarreal CF",
    nickname: "El Submarino Amarillo",
    city: "Villarreal",
    founded: 1923,
    stadium: { name: "Estadio de la Cerámica", capacity: 23008 },
    colors: { primary: "#FFE667", secondary: "#003DA5", accent: "#000000" },
    isTop4: false,
    category: "El pequeño gigante europeo",
    history:
      "Fundado en 1923 en una ciudad de apenas 50,000 habitantes, el Villarreal se convirtió en el ejemplo de club modesto que compite de tú a tú con los grandes de Europa, coronado con la sorprendente conquista de la UEFA Europa League en 2021.",
    titles: [
      { label: "UEFA Europa League", count: 1 },
      { label: "Subcampeón de LaLiga", count: 1 },
    ],
    achievements: [
      "Campeón de la UEFA Europa League 2020/21 (venciendo al Manchester United)",
      "Semifinalista de la Champions League en 2005/06",
      "Subcampeón de LaLiga en 2007/08",
    ],
    rival: "Valencia CF",
  },
  {
    slug: "celta-de-vigo",
    name: "RC Celta de Vigo",
    nickname: "Célticos",
    city: "Vigo",
    founded: 1923,
    stadium: { name: "Abanca-Balaídos", capacity: 29000 },
    colors: { primary: "#8AC7EA", secondary: "#FFFFFF", accent: "#00285E" },
    isTop4: false,
    category: "Orgullo gallego",
    history:
      "Fundado en 1923 en Vigo, el Celta es uno de los clubes históricos del noroeste de España. Sin títulos de Liga o Copa, ha compensado esa ausencia con temporadas europeas memorables y un estilo de juego siempre asociado a la calidad técnica.",
    titles: [],
    achievements: [
      "Semifinalista de la UEFA Europa League en 2016/17",
      "Cuartos de final de la Recopa de Europa en 1994/95",
      "Cantera histórica de grandes delanteros gallegos",
    ],
    rival: "RC Deportivo de La Coruña — Derbi Gallego",
  },
  {
    slug: "osasuna",
    name: "CA Osasuna",
    nickname: "Rojillos",
    city: "Pamplona",
    founded: 1920,
    stadium: { name: "El Sadar", capacity: 23576 },
    colors: { primary: "#D2001C", secondary: "#001689", accent: "#FFFFFF" },
    isTop4: false,
    category: "El club-socios de Navarra",
    history:
      "Fundado en 1920 en Pamplona, Osasuna es un club propiedad de sus socios (más de 20,000), sin accionistas externos. Su hinchada y El Sadar tienen fama de ser uno de los ambientes más intensos de LaLiga.",
    titles: [],
    achievements: [
      "Finalista de la Copa del Rey en 2004/05",
      "Semifinalista de la UEFA Cup en 2005/06",
      "Uno de los pocos clubes de LaLiga gestionado 100% por sus socios",
    ],
    rival: "Athletic Club",
  },
  {
    slug: "espanyol",
    name: "RCD Espanyol",
    nickname: "Pericos / Periquitos",
    city: "Barcelona",
    founded: 1900,
    stadium: { name: "Stage Front Stadium (RCDE Stadium)", capacity: 40500 },
    colors: { primary: "#0A4C9C", secondary: "#FFFFFF", accent: "#D2001C" },
    isTop4: false,
    category: "Historia centenaria catalana",
    history:
      "Fundado en 1900, el RCD Espanyol es el club decano de Cataluña. Aunque nunca ha ganado LaLiga, cuenta con cuatro Copas del Rey y dos finales de la UEFA Cup / Europa League en su historial.",
    titles: [{ label: "Copa del Rey", count: 4 }],
    achievements: [
      "Finalista de la UEFA Cup en 1987/88 y 2006/07",
      "Cuatro títulos de Copa del Rey (1929, 1940, 2000, 2006)",
      "Club fundador de la Real Federación Española de Fútbol",
    ],
    rival: "FC Barcelona — El Derbi Barcelonés",
  },
  {
    slug: "getafe",
    name: "Getafe CF",
    nickname: "Azulones / El Geta",
    city: "Getafe",
    founded: 1983,
    stadium: { name: "Coliseum", capacity: 17393 },
    colors: { primary: "#005999", secondary: "#FFFFFF", accent: "#000000" },
    isTop4: false,
    category: "El aguerrido del sur de Madrid",
    history:
      "Refundado en 1983, el Getafe CF se consolidó en la élite del fútbol español en los 2000, destacando por un estilo combativo y disciplinado que le llevó a disputar dos finales de Copa del Rey y competir en Europa varias temporadas.",
    titles: [],
    achievements: [
      "Finalista de la Copa del Rey en 2006/07 y 2007/08",
      "Cuartos de final de la UEFA Cup en 2007/08 y 2008/09",
      "Uno de los clubes revelación del fútbol español en los años 2000",
    ],
    rival: "Real Madrid CF",
  },
  {
    slug: "deportivo-alaves",
    name: "Deportivo Alavés",
    nickname: "Babazorros / El Glorioso",
    city: "Vitoria-Gasteiz",
    founded: 1921,
    stadium: { name: "Mendizorrotza", capacity: 19840 },
    colors: { primary: "#0055A4", secondary: "#FFFFFF", accent: "#004085" },
    isTop4: false,
    category: "La final más recordada",
    history:
      "Fundado en 1921, el Deportivo Alavés vivió el momento más icónico de su historia en la final de la UEFA Cup 2001 ante el Liverpool, un partido de 5-4 considerado una de las mejores finales europeas de la historia, pese a la derrota.",
    titles: [],
    achievements: [
      "Finalista de la UEFA Cup en 2000/01 (uno de los partidos más recordados de la historia)",
      "Ascenso histórico a Primera en la temporada 1997/98",
      "Club referencia del País Vasco fuera de Bilbao y San Sebastián",
    ],
    rival: "Athletic Club / Real Sociedad",
  },
  {
    slug: "rayo-vallecano",
    name: "Rayo Vallecano",
    nickname: "Franjirrojos",
    city: "Madrid",
    founded: 1924,
    stadium: { name: "Estadio de Vallecas", capacity: 14708 },
    colors: { primary: "#FFFFFF", secondary: "#D2001C", accent: "#000000" },
    isTop4: false,
    category: "El club de barrio",
    history:
      "Fundado en 1924 en el barrio obrero de Vallecas, el Rayo es célebre por su fuerte identidad social y vecinal, con una afición volcada en causas solidarias. Ha alternado temporadas en Primera y Segunda a lo largo de su historia.",
    titles: [],
    achievements: [
      "Semifinalista de la Copa de la UEFA en 2000/01",
      "Símbolo del fútbol popular y de barrio en Madrid",
      "Una de las aficiones más comprometidas socialmente de LaLiga",
    ],
    rival: "Atlético de Madrid / Getafe",
  },
  {
    slug: "deportivo-de-la-coruna",
    name: "RC Deportivo de La Coruña",
    nickname: "Deportivistas / Súper Depor",
    city: "A Coruña",
    founded: 1906,
    stadium: { name: "Abanca-Riazor", capacity: 32912 },
    colors: { primary: "#0057A8", secondary: "#FFFFFF", accent: "#000000" },
    isTop4: false,
    category: "El 'Súper Depor' de los 2000",
    history:
      "Fundado en 1906, el Deportivo vivió su época dorada entre finales de los 90 y mediados de los 2000, apodada 'Súper Depor', con la conquista de su única Liga en la temporada 1999/2000 y una memorable semifinal de Champions League en 2004.",
    titles: [
      { label: "LaLiga", count: 1 },
      { label: "Copa del Rey", count: 2 },
    ],
    achievements: [
      "Campeón de LaLiga en la temporada 1999/2000",
      "Semifinalista de la Champions League en 2003/04 (tras eliminar al AC Milan vigente campeón)",
      "Época dorada conocida como 'Súper Depor'",
    ],
    rival: "RC Celta de Vigo — Derbi Gallego",
  },
  {
    slug: "elche",
    name: "Elche CF",
    nickname: "Franjiverdes",
    city: "Elche",
    founded: 1923,
    stadium: { name: "Estadio Manuel Martínez Valero", capacity: 33732 },
    colors: { primary: "#00954C", secondary: "#FFFFFF", accent: "#000000" },
    isTop4: false,
    category: "Historia y resiliencia",
    history:
      "Fundado en 1923, el Elche CF ha sido un habitual de la Primera División española en distintas décadas, destacando por dos finales de Copa del Rey en los años 60 y 80, y por una afición fiel pese a las dificultades institucionales que ha superado en su historia reciente.",
    titles: [],
    achievements: [
      "Finalista de la Copa del Rey en 1968/69 y 1983/84",
      "Club centenario del este de España",
      "Ejemplo de resiliencia institucional en el fútbol español",
    ],
    rival: "Hércules CF — Derbi del Vinalopó",
  },
  {
    slug: "levante",
    name: "Levante UD",
    nickname: "Granotas",
    city: "Valencia",
    founded: 1909,
    stadium: { name: "Estadi Ciutat de València", capacity: 26354 },
    colors: { primary: "#1B2C5C", secondary: "#8B1538", accent: "#FFFFFF" },
    isTop4: false,
    category: "El eterno luchador valenciano",
    history:
      "Fundado en 1909, el Levante UD ha compartido ciudad con el Valencia CF desde siempre, jugando habitualmente el papel de aspirante. En la temporada 2020/21 rozó la clasificación europea, una de sus mejores campañas históricas.",
    titles: [],
    achievements: [
      "Semifinalista de la Copa del Rey en varias ocasiones",
      "Mejores posiciones históricas en LaLiga en la década de 2010",
      "Club centenario con fuerte identidad local",
    ],
    rival: "Valencia CF — Derbi Valenciano",
  },
  {
    slug: "malaga",
    name: "Málaga CF",
    nickname: "Boquerones",
    city: "Málaga",
    founded: 1948,
    stadium: { name: "La Rosaleda", capacity: 30044 },
    colors: { primary: "#0057A8", secondary: "#FFFFFF", accent: "#000000" },
    isTop4: false,
    category: "La sorpresa europea de 2013",
    history:
      "Con raíces futbolísticas que se remontan a 1904 y refundado en 1994, el Málaga CF vivió su momento más recordado en la temporada 2012/13, cuando alcanzó los cuartos de final de la Champions League en su histórico debut continental.",
    titles: [],
    achievements: [
      "Cuartos de final de la Champions League en 2012/13",
      "Cuarto lugar en LaLiga en la temporada 2011/12 (mejor puesto histórico)",
      "Debut europeo más exitoso de un club español en su primera participación",
    ],
    rival: "Sevilla FC / Real Betis",
  },
  {
    slug: "real-racing-club",
    name: "Real Racing Club",
    nickname: "Racinguistas / Verdiblancos",
    city: "Santander",
    founded: 1913,
    stadium: { name: "El Sardinero", capacity: 22271 },
    colors: { primary: "#00954C", secondary: "#FFFFFF", accent: "#000000" },
    isTop4: false,
    category: "Club fundador de LaLiga",
    history:
      "Fundado en 1913, el Real Racing Club de Santander fue uno de los diez clubes fundadores de la Primera División española en 1929. Con una gran afición en Cantabria, ha vivido etapas en todas las categorías del fútbol español a lo largo de su historia.",
    titles: [],
    achievements: [
      "Miembro fundador de LaLiga en 1929",
      "Cuartos de final de la Copa UEFA en 1970/71",
      "Uno de los clubes con más historia del norte de España",
    ],
    rival: "Sporting de Gijón — Derbi Cántabro-Asturiano",
  },
];

// -----------------------------------------------------------------------
// Plantillas reales (roster de cada equipo).
// -----------------------------------------------------------------------
// Los datos de los ~580 jugadores (número, nombre, posición) viven en
// data/rosters.json en vez de estar escritos aquí abajo, a propósito:
// son muchísimas líneas que cambian temporada tras temporada (fichajes,
// bajas), así que separarlos hace más fácil actualizar SOLO ese archivo
// sin tocar el resto de la información de cada club. Aquí simplemente
// se "pegan" en el campo team.roster de cada equipo, que es el campo que
// generate.js ya sabe leer (ver rosterRows() en generate.js).
//
// Las fotos de cada jugador se buscan automáticamente en
// assets/players/<slug>-<numero>.jpg — si la agregaste (o ya vino en el
// paquete de imágenes), se muestra sola; si no, sale el ícono de
// silueta genérico. No hace falta tocar nada más.
if (typeof module !== "undefined" && module.exports) {
  try {
    const ROSTERS = require("./rosters.json");
    TEAMS.forEach((team) => {
      if (ROSTERS[team.slug]) team.roster = ROSTERS[team.slug];
    });
  } catch (e) {
    // Si data/rosters.json no existe todavía, no pasa nada: generate.js
    // simplemente usa las 5 filas de ejemplo, como antes.
  }
}

// Exportar para Node (usado por generate.js)
if (typeof module !== "undefined" && module.exports) {
  module.exports = TEAMS;
}
