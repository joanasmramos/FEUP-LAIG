%TODO:
%isValidDirection

%Reads Move input from user
% read_move(-[Row, Column, StickDirection])
% Row is a number, column is a number, stickdirection = 'v'/'h'/'d1'/'d2'
read_move([Row, Column, StickDirection]) :- write(' » Make your move: Column and Row[eg: A3]: '), nl,
                                            read_line(Move),
                                            is_valid_input(Move, Row, Column),
                                            read_stick_direction(StickDirection).
%try again
read_move([Row, Column, StickDirection]) :- read_move([Row, Column, StickDirection]).

%Validates input by user
is_valid_input(Move, Row, Column) :- length(Move,2),
                                     inputmanager_row(Move, Row),
                                     inputmanager_column(Move, Column), !.

is_valid_input(_, Row, Column):- write('Invalid move format. Try Again.'), nl, fail.

%Manages Column regarding the Move input by user
inputmanager_column(Move, Column):- nth0(0, Move, TempCol),
                                    Column is TempCol - 64, %convert from ascii code to number
                                    valid_column(Column), !.

valid_column(Column) :- Column >= 1,
                        board_size(Size),
                        Column =< Size, !.

valid_column(_Column) :- write('ERROR: Column is not valid.'), nl, fail.

%Manages Row regarding the Move input by user
inputmanager_row(Move, Row) :- nth0(1, Move, TempRow),
                               Row is TempRow - 48,  %convert from ascii code to number
                               valid_row(Row), !.

%Validating rows and columns
valid_row(Row) :- Row >= 1,
                  board_size(Size),
                  Row  =< Size, !.

valid_row(_Row) :- write('ERROR: Row is not valid, try again.\n'), fail.

%Reads StickDirection input from user
read_stick_direction(StickDirection) :- write(' » Make your Move: Direction of Stick:'), nl,
                                       write(' » Don\'t forget the dot!'), nl,
                                       write(' » Type 1. for vertical |'), nl,
                                       write(' » Type 2. for horizontal -'), nl,
                                       write(' » Type 3. for diagonal bottom up /'), nl,
                                       write(' » Type 4. for diagonal top down \\'), nl,
                                       read(TempStickDirection),
                                       valid_stick_direction(TempStickDirection, StickDirection).

%Manages Sticks direction regarding the StickDirection input by user

valid_stick_direction(1, StickDirection) :- StickDirection = 'v', !.

valid_stick_direction(2, StickDirection) :- StickDirection = 'h', !.

valid_stick_direction(3, StickDirection) :- StickDirection = 'd1', !.

valid_stick_direction(4, StickDirection) :- StickDirection = 'd2', !.

valid_stick_direction(_NewStickDirection, _StickDirection) :- write('ERROR: Stick\'s direction is not valid.'), nl, fail.
