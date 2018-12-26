:- use_module(library(lists)).
:- use_module(library(clpfd)).
:- use_module(library(random)).

:- include('ai.pl').
:- include('game_logic.pl').
:- include('display.pl').
:- include('menus.pl').
:- include('internal_representation.pl').
:- include('input.pl').

play :- main_menu.
