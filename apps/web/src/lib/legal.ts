import type { Locale } from './i18n/config';

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

/** Bump when the text changes; shown as "last updated". */
export const LEGAL_UPDATED = '2026-09-14';

const privacy: Record<Locale, LegalSection[]> = {
  es: [
    {
      heading: 'Qué datos guardamos',
      paragraphs: [
        'Podés usar WatchGuru sin cuenta. Si creás una, guardamos tu nombre, tu email y tu contraseña cifrada (nunca la contraseña en texto plano). Si entrás con Google, recibimos tu nombre, email y foto de perfil.',
        'Mientras usás la app guardamos lo que vos cargás: tu lista (quiero ver, viendo, vista), calificaciones, episodios vistos, gustos y plataformas, listas personalizadas y notificaciones de disponibilidad.',
        'Por seguridad, cada sesión registra la dirección IP y el navegador desde el que iniciaste sesión.',
        'En las salas de Match guardamos el apodo que elegís y tus votos. Las salas se borran solas cuando vencen.',
      ],
    },
    {
      heading: 'Para qué los usamos',
      paragraphs: [
        'Solo para que la app funcione: mantener tu sesión, mostrarte tu lista, recomendarte títulos según tus gustos, avisarte cuando algo que querés ver llega a tus plataformas y enviarte emails de la cuenta (verificación y recuperación de contraseña).',
        'No vendemos tus datos. Las listas que marcás como públicas muestran su título, los títulos que contienen y tu nombre.',
      ],
    },
    {
      heading: 'Cookies y almacenamiento local',
      paragraphs: [
        'Usamos una cookie necesaria para mantener tu sesión y el almacenamiento local del navegador para recordar preferencias (por ejemplo, la pestaña elegida en tu lista o tu región).',
        'Cuando el sitio muestra publicidad, Google puede usar cookies para medir y personalizar anuncios. Te pedimos permiso antes; si elegís "Solo necesarias", los anuncios no son personalizados. Podés ver cómo usa Google estos datos en policies.google.com/technologies/ads.',
      ],
    },
    {
      heading: 'Servicios de terceros',
      paragraphs: [
        'La información de películas y series viene de TMDB, y los datos de dónde ver cada título son de JustWatch a través de TMDB. El sitio está alojado en Vercel y la API y la base de datos en Railway. Los emails se envían con Resend. El inicio de sesión con Google y los anuncios de Google AdSense, cuando están activos, los provee Google.',
        'Cada uno de estos servicios procesa datos según su propia política de privacidad.',
      ],
    },
    {
      heading: 'Tus derechos',
      paragraphs: [
        'Podés ver y modificar tus datos desde la app, y eliminar tu cuenta cuando quieras desde "Mi cuenta". Al eliminarla borramos de inmediato tu cuenta y todo lo asociado; en las salas de Match que sigan activas solo queda tu apodo, sin vínculo a tu cuenta.',
        'WatchGuru no está dirigido a menores de 13 años.',
      ],
    },
    {
      heading: 'Cambios',
      paragraphs: ['Si cambiamos esta política, actualizamos la fecha de esta página.'],
    },
  ],
  en: [
    {
      heading: 'What we store',
      paragraphs: [
        'You can use WatchGuru without an account. If you create one, we store your name, your email and your hashed password (never the plain password). If you sign in with Google, we receive your name, email and profile picture.',
        'While you use the app we store what you add: your list (watchlist, watching, watched), ratings, watched episodes, taste and streaming services, custom lists and availability notifications.',
        'For security, each session records the IP address and browser you signed in from.',
        'In Match rooms we store the nickname you pick and your votes. Rooms are deleted automatically when they expire.',
      ],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'Only to run the app: keep you signed in, show your list, recommend titles based on your taste, let you know when something on your watchlist reaches your services, and send account emails (verification and password recovery).',
        'We do not sell your data. Lists you make public show their title, the titles in them and your name.',
      ],
    },
    {
      heading: 'Cookies and local storage',
      paragraphs: [
        "We use one necessary cookie to keep your session, and your browser's local storage to remember preferences (such as the tab you chose in your list or your region).",
        'When the site shows ads, Google may use cookies to measure and personalize them. We ask for permission first; if you choose "Necessary only", ads are not personalized. You can learn how Google uses this data at policies.google.com/technologies/ads.',
      ],
    },
    {
      heading: 'Third-party services',
      paragraphs: [
        'Movie and TV information comes from TMDB, and where-to-watch data comes from JustWatch through TMDB. The site is hosted on Vercel, and the API and database on Railway. Emails are sent with Resend. Google sign-in and Google AdSense ads, when enabled, are provided by Google.',
        'Each of these services processes data under its own privacy policy.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You can see and change your data in the app, and delete your account at any time from "My account". Deleting it immediately removes your account and everything tied to it; in Match rooms that are still active only your nickname remains, no longer linked to you.',
        'WatchGuru is not directed at children under 13.',
      ],
    },
    {
      heading: 'Changes',
      paragraphs: ['If we change this policy, we update the date on this page.'],
    },
  ],
};

const terms: Record<Locale, LegalSection[]> = {
  es: [
    {
      heading: 'El servicio',
      paragraphs: [
        'WatchGuru es un proyecto personal y gratuito para descubrir películas y series, llevar tu lista y elegir qué ver con otras personas. Puede cambiar, tener errores o dejar de estar disponible sin aviso.',
      ],
    },
    {
      heading: 'La información',
      paragraphs: [
        'Los datos de títulos, imágenes y disponibilidad vienen de TMDB y JustWatch. Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB. No garantizamos que la información esté completa ni actualizada: confirmá la disponibilidad en cada plataforma.',
        'WatchGuru no aloja ni transmite películas o series. Los enlaces a plataformas llevan a servicios de terceros.',
      ],
    },
    {
      heading: 'Tu cuenta',
      paragraphs: [
        'Sos responsable de lo que hacés con tu cuenta y de mantener tu contraseña segura. Podés eliminarla cuando quieras.',
        'No uses WatchGuru para publicar contenido ilegal, ofensivo o que infrinja derechos de otros (por ejemplo, en nombres de listas o apodos), ni para automatizar el acceso o sobrecargar el servicio. Podemos borrar ese contenido o suspender cuentas que no respeten estas reglas.',
      ],
    },
    {
      heading: 'Publicidad y apoyo',
      paragraphs: [
        'El sitio puede mostrar anuncios de terceros y ofrecer un enlace para apoyar el proyecto de forma voluntaria. Los aportes son donaciones y no dan acceso a funciones extra.',
      ],
    },
    {
      heading: 'Responsabilidad',
      paragraphs: [
        'El servicio se ofrece "tal cual". En la medida que lo permita la ley, no somos responsables por daños derivados del uso del sitio o de servicios de terceros enlazados.',
      ],
    },
    {
      heading: 'Cambios',
      paragraphs: ['Podemos actualizar estos términos; la fecha de esta página indica la última versión.'],
    },
  ],
  en: [
    {
      heading: 'The service',
      paragraphs: [
        'WatchGuru is a free personal project for discovering movies and TV shows, keeping your list and choosing what to watch with other people. It may change, contain errors or become unavailable without notice.',
      ],
    },
    {
      heading: 'The information',
      paragraphs: [
        'Title data, images and availability come from TMDB and JustWatch. This product uses the TMDB API but is not endorsed or certified by TMDB. We do not guarantee the information is complete or current: check availability on each service.',
        'WatchGuru does not host or stream movies or shows. Links to streaming services lead to third parties.',
      ],
    },
    {
      heading: 'Your account',
      paragraphs: [
        'You are responsible for what you do with your account and for keeping your password safe. You can delete it at any time.',
        "Do not use WatchGuru to post illegal or offensive content or content that infringes others' rights (for example in list names or nicknames), or to automate access or overload the service. We may remove such content or suspend accounts that break these rules.",
      ],
    },
    {
      heading: 'Ads and support',
      paragraphs: [
        'The site may show third-party ads and offer a link to support the project voluntarily. Contributions are donations and do not unlock extra features.',
      ],
    },
    {
      heading: 'Liability',
      paragraphs: [
        'The service is provided "as is". To the extent permitted by law, we are not liable for damages arising from using the site or linked third-party services.',
      ],
    },
    {
      heading: 'Changes',
      paragraphs: ['We may update these terms; the date on this page shows the latest version.'],
    },
  ],
};

export const legalContent = { privacy, terms };
