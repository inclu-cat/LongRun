import Properties = GoogleAppsScript.Properties.Properties;

/**
 * Long-Running Support
 */
export class LongRun {
  // singleton instance
  private static _instance:LongRun;

  // constants
  static PREFIX_RUNNING:string = "running_";
  static PREFIX_TRIGGER_KEY:string = "trigger_";
  static PREFIX_START_POS:string = "start_";
  static PREFIX_OPTION:string = "option_";
  static RUNNING_MAX_SECONDS:number = 4*60;
  static RUNNING_DELAY_MINUTES:number = 1;
  static EXECUTE_LONGRUN_FUNCNAME:string = "_executeLongRun";

  /**
   * Private constructor
   * @private
   */
  private constructor() {
  }

  /**
   * Returns singleton instance.
   */
  public static get instance():LongRun {
    if (!this._instance) {
      this._instance = new LongRun();
    }
    return this._instance;
  }

  /** start time map */
  startTimeMap:{} = {};

  /**
   * Returns if function is running now.
   * @param funcName
   */
  isRunning(funcName:string):boolean{
    // get spreadsheet properties
    let properties:Properties = PropertiesService.getScriptProperties();
    let running:string = properties.getProperty(LongRun.PREFIX_RUNNING+funcName);
    return !(running == null || running === '');
  }

  /**
   * Sets the function is running
   * @param funcName
   * @param running
   */
  setRunning(funcName:string, running: boolean): void {
    let properties: Properties = PropertiesService.getScriptProperties();
    const key = LongRun.PREFIX_RUNNING + funcName;
    if(running) {
      properties.setProperty(key, "running");
    }
    else{
      properties.deleteProperty(key);
    }
  }

  /**
   * Sets max execution seconds
   * @param seconds
   */
  setMaxExecutionSeconds(seconds:number){
    LongRun.RUNNING_MAX_SECONDS = seconds;
  }
  /**
   * Sets the trigger's delay minutes
   * @param minutes
   */
  setTriggerDelayMinutes(minutes:number){
    LongRun.RUNNING_DELAY_MINUTES = minutes;
  }

  /**
   * Returns the function parameters
   * @param funcName
   */
  getParameters(funcName: string): string[]{
    let properties:Properties = PropertiesService.getScriptProperties();
    let parameters = properties.getProperty(LongRun.PREFIX_OPTION+funcName);
    if( parameters != null ){
      return parameters.split(',');
    }
    else{
      return [];
    }
  }
  /**
   * Sets the function parameters.
   * @param funcName
   * @param parameters
   */
  setParameters(funcName: string, parameters: string[]):void{
    let properties:Properties = PropertiesService.getScriptProperties();
    if( parameters != null ) {
      properties.setProperty(LongRun.PREFIX_OPTION + funcName, parameters.join(','));
    }
    else{
      properties.deleteProperty(LongRun.PREFIX_OPTION + funcName);
    }
  }

  /**
   * Starts or Resumes Long-Run process.
   * @param funcName
   * @returns start index ( 0 for the first time )
   */
  startOrResume(funcName:string):number{
    // save start time
    this.startTimeMap[funcName] = new Date().getTime();

    // get properties of spreadsheet
    let properties:Properties = PropertiesService.getScriptProperties();

    // set running-flag
    this.setRunning(funcName, true);

    // if the trigger exists, delete it.
    this.deleteTrigger(LongRun.PREFIX_TRIGGER_KEY+funcName);

    // get start index
    let startPos:number = parseInt(properties.getProperty(LongRun.PREFIX_START_POS+funcName));
    if( !startPos ){
      return 0;
    }
    else{
      return startPos;
    }
  }

  /**
   * Determines whether the process should be suspended.
   * If it should be suspended, the next trigger will be registered.
   * @param funcName
   * @param nextIndex - start position when resuming
   * @return true - it should be suspended
   */
  checkShouldSuspend(funcName:string, nextIndex:number): boolean{
    let startTime = this.startTimeMap[funcName];
    let diff = (new Date().getTime() - startTime) / 1000;
    // If it's past the specified time, suspend the process
    if(diff >= LongRun.RUNNING_MAX_SECONDS){

      // register the next trigger and set running-flag off
      this.registerNextTrigger(funcName, nextIndex);

      return true;
    }
    else{
      return false;
    }
  }

  /**
   * Resets Long-Running variables
   * @param funcName
   */
  reset(funcName:string):void{
    // delete trigger
    this.deleteTrigger(LongRun.PREFIX_TRIGGER_KEY+funcName);
    // delete spreadsheet properties
    let properties:Properties = PropertiesService.getScriptProperties();
    properties.deleteProperty(LongRun.PREFIX_START_POS+funcName);
    properties.deleteProperty(LongRun.PREFIX_OPTION+funcName);
    properties.deleteProperty(LongRun.PREFIX_RUNNING+funcName);
    properties.deleteProperty(LongRun.PREFIX_TRIGGER_KEY+funcName);
  }

  /**
   * Resets Long-Running variables if there is no next trigger.
   * Returns whether the command has finished or not.
   * @param funcName
   */
  end(funcName:string):boolean {
    let ret: boolean = false;
    if( !this.existsNextTrigger(funcName) ){
      this.reset(funcName);
      ret = true;
    }
    return ret;
  }

  /**
   * Returns if there is next trigger.
   * @param funcName
   */
  existsNextTrigger(funcName:string):boolean {
    let triggerId = PropertiesService.getScriptProperties().getProperty(LongRun.PREFIX_TRIGGER_KEY+funcName);
    return triggerId != null;
  }

  /**
   * register the next trigger and set running-flag off
   * @param funcName
   * @param nextIndex - start position when resuming
   */
  registerNextTrigger(funcName:string, nextIndex:number):void{
    // get spreadsheet properties
    let properties:Properties = PropertiesService.getScriptProperties();
    properties.setProperty(LongRun.PREFIX_START_POS+funcName, String(nextIndex));  // save next start position
    this.setTrigger(LongRun.PREFIX_TRIGGER_KEY+funcName, funcName);      // set trigger

    // turn off running-flag
    properties.deleteProperty(LongRun.PREFIX_RUNNING+funcName);
  }

  /**
   * Deletes the trigger
   * @param triggerKey
   */
  private deleteTrigger(triggerKey:string):void {
    let triggerId = PropertiesService.getScriptProperties().getProperty(triggerKey);

    if(!triggerId) return;

    ScriptApp.getProjectTriggers().filter(function(trigger){
      return trigger.getUniqueId() == triggerId;
    })
      .forEach(function(trigger) {
        ScriptApp.deleteTrigger(trigger);
      });
    PropertiesService.getScriptProperties().deleteProperty(triggerKey);
  }

  /**
   * Sets a trigger
   * @param triggerKey
   * @param funcName
   */
  private setTrigger(triggerKey, funcName){
    this.deleteTrigger(triggerKey);   // delete if exists.
    let dt:Date = new Date();
    dt.setMinutes(dt.getMinutes() + LongRun.RUNNING_DELAY_MINUTES);  // will execute after the specified time
    let triggerId = ScriptApp.newTrigger(funcName).timeBased().at(dt).create().getUniqueId();
    // save the trigger id to delete the trigger later.
    PropertiesService.getScriptProperties().setProperty(triggerKey, triggerId);
  }

}

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
export function executeLongRun( mainFuncName: string,
                         loopCount: number,
                         params: string[] = null,
                         initializerName: string = null,
                         finalizerName: string = null ) {
  const longRunParams: string[] = [];
  longRunParams.push(mainFuncName);
  longRunParams.push(String(loopCount));
  longRunParams.push(initializerName === null ? '' : initializerName);
  longRunParams.push(finalizerName === null ? '' : finalizerName);
  if ( params != null && params.length > 0 ) {
    longRunParams.push(params.join(','));
  }

  LongRun.instance.setParameters(LongRun.EXECUTE_LONGRUN_FUNCNAME, longRunParams);
  _executeLongRun();
}

/**
 * The main body of executeLongRun
 */
function _executeLongRun(){
  let longRun = LongRun.instance;

  // get parameters
  const longRunParams = longRun.getParameters(LongRun.EXECUTE_LONGRUN_FUNCNAME);
  const mainFuncName = longRunParams[0];
  const loopCount = parseInt(longRunParams[1]);
  const initializerName = longRunParams[2];
  const finalizerName = longRunParams[3];
  const params: string[] = [];
  for ( let i = 4; i < longRunParams.length; i++ ){
    params.push('"' + longRunParams[i] + '"');
  }
  const paramsLiteral = '[' + params.join(',') + ']';

  let startIndex = longRun.startOrResume(LongRun.EXECUTE_LONGRUN_FUNCNAME);
  try {
    // *** call initializer ***
    if ( initializerName != null && initializerName.length > 0 ){
      eval(initializerName + '(' + startIndex + ',' + paramsLiteral + ')');
    }
    // execute the iterative process.
    for (let i = startIndex; i < loopCount; i++) {
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
    const finished = longRun.end(LongRun.EXECUTE_LONGRUN_FUNCNAME);
    // *** call finalizer ***
    if ( finalizerName != null && finalizerName.length > 0 ){
      eval(finalizerName + '(' + finished + ',' + paramsLiteral + ')');
    }
  }
}
