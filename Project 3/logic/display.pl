symbol(e, S) :- S='..'.
symbol(b, S) :- S=' B'.
symbol(o, S) :- S=' O'.
symbol(vb, S) :- S='|B'.
symbol(hb, S) :- S='-B'.
symbol(db1, S) :- S='/B'.
symbol(db2, S) :- S='\\B'.
symbol(vo, S) :- S='|O'.
symbol(ho, S) :- S='-O'.
symbol(do1, S) :- S='/O'.
symbol(do2, S) :- S='\\O'.
symbol(brown, S) :- S='Brown player\'s turn.'.
symbol(orange, S) :- S='Orange player\'s turn.'.

display_row([]).
display_row([Head|Tail]) :- write('|'),
                            symbol(Head, S),
                            write(S),
                            display_row(Tail).

display_footer([]) :- nl.
display_footer([Head|Tail]) :- write(Head),
                               write('  '),
                               display_footer(Tail).

compute_footer(N, Footer, Update_footer) :- Letter is N+64,
                             name(L, [Letter]),
                             append(Footer, [L], Update_footer).

display_board([], _, Footer) :-  write('    '),
                                 display_footer(Footer).

display_board([Head|Tail], N, Footer) :- write(N), write(' '), /* displays line's number */
                                 display_row(Head),    /* displays one row */
                                 write('|'),
                                 nl,
                                 compute_footer(N, Footer, Update_footer),
                                 N1 is N+1,
                                 display_board(Tail, N1, Update_footer).

display_game(Board, Player) :- symbol(Player, S),
                               write(S),
                               nl,
                               display_board(Board, 1, []).
