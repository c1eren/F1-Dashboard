// lib.d.ts

declare module 'componentToggle.js' {
  export function toggle(componentId: string | null): void;
}

declare module 'grid.js' {
// Side effects only
    const _: void;
  export default _;
}