import { model, Model, Document, Schema, SchemaDefinition, SchemaDefinitionType } from 'mongoose'
import { RepositorySchema, Storable, StorableProperties, Repository } from './interfaces'

export abstract class MongooseRepository<S extends Storable<K>, K extends string | number = string> implements Repository<S, K> {

  private _model?: Model<S>

  constructor()
  constructor(collection: string, properties: RepositorySchema<S, K>)
  constructor(collection?: string, properties?: RepositorySchema<S, K>) {
    if(collection && properties) {
      this.setModel(collection, properties)
    }
  }

  protected setModel(collection: string, schema: RepositorySchema<S, K>): void {
    const mongooseSchema = new Schema(schema as SchemaDefinition<SchemaDefinitionType<S>>, {
      _id: true,
      collection,
      timestamps: {
        createdAt: true,
        updatedAt: true,
      },
    })

    this._model = model(collection, mongooseSchema)
  }

  protected get model() {
    if(!this._model) {
      throw Error('Model is not defined. A model must be defined by calling the setModel method on the repository instance.')
    }

    return this._model
  }

  protected convertDocumentToEntity(document: Document): S {
    const { __v, _id, ...object } = document.toObject()
    return { ...object, id: _id } as S
  }

  async create(properties: StorableProperties<S, K>): Promise<S | undefined> {
    const document = await this.model.create(properties)
    return this.convertDocumentToEntity(document)
  }

  async get(id: K): Promise<S | undefined> {
    const document = await this.model.findById(id)

    if(!document) {
      return undefined
    }

    return this.convertDocumentToEntity(document)
  }
}


