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
