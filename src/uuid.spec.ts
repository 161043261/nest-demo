import { v4 as uuidV4 } from 'uuid';

describe('uuid', () => {
  // pnpm test src/uuid.spec.ts -t uuid
  it('test1', () => {
    const uuid = uuidV4();
    console.log('uuid:', uuid);
  });
});
