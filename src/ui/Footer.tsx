import classNames from "classnames";
import Assets from "../lib/assets";
import Link from "./Link";

const Footer = () => (
  <div className={classNames("ts-footer")}>
    <ul
      className={classNames(
        "grid grid-flow-col",
        "justify-center",
        "items-center",
        "gap-16"
      )}
    >
      <li>
        <Link
          url="https://github.com/teetow/tvspy"
          color="brand"
          alt="GitHub logo"
          imageContent={Assets.github}
        >
          TVSpy repository
        </Link>
      </li>
      <li>
        <Link
          url="https://github.com/teetow/"
          color="brand"
          alt="GitHub logo"
          imageContent={Assets.github}
        >
          Teetow on GitHub
        </Link>
      </li>
      <li>
        <Link
          url="https://soundcloud.com/teetow"
          color="brand"
          alt="GitHub logo"
          imageContent={Assets.soundcloud}
        >
          Teetow on SoundCloud
        </Link>
      </li>
    </ul>
  </div>
);

export default Footer;
