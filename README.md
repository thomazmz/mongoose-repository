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

// Storable properties sucha as id, createdAt and updatedAt are 
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

# The MongooseRepository 

This library, as it's name's suggest, implements an abstract generic implementation of the Repository interface that exposes persistency funcionalitiese from MongoDB/Mongoose in accordance to the _Repository_ interface described bellow.

# The Repository Interface

In the context of this library, we define a _Repository_ is a TypeScript interface that implies a set of methods that can be used to interact with a given persistency layer. Each _Repository_ instance takes care of articulating persistency operations regards specific _Storable_ type/class instances which is explicity defined in the _Repository_ type declaration through generics.

An _Storable_, in turn, can be any type/class instance that holds the properties _id_, _createdAt_ and _updatedAt_. The _id_ property, a string, should be understood as a value that uniquelly identifies each entity of that specific type/class. The _createdAt_ and _updatedAt_ properties, both Dates, represents, respectivelly, the moment in which that specific entity had been persisted on the database and the last moment in which that same entity has it's state changed on the persistency layer.
