import { StorableProperties } from 'interfaces'
import { createTestContext, TestEntity, TestRepository } from '../utils'

describe('MongooseRepository', () => {
  const testRepository = new TestRepository()

  const mongooseTestContext = createTestContext(testRepository.getModel())

  beforeAll(async () => {
    await mongooseTestContext.openConnection()
  })

  afterEach(async () => {
    await mongooseTestContext.resetTestCollection()
  })

  afterAll(async () => {
    await mongooseTestContext.closeConnection()
  })

  describe('create', () => {

    it('should persist test instance when valid parameters are passed', async () => {

      const stringProperty = 'someStringProperty'
      const numberProperty = 123456
      const dateProperty = new Date()
      const booleanProperty = true

      const result = await testRepository.create({
        stringProperty,
        numberProperty,
        dateProperty,
        booleanProperty,
      })

      expect(result.dateProperty).toEqual(dateProperty)
      expect(result.numberProperty).toEqual(numberProperty)
      expect(result.stringProperty).toEqual(stringProperty)

      const collection = await mongooseTestContext.fetchTestCollection()

      expect(collection.length).toBe(1)

      expect(collection[0].id).toEqual(result.id)
      expect(collection[0].createdAt).toEqual(result.createdAt)
      expect(collection[0].updatedAt).toEqual(result.updatedAt)
      expect(collection[0].dateProperty).toEqual(result.dateProperty)
      expect(collection[0].numberProperty).toEqual(result.numberProperty)
      expect(collection[0].stringProperty).toEqual(result.stringProperty)
      expect(collection[0].booleanProperty).toEqual(result.booleanProperty)
    })
    
    it('should persist test intances when an array of valid parameters are passed', async () => {
      const results = await testRepository.create([
        {
          stringProperty: 'someStringProperty',
          numberProperty: 123,
          dateProperty: new Date(),
          booleanProperty: false,
        },
        {
          stringProperty: 'anotherStringProperty',
          numberProperty: 456,
          dateProperty: new Date(),
          booleanProperty: true,
        }
      ])

      const collection = await mongooseTestContext.fetchTestCollection()

      expect(collection.length).toBe(results.length)

      results.forEach(async (result) => {
        const collectionDocument = collection.find(entity => entity.id === result.id)
        expect(collectionDocument.stringProperty).toEqual(result.stringProperty)
        expect(collectionDocument.numberProperty).toEqual(result.numberProperty)
        expect(collectionDocument.dateProperty).toEqual(result.dateProperty)
        expect(collectionDocument.booleanProperty).toEqual(result.booleanProperty)
      })
    })
  })

  describe('get', () => {

    const createTestCollectionEntites = (properties: StorableProperties<TestEntity>[] = []) => {
      return testRepository.create([ ...properties,
        {
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
        },
        {
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        },
        {
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        },
        {
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        },
        {
          stringProperty: 'EEE',
          numberProperty: 456,
          dateProperty: new Date(40),
          booleanProperty: true,
        },
        {
          stringProperty: 'FFF',
          numberProperty: 567,
          dateProperty: new Date(50),
          booleanProperty: false,
        },
      ])
    }

    it('should return all entities when no parameter is passed', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get()
      
      expect(result.length).toBe(6)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'EEE',
          numberProperty: 456,
          dateProperty: new Date(40),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'FFF',
          numberProperty: 567,
          dateProperty: new Date(50),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return entity by id when id is passed as first and only parameter', async () => {
      const entities = await createTestCollectionEntites()

      await Promise.all(entities.map(async entity => {
        const entityOnTheRepository = await testRepository.get(entity.id)
        expect(entity).toEqual(entityOnTheRepository)
      }))
 
    })

    it('should return undefined when there is not a instance with specific id', async () => {
      await createTestCollectionEntites()

      const entitiesOnTheRepository = await testRepository.get('invalidId')

      expect(entitiesOnTheRepository).toBe(undefined)
    })

    it('should return entities by ids when ids are passed as array', async () => {
      const entities = await createTestCollectionEntites()

      const entitiesOnTheRepository = await testRepository.get([
        entities[0].id,
        entities[1].id,
      ])

      expect(entitiesOnTheRepository.length).toBe(2)

      expect(entitiesOnTheRepository).toEqual(expect.arrayContaining([
        entities[0],
        entities[1],
      ]))
    })

    it('should return entities by ids even when invalid ids are passed in array', async () => {
      const entities = await createTestCollectionEntites()

      const entitiesOnTheRepository = await testRepository.get([
        'invalidId',
        entities[0].id,
        entities[1].id,
      ])

      expect(entitiesOnTheRepository.length).toBe(2)

      expect(entitiesOnTheRepository).toEqual(expect.arrayContaining([
        entities[0],
        entities[1],
      ]))
    })

    it('should return empty array when no entities matching id are found', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get([
        'someInvalidId',
        'anotherInvalidId',
      ])

      expect(result.length).toBe(0)

      expect(Array.isArray(result)).toBeTruthy()
    })

    it('should return entities by dateProperty when date is passed', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        dateProperty: new Date(30)
      })

      expect(result.length).toBe(2)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return entities by dateProperty when dates are passed as array', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        dateProperty: [
          new Date(20),
          new Date(30),
        ]
      })

      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return entities with dateProperty beginning on start key when range only constains start key', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        dateProperty: {
          start: new Date(30)
        }
      })
      
      expect(result.length).toBe(4)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'EEE',
          numberProperty: 456,
          dateProperty: new Date(40),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'FFF',
          numberProperty: 567,
          dateProperty: new Date(50),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return entities with dateProperty up to end key when range only constains end key', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        dateProperty: {
          end: new Date(30)
        }
      })
      
      expect(result.length).toBe(4)

      expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
      }),
      expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
      }),
      expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
      }),
      expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
      }),
      ]))
    })
    
    it('should return entities with dateProperty between start and end dates when range contains both start and end keys', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        dateProperty: {
          start: new Date(20),
          end: new Date(30),
        }
      })
      
      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return empty array when no entities matching dateProperty are found', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        dateProperty: new Date(0)
      })

      expect(result.length).toBe(0)

      expect(Array.isArray(result)).toBeTruthy()
    })

    it('should return entities by numberProperty when number is passed', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        numberProperty: 234
      })

      expect(result.length).toBe(2)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
      ]))
    })

    it('should return entities by numberProperty when numbers are passed as array', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        numberProperty: [
          123,
          234,
        ]
      })

      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
      ]))
    })

    it('should return entities with numberProperty beggining on start key when range only constains start key', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        numberProperty: {
          start: 234
        }
      })

      expect(result.length).toBe(5)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'EEE',
          numberProperty: 456,
          dateProperty: new Date(40),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'FFF',
          numberProperty: 567,
          dateProperty: new Date(50),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return entities with numberProperty up to end key when range only contains end key', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        numberProperty: {
          end: 234
        }
      })
      
      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
      ]))
    })

    it('should return entities with numberProperty between start and end numbers when range contains both start and end keys', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        numberProperty: {
          start: 234,
          end: 345,
        }
      })
      
      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return empty array when no entities matching numberProperty are found', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        numberProperty: 1
      })

      expect(result.length).toBe(0)

      expect(Array.isArray(result)).toBeTruthy()
    })

    it('should return entities by stringProperty when string is passed', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        stringProperty: 'AAA'
      })

      expect(result.length).toBe(2)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
      ]))
    })

    it('should return entities by stringProperty when strings are passed as array', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        stringProperty: [
          'AAA',
          'EEE',
        ]
      })

      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'EEE',
          numberProperty: 456,
          dateProperty: new Date(40),
          booleanProperty: true,
        }),
      ]))
    })

    it('should return empty array when no entities matching stringProperty are found', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        stringProperty: 'ZZZ'
      })

      expect(result.length).toBe(0)

      expect(Array.isArray(result)).toBeTruthy()
    })

    it('should return entities matching booleanProperty when it is true', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        booleanProperty: true
      })

      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 123,
          dateProperty: new Date(10),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'BBB',
          numberProperty: 234,
          dateProperty: new Date(30),
          booleanProperty: true,
        }),
        expect.objectContaining({
          stringProperty: 'EEE',
          numberProperty: 456,
          dateProperty: new Date(40),
          booleanProperty: true,
        }),
      ]))
    })

    it('should return entities matching booleanProperty when it is false', async () => {
      await createTestCollectionEntites()

      const result = await testRepository.get({
        booleanProperty: false
      })

      expect(result.length).toBe(3)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          stringProperty: 'AAA',
          numberProperty: 234,
          dateProperty: new Date(20),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'CCC',
          numberProperty: 345,
          dateProperty: new Date(30),
          booleanProperty: false,
        }),
        expect.objectContaining({
          stringProperty: 'FFF',
          numberProperty: 567,
          dateProperty: new Date(50),
          booleanProperty: false,
        }),
      ]))
    })
  })
})
