import { model, Model, Document, Schema, SchemaDefinition, SchemaDefinitionType } from 'mongoose'
import { RepositorySchema, Storable, StorableProperties, Repository, Query, Filter, Sort } from './interfaces'

// function isQuery(potentialQuery: any) potentialQuery is Query {} 

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
      throw new Error('Model is not defined. A model must be defined by calling the setModel method on the repository instance.')
    }

    return this._model
  }

  async create(properties: StorableProperties<S, K>): Promise<S | undefined> {
    const document = await this.model.create(properties)
    return this.convertDocumentToEntity(document)
  }

  async get(ids: K[]): Promise<S[]>
  async get(ids: K): Promise<S | undefined>
  async get(filter: Filter<S>): Promise<S[]>
  async get(query: Query<S>): Promise<S[]>
  async get(querable: K | K[] | Query<S> | Filter<S>): Promise<S | S[] | undefined> {

    if(Array.isArray(querable)) {
      return this.getByIds(querable)
    }

    if(typeof querable !== 'object') {
      return this.getById(querable)
    }
 
    if(this.isQuery(querable)) {
      return this.getByQuery(querable)
    }

    return this.getByFilter(querable)
  }

  public async getById(id: K): Promise<S | undefined> {
    const document = await this.getDocumentById(id)
    if(document) return this.convertDocumentToEntity(document)
    return undefined
  }

  public async getByIds(ids: K[]): Promise<S[]> {
    const documents = await this.getDocumentsByIds(ids)
    return documents.map(document => this.convertDocumentToEntity(document))
  }

  public async getByQuery(query: Query<S>): Promise<S[]> {
    throw Error('not implemented')
  }

  public async getByFilter(query: Filter<S>): Promise<S> {
    throw Error('not implemented')
  }

  public async getBySort(query: Sort<S>): Promise<S> {
    throw Error('not implemented')
  }

  protected async getDocumentById(id: K): Promise<Document<S> | undefined> {
    return (await this.model.findById(id)) ?? undefined
  }

  protected async getDocumentsByIds(ids: K[]): Promise<Document<S>[]> {
    return await this.model.find({ id: { $in: [ids] }})
  }

  protected convertDocumentToEntity(document: Document): S {
    const { __v, _id, ...object } = document.toObject()
    return { ...object, id: _id } as S
  }

  protected isQuery(potentialQuery: any): potentialQuery is Query<S> {
    return potentialQuery.filter || potentialQuery.sort
  }
}
