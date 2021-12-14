import {executeLongRun, LongRun} from "../LongRun";

let data: string[];

function executeTest2() {
  const params = [];
  params.push("param1");
  params.push("param2");
  params.push("param3");

  // shorten the executable time for testing. (default is 240 seconds)
  LongRun.instance.setMaxExecutionSeconds(1);

  // execute the test
  // you can see the logs in Executions section
  executeLongRun("testMain", 3, params,
  "testInitializer", "testFinalizer" );

}
function testInitializer(startIndex: number, params: string[]){
  if( startIndex == 0 ){
    console.log('*** executeLongRun started. ***');
  }
  console.log("testInitializer(startIndex=" + startIndex + "," + " params=[" + params.join(',') + "])");
  // demonstrate loading data
  data = ["data1", "data2", "data3", "data4", "data5", "data6", "data7", "data8", "data9", "data10"];
}
function testMain(index: number, params: string[]){
  console.log("testMain(index=" + index + "," + " params=[" + params.join(',') + "])");
  // demonstrate the process
  console.log("  processing " + data[index] + "...");
  Utilities.sleep(1000);
}
function testFinalizer(isFinished: boolean, params: string[]){
  console.log("testFinalizer(" + isFinished + ",[" + params.join(',') + "])");
  // demonstrate finalization
  if( isFinished ){
    console.log('--- executeLongRun finished. ---');
  }
}
