import { StorableSchema } from "interfaces";
import { TestEntity } from "./test-entity";

export const testSchema: StorableSchema<TestEntity> = {
  dateProperty: {
    type: Date,
    required: true,
  },
  numberProperty: {
    type: Number,
    required: true,
  },
  stringProperty: {
    type: String,
    required: true,
  },
  booleanProperty: {
    type: Boolean,
    required: true,
  }
}