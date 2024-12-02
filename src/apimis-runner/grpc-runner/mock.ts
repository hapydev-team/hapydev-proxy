import { get } from 'lodash';
import { GrpcCollection, GrpcRequest } from '../../types/collection/grpc';
import { getProtoBuff } from './tempfile';
import { PROTO_TYPES } from './constants';
const { GrpcReflection } = require('grpc-js-reflection-client');
const grpc = require('@grpc/grpc-js');
const Mock = require('mockjs');

const mockReflectionRequest = async (request: GrpcRequest) => {
  const grpcReflection = new GrpcReflection(request?.url, grpc.ChannelCredentials.createInsecure());
  const serviceInfo = await grpcReflection.getDescriptorBySymbol(request?.service_name);
  const packageData = serviceInfo.getPackageObject({
    keepCase: true,
    enums: String,
    longs: String,
  });
  const serviceData = get(packageData, request?.service_name);
  const methodData = get(serviceData, `service.${request.method_name}`);
  const requestFileds = get(methodData, 'requestType.type.field');
  const result = mockData(requestFileds);
  return result;
};

const mockProtoRequest = async (collection: GrpcCollection) => {
  const request = collection.data.request;
  const packageDefinition = await getProtoBuff(collection.id, request.definition?.main_proto);
  const packageData = grpc.loadPackageDefinition(packageDefinition);
  const serviceData = get(packageData, request?.service_name);
  const methodData = get(serviceData, `service.${request.method_name}`);
  const requestFileds = get(methodData, 'requestType.type.field');
  const result = mockData(requestFileds);
  return result;
};

export const mockRequest = async (collection: GrpcCollection) => {
  const request = collection.data.request;
  if (request.definition.is_reflection === 1) {
    return await mockReflectionRequest(request);
  }
  return await mockProtoRequest(collection);
};

function mockText(protoType) {
  const type = PROTO_TYPES?.[protoType] ?? 'string';
  switch (type) {
    case 'string':
      return Mock.Random.title();
    case 'bool':
      return true;
    case 'number':
    case 'int32':
    case 'int64':
    case 'uint32':
    case 'uint64':
    case 'sint32':
    case 'sint64':
    case 'fixed32':
    case 'fixed64':
    case 'sfixed32':
    case 'sfixed64':
      return Mock.mock(`@integer(1,1000)`);
    case 'double':
    case 'float':
      return Mock.mock(`@float( 1, 10, 2, 5 )`);
    case 'bytes':
      return new Buffer('Hello Apimis');
    default:
      return null;
  }
}

const mockData = (fileds) => {
  const result = {};
  for (const item of fileds) {
    result[item.name] = mockText(item?.type);
  }
  return result;
};
