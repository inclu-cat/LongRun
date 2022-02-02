inclu-cat_longrun / [Exports](modules.md)

# LongRun
the LongRun class supports to execute long-running Google Apps Scripts. (A spin-off from [GAS-Terminal](https://github.com/inclu-cat/GAS-Terminal))

Related article is [here](https://inclucat.wordpress.com/2021/07/20/an-easy-way-to-deal-with-google-apps-scripts-6-minute-limit/).

## How to incorporate the source file
If you use clasp and TypeScript, download [LongRun.ts](https://github.com/inclu-cat/LongRun/blob/main/src/LongRun.ts) and put it in your clasp project. (I assume you know how to push it to the Apps Script environment.)  

If you don't use clasp, but use Apps Script Editor, follow these steps.
1. Open Apps Script Editor.
2. Add a new Script file named LongRun.gs.
3. Copy the contents of [this file](https://github.com/inclu-cat/LongRun/blob/main/generated-gs/LongRun.gs) and paste it into LongRun.gs you created.

## How to use
See the [Test1.ts](https://github.com/inclu-cat/LongRun/blob/main/src/test/Test1.ts) or [Test2.ts](https://github.com/inclu-cat/LongRun/blob/main/src/test/Test2.ts) to know how to use this class.  
( If you want generated script files instead of the TypeScript files, see [Test1.gs](https://github.com/inclu-cat/LongRun/blob/main/generated-gs/test/Test1.gs) or [Test2.gs](https://github.com/inclu-cat/LongRun/blob/main/generated-gs/test/Test2.gs) )
