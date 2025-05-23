import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import { example } from '../workflows';
import * as activities from '../activities';

describe('Example workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  afterEach(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes the Workflow', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities,
    });

    const result = await worker.runUntil(
      client.workflow.execute(example, {
        args: ['Temporal'],
        workflowId: 'test',
        taskQueue,
      }),
    );
    expect(result).toEqual('Hello, Temporal!');
  });
});
