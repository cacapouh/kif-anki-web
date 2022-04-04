import {
  Color,
  importKakinoki,
  Move,
  Piece,
  Position,
  Record,
  Square,
} from "@/shogi";
import { PieceType } from "@/shogi";

describe("shogi/position", () => {
  it("getters", () => {
    const position = new Position();
    expect(position.color).toBe(Color.BLACK);
    expect(position.board.at(new Square(8, 2))).toStrictEqual(
      new Piece(Color.WHITE, PieceType.ROOK)
    );
    expect(position.hand(Color.BLACK).count(PieceType.PAWN)).toBe(0);
    expect(position.hand(Color.WHITE).count(PieceType.PAWN)).toBe(0);

    position.blackHand.add(PieceType.PAWN, 1);
    position.whiteHand.add(PieceType.PAWN, 2);
    expect(position.hand(Color.BLACK).count(PieceType.PAWN)).toBe(1);
    expect(position.hand(Color.WHITE).count(PieceType.PAWN)).toBe(2);
  });

  it("doMove", () => {
    const position = new Position();
    // 26FU(27)
    let move = position.createMove(new Square(2, 7), new Square(2, 6));
    expect(move).toBeInstanceOf(Move);
    expect(move?.color).toBe(Color.BLACK);
    expect(position.isValidMove(move as Move)).toBeTruthy();
    expect(position.doMove(move as Move)).toBeTruthy();
    expect(position.board.at(new Square(2, 7))).toBeNull();
    expect(position.board.at(new Square(2, 6))).toStrictEqual(
      new Piece(Color.BLACK, PieceType.PAWN)
    );
    // 34FU(33)
    move = position.createMove(new Square(3, 3), new Square(3, 4));
    expect(move?.color).toBe(Color.WHITE);
    expect(position.doMove(move as Move)).toBeTruthy();
    expect(position.board.at(new Square(3, 3))).toBeNull();
    expect(position.board.at(new Square(3, 4))).toStrictEqual(
      new Piece(Color.WHITE, PieceType.PAWN)
    );
  });

  describe("isValidMove", () => {
    it("black", () => {
      const data = `
後手の持駒：歩八　香　桂二　銀二　金二　角　
| ・ ・ ・ ・v玉 ・ ・ ・ ・|一
| ・ ・ ・ ・ ・ ・ ・ ・ ・|二
| ・ ・ ・v香 角 ・ ・ ・ ・|三
| ・ ・ ・ ・v歩 ・ ・ ・ ・|四
| ・ ・ ・ 銀 ・ ・ ・ ・ ・|五
| ・ ・ ・ 玉 ・ ・ ・v龍 ・|六
| ・ ・ 歩 ・ 金 歩 ・ 歩 ・|七
| ・ ・ ・ ・ ・ ・ 桂 ・ ・|八
| ・ ・ ・ ・ ・ ・ ・ ・ ・|九
先手の持駒：歩六　香二　桂　銀　金　飛　
先手番
`;
      const position = (importKakinoki(data) as Record).position;
      const move = (ff: number, fr: number, tf: number, tr: number) =>
        position.createMove(new Square(ff, fr), new Square(tf, tr)) as Move;
      const drop = (type: PieceType, tf: number, tr: number) =>
        position.createMove(type, new Square(tf, tr)) as Move;
      // 合法手
      expect(position.isValidMove(move(2, 7, 2, 6))).toBeTruthy();
      expect(position.isValidMove(move(4, 7, 4, 6))).toBeTruthy();
      expect(position.isValidMove(move(3, 8, 2, 6))).toBeTruthy();
      expect(position.isValidMove(move(3, 8, 4, 6))).toBeTruthy();
      expect(position.isValidMove(move(5, 7, 4, 6))).toBeTruthy();
      expect(position.isValidMove(move(5, 7, 5, 6))).toBeTruthy();
      expect(position.isValidMove(move(5, 3, 2, 6))).toBeTruthy();
      expect(position.isValidMove(move(5, 3, 2, 6).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(6, 6, 6, 7))).toBeTruthy();
      expect(position.isValidMove(move(6, 6, 7, 5))).toBeTruthy();
      expect(position.isValidMove(drop(PieceType.PAWN, 3, 6))).toBeTruthy();
      expect(position.isValidMove(drop(PieceType.LANCE, 4, 6))).toBeTruthy();
      // 王手放置
      expect(position.isValidMove(move(7, 7, 7, 6))).toBeFalsy();
      expect(position.isValidMove(move(5, 3, 3, 5))).toBeFalsy();
      expect(position.isValidMove(move(6, 5, 5, 6))).toBeFalsy();
      expect(position.isValidMove(move(6, 6, 5, 5))).toBeFalsy();
      expect(position.isValidMove(move(6, 6, 5, 6))).toBeFalsy();
      expect(position.isValidMove(move(6, 6, 7, 6))).toBeFalsy();
      // 筋違い
      expect(position.isValidMove(move(5, 3, 1, 7))).toBeFalsy();
      expect(position.isValidMove(move(5, 3, 3, 6))).toBeFalsy();
      // 味方の駒
      expect(position.isValidMove(move(6, 6, 5, 7))).toBeFalsy();
      expect(position.isValidMove(move(6, 6, 7, 7))).toBeFalsy();
      // 二歩
      expect(position.isValidMove(drop(PieceType.PAWN, 4, 6))).toBeFalsy();
      // 存在しない駒
      expect(position.isValidMove(drop(PieceType.BISHOP, 3, 6))).toBeFalsy();
      // 相手の駒
      expect(position.isValidMove(move(2, 6, 2, 5))).toBeFalsy();
    });

    it("white", () => {
      const data = `
後手の持駒：歩六　香　桂　銀　金　
  ９ ８ ７ ６ ５ ４ ３ ２ １
+---------------------------+
| ・ ・ ・ ・ 玉 ・ ・ ・ ・|一
| 馬 ・ ・ ・ ・ ・ ・ 龍 ・|二
| ・ ・ ・ ・ ・ ・ ・ ・ ・|三
| ・ ・ ・ ・ ・ ・ ・ ・ ・|四
| ・v香 ・ ・ ・ ・v角 ・ ・|五
|v桂 ・ ・ ・ ・ 歩 ・ ・ ・|六
| ・ ・ ・ ・ ・v歩v歩v銀 ・|七
|v歩 ・v金v飛 ・ ・ ・ ・ ・|八
| ・ ・ ・ ・ ・ ・ ・v玉 ・|九
+---------------------------+
先手の持駒：歩八　香二　桂二　銀二　金二　
後手番
`;
      const position = (importKakinoki(data) as Record).position;
      const move = (ff: number, fr: number, tf: number, tr: number) =>
        position.createMove(new Square(ff, fr), new Square(tf, tr)) as Move;
      const drop = (type: PieceType, tf: number, tr: number) =>
        position.createMove(type, new Square(tf, tr)) as Move;
      // 合法手
      expect(position.isValidMove(move(2, 7, 2, 8))).toBeTruthy();
      expect(position.isValidMove(move(2, 7, 2, 8).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(3, 7, 3, 8))).toBeTruthy();
      expect(position.isValidMove(move(3, 7, 3, 8).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(9, 8, 9, 9).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(8, 5, 8, 8))).toBeTruthy();
      expect(position.isValidMove(move(8, 5, 8, 9).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(9, 6, 8, 8).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(7, 8, 7, 9))).toBeTruthy();
      expect(position.isValidMove(move(3, 5, 1, 3))).toBeTruthy();
      expect(position.isValidMove(move(3, 5, 2, 6))).toBeTruthy();
      expect(position.isValidMove(move(3, 5, 1, 7).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(3, 5, 4, 6))).toBeTruthy();
      expect(position.isValidMove(move(6, 8, 5, 8).withPromote())).toBeTruthy();
      expect(position.isValidMove(move(6, 8, 1, 8).withPromote())).toBeTruthy();
      // 王手放置
      expect(position.isValidMove(move(2, 7, 3, 8))).toBeFalsy();
      expect(position.isValidMove(move(4, 7, 4, 8).withPromote())).toBeFalsy();
      // 筋違い
      expect(position.isValidMove(move(2, 7, 2, 6))).toBeFalsy();
      expect(position.isValidMove(move(3, 5, 5, 7).withPromote())).toBeFalsy();
      expect(position.isValidMove(move(6, 8, 7, 8).withPromote())).toBeFalsy();
      expect(position.isValidMove(move(6, 8, 8, 8).withPromote())).toBeFalsy();
      // 行き所の無い駒
      expect(position.isValidMove(move(9, 8, 9, 9))).toBeFalsy();
      expect(position.isValidMove(move(8, 5, 8, 9))).toBeFalsy();
      expect(position.isValidMove(move(9, 6, 8, 8))).toBeFalsy();
      // 成れない駒
      expect(position.isValidMove(move(3, 5, 2, 6).withPromote())).toBeFalsy();
      expect(position.isValidMove(move(7, 8, 7, 9).withPromote())).toBeFalsy();
    });
  });

  it("sfen", () => {
    const sfen =
      "sfen l2R2s1+P/4gg1k1/p1+P2lPp1/4p1p+b1/1p3G3/3pP1nS1/PP3KSP1/R8/L4G2+b b NL4Ps2np 1";
    const position = Position.newBySFEN(sfen);
    expect(position).toBeInstanceOf(Position);
    expect(position?.color).toBe(Color.BLACK);
    expect(position?.board.at(new Square(4, 7))).toStrictEqual(
      new Piece(Color.BLACK, PieceType.KING)
    );
    expect(position?.board.at(new Square(4, 3))).toStrictEqual(
      new Piece(Color.WHITE, PieceType.LANCE)
    );
    expect(position?.board.at(new Square(2, 4))).toStrictEqual(
      new Piece(Color.WHITE, PieceType.HORSE)
    );
    expect(position?.blackHand.count(PieceType.PAWN)).toBe(4);
    expect(position?.blackHand.count(PieceType.LANCE)).toBe(1);
    expect(position?.blackHand.count(PieceType.KNIGHT)).toBe(1);
    expect(position?.blackHand.count(PieceType.SILVER)).toBe(0);
    expect(position?.whiteHand.count(PieceType.PAWN)).toBe(1);
    expect(position?.whiteHand.count(PieceType.LANCE)).toBe(0);
    expect(position?.whiteHand.count(PieceType.KNIGHT)).toBe(2);
    expect(position?.whiteHand.count(PieceType.SILVER)).toBe(1);
    expect(position?.sfen).toBe(sfen);
  });
});
