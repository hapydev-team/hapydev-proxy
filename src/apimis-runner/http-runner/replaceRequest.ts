import { ApiRequest } from '../../types/collection';

export const replaceRequest = (
  request: ApiRequest,
  replaceVariables,
  auto_convert_field_to_mock: 1 | -1
) => {
  const result: ApiRequest = request;

  result.url = replaceVariables(result.url, null, auto_convert_field_to_mock);
  request.auth = JSON.parse(
    replaceVariables(JSON.stringify(request.auth), null, auto_convert_field_to_mock)
  );
  request.headers.parameter = JSON.parse(
    replaceVariables(JSON.stringify(request.headers.parameter), null, auto_convert_field_to_mock)
  );
  request.params = JSON.parse(
    replaceVariables(JSON.stringify(request.params), null, auto_convert_field_to_mock)
  );
  request.body = JSON.parse(
    replaceVariables(JSON.stringify(request.body), null, auto_convert_field_to_mock)
  );

  for (let i = 0; i < request.pre_tasks.length; i++) {
    request.pre_tasks[i] = JSON.parse(
      replaceVariables(JSON.stringify(request.pre_tasks[i]), null, auto_convert_field_to_mock)
    );
  }

  for (let i = 0; i < request.post_tasks.length; i++) {
    request.post_tasks[i] = JSON.parse(
      replaceVariables(JSON.stringify(request.post_tasks[i]), null, auto_convert_field_to_mock)
    );
  }

  return result;
};
