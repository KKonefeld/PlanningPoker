import { cn } from "@/lib/utils";

type Props = {
  label: string;
  onClick: (card: string) => void;
  isChosen: boolean;
};

const DeckCard: React.FC<Props> = ({ label, onClick, isChosen }) => {
  return (
    <div className="group" onClick={() => onClick(label)}>
      <div
        className={cn(
          "transition-color flex aspect-[2/3] h-24 items-center justify-center rounded-lg border-2 text-lg font-semibold transition-transform ",
          isChosen
            ? "translate-y-[-0.5rem] border-background2 bg-accent text-background2"
            : "border-accent bg-background2 text-accent  group-hover:translate-y-[-0.5rem]",
        )}
      >
        {label}
      </div>
    </div>
  );
};

export default DeckCard;
