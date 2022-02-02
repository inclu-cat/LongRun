[inclu-cat_longrun](../README.md) / [Exports](../modules.md) / LongRun

# Class: LongRun

Long-Running Support

## Table of contents

### Constructors

- [constructor](LongRun.md#constructor)

### Properties

- [startTimeMap](LongRun.md#starttimemap)
- [EXECUTE\_LONGRUN\_FUNCNAME](LongRun.md#execute_longrun_funcname)
- [PREFIX\_OPTION](LongRun.md#prefix_option)
- [PREFIX\_RUNNING](LongRun.md#prefix_running)
- [PREFIX\_START\_POS](LongRun.md#prefix_start_pos)
- [PREFIX\_TRIGGER\_KEY](LongRun.md#prefix_trigger_key)
- [RUNNING\_DELAY\_MINUTES](LongRun.md#running_delay_minutes)
- [RUNNING\_MAX\_SECONDS](LongRun.md#running_max_seconds)
- [\_instance](LongRun.md#_instance)

### Accessors

- [instance](LongRun.md#instance)

### Methods

- [checkShouldSuspend](LongRun.md#checkshouldsuspend)
- [deleteTrigger](LongRun.md#deletetrigger)
- [end](LongRun.md#end)
- [existsNextTrigger](LongRun.md#existsnexttrigger)
- [getParameters](LongRun.md#getparameters)
- [isRunning](LongRun.md#isrunning)
- [registerNextTrigger](LongRun.md#registernexttrigger)
- [reset](LongRun.md#reset)
- [setMaxExecutionSeconds](LongRun.md#setmaxexecutionseconds)
- [setParameters](LongRun.md#setparameters)
- [setRunning](LongRun.md#setrunning)
- [setTrigger](LongRun.md#settrigger)
- [setTriggerDelayMinutes](LongRun.md#settriggerdelayminutes)
- [startOrResume](LongRun.md#startorresume)

## Constructors

### constructor

• `Private` **new LongRun**()

Private constructor

#### Defined in

[LongRun.ts:23](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L23)

## Properties

### startTimeMap

• **startTimeMap**: `Object` = `{}`

start time map

#### Defined in

[LongRun.ts:37](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L37)

___

### EXECUTE\_LONGRUN\_FUNCNAME

▪ `Static` **EXECUTE\_LONGRUN\_FUNCNAME**: `string` = `"_executeLongRun"`

#### Defined in

[LongRun.ts:17](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L17)

___

### PREFIX\_OPTION

▪ `Static` **PREFIX\_OPTION**: `string` = `"option_"`

#### Defined in

[LongRun.ts:14](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L14)

___

### PREFIX\_RUNNING

▪ `Static` **PREFIX\_RUNNING**: `string` = `"running_"`

#### Defined in

[LongRun.ts:11](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L11)

___

### PREFIX\_START\_POS

▪ `Static` **PREFIX\_START\_POS**: `string` = `"start_"`

#### Defined in

[LongRun.ts:13](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L13)

___

### PREFIX\_TRIGGER\_KEY

▪ `Static` **PREFIX\_TRIGGER\_KEY**: `string` = `"trigger_"`

#### Defined in

[LongRun.ts:12](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L12)

___

### RUNNING\_DELAY\_MINUTES

▪ `Static` **RUNNING\_DELAY\_MINUTES**: `number` = `1`

#### Defined in

[LongRun.ts:16](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L16)

___

### RUNNING\_MAX\_SECONDS

▪ `Static` **RUNNING\_MAX\_SECONDS**: `number`

#### Defined in

[LongRun.ts:15](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L15)

___

### \_instance

▪ `Static` `Private` **\_instance**: [`LongRun`](LongRun.md)

#### Defined in

[LongRun.ts:8](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L8)

## Accessors

### instance

• `Static` `get` **instance**(): [`LongRun`](LongRun.md)

Returns singleton instance.

#### Returns

[`LongRun`](LongRun.md)

#### Defined in

[LongRun.ts:29](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L29)

## Methods

### checkShouldSuspend

▸ **checkShouldSuspend**(`funcName`, `nextIndex`): `boolean`

Determines whether the process should be suspended.
If it should be suspended, the next trigger will be registered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `funcName` | `string` |  |
| `nextIndex` | `number` | start position when resuming |

#### Returns

`boolean`

true - it should be suspended

#### Defined in

[LongRun.ts:145](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L145)

___

### deleteTrigger

▸ `Private` **deleteTrigger**(`triggerKey`): `void`

Deletes the trigger

#### Parameters

| Name | Type |
| :------ | :------ |
| `triggerKey` | `string` |

#### Returns

`void`

#### Defined in

[LongRun.ts:218](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L218)

___

### end

▸ **end**(`funcName`): `boolean`

Resets Long-Running variables if there is no next trigger.
Returns whether the command has finished or not.

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |

#### Returns

`boolean`

#### Defined in

[LongRun.ts:181](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L181)

___

### existsNextTrigger

▸ **existsNextTrigger**(`funcName`): `boolean`

Returns if there is next trigger.

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |

#### Returns

`boolean`

#### Defined in

[LongRun.ts:194](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L194)

___

### getParameters

▸ **getParameters**(`funcName`): `string`[]

Returns the function parameters

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |

#### Returns

`string`[]

#### Defined in

[LongRun.ts:85](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L85)

___

### isRunning

▸ **isRunning**(`funcName`): `boolean`

Returns if function is running now.

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |

#### Returns

`boolean`

#### Defined in

[LongRun.ts:43](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L43)

___

### registerNextTrigger

▸ **registerNextTrigger**(`funcName`, `nextIndex`): `void`

register the next trigger and set running-flag off

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `funcName` | `string` |  |
| `nextIndex` | `number` | start position when resuming |

#### Returns

`void`

#### Defined in

[LongRun.ts:204](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L204)

___

### reset

▸ **reset**(`funcName`): `void`

Resets Long-Running variables

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |

#### Returns

`void`

#### Defined in

[LongRun.ts:165](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L165)

___

### setMaxExecutionSeconds

▸ **setMaxExecutionSeconds**(`seconds`): `void`

Sets max execution seconds

#### Parameters

| Name | Type |
| :------ | :------ |
| `seconds` | `number` |

#### Returns

`void`

#### Defined in

[LongRun.ts:70](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L70)

___

### setParameters

▸ **setParameters**(`funcName`, `parameters`): `void`

Sets the function parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |
| `parameters` | `string`[] |

#### Returns

`void`

#### Defined in

[LongRun.ts:100](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L100)

___

### setRunning

▸ **setRunning**(`funcName`, `running`): `void`

Sets the function is running

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |
| `running` | `boolean` |

#### Returns

`void`

#### Defined in

[LongRun.ts:55](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L55)

___

### setTrigger

▸ `Private` **setTrigger**(`triggerKey`, `funcName`): `void`

Sets a trigger

#### Parameters

| Name | Type |
| :------ | :------ |
| `triggerKey` | `any` |
| `funcName` | `any` |

#### Returns

`void`

#### Defined in

[LongRun.ts:237](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L237)

___

### setTriggerDelayMinutes

▸ **setTriggerDelayMinutes**(`minutes`): `void`

Sets the trigger's delay minutes

#### Parameters

| Name | Type |
| :------ | :------ |
| `minutes` | `number` |

#### Returns

`void`

#### Defined in

[LongRun.ts:77](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L77)

___

### startOrResume

▸ **startOrResume**(`funcName`): `number`

Starts or Resumes Long-Run process.

#### Parameters

| Name | Type |
| :------ | :------ |
| `funcName` | `string` |

#### Returns

`number`

start index ( 0 for the first time )

#### Defined in

[LongRun.ts:115](https://github.com/inclu-cat/LongRun/blob/5005ab1/src/LongRun.ts#L115)
