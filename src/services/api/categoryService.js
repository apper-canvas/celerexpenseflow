import mockData from '@/services/mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let categories = [...mockData]

const categoryService = {
  async getAll() {
    await delay(200)
    return [...categories]
  },

  async getById(id) {
    await delay(150)
    const category = categories.find(item => item.Id === parseInt(id, 10))
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  },

  async create(category) {
    await delay(300)
    const newCategory = {
      ...category,
      Id: categories.length > 0 ? Math.max(...categories.map(c => c.Id)) + 1 : 1
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, data) {
    await delay(250)
    const index = categories.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const updatedCategory = {
      ...categories[index],
      ...data,
      Id: categories[index].Id // Prevent Id modification
    }
    categories[index] = updatedCategory
    return { ...updatedCategory }
  },

  async delete(id) {
    await delay(200)
    const index = categories.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const deletedCategory = { ...categories[index] }
    categories.splice(index, 1)
    return deletedCategory
  }
}

export default categoryService