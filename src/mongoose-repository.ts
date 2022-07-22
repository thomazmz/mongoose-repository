import * as mongoose from 'mongoose'
import { isArray, isQuery, parseFilter } from './utils'
import { Schema, Storable, StorableProperties, Repository, Query, Filter, SortOrder } from './interfaces'

export abstract class MongooseRepository<S extends Storable<K>, K extends string | number = string> implements Repository<S, K> {

  private defaultSortLimit: number = 100
  private defaultSortOffset: number = 0
  private defaultSortProperty: string = 'createdAt'
  private defaultSortOrder: SortOrder  = 'descending'

  private _model?: mongoose.Model<mongoose.ObtainDocumentType<mongoose.ObtainDocumentType<mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<S>>, S, "type">, S, "type">>

  constructor()
  constructor(collection: string, properties: Schema<S, K>)
  constructor(collection?: string, properties?: Schema<S, K>) {
    if(collection && properties) {
      this.setModel(collection, properties)
    }
  }

  protected setModel(collection: string, schema: Schema<S, K>): void {
    const mongooseSchema = new mongoose.Schema(schema as mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<S>>, {
      _id: true,
      collection,
      timestamps: {
        createdAt: true,
        updatedAt: true,
      },
    })

    this._model = mongoose.model(collection, mongooseSchema)
  }

  protected get model() {
    if(!this._model) {
      throw new Error('Model is not defined. A model must be defined by calling the setModel method on the repository instance.')
    }

    return this._model
  }

  public async create(properties: StorableProperties<S, K>): Promise<S> {
    const document = await this.model.create(properties)
    return this.convertDocumentToEntity(document)
  }

  public async get(): Promise<S[]>
  public async get(ids: K[]): Promise<S[]>
  public async get(ids: K): Promise<S | undefined>
  public async get(filter: Filter<S>): Promise<S[]>
  public async get(query: Query<S>): Promise<S[]>
  public async get(querable?: K | K[] | Query<S> | Filter<S> ): Promise<S | S[] | undefined> {

    if(!querable) {
      return this.getByFilter({})
    }

    if(isArray(querable)) {
      return this.getByIds(querable)
    }

    if(typeof querable !== 'object') {
      return this.getById(querable)
    }
 
    if(isQuery<S>(querable)) {
      return this.getByQuery(querable)
    }

    return this.getByFilter(querable)
  }

  public async getById(id: K): Promise<S | undefined> {
    const document = (await this.model.findById(id)) ?? undefined
    if(document) return this.convertDocumentToEntity(document)
    return undefined
  }

  public async getByIds(ids: K[]): Promise<S[]> {
    const documents = await this.model.find({ id: { $in: [ids] }})
    return this.convertDocumentsToEntities(documents)
  }

  public async getByFilter(filter: Filter<S>): Promise<S[]> {
    const parsedFilter = parseFilter(filter)
    const documents = await this.model.find(parsedFilter)
    return this.convertDocumentsToEntities(documents)
  }

  public async getByQuery(query: Query<S>): Promise<S[]> {
    const { filter, sort } = query

    const property = sort?.property ?? this.defaultSortProperty
    const offset = sort?.offset ?? this.defaultSortOffset
    const limit = sort?.limit ?? this.defaultSortLimit
    const order = sort?.order ?? this.defaultSortOrder

    const parsedFilter = parseFilter(filter)

    const documents = await this.model
      .find(parsedFilter)
      .skip(offset)
      .limit(limit)
      .sort({ [property as string]: order })
      .exec()

    return this.convertDocumentsToEntities(documents)
  }

  protected convertDocumentToEntity(document: mongoose.Document): S {
    const { __v, _id, ...object } = document.toObject()
    return { ...object, id: _id.toString() } as S
  }

  protected convertDocumentsToEntities(documents: mongoose.Document[]): S[] {
    return documents.map(document => this.convertDocumentToEntity(document))
  }
}
