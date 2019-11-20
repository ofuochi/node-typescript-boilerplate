import { Query } from 'mongoose';

import { IBaseRepository } from '../../db/interfaces/repo.interface';
import { User } from '../user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  /**
   * Finds an element in the collection that matches the given query and updates the record
   * with the supplied update
   *
   * @param {Query<{ [key: string]: object }>} query
   * @param {{ [key: string]: object }} update
   * @returns {Promise<User>}
   * @memberof IUserRepository
   */
  findOneByQueryAndUpdate(
    query: Query<{ [key: string]: object }>,
    update: { [key: string]: object },
  ): Promise<User>;
}
