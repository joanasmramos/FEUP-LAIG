start_game_playerai(Dimensions) :- Dimensions >= 5,
                                  Dimensions =< 7,
                                  !,
                                  create_empty_board(Dimensions, Dimensions, Board),
                                  asserta(board_size(Dimensions)),
                                  display_game(Board, brown), %brown player is the first one to play
                                  play_human_ai(Board, Dimensions, brown, ['first'], Result).

play_human_ai(Board, Dimensions, Player, OldMove, Result) :-
                                                            (
                                                              Player = brown, read_move(Move);
                                                              choose_move(Board, Dimensions, OldMove, Move)
                                                            ),
                                                            move(Move, OldMove, Player, Board, NewBoard),
                                                            NextOldMove = Move,
                                                            next_player(Player, NewPlayer),
                                                            display_game(NewBoard, NewPlayer),
                                                            play_human_ai(NewBoard, Dimensions, NewPlayer, NextOldMove, Result).

play_human_ai(Board, Dimensions, Player, OldMove, Result) :-  write('Invalid move, try again'), nl,
                                                              display_game(Board, player),
                                                              play_human_ai(Board, Dimensions, Player, OldMove, Result).

% choose_move(Board, Dimensions, OldMove, Move) :- valid_moves(Board, Dimensions, 1, 1, 'v', OldMove, [], VerticalMoves),
%                                               valid_moves(Board, Dimensions, 1, 1, 'h', OldMove, [], HorizontalMoves),
%                                               valid_moves(Board, Dimensions, 1, 1, 'd1', OldMove, [], Diagonal1Moves),
%                                               valid_moves(Board, Dimensions, 1, 1, 'd2', OldMove, [], Diagonal2Moves),
%                                               append(VerticalMoves, HorizontalMoves, XY),
%                                               append(Diagonal1Moves, Diagonal2Moves, DiagonalMoves),
%                                               append(XY, DiagonalMoves, ListOfMoves),
%                                               length(ListOfMoves, Length),
%                                               random(1, Length, Index),
%                                               nth1(Index, ListOfMoves, Move).
%-----------------LAIG
choose_move(Board, Dimensions, OldMove, Move) :- valid_moves(Board, Dimensions, 1, 1, 1, OldMove, [], VerticalMoves),
                                              valid_moves(Board, Dimensions, 1, 1, 2, OldMove, [], HorizontalMoves),
                                              valid_moves(Board, Dimensions, 1, 1, 3, OldMove, [], Diagonal1Moves),
                                              valid_moves(Board, Dimensions, 1, 1, 4, OldMove, [], Diagonal2Moves),
                                              append(VerticalMoves, HorizontalMoves, XY),
                                              append(Diagonal1Moves, Diagonal2Moves, DiagonalMoves),
                                              append(XY, DiagonalMoves, ListOfMoves),
                                              length(ListOfMoves, Length),
                                              random(1, Length, Index),
                                              nth1(Index, ListOfMoves, Move).
%-----------------LAIG

%returns a list of moves that are valid for placement.
valid_moves(_, Dimensions, Dimensions, Dimensions, _,  _, Moves, ListOfMoves):- ListOfMoves = Moves.
valid_moves(Board, Dimensions, Row, Column, Direction, OldMove, Moves, ListOfMoves) :- Play = [Row, Column, Direction],
                                                                                      (
                                                                                        valid_move(Play, OldMove, Board),
                                                                                        append([Play], Moves, NewMoves),
                                                                                        (
                                                                                          Row = Dimensions, NewColumn is Column + 1, NewRow = 0, valid_moves(Board, Dimensions, NewRow, NewColumn, Direction, OldMove, NewMoves, ListOfMoves);
                                                                                          NewRow is Row + 1, valid_moves(Board, Dimensions, NewRow, Column, Direction, OldMove, NewMoves, ListOfMoves)
                                                                                        ));
                                                                                        Row = Dimensions, NewColumn is Column + 1, NewRow = 0, valid_moves(Board, Dimensions, NewRow, NewColumn, Direction, OldMove, Moves, ListOfMoves);
                                                                                        NewRow is Row + 1, valid_moves(Board, Dimensions, NewRow, Column, Direction,OldMove, Moves, ListOfMoves).
