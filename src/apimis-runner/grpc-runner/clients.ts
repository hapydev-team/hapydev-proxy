import { get } from 'lodash';
import { GrpcCollection, GrpcRequest } from '../../types/collection/grpc';
import { getProtoBuff } from './tempfile';
const grpc = require('@grpc/grpc-js');
const { GrpcReflection } = require('grpc-js-reflection-client');

//通过反射方式获取实例
const getReflectionClient = async (request: GrpcRequest) => {
  const grpcReflection = new GrpcReflection(request?.url, grpc.ChannelCredentials.createInsecure());
  const descriptor = await grpcReflection.getDescriptorBySymbol(request?.service_name);
  const packageData = descriptor.getPackageObject({
    keepCase: true,
    enums: String,
    longs: String,
  });
  const methodData = get(packageData, request?.service_name);
  const client = new methodData(request?.url, grpc.credentials.createInsecure());
  return client;
};

//通过本地proto获取实例
const getProtoClient = async (collection: GrpcCollection) => {
  const request = collection.data.request;
  const packageDefinition = await getProtoBuff(collection.id, request.definition?.main_proto);
  const packageData = grpc.loadPackageDefinition(packageDefinition);
  const methodData = get(packageData, request?.service_name);
  const client = new methodData(request?.url, grpc.credentials.createInsecure());
  return client;
};

//获取要调用的实例方法
export const getClient = async (collection: GrpcCollection) => {
  if (collection.data.request.definition.is_reflection === 1) {
    return await getReflectionClient(collection.data.request);
  }
  return getProtoClient(collection);
};
