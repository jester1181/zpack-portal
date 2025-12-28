import Image from "next/image";
import { gameInfo } from "@/data/games";

type GameCardProps = {
  gameKey: string;
  serverName?: string;
  status?: "online" | "offline" | "installing";
};

const GameCard = ({ gameKey, serverName, status }: GameCardProps) => {
  const game = gameInfo[gameKey] || gameInfo["fallback"];

  const statusColor = {
    online: "text-electricBlueLight",
    offline: "text-dangerRed",
    installing: "text-electricBlue",
  }[status || "offline"];

  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg bg-gray-800 shadow-subtle transition hover:shadow-hover-glow">
      <div className="relative w-full h-36">
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover rounded-t-lg"
          priority
        />
      </div>
      <div className="p-4 min-h-[90px] flex flex-col justify-center items-center text-center">
        <h3 className="text-white text-lg font-semibold break-words leading-tight">
          {serverName || game.name}
        </h3>
        <p className={`text-sm font-medium mt-1 ${statusColor}`}>
          {status?.toUpperCase() || "OFFLINE"}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
