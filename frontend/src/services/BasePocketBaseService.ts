import { BadRequest, ServerError } from '@/types';
import PocketBase, {
  type RecordListOptions,
  type RecordOptions,
} from 'pocketbase';

export class BasePocketBaseService<Base, Record> {
  protected pb: PocketBase;
  protected readonly collectionName: string;

  constructor(collection: string) {
    this.pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
    this.collectionName = collection;
  }

  async getAll(
    page: number = 1,
    perPage: number = 50,
    options?: RecordListOptions
  ) {
    try {
      const dbRecords = await this.pb
        .collection(this.collectionName)
        .getList<Record>(page, perPage, {
          ...options,
          $autoCancel: false,
        });

      return dbRecords.items;
    } catch (error) {
      console.error(error);
      throw new Error('An error occured when getting info.');
    }
  }

  async getOne(id: string, options?: RecordListOptions) {
    try {
      const dbRecord = await this.pb
        .collection(this.collectionName)
        .getOne<Record>(id, { ...options, $autoCancel: false });

      return dbRecord;
    } catch (error: any) {
      console.log(error);
      throw new Error('An error occured when getting info.');
    }
  }

  async delete(id: string) {
    try {
      const success = await this.pb.collection(this.collectionName).delete(id);

      return success;
    } catch (error: any) {
      console.warn(error);
      if (error.status >= 500) throw new ServerError();
      if (error.status >= 400) throw new BadRequest();
      else throw new Error('An error occured when deleting item');
    }
  }

  async create(data: Base, options?: RecordOptions) {
    try {
      const createResult = await this.pb
        .collection(this.collectionName)
        .create<Record>(data as FormData, options);

      return createResult;
    } catch (error) {
      throw new Error('An error occured when creating project.');
    }
  }

  async update(id: string, records: Partial<Record>) {
    try {
      const updateResult = await this.pb
        .collection(this.collectionName)
        .update<Record>(id, records);

      return updateResult;
    } catch (error: any) {
      console.log(error);
    }
  }

  subscribe(
    actions: string,
    callback: (action: string, record: Record) => void
  ) {
    this.pb
      .collection(this.collectionName)
      .subscribe(actions, (e: { action: string; record: Record }) => {
        callback(e.action, e.record);
      });
  }

  unsubscribe() {
    this.pb.collection(this.collectionName).unsubscribe();
  }
}
