import { TestWorkflowEnvironment } from '@temporalio/testing';
import { WorkflowCoverage } from '@temporalio/nyc-test-coverage';
import { Worker } from '@temporalio/worker';
import { example } from './workflows';
import * as activities from './activities';
import assert from 'assert';

describe('Example workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  afterEach(async () => {
    await testEnv?.teardown();
  });

  const taskQueue = 'test';

  describe('without nyc coverage patch (no coverage)', () => {
    it('successfully completes the Workflow', async () => {
      const { client } = testEnv;

      const { nativeConnection } = testEnv;
      const worker = await Worker.create({
        connection: nativeConnection,
        taskQueue,
        workflowsPath: require.resolve('./workflows'),
        activities,
      });

      const result = await worker.runUntil(
        client.workflow.execute(example, {
          args: ['Temporal'],
          workflowId: 'test',
          taskQueue,
        }),
      );
      assert.equal(result, 'Hello, Temporal!');
    });
  });

  describe('with nyc coverage patch (erratic coverage)', () => {
    const workflowCoverage = new WorkflowCoverage();
    it('successfully completes the Workflow', async () => {
      const { client } = testEnv;

      const { nativeConnection } = testEnv;
      const worker = await Worker.create(
        workflowCoverage.augmentWorkerOptions({
          connection: nativeConnection,
          taskQueue,
          workflowsPath: require.resolve('./workflows'),
          activities,
        }),
      );

      const result = await worker.runUntil(
        client.workflow.execute(example, {
          args: ['Temporal'],
          workflowId: 'test',
          taskQueue,
        }),
      );
      assert.equal(result, 'Hello, Temporal!');
    });

    afterAll(async () => {
      workflowCoverage.mergeIntoGlobalCoverage();
    });
  });
});
