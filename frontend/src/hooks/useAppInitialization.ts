import { useEffect, useState } from "react";
import { useValidateCookie } from "../api/queries";
import { useSearchUsers } from "../api/queries";
import { useChatStore } from "../stores/state";

export const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { mutate: validateCookie } = useValidateCookie();
  const { restoreFromURL, isLoggedIn } = useChatStore();

  const urlParams = new URLSearchParams(window.location.search);
  const chatUsername = urlParams.get("chat");
  const { data: searchData } = useSearchUsers(chatUsername || "");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          validateCookie(undefined, {
            onSuccess: () => resolve(),
            onError: () => reject(),
          });
        });

        if (chatUsername && searchData?.users && isLoggedIn) {
          restoreFromURL(searchData.users);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("App initialization error:", error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [validateCookie, chatUsername, searchData, restoreFromURL, isLoggedIn]);

  return { isInitialized };
};
