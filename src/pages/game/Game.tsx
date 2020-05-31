import * as React from "react";
import * as PropTypes from "prop-types";

import { Container, Button, makeStyles, createStyles } from "@material-ui/core";
import { SeatsContext, SeatsDispatchContext } from "../../ducks/seats/Context";
import { MyGameContext } from "../../ducks/my_game/Context";
import MyGameSight from "../../domain/MyGameSight";
import GameTable from "../../domain/GameTable";
import { SeatName } from "../../domain/SeatName";
import { PlayingStage } from "./playing/PlayingStage";
import { DeclarationStage } from "./declaring/DeclarationStage";
import { LeaveButton } from "../../ducks/my_game/LeaveButton";
import {
  DeclarationContext,
  DeclarationDispatchContext,
} from "../../ducks/declaration/Context";
import { RoundContext, RoundDispatchContext } from "../../ducks/round/Context";
import Card from "../../domain/Card";

import { DebugSwitchSeat } from "./DebugSwitchSeat";

const useStyles = makeStyles(() =>
  createStyles({
    game: {
      display: "flex",
      flexDirection: "column",
    },
  })
);

type GamePageProp = {
  gameTable: GameTable;
};
export const GamePage: React.FC<GamePageProp> = (props: GamePageProp) => {
  const classes = useStyles();
  const [isShowCards, setIsShowCards] = React.useState(false);

  const myGameState = React.useContext(MyGameContext);
  const { seats } = React.useContext(SeatsContext);
  const { declaration } = React.useContext(DeclarationContext);
  const { round } = React.useContext(RoundContext);

  const seatsActions = React.useContext(SeatsDispatchContext);
  const declarationActions = React.useContext(DeclarationDispatchContext);
  const roundActions = React.useContext(RoundDispatchContext);

  const gameTableId = myGameState.gameTableId;

  React.useEffect(() => {
    seatsActions.readSeats(gameTableId);
    roundActions.readRound(gameTableId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myGameSight = new MyGameSight(myGameState.mySeatName, seats || []);
  React.useEffect(() => {
    if (!seats) return;
    if (seats.every((seat) => seat.playCard)) {
      setTimeout(() => {
        seatsActions.readSeats(gameTableId);
      }, 1000);
    }
  }, [gameTableId, seats, seatsActions]);

  if (!seats) {
    return <Container>empty</Container>;
  }

  const gameTable = props.gameTable;

  const findName = (seatName: SeatName): string => gameTable.findName(seatName);
  const onPlayCard = (card: Card, seatName: SeatName): void => {
    seatsActions.playCard(gameTableId, card, seatName);
  };
  const onHandOut = (): void => {
    roundActions.startRound(gameTableId);
    setIsShowCards(false);
  };

  return (
    <Container className={classes.game}>
      <div>
        <Button variant="contained" color="primary" onClick={onHandOut}>
          カードを配る
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={(): void => setIsShowCards(true)}
        >
          全員の手札を開く
        </Button>
        <LeaveButton
          gameTableIdToLeave={gameTableId}
          myGameState={myGameState}
        />
        <DebugSwitchSeat gameTableId={gameTableId} />
      </div>
      {declaration.isDeclared() ? (
        <PlayingStage
          gameSight={myGameSight}
          findName={findName}
          discards={declaration.discards}
          onPlayCard={onPlayCard}
          isShowCards={isShowCards}
        />
      ) : (
        <DeclarationStage
          gameSight={myGameSight}
          findName={findName}
          openCards={round.openCards}
          isOpened={round.isOpened}
          onOpen={(): void => roundActions.open(gameTableId)}
          declare={declarationActions.declare}
          isShowCards={isShowCards}
        />
      )}
    </Container>
  );
};

GamePage.propTypes = {
  gameTable: PropTypes.instanceOf(GameTable).isRequired,
};
