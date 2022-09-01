# Mongoose Repository

**TLDR** MongooseRepository is a repository implementation to be used alongside Mongoose.

___
The MongooseRepository is an abstract class implementation that exposes persistency functionalities from MongoDB/Mongoose according to the [_Repository_](https://github.com/thomazmz/mongoose-repository/blob/improove-readme/src/interfaces/repository.ts) interface.

The _Repository_ interface defined in this library is a TypeScript interface that implies a set of methods to interact with a given persistency layer. Each _Repository_ instance articulates persistency operations regards a specific _Storable_ type/interface. The _Storable_ type/interface related to a _Repository_ is declared on its subclass declaration through generics; As done in `class CatRepository extends Repository<Cat>` in the [Getting Started](#Getting-Started) section of this document).

A _Storable_, in turn, is any type/interface that contains the properties _id_, _createdAt_, and _updatedAt_. The _id_ property, a string, should be understood as a value that uniquely identifies each entity of that specific type/interface. The _createdAt_ and _updatedAt_ properties, both Dates, represent, respectively, the timestamp in which that entity was persisted in the database and the last moment in which that same entity has its state changed in the persistency layer.
# Getting Started

**1. Install `mongoose-repository` alongside with `mongoose`**

```TypeScript
// if you are using npm
npm install mongoose-repository mongoose
```
```TypeScript
// if you are using yarn
yarn add mongoose-repository mongoose 
```

**2. Open a MongoDB connection through Mongoose**

```Typescript
import { mongoose } from 'mongoose'

mongoose.connect('your-connection-string-here')
```

**3. Define your _Storable_ type**

```TypeScript
type Cat = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
  name: string,
  fur: string,
  age: number,
}
```

**4. Define your _StorableSchema_**  

```TypeScript
import { StorableSchema } from 'mongoose-repository'

// This library uses the mongoose schema definition underneath
// in order to define the StorableSchema type. 

// Storable properties such as id, createdAt, and updatedAt are 
// implicitly defined (see "The Repository Interface" section
// for more details on the Storable type).

const catSchema: StorableSchema<Cat> = {
  name: {
    type: String,
    required: true,
  },
  fur: {
    type: String,
    required: true,
    enum: [ 'black', 'brown', 'grey', 'white', 'taby' ],
  },
  age: {
    type: Number,
    required: true,
    minimum: 0,
  }
}
```

**5. Define your Repository class**

```Typescript
import { MongooseRepository } from 'mongoose-repository'

@InjectSchema('cats', catsSchema)
class CatsRepository extends MongooseRepository<Cat> {
}
```

**6. Instantiate and use your Repository instance**

```Typescript
const catsRepository = new CatsRepository()

catsRepository.create({
  name: 'Analu',
  fur: 'taby',
  age: 5,
})
```


# Repository Methods

## Create Methods

### **.create**  
Overloads all the `.create*` methods documented below. It will behave in accordance with the `properties` object parameter value given in runtime.

### **.createOne**  

Persists a single instance of in accordance with the given `properties` object passed as a parameter. It will assign the persisted instance a unique _id_ property and  the _createdAt_/_updatedAt_ timestamps. After the operatoin finishes, this method will return the created instance in case of success and will throw an error if the given StorableProperties is not considered valid towards the defined _StorableSchema_, resulting in the instance not being persisted.

```TypeScript
createOne(properties: StorableProperties<S>): Promise<S>
```

### **.createMany**

Persists as many instances as given in the `properties` array passed as parameter. It will assign each persisted instance a unique _id_ property and the _createdAt_/_updatedAt_ timestamps. After the oppearation finishes, this method will return the created instances as an array. As this method runs an atomic 
persistency transaction, it will throw an error if one or many of the StorableProperties on the array are not considered valid towards the defined _StorableSchema_, resulting in none of the instances being persisted.

```TypeScript
createOne(properties: StorableProperties<S>[]): Promise<S[]>
```

## Get Methods

### **.get**  

When called with no parameter, this method retrieves all the instances from the persistency layer and returns them as an array. It also overloads all the other `.get*` methods documented below.  

 ```TypeScript  
get(): Promise<Cat[]>
```

### **.getById**  

This method returns a specific instance by its id. In case none is found, it will return `undefined`.  

```TypeScript  
get(id: K): Promise<S | undefined>
```

### **.getByIds**  

This method returns an array of instances given an array of ids, returning only the instances that exact match the given ids.  

```TypeScript  
get(ids: K[]): Promise<S[]>
```

### **.getByFilter**  

This method returns an array of instances given a _Filter_. You can read more about filtering in the [Filtering](##Filtering) section of this guide.  

```TypeScript
get(filter: Filter<S>): Promise<S[]>
```

### **.getByQuery**  

This method returns an array of instances given a Query. You can read more about querying in the [Querying](##Filtering) section of this guide  

```TypeScript
get(query: Query<S>): Promise<S[]>
```
