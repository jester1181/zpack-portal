import Image from "next/image";
import { gameInfo } from "@/data/games";

// 🔁 Replace the broken import with a local type
export type Server = {
  uuid: string;
  name: string;
  game: string;
  variant?: string;
  status?: string;
};

type Props = {
  servers: Server[];
  onAction: (uuid: string, action: string) => void;
  onConsole: (uuid: string) => void;
  onUpgrade: (uuid: string) => void;
};

const GroupedServerList = ({ servers, onAction, onConsole, onUpgrade }: Props) => {
  const grouped = servers.reduce<Record<string, Server[]>>((acc, server) => {
    const game = server.game || "Unknown";
    if (!acc[game]) acc[game] = [];
    acc[game].push(server);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([game, servers]) => {
        const gameData = gameInfo[game];
        return (
          <div key={game}>
            <div className="flex items-center space-x-3 mb-4">
              {gameData?.image && (
                <Image
                  src={gameData.image}
                  alt={game}
                  width={64}
                  height={64}
                  className="rounded"
                />
              )}
              <h2 className="text-2xl text-electricBlue font-bold">{game}</h2>
            </div>
            <ul className="space-y-4">
              {servers.map((server) => (
                <li
                  key={server.uuid}
                  className="bg-darkGray p-4 rounded shadow-subtle flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-bold">{server.name}</p>
                    <p className="text-sm text-gray-400">{server.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-electricBlue text-black rounded hover:bg-electricBlueLight transition"
                      onClick={() => onConsole(server.uuid)}
                    >
                      Go to Console
                    </button>
                    <button
                      className="px-3 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => onUpgrade(server.uuid)}
                    >
                      Upgrade
                    </button>
                    {["start", "stop", "restart"].map((action) => (
                      <button
                        key={action}
                        onClick={() => onAction(server.uuid, action)}
                        className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                      >
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default GroupedServerList;
