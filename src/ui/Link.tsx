import classNames from "classnames";
import { CSSProperties, FunctionComponent, PropsWithChildren } from "react";

type LinkColor = "brand";

type LinkColorProps = {
  hex: string;
  hexHover: string;
  textColor: string;
  textHover: string;
};

const Colors: Record<LinkColor, LinkColorProps> = {
  brand: {
    hex: "#65d9ff",
    hexHover: "white",
    textColor: "text-brand-800",
    textHover: "hover:text-white",
  },
};

type LinkProps = PropsWithChildren<{
  url: string;
  color?: LinkColor;
}>;

type ImgUrlProps = LinkProps & {
  alt: string;
  imageUrl: string;
};

type ImgContentProps = LinkProps & {
  alt: string;
  imageContent: FunctionComponent;
};

type Props = ImgUrlProps | ImgContentProps;

const Link: FunctionComponent<Props> = (props) => {
  return (
    <a
      href={props.url}
      className={classNames(
        "grid",
        "grid-flow-col",
        "justify-start",
        "gap-2",
        "items-center",
        "transition-colors",
        "ease-in-out",
        "duration-75",
        props?.color && Colors[props.color].textColor,
        props?.color && `${Colors[props.color].textHover}`
      )}
      target="_blank"
      rel="noreferrer"
      style={
        props.color
          ? ({
              "--path-color": Colors[props.color].hex,
              "--path-hover-color": Colors[props.color].hexHover,
            } as CSSProperties)
          : undefined
      }
    >
      {"imageContent" in props && <props.imageContent />}
      {"imageUrl" in props && (
        <img className="w-5" src={props.imageUrl} alt={props.alt} />
      )}
      {props.children}
    </a>
  );
};

export default Link;
