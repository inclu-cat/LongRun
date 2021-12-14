// Compiled using ts2gas 3.6.5 (TypeScript 4.3.2)
var exports = exports || {};
var module = module || { exports: exports };
Object.defineProperty(exports, "__esModule", { value: true });
//import {executeLongRun, LongRun} from "../LongRun";
var data;
function executeTest2() {
    var params = [];
    params.push("param1");
    params.push("param2");
    params.push("param3");
    // shorten the executable time for testing. (default is 240 seconds)
    LongRun.instance.setMaxExecutionSeconds(1);
    // execute the test
    // you can see the logs in Executions section
    executeLongRun("testMain", 3, params, "testInitializer", "testFinalizer");
}
function testInitializer(startIndex, params) {
    if (startIndex == 0) {
        console.log('*** executeLongRun started. ***');
    }
    console.log("testInitializer(startIndex=" + startIndex + "," + " params=[" + params.join(',') + "])");
    // demonstrate loading data
    data = ["data1", "data2", "data3", "data4", "data5", "data6", "data7", "data8", "data9", "data10"];
}
function testMain(index, params) {
    console.log("testMain(index=" + index + "," + " params=[" + params.join(',') + "])");
    // demonstrate the process
    console.log("  processing " + data[index] + "...");
    Utilities.sleep(1000);
}
function testFinalizer(isFinished, params) {
    console.log("testFinalizer(" + isFinished + ",[" + params.join(',') + "])");
    // demonstrate finalization
    if (isFinished) {
        console.log('--- executeLongRun finished. ---');
    }
}
