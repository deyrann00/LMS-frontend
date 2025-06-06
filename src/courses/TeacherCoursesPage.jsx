import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import "../style/style.css";

function TeacherCoursesPage() {
    const user = useSelector(state => state?.user);
    const [teachingCourses, setTeachingCourses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned || user.role === 'BANNED') {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:8080/api/teachers/${user.id}/courses`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch courses');
                    return res.json();
                })
                .then(data => setTeachingCourses(data))
                .catch(err => setError(err.message));
        }
    }, [user]);

    if (!user || user.role.toUpperCase() !== 'TEACHER') {
        return <p>Access denied</p>;
    }

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="welcome-card">
                    <h1 className="text-2xl font-bold text-center mb-4">My Teaching Courses</h1>
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {teachingCourses.length === 0 ? (
                    <p className="text-center">You are not teaching any courses yet.</p>
                ) : (
                    <div className="course-grid">
                        {teachingCourses.map(course => (
                            <div key={course.id} className="course-card">
                                {course.imageUrl && (
                                    <img
                                        src={`http://localhost:8080${course.imageUrl}`}
                                        alt={`${course.title} image`}
                                        className="course-image"
                                    />
                                )}
                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                <p className="text-sm text-gray-700">{course.description}</p>
                                <div className="card-button-group">
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        View Course
                                    </button>
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/courses/${course.id}/edit`)}
                                    >
                                        Edit Course
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherCoursesPage;