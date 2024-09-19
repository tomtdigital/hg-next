"use server";

import { GamePreviews, fetchGamePreview } from "@/app/api/data/games";
import { getCachedUser } from "@/app/api/data/user";
import { PreviewLink } from "@/app/components/preview-link";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Session } from "next-auth";
import Link from "next/link";
import { formatDate } from "@/app/utils/format-date";

export default async function GamesPreview() {
  const user: Fetched<Session["user"]> = await getCachedUser();
  const premiumMember: Fetched<boolean> = user?.premium;
  const gamePreviews: Fetched<GamePreviews> = await fetchGamePreview();
  const freeGames: Fetched<GamePreview[]> = gamePreviews?.freeGames;
  const premiumGames: Fetched<GamePreview[]> = gamePreviews?.premiumGames;

  return (
    <div className="text-center">
      {freeGames && freeGames?.length > 0 ? (
        <>
          <p>Free</p>
          <div className="w-full flex items-center">
            {freeGames.map((game: GamePreview) => {
              const date = formatDate(game.publishDate);
              return (
                <PreviewLink key={game._id} href={`/game/${game._id}`}>
                  {date}
                </PreviewLink>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p>No free games detected</p>
        </>
      )}
      {premiumGames && premiumGames?.length > 0 ? (
        <div className="mt-[2em]">
          <span className={clsx({ "flex justify-center": !premiumMember })}>
            <p className={clsx({ "block mr-3": !premiumMember })}>Premium</p>
            {!premiumMember && <LockClosedIcon className="block w-5 max-w-4" />}
          </span>
          <div className="w-full flex items-center">
            {premiumGames.map((game: GamePreview) => {
              const date = formatDate(game.publishDate);
              return premiumMember ? (
                <PreviewLink
                  key={game._id}
                  className="bg-purple-500 hover:bg-purple-600"
                  href={`/game/${game._id}`}
                >
                  {date}
                </PreviewLink>
              ) : (
                <span
                  key={game._id}
                  className="m-1 bg-gray-700 text-white block w-[8em] text-center p-4 rounded-[10em]"
                >
                  <p className="block">{date}</p>
                </span>
              );
            })}
          </div>
          <div className="mt-[1em]">
            {premiumMember ? (
              <Link href="/games/premium" className="text-yellow-400">
                View all
              </Link>
            ) : (
              <Link href="/upgrade" className="text-yellow-400">
                Upgrade today!
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <p>No premium games detected</p>
        </>
      )}
    </div>
  );
}
