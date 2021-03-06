import { GameTablesState } from "./state";
import { TGameTablesAction, GAME_TABLES } from "./types";
import {
  GameTablesResponse,
  GameTablesSuccessResponse,
} from "../../response/GameTablesResponse";
import { ErrorResponse } from "../../response/ErrorResponse";
import GameTable from "../../domain/GameTable";

function gameTablesReducer(
  state: GameTablesState,
  response: GameTablesResponse
): GameTablesState {
  if ((response as ErrorResponse).errorMessage) {
    return state;
  }

  return {
    ...state,
    gameTables: (response as GameTablesSuccessResponse).gameTables
      .sort((a, b) => b.id - a.id)
      .map((gameTableObj) => {
        return GameTable.from(gameTableObj);
      }),
  };
}

export default (
  state: GameTablesState,
  action: TGameTablesAction
): GameTablesState => {
  const response = action.payload;
  switch (action.type) {
    case GAME_TABLES:
      return gameTablesReducer(state, response);
    default:
      return state;
  }
};
