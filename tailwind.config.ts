import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { ink:'#2C2C2B', muted:'#7D7A75', line:'#E6E5E3', accent:'#2783DE' } } }, plugins: [] };
export default config;
