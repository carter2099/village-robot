# village-robot

A little program that performs a task in a virtual world. From _Eloquent JavaScript, 3rd Edition_ by
Marijn Haverbeke. Heavily refactored for code organization, TypeScript conversion, and the ability to
choose the Robot's implementation when the script is run.

For my own TypeScript and VSCode practice.

## Usage

**Compile the TypeScript to JavaScript**

<pre>tsc</pre>

**Run the script**

<pre>node built/main.js --algorithm <i>algorithm</i></pre>

Where _algorithm_ is one of 'random', 'mailRoute', 'impatient', or 'priority'. Take a look at the
algorithms in [Algorithms.ts](src/robot/Algorithms.ts).
