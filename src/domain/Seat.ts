import { SeatName } from "./SeatName";
import Card from "./Card";

export class Seat {
  seatName: SeatName;
  playCard?: Card;
  faceCards: Card[] = [];
  hands: Card[] = [];
  score = 0;
  isLastLapWinner = false;

  constructor(
    seatName: SeatName,
    playCard?: Card,
    faceCards: Card[] = [],
    hands: Card[] = [],
    score = 0,
    isLastLapWinner = false
  ) {
    this.seatName = seatName;
    this.playCard = playCard;
    this.faceCards = faceCards;
    this.hands = hands;
    this.score = score;
    this.isLastLapWinner = isLastLapWinner;
  }

  static from(seatObj: Seat): Seat {
    return new Seat(
      seatObj.seatName,
      seatObj.playCard && Card.fromObj(seatObj.playCard),
      seatObj.faceCards.map(Card.fromObj),
      seatObj.hands.map(Card.fromObj),
      seatObj.score,
      seatObj.isLastLapWinner
    );
  }
}
