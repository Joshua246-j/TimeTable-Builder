"""Campus domain routes — students, courses, enrollments.

In-memory stores back the demo endpoints. Swap them for the SQLAlchemy
`get_session` dependency (see app.core.database) to persist to RDS.
"""

from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.schemas import (
    Course,
    CourseCreate,
    Enrollment,
    EnrollmentCreate,
    Student,
    StudentCreate,
)

router = APIRouter(tags=["campus"])

_students: dict[str, Student] = {}
_courses: dict[str, Course] = {}
_enrollments: dict[str, Enrollment] = {}


@router.get("/students", response_model=list[Student])
async def list_students() -> list[Student]:
    return list(_students.values())


@router.post("/students", response_model=Student, status_code=201)
async def create_student(payload: StudentCreate) -> Student:
    student = Student(id=str(uuid4()), **payload.model_dump())
    _students[student.id] = student
    return student


@router.get("/courses", response_model=list[Course])
async def list_courses() -> list[Course]:
    return list(_courses.values())


@router.post("/courses", response_model=Course, status_code=201)
async def create_course(payload: CourseCreate) -> Course:
    course = Course(id=str(uuid4()), **payload.model_dump())
    _courses[course.id] = course
    return course


@router.post("/enrollments", response_model=Enrollment, status_code=201)
async def enroll(payload: EnrollmentCreate) -> Enrollment:
    if payload.student_id not in _students:
        raise HTTPException(status_code=404, detail="student not found")
    if payload.course_id not in _courses:
        raise HTTPException(status_code=404, detail="course not found")
    enrollment = Enrollment(id=str(uuid4()), **payload.model_dump())
    _enrollments[enrollment.id] = enrollment
    return enrollment


@router.get("/enrollments", response_model=list[Enrollment])
async def list_enrollments() -> list[Enrollment]:
    return list(_enrollments.values())
