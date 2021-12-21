type Props = {
  shows: string[];
  onSetShows: (shows: string[]) => void;
};

const Picker = ({ shows, onSetShows }: Props) => {
  return <div className="ts-picker"></div>;
};

export default Picker;
