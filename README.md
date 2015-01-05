# Introduction
A simple SVG javascript library

# Build 
Install the dependencies `npm install`

The library uses gulp to run all the tasks:

To build run `gulp`. The files will be output to the dist folder.

# Tutorial
nope. probably not gonna happen either.

# TODO
- more extensive tests for the animation methods
- create better interface for doing (animation) effects.
- implement the <filter> elements
- don't be shit with architecture. 
- BUG: minified builds don't work
    - REASON : svgElem.reRunMixin usess the function.name property
        in order to perform some logic for object cloning
        but the library get obfuscated that name gets lost. Well shit me...

----
Last Updated 10:54 pm (Januray 4th, 2014)
Jordan Yu, 2014