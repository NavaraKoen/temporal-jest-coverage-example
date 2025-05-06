import { WorkflowCoverage } from '@temporalio/nyc-test-coverage';
import * as libCoverage from 'istanbul-lib-coverage';

const convertToJestCoverageFormat = (covData: libCoverage.CoverageMapData) => {
  const result: Record<string, unknown> = {};
  Object.entries(covData).forEach(([k, v]) => {
    if ('data' in v) {
      result[k] = v.toJSON();
    }
  });

  return result;
};

export const mergeCoverageInJestFormat = (workflowCoverage: WorkflowCoverage, globalCoverage?: any) => {
  const newCoverage = libCoverage.createCoverageMap();

  for (const data of workflowCoverage.coverageMapsData) {
    newCoverage.merge(data);
  }

  if (globalCoverage) {
    newCoverage.merge(libCoverage.createCoverageMap(globalCoverage));
  }

  workflowCoverage.coverageMapsData.length = 0;

  const convertedCoverageMap = convertToJestCoverageFormat(newCoverage.data);

  (global as any).__coverage__ = convertedCoverageMap;
};
