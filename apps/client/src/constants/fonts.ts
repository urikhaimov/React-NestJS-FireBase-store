export type FontStyleGroup = 'Sans Serif' | 'Serif' | 'Monospace';

export type FontOption = {
  name: string;
  group: FontStyleGroup;
};

export const FONT_OPTIONS: FontOption[] = [
  { name: 'Roboto', group: 'Sans Serif' },
  { name: 'Open Sans', group: 'Sans Serif' },
  { name: 'Poppins', group: 'Sans Serif' },
  { name: 'Montserrat', group: 'Sans Serif' },
  { name: 'Lato', group: 'Sans Serif' },
  { name: 'Raleway', group: 'Sans Serif' },

  { name: 'Merriweather', group: 'Serif' },
  { name: 'Noto Serif', group: 'Serif' },
  { name: 'Playfair Display', group: 'Serif' },

  { name: 'Source Code Pro', group: 'Monospace' },
  { name: 'Fira Code', group: 'Monospace' },
];
