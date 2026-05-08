import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Dashboard() {

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [selectedProject, setSelectedProject] = useState('')

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const [search, setSearch] = useState('')

  const logout = () => {
    localStorage.clear()
    alert('Successfully Logged Out ✅')
    navigate('/')
  }

  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem('token')

      const res = await API.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTasks(res.data)

    } catch (error) {

      console.log(error)

    }

  }

  const fetchProjects = async () => {

    try {

      const token = localStorage.getItem('token')

      const res = await API.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (Array.isArray(res.data)) {
        setProjects(res.data)
      } else {
        setProjects([])
      }

    } catch (error) {

      console.log(error)
      setProjects([])

    }

  }

  useEffect(() => {

    fetchTasks()
    fetchProjects()

  }, [])

  const myTasks =
    user?.role === 'admin'
      ? tasks
      : tasks.filter(
          t => t.assignedTo === user?.name
        )

  const filteredTasks = myTasks.filter(task =>
    (task.title || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const overdueTasks = filteredTasks.filter(
    task =>
      task.status !== 'completed' &&
      new Date(task.dueDate) < new Date()
  )

  const addTask = async () => {

    if (
      !newTask ||
      !dueDate ||
      !assignedTo ||
      !selectedProject
    ) {
      alert('Please fill all fields')
      return
    }

    try {

      const token = localStorage.getItem('token')

      await API.post(
        '/tasks',
        {
          title: newTask,
          dueDate,
          assignedTo,
          project: selectedProject,
          status: 'pending'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setNewTask('')
      setDueDate('')
      setAssignedTo('')
      setSelectedProject('')

      fetchTasks()

      alert('Task Added Successfully ✅')

    } catch (error) {

      console.log(error)

      alert(
        error?.response?.data?.message ||
        'Error creating task'
      )

    }

  }

  const createProject = async () => {

    if (!projectName || !projectDescription) {
      alert('Please fill all project fields')
      return
    }

    try {

      const token = localStorage.getItem('token')

      await API.post(
        '/projects',
        {
          name: projectName,
          description: projectDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Project Created Successfully ✅')

      setProjectName('')
      setProjectDescription('')

      fetchProjects()

    } catch (error) {

      console.log(error)

      alert(
        error?.response?.data?.message ||
        'Error creating project'
      )

    }

  }

  const toggleStatus = async (task) => {

    try {

      const token = localStorage.getItem('token')

      const updated =
        task.status === 'completed'
          ? 'pending'
          : 'completed'

      await API.put(
        `/tasks/${task._id}`,
        {
          status: updated
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchTasks()

    } catch (error) {

      console.log(error)

    }

  }

  const totalTasks = filteredTasks.length

  const completedTasks = filteredTasks.filter(
    task => task.status === 'completed'
  ).length

  const pendingTasks = filteredTasks.filter(
    task => task.status !== 'completed'
  ).length

  return (

    <div style={{
      background: '#f1f5f9',
      minHeight: '100vh'
    }}>

      <div style={{
        background: '#0f172a',
        padding: '18px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        <h1 style={{
          margin: 0,
          color: '#ffffff',
          fontSize: '34px',
          fontWeight: 'bold'
        }}>
          🚀 Task Manager
        </h1>

        <button
          onClick={logout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>

      </div>

      <div style={{ padding: '30px' }}>

        {/* ================= STATS ================= */}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: '20px',
          marginBottom: '25px'
        }}>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3>Total Tasks</h3>
            <h1>{totalTasks}</h1>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3>Completed</h3>
            <h1 style={{ color: '#16a34a' }}>
              {completedTasks}
            </h1>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3>Pending</h3>
            <h1 style={{ color: '#f59e0b' }}>
              {pendingTasks}
            </h1>
          </div>

        </div>

        {/* ================= CREATE PROJECT ================= */}

        {user?.role === 'admin' && (

          <div style={{
            background: 'white',
            padding: 25,
            borderRadius: 12,
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>

            <h2 style={{ marginBottom: 20 }}>
              📁 Create Project
            </h2>

            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 15,
                borderRadius: 8,
                border: '1px solid #d1d5db'
              }}
            />

            <textarea
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(e.target.value)
              }
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 15,
                borderRadius: 8,
                border: '1px solid #d1d5db'
              }}
            />

            <button
              onClick={createProject}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '12px 22px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Add Project
            </button>

          </div>

        )}

        {/* ================= PROJECTS ================= */}

        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>

          <h2 style={{
            marginBottom: 20
          }}>
            📁 Projects
          </h2>

          {projects.length === 0 ? (

            <p>No Projects Found</p>

          ) : (

            projects.map(project => (

              <div
                key={project._id}
                style={{
                  padding: 12,
                  borderBottom: '1px solid #e5e7eb'
                }}
              >

                <h3 style={{ margin: 0 }}>
                  {project.name}
                </h3>

                <p style={{
                  marginTop: 5,
                  color: '#6b7280'
                }}>
                  {project.description}
                </p>

              </div>

            ))

          )}

        </div>

        {/* ================= ADD TASK ================= */}

        {user?.role === 'admin' && (

          <div style={{
            background: 'white',
            padding: 25,
            borderRadius: 12,
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>

            <h2 style={{ marginBottom: 20 }}>
              ✅ Create Task
            </h2>

            <input
              type="text"
              placeholder="Task Name"
              value={newTask}
              onChange={e =>
                setNewTask(e.target.value)
              }
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 15,
                borderRadius: 8,
                border: '1px solid #d1d5db'
              }}
            />

            <input
              type="date"
              value={dueDate}
              onChange={e =>
                setDueDate(e.target.value)
              }
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 15,
                borderRadius: 8,
                border: '1px solid #d1d5db'
              }}
            />

            <input
              type="text"
              placeholder="Assign To"
              value={assignedTo}
              onChange={e =>
                setAssignedTo(e.target.value)
              }
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 15,
                borderRadius: 8,
                border: '1px solid #d1d5db'
              }}
            />

            <select
              value={selectedProject}
              onChange={e =>
                setSelectedProject(e.target.value)
              }
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 15,
                borderRadius: 8,
                border: '1px solid #d1d5db'
              }}
            >

              <option value="">
                Select Project
              </option>

              {projects.map(project => (

                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.name}
                </option>

              ))}

            </select>

            <button
              onClick={addTask}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '12px 22px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Add Task
            </button>

          </div>

        )}

        {/* ================= SEARCH ================= */}

        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 8,
            border: '1px solid #d1d5db',
            marginBottom: 20
          }}
        />

        {/* ================= OVERDUE TASKS ================= */}

        <div style={{
          background: '#fee2e2',
          padding: 20,
          borderRadius: 12,
          marginBottom: 20
        }}>

          <h2 style={{
            color: '#b91c1c'
          }}>
            ⚠ Overdue Tasks
          </h2>

          {overdueTasks.length === 0 ? (

            <p>No Overdue Tasks</p>

          ) : (

            overdueTasks.map(task => (

              <div
                key={task._id}
                style={{
                  padding: 10,
                  marginTop: 10,
                  background: 'white',
                  borderRadius: 8
                }}
              >

                <strong>{task.title}</strong>

                <p>
                  Due:
                  {' '}
                  {task.dueDate?.substring(0, 10)}
                </p>

              </div>

            ))

          )}

        </div>

        {/* ================= TASKS ================= */}

        {filteredTasks.length === 0 ? (

          <p>No Tasks Found</p>

        ) : (

          filteredTasks.map(task => (

            <div
              key={task._id}
              style={{
                background: 'white',
                padding: 20,
                borderRadius: 12,
                marginBottom: 15,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >

              <h3 style={{
                margin: 0,
                color:
                  task.status === 'completed'
                    ? '#16a34a'
                    : '#111827',

                textDecoration:
                  task.status === 'completed'
                    ? 'line-through'
                    : 'none'
              }}>
                {task.title}
              </h3>

              <p>
                Assigned To:
                {' '}
                {task.assignedTo}
              </p>

              <p>
                Due Date:
                {' '}
                {task.dueDate?.substring(0, 10)}
              </p>

              <p>
                Project:
                {' '}
                {task.project?.name ||
                  'Not Assigned'}
              </p>

              <button
                onClick={() =>
                  toggleStatus(task)
                }
                style={{
                  background:
                    task.status === 'completed'
                      ? '#16a34a'
                      : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {task.status}
              </button>

            </div>

          ))

        )}

      </div>

    </div>

  )

}

export default Dashboard