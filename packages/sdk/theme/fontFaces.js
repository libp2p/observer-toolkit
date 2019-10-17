import nexa_light from './fonts/Nexa-Light.otf'
import nexa_bold from './fonts/Nexa-Bold.otf'

import plexSans_extraLight from './fonts/IBMPlexSans-ExtraLight.otf'
import plexSans_light from './fonts/IBMPlexSans-Light.otf'
import plexSans_regular from './fonts/IBMPlexSans-Regular.otf'
import plexSans_text from './fonts/IBMPlexSans-Text.otf'
import plexSans_medium from './fonts/IBMPlexSans-Medium.otf'
import plexSans_semiBold from './fonts/IBMPlexSans-SemiBold.otf'
import plexSans_bold from './fonts/IBMPlexSans-Bold.otf'

import plexMono_light from './fonts/IBMPlexMono-Light.otf'
import plexMono_text from './fonts/IBMPlexMono-Text.otf'
import plexMono_semiBold from './fonts/IBMPlexMono-SemiBold.otf'

function getFontFace({ font, file, weight = 400, format = 'opentype' }) {
  return `
    @font-face {
      src: url('${file}') format('${format}');
      font-family: ${font};
      font-weight: ${weight};
    }
  `
}

export default [
  // Use Nexa for headings and paragraph text
  getFontFace({
    font: 'nexa',
    file: nexa_light,
  }),
  getFontFace({
    font: 'nexa',
    file: nexa_bold,
    weight: 700,
  }),

  // Use plex-sans for small labels and table content
  // Use weights to communicate magnitude at a glance
  // e.g. 7 gb bolder than 70 mb which is bolder than 700 kb
  getFontFace({
    font: 'plex-sans',
    file: plexSans_extraLight,
    weight: 200,
  }),
  getFontFace({
    font: 'plex-sans',
    file: plexSans_light,
    weight: 300,
  }),
  getFontFace({
    font: 'plex-sans',
    file: plexSans_regular,
    weight: 400,
  }),
  getFontFace({
    font: 'plex-sans',
    file: plexSans_text,
    weight: 500,
  }),
  getFontFace({
    font: 'plex-sans',
    file: plexSans_medium,
    weight: 600,
  }),
  getFontFace({
    font: 'plex-sans',
    file: plexSans_semiBold,
    weight: 700,
  }),
  getFontFace({
    font: 'plex-sans',
    file: plexSans_bold,
    weight: 800,
  }),
  // Use plex-mono for code and copy-paste snippets like hash ids
  getFontFace({
    font: 'plex-mono',
    file: plexMono_light,
    weight: 300,
  }),
  getFontFace({
    font: 'plex-mono',
    file: plexMono_text,
    weight: 500,
  }),
  getFontFace({
    font: 'plex-mono',
    file: plexMono_semiBold,
    weight: 700,
  }),
]
