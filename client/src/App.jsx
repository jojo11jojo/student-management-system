import { useEffect, useState } from "react";
import "./App.css";
import Register from "./auth/Register";
import Login from "./auth/Login";

function App() {
  const [showRegister, setShowRegister] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);
const [showProfile, setShowProfile] = useState(false);
const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
const [departmentFilter, setDepartmentFilter] = useState("");

  // Fetch all students
  const fetchStudents = () => {
  if (!token) {
    return;
  }

  fetch("https://student-management-api-7rcr.onrender.com/api/students", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      return response.json();
    })
    .then((data) => {
      setStudents(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setError("Unable to load students.");
      setLoading(false);
    });
};

  // Load students when page opens
 useEffect(() => {
  if (isLoggedIn && token) {
    fetchStudents();
  }
}, [isLoggedIn, token]);
  // Dashboard statistics
const totalStudents = students.length;

const totalCourses = new Set(
  students.map((student) => student.course)
).size;

const totalDepartments = new Set(
  students.map((student) => student.department)
).size;

// Students grouped by course
const courseStats = students.reduce((acc, student) => {
  const course = student.course;

  acc[course] = (acc[course] || 0) + 1;

  return acc;
}, {});

// Students grouped by department
const departmentStats = students.reduce((acc, student) => {
  const department = student.department;

  acc[department] = (acc[department] || 0) + 1;

  return acc;
}, {});
  // Search students by name or email
// Search and filter students
const filteredStudents = students.filter((student) => {
  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    student.name.toLowerCase().includes(search) ||
    student.email.toLowerCase().includes(search);

  const matchesCourse =
    courseFilter === "" || student.course === courseFilter;

  const matchesDepartment =
    departmentFilter === "" ||
    student.department === departmentFilter;

  return (
    matchesSearch &&
    matchesCourse &&
    matchesDepartment
  );
});
// Get unique courses
const courses = [
  ...new Set(students.map((student) => student.course)),
];

// Get unique departments
const departments = [
  ...new Set(students.map((student) => student.department)),
];

  // Handle input changes
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Add or Update student
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    // Form validation
if (formData.name.trim().length < 2) {
  setError("Name must contain at least 2 characters.");
  return;
}

if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
  setError("Name can contain only letters and spaces.");
  return;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
  setError("Please enter a valid email address.");
  return;
}

if (!/^[0-9]{10}$/.test(formData.phone)) {
  setError("Phone number must contain exactly 10 digits.");
  return;
}

if (formData.course.trim() === "") {
  setError("Course is required.");
  return;
}

if (formData.department.trim() === "") {
  setError("Department is required.");
  return;
}

    try {
      let response;

      if (editingId) {
        // UPDATE student
       response = await fetch(
 `https://student-management-api-7rcr.onrender.com/api/students/${editingId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  }
);
      } else {
        // ADD student
       response = await fetch(
 "https://student-management-api-7rcr.onrender.com/api/students",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  }
);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      if (editingId) {
        setMessage("Student updated successfully!");
      } else {
        setMessage("Student added successfully!");
      }

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        department: "",
      });

      // Exit edit mode
      setEditingId(null);

      // Refresh student list
      fetchStudents();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // Start editing a student
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      department: student.department,
    });

    setMessage("");
    setError("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      department: "",
    });

    setMessage("");
    setError("");
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
     const response = await fetch(
  `https://student-management-api-7rcr.onrender.com/api/students/${id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete student"
        );
      }

      setMessage("Student deleted successfully!");

      // Refresh student list
      fetchStudents();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };
 const handleLogout = () => {
  setIsLoggedIn(false);
  setUser(null);
  setToken(null);
  setShowProfile(false);
  setStudents([]);
};
if (!isLoggedIn) {
  if (showRegister) {
    return (
      <Register
        onLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
   <Login
  onLogin={(data) => {
    setUser(data.user);
    setToken(data.token);
    setIsLoggedIn(true);
  }}
  onRegister={() => setShowRegister(true)}
/>
  );
}
 return (
  <div className="app">

    <div className="dashboard-header">
      <h1>Student Management System</h1>

      <div className="user-actions">

        <button
          type="button"
          onClick={() => setShowProfile(!showProfile)}
        >
          👤 Profile
        </button>

        <button
          type="button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>
    </div>

    {showProfile && user && (
      <div className="profile-card">
        <h2>My Profile</h2>

        <p>
          <strong>Name:</strong>{" "}
          {user.name || user.username || "User"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.email || "Not available"}
        </p>
      </div>
    )}
      {/* Dashboard Statistics */}
<div className="stats-container">

  <div className="stat-card">
    <h3>Total Students</h3>
    <p>{totalStudents}</p>
  </div>

  <div className="stat-card">
    <h3>Total Courses</h3>
    <p>{totalCourses}</p>
  </div>

  <div className="stat-card">
    <h3>Total Departments</h3>
    <p>{totalDepartments}</p>
  </div>

</div>
<div className="dashboard-details">
{/* Students by Course */}
<div className="course-stat-card">

  <h2>Students by Course</h2>

  {Object.entries(courseStats).map(([course, count]) => (
    <div className="course-stat-row" key={course}>
      <span>{course}</span>
      <strong>{count}</strong>
    </div>
  ))}

</div>
{/* Students by Department */}
<div className="department-stat-card">

  <h2>Students by Department</h2>

  {Object.entries(departmentStats).map(
    ([department, count]) => (
      <div
        className="department-stat-row"
        key={department}
      >

        <div className="department-stat-info">
          <span>{department}</span>
          <strong>{count}</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(count / totalStudents) * 100}%`,
            }}
          ></div>
        </div>

      </div>
    )
  )}

</div>
</div>

      {/* Add / Edit Student Form */}
      <div className="form-container">
        <h2>
          {editingId ? "Edit Student" : "Add Student"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
           placeholder="Enter student name"
maxLength="50"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
  type="tel"
  name="phone"
  placeholder="Enter 10-digit phone number"
  value={formData.phone}
  onChange={handleChange}
  maxLength="10"
  required
/>

          <input
            type="text"
            name="course"
            placeholder="Enter course"
            value={formData.course}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Enter department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Student" : "Add Student"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </form>

        {message && (
          <p className="success">{message}</p>
        )}

        {error && (
          <p className="error">{error}</p>
        )}
      </div>

      {/* Student List */}
<h2>Student List</h2>
 <p className="result-count">
  Showing {filteredStudents.length} of {students.length} students
</p>
<div className="filter-container">

  <input
    type="text"
    placeholder="Search by name or email..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />

  <select
    value={courseFilter}
    onChange={(event) => setCourseFilter(event.target.value)}
  >
    <option value="">All Courses</option>

    {courses.map((course) => (
      <option key={course} value={course}>
        {course}
      </option>
    ))}
  </select>

  <select
    value={departmentFilter}
    onChange={(event) =>
      setDepartmentFilter(event.target.value)
    }
  >
    <option value="">All Departments</option>

    {departments.map((department) => (
      <option key={department} value={department}>
        {department}
      </option>
    ))}
  </select>

  {/* Clear Filters Button */}
  <button
    type="button"
    className="clear-filter"
    onClick={() => {
      setSearchTerm("");
      setCourseFilter("");
      setDepartmentFilter("");
    }}
  >
    Clear Filters
  </button>
 

</div>
{loading && <p>Loading students...</p>}

{!loading && filteredStudents.length === 0 && (
  <p>No students found.</p>
)}

{!loading && filteredStudents.length > 0 && (
  <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
  {filteredStudents.map((student) => (
    <tr key={student._id}>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td>{student.phone}</td>
      <td>{student.course}</td>
      <td>{student.department}</td>

      <td>
  <button
    type="button"
    onClick={() => handleEdit(student)}
  >
    Edit
  </button>

  <button
    type="button"
    className="delete-btn"
    onClick={() => handleDelete(student._id)}
  >
    Delete
  </button>
</td>
    </tr>
  ))}
</tbody>
        </table>
      )}
    </div>
  );
}

export default App;