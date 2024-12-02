import { isPlainObject, isUndefined } from 'lodash';
import { ApimisCollection, FolderRequest } from '../types/collection';
import { ProjectDetails } from '../types/project';
import { Auth } from '../types/collection/auth';
import { ApiCollection } from '../types/collection/api';
import { FolderCollection } from '../types/collection/folder';

//获取接口所使用的服务ID
export const getCollectionServerId = (
  parent_id,
  collections: { [key: string]: FolderCollection }
) => {
  //递归查找
  const digFind = (pid) => {
    const parentItem: FolderCollection = collections?.[pid];
    const server_id = parentItem?.data?.server_id;
    if (isUndefined(parentItem)) {
      return 'default';
    }
    //继承父级
    if (parentItem?.data?.server_id === 'inherit') {
      return digFind(parentItem?.parent_id);
    }
    return parentItem.data?.server_id;
  };
  return digFind(parent_id);
};

// 获取某接口的所有父target
export const getParentFolderIds = (parent_id, collections: { [key: string]: FolderCollection }) => {
  const result = [];

  const digFind = (parent_id) => {
    const parentInfo: FolderCollection = collections?.[parent_id];
    if (isUndefined(parentInfo)) {
      return;
    }
    result.push(parentInfo.id);
    digFind(parentInfo.parent_id);
  };
  digFind(parent_id);
  return result;
};

//依次获取父级目录信息
export const getParentFolders = (parent_id, collections: { [key: string]: FolderCollection }) => {
  const result: FolderCollection[] = [];

  const digPush = (pid: string) => {
    const paerntItem = collections[pid];
    if (isPlainObject(paerntItem)) {
      result.splice(0, 0, paerntItem);
      digPush(paerntItem?.parent_id);
    }
  };
  digPush(parent_id);

  return result;
};

//获取接口所使用的服务ID

export const getCollectionAuth: (
  parent_id: string,
  collections: { [key: string]: FolderCollection },
  projectDetails: ProjectDetails
) => Auth = (parent_id, collections, projectDetails) => {
  const defaultAuth = isPlainObject(projectDetails?.auth)
    ? projectDetails.auth
    : ({
        type: 'noauth',
      } as Auth);
  const digFind = (pid) => {
    const parentItem = collections[pid];
    if (isUndefined(parentItem)) {
      return defaultAuth;
    }
    //继承父级
    if (parentItem?.data?.request?.auth?.type === 'inherit') {
      return digFind(parentItem?.parent_id);
    }
    return parentItem?.data?.request?.auth;
  };
  return digFind(parent_id);
};
