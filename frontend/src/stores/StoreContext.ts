import React, { createContext } from "react";
import chatStore from "./ChatStore";

export const StoreContext = createContext(chatStore);
