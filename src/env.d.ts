/// <reference types="astro/client" />

// Vite raw string imports
declare module '*?raw' {
  const content: string;
  export default content;
}
