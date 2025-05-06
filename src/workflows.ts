import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greet, returnWithDelay } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  // Making this more complex to test the coverage
  // This is a comment to test the coverage

  if(name === 'Temporal') {
    // This is a comment to test the coverage
    return returnWithDelay(name); 
  }

  return greet(name);

  // This is a comment to test the coverage
}
