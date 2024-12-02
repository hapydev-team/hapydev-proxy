import { ApimisCollection, ApiRequest, FolderRequest } from '../../types/collection';
import ApimisSandbox from '../../apimis-sandbox';
import { ProjectDetails } from '../../types/project';
import { isArray, isEmpty, isString, isUndefined } from 'lodash';
import { Auth } from '../../types/collection/auth';

export const runPreScripts = async (
  mySandbox: ApimisSandbox,
  projectDetails: ProjectDetails,
  collections: ApimisCollection<FolderRequest>[]
) => {
  //先运行项目脚本，在运行目录脚本

  //await mySandbox.execute(projectDetails?.pre_scripts ?? '');

  //再运行目录下的脚本 顺序为：父目录>>子目录

  for await (const item of collections) {
    if (!isArray(item?.data?.request?.pre_tasks)) {
      continue;
    }
    for await (const taskItem of item?.data.request.pre_tasks) {
      if (
        taskItem?.type === 'custom_script' &&
        taskItem?.enabled === 1 &&
        isString(taskItem?.data) &&
        !isEmpty(taskItem?.data)
      ) {
        await mySandbox.execute(taskItem?.data);
      }
    }
  }
};

export const runPostScripts = async (
  mySandbox: ApimisSandbox,
  projectDetails: ProjectDetails,
  collections: ApimisCollection<FolderRequest>[]
) => {
  //先运行项目脚本，在运行目录脚本
  // await mySandbox.execute(projectDetails?.post_scripts);

  //再运行目录下的脚本 顺序为：父目录>>子目录

  for await (const item of collections) {
    if (!isArray(item?.data?.request?.post_tasks)) {
      continue;
    }
    for await (const taskItem of item?.data?.request?.post_tasks) {
      if (
        taskItem?.type === 'custom_script' &&
        taskItem?.enabled === 1 &&
        isString(taskItem?.data) &&
        !isEmpty(taskItem?.data)
      ) {
        await mySandbox.execute(taskItem?.data);
      }
    }
  }
};

export const getApiAuth = (
  apiData: ApimisCollection<ApiRequest>,
  collections: { [api_id: string]: ApimisCollection<FolderRequest> }
) => {
  const NOAUTH: Auth = {
    type: 'noauth',
  };

  const getParentAuth = (parent_id) => {
    const folderData = collections?.[parent_id];
    if (isUndefined(folderData)) {
      return NOAUTH;
    }
    if (folderData?.data?.request?.auth?.type === 'noauth') {
      return NOAUTH;
    }
    //继承父级
    if (folderData?.data?.request?.auth?.type === 'inherit') {
      return getParentAuth(folderData?.parent_id);
    }
    return folderData?.data?.request?.auth;
  };

  if (apiData?.data?.request?.auth?.type === 'noauth') {
    return NOAUTH;
  }
  //继承父级
  if (apiData?.data?.request?.auth?.type === 'inherit') {
    return getParentAuth(apiData?.parent_id);
  }
  return apiData?.data?.request?.auth;
};
