create_empty_line(0, []).
create_empty_line(Length, [e|Ls]) :- Length > 0,
                                     L2 is Length - 1,
                                     create_empty_line(L2, Ls).

create_empty_board(_, 0, []).
create_empty_board(Width, Height, [Line|Ls]) :- Height > 0,
                                                H2 is Height - 1,
                                                create_empty_line(Width, L),
                                                Line = L,
                                                create_empty_board(Width, H2, Ls).

get_element(Board, Row, Column, Element) :- nth1(Row, Board, Line),
                                            nth1(Column, Line, Element).

set_element_in_list([H|T], 1, Element, [Element|T]).
set_element_in_list([H|T], Ind, Element, [H|TNew]) :- Ind > 1, !,
                                                      Ind1 is Ind - 1,
                                                      set_element_in_list(T, Ind1, Element, TNew).

set_element(1, Column, Element, [H|T], [HNew|T]) :- set_element_in_list(H, Column, Element, HNew).
set_element(Row, Column, Element, [B|Bs], [B|BsNew]) :- Row > 1, !,
                                                        Row1 is Row - 1,
                                                        set_element(Row1, Column, Element, Bs, BsNew).

boardToNumbers([], []).
boardToNumbers([List | R], [NumberList | Numbers]):-
  boardToNumbersLine(List, NumberList),
  boardToNumbers(R, Numbers).

boardToNumbersLine([], []).
boardToNumbersLine([Element | Rest], [Number | NumberRest]):-
  atomString(Element,Number),
  boardToNumbersLine(Rest, NumberRest).


atomString(e, 0).
atomString(b, 1).
atomString(o, 2).
atomString(vb, 3).
atomString(hb, 4).
atomString(db1, 5).
atomString(db2, 6).
atomString(vo, 7).
atomString(ho, 8).
atomString(do1, 9).
atomString(do2, 10).
