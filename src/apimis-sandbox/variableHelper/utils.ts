import { Variables } from '../../types/options';

export const presetVariables = (variables: Partial<Variables>) => {
  const result: Variables = {
    global: variables?.global || {},
    environment: variables?.environment || {},
    collection: variables?.collection || {},
    temporary: variables?.temporary || {},
    iterationData: variables.iterationData || {},
  };
  return result;
};
