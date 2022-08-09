import { Schema } from "interfaces";
import { TestEntity } from "./test-entity";

export const testSchema: Schema<TestEntity> = {
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