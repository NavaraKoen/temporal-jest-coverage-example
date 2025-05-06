import { WorkflowCoverage } from '@temporalio/nyc-test-coverage';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import * as activities from '../activities';
import { example } from '../workflows';
import { mergeCoverageInJestFormat } from './coverage.hack';

let workflowCoverage: WorkflowCoverage;
beforeAll(() => {
  workflowCoverage = new WorkflowCoverage();
});

describe('Example workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  beforeAll(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterAll(async () => {
    await testEnv?.teardown();

    // Somehow this is not working
    // workflowCoverage.mergeIntoGlobalCoverage();

    mergeCoverageInJestFormat(workflowCoverage, (global as any).__coverage__);
  });

  const runTest = async (args: Parameters<typeof example>, workflowId = 'test') => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create(
      workflowCoverage.augmentWorkerOptions({
        connection: nativeConnection,
        taskQueue,
        workflowsPath: require.resolve('../workflows'),
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
    expect(result).toEqual('Hello, Temporal!');
  });

  it('successfully completes the Workflow with a different input', async () => {
    const result = await runTest(['Not temporal']);
    expect(result).toEqual('Hello, Not temporal!');
  });
});
