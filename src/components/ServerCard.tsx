import Image from "next/image";
import { gameInfo } from "@/data/games";

type ServerCardProps = {
  name: string;
  game: string;
  status: string;
  children: React.ReactNode;
};

const ServerCard = ({ name, game, status, children }: ServerCardProps) => {
    const normalizedKey = typeof game === "string"
    ? game.toLowerCase().replace(/\s+/g, "_")
    : "fallback";
  const gameData = gameInfo[normalizedKey] || gameInfo["fallback"];    
  console.log("🧠 Raw game key:", game);

  const statusColor = {
    online: "text-electricBlueLight",
    offline: "text-dangerRed",
    starting: "text-electricBlueLight",
    stopping: "text-gray-400",
    suspended: "text-dangerRed",
    unknown: "text-gray-400",
  }[status || "unknown"];

  return (
    <div className="flex items-center bg-darkGray rounded-lg shadow-subtle overflow-hidden p-3 w-full">
      {/* Game Thumbnail */}
      <div className="relative w-52 h-50 rounded overflow-hidden flex-shrink-0">
      <Image
  src={gameData.image}
  alt={gameData.name}
  width={428}
  height={400}
  className="rounded object-cover"
  priority
/>

      </div>

      {/* Server Info */}
      <div className="flex flex-col justify-center ml-4 flex-grow">
        <p className="text-lightGray font-semibold text-base leading-tight">
          {name}
        </p>
        <span className={`text-sm font-medium mt-1 ${statusColor}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-center">{children}</div>
    </div>
  );
};

export default ServerCard;
