// Compiled using ts2gas 3.6.5 (TypeScript 4.3.2)
var exports = exports || {};
var module = module || { exports: exports };
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeLongRun = exports.LongRun = void 0;
//import Properties = GoogleAppsScript.Properties.Properties;
/**
 * Long-Running Support
 */
var LongRun = /** @class */ (function () {
    /**
     * Private constructor
     * @private
     */
    function LongRun() {
        /** start time map */
        this.startTimeMap = {};
    }
    Object.defineProperty(LongRun, "instance", {
        /**
         * Returns singleton instance.
         */
        get: function () {
            if (!this._instance) {
                this._instance = new LongRun();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns if function is running now.
     * @param funcName
     */
    LongRun.prototype.isRunning = function (funcName) {
        // get spreadsheet properties
        var properties = PropertiesService.getScriptProperties();
        var running = properties.getProperty(LongRun.PREFIX_RUNNING + funcName);
        return !(running == null || running === '');
    };
    /**
     * Sets the function is running
     * @param funcName
     * @param running
     */
    LongRun.prototype.setRunning = function (funcName, running) {
        var properties = PropertiesService.getScriptProperties();
        var key = LongRun.PREFIX_RUNNING + funcName;
        if (running) {
            properties.setProperty(key, "running");
        }
        else {
            properties.deleteProperty(key);
        }
    };
    /**
     * Sets max execution seconds
     * @param seconds
     */
    LongRun.prototype.setMaxExecutionSeconds = function (seconds) {
        LongRun.RUNNING_MAX_SECONDS = seconds;
    };
    /**
     * Sets the trigger's delay minutes
     * @param minutes
     */
    LongRun.prototype.setTriggerDelayMinutes = function (minutes) {
        LongRun.RUNNING_DELAY_MINUTES = minutes;
    };
    /**
     * Returns the function parameters
     * @param funcName
     */
    LongRun.prototype.getParameters = function (funcName) {
        var properties = PropertiesService.getScriptProperties();
        var parameters = properties.getProperty(LongRun.PREFIX_OPTION + funcName);
        if (parameters != null) {
            return parameters.split(',');
        }
        else {
            return [];
        }
    };
    /**
     * Sets the function parameters.
     * @param funcName
     * @param parameters
     */
    LongRun.prototype.setParameters = function (funcName, parameters) {
        var properties = PropertiesService.getScriptProperties();
        if (parameters != null) {
            properties.setProperty(LongRun.PREFIX_OPTION + funcName, parameters.join(','));
        }
        else {
            properties.deleteProperty(LongRun.PREFIX_OPTION + funcName);
        }
    };
    /**
     * Starts or Resumes Long-Run process.
     * @param funcName
     * @returns start index ( 0 for the first time )
     */
    LongRun.prototype.startOrResume = function (funcName) {
        // save start time
        this.startTimeMap[funcName] = new Date().getTime();
        // get properties of spreadsheet
        var properties = PropertiesService.getScriptProperties();
        // set running-flag
        this.setRunning(funcName, true);
        // if the trigger exists, delete it.
        this.deleteTrigger(LongRun.PREFIX_TRIGGER_KEY + funcName);
        // get start index
        var startPos = parseInt(properties.getProperty(LongRun.PREFIX_START_POS + funcName));
        if (!startPos) {
            return 0;
        }
        else {
            return startPos;
        }
    };
    /**
     * Determines whether the process should be suspended.
     * If it should be suspended, the next trigger will be registered.
     * @param funcName
     * @param nextIndex - start position when resuming
     * @return true - it should be suspended
     */
    LongRun.prototype.checkShouldSuspend = function (funcName, nextIndex) {
        var startTime = this.startTimeMap[funcName];
        var diff = (new Date().getTime() - startTime) / 1000;
        // If it's past the specified time, suspend the process
        if (diff >= LongRun.RUNNING_MAX_SECONDS) {
            // register the next trigger and set running-flag off
            this.registerNextTrigger(funcName, nextIndex);
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Resets Long-Running variables
     * @param funcName
     */
    LongRun.prototype.reset = function (funcName) {
        // delete trigger
        this.deleteTrigger(LongRun.PREFIX_TRIGGER_KEY + funcName);
        // delete spreadsheet properties
        var properties = PropertiesService.getScriptProperties();
        properties.deleteProperty(LongRun.PREFIX_START_POS + funcName);
        properties.deleteProperty(LongRun.PREFIX_OPTION + funcName);
        properties.deleteProperty(LongRun.PREFIX_RUNNING + funcName);
        properties.deleteProperty(LongRun.PREFIX_TRIGGER_KEY + funcName);
    };
    /**
     * Resets Long-Running variables if there is no next trigger.
     * Returns whether the command has finished or not.
     * @param funcName
     */
    LongRun.prototype.end = function (funcName) {
        var ret = false;
        if (!this.existsNextTrigger(funcName)) {
            this.reset(funcName);
            ret = true;
        }
        return ret;
    };
    /**
     * Returns if there is next trigger.
     * @param funcName
     */
    LongRun.prototype.existsNextTrigger = function (funcName) {
        var triggerId = PropertiesService.getScriptProperties().getProperty(LongRun.PREFIX_TRIGGER_KEY + funcName);
        return triggerId != null;
    };
    /**
     * register the next trigger and set running-flag off
     * @param funcName
     * @param nextIndex - start position when resuming
     */
    LongRun.prototype.registerNextTrigger = function (funcName, nextIndex) {
        // get spreadsheet properties
        var properties = PropertiesService.getScriptProperties();
        properties.setProperty(LongRun.PREFIX_START_POS + funcName, String(nextIndex)); // save next start position
        this.setTrigger(LongRun.PREFIX_TRIGGER_KEY + funcName, funcName); // set trigger
        // turn off running-flag
        properties.deleteProperty(LongRun.PREFIX_RUNNING + funcName);
    };
    /**
     * Deletes the trigger
     * @param triggerKey
     */
    LongRun.prototype.deleteTrigger = function (triggerKey) {
        var triggerId = PropertiesService.getScriptProperties().getProperty(triggerKey);
        if (!triggerId)
            return;
        ScriptApp.getProjectTriggers().filter(function (trigger) {
            return trigger.getUniqueId() == triggerId;
        })
            .forEach(function (trigger) {
            ScriptApp.deleteTrigger(trigger);
        });
        PropertiesService.getScriptProperties().deleteProperty(triggerKey);
    };
    /**
     * Sets a trigger
     * @param triggerKey
     * @param funcName
     */
    LongRun.prototype.setTrigger = function (triggerKey, funcName) {
        this.deleteTrigger(triggerKey); // delete if exists.
        var dt = new Date();
        dt.setMinutes(dt.getMinutes() + LongRun.RUNNING_DELAY_MINUTES); // will execute after the specified time
        var triggerId = ScriptApp.newTrigger(funcName).timeBased().at(dt).create().getUniqueId();
        // save the trigger id to delete the trigger later.
        PropertiesService.getScriptProperties().setProperty(triggerKey, triggerId);
    };
    // constants
    LongRun.PREFIX_RUNNING = "running_";
    LongRun.PREFIX_TRIGGER_KEY = "trigger_";
    LongRun.PREFIX_START_POS = "start_";
    LongRun.PREFIX_OPTION = "option_";
    LongRun.RUNNING_MAX_SECONDS = 4 * 60;
    LongRun.RUNNING_DELAY_MINUTES = 1;
    LongRun.EXECUTE_LONGRUN_FUNCNAME = "_executeLongRun";
    return LongRun;
}());
exports.LongRun = LongRun;
/**
 * A function allows you to easily execute long-run task using the LongRun class.
 *
 * @param mainFuncName - Name of the function to be executed each time.
 * @param loopCount - Number of times to execute the main function.
 * @param params - Parameters passed to each function (string[]). (optional)
 * @param initializerName - Name of the first function to be executed on first or restart. (optional)
 * @param finalizerName - Name of the function to be called on interruption or when all processing is complete. (optional)
 *
 * The definition of each function to be passed should be as follows.
 *  - Main function:  function [function name](index: number, params: string[]) {...}
 *  - Initializer:    function [function name](startIndex: number, params: string[]) {...}
 *  - Finalizer:      function [function name](isFinished: boolean, params: string[]) {...}
 *
 * Note that it is not possible to use executeLongRun() to execute different long-time processes simultaneously.
 */
function executeLongRun(mainFuncName, loopCount, params, initializerName, finalizerName) {
    if (params === void 0) { params = null; }
    if (initializerName === void 0) { initializerName = null; }
    if (finalizerName === void 0) { finalizerName = null; }
    var longRunParams = [];
    longRunParams.push(mainFuncName);
    longRunParams.push(String(loopCount));
    longRunParams.push(initializerName === null ? '' : initializerName);
    longRunParams.push(finalizerName === null ? '' : finalizerName);
    if (params != null && params.length > 0) {
        longRunParams.push(params.join(','));
    }
    LongRun.instance.setParameters(LongRun.EXECUTE_LONGRUN_FUNCNAME, longRunParams);
    _executeLongRun();
}
exports.executeLongRun = executeLongRun;
/**
 * The main body of executeLongRun
 */
function _executeLongRun() {
    var longRun = LongRun.instance;
    // get parameters
    var longRunParams = longRun.getParameters(LongRun.EXECUTE_LONGRUN_FUNCNAME);
    var mainFuncName = longRunParams[0];
    var loopCount = parseInt(longRunParams[1]);
    var initializerName = longRunParams[2];
    var finalizerName = longRunParams[3];
    var params = [];
    for (var i = 4; i < longRunParams.length; i++) {
        params.push('"' + longRunParams[i] + '"');
    }
    var paramsLiteral = '[' + params.join(',') + ']';
    var startIndex = longRun.startOrResume(LongRun.EXECUTE_LONGRUN_FUNCNAME);
    try {
        // *** call initializer ***
        if (initializerName != null && initializerName.length > 0) {
            eval(initializerName + '(' + startIndex + ',' + paramsLiteral + ')');
        }
        // execute the iterative process.
        for (var i = startIndex; i < loopCount; i++) {
            // Each time before executing a process, you need to check if it should be stopped or not.
            if (longRun.checkShouldSuspend(LongRun.EXECUTE_LONGRUN_FUNCNAME, i)) {
                // if checkShouldSuspend() returns true, the next trigger has been set
                // and you should get out of the loop.
                console.log('*** The process has been suspended. ***');
                break;
            }
            // *** call main process ***
            eval(mainFuncName + '(' + i + ',' + paramsLiteral + ')');
        }
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        // you must always call end() to reset the long-running variables if there is no next trigger.
        var finished = longRun.end(LongRun.EXECUTE_LONGRUN_FUNCNAME);
        // *** call finalizer ***
        if (finalizerName != null && finalizerName.length > 0) {
            eval(finalizerName + '(' + finished + ',' + paramsLiteral + ')');
        }
    }
}
