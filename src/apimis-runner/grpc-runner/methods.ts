import { isUndefined, startsWith } from 'lodash';
import { GrpcCollection, GrpcRequest, GrpcService } from '../../types/collection/grpc';
const { GrpcReflection } = require('grpc-js-reflection-client');
const grpc = require('@grpc/grpc-js');
import protobuf from 'protobufjs';

export const getMethodsByReflection = async (data: GrpcCollection) => {
  const grpcReflection = new GrpcReflection(
    data.data?.request?.url,
    grpc.ChannelCredentials.createInsecure()
  );
  const serviceList = await grpcReflection.listServices();

  const serviceDatas = {};
  for (const serviceItem of serviceList) {
    if (startsWith(serviceItem, 'grpc.reflection.v1')) {
      continue;
    }
    serviceDatas[serviceItem] = [];
    const methods = await grpcReflection.listMethods(serviceItem);
    methods.forEach((item) => {
      serviceDatas[serviceItem].push({
        name: item?.name,
        requestStream: item?.definition?.requestStream,
        responseStream: item?.definition?.responseStream,
      });
    });
  }

  return serviceDatas;
};

//获取服务列表
const getProtoServiceList = (grpcRoot) => {
  const result = [];
  const digFind = (protoNode, parents) => {
    if (
      protoNode instanceof protobuf.Namespace === false &&
      protoNode instanceof protobuf.Root === false
    ) {
      return;
    }
    Object.keys(protoNode?.nested || {}).forEach((key) => {
      const node = grpcRoot.lookup(key);
      if (node instanceof protobuf.Namespace) {
        digFind(node, parents.concat(node.name));
      }
      if (node instanceof protobuf.Service) {
        result.push(parents.concat(node.name).join('.'));
      }
    });
  };
  digFind(grpcRoot, []);
  return result;
};

//获取服务方法
const getProtoMethods: (root: any, serviceName: string) => any[] = (root, serviceName) => {
  const node = root.lookup(serviceName);

  return node.methods;
};

//通过proto文件获取方法列表
export const getMethodsByProto = async (collection: GrpcCollection) => {
  var root = protobuf.parse(collection.data.request.definition.main_proto?.code).root;
  const serviceList = getProtoServiceList(root);
  const serviceDatas = {};
  for (const serviceItem of serviceList) {
    if (startsWith(serviceItem, 'grpc.reflection.v1')) {
      continue;
    }
    serviceDatas[serviceItem] = [];
    const methods = getProtoMethods(root, serviceItem);
    Object.values(methods).forEach((item) => {
      serviceDatas[serviceItem].push({
        name: item?.name,
        requestStream: item?.requestStream === true,
        responseStream: item?.responseStream === true,
      });
    });
  }
  return serviceDatas;
};

export const getMethodDetail = (request: GrpcRequest, serviceName: string, methodName: string) => {
  const serviceInfo: GrpcService = request?.definition?.services?.find(
    (item) => item.service_name === serviceName
  );
  if (isUndefined(serviceInfo)) {
    throw new Error('服务不存在');
  }
  for (const method of serviceInfo?.methods) {
    if (method.method_name === methodName) {
      return method;
    }
  }
  throw new Error('方法未定义');
};
