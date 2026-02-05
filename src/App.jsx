import { useState, useEffect } from 'react'
import './App.css'
import { getPosts, createPost, updatePost, deletePost } from './api'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostBody, setNewPostBody] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')


  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    const result = await getPosts()
    
    if (result.success) {

      const formattedPosts = result.data.slice(0, 10).map(post => ({
        id: post.id,
        title: post.title,
        description: post.body,
        completed: false,
      }))
      setPosts(formattedPosts)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }


  const addPost = async () => {
    if (!newPostTitle.trim()) {
      setError('Пожалуйста, введите название поста')
      return
    }

    setLoading(true)
    setError(null)
    
    const result = await createPost({
      title: newPostTitle,
      body: newPostBody,
    })

    if (result.success) {

      const newPost = {
        id: result.data.id,
        title: result.data.title,
        description: result.data.body,
        completed: false,
      }
      setPosts([newPost, ...posts])
      setNewPostTitle('')
      setNewPostBody('')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  
  const handleUpdatePost = async () => {
    if (!editTitle.trim()) {
      setError('Пожалуйста, введите название поста')
      return
    }

    setLoading(true)
    setError(null)

    const result = await updatePost(editingPost.id, {
      title: editTitle,
      body: editBody,
    })

    if (result.success) {
      setPosts(posts.map(post =>
        post.id === editingPost.id
          ? {
              id: result.data.id,
              title: result.data.title,
              description: result.data.body,
              completed: post.completed,
            }
          : post
      ))
      setEditingPost(null)
      setEditTitle('')
      setEditBody('')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }


  const handleDeletePost = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return
    }

    setLoading(true)
    setError(null)

    const result = await deletePost(id)

    if (result.success) {
      setPosts(posts.filter(post => post.id !== id))
    } else {
      setError(result.error)
    }
    setLoading(false)
  }


  const startEditing = (post) => {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditBody(post.description)
  }

 
  const cancelEditing = () => {
    setEditingPost(null)
    setEditTitle('')
    setEditBody('')
  }

  
  const togglePost = (id) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, completed: !post.completed } : post
    ))
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="title">🧪 Песочница для лабораторных работ</h1>
          <p className="subtitle">Работа с HTTP-методами и интеграция запросов в React-проект</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button className="error-close" onClick={() => setError(null)}>×</button>
            </div>
          )}

          
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Загрузка...</p>
            </div>
          )}

          
          <section className="add-lab-section">
            <h2>Добавить новый пост (POST запрос)</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Название поста"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="input"
                onKeyPress={(e) => e.key === 'Enter' && addPost()}
                disabled={loading}
              />
              <textarea
                placeholder="Содержание поста (необязательно)"
                value={newPostBody}
                onChange={(e) => setNewPostBody(e.target.value)}
                className="textarea"
                rows="3"
                disabled={loading}
              />
              <button 
                onClick={addPost} 
                className="btn btn-primary"
                disabled={loading}
              >
                ➕ Добавить пост
              </button>
            </div>
          </section>

          
          <section className="refresh-section">
            <button 
              onClick={loadPosts} 
              className="btn btn-secondary"
              disabled={loading}
            >
              🔄 Обновить список (GET запрос)
            </button>
          </section>

          
          <section className="labs-section">
            <h2>Список постов (загружено через GET запрос)</h2>
            {posts.length === 0 && !loading ? (
              <div className="empty-state">
                <p>Пока нет постов. Добавьте первый или обновите список!</p>
              </div>
            ) : (
              <div className="labs-grid">
                {posts.map(post => (
                  <div key={post.id} className={`lab-card ${post.completed ? 'completed' : ''}`}>
                    {editingPost?.id === post.id ? (
                      
                      <div className="edit-form">
                        <h3>Редактирование поста (PUT запрос)</h3>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="input"
                          placeholder="Название"
                          disabled={loading}
                        />
                        <textarea
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          className="textarea"
                          rows="3"
                          placeholder="Содержание"
                          disabled={loading}
                        />
                        <div className="edit-actions">
                          <button
                            onClick={handleUpdatePost}
                            className="btn btn-success"
                            disabled={loading}
                          >
                            ✓ Сохранить
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn btn-cancel"
                            disabled={loading}
                          >
                            ✕ Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="lab-card-header">
                          <h3>{post.title}</h3>
                          <div className="lab-actions">
                            <button
                              onClick={() => togglePost(post.id)}
                              className={`btn-icon ${post.completed ? 'completed' : ''}`}
                              title={post.completed ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
                            >
                              {post.completed ? '✓' : '○'}
                            </button>
                            <button
                              onClick={() => startEditing(post)}
                              className="btn-icon edit"
                              title="Редактировать"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="btn-icon delete"
                              title="Удалить (DELETE запрос)"
                              disabled={loading}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <p className="lab-description">{post.description}</p>
                        <div className="lab-status">
                          <span className={`status-badge ${post.completed ? 'completed' : 'pending'}`}>
                            {post.completed ? 'Выполнено' : 'В процессе'}
                          </span>
                          <span className="post-id">ID: {post.id}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          
          <section className="stats-section">
            <div className="stats">
              <div className="stat-card">
                <div className="stat-value">{posts.length}</div>
                <div className="stat-label">Всего постов</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{posts.filter(p => p.completed).length}</div>
                <div className="stat-label">Выполнено</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{posts.filter(p => !p.completed).length}</div>
                <div className="stat-label">В процессе</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Песочница для лабораторных работ © 2026 | API: JSONPlaceholder</p>
        </div>
      </footer>
    </div>
  )
}

export default App
