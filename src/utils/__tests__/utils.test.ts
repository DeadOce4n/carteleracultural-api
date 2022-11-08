import dayjs from 'dayjs'
import { Types } from 'mongoose'
import {
  generateRandomToken,
  generateFilename,
  buildFilters,
  parseSortOperator
} from '../func'

const { ObjectId } = Types

describe('test utilitary functions', () => {
  it('should generate an 8 character verification code', async () => {
    const token = await generateRandomToken()
    expect(token).toBeDefined()
    expect(token).toHaveLength(8)
  })

  it('should generate a unique filename', async () => {
    const [name, extension] = 'file.jpg'.split('.')
    const generatedFilename = generateFilename(name, extension)
    expect(generatedFilename).toContain(name)
    expect(generatedFilename).toContain(extension)
    expect(generatedFilename).toHaveLength(`${name}.${extension}`.length + 17)
  })

  it('should create a MongoDB filtering query', () => {
    const queryObject = {
      title: 'Test Event 1',
      createdBy: new ObjectId(),
      published: false,
      categories: [
        new ObjectId(),
        new ObjectId()
      ],
      start: {
        lower: new Date(),
        upper: new Date()
      },
      role: ['super', 'admin'],
      showDeleted: false
    }

    const filterObject = buildFilters(queryObject)
    expect(filterObject).toEqual({
      title: { $regex: queryObject.title, $options: 'i' },
      createdBy: queryObject.createdBy,
      published: queryObject.published,
      categories: { $all: queryObject.categories },
      start: {
        $gte: dayjs(queryObject.start.lower).startOf('D').toDate(),
        $lte: dayjs(queryObject.start.upper).endOf('D').toDate()
      },
      active: true,
      role: { $in: queryObject.role }
    })
  })

  it('should correctly generate mongo sort query', () => {
    const ascSortBy = 'name'
    const desSortBy = '-name'

    const ascQueryObj = parseSortOperator(ascSortBy)
    const desQueryObj = parseSortOperator(desSortBy)

    expect(ascQueryObj).toEqual({ name: 1 })
    expect(desQueryObj).toEqual({ name: -1 })
  })
})
