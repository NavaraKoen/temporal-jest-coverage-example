export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function returnWithDelay(name: string): Promise<string> {
  // We can do delays as we are in an activity
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `Hello, ${name}!`;
}
