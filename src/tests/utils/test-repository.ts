import { InjectSchema } from "../../decorators";
import { MongooseRepository } from "../../mongoose-repository";
import { TestEntity } from './test-entity'
import { testSchema } from "./test-schema";

@InjectSchema('test-collection', testSchema)
export class TestRepository extends MongooseRepository<TestEntity> {
  getModel() {
    return this.model
  }
}