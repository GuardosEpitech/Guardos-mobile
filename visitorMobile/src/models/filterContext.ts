import { createContext } from "react";
import { ISearchCommunication } from "../../../shared/models/communicationInterfaces";

export const FilterContext = createContext<{
    filter: ISearchCommunication;
    setFilter: React.Dispatch<React.SetStateAction<ISearchCommunication>>;
  }>({
    filter: {}, 
    setFilter: () => {},
  });