[inclu-cat_longrun](README.md) / Exports

# inclu-cat_longrun

## Table of contents

### Classes

- [LongRun](classes/LongRun.md)

### Functions

- [executeLongRun](modules.md#executelongrun)

## Functions

### executeLongRun

▸ **executeLongRun**(`mainFuncName`, `loopCount`, `params?`, `initializerName?`, `finalizerName?`): `void`

A function allows you to easily execute long-run task using the LongRun class.<br>
The definition of each function to be passed should be as follows.<br>
<br>
 <b>Main function:</b>  function [function name](index: number, params: string[]) {...}<br>
 <b>Initializer:</b>    function [function name](startIndex: number, params: string[]) {...}<br>
 <b>Finalizer:</b>      function [function name](isFinished: boolean, params: string[]) {...}<br>
<br>
Note that it is not possible to use executeLongRun() to execute different long-time processes simultaneously.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `mainFuncName` | `string` | `undefined` | Name of the function to be executed each time. |
| `loopCount` | `number` | `undefined` | Number of times to execute the main function. |
| `params` | `string`[] | `null` | Parameters passed to each function (string[]). (optional) |
| `initializerName` | `string` | `null` | Name of the first function to be executed on first or restart. (optional) |
| `finalizerName` | `string` | `null` | Name of the function to be called on interruption or when all processing is complete. (optional) |

#### Returns

`void`

#### Defined in

[LongRun.ts:265](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L265)
