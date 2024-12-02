import { BaseProto } from '../../types/collection/grpc';
import fs from 'fs';
const protoLoader = require('@grpc/proto-loader');
const os = require('os');
const path = require('path');

export const getProtoBuff = async (api_id: string, protoInfo: BaseProto) => {
  const tempDir = os.tmpdir();
  const folderPath = path.join(tempDir, api_id);
  if (!fs.existsSync(folderPath)) {
    await fs.mkdirSync(path.join(tempDir, api_id));
  }
  //创建proto文件
  const protoPath = path.join(folderPath, protoInfo.name);
  await fs.writeFileSync(protoPath, protoInfo.code);
  // if (!fs.existsSync(protoPath)) {

  // }
  const packageDefinition = await protoLoader.load(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  return packageDefinition;
};
