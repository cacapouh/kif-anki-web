import { handPieceTypes, ImmutableHand, PieceType } from "@/shogi";
import {
  Color,
  Move,
  Piece,
  ImmutablePosition,
  reverseColor,
  Square,
} from "@/shogi";
import preloadImage from "@/assets/preload";
import { RectSize } from "@/components/primitive/Types";

export enum BoardLayoutType {
  HITOMOJI = "hitomoji",
  HITOMOJI_GOTHIC = "hitomojiGothic",
}

type LayoutTemplate = {
  images: {
    board: string;
    black: {
      pawn: string;
      lance: string;
      knight: string;
      silver: string;
      gold: string;
      bishop: string;
      rook: string;
      king: string;
      king2: string;
      promPawn: string;
      promLance: string;
      promKnight: string;
      promSilver: string;
      horse: string;
      dragon: string;
    };
    white: {
      pawn: string;
      lance: string;
      knight: string;
      silver: string;
      gold: string;
      bishop: string;
      rook: string;
      king: string;
      king2: string;
      promPawn: string;
      promLance: string;
      promKnight: string;
      promSilver: string;
      horse: string;
      dragon: string;
    };
  };
  frame: {
    width: number;
    height: number;
  };
  board: {
    x: number;
    y: number;
    width: number;
    height: number;
    squreWidth: number;
    squreHeight: number;
    leftSquarePadding: number;
    topSquarePadding: number;
    leftPiecePadding: number;
    topPiecePadding: number;
    highlight: {
      selected: { [key: string]: string };
      lastMove: { [key: string]: string };
    };
  };
  piece: {
    width: number;
    height: number;
  };
  hand: {
    color: string;
    black: {
      x: number;
      y: number;
    };
    white: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
    highlight: {
      selected: { [key: string]: string };
    };
  };
  turn: {
    black: {
      x: number;
      y: number;
    };
    white: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
    fontSize: number;
  };
  playerName: {
    black: {
      x: number;
      y: number;
    };
    white: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
    fontSize: number;
  };
  clock: {
    black: {
      x: number;
      y: number;
    };
    white: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
    fontSize: number;
  };
  control: {
    left: {
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize: number;
    };
    right: {
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize: number;
    };
  };
};

const templateCommon = {
  frame: {
    width: 1471,
    height: 959,
  },
  board: {
    // original image size: 878x960
    x: 296.5,
    y: 0,
    width: 878,
    height: 960,
    squreWidth: 94.8,
    squreHeight: 104,
    leftSquarePadding: 12,
    topSquarePadding: 12.2,
    leftPiecePadding: 17.5,
    topPiecePadding: 18.5,
    highlight: {
      selected: { "background-color": "#ff4800", opacity: "0.7" },
      lastMove: { "background-color": "#00ddff", opacity: "0.5" },
    },
  },
  piece: {
    // original image size: 88x93
    width: 88,
    height: 93,
  },
  hand: {
    color: "#8b4513",
    black: {
      x: 1184,
      y: 600,
    },
    white: {
      x: 0,
      y: 0,
    },
    width: 288,
    height: 360,
    highlight: {
      selected: { "background-color": "#ff4800", opacity: "0.7" },
    },
  },
  turn: {
    black: {
      x: 1184,
      y: 425,
    },
    white: {
      x: 0,
      y: 492,
    },
    width: 288,
    height: 45,
    fontSize: 32,
  },
  playerName: {
    black: {
      x: 1184,
      y: 480,
    },
    white: {
      x: 0,
      y: 370,
    },
    width: 288,
    height: 45,
    fontSize: 25,
  },
  clock: {
    black: {
      x: 1184,
      y: 535,
    },
    white: {
      x: 0,
      y: 425,
    },
    width: 288,
    height: 55,
    fontSize: 40,
  },
  control: {
    left: {
      x: 0,
      y: 547,
      width: 288,
      height: 412,
      fontSize: 26,
    },
    right: {
      x: 1184,
      y: 0,
      width: 288,
      height: 412,
      fontSize: 26,
    },
  },
};

const templates: { [key: string]: LayoutTemplate } = {
  hitomoji: {
    ...templateCommon,
    images: {
      board: "./board/default.png",
      black: {
        pawn: "./piece/hitomoji/black_pawn.png",
        lance: "./piece/hitomoji/black_lance.png",
        knight: "./piece/hitomoji/black_knight.png",
        silver: "./piece/hitomoji/black_silver.png",
        gold: "./piece/hitomoji/black_gold.png",
        bishop: "./piece/hitomoji/black_bishop.png",
        rook: "./piece/hitomoji/black_rook.png",
        king: "./piece/hitomoji/black_king.png",
        king2: "./piece/hitomoji/black_king2.png",
        promPawn: "./piece/hitomoji/black_prom_pawn.png",
        promLance: "./piece/hitomoji/black_prom_lance.png",
        promKnight: "./piece/hitomoji/black_prom_knight.png",
        promSilver: "./piece/hitomoji/black_prom_silver.png",
        horse: "./piece/hitomoji/black_horse.png",
        dragon: "./piece/hitomoji/black_dragon.png",
      },
      white: {
        pawn: "./piece/hitomoji/white_pawn.png",
        lance: "./piece/hitomoji/white_lance.png",
        knight: "./piece/hitomoji/white_knight.png",
        silver: "./piece/hitomoji/white_silver.png",
        gold: "./piece/hitomoji/white_gold.png",
        bishop: "./piece/hitomoji/white_bishop.png",
        rook: "./piece/hitomoji/white_rook.png",
        king: "./piece/hitomoji/white_king.png",
        king2: "./piece/hitomoji/white_king2.png",
        promPawn: "./piece/hitomoji/white_prom_pawn.png",
        promLance: "./piece/hitomoji/white_prom_lance.png",
        promKnight: "./piece/hitomoji/white_prom_knight.png",
        promSilver: "./piece/hitomoji/white_prom_silver.png",
        horse: "./piece/hitomoji/white_horse.png",
        dragon: "./piece/hitomoji/white_dragon.png",
      },
    },
  },
  hitomojiGothic: {
    ...templateCommon,
    images: {
      board: "./board/default.png",
      black: {
        pawn: "./piece/hitomoji_gothic/black_pawn.png",
        lance: "./piece/hitomoji_gothic/black_lance.png",
        knight: "./piece/hitomoji_gothic/black_knight.png",
        silver: "./piece/hitomoji_gothic/black_silver.png",
        gold: "./piece/hitomoji_gothic/black_gold.png",
        bishop: "./piece/hitomoji_gothic/black_bishop.png",
        rook: "./piece/hitomoji_gothic/black_rook.png",
        king: "./piece/hitomoji_gothic/black_king.png",
        king2: "./piece/hitomoji_gothic/black_king2.png",
        promPawn: "./piece/hitomoji_gothic/black_prom_pawn.png",
        promLance: "./piece/hitomoji_gothic/black_prom_lance.png",
        promKnight: "./piece/hitomoji_gothic/black_prom_knight.png",
        promSilver: "./piece/hitomoji_gothic/black_prom_silver.png",
        horse: "./piece/hitomoji_gothic/black_horse.png",
        dragon: "./piece/hitomoji_gothic/black_dragon.png",
      },
      white: {
        pawn: "./piece/hitomoji_gothic/white_pawn.png",
        lance: "./piece/hitomoji_gothic/white_lance.png",
        knight: "./piece/hitomoji_gothic/white_knight.png",
        silver: "./piece/hitomoji_gothic/white_silver.png",
        gold: "./piece/hitomoji_gothic/white_gold.png",
        bishop: "./piece/hitomoji_gothic/white_bishop.png",
        rook: "./piece/hitomoji_gothic/white_rook.png",
        king: "./piece/hitomoji_gothic/white_king.png",
        king2: "./piece/hitomoji_gothic/white_king2.png",
        promPawn: "./piece/hitomoji_gothic/white_prom_pawn.png",
        promLance: "./piece/hitomoji_gothic/white_prom_lance.png",
        promKnight: "./piece/hitomoji_gothic/white_prom_knight.png",
        promSilver: "./piece/hitomoji_gothic/white_prom_silver.png",
        horse: "./piece/hitomoji_gothic/white_horse.png",
        dragon: "./piece/hitomoji_gothic/white_dragon.png",
      },
    },
  },
};

const handLaytoutRule = {
  black: {
    pawn: { row: 3, column: 0, width: 2 },
    lance: { row: 2, column: 0, width: 1 },
    knight: { row: 2, column: 1, width: 1 },
    silver: { row: 1, column: 0, width: 1 },
    gold: { row: 1, column: 1, width: 1 },
    bishop: { row: 0, column: 0, width: 1 },
    rook: { row: 0, column: 1, width: 1 },
    king: { row: 0, column: 0, width: 0 },
    promPawn: { row: 0, column: 0, width: 0 },
    promLance: { row: 0, column: 0, width: 0 },
    promKnight: { row: 0, column: 0, width: 0 },
    promSilver: { row: 0, column: 0, width: 0 },
    horse: { row: 0, column: 0, width: 0 },
    dragon: { row: 0, column: 0, width: 0 },
  },
  white: {
    pawn: { row: 0, column: 0, width: 2 },
    lance: { row: 1, column: 1, width: 1 },
    knight: { row: 1, column: 0, width: 1 },
    silver: { row: 2, column: 1, width: 1 },
    gold: { row: 2, column: 0, width: 1 },
    bishop: { row: 3, column: 1, width: 1 },
    rook: { row: 3, column: 0, width: 1 },
    king: { row: 0, column: 0, width: 0 },
    promPawn: { row: 0, column: 0, width: 0 },
    promLance: { row: 0, column: 0, width: 0 },
    promKnight: { row: 0, column: 0, width: 0 },
    promSilver: { row: 0, column: 0, width: 0 },
    horse: { row: 0, column: 0, width: 0 },
    dragon: { row: 0, column: 0, width: 0 },
  },
};

type FrameLayout = {
  style: { [key: string]: string };
};

type BoardLayout = {
  imagePath: string;
  x: number;
  y: number;
  style: { [key: string]: string };
};

type PieceLayout = {
  id: string;
  imagePath: string;
  style: { [key: string]: string };
};

type SquareLayout = {
  id: number;
  file: number;
  rank: number;
  style: { [key: string]: string };
  backgroundStyle: { [key: string]: string };
};

type HandPieceLayout = {
  id: string;
  imagePath: string;
  style: { [key: string]: string };
};

type HandPointerLayout = {
  id: string;
  type: string;
  style: { [key: string]: string };
  backgroundStyle: { [key: string]: string };
};

type HandLayout = {
  style: { [key: string]: string };
  pieces: HandPieceLayout[];
  pointers: HandPointerLayout[];
};

type PromotionLayout = {
  promoteImagePath: string;
  notPromoteImagePath: string;
  style: { [key: string]: string };
};

type TurnLayout = {
  style: { [key: string]: string };
};

type PlayerNameLayout = {
  style: { [key: string]: string };
};

type ClockLayout = {
  style: { [key: string]: string };
};

type ControlLayout = {
  left: {
    style: { [key: string]: string };
  };
  right: {
    style: { [key: string]: string };
  };
};

export type FullLayout = {
  frame: FrameLayout;
  board: BoardLayout;
  piece: PieceLayout[];
  square: SquareLayout[];
  blackHand: HandLayout;
  whiteHand: HandLayout;
  promotion: PromotionLayout | null;
  turn: TurnLayout;
  blackPlayerName: PlayerNameLayout;
  whitePlayerName: PlayerNameLayout;
  blackClock: ClockLayout;
  whiteClock: ClockLayout;
  control: ControlLayout;
};

export default class LayoutBuilder {
  private template: LayoutTemplate;

  constructor(layoutType: BoardLayoutType) {
    this.template =
      templates[layoutType] || templates[BoardLayoutType.HITOMOJI];
  }

  preload(): void {
    preloadImage(this.template.images.board);
    Object.values(this.template.images.black).forEach(preloadImage);
    Object.values(this.template.images.white).forEach(preloadImage);
  }

  build(
    upperSizeLimit: RectSize,
    position: ImmutablePosition,
    lastMove: Move | null | undefined,
    pointer: Square | Piece | null | undefined,
    reservedMoveForPromotion: Move | null | undefined,
    flip?: boolean
  ): FullLayout {
    let ratio = upperSizeLimit.width / this.template.frame.width;
    if (this.template.frame.height * ratio > upperSizeLimit.height) {
      ratio = upperSizeLimit.height / this.template.frame.height;
    }

    const buildFrameLayout = (): FrameLayout => {
      return {
        style: {
          height: this.template.frame.height * ratio + "px",
          width: this.template.frame.width * ratio + "px",
        },
      };
    };

    const buildBoardLayout = (): BoardLayout => {
      const imagePath = this.template.images.board;
      const x = this.template.board.x * ratio;
      const y = this.template.board.y * ratio;
      const width = this.template.board.width * ratio;
      const height = this.template.board.height * ratio;
      const style = {
        left: x + "px",
        top: y + "px",
        height: height + "px",
        width: width + "px",
      };
      return {
        imagePath,
        x,
        y,
        style,
      };
    };

    const buildPieceLayout = (boardLayout: BoardLayout): PieceLayout[] => {
      const layouts: PieceLayout[] = [];
      position.board.listNonEmptySquares().forEach((square) => {
        const piece = position.board.at(square) as Piece;
        const id = piece.id + square.index;
        const displayColor = flip ? reverseColor(piece.color) : piece.color;
        const pieceType =
          piece.type == PieceType.KING && piece.color == Color.BLACK
            ? "king2"
            : piece.type;
        const imagePath = this.template.images[displayColor][pieceType];
        const x =
          boardLayout.x +
          (this.template.board.leftPiecePadding +
            this.template.board.squreWidth *
              (flip ? square.opposite : square).x) *
            ratio;
        const y =
          boardLayout.y +
          (this.template.board.topPiecePadding +
            this.template.board.squreHeight *
              (flip ? square.opposite : square).y) *
            ratio;
        const width = this.template.piece.width * ratio;
        const height = this.template.piece.height * ratio;
        layouts.push({
          id,
          imagePath,
          style: {
            left: x + "px",
            top: y + "px",
            width: width + "px",
            height: height + "px",
          },
        });
      });
      return layouts;
    };

    const buildSquareLayout = (boardLayout: BoardLayout): SquareLayout[] => {
      const layouts: SquareLayout[] = [];
      Square.all.forEach((square) => {
        const id = square.index;
        const { file } = square;
        const { rank } = square;
        const x =
          boardLayout.x +
          (this.template.board.leftSquarePadding +
            this.template.board.squreWidth *
              (flip ? square.opposite : square).x) *
            ratio;
        const y =
          boardLayout.y +
          (this.template.board.topSquarePadding +
            this.template.board.squreHeight *
              (flip ? square.opposite : square).y) *
            ratio;
        const width = this.template.board.squreWidth * ratio;
        const height = this.template.board.squreHeight * ratio;
        const style = {
          left: x + "px",
          top: y + "px",
          width: width + "px",
          height: height + "px",
        };
        let backgroundStyle = style;
        if (lastMove && square.equals(lastMove.to)) {
          backgroundStyle = {
            ...backgroundStyle,
            ...this.template.board.highlight.lastMove,
          };
        }
        if (pointer instanceof Square && pointer.equals(square)) {
          backgroundStyle = {
            ...backgroundStyle,
            ...this.template.board.highlight.selected,
          };
        }
        layouts.push({
          id,
          file,
          rank,
          style,
          backgroundStyle,
        });
      });
      return layouts;
    };

    const buildHandLayout = (color: Color, hand: ImmutableHand): HandLayout => {
      const displayColor = flip ? reverseColor(color) : color;
      const standX = this.template.hand[displayColor].x * ratio;
      const standY = this.template.hand[displayColor].y * ratio;
      const standWidth = this.template.hand.width * ratio;
      const standHeight = this.template.hand.height * ratio;
      const standStyle = {
        "background-color": this.template.hand.color,
        left: standX + "px",
        top: standY + "px",
        width: standWidth + "px",
        height: standHeight + "px",
      };
      const pieces: HandPieceLayout[] = [];
      const pointers: HandPointerLayout[] = [];
      handPieceTypes.forEach((type) => {
        const count = hand.count(type);
        const rule = handLaytoutRule[displayColor][type];
        const areaWidth = (this.template.hand.width / 2) * rule.width * ratio;
        const areaHeight = (this.template.hand.height / 4) * ratio;
        const areaX = areaWidth * rule.column;
        const areaY = areaHeight * rule.row;
        const pieceWidth = this.template.piece.width * ratio;
        const pieceHeight = this.template.piece.height * ratio;
        const padding =
          Math.max(areaWidth - pieceWidth * count, 0) / (count * 2);
        const dx =
          (areaWidth - pieceWidth - padding * 2) / Math.max(count - 1, 1);
        for (let i = count - 1; i >= 0; i -= 1) {
          const id = type + i;
          const imagePath = this.template.images[displayColor][type];
          const x = areaX + padding + dx * i;
          const y = areaY;
          pieces.push({
            id,
            imagePath,
            style: {
              left: x + "px",
              top: y + "px",
              width: pieceWidth + "px",
              height: pieceHeight + "px",
            },
          });
        }
        const id = type;
        const style = {
          left: areaX + "px",
          top: areaY + "px",
          width: areaWidth + "px",
          height: areaHeight + "px",
        };
        let backgroundStyle = style;
        if (
          pointer &&
          pointer instanceof Piece &&
          pointer.color === color &&
          pointer.type === type
        ) {
          backgroundStyle = {
            ...backgroundStyle,
            ...this.template.hand.highlight.selected,
          };
        }
        pointers.push({
          id,
          type,
          style,
          backgroundStyle,
        });
      });
      return {
        style: standStyle,
        pieces,
        pointers,
      };
    };

    const buildPromotionLayout = (
      boardLayout: BoardLayout,
      move: Move | null | undefined
    ): PromotionLayout | null => {
      if (!move) {
        return null;
      }
      const color = flip ? reverseColor(move.color) : move.color;
      const square = flip ? move.to.opposite : move.to;
      const piece = new Piece(color, move.pieceType);
      const promoted = piece.promoted();
      const notPromoted = piece.unpromoted();
      const promoteImagePath = this.template.images[color][promoted.type];
      const notPromoteImagePath = this.template.images[color][notPromoted.type];
      const x =
        boardLayout.x +
        (this.template.board.leftSquarePadding +
          this.template.board.squreWidth * (square.x - 0.5)) *
          ratio;
      const y =
        boardLayout.y +
        (this.template.board.topSquarePadding +
          this.template.board.squreHeight * square.y) *
          ratio;
      const width = this.template.board.squreWidth * 2 * ratio;
      const height = this.template.board.squreHeight * ratio;
      const style = {
        left: x + "px",
        top: y + "px",
        width: width + "px",
        height: height + "px",
        "font-size": height / 4 + "px",
      };
      return {
        promoteImagePath,
        notPromoteImagePath,
        style,
      };
    };

    const buildTurnLayout = (): TurnLayout => {
      const color = position.color;
      const displayColor = flip ? reverseColor(color) : color;
      const borderWidth = 2;
      return {
        style: {
          left: this.template.turn[displayColor].x * ratio - borderWidth + "px",
          top: this.template.turn[displayColor].y * ratio - borderWidth + "px",
          width: this.template.turn.width * ratio - borderWidth + "px",
          height: this.template.turn.height * ratio - borderWidth + "px",
          "font-size": this.template.turn.fontSize * ratio + "px",
          "border-radius": this.template.turn.height * ratio * 0.4 + "px",
          "border-width": borderWidth + "px",
          "border-style": "solid",
        },
      };
    };

    const buildPlayerNameLayout = (color: Color): PlayerNameLayout => {
      const displayColor = flip ? reverseColor(color) : color;
      return {
        style: {
          left: this.template.playerName[displayColor].x * ratio + "px",
          top: this.template.playerName[displayColor].y * ratio + "px",
          width: this.template.playerName.width * ratio + "px",
          height: this.template.playerName.height * ratio + "px",
          "font-size": this.template.playerName.fontSize * ratio + "px",
        },
      };
    };

    const buildClockLayout = (color: Color): ClockLayout => {
      const displayColor = flip ? reverseColor(color) : color;
      return {
        style: {
          left: this.template.clock[displayColor].x * ratio + "px",
          top: this.template.clock[displayColor].y * ratio + "px",
          width: this.template.clock.width * ratio + "px",
          height: this.template.clock.height * ratio + "px",
          "font-size": this.template.clock.fontSize * ratio + "px",
        },
      };
    };

    const buildControlLayout = (): ControlLayout => {
      return {
        left: {
          style: {
            left: this.template.control.left.x * ratio + "px",
            top: this.template.control.left.y * ratio + "px",
            width: this.template.control.left.width * ratio + "px",
            height: this.template.control.left.height * ratio + "px",
            "font-size": this.template.control.left.fontSize * ratio + "px",
          },
        },
        right: {
          style: {
            left: this.template.control.right.x * ratio + "px",
            top: this.template.control.right.y * ratio + "px",
            width: this.template.control.right.width * ratio + "px",
            height: this.template.control.right.height * ratio + "px",
            "font-size": this.template.control.right.fontSize * ratio + "px",
          },
        },
      };
    };

    const frameLayout = buildFrameLayout();
    const boardLayout = buildBoardLayout();
    const pieceLayout = buildPieceLayout(boardLayout);
    const squareLayout = buildSquareLayout(boardLayout);
    const blackHandLayout = buildHandLayout(
      Color.BLACK,
      position.hand(Color.BLACK)
    );
    const whiteHandLayout = buildHandLayout(
      Color.WHITE,
      position.hand(Color.WHITE)
    );
    const promotionLayout = buildPromotionLayout(
      boardLayout,
      reservedMoveForPromotion
    );
    const turnLayout = buildTurnLayout();
    const blackPlayerNameLayout = buildPlayerNameLayout(Color.BLACK);
    const whitePlayerNameLayout = buildPlayerNameLayout(Color.WHITE);
    const blackClockLayout = buildClockLayout(Color.BLACK);
    const whiteClockLayout = buildClockLayout(Color.WHITE);
    const controlLayout = buildControlLayout();
    return {
      frame: frameLayout,
      board: boardLayout,
      piece: pieceLayout,
      square: squareLayout,
      blackHand: blackHandLayout,
      whiteHand: whiteHandLayout,
      promotion: promotionLayout,
      turn: turnLayout,
      blackPlayerName: blackPlayerNameLayout,
      whitePlayerName: whitePlayerNameLayout,
      blackClock: blackClockLayout,
      whiteClock: whiteClockLayout,
      control: controlLayout,
    };
  }
}