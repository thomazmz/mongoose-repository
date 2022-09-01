# Mongoose Repository

A repository implementation to be used alongside Mongoose.

# Getting Started

**Install `mongoose-repository` alongside with `mongoose`**

```TypeScript
// if you are using npm
npm install mongoose-repository mongoose

```
```TypeScript
// if you are using yarn
yarn install mongoose-repository mongoose 
```

**Open a MongoDB connection through Mongoose**


```Typescript
import { mongoose } from 'mongoose'

mongoose.connect('your-connection-string-here')
```

**Define your _Storable_ type**

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

**Define your _StorableSchema_**  

```TypeScript
import { Schema } from 'mongoose-repository'

// This library uses the mongoose schema definition underneath
// in otder to define its own Schema type. 

// Storable properties such as id, createdAt and updatedAt are 
// implicitly defined (see "The Repository Interface" section
// for more details on the Storable type).

const catSchema: Schema<Cat> = {
  name: {
    type: String,
    required: true,
  },
  fur: {
    type: String,
    required: true,
    enum: [ 'black', 'brown', 'grey', 'white', 'Taby' ],
  },
  age: {
    type: Number,
    required: true,
    minimum: 0,
  }
}
```

**Define your Repository class**

```Typescript
import { MongooseRepository } from 'mongoose-repository'

@InjectSchema('cats', catsSchema)
class CatsRepository extends MongooseRepository<Cat> {
}
```

**Instanciate and use your repository instance**

```Typescript
const catsRepository = new CatsRepository()

catsRepository.create({
  name: 'Analu',
  fur: 'Taby',
  age: 5,
})
```

# MongooseRepository Implementation

This library, as it's name's suggest, implements an abstract generic implementation of the Repository interface that exposes persistency funcionalitiese from MongoDB/Mongoose in accordance to the _Repository_ interface described bellow.

# Repository Interface Definition

In the context of this library, we define a _Repository_ as a TypeScript interface that implies a set of methods that can be used to interact with a given persistency layer. Each _Repository_ instance takes care of articulating persistency operations regards specific _Storable_ type/class instances which is explicity defined in the _Repository_ type declaration through generics (such as in ` CatRepository extends Repository<Cat>` example above).

An _Storable_, in turn, can be any type/class instance that holds the properties _id_, _createdAt_ and _updatedAt_. The _id_ property, a string, should be understood as a value that uniquelly identifies each entity of that specific type/class. The _createdAt_ and _updatedAt_ properties, both Dates, represents, respectivelly, the moment in which that specific entity had been persisted on the database and the last moment in which that same entity has it's state changed on the persistency layer.

# The Repository Methods

All the following specifications will take into consideration the `CatRepository` example introduced in our [Getting Started](#Getting-Started) section. 

## Create Methods

### **.createOne**  

Persists a single instance of `Cat` in accordance with the given `properties` object. Will asign a unique _id_ property and also the _createdAt_ and _updatedAt_ timestamps for the persisted `Cat` instance. Returns the created `Cat` instance in case of success.

```TypeScript
createOne(properties: StorableProperties<Cat>): Promise<Cat>
```

This operation will throw an error if the given StorableProperties is not considered valid thowards the defined `CatSchema` and no `Cat` instance will be persisted.

Running the following program will result on having an instance of the Cat type persisted on MongoDB:

```TypeScript
(async () => {
  await catsRepository.create({
    name: 'Analu',
    fur: 'Taby',
    age: 5,
  })
})()

// Persisted Instance will look as something like that:
//
// {
//     id: '631008eb117b09edf6d8667c',
//     createdAt: 2022-09-01T01:20:43.000Z,
//     updatedAt: 2022-09-01T01:20:43.000Z,
//     name: 'Analu',
//     fur: 'Taby',
//     age: 5,
// }

```

### **.createMany**

Persists as many instances of `Cat` as given in the `properties` array. Will assign a unique _id_ property and also the _createdAt_ and _updatedAt_ timestamps for each of the persisted `Cat` instances. Returns the created `Cat` instances as an array in case of success.

```TypeScript
createOne(properties: StorableProperties<Cat>[]): Promise<Cat[]>
```

This operation will throw an error if one or many of the StorableProperties on the array are not considered valid thowards the defined `CatSchema` and no `Cat` instance will be persisted.

Running the following program will result on having two instancea of the Cat type persisted on MongoDB:

```TypeScript
(async () => {
  await catsRepository.create([
    {
      name: 'Analu',
      fur: 'Taby',
      age: 5,
    },
    {
      name: 'Muzzarela',
      fur: 'White',
      age: 10,
    }
  ])
})()

// Persisted Instances will look as something like that:
//
// {
//     id: '6310099ed5f99633e1fee102',
//     createdAt: 2022-09-01T01:23:42.000Z,
//     updatedAt: 2022-09-01T01:23:42.000Z,
//     name: 'Analu',
//     fur: 'Taby',
//     age: 5,
// }
//
// {
//     id: '631009c5e52b43ae1aaf8610',
//     createdAt: 2022-09-01T01:24:21.000Z,
//     updatedAt: 2022-09-01T01:24:21.000Z,
//     name: 'Muzzarela',
//     fur: 'White',
//     age: 10,
// }

```

### **.create (overeloads all create methods)**  
Overloads all the above mentioned create methods. It should be used if you want to define your input dinamically or if you wants to use the library in a more polimorphic style. The method will behave in accordance to the parameter type passed in runtime. 

## Get Methods

**GetById**

**GetByIds**

**GetByFilter**

**GetByQuery**

**Get (overloads all get methods)**

## Update Methods

**.updateOne**

**.updateMany**

**.updateByFilter**

**.updateByQuery**

**.update (overloads all update methods)**

## Delete Methods

**.deleteById**

**.deleteByIds**

**.deleteByFilter**

**.deleteByQuery**

**.delete (overloads all delete methods)**

