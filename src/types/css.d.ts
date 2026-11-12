import "react";

// Lets inline styles set CSS custom properties, as the landing markup does.
declare module "react" {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
