start_game(Dimensions) :- Dimensions >= 5,
                          Dimensions =< 7,
                          !,
                          create_empty_board(Dimensions, Dimensions, Board),
                          asserta(board(Board)),
                          asserta(board_size(Dimensions)),
                          display_game(Board, brown), %brown player is the first one to play
                          play(Board, brown, 1, Result).

start_game(Dimensions) :- write('Invalid dimensions!'), fail.

%play(Board, Player, OldMove, Result) :- write('I was here '), game_won(OldMove, Player, Board, Result), !,
%                                        write(player), write(': '), write(Result), nl.

play(Board, Player, OldMove, Result) :- read_move(Move),
                                        move(Move, OldMove, Player, Board, NewBoard),
                                        NextOldMove = Move,
                                        next_player(Player, NewPlayer),
                                        display_game(NewBoard, NewPlayer), !,
                                        play(NewBoard, NewPlayer, NextOldMove, Result).

play(Board, Player, OldMove, Result) :- write('Invalid move, try again'), nl,
                                        display_game(Board, player),
                                        play(Board, Player, OldMove, Result).

move(Move, 1, Player, Board, NewBoard) :- get_row_column_direction(Move, Row, Column, Direction),
                                                  valid_move(Move, ['first'], Board), !,
                                                  symbol_piece(Player, Direction, Element),
                                                  set_element(Row, Column, Element, Board, NewBoard).

%Move = [Row, Column, NewStickDirection]
move(Move, OldMove, Player, Board, NewBoard) :- get_row_column_direction(Move, Row, Column, Direction),
                                               get_row_column_direction(OldMove, OldRow, OldColumn, OldDirection),
                                               valid_move(Move, OldMove, Board), !,
                                               symbol_piece(Player, Direction, Piece),
                                               symbol_old_player(Player, OldPlayer, SymbolOldPlayer),
                                               set_element(OldRow, OldColumn, SymbolOldPlayer, Board, AnotherBoard),
                                               set_element(Row, Column, Piece, AnotherBoard, NewBoard).

%if it's the first move we only have to check if the cell is empty
valid_move(Move, ['first'], Board) :- get_row_column_direction(Move, Row, Column, Direction),
                                      get_element(Board, Row, Column, Element),
                                      Element = e, !.
valid_move(Move, 1, Board) :- get_row_column_direction(Move, Row, Column, Direction),
                              get_element(Board, Row, Column, Element),
                              Element = e, !.

% in a valid move:
% (1)-> the piece is placed in an empty cell (element = e)
% (2)-> the piece is placed in the direction imposed by the last move (in_the_direction)
% (3)-> the stick's direction doesn't leave the next player without empty cells (valid_direction)
valid_move(Move, OldMove, Board) :- get_row_column_direction(Move, Row, Column, Direction),
                                    get_element(Board, Row, Column, Element),
                                    Element = e, %(1)
                                    get_row_column_direction(OldMove, OldRow, OldColumn, OldDirection),
                                    in_the_direction(Row, Column, OldRow, OldColumn, OldDirection), %(2)
                                    valid_direction(Board, Direction, Row, Column), !. %(3)

in_the_direction(Row, Column, OldRow, OldColumn, v) :- !, Column = OldColumn.
in_the_direction(Row, Column, OldRow, OldColumn, h) :- !, Row = OldRow.
in_the_direction(Row, Column, OldRow, OldColumn, d1) :- !, board_size(Size),
                                                        go_to_border_d1(OldRow, OldColumn, BorderRow, BorderColumn, Size),
                                                        check_diagonal_d1(Row, Column, BorderRow, BorderColumn, Size).
in_the_direction(Row, Column, OldRow, OldColumn, d2) :- !, board_size(Size),
                                                        go_to_border_d2(OldRow, OldColumn, BorderRow, BorderColumn, Size),
                                                        check_diagonal_d2(Row, Column, BorderRow, BorderColumn, Size).

% -----------LAIG
in_the_direction(Row, Column, OldRow, OldColumn, 1) :- !, Column = OldColumn.
in_the_direction(Row, Column, OldRow, OldColumn, 2) :- !, Row = OldRow.
in_the_direction(Row, Column, OldRow, OldColumn, 3) :- !, board_size(Size),
                                                        go_to_border_d1(OldRow, OldColumn, BorderRow, BorderColumn, Size),
                                                        check_diagonal_d1(Row, Column, BorderRow, BorderColumn, Size).
in_the_direction(Row, Column, OldRow, OldColumn, 4) :- !, board_size(Size),
                                                        go_to_border_d2(OldRow, OldColumn, BorderRow, BorderColumn, Size),
                                                        check_diagonal_d2(Row, Column, BorderRow, BorderColumn, Size).
% -----------LAIG

go_to_border_d1(1, AuxColumn, BorderRow, BorderColumn, BoardSize) :- BorderRow = 1,
                                                                     BorderColumn = AuxColumn, !.
go_to_border_d1(AuxRow, BoardSize, BorderRow, BorderColumn, BoardSize) :- BorderRow = AuxRow,
                                                                          BorderColumn = BoardSize, !.
go_to_border_d1(AuxRow, AuxColumn, BorderRow, BorderColumn, BoardSize) :- AuxRow > 1,
                                                                          AuxColumn < BoardSize, !,
                                                                          AuxAuxRow is AuxRow - 1,
                                                                          AuxAuxColumn is AuxColumn + 1,
                                                                          go_to_border_d1(AuxAuxRow, AuxAuxColumn, BorderRow, BorderColumn, BoardSize).

check_diagonal_d1(Row, Column, Row, Column, BoardSize).
check_diagonal_d1(Row, Column, AuxRow, AuxColumn, BoardSize) :- AuxRow =< BoardSize,
                                                                AuxColumn >= 1, !,
                                                                AuxAuxRow is AuxRow + 1,
                                                                AuxAuxColumn is AuxColumn - 1,
                                                                check_diagonal_d1(Row, Column, AuxAuxRow, AuxAuxColumn, BoardSize).

go_to_border_d2(1, AuxColumn, BorderRow, BorderColumn, BoardSize) :- BorderRow = 1,
                                                                     BorderColumn = AuxColumn, !.
go_to_border_d2(AuxRow, 1, BorderRow, BorderColumn, BoardSize) :- BorderRow = AuxRow,
                                                                  BorderColumn = 1, !.
go_to_border_d2(AuxRow, AuxColumn, BorderRow, BorderColumn, BoardSize) :- AuxRow > 1,
                                                                          AuxColumn > 1, !,
                                                                          AuxAuxRow is AuxRow - 1,
                                                                          AuxAuxColumn is AuxColumn - 1,
                                                                          go_to_border_d2(AuxAuxRow, AuxAuxColumn, BorderRow, BorderColumn, BoardSize).

check_diagonal_d2(Row, Column, Row, Column, BoardSize).
check_diagonal_d2(Row, Column, AuxRow, AuxColumn, BoardSize) :- AuxRow =< BoardSize,
                                                                AuxColumn =< BoardSize, !,
                                                                AuxAuxRow is AuxRow + 1,
                                                                AuxAuxColumn is AuxColumn + 1,
                                                                check_diagonal_d2(Row, Column, AuxAuxRow, AuxAuxColumn, BoardSize).

valid_direction(Board, v, Row, Column) :- !, findall(AvailableRow, get_element(Board, AvailableRow, Column, e), AvailableRows),
                                          length(AvailableRows, EmptyCells),
                                          EmptyCells >= 2. %we already know one empty cell is for the current piece
valid_direction(Board, h, Row, Column) :- !, findall(AvailableColumn, get_element(Board, Row, AvailableColumn, e), AvailableColumns),
                                          length(AvailableColumns, EmptyCells),
                                          EmptyCells >= 2. %we already know one empty cell is for the current piece

check_diagonal_d1_elements(_, 0, _, _, _, Aux, N) :- !, N = Aux.
check_diagonal_d1_elements(BoardSize, _, _, BoardSize, _, Aux, N) :- !, N = Aux.
check_diagonal_d1_elements(Row, Column, Board, BoardSize, Element, Aux, N) :- Row < BoardSize,
                                                                              Column > 0,
                                                                              get_element(Board, Row, Column, ActualElement),
                                                                              Element \= ActualElement,!,
                                                                              AuxRow is Row + 1,
                                                                              AuxColumn is Column - 1,
                                                                              check_diagonal_d1_elements(AuxRow, AuxColumn, Board, BoardSize, Element, Aux, N).
check_diagonal_d1_elements(Row, Column, Board, BoardSize, Element, Aux, N) :- Row < BoardSize,
                                                                              Column > 0,
                                                                              get_element(Board, Row, Column, Element),
                                                                              Element = ActualElement, !,
                                                                              Aux2 is Aux + 1,
                                                                              AuxRow is Row + 1,
                                                                              AuxColumn is Column - 1,
                                                                              check_diagonal_d1_elements(AuxRow, AuxColumn, Board, BoardSize, Element, Aux2, N).

valid_direction(Board, d1, Row, Column) :- !, board_size(Size),
                                           BoardSize is Size + 1,
                                           go_to_border_d1(Row, Column, BorderRow, BorderColumn, Size),
                                           check_diagonal_d1_elements(BorderRow, BorderColumn, Board, BoardSize, e, 0, N),
                                           N > 1. %we already know one empty cell is for the current piece

check_diagonal_d2_elements(_, BoardSize, _, BoardSize, _, Aux, N) :- !, N = Aux.
check_diagonal_d2_elements(BoardSize, _, _, BoardSize, _, Aux, N) :- !, N = Aux.
check_diagonal_d2_elements(Row, Column, Board, BoardSize, Element, Aux, N) :- Row < BoardSize,
                                                                             Column < BoardSize,
                                                                             get_element(Board, Row, Column, ActualElement),
                                                                             Element \= ActualElement,!,
                                                                             AuxRow is Row + 1,
                                                                             AuxColumn is Column + 1,
                                                                             check_diagonal_d2_elements(AuxRow, AuxColumn, Board, BoardSize, Element, Aux, N).
check_diagonal_d2_elements(Row, Column, Board, BoardSize, Element, Aux, N) :- Row < BoardSize,
                                                                             Column < BoardSize,
                                                                             get_element(Board, Row, Column, Element),
                                                                             Element = ActualElement, !,
                                                                             Aux2 is Aux + 1,
                                                                             AuxRow is Row + 1,
                                                                             AuxColumn is Column + 1,
                                                                             check_diagonal_d2_elements(AuxRow, AuxColumn, Board, BoardSize, Element, Aux2, N).

valid_direction(Board, d2, Row, Column) :- !, board_size(Size),
                                          BoardSize is Size + 1,
                                          go_to_border_d2(Row, Column, BorderRow, BorderColumn, Size),
                                          check_diagonal_d2_elements(BorderRow, BorderColumn, Board, BoardSize, e, 0, N),
                                          N > 1. %we already know one empty cell is for the current piece

% --------- LAIG
valid_direction(Board, 1, Row, Column) :- !, findall(AvailableRow, get_element(Board, AvailableRow, Column, e), AvailableRows),
                                          length(AvailableRows, EmptyCells),
                                          EmptyCells >= 2. %we already know one empty cell is for the current piece
valid_direction(Board, 2, Row, Column) :- !, findall(AvailableColumn, get_element(Board, Row, AvailableColumn, e), AvailableColumns),
                                          length(AvailableColumns, EmptyCells),
                                          EmptyCells >= 2. %we already know one empty cell is for the current piece
valid_direction(Board, 3, Row, Column) :- !, board_size(Size),
                                           BoardSize is Size + 1,
                                           go_to_border_d1(Row, Column, BorderRow, BorderColumn, Size),
                                           check_diagonal_d1_elements(BorderRow, BorderColumn, Board, BoardSize, e, 0, N),
                                           N > 1. %we already know one empty cell is for the current piece
valid_direction(Board, 4, Row, Column) :- !, board_size(Size),
                                         BoardSize is Size + 1,
                                         go_to_border_d2(Row, Column, BorderRow, BorderColumn, Size),
                                         check_diagonal_d2_elements(BorderRow, BorderColumn, Board, BoardSize, e, 0, N),
                                         N > 1. %we already know one empty cell is for the current piece
% --------- LAIG

%symbol_piece(Player, StickDirection, Piece)
symbol_piece(orange, v, vo).
symbol_piece(orange, h, ho).
symbol_piece(orange, d1, do1).
symbol_piece(orange, d2, do2).
symbol_piece(brown, v, vb).
symbol_piece(brown, h, hb).
symbol_piece(brown, d1, db1).
symbol_piece(brown, d2, db2).
symbol_piece(brown, _, b).
symbol_piece(orange, _, o).

%next_player(CurrentPlayer, NextPlayer)
next_player(brown, orange).
next_player(orange, brown).

%symbol_old_player(CurrentPlayer, OldPlayer, OldPLayerSymbol)
symbol_old_player(brown, orange, o).
symbol_old_player(orange, brown, b).

value(Board, Player, Value) :- transform_piece(Board, [], [], FinalBoard),
                                (
                                  Player = brown, Piece = b, Opponent = o;
                                  Piece = o, Opponent = b
                                ),
                                count_rows(Board, Piece, 1, [], PlayerCounter),
                                count_rows(Bard, Opponent, 1, [], OpponentCounter),
                                Value is PlayerCounter - OpponentCounter.


count_rows([], _, _, ListCounter, FinalCounter) :- ListCounter = [],
                                                  FinalCounter = 0;
                                                  max_member(FinalCounter, ListCounter).

count_rows([[Piece | RestOfLine] | RestOfBoard], Player, Index, ListCounter, FinalCounter) :-  RestOfLine = [],
                                                                                               count_rows(RestOfBoard, Player, 1, ListCounter, FinalCounter);
                                                                                               Piece = Player,
                                                                                                (
                                                                                                  count_horizontal(RestOfLine, Player, 1, CounterHorizontal), append([CounterHorizontal], ListCounter, Horizontal),
                                                                                                  count_vertical(RestOfBoard, Player, 1, Index, CounterVertical), append([CounterVertical], Horizontal, Vertical),
                                                                                                  count_diagonal_rigth(RestOfBoard, Player, 1, Index, CounterRigth), append([CounterRigth], Vertical, DiagonalRigth),
                                                                                                  count_diagonal_left(RestOfBoard, Player, 1, Index, CounterLeft), append([CounterLeft], DiagonalRigth, Final),

                                                                                                  NextIndex is Index + 1,
                                                                                                  append([RestOfLine], RestOfBoard, CutBoard),
                                                                                                  count_rows(CutBoard, Player, NextIndex, Final, FinalCounter)

                                                                                                );
                                                                                                NextIndex is Index + 1,
                                                                                                append([RestOfLine], RestOfBoard, CutBoard),
                                                                                                count_rows(CutBoard, Player, NextIndex, ListCounter, FinalCounter).

count_horizontal([Piece | RestOfLine], Player, Counter, CounterHorizontal) :-
                                                                              (
                                                                                Piece = Player, NewCounter is Counter + 1, count_horizontal(RestOfLine, Player, NewCounter, CounterHorizontal)
                                                                              );
                                                                              CounterHorizontal is Counter.

count_vertical([NextLine | RestOfBoard], Player, Counter, Index, CounterVertical) :-
                                                                                    nth1(Index, NextLine, Piece),
                                                                                    (
                                                                                      Piece = Player, NewCounter is Counter + 1,  count_vertical(RestOfBoard, Player, NewCounter, Index, CounterVertical)
                                                                                    );
                                                                                    CounterVertical is Counter.

count_diagonal_rigth([NextLine | RestOfBoard], Player, Counter, Index, CounterRigth) :-
                                                                                        NewIndex is Index + 1,
                                                                                        nth1(NewIndex, NextLine, Piece),
                                                                                        (
                                                                                          Piece = Player, NewCounter is Counter + 1,  count_diagonal_rigth(RestOfBoard, Player, NewCounter, NewIndex, CounterRigth)
                                                                                        );
                                                                                        CounterRigth is Counter.

count_diagonal_left([NextLine | RestOfBoard], Player, Counter, Index, CounterLeft) :-
                                                                                        NewIndex is Index - 1,
                                                                                        nth1(NewIndex, NextLine, Piece),
                                                                                        (
                                                                                          Piece = Player, NewCounter is Counter + 1,  count_diagonal_left(RestOfBoard, Player, NewCounter, NewIndex, CounterLeft)
                                                                                        );
                                                                                        CounterRigth is Counter.

transform_piece([], _, NewBoard, FinalBoard) :-  FinalBoard = NewBoard.

transform_piece([[Piece | RestOfLine] | RestOfBoard], Line, NewBoard, FinalBoard) :- RestOfLine = [],
                                                                                    append(NewBoard, Line, Board),
                                                                                    transform_piece(RestOfBoard, [], Board, FinalBoard);
                                                                                    (
                                                                                      Piece = vb, NewPiece = b, append(Line, [NewPiece], NewLine);
                                                                                      Piece = hb, NewPiece = b, append(Line, [NewPiece], NewLine);
                                                                                      Piece = d1b, NewPiece = b, append(Line, [NewPiece], NewLine);
                                                                                      Piece = d2b, NewPiece = b, append(Line, [NewPiece], NewLine);
                                                                                      Piece = vo, NewPiece = o, append(Line, [NewPiece], NewLine);
                                                                                      Piece = ho, NewPiece = o, append(Line, [NewPiece], NewLine);
                                                                                      Piece = d1o, NewPiece = o, append(Line, [NewPiece], NewLine);
                                                                                      Piece = d2o, NewPiece = o, append(Line, [NewPiece], NewLine);
                                                                                      Piece = e, append(Line, [Piece], NewLine)
                                                                                    ),
                                                                                    append([RestOfLine], RestOfBoard, CutBoard),
                                                                                    transform_piece(CutBoard, NewLine, NewBoard, FinalBoard).




is_winning_streak(N, BoardSize) :- WinStreak is BoardSize - 1,
                                     N = WinStreak.

% Specifc direction has won
game_won(['first'], Player, Board, Result) :- !, fail.
game_won(Move, Player, Board, Result):- !, nth0(0, Move, Row),
                                        board_size(BoardSize),
                                        horizontal_win(Row, 1, Board, BoardSize, Player, 0),
                                        Result = 'Horizontal victory!'.
%game_won(Move, Player, Board, Result):- vertical_win(PieceDirection, Board).
%game_won(Move, Player, Board, Result):- diagonal_win(PieceDirection, Board).

horizontal_win(Row, Column, Board, BoardSize, Player, N) :- is_winning_streak(N, BoardSize), !.
horizontal_win(Row, Column, Board, BoardSize, Player, N) :- Column > BoardSize, !, fail.
horizontal_win(Row, Column, Board, BoardSize, Player, N) :- Column =< BoardSize,
                                                            get_element(Board, Row, Column, Element),
                                                            symbol_piece(Player,_,Element), !,
                                                            Streak is N + 1,
                                                            write(Row), write(Column), write(Streak), write(nl),
                                                            NextColumn is Column + 1,
                                                            horizontal_win(Row, NextColumn, Board, BoardSize, Player, Streak).
horizontal_win(Row, Column, Board, BoardSize, Player, N) :- Column =< BoardSize,
                                                            NextColumn is Column + 1,
                                                            horizontal_win(Row, NextColumn, Board, BoardSize, Player, 0), !.
% Confirm Horizontal Win for side 'Direction'
% horizontal_win(Direction, [FirstRow | _T]) :- check_row_win(Direction, FirstRow, 0).
% horizontal_win(Direction, [FirstRow | T]) :- \+ check_row_win(Direction, FirstRow, 0),
%                                               horizontal_win(Direction, T).

% Confirms Vertical Win for side 'Direction'
vertical_win(Direction, Board) :- transpose(Board, NewBoard),
                                  horizontal_win(Direction, NewBoard).

%Confirm Diagonal Win for side 'Direction'
diagonal_win(Direction, Board):- board_size(Dimensions),
                                 check_diagonal_win(Direction, Board, 0, Dimensions).

%1/4 of the diagonals: L-R, T-B
check_diagonal_win(Direction, Board, Column, _Dimensions):- check_diagonalline_win(Direction, Board, 0, Column, 1, 1, 0).
%1/4 of the diagonals: R-L, T-B
check_diagonal_win(Direction, Board, Column, _Dimensions):- check_diagonalline_win(Direction, Board, 0, Column, 1, -1, 0).
%1/4 of the diagonals: L-R B-T
check_diagonal_win(Direction, Board, Column, Dimensions):- BottomRow is (Dimensions - 1),
                                                           check_diagonalline_win(Direction, Board, BottomRow, Column, -1, 1, 0).
%1/4 of the diagonals: R-L, B-T
check_diagonal_win(Direction, Board, Column, Dimensions):- BottomRow is (Dimensions - 1),
                                                           check_diagonalline_win(Direction, Board, BottomRow, Column, -1, -1, 0).
%Recursive Call
check_diagonal_win(Direction, Board, Column, Dimensions):- NewColumn is (Column + 1),
                                                           NewColumn \= Dimensions,
                                                           check_diagonal_win(Direction, Board, NewColumn, Dimensions).

%Iterates through [Row, Column] diagonals, with direction following the order[RowInc, ColumnInc] always checking if achieved the winning streak.
%Found N in row, won.
check_diagonalline_win(_Direction, _Board, _Row, _Column, _IncRow, _IncColumn, Cnt):- winningStreakN(Cnt), !.
check_diagonalline_win(Direction, Board, Row, Column, RowInc, ColumnInc, Cnt):- get_element(Board, Row, Column, Directions),
                                                                                NewRow is (Row + RowInc),
                                                                                NewColumn is (Column + ColumnInc),
                                                                                NewCnt is (Cnt + 1),
                                                                                check_diagonalline_win(Direction, Board, NewRow, NewColumn, RowInc, ColumnInc, NewCnt).
check_diagonalline_win(Direction, Board, Row, Column, RowInc, ColumnInc, _Cnt):- get_element(Board, Row, Column, _),
                                                                                 NewRow is (Row + RowInc), NewColumn is (Column + ColumnInc),
                                                                                 check_diagonalline_win(Direction, Board, NewRow, NewColumn, RowInc, ColumnInc, 0).

get_row_column_direction(Move, Row, Column, Direction) :- nth0(0, Move, Row),
                                                          nth0(1, Move, Column),
                                                          nth0(2, Move, Direction).
