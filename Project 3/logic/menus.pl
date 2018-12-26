main_menu :- write('Let\'s play coffee!'), nl,
             write('Choose a mode:'), nl,
             write('Don\'t forget the dot!'), nl,
             write('Type 1. for Human vs Human'), nl,
             write('Type 2. for Human vs BotEasy'), nl,
             write('Type 3. for Human vs BotSmart'), nl,
             read(Option),
             write('Choose board dimensions:'), nl,
             write('Don\'t forget the dot!'), nl,
             write('Type 5. for 5x5'), nl,
             write('Type 6. for 6x6'), nl,
             write('Type 7. for 7x7'), nl,
             read(Dimensions),
             start_menu(Option, Dimensions).

%try again
main_menu :- main_menu.

start_menu(1, Dimensions) :- write('Human vs Human!'), !, nl,
                               start_game(Dimensions).

start_menu(2, Dimensions) :- write('Human vs BOT!'), !, nl,
                               start_game_playerai(Dimensions).

start_menu(3, Dimensions) :- write('Sorry, we\'re still working on developing that, try with our easy bot:('), !, nl,
                               start_game_playerai(Dimensions).

start_menu(Option, Dimensions) :- write('Invalid option/dimensions. Try again'), nl, fail.
