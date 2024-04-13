import Participant from "./participant";

// TODO: move to model
export type TParticipant = {
  name: string;
  value: boolean | string;
};

type Props = {
  participants: TParticipant[];
};

const Participants: React.FC<Props> = ({ participants }) => {
  return (
    <div className="mt-4 flex gap-4 ">
      {participants.map((el, index) => (
        <Participant key={index} data={el} />
      ))}
    </div>
  );
};

export default Participants;
