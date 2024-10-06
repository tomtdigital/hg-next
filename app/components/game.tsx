"use client";

import { FC, useEffect, useState } from "react";

type GameProps = {
  game: Fetched<Game>;
};

export const Game: FC<GameProps> = ({ game }) => {
  // const session = useSessionStart(game?._id);
  // console.log(session);
  const newSession: RequireOnly<GameSession, "game" | "gameData"> = {
    game: game?._id || "",
    gameData: {
      stage: 0,
      cluesRevealed: [],
      score: 0,
      lastCompletedGrid: [],
      finishedGrids: [],
      solutionGuess: "",
      correctSolution: false,
      gameComplete: false,
    },
  };
  const [initialised, setInitialised] = useState(false);
  const [session, setSession] = useState(newSession);
  const storageKey = `hg-${session.game ? session.game + "-" : "-"}session`;

  // TODO: move to hook if appropriate

  useEffect(() => {
    async function retrieveSession() {
      // First check for a session in local storage
      let localSession;
      const maskedError = "something went wrong";
      const localSessionString = localStorage.getItem(storageKey);
      if (localSessionString) localSession = JSON.parse(localSessionString);
      // Next get or create a session in the DB;
      try {
        const getRes = await fetch(`/api/user-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // ...using localStorage or the default
          body: localSessionString ?? JSON.stringify(session),
        });

        if (!getRes.ok) {
          throw new Error(maskedError);
        }

        const dbSession: Fetched<GameSession> = await getRes.json();
        // if local storage, save useState session as localStorage...
        if (localSession) {
          setSession(localSession);
          // then update the DB session with this in case of offline activity
          try {
            const updateRes = await fetch(`/api/user-session`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              // ...using localStorage
              body: localSessionString,
            });
            // Mask backend error
            if (!updateRes.ok) {
              throw new Error(maskedError);
            }
          } catch (error: unknown) {
            throw new Error(maskedError);
          }
        } else {
          // If no local session, transform the DB session...
          const data = {
            ...session,
            gameData: dbSession?.gameData ?? session.gameData,
          };
          // ...save it to localStorage and...
          localStorage.setItem(storageKey, JSON.stringify(data));
          // ...update useState session with this
          setSession(data);
        }
      } catch (error: unknown) {
        throw new Error(maskedError);
      }
    }
    if (!initialised) retrieveSession();
    setInitialised(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize the store with the product information
  // const store = useAppStore()
  // const initialized = useRef(false)
  // if (!initialized.current) {
  //   store.dispatch(initialiseSession(product))
  //   initialized.current = true
  // }
  // const name = useAppSelector(state => state.product.name)
  // const dispatch = useAppDispatch()

  return (
    <>
      <div>Game Component</div>
    </>
  );
};
