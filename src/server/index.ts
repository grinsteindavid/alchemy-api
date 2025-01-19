import { getLogger } from '../utils/logger';
import { connectDatasources, getApplication } from './app';

const { PORT, HOST, NODE_ENV } = process.env;

export const main = async () => {
  await connectDatasources();
  const app = await getApplication();
  const serverAddress = await app.listen(PORT || '5000', HOST);

  getLogger().info(
    `Server[${NODE_ENV}] successfully started on: ${serverAddress} }]
    `,
  );
};

void main();
