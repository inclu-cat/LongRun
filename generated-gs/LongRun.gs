// Compiled using ts2gas 3.6.5 (TypeScript 4.3.2)
var exports = exports || {};
var module = module || { exports: exports };
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongRun = void 0;
//import Properties = GoogleAppsScript.Properties.Properties;
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
     * Starts or Resume Long-Run process.
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
    return LongRun;
}());
exports.LongRun = LongRun;
