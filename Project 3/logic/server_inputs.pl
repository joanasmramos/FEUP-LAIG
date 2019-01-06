%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:- include('coffee.pl').

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

parse_input(create_empty_board(Dimensions), Board) :-
  create_empty_board(Dimensions, Dimensions, B),
  boardToNumbers(B, Board).

parse_input(assert_dimensions(Dimensions), 'Done my dude') :-
  asserta(board_size(Dimensions)).

parse_input(move(Move, OldMove, PlayerNumber, BoardNumbers), [IsValid, NewBoardNumbers]) :-
  boardToNumbers(Board, BoardNumbers),
  symbol_player(PlayerNumber, Player),
  move(Move, OldMove, Player, Board, NewBoard), !,
  boardToNumbers(NewBoard, NewBoardNumbers),
  IsValid = true.

parse_input(move(Move, OldMove, PlayerNumber, BoardNumbers), [IsValid, NewBoard]) :-
  boardToNumbers(Board, BoardNumbers),
  symbol_player(PlayerNumber, Player),
  \+move(Move, OldMove, Player, Board, NewBoard), !,
  boardToNumbers(NewBoard, NewBoardNumbers),
  IsValid = false.

%choose_move(Board, Dimensions, OldMove, Move)
parse_input(choose_move(BoardNumbers, OldMove), Move) :-
  boardToNumbers(Board, BoardNumbers),
  board_size(Dimensions),
  choose_move(Board, Dimensions, OldMove, Move).

symbol_player(0, brown).
symbol_player(1, orange).

symbol_direction(1, v).
symbol_direction(2, h).
symbol_direction(3, d1).
symbol_direction(4, d2).
