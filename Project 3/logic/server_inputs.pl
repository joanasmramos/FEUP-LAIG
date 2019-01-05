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

symbol_player(0, brown).
symbol_player(1, orange).
