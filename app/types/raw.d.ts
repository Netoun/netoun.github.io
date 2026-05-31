// Vite `?raw` imports: load a file's contents as a string (used by Labs source viewer).
declare module "*?raw" {
  const content: string;
  export default content;
}
