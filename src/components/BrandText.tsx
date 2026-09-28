import { Fragment, type ElementType, type ReactNode } from "react";

const BRAND_ACCENT_STYLE = { color: "var(--brand-accent)" } as const;

const renderBrandToken = (token: string, key: string) => {
  if (token === "SCRAPWRK") {
    return (
      <Fragment key={key}>
        SCRAP
        <span style={BRAND_ACCENT_STYLE}>WRK</span>
      </Fragment>
    );
  }

  if (token === "ScrapWRK") {
    return (
      <Fragment key={key}>
        Scrap
        <span style={BRAND_ACCENT_STYLE}>WRK</span>
      </Fragment>
    );
  }

  return token;
};

export const accentBrandText = (text: string): ReactNode[] => {
  return text
    .split(/(SCRAPWRK|ScrapWRK)/g)
    .filter(Boolean)
    .map((part, index) => renderBrandToken(part, `${part}-${index}`));
};

interface BrandTextProps {
  as?: ElementType;
  className?: string;
  text: string;
}

const BrandText = ({ as: Component = "span", className, text }: BrandTextProps) => {
  return <Component className={className}>{accentBrandText(text)}</Component>;
};

export default BrandText;
