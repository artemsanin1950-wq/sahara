import axios from 'axios'


const API_BASE_URL = 'https://jsonplaceholder.typicode.com'


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд таймаут
})


const russianPosts = [
  {
    id: 1,
    title: 'Введение в React',
    body: 'React - это популярная библиотека JavaScript для создания пользовательских интерфейсов. Она позволяет создавать интерактивные веб-приложения с компонентной архитектурой.',
    userId: 1
  },
  {
    id: 2,
    title: 'Работа с HTTP запросами',
    body: 'HTTP запросы позволяют взаимодействовать с сервером. Основные методы: GET для получения данных, POST для создания, PUT для обновления и DELETE для удаления.',
    userId: 1
  },
  {
    id: 3,
    title: 'Использование Axios',
    body: 'Axios - это популярная библиотека для выполнения HTTP запросов. Она предоставляет простой API и поддерживает промисы, что делает работу с асинхронными запросами удобной.',
    userId: 1
  },
  {
    id: 4,
    title: 'Обработка ошибок в React',
    body: 'Правильная обработка ошибок важна для создания надежных приложений. Необходимо обрабатывать ошибки сети, сервера и валидации данных.',
    userId: 1
  },
  {
    id: 5,
    title: 'Состояние компонентов',
    body: 'Состояние (state) позволяет компонентам React хранить и обновлять данные. Используйте useState для управления локальным состоянием компонента.',
    userId: 1
  },
  {
    id: 6,
    title: 'Эффекты и жизненный цикл',
    body: 'useEffect позволяет выполнять побочные эффекты в функциональных компонентах. Это аналог componentDidMount, componentDidUpdate и componentWillUnmount в классах.',
    userId: 1
  },
  {
    id: 7,
    title: 'Работа с формами',
    body: 'Формы в React требуют управления состоянием полей ввода. Используйте контролируемые компоненты для полного контроля над значениями формы.',
    userId: 1
  },
  {
    id: 8,
    title: 'Стилизация компонентов',
    body: 'React позволяет использовать CSS различными способами: обычные CSS файлы, CSS модули, styled-components или inline стили. Выбор зависит от требований проекта.',
    userId: 1
  },
  {
    id: 9,
    title: 'Роутинг в React',
    body: 'React Router - это стандартная библиотека для навигации в React приложениях. Она позволяет создавать одностраничные приложения с множеством страниц.',
    userId: 1
  },
  {
    id: 10,
    title: 'Оптимизация производительности',
    body: 'Для оптимизации React приложений используйте React.memo, useMemo, useCallback и другие техники. Это поможет уменьшить количество ненужных перерисовок.',
    userId: 1
  }
]


export const getPosts = async () => {
  try {
    
    await new Promise(resolve => setTimeout(resolve, 500))
    

    return {
      success: true,
      data: russianPosts,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Ошибка при получении данных',
    }
  }
}


export const getPost = async (id) => {
  try {

    await new Promise(resolve => setTimeout(resolve, 300))
    

    const post = russianPosts.find(p => p.id === id)
    if (post) {
      return {
        success: true,
        data: post,
      }
    } else {

      const response = await api.get(`/posts/${id}`)
      return {
        success: true,
        data: response.data,
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Ошибка при получении поста',
    }
  }
}


export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', {
      title: postData.title,
      body: postData.body || postData.description,
      userId: 1, 
    })
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Ошибка при создании поста',
    }
  }
}


export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/posts/${id}`, {
      id: id,
      title: postData.title,
      body: postData.body || postData.description,
      userId: 1,
    })
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Ошибка при обновлении поста',
    }
  }
}


export const patchPost = async (id, postData) => {
  try {
    const response = await api.patch(`/posts/${id}`, postData)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Ошибка при обновлении поста',
    }
  }
}


export const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`)
    return {
      success: true,
      message: 'Пост успешно удален',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Ошибка при удалении поста',
    }
  }
}

export default api

