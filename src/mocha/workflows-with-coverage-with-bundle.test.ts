import { TestWorkflowEnvironment } from '@temporalio/testing';
import { bundleWorkflowCode, Worker } from '@temporalio/worker';
import { after } from 'mocha';
import { example } from '../workflows';
import * as activities from '../activities';
import assert from 'assert';
import { WorkflowCoverage } from '@temporalio/nyc-test-coverage';

const workflowCoverage = new WorkflowCoverage();

describe('Example workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterEach(async () => {
    await testEnv?.teardown();
  });

  const runTest = async (args: Parameters<typeof example>, workflowId = 'test') => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const bundle = await bundleWorkflowCode(
      workflowCoverage.augmentBundleOptions({
        workflowsPath: require.resolve('../workflows'),
      })
    );

    const worker = await Worker.create(
      workflowCoverage.augmentWorkerOptionsWithBundle({
        connection: nativeConnection,
        taskQueue,
        workflowBundle: bundle,
        activities,
      }),
    );

    return worker.runUntil(
      client.workflow.execute(example, {
        args,
        workflowId,
        taskQueue,
      }),
    );
  };

  it('successfully completes the Workflow with Temporal input', async () => {
    const result = await runTest(['Temporal']);
    assert.equal(result, 'Hello, Temporal!');
  });

  it('successfully completes the Workflow with a different input', async () => {
    const result = await runTest(['Not temporal']);
    assert.equal(result, 'Hello, Not temporal!');
  });
});

after(() => {
  workflowCoverage.mergeIntoGlobalCoverage();
});
